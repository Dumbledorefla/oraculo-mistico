import { useState, useEffect } from 'react';

export interface Reading {
  id: string;
  date: string;
  spreadType: string;
  spreadName: string;
  cards: number[];
  cardNames: string[];
  question?: string;
}

const STORAGE_KEY = 'chave-oraculo-history';

export function useReadingHistory() {
  const [history, setHistory] = useState<Reading[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar histórico do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage sempre que o histórico mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addReading = (reading: Omit<Reading, 'id' | 'date'>) => {
    const newReading: Reading = {
      ...reading,
      id: Date.now().toString(),
      date: new Date().toLocaleString('pt-BR')
    };
    setHistory([newReading, ...history]);
    return newReading;
  };

  const deleteReading = (id: string) => {
    setHistory(history.filter(r => r.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getReadingsBySpread = (spreadType: string) => {
    return history.filter(r => r.spreadType === spreadType);
  };

  return {
    history,
    addReading,
    deleteReading,
    clearHistory,
    getReadingsBySpread,
    isLoaded
  };
}
