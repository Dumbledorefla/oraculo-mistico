import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, GamepadIcon, Calendar, TrendingUp, Star } from "lucide-react";

export default function AdminStats() {
  // TODO: Buscar dados reais do backend
  const stats = {
    totalUsers: 1247,
    newUsersToday: 23,
    totalRevenue: 15420.50,
    revenueToday: 340.00,
    totalGames: 156,
    gamesToday: 12,
    totalConsultations: 89,
    consultationsToday: 5,
    activeSubscriptions: 234,
    averageRating: 4.8,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usuários */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-purple-300 mt-1">
              +{stats.newUsersToday} hoje
            </p>
          </CardContent>
        </Card>

        {/* Receita */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-green-300 mt-1">
              +R$ {stats.revenueToday.toFixed(2)} hoje
            </p>
          </CardContent>
        </Card>

        {/* Jogos */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Jogos Realizados
            </CardTitle>
            <GamepadIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
            <p className="text-xs text-purple-300 mt-1">
              +{stats.gamesToday} hoje
            </p>
          </CardContent>
        </Card>

        {/* Consultas */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Consultas Agendadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalConsultations}</div>
            <p className="text-xs text-purple-300 mt-1">
              +{stats.consultationsToday} hoje
            </p>
          </CardContent>
        </Card>

        {/* Assinaturas */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Assinaturas Ativas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeSubscriptions}</div>
            <p className="text-xs text-green-300 mt-1">
              +12% este mês
            </p>
          </CardContent>
        </Card>

        {/* Avaliação */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageRating}</div>
            <p className="text-xs text-yellow-300 mt-1">
              De 5.0 estrelas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Atividade Recente</CardTitle>
          <CardDescription className="text-purple-300">
            Últimas ações no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "Maria Silva", action: "Realizou Tarot do Amor", time: "2 minutos atrás" },
              { user: "João Santos", action: "Agendou consulta com Ana Costa", time: "15 minutos atrás" },
              { user: "Carla Oliveira", action: "Assinou plano Premium", time: "1 hora atrás" },
              { user: "Pedro Lima", action: "Completou curso de Tarot", time: "2 horas atrás" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-0">
                <div>
                  <p className="text-white font-medium">{activity.user}</p>
                  <p className="text-sm text-purple-300">{activity.action}</p>
                </div>
                <span className="text-xs text-purple-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
