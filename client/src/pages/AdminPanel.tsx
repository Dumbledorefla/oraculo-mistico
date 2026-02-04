/**
 * Painel Administrativo - Oráculo Místico
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  Star,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
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
            <Button className="bg-amber-500 hover:bg-amber-600">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for dashboard
  const stats = {
    totalUsers: 1250,
    totalProducts: 14,
    totalOrders: 342,
    totalRevenue: 28450.00,
    totalConsultations: 156,
    totalCourses: 6,
    monthlyGrowth: 12.5,
  };

  const recentOrders = [
    { id: 1, user: "Maria Silva", product: "Mapa Astral Completo", amount: 97.00, status: "completed", date: "2026-02-04" },
    { id: 2, user: "João Santos", product: "Tarot e o Amor", amount: 29.90, status: "completed", date: "2026-02-04" },
    { id: 3, user: "Ana Costa", product: "Numerologia Completa", amount: 47.00, status: "pending", date: "2026-02-03" },
    { id: 4, user: "Pedro Lima", product: "Combo Autoconhecimento", amount: 147.00, status: "completed", date: "2026-02-03" },
    { id: 5, user: "Lucia Ferreira", product: "Consulta - Maria Estrela", amount: 80.00, status: "completed", date: "2026-02-02" },
  ];

  const recentUsers = [
    { id: 1, name: "Maria Silva", email: "maria@email.com", role: "user", createdAt: "2026-02-04" },
    { id: 2, name: "João Santos", email: "joao@email.com", role: "user", createdAt: "2026-02-04" },
    { id: 3, name: "Ana Costa", email: "ana@email.com", role: "taromante", createdAt: "2026-02-03" },
    { id: 4, name: "Pedro Lima", email: "pedro@email.com", role: "user", createdAt: "2026-02-03" },
    { id: 5, name: "Lucia Ferreira", email: "lucia@email.com", role: "admin", createdAt: "2026-02-02" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </a>
            </Link>
            <div className="flex items-center gap-2 text-amber-400 font-serif text-xl">
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total de Usuários</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4" />
                      +{stats.monthlyGrowth}% este mês
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Receita Total</p>
                    <p className="text-3xl font-bold text-white">
                      R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {stats.totalOrders} pedidos
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Consultas</p>
                    <p className="text-3xl font-bold text-white">{stats.totalConsultations}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      5 taromantes ativos
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Cursos</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      3.2k matrículas
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-purple-500/20">
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
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-500/20">
              <Package className="w-4 h-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="bg-gray-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Pedidos Recentes</CardTitle>
                  <CardDescription>Últimas transações da plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20">
                        <TableHead className="text-gray-400">Usuário</TableHead>
                        <TableHead className="text-gray-400">Produto</TableHead>
                        <TableHead className="text-gray-400">Valor</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="border-purple-500/10">
                          <TableCell className="text-white">{order.user}</TableCell>
                          <TableCell className="text-gray-400">{order.product}</TableCell>
                          <TableCell className="text-amber-400">
                            R$ {order.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              order.status === "completed" 
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }>
                              {order.status === "completed" ? "Concluído" : "Pendente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card className="bg-gray-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Novos Usuários</CardTitle>
                  <CardDescription>Usuários cadastrados recentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20">
                        <TableHead className="text-gray-400">Nome</TableHead>
                        <TableHead className="text-gray-400">Email</TableHead>
                        <TableHead className="text-gray-400">Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((u) => (
                        <TableRow key={u.id} className="border-purple-500/10">
                          <TableCell className="text-white">{u.name}</TableCell>
                          <TableCell className="text-gray-400">{u.email}</TableCell>
                          <TableCell>
                            <Badge className={
                              u.role === "admin" 
                                ? "bg-red-500/20 text-red-400"
                                : u.role === "taromante"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-gray-500/20 text-gray-400"
                            }>
                              {u.role === "admin" ? "Admin" : u.role === "taromante" ? "Taromante" : "Usuário"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Gestão de Usuários</CardTitle>
                    <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    Adicionar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Nome</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Tipo</TableHead>
                      <TableHead className="text-gray-400">Cadastro</TableHead>
                      <TableHead className="text-gray-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((u) => (
                      <TableRow key={u.id} className="border-purple-500/10">
                        <TableCell className="text-gray-500">#{u.id}</TableCell>
                        <TableCell className="text-white">{u.name}</TableCell>
                        <TableCell className="text-gray-400">{u.email}</TableCell>
                        <TableCell>
                          <Badge className={
                            u.role === "admin" 
                              ? "bg-red-500/20 text-red-400"
                              : u.role === "taromante"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                          }>
                            {u.role === "admin" ? "Admin" : u.role === "taromante" ? "Taromante" : "Usuário"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{u.createdAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Gestão de Pedidos</CardTitle>
                    <CardDescription>Visualize e gerencie todos os pedidos</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-purple-500/30 text-gray-400">
                      Exportar CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-gray-400">ID</TableHead>
                      <TableHead className="text-gray-400">Usuário</TableHead>
                      <TableHead className="text-gray-400">Produto</TableHead>
                      <TableHead className="text-gray-400">Valor</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Data</TableHead>
                      <TableHead className="text-gray-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-purple-500/10">
                        <TableCell className="text-gray-500">#{order.id}</TableCell>
                        <TableCell className="text-white">{order.user}</TableCell>
                        <TableCell className="text-gray-400">{order.product}</TableCell>
                        <TableCell className="text-amber-400">
                          R$ {order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === "completed" 
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }>
                            {order.status === "completed" ? "Concluído" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{order.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Gestão de Produtos</CardTitle>
                    <CardDescription>Gerencie produtos, cursos e serviços</CardDescription>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    Adicionar Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Funcionalidade em desenvolvimento</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Em breve você poderá gerenciar produtos diretamente por aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gray-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Configurações</CardTitle>
                <CardDescription>Configurações gerais da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Funcionalidade em desenvolvimento</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Em breve você poderá configurar a plataforma por aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
