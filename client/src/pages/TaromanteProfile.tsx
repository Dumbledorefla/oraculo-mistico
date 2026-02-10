/**
 * Página de Perfil do Taromante
 * Exibe informações detalhadas e permite agendamento de consultas
 */

import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "wouter";
import { 
  Star, 
  Clock, 
  MessageCircle,
  Video,
  Phone,
  Sparkles,
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const SPECIALTY_LABELS: Record<string, string> = {
  tarot: "Tarot",
  numerologia: "Numerologia",
  astrologia: "Astrologia",
  videncia: "Vidência",
  runas: "Runas",
  amor: "Amor",
  "mapa-astral": "Mapa Astral",
  "baralho-cigano": "Baralho Cigano",
  cristais: "Cristais",
  autoconhecimento: "Autoconhecimento",
  decisoes: "Decisões",
  previsoes: "Previsões",
};

const CONSULTATION_TYPES = [
  { id: "video", label: "Vídeo", icon: Video, description: "Consulta por videochamada" },
  { id: "chat", label: "Chat", icon: MessageCircle, description: "Consulta por mensagens" },
  { id: "phone", label: "Telefone", icon: Phone, description: "Consulta por ligação" },
];

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TaromanteProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"video" | "chat" | "phone">("video");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const { data: taromante, isLoading } = trpc.taromantes.getBySlug.useQuery({ slug: slug || "" });
  const { data: services } = trpc.taromantes.getServices.useQuery(
    { taromanteId: taromante?.id || 0 },
    { enabled: !!taromante?.id }
  );
  const { data: availability } = trpc.taromantes.getAvailability.useQuery(
    { taromanteId: taromante?.id || 0 },
    { enabled: !!taromante?.id }
  );
  const { data: reviews } = trpc.taromantes.getReviews.useQuery(
    { taromanteId: taromante?.id || 0, limit: 5 },
    { enabled: !!taromante?.id }
  );

  const createCheckoutMutation = trpc.consultations.createWithPayment.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
        toast.success("✨ Preparando sua consulta mística...");
      }
    },
    onError: (error) => {
      toast.error("🔮 Não foi possível agendar sua consulta. Por favor, tente novamente.");
    },
  });

  const selectedServiceData = services?.find((s) => s.id === selectedService);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  // Generate available time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate || !availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find((a) => a.dayOfWeek === dayOfWeek);

    if (!dayAvailability) return [];

    const slots: string[] = [];
    const [startHour, startMin] = (dayAvailability.startTime || "09:00").split(":").map(Number);
    const [endHour, endMin] = (dayAvailability.endTime || "18:00").split(":").map(Number);

    const duration = selectedServiceData?.duration || 30;

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`;
      slots.push(timeStr);

      currentMin += duration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  }, [selectedDate, availability, selectedServiceData]);

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    if (newStart >= new Date()) {
      setCurrentWeekStart(newStart);
    }
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime || !taromante) {
      toast.error("Por favor, selecione todos os campos obrigatórios");
      return;
    }

    const scheduledAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    createCheckoutMutation.mutate({
      taromanteId: taromante.id,
      taromanteSlug: taromante.slug,
      taromanteName: taromante.name,
      serviceName: selectedServiceData?.name || "Consulta",
      scheduledAt: scheduledAt.toISOString(),
      duration: selectedServiceData?.duration || 30,
      consultationType: selectedType,
      topic: topic || undefined,
      price: selectedServiceData?.price || taromante.pricePerSession || "0",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!taromante) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Taromante não encontrado</h1>
          <Link href="/consultas">
            <Button>Voltar para Consultas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/consultas">
              <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center gap-2 text-amber-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-gray-900/50 border-purple-500/20 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-900/50 to-amber-900/50" />
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col md:flex-row gap-6 -mt-16">
                  <img
                    src={taromante.photoUrl || "https://via.placeholder.com/150"}
                    alt={taromante.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-900"
                  />
                  <div className="flex-1 pt-4 md:pt-16">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-serif text-white">{taromante.name}</h1>
                        <p className="text-amber-400">{taromante.title}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full">
                        <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
                        <span className="text-white font-bold">{taromante.rating}</span>
                        <span className="text-gray-400">({taromante.totalReviews})</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(taromante.specialties as string[])?.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {SPECIALTY_LABELS[specialty] || specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{taromante.experience} anos de experiência</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>{taromante.totalConsultations} consultas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-gray-900/50 border border-purple-500/20">
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card className="bg-gray-900/50 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-white mb-4">Sobre {taromante.name}</h3>
                    <p className="text-gray-400 whitespace-pre-line">{taromante.bio}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card className="bg-gray-900/50 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-white mb-4">Avaliações</h3>
                    {reviews && reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-purple-500/20 pb-4 last:border-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? "text-amber-400" : "text-gray-600"}`}
                                    fill={star <= review.rating ? "currentColor" : "none"}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-500 text-sm">
                                {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            {review.comment && <p className="text-gray-400">{review.comment}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Nenhuma avaliação ainda.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-purple-500/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  Agendar Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <div>
                  <Label className="text-gray-400 mb-2 block">Tipo de Consulta</Label>
                  <div className="space-y-2">
                    {services?.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedService === service.id
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-purple-500/30 hover:border-purple-500/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{service.name}</p>
                            <p className="text-gray-500 text-sm">{service.description}</p>
                            <p className="text-gray-400 text-sm mt-1">{service.duration} minutos</p>
                          </div>
                          <p className="text-amber-400 font-bold">
                            R$ {parseFloat(service.price || "0").toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <Label className="text-gray-400 mb-2 block">Modalidade</Label>
                  <RadioGroup
                    value={selectedType}
                    onValueChange={(v) => setSelectedType(v as any)}
                    className="flex gap-2"
                  >
                    {CONSULTATION_TYPES.map((type) => (
                      <div key={type.id} className="flex-1">
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <Label
                          htmlFor={type.id}
                          className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedType === type.id
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-purple-500/30 hover:border-purple-500/50"
                          }`}
                        >
                          <type.icon className="w-5 h-5 text-gray-400 mb-1" />
                          <span className="text-white text-sm">{type.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Date Selection */}
                <div>
                  <Label className="text-gray-400 mb-2 block">Data</Label>
                  <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-gray-400 text-sm">
                      {currentWeekStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleNextWeek}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((date) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isPast = date < new Date() && !isToday;
                      const dayOfWeek = date.getDay();
                      const hasAvailability = availability?.some((a) => a.dayOfWeek === dayOfWeek);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();

                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => !isPast && hasAvailability && setSelectedDate(date)}
                          disabled={isPast || !hasAvailability}
                          className={`p-2 rounded-lg text-center transition-all ${
                            isSelected
                              ? "bg-amber-500 text-white"
                              : isPast || !hasAvailability
                              ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                              : "bg-gray-800/50 text-gray-300 hover:bg-purple-500/20"
                          }`}
                        >
                          <div className="text-xs">{DAYS_OF_WEEK[dayOfWeek]}</div>
                          <div className="font-bold">{date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && timeSlots.length > 0 && (
                  <div>
                    <Label className="text-gray-400 mb-2 block">Horário</Label>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded text-sm transition-all ${
                            selectedTime === time
                              ? "bg-amber-500 text-white"
                              : "bg-gray-800/50 text-gray-300 hover:bg-purple-500/20"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic */}
                <div>
                  <Label className="text-gray-400 mb-2 block">Assunto (opcional)</Label>
                  <Textarea
                    placeholder="Descreva brevemente o que gostaria de consultar..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white"
                    rows={3}
                  />
                </div>

                {/* Summary & Book Button */}
                <div className="pt-4 border-t border-purple-500/20">
                  {selectedServiceData && (
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Total</span>
                      <span className="text-2xl font-bold text-amber-400">
                        R$ {parseFloat(selectedServiceData.price || "0").toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedService || !selectedDate || !selectedTime || createCheckoutMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                  >
                    {createCheckoutMutation.isPending ? (
                      "Consultando os astros..."
                    ) : isAuthenticated ? (
                      "Confirmar e Pagar"
                    ) : (
                      "Fazer Login para Agendar"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
