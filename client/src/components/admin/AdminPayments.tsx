import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, Download, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminPayments() {
  const { data: payments, isLoading, error } = trpc.admin.listPayments.useQuery({
    limit: 100,
    offset: 0,
    status: "all",
  });

  const utils = trpc.useUtils();

  const updateStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: (_, variables) => {
      toast.success(`Pedido atualizado para ${variables.status}`);
      utils.admin.listPayments.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-300";
      case "pending": return "bg-orange-500/20 text-orange-300";
      case "refunded": return "bg-red-500/20 text-red-300";
      case "cancelled": return "bg-gray-500/20 text-gray-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pago";
      case "pending": return "Pendente";
      case "refunded": return "Reembolsado";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const handleRefund = (orderId: number) => {
    if (confirm("Tem certeza que deseja reembolsar este pedido?")) {
      updateStatusMutation.mutate({ orderId, status: "refunded" });
    }
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
        <p className="text-red-400">Erro ao carregar pagamentos: {error.message}</p>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-400">Nenhum pagamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transações */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
          <CardDescription className="text-purple-300">
            {payments.length} transações encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Pedido</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Usuário</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-white">#{payment.id}</td>
                    <td className="py-3 px-4 text-purple-300">Usuário #{payment.userId}</td>
                    <td className="py-3 px-4 text-green-300">
                      R$ {parseFloat(payment.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(payment.status)}`}>
                        {getPaymentStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                          disabled
                          title="Ver detalhes (em desenvolvimento)"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {payment.status === "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                            onClick={() => handleRefund(payment.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            {updateStatusMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Reembolsar"
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Nota sobre Assinaturas */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Assinaturas</CardTitle>
          <CardDescription className="text-purple-300">
            Gerenciamento de assinaturas Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-purple-400">
            <p>Funcionalidade em desenvolvimento</p>
            <p className="text-sm mt-2 text-purple-400/70">
              Assinaturas Stripe serão gerenciadas diretamente pelo dashboard do Stripe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
