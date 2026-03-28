import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Mic, MicOff, Paperclip, PlusSquare, 
  Wand2, Video 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MediaRequestType } from './types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  isParsing: boolean;
  isListening: boolean;
  showTools: boolean;
  setShowTools: (value: boolean) => void;
  onSend: (text?: string, forceType?: MediaRequestType) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartListening: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  isParsing,
  isListening,
  showTools,
  setShowTools,
  onSend,
  onFileUpload,
  onStartListening
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="p-3 border-t border-border bg-muted/20 space-y-2">
      <AnimatePresence>
        {showTools && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            className="flex gap-2 pb-2 overflow-x-auto no-scrollbar"
          >
             <button 
               onClick={() => onSend(input, 'image')} 
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-bold"
             >
               <Wand2 size={12} /> Image
             </button>
             <button 
               onClick={() => onSend(input, 'video')} 
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-bold"
             >
               <Video size={12} /> Video
             </button>
             <button 
               onClick={() => fileInputRef.current?.click()} 
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-bold"
             >
               <Paperclip size={12} /> PDF
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit} 
        className="flex items-center gap-2 bg-background border border-border p-1.5 rounded-xl transition-all focus-within:ring-1 focus-within:ring-primary shadow-sm"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileUpload} 
          className="hidden" 
          accept=".pdf" 
        />
        
        <button 
          type="button" 
          onClick={() => setShowTools(!showTools)} 
          className={`p-1.5 rounded-md transition-colors ${showTools ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <PlusSquare size={14} />
        </button>
        
        <button
          type="button"
          onClick={onStartListening}
          className={`p-1.5 rounded-md transition-colors ${isListening ? 'bg-red-500/10 text-red-500' : 'hover:bg-muted text-muted-foreground'}`}
          title="Dictate"
        >
          {isListening ? <MicOff size={14} /> : <Mic size={14} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={showTools ? "Enter prompt to generate..." : "Ask or use tools..."}
          className="flex-1 bg-transparent border-none px-2 py-1 text-xs outline-none placeholder:text-muted-foreground/60 w-full"
        />

        <Button 
          type="submit" 
          size="sm" 
          variant="primary" 
          className="rounded-lg h-8 w-8 p-0 shrink-0 shadow-md shadow-primary/20" 
          disabled={!input.trim() || isLoading || isParsing}
        >
          <Send size={14} />
        </Button>
      </form>
    </div>
  );
};
