import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, GamepadIcon, Calendar, TrendingUp, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AdminStats() {
  const { data: stats, isLoading, error } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400">Erro ao carregar estatísticas: {error.message}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400">Nenhuma estatística disponível</p>
      </div>
    );
  }

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
              {stats.newUsers} novos (últimos 30 dias)
            </p>
            {stats.bannedUsers > 0 && (
              <p className="text-xs text-red-400 mt-1">
                {stats.bannedUsers} banidos
              </p>
            )}
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
              {stats.pendingOrders} pedidos pendentes
            </p>
            <p className="text-xs text-purple-300 mt-1">
              Taxa de conversão: {stats.conversionRate}%
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
              Leituras de Tarot
            </p>
          </CardContent>
        </Card>

        {/* Consultas */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Consultas
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalConsultations}</div>
            <p className="text-xs text-purple-300 mt-1">
              {stats.pendingConsultations} pendentes
            </p>
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Produtos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-green-300 mt-1">
              {stats.activeProducts} ativos
            </p>
          </CardContent>
        </Card>

        {/* Taromantes */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">
              Taromantes
            </CardTitle>
            <Star className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTaromantes}</div>
            <p className="text-xs text-amber-300 mt-1">
              {stats.activeTaromantes} ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-300">Atividade Recente</CardTitle>
          <p className="text-sm text-purple-400/70">Últimas ações no sistema</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.pendingProofsCount > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Comprovantes Pendentes</p>
                  <p className="text-xs text-purple-400/70">Aguardando aprovação</p>
                </div>
                <span className="text-sm text-orange-400">{stats.pendingProofsCount}</span>
              </div>
            )}
            
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Pedidos Pendentes</p>
                  <p className="text-xs text-purple-400/70">Aguardando pagamento</p>
                </div>
                <span className="text-sm text-orange-400">{stats.pendingOrders}</span>
              </div>
            )}

            {stats.pendingConsultations > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Consultas Pendentes</p>
                  <p className="text-xs text-purple-400/70">Aguardando confirmação</p>
                </div>
                <span className="text-sm text-orange-400">{stats.pendingConsultations}</span>
              </div>
            )}

            {stats.totalEnrollments > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Matrículas em Cursos</p>
                  <p className="text-xs text-purple-400/70">{stats.totalCourses} cursos disponíveis</p>
                </div>
                <span className="text-sm text-green-400">{stats.totalEnrollments}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
