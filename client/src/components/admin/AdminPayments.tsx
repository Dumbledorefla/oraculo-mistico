import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, RefreshCw, Download } from "lucide-react";

export default function AdminPayments() {
  // TODO: Buscar pagamentos reais do backend
  const payments = [
    { id: 1, user: "Maria Silva", type: "Assinatura Premium", amount: 19.90, status: "paid", date: "2024-02-04" },
    { id: 2, user: "João Santos", type: "Consulta", amount: 150.00, status: "paid", date: "2024-02-04" },
    { id: 3, user: "Pedro Lima", type: "Curso de Tarot", amount: 297.00, status: "pending", date: "2024-02-03" },
    { id: 4, user: "Carla Oliveira", type: "Assinatura Premium", amount: 19.90, status: "refunded", date: "2024-02-03" },
  ];

  const subscriptions = [
    { id: 1, user: "Maria Silva", plan: "Premium Mensal", amount: 19.90, status: "active", nextBilling: "2024-03-04" },
    { id: 2, user: "João Santos", plan: "Premium Anual", amount: 199.00, status: "active", nextBilling: "2025-01-20" },
    { id: 3, user: "Ana Costa", plan: "Premium Mensal", amount: 19.90, status: "cancelled", nextBilling: "-" },
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-300";
      case "pending": return "bg-yellow-500/20 text-yellow-300";
      case "refunded": return "bg-red-500/20 text-red-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Pago";
      case "pending": return "Pendente";
      case "refunded": return "Reembolsado";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Transações */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Transações Recentes</CardTitle>
          <CardDescription className="text-purple-300">
            Histórico de pagamentos e compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Usuário</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-white">{payment.user}</td>
                    <td className="py-3 px-4 text-purple-300">{payment.type}</td>
                    <td className="py-3 px-4 text-green-300">R$ {payment.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(payment.status)}`}>
                        {getPaymentStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {new Date(payment.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {payment.status === "paid" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                          >
                            Reembolsar
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

      {/* Assinaturas */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Assinaturas Ativas</CardTitle>
          <CardDescription className="text-purple-300">
            Gerencie as assinaturas dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Usuário</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Plano</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Próxima Cobrança</th>
                  <th className="text-left py-3 px-4 text-purple-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-white">{sub.user}</td>
                    <td className="py-3 px-4 text-purple-300">{sub.plan}</td>
                    <td className="py-3 px-4 text-green-300">R$ {sub.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        sub.status === "active" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {sub.status === "active" ? "Ativa" : "Cancelada"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {sub.nextBilling !== "-" ? new Date(sub.nextBilling).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {sub.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                          >
                            Cancelar
                          </Button>
                        )}
                        {sub.status === "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/30 text-green-300 hover:bg-green-500/20"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reativar
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
    </div>
  );
}
