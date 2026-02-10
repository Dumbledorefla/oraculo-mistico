import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, GamepadIcon, Calendar, CreditCard, Settings } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminGames from "@/components/admin/AdminGames";
import AdminConsultations from "@/components/admin/AdminConsultations";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminSettings from "@/components/admin/AdminSettings";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && (!user || user.email !== 'milton.contato177@gmail.com')) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user || user.email !== 'milton.contato177@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
              <p className="text-purple-300">Gerencie todos os aspectos do Chave do Oráculo</p>
            </div>
            <button
              onClick={() => setLocation("/")}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/40 border border-purple-500/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-purple-600">
              <GamepadIcon className="w-4 h-4 mr-2" />
              Jogos
            </TabsTrigger>
            <TabsTrigger value="consultations" className="data-[state=active]:bg-purple-600">
              <Calendar className="w-4 h-4 mr-2" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-purple-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="games">
            <AdminGames />
          </TabsContent>

          <TabsContent value="consultations">
            <AdminConsultations />
          </TabsContent>

          <TabsContent value="payments">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
