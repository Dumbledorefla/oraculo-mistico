/**
 * Horóscopo Personalizado
 * Design: Neo-Mysticism - Fundo escuro com acentos dourados
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Star,
  Lock,
  Sparkles,
  Heart,
  Briefcase,
  Sun,
  Moon,
  Flame,
  Droplets,
  Wind,
  Mountain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodiacSigns, ZodiacSign, getDailyMessage } from "@/data/horoscope";
import { toast } from "sonner";
import UserDataForm, { UserData } from "@/components/UserDataForm";
import { UpsellBlock } from "@/components/UpsellBlock";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const elementIcons = {
  "Fogo": Flame,
  "Terra": Mountain,
  "Ar": Wind,
  "Água": Droplets
};

const elementColors = {
  "Fogo": "text-orange-400",
  "Terra": "text-green-400",
  "Ar": "text-sky-400",
  "Água": "text-blue-400"
};

export default function Horoscope() {
  const { isAuthenticated } = useAuth();
  const [showUserDataForm, setShowUserDataForm] = useState(true);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  
  // OB1: Buscar dados pessoais do usuário
  const { data: userPersonalData } = trpc.userData.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateUserDataMutation = trpc.userData.update.useMutation();
  
  // OB1: Handle user data form submission
  const handleUserDataSubmit = async (data: UserData) => {
    // Salvar dados no banco se usuário estiver logado
    if (isAuthenticated) {
      try {
        await updateUserDataMutation.mutateAsync({
          fullName: data.fullName,
          birthDate: data.birthDate,
        });
      } catch (error) {
        console.error("Erro ao salvar dados do usuário:", error);
      }
    }
    
    setShowUserDataForm(false);
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
            <Sun className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg gold-text">Horóscopo</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-12 container">
        <AnimatePresence mode="wait">
          {/* OB1: User Data Collection Form */}
          {showUserDataForm ? (
            <UserDataForm
              onSubmit={handleUserDataSubmit}
              initialData={{
                fullName: userPersonalData?.fullName || "",
                birthDate: userPersonalData?.birthDate 
                  ? (typeof userPersonalData.birthDate === 'string' 
                      ? userPersonalData.birthDate 
                      : new Date(userPersonalData.birthDate).toISOString().split('T')[0])
                  : "",
              }}
              title="Seus Dados para Horóscopo"
              description="Para personalizar suas previsões astrológicas, precisamos do seu nome completo e data de nascimento."
            />
          ) : !selectedSign ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Horóscopo do Dia</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Selecione seu signo para descobrir as previsões do dia para amor, 
                  trabalho e vida em geral.
                </p>
              </div>

              {/* Zodiac Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                {zodiacSigns.map((sign, index) => {
                  const ElementIcon = elementIcons[sign.element];
                  return (
                    <motion.button
                      key={sign.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedSign(sign)}
                      className="group p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/50 hover:bg-card transition-all"
                    >
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {sign.symbol}
                      </div>
                      <div className="font-medium text-sm">{sign.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ElementIcon className={`w-3 h-3 ${elementColors[sign.element]}`} />
                        <span className="text-xs text-muted-foreground">{sign.element}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{sign.dateRange}</div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Sign Header */}
              <div className="text-center mb-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-7xl mb-4"
                >
                  {selectedSign.symbol}
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">{selectedSign.name}</h1>
                <p className="text-muted-foreground">{selectedSign.dateRange}</p>
                
                {/* Element & Quality */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {(() => {
                    const ElementIcon = elementIcons[selectedSign.element];
                    return (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/20">
                        <ElementIcon className={`w-4 h-4 ${elementColors[selectedSign.element]}`} />
                        <span className="text-sm">{selectedSign.element}</span>
                      </div>
                    );
                  })()}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/20">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedSign.quality}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/20">
                    <Moon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{selectedSign.ruling}</span>
                  </div>
                </div>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {selectedSign.traits.map((trait, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Daily Messages */}
              {(() => {
                const messages = getDailyMessage(selectedSign);
                return (
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* General */}
                    <Card className="bg-card/50 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sun className="w-5 h-5 text-primary" />
                          Geral
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {messages.general}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Love */}
                    <Card className="bg-card/50 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Heart className="w-5 h-5 text-pink-400" />
                          Amor
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {messages.love}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Work */}
                    <Card className="bg-card/50 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Briefcase className="w-5 h-5 text-green-400" />
                          Trabalho
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {messages.work}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}

              {/* Sign Description */}
              <Card className="bg-card/50 border-primary/20 mb-8">
                <CardHeader>
                  <CardTitle className="gold-text">Sobre {selectedSign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedSign.description}
                  </p>
                </CardContent>
              </Card>

              {/* Compatibility */}
              <Card className="bg-card/50 border-primary/20 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Compatibilidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {selectedSign.compatibility.map((signName) => {
                      const compatSign = zodiacSigns.find(s => s.name === signName);
                      return compatSign ? (
                        <button
                          key={signName}
                          onClick={() => setSelectedSign(compatSign)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-primary/20 hover:border-primary/50 transition-colors"
                        >
                          <span className="text-xl">{compatSign.symbol}</span>
                          <span>{signName}</span>
                        </button>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Content - Locked */}
              <Card className="bg-card/30 border-primary/10 relative overflow-hidden mb-8">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/50 z-10 flex flex-col items-center justify-center">
                  <Lock className="w-8 h-8 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">Mapa Astral Completo</p>
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground"
                    onClick={() => toast.info("Funcionalidade de assinatura em desenvolvimento!")}
                  >
                    Desbloquear Análise Completa
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Previsões Semanais e Mensais</h3>
                  <p className="text-muted-foreground">
                    Acesse previsões detalhadas para a semana e o mês...
                  </p>
                  <h3 className="font-semibold mb-2 mt-4">Trânsitos Planetários</h3>
                  <p className="text-muted-foreground">
                    Entenda como os planetas estão influenciando seu signo...
                  </p>
                  <h3 className="font-semibold mb-2 mt-4">Mapa Astral Personalizado</h3>
                  <p className="text-muted-foreground">
                    Descubra seu ascendente, lua e posições planetárias...
                  </p>
                </CardContent>
              </Card>

              {/* Upsell Block - Horóscopo Gratuito */}
              <div className="mb-8">
                <UpsellBlock
                  title="Descubra seu Mapa Astral Completo"
                  description="Esse horóscopo diário oferece uma visão geral do seu signo. Para uma análise astrológica completa com seu ascendente, lua, posições planetárias e previsões personalizadas, desbloqueie seu Mapa Astral."
                  features={[
                    "Mapa Astral personalizado com ascendente e lua",
                    "Análise de trânsitos planetários atuais",
                    "Previsões semanais e mensais detalhadas",
                    "Compatibilidade astrológica aprofundada",
                  ]}
                  ctaText="Gerar Mapa Astral"
                  ctaLink="/mapa-astral"
                  price="R$ 49,90"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedSign(null)}
                  className="flex-1"
                >
                  Ver Outros Signos
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
