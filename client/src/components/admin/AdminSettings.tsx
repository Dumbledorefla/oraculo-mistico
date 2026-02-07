import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Preços */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Configurações de Preços</CardTitle>
          <CardDescription className="text-purple-300">
            Defina os valores dos planos e serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-price" className="text-purple-300">Plano Mensal</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">R$</span>
                <Input
                  id="monthly-price"
                  type="number"
                  step="0.01"
                  defaultValue="19.90"
                  className="pl-10 bg-black/20 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual-price" className="text-purple-300">Plano Anual</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">R$</span>
                <Input
                  id="annual-price"
                  type="number"
                  step="0.01"
                  defaultValue="199.00"
                  className="pl-10 bg-black/20 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultation-price" className="text-purple-300">Consulta (base)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">R$</span>
                <Input
                  id="consultation-price"
                  type="number"
                  step="0.01"
                  defaultValue="150.00"
                  className="pl-10 bg-black/20 border-purple-500/30 text-white"
                />
              </div>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Preços
          </Button>
        </CardContent>
      </Card>

      {/* Textos do Site */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Textos do Site</CardTitle>
          <CardDescription className="text-purple-300">
            Personalize os textos exibidos no site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title" className="text-purple-300">Título Principal</Label>
            <Input
              id="hero-title"
              defaultValue="Desvende os Mistérios do Universo"
              className="bg-black/20 border-purple-500/30 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle" className="text-purple-300">Subtítulo</Label>
            <Textarea
              id="hero-subtitle"
              defaultValue="Tarot, Numerologia e Astrologia em um só lugar. Receba orientações personalizadas para guiar sua jornada e descobrir seu verdadeiro potencial."
              className="bg-black/20 border-purple-500/30 text-white"
              rows={3}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Textos
          </Button>
        </CardContent>
      </Card>

      {/* Emails */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Configurações de Email</CardTitle>
          <CardDescription className="text-purple-300">
            Configure os templates de email automáticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-email" className="text-purple-300">Email de Boas-Vindas</Label>
            <Textarea
              id="welcome-email"
              defaultValue="Bem-vindo ao Chave do Oráculo! Estamos felizes em tê-lo conosco..."
              className="bg-black/20 border-purple-500/30 text-white"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmation-email" className="text-purple-300">Email de Confirmação de Consulta</Label>
            <Textarea
              id="confirmation-email"
              defaultValue="Sua consulta foi confirmada! Detalhes: ..."
              className="bg-black/20 border-purple-500/30 text-white"
              rows={4}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Templates
          </Button>
        </CardContent>
      </Card>

      {/* Integrações */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Integrações</CardTitle>
          <CardDescription className="text-purple-300">
            Gerencie as integrações com serviços externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <div>
              <h3 className="text-white font-medium">Stripe</h3>
              <p className="text-sm text-purple-300">Processamento de pagamentos</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
              Conectado
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <div>
              <h3 className="text-white font-medium">SendGrid</h3>
              <p className="text-sm text-purple-300">Envio de emails</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
              Conectado
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
            <div>
              <h3 className="text-white font-medium">Auth0</h3>
              <p className="text-sm text-purple-300">Autenticação de usuários</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
              Conectado
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
