/**
 * Jogo de Tarot Interativo - Versão Expandida
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
  Star,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { majorArcana, TarotCard, getRandomCards } from "@/data/tarotCardsExpanded";
import { tarotSpreads, getSpreadById } from "@/data/tarotSpreads";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useSaveTarotReading } from "@/hooks/useSaveTarotReading";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import TarotPaywall from "@/components/TarotPaywall";
import UserDataForm, { UserData } from "@/components/UserDataForm";
import { UpsellBlock } from "@/components/UpsellBlock";
import { trpc } from "@/lib/trpc";

type GamePhase = "paywall" | "userData" | "intro" | "spread-select" | "mentalize" | "shuffle" | "select" | "result" | "history";

interface TarotGameProps {
  gameType?: "dia" | "amor" | "completo" | "celtic" | "life-path";
}

export default function TarotGame({ gameType = "dia" }: TarotGameProps) {
  const { isAuthenticated, user } = useAuth();
  const { addReading, history, deleteReading } = useReadingHistory();
  const { saveReading } = useSaveTarotReading();
  
  // OB1: Buscar dados pessoais do usuário
  const { data: userPersonalData } = trpc.userData.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateUserDataMutation = trpc.userData.update.useMutation();

  const spreadId = gameType === "dia" ? "daily" : gameType === "amor" ? "love" : gameType === "completo" ? "complete" : gameType === "celtic" ? "celtic-cross" : "life-path";
  const spread = getSpreadById(spreadId);
  const cardsToSelect = spread?.cardCount || 1;
  const gameTitle = spread?.name || "Tarot";
  const isPremium = spread?.isPremium || false;

  const [phase, setPhase] = useState<GamePhase>(isPremium && !isAuthenticated ? "paywall" : "userData");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [userName, setUserName] = useState("");
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCards, setRevealedCards] = useState<TarotCard[]>([]);
  const [question, setQuestion] = useState("");

  // Shuffle cards on mount
  useEffect(() => {
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, []);

  // OB1: Handle user data form submission
  const handleUserDataSubmit = async (data: UserData) => {
    setUserData(data);
    setUserName(data.fullName);
    setBirthDate(data.birthDate);
    
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
    
    setPhase("intro");
  };

  const handleStartGame = () => {
    if (!userName.trim()) {
      toast.error("Por favor, insira seu nome para continuar.");
      return;
    }
    if (isPremium && !birthDate.trim()) {
      toast.error("Por favor, insira sua data de nascimento para continuar.");
      return;
    }
    setPhase("mentalize");
  };

  const handleMentalize = () => {
    setPhase("shuffle");
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setIsShuffling(false);
      setPhase("select");
    }, 2000);
  };

  const handleSelectCard = (card: TarotCard) => {
    if (selectedCards.length < cardsToSelect) {
      setSelectedCards([...selectedCards, card]);
      
      if (selectedCards.length + 1 === cardsToSelect) {
        setTimeout(() => {
          setRevealedCards([...selectedCards, card]);
          setPhase("result");
          
          // Salvar no histórico local
          const selectedCardsList = [...selectedCards, card];
          addReading({
            spreadType: spreadId,
            spreadName: gameTitle,
            cards: selectedCardsList.map(c => c.id),
            cardNames: selectedCardsList.map(c => c.name),
            question: question || undefined
          });
          
          // Salvar no backend se autenticado
          if (isAuthenticated) {
            saveReading({
              readingType: spreadId,
              cards: selectedCardsList.map(c => ({
                id: c.id,
                name: c.name,
                meaning: c.meaning
              })),
              interpretation: question || undefined,
              userName: userName || undefined
            });
          }
        }, 500);
      }
    }
  };

  const handleReset = () => {
    setPhase("intro");
    setUserName("");
    setSelectedCards([]);
    setRevealedCards([]);
    setQuestion("");
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-purple-400">{gameTitle}</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-400 hover:text-purple-300"
            onClick={() => setPhase(phase === "history" ? "intro" : "history")}
          >
            <History className="w-4 h-4 mr-2" />
            Histórico
          </Button>
        </div>

        <div className="container mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Paywall Phase */}
            {phase === "paywall" && (
              <TarotPaywall 
                gameName={gameTitle}
                onUnlock={() => setPhase("userData")}
              />
            )}

            {/* OB1: User Data Collection Phase */}
            {phase === "userData" && (
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
                isLoveMethod={gameType === "amor"}
                title="Seus Dados Pessoais"
                description="Para personalizar sua leitura de Tarot, precisamos de algumas informações básicas."
              />
            )}

            {/* Intro Phase */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto"
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">{gameTitle}</h2>
                      <p className="text-gray-300">{spread?.description}</p>
                      {isPremium && (
                        <div className="mt-3 inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full">
                          <span className="text-purple-400 text-sm font-semibold">✨ Premium</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                          Seu Nome
                        </label>
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Digite seu nome..."
                          className="bg-purple-900/50 border-purple-500/30 text-white placeholder:text-gray-500"
                          onKeyPress={(e) => e.key === "Enter" && handleStartGame()}
                        />
                      </div>

                      {isPremium && (
                        <div>
                          <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Data de Nascimento
                          </label>
                          <Input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="bg-purple-900/50 border-purple-500/30 text-white placeholder:text-gray-500"
                          />
                        </div>
                      )}

                      {(gameType === "amor" || gameType === "completo" || gameType === "celtic" || gameType === "life-path") && (
                        <div>
                          <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Sua Pergunta (Opcional)
                          </label>
                          <Input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="O que você gostaria de saber?"
                            className="bg-purple-900/50 border-purple-500/30 text-white placeholder:text-gray-500"
                          />
                        </div>
                      )}

                      <Button
                        onClick={handleStartGame}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-black font-bold py-2"
                      >
                        Começar <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mentalize Phase */}
            {phase === "mentalize" && (
              <motion.div
                key="mentalize"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-8"
                >
                  <Star className="w-16 h-16 text-purple-400 mx-auto" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">Concentre-se</h2>
                <p className="text-gray-300 mb-8">
                  Feche os olhos, respire profundamente e concentre-se em sua pergunta ou intenção.
                </p>
                <Button
                  onClick={handleMentalize}
                  className="bg-purple-500 hover:bg-purple-600 text-black font-bold px-8 py-3"
                >
                  Continuar <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Shuffle Phase */}
            {phase === "shuffle" && (
              <motion.div
                key="shuffle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  animate={{ rotate: isShuffling ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isShuffling ? Infinity : 0 }}
                  className="mb-8"
                >
                  <div className="w-24 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mx-auto flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">Embaralhando as cartas...</h2>
                <p className="text-gray-300 mb-8">
                  As energias do universo estão se alinhando para você.
                </p>
                <Button
                  onClick={handleShuffle}
                  disabled={isShuffling}
                  className="bg-purple-500 hover:bg-purple-600 text-black font-bold px-8 py-3 disabled:opacity-50"
                >
                  {isShuffling ? "Embaralhando..." : "Embaralhar"} <RotateCcw className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Select Phase */}
            {phase === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Selecione {cardsToSelect} carta{cardsToSelect > 1 ? "s" : ""}
                  </h2>
                  <p className="text-gray-300">
                    Você selecionou {selectedCards.length} de {cardsToSelect}
                  </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  {shuffledCards.map((card, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectCard(card)}
                      disabled={selectedCards.length >= cardsToSelect}
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-all cursor-pointer">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      {selectedCards.includes(card) && (
                        <motion.div
                          layoutId={`selected-${index}`}
                          className="absolute inset-0 bg-green-500/30 rounded-lg border-2 border-green-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Result Phase */}
            {phase === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-400 mb-2">Seu Resultado</h2>
                  <p className="text-gray-300">Bem-vindo, {userName}! Aqui está sua mensagem do universo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {revealedCards.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotateY: 180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.3 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 overflow-hidden">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-purple-400">{card.name}</h3>
                            {spread?.positions[index] && (
                              <p className="text-sm text-gray-400">{spread.positions[index].name}</p>
                            )}
                          </div>
                          <div className="bg-purple-900/50 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-purple-400" />
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Significado</p>
                              <p className="text-white">{card.meaning}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Interpretação</p>
                              <p className="text-white">{card.interpretation}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Conselho</p>
                              <p className="text-purple-300">{card.advice}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Upsell Block - Apenas para Tarot do Dia (método gratuito) */}
                {gameType === "dia" && (
                  <div className="mb-8">
                    <UpsellBlock
                      title="Quer uma leitura mais profunda?"
                      description="Essa leitura gratuita oferece uma visão inicial do seu dia. Para uma análise completa sobre amor, carreira e vida pessoal, experimente nosso Tarot Completo com 6 cartas."
                      features={[
                        "Tiragem com 6 cartas do Tarot Maior",
                        "Análise profunda de passado, presente e futuro",
                        "Orientações personalizadas para sua jornada",
                        "Interpretação detalhada de cada posição",
                      ]}
                      ctaText="Fazer Tarot Completo"
                      ctaLink="/tarot/completo"
                      price="R$ 29,90"
                    />
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleReset}
                    className="bg-purple-500 hover:bg-purple-600 text-black font-bold px-8 py-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Nova Leitura
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:text-purple-300">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* History Phase */}
            {phase === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-purple-400 mb-6">Histórico de Leituras</h2>
                {history.length === 0 ? (
                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-300">Você ainda não fez nenhuma leitura.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {history.map((reading) => (
                      <Card key={reading.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-purple-400">{reading.spreadName}</h3>
                              <p className="text-sm text-gray-400">{reading.date}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteReading(reading.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Deletar
                            </Button>
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">
                              <span className="text-purple-400 font-semibold">Cartas:</span> {reading.cardNames.join(", ")}
                            </p>
                            {reading.question && (
                              <p className="text-sm text-gray-300 mt-2">
                                <span className="text-purple-400 font-semibold">Pergunta:</span> {reading.question}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Button
                  onClick={() => setPhase("intro")}
                  className="mt-6 bg-purple-500 hover:bg-purple-600 text-black font-bold px-8 py-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
