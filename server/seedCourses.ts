/**
 * Seed de cursos para o Oráculo Místico
 */

import { drizzle } from "drizzle-orm/mysql2";
import { courses, courseModules, courseLessons } from "../drizzle/schema";

async function seedCourses() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("Seeding courses...");

  // Cursos
  const coursesData = [
    {
      slug: "tarot-iniciantes",
      title: "Tarot para Iniciantes",
      description: "Aprenda os fundamentos do Tarot de Rider-Waite. Este curso completo vai te guiar desde o significado de cada carta até como fazer suas próprias tiragens. Ideal para quem está começando sua jornada no mundo do Tarot.",
      shortDescription: "Domine os fundamentos do Tarot e comece a fazer suas próprias leituras.",
      category: "tarot" as const,
      level: "iniciante" as const,
      imageUrl: "https://images.unsplash.com/photo-1601065638984-7f1c2e0d4c9a?w=800",
      instructorName: "Maria Estrela",
      price: "0",
      isFree: true,
      isActive: true,
      isFeatured: true,
      totalModules: 4,
      totalLessons: 12,
      totalDuration: 180,
      enrollmentCount: 1250,
    },
    {
      slug: "numerologia-completa",
      title: "Numerologia Completa",
      description: "Descubra os segredos dos números e como eles influenciam sua vida. Aprenda a calcular seu Mapa Numerológico completo, entender os ciclos de vida e usar a numerologia para tomar melhores decisões.",
      shortDescription: "Desvende os mistérios dos números e crie seu Mapa Numerológico.",
      category: "numerologia" as const,
      level: "iniciante" as const,
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
      instructorName: "João Místico",
      price: "97.00",
      isFree: false,
      isActive: true,
      isFeatured: true,
      totalModules: 5,
      totalLessons: 15,
      totalDuration: 240,
      enrollmentCount: 890,
    },
    {
      slug: "astrologia-basica",
      title: "Astrologia Básica",
      description: "Entenda os fundamentos da astrologia: signos, planetas, casas e aspectos. Aprenda a interpretar seu mapa astral e dos outros com confiança.",
      shortDescription: "Aprenda a ler e interpretar mapas astrais do zero.",
      category: "astrologia" as const,
      level: "iniciante" as const,
      imageUrl: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800",
      instructorName: "Luna Cristal",
      price: "147.00",
      isFree: false,
      isActive: true,
      isFeatured: false,
      totalModules: 6,
      totalLessons: 18,
      totalDuration: 300,
      enrollmentCount: 650,
    },
    {
      slug: "runas-nordicas",
      title: "Runas Nórdicas",
      description: "Explore o antigo oráculo viking. Aprenda o significado de cada runa, como fazer tiragens e conectar-se com a sabedoria ancestral dos povos nórdicos.",
      shortDescription: "Conecte-se com a sabedoria ancestral das runas vikings.",
      category: "runas" as const,
      level: "intermediario" as const,
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
      instructorName: "Pedro Oráculo",
      price: "0",
      isFree: true,
      isActive: true,
      isFeatured: false,
      totalModules: 3,
      totalLessons: 9,
      totalDuration: 120,
      enrollmentCount: 420,
    },
    {
      slug: "tarot-avancado",
      title: "Tarot Avançado - Tiragens Complexas",
      description: "Aprenda técnicas avançadas de leitura de Tarot, incluindo tiragens complexas, combinações de cartas e interpretação intuitiva. Para quem já domina os fundamentos.",
      shortDescription: "Técnicas avançadas para leituras profissionais de Tarot.",
      category: "tarot" as const,
      level: "avancado" as const,
      imageUrl: "https://images.unsplash.com/photo-1601065638984-7f1c2e0d4c9a?w=800",
      instructorName: "Maria Estrela",
      price: "197.00",
      isFree: false,
      isActive: true,
      isFeatured: true,
      totalModules: 5,
      totalLessons: 20,
      totalDuration: 360,
      enrollmentCount: 380,
    },
    {
      slug: "autoconhecimento-espiritual",
      title: "Jornada de Autoconhecimento Espiritual",
      description: "Uma jornada transformadora de autoconhecimento através de práticas espirituais, meditação e conexão com seu eu superior. Inclui exercícios práticos e reflexões guiadas.",
      shortDescription: "Transforme sua vida através do autoconhecimento espiritual.",
      category: "espiritualidade" as const,
      level: "iniciante" as const,
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      instructorName: "Ana Luz",
      price: "0",
      isFree: true,
      isActive: true,
      isFeatured: false,
      totalModules: 4,
      totalLessons: 12,
      totalDuration: 180,
      enrollmentCount: 1100,
    },
  ];

  for (const course of coursesData) {
    try {
      await db.insert(courses).values(course);
      console.log(`Created course: ${course.title}`);
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`Course already exists: ${course.title}`);
      } else {
        console.error(`Error creating course ${course.title}:`, error);
      }
    }
  }

  // Get course IDs
  const allCourses = await db.select().from(courses);
  const tarotIniciantes = allCourses.find(c => c.slug === "tarot-iniciantes");

  if (tarotIniciantes) {
    // Módulos para Tarot Iniciantes
    const modulesData = [
      {
        courseId: tarotIniciantes.id,
        title: "Introdução ao Tarot",
        description: "Conheça a história e os fundamentos do Tarot",
        orderIndex: 1,
        isActive: true,
      },
      {
        courseId: tarotIniciantes.id,
        title: "Os Arcanos Maiores",
        description: "Aprenda o significado das 22 cartas principais",
        orderIndex: 2,
        isActive: true,
      },
      {
        courseId: tarotIniciantes.id,
        title: "Os Arcanos Menores",
        description: "Explore as 56 cartas dos naipes",
        orderIndex: 3,
        isActive: true,
      },
      {
        courseId: tarotIniciantes.id,
        title: "Tiragens e Prática",
        description: "Aprenda diferentes tipos de tiragens",
        orderIndex: 4,
        isActive: true,
      },
    ];

    for (const module of modulesData) {
      try {
        await db.insert(courseModules).values(module);
        console.log(`Created module: ${module.title}`);
      } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`Module already exists: ${module.title}`);
        } else {
          console.error(`Error creating module:`, error);
        }
      }
    }

    // Get module IDs
    const allModules = await db.select().from(courseModules);
    const introModule = allModules.find(m => m.title === "Introdução ao Tarot");

    if (introModule) {
      // Aulas para o módulo de introdução
      const lessonsData = [
        {
          moduleId: introModule.id,
          courseId: tarotIniciantes.id,
          title: "O que é o Tarot?",
          description: "Uma introdução ao mundo do Tarot e sua história",
          contentType: "video" as const,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 15,
          orderIndex: 1,
          isFree: true,
          isActive: true,
        },
        {
          moduleId: introModule.id,
          courseId: tarotIniciantes.id,
          title: "Estrutura do Baralho",
          description: "Entenda como o baralho de Tarot é organizado",
          contentType: "video" as const,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: 12,
          orderIndex: 2,
          isFree: true,
          isActive: true,
        },
        {
          moduleId: introModule.id,
          courseId: tarotIniciantes.id,
          title: "Preparando seu Espaço",
          description: "Como criar um ambiente propício para leituras",
          contentType: "text" as const,
          textContent: "# Preparando seu Espaço para Leituras de Tarot\n\nAntes de começar suas leituras, é importante criar um ambiente adequado...",
          duration: 10,
          orderIndex: 3,
          isFree: false,
          isActive: true,
        },
      ];

      for (const lesson of lessonsData) {
        try {
          await db.insert(courseLessons).values(lesson);
          console.log(`Created lesson: ${lesson.title}`);
        } catch (error: any) {
          if (error.code === "ER_DUP_ENTRY") {
            console.log(`Lesson already exists: ${lesson.title}`);
          } else {
            console.error(`Error creating lesson:`, error);
          }
        }
      }
    }
  }

  console.log("Courses seeding completed!");
  process.exit(0);
}

seedCourses().catch(console.error);
