export interface RuleArticle {
  ref: string;
  text: string;
  items?: string[];
  updated?: string;
}

export interface RuleChapter {
  id: string;
  chapter: string;
  title: string;
  articles: RuleArticle[];
}

export const ruleChapters: RuleChapter[] = [
  {
    id: "evento",
    chapter: "Capítulo I",
    title: "Do evento e de suas finalidades",
    articles: [
      {
        ref: "Art. 1º",
        text: "A Gincana Arena Comp 2026, promovida pelo Curso de Engenharia de Software da UEPA, Campus Parauapebas, é atividade acadêmica de caráter integrador e avaliativo, aberta a todas as turmas do curso.",
      },
      {
        ref: "Art. 2º",
        text: "São finalidades da Arena Comp 2026:",
        items: [
          "Estimular a aplicação prática dos conteúdos em situações de tempo e recursos limitados.",
          "Promover a integração entre discentes de diferentes turmas e períodos.",
          "Desenvolver trabalho em equipe, comunicação técnica, liderança e resolução de problemas.",
          "Valorizar o protagonismo discente na organização e na execução das atividades.",
        ],
      },
      {
        ref: "Art. 3º",
        text: "A participação é facultativa para todos os discentes regularmente matriculados nas turmas envolvidas. Pode gerar pontuação extra na N2 do período letivo de 2026, exclusivamente nas disciplinas regulares ainda não consolidadas, sem prejuízo para quem optar por não participar.",
      },
    ],
  },
  {
    id: "data-local",
    chapter: "Capítulo II",
    title: "Da data, do local e da programação",
    articles: [
      {
        ref: "Art. 4º",
        text: "A Arena Comp 2026 será realizada nos dias 03 e 04 de dezembro de 2026, nas dependências da UEPA, Campus Parauapebas. No dia 03 a programação começa às 19h30; no dia 04, das 14h às 17h.",
        updated:
          "Data e horário atualizados. O texto original do regimento indicava 26 e 27 de novembro, das 14h às 17h.",
      },
      {
        ref: "Art. 4º, § 1º",
        text: "Não há credenciamento: a composição dos grupos já consta da lista de participantes. No início de cada dia é registrada apenas a presença, por lista de frequência, com a indicação do grupo.",
      },
      {
        ref: "Art. 4º, § 2º",
        text: "O grupo que não se apresentar ao local do desafio até 10 minutos após o horário previsto para o início será considerado ausente naquele desafio, com pontuação zero.",
      },
      {
        ref: "Art. 4º, § 3º",
        text: "Os horários podem sofrer ajustes de até 15 minutos por decisão da comissão organizadora.",
      },
      {
        ref: "Art. 5º",
        text: "A programação dos dois dias obedece ao cronograma publicado na página Cronograma.",
      },
    ],
  },
  {
    id: "participantes",
    chapter: "Capítulo III",
    title: "Dos participantes e dos grupos",
    articles: [
      {
        ref: "Art. 6º",
        text: "Os participantes são distribuídos em 6 grupos previamente definidos pela comissão organizadora, com integrantes de todas as turmas, conforme a lista do Anexo V e os murais do curso.",
      },
      {
        ref: "Art. 6º, § 1º",
        text: "A composição dos grupos é definitiva. É vedada a troca de integrantes, salvo deferimento expresso da comissão organizadora mediante justificativa formal.",
      },
      {
        ref: "Art. 6º, § 2º",
        text: "Cada discente deve procurar os demais integrantes do seu grupo assim que a lista for divulgada. Organização interna, preparação para os desafios, grito de guerra e camisetas são responsabilidade do próprio grupo.",
      },
      {
        ref: "Art. 6º, § 3º",
        text: "Recomenda-se que cada grupo crie um canal próprio de comunicação e faça encontros de preparação antes do evento.",
      },
      {
        ref: "Art. 6º, § 4º",
        text: "Quem optar por não participar deve comunicar ao líder do grupo em até 10 dias corridos após a divulgação da lista.",
      },
      {
        ref: "Art. 7º",
        text: "Cada grupo indica, em até 5 dias corridos após a divulgação da lista, um líder e um vice-líder, responsáveis pela interlocução com a comissão e pela entrega da ficha do Anexo VI.",
      },
      {
        ref: "Art. 8º",
        text: "Cada grupo define livremente quais integrantes atuam em cada desafio, observados os limites de participantes dos anexos.",
      },
      {
        ref: "Art. 8º, parágrafo único",
        text: "Nenhum discente pode representar grupo diverso daquele em que foi alocado, sob pena de anulação da pontuação do desafio para ambos os grupos envolvidos.",
      },
    ],
  },
  {
    id: "identidade",
    chapter: "Capítulo IV",
    title: "Da identidade visual e do grito de guerra",
    articles: [
      {
        ref: "Art. 9º",
        text: "Cada grupo pode confeccionar camisetas na cor e com o nome atribuídos no Anexo V.",
      },
      {
        ref: "Art. 9º, § 1º",
        text: "A confecção é responsabilidade do grupo; recomendam-se soluções de baixo custo, como camiseta lisa com estampa, pintura ou aplicação em tecido.",
      },
      {
        ref: "Art. 9º, § 2º",
        text: "É permitido o uso de mascote, logotipo e acessórios na cor do grupo, vedado qualquer conteúdo ofensivo, discriminatório, obsceno ou político-partidário.",
      },
      {
        ref: "Art. 10",
        text: "Cada grupo elabora um grito de guerra autoral, com duração máxima de 1 minuto, apresentado na abertura do primeiro dia. Grito e uniformização compõem o quesito Identidade e Torcida.",
      },
    ],
  },
  {
    id: "desafios",
    chapter: "Capítulo V",
    title: "Dos desafios",
    articles: [
      {
        ref: "Art. 11",
        text: "A Arena Comp 2026 tem 4 desafios, nesta ordem:",
        items: [
          "Algoritmo Natural, no primeiro dia (Anexo I).",
          "Maratona de Programação, no primeiro e no segundo dia (final) (Anexo II).",
          "Perguntas e Respostas, no segundo dia (Anexo III).",
          "Robótica, no segundo dia (Anexo IV).",
        ],
      },
      {
        ref: "Art. 12",
        text: "Os anexos integram o regimento e trazem formato, regras específicas, materiais, critérios de avaliação e orientações de preparação de cada desafio. Enunciados, perguntas e percursos só são revelados no momento de cada desafio.",
      },
    ],
  },
  {
    id: "pontuacao",
    chapter: "Capítulo VI",
    title: "Da pontuação, da classificação e da nota",
    articles: [
      { ref: "Art. 13", text: "Cada desafio distribui pontos conforme a colocação: 100, 80, 60, 50, 40 e 30 pontos, do 1º ao 6º lugar." },
      {
        ref: "Art. 14",
        text: "Bonificação de até 20 pontos em Identidade e Torcida: até 10 pela uniformização completa nos dois dias e até 10 pelo grito de guerra, avaliados por criatividade, originalidade, sincronia e adequação ao ambiente acadêmico.",
      },
      { ref: "Art. 15", text: "A classificação geral é a soma dos pontos dos 4 desafios mais a bonificação, até o máximo de 420 pontos." },
      { ref: "Art. 16", text: "Os critérios de desempate da classificação geral estão na página Pontuação." },
      {
        ref: "Art. 17",
        text: "A Arena Comp vale até 1,0 ponto extra na N2, conforme a classificação final do grupo. A pontuação é estendida aos integrantes presentes nos dois dias; quem participar de um só dia recebe 50%; quem não participar não recebe pontuação extra, sem prejuízo à nota regular nem à frequência.",
      },
    ],
  },
  {
    id: "conduta",
    chapter: "Capítulo VII",
    title: "Da conduta e das penalidades",
    articles: [
      {
        ref: "Art. 18",
        text: "Os participantes devem manter conduta ética e respeitosa. São vedadas:",
        items: [
          "Consulta a materiais, dispositivos ou pessoas não autorizados pelo respectivo anexo.",
          "Uso de ferramentas de inteligência artificial generativa nos desafios em que houver vedação expressa.",
          "Cópia de solução de outro grupo ou compartilhamento de resposta durante a prova.",
          "Ofensa, intimidação, discriminação ou qualquer forma de assédio contra participantes, avaliadores ou público.",
          "Dano ao patrimônio da instituição ou aos equipamentos disponibilizados.",
        ],
      },
      {
        ref: "Art. 19",
        text: "Conforme a gravidade, o grupo fica sujeito a:",
        items: [
          "Advertência verbal registrada em ata.",
          "Desconto de 10 a 50 pontos na pontuação geral.",
          "Desclassificação no desafio em curso, com pontuação zero.",
          "Desclassificação da gincana, sem prejuízo das medidas disciplinares institucionais.",
        ],
      },
    ],
  },
  {
    id: "recursos",
    chapter: "Capítulo VIII",
    title: "Da comissão organizadora e dos recursos",
    articles: [
      {
        ref: "Art. 20",
        text: "A comissão organizadora é composta pelo docente responsável, por docentes convidados e por discentes monitores. Ela conduz os desafios, avalia e apura os resultados.",
      },
      {
        ref: "Art. 21",
        text: "Recursos devem ser apresentados por escrito pelo líder ou vice-líder, em até 20 minutos após a divulgação do resultado de cada desafio. A comissão julga antes do resultado final, e suas decisões são irrecorríveis.",
      },
    ],
  },
  {
    id: "disposicoes",
    chapter: "Capítulo IX",
    title: "Das disposições finais",
    articles: [
      { ref: "Art. 22", text: "A inscrição do grupo, formalizada pela entrega da ficha do Anexo VI, implica a aceitação integral do regimento." },
      { ref: "Art. 23", text: "Os participantes autorizam o registro fotográfico e audiovisual do evento e sua divulgação em canais institucionais da UEPA para fins acadêmicos." },
      { ref: "Art. 24", text: "Os casos omissos são resolvidos pela comissão organizadora." },
      { ref: "Art. 25", text: "O regimento entra em vigor na data de sua divulgação (Parauapebas, 21 de setembro de 2026)." },
    ],
  },
];
