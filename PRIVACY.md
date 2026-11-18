# Política de Privacidade — lgpd-skills

**Última atualização:** 17/11/2026

O `lgpd-skills` é um conjunto de Agent Skills (instruções em Markdown e modelos de código) que rodam dentro do agente de IA escolhido por você (Claude Code, Codex, Gemini CLI, Cursor, OpenCode ou Claude apps).

## O que o plugin coleta

**Nada.** O plugin não tem servidor, telemetria, analytics nem chamadas de rede. O mantenedor não recebe nenhum dado seu ou do seu projeto.

## O que acontece com os dados do seu projeto

- As skills orientam o agente a ler o código do **seu** repositório para mapear dados pessoais.
- Os artefatos gerados (inventário, ROPA, RIPD etc.) são gravados localmente em `.lgpd/`, dentro do próprio repositório, sob seu controle.
- O tratamento feito pelo agente de IA (envio de trechos de código ao modelo) segue a política de privacidade do **provedor do agente** que você usa, não deste plugin.

## Credenciais

Os exemplos de código usam variáveis de ambiente (ex.: `KMS_DATA_KEY_V1_B64`) apenas como modelo para o seu projeto. O plugin nunca lê nem transmite essas chaves.

## Contato

Dúvidas: abra uma [issue](https://github.com/goul4rt/lgpd-skills/issues). Questões de segurança: veja [SECURITY.md](./SECURITY.md).

---

**EN:** lgpd-skills collects no data. It has no server, telemetry or network calls. Artifacts are written locally to `.lgpd/` in your repository. Processing by your AI agent is governed by that agent provider's privacy policy.
