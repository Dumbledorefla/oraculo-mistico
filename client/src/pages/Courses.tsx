/**
 * Página de Cursos - Oráculo Místico
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "tarot", label: "Tarot" },
  { id: "numerologia", label: "Numerologia" },
  { id: "astrologia", label: "Astrologia" },
  { id: "runas", label: "Runas" },
  { id: "espiritualidade", label: "Espiritualidade" },
];

const LEVELS = {
  iniciante: { label: "Iniciante", color: "bg-green-500/20 text-green-400" },
  intermediario: { label: "Intermediário", color: "bg-yellow-500/20 text-yellow-400" },
  avancado: { label: "Avançado", color: "bg-red-500/20 text-red-400" },
};

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses, isLoading } = trpc.courses.list.useQuery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center gap-2 text-amber-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm mb-6">
              <BookOpen className="w-4 h-4" />
              Aprenda com os Mestres
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Cursos de <span className="text-amber-400">Autoconhecimento</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Desenvolva suas habilidades em Tarot, Numerologia, Astrologia e muito mais 
              com nossos cursos exclusivos ministrados por especialistas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-purple-500/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={
                    selectedCategory === cat.id
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "border-purple-500/30 text-gray-400 hover:text-white hover:bg-purple-500/20"
                  }
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-gray-900/50 border-purple-500/20 animate-pulse">
                  <div className="h-48 bg-gray-800" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-800 rounded mb-4" />
                    <div className="h-4 bg-gray-800 rounded mb-2" />
                    <div className="h-4 bg-gray-800 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => {
                const levelInfo = LEVELS[course.level as keyof typeof LEVELS] || LEVELS.iniciante;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/curso/${course.slug}`}>
                      <Card className="bg-gray-900/50 border-purple-500/20 hover:border-amber-500/50 transition-all duration-300 cursor-pointer group overflow-hidden h-full">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={course.imageUrl || "https://images.unsplash.com/photo-1601065638984-7f1c2e0d4c9a?w=800"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            {course.isFree && (
                              <Badge className="bg-green-500/90 text-white">
                                Grátis
                              </Badge>
                            )}
                            {course.isFeatured && (
                              <Badge className="bg-amber-500/90 text-white">
                                Destaque
                              </Badge>
                            )}
                          </div>

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-amber-500/90 rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          {/* Level Badge */}
                          <Badge className={`${levelInfo.color} mb-3`}>
                            {levelInfo.label}
                          </Badge>

                          {/* Title */}
                          <h3 className="text-xl font-serif text-white mb-2 group-hover:text-amber-400 transition-colors">
                            {course.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {course.shortDescription || course.description}
                          </p>

                          {/* Instructor */}
                          <p className="text-purple-400 text-sm mb-4">
                            Por {course.instructorName}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.totalLessons || 0} aulas
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.totalDuration ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}min` : "N/A"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.enrollmentCount || 0}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-purple-500/10">
                            {course.isFree ? (
                              <span className="text-2xl font-bold text-green-400">Grátis</span>
                            ) : (
                              <span className="text-2xl font-bold text-amber-400">
                                R$ {parseFloat(course.price || "0").toFixed(2).replace(".", ",")}
                              </span>
                            )}
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Ver Curso
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou buscar por outro termo.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-amber-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-serif text-white mb-4">
            Quer se tornar um instrutor?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Compartilhe seu conhecimento com milhares de pessoas e ganhe dinheiro 
            ensinando o que você ama.
          </p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            Saiba Mais
          </Button>
        </div>
      </section>
    </div>
  );
}
