/**
 * Página de Catálogo - Mapas e Jogos
 * Lista todos os produtos digitais com filtros e cards
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Star, 
  Sparkles, 
  Heart, 
  Briefcase, 
  DollarSign,
  User,
  Filter,
  ShoppingCart,
  Eye,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, any> = {
  tarot: Sparkles,
  numerologia: Star,
  astrologia: Star,
  runas: Star,
  combo: Package,
};

const LIFE_AREA_ICONS: Record<string, any> = {
  amor: Heart,
  carreira: Briefcase,
  dinheiro: DollarSign,
  autoconhecimento: User,
  geral: Star,
};

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

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const { data: products, isLoading } = trpc.products.list.useQuery({
    category: selectedCategory || undefined,
  });

  const { data: featuredProducts } = trpc.products.list.useQuery({
    featuredOnly: true,
  });

  const handleSampleClick = (productSlug: string) => {
    if (!isAuthenticated) {
      toast.info("Faça login para acessar a amostra grátis");
      window.location.href = getLoginUrl();
      return;
    }
    // Navigate to sample page
    window.location.href = `/amostra/${productSlug}`;
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
            <Link href="/mapas-jogos" className="text-primary font-semibold">Mapas e Jogos</Link>
            <Link href="/numerologia" className="text-white/80 hover:text-primary transition-colors">Numerologia</Link>
            <Link href="/horoscopo" className="text-white/80 hover:text-primary transition-colors">Horóscopo</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Mapas e <span className="gold-text">Jogos</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Descubra os segredos do universo através de nossos mapas astrológicos, 
              tiragens de tarot e análises numerológicas personalizadas.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-primary text-black" : "border-white/30 text-white hover:bg-white/10"}
            >
              <Filter className="w-4 h-4 mr-2" />
              Todos
            </Button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const Icon = CATEGORY_ICONS[key] || Star;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => setSelectedCategory(key)}
                  className={selectedCategory === key ? "bg-primary text-black" : "border-white/30 text-white hover:bg-white/10"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              );
            })}
          </motion.div>

          {/* Featured Products */}
          {!selectedCategory && featuredProducts && featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                Destaques
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onSampleClick={handleSampleClick}
                    formatPrice={formatPrice}
                    calculateDiscount={calculateDiscount}
                    featured
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* All Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              {selectedCategory ? CATEGORY_LABELS[selectedCategory] : "Todos os Produtos"}
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <Sparkles className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white/70">✨ Preparando sua experiência mística...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onSampleClick={handleSampleClick}
                    formatPrice={formatPrice}
                    calculateDiscount={calculateDiscount}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

interface ProductCardProps {
  product: any;
  index: number;
  onSampleClick: (slug: string) => void;
  formatPrice: (price: string | number) => string;
  calculateDiscount: (price: string | number, originalPrice: string | number | null) => number | null;
  featured?: boolean;
}

function ProductCard({ product, index, onSampleClick, formatPrice, calculateDiscount, featured }: ProductCardProps) {
  const CategoryIcon = CATEGORY_ICONS[product.category] || Star;
  const LifeAreaIcon = LIFE_AREA_ICONS[product.lifeArea] || Star;
  const discount = calculateDiscount(product.price, product.originalPrice);
  const isFree = parseFloat(product.price) === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`bg-black/40 backdrop-blur-md border ${featured ? 'border-primary/50' : 'border-white/10'} hover:border-primary/50 transition-all h-full flex flex-col`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                <CategoryIcon className="w-3 h-3 mr-1" />
                {CATEGORY_LABELS[product.category]}
              </Badge>
              {product.lifeArea && product.lifeArea !== "geral" && (
                <Badge variant="outline" className="border-pink-500/50 text-pink-400 text-xs">
                  <LifeAreaIcon className="w-3 h-3 mr-1" />
                  {LIFE_AREA_LABELS[product.lifeArea]}
                </Badge>
              )}
            </div>
            {discount && (
              <Badge className="bg-green-500 text-white text-xs">
                -{discount}%
              </Badge>
            )}
            {isFree && (
              <Badge className="bg-primary text-black text-xs">
                Grátis
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-white/70 text-sm line-clamp-3">
            {product.shortDescription || product.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <span className="text-sm text-white/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 w-full">
            {product.hasSample && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
                onClick={() => onSampleClick(product.slug)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Amostra
              </Button>
            )}
            <Link href={`/produto/${product.slug}`} className="flex-1">
              <Button 
                size="sm"
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {isFree ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Acessar
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Comprar
                  </>
                )}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
