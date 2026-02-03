/**
 * Página Inicial - Oráculo Místico
 * Design: Neo-Mysticism - Experiência premium com animações fluidas
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  Star, 
  Moon,
  Sun,
  Calculator,
  Heart,
  ArrowRight,
  Compass,
  Eye,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Hero background image
const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-1_1770154022000_na1fn_dGFyb3QtY2FyZC1iYWNr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTFfMTc3MDE1NDAyMjAwMF9uYTFmbl9kR0Z5YjNRdFkyRnlaQzFpWVdOci5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Dn3hOgm5UfW82D7vmhb8xc3OiElkABHYjUlu-1jSHVJxPvcGBDz50Ebq-0eGMQ-6xbgHUHnz4JCUx4ntbpgUZN0Fvzsez9imcD44b5q25qsPHQOxJxjqoJeUiCHAd6FWqjXkU6lVEzQk4jkzaU6HHEYzGGFigAOb32YuxdbV9UDUNyDiSxnUdM~i6RrkH~WISwJypBSU3~-lrH33GGWWLvPoeL0m7sr-ObfhoNbehpnhcMcg2yag6UT17bSxOXhJw~f5u9kVU~~itf0jExIctf~X-s-5JGglRG0WXlCXYXLx5wwEM3us1WrLAOW6tmAkFtioehgSrHyifz7wbu3Dcw__";

const services = [
  {
    id: "tarot-dia",
    title: "Tarot do Dia",
    description: "Descubra a mensagem que o universo tem para você hoje com uma carta especial.",
    icon: Star,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    href: "/tarot/dia",
    badge: "Grátis"
  },
  {
    id: "tarot-amor",
    title: "Tarot e o Amor",
    description: "Explore as energias que cercam sua vida amorosa com uma tiragem de 3 cartas.",
    icon: Heart,
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
    href: "/tarot/amor",
    badge: "Grátis"
  },
  {
    id: "tarot-completo",
    title: "Tarot Completo",
    description: "Uma leitura profunda com 6 cartas sobre sua jornada de vida e destino.",
    icon: Eye,
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    href: "/tarot/completo",
    badge: "Premium"
  },
  {
    id: "numerologia",
    title: "Mapa Numerológico",
    description: "Calcule seus números pessoais e descubra seu propósito, talentos e desafios.",
    icon: Calculator,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    href: "/numerologia",
    badge: "Grátis"
  },
  {
    id: "horoscopo",
    title: "Horóscopo do Dia",
    description: "Previsões diárias personalizadas para amor, trabalho e vida em geral.",
    icon: Sun,
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    href: "/horoscopo",
    badge: "Grátis"
  },
  {
    id: "mapa-astral",
    title: "Mapa Astral",
    description: "Descubra seu ascendente, lua e posições planetárias no momento do seu nascimento.",
    icon: Compass,
    color: "from-blue-500/20 to-indigo-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    href: "/mapa-astral",
    badge: "Em breve"
  }
];

const features = [
  {
    icon: Sparkles,
    title: "Interpretações Profundas",
    description: "Cada leitura é baseada em conhecimentos ancestrais e interpretações cuidadosamente elaboradas."
  },
  {
    icon: Zap,
    title: "Resultados Instantâneos",
    description: "Receba suas previsões e análises imediatamente, sem espera ou complicações."
  },
  {
    icon: Moon,
    title: "Atualizações Diárias",
    description: "Horóscopo e mensagens renovadas todos os dias para guiar sua jornada."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Floating particles background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.2
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-bold gold-text">Oráculo Místico</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tarot/dia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarot
            </Link>
            <Link href="/numerologia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Numerologia
            </Link>
            <Link href="/horoscopo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Horóscopo
            </Link>
          </nav>

          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Descubra seu destino</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Desvende os{" "}
              <span className="gold-text">Mistérios</span>
              <br />do Universo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Tarot, Numerologia e Astrologia em um só lugar. 
              Receba orientações personalizadas para guiar sua jornada 
              e descobrir seu verdadeiro potencial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/tarot/dia">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  <Star className="w-5 h-5 mr-2" />
                  Tirar Carta do Dia
                </Button>
              </Link>
              <Link href="/horoscopo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Sun className="w-5 h-5 mr-2" />
                  Ver Horóscopo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Oráculos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha entre diferentes métodos de autoconhecimento e orientação espiritual
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isComingSoon = service.badge === "Em breve";
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isComingSoon ? (
                    <Card className={`h-full bg-gradient-to-br ${service.color} border ${service.borderColor} opacity-60 cursor-not-allowed`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${service.iconColor}`} />
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                            {service.badge}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Link href={service.href}>
                      <Card className={`h-full bg-gradient-to-br ${service.color} border ${service.borderColor} hover:border-primary/50 transition-all cursor-pointer group`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <Icon className={`w-6 h-6 ${service.iconColor}`} />
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              service.badge === "Premium" 
                                ? "bg-primary/20 text-primary" 
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}>
                              {service.badge}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                            <span>Acessar</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher o Oráculo Místico?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma experiência completa de autoconhecimento ao seu alcance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/20 border border-primary/20 p-8 md:p-12"
          >
            {/* Decorative stars */}
            <div className="absolute top-4 left-4 text-primary/30">✦</div>
            <div className="absolute top-8 right-12 text-primary/20">✧</div>
            <div className="absolute bottom-8 left-16 text-primary/20">✦</div>
            <div className="absolute bottom-4 right-8 text-primary/30">✧</div>

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comece sua jornada de{" "}
                <span className="gold-text">autoconhecimento</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Tire sua primeira carta gratuitamente e descubra o que o universo 
                tem a dizer sobre seu caminho.
              </p>
              <Link href="/tarot/dia">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Agora - É Grátis
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-primary/10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-lg font-bold gold-text">Oráculo Místico</span>
            </div>

            <nav className="flex items-center gap-6">
              <Link href="/tarot/dia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tarot
              </Link>
              <Link href="/numerologia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Numerologia
              </Link>
              <Link href="/horoscopo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Horóscopo
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">
              © 2026 Oráculo Místico. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
