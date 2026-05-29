# Checklist de Due Diligence por Operador (Art. 39 LGPD)

Use uma cópia desta ficha por operador. Salve preenchida em `.lgpd/vendors/{vendor-slug}.md`. Itens marcados **🚫 eliminatório** reprovam o operador se não atendidos (ver "Critérios eliminatórios" no `SKILL.md`).

---

## Ficha do operador

```markdown
# Operador: {NOME}

- Razão social / CNPJ ou registro: {...}
- País(es) de tratamento: {...}
- Finalidade: {...}
- Dados compartilhados: {categorias} | Sensíveis (Art. 11)? {sim/não}
- Tier: {Crítico | Alto | Médio | Baixo}
- Owner interno: {nome}
- Última revisão: {data} | Próxima revisão: {data conforme periodicidade do tier}
```

---

## 1. Contrato e base legal
- [ ] **🚫 DPA assinado** cobrindo as 12 cláusulas (ver `lgpd-dpa`)
- [ ] Papel definido (operador vs controlador conjunto) está correto
- [ ] Finalidade do operador bate com a finalidade registrada no ROPA
- [ ] Há base legal para o compartilhamento (ver `lgpd-legal-basis`)

## 2. Segurança (Art. 46)
- [ ] Criptografia em trânsito (TLS) e em repouso
- [ ] Controle de acesso (RBAC) e MFA para a equipe do operador
- [ ] Certificações vigentes: SOC 2 Tipo II / ISO 27001 / ISO 27701 — `{quais? validade?}`
- [ ] Fornece logs de acesso / trilha de auditoria
- [ ] Política de gestão de vulnerabilidades / pentest periódico

## 3. Sub-operadores
- [ ] Lista de sub-operadores disponível e atualizada
- [ ] Notifica/permite objeção antes de incluir novo sub-operador
- [ ] Sub-operadores sob obrigações equivalentes

## 4. Transferência internacional (se fora do BR)
- [ ] **🚫 Base do Art. 33 presente** (Cláusulas-Padrão Res. 19/2024, ou outra) — ver `lgpd-international-transfer`
- [ ] Países de destino mapeados
- [ ] Avaliação de risco do país de destino registrada

## 5. Direitos do titular e retenção
- [ ] Operador auxilia em DSAR dentro do SLA (Art. 18) — ver `lgpd-dsar`
- [ ] Devolve/elimina dados ao fim do contrato + atestado de eliminação (Art. 16)
- [ ] Prazos de retenção do operador compatíveis com `lgpd-retention-erasure`

## 6. Incidentes
- [ ] Compromisso contratual de notificar incidentes ≤ 24h
- [ ] **🚫 Sem histórico de incidentes não comunicados** (due diligence reputacional)
- [ ] Canal/contato de segurança definido

## 7. Operacional
- [ ] DPA versionado em `.lgpd/vendors/{slug}.md` com link
- [ ] Renovação/revisão agendada conforme o tier
- [ ] Owner interno responsável definido

---

## Resultado

```markdown
## Avaliação — {operador}
- Itens atendidos: {N}/{total}
- Eliminatórios (🚫): {OK | REPROVADO em: ...}
- Veredito: {APROVADO | APROVADO COM RESSALVAS | REPROVADO — substituir}
- Gaps abertos: ver `.lgpd/gaps.md`
```

> Lembrete (Art. 42): o controlador responde solidariamente por danos causados pelo operador. Operador sem DPA ou sem base de transferência internacional **não pode ser usado** — não é ressalva, é bloqueio.
