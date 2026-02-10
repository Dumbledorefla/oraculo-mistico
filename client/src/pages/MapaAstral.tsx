/**
 * Página de Destino - Mapa Astral Completo
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
  Compass,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PRICE = 97.00;
const PRODUCT_NAME = "Mapa Astral Completo";

export default function MapaAstral() {
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
      icon: Compass,
      title: "Mapa Astral Completo",
      description: "Análise profunda de todos os planetas, casas e aspectos do seu mapa"
    },
    {
      icon: Sun,
      title: "Sol, Lua e Ascendente",
      description: "Entenda os três pilares da sua personalidade astrológica"
    },
    {
      icon: Heart,
      title: "Amor e Relacionamentos",
      description: "Vênus, Marte e Casa 7 revelam seu estilo amoroso e compatibilidades"
    },
    {
      icon: TrendingUp,
      title: "Carreira e Propósito",
      description: "Descubra sua vocação através do Meio do Céu e Casa 10"
    },
    {
      icon: Moon,
      title: "Trânsitos e Previsões",
      description: "Saiba como os planetas influenciam seu momento atual"
    },
    {
      icon: Shield,
      title: "Relatório Profissional em PDF",
      description: "Documento completo com mais de 30 páginas de análises detalhadas"
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Informe Data, Hora e Local de Nascimento",
      description: "Dados precisos garantem um mapa astral exato e personalizado"
    },
    {
      number: "2",
      title: "Cálculo Astrológico Profissional",
      description: "Sistema calcula posições planetárias exatas no momento do seu nascimento"
    },
    {
      number: "3",
      title: "Receba seu Mapa Completo",
      description: "PDF com gráfico do mapa, interpretações e orientações personalizadas"
    },
  ];

  const testimonials = [
    {
      name: "Fernanda Lima",
      rating: 5,
      text: "O mapa astral completo mudou minha perspectiva sobre mim mesma. Muito profundo e revelador!",
      date: "Há 2 dias"
    },
    {
      name: "Marcos Oliveira",
      rating: 5,
      text: "Finalmente entendi por que sou do jeito que sou. O relatório é extremamente detalhado e preciso.",
      date: "Há 1 semana"
    },
    {
      name: "Patricia Santos",
      rating: 5,
      text: "As previsões dos trânsitos me ajudaram a tomar decisões importantes. Vale cada centavo!",
      date: "Há 2 semanas"
    },
  ];

  const faqs = [
    {
      question: "O que é um Mapa Astral?",
      answer: "O Mapa Astral é uma fotografia do céu no momento exato do seu nascimento. Ele mostra a posição de todos os planetas, signos e casas astrológicas, revelando aspectos profundos da sua personalidade, talentos, desafios e propósito de vida. É uma ferramenta poderosa de autoconhecimento usada há milhares de anos."
    },
    {
      question: "Por que preciso da hora exata de nascimento?",
      answer: "A hora de nascimento é essencial para calcular o Ascendente (signo que estava nascendo no horizonte) e as 12 casas astrológicas. Esses elementos mudam a cada 2 horas aproximadamente e são fundamentais para uma leitura precisa. Sem a hora, o mapa fica incompleto. Se não souber, pode consultar sua certidão de nascimento."
    },
    {
      question: "Qual a diferença para horóscopo de revista?",
      answer: "Horóscopo de revista considera apenas o signo solar (onde o Sol estava quando você nasceu). O Mapa Astral Completo analisa todos os 10 planetas, 12 casas, aspectos entre planetas, e é 100% personalizado para você. É como comparar uma foto 3x4 com um retrato profissional completo."
    },
    {
      question: "O que vem no relatório?",
      answer: "Você recebe: gráfico visual do seu mapa astral, interpretação detalhada de Sol, Lua, Ascendente e todos os planetas, análise das 12 casas astrológicas, aspectos planetários (conjunções, oposições, trígonos), compatibilidades amorosas, vocação profissional, desafios kármicos, trânsitos atuais e previsões para os próximos meses. Mais de 30 páginas!"
    },
    {
      question: "Posso fazer para outras pessoas?",
      answer: "Sim! Durante 30 dias você pode gerar mapas astrais ilimitados. Muitas pessoas fazem para filhos, parceiros, familiares ou amigos. É um presente incrível e muito significativo."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
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
            Mapa Astral <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Completo</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Descubra quem você realmente é através da sabedoria milenar da astrologia. 
            Receba um mapa astral profissional com análise completa de planetas, casas e aspectos.
          </p>
          
          {/* Price CTA */}
          <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-purple-500/30 max-w-md mx-auto">
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
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Compass className="w-5 h-5 mr-2" />
                    Gerar Meu Mapa Astral
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
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
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
          <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-serif text-white mb-4">
                Pronto para se conhecer profundamente?
              </h2>
              <p className="text-gray-300 mb-8">
                Milhares de pessoas já descobriram seu verdadeiro potencial através do Mapa Astral Completo.
              </p>
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg font-semibold shadow-lg shadow-purple-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Compass className="w-5 h-5 mr-2" />
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
