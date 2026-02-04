/**
 * Página de Detalhes do Produto
 * Exibe informações completas do produto com opções de compra
 */

import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { 
  Star, 
  Sparkles, 
  Heart, 
  Briefcase, 
  DollarSign,
  User,
  ShoppingCart,
  Eye,
  Check,
  ArrowLeft,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const CATEGORY_LABELS: Record<string, string> = {
  tarot: "Tarot",
  numerologia: "Numerologia",
  astrologia: "Astrologia",
  runas: "Runas",
  combo: "Combos",
};

const LIFE_AREA_LABELS: Record<string, string> = {
  amor: "Amor",
  carreira: "Carreira",
  dinheiro: "Dinheiro",
  saude: "Saúde",
  familia: "Família",
  autoconhecimento: "Autoconhecimento",
  espiritualidade: "Espiritualidade",
  geral: "Geral",
};

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  
  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug });

  const handleSampleClick = () => {
    if (!isAuthenticated) {
      toast.info("Faça login para acessar a amostra grátis");
      window.location.href = getLoginUrl();
      return;
    }
    window.location.href = `/amostra/${slug}`;
  };

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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info("Faça login para continuar com a compra");
      window.location.href = getLoginUrl();
      return;
    }
    handleAddToCart();
    window.location.href = "/carrinho";
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (numPrice === 0) return "Grátis";
    return `R$ ${numPrice.toFixed(2).replace(".", ",")}`;
  };

  const calculateDiscount = (price: string | number, originalPrice: string | number | null) => {
    if (!originalPrice) return null;
    const p = typeof price === "string" ? parseFloat(price) : price;
    const op = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice;
    if (op <= p) return null;
    return Math.round(((op - p) / op) * 100);
  };

  if (isLoading) {
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

  const discount = calculateDiscount(product.price, product.originalPrice);
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/mapas-jogos" className="text-white/80 hover:text-primary transition-colors">Mapas e Jogos</Link>
            <Link href="/numerologia" className="text-white/80 hover:text-primary transition-colors">Numerologia</Link>
            <Link href="/horoscopo" className="text-white/80 hover:text-primary transition-colors">Horóscopo</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/mapas-jogos">
            <Button variant="ghost" className="text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao catálogo
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border border-primary/30">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        {CATEGORY_LABELS[product.category]}
                      </Badge>
                      {product.lifeArea && product.lifeArea !== "geral" && (
                        <Badge variant="outline" className="border-pink-500/50 text-pink-400">
                          {LIFE_AREA_LABELS[product.lifeArea]}
                        </Badge>
                      )}
                      {product.isCombo && (
                        <Badge className="bg-purple-500 text-white">
                          <Package className="w-3 h-3 mr-1" />
                          Combo
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
                      {product.name}
                    </h1>
                  </div>
                  
                  <div className="text-right">
                    {discount && (
                      <Badge className="bg-green-500 text-white mb-2">
                        -{discount}% de desconto
                      </Badge>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && parseFloat(product.originalPrice as string) > parseFloat(product.price as string) && (
                        <span className="text-lg text-white/50 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-white/80 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* What's Included */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">O que está incluído:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-500" />
                      Interpretação personalizada completa
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-500" />
                      Acesso permanente ao seu resultado
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-500" />
                      Relatório em PDF para download
                    </li>
                    {product.isCombo && (
                      <li className="flex items-center gap-2 text-white/80">
                        <Check className="w-5 h-5 text-green-500" />
                        Múltiplos produtos em um único pacote
                      </li>
                    )}
                  </ul>
                </div>

                {/* Sample Info */}
                {product.hasSample && product.sampleDescription && (
                  <div className="bg-white/5 rounded-lg p-4 mb-8 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Amostra Grátis Disponível
                    </h4>
                    <p className="text-white/70">{product.sampleDescription}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {product.hasSample && (
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                      onClick={handleSampleClick}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Ver Amostra Grátis
                    </Button>
                  )}
                  
                  {isFree ? (
                    <Button 
                      size="lg"
                      className="flex-1 bg-primary text-black hover:bg-primary/90"
                      onClick={handleSampleClick}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Acessar Gratuitamente
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                      <Button 
                        size="lg"
                        className="flex-1 bg-primary text-black hover:bg-primary/90"
                        onClick={handleBuyNow}
                      >
                        Comprar Agora
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
