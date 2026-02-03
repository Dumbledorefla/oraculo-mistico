/**
 * Dados de Horóscopo e Astrologia
 */

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: "Fogo" | "Terra" | "Ar" | "Água";
  quality: "Cardinal" | "Fixo" | "Mutável";
  ruling: string;
  dateRange: string;
  traits: string[];
  description: string;
  compatibility: string[];
  dailyMessages: string[];
  loveMessages: string[];
  workMessages: string[];
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: "aries",
    name: "Áries",
    symbol: "♈",
    element: "Fogo",
    quality: "Cardinal",
    ruling: "Marte",
    dateRange: "21/03 - 19/04",
    traits: ["Corajoso", "Determinado", "Confiante", "Entusiasta", "Otimista"],
    description: "Áries é o primeiro signo do zodíaco, representando novos começos e a energia pioneira. Arianos são conhecidos por sua coragem, determinação e espírito competitivo. São líderes naturais que não têm medo de enfrentar desafios.",
    compatibility: ["Leão", "Sagitário", "Gêmeos", "Aquário"],
    dailyMessages: [
      "Hoje é um dia para tomar iniciativas. Sua energia está em alta e você pode conquistar o que deseja com determinação.",
      "O universo favorece sua coragem hoje. Não hesite em dar o primeiro passo em direção aos seus objetivos.",
      "Sua energia pioneira está em destaque. Use-a para iniciar novos projetos ou resolver pendências.",
      "A competitividade pode surgir hoje. Canalize essa energia de forma construtiva e evite conflitos desnecessários.",
      "Momento favorável para liderança. Assuma o controle das situações e inspire os outros com seu exemplo."
    ],
    loveMessages: [
      "No amor, sua paixão está intensa. Demonstre seus sentimentos com autenticidade e coragem.",
      "Relacionamentos pedem iniciativa. Se está interessado em alguém, tome a frente e expresse seus sentimentos.",
      "A energia de Marte favorece encontros apaixonados. Aproveite para reacender a chama do romance."
    ],
    workMessages: [
      "No trabalho, sua liderança será reconhecida. Assuma projetos desafiadores com confiança.",
      "Momento propício para negociações. Sua assertividade será um trunfo nas discussões profissionais.",
      "Novas oportunidades podem surgir. Esteja atento e pronto para agir rapidamente."
    ]
  },
  {
    id: "taurus",
    name: "Touro",
    symbol: "♉",
    element: "Terra",
    quality: "Fixo",
    ruling: "Vênus",
    dateRange: "20/04 - 20/05",
    traits: ["Confiável", "Paciente", "Prático", "Devotado", "Responsável"],
    description: "Touro é um signo de terra regido por Vênus, representando estabilidade, prazer e valores materiais. Taurinos são conhecidos por sua paciência, determinação e apreço pelas coisas boas da vida.",
    compatibility: ["Virgem", "Capricórnio", "Câncer", "Peixes"],
    dailyMessages: [
      "Hoje é um dia para cultivar estabilidade. Foque em construir bases sólidas para seus projetos.",
      "Vênus favorece os prazeres da vida. Permita-se desfrutar de momentos de conforto e beleza.",
      "Sua paciência será testada, mas mantenha-se firme. A perseverança trará resultados.",
      "Questões financeiras estão em destaque. É um bom momento para planejar investimentos.",
      "Valorize suas conquistas e cuide do que já construiu. A gratidão atrai mais abundância."
    ],
    loveMessages: [
      "No amor, busque estabilidade e segurança. Relacionamentos sólidos são favorecidos.",
      "Vênus intensifica sua sensualidade. Aproveite para criar momentos românticos e prazerosos.",
      "A lealdade é sua maior virtude amorosa. Demonstre seu compromisso através de ações concretas."
    ],
    workMessages: [
      "No trabalho, sua persistência será recompensada. Continue focado em seus objetivos.",
      "Projetos de longo prazo são favorecidos. Invista em planejamento e execução metódica.",
      "Questões financeiras profissionais pedem atenção. Analise propostas com cuidado."
    ]
  },
  {
    id: "gemini",
    name: "Gêmeos",
    symbol: "♊",
    element: "Ar",
    quality: "Mutável",
    ruling: "Mercúrio",
    dateRange: "21/05 - 20/06",
    traits: ["Gentil", "Curioso", "Adaptável", "Comunicativo", "Versátil"],
    description: "Gêmeos é um signo de ar regido por Mercúrio, representando comunicação, curiosidade e versatilidade. Geminianos são conhecidos por sua mente ágil, sociabilidade e capacidade de adaptação.",
    compatibility: ["Libra", "Aquário", "Áries", "Leão"],
    dailyMessages: [
      "Mercúrio favorece a comunicação hoje. Expresse suas ideias e conecte-se com pessoas interessantes.",
      "Sua curiosidade está aguçada. Aproveite para aprender algo novo ou explorar diferentes perspectivas.",
      "Versatilidade é sua força hoje. Adapte-se às mudanças com leveza e criatividade.",
      "Conversas importantes podem surgir. Esteja aberto ao diálogo e à troca de ideias.",
      "Sua mente está especialmente ágil. Use essa clareza para resolver problemas complexos."
    ],
    loveMessages: [
      "No amor, a comunicação é fundamental. Converse abertamente sobre seus sentimentos e expectativas.",
      "Encontros sociais podem trazer surpresas românticas. Mantenha-se aberto a novas conexões.",
      "A leveza é essencial nos relacionamentos hoje. Evite dramas e cultive momentos divertidos."
    ],
    workMessages: [
      "No trabalho, suas habilidades de comunicação brilham. Apresentações e negociações são favorecidas.",
      "Networking pode abrir portas importantes. Conecte-se com colegas e parceiros.",
      "Projetos que exigem versatilidade são ideais para você hoje. Mostre sua capacidade de adaptação."
    ]
  },
  {
    id: "cancer",
    name: "Câncer",
    symbol: "♋",
    element: "Água",
    quality: "Cardinal",
    ruling: "Lua",
    dateRange: "21/06 - 22/07",
    traits: ["Intuitivo", "Leal", "Emotivo", "Protetor", "Imaginativo"],
    description: "Câncer é um signo de água regido pela Lua, representando emoções, família e proteção. Cancerianos são conhecidos por sua sensibilidade, intuição e forte conexão com o lar.",
    compatibility: ["Escorpião", "Peixes", "Touro", "Virgem"],
    dailyMessages: [
      "A Lua intensifica suas emoções hoje. Cuide de si mesmo e respeite seus sentimentos.",
      "Questões familiares estão em destaque. Dedique tempo aos que você ama.",
      "Sua intuição está especialmente aguçada. Confie em seus instintos nas decisões importantes.",
      "O lar é seu refúgio hoje. Crie um ambiente acolhedor e nutritivo para si mesmo.",
      "Memórias do passado podem surgir. Use-as como aprendizado, não como prisão."
    ],
    loveMessages: [
      "No amor, sua sensibilidade é um presente. Conecte-se emocionalmente com quem você ama.",
      "Demonstre seu carinho através de gestos de cuidado. Pequenas atenções fazem grande diferença.",
      "Relacionamentos familiares influenciam sua vida amorosa. Busque equilíbrio entre as duas áreas."
    ],
    workMessages: [
      "No trabalho, use sua intuição para tomar decisões. Ela raramente falha.",
      "Ambientes de trabalho harmoniosos favorecem sua produtividade. Cultive boas relações.",
      "Projetos que envolvem cuidado com pessoas são especialmente favorecidos."
    ]
  },
  {
    id: "leo",
    name: "Leão",
    symbol: "♌",
    element: "Fogo",
    quality: "Fixo",
    ruling: "Sol",
    dateRange: "23/07 - 22/08",
    traits: ["Criativo", "Generoso", "Caloroso", "Alegre", "Dramático"],
    description: "Leão é um signo de fogo regido pelo Sol, representando criatividade, autoexpressão e liderança. Leoninos são conhecidos por seu carisma, generosidade e desejo de brilhar.",
    compatibility: ["Áries", "Sagitário", "Gêmeos", "Libra"],
    dailyMessages: [
      "O Sol ilumina seu caminho hoje. É hora de brilhar e mostrar seus talentos ao mundo.",
      "Sua criatividade está em alta. Expresse-se através da arte, do trabalho ou das relações.",
      "Generosidade atrai abundância. Compartilhe sua luz com os outros sem esperar nada em troca.",
      "O reconhecimento que você busca está próximo. Continue sendo autêntico e dedicado.",
      "Sua presença magnética atrai oportunidades. Use seu carisma de forma positiva."
    ],
    loveMessages: [
      "No amor, sua paixão e generosidade encantam. Demonstre seus sentimentos com grandeza.",
      "Romance e diversão andam juntos hoje. Planeje momentos especiais com quem você ama.",
      "Seu brilho natural atrai admiradores. Esteja aberto a receber e dar amor."
    ],
    workMessages: [
      "No trabalho, sua liderança natural se destaca. Assuma projetos que permitam você brilhar.",
      "Criatividade é seu diferencial profissional. Proponha ideias inovadoras e ousadas.",
      "Reconhecimento profissional está favorecido. Seus esforços serão notados."
    ]
  },
  {
    id: "virgo",
    name: "Virgem",
    symbol: "♍",
    element: "Terra",
    quality: "Mutável",
    ruling: "Mercúrio",
    dateRange: "23/08 - 22/09",
    traits: ["Analítico", "Trabalhador", "Prático", "Leal", "Gentil"],
    description: "Virgem é um signo de terra regido por Mercúrio, representando análise, serviço e perfeição. Virginianos são conhecidos por sua atenção aos detalhes, praticidade e desejo de ajudar.",
    compatibility: ["Touro", "Capricórnio", "Câncer", "Escorpião"],
    dailyMessages: [
      "Mercúrio favorece a análise e organização. Use sua mente prática para resolver pendências.",
      "Detalhes fazem a diferença hoje. Sua atenção meticulosa será recompensada.",
      "Saúde e bem-estar pedem atenção. Cuide do corpo e da mente com carinho.",
      "Serviço aos outros traz satisfação. Ajude quem precisa sem esperar reconhecimento.",
      "Perfeccionismo pode ser um aliado ou inimigo. Busque excelência, mas aceite imperfeições."
    ],
    loveMessages: [
      "No amor, demonstre carinho através de ações práticas. Gestos de serviço são sua linguagem.",
      "Evite criticar demais seu parceiro. Foque nas qualidades e aceite as diferenças.",
      "Relacionamentos saudáveis exigem cuidado mútuo. Equilibre dar e receber."
    ],
    workMessages: [
      "No trabalho, sua eficiência é reconhecida. Continue entregando qualidade e precisão.",
      "Organização é fundamental para o sucesso hoje. Planeje suas tarefas com cuidado.",
      "Projetos que exigem análise detalhada são ideais para você. Mostre sua competência."
    ]
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "♎",
    element: "Ar",
    quality: "Cardinal",
    ruling: "Vênus",
    dateRange: "23/09 - 22/10",
    traits: ["Diplomático", "Justo", "Social", "Cooperativo", "Gracioso"],
    description: "Libra é um signo de ar regido por Vênus, representando equilíbrio, harmonia e relacionamentos. Librianos são conhecidos por sua diplomacia, senso estético e busca por justiça.",
    compatibility: ["Gêmeos", "Aquário", "Leão", "Sagitário"],
    dailyMessages: [
      "Vênus favorece harmonia e beleza. Busque equilíbrio em todas as áreas da vida.",
      "Relacionamentos estão em destaque. Cultive conexões harmoniosas e significativas.",
      "Sua diplomacia será necessária hoje. Use-a para mediar conflitos e criar paz.",
      "Decisões importantes pedem ponderação. Analise todos os lados antes de escolher.",
      "Beleza e arte nutrem sua alma. Cerque-se de coisas que elevam seu espírito."
    ],
    loveMessages: [
      "No amor, busque parceria verdadeira. Relacionamentos equilibrados são favorecidos.",
      "Romance e beleza andam juntos. Planeje momentos especiais em ambientes agradáveis.",
      "Comunicação harmoniosa fortalece os laços. Expresse-se com gentileza e ouça com atenção."
    ],
    workMessages: [
      "No trabalho, parcerias são favorecidas. Colabore com colegas para melhores resultados.",
      "Sua capacidade de mediar conflitos será valorizada. Use sua diplomacia.",
      "Projetos criativos e estéticos são ideais para você hoje."
    ]
  },
  {
    id: "scorpio",
    name: "Escorpião",
    symbol: "♏",
    element: "Água",
    quality: "Fixo",
    ruling: "Plutão",
    dateRange: "23/10 - 21/11",
    traits: ["Determinado", "Corajoso", "Leal", "Intenso", "Estratégico"],
    description: "Escorpião é um signo de água regido por Plutão, representando transformação, intensidade e poder. Escorpianos são conhecidos por sua profundidade emocional, determinação e magnetismo.",
    compatibility: ["Câncer", "Peixes", "Virgem", "Capricórnio"],
    dailyMessages: [
      "Plutão intensifica suas emoções. Use essa energia para transformações profundas.",
      "Sua intuição está aguçada. Confie em seus instintos sobre pessoas e situações.",
      "Segredos podem vir à tona. Esteja preparado para lidar com verdades ocultas.",
      "Transformação é sua palavra-chave. Deixe ir o que não serve mais.",
      "Seu magnetismo está em alta. Use seu poder de atração de forma consciente."
    ],
    loveMessages: [
      "No amor, intensidade e profundidade marcam o momento. Conexões superficiais não satisfazem.",
      "Ciúmes e possessividade podem surgir. Trabalhe a confiança em si e no outro.",
      "Transformações nos relacionamentos são favorecidas. Permita-se evoluir junto com seu par."
    ],
    workMessages: [
      "No trabalho, sua determinação é inabalável. Nada pode impedir você de alcançar seus objetivos.",
      "Investigação e análise profunda são favorecidas. Descubra o que está por trás das aparências.",
      "Poder e influência estão ao seu alcance. Use-os com responsabilidade."
    ]
  },
  {
    id: "sagittarius",
    name: "Sagitário",
    symbol: "♐",
    element: "Fogo",
    quality: "Mutável",
    ruling: "Júpiter",
    dateRange: "22/11 - 21/12",
    traits: ["Otimista", "Aventureiro", "Filosófico", "Generoso", "Idealista"],
    description: "Sagitário é um signo de fogo regido por Júpiter, representando expansão, sabedoria e aventura. Sagitarianos são conhecidos por seu otimismo, amor pela liberdade e busca por significado.",
    compatibility: ["Áries", "Leão", "Libra", "Aquário"],
    dailyMessages: [
      "Júpiter expande suas possibilidades. Sonhe grande e acredite em seus objetivos.",
      "Aventura e aprendizado estão em destaque. Explore novos horizontes físicos ou mentais.",
      "Seu otimismo é contagiante. Compartilhe sua visão positiva com os outros.",
      "Questões filosóficas ou espirituais pedem reflexão. Busque significado mais profundo.",
      "Liberdade é essencial para você. Não se prenda a situações que limitam seu crescimento."
    ],
    loveMessages: [
      "No amor, busque parceiros que compartilhem seu amor pela aventura e crescimento.",
      "Relacionamentos que permitem liberdade são favorecidos. Evite possessividade.",
      "Viagens e novas experiências fortalecem os laços. Explore o mundo junto com quem você ama."
    ],
    workMessages: [
      "No trabalho, expansão é a palavra-chave. Busque oportunidades de crescimento.",
      "Projetos internacionais ou educacionais são favorecidos. Amplie seus horizontes.",
      "Seu entusiasmo inspira a equipe. Lidere pelo exemplo e pela visão."
    ]
  },
  {
    id: "capricorn",
    name: "Capricórnio",
    symbol: "♑",
    element: "Terra",
    quality: "Cardinal",
    ruling: "Saturno",
    dateRange: "22/12 - 19/01",
    traits: ["Responsável", "Disciplinado", "Autocontrolado", "Ambicioso", "Prático"],
    description: "Capricórnio é um signo de terra regido por Saturno, representando estrutura, ambição e responsabilidade. Capricornianos são conhecidos por sua disciplina, perseverança e foco em objetivos de longo prazo.",
    compatibility: ["Touro", "Virgem", "Escorpião", "Peixes"],
    dailyMessages: [
      "Saturno favorece disciplina e trabalho árduo. Seus esforços serão recompensados.",
      "Objetivos de longo prazo estão em destaque. Mantenha o foco e a perseverança.",
      "Responsabilidades podem pesar, mas você é capaz de lidar com elas. Confie em si mesmo.",
      "Estrutura e organização são fundamentais hoje. Planeje com cuidado.",
      "Reconhecimento profissional está próximo. Continue dedicado e paciente."
    ],
    loveMessages: [
      "No amor, busque estabilidade e compromisso. Relacionamentos sérios são favorecidos.",
      "Demonstre amor através de ações concretas e responsabilidade. Palavras não bastam.",
      "Paciência é necessária nos relacionamentos. Construa aos poucos, com solidez."
    ],
    workMessages: [
      "No trabalho, sua ambição e disciplina se destacam. Promoções e reconhecimento são possíveis.",
      "Projetos de longo prazo exigem sua atenção. Planeje cada etapa com cuidado.",
      "Liderança responsável é sua marca. Assuma posições de autoridade com confiança."
    ]
  },
  {
    id: "aquarius",
    name: "Aquário",
    symbol: "♒",
    element: "Ar",
    quality: "Fixo",
    ruling: "Urano",
    dateRange: "20/01 - 18/02",
    traits: ["Progressista", "Original", "Independente", "Humanitário", "Inventivo"],
    description: "Aquário é um signo de ar regido por Urano, representando inovação, originalidade e humanitarismo. Aquarianos são conhecidos por sua visão de futuro, independência e desejo de mudar o mundo.",
    compatibility: ["Gêmeos", "Libra", "Áries", "Sagitário"],
    dailyMessages: [
      "Urano traz insights inovadores. Esteja aberto a ideias revolucionárias e mudanças.",
      "Sua originalidade é seu maior trunfo. Não tenha medo de ser diferente.",
      "Causas humanitárias pedem sua atenção. Contribua para um mundo melhor.",
      "Independência é essencial, mas não se isole. Conecte-se com pessoas que pensam como você.",
      "O futuro está em suas mãos. Visualize o mundo que deseja criar e aja para manifestá-lo."
    ],
    loveMessages: [
      "No amor, busque parceiros que respeitem sua independência e originalidade.",
      "Amizade é a base dos melhores relacionamentos para você. Cultive conexões mentais.",
      "Evite relacionamentos convencionais se eles não te satisfazem. Seja autêntico."
    ],
    workMessages: [
      "No trabalho, inovação é sua marca. Proponha soluções criativas e fora do comum.",
      "Tecnologia e projetos futuristas são favorecidos. Explore novas possibilidades.",
      "Trabalho em equipe com pessoas diversas traz os melhores resultados."
    ]
  },
  {
    id: "pisces",
    name: "Peixes",
    symbol: "♓",
    element: "Água",
    quality: "Mutável",
    ruling: "Netuno",
    dateRange: "19/02 - 20/03",
    traits: ["Compassivo", "Artístico", "Intuitivo", "Gentil", "Sábio"],
    description: "Peixes é um signo de água regido por Netuno, representando espiritualidade, compaixão e imaginação. Piscianos são conhecidos por sua sensibilidade, criatividade e conexão com o mundo invisível.",
    compatibility: ["Câncer", "Escorpião", "Touro", "Capricórnio"],
    dailyMessages: [
      "Netuno intensifica sua intuição e sensibilidade. Confie em suas percepções sutis.",
      "Criatividade e imaginação estão em alta. Expresse-se através da arte.",
      "Compaixão é sua maior virtude. Ajude os outros, mas não se esqueça de si mesmo.",
      "Sonhos podem trazer mensagens importantes. Preste atenção ao mundo onírico.",
      "Espiritualidade nutre sua alma. Dedique tempo à meditação e conexão interior."
    ],
    loveMessages: [
      "No amor, busque conexões espirituais e emocionais profundas. Amor incondicional é seu ideal.",
      "Romantismo e fantasia marcam o momento. Crie momentos mágicos com quem você ama.",
      "Cuidado com idealizações excessivas. Veja o outro como realmente é, com amor e aceitação."
    ],
    workMessages: [
      "No trabalho, criatividade e intuição são seus maiores trunfos. Confie neles.",
      "Profissões artísticas, espirituais ou de cuidado são favorecidas.",
      "Ambientes de trabalho harmoniosos são essenciais para sua produtividade."
    ]
  }
];

