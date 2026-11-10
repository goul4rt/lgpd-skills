# Referência Normativa LGPD — Encode rígido

Use este arquivo como fonte da verdade normativa desta coleção (revisado até **novembro de 2026**). Não invente prazos, percentuais, thresholds numéricos ou artigos, e separe sempre **obrigação legal expressa** de **boa prática de engenharia / gestão de risco**.

## Lei nº 13.709/2018 (LGPD)

| Artigo | Conteúdo crítico |
|---|---|
| Art. 5º | Definições (dado pessoal, sensível, anonimização, consentimento, controlador, operador, encarregado, tratamento) |
| Art. 6º | 10 princípios: finalidade, adequação, necessidade, livre acesso, qualidade, transparência, segurança, prevenção, não discriminação, responsabilização |
| Art. 7º | 10 bases legais para dados comuns (I consentimento, II obrigação legal/regulatória, III políticas públicas, IV pesquisa, V contrato/procedimentos pré-contratuais, VI exercício regular de direitos em processo, VII proteção da vida, VIII tutela da saúde, IX legítimo interesse, X proteção do crédito) |
| Art. 9º | Direito do titular ao acesso facilitado às informações sobre o tratamento — 7 elementos obrigatórios |
| Art. 10 | Legítimo interesse — requisitos + LIA + possibilidade de a ANPD solicitar RIPD (§ 3º) |
| Art. 11 | Bases legais para dados sensíveis (I consentimento específico e destacado OU II sete hipóteses sem consentimento) |
| Art. 14 | Crianças (< 12 anos) e adolescentes (12 a < 18 anos, ECA Art. 2º) — prevalência obrigatória do **melhor interesse**. Conforme **Enunciado CD/ANPD nº 1/2023**, admite qualquer base dos Arts. 7º ou 11; o consentimento específico e em destaque de ao menos um dos pais/responsáveis (§ 1º) aplica-se quando o **consentimento** for a base legal adotada para crianças (ressalvado o § 3º) |
| Arts. 15–16 | Término do tratamento e eliminação, ressalvadas as hipóteses legais de conservação (Art. 16, I a IV), com minimização e bloqueio para outras finalidades |
| Art. 18 | Direitos do titular (I a IX + §§ 1º a 8º, incluindo propagação imediata aos agentes com quem houve uso compartilhado no § 6º) |
| Art. 19, I e II | Confirmação e acesso: **(I)** formato simplificado = **imediato** (para ATPP: até **15 dias**, Res. 2/2022 Art. 14, I); **(II)** declaração clara e completa = até **15 dias corridos** da requisição (para ATPP: até **30 dias**, Res. 2/2022 Art. 14) |
| Art. 20 | Revisão de decisões tomadas unicamente com base em tratamento automatizado (sem exigência legal expressa de revisor humano após a Lei 13.853/2019, embora recomendável em decisões de alto impacto) |
| Arts. 33–36 | Transferência internacional — 9 hipóteses do Art. 33 (incluindo I decisão de adequação e II, b cláusulas-padrão) |
| Art. 37 | ROPA — obrigatório para controlador e operador |
| Art. 38 | RIPD — quando exigido pela ANPD ou em tratamentos de alto risco (avaliar distinção entre obrigação normativa e RIPD preventivo por boa prática) |
| Art. 39 | Operador — realiza o tratamento segundo as instruções lícitas fornecidas pelo controlador |
| Art. 41 | Encarregado — designação, divulgação pública da identidade/contato e atribuições |
| Art. 42, § 1º, I e II | **Responsabilidade condicional**: o operador responde **solidariamente** quando descumprir obrigações da LGPD **ou** não seguir instruções lícitas do controlador (equiparando-se a este); controladores diretamente envolvidos respondem solidariamente (II), observadas as excludentes do Art. 43 |
| Art. 46 | Medidas de segurança, técnicas e administrativas aptas a proteger os dados + privacy-by-design (§ 2º) |
| Art. 48 | Comunicação de incidente de segurança à ANPD e ao titular |
| Art. 52, II | **Multa simples de até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração** |

## Resoluções, Enunciados e Deliberações da ANPD

### Res. CD/ANPD nº 2/2022 — Agentes de Tratamento de Pequeno Porte (ATPP)

