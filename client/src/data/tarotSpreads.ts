export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: Position[];
  isPremium: boolean;
}

export interface Position {
  id: number;
  name: string;
  meaning: string;
  x: number;
  y: number;
}

export const tarotSpreads: Spread[] = [
  {
    id: "daily",
    name: "Tarot do Dia",
    description: "Uma carta que revela a mensagem do universo para você hoje",
    cardCount: 1,
    isPremium: false,
    positions: [
      {
        id: 1,
        name: "Mensagem do Dia",
        meaning: "A energia e mensagem principal para sua jornada de hoje",
        x: 50,
        y: 50
      }
    ]
  },
  {
    id: "love",
    name: "Tarot e o Amor",
    description: "Explore as energias que cercam sua vida amorosa com 3 cartas",
    cardCount: 3,
    isPremium: true,
    positions: [
      {
        id: 1,
        name: "Situação Atual",
        meaning: "O estado atual de sua vida amorosa",
        x: 20,
        y: 50
      },
      {
        id: 2,
        name: "Desafios",
        meaning: "Os obstáculos ou desafios em seus relacionamentos",
        x: 50,
        y: 50
      },
      {
        id: 3,
        name: "Conselho",
        meaning: "O conselho do universo para sua vida amorosa",
        x: 80,
        y: 50
      }
    ]
  },
  {
    id: "complete",
    name: "Tarot Completo",
    description: "Uma leitura profunda com 6 cartas sobre sua jornada de vida",
    cardCount: 6,
    isPremium: true,
    positions: [
      {
        id: 1,
        name: "Passado",
        meaning: "As influências e eventos que moldaram seu presente",
        x: 15,
        y: 30
      },
      {
        id: 2,
        name: "Presente",
        meaning: "Sua situação atual e as energias ao seu redor",
        x: 50,
        y: 30
      },
      {
        id: 3,
        name: "Futuro",
        meaning: "As possibilidades e tendências para seu futuro",
        x: 85,
        y: 30
      },
      {
        id: 4,
        name: "Fundação",
        meaning: "Os fundamentos e raízes da situação",
        x: 15,
        y: 70
      },
      {
        id: 5,
        name: "Obstáculo",
        meaning: "Os desafios ou bloqueios a superar",
        x: 50,
        y: 70
      },
      {
        id: 6,
        name: "Resultado",
        meaning: "O resultado provável se você seguir este caminho",
        x: 85,
        y: 70
      }
    ]
  },
  {
    id: "celtic-cross",
    name: "Cruz Celta",
    description: "A tiragem mais profunda: 10 cartas que revelam todos os aspectos de sua situação",
    cardCount: 10,
    isPremium: true,
    positions: [
      {
        id: 1,
        name: "Situação Atual",
        meaning: "O coração da questão e a situação presente",
        x: 50,
        y: 50
      },
      {
        id: 2,
        name: "Influência Cruzada",
        meaning: "As forças que apoiam ou desafiam a situação",
        x: 50,
        y: 50
      },
      {
        id: 3,
        name: "Objetivo Distante",
        meaning: "O objetivo final ou resultado desejado",
        x: 75,
        y: 50
      },
      {
        id: 4,
        name: "Fundação Recente",
        meaning: "Os eventos recentes que levaram a esta situação",
        x: 25,
        y: 50
      },
      {
        id: 5,
        name: "Passado Distante",
        meaning: "As influências antigas que ainda afetam a situação",
        x: 50,
        y: 25
      },
      {
        id: 6,
        name: "Futuro Próximo",
        meaning: "O que está por vir em breve",
        x: 50,
        y: 75
      },
      {
        id: 7,
        name: "Sua Posição",
        meaning: "Como você se sente e sua perspectiva",
        x: 15,
        y: 70
      },
      {
        id: 8,
        name: "Influências Externas",
        meaning: "Fatores externos que afetam a situação",
        x: 15,
        y: 50
      },
      {
        id: 9,
        name: "Esperanças e Medos",
        meaning: "Seus desejos e preocupações ocultas",
        x: 15,
        y: 30
      },
      {
        id: 10,
        name: "Resultado Final",
        meaning: "O resultado final e a resolução",
        x: 85,
        y: 50
      }
    ]
  },
  {
    id: "life-path",
    name: "Caminho da Vida",
    description: "7 cartas que revelam sua jornada pessoal e propósito",
    cardCount: 7,
    isPremium: true,
    positions: [
      {
        id: 1,
        name: "Sua Essência",
        meaning: "Quem você é no seu núcleo",
        x: 50,
        y: 20
      },
      {
        id: 2,
        name: "Seus Dons",
        meaning: "Seus talentos naturais e habilidades",
        x: 25,
        y: 40
      },
      {
        id: 3,
        name: "Seus Desafios",
        meaning: "As lições que você veio aprender",
        x: 75,
        y: 40
      },
      {
        id: 4,
        name: "Seu Caminho",
        meaning: "A direção de sua vida e propósito",
        x: 15,
        y: 60
      },
      {
        id: 5,
        name: "Seu Destino",
        meaning: "Para onde sua jornada o leva",
        x: 85,
        y: 60
      },
      {
        id: 6,
        name: "Seu Guia",
        meaning: "A energia ou força que o guia",
        x: 50,
        y: 80
      },
      {
        id: 7,
        name: "Mensagem Final",
        meaning: "A mensagem mais importante para você agora",
        x: 50,
        y: 100
      }
    ]
  }
];

export function getSpreadById(id: string): Spread | undefined {
  return tarotSpreads.find(spread => spread.id === id);
}

export function getFreeSpreads(): Spread[] {
  return tarotSpreads.filter(spread => !spread.isPremium);
}

export function getPremiumSpreads(): Spread[] {
  return tarotSpreads.filter(spread => spread.isPremium);
}
