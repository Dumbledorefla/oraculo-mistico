/**
 * Painel Administrativo - Oráculo Místico
 * Painel funcional conectado ao banco de dados via tRPC
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Loader2,
  AlertTriangle,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// ==================== OVERVIEW TAB ====================
function OverviewTab() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery();
  const { data: recentUsers, isLoading: usersLoading } = trpc.admin.listUsers.useQuery({ limit: 5, offset: 0, role: "all" });
  const { data: recentPayments, isLoading: paymentsLoading } = trpc.admin.listPayments.useQuery({ limit: 5, offset: 0, status: "all" });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3 text-gray-400">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    +{stats?.newUsers || 0} novos (30 dias)
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Receita Total</p>
                  <p className="text-3xl font-bold text-white">
                    R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {stats?.pendingOrders || 0} pedidos pendentes
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Consultas</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalConsultations || 0}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Total realizadas
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Jogos de Tarot</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalGames || 0}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Leituras realizadas
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Pedidos Recentes</CardTitle>
            <CardDescription>Últimas transações da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            ) : recentPayments && recentPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment: any) => (
                    <TableRow key={payment.id} className="border-purple-500/10">
                      <TableCell className="text-gray-500">#{payment.id}</TableCell>
                      <TableCell className="text-purple-300">
                        R$ {parseFloat(payment.totalAmount || "0").toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          payment.status === "paid" 
                            ? "bg-green-500/20 text-green-400"
                            : payment.status === "pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : payment.status === "refunded"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                        }>
                          {payment.status === "paid" ? "Pago" : payment.status === "pending" ? "Pendente" : payment.status === "refunded" ? "Reembolsado" : "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Nenhum pedido encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Novos Usuários</CardTitle>
            <CardDescription>Usuários cadastrados recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            ) : recentUsers && recentUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">Nome</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((u: any) => (
                    <TableRow key={u.id} className="border-purple-500/10">
                      <TableCell className="text-white">{u.name || u.fullName || "Sem nome"}</TableCell>
                      <TableCell className="text-gray-400">{u.email || "—"}</TableCell>
                      <TableCell>
                        <Badge className={
                          u.role === "admin" 
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                        }>
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Nenhum usuário encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==================== USERS TAB ====================
function UsersTab() {
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");

  const { data: usersList, isLoading, refetch } = trpc.admin.listUsers.useQuery({ 
    limit: 100, offset: 0, role: roleFilter 
  });

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Role do usuário atualizado com sucesso!");
      setShowRoleDialog(false);
      setSelectedUser(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro");
    },
  });

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role === "admin" ? "user" : "admin");
    setShowRoleDialog(true);
  };

  const confirmRoleChange = () => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    }
  };

  return (
    <>
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Gestão de Usuários</CardTitle>
              <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                <SelectTrigger className="w-40 bg-gray-800 border-purple-500/30 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <span className="ml-3 text-gray-400">Carregando usuários...</span>
            </div>
          ) : usersList && usersList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Nome</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Cadastro</TableHead>
                    <TableHead className="text-gray-400">Último Login</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((u: any) => (
                    <TableRow key={u.id} className="border-purple-500/10">
                      <TableCell className="text-gray-500">#{u.id}</TableCell>
                      <TableCell className="text-white">{u.name || u.fullName || "Sem nome"}</TableCell>
                      <TableCell className="text-gray-400">{u.email || "—"}</TableCell>
                      <TableCell>
                        <Badge className={
                          u.role === "admin" 
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                        }>
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(u.lastSignedIn).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={u.role === "admin" ? "text-orange-400 hover:text-orange-300" : "text-green-400 hover:text-green-300"}
                            onClick={() => handleChangeRole(u)}
                          >
                            {u.role === "admin" ? (
                              <><UserX className="w-4 h-4 mr-1" /> Remover Admin</>
                            ) : (
                              <><UserCheck className="w-4 h-4 mr-1" /> Tornar Admin</>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Alterar Permissão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja {newRole === "admin" ? "promover" : "rebaixar"} o usuário{" "}
              <strong className="text-white">{selectedUser?.name || selectedUser?.email}</strong> para{" "}
              <strong className="text-purple-400">{newRole === "admin" ? "Administrador" : "Usuário"}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="border-gray-600 text-gray-400">
              Cancelar
            </Button>
            <Button 
              onClick={confirmRoleChange} 
              disabled={updateRoleMutation.isPending}
              className={newRole === "admin" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
            >
              {updateRoleMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ==================== ORDERS TAB ====================
function OrdersTab() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "cancelled" | "refunded">("all");
  
  const { data: payments, isLoading, refetch } = trpc.admin.listPayments.useQuery({ 
    limit: 100, offset: 0, status: statusFilter 
  });

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-white">Gestão de Pedidos</CardTitle>
            <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-40 bg-gray-800 border-purple-500/30 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="refunded">Reembolsados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="ml-3 text-gray-400">Carregando pedidos...</span>
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Usuário ID</TableHead>
                  <TableHead className="text-gray-400">Valor</TableHead>
                  <TableHead className="text-gray-400">Método</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Data</TableHead>
                  <TableHead className="text-gray-400">Pago em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: any) => (
                  <TableRow key={payment.id} className="border-purple-500/10">
                    <TableCell className="text-gray-500">#{payment.id}</TableCell>
                    <TableCell className="text-white">#{payment.userId}</TableCell>
                    <TableCell className="text-purple-300">
                      R$ {parseFloat(payment.totalAmount || "0").toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {payment.paymentMethod || "Stripe"}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        payment.status === "paid" 
                          ? "bg-green-500/20 text-green-400"
                          : payment.status === "pending"
                          ? "bg-orange-500/20 text-orange-400"
                          : payment.status === "refunded"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }>
                        {payment.status === "paid" ? "Pago" : payment.status === "pending" ? "Pendente" : payment.status === "refunded" ? "Reembolsado" : "Cancelado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('pt-BR') : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum pedido encontrado</p>
            <p className="text-sm mt-2">Os pedidos aparecerão aqui quando os clientes fizerem compras.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== CONSULTATIONS TAB ====================
function ConsultationsTab() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled" | "no_show">("all");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("confirmed");

  const { data: consultationsList, isLoading, refetch } = trpc.admin.listConsultations.useQuery({ 
    limit: 100, offset: 0, status: statusFilter 
  });

  const updateStatusMutation = trpc.admin.updateConsultationStatus.useMutation({
    onSuccess: () => {
      toast.success("Status da consulta atualizado!");
      setShowStatusDialog(false);
      setSelectedConsultation(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro");
    },
  });

  const handleChangeStatus = (consultation: any) => {
    setSelectedConsultation(consultation);
    setNewStatus(consultation.status === "pending" ? "confirmed" : "completed");
    setShowStatusDialog(true);
  };

  const confirmStatusChange = () => {
    if (selectedConsultation) {
      updateStatusMutation.mutate({ 
        consultationId: selectedConsultation.id, 
        status: newStatus as any 
      });
    }
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmada",
    completed: "Concluída",
    cancelled: "Cancelada",
    no_show: "Não compareceu",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-orange-500/20 text-orange-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    no_show: "bg-gray-500/20 text-gray-400",
  };

  return (
    <>
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Gestão de Consultas</CardTitle>
              <CardDescription>Gerencie todas as consultas agendadas</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-44 bg-gray-800 border-purple-500/30 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="no_show">Não compareceu</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <span className="ml-3 text-gray-400">Carregando consultas...</span>
            </div>
          ) : consultationsList && consultationsList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Usuário ID</TableHead>
                    <TableHead className="text-gray-400">Taromante ID</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Agendada para</TableHead>
                    <TableHead className="text-gray-400">Duração</TableHead>
                    <TableHead className="text-gray-400">Valor</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultationsList.map((c: any) => (
                    <TableRow key={c.id} className="border-purple-500/10">
                      <TableCell className="text-gray-500">#{c.id}</TableCell>
                      <TableCell className="text-white">#{c.userId}</TableCell>
                      <TableCell className="text-gray-400">#{c.taromanteId}</TableCell>
                      <TableCell className="text-gray-400 capitalize">{c.consultationType}</TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(c.scheduledAt).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-gray-400">{c.duration} min</TableCell>
                      <TableCell className="text-purple-300">
                        R$ {parseFloat(c.price || "0").toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[c.status] || "bg-gray-500/20 text-gray-400"}>
                          {statusLabels[c.status] || c.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-400 hover:text-purple-300"
                          onClick={() => handleChangeStatus(c)}
                        >
                          Alterar Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma consulta encontrada</p>
              <p className="text-sm mt-2">As consultas aparecerão aqui quando os clientes agendarem.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Alterar Status da Consulta #{selectedConsultation?.id}</DialogTitle>
            <DialogDescription>
              Selecione o novo status para esta consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-gray-400 mb-2 block">Novo Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="no_show">Não compareceu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)} className="border-gray-600 text-gray-400">
              Cancelar
            </Button>
            <Button 
              onClick={confirmStatusChange} 
              disabled={updateStatusMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ==================== GAMES TAB ====================
function GamesTab() {
  const { data: games, isLoading, refetch } = trpc.admin.listGames.useQuery();

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Jogos de Tarot</CardTitle>
            <CardDescription>Estatísticas de uso dos jogos</CardDescription>
          </div>
          <Button variant="outline" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <span className="ml-3 text-gray-400">Carregando jogos...</span>
          </div>
        ) : games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game: any) => (
              <Card key={game.id} className="bg-gray-800/50 border-purple-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{game.name}</h3>
                    <Badge className={game.premium ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}>
                      {game.premium ? "Premium" : "Grátis"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-300">{game.plays}</p>
                      <p className="text-gray-500 text-sm">jogadas realizadas</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${game.active ? "bg-green-400" : "bg-red-400"}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum jogo encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== SETTINGS TAB ====================
function SettingsTab() {
  const [settings, setSettings] = useState({
    monthlyPrice: 29.90,
    annualPrice: 199.90,
    consultationBasePrice: 80.00,
    heroTitle: "Desvende os Mistérios do Universo",
    heroSubtitle: "Tarot, Numerologia e Astrologia em um só lugar.",
  });

  const updateSettingsMutation = trpc.admin.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (err) => {
      toast.error(err.message || "Ocorreu um erro");
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  return (
    <div className="space-y-6">
      {/* Preços */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Preços</CardTitle>
          <CardDescription>Configure os preços dos produtos e serviços</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-400">Assinatura Mensal (R$)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={settings.monthlyPrice} 
                onChange={(e) => setSettings({ ...settings, monthlyPrice: parseFloat(e.target.value) })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-400">Assinatura Anual (R$)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={settings.annualPrice} 
                onChange={(e) => setSettings({ ...settings, annualPrice: parseFloat(e.target.value) })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-400">Consulta Base (R$)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={settings.consultationBasePrice} 
                onChange={(e) => setSettings({ ...settings, consultationBasePrice: parseFloat(e.target.value) })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Textos do Site */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Textos do Site</CardTitle>
          <CardDescription>Edite os textos principais do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-400">Título do Hero</Label>
            <Input 
              value={settings.heroTitle} 
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="bg-gray-800 border-purple-500/30 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-400">Subtítulo do Hero</Label>
            <Textarea 
              value={settings.heroSubtitle} 
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="bg-gray-800 border-purple-500/30 text-white mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updateSettingsMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 px-8"
        >
          {updateSettingsMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}

// ==================== MAIN ADMIN PANEL ====================
export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Voltar ao Início
            </Button>
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
            <Link href="/">
              <span className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </span>
            </Link>
            <div className="flex items-center gap-2 text-purple-300 font-serif text-xl">
              <Shield className="w-6 h-6" />
              Painel Administrativo
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-400">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-purple-500/20 flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-500/20">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-purple-500/20">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="consultations" className="data-[state=active]:bg-purple-500/20">
              <Calendar className="w-4 h-4 mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-purple-500/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Jogos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="consultations"><ConsultationsTab /></TabsContent>
          <TabsContent value="games"><GamesTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
