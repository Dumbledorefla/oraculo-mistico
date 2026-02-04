export interface TarotCard {
  id: number;
  name: string;
  arcana: "major" | "minor";
  number: number;
  meaning: string;
  reversed: string;
  interpretation: string;
  advice: string;
  image?: string;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: "O Louco",
    arcana: "major",
    number: 0,
    meaning: "Novo começo, liberdade, espontaneidade",
    reversed: "Imprudência, irresponsabilidade, risco",
    interpretation: "O Louco representa um novo capítulo em sua vida. É hora de abraçar a incerteza com coragem e confiança. Esta carta convida você a deixar para trás o medo e dar um salto de fé em direção ao desconhecido.",
    advice: "Confie em sua intuição e não tenha medo de tomar riscos calculados. O universo está o apoiando em sua jornada de transformação."
  },
  {
    id: 1,
    name: "O Mago",
    arcana: "major",
    number: 1,
    meaning: "Manifestação, criatividade, poder pessoal",
    reversed: "Manipulação, ilusão, falta de confiança",
    interpretation: "O Mago simboliza seu poder de manifestar realidade através da vontade e intenção. Você possui todas as ferramentas necessárias para criar a vida que deseja. Esta é uma carta de empoderamento e ação consciente.",
    advice: "Use seus talentos e habilidades para criar mudanças positivas. Você tem o poder dentro de si para transformar seus sonhos em realidade."
  },
  {
    id: 2,
    name: "A Sacerdotisa",
    arcana: "major",
    number: 2,
    meaning: "Intuição, sabedoria, conhecimento oculto",
    reversed: "Ignorância, superficialidade, desconexão",
    interpretation: "A Sacerdotisa convida você a ouvir sua voz interior e confiar em sua intuição. Há sabedoria profunda dentro de você, esperando ser descoberta. Esta carta fala de mistério, magia e conhecimento espiritual.",
    advice: "Medite e conecte-se com sua intuição. As respostas que você procura já estão dentro de você, esperando para serem reveladas."
  },
  {
    id: 3,
    name: "A Imperatriz",
    arcana: "major",
    number: 3,
    meaning: "Fertilidade, abundância, criatividade",
    reversed: "Bloqueio criativo, dependência, infertilidade",
    interpretation: "A Imperatriz representa abundância, fertilidade e criatividade em todas as suas formas. Ela convida você a nutrir seus projetos, relacionamentos e a si mesmo. É uma carta de crescimento, beleza e manifestação material.",
    advice: "Cultive seus talentos criativos e permita que a abundância flua em sua vida. Cuide de si mesmo e dos outros com amor e generosidade."
  },
  {
    id: 4,
    name: "O Imperador",
    arcana: "major",
    number: 4,
    meaning: "Autoridade, estrutura, poder",
    reversed: "Fraqueza, indecisão, falta de controle",
    interpretation: "O Imperador simboliza autoridade, liderança e estrutura. Ele representa seu poder pessoal e capacidade de tomar decisões firmes. Esta carta fala de estabelecer ordem, disciplina e comando em sua vida.",
    advice: "Assuma o controle de sua vida com confiança. Use sua autoridade e liderança para criar a estrutura que você precisa para prosperar."
  },
  {
    id: 5,
    name: "O Hierofante",
    arcana: "major",
    number: 5,
    meaning: "Tradição, espiritualidade, aprendizado",
    reversed: "Rebelião, dogmatismo, conformismo",
    interpretation: "O Hierofante representa sabedoria espiritual, tradição e aprendizado. Ele convida você a buscar orientação, educação e conexão com o sagrado. Esta carta fala de valores, ética e busca de significado.",
    advice: "Busque conhecimento e orientação espiritual. Conecte-se com suas crenças e valores mais profundos para guiar seu caminho."
  },
  {
    id: 6,
    name: "Os Amantes",
    arcana: "major",
    number: 6,
    meaning: "Amor, harmonia, relacionamentos",
    reversed: "Desarmonia, separação, conflito",
    interpretation: "Os Amantes representam amor profundo, conexão e harmonia. Não se trata apenas de romance, mas de qualquer conexão significativa em sua vida. Esta carta fala de escolhas do coração e alinhamento com seu verdadeiro eu.",
    advice: "Honre seus relacionamentos e conexões. Escolha com o coração e busque harmonia em todas as suas relações."
  },
  {
    id: 7,
    name: "O Carro",
    arcana: "major",
    number: 7,
    meaning: "Vitória, determinação, controle",
    reversed: "Derrota, falta de direção, perda de controle",
    interpretation: "O Carro simboliza vitória, movimento e determinação. Você está no caminho certo e tem o poder de alcançar seus objetivos. Esta carta fala de ação, força de vontade e progresso inevitável.",
    advice: "Mantenha o foco em seus objetivos e avance com determinação. Você tem o poder de vencer qualquer obstáculo que se apresente."
  },
  {
    id: 8,
    name: "A Força",
    arcana: "major",
    number: 8,
    meaning: "Força interior, coragem, paciência",
    reversed: "Fraqueza, medo, falta de confiança",
    interpretation: "A Força representa sua força interior, coragem e capacidade de superar desafios. Não é sobre força bruta, mas sobre paciência, compaixão e domínio de si mesmo. Esta carta fala de poder gentil e resilência.",
    advice: "Confie em sua força interior. Você tem a capacidade de superar qualquer desafio com paciência, compaixão e determinação."
  },
  {
    id: 9,
    name: "O Eremita",
    arcana: "major",
    number: 9,
    meaning: "Introspecção, busca espiritual, sabedoria",
    reversed: "Isolamento, medo, perda de propósito",
    interpretation: "O Eremita convida você a buscar respostas dentro de si mesmo. É hora de se retirar, refletir e buscar sabedoria profunda. Esta carta fala de jornada interior, meditação e iluminação espiritual.",
    advice: "Tire um tempo para introspecção e reflexão. A sabedoria que você procura está dentro de você, esperando para ser descoberta."
  },
  {
    id: 10,
    name: "A Roda da Fortuna",
    arcana: "major",
    number: 10,
    meaning: "Ciclos, destino, mudança",
    reversed: "Má sorte, resistência à mudança, controle",
    interpretation: "A Roda da Fortuna representa os ciclos da vida e o fluxo do destino. Tudo está em movimento constante. Esta carta fala de oportunidades, sincronicidade e aceitação das mudanças inevitáveis.",
    advice: "Aceite os ciclos da vida e confie no fluxo do universo. Cada mudança traz novas oportunidades e crescimento."
  },
  {
    id: 11,
    name: "A Justiça",
    arcana: "major",
    number: 11,
    meaning: "Justiça, equilíbrio, verdade",
    reversed: "Injustiça, desequilíbrio, desonestidade",
    interpretation: "A Justiça representa equilíbrio, verdade e consequências. Tudo o que você faz retorna a você. Esta carta fala de responsabilidade, honestidade e alinhamento com a verdade.",
    advice: "Aja com integridade e honestidade. O universo recompensa aqueles que vivem de acordo com seus valores e verdade."
  },
  {
    id: 12,
    name: "O Enforcado",
    arcana: "major",
    number: 12,
    meaning: "Sacrifício, perspectiva nova, suspensão",
    reversed: "Resistência, rigidez, falta de aceitação",
    interpretation: "O Enforcado convida você a mudar de perspectiva. Às vezes, é necessário soltar o controle e ver as coisas de um ângulo diferente. Esta carta fala de sacrifício voluntário, rendição e transformação.",
    advice: "Esteja disposto a deixar ir e ver as coisas de uma nova perspectiva. A mudança que você procura pode vir através da rendição, não da luta."
  },
  {
    id: 13,
    name: "A Morte",
    arcana: "major",
    number: 13,
    meaning: "Transformação, fim, novo começo",
    reversed: "Resistência, estagnação, medo da mudança",
    interpretation: "A Morte não representa morte literal, mas transformação profunda. Algo em sua vida está terminando para dar lugar ao novo. Esta carta fala de renovação, ciclos e renascimento.",
    advice: "Abraçe a mudança e deixe ir o que não serve mais. Cada fim é um novo começo, e a transformação é necessária para o crescimento."
  },
  {
    id: 14,
    name: "A Temperança",
    arcana: "major",
    number: 14,
    meaning: "Equilíbrio, harmonia, moderação",
    reversed: "Desequilíbrio, excesso, conflito",
    interpretation: "A Temperança representa equilíbrio, harmonia e moderação em todas as coisas. Ela convida você a encontrar o ponto médio e viver com sabedoria. Esta carta fala de integração e paz interior.",
    advice: "Busque equilíbrio em todas as áreas de sua vida. A harmonia vem quando você integra todos os aspectos de si mesmo com sabedoria."
  },
  {
    id: 15,
    name: "O Diabo",
    arcana: "major",
    number: 15,
    meaning: "Limitações, escravidão, materialismo",
    reversed: "Libertação, quebra de correntes, transcendência",
    interpretation: "O Diabo representa as limitações que você criou para si mesmo. Ele fala de padrões negativos, vícios e apegos que o prendem. Esta carta convida você a reconhecer e libertar-se dessas correntes.",
    advice: "Reconheça as limitações que você criou e trabalhe para se libertar delas. Você tem o poder de quebrar as correntes que o prendem."
  },
  {
    id: 16,
    name: "A Torre",
    arcana: "major",
    number: 16,
    meaning: "Destruição, revelação, caos",
    reversed: "Evitar colapso, resistência, adiamento",
    interpretation: "A Torre representa destruição necessária e revelação. Estruturas falsas estão desabando para dar lugar à verdade. Esta carta fala de crise, mas também de libertação e clareza.",
    advice: "Aceite a destruição como parte do processo de reconstrução. Às vezes, é necessário que tudo desabe para que você possa construir algo melhor."
  },
  {
    id: 17,
    name: "A Estrela",
    arcana: "major",
    number: 17,
    meaning: "Esperança, inspiração, espiritualidade",
    reversed: "Desesperança, desespero, perda de fé",
    interpretation: "A Estrela representa esperança, inspiração e conexão com o divino. Ela convida você a acreditar em seus sonhos e confiar no universo. Esta carta fala de guia espiritual e iluminação.",
    advice: "Mantenha a esperança e confie em seus sonhos. O universo está o guiando em direção ao seu verdadeiro propósito."
  },
  {
    id: 18,
    name: "A Lua",
    arcana: "major",
    number: 18,
    meaning: "Ilusão, intuição, inconsciente",
    reversed: "Clareza, verdade, iluminação",
    interpretation: "A Lua representa o mundo do inconsciente, intuição e ilusão. Ela convida você a explorar seus medos e sonhos. Esta carta fala de magia, mistério e o poder da imaginação.",
    advice: "Confie em sua intuição e explore seu mundo interior. As respostas que você procura podem estar ocultas em seus sonhos e intuição."
  },
  {
    id: 19,
    name: "O Sol",
    arcana: "major",
    number: 19,
    meaning: "Sucesso, alegria, vitalidade",
    reversed: "Fracasso, tristeza, bloqueio",
    interpretation: "O Sol representa sucesso, alegria e vitalidade. Ele traz luz e clareza a todas as coisas. Esta carta fala de vitória, felicidade e energia positiva em sua vida.",
    advice: "Celebre seus sucessos e permita que a alegria brilhe em sua vida. Você está em um período de crescimento e realização."
  },
  {
    id: 20,
    name: "O Julgamento",
    arcana: "major",
    number: 20,
    meaning: "Despertar, julgamento, chamado",
    reversed: "Auto-dúvida, adiamento, falta de direção",
    interpretation: "O Julgamento representa um despertar importante e um chamado para ação. É hora de avaliar sua vida e responder ao seu chamado. Esta carta fala de transformação e novo propósito.",
    advice: "Responda ao seu chamado e esteja pronto para uma transformação importante. É hora de despertar para seu verdadeiro propósito."
  },
  {
    id: 21,
    name: "O Mundo",
    arcana: "major",
    number: 21,
    meaning: "Conclusão, completude, realização",
    reversed: "Incompletude, falta de fechamento, busca",
    interpretation: "O Mundo representa conclusão, completude e realização. Você completou um ciclo importante. Esta carta fala de sucesso, integração e novo começo em um nível superior.",
    advice: "Celebre sua realização e prepare-se para um novo ciclo. Você completou uma jornada importante e está pronto para o próximo capítulo."
  }
];

export function getCardById(id: number): TarotCard | undefined {
  return majorArcana.find(card => card.id === id);
}

export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
