/**
 * Página de Amostra Grátis
 * Exibe versão resumida do produto com CTA para versão completa
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { 
  Star, 
  Sparkles, 
  Lock,
  ArrowLeft,
  ShoppingCart,
  Check,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Sample content for different product types
const SAMPLE_CONTENT: Record<string, { title: string; content: string; lockedContent: string[] }> = {
  "tarot-do-dia": {
    title: "Sua Carta do Dia",
    content: "O Mago aparece para você hoje, trazendo uma mensagem de poder e manifestação. Este é um momento para usar seus talentos e habilidades com confiança. Você tem todas as ferramentas necessárias para alcançar seus objetivos.",
    lockedContent: [
      "Interpretação detalhada para Amor",
      "Interpretação detalhada para Trabalho",
      "Conselho do dia personalizado",
      "Meditação guiada com a carta"
    ]
  },
  "tarot-e-o-amor": {
    title: "Prévia do Tarot do Amor",
    content: "A primeira carta da sua tiragem revela energias de transformação em sua vida amorosa. Há mudanças significativas chegando que trarão novas oportunidades de conexão e crescimento emocional.",
    lockedContent: [
      "2ª carta: Situação atual do relacionamento",
      "3ª carta: Futuro próximo no amor",
      "Síntese completa das 3 cartas",
      "Conselho para fortalecer o amor"
    ]
  },
  "tarot-completo": {
    title: "Prévia do Tarot Completo",
    content: "As duas primeiras cartas da sua tiragem de 10 cartas mostram um momento de reflexão e preparação. Você está sendo chamado a olhar para dentro e reconhecer seu verdadeiro potencial antes de dar os próximos passos.",
    lockedContent: [
      "8 cartas adicionais com interpretação",
      "Análise de Amor e Relacionamentos",
      "Análise de Carreira e Finanças",
      "Análise de Saúde e Bem-estar",
      "Síntese geral e conselho final"
    ]
  },
  "mapa-numerologico": {
    title: "Seu Número de Destino",
    content: "Seu Número de Destino é 7 - O Místico. Você veio a este mundo para buscar conhecimento profundo e sabedoria interior. Sua missão de vida envolve introspecção, análise e conexão espiritual.",
    lockedContent: [
      "Número de Expressão completo",
      "Número da Alma",
      "Número da Personalidade",
      "Ano Pessoal atual",
      "Ciclos de vida e desafios"
    ]
  },
  "mapa-astral": {
    title: "Sol e Ascendente",
    content: "Com o Sol em Escorpião e Ascendente em Leão, você combina intensidade emocional com uma presença magnética. Sua essência busca transformação profunda, enquanto sua máscara social projeta confiança e liderança.",
    lockedContent: [
      "Posição da Lua e emoções",
      "Mercúrio e comunicação",
      "Vênus e relacionamentos",
      "Marte e energia vital",
      "Todas as 12 casas astrológicas",
      "Aspectos planetários"
    ]
  },
  default: {
    title: "Amostra Grátis",
    content: "Esta é uma prévia do conteúdo que você receberá na versão completa. Experimente uma pequena amostra do conhecimento que aguarda por você.",
    lockedContent: [
      "Interpretação completa e detalhada",
      "Análise personalizada",
      "Conselhos práticos",
      "Relatório em PDF"
    ]
  }
};

export default function Sample() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const [hasRecordedAccess, setHasRecordedAccess] = useState(false);
  
  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const recordAccess = trpc.samples.recordAccess.useMutation();

  // Record sample access when page loads
  useEffect(() => {
    if (product && isAuthenticated && !hasRecordedAccess) {
      recordAccess.mutate({ productId: product.id });
      setHasRecordedAccess(true);
    }
  }, [product, isAuthenticated, hasRecordedAccess]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.info("Faça login para acessar a amostra grátis");
      window.location.href = getLoginUrl();
    }
  }, [isLoading, isAuthenticated]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.price as string),
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (numPrice === 0) return "Grátis";
    return `R$ ${numPrice.toFixed(2).replace(".", ",")}`;
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produto não encontrado</h1>
          <Link href="/mapas-jogos">
            <Button variant="outline" className="border-primary text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sampleContent = SAMPLE_CONTENT[slug] || SAMPLE_CONTENT.default;
  const isFree = parseFloat(product.price as string) === 0;

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
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container max-w-3xl">
          {/* Back Button */}
          <Link href={`/produto/${slug}`}>
            <Button variant="ghost" className="text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao produto
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Sample Badge */}
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-primary/20 text-primary border border-primary/50 px-4 py-2 text-lg">
                <Eye className="w-5 h-5 mr-2" />
                Amostra Grátis
              </Badge>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-2">
              {product.name}
            </h1>
            <p className="text-white/60 text-center mb-8">
              Olá, {user?.name || "visitante"}! Aqui está sua amostra grátis.
            </p>

            {/* Sample Content Card */}
            <Card className="bg-black/40 backdrop-blur-md border border-primary/30 mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                  {sampleContent.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/90 text-lg leading-relaxed">
                    {sampleContent.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Locked Content Preview */}
            {!isFree && (
              <Card className="bg-black/20 backdrop-blur-md border border-white/10 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-white/50" />
                    <h3 className="text-xl font-semibold text-white/80">
                      Conteúdo Completo (Bloqueado)
                    </h3>
                  </div>
                  <p className="text-white/60 mb-4">
                    Adquira a versão completa para desbloquear:
                  </p>
                  <ul className="space-y-2">
                    {sampleContent.lockedContent.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-white/50">
                        <Lock className="w-4 h-4" />
                        <span className="blur-[2px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            {!isFree && (
              <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md border border-primary/50">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    Gostou da amostra?
                  </h3>
                  <p className="text-white/70 mb-4">
                    Desbloqueie o conteúdo completo por apenas
                  </p>
                  <div className="text-4xl font-bold text-primary mb-6">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Link href="/carrinho">
                      <Button 
                        size="lg"
                        className="bg-primary text-black hover:bg-primary/90"
                        onClick={handleAddToCart}
                      >
                        Comprar Agora
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Free Product CTA */}
            {isFree && (
              <Card className="bg-gradient-to-r from-green-500/20 to-primary/20 backdrop-blur-md border border-green-500/50">
                <CardContent className="p-8 text-center">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    Este produto é gratuito!
                  </h3>
                  <p className="text-white/70 mb-6">
                    Você já tem acesso completo a este conteúdo.
                  </p>
                  <Link href={`/tarot/${slug.replace("tarot-", "").replace("-do-", "/")}`}>
                    <Button 
                      size="lg"
                      className="bg-primary text-black hover:bg-primary/90"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Acessar Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
