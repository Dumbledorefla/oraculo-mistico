/**
 * Página de Destino - Tarot Completo
 * Landing page para conversão freemium → premium
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  Check,
  Star,
  Lock,
  Zap,
  Heart,
  TrendingUp,
  Shield,
  Clock,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PRICE = 29.90;
const PRODUCT_NAME = "Tarot Completo";

export default function TarotCompleto() {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const createCheckoutMutation = trpc.payments.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecionando para o checkout...");
      }
    },
    onError: (error) => {
      toast.error("Erro ao criar sessão de checkout: " + error.message);
      setIsLoading(false);
    },
  });

  const handleCheckout = () => {
    setIsLoading(true);
    createCheckoutMutation.mutate({
      productName: PRODUCT_NAME,
      price: PRICE,
      successUrl: `${window.location.origin}/checkout/sucesso`,
      cancelUrl: window.location.href,
    });
  };

  const benefits = [
    {
      icon: Star,
      title: "Leitura Completa de 10 Cartas",
      description: "Análise profunda com Cruz Celta, o método mais completo do Tarot"
    },
    {
      icon: Heart,
      title: "Amor, Carreira e Finanças",
      description: "Orientações específicas para todas as áreas da sua vida"
    },
    {
      icon: TrendingUp,
      title: "Previsões para 3 Meses",
      description: "Veja o que o futuro reserva e prepare-se para oportunidades"
    },
    {
      icon: Shield,
      title: "Interpretação Personalizada",
      description: "Cada leitura é única e considera sua data de nascimento"
    },
    {
      icon: Zap,
      title: "Resultado Instantâneo",
      description: "Receba sua leitura completa em PDF imediatamente"
    },
    {
      icon: Lock,
      title: "100% Confidencial",
      description: "Suas informações são protegidas e nunca compartilhadas"
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Informe sua Data de Nascimento",
      description: "Seus dados astrológicos personalizam a leitura"
    },
    {
      number: "2",
      title: "Concentre-se na sua Pergunta",
      description: "Pense no que você deseja saber enquanto as cartas são embaralhadas"
    },
    {
      number: "3",
      title: "Receba sua Leitura Completa",
      description: "Análise detalhada em PDF com interpretações e orientações"
    },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      rating: 5,
      text: "A leitura foi incrivelmente precisa! Me ajudou a tomar decisões importantes na minha carreira.",
      date: "Há 2 dias"
    },
    {
      name: "João Santos",
      rating: 5,
      text: "Fiquei impressionado com o nível de detalhe. Muito melhor que as leituras gratuitas!",
      date: "Há 1 semana"
    },
    {
      name: "Ana Costa",
      rating: 5,
      text: "Valeu cada centavo. As orientações sobre amor foram exatamente o que eu precisava ouvir.",
      date: "Há 2 semanas"
    },
  ];

  const faqs = [
    {
      question: "Como funciona a leitura completa?",
      answer: "Você informa sua data de nascimento e faz sua pergunta. O sistema embaralha as cartas e realiza uma tiragem de 10 cartas usando o método Cruz Celta, o mais completo do Tarot. Você recebe um PDF com a interpretação detalhada de cada carta e como elas se relacionam."
    },
    {
      question: "Qual a diferença para o Tarot do Dia gratuito?",
      answer: "O Tarot do Dia usa apenas 1 carta e oferece uma orientação geral. O Tarot Completo usa 10 cartas, analisa múltiplas áreas da sua vida (amor, carreira, finanças), fornece previsões para 3 meses e inclui interpretações muito mais profundas e personalizadas."
    },
    {
      question: "Posso fazer quantas leituras quiser?",
      answer: "Sim! Após a compra, você pode fazer leituras ilimitadas durante 30 dias. Recomendamos fazer uma leitura por semana para acompanhar a evolução das energias."
    },
    {
      question: "Como recebo o resultado?",
      answer: "Imediatamente após a tiragem, você visualiza o resultado na tela e recebe um PDF completo por email com todas as interpretações, que pode salvar e consultar sempre que quiser."
    },
    {
      question: "É seguro fornecer minha data de nascimento?",
      answer: "Sim, totalmente seguro. Usamos criptografia de ponta a ponta e nunca compartilhamos seus dados pessoais. A data de nascimento é usada apenas para personalizar sua leitura astrológica."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/tarot">
              <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center gap-2 text-purple-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Badge className="bg-purple-500/20 text-purple-300 mb-4">
            ✨ Versão Premium
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Tarot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Completo</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Desvende todos os mistérios da sua vida com uma leitura profunda de 10 cartas. 
            Receba orientações detalhadas sobre amor, carreira, finanças e muito mais.
          </p>
          
          {/* Price CTA */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  R$ {PRICE.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-purple-300">Acesso por 30 dias • Leituras ilimitadas</p>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Desvendar Meu Destino
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 mt-4 text-center">
                🔒 Pagamento seguro via Stripe • Garantia de 7 dias
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-serif text-white text-center mb-12">
            O que está incluído
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-serif text-white text-center mb-12">
            Como funciona
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-serif text-white text-center mb-12">
            O que nossos usuários dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{testimonial.name}</span>
                    <span className="text-xs text-gray-500">{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-serif text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gray-900/50 border-purple-500/20">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 text-gray-400">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-serif text-white mb-4">
                Pronto para desvendar seu destino?
              </h2>
              <p className="text-gray-300 mb-8">
                Milhares de pessoas já transformaram suas vidas com nossas leituras completas de Tarot.
              </p>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Começar Agora por R$ {PRICE.toFixed(2).replace('.', ',')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
