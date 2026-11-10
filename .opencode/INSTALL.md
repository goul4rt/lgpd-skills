# Instalando o lgpd-skills no OpenCode

## Pré-requisitos

- [OpenCode.ai](https://opencode.ai) instalado

## Instalação

Adicione o lgpd-skills ao array `plugin` do seu `opencode.json` (global ou do projeto):

```json
{
  "plugin": ["lgpd-skills@git+https://github.com/goul4rt/lgpd-skills.git"]
}
```

Reinicie o OpenCode. O plugin instala pelo gerenciador do OpenCode e registra o
diretório `skills/` do repo (as 19 skills) via o hook `config` — sem symlinks.

Verifique pedindo: "liste as skills disponíveis".

O OpenCode usa o próprio instalador de plugin. Se você também usa Claude Code, Codex
ou outro agente, instale o lgpd-skills separadamente em cada um.

## Uso

Use a ferramenta nativa `skill` do OpenCode:

```text
use a ferramenta skill para listar as skills
use a ferramenta skill para carregar lgpd-audit
```

> **Atenção (OpenCode):** diferentemente do Claude Code, as skills **não disparam
> sozinhas** pela descrição. O modelo precisa chamar a ferramenta `skill`
> explicitamente. Para a auditoria completa, peça diretamente "use a skill
> lgpd-audit"; o maestro, uma vez ativo, invoca as sub-skills pelo nome.

### Mapeamento de ferramenta

Onde uma skill mencionar a ferramenta `Skill` (nome do Claude Code), use a ferramenta
nativa `skill` do OpenCode. Operações de arquivo (`Read`/`Write`/`Edit`/`Bash`) usam
suas ferramentas nativas — nenhum outro mapeamento é necessário.

## Atualização

O OpenCode instala via spec git. Algumas versões do OpenCode/Bun fixam a dependência
git resolvida num lockfile ou cache, então reiniciar pode não pegar o commit mais
novo. Se a atualização não aparecer, limpe o cache de pacotes do OpenCode ou
reinstale o plugin.

Para fixar uma versão:

```json
{
  "plugin": ["lgpd-skills@git+https://github.com/goul4rt/lgpd-skills.git#v1.3.0"]
}
```

## Troubleshooting

### Plugin não carrega

1. Veja os logs: `opencode run --print-logs "oi" 2>&1 | grep -i lgpd`
2. Confirme a linha do plugin no `opencode.json`
3. Use uma versão recente do OpenCode

### Skills não aparecem

1. Use a ferramenta `skill` para listar o que foi descoberto
2. Confirme que o plugin está carregando (acima)
3. **Fallback sem plugin** — se a sua versão do OpenCode não registrar via plugin,
   copie/symlinke as pastas de skill para um diretório de descoberta nativo
   (`.opencode/skills/`, `.claude/skills/` ou `.agents/skills/`):
   ```bash
   mkdir -p .opencode/skills
   for d in /caminho/para/lgpd-skills/skills/*/; do
     ln -sfn "$d" ".opencode/skills/$(basename "$d")"
   done
   ```

### Windows

Algumas builds do OpenCode no Windows têm problemas com specs `git+https` (paths de
cache e o Bun não achar o `git.exe` mesmo funcionando no terminal). Se não instalar,
use o npm do sistema e aponte o OpenCode para o pacote local:

```powershell
npm install lgpd-skills@git+https://github.com/goul4rt/lgpd-skills.git --prefix "$HOME\.config\opencode"
```

```json
{
  "plugin": ["~/.config/opencode/node_modules/lgpd-skills"]
}
```

## Ajuda

- Issues: https://github.com/goul4rt/lgpd-skills/issues