- **Enquadramento**: microempresas, EPPs, startups (receita bruta até R$ 16 milhões/ano), pessoas jurídicas de direito privado sem fins lucrativos e pessoas naturais/entes despersonalizados que tratem dados com fins econômicos (desde que não pertençam a grupo econômico que exceda os limites e não realizem tratamento de alto risco para fins das dispensas aplicáveis).
- **Art. 4º — teste cumulativo de alto risco**: configura alto risco o tratamento que atenda **simultaneamente** a pelo menos **um critério geral** **E** pelo menos **um critério específico**:
  - **Critérios gerais**: (I) tratamento em larga escala; ou (II) tratamento que possa afetar significativamente interesses e direitos fundamentais dos titulares.
  - **Critérios específicos**: (I) uso de tecnologias emergentes ou inovadoras; (II) vigilância ou controle de zonas acessíveis ao público; (III) decisões tomadas unicamente com base em tratamento automatizado, inclusive definição de perfis; (IV) utilização de dados pessoais sensíveis ou de dados pessoais de crianças, de adolescentes e de idosos.
- **Art. 4º, § 1º — avaliação de larga escala**: **não existe número fixo de titulares na norma**. A larga escala é avaliada no caso concreto considerando fatores conjugados: número de titulares afetados, volume de dados envolvidos, duração, permanência, frequência do tratamento e extensão geográfica.
- **Art. 11 — dispensa de Encarregado**: ATPP que não realize tratamento de alto risco é dispensado de indicar Encarregado formal, **mas deve obrigatoriamente disponibilizar canal de comunicação** com o titular (Art. 11, § 1º).
- **Art. 14 — prazos diferenciados para ATPP**:
  - **Declaração simplificada (Art. 19, I LGPD)**: prazo de até **15 dias** (Art. 14, I) — **não** se exige resposta imediata como nos demais controladores.
  - **Prazos em dobro**: aplicam-se nos demais atendimentos a titulares (ex.: **30 dias** para declaração completa do Art. 19, II) e na comunicação de incidentes (**6 dias úteis**, salvo potencial comprometimento à integridade física ou moral dos titulares ou à segurança nacional/pública — Res. 15/2024).

### Enunciado CD/ANPD nº 1/2023 — Dados de Crianças e Adolescentes

- Publicado em 24/05/2023: *"O tratamento de dados pessoais de crianças e adolescentes poderá ser realizado com base nas hipóteses legais previstas no art. 7º ou no art. 11 da Lei Geral de Proteção de Dados Pessoais (LGPD), desde que observado e prevalecente o seu melhor interesse, a ser avaliado no caso concreto, nos termos do art. 14 da Lei."*
- Implicação técnica: **não implemente consentimento parental como requisito universal** para toda operação envolvendo menores; verifique primeiro qual é a base legal adequada da atividade e documente a avaliação do melhor interesse.

### Res. CD/ANPD nº 4/2023 — Dosimetria e Aplicação de Sanções

- Classificação das infrações: leves, médias e graves.
- Reincidência específica ou genérica considerada no janela de **5 anos**.
- Atenuantes relevantes para engenharia/governança: cessação espontânea da infração, boa-fé e implementação comprovada de política de boas práticas e governança ou medidas técnicas/administrativas prévias (Art. 50 / Art. 46).

### Res. CD/ANPD nº 15/2024 — Comunicação de Incidente de Segurança (RCIS)

- **Art. 5º — incidente notificável (cumulativo)**: risco ou dano relevante aos titulares **E** pelo menos uma das categorias: (I) dados sensíveis; (II) dados de crianças, adolescentes ou idosos; (III) dados financeiros; (IV) dados de autenticação em sistemas; (V) dados protegidos por sigilo legal, judicial ou profissional; (VI) dados em larga escala.
- **Art. 6º** — **3 dias úteis** contados do conhecimento de que o incidente afetou dados pessoais para comunicar à ANPD (6 dias úteis para ATPP, salvo exceções de integridade física/moral ou segurança pública/nacional).
- **Art. 6º, § 2º** — 12 itens obrigatórios na comunicação à ANPD; complementação em até **20 dias úteis** se a comunicação inicial foi preliminar.
- **Art. 9º** — comunicação aos titulares em **3 dias úteis**, contendo 7 itens obrigatórios em linguagem simples.
- **Art. 10** — manutenção de registro interno de **todos os incidentes de segurança** (inclusive os não comunicados à ANPD) por **no mínimo 5 anos** (nota: este prazo refere-se a **incidentes de segurança**, não a logs gerais de requisições DSAR).

### Res. CD/ANPD nº 18/2024 — Regulamento do Encarregado

