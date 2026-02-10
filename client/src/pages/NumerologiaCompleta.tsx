/**
 * Página de Destino - Numerologia Completa
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
  Calculator,
  ChevronDown,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PRICE = 47.00;
const PRODUCT_NAME = "Numerologia Completa";

export default function NumerologiaCompleta() {
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
      icon: Calculator,
      title: "Mapa Numerológico Completo",
      description: "Análise profunda de todos os seus números pessoais e significados"
    },
    {
      icon: Target,
      title: "Número do Destino e Missão de Vida",
      description: "Descubra seu propósito e o caminho que você veio trilhar"
    },
    {
      icon: Heart,
      title: "Compatibilidade Amorosa",
      description: "Entenda suas relações e encontre parceiros compatíveis"
    },
    {
      icon: TrendingUp,
      title: "Ciclos e Previsões",
      description: "Saiba quais energias influenciam cada fase da sua vida"
    },
    {
      icon: Zap,
      title: "Talentos e Desafios",
      description: "Identifique seus dons naturais e áreas de crescimento"
    },
    {
      icon: Shield,
      title: "Relatório Personalizado em PDF",
      description: "Documento completo com mais de 20 páginas de análises"
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Informe seus Dados Pessoais",
      description: "Nome completo e data de nascimento são a base da numerologia"
    },
    {
      number: "2",
      title: "Processamento Numerológico",
      description: "Nosso sistema calcula todos os números importantes da sua vida"
    },
    {
      number: "3",
      title: "Receba seu Mapa Completo",
      description: "PDF detalhado com interpretações e orientações personalizadas"
    },
  ];

  const testimonials = [
    {
      name: "Carla Mendes",
      rating: 5,
      text: "Incrível como os números revelaram aspectos da minha personalidade que eu nem percebia. Muito preciso!",
      date: "Há 3 dias"
    },
    {
      name: "Roberto Silva",
      rating: 5,
      text: "O relatório é muito completo e bem explicado. Valeu muito a pena, me ajudou a entender meu propósito.",
      date: "Há 1 semana"
    },
    {
      name: "Juliana Costa",
      rating: 5,
      text: "A análise de compatibilidade me ajudou muito no meu relacionamento. Recomendo!",
      date: "Há 2 semanas"
    },
  ];

  const faqs = [
    {
      question: "O que é Numerologia?",
      answer: "Numerologia é o estudo místico dos números e sua influência em nossas vidas. Cada número possui uma vibração energética única que revela aspectos da nossa personalidade, destino e propósito de vida. A análise completa considera seu nome completo e data de nascimento para criar um mapa numerológico personalizado."
    },
    {
      question: "Quais números são analisados?",
      answer: "Analisamos mais de 15 números importantes: Número do Destino, Caminho de Vida, Expressão, Motivação da Alma, Personalidade Externa, Números Faltantes, Números em Excesso, Desafios, Ciclos de Vida, Ano Pessoal, e muito mais. Cada número revela um aspecto diferente da sua jornada."
    },
    {
      question: "Qual a diferença para a versão gratuita?",
      answer: "A versão gratuita calcula apenas o Número do Destino com uma interpretação básica. A versão completa analisa todos os números importantes, fornece interpretações profundas, revela compatibilidades, ciclos de vida, talentos ocultos, desafios kármicos e inclui um relatório em PDF de mais de 20 páginas."
    },
    {
      question: "Preciso saber numerologia para entender?",
      answer: "Não! O relatório é escrito em linguagem clara e acessível. Explicamos cada número e seu significado de forma simples, sem jargões complicados. Qualquer pessoa pode entender e aplicar as orientações na sua vida."
    },
    {
      question: "Posso fazer para outras pessoas?",
      answer: "Sim! Você pode gerar mapas numerológicos ilimitados durante 30 dias. Muitas pessoas fazem para familiares, amigos ou parceiros para entender melhor as dinâmicas dos relacionamentos."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/numerologia">
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
            Numerologia <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Completa</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Descubra os segredos escondidos nos números da sua vida. Receba um mapa numerológico 
            completo com mais de 15 análises profundas sobre seu destino, propósito e potencial.
          </p>
          
          {/* Price CTA */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-500/30 max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  R$ {PRICE.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-purple-300">Acesso por 30 dias • Mapas ilimitados</p>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Descobrir Meus Números
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
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
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
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-serif text-white mb-4">
                Pronto para descobrir seus números?
              </h2>
              <p className="text-gray-300 mb-8">
                Milhares de pessoas já transformaram suas vidas compreendendo a sabedoria da numerologia.
              </p>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
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
