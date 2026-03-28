import React, { RefObject } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Message, MediaRequestType } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isGeneratingMedia: boolean;
  speakingMessageIndex: number | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSend: (text?: string, forceType?: MediaRequestType) => void;
  onSpeak: (text: string, force: boolean, index: number) => void;
  onExportPDF: (text: string) => void;
  onExportDocx: (text: string) => void;
  onExportTxt: (text: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  isGeneratingMedia,
  speakingMessageIndex,
  scrollRef,
  onSend,
  onSpeak,
  onExportPDF,
  onExportDocx,
  onExportTxt
}) => {
  return (
    <div 
      ref={scrollRef} 
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/20"
    >
      {messages.map((msg, i) => (
        <MessageItem 
          key={i}
          message={msg}
          index={i}
          isSpeaking={speakingMessageIndex === i}
          onSpeak={() => onSpeak(msg.content, true, i)}
          onExportPDF={() => onExportPDF(msg.content)}
          onExportDocx={() => onExportDocx(msg.content)}
          onExportTxt={() => onExportTxt(msg.content)}
        />
      ))}

      {messages.length === 1 && (
        <SuggestedPrompts onSelect={(prompt) => onSend(prompt)} />
      )}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[85%] flex gap-2">
            <div className="mt-1 w-6 h-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Bot size={12} />
            </div>
            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-primary" />
              <span className="text-[10px] text-muted-foreground italic">
                {isGeneratingMedia ? "Creating magic..." : "Synthesizing..."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
