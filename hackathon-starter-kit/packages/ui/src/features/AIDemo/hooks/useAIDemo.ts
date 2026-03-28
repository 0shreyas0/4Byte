import { useState, useCallback } from 'react';
import { api } from '@/lib/api/fetcher';
import { toast } from 'sonner';

export const useAIDemo = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      const data = await api.post<{ message: string }>('/api/chat', { prompt });
      setResponse(data.message);
      toast.success("AI respond successfully!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  return {
    prompt,
    setPrompt,
    response,
    loading,
    handleTest
  };
};
