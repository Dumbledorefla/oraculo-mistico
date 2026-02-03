/**
 * Jogo de Tarot Interativo
 * Design: Neo-Mysticism - Fundo escuro com acentos dourados
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  Lock,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { tarotCards, CARD_BACK_IMAGE, TarotCard } from "@/data/tarotCards";
import { toast } from "sonner";

type GamePhase = "intro" | "mentalize" | "shuffle" | "select" | "result";

interface TarotGameProps {
  gameType?: "dia" | "amor" | "completo";
}

export default function TarotGame({ gameType = "dia" }: TarotGameProps) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [userName, setUserName] = useState("");
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCard, setRevealedCard] = useState<TarotCard | null>(null);

  const cardsToSelect = gameType === "dia" ? 1 : gameType === "amor" ? 3 : 6;
  const gameTitle = gameType === "dia" ? "Tarot do Dia" : gameType === "amor" ? "Tarot e o Amor" : "Tarot Completo";

  // Shuffle cards on mount
  useEffect(() => {
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  const handleStartGame = () => {
    if (!userName.trim()) {
      toast.error("Por favor, insira seu nome para continuar.");
      return;
    }
    setPhase("mentalize");
  };

  const handleMentalize = () => {
    setPhase("shuffle");
    setIsShuffling(true);
    
    // Simulate shuffling animation
    setTimeout(() => {
      setIsShuffling(false);
      setPhase("select");
    }, 3000);
  };

  const handleSelectCard = (card: TarotCard) => {
    if (selectedCards.find(c => c.id === card.id)) return;
    if (selectedCards.length >= cardsToSelect) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === cardsToSelect) {
      setTimeout(() => {
        setRevealedCard(newSelected[0]);
        setPhase("result");
      }, 500);
    }
  };

  const handleRestart = () => {
    setPhase("intro");
    setSelectedCards([]);
    setRevealedCard(null);
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
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
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg gold-text">{gameTitle}</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-12 container">
        <AnimatePresence mode="wait">
          {/* INTRO PHASE */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{gameTitle}</h1>
              <p className="text-muted-foreground mb-8">
                {gameType === "dia" 
                  ? "Descubra a mensagem que o universo tem para você hoje."
                  : gameType === "amor"
                  ? "Explore as energias que cercam sua vida amorosa."
                  : "Uma leitura completa sobre sua jornada de vida."}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2 text-left">
                    Seu nome
                  </label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Digite seu nome..."
                    className="bg-card border-primary/20 focus:border-primary"
                  />
                </div>

                <Button 
                  onClick={handleStartGame}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  Iniciar Jogo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* MENTALIZE PHASE */}
          {phase === "mentalize" && (
            <motion.div
              key="mentalize"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(212, 175, 55, 0.3)",
                    "0 0 60px rgba(212, 175, 55, 0.5)",
                    "0 0 20px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
              >
                <Star className="w-20 h-20 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-4">Momento de Mentalização</h2>
              <p className="text-muted-foreground mb-8">
                {userName}, feche os olhos por um momento. Respire fundo e concentre-se 
                na pergunta ou situação que deseja iluminar. Quando estiver pronto, 
                clique para embaralhar as cartas.
              </p>

              <Button 
                onClick={handleMentalize}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Embaralhar as Cartas
                <RotateCcw className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* SHUFFLE PHASE */}
          {phase === "shuffle" && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-lg mx-auto text-center"
            >
              <h2 className="text-2xl font-bold mb-8">Embaralhando...</h2>
              
              <div className="relative h-64 flex items-center justify-center">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-24 h-36 rounded-lg overflow-hidden shadow-xl"
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{
                      x: [0, (i - 2) * 30, 0, (i - 2) * -30, 0],
                      y: [0, -20, 0, -20, 0],
                      rotate: [0, (i - 2) * 15, 0, (i - 2) * -15, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    style={{ zIndex: 5 - i }}
                  >
                    <img 
                      src={CARD_BACK_IMAGE} 
                      alt="Carta" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <p className="text-muted-foreground mt-8">
                As cartas estão sendo preparadas para você...
              </p>
            </motion.div>
          )}

          {/* SELECT PHASE */}
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2">Escolha {cardsToSelect === 1 ? "sua carta" : `${cardsToSelect} cartas`}</h2>
              <p className="text-muted-foreground mb-8">
                {selectedCards.length} de {cardsToSelect} selecionada{cardsToSelect > 1 ? "s" : ""}
              </p>

              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {shuffledCards.slice(0, 12).map((card, index) => {
                  const isSelected = selectedCards.find(c => c.id === card.id);
                  const canSelect = selectedCards.length < cardsToSelect && !isSelected;
                  
                  return (
                    <motion.button
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => canSelect && handleSelectCard(card)}
                      disabled={!canSelect && !isSelected}
                      className={`relative w-20 h-28 md:w-24 md:h-36 rounded-lg overflow-hidden transition-all duration-300 ${
                        isSelected 
                          ? "ring-2 ring-primary scale-95 opacity-50" 
                          : canSelect 
                          ? "hover:scale-105 hover:shadow-lg hover:shadow-primary/20 cursor-pointer" 
                          : "opacity-30 cursor-not-allowed"
                      }`}
                    >
                      <img 
                        src={CARD_BACK_IMAGE} 
                        alt="Carta" 
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Star className="w-8 h-8 text-primary" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RESULT PHASE */}
          {phase === "result" && revealedCard && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Sua Leitura, {userName}</h2>
                <p className="text-muted-foreground">
                  {gameType === "dia" ? "A carta do dia" : `${selectedCards.length} carta${selectedCards.length > 1 ? "s" : ""} selecionada${selectedCards.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Card Display */}
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <img 
                      src={revealedCard.image} 
                      alt={revealedCard.name}
                      className="w-64 h-auto rounded-xl shadow-2xl"
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-card rounded-full border border-primary/30">
                      <span className="font-serif text-lg gold-text">{revealedCard.name}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Interpretation */}
                <div className="space-y-6">
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {revealedCard.keywords.map((keyword, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {/* General Meaning - Free */}
                  <Card className="bg-card/50 border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-3 gold-text">
                        Significado Geral
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {revealedCard.meaning.general}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Advice - Free */}
                  <Card className="bg-card/50 border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-3 gold-text">
                        Conselho
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {revealedCard.meaning.advice}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Premium Content - Locked */}
                  <Card className="bg-card/30 border-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-sm bg-background/50 z-10 flex flex-col items-center justify-center">
                      <Lock className="w-8 h-8 text-primary mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">Conteúdo Premium</p>
                      <Button 
                        size="sm" 
                        className="bg-primary text-primary-foreground"
                        onClick={() => toast.info("Funcionalidade de assinatura em desenvolvimento!")}
                      >
                        Desbloquear Leitura Completa
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-semibold mb-3">No Amor</h3>
                      <p className="text-muted-foreground">
                        {revealedCard.meaning.love.substring(0, 50)}...
                      </p>
                      <h3 className="font-serif text-xl font-semibold mb-3 mt-4">No Trabalho</h3>
                      <p className="text-muted-foreground">
                        {revealedCard.meaning.work.substring(0, 50)}...
                      </p>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleRestart}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Jogar Novamente
                    </Button>
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Voltar ao Início
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Multiple Cards Display */}
              {selectedCards.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 text-center">Todas as Cartas Selecionadas</h3>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {selectedCards.map((card, index) => (
                      <motion.button
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setRevealedCard(card)}
                        className={`relative w-20 h-28 rounded-lg overflow-hidden transition-all ${
                          revealedCard?.id === card.id 
                            ? "ring-2 ring-primary" 
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
