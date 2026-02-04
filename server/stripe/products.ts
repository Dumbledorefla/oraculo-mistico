/**
 * Stripe Products Configuration
 * Define products and prices for checkout
 */

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
  slug: string;
}

// Products mapped from database - prices in cents (BRL)
export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  "tarot-e-o-amor": {
    id: "tarot-e-o-amor",
    name: "Tarot e o Amor",
    description: "Tiragem de 3 cartas para sua vida amorosa",
    priceInCents: 2990, // R$ 29,90
    currency: "brl",
    slug: "tarot-e-o-amor",
  },
  "tarot-completo": {
    id: "tarot-completo",
    name: "Tarot Completo",
    description: "Leitura profunda com 10 cartas",
    priceInCents: 7990, // R$ 79,90
    currency: "brl",
    slug: "tarot-completo",
  },
  "tarot-carreira": {
    id: "tarot-carreira",
    name: "Tarot da Carreira",
    description: "Orientações para sua vida profissional",
    priceInCents: 3990, // R$ 39,90
    currency: "brl",
    slug: "tarot-carreira",
  },
  "mapa-numerologico": {
    id: "mapa-numerologico",
    name: "Mapa Numerológico Completo",
    description: "Todos os seus números pessoais revelados",
    priceInCents: 4990, // R$ 49,90
    currency: "brl",
    slug: "mapa-numerologico",
  },
  "previsoes-numerologicas": {
    id: "previsoes-numerologicas",
    name: "Previsões Numerológicas do Ano",
    description: "O que os números reservam para seu ano",
    priceInCents: 3990, // R$ 39,90
    currency: "brl",
    slug: "previsoes-numerologicas",
  },
  "numerologia-do-amor": {
    id: "numerologia-do-amor",
    name: "Numerologia do Amor",
    description: "Compatibilidade numerológica do casal",
    priceInCents: 4490, // R$ 44,90
    currency: "brl",
    slug: "numerologia-do-amor",
  },
  "mapa-astral": {
    id: "mapa-astral",
    name: "Mapa Astral Completo",
    description: "O mapa completo do seu céu de nascimento",
    priceInCents: 8990, // R$ 89,90
    currency: "brl",
    slug: "mapa-astral",
  },
  "revolucao-solar": {
    id: "revolucao-solar",
    name: "Revolução Solar",
    description: "Previsões do seu ano astrológico",
    priceInCents: 6990, // R$ 69,90
    currency: "brl",
    slug: "revolucao-solar",
  },
  "sinastria": {
    id: "sinastria",
    name: "Sinastria - Compatibilidade Astrológica",
    description: "Compatibilidade entre dois mapas astrais",
    priceInCents: 7990, // R$ 79,90
    currency: "brl",
    slug: "sinastria",
  },
  "tiragem-runas-completa": {
    id: "tiragem-runas-completa",
    name: "Tiragem de Runas Completa",
    description: "Leitura profunda com 5 runas",
    priceInCents: 3490, // R$ 34,90
    currency: "brl",
    slug: "tiragem-runas-completa",
  },
  "combo-autoconhecimento": {
    id: "combo-autoconhecimento",
    name: "Combo Autoconhecimento Total",
    description: "Mapa Astral + Numerologia + Tarot",
    priceInCents: 14990, // R$ 149,90
    currency: "brl",
    slug: "combo-autoconhecimento",
  },
  "combo-amor": {
    id: "combo-amor",
    name: "Combo Amor e Relacionamentos",
    description: "Tarot + Numerologia + Sinastria do Amor",
    priceInCents: 9990, // R$ 99,90
    currency: "brl",
    slug: "combo-amor",
  },
};

export function getProductBySlug(slug: string): StripeProduct | undefined {
  return STRIPE_PRODUCTS[slug];
}

export function getAllProducts(): StripeProduct[] {
  return Object.values(STRIPE_PRODUCTS);
}
