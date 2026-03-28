import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useClipboard() {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy text");
    });
  }, []);

  return { hasCopied, copyToClipboard };
}
