# DSAR Endpoints — Next.js + Better Auth

## GET /api/me

Resposta imediata em formato simplificado (Art. 19, I).

```ts
// app/api/me/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  const [user, consents, activeProcessing] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.consentRecord.findMany({
      where: { subjectId: userId, status: "GRANTED" }
    }),
    db.processingActivity.findMany({
      where: { subjects: { has: userId } }
    })
  ]);

  await logDsar(userId, "DSAR_RECEIVED", "confirmation_simplified");

  return Response.json({
    confirmation: "Yes, we process your personal data.",
    activities: activeProcessing.map(a => ({
      name: a.name,
      purpose: a.purpose,
      legalBasis: a.legalBasis
    })),
    consents: consents.map(c => ({ purpose: c.purpose, grantedAt: c.grantedAt })),
    encarregado: {
      name: process.env.DPO_NAME,
      email: process.env.DPO_EMAIL
    },
    yourRightsUrl: "/privacy/your-rights"
  });
}
```

## GET /api/me/export

Acesso completo + portabilidade. Job assíncrono se o volume for grande.

```ts
// app/api/me/export/route.ts
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json"; // json | csv | portable

  // Para volumes pequenos: sync
  // Para volumes grandes: enfileirar e responder com URL de download em ~5min
  const bundle = await buildUserDataBundle(session.user.id, format);

  await logDsar(session.user.id, "DSAR_FULFILLED", "export", {
    bundleHash: sha256(bundle)
  });

  return new Response(bundle, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="my-data-${Date.now()}.json"`
    }
  });
}
```

## PATCH /api/me/profile

Correção (Art. 18, III).

```ts
export async function PATCH(req: Request) {
  const session = await requireAuth(req);
  const body = await req.json();

  // Whitelist de campos editáveis pelo titular
  const allowed = ["fullName", "phone", "addressLine1", "city"];
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );

  const before = await db.user.findUnique({ where: { id: session.user.id } });
  const after = await db.user.update({
    where: { id: session.user.id },
    data: updates
  });

  await logDsar(session.user.id, "DSAR_FULFILLED", "correction", {
    fields: Object.keys(updates),
    beforeHash: sha256(before),
    afterHash: sha256(after)
  });

  return Response.json({ updated: Object.keys(updates) });
}
```

## POST /api/me/erasure

Eliminação (Art. 18, VI) com checagem de retenção legal.

```ts
export async function POST(req: Request) {
  const session = await requireAuth(req);
  const userId = session.user.id;
  const { confirmation } = await req.json();

  if (confirmation !== "EXCLUIR MINHA CONTA") {
    return new Response("Bad confirmation", { status: 400 });
  }

  // 1. Verificar retenções legais obrigatórias
  const retentions = await checkLegalRetentions(userId);
  // ex: ["fiscal:5y", "trabalhista:5y"]

  if (retentions.length > 0) {
    // Bloqueio lógico + anonimização parcial
    await db.user.update({
      where: { id: userId },
      data: {
        email: `anonymized-${userId}@deleted.local`,
        fullName: "Usuário removido",
        cpf: null, // crypto-shred
        phone: null,
        deletedAt: new Date(),
        retentionUntil: maxDate(retentions)
      }
    });
  } else {
    // Hard delete + cascata
    await hardDeleteUserCascade(userId);
  }

  // 2. Propagar a operadores
  await propagateErasure(userId);

  // 3. Revogar todas as sessões
  await auth.api.revokeAllSessions({ headers: req.headers });

  await logDsar(userId, "DSAR_FULFILLED", "erasure", {
    type: retentions.length > 0 ? "blocked_then_anonymized" : "hard_deleted",
    retentions
  });

  return Response.json({
    status: "ok",
    type: retentions.length > 0 ? "anonymized" : "deleted",
    retentions
  });
}
```

## POST /api/consent/revoke

Revogação de consentimento (Art. 18, IX).

```ts
export async function POST(req: Request) {
  const session = await requireAuth(req);
  const { purpose } = await req.json();

  // Cria registro append-only de revogação
  await db.consentRecord.create({
    data: {
      subjectId: session.user.id,
      purpose,
      status: "REVOKED",
      revokedAt: new Date(),
      legalBasis: "CONSENT",
      policyVersionId: await getCurrentPolicyId(),
      channel: "API",
      evidenceHash: hashEvidence(req),
      grantedAt: new Date() // marker, not the original grant
    }
  });

  // Propaga aos operadores
  await propagateRevocation(session.user.id, purpose);

  await logDsar(session.user.id, "DSAR_FULFILLED", "consent_revoke", { purpose });

  return Response.json({ status: "revoked", purpose });
}
```

## React Native — tela "Meus Dados"

```tsx
// screens/PrivacyScreen.tsx
import { View, Button, Alert } from 'react-native';

export function PrivacyScreen() {
  const exportData = async () => {
    const res = await fetch(`${API}/api/me/export`, { /* auth header */ });
    // salva em arquivo local com expo-file-system + compartilhar
  };

  const requestErasure = () => {
    Alert.alert(
      "Excluir conta",
      "Esta ação é irreversível para os dados não retidos por obrigação legal. Confira a política.",
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const confirm = await promptText("Digite EXCLUIR MINHA CONTA para confirmar");
            if (confirm === "EXCLUIR MINHA CONTA") {
              await fetch(`${API}/api/me/erasure`, {
                method: "POST",
                body: JSON.stringify({ confirmation: confirm })
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View>
      <Button title="Exportar meus dados" onPress={exportData} />
      <Button title="Gerenciar consentimentos" onPress={() => navigate("/privacy/consents")} />
      <Button title="Corrigir dados" onPress={() => navigate("/privacy/profile")} />
      <Button title="Excluir minha conta" onPress={requestErasure} color="red" />
    </View>
  );
}
```

## Alerts de SLA

Configure cron / scheduled job:
- Dia 10: alerta amarelo no ticket
- Dia 13: alerta vermelho + escalonamento ao Encarregado
- Dia 15: bloqueio do tratamento se ainda não atendido + comunicação ao titular explicando o atraso (sempre desfavorável — evitar a todo custo)
