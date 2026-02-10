/**
 * UserDataForm - OB1 Requirement
 * Coleta obrigatória de nome completo e data de nascimento antes de executar métodos
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UserData {
  fullName: string;
  birthDate: string;
  // Campos opcionais para métodos de amor
  partnerName?: string;
  partnerBirthDate?: string;
}

interface UserDataFormProps {
  onSubmit: (data: UserData) => void;
  initialData?: Partial<UserData>;
  isLoveMethod?: boolean; // Se true, mostra campos do parceiro
  title?: string;
  description?: string;
}

export default function UserDataForm({
  onSubmit,
  initialData,
  isLoveMethod = false,
  title = "Seus Dados Pessoais",
  description = "Para personalizar sua leitura, precisamos de algumas informações básicas."
}: UserDataFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || "");
  const [partnerName, setPartnerName] = useState(initialData?.partnerName || "");
  const [partnerBirthDate, setPartnerBirthDate] = useState(initialData?.partnerBirthDate || "");

  // Pré-preencher com dados iniciais
  useEffect(() => {
    if (initialData?.fullName) setFullName(initialData.fullName);
    if (initialData?.birthDate) setBirthDate(initialData.birthDate);
    if (initialData?.partnerName) setPartnerName(initialData.partnerName);
    if (initialData?.partnerBirthDate) setPartnerBirthDate(initialData.partnerBirthDate);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !birthDate) {
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      birthDate,
      ...(isLoveMethod && partnerName && { partnerName: partnerName.trim() }),
      ...(isLoveMethod && partnerBirthDate && { partnerBirthDate }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            {title}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do usuário */}
            <div className="space-y-4 bg-purple-900/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Suas Informações</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                  className="bg-gray-800/50 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data de Nascimento *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="bg-gray-800/50 border-purple-500/20 text-white focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Campos opcionais para métodos de amor */}
            {isLoveMethod && (
              <div className="space-y-4 bg-pink-900/20 rounded-lg p-6 border border-pink-500/20">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Informações do Parceiro(a) (Opcional)
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Esses dados ajudam a personalizar melhor sua leitura sobre relacionamentos.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="partnerName" className="text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome do Parceiro(a)
                  </Label>
                  <Input
                    id="partnerName"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Digite o nome (opcional)"
                    className="bg-gray-800/50 border-pink-500/20 text-white placeholder-gray-500 focus:border-pink-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerBirthDate" className="text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data de Nascimento do Parceiro(a)
                  </Label>
                  <Input
                    id="partnerBirthDate"
                    type="date"
                    value={partnerBirthDate}
                    onChange={(e) => setPartnerBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="bg-gray-800/50 border-pink-500/20 text-white focus:border-pink-500/50"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg"
              disabled={!fullName.trim() || !birthDate}
            >
              Continuar para a Leitura
            </Button>

            <p className="text-center text-xs text-gray-500">
              * Campos obrigatórios
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
