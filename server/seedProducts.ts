/**
 * Seed de produtos iniciais para o catálogo
 * Execute com: npx tsx server/seedProducts.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import { products } from "../drizzle/schema";

const initialProducts = [
  // Tarot
  {
    slug: "tarot-do-dia",
    name: "Tarot do Dia",
    description: "Descubra a mensagem que o universo tem para você hoje. Uma carta especial é sorteada para guiar seu dia com sabedoria e intuição. Receba orientações sobre como aproveitar as energias do momento.",
    shortDescription: "Uma carta especial para guiar seu dia",
    category: "tarot" as const,
    lifeArea: "geral" as const,
    price: "0.00",
    hasSample: true,
    sampleDescription: "Amostra: 1 carta com interpretação resumida",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "tarot-e-o-amor",
    name: "Tarot e o Amor",
    description: "Explore as energias que cercam sua vida amorosa com uma tiragem especial de 3 cartas. Descubra o passado, presente e futuro do seu relacionamento, ou as energias que estão atraindo um novo amor para sua vida.",
    shortDescription: "Tiragem de 3 cartas para sua vida amorosa",
    category: "tarot" as const,
    lifeArea: "amor" as const,
    price: "29.90",
    originalPrice: "49.90",
    hasSample: true,
    sampleDescription: "Amostra: 1 carta com interpretação resumida sobre amor",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "tarot-completo",
    name: "Tarot Completo",
    description: "Uma leitura profunda com 10 cartas que aborda todas as áreas da sua vida. Receba orientações detalhadas sobre amor, carreira, saúde, finanças e espiritualidade em um único relatório completo.",
    shortDescription: "Leitura profunda com 10 cartas",
    category: "tarot" as const,
    lifeArea: "geral" as const,
    price: "79.90",
    originalPrice: "99.90",
    hasSample: true,
    sampleDescription: "Amostra: 2 cartas com interpretação resumida",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "tarot-carreira",
    name: "Tarot da Carreira",
    description: "Descubra as energias que influenciam sua vida profissional. Esta tiragem especial revela oportunidades, desafios e caminhos para o sucesso na sua carreira.",
    shortDescription: "Orientações para sua vida profissional",
    category: "tarot" as const,
    lifeArea: "carreira" as const,
    price: "39.90",
    hasSample: true,
    sampleDescription: "Amostra: 1 carta sobre carreira",
    isActive: true,
    isFeatured: false,
  },
  // Numerologia
  {
    slug: "mapa-numerologico",
    name: "Mapa Numerológico Completo",
    description: "Descubra os números que regem sua vida através do seu nome e data de nascimento. O mapa numerológico revela seu Número de Destino, Expressão, Alma, Personalidade e muito mais.",
    shortDescription: "Todos os seus números pessoais revelados",
    category: "numerologia" as const,
    lifeArea: "autoconhecimento" as const,
    price: "49.90",
    originalPrice: "69.90",
    hasSample: true,
    sampleDescription: "Amostra: Número de Destino com interpretação",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "previsoes-numerologicas",
    name: "Previsões Numerológicas do Ano",
    description: "Saiba o que os números reservam para você neste ano. Descubra seu Ano Pessoal e receba orientações mês a mês para aproveitar as melhores energias.",
    shortDescription: "O que os números reservam para seu ano",
    category: "numerologia" as const,
    lifeArea: "geral" as const,
    price: "39.90",
    hasSample: true,
    sampleDescription: "Amostra: Seu Ano Pessoal com resumo",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "numerologia-do-amor",
    name: "Numerologia do Amor",
    description: "Descubra a compatibilidade numerológica entre você e seu parceiro. Analise os números de vocês dois e entenda os pontos fortes e desafios do relacionamento.",
    shortDescription: "Compatibilidade numerológica do casal",
    category: "numerologia" as const,
    lifeArea: "amor" as const,
    price: "44.90",
    hasSample: true,
    sampleDescription: "Amostra: Número de compatibilidade básico",
    isActive: true,
    isFeatured: false,
  },
  // Astrologia
  {
    slug: "mapa-astral",
    name: "Mapa Astral Completo",
    description: "Seu mapa astral é único como sua impressão digital. Descubra a posição dos planetas no momento do seu nascimento e como eles influenciam sua personalidade, relacionamentos e destino.",
    shortDescription: "O mapa completo do seu céu de nascimento",
    category: "astrologia" as const,
    lifeArea: "autoconhecimento" as const,
    price: "89.90",
    originalPrice: "129.90",
    hasSample: true,
    sampleDescription: "Amostra: Sol e Ascendente com interpretação",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "revolucao-solar",
    name: "Revolução Solar",
    description: "Descubra as energias e tendências do seu próximo ano astrológico. A Revolução Solar revela os temas principais que você vai viver de aniversário a aniversário.",
    shortDescription: "Previsões do seu ano astrológico",
    category: "astrologia" as const,
    lifeArea: "geral" as const,
    price: "69.90",
    hasSample: true,
    sampleDescription: "Amostra: Tema principal do ano",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "sinastria",
    name: "Sinastria - Compatibilidade Astrológica",
    description: "Compare os mapas astrais de duas pessoas e descubra a compatibilidade entre elas. Ideal para casais, amigos ou parceiros de negócios.",
    shortDescription: "Compatibilidade entre dois mapas astrais",
    category: "astrologia" as const,
    lifeArea: "amor" as const,
    price: "79.90",
    hasSample: true,
    sampleDescription: "Amostra: Compatibilidade Sol-Lua",
    isActive: true,
    isFeatured: false,
  },
  // Runas
  {
    slug: "runas-do-dia",
    name: "Runas do Dia",
    description: "Receba a mensagem das antigas runas nórdicas para o seu dia. Uma runa é sorteada especialmente para você com orientações práticas.",
    shortDescription: "Uma runa para guiar seu dia",
    category: "runas" as const,
    lifeArea: "geral" as const,
    price: "0.00",
    hasSample: true,
    sampleDescription: "Gratuito - 1 runa com interpretação",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "tiragem-runas-completa",
    name: "Tiragem de Runas Completa",
    description: "Uma leitura profunda com 5 runas que revela as energias do passado, presente, futuro, desafios e resultado final da sua situação.",
    shortDescription: "Leitura profunda com 5 runas",
    category: "runas" as const,
    lifeArea: "geral" as const,
    price: "34.90",
    hasSample: true,
    sampleDescription: "Amostra: 1 runa com interpretação",
    isActive: true,
    isFeatured: false,
  },
  // Combos
  {
    slug: "combo-autoconhecimento",
    name: "Combo Autoconhecimento Total",
    description: "O pacote completo para quem quer se conhecer profundamente. Inclui Mapa Astral Completo + Mapa Numerológico + Tarot Completo. Economize 40% comprando o combo!",
    shortDescription: "Mapa Astral + Numerologia + Tarot",
    category: "combo" as const,
    lifeArea: "autoconhecimento" as const,
    price: "149.90",
    originalPrice: "219.70",
    hasSample: false,
    isActive: true,
    isFeatured: true,
    isCombo: true,
    comboProducts: ["mapa-astral", "mapa-numerologico", "tarot-completo"],
  },
  {
    slug: "combo-amor",
    name: "Combo Amor e Relacionamentos",
    description: "Tudo sobre sua vida amorosa em um único pacote. Inclui Tarot e o Amor + Numerologia do Amor + Sinastria. Economize 35%!",
    shortDescription: "Tarot + Numerologia + Sinastria do Amor",
    category: "combo" as const,
    lifeArea: "amor" as const,
    price: "99.90",
    originalPrice: "154.70",
    hasSample: false,
    isActive: true,
    isFeatured: true,
    isCombo: true,
    comboProducts: ["tarot-e-o-amor", "numerologia-do-amor", "sinastria"],
  },
];

async function seedProducts() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("Seeding products...");

  for (const product of initialProducts) {
    try {
      await db.insert(products).values(product as any).onDuplicateKeyUpdate({
        set: { ...product, updatedAt: new Date() } as any
      });
      console.log(`✓ ${product.name}`);
    } catch (error) {
      console.error(`✗ ${product.name}:`, error);
    }
  }

  console.log("Done!");
  process.exit(0);
}

seedProducts();