- Pode ser pessoa natural (integrante do quadro ou externa) **ou** pessoa jurídica.
- Divulgação obrigatória da identidade (nome completo se PF; nome empresarial + responsável PF se PJ) e informações de contato em local de destaque e fácil acesso no sítio eletrônico.
- Ausência de exigência de certificação ou inscrição profissional específica.
- O Encarregado não responde perante a ANPD pela conformidade do tratamento realizado pelo controlador (Art. 15, § 2º).
- Dever de prevenir **conflito de interesses** (especialmente acúmulo com chefia que determine finalidades/meios de sistemas críticos de TI/negócio sem segregação).

### Res. CD/ANPD nº 19/2024 — Regulamento de Transferência Internacional

- Regulamenta procedimentos de decisões de adequação, cláusulas específicas, normas corporativas globais (BCRs) e aprova as **Cláusulas-Padrão Contratuais brasileiras (Anexo II)**.
- As Cláusulas-Padrão do Anexo II devem ser adotadas integralmente e sem alteração de texto (prazo de adaptação contratual encerrado em agosto de 2025).

### Res. CD/ANPD nº 30/2025 e nº 31/2025 — Prioridades e Agenda Regulatória

- **Res. 30/2025 (Mapa de Temas Prioritários 2026–2027)**: fiscalização prioritária em (i) direitos dos titulares; (ii) dados de crianças e adolescentes no ambiente digital; (iii) tratamento pelo Poder Público; (iv) inteligência artificial e tecnologias emergentes (incluindo biometria e raspagem de dados).
- **Res. 31/2025 (Agenda Regulatória 2025–2026)**: inclui direitos dos titulares, RIPD, medidas de segurança, inteligência artificial, anonimização e dados biométricos.

### Res. CD/ANPD nº 32/2026 — Decisão de Adequação para União Europeia e EEE

- Publicada em **26 de janeiro de 2026**: primeira decisão de adequação da ANPD com fundamento no **Art. 33, I da LGPD**.
- Reconhece grau adequado de proteção de dados para transferências destinadas aos **Estados-membros da União Europeia**, às **instituições, órgãos e agências da UE** e aos países da EFTA integrantes do Espaço Econômico Europeu (**Islândia, Liechtenstein e Noruega**).
- **Efeito prático**: transferências cobertas por esta decisão **dispensam Cláusulas-Padrão Contratuais brasileiras (Res. 19/2024)** ou BCRs (mantida a necessidade de contrato/DPA do Art. 39 quando o destinatário atuar como operador, bem como transparência ao titular).
- **Exceções expressas**: a decisão **não se aplica** a transferências efetuadas exclusivamente para fins de segurança pública, defesa nacional, segurança do Estado ou investigação e repressão de infrações penais.

### Deliberação CD/ANPD (setembro de 2026) — Arquivamento da minuta de Guia de Alto Risco

- Pelo **Voto nº 11/2025/DIR-MW** (setembro de 2026), o Conselho Diretor decidiu por unanimidade **não aprovar e determinar o arquivamento** da minuta do *Guia Orientativo sobre Tratamento de Dados Pessoais de Alto Risco* (que propunha metodologia de pontuação e o patamar preliminar de 2 milhões de titulares para larga escala).
- O tema foi devolvido à Superintendência de Regulação (SRE) para tratamento integrado dentro da futura regulamentação do **RIPD**. Portanto, **não aplique o número de 2 milhões de titulares como regra ou threshold automático**.

## Lei nº 15.211/2025 e Decreto nº 12.880/2026 — ECA Digital

