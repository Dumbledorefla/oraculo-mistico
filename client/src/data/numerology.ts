/**
 * Algoritmos e interpretações de Numerologia
 */

// Tabela de conversão de letras para números (Pitagórica)
const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  á: 1, à: 1, ã: 1, â: 1, ä: 1,
  é: 5, è: 5, ê: 5, ë: 5,
  í: 9, ì: 9, î: 9, ï: 9,
  ó: 6, ò: 6, õ: 6, ô: 6, ö: 6,
  ú: 3, ù: 3, û: 3, ü: 3,
  ç: 3, ñ: 5
};

const vowels = ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'ã', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'í', 'ì', 'î', 'ï', 'ó', 'ò', 'õ', 'ô', 'ö', 'ú', 'ù', 'û', 'ü'];

// Reduz um número a um dígito (exceto números mestres 11, 22, 33)
export const reduceToSingleDigit = (num: number): number => {
  // Números mestres
  if (num === 11 || num === 22 || num === 33) return num;
  
  while (num > 9) {
    num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
};

// Calcula o Número do Destino (data de nascimento)
export const calculateDestinyNumber = (birthDate: string): number => {
  // birthDate format: YYYY-MM-DD
  const digits = birthDate.replace(/-/g, '').split('');
  const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceToSingleDigit(sum);
};

// Calcula o Número da Expressão (nome completo)
export const calculateExpressionNumber = (fullName: string): number => {
  const letters = fullName.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüçñ]/g, '');
  const sum = letters.split('').reduce((acc, letter) => {
    return acc + (letterValues[letter] || 0);
  }, 0);
  return reduceToSingleDigit(sum);
};

// Calcula o Número da Alma (vogais do nome)
export const calculateSoulNumber = (fullName: string): number => {
  const letters = fullName.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüçñ]/g, '');
  const sum = letters.split('').reduce((acc, letter) => {
    if (vowels.includes(letter)) {
      return acc + (letterValues[letter] || 0);
    }
    return acc;
  }, 0);
  return reduceToSingleDigit(sum);
};

// Calcula o Número da Personalidade (consoantes do nome)
export const calculatePersonalityNumber = (fullName: string): number => {
  const letters = fullName.toLowerCase().replace(/[^a-záàãâäéèêëíìîïóòõôöúùûüçñ]/g, '');
  const sum = letters.split('').reduce((acc, letter) => {
    if (!vowels.includes(letter)) {
      return acc + (letterValues[letter] || 0);
    }
    return acc;
  }, 0);
  return reduceToSingleDigit(sum);
};

// Calcula o Ano Pessoal
export const calculatePersonalYear = (birthDate: string, currentYear: number): number => {
  const [, month, day] = birthDate.split('-');
  const sum = parseInt(day) + parseInt(month) + currentYear;
  return reduceToSingleDigit(sum);
};

export interface NumerologyResult {
  destiny: number;
  expression: number;
  soul: number;
  personality: number;
  personalYear: number;
}

export const calculateAllNumbers = (fullName: string, birthDate: string): NumerologyResult => {
  const currentYear = new Date().getFullYear();
  return {
    destiny: calculateDestinyNumber(birthDate),
    expression: calculateExpressionNumber(fullName),
    soul: calculateSoulNumber(fullName),
    personality: calculatePersonalityNumber(fullName),
    personalYear: calculatePersonalYear(birthDate, currentYear)
  };
};

