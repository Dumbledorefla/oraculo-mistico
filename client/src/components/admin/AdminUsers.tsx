import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserX, Mail, Shield, Loader2, Eye } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [banReason, setBanReason] = useState("");

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.admin.listUsers.useQuery({
    search: searchTerm,
    limit: 100,
    offset: 0,
  });

  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário banido com sucesso");
      utils.admin.listUsers.invalidate();
      setBanDialogOpen(false);
      setBanReason("");
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unbanMutation = trpc.admin.unbanUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário desbanido com sucesso");
      utils.admin.listUsers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleBanUser = (userId: number) => {
    setSelectedUserId(userId);
    setBanDialogOpen(true);
  };

  const handleConfirmBan = () => {
    if (!selectedUserId || !banReason.trim()) {
      toast.error("Por favor, informe o motivo do banimento");
      return;
    }
    banMutation.mutate({ userId: selectedUserId, reason: banReason });
  };

  const handleUnbanUser = (userId: number) => {
    unbanMutation.mutate({ userId });
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
        <p className="text-red-400">Erro ao carregar usuários: {error.message}</p>
      </div>
    );
  }

  const users = data?.users || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Buscar Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Usuários Cadastrados</CardTitle>
          <CardDescription className="text-purple-300">
            {users.length} de {total} usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-purple-400">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Função</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Cadastro</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                      <td className="py-3 px-4 text-white">{user.name || user.fullName || "Sem nome"}</td>
                      <td className="py-3 px-4 text-purple-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          user.role === "admin" ? "bg-red-500/20 text-red-300" :
                          "bg-blue-500/20 text-blue-300"
                        }`}>
                          {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          user.isBanned ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                        }`}>
                          {user.isBanned ? "Bloqueado" : "Ativo"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-purple-300">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {user.isBanned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                              onClick={() => handleUnbanUser(user.id)}
                              disabled={unbanMutation.isPending}
                            >
                              {unbanMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Ativar
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                              onClick={() => handleBanUser(user.id)}
                              disabled={banMutation.isPending}
                            >
                              <UserX className="w-4 h-4 mr-1" />
                              Bloquear
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-black/95 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Bloquear Usuário</DialogTitle>
            <DialogDescription className="text-purple-300">
              Informe o motivo do bloqueio. Esta ação pode ser revertida posteriormente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-purple-300">
                Motivo do Bloqueio
              </Label>
              <Textarea
                id="reason"
                placeholder="Ex: Violação dos termos de uso..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="bg-black/20 border-purple-500/30 text-white placeholder:text-purple-400/50"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBanDialogOpen(false);
                setBanReason("");
                setSelectedUserId(null);
              }}
              className="border-purple-500/30 text-purple-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBan}
              disabled={banMutation.isPending || !banReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {banMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Bloqueando...
                </>
              ) : (
                "Confirmar Bloqueio"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
