import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserX, Mail, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: Buscar usuários reais do backend
  const users = [
    { id: 1, name: "Maria Silva", email: "maria@example.com", role: "user", status: "active", joinedAt: "2024-01-15" },
    { id: 2, name: "João Santos", email: "joao@example.com", role: "user", status: "active", joinedAt: "2024-01-20" },
    { id: 3, name: "Ana Costa", email: "ana@example.com", role: "taromante", status: "active", joinedAt: "2024-01-25" },
    { id: 4, name: "Pedro Lima", email: "pedro@example.com", role: "user", status: "blocked", joinedAt: "2024-02-01" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredUsers.length} usuários encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                    <td className="py-3 px-4 text-white">{user.name}</td>
                    <td className="py-3 px-4 text-purple-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        user.role === "admin" ? "bg-red-500/20 text-red-300" :
                        user.role === "taromante" ? "bg-purple-500/20 text-purple-300" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        user.status === "active" ? "bg-green-500/20 text-green-300" :
                        "bg-red-500/20 text-red-300"
                      }`}>
                        {user.status === "active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                        {user.status === "active" ? "Ativo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-purple-300">
                      {new Date(user.joinedAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`border-purple-500/30 ${
                            user.status === "active" 
                              ? "text-red-300 hover:bg-red-500/20" 
                              : "text-green-300 hover:bg-green-500/20"
                          }`}
                        >
                          {user.status === "active" ? "Bloquear" : "Ativar"}
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