// Interpretações dos números
export const numberInterpretations: Record<number, {
  title: string;
  keywords: string[];
  general: string;
  destiny: string;
  expression: string;
  soul: string;
  personality: string;
  personalYear: string;
}> = {
  1: {
    title: "O Líder",
    keywords: ["Independência", "Originalidade", "Pioneirismo", "Ambição"],
    general: "O número 1 representa liderança, independência e originalidade. Pessoas com este número são pioneiras, inovadoras e têm forte determinação para alcançar seus objetivos.",
    destiny: "Seu destino é liderar e abrir novos caminhos. Você veio para ser pioneiro, inovar e inspirar outros com sua coragem e determinação. Sua missão é desenvolver a autoconfiança e a independência.",
    expression: "Você se expressa de forma assertiva e original. Tem talento natural para liderança e tende a se destacar em qualquer área que escolha. Sua criatividade e iniciativa são seus maiores trunfos.",
    soul: "No fundo, você deseja ser reconhecido por suas conquistas individuais. Sua alma busca independência, originalidade e a liberdade de seguir seu próprio caminho.",
    personality: "Os outros o veem como alguém confiante, determinado e capaz. Você transmite uma imagem de força e liderança, mesmo quando não está se sentindo assim.",
    personalYear: "Este é um ano de novos começos e iniciativas. É hora de plantar sementes, iniciar projetos e tomar a liderança em sua vida. Coragem e ação são as palavras-chave."
  },
  2: {
    title: "O Diplomata",
    keywords: ["Cooperação", "Sensibilidade", "Equilíbrio", "Parceria"],
    general: "O número 2 representa cooperação, diplomacia e sensibilidade. Pessoas com este número são pacificadoras naturais, com grande capacidade de mediar conflitos e criar harmonia.",
    destiny: "Seu destino envolve parcerias e cooperação. Você veio para aprender a trabalhar em equipe, desenvolver paciência e usar sua sensibilidade para ajudar os outros.",
    expression: "Você se expressa de forma gentil e diplomática. Tem talento para mediar conflitos e criar ambientes harmoniosos. Sua empatia é um dom valioso.",
    soul: "Sua alma busca paz, harmonia e conexões profundas. Você deseja relacionamentos significativos e ambientes tranquilos onde possa florescer.",
    personality: "Os outros o veem como alguém gentil, cooperativo e confiável. Você transmite calma e receptividade, fazendo as pessoas se sentirem à vontade.",
    personalYear: "Este é um ano de parcerias, paciência e diplomacia. Evite forçar situações e permita que as coisas se desenvolvam naturalmente. Cultive relacionamentos."
  },
  3: {
    title: "O Comunicador",
    keywords: ["Criatividade", "Expressão", "Alegria", "Sociabilidade"],
    general: "O número 3 representa criatividade, comunicação e expressão. Pessoas com este número são artísticas, sociáveis e têm o dom de inspirar alegria nos outros.",
    destiny: "Seu destino é expressar sua criatividade e inspirar os outros. Você veio para desenvolver seus talentos artísticos e usar a comunicação como ferramenta de transformação.",
    expression: "Você se expressa de forma criativa e cativante. Tem talento natural para as artes, comunicação e entretenimento. Sua presença ilumina qualquer ambiente.",
    soul: "Sua alma busca expressão criativa e conexão social. Você deseja ser ouvido, apreciado e ter liberdade para expressar sua individualidade única.",
    personality: "Os outros o veem como alguém alegre, criativo e encantador. Você transmite otimismo e entusiasmo, atraindo pessoas com sua energia vibrante.",
    personalYear: "Este é um ano de criatividade, expressão e socialização. Expanda seus horizontes, cultive amizades e permita que sua criatividade floresça."
  },
  4: {
    title: "O Construtor",
    keywords: ["Estabilidade", "Trabalho", "Organização", "Praticidade"],
    general: "O número 4 representa estabilidade, trabalho árduo e organização. Pessoas com este número são práticas, confiáveis e constroem bases sólidas para o futuro.",
    destiny: "Seu destino é construir algo duradouro. Você veio para aprender disciplina, desenvolver paciência e criar estruturas que beneficiem a si mesmo e aos outros.",
    expression: "Você se expressa de forma prática e metódica. Tem talento para organização, planejamento e execução. Sua confiabilidade é seu maior trunfo.",
    soul: "Sua alma busca segurança e estabilidade. Você deseja construir uma base sólida para sua vida e ter a satisfação de ver seus esforços gerarem resultados concretos.",
    personality: "Os outros o veem como alguém confiável, trabalhador e responsável. Você transmite solidez e competência, inspirando confiança.",
    personalYear: "Este é um ano de trabalho, organização e construção. Foque em estabelecer bases sólidas, seja disciplinado e não espere atalhos."
  },
  5: {
    title: "O Aventureiro",
    keywords: ["Liberdade", "Mudança", "Versatilidade", "Aventura"],
    general: "O número 5 representa liberdade, mudança e aventura. Pessoas com este número são versáteis, curiosas e buscam experiências variadas na vida.",
    destiny: "Seu destino envolve mudança e expansão. Você veio para experimentar a vida em sua plenitude, abraçar a mudança e usar sua versatilidade para crescer.",
    expression: "Você se expressa de forma dinâmica e versátil. Tem talento para se adaptar a diferentes situações e inspirar outros a abraçar a mudança.",
    soul: "Sua alma busca liberdade e experiências variadas. Você deseja explorar, aprender e viver intensamente, sem se sentir preso a rotinas.",
    personality: "Os outros o veem como alguém dinâmico, interessante e aventureiro. Você transmite energia e entusiasmo pela vida.",
    personalYear: "Este é um ano de mudanças, viagens e novas experiências. Esteja aberto ao inesperado e aproveite as oportunidades de expansão."
  },
  6: {
    title: "O Cuidador",
    keywords: ["Responsabilidade", "Família", "Harmonia", "Serviço"],
    general: "O número 6 representa responsabilidade, família e serviço. Pessoas com este número são amorosas, protetoras e dedicadas ao bem-estar dos outros.",
    destiny: "Seu destino envolve cuidar e servir. Você veio para aprender sobre responsabilidade, desenvolver compaixão e criar harmonia em seus relacionamentos.",
    expression: "Você se expressa de forma amorosa e responsável. Tem talento natural para cuidar dos outros e criar ambientes harmoniosos e acolhedores.",
    soul: "Sua alma busca amor, família e harmonia. Você deseja relacionamentos profundos e a satisfação de cuidar daqueles que ama.",
    personality: "Os outros o veem como alguém amoroso, confiável e protetor. Você transmite calor e segurança, fazendo as pessoas se sentirem cuidadas.",
    personalYear: "Este é um ano focado em família, relacionamentos e responsabilidades. Cuide de si mesmo enquanto cuida dos outros."
  },
  7: {
    title: "O Buscador",
    keywords: ["Sabedoria", "Introspecção", "Espiritualidade", "Análise"],
    general: "O número 7 representa sabedoria, introspecção e busca espiritual. Pessoas com este número são analíticas, intuitivas e buscam compreender os mistérios da vida.",
    destiny: "Seu destino é buscar conhecimento e sabedoria. Você veio para desenvolver sua intuição, aprofundar sua espiritualidade e compartilhar suas descobertas.",
    expression: "Você se expressa de forma analítica e profunda. Tem talento para pesquisa, análise e compreensão de assuntos complexos.",
    soul: "Sua alma busca verdade e compreensão. Você deseja entender os mistérios da vida e encontrar significado além do superficial.",
    personality: "Os outros o veem como alguém inteligente, misterioso e profundo. Você transmite sabedoria e uma aura de conhecimento.",
    personalYear: "Este é um ano de introspecção, estudo e crescimento espiritual. Reserve tempo para reflexão e desenvolvimento interior."
  },
  8: {
    title: "O Realizador",
    keywords: ["Poder", "Abundância", "Realização", "Autoridade"],
    general: "O número 8 representa poder, abundância e realização material. Pessoas com este número são ambiciosas, eficientes e têm grande capacidade de manifestar prosperidade.",
    destiny: "Seu destino envolve poder e realização. Você veio para aprender a usar o poder com sabedoria e criar abundância para si e para os outros.",
    expression: "Você se expressa de forma poderosa e eficiente. Tem talento natural para negócios, liderança e gestão de recursos.",
    soul: "Sua alma busca realização e reconhecimento. Você deseja alcançar o sucesso e usar seu poder para fazer a diferença no mundo.",
    personality: "Os outros o veem como alguém poderoso, competente e bem-sucedido. Você transmite autoridade e capacidade de realização.",
    personalYear: "Este é um ano de poder, finanças e realizações materiais. Foque em seus objetivos de carreira e prosperidade."
  },
  9: {
    title: "O Humanitário",
    keywords: ["Compaixão", "Sabedoria", "Conclusão", "Serviço universal"],
    general: "O número 9 representa compaixão, sabedoria e serviço à humanidade. Pessoas com este número são altruístas, sábias e dedicadas a causas maiores.",
    destiny: "Seu destino é servir à humanidade. Você veio para desenvolver compaixão universal, compartilhar sabedoria e contribuir para o bem maior.",
    expression: "Você se expressa de forma compassiva e inspiradora. Tem talento para tocar os corações das pessoas e motivá-las a serem melhores.",
    soul: "Sua alma busca fazer a diferença no mundo. Você deseja contribuir para algo maior que você mesmo e deixar um legado positivo.",
    personality: "Os outros o veem como alguém sábio, compassivo e inspirador. Você transmite uma energia de amor universal e compreensão.",
    personalYear: "Este é um ano de conclusões, desapego e preparação para um novo ciclo. Deixe ir o que não serve mais e prepare-se para recomeçar."
  },
  11: {
    title: "O Mestre Intuitivo",
    keywords: ["Intuição elevada", "Inspiração", "Iluminação", "Visão"],
    general: "O número 11 é um número mestre que representa intuição elevada, inspiração e iluminação espiritual. Pessoas com este número são canais de luz e têm missões especiais.",
    destiny: "Seu destino é inspirar e iluminar. Você veio com uma missão especial de elevar a consciência coletiva através de sua intuição e visão.",
    expression: "Você se expressa de forma inspiradora e visionária. Tem o dom de canalizar informações superiores e compartilhá-las com o mundo.",
    soul: "Sua alma busca iluminação e conexão espiritual profunda. Você deseja ser um canal de luz e inspiração para os outros.",
    personality: "Os outros o veem como alguém especial, intuitivo e inspirador. Você transmite uma energia elevada que toca as pessoas profundamente.",
    personalYear: "Este é um ano de despertar espiritual e intuição elevada. Confie em sua voz interior e permita-se ser guiado por forças superiores."
  },
  22: {
    title: "O Mestre Construtor",
    keywords: ["Visão prática", "Grandes realizações", "Poder de manifestação", "Legado"],
    general: "O número 22 é um número mestre que representa o poder de transformar grandes visões em realidade. Pessoas com este número têm potencial para realizações extraordinárias.",
    destiny: "Seu destino é construir algo grandioso que beneficie a humanidade. Você veio com a capacidade de manifestar visões em grande escala.",
    expression: "Você se expressa de forma poderosa e visionária. Tem o dom de combinar idealismo com praticidade para criar realizações duradouras.",
    soul: "Sua alma busca deixar um legado significativo. Você deseja construir algo que transcenda sua própria vida e beneficie gerações futuras.",
    personality: "Os outros o veem como alguém visionário, capaz e poderoso. Você transmite a energia de alguém destinado a grandes realizações.",
    personalYear: "Este é um ano de grandes oportunidades e responsabilidades. Use seu poder de manifestação para construir algo significativo."
  },
  33: {
    title: "O Mestre Professor",
    keywords: ["Amor incondicional", "Cura", "Serviço elevado", "Compaixão mestra"],
    general: "O número 33 é o mais elevado dos números mestres, representando amor incondicional e serviço espiritual. Pessoas com este número são curadoras e professoras da humanidade.",
    destiny: "Seu destino é curar e ensinar através do amor incondicional. Você veio com uma missão sagrada de elevar a humanidade através da compaixão.",
    expression: "Você se expressa de forma amorosa e curadora. Tem o dom de tocar as almas das pessoas e ajudá-las em sua jornada de cura.",
    soul: "Sua alma busca servir através do amor mais puro. Você deseja ser um instrumento de cura e transformação para todos que encontra.",
    personality: "Os outros o veem como alguém profundamente amoroso e sábio. Você transmite uma energia de paz e cura que transforma ambientes.",
    personalYear: "Este é um ano de serviço elevado e amor incondicional. Permita que sua luz brilhe e cure aqueles ao seu redor."
  }
};

export const getNumberInterpretation = (num: number) => {
  return numberInterpretations[num] || numberInterpretations[reduceToSingleDigit(num)];
};
