import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, User, Copy, Check, Volume2, Download,
  Wand2, FileText, FileDown, Paperclip,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, CodeSnippet } from '@/ui';
import { Message } from '../types';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

interface MessageItemProps {
  message: Message;
  index: number;
  isSpeaking: boolean;
  onSpeak: () => void;
  onExportPDF: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  index, 
  isSpeaking, 
  onSpeak,
  onExportPDF,
  onExportDocx,
  onExportTxt
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[90%] flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`mt-1 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center shadow-sm ${
          message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
        }`}>
          {message.role === 'user' ? <User size={12} /> : (message.role === 'assistant' ? <Bot size={12} /> : <Wand2 size={12} />)}
        </div>
        
        <div className="space-y-1 relative group">
          {message.role === 'image' ? (
            <div className="rounded-xl overflow-hidden border border-border bg-muted/50 p-2">
              <img src={message.content} alt="Generated AI" className="w-full h-auto rounded-lg shadow-sm" />
              <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-[10px]" onClick={() => saveAs(message.content, 'ai-image.jpg')}>
                <Download size={12} className="mr-2" /> Download Image
              </Button>
            </div>
          ) : message.role === 'video' ? (
            <div className="rounded-xl overflow-hidden border border-border bg-muted/50 p-2">
              <video src={message.content} controls className="w-full h-auto rounded-lg shadow-sm" />
              <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-[10px]" onClick={() => window.open(message.content, '_blank')}>
                <Download size={12} className="mr-2" /> Download Video
              </Button>
            </div>
          ) : (
            <div className={`p-3 rounded-xl text-xs leading-body ${
              message.role === 'user' ? 'bg-primary/10 border border-primary/20 rounded-tr-none' : 'bg-muted/50 border border-border rounded-tl-none'
            }`}>
              <div className="prose prose-xs dark:prose-invert max-w-none wrap-break-word">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const code = String(children ?? '');
                      if (!inline && match) {
                        return (
                          <CodeSnippet
                            {...props}
                            code={code}
                            language={match[1]}
                          />
                        );
                      }
                      return (
                        <CodeSnippet
                          {...props}
                          code={code}
                          inline
                          className={className}
                        />
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {message.role === 'assistant' && (
            <div className="flex flex-row items-center gap-1 ml-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={copyToClipboard} 
                className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                title="Copy"
              >
                {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
              </button>
              <button 
                onClick={onSpeak} 
                className={`p-1.5 rounded-md transition-colors ${isSpeaking ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                title={isSpeaking ? "Stop" : "Listen"}
              >
                <Volume2 size={11} />
              </button>
              
              <div className="relative group/export">
                <button className="p-1.5 hover:bg-muted rounded-md text-primary transition-colors">
                  <Download size={11} />
                </button>
                <div className="absolute left-0 bottom-full pb-2 hidden group-hover/export:block z-50 min-w-[90px]">
                  <div className="bg-popover border border-border shadow-2xl rounded-lg overflow-hidden mb-1">
                     <button onClick={onExportPDF} className="w-full px-3 py-1.5 text-[10px] text-left hover:bg-muted flex items-center gap-2 transition-colors">
                       <FileText size={10} className="text-primary" /> PDF
                     </button>
                     <button onClick={onExportDocx} className="w-full px-3 py-1.5 text-[10px] text-left hover:bg-muted flex items-center gap-2 transition-colors">
                       <FileDown size={10} className="text-primary" /> DOCX
                     </button>
                     <button onClick={onExportTxt} className="w-full px-3 py-1.5 text-[10px] text-left hover:bg-muted flex items-center gap-2 transition-colors">
                       <Download size={10} className="text-primary" /> TXT
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
