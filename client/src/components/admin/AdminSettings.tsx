import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery({});
  const utils = trpc.useUtils();

  const [monthlyPrice, setMonthlyPrice] = useState("19.90");
  const [annualPrice, setAnnualPrice] = useState("199.00");
  const [consultationPrice, setConsultationPrice] = useState("150.00");
  const [heroTitle, setHeroTitle] = useState("Desvende os Mistérios do Universo");
  const [heroSubtitle, setHeroSubtitle] = useState("Tarot, Numerologia e Astrologia em um só lugar. Receba orientações personalizadas para guiar sua jornada e descobrir seu verdadeiro potencial.");
  const [welcomeEmail, setWelcomeEmail] = useState("Bem-vindo ao Chave do Oráculo! Estamos felizes em tê-lo conosco...");
  const [confirmationEmail, setConfirmationEmail] = useState("Sua consulta foi confirmada! Detalhes: ...");

  useEffect(() => {
    if (settings) {
      settings.forEach((setting) => {
        switch (setting.key) {
          case "price_monthly":
            setMonthlyPrice(setting.value);
            break;
          case "price_annual":
            setAnnualPrice(setting.value);
            break;
          case "price_consultation":
            setConsultationPrice(setting.value);
            break;
          case "hero_title":
            setHeroTitle(setting.value);
            break;
          case "hero_subtitle":
            setHeroSubtitle(setting.value);
            break;
          case "email_welcome":
            setWelcomeEmail(setting.value);
            break;
          case "email_confirmation":
            setConfirmationEmail(setting.value);
            break;
        }
      });
    }
  }, [settings]);

  const upsertMutation = trpc.admin.upsertSetting.useMutation({
    onSuccess: () => {
      toast.success("Configuração salva com sucesso");
      utils.admin.getSettings.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const savePrices = () => {
    Promise.all([
      upsertMutation.mutateAsync({
        key: "price_monthly",
        value: monthlyPrice,
        label: "Plano Mensal",
        category: "pricing",
      }),
      upsertMutation.mutateAsync({
        key: "price_annual",
        value: annualPrice,
        label: "Plano Anual",
        category: "pricing",
      }),
      upsertMutation.mutateAsync({
        key: "price_consultation",
        value: consultationPrice,
        label: "Consulta Base",
        category: "pricing",
      }),
    ])
      .then(() => toast.success("Preços salvos com sucesso"))
      .catch((error) => toast.error(error.message));
  };

  const saveTexts = () => {
    Promise.all([
      upsertMutation.mutateAsync({
        key: "hero_title",
        value: heroTitle,
        label: "Título Principal",
        category: "content",
      }),
      upsertMutation.mutateAsync({
        key: "hero_subtitle",
        value: heroSubtitle,
        label: "Subtítulo",
        category: "content",
      }),
    ])
      .then(() => toast.success("Textos salvos com sucesso"))
      .catch((error) => toast.error(error.message));
  };

  const saveEmails = () => {
    Promise.all([
      upsertMutation.mutateAsync({
        key: "email_welcome",
        value: welcomeEmail,
        label: "Email de Boas-Vindas",
        category: "email",
      }),
      upsertMutation.mutateAsync({
        key: "email_confirmation",
        value: confirmationEmail,
        label: "Email de Confirmação",
        category: "email",
      }),
    ])
      .then(() => toast.success("Templates de email salvos com sucesso"))
      .catch((error) => toast.error(error.message));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

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
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
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
                  value={annualPrice}
                  onChange={(e) => setAnnualPrice(e.target.value)}
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
                  value={consultationPrice}
                  onChange={(e) => setConsultationPrice(e.target.value)}
                  className="pl-10 bg-black/20 border-purple-500/30 text-white"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={savePrices}
            disabled={upsertMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {upsertMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preços
              </>
            )}
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
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle" className="text-purple-300">Subtítulo</Label>
            <Textarea
              id="hero-subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              rows={3}
            />
          </div>
          <Button
            onClick={saveTexts}
            disabled={upsertMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {upsertMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Textos
              </>
            )}
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
              value={welcomeEmail}
              onChange={(e) => setWelcomeEmail(e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmation-email" className="text-purple-300">Email de Confirmação de Consulta</Label>
            <Textarea
              id="confirmation-email"
              value={confirmationEmail}
              onChange={(e) => setConfirmationEmail(e.target.value)}
              className="bg-black/20 border-purple-500/30 text-white"
              rows={4}
            />
          </div>
          <Button
            onClick={saveEmails}
            disabled={upsertMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {upsertMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Templates
              </>
            )}
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
