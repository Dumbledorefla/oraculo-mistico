import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Eye, EyeOff, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminGames() {
  const { data: games, isLoading, error } = trpc.admin.listGames.useQuery();

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
        <p className="text-red-400">Erro ao carregar jogos: {error.message}</p>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400">Nenhum jogo encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Jogos e Oráculos</CardTitle>
          <CardDescription className="text-purple-300">
            Gerencie os jogos disponíveis no site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="flex items-center justify-between p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{game.name}</h3>
                    {game.premium && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-purple-300 flex items-center gap-1">
                      <BarChart className="w-4 h-4" />
                      {game.plays} jogadas
                    </span>
                    <span className={`text-sm ${game.active ? "text-green-300" : "text-red-300"}`}>
                      {game.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Estatísticas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-purple-500/30 ${
                      game.active 
                        ? "text-red-300 hover:bg-red-500/20" 
                        : "text-green-300 hover:bg-green-500/20"
                    }`}
                    disabled
                    title="Funcionalidade em desenvolvimento"
                  >
                    {game.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
