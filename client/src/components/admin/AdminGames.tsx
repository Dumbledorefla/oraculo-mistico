import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Eye, EyeOff } from "lucide-react";

export default function AdminGames() {
  // TODO: Buscar dados reais do backend
  const games = [
    { id: 1, name: "Tarot do Dia", plays: 523, active: true, premium: false },
    { id: 2, name: "Tarot do Amor", plays: 342, active: true, premium: true },
    { id: 3, name: "Tarot Completo", plays: 189, active: true, premium: true },
    { id: 4, name: "Numerologia", plays: 267, active: true, premium: false },
    { id: 5, name: "Horóscopo", plays: 445, active: true, premium: false },
  ];

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
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
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