- **Vigência**: Lei em vigor desde **17 de março de 2026**; regulamentada pelo **Decreto nº 12.880, de 18 de março de 2026** (que consolida a competência regulatória e fiscalizatória central da ANPD e dispõe sobre sinais de idade e deveres operacionais).
- **Escopo e Acesso Provável**: aplica-se a produtos ou serviços de TI direcionados a crianças e adolescentes **ou de acesso provável** por eles. Conforme o **Guia Orientativo da ANPD "Fornecedores de produtos ou serviços de TI: escopo e obrigações gerais do ECA Digital" (28/10/2026)**, a declaração unilateral da empresa de que o serviço é "18+" não afasta a lei se houver atratividade, facilidade de entrada ou presença real de menores; e **as obrigações são moduladas** conforme a natureza da atividade, funcionalidades, porte, volume de usuários e grau de interferência/controle do fornecedor.
- **Art. 9º, § 1º — escopo exato da verificação de idade**: exige mecanismos confiáveis de verificação de idade a cada acesso (vedada a autodeclaração) para impedir o acesso a **conteúdos, produtos ou serviços impróprios, inadequados ou proibidos para menores de 18 anos** — **não** equivale a impor verificação documental/biométrica a cada acesso em qualquer funcionalidade de qualquer software.
- **Sinais de idade (Decreto nº 12.880/2026)**: admite arquitetura em camadas com transmissão de sinais de idade por sistemas operacionais e lojas de aplicativos, cabendo às aplicações consumir tais sinais, ajustar imediatamente interface/algoritmos e aplicar barreiras suplementares conforme o risco. *(Nota: o Guia específico da ANPD sobre aferição de idade segue em consolidação no fim de 2026 — não tratar minutas preliminares como norma definitiva).*
- **Art. 24** — vinculação a responsável legal para usuários de até **16 anos** nas plataformas/serviços abrangidos pela obrigação.
- **Arts. 22 e 26** — vedação de perfilamento comportamental de menores para direcionamento publicitário (inclusive com dados de aferição de idade).
- **Art. 20** — vedação de caixas de recompensa (*loot boxes*) em jogos eletrônicos direcionados a menores ou de acesso provável.
- **Art. 31** — relatórios semestrais de transparência e gestão de riscos para provedores com **mais de 1 milhão de usuários crianças/adolescentes no Brasil**.
- **Art. 35, II** — multa de até **10% do faturamento do grupo econômico no Brasil** ou R$ 10 a R$ 1.000 por usuário cadastrado, limitada a R$ 50 milhões por infração.

## Lei nº 15.352/2026

Transformou a ANPD em agência reguladora de natureza especial (autarquia em regime especial), fortalecendo autonomia administrativa, poder normativo e estrutura de fiscalização.

## Matriz de decisão normativa (sem atalhos inventados)

| Situação concreta | Consequência normativa |
|---|---|
| Receita > R$ 4,8M/ano (EPP) e fora de startup ≤ R$ 16M/ano (ou com tratamento de alto risco) | Fora das dispensas de ATPP — Encarregado formal obrigatório, DSAR simplificado imediato e completo em 15 dias, incidente notificável em 3 dias úteis |
| ATPP de baixo risco (Res. 2/2022) | Dispensado de Encarregado formal **desde que mantenha canal de comunicação** (Art. 11); DSAR simplificado em até **15 dias** e completo em até **30 dias** (Art. 14) |
| Critério geral (larga escala multifatorial OU impacto significativo) **+** critério específico (IA/emergente, vigilância, decisão automatizada/profiling, ou dados sensíveis/menores/idosos) | **Alto risco** no teste cumulativo da Res. 2/2022, Art. 4º → afasta dispensas de ATPP e indica elaboração de RIPD |
| Apenas dado sensível, biometria ou decisão automatizada **sem** critério geral | Não preenche sozinho o teste cumulativo da Res. 2/2022, mas **RIPD preventivo** é recomendado como boa prática de gestão de risco (identificar expressamente como boa prática) |
| Transferência internacional para UE ou EEE (Islândia, Liechtenstein, Noruega) em atividade comercial comum | Coberta pela **Decisão de Adequação da Res. CD/ANPD nº 32/2026** (Art. 33, I) — **não exige** Cláusulas-Padrão brasileiras (mantido DPA Art. 39 se operador) |
| Transferência internacional para país **sem** decisão de adequação (ex.: EUA) | Exige mecanismo válido do Art. 33 — tipicamente **Cláusulas-Padrão da Res. 19/2024 Anexo II** (Art. 33, II, b), BCRs ou outra hipótese aplicável |
| Tratamento de dados de crianças (< 12) ou adolescentes (12–17) | Avaliar **melhor interesse** + base legal nos Arts. 7º ou 11 (**Enunciado 1/2023**); exigir consentimento parental destacado (Art. 14, § 1º) quando a base for o consentimento para crianças |
| Produto/serviço direcionado a menores ou de **acesso provável** | Avaliar obrigações do **ECA Digital** moduladas pelo papel/controle (Decreto 12.880/2026 + Guia ANPD out/2026); verificação a cada acesso (Art. 9º, § 1º) obrigatória para conteúdos/serviços impróprios ou proibidos para < 18 |

## Fontes oficiais (verificar antes de emissão final de artefatos)

- Lei nº 13.709/2018 (LGPD): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Lei nº 15.211/2025 (ECA Digital): https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm
- Decreto nº 12.880/2026: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12880.htm
- Portal oficial da ANPD (Resoluções, Enunciados e Guias Orientativos): https://www.gov.br/anpd/pt-br
