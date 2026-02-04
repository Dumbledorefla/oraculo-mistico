import { drizzle } from "drizzle-orm/mysql2";
import { taromantes, taromanteAvailability, taromanteServices } from "../drizzle/schema";

const TAROMANTES_DATA = [
  {
    slug: "maria-estrela",
    name: "Maria Estrela",
    title: "Tarologa e Vidente",
    shortBio: "Especialista em Tarot de Marselha com mais de 15 anos de experiência em leituras de amor e carreira.",
    bio: "Maria Estrela descobriu seu dom aos 12 anos, quando teve sua primeira visão premonitória. Desde então, dedicou sua vida ao estudo das artes esotéricas. Formada em Psicologia, combina conhecimento acadêmico com intuição espiritual para oferecer orientações profundas e transformadoras. Especialista em questões amorosas e decisões de carreira.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    specialties: ["tarot", "videncia", "amor"],
    experience: 15,
    rating: "4.9",
    totalReviews: 342,
    totalConsultations: 1250,
    pricePerHour: "150.00",
    pricePerSession: "80.00",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "joao-mystico",
    name: "João Místico",
    title: "Numerólogo e Astrólogo",
    shortBio: "Mestre em Numerologia Pitagórica e Astrologia Védica. Especialista em mapas astrais e compatibilidade.",
    bio: "João Místico é um dos numerólogos mais respeitados do Brasil. Com formação em Matemática e especialização em Numerologia Pitagórica, oferece análises precisas e detalhadas. Também é astrólogo certificado, com foco em Astrologia Védica. Suas consultas são conhecidas pela profundidade e clareza.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    specialties: ["numerologia", "astrologia", "mapa-astral"],
    experience: 12,
    rating: "4.8",
    totalReviews: 256,
    totalConsultations: 890,
    pricePerHour: "180.00",
    pricePerSession: "95.00",
    isActive: true,
    isFeatured: true,
  },
  {
    slug: "luna-cristal",
    name: "Luna Cristal",
    title: "Tarologa e Terapeuta Holística",
    shortBio: "Especialista em Tarot Rider-Waite e terapias com cristais. Foco em autoconhecimento e cura emocional.",
    bio: "Luna Cristal combina a sabedoria do Tarot com terapias holísticas para oferecer uma experiência transformadora. Formada em Terapia Holística e certificada em Cristaloterapia, suas consultas vão além da previsão - são verdadeiras sessões de cura e autoconhecimento.",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    specialties: ["tarot", "cristais", "autoconhecimento"],
    experience: 8,
    rating: "4.9",
    totalReviews: 189,
    totalConsultations: 620,
    pricePerHour: "120.00",
    pricePerSession: "65.00",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "pedro-oraculo",
    name: "Pedro Oráculo",
    title: "Runista e Tarólogo",
    shortBio: "Especialista em Runas Nórdicas e Tarot Thoth. Consultas focadas em decisões importantes e caminhos de vida.",
    bio: "Pedro Oráculo é um dos poucos especialistas em Runas Nórdicas do Brasil. Com mais de 10 anos de estudo das tradições escandinavas, combina a sabedoria ancestral das runas com o Tarot Thoth de Aleister Crowley. Suas consultas são ideais para quem busca clareza em momentos de decisão.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    specialties: ["runas", "tarot", "decisoes"],
    experience: 10,
    rating: "4.7",
    totalReviews: 145,
    totalConsultations: 480,
    pricePerHour: "140.00",
    pricePerSession: "75.00",
    isActive: true,
    isFeatured: false,
  },
  {
    slug: "ana-luz",
    name: "Ana Luz",
    title: "Astróloga e Cartomante",
    shortBio: "Especialista em Astrologia Tradicional e Baralho Cigano. Previsões precisas para amor, trabalho e finanças.",
    bio: "Ana Luz pratica astrologia há mais de 20 anos, sendo uma das pioneiras da Astrologia Tradicional no Brasil. Também é mestre em Baralho Cigano, oferecendo leituras precisas e práticas. Conhecida por sua abordagem direta e acolhedora, Ana ajuda seus consulentes a encontrar clareza e direção.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    specialties: ["astrologia", "baralho-cigano", "previsoes"],
    experience: 20,
    rating: "5.0",
    totalReviews: 412,
    totalConsultations: 1580,
    pricePerHour: "200.00",
    pricePerSession: "110.00",
    isActive: true,
    isFeatured: true,
  },
];

const AVAILABILITY_TEMPLATE = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" }, // Monday
  { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" }, // Tuesday
  { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" }, // Wednesday
  { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" }, // Thursday
  { dayOfWeek: 5, startTime: "09:00", endTime: "18:00" }, // Friday
  { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" }, // Saturday
];

const SERVICES_TEMPLATE = [
  { name: "Consulta Expressa", description: "Consulta rápida para uma pergunta específica", duration: 15, priceMultiplier: 0.3 },
  { name: "Consulta Padrão", description: "Consulta completa com análise detalhada", duration: 30, priceMultiplier: 0.5 },
  { name: "Consulta Aprofundada", description: "Sessão extensa com múltiplas questões", duration: 60, priceMultiplier: 1.0 },
];

async function seedTaromantes() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("Seeding taromantes...");

  for (const taromante of TAROMANTES_DATA) {
    // Insert taromante
    const result = await db.insert(taromantes).values(taromante as any);
    const taromanteId = Number(result[0].insertId);
    console.log(`Created taromante: ${taromante.name} (ID: ${taromanteId})`);

    // Insert availability
    for (const avail of AVAILABILITY_TEMPLATE) {
      await db.insert(taromanteAvailability).values({
        taromanteId,
        ...avail,
        isActive: true,
      });
    }
    console.log(`  - Added ${AVAILABILITY_TEMPLATE.length} availability slots`);

    // Insert services
    for (const service of SERVICES_TEMPLATE) {
      const price = (parseFloat(taromante.pricePerHour) * service.priceMultiplier).toFixed(2);
      await db.insert(taromanteServices).values({
        taromanteId,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price,
        isActive: true,
      });
    }
    console.log(`  - Added ${SERVICES_TEMPLATE.length} services`);
  }

  console.log("\nSeeding complete!");
  process.exit(0);
}

seedTaromantes().catch(console.error);
