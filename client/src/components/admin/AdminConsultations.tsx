import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminConsultations() {
  const { data: consultations, isLoading, error } = trpc.admin.listConsultations.useQuery({
    limit: 100,
    offset: 0,
    status: "all",
  });

  const utils = trpc.useUtils();

  const updateStatusMutation = trpc.admin.updateConsultationStatus.useMutation({
    onSuccess: (_, variables) => {
      const statusText = getStatusText(variables.status);
      toast.success(`Consulta marcada como ${statusText}`);
      utils.admin.listConsultations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-500/20 text-orange-300";
      case "confirmed": return "bg-blue-500/20 text-blue-300";
      case "completed": return "bg-green-500/20 text-green-300";
      case "cancelled": return "bg-red-500/20 text-red-300";
      case "no_show": return "bg-gray-500/20 text-gray-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "confirmed": return "Confirmada";
      case "completed": return "Realizada";
      case "cancelled": return "Cancelada";
      case "no_show": return "Não compareceu";
      default: return status;
    }
  };

  const handleConfirm = (consultationId: number) => {
    updateStatusMutation.mutate({ consultationId, status: "confirmed" });
  };

  const handleCancel = (consultationId: number) => {
    updateStatusMutation.mutate({ consultationId, status: "cancelled" });
  };

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
        <p className="text-red-400">Erro ao carregar consultas: {error.message}</p>
      </div>
    );
  }

  if (!consultations || consultations.length === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400">Nenhuma consulta encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Consultas Agendadas</CardTitle>
          <CardDescription className="text-purple-300">
            {consultations.length} consultas encontradas
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
                    <td className="py-3 px-4 text-white">
                      Usuário #{consultation.userId}
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {consultation.taromanteId ? `Taromante #${consultation.taromanteId}` : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {consultation.scheduledAt 
                        ? new Date(consultation.scheduledAt).toLocaleDateString("pt-BR")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {consultation.scheduledAt 
                        ? new Date(consultation.scheduledAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-green-300">
                      {consultation.price ? `R$ ${parseFloat(consultation.price).toFixed(2)}` : "N/A"}
                    </td>
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
                              onClick={() => handleConfirm(consultation.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                              onClick={() => handleCancel(consultation.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                          disabled
                          title="Ver detalhes (em desenvolvimento)"
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
