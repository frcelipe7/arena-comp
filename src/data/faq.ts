import type { FaqCategory } from "@/types";

/**
 * Perguntas frequentes. Respostas baseadas no regimento e nas datas atualizadas
 * (03 e 04 de dezembro de 2026). Para dúvidas não previstas, oriente a procurar
 * a comissão organizadora (art. 24).
 */
export const faq: FaqCategory[] = [
  {
    id: "gerais",
    title: "Informações gerais",
    items: [
      {
        id: "quando",
        question: "Quando acontecerá a Arena Comp?",
        answer: ["Nos dias 03 e 04 de dezembro de 2026, quinta e sexta-feira."],
        links: [{ label: "Ver cronograma", href: "/cronograma" }],
      },
      {
        id: "onde",
        question: "Onde acontecerá a competição?",
        answer: ["Na Universidade do Estado do Pará (UEPA), Campus Parauapebas."],
      },
      {
        id: "horario",
        question: "Qual será o horário?",
        answer: [
          "No dia 03 de dezembro a programação começa às 19h30. Os horários de cada atividade desse dia ainda serão confirmados pela organização.",
          "No dia 04, as atividades vão das 14h às 17h, com registro de presença e montagem das bancadas a partir das 13h40.",
        ],
        links: [{ label: "Ver cronograma completo", href: "/cronograma" }],
      },
      {
        id: "quem-participa",
        question: "Quem pode participar?",
        answer: [
          "Os discentes regularmente matriculados nas turmas envolvidas do curso de Engenharia de Software. A gincana é aberta a todas as turmas do curso.",
        ],
      },
      {
        id: "obrigatoria",
        question: "A participação é obrigatória?",
        answer: [
          "Não. A participação é facultativa e não gera prejuízo à nota regular nem à frequência de quem optar por não participar.",
          "Quem decidir não participar deve comunicar o líder do seu grupo em até 10 dias corridos após a divulgação da lista (art. 6º, § 4º).",
        ],
      },
      {
        id: "credenciamento",
        question: "Preciso fazer credenciamento ou inscrição individual?",
        answer: [
          "Não há credenciamento: a composição dos grupos já consta na lista elaborada pela comissão. No início de cada dia é registrada apenas a presença, com a indicação do grupo (art. 4º, § 1º).",
        ],
      },
    ],
  },
  {
    id: "equipes",
    title: "Equipes",
    items: [
      {
        id: "quantas-equipes",
        question: "Quantas equipes participarão?",
        answer: ["Seis equipes: Grace, Pressman, Kurose, Turing, Sommerville e Ada."],
        links: [{ label: "Conhecer as equipes", href: "/equipes" }],
      },
      {
        id: "escolher-equipe",
        question: "Posso escolher minha equipe?",
        answer: ["Não. As equipes são previamente definidas pela comissão organizadora, com integrantes de todas as turmas."],
      },
      {
        id: "trocar-equipe",
        question: "Posso trocar de equipe?",
        answer: [
          "A troca de integrantes não é permitida, salvo autorização expressa da comissão organizadora mediante justificativa formal.",
          "Nenhum discente pode representar um grupo diferente daquele em que foi alocado, sob pena de anulação da pontuação do desafio para os dois grupos (art. 8º, parágrafo único).",
        ],
      },
      {
        id: "integrantes",
        question: "Como descubro quem são os integrantes da minha equipe?",
        answer: [
          "Consulte a página Equipes: cada card traz a lista de integrantes. Você também pode digitar seu nome na busca do topo do site. A lista também é divulgada nos murais do curso.",
        ],
        links: [{ label: "Ir para Equipes", href: "/equipes" }],
      },
      {
        id: "lider",
        question: "Cada equipe precisa ter um líder?",
        answer: [
          "Sim. Cada grupo indica um líder e um vice-líder em até 5 dias corridos após a divulgação da lista. Eles fazem a comunicação com a comissão organizadora e entregam a ficha do Anexo VI.",
        ],
      },
      {
        id: "camiseta",
        question: "Minha equipe precisa ter camiseta?",
        answer: [
          "Não é obrigatório, mas a uniformização completa nos dois dias vale até 10 pontos de bonificação. A camiseta deve usar a cor e o nome do grupo; mascote, logotipo e acessórios na cor do grupo são permitidos, sem conteúdo ofensivo, discriminatório, obsceno ou político-partidário.",
        ],
        links: [{ label: "Ver bonificação", href: "/pontuacao#bonificacao" }],
      },
    ],
  },
  {
    id: "desafios",
    title: "Desafios",
    items: [
      {
        id: "quantos-desafios",
        question: "Quantos desafios existem?",
        answer: ["Quatro: Algoritmo Natural, Maratona de Programação, Perguntas e Respostas e Robótica."],
        links: [{ label: "Ver desafios", href: "/desafios" }],
      },
      {
        id: "pessoas-por-desafio",
        question: "Quantas pessoas podem participar de cada desafio?",
        answer: [
          "Algoritmo Natural: 4 integrantes. Maratona de Programação: 3 integrantes. Perguntas e Respostas: 5 integrantes na bancada. Robótica: 4 integrantes por bancada.",
          "Cada grupo escolhe livremente quem atua em cada desafio, respeitando esses limites (art. 8º).",
        ],
      },
      {
        id: "linguagens",
        question: "Quais linguagens são aceitas na Maratona?",
        answer: ["C, C++, Python e Java."],
        links: [{ label: "Maratona de Programação", href: "/desafios/maratona" }],
      },
      {
        id: "internet-maratona",
        question: "Posso usar a internet durante a Maratona de Programação?",
        answer: ["Não. A consulta é restrita às anotações impressas trazidas pelo grupo. Mensageiros também são proibidos."],
      },
      {
        id: "ia",
        question: "Posso usar inteligência artificial nos desafios?",
        answer: [
          "Na Maratona de Programação, o uso de ferramentas de inteligência artificial generativa é expressamente proibido.",
          "Nos demais desafios, valem as regras específicas de cada atividade. O regimento proíbe o uso de IA generativa nos desafios em que houver vedação expressa e a consulta a materiais, dispositivos ou pessoas não autorizados pelo anexo correspondente (art. 18). Em caso de dúvida, consulte a comissão organizadora.",
        ],
      },
      {
        id: "robotica-como",
        question: "Como funciona o desafio de Robótica?",
        answer: [
          "As equipes participam de duas tarefas: subida de rampa e batalha de robôs no formato Sumô. Os robôs devem operar de forma autônoma nas provas oficiais, com 3 tentativas por equipe.",
        ],
        links: [{ label: "Desafio de Robótica", href: "/desafios/robotica" }],
      },
      {
        id: "controle-remoto",
        question: "É permitido controlar o robô remotamente?",
        answer: ["Não. O controle remoto não é permitido durante as rodadas oficiais."],
      },
      {
        id: "materiais-robotica",
        question: "Quais materiais são permitidos na Robótica?",
        answer: [
          "Placa microcontroladora, chassi, motores, rodas, driver de motor, sensores de linha, sensor de distância, bateria, cabos e conectores. Também podem ser usados materiais reutilizáveis ou recicláveis, como papelão, EVA, embalagens e materiais de fixação, desde que não ofereçam risco.",
        ],
        links: [{ label: "Lista completa", href: "/desafios/robotica#materiais" }],
      },
      {
        id: "temas-perguntas",
        question: "O que cai no desafio de Perguntas e Respostas?",
        answer: [
          "Lógica e algoritmos, estruturas de dados e complexidade, banco de dados e SQL, engenharia de software (processos, requisitos, testes e metodologias ágeis), redes de computadores, sistemas operacionais, arquitetura de computadores e história da computação.",
        ],
      },
      {
        id: "torta",
        question: "Como funciona a Torta na Cara?",
        answer: [
          "Dois participantes disputam o direito de responder pelo dispositivo de sinalização. Quem sinaliza primeiro responde: acerto vale +10 pontos. Se errar, escolhe entre perder 10 pontos ou levar a torta na cara (0 pontos). Depois, o adversário pode responder à mesma pergunta ou passar.",
        ],
        links: [{ label: "Regras e confrontos", href: "/desafios/perguntas-e-respostas" }],
      },
    ],
  },
  {
    id: "pontuacao",
    title: "Pontuação",
    items: [
      {
        id: "primeiro-lugar",
        question: "Quantos pontos vale o primeiro lugar?",
        answer: ["100 pontos em cada desafio. Depois: 80, 60, 50, 40 e 30 pontos do 2º ao 6º lugar."],
        links: [{ label: "Sistema de pontuação", href: "/pontuacao" }],
      },
      {
        id: "total",
        question: "Quantos pontos podem ser conquistados no total?",
        answer: ["Até 420 pontos: 400 dos quatro desafios e até 20 da bonificação Identidade e Torcida."],
      },
      {
        id: "bonificacao",
        question: "Como funciona a bonificação?",
        answer: [
          "São até 20 pontos extras: até 10 pela uniformização completa nos dois dias e até 10 pelo grito de guerra, avaliados por criatividade, originalidade, sincronia e adequação ao ambiente acadêmico.",
        ],
      },
      {
        id: "nota-extra",
        question: "A Arena Comp vale nota extra?",
        answer: [
          "Sim. A competição vale até 1,0 ponto extra na N2, conforme a classificação final do grupo e as regras de presença do regimento. Vale apenas nas disciplinas regulares que ainda não tenham sido consolidadas.",
        ],
        links: [{ label: "Tabela de conversão", href: "/pontuacao#nota-extra" }],
      },
      {
        id: "um-dia",
        question: "E se eu participar de apenas um dia?",
        answer: ["Você terá direito a 50% da pontuação extra obtida pelo seu grupo."],
      },
      {
        id: "empate",
        question: "Como é decidido um empate na classificação geral?",
        answer: [
          "Pela ordem: maior pontuação na Maratona, depois na Robótica, em Perguntas e Respostas, no Algoritmo Natural, em Identidade e Torcida e, por fim, sorteio público.",
        ],
      },
    ],
  },
  {
    id: "regras",
    title: "Regras e penalidades",
    items: [
      {
        id: "atraso",
        question: "O que acontece se minha equipe chegar atrasada?",
        answer: [
          "O grupo que não se apresentar ao local do desafio até 10 minutos após o horário previsto para o início é considerado ausente naquele desafio e recebe pontuação zero.",
        ],
      },
      {
        id: "consulta",
        question: "Posso consultar materiais durante os desafios?",
        answer: [
          "Depende do desafio. Na Maratona, só anotações impressas trazidas pelo grupo. Em Perguntas e Respostas, não é permitida nenhuma consulta a materiais, dispositivos eletrônicos ou pessoas externas ao grupo. Consulte as regras de cada atividade.",
        ],
      },
      {
        id: "penalidades",
        question: "Como funciona a aplicação de penalidades?",
        answer: [
          "Conforme a gravidade, o grupo pode receber advertência verbal registrada em ata, desconto de 10 a 50 pontos na pontuação geral, desclassificação no desafio em curso ou desclassificação da gincana.",
        ],
        links: [{ label: "Conduta e penalidades", href: "/regulamento#conduta" }],
      },
      {
        id: "recurso",
        question: "Posso contestar o resultado de um desafio?",
        answer: [
          "Sim. O líder ou o vice-líder apresenta recurso por escrito em até 20 minutos após a divulgação do resultado de cada desafio. A comissão julga antes do resultado final, e a decisão é irrecorrível.",
        ],
      },
      {
        id: "fotos",
        question: "O evento será fotografado?",
        answer: [
          "Sim. Os participantes autorizam o registro fotográfico e audiovisual e sua divulgação em canais institucionais da UEPA para fins acadêmicos (art. 23).",
        ],
        links: [{ label: "Galeria", href: "/galeria" }],
      },
      {
        id: "outros",
        question: "Minha dúvida não está aqui. O que faço?",
        answer: [
          "Os casos omissos são resolvidos pela comissão organizadora (art. 24). Fale com o líder do seu grupo, que faz a comunicação com a comissão.",
        ],
      },
    ],
  },
];
