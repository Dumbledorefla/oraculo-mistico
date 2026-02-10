/**
 * Paywall para Jogos de Tarot Premium
 */

import { motion } from "framer-motion";
import { Lock, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface TarotPaywallProps {
  gameName: string;
  onUnlock?: () => void;
}

export default function TarotPaywall({ gameName, onUnlock }: TarotPaywallProps) {
  const { isAuthenticated } = useAuth();

  const handleUpgrade = () => {
    // TODO: Redirecionar para página de pagamento
    window.location.href = "/mapas-jogos";
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-purple-300 mb-2">
              {gameName} Premium
            </h2>
            <p className="text-gray-300 text-lg">
              Desbloqueie interpretações profundas e personalizadas
            </p>
          </div>

          <div className="space-y-4 bg-purple-900/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">O que você ganha:</h3>
            <div className="space-y-3">
              {[
                "Interpretações detalhadas e personalizadas",
                "Análise completa de todas as cartas",
                "Conselhos práticos para sua vida",
                "Acesso ilimitado ao jogo",
                "Histórico completo de leituras",
                "Suporte prioritário"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Fazer Login para Continuar
                </Button>
                <p className="text-center text-sm text-gray-400">
                  Já tem uma conta? Faça login para acessar seus jogos premium
                </p>
              </>
            ) : (
              <>
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Desbloquear por R$ 19,90
                </Button>
                <p className="text-center text-sm text-gray-400">
                  Pagamento único • Acesso vitalício
                </p>
              </>
            )}
          </div>

          <div className="text-center pt-4 border-t border-purple-500/20">
            <p className="text-xs text-gray-500">
              ✨ Garantia de 7 dias • Suporte 24/7 • Pagamento seguro
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
