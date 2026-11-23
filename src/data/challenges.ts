import type { Challenge, ChallengeSlug, TeamId } from "@/types";

const placementScoring =
  "A colocação no desafio é convertida em pontos para a classificação geral: 100 (1º), 80 (2º), 60 (3º), 50 (4º), 40 (5º) e 30 (6º), conforme o art. 13.";

/** Conteúdo dos anexos I a IV do regimento. */
export const challenges: Challenge[] = [
  {
    slug: "algoritmo-natural",
    order: 1,
    annex: "Anexo I",
    name: "Algoritmo Natural",
    shortName: "Algoritmo",
    tagline: "Escreva instruções tão precisas que uma pessoa de fora consiga executá-las sem perguntar nada.",
    description:
      "Desafio de lógica e comunicação em que cada equipe elabora um algoritmo em linguagem natural para orientar uma pessoa externa à equipe a executar uma tarefa concreta.",
    objective:
      "Redigir instruções claras, completas, organizadas e não ambíguas. O executor de outra equipe segue o algoritmo literalmente, sem improvisar, interpretar ou corrigir comandos.",
    day: "03 de dezembro",
    dayShort: "03 de dezembro",
    facts: [
      { label: "Integrantes", value: "4" },
      { label: "Duração", value: "60 min" },
      { label: "Rodadas", value: "2 × 30 min" },
      { label: "Para escrever", value: "10 min por rodada" },
    ],
    format: [
      "Cada equipe tem 4 integrantes: 2 programadores, 1 conferente e 1 executor.",
      "O executor da equipe executa o algoritmo produzido por outra equipe.",
      "A atividade dura 60 minutos, em duas rodadas de 30 minutos com tarefas distintas.",
      "Em cada rodada, a comissão entrega a tarefa somente aos programadores, que têm 10 minutos para escrever o algoritmo em folha padronizada.",
      "Durante a elaboração, o conferente revisa se as instruções estão completas, claras, ordenadas e detalhadas o bastante, sem alterar a tarefa proposta.",
      "Depois da revisão, o algoritmo vai para o executor de outra equipe, que não tem acesso à tarefa original nem ao resultado esperado.",
    ],
    rules: [
      "O executor segue literalmente as instruções: não pode pedir esclarecimentos, improvisar, completar informações ausentes ou corrigir mentalmente erros do algoritmo.",
      "Durante a execução não é permitida comunicação verbal, gestual ou visual entre o executor e os autores do algoritmo.",
      "A execução é cronometrada e acompanhada por um avaliador, que registra o cumprimento das instruções e os erros ou ambiguidades.",
      "A execução termina quando o executor conclui todas as instruções ou quando o avaliador determina que não é mais possível prosseguir.",
      "O desempenho individual do executor não é usado como critério de avaliação da equipe que escreveu o algoritmo.",
      "Exemplos de tarefas: montar uma sequência de peças, reproduzir um desenho geométrico, percorrer um trajeto com obstáculos ou organizar objetos segundo um critério.",
    ],
    criteria: [
      { name: "Corretude do resultado", weight: "40%", description: "Correspondência entre o resultado obtido pelo executor e o resultado esperado." },
      { name: "Clareza e ausência de ambiguidade", weight: "30%", description: "Precisão, objetividade, organização e ausência de instruções com interpretações diferentes." },
      { name: "Eficiência do algoritmo", weight: "20%", description: "Alcançar o resultado com uma quantidade adequada de instruções, sem etapas desnecessárias ou repetitivas." },
      { name: "Tempo de execução", weight: "10%", description: "Tempo que o executor leva para concluir a tarefa seguindo as instruções." },
    ],
    criteriaNote: "O tempo só é contabilizado quando a tarefa é concluída corretamente.",
    scoring: [placementScoring],
    penalties: [
      "Não há penalidades específicas neste anexo. Valem as regras de conduta e penalidades gerais (arts. 18 e 19).",
      "O grupo que não se apresentar até 10 minutos após o horário previsto é considerado ausente e recebe pontuação zero (art. 4º, § 2º).",
    ],
    tiebreak: [
      "Eficiência do algoritmo: vence quem alcançar o resultado corretamente com o menor número de instruções.",
      "Clareza e ausência de ambiguidade: instruções mais claras, precisas e sem interpretações distintas.",
      "Tempo de execução: executor que concluir corretamente no menor tempo.",
    ],
    preparation: [
      "Decomponha tarefas do dia a dia em passos elementares, como preparar um lanche, trocar uma lâmpada ou dobrar uma folha.",
      "Pratique a escrita de algoritmos em português estruturado, com atenção à sequência, às condições e às repetições.",
      "Revise os algoritmos antes da execução procurando ambiguidades, informações ausentes, instruções incompletas e dependência de conhecimento prévio.",
      "Use comandos e termos precisos. Evite expressões vagas ou subjetivas que gerem interpretações diferentes.",
      "Lembre que quem executa é de outra equipe e não conhece a tarefa original nem o seu raciocínio.",
    ],
  },
  {
    slug: "maratona",
    order: 2,
    annex: "Anexo II",
    name: "Maratona de Programação",
    shortName: "Maratona",
    tagline: "Cinco problemas, um computador e 75 minutos. Vence quem resolve mais.",
    description:
      "Competição de resolução de problemas de programação inspirada na Maratona de Programação da SBC. As soluções são julgadas automaticamente por casos de teste.",
    objective: "Resolver o maior número possível de problemas dentro do tempo estabelecido.",
    day: "03 de dezembro (etapa inicial) e 04 de dezembro (final)",
    dayShort: "03 e 04 de dezembro",
    facts: [
      { label: "Integrantes", value: "3" },
      { label: "Computador", value: "1 por equipe" },
      { label: "Duração", value: "75 min" },
      { label: "Problemas", value: "5" },
    ],
    format: [
      "3 integrantes por equipe, com 1 computador por equipe.",
      "Duração de 75 minutos, com caderno de 5 problemas de dificuldade crescente.",
      "Linguagens aceitas: C, C++, Python e Java.",
      "Entrada e saída padrão, conforme a especificação de cada problema.",
      "O desafio acontece no primeiro e no segundo dia (final), conforme o art. 11, II.",
    ],
    rules: [
      "Material de consulta permitido: apenas anotações impressas trazidas pelo grupo.",
      "É vedada a consulta à internet.",
      "É vedado o uso de mensageiros.",
      "É vedado o uso de ferramentas de inteligência artificial generativa.",
      "Cada submissão incorreta gera penalidade de 20 minutos, computada apenas nos problemas efetivamente resolvidos.",
    ],
    criteria: [
      { name: "Problemas resolvidos", description: "Vence a equipe que resolver o maior número de problemas." },
      { name: "Desempate por tempo", description: "Em caso de empate, prevalece a menor soma dos tempos de resolução acrescida das penalidades." },
    ],
    scoring: [placementScoring],
    penalties: [
      "Submissão incorreta: +20 minutos, contados só nos problemas que a equipe resolveu.",
      "O uso de IA generativa, internet ou mensageiros é conduta vedada (art. 18) e sujeita o grupo às penalidades do art. 19.",
    ],
    topics: [
      "Leitura e escrita de dados",
      "Tipos primitivos e operadores",
      "Estruturas condicionais",
      "Estruturas de repetição",
      "Vetores e matrizes",
      "Manipulação de strings",
      "Funções",
      "Recursão simples",
      "Ordenação",
      "Divisibilidade",
      "Contagem",
      "Números primos",
    ],
    preparation: [
      "Resolva listas em juízes online como Beecrowd, Codeforces e AtCoder, com foco nos níveis iniciante e intermediário.",
      "Divida papéis: quem lê e traduz o enunciado, quem digita a solução e quem confere os casos de teste.",
      "Monte um caderno impresso com trechos de código frequentes, como leitura de entrada, ordenação e busca.",
      "Treine com cronômetro: a gestão do tempo costuma pesar mais que o domínio da linguagem.",
      "Comece sempre pelo problema mais fácil do caderno, já que conta o número de problemas resolvidos.",
    ],
    practiceLinks: [
      { label: "Beecrowd", href: "https://judge.beecrowd.com/" },
      { label: "Codeforces", href: "https://codeforces.com/" },
      { label: "AtCoder", href: "https://atcoder.jp/" },
    ],
  },
  {
    slug: "perguntas-e-respostas",
    order: 3,
    annex: "Anexo III",
    name: "Perguntas e Respostas",
    shortName: "Torta na Cara",
    tagline: "Duelos de conhecimento no formato Torta na Cara. Errou? Escolha: perder pontos ou levar a torta.",
    description:
      "Competição de conhecimentos no formato Torta na Cara. Os seis grupos disputam perguntas sobre os conteúdos do curso em duelos, buscando responder corretamente antes do adversário.",
    objective: "Acumular a maior pontuação interna ao longo dos duelos.",
    day: "04 de dezembro, 14h10 às 15h10",
    dayShort: "04 de dezembro",
    facts: [
      { label: "Na bancada", value: "5" },
      { label: "Duração", value: "~60 min" },
      { label: "Rodadas", value: "5 × 3 duelos" },
      { label: "Por pergunta", value: "10 pts" },
    ],
    format: [
      "Cada grupo tem 5 integrantes na bancada e pode fazer revezamento entre as rodadas.",
      "Duração aproximada de 60 minutos.",
      "6 equipes, 5 rodadas e 3 duelos por rodada.",
      "Cada duelo tem 3 perguntas, todas valendo 10 pontos.",
      "Sempre que possível, os representantes devem ser alternados, permitindo a participação de diferentes membros.",
    ],
    rules: [
      "O mediador apresenta a pergunta e, após o sinal, dois participantes disputam o direito de resposta pelo dispositivo de sinalização definido pela organização.",
      "Quem sinalizar primeiro responde.",
      "Se errar, escolhe na hora entre perder 10 pontos para a equipe ou receber a torta na cara, sem perda de pontos.",
      "Em seguida, o adversário pode responder à mesma pergunta. Se acertar, ganha 10 pontos; se errar, faz a mesma escolha.",
      "Se o adversário optar por não responder, não há pontuação adicional e a pergunta é encerrada.",
      "Não é permitida consulta a materiais, dispositivos eletrônicos ou pessoas externas ao grupo.",
    ],
    criteria: [
      { name: "Pontuação interna acumulada", description: "As equipes são classificadas pela soma dos pontos obtidos nas perguntas ao longo dos duelos." },
    ],
    scoringTable: [
      { situation: "Resposta correta", points: "+10" },
      { situation: "Resposta incorreta, escolhendo perder pontos", points: "−10" },
      { situation: "Resposta incorreta, escolhendo a torta", points: "0" },
      { situation: "Aplicação inadequada da torta, com violência ou humilhação pública", points: "−20 para quem aplicou" },
    ],
    scoring: [
      "A pontuação interna é acumulada ao longo dos confrontos e define a classificação no desafio.",
      placementScoring,
    ],
    penalties: [
      "Aplicação inadequada da torta: −20 pontos na pontuação interna para a equipe que aplicou, sem prejuízo das penalidades do art. 19.",
    ],
    tiebreak: [
      "Maior número de respostas corretas.",
      "Menor número de respostas incorretas, independentemente da consequência escolhida.",
      "Maior número de duelos vencidos (pontuação superior à do adversário no duelo).",
      "Maior pontuação no confronto direto entre as equipes empatadas.",
      "Sorteio público pela comissão organizadora.",
    ],
    topics: [
      "Lógica de programação e algoritmos",
      "Estruturas de dados e complexidade",
      "Banco de dados, modelagem conceitual, lógica e SQL",
      "Engenharia de software, processos e requisitos",
      "Testes e metodologias ágeis",
      "Redes de computadores",
      "Sistemas operacionais",
      "Arquitetura de computadores",
      "História da computação, pioneiros e cultura tecnológica",
    ],
    preparation: [
      "Revise conteúdos, slides, livros recomendados e atividades das disciplinas.",
      "Distribua os temas entre os integrantes para cobrir áreas diferentes.",
      "Pratique perguntas de resposta rápida: conceitos, definições, identificação de estruturas e pequenos problemas.",
      "Treine a tomada de decisão rápida entre os integrantes.",
      "Revise especialmente conceitos fundamentais e termos técnicos.",
    ],
  },
  {
    slug: "robotica",
    order: 4,
    annex: "Anexo IV",
    name: "Robótica",
    shortName: "Robótica",
    tagline: "Robôs autônomos em duas provas: subir a rampa e vencer o sumô.",
    description:
      "Desafio prático de montagem, programação e operação de robôs autônomos. As equipes integram hardware, sensores, motores e lógica de controle para cumprir duas tarefas.",
    objective:
      "Cumprir as tarefas Subida de Rampa e Batalha de Robôs (Robô Sumô) com o robô operando de forma autônoma.",
    day: "04 de dezembro, 15h25 às 16h40",
    dayShort: "04 de dezembro",
    facts: [
      { label: "Por bancada", value: "4" },
      { label: "Cronometrado", value: "40 min" },
      { label: "Calibração", value: "10 min" },
      { label: "Tentativas", value: "3 oficiais" },
    ],
    format: [
      "Grupos de 4 integrantes por bancada.",
      "Duração das etapas cronometradas: 40 minutos, sendo 10 minutos de calibração e testes e 30 minutos de rodadas oficiais.",
      "O robô deve operar de forma autônoma durante as provas.",
      "Cada grupo tem 3 tentativas oficiais; vale a melhor tentativa em cada tarefa.",
      "A organização pode definir previamente a ordem das duas provas.",
    ],
    rules: [
      "Não é permitido controle remoto durante as rodadas oficiais.",
      "Intervenção humana durante uma prova interrompe a tentativa.",
      "Na rampa, a tentativa só é concluída se o robô superar a inclinação e alcançar a área de chegada sem ser empurrado, levantado ou reposicionado.",
      "No sumô, o robô deve permanecer autônomo e usar sensores e programação para localizar, atacar e tentar expulsar o adversário.",
      "Nenhum componente pode ultrapassar os limites estabelecidos pela organização.",
    ],
    criteria: [
      { name: "Subida da rampa", description: "Capacidade de superar a inclinação sem intervenção." },
      { name: "Robô Sumô", description: "Estratégia, detecção, ataque e permanência na arena." },
      { name: "Organização", description: "Montagem, cabeamento e programação." },
    ],
    criteriaNote:
      "A equipe que cumprir pelo menos um dos dois desafios é considerada apta à classificação na prova de Robótica. Quem não cumprir nenhum é desclassificado da prova e não recebe os pontos no placar geral. A pontuação e os critérios específicos são definidos e aplicados pelos docentes responsáveis.",
    scoring: [placementScoring],
    penalties: [
      "Toque no robô durante a tentativa: reinício obrigatório da rodada, com desconto de 20% do tempo restante.",
      "Saída da arena no Sumô: derrota na rodada.",
      "Intervenção humana durante uma prova: tentativa considerada interrompida.",
      "Alteração física do robô durante uma rodada oficial: não permitida, salvo autorização da organização.",
    ],
    materials: [
      {
        title: "Componentes",
        items: [
          "Placa microcontroladora",
          "Chassi",
          "Motores",
          "Rodas",
          "Driver de motor",
          "Sensores de linha",
          "Sensor de distância",
          "Bateria",
          "Cabos e conectores",
        ],
      },
      {
        title: "Reutilizáveis ou recicláveis",
        items: [
          "Papelão e papel-cartão",
          "Garrafas e embalagens plásticas",
          "Tampas e recipientes plásticos",
          "Palitos de madeira e canudos",
          "Tubos de papelão",
          "EVA reutilizado",
          "Espumas e materiais de embalagem",
          "Fitas, barbantes e outros materiais de fixação",
        ],
      },
    ],
    topics: [
      "Ambiente de desenvolvimento da placa microcontroladora",
      "Estrutura básica de um programa embarcado",
      "Sensores de linha",
      "Sensor de distância",
      "Acionamento e controle de motores",
      "Driver de motor",
      "Calibração de sensores",
      "Controle liga/desliga",
      "Controle proporcional",
      "Estratégias de busca e detecção",
      "Tração e distribuição de peso",
      "Estratégias de robô sumô",
    ],
    preparation: [
      "Teste previamente cada uma das duas tarefas, de preferência com cronômetro para simular as condições da competição.",
      "Materiais recicláveis podem ser usados em suportes, proteção de componentes, estruturas auxiliares, estabilização e adaptações do chassi, desde que não ofereçam risco. Eles também contam como criatividade e sustentabilidade.",
    ],
    extraSections: [
      {
        id: "rampa",
        title: "Tarefa 1: subida de rampa",
        body: [
          "O robô deve superar uma superfície inclinada e alcançar a área de chegada sem intervenção humana. A prova avalia principalmente tração, torque, distribuição de peso, velocidade e controle dos motores.",
        ],
        steps: [
          {
            title: "Preparação mecânica",
            items: [
              "Verifique se todas as rodas estão firmemente fixadas.",
              "Confirme se os motores estão corretamente presos ao chassi.",
              "Verifique se as rodas têm contato adequado com o piso.",
              "Distribua os componentes e a bateria de maneira equilibrada.",
              "Evite concentrar o peso em uma única extremidade.",
              "Organize os cabos para que não interfiram na movimentação.",
            ],
          },
          {
            title: "Teste dos motores",
            items: [
              "Acione os dois motores simultaneamente.",
              "Verifique se o robô se desloca em linha reta.",
              "Se desviar para um lado, ajuste individualmente a velocidade dos motores.",
              "Teste diferentes níveis de velocidade.",
              "Encontre uma velocidade com equilíbrio entre força de tração e estabilidade.",
            ],
          },
          {
            title: "Programação",
            items: [
              "Configure os motores para a movimentação para frente.",
              "Defina uma velocidade adequada para a subida.",
              "Programe o robô para iniciar o movimento ao receber o comando de partida.",
              "Mantenha velocidade suficiente para não parar no início da rampa.",
              "Se os componentes permitirem, use sensores para identificar a aproximação ou a chegada à rampa.",
              "Programe a parada após atingir a área determinada.",
            ],
          },
          {
            title: "Testes na rampa",
            items: [
              "Posicione o robô antes da área de inclinação e inicie o movimento.",
              "Observe se as rodas perdem tração.",
              "Verifique se o robô mantém a trajetória.",
              "Ajuste a velocidade dos motores, aumentando ou reduzindo gradualmente.",
              "Confirme que o robô completa a subida sem intervenção.",
            ],
          },
        ],
        items: [
          "Reduzir a velocidade durante a subida",
          "Aumentar a potência dos motores",
          "Distribuir melhor a massa",
          "Ajustar individualmente a velocidade dos motores",
          "Posicionar a bateria de forma estratégica",
          "Programar velocidades diferentes para trechos diferentes",
        ],
      },
      {
        id: "sumo",
        title: "Tarefa 2: batalha de robôs (Robô Sumô)",
        body: [
          "O robô autônomo compete numa arena de sumô e usa estratégias de detecção, movimentação, ataque e defesa para empurrar o adversário para fora da área delimitada.",
        ],
        steps: [
          {
            title: "Preparação mecânica",
            items: [
              "Verifique a fixação dos motores e a aderência das rodas.",
              "Posicione a bateria para favorecer a estabilidade.",
              "Mantenha o chassi próximo ao solo.",
              "Verifique se não há peças soltas.",
              "Confirme que nenhum componente ultrapassa os limites da organização.",
            ],
          },
          {
            title: "Configuração dos sensores",
            items: [
              "Detecção do adversário: o sensor de distância identifica a presença do oponente.",
              "Detecção do limite da arena: os sensores identificam a aproximação da borda da arena.",
            ],
          },
          {
            title: "Lógica de decisão",
            items: [
              "Detectou a borda? Recue imediatamente e gire para voltar ao centro.",
              "Detectou o adversário? Avance em direção a ele e aumente a velocidade para atacar.",
              "Não detectou o adversário? Execute uma busca, girando ou fazendo movimentos alternados até encontrá-lo.",
            ],
          },
          {
            title: "Estratégia de ataque",
            items: [
              "Posicione o robô na arena e programe a busca pelo adversário.",
              "Ao detectar o oponente, avance.",
              "Mantenha o ataque enquanto o adversário estiver à frente.",
              "Se ele sair do campo de detecção, volte ao modo de busca.",
            ],
          },
          {
            title: "Estratégia de defesa",
            items: [
              "Aproximação do adversário.",
              "Perda de contato com o adversário.",
              "Aproximação da borda.",
              "Tentativa de ataque lateral.",
              "Necessidade de recuo e reposicionamento.",
            ],
          },
          {
            title: "Testes",
            items: [
              "Teste os sensores individualmente.",
              "Teste a detecção da borda e do adversário.",
              "Teste o ataque, o recuo e o giro de reposicionamento.",
              "Simule diferentes posições do adversário.",
              "Ajuste a velocidade e o tempo de resposta.",
            ],
          },
        ],
      },
    ],
  },
];

export const challengeBySlug = Object.fromEntries(challenges.map((c) => [c.slug, c])) as Record<
  ChallengeSlug,
  Challenge
>;

/** Confrontos do Desafio Perguntas e Respostas (Anexo III, item 3). */
export const quizRounds: { round: number; duels: [TeamId, TeamId][] }[] = [
  { round: 1, duels: [["ada", "grace"], ["pressman", "sommerville"], ["kurose", "turing"]] },
  { round: 2, duels: [["ada", "pressman"], ["grace", "kurose"], ["sommerville", "turing"]] },
  { round: 3, duels: [["ada", "sommerville"], ["grace", "turing"], ["pressman", "kurose"]] },
  { round: 4, duels: [["ada", "kurose"], ["grace", "sommerville"], ["pressman", "turing"]] },
  { round: 5, duels: [["ada", "turing"], ["grace", "pressman"], ["sommerville", "kurose"]] },
];