export const getZodiacSign = (id: string): ZodiacSign | undefined => {
  return zodiacSigns.find(sign => sign.id === id);
};

export const getZodiacSignByDate = (month: number, day: number): ZodiacSign => {
  const dateRanges: { id: string; start: [number, number]; end: [number, number] }[] = [
    { id: "capricorn", start: [12, 22], end: [1, 19] },
    { id: "aquarius", start: [1, 20], end: [2, 18] },
    { id: "pisces", start: [2, 19], end: [3, 20] },
    { id: "aries", start: [3, 21], end: [4, 19] },
    { id: "taurus", start: [4, 20], end: [5, 20] },
    { id: "gemini", start: [5, 21], end: [6, 20] },
    { id: "cancer", start: [6, 21], end: [7, 22] },
    { id: "leo", start: [7, 23], end: [8, 22] },
    { id: "virgo", start: [8, 23], end: [9, 22] },
    { id: "libra", start: [9, 23], end: [10, 22] },
    { id: "scorpio", start: [10, 23], end: [11, 21] },
    { id: "sagittarius", start: [11, 22], end: [12, 21] },
  ];

  for (const range of dateRanges) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;
    
    if (range.id === "capricorn") {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return zodiacSigns.find(s => s.id === range.id)!;
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return zodiacSigns.find(s => s.id === range.id)!;
      }
    }
  }
  
  return zodiacSigns[0]; // Default to Aries
};

export const getDailyMessage = (sign: ZodiacSign): { general: string; love: string; work: string } => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  
  return {
    general: sign.dailyMessages[dayOfYear % sign.dailyMessages.length],
    love: sign.loveMessages[dayOfYear % sign.loveMessages.length],
    work: sign.workMessages[dayOfYear % sign.workMessages.length]
  };
};
