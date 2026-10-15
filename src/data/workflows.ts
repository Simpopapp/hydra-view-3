import type { Workflow } from "./types";

/**
 * Fluxos de trabalho do operador, autorados a partir dos docs canônicos.
 * Toda ferramenta citada em `steps[].tools` DEVE existir no catálogo —
 * o teste src/test/workflows.test.ts valida esse contrato.
 */
export const WORKFLOWS: Workflow[] = [
  {
    slug: "documentacao-funcao-v5",
    title: "Documentação de função (V5)",
    goal: "Levar uma função de 'sem nome e sem tipo' a documentada, tipada e pontuada como completa.",
    prerequisites: [
      "Servidor Ghidra MCP ativo com um binário aberto",
      "Auto-análise já executada no binário",
    ],
    steps: [
      {
        title: "Encontrar as funções sem documentação",
        detail:
          "Comece pela fila de trabalho: liste as funções ainda não documentadas, opcionalmente filtrando por strings reconhecíveis para priorizar o que importa.",
        tools: ["find_undocumented_by_string", "find_next_undefined_function", "find_functions"],
      },
      {
        title: "Analisar a função em profundidade",
        detail:
          "Peça a análise composta (decompilação, fluxo, contexto de chamadas) e o score de completude para saber o que falta antes de escrever qualquer coisa.",
        tools: ["analyze_function_complete", "analyze_function_completeness"],
      },
      {
        title: "Inspecionar decompilação e P-code",
        detail:
          "Force a decompilação quando quiser C fresco e consulte o P-code para entender semântica de baixo nível. Toda saída com C vem carimbada com language_id + variant — confira o carimbo antes de confiar no pseudocódigo.",
        tools: ["force_decompile", "get_function_pcode"],
        pitfall:
          "Em arquiteturas com múltiplos decodificadores (PowerPC, ARM, MIPS), uma variante de linguagem errada produz C sintaticamente perfeito e fictício.",
      },
      {
        title: "Auditar e corrigir tipos",
        detail:
          "Audite os globais que a função toca, aplique tipos de dados e corrija o protótipo (retorno e parâmetros). Nunca escreva documentação sobre tipos errados.",
        tools: [
          "audit_global",
          "apply_data_type",
          "set_function_prototype",
          "set_function_this_type",
        ],
      },
      {
        title: "Renomear seguindo as convenções",
        detail:
          "Funções em PascalCase com verbo, variáveis com notação húngara, globais com g_. As ferramentas de renomeação avisam quando o nome viola as convenções.",
        tools: ["rename_function", "batch_rename_function_components", "rename_variables"],
      },
      {
        title: "Escrever a documentação e pontuar",
        detail:
          "Grave os comentários de plate (Algorithm/Parameters/Returns), marque a função como documentada e re-pontue a completude para confirmar o resultado.",
        tools: [
          "batch_set_comments",
          "apply_documentation",
          "analyze_function_completeness",
          "save_program",
        ],
      },
    ],
    pitfalls: [
      "Comentário de plate com '\\n' cria texto literal, não quebra de linha — use texto multi-linha real.",
      "Transações precisam ser commitadas para persistir; save_program não persiste renomes de servidor compartilhado — use checkin.",
    ],
    sourceRef: "docs/prompts/FUNCTION_DOC_WORKFLOW_V5.md",
  },
  {
    slug: "tipagem-de-dados",
    title: "Aplicação de tipos de dados",
    goal: "Transformar dados sem tipo (undefined* / ponteiros crus) em tipos nomeados, documentados e validados.",
    prerequisites: ["Binário aberto e analisado", "Endereço do global ou dado alvo"],
    steps: [
      {
        title: "Auditar o estado atual",
        detail:
          "audit_global distingue 'sem tipo aqui' de 'engolido por uma unidade maior' (interior_to_data) — o segundo indica um container vizinho errado, não falta de tipo.",
        tools: ["audit_global", "audit_globals_in_function"],
      },
      {
        title: "Descobrir o tipo correto",
        detail:
          'Use o layout de structs existentes e os tipos válidos da linguagem para decidir o tipo antes de aplicar. Strings simples como "dword" são aceitas; objetos JSON de tipo são dispensáveis.',
        tools: ["get_struct_layout", "get_valid_data_types", "get_type_size", "find_data_types"],
      },
      {
        title: "Criar o tipo quando não existe",
        detail:
          "Crie a struct/enum e adicione campos — o prefixo de notação húngara é aplicado automaticamente nos campos.",
        tools: ["create_struct", "add_struct_field", "recreate_struct"],
      },
      {
        title: "Aplicar o tipo",
        detail:
          "apply_data_type escreve o tipo no endereço. O guard de eviction recusa escritas que apagariam globais NOMEADOS por sobreposição — se recusar, investigue a sobreposição antes de forçar.",
        tools: ["apply_data_type", "set_global", "apply_data_classification"],
        pitfall:
          "A recusa (type_would_evict) é uma proteção contra destruir globais vizinhos; o remédio é corrigir o tamanho/posição do tipo, não contornar o guard.",
      },
      {
        title: "Renomear e comentar",
        detail:
          "Feche o ciclo: nome com prefixo correto (g_ para globais) e comentário explicando o dado.",
        tools: ["rename_symbol", "set_comment"],
      },
    ],
    pitfalls: [
      "'Sem tipo' tem uma definição exata (undefined*, code, ponteiro cru) compartilhada entre as ferramentas — um ponteiro 'pointer *' conta como SEM tipo.",
      "Nomear exportações nomeadas (ABI) com g_ destrói o contrato do loader — exportações por nome são isentas de renomeação.",
    ],
    sourceRef:
      "docs/prompts/DATA_TYPE_INVESTIGATION_QUICK.md · docs/prompts/GLOBAL_DATA_ANALYSIS_WORKFLOW.md",
  },
  {
    slug: "investigacao-de-structs",
    title: "Investigação de estruturas",
    goal: "Reconstruir structs desconhecidas a partir do padrão real de acesso dos campos.",
    prerequisites: ["Funções que acessam a struct já identificadas"],
    steps: [
      {
        title: "Ver o layout atual",
        detail:
          "Inspecione o layout da struct (offsets, tamanhos, gaps) para planejar a reconstrução.",
        tools: ["get_struct_layout", "get_type_size"],
      },
      {
        title: "Analisar o uso dos campos",
        detail:
          "analyze_struct_field_usage mostra quais campos são lidos/escritos e por quais funções — campos nunca acessados são candidatos a padding ou a tipo errado.",
        tools: ["analyze_struct_field_usage", "get_field_access_context"],
      },
      {
        title: "Reconstruir a struct",
        detail:
          "Com o mapa de uso em mãos, recrie a struct com os tamanhos corretos e adicione os campos faltantes.",
        tools: ["recreate_struct", "add_struct_field", "create_struct"],
      },
      {
        title: "Validar o resultado",
        detail:
          "Reaplique a struct nos usos e confirme com o layout atualizado e os contextos de acesso.",
        tools: ["apply_data_type", "get_struct_layout"],
      },
    ],
    pitfalls: [
      "Redimensionar uma struct até 'caber no buraco' produz tipo sintaticamente válido e factualmente errado — os validadores de extent comparam o plate com o dado.",
    ],
    sourceRef:
      "docs/prompts/DATA_TYPE_INVESTIGATION_QUICK.md · docs/prompts/STRUCT_RESIZE_WORKFLOW.md",
  },
  {
    slug: "analise-de-fluxo-de-dados",
    title: "Análise de fluxo de dados",
    goal: "Rastrear como valores se propagam por uma função (para frente ou para trás) usando o grafo P-code.",
    prerequisites: ["Função analisada", "Endereço ou variável de interesse"],
    steps: [
      {
        title: "Obter o P-code da função",
        detail:
          "O P-code é a representação intermediária do Ghidra — é a base de todas as análises de propagação de valores.",
        tools: ["get_function_pcode", "get_language_metadata"],
      },
      {
        title: "Rodar a análise de dataflow",
        detail:
          "analyze_dataflow propaga valores para frente (o que este valor vira?) ou para trás (de onde vem?), localizando origens e destinos de dados.",
        tools: ["analyze_dataflow"],
      },
      {
        title: "Contextualizar com cadeias de chamadas",
        detail:
          "Para valores que atravessam funções, encadeie com a análise de cadeias de chamadas de API e o grafo de chamadas.",
        tools: ["analyze_api_call_chains", "get_function_call_graph", "get_full_call_graph"],
      },
    ],
    pitfalls: [
      "Análise de fluxo só é confiável com o binário corretamente analisado — rode run_analysis após importar.",
    ],
    sourceRef: "README.md — Analysis Service",
  },
  {
    slug: "propagacao-entre-versoes",
    title: "Propagação de documentação entre versões",
    goal: "Parear funções de duas versões do mesmo binário (por hash e similaridade) e transferir a documentação da versão documentada para a nova.",
    prerequisites: [
      "Duas versões do binário abertas (ou acessíveis) no projeto",
      "Uma versão já documentada",
    ],
    steps: [
      {
        title: "Calcular hashes das funções",
        detail:
          "O hash SHA-256 da função é a chave primária do pareamento entre versões — estável quando o código não mudou.",
        tools: ["get_function_hash"],
      },
      {
        title: "Parear por hash e por similaridade",
        detail:
          "Hash exato resolve a maioria; similaridade fuzzy cobre o restante (funções com pequenas diferenças). diff_functions mostra o que mudou.",
        tools: [
          "find_similar_functions",
          "find_similar_functions_fuzzy",
          "bulk_fuzzy_match",
          "diff_functions",
        ],
      },
      {
        title: "Comparar e mesclar documentação",
        detail:
          "compare_programs_documentation aponta o que existe de um lado e falta do outro; merge_program_documentation transfere em lote.",
        tools: [
          "compare_programs_documentation",
          "merge_program_documentation",
          "get_function_documentation",
        ],
      },
      {
        title: "Aplicar a documentação na versão nova",
        detail:
          "apply_documentation grava nomes, tipos e comentários propagados; revise os conflitos apontados antes de aceitar tudo.",
        tools: ["apply_documentation", "checkin_program"],
      },
    ],
    pitfalls: [
      "Nomes compartilhados entre pastas de versão (ex.: D2Common.dll) são ambíguos — passe o caminho completo do projeto ou uma substring única no parâmetro program.",
    ],
    sourceRef:
      "docs/prompts/CROSS_VERSION_FUNCTION_MATCHING (movido) · ghidra_scripts/Propagate_*.java",
  },
  {
    slug: "descoberta-de-codigo-orfao",
    title: "Descoberta de código órfão",
    goal: "Encontrar código real que o auto-analisador não transformou em função (lacunas entre funções conhecidas).",
    prerequisites: ["Binário importado e analisado"],
    steps: [
      {
        title: "Rodar a análise",
        detail:
          "Garanta que a análise padrão (e os analisadores configurados) rodou sobre o binário — lacunas só fazem sentido depois dela.",
        tools: ["run_analysis", "configure_analyzer"],
      },
      {
        title: "Procurar lacunas e código morto",
        detail:
          "find_code_gaps aponta bytes executáveis entre funções conhecidas; find_dead_code aponta funções sem chamadores (candidatas a callbacks por ponteiro ou a órfãs).",
        tools: ["find_code_gaps", "find_dead_code"],
      },
      {
        title: "Criar e nomear as funções encontradas",
        detail:
          "Transforme as lacunas em funções, nomeie com as convenções e incorpore-as ao fluxo de documentação normal.",
        tools: ["find_functions", "rename_function", "set_comment"],
      },
    ],
    pitfalls: [
      "Código morto nem sempre é lixo: vtables e callbacks por ponteiro não aparecem no grafo de chamadas estático.",
    ],
    sourceRef: "README.md — ZeroXrefScanner / FindFunctionsAfterPadding (ghidra_scripts)",
  },
  {
    slug: "emulacao-pcode",
    title: "Emulação de P-code",
    goal: "Executar uma função isoladamente no emulador do Ghidra para resolver hashes de API ou validar lógica sem rodar o binário.",
    prerequisites: [
      "Função alvo identificada",
      "Conhecer o estado esperado dos registradores/argumentos",
    ],
    steps: [
      {
        title: "Entender a função alvo",
        detail:
          "Decompile e leia o P-code para saber o que a função espera (argumentos, memória, registradores).",
        tools: ["force_decompile", "get_function_pcode"],
      },
      {
        title: "Emular a função",
        detail:
          "emulate_function executa a função no emulador P-code com o estado inicial que você fornecer.",
        tools: ["emulate_function"],
      },
      {
        title: "Resolver hashes de API em lote",
        detail:
          "Para malware/obfuscação que resolve APIs por hash em runtime, emulate_hash_batch emula as rotinas de resolução e recupera os nomes reais.",
        tools: ["emulate_hash_batch"],
      },
    ],
    pitfalls: [
      "Emulação isolada não inicializa o ambiente real do binário (TLS, importações) — alimente o estado inicial explicitamente.",
    ],
    sourceRef: "README.md — Emulation Service",
  },
  {
    slug: "depuracao-dinamica",
    title: "Depuração dinâmica (TraceRmi)",
    goal: "Anexar a um processo vivo, correlacionar endereços estáticos↔dinâmicos e rastrear execução com breakpoints.",
    prerequisites: [
      "Debugger target configurado no Ghidra (TraceRmi)",
      "Opt-in do bridge: GHIDRA_DEBUGGER_URL definido ou GHIDRA_DEBUGGER_TOOLS=1",
    ],
    steps: [
      {
        title: "Verificar o estado do debugger",
        detail:
          "Confirme status, módulos carregados e o mapeamento estático↔dinâmico antes de qualquer controle de execução.",
        tools: [
          "debugger/status",
          "debugger/modules",
          "debugger/static_to_dynamic",
          "debugger/dynamic_to_static",
        ],
      },
      {
        title: "Lançar/anexar e controlar execução",
        detail:
          "launch (ou launch_offers para escolher o alvo), interrupt/resume/step para dirigir a execução.",
        tools: [
          "debugger/launch",
          "debugger/launch_offers",
          "debugger/interrupt",
          "debugger/resume",
          "debugger/step",
        ],
      },
      {
        title: "Inspecionar estado",
        detail: "Leia registradores, memória e stack trace no contexto vivo do processo.",
        tools: [
          "debugger/registers",
          "debugger/read_memory",
          "debugger/stack_trace",
          "debugger/traces",
        ],
      },
      {
        title: "Pontos de parada",
        detail:
          "Liste, defina e remova breakpoints para parar em endereços de interesse (use a correlação estática↔dinâmica para traduzir endereços).",
        tools: [
          "debugger/list_breakpoints",
          "debugger/set_breakpoint",
          "debugger/remove_breakpoint",
        ],
      },
    ],
    pitfalls: [
      "As 22 ferramentas de debugger são opt-in e OFF por padrão: sem GHIDRA_DEBUGGER_URL (loopback) elas não aparecem no schema.",
      "O proxy de debugger recusa URLs não-loopback — para um servidor remoto, faça forward da porta.",
    ],
    sourceRef: "python/bridge_mcp_ghidra/debugger.py · docs/connection-triage-guide.md",
  },
];

export function getWorkflow(slug: string): Workflow | undefined {
  return WORKFLOWS.find((w) => w.slug === slug);
}
