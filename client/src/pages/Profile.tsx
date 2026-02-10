/**
 * Página de Perfil do Usuário
 * Exibe informações do usuário e histórico de leituras de tarot
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { LogOut, Calendar, BookOpen, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const { data: readings, isLoading } = trpc.tarot.getHistory.useQuery({ limit: 20 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-purple-950 via-black to-black" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-primary/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl font-bold gold-text">Meu Perfil</span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-black/40 backdrop-blur-md border border-primary/30">
              <CardHeader>
                <CardTitle className="text-white">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-sm">Nome</label>
                    <p className="text-white text-lg font-semibold">{user.name || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Email</label>
                    <p className="text-white text-lg font-semibold">{user.email || "Não informado"}</p>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Membro desde</label>
                    <p className="text-white text-lg font-semibold">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Readings History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Histórico de Leituras</h2>
              </div>
              <p className="text-white/70">
                {readings?.length === 0 
                  ? "Você ainda não tem nenhuma leitura salva. Comece a explorar nossos oráculos!"
                  : `Você tem ${readings?.length || 0} leitura(s) salva(s)`
                }
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <p className="text-white/70 mt-2">✨ Buscando suas leituras anteriores...</p>
              </div>
            ) : readings && readings.length > 0 ? (
              <div className="grid gap-4">
                {readings.map((reading, index) => (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white capitalize">
                              Tarot {reading.readingType}
                            </h3>
                            {reading.userName && (
                              <p className="text-white/70 text-sm">Consultante: {reading.userName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-white/70 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(reading.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-white/70 text-sm font-semibold mb-2">Cartas tiradas:</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(reading.cards) && reading.cards.map((card: any, idx: number) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30"
                              >
                                {card.name || `Carta ${idx + 1}`}
                              </span>
                            ))}
                          </div>
                        </div>

                        {reading.interpretation && (
                          <div>
                            <p className="text-white/70 text-sm font-semibold mb-2">Interpretação:</p>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {reading.interpretation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-black/40 backdrop-blur-md border border-primary/20">
                <CardContent className="p-12 text-center">
                  <Star className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-white/70">Nenhuma leitura salva ainda</p>
                  <p className="text-white/50 text-sm mt-2">
                    Visite nossos oráculos e salve suas leituras para visualizá-las aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
