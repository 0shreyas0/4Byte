"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useCollaborativeText, RemoteUser, TextOperation } from "@/lib/hooks/useCollaborativeText";
import { motion, AnimatePresence } from "framer-motion";
import { FileEdit, Sparkles, Users, MousePointer2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { TypingIndicator } from "./TypingIndicator";

interface CollaborativeEditorProps {
  docId: string;
  userId: string;
  userName: string;
  title?: string;
}

const RemoteCursor = ({ user, textareaRef }: { user: RemoteUser, textareaRef: React.RefObject<HTMLTextAreaElement | null> }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Create a temporary span to measure text width
    const text = textarea.value.substring(0, user.cursorPos);
    const lines = text.split('\n');
    const currentLine = lines[lines.length - 1];
    
    // We create a mirror to calculate dimensions accurately
    const mirror = document.createElement('div');
    const style = window.getComputedStyle(textarea);
    
    // Copy essential styles for measurement
    const stylesToCopy = [
      'font-family', 'font-size', 'font-weight', 'line-height', 
      'padding-left', 'padding-top', 'letter-spacing', 'text-transform'
    ];
    stylesToCopy.forEach(s => mirror.style.setProperty(s, style.getPropertyValue(s)));
    
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.width = style.width;
    mirror.innerText = text;
    document.body.appendChild(mirror);

    // Calculate position
    const rect = textarea.getBoundingClientRect();
    
    // Create a span at the end of the text to get coordinates
    const marker = document.createElement('span');
    marker.textContent = '|';
    mirror.appendChild(marker);
    
    const markerRect = marker.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();
    
    setCoords({
      x: markerRect.left - mirrorRect.left + 40, // adding padding
      y: markerRect.top - mirrorRect.top + 40
    });

    document.body.removeChild(mirror);
  }, [user.cursorPos, user.isTyping, user.userId]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: coords.x, y: coords.y }}
      className="absolute pointer-events-none z-50 flex flex-col"
      style={{ transition: 'all 0.1s linear' }}
    >
      <div className="w-[1.5px] h-5" style={{ backgroundColor: user.color }} />
      <div 
        className="px-1.5 py-0.5 rounded-sm text-[9px] font-black text-white whitespace-nowrap -ml-0.5 shadow-lg border border-white/20"
        style={{ backgroundColor: user.color }}
      >
        {user.userName}
      </div>
    </motion.div>
  );
};

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  docId,
  userId,
  userName,
  title = "Untitled Document",
}) => {
  const { content, setContent, lastOp, applyOperation, updateCursor, remoteUsers, isTyping, setTypingStatus, userColor } = useCollaborativeText(docId, userId, userName);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevContentRef = useRef(content);

  useEffect(() => {
    prevContentRef.current = content;
  }, [content]);

  // Apply Operational Transformation (OT) to preserve local cursor during remote edits
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !lastOp) return;

    const op = lastOp;
    const currentPos = textarea.selectionStart;
    let newPos = currentPos;

    if (op.userId !== userId) {
      if (op.type === 'insert' && op.index <= currentPos) {
        newPos += (op.text?.length || 0);
      } else if (op.type === 'delete' && op.index < currentPos) {
        const opLen = op.length || 0;
        if (op.index + opLen <= currentPos) {
          newPos -= opLen;
        } else {
           newPos = op.index;
        }
      }

      if (newPos !== currentPos) {
        textarea.setSelectionRange(newPos, newPos);
      }
    }
  }, [content, userId, lastOp]);

  // Handle local text changes by calculating deltas (Google Docs style)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value;
    const prevValue = prevContentRef.current;
    const selectionStart = e.target.selectionStart;
    
    // Simple diff calculation
    if (nextValue.length > prevValue.length) {
      // Insertion
      const diffLen = nextValue.length - prevValue.length;
      const index = selectionStart - diffLen;
      const text = nextValue.slice(index, selectionStart);
      
      const op = { type: 'insert' as const, index, text };
      applyOperation(op);
    } else if (nextValue.length < prevValue.length) {
      // Deletion
      const diffLen = prevValue.length - nextValue.length;
      const index = selectionStart;
      
      const op = { type: 'delete' as const, index, length: diffLen };
      applyOperation(op);
    }
    
    setContent(nextValue);
    updateCursor(selectionStart, e.target.selectionEnd);
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setTypingStatus(userId, true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(userId, false);
      typingTimeoutRef.current = null;
    }, 2000);
    
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    setTimeout(() => {
        updateCursor(textareaRef.current?.selectionStart || start, textareaRef.current?.selectionEnd || end);
    }, 0);
  };

  const handleSelect = () => {
    if (textareaRef.current) {
       updateCursor(textareaRef.current.selectionStart, textareaRef.current.selectionEnd);
    }
  };

  const typingUserNames = Object.entries(isTyping)
    .filter(([id, typing]) => id !== userId && typing)
    .map(([id]) => {
        const remoteUser = Object.values(remoteUsers).find(u => u.userId === id);
        return remoteUser ? remoteUser.userName : `User ${id.substring(0, 4)}`;
    });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[600px] border border-border rounded-3xl bg-background overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/5">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5">
            <FileEdit size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-[0.1em]">{title}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
              Multi-Agent Sync Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <TypingIndicator typingUsers={typingUserNames} />
          <div className="flex -space-x-3">
            <div 
              className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-black text-white shadow-lg relative z-10"
              style={{ backgroundColor: userColor }}
              title="You"
            >
              YOU
            </div>
            {Object.values(remoteUsers).map((u, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                key={u.userId} 
                className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-black text-white shadow-xl relative"
                style={{ backgroundColor: u.color, zIndex: 5 - i }}
                title={u.userName}
              >
                {u.userName.substring(0, 2).toUpperCase()}
                {u.isTyping && (
                   <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background animate-bounce" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div 
        ref={containerRef} 
        className="flex-1 relative p-10 cursor-text bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" 
        onClick={() => textareaRef.current?.focus()}
      >
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] pointer-events-none" />
        
        <div className="absolute top-10 right-10 opacity-[0.02] pointer-events-none">
          <Sparkles size={300} className="text-primary" />
        </div>

        {/* Remote Cursors Layer */}
        {Object.values(remoteUsers).map((u) => (
          <RemoteCursor 
            key={u.userId} 
            user={u} 
            textareaRef={textareaRef} 
          />
        ))}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          placeholder="Type something amazing..."
          className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-lg leading-[1.8] text-foreground placeholder:text-muted-foreground/20 selection:bg-primary/30 relative z-10"
          spellCheck={false}
        />
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
             <span className="text-foreground/20">{content.split(/\s+/).filter(Boolean).length}</span>
             <span>Words</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-foreground/20">{content.length}</span>
             <span>Chars</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-60">P2P Broadcast Active</span>
          <div className="flex gap-1.5 item-center h-full">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-primary" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
