/**
 * Painel Administrativo - Oráculo Místico
 * Painel funcional completo conectado ao banco de dados via tRPC
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Users, Package, DollarSign, Calendar,
  TrendingUp, ShoppingCart, BookOpen, BarChart3, Settings,
  Shield, Ban, CheckCircle, XCircle, Eye, RefreshCw,
  Loader2, AlertTriangle, UserCheck, UserX, Search, Filter,
  Webhook, Key, Activity, Plug, Plus, Trash2, Edit,
  Copy, ExternalLink, Star, ToggleLeft, ToggleRight,
  FileText, Clock, Globe, Zap, Database, Lock, Unlock
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
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// Helper for status badges
const statusBadge = (status: string, labels: Record<string, string>, colors: Record<string, string>) => (
  <Badge className={colors[status] || "bg-gray-500/20 text-gray-400"}>
    {labels[status] || status}
  </Badge>
);

const paymentStatusLabels: Record<string, string> = {
  pending: "Pendente", paid: "Pago", cancelled: "Cancelado", refunded: "Reembolsado"
};
const paymentStatusColors: Record<string, string> = {
  pending: "bg-orange-500/20 text-orange-400", paid: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400", refunded: "bg-blue-500/20 text-blue-400"
};
const consultationStatusLabels: Record<string, string> = {
  pending: "Pendente", confirmed: "Confirmada", completed: "Concluída",
  cancelled: "Cancelada", no_show: "Não compareceu"
};
const consultationStatusColors: Record<string, string> = {
  pending: "bg-orange-500/20 text-orange-400", confirmed: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400", cancelled: "bg-red-500/20 text-red-400",
  no_show: "bg-gray-500/20 text-gray-400"
};

// ==================== OVERVIEW TAB ====================
function OverviewTab() {
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3 text-gray-400">Carregando estatísticas...</span>
      </div>
    );
  }

  const cards = [
    { label: "Usuários", value: stats?.totalUsers || 0, sub: `+${stats?.newUsers || 0} novos (30d)`, subColor: "text-green-400", icon: Users, iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
    { label: "Receita Total", value: `R$ ${(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: `${stats?.pendingOrders || 0} pedidos pendentes`, subColor: "text-gray-500", icon: DollarSign, iconBg: "bg-green-500/20", iconColor: "text-green-400" },
    { label: "Consultas", value: stats?.totalConsultations || 0, sub: `${stats?.pendingConsultations || 0} pendentes`, subColor: "text-orange-400", icon: Calendar, iconBg: "bg-pink-500/20", iconColor: "text-pink-400" },
    { label: "Jogos de Tarot", value: stats?.totalGames || 0, sub: "Leituras realizadas", subColor: "text-gray-500", icon: BookOpen, iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
    { label: "Produtos", value: `${stats?.activeProducts || 0}/${stats?.totalProducts || 0}`, sub: "Ativos / Total", subColor: "text-gray-500", icon: Package, iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
    { label: "Taromantes", value: `${stats?.activeTaromantes || 0}/${stats?.totalTaromantes || 0}`, sub: "Ativos / Total", subColor: "text-gray-500", icon: Star, iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
    { label: "Cursos", value: stats?.totalCourses || 0, sub: `${stats?.totalEnrollments || 0} matrículas`, subColor: "text-gray-500", icon: BookOpen, iconBg: "bg-indigo-500/20", iconColor: "text-indigo-400" },
    { label: "Banidos", value: stats?.bannedUsers || 0, sub: "Usuários bloqueados", subColor: "text-red-400", icon: Ban, iconBg: "bg-red-500/20", iconColor: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{card.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                    <p className={`${card.subColor} text-xs mt-1`}>{card.sub}</p>
                  </div>
                  <div className={`w-11 h-11 ${card.iconBg} rounded-full flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ==================== USERS TAB ====================
function UsersTab() {
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bannedOnly, setBannedOnly] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [banReason, setBanReason] = useState("");

  const { data: usersData, isLoading, refetch } = trpc.admin.listUsers.useQuery({ 
    limit: 100, offset: 0, role: roleFilter, search: searchTerm, bannedOnly
  });

  const { data: userDetails, isLoading: detailsLoading } = trpc.admin.getUserDetails.useQuery(
    { userId: selectedUser?.id },
    { enabled: !!selectedUser && showDetailsDialog }
  );

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast.success("Permissão atualizada!"); setShowRoleDialog(false); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => { toast.success("Usuário banido!"); setShowBanDialog(false); setBanReason(""); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const unbanMutation = trpc.admin.unbanUser.useMutation({
    onSuccess: () => { toast.success("Usuário desbanido!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => { toast.success("Usuário excluído!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const usersList = Array.isArray(usersData) ? usersData : (usersData as any)?.users || [];
  const totalUsers = Array.isArray(usersData) ? usersData.length : (usersData as any)?.total || 0;

  return (
    <>
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Gestão de Usuários ({totalUsers})</CardTitle>
              <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48 bg-gray-800 border-purple-500/30 text-white"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                <SelectTrigger className="w-36 bg-gray-800 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant={bannedOnly ? "default" : "outline"} 
                size="sm"
                className={bannedOnly ? "bg-red-600 hover:bg-red-700" : "border-purple-500/30 text-gray-400"}
                onClick={() => setBannedOnly(!bannedOnly)}
              >
                <Ban className="w-4 h-4 mr-1" />
                Banidos
              </Button>
              <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
          ) : usersList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Nome</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Cadastro</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((u: any) => (
                    <TableRow key={u.id} className={`border-purple-500/10 ${u.isBanned ? "opacity-60" : ""}`}>
                      <TableCell className="text-gray-500">#{u.id}</TableCell>
                      <TableCell className="text-white">{u.name || u.fullName || "Sem nome"}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{u.email || "—"}</TableCell>
                      <TableCell>
                        <Badge className={u.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}>
                          {u.role === "admin" ? "Admin" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.isBanned ? (
                          <Badge className="bg-red-500/20 text-red-400"><Ban className="w-3 h-3 mr-1" />Banido</Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 h-8 px-2"
                            onClick={() => { setSelectedUser(u); setShowDetailsDialog(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" 
                            className={u.role === "admin" ? "text-orange-400 h-8 px-2" : "text-green-400 h-8 px-2"}
                            onClick={() => { setSelectedUser(u); setNewRole(u.role === "admin" ? "user" : "admin"); setShowRoleDialog(true); }}>
                            {u.role === "admin" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          {u.isBanned ? (
                            <Button variant="ghost" size="sm" className="text-green-400 h-8 px-2"
                              onClick={() => unbanMutation.mutate({ userId: u.id })}>
                              <Unlock className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-red-400 h-8 px-2"
                              onClick={() => { setSelectedUser(u); setShowBanDialog(true); }}>
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
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

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Alterar Permissão</DialogTitle>
            <DialogDescription>
              {newRole === "admin" ? "Promover" : "Rebaixar"} <strong className="text-white">{selectedUser?.name || selectedUser?.email}</strong> para <strong className="text-purple-400">{newRole === "admin" ? "Administrador" : "Usuário"}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => selectedUser && updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole })}
              disabled={updateRoleMutation.isPending}
              className={newRole === "admin" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}>
              {updateRoleMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2"><Ban className="w-5 h-5 text-red-400" />Banir Usuário</DialogTitle>
            <DialogDescription>
              Banir <strong className="text-white">{selectedUser?.name || selectedUser?.email}</strong>. O usuário não poderá acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-gray-400">Motivo do banimento *</Label>
            <Textarea value={banReason} onChange={(e) => setBanReason(e.target.value)}
              placeholder="Descreva o motivo do banimento..."
              className="bg-gray-800 border-purple-500/30 text-white mt-2" rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => selectedUser && banMutation.mutate({ userId: selectedUser.id, reason: banReason })}
              disabled={banMutation.isPending || !banReason.trim()}
              className="bg-red-600 hover:bg-red-700">
              {banMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Banir Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Usuário #{selectedUser?.id}</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
          ) : userDetails ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-500 text-xs">Nome</Label><p className="text-white">{userDetails.user.name || userDetails.user.fullName || "—"}</p></div>
                <div><Label className="text-gray-500 text-xs">Email</Label><p className="text-white">{userDetails.user.email || "—"}</p></div>
                <div><Label className="text-gray-500 text-xs">Role</Label><p className="text-white">{userDetails.user.role}</p></div>
                <div><Label className="text-gray-500 text-xs">Status</Label><p className={userDetails.user.isBanned ? "text-red-400" : "text-green-400"}>{userDetails.user.isBanned ? "Banido" : "Ativo"}</p></div>
                <div><Label className="text-gray-500 text-xs">Cadastro</Label><p className="text-white">{new Date(userDetails.user.createdAt).toLocaleString('pt-BR')}</p></div>
                <div><Label className="text-gray-500 text-xs">Leituras de Tarot</Label><p className="text-white">{userDetails.totalReadings}</p></div>
              </div>
              {userDetails.user.isBanned && userDetails.user.banReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <Label className="text-red-400 text-xs">Motivo do Banimento</Label>
                  <p className="text-red-300 text-sm mt-1">{userDetails.user.banReason}</p>
                </div>
              )}
              {userDetails.orders.length > 0 && (
                <div>
                  <Label className="text-gray-400 text-sm font-medium">Pedidos Recentes</Label>
                  <div className="mt-2 space-y-2">
                    {userDetails.orders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between bg-gray-800/50 rounded p-2 text-sm">
                        <span className="text-gray-400">#{o.id}</span>
                        <span className="text-purple-300">R$ {parseFloat(o.totalAmount || "0").toFixed(2)}</span>
                        {statusBadge(o.status, paymentStatusLabels, paymentStatusColors)}
                        <span className="text-gray-500">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ==================== PRODUCTS TAB ====================
function ProductsTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    slug: "", name: "", description: "", shortDescription: "",
    category: "tarot" as const, price: "0", originalPrice: "", isActive: true, isFeatured: false
  });

  const { data: productsList, isLoading, refetch } = trpc.admin.listProducts.useQuery({ limit: 100, offset: 0 });

  const createMutation = trpc.admin.createProduct.useMutation({
    onSuccess: () => { toast.success("Produto criado!"); setShowCreateDialog(false); setNewProduct({ slug: "", name: "", description: "", shortDescription: "", category: "tarot", price: "0", originalPrice: "", isActive: true, isFeatured: false }); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => { toast.success("Produto atualizado!"); setShowEditDialog(false); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => { toast.success("Produto excluído!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <>
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Gestão de Produtos</CardTitle>
              <CardDescription>Crie, edite e gerencie todos os produtos</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />Novo Produto
              </Button>
              <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
          ) : productsList && productsList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Nome</TableHead>
                    <TableHead className="text-gray-400">Categoria</TableHead>
                    <TableHead className="text-gray-400">Preço</TableHead>
                    <TableHead className="text-gray-400">Preço Original</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Destaque</TableHead>
                    <TableHead className="text-gray-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsList.map((p: any) => (
                    <TableRow key={p.id} className="border-purple-500/10">
                      <TableCell className="text-gray-500">#{p.id}</TableCell>
                      <TableCell className="text-white font-medium">{p.name}</TableCell>
                      <TableCell><Badge className="bg-purple-500/20 text-purple-400 capitalize">{p.category}</Badge></TableCell>
                      <TableCell className="text-green-400 font-medium">R$ {parseFloat(p.price || "0").toFixed(2)}</TableCell>
                      <TableCell className="text-gray-500 line-through">{p.originalPrice ? `R$ ${parseFloat(p.originalPrice).toFixed(2)}` : "—"}</TableCell>
                      <TableCell>
                        <Badge className={p.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {p.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.isFeatured ? <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> : <span className="text-gray-600">—</span>}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-purple-400 h-8 px-2"
                            onClick={() => { setSelectedProduct(p); setShowEditDialog(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 h-8 px-2"
                            onClick={() => updateMutation.mutate({ productId: p.id, isActive: !p.isActive })}>
                            {p.isActive ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-red-400" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 h-8 px-2"
                            onClick={() => { if (confirm("Excluir este produto?")) deleteMutation.mutate({ productId: p.id }); }}>
                            <Trash2 className="w-4 h-4" />
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
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum produto encontrado</p>
              <p className="text-sm mt-2">Clique em "Novo Produto" para criar o primeiro.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nome *</Label>
                <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Slug</Label>
                <Input value={newProduct.slug} onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-gray-400">Categoria</Label>
              <Select value={newProduct.category} onValueChange={(v: any) => setNewProduct({ ...newProduct, category: v })}>
                <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tarot">Tarot</SelectItem>
                  <SelectItem value="numerologia">Numerologia</SelectItem>
                  <SelectItem value="astrologia">Astrologia</SelectItem>
                  <SelectItem value="runas">Runas</SelectItem>
                  <SelectItem value="combo">Combo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Preço (R$) *</Label>
                <Input type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Preço Original (R$)</Label>
                <Input type="number" step="0.01" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-gray-400">Descrição Curta</Label>
              <Input value={newProduct.shortDescription} onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">Descrição Completa</Label>
              <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" rows={3} />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={newProduct.isActive} onCheckedChange={(v) => setNewProduct({ ...newProduct, isActive: v })} />
                <Label className="text-gray-400">Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newProduct.isFeatured} onCheckedChange={(v) => setNewProduct({ ...newProduct, isFeatured: v })} />
                <Label className="text-gray-400">Destaque</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => createMutation.mutate(newProduct)} disabled={createMutation.isPending || !newProduct.name || !newProduct.slug}
              className="bg-purple-600 hover:bg-purple-700">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Criar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Produto #{selectedProduct?.id}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label className="text-gray-400">Nome</Label>
                <Input value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Preço (R$)</Label>
                  <Input type="number" step="0.01" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-400">Preço Original (R$)</Label>
                  <Input type="number" step="0.01" value={selectedProduct.originalPrice || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, originalPrice: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Descrição</Label>
                <Textarea value={selectedProduct.description || ""} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" rows={3} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={selectedProduct.isActive} onCheckedChange={(v) => setSelectedProduct({ ...selectedProduct, isActive: v })} />
                  <Label className="text-gray-400">Ativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={selectedProduct.isFeatured} onCheckedChange={(v) => setSelectedProduct({ ...selectedProduct, isFeatured: v })} />
                  <Label className="text-gray-400">Destaque</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => selectedProduct && updateMutation.mutate({
              productId: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price,
              originalPrice: selectedProduct.originalPrice, description: selectedProduct.description,
              isActive: selectedProduct.isActive, isFeatured: selectedProduct.isFeatured
            })} disabled={updateMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ==================== TAROMANTES TAB ====================
function TaromantesTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTaromante, setSelectedTaromante] = useState<any>(null);
  const [newTaromante, setNewTaromante] = useState({
    slug: "", name: "", title: "", bio: "", shortBio: "",
    pricePerHour: "0", pricePerSession: "", experience: 0,
    isActive: true, isFeatured: false
  });

  const { data: taromantesList, isLoading, refetch } = trpc.admin.listTaromantes.useQuery();

  const createMutation = trpc.admin.createTaromante.useMutation({
    onSuccess: () => { toast.success("Taromante criado!"); setShowCreateDialog(false); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.updateTaromante.useMutation({
    onSuccess: () => { toast.success("Taromante atualizado!"); setShowEditDialog(false); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.deleteTaromante.useMutation({
    onSuccess: () => { toast.success("Taromante excluído!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <>
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Gestão de Taromantes</CardTitle>
              <CardDescription>Gerencie os taromantes da plataforma</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />Novo Taromante
              </Button>
              <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
          ) : taromantesList && taromantesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {taromantesList.map((t: any) => (
                <Card key={t.id} className={`bg-gray-800/50 border-purple-500/10 ${!t.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{t.name}</h3>
                        <p className="text-gray-400 text-sm">{t.title || "Taromante"}</p>
                      </div>
                      <div className="flex gap-1">
                        {t.isFeatured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                        <Badge className={t.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {t.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{t.shortBio || t.bio || "Sem descrição"}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">R$ {parseFloat(t.pricePerHour || "0").toFixed(2)}/h</span>
                      <span className="text-gray-500">{t.experience || 0} anos exp.</span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-purple-500/10">
                      <Button variant="ghost" size="sm" className="text-purple-400 h-7 px-2 text-xs flex-1"
                        onClick={() => { setSelectedTaromante(t); setShowEditDialog(true); }}>
                        <Edit className="w-3 h-3 mr-1" />Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 h-7 px-2 text-xs"
                        onClick={() => updateMutation.mutate({ taromanteId: t.id, isActive: !t.isActive })}>
                        {t.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 h-7 px-2 text-xs"
                        onClick={() => { if (confirm("Excluir este taromante?")) deleteMutation.mutate({ taromanteId: t.id }); }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhum taromante cadastrado</p>
              <p className="text-sm mt-2">Clique em "Novo Taromante" para adicionar.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Taromante Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Novo Taromante</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nome *</Label>
                <Input value={newTaromante.name} onChange={(e) => setNewTaromante({ ...newTaromante, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Título</Label>
                <Input value={newTaromante.title} onChange={(e) => setNewTaromante({ ...newTaromante, title: e.target.value })}
                  placeholder="Ex: Mestre em Tarot" className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Preço/Hora (R$)</Label>
                <Input type="number" step="0.01" value={newTaromante.pricePerHour} onChange={(e) => setNewTaromante({ ...newTaromante, pricePerHour: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Anos de Experiência</Label>
                <Input type="number" value={newTaromante.experience} onChange={(e) => setNewTaromante({ ...newTaromante, experience: parseInt(e.target.value) || 0 })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-gray-400">Bio Curta</Label>
              <Input value={newTaromante.shortBio} onChange={(e) => setNewTaromante({ ...newTaromante, shortBio: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">Bio Completa</Label>
              <Textarea value={newTaromante.bio} onChange={(e) => setNewTaromante({ ...newTaromante, bio: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => createMutation.mutate(newTaromante)} disabled={createMutation.isPending || !newTaromante.name}
              className="bg-purple-600 hover:bg-purple-700">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Taromante Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Editar Taromante #{selectedTaromante?.id}</DialogTitle></DialogHeader>
          {selectedTaromante && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Nome</Label>
                  <Input value={selectedTaromante.name} onChange={(e) => setSelectedTaromante({ ...selectedTaromante, name: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-400">Título</Label>
                  <Input value={selectedTaromante.title || ""} onChange={(e) => setSelectedTaromante({ ...selectedTaromante, title: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Preço/Hora (R$)</Label>
                  <Input type="number" step="0.01" value={selectedTaromante.pricePerHour} onChange={(e) => setSelectedTaromante({ ...selectedTaromante, pricePerHour: e.target.value })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-400">Experiência (anos)</Label>
                  <Input type="number" value={selectedTaromante.experience || 0} onChange={(e) => setSelectedTaromante({ ...selectedTaromante, experience: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Bio</Label>
                <Textarea value={selectedTaromante.bio || ""} onChange={(e) => setSelectedTaromante({ ...selectedTaromante, bio: e.target.value })}
                  className="bg-gray-800 border-purple-500/30 text-white mt-1" rows={3} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={selectedTaromante.isActive} onCheckedChange={(v) => setSelectedTaromante({ ...selectedTaromante, isActive: v })} />
                  <Label className="text-gray-400">Ativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={selectedTaromante.isFeatured} onCheckedChange={(v) => setSelectedTaromante({ ...selectedTaromante, isFeatured: v })} />
                  <Label className="text-gray-400">Destaque</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => selectedTaromante && updateMutation.mutate({
              taromanteId: selectedTaromante.id, name: selectedTaromante.name, title: selectedTaromante.title,
              bio: selectedTaromante.bio, pricePerHour: selectedTaromante.pricePerHour,
              experience: selectedTaromante.experience, isActive: selectedTaromante.isActive, isFeatured: selectedTaromante.isFeatured
            })} disabled={updateMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Salvar
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
  const { data: payments, isLoading, refetch } = trpc.admin.listPayments.useQuery({ limit: 100, offset: 0, status: statusFilter });

  const updateStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => { toast.success("Status do pedido atualizado!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-white">Gestão de Pedidos</CardTitle>
            <CardDescription>Visualize e gerencie todos os pedidos e pagamentos</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-40 bg-gray-800 border-purple-500/30 text-white">
                <Filter className="w-4 h-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="refunded">Reembolsados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
        ) : payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Usuário</TableHead>
                  <TableHead className="text-gray-400">Valor</TableHead>
                  <TableHead className="text-gray-400">Método</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Data</TableHead>
                  <TableHead className="text-gray-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p: any) => (
                  <TableRow key={p.id} className="border-purple-500/10">
                    <TableCell className="text-gray-500">#{p.id}</TableCell>
                    <TableCell className="text-white">#{p.userId}</TableCell>
                    <TableCell className="text-green-400 font-medium">R$ {parseFloat(p.totalAmount || "0").toFixed(2)}</TableCell>
                    <TableCell className="text-gray-400 capitalize">{p.paymentMethod || "—"}</TableCell>
                    <TableCell>{statusBadge(p.status, paymentStatusLabels, paymentStatusColors)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {p.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-400 h-7 px-2 text-xs"
                              onClick={() => updateStatusMutation.mutate({ orderId: p.id, status: "paid" })}>
                              <CheckCircle className="w-3 h-3 mr-1" />Aprovar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 h-7 px-2 text-xs"
                              onClick={() => updateStatusMutation.mutate({ orderId: p.id, status: "cancelled" })}>
                              <XCircle className="w-3 h-3 mr-1" />Cancelar
                            </Button>
                          </>
                        )}
                        {p.status === "paid" && (
                          <Button variant="ghost" size="sm" className="text-blue-400 h-7 px-2 text-xs"
                            onClick={() => updateStatusMutation.mutate({ orderId: p.id, status: "refunded" })}>
                            Reembolsar
                          </Button>
                        )}
                      </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== CONSULTATIONS TAB ====================
function ConsultationsTab() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled" | "no_show">("all");
  const { data: consultationsList, isLoading, refetch } = trpc.admin.listConsultations.useQuery({ limit: 100, offset: 0, status: statusFilter });

  const updateStatusMutation = trpc.admin.updateConsultationStatus.useMutation({
    onSuccess: () => { toast.success("Status atualizado!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  return (
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
                <Filter className="w-4 h-4 mr-2" /><SelectValue />
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
            <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
        ) : consultationsList && consultationsList.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Tipo</TableHead>
                  <TableHead className="text-gray-400">Agendada</TableHead>
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
                    <TableCell className="text-gray-400 capitalize">{c.consultationType}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{new Date(c.scheduledAt).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-gray-400">{c.duration} min</TableCell>
                    <TableCell className="text-purple-300">R$ {parseFloat(c.price || "0").toFixed(2)}</TableCell>
                    <TableCell>{statusBadge(c.status, consultationStatusLabels, consultationStatusColors)}</TableCell>
                    <TableCell>
                      <Select value={c.status} onValueChange={(v: any) => updateStatusMutation.mutate({ consultationId: c.id, status: v })}>
                        <SelectTrigger className="w-36 h-7 bg-gray-800 border-purple-500/30 text-white text-xs">
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
          </div>
        )}
      </CardContent>
    </Card>
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
          <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
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
                      <p className="text-gray-500 text-sm">jogadas</p>
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

// ==================== INTEGRATIONS TAB ====================
function IntegrationsTab() {
  const { data: integrations, isLoading: intLoading } = trpc.admin.getIntegrationStatus.useQuery();
  const { data: webhooks, isLoading: whLoading, refetch: refetchWebhooks } = trpc.admin.listWebhooks.useQuery();
  const { data: apiKeysList, isLoading: akLoading, refetch: refetchKeys } = trpc.admin.listApiKeys.useQuery();
  const { data: webhookLogsList } = trpc.admin.listWebhookLogs.useQuery({ limit: 20 });

  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [webhookForm, setWebhookForm] = useState({ name: "", url: "", events: ["payment.completed", "user.created"] });
  const [apiKeyForm, setApiKeyForm] = useState({ name: "", expiresInDays: 90 });

  const createWebhookMutation = trpc.admin.createWebhook.useMutation({
    onSuccess: () => { toast.success("Webhook criado!"); setShowWebhookDialog(false); refetchWebhooks(); },
    onError: (err) => toast.error(err.message),
  });

  const deleteWebhookMutation = trpc.admin.deleteWebhook.useMutation({
    onSuccess: () => { toast.success("Webhook excluído!"); refetchWebhooks(); },
    onError: (err) => toast.error(err.message),
  });

  const createApiKeyMutation = trpc.admin.createApiKey.useMutation({
    onSuccess: (data) => { setNewApiKey(data.apiKey); refetchKeys(); },
    onError: (err) => toast.error(err.message),
  });

  const revokeApiKeyMutation = trpc.admin.revokeApiKey.useMutation({
    onSuccess: () => { toast.success("API Key revogada!"); refetchKeys(); },
    onError: (err) => toast.error(err.message),
  });

  const availableEvents = [
    "payment.completed", "payment.failed", "payment.refunded",
    "user.created", "user.banned", "user.deleted",
    "consultation.created", "consultation.completed",
    "order.created", "order.paid"
  ];

  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Plug className="w-5 h-5" />Status das Integrações</CardTitle>
        </CardHeader>
        <CardContent>
          {intLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
          ) : integrations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(integrations).map((int: any) => (
                <div key={int.label} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-4 border border-purple-500/10">
                  <div className={`w-3 h-3 rounded-full ${int.connected ? "bg-green-400" : "bg-red-400"}`} />
                  <div>
                    <p className="text-white font-medium text-sm">{int.label}</p>
                    <p className="text-gray-500 text-xs">{int.description}</p>
                  </div>
                  <Badge className={`ml-auto ${int.connected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {int.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2"><Webhook className="w-5 h-5" />Webhooks</CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700" size="sm" onClick={() => setShowWebhookDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Novo Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {whLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
          ) : webhooks && webhooks.length > 0 ? (
            <div className="space-y-3">
              {webhooks.map((wh: any) => (
                <div key={wh.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-purple-500/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{wh.name}</p>
                      <Badge className={wh.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {wh.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 font-mono">{wh.url}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {(wh.events as string[])?.map((e: string) => (
                        <Badge key={e} className="bg-purple-500/10 text-purple-400 text-xs">{e}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-400 h-8 px-2"
                    onClick={() => { if (confirm("Excluir webhook?")) deleteWebhookMutation.mutate({ webhookId: wh.id }); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum webhook configurado</p>
              <p className="text-sm mt-1">Webhooks permitem integrar com sistemas externos.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="bg-gray-900/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2"><Key className="w-5 h-5" />API Keys</CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700" size="sm" onClick={() => setShowApiKeyDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Nova API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {akLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
          ) : apiKeysList && apiKeysList.length > 0 ? (
            <div className="space-y-3">
              {apiKeysList.map((key: any) => (
                <div key={key.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-purple-500/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{key.name}</p>
                      <Badge className={key.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {key.isActive ? "Ativa" : "Revogada"}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm font-mono mt-1">{key.keyPrefix}...****</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Criada em {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                      {key.lastUsedAt && ` · Último uso: ${new Date(key.lastUsedAt).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  {key.isActive && (
                    <Button variant="ghost" size="sm" className="text-red-400 h-8 px-2"
                      onClick={() => { if (confirm("Revogar esta API Key?")) revokeApiKeyMutation.mutate({ keyId: key.id }); }}>
                      <Lock className="w-4 h-4 mr-1" />Revogar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma API Key criada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Logs */}
      {webhookLogsList && webhookLogsList.length > 0 && (
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><FileText className="w-5 h-5" />Logs de Webhook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-gray-400">Provider</TableHead>
                    <TableHead className="text-gray-400">Evento</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogsList.map((log: any) => (
                    <TableRow key={log.id} className="border-purple-500/10">
                      <TableCell className="text-white capitalize">{log.provider}</TableCell>
                      <TableCell className="text-gray-400 font-mono text-sm">{log.eventType}</TableCell>
                      <TableCell>
                        <Badge className={log.status === "processed" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{new Date(log.createdAt).toLocaleString('pt-BR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Webhook Dialog */}
      <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Novo Webhook</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Nome</Label>
              <Input value={webhookForm.name} onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
                placeholder="Ex: Notificação de pagamento" className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">URL</Label>
              <Input value={webhookForm.url} onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
                placeholder="https://..." className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">Eventos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableEvents.map((event) => (
                  <label key={event} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={webhookForm.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) setWebhookForm({ ...webhookForm, events: [...webhookForm.events, event] });
                        else setWebhookForm({ ...webhookForm, events: webhookForm.events.filter(ev => ev !== event) });
                      }}
                      className="rounded border-purple-500/30" />
                    {event}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWebhookDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => createWebhookMutation.mutate(webhookForm)} disabled={createWebhookMutation.isPending || !webhookForm.name || !webhookForm.url}
              className="bg-purple-600 hover:bg-purple-700">
              {createWebhookMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={(open) => { setShowApiKeyDialog(open); if (!open) setNewApiKey(null); }}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader><DialogTitle className="text-white">Nova API Key</DialogTitle></DialogHeader>
          {newApiKey ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 text-sm font-medium mb-2">API Key criada com sucesso!</p>
                <p className="text-gray-400 text-xs mb-2">Copie esta chave agora. Ela não será exibida novamente.</p>
                <div className="flex items-center gap-2">
                  <code className="text-green-300 text-sm bg-gray-800 rounded px-3 py-2 flex-1 break-all">{newApiKey}</code>
                  <Button variant="ghost" size="sm" className="text-green-400"
                    onClick={() => { navigator.clipboard.writeText(newApiKey); toast.success("Copiado!"); }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => { setShowApiKeyDialog(false); setNewApiKey(null); }} className="bg-purple-600 hover:bg-purple-700">Fechar</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-400">Nome</Label>
                  <Input value={apiKeyForm.name} onChange={(e) => setApiKeyForm({ ...apiKeyForm, name: e.target.value })}
                    placeholder="Ex: Integração CRM" className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-400">Expira em (dias)</Label>
                  <Input type="number" value={apiKeyForm.expiresInDays} onChange={(e) => setApiKeyForm({ ...apiKeyForm, expiresInDays: parseInt(e.target.value) || 90 })}
                    className="bg-gray-800 border-purple-500/30 text-white mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApiKeyDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
                <Button onClick={() => createApiKeyMutation.mutate(apiKeyForm)} disabled={createApiKeyMutation.isPending || !apiKeyForm.name}
                  className="bg-purple-600 hover:bg-purple-700">
                  {createApiKeyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Criar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== ACTIVITY LOGS TAB ====================
function ActivityLogsTab() {
  const [entityFilter, setEntityFilter] = useState<string>("");
  const { data: logs, isLoading, refetch } = trpc.admin.listActivityLogs.useQuery({
    limit: 100, offset: 0, entityType: entityFilter || undefined
  });

  const actionLabels: Record<string, string> = {
    ban_user: "Baniu usuário", unban_user: "Desbaniu usuário", delete_user: "Excluiu usuário",
    update_role: "Alterou permissão", create_product: "Criou produto", update_product: "Atualizou produto",
    delete_product: "Excluiu produto", create_taromante: "Criou taromante", update_taromante: "Atualizou taromante",
    delete_taromante: "Excluiu taromante", update_consultation_status: "Alterou status de consulta",
    update_order_status: "Alterou status de pedido", update_setting: "Atualizou configuração",
    create_webhook: "Criou webhook", delete_webhook: "Excluiu webhook",
    create_api_key: "Criou API Key", revoke_api_key: "Revogou API Key",
    approve_payment_proof: "Aprovou comprovante", reject_payment_proof: "Rejeitou comprovante",
    update_course: "Atualizou curso",
  };

  const actionColors: Record<string, string> = {
    ban_user: "text-red-400", unban_user: "text-green-400", delete_user: "text-red-400",
    update_role: "text-orange-400", create_product: "text-green-400", update_product: "text-blue-400",
    delete_product: "text-red-400", create_taromante: "text-green-400", update_taromante: "text-blue-400",
    delete_taromante: "text-red-400",
  };

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5" />Logs de Atividade</CardTitle>
            <CardDescription>Histórico de todas as ações administrativas</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={entityFilter || "all"} onValueChange={(v) => setEntityFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-40 bg-gray-800 border-purple-500/30 text-white">
                <Filter className="w-4 h-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
                <SelectItem value="product">Produtos</SelectItem>
                <SelectItem value="taromante">Taromantes</SelectItem>
                <SelectItem value="order">Pedidos</SelectItem>
                <SelectItem value="consultation">Consultas</SelectItem>
                <SelectItem value="setting">Configurações</SelectItem>
                <SelectItem value="webhook">Webhooks</SelectItem>
                <SelectItem value="api_key">API Keys</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-purple-500/30 text-gray-400" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
        ) : logs && logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-4 bg-gray-800/30 rounded-lg p-4 border border-purple-500/5">
                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${actionColors[log.action] || "text-white"}`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                    {log.entityId && <Badge className="bg-gray-700/50 text-gray-400 text-xs">#{log.entityId}</Badge>}
                    <Badge className="bg-purple-500/10 text-purple-400 text-xs capitalize">{log.entityType}</Badge>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    por <span className="text-gray-400">{log.adminName || log.adminId}</span>
                    {" · "}
                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                  </p>
                  {log.details && (
                    <p className="text-gray-600 text-xs mt-1 font-mono truncate">{log.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade registrada</p>
            <p className="text-sm mt-2">As ações administrativas serão registradas aqui automaticamente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== SETTINGS TAB ====================
function SettingsTab() {
  const { data: settingsList, isLoading, refetch } = trpc.admin.getSettings.useQuery({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newSetting, setNewSetting] = useState({ key: "", value: "", label: "", description: "", category: "general" });
  const [showNewDialog, setShowNewDialog] = useState(false);

  const upsertMutation = trpc.admin.upsertSetting.useMutation({
    onSuccess: () => { toast.success("Configuração salva!"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  // Initialize edit values from settings
  const settings = settingsList || [];
  const groupedSettings = useMemo(() => {
    const groups: Record<string, any[]> = {};
    settings.forEach((s: any) => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [settings]);

  const categoryLabels: Record<string, string> = {
    general: "Geral", pricing: "Preços", content: "Conteúdo", integration: "Integrações"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-medium">Configurações do Site</h2>
        <Button className="bg-purple-600 hover:bg-purple-700" size="sm" onClick={() => setShowNewDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />Nova Configuração
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
      ) : Object.keys(groupedSettings).length > 0 ? (
        Object.entries(groupedSettings).map(([category, items]) => (
          <Card key={category} className="bg-gray-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white text-base">{categoryLabels[category] || category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((s: any) => (
                <div key={s.key} className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="text-gray-400 text-sm">{s.label || s.key}</Label>
                    {s.description && <p className="text-gray-600 text-xs">{s.description}</p>}
                    <Input
                      value={editValues[s.key] !== undefined ? editValues[s.key] : s.value}
                      onChange={(e) => setEditValues({ ...editValues, [s.key]: e.target.value })}
                      className="bg-gray-800 border-purple-500/30 text-white mt-1"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={upsertMutation.isPending || (editValues[s.key] === undefined || editValues[s.key] === s.value)}
                    onClick={() => upsertMutation.mutate({ key: s.key, value: editValues[s.key] || s.value, category: s.category })}
                  >
                    Salvar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nenhuma configuração cadastrada</p>
              <p className="text-sm mt-2">Clique em "Nova Configuração" para adicionar.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Setting Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="bg-gray-900 border-purple-500/30">
          <DialogHeader><DialogTitle className="text-white">Nova Configuração</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Chave *</Label>
                <Input value={newSetting.key} onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  placeholder="ex: site_title" className="bg-gray-800 border-purple-500/30 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Categoria</Label>
                <Select value={newSetting.category} onValueChange={(v) => setNewSetting({ ...newSetting, category: v })}>
                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="pricing">Preços</SelectItem>
                    <SelectItem value="content">Conteúdo</SelectItem>
                    <SelectItem value="integration">Integrações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-gray-400">Label</Label>
              <Input value={newSetting.label} onChange={(e) => setNewSetting({ ...newSetting, label: e.target.value })}
                placeholder="Nome amigável" className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">Valor *</Label>
              <Input value={newSetting.value} onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
            <div>
              <Label className="text-gray-400">Descrição</Label>
              <Input value={newSetting.description} onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                className="bg-gray-800 border-purple-500/30 text-white mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="border-gray-600 text-gray-400">Cancelar</Button>
            <Button onClick={() => { upsertMutation.mutate(newSetting); setShowNewDialog(false); }}
              disabled={!newSetting.key || !newSetting.value}
              className="bg-purple-600 hover:bg-purple-700">Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ==================== MAIN ADMIN PANEL ====================
export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">Você precisa estar logado para acessar o painel administrativo.</p>
          <Link href="/"><Button className="bg-purple-600 hover:bg-purple-700">Voltar ao Início</Button></Link>
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
                <ArrowLeft className="w-5 h-5" />Voltar
              </span>
            </Link>
            <div className="flex items-center gap-2 text-purple-300 font-serif text-xl">
              <Shield className="w-6 h-6" />
              Painel Administrativo
            </div>
            <Badge className="bg-red-500/20 text-red-400">Admin</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="bg-gray-900/50 border border-purple-500/20 inline-flex min-w-max">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
                <BarChart3 className="w-4 h-4 mr-2" />Visão Geral
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-500/20">
                <Users className="w-4 h-4 mr-2" />Usuários
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-purple-500/20">
                <Package className="w-4 h-4 mr-2" />Produtos
              </TabsTrigger>
              <TabsTrigger value="taromantes" className="data-[state=active]:bg-purple-500/20">
                <Star className="w-4 h-4 mr-2" />Taromantes
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-purple-500/20">
                <ShoppingCart className="w-4 h-4 mr-2" />Pedidos
              </TabsTrigger>
              <TabsTrigger value="consultations" className="data-[state=active]:bg-purple-500/20">
                <Calendar className="w-4 h-4 mr-2" />Consultas
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-purple-500/20">
                <BookOpen className="w-4 h-4 mr-2" />Jogos
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-purple-500/20">
                <Plug className="w-4 h-4 mr-2" />Integrações
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-purple-500/20">
                <Activity className="w-4 h-4 mr-2" />Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
                <Settings className="w-4 h-4 mr-2" />Config
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="taromantes"><TaromantesTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="consultations"><ConsultationsTab /></TabsContent>
          <TabsContent value="games"><GamesTab /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
          <TabsContent value="logs"><ActivityLogsTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
