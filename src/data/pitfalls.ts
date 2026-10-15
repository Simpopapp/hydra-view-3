import type { Pitfall } from "./types";

/**
 * Armadilhas comuns do ghidra-mcp, autoradas a partir de "Key Gotchas" e dos
 * relatórios de estudo. relatedTools é validado contra o catálogo por teste.
 */
export const PITFALLS: Pitfall[] = [
  {
    slug: "upgrade-ghidra-read-only",
    title: "Atualizar o Ghidra deixa todos os programas read-only",
    severity: "critica",
    symptom:
      "Depois de atualizar o Ghidra, os binários abrem somente leitura e edições somem silenciosamente.",
    cause:
      "O Ghidra registra a versão da linguagem SLEIGH de cada programa; um bump (ex.: x86 4.6 → 4.7) bloqueia abertura read-write de programas antigos em projetos compartilhados.",
    remedy:
      "Rode python tools/upgrade_project_language.py (dry run primeiro), depois --apply por pasta. Verifique com --verify. Faça isso SEMPRE após qualquer atualização do Ghidra.",
    sourceRef: "AGENTS.md — Key Gotchas · tools/upgrade_project_language.py",
    relatedTools: ["open_program", "checkin_program"],
  },
  {
    slug: "variante-de-linguagem-ficticia",
    title: "Pseudocódigo perfeito e fictício por variante de linguagem errada",
    severity: "critica",
    symptom:
      "A decompilação sai sintaticamente perfeita, mas o conteúdo não faz sentido — e a chamada reporta sucesso.",
    cause:
      "O loader do Ghidra ADIVINHA a coluna de variante da linguagem. Em processadores com mais de um decodificador SLEIGH (PowerPC, ARM, MIPS…), a variante errada decodifica os mesmos bytes em instruções diferentes.",
    remedy:
      "Toda resposta com C vem carimbada com language_id e variant; quando o processador tem mais de um decodificador, recebe também variant_ambiguous + variant_candidates. Confira o carimbo; se nomear uma variante que o programa não usa, a chamada é recusada (variant_mismatch). Corrigir exige re-importar com a linguagem certa.",
    sourceRef: "AGENTS.md — Key Gotchas (Decompiler output)",
    relatedTools: ["get_functions", "force_decompile", "get_language_metadata"],
  },
  {
    slug: "switch-program-escopo-global",
    title: "switch_program muda o programa de TODO o servidor",
    severity: "media",
    symptom:
      "Numa sessão multi-versão, chamadas sem program= caem no binário errado — gravações vão para o alvo indevido.",
    cause:
      "switch_program retargeta o programa corrente do servidor inteiro; trabalhadores concorrentes herdam o alvo trocado.",
    remedy:
      "Em trabalho multi-versão, passe program=<caminho completo do projeto> em CADA chamada. Nomes ambíguos (mesmo DLL em várias pastas) retornam erro listando os candidatos — use caminho completo ou substring única.",
    sourceRef: "AGENTS.md — Key Gotchas (switch_program)",
    relatedTools: ["switch_program", "list_open_programs", "open_program"],
  },
  {
    slug: "git-bash-caminho-ghidra",
    title: "Git Bash corrompe o caminho do Ghidra no build",
    severity: "media",
    symptom:
      "~100 erros 'package ghidra.program.model.address does not exist' que parecem checkout quebrado.",
    cause:
      "No Git Bash, backslash no -PGHIDRA_INSTALL_DIR é reinterpretado pelo shell antes do Gradle ler a propriedade.",
    remedy:
      'No Git Bash use barra normal: ./gradlew buildExtension "-PGHIDRA_INSTALL_DIR=F:/ghidra_12.1.4_PUBLIC". PowerShell aceita backslash.',
    sourceRef: "AGENTS.md — Build & Deploy (Git Bash)",
    relatedTools: [],
  },
  {
    slug: "debugger-opt-in",
    title: "As ferramentas de debugger não aparecem no cliente de IA",
    severity: "media",
    symptom: "O cliente MCP lista ~187 ferramentas; nenhuma de debugger.",
    cause:
      "Os 22 proxies de debugger são opt-in e OFF por padrão — sem a variável de ambiente certa, eles não são registrados no schema.",
    remedy:
      "Defina GHIDRA_DEBUGGER_URL=http://127.0.0.1:8099 (loopback — URLs remotas são recusadas) ou GHIDRA_DEBUGGER_TOOLS=1. GHIDRA_DEBUGGER_TOOLS=0 vence mesmo com URL definida.",
    sourceRef: "python/bridge_mcp_ghidra/debugger.py · AGENTS.md",
    relatedTools: ["debugger/status", "debugger/launch"],
  },
  {
    slug: "nomes-ambiguos-multi-versao",
    title: "Nome de programa ambíguo em projetos multi-versão",
    severity: "media",
    symptom:
      "Chamar com program=D2Common.dll retorna um erro listando vários caminhos candidatos, em vez de abrir 'o' binário.",
    cause:
      "A resolução de nomes (ProjectProgramProvider.match) aceita caminho exato, nome exato e substring — mas substring NÃO-ÚNICA é erro, nunca 'o primeiro hit'. O mesmo nome existe em todas as pastas de versão.",
    remedy:
      "Passe o caminho completo do projeto ou uma substring que case com exatamente um arquivo. Ambiguidade é sempre erro explícito — isso é intencional.",
    sourceRef: "AGENTS.md — Program model (ProjectProgramProvider.match)",
    relatedTools: ["open_program", "list_open_programs"],
  },
  {
    slug: "deploy-gradle-refusa-test",
    title: "deploy --test sob backend Gradle é recusado",
    severity: "media",
    symptom:
      "python -m tools.setup deploy --test release falha com recusa explícita ao usar TOOLS_SETUP_BACKEND=gradle.",
    cause:
      "O deploy do backend Gradle roda nenhuma suíte pós-deploy e RECUSA um tier pedido, em vez de aceitar e descartar em silêncio (bug #484 corrigido ao contrário: silêncio era o comportamento antigo).",
    remedy:
      "Combinação correta: ./gradlew buildExtension (Gradle builda) e DEPOIS python -m tools.setup deploy --test release com TOOLS_SETUP_BACKEND não definido (default Maven para a suíte).",
    sourceRef: "AGENTS.md — Build & Deploy (deploy --test)",
    relatedTools: [],
  },
  {
    slug: "plate-newline-literal",
    title: "'\\n' em comentário de plate cria texto literal, não quebra de linha",
    severity: "media",
    symptom: "O plate mostra '\\n' como caracteres visíveis em vez de formatar o texto.",
    cause: "O endpoint recebe a string literal; sequências de escape não são interpretadas.",
    remedy:
      "Envie texto multi-linha real (quebras de linha verdadeiras no JSON: \"\\n\" no JSON é quebra real — '\\\\n' é literal).",
    sourceRef: "AGENTS.md — Key Gotchas (Plate comment)",
    relatedTools: ["set_comment", "batch_set_comments"],
  },
];
