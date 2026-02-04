/**
 * Página Inicial - Oráculo Místico
 * Design: Neo-Mysticism - Experiência premium com fundos celestiais e animações fluidas
 * Autenticação: Manus OAuth integrado
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
  Zap,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

// Background images - Mystical celestial theme
const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/oAoxzsDB1OO28cezWUejbN-img-1_1770155958000_na1fn_bXlzdGljYWwtaGVyby1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L29Bb3h6c0RCMU9PMjhjZXpXVWVqYk4taW1nLTFfMTc3MDE1NTk1ODAwMF9uYTFmbl9iWGx6ZEdsallXd3RhR1Z5YnkxaVp3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Fk0o7sgK9Csj9~KyI4F2T2fJJff8wXmETE3WvWe~WsWx1qJtWU8t9FAKjoTa8RJEgmJQtBFNhoDrTIp0Px1mfMNxn5-Ih~03ccjyLAmv~OpzsW1N6ANC23VBlv4Vspv1Cz0vn0tbf3audhiejE8hAulgfzdyQDiIgtMEva6XTFwiovfCS-mpTMwfTziBTAR13EafllIRL0ynt5u0ZYv1kPhcaqzp~yuQ3225hKrJB0Esbge~ccdkHMj8XKBVBb4wdLMLJToyN2~Qxg65Wtz8QlzDD8ZVKb-dt89sQHD~bYRdEHQ~-PJIr74JR1nILHZeTxDD343STS6vnuynIToV0w__";

const STARS_BG = "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/oAoxzsDB1OO28cezWUejbN-img-2_1770155954000_na1fn_c3RhcnMtcGF0dGVybi1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L29Bb3h6c0RCMU9PMjhjZXpXVWVqYk4taW1nLTJfMTc3MDE1NTk1NDAwMF9uYTFmbl9jM1JoY25NdGNHRjBkR1Z5YmkxaVp3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Jjq7maP5pGJd4qzRZ8XC-8d2wFiwxP98HnWDw3vAR6Ud9BgV8jNcheBGYIxd0SViPwbIMSBxXV2SA4JZDap2Mk8cI~Bvz2CDtm5AHJPvz4hk5HdClcS0CzXiTZGfZbEOIt8MDlKg68Mvj6yZdHb~8--TXmLdLH-7u~KOx5Wb7RcU70uG0~hbYe51yjnAOB54LBg~LmtVhWmQ84ofaxVZiYQwJ~ikE~Du6TQRUZ-aMkEPPKOyBHh0i7Sut3s7RN58tqPOCPzMyOFfm6ke-vihVKyQhHOcP41N43FNCz8C4OAvQk3u-oQrYwR2cHECneT4w53J00zUUshEyxwbZuOxdw__";

const TAROT_BG = "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/oAoxzsDB1OO28cezWUejbN-img-3_1770155948000_na1fn_dGFyb3Qtc2VjdGlvbi1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L29Bb3h6c0RCMU9PMjhjZXpXVWVqYk4taW1nLTNfMTc3MDE1NTk0ODAwMF9uYTFmbl9kR0Z5YjNRdGMyVmpkR2x2YmkxaVp3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ve8ki8aFmCKlCYDMjxRh25~x3DKBUZmr51gmfDQ2TXs5Gyf5LfJgYO76BGCLMGJjCk57~xBq2i3Pfa0N9kztv8i8zq0TXi4asIWrnz3dwjST4Q0ZmFUp0OV043qAFvpWuP65FkGr0N-BjEUQb9KS8Ozvk3BxULcVT7EIQVwOEHWEAstdFhCVSxwvgo9F4dD~5qUDWFisexs4vHjf1UCM2xgZZ8ZwsGEYFZrJ4KfgNKKZTrHWmMFvQ19QI8Cha-BT5DM0s9C2UJWM90U44WLX3kH0rd8h9eUyUkf-8ovzuWkAewf4IsgXLyK0KJONaSbPVMxNIgpGTUEaQxPB7Qbbig__";

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

// Animated stars component
function AnimatedStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: (Math.random() * 100) + "%",
            top: (Math.random() * 100) + "%",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          <span className="text-primary/60 text-xs">✦</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen relative">
      {/* Global mystical background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(" + STARS_BG + ")",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay gradient for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-purple-950/60 to-black/70" />
      
      {/* Animated stars overlay */}
      <AnimatedStars />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-primary/20">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center border border-primary/30">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-bold gold-text">Oráculo Místico</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tarot/dia" className="text-sm text-white/80 hover:text-primary transition-colors">
              Tarot
            </Link>
            <Link href="/numerologia" className="text-sm text-white/80 hover:text-primary transition-colors">
              Numerologia
            </Link>
            <Link href="/horoscopo" className="text-sm text-white/80 hover:text-primary transition-colors">
              Horóscopo
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href="/perfil">
                  <span className="text-sm text-white/70 hover:text-primary transition-colors cursor-pointer">
                    Olá, <span className="text-primary font-semibold">{user.name || user.email}</span>
                  </span>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with mystical background */}
      <section className="relative pt-24 pb-20 overflow-hidden z-10 min-h-[90vh] flex items-center">
        {/* Hero background image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(" + HERO_BG + ")",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-purple-950/40 to-black/60" />
        
        {/* Animated glow effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Descubra seu destino</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
            >
              Desvende os{" "}
              <span className="gold-text" style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.5))" }}>Mistérios</span>
              <br />do Universo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
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
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 text-lg px-8 py-6" style={{ boxShadow: "0 0 30px rgba(212,175,55,0.4)" }}>
                  <Star className="w-5 h-5 mr-2" />
                  Tirar Carta do Dia
                </Button>
              </Link>
              <Link href="/horoscopo">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6">
                  <Sun className="w-5 h-5 mr-2" />
                  Ver Horóscopo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-950/50 to-black/70" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-medium tracking-wider uppercase">Explore nossos serviços</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-2 text-white">Nossos Oráculos</h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Escolha entre diferentes métodos de autoconhecimento e orientação espiritual
              </p>
            </motion.div>
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
                    <Card className={"h-full bg-black/40 backdrop-blur-md border " + service.borderColor + " opacity-60 cursor-not-allowed"}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                            <Icon className={"w-6 h-6 " + service.iconColor} />
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/60">
                            {service.badge}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                        <p className="text-white/60 text-sm mb-4">{service.description}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Link href={service.href}>
                      <Card className={"h-full bg-gradient-to-br " + service.color + " backdrop-blur-md border " + service.borderColor + " hover:border-primary/50 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className={"w-6 h-6 " + service.iconColor} />
                            </div>
                            <span className={service.badge === "Premium" 
                              ? "px-2 py-1 text-xs rounded-full bg-primary/30 text-primary border border-primary/30" 
                              : "px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            }>
                              {service.badge}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                          <p className="text-white/70 text-sm mb-4">{service.description}</p>
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

      {/* Features Section with Tarot background */}
      <section className="py-24 relative z-10 overflow-hidden">
        {/* Tarot background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(" + TAROT_BG + ")",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/70" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-medium tracking-wider uppercase">Por que nos escolher</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-2 text-white">Por que escolher o Oráculo Místico?</h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Uma experiência completa de autoconhecimento ao seu alcance
              </p>
            </motion.div>
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
                  className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-950/50 to-black/70" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-primary/30 p-8 md:p-16"
            style={{
              backgroundImage: "url(" + HERO_BG + ")",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Decorative stars */}
            <motion.div 
              className="absolute top-4 left-4 text-primary text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.div>
            <motion.div 
              className="absolute top-8 right-12 text-primary/60 text-xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              ✧
            </motion.div>
            <motion.div 
              className="absolute bottom-8 left-16 text-primary/40 text-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              ✦
            </motion.div>
            <motion.div 
              className="absolute bottom-4 right-8 text-primary text-xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              ✧
            </motion.div>

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Comece sua jornada de{" "}
                <span className="gold-text" style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.5))" }}>autoconhecimento</span>
              </h2>
              <p className="text-white/80 mb-10 text-lg leading-relaxed">
                Tire sua primeira carta gratuitamente e descubra o que o universo 
                tem a dizer sobre seu caminho.
              </p>
              <Link href="/tarot/dia">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 text-lg px-10 py-6" style={{ boxShadow: "0 0 40px rgba(212,175,55,0.5)" }}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar Agora - É Grátis
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-primary/20 relative z-10">
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center border border-primary/30">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif text-lg font-bold gold-text">Oráculo Místico</span>
            </div>

            <nav className="flex items-center gap-6">
              <Link href="/tarot/dia" className="text-sm text-white/70 hover:text-primary transition-colors">
                Tarot
              </Link>
              <Link href="/numerologia" className="text-sm text-white/70 hover:text-primary transition-colors">
                Numerologia
              </Link>
              <Link href="/horoscopo" className="text-sm text-white/70 hover:text-primary transition-colors">
                Horóscopo
              </Link>
            </nav>

            <p className="text-sm text-white/50">
              © 2026 Oráculo Místico. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
