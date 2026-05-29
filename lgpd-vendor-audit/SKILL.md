---
name: lgpd-vendor-audit
description: Conduct due diligence on third-party operators (operadores) under LGPD Art. 39. Use when user asks 'auditar fornecedor', 'vendor audit LGPD', 'operadores LGPD', 'devida diligência', or onboarding/reviewing third-party services. Produces vendor tier assessment + remediation list.
---

# Vendor Audit (Operadores)

Art. 39 LGPD: operador trata segundo instruções do controlador. Art. 42: controlador responde solidariamente por danos causados pelo operador. Logo, **escolha do operador é responsabilidade direta do controlador**.

## Workflow

### Passo 1: Inventário

Liste TODOS os operadores (cloud, SDK, analytics, comms, pagamento, observability, CRM, etc.). Cruze com:
- `package.json` / `requirements.txt`
- `cors origins` no backend
- Webhooks ativos
- Cron jobs externos
- Domain DNS records (CNAMEs para Vercel, Cloudflare, etc.)

### Passo 2: Tiering por risco

| Tier | Critério | Exemplo | Periodicidade de revisão |
|---|---|---|---|
| Crítico | Acesso a dados sensíveis OU volume grande de PII | Cloud principal, payment, identity provider | Trimestral |
| Alto | Acesso a PII comum em larga escala | Email, SMS, push, observability | Semestral |
| Médio | Acesso limitado a PII | Analytics agregada, CRM | Anual |
| Baixo | Sem PII ou pseudonimizada | CDN, monitoramento de uptime | Anual ou ad-hoc |

### Passo 3: Checklist por vendor

Ver `assets/vendor-checklist.md`.

### Passo 4: Documentar

Para cada vendor: `.lgpd/vendors/{vendor-slug}.md` com:
- Identificação (razão social, país, CNPJ se aplicável)
- Finalidade do tratamento
- Dados compartilhados
- Tier
- DPA assinado (link)
- Cláusulas-padrão (se intl)
- Certificações (SOC2, ISO 27001, ISO 27701, ANPD?)
- Última revisão
- Próxima revisão
- Owner interno

### Passo 5: Remediar gaps

Lista priorizada em `.lgpd/gaps.md`.

## Critérios eliminatórios

Se o operador:
- Não assina DPA — **não pode ser usado**
- Está em país sem cláusulas-padrão e sem outra base do Art. 33 — **não pode ser usado**
- Tem histórico recente de incidentes não comunicados — **considerar substituir**
- Não fornece logs/auditoria — **risco alto, escalonar**

## Status update

```markdown
## F (L4 ou F14a) — Vendor audit ✓
- {N} operadores inventariados
- {Crit/Alto/Med/Baixo} por tier
- {M} com DPA + cláusulas adequadas
- {X} gaps abertos: ver `.lgpd/gaps.md`
- Próximo: lgpd-dpa ou lgpd-international-transfer
```

