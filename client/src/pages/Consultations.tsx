/**
 * Página de Consultas - Lista de Taromantes
 * Permite aos usuários encontrar e agendar consultas com especialistas
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Star, 
  Clock, 
  MessageCircle,
  Video,
  Phone,
  Sparkles,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const SPECIALTY_LABELS: Record<string, string> = {
  tarot: "Tarot",
  numerologia: "Numerologia",
  astrologia: "Astrologia",
  videncia: "Vidência",
  runas: "Runas",
  amor: "Amor",
  "mapa-astral": "Mapa Astral",
  "baralho-cigano": "Baralho Cigano",
  cristais: "Cristais",
  autoconhecimento: "Autoconhecimento",
  decisoes: "Decisões",
  previsoes: "Previsões",
};

const SPECIALTY_COLORS: Record<string, string> = {
  tarot: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  numerologia: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  astrologia: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  videncia: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  runas: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  amor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function Consultations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const { data: taromantes, isLoading } = trpc.taromantes.list.useQuery({});

  const filteredTaromantes = taromantes?.filter((t) => {
    const matchesSearch = !searchTerm || 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || 
      (t.specialties as string[])?.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  const allSpecialties = Array.from(
    new Set(taromantes?.flatMap((t) => (t.specialties as string[]) || []) || [])
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-purple-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/mapas-jogos">
                <a className="text-gray-300 hover:text-purple-400 transition-colors">Mapas e Jogos</a>
              </Link>
              <Link href="/consultas">
                <a className="text-purple-400 font-medium">Consultas</a>
              </Link>
              <Link href="/numerologia">
                <a className="text-gray-300 hover:text-purple-400 transition-colors">Numerologia</a>
              </Link>
              <Link href="/horoscopo">
                <a className="text-gray-300 hover:text-purple-400 transition-colors">Horóscopo</a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-purple-900/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Consulte com <span className="text-purple-400">Especialistas</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Conecte-se com taromantes, numerólogos e astrólogos experientes para 
              receber orientações personalizadas sobre sua vida.
            </p>

            {/* Search */}
            <div className="flex gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-purple-500/30 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <Button
              variant={selectedSpecialty === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(null)}
              className={selectedSpecialty === null ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              Todos
            </Button>
            {allSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className={selectedSpecialty === specialty ? "bg-purple-500 hover:bg-purple-600" : ""}
              >
                {SPECIALTY_LABELS[specialty] || specialty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Taromantes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-gray-900/50 border-purple-500/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-full bg-gray-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-800 rounded w-3/4" />
                        <div className="h-4 bg-gray-800 rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTaromantes?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum taromante encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaromantes?.map((taromante, index) => (
                <motion.div
                  key={taromante.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={taromante.photoUrl || "https://via.placeholder.com/80"}
                            alt={taromante.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30"
                          />
                          {taromante.isFeatured && (
                            <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                              <Star className="w-3 h-3 text-white" fill="white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-serif text-white truncate">{taromante.name}</h3>
                          <p className="text-purple-400 text-sm truncate">{taromante.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-purple-400" fill="currentColor" />
                              <span className="text-white text-sm">{taromante.rating}</span>
                            </div>
                            <span className="text-gray-500 text-sm">
                              ({taromante.totalReviews} avaliações)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {taromante.shortBio}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(taromante.specialties as string[])?.slice(0, 3).map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="outline"
                            className={SPECIALTY_COLORS[specialty] || SPECIALTY_COLORS.default}
                          >
                            {SPECIALTY_LABELS[specialty] || specialty}
                          </Badge>
                        ))}
                      </div>

                      {/* Info */}
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{taromante.experience} anos exp.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <MessageCircle className="w-4 h-4" />
                          <Phone className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                        <div>
                          <p className="text-gray-500 text-xs">A partir de</p>
                          <p className="text-purple-400 font-bold text-lg">
                            R$ {parseFloat(taromante.pricePerSession || "0").toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <Link href={`/taromante/${taromante.slug}`}>
                          <Button className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700">
                            Ver Perfil
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-purple-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-white mb-4">
            Quer se tornar um <span className="text-purple-400">Taromante</span>?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Compartilhe seu dom e ajude pessoas a encontrar seu caminho. 
            Cadastre-se como especialista e comece a atender.
          </p>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
            Saiba Mais
          </Button>
        </div>
      </section>
    </div>
  );
}
