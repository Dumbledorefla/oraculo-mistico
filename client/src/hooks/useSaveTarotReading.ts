import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export interface TarotReadingData {
  readingType: string;
  cards: any[];
  interpretation?: string;
  userName?: string;
}

export function useSaveTarotReading() {
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.tarot.saveReading.useMutation();

  const saveReading = async (data: TarotReadingData) => {
    if (!isAuthenticated) {
      toast.info("Faça login para salvar suas leituras no histórico pessoal");
      return null;
    }

    try {
      const result = await saveMutation.mutateAsync({
        readingType: data.readingType,
        cards: data.cards,
        interpretation: data.interpretation,
        userName: data.userName,
      });
      
      toast.success("Leitura salva com sucesso!");
      return result;
    } catch (error) {
      console.error("Erro ao salvar leitura:", error);
      toast.error("Erro ao salvar a leitura. Tente novamente.");
      return null;
    }
  };

  return {
    saveReading,
    isSaving: saveMutation.isPending,
    error: saveMutation.error,
  };
}
