/**
 * Design Philosophy: Neo-Mysticism meets Tech Documentation
 * - Dark background with deep purple and midnight blue gradients
 * - Golden accents reminiscent of Tarot card borders
 * - High contrast typography: Playfair Display (serif) for headings, DM Sans for body
 * - Subtle glow effects and smooth animations
 */

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  Users, 
  BookOpen, 
  Calendar,
  CreditCard,
  ArrowRight,
  ChevronDown,
  Layers,
  Zap,
  Target,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Image URLs from generated assets
const IMAGES = {
  hero: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/4ocXs8lBk5viuExG1iOyR9-img-1_1770152755000_na1fn_aGVyby1teXN0aWNhbC1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzRvY1hzOGxCazV2aXVFeEcxaU95UjktaW1nLTFfMTc3MDE1Mjc1NTAwMF9uYTFmbl9hR1Z5YnkxdGVYTjBhV05oYkMxaVp3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NO9hBLtXYlBlyInjMwxIPRX8fZHcSwflC-Nm-9-hyxMW5aH8RFep4RqsHpZfnIGAks3MMYkPmCFMPcLyudxga3POaoD1xjHxfykUchPYIrSuXwNC27CW0wti-RPevPvMN55SGqT2JdY3QqIjX6D-xTXCXIpSPw9tKJUFpa7nSJ9moTdEvZ0u0Yl-lBZrKSj1sSZQIKDuprHcwHvuiStLA48Ww3VIvX8X7OlkxxLWK5YlI-3rTfTGDWOxegJMfsdVvP954kx4iigZ4hVbZ17AiV8djSnyyNZjPmeorNpqWQtYYUhK-mnQXarmW8XRU5JII8~oYbsrcCD1KIKGwkRCpA__",
  tarot: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/4ocXs8lBk5viuExG1iOyR9-img-2_1770152785000_na1fn_dGFyb3QtY2FyZHMtaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzRvY1hzOGxCazV2aXVFeEcxaU95UjktaW1nLTJfMTc3MDE1Mjc4NTAwMF9uYTFmbl9kR0Z5YjNRdFkyRnlaSE10YVd4c2RYTjBjbUYwYVc5dS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GehkZ815MnWeMG1EawLQQQzKeC4LbSjMUux3CGJH9EUfn~R7UPGAvurga6von9eOp1O6XeMoaLxGoQbwXhi5LaFhZlEDSl9SpijvZe2dPGzgLzB1GY4MTL4RbLTve5CLYTKYfwd9E8QE3tR-wNoEXArFOr6PLf76ezZNBRNt-O0bsRjgvI5y2WsW5~ry7b-VBkg2UFTUb~jRIyz8cM8qPMGgjZMMuatpzhXOj01mX0LGpVWPYoZAfMkrHsQduItFmOuukETz2Hkfib0MRoapRodlcq0oQrCwX6vadQtOex-AsHrCD6-5cyyP1Rtpd8C-kZFKc1snQj2~tq5YVfClYw__",
  astrology: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/4ocXs8lBk5viuExG1iOyR9-img-3_1770152777000_na1fn_YXN0cm9sb2d5LXdoZWVs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzRvY1hzOGxCazV2aXVFeEcxaU95UjktaW1nLTNfMTc3MDE1Mjc3NzAwMF9uYTFmbl9ZWE4wY205c2IyZDVMWGRvWldWcy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FplQCirhYtVgURGxjjKHThj2QWdWnw5qhVK0L-p9ywfg74Fi8bG0r~uIJCuby9m~eb25CsEHjTyDOz-onrq37ELo6ngUUdv9SR7XsQCg-nKGMzdrB~nCS9Ae1qtVb3klQjb5-fDkV-dxVnR1n74DOYyRJq2YqL8SSkBj2Pot40FGROiAJdtlC33uDDMPjyNjZhwWGwtsUVg2yDwZhq7uBWkomvnkalgZ54743q64n~vP47B637bIhZR-UiZelWHtuJh5t-4676WtrRdGMJPVVEjE4Ro2ApWbO-813UFYMEKjpS7JOQrXSNYn~Scd23pFPB8ulIKLgu4IFUPLxnQHiQ__",
  numerology: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/4ocXs8lBk5viuExG1iOyR9-img-4_1770152758000_na1fn_bnVtZXJvbG9neS1zeW1ib2xz.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzRvY1hzOGxCazV2aXVFeEcxaU95UjktaW1nLTRfMTc3MDE1Mjc1ODAwMF9uYTFmbl9iblZ0WlhKdmJHOW5lUzF6ZVcxaWIyeHoucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=na54KCAypguW~VlKGpquoi5Cfl3FxRH9F6CXObTnNvVw7laISWtKA65Q7B-jvqvNOY3aEF65Vz3F9CQ3FxjK1McgeXiQMvPwKpdnDsIy4TW57IgGuBBmM~9G-3L-K0luR9f2tJ4pz7o6ZbLmGGEH3CXK22XUnsbnR02n9C7hqHqkuJLBwkq51CvyzABJz7izgZcO2ltc86mVI4CGuyZFsEP~VObOyFK-Sj6Yulof6UE0QW6nElD6oq9F9R~vcFHjL6yjfZuRCZ-ld2JbPI6wn2ZfclrpMsba2JxzqEeK4HBEWD7yhrP4r1Y7JytDtJGUvt1i60J8PAcJ4oKy5yOtoA__",
  consultation: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/4ocXs8lBk5viuExG1iOyR9-img-5_1770152762000_na1fn_Y29uc3VsdGF0aW9uLWlsbHVzdHJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzRvY1hzOGxCazV2aXVFeEcxaU95UjktaW1nLTVfMTc3MDE1Mjc2MjAwMF9uYTFmbl9ZMjl1YzNWc2RHRjBhVzl1TFdsc2JIVnpkSEpoZEdsdmJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=nczXuymSA6CGvhkSeR2am8u0lmnxzvltn9KNVhiI4hgEZPU8Qv5vV4TxoUXaA0hvx7tlQWcjawYwQ1DtXtEb~PYrnen1gjIvj1AvGyIOxiKP1Vq08T0vBCnh2~jGfwdfdUJmSCxybcOt2syfwhgfvRRHeTvMHloCrgS1YUi325CTa346Pv6SXXbNMvzH3LwyDSlaZiT7~d~0P1gEEDNHQoViT2lop0xFgjf3fW7i5Pxi-cyFYgFYu1ju0tS9aSrAStdXmixwOm6tYc2gAmWDgQWe29mMQc2BSVxKp2GxTOnAkMJwGOQBnNZJI10jDaP4~0dj3LdpAhWyup-o4RfGuA__",
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Navigation Component
function Navigation() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10"
    >
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-serif text-xl font-semibold gold-text">Análise Personare</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: 'Visão Geral', id: 'overview' },
            { label: 'Tarot', id: 'tarot' },
            { label: 'Astrologia', id: 'astrology' },
            { label: 'Negócio', id: 'business' },
            { label: 'Recomendações', id: 'recommendations' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${IMAGES.hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container text-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Documento Técnico</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Análise Técnica{" "}
            <span className="gold-text">Personare</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Arquitetura de funcionalidades, mecânicas de interação e modelo de negócio 
            da maior plataforma de autoconhecimento do Brasil.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar Análise
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-primary/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Overview Section
function OverviewSection() {
  const features = [
    { icon: Layers, title: "Astrologia", desc: "Horóscopo personalizado e mapas astrais" },
    { icon: Moon, title: "Tarot e Runas", desc: "Jogos interativos de cartas" },
    { icon: Sun, title: "Numerologia", desc: "Mapas numerológicos e previsões" },
    { icon: BookOpen, title: "Cursos", desc: "Conteúdo educacional em vídeo" },
    { icon: Users, title: "Consultas", desc: "Marketplace de especialistas" },
    { icon: CreditCard, title: "Clube", desc: "Assinatura com benefícios exclusivos" },
  ];

  return (
    <section id="overview" className="py-24 relative">
      <div className="container">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase">
            Visão Geral
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Arquitetura da Plataforma
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            O Personare é estruturado como uma Single Page Application (SPA) com navegação 
            persistente através de um menu lateral e painel de controle do usuário.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="card-mystical h-full hover:border-primary/40 transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Tarot Section
function TarotSection() {
  const steps = [
    { num: "01", title: "Input de Dados", desc: "O usuário confirma o nome (já preenchido se logado)." },
    { num: "02", title: "Mentalização", desc: "Tela visual que convida o usuário a se concentrar na pergunta." },
    { num: "03", title: "Embaralhamento", desc: "Animação visual das cartas sendo misturadas." },
    { num: "04", title: "Seleção", desc: "O usuário clica fisicamente nas cartas (1 a 6 dependendo do jogo)." },
    { num: "05", title: "Processamento", desc: "O sistema associa a posição da carta a um banco de interpretações." },
    { num: "06", title: "Resultado", desc: "Entrega da interpretação (resumida grátis ou completa paga)." },
  ];

  return (
    <section id="tarot" className="py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.tarot})` }}
        />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Core do Projeto
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Mecânicas de{" "}
              <span className="gold-text">Tarot</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              O sistema de Tarot é baseado em uma experiência interativa de "sorteio" de cartas, 
              onde o sucesso depende de animações fluidas e uma interface que transmita 
              "misticismo" e confiança.
            </p>
            
            <div className="relative">
              <img 
                src={IMAGES.tarot} 
                alt="Cartas de Tarot" 
                className="rounded-xl shadow-2xl w-full max-w-md mx-auto lg:mx-0"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="flex gap-4 p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Astrology & Numerology Section
function AstrologySection() {
  return (
    <section id="astrology" className="py-24 relative">
      <div className="container">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase">
            Processamento de Dados
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Astrologia & Numerologia
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Diferente do Tarot (aleatório), estas seções são baseadas em cálculos 
            astronômicos e matemáticos precisos.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Astrology Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-mystical p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
              <img src={IMAGES.astrology} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Sun className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Horóscopo Personalizado</h3>
              <p className="text-muted-foreground mb-6">
                Cruza os dados de nascimento do usuário (data, hora, local) com o céu 
                do momento atual (trânsitos planetários) para gerar previsões personalizadas.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Cálculos baseados em efemérides astronômicas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Integração com Swiss Ephemeris ou similar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Atualização diária automática</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Numerology Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-mystical p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
              <img src={IMAGES.numerology} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mapas Numerológicos</h3>
              <p className="text-muted-foreground mb-6">
                Geram relatórios extensos baseados em algoritmos matemáticos fixos 
                aplicados ao nome e data de nascimento do usuário.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Cálculo de números pessoais (destino, expressão, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Banco de dados de interpretações por número</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Modelo Freemium: resumo grátis, completo pago</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Business Model Section
function BusinessSection() {
  return (
    <section id="business" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.consultation})` }}
      />
      
      <div className="container relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase">
            Monetização
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Modelo de Negócio
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Freemium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-mystical p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Freemium</h3>
            <p className="text-muted-foreground mb-6">
              Oferecer uma "pílula" de valor gratuita é essencial para converter 
              o usuário para o produto pago.
            </p>
            <div className="text-left space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Tarot do Dia gratuito</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Horóscopo básico</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Amostras de mapas</span>
              </div>
            </div>
          </motion.div>

          {/* Clube */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card-mystical p-8 text-center border-primary/40 relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Principal
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Clube Personare</h3>
            <p className="text-muted-foreground mb-6">
              Modelo de assinatura recorrente que libera acesso a vários mapas 
              e conteúdos exclusivos.
            </p>
            <div className="text-left space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Todos os mapas liberados</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Conteúdos exclusivos</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Descontos em consultas</span>
              </div>
            </div>
          </motion.div>

          {/* Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-mystical p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Marketplace</h3>
            <p className="text-muted-foreground mb-6">
              Intermediação entre especialistas e clientes, com sistema de 
              agendamento e pagamento integrado.
            </p>
            <div className="text-left space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Consultas online e presenciais</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Calendário integrado</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Pagamento na plataforma</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Consultation Flow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="card-mystical p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                <img 
                  src={IMAGES.consultation} 
                  alt="Consultas" 
                  className="rounded-xl w-full"
                />
              </div>
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Sistema de Consultas</h3>
                <p className="text-muted-foreground mb-6">
                  O Personare atua como um intermediário entre especialistas e clientes, 
                  oferecendo uma experiência completa de agendamento.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Busca e Filtros</h4>
                      <p className="text-sm text-muted-foreground">Por "Área da Vida" ou "Técnica"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Perfil do Especialista</h4>
                      <p className="text-sm text-muted-foreground">Vídeo, bio e avaliações</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Agendamento</h4>
                      <p className="text-sm text-muted-foreground">Calendário com fuso horário</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Pagamento Integrado</h4>
                      <p className="text-sm text-muted-foreground">Checkout dentro da plataforma</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Recommendations Section
function RecommendationsSection() {
  const recommendations = [
    {
      icon: Target,
      title: "Foco na Experiência Visual",
      desc: "O sucesso do Tarot depende de animações fluidas e uma interface que transmita 'misticismo' e confiança."
    },
    {
      icon: BookOpen,
      title: "Banco de Dados de Conteúdo",
      desc: "O maior ativo é o texto das interpretações. Você precisará de um volume massivo de conteúdo escrito por especialistas."
    },
    {
      icon: Zap,
      title: "Algoritmos de Cálculo",
      desc: "Para Astrologia/Numerologia, será necessário integrar APIs de cálculos astronômicos ou desenvolver os algoritmos matemáticos."
    },
    {
      icon: Gift,
      title: "Estratégia Freemium",
      desc: "Oferecer uma 'pílula' de valor gratuita é essencial para converter o usuário para o produto pago."
    },
  ];

  return (
    <section id="recommendations" className="py-24 relative">
      <div className="container">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeInUp} className="text-primary text-sm font-medium tracking-wider uppercase">
            Próximos Passos
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Recomendações para o Projeto
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pontos-chave para desenvolver uma plataforma similar ao Personare.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {recommendations.map((rec, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="card-mystical p-8 flex gap-6 hover:border-primary/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <rec.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                <p className="text-muted-foreground">{rec.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-12 border-t border-primary/10">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg gold-text">Análise Personare</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Documento técnico para fins de estudo e desenvolvimento.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <div className="section-divider" />
      <OverviewSection />
      <div className="section-divider" />
      <TarotSection />
      <div className="section-divider" />
      <AstrologySection />
      <div className="section-divider" />
      <BusinessSection />
      <div className="section-divider" />
      <RecommendationsSection />
      <Footer />
    </div>
  );
}
