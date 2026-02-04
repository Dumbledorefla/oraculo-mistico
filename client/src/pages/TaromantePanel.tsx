/**
 * Painel do Taromante - Dashboard para gestão de consultas e serviços
 */

import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  Settings,
  MessageCircle,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { id: 0, name: "Domingo", short: "Dom" },
  { id: 1, name: "Segunda", short: "Seg" },
  { id: 2, name: "Terça", short: "Ter" },
  { id: 3, name: "Quarta", short: "Qua" },
  { id: 4, name: "Quinta", short: "Qui" },
  { id: 5, name: "Sexta", short: "Sex" },
  { id: 6, name: "Sábado", short: "Sáb" },
];

const CONSULTATION_TYPE_ICONS: Record<string, typeof Video> = {
  video: Video,
  chat: MessageCircle,
  phone: Phone,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  no_show: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmada",
  completed: "Concluída",
  cancelled: "Cancelada",
  no_show: "Não Compareceu",
};

export default function TaromantePanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Get taromante data for the logged-in user
  const { data: taromante, isLoading: loadingTaromante } = trpc.taromantes.getByUserId.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Get consultations for this taromante
  const { data: consultations, isLoading: loadingConsultations } = trpc.taromantes.getConsultations.useQuery(
    { taromanteId: taromante?.id || 0 },
    { enabled: !!taromante?.id }
  );

  // Get services for this taromante
  const { data: services } = trpc.taromantes.getServices.useQuery(
    { taromanteId: taromante?.id || 0 },
    { enabled: !!taromante?.id }
  );

  // Get availability for this taromante
  const { data: availability } = trpc.taromantes.getAvailability.useQuery(
    { taromanteId: taromante?.id || 0 },
    { enabled: !!taromante?.id }
  );

  if (loading || loadingTaromante) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!taromante) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
        <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  Voltar
                </a>
              </Link>
              <a className="flex items-center gap-2 text-amber-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-4">Você não é um Taromante</h1>
            <p className="text-gray-400 mb-8">
              Esta área é exclusiva para taromantes cadastrados. Se você deseja se tornar um especialista em nossa plataforma, entre em contato conosco.
            </p>
            <Link href="/consultas">
              <Button className="bg-gradient-to-r from-purple-600 to-amber-600">
                Ver Taromantes Disponíveis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingConsultations = consultations?.filter(c => c.status === "pending" || c.status === "confirmed") || [];
  const completedConsultations = consultations?.filter(c => c.status === "completed") || [];
  const totalEarnings = completedConsultations.reduce((sum: number, c: any) => sum + parseFloat(c.price || "0"), 0);
  const thisMonthEarnings = completedConsultations
    .filter(c => {
      const date = new Date(c.scheduledAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum: number, c: any) => sum + parseFloat(c.price || "0"), 0);

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
              <a className="flex items-center gap-2 text-amber-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src={taromante.photoUrl || "https://via.placeholder.com/40"}
                alt={taromante.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
              />
              <div className="hidden md:block">
                <p className="text-white font-medium">{taromante.name}</p>
                <p className="text-gray-400 text-sm">{taromante.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">Painel do Taromante</h1>
          <p className="text-gray-400">Gerencie suas consultas, agenda e serviços</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Consultas Pendentes</p>
                  <p className="text-3xl font-bold text-white">{pendingConsultations.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Consultas Realizadas</p>
                  <p className="text-3xl font-bold text-white">{completedConsultations.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ganhos do Mês</p>
                  <p className="text-3xl font-bold text-amber-400">
                    R$ {thisMonthEarnings.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avaliação</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-white">{taromante.rating}</p>
                    <Star className="w-6 h-6 text-amber-400" fill="currentColor" />
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-1">{taromante.totalReviews} avaliações</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-purple-500/20">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Consultations */}
              <Card className="bg-gray-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white font-serif flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Próximas Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {pendingConsultations.slice(0, 5).map((consultation: any) => {
                        const TypeIcon = CONSULTATION_TYPE_ICONS[consultation.consultationType] || Video;
                        return (
                          <div
                            key={consultation.id}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <TypeIcon className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {new Date(consultation.scheduledAt).toLocaleDateString("pt-BR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {new Date(consultation.scheduledAt).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {" - "}
                                  {consultation.duration} min
                                </p>
                              </div>
                            </div>
                            <Badge className={STATUS_COLORS[consultation.status]}>
                              {STATUS_LABELS[consultation.status]}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada</p>
                  )}
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card className="bg-gray-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white font-serif flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400">Total de Ganhos</span>
                      <span className="text-xl font-bold text-amber-400">
                        R$ {totalEarnings.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400">Ganhos do Mês</span>
                      <span className="text-xl font-bold text-green-400">
                        R$ {thisMonthEarnings.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400">Consultas Realizadas</span>
                      <span className="text-xl font-bold text-white">{completedConsultations.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white font-serif">Histórico de Consultas</CardTitle>
                <CardDescription className="text-gray-400">
                  Todas as suas consultas agendadas e realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consultations && consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.map((consultation: any) => {
                      const TypeIcon = CONSULTATION_TYPE_ICONS[consultation.consultationType] || Video;
                      return (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-purple-500/10"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {new Date(consultation.scheduledAt).toLocaleDateString("pt-BR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {new Date(consultation.scheduledAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                {" - "}
                                {consultation.duration} minutos
                              </p>
                              {consultation.topic && (
                                <p className="text-gray-500 text-sm mt-1">Tema: {consultation.topic}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-amber-400 font-bold">
                              R$ {parseFloat(consultation.price || "0").toFixed(2).replace(".", ",")}
                            </span>
                            <Badge className={STATUS_COLORS[consultation.status]}>
                              {STATUS_LABELS[consultation.status]}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma consulta encontrada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white font-serif">Disponibilidade Semanal</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure os dias e horários que você está disponível para atender
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayAvailability = availability?.find((a) => a.dayOfWeek === day.id);
                    const isActive = dayAvailability?.isActive ?? false;

                    return (
                      <div
                        key={day.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isActive
                            ? "bg-purple-500/10 border-purple-500/30"
                            : "bg-gray-800/50 border-gray-700/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Switch checked={isActive} disabled />
                          <span className={`font-medium ${isActive ? "text-white" : "text-gray-500"}`}>
                            {day.name}
                          </span>
                        </div>
                        {isActive && dayAvailability && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>
                              {dayAvailability.startTime} - {dayAvailability.endTime}
                            </span>
                          </div>
                        )}
                        {!isActive && <span className="text-gray-500 text-sm">Indisponível</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  * Para alterar sua disponibilidade, entre em contato com o suporte.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white font-serif">Seus Serviços</CardTitle>
                <CardDescription className="text-gray-400">
                  Serviços que você oferece aos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services && services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-purple-500/10"
                      >
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-gray-400 text-sm">{service.description}</p>
                          <p className="text-gray-500 text-sm mt-1">{service.duration} minutos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-400">
                            R$ {parseFloat(service.price || "0").toFixed(2).replace(".", ",")}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              service.isActive
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }
                          >
                            {service.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhum serviço cadastrado</p>
                )}
                <p className="text-gray-500 text-sm mt-4">
                  * Para adicionar ou editar serviços, entre em contato com o suporte.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
