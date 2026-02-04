/**
 * Página Meus Produtos
 * Lista produtos adquiridos pelo usuário
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  Package,
  ArrowLeft,
  Star,
  Play,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function MyProducts() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: products, isLoading } = trpc.userProducts.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-purple-950 via-black to-black" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-primary/20">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold gold-text">Oráculo Místico</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/mapas-jogos" className="text-white/80 hover:text-primary transition-colors">Mapas e Jogos</Link>
            <Link href="/perfil" className="text-white/80 hover:text-primary transition-colors">Meu Perfil</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/perfil">
            <Button variant="ghost" className="text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao perfil
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Meus Produtos
            </h1>

            {!products || products.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Você ainda não tem produtos
                  </h2>
                  <p className="text-white/60 mb-6">
                    Explore nosso catálogo e adquira seus primeiros produtos
                  </p>
                  <Link href="/mapas-jogos">
                    <Button className="bg-primary text-black hover:bg-primary/90">
                      <Star className="w-4 h-4 mr-2" />
                      Ver Catálogo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="border-primary/50 text-primary">
                                {item.product?.category || "Produto"}
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Adquirido
                              </Badge>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-1">
                              {item.product?.name || "Produto"}
                            </h3>
                            <p className="text-white/60 text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Adquirido em {formatDate(item.grantedAt)}
                            </p>
                          </div>
                          <Link href={`/produto/${item.product?.slug}/acessar`}>
                            <Button className="bg-primary text-black hover:bg-primary/90">
                              <Play className="w-4 h-4 mr-2" />
                              Acessar
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
