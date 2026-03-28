import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Send } from 'lucide-react';

interface AIDemoFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const AIDemoForm: React.FC<AIDemoFormProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  loading
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something to test..."
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={loading || !prompt.trim()}
        size="sm"
        variant="primary"
        className="shrink-0 rounded-xl"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      </Button>
    </form>
  );
};
