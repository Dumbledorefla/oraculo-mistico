import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X } from "lucide-react";

export default function AdminConsultations() {
  // TODO: Buscar consultas reais do backend
  const consultations = [
    { id: 1, client: "Maria Silva", taromante: "Ana Costa", date: "2024-02-05", time: "14:00", status: "pending", price: 150 },
    { id: 2, client: "João Santos", taromante: "Carla Mendes", date: "2024-02-05", time: "15:30", status: "confirmed", price: 150 },
    { id: 3, client: "Pedro Lima", taromante: "Ana Costa", date: "2024-02-06", time: "10:00", status: "completed", price: 150 },
    { id: 4, client: "Carla Oliveira", taromante: "Beatriz Santos", date: "2024-02-06", time: "16:00", status: "cancelled", price: 150 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-300";
      case "confirmed": return "bg-blue-500/20 text-blue-300";
      case "completed": return "bg-green-500/20 text-green-300";
      case "cancelled": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "confirmed": return "Confirmada";
      case "completed": return "Realizada";
      case "cancelled": return "Cancelada";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Consultas Agendadas</CardTitle>
          <CardDescription className="text-purple-300">
            Gerencie as consultas com taromantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Taromante</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Horário</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-white">{consultation.client}</td>
                    <td className="py-3 px-4 text-purple-300">{consultation.taromante}</td>
                    <td className="py-3 px-4 text-purple-300">
                      {new Date(consultation.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-purple-300">{consultation.time}</td>
                    <td className="py-3 px-4 text-green-300">R$ {consultation.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(consultation.status)}`}>
                        {getStatusText(consultation.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {consultation.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-300 hover:bg-green-500/20"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
