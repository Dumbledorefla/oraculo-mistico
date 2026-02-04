/**
 * Página de Sucesso do Checkout
 * Exibida após pagamento bem-sucedido
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  CheckCircle,
  Package,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutSuccess() {
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
      <main className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border border-green-500/30">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                </motion.div>
                
                <h1 className="text-3xl font-serif font-bold text-white mb-4">
                  Pagamento Confirmado!
                </h1>
                
                <p className="text-white/70 text-lg mb-8">
                  Obrigado pela sua compra! Seus produtos já estão disponíveis na sua conta.
                </p>

                <div className="space-y-4">
                  <Link href="/meus-produtos">
                    <Button 
                      size="lg"
                      className="w-full bg-primary text-black hover:bg-primary/90"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Ver Meus Produtos
                    </Button>
                  </Link>
                  
                  <Link href="/mapas-jogos">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      Continuar Explorando
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
