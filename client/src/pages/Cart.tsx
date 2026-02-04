/**
 * Página do Carrinho de Compras
 * Exibe itens no carrinho e permite checkout
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CreditCard,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeItem, total, clearCart, itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    if (price === 0) return "Grátis";
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const createCheckout = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecionando para o pagamento...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error("Erro ao criar sessão de pagamento: " + error.message);
    },
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Faça login para continuar com a compra");
      window.location.href = getLoginUrl();
      return;
    }
    
    const checkoutItems = items.map(item => ({
      slug: item.slug,
      quantity: item.quantity || 1,
    }));

    createCheckout.mutate({ items: checkoutItems });
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
            <Link href="/mapas-jogos" className="text-white/80 hover:text-primary transition-colors">Mapas e Jogos</Link>
            <Link href="/numerologia" className="text-white/80 hover:text-primary transition-colors">Numerologia</Link>
            <Link href="/horoscopo" className="text-white/80 hover:text-primary transition-colors">Horóscopo</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container max-w-3xl">
          {/* Back Button */}
          <Link href="/mapas-jogos">
            <Button variant="ghost" className="text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Carrinho de Compras
            </h1>

            {items.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Seu carrinho está vazio
                  </h2>
                  <p className="text-white/60 mb-6">
                    Explore nossos produtos e adicione itens ao carrinho
                  </p>
                  <Link href="/mapas-jogos">
                    <Button className="bg-primary text-black hover:bg-primary/90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver Produtos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 mb-8">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-white">
                              {item.name}
                            </h3>
                            <Link href={`/produto/${item.slug}`}>
                              <span className="text-sm text-primary hover:underline cursor-pointer">
                                Ver detalhes
                              </span>
                            </Link>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(item.price)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <Card className="bg-black/40 backdrop-blur-md border border-primary/30">
                  <CardHeader className="border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white">
                      Resumo do Pedido
                    </h2>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/70">
                        <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Desconto</span>
                        <span className="text-green-400">- R$ 0,00</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 p-6 pt-0">
                    <Button 
                      size="lg"
                      className="w-full bg-primary text-black hover:bg-primary/90"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Finalizar Compra
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Pagamento seguro via Stripe</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-white/50 hover:text-white/70"
                      onClick={() => {
                        clearCart();
                        toast.success("Carrinho limpo");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar carrinho
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
