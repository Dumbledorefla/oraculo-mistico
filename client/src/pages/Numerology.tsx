/**
 * Calculadora de Numerologia
 * Design: Neo-Mysticism - Fundo escuro com acentos dourados
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Calculator,
  Star,
  Lock,
  Sparkles,
  Heart,
  Briefcase,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  calculateAllNumbers, 
  getNumberInterpretation,
  NumerologyResult 
} from "@/data/numerology";
import { toast } from "sonner";

export default function Numerology() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [activeTab, setActiveTab] = useState<keyof NumerologyResult>("destiny");
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!fullName.trim()) {
      toast.error("Por favor, insira seu nome completo.");
      return;
    }
    if (!birthDate) {
      toast.error("Por favor, insira sua data de nascimento.");
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation animation
    setTimeout(() => {
      const numbers = calculateAllNumbers(fullName, birthDate);
      setResult(numbers);
      setIsCalculating(false);
    }, 1500);
  };

  const tabs = [
    { key: "destiny" as const, label: "Destino", icon: Star, description: "Seu caminho de vida" },
    { key: "expression" as const, label: "Expressão", icon: User, description: "Como você se expressa" },
    { key: "soul" as const, label: "Alma", icon: Heart, description: "Seus desejos profundos" },
    { key: "personality" as const, label: "Personalidade", icon: Briefcase, description: "Como os outros o veem" },
    { key: "personalYear" as const, label: "Ano Pessoal", icon: Calendar, description: "Energia do ano atual" },
  ];

  const getInterpretationKey = (tab: keyof NumerologyResult): string => {
    const map: Record<keyof NumerologyResult, string> = {
      destiny: "destiny",
      expression: "expression",
      soul: "soul",
      personality: "personality",
      personalYear: "personalYear"
    };
    return map[tab];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg gold-text">Numerologia</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-12 container">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Mapa Numerológico</h1>
                <p className="text-muted-foreground">
                  Descubra os números que regem sua vida e entenda seu propósito, 
                  talentos e desafios através da numerologia.
                </p>
              </div>

              <Card className="bg-card/50 border-primary/20">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Nome Completo
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Digite seu nome completo..."
                      className="bg-background border-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use o nome completo de nascimento para maior precisão
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Data de Nascimento
                    </label>
                    <Input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="bg-background border-primary/20 focus:border-primary"
                    />
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    {isCalculating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                        </motion.div>
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Calcular Mapa
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Seu Mapa Numerológico</h1>
                <p className="text-muted-foreground">{fullName}</p>
              </div>

              {/* Numbers Overview */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {tabs.map((tab) => {
                  const interpretation = getNumberInterpretation(result[tab.key]);
                  return (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`p-4 rounded-xl border transition-all ${
                        activeTab === tab.key
                          ? "bg-primary/10 border-primary"
                          : "bg-card/50 border-primary/10 hover:border-primary/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-3xl font-bold gold-text mb-1">
                        {result[tab.key]}
                      </div>
                      <div className="text-sm font-medium">{tab.label}</div>
                      <div className="text-xs text-muted-foreground">{interpretation?.title}</div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Detailed Interpretation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {(() => {
                    const interpretation = getNumberInterpretation(result[activeTab]);
                    const tab = tabs.find(t => t.key === activeTab)!;
                    const TabIcon = tab.icon;
                    
                    return (
                      <Card className="bg-card/50 border-primary/20">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                              <span className="text-3xl font-bold gold-text">{result[activeTab]}</span>
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <TabIcon className="w-5 h-5 text-primary" />
                                {tab.label}: {interpretation?.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">{tab.description}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Keywords */}
                          <div className="flex flex-wrap gap-2">
                            {interpretation?.keywords.map((keyword, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>

                          {/* Main Interpretation - Free */}
                          <div>
                            <h3 className="font-semibold mb-2 gold-text">Sobre o Número {result[activeTab]}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {interpretation?.general}
                            </p>
                          </div>

                          {/* Specific Interpretation - Free */}
                          <div>
                            <h3 className="font-semibold mb-2 gold-text">
                              {tab.label === "Ano Pessoal" ? "Energia de " + new Date().getFullYear() : `Seu Número de ${tab.label}`}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {interpretation?.[getInterpretationKey(activeTab) as keyof typeof interpretation]}
                            </p>
                          </div>

                          {/* Premium Content - Locked */}
                          <Card className="bg-card/30 border-primary/10 relative overflow-hidden">
                            <div className="absolute inset-0 backdrop-blur-sm bg-background/50 z-10 flex flex-col items-center justify-center">
                              <Lock className="w-8 h-8 text-primary mb-3" />
                              <p className="text-sm text-muted-foreground mb-3">Análise Aprofundada</p>
                              <Button 
                                size="sm" 
                                className="bg-primary text-primary-foreground"
                                onClick={() => toast.info("Funcionalidade de assinatura em desenvolvimento!")}
                              >
                                Desbloquear Mapa Completo
                              </Button>
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-semibold mb-2">Compatibilidades</h3>
                              <p className="text-muted-foreground">
                                Descubra quais números são mais compatíveis com você...
                              </p>
                              <h3 className="font-semibold mb-2 mt-4">Desafios e Lições</h3>
                              <p className="text-muted-foreground">
                                Entenda os desafios que este número traz...
                              </p>
                            </CardContent>
                          </Card>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setResult(null)}
                  className="flex-1"
                >
                  Calcular Outro Mapa
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Voltar ao Início
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
