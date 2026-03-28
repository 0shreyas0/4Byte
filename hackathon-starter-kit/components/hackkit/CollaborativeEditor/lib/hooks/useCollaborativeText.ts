"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface RemoteUser {
  userId: string;
  userName: string;
  cursorPos: number;
  selectionEnd: number;
  color: string;
  isTyping: boolean;
}

export interface TextOperation {
  type: 'insert' | 'delete';
  index: number;
  text?: string;
  length?: number;
  userId: string;
}

export function useCollaborativeText(docId: string, userId: string, userName: string, initialContent: string = "") {
  const [content, setContent] = useState(initialContent);
  const [remoteUsers, setRemoteUsers] = useState<Record<string, RemoteUser>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const channelRef = useRef<any>(null);
  const contentRef = useRef(content);

  // Sync ref with state for operation application
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const colors = [
    '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6', '#fbbf24'
  ];
  
  const userColor = useRef(colors[Math.abs(userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length]);

  const [lastOp, setLastOp] = useState<TextOperation | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(`collab:${docId}`);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "edit-op" }, ({ payload }: { payload: TextOperation }) => {
        if (payload.userId === userId) return;

        setLastOp(payload);
        setContent((prev) => {
          let newContent = prev;
          if (payload.type === 'insert' && payload.text) {
            newContent = prev.slice(0, payload.index) + payload.text + prev.slice(payload.index);
          } else if (payload.type === 'delete' && payload.length) {
            newContent = prev.slice(0, payload.index) + prev.slice(payload.index + payload.length);
          }
          return newContent;
        });
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        setIsTyping((prev) => ({
          ...prev,
          [payload.userId]: payload.isTyping,
        }));
        setRemoteUsers(prev => ({
          ...prev,
          [payload.userId]: {
            ...prev[payload.userId],
            isTyping: payload.isTyping,
            userId: payload.userId
          }
        } as Record<string, RemoteUser>));
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        if (payload.userId === userId) return;
        setRemoteUsers(prev => ({
          ...prev,
          [payload.userId]: {
            ...payload,
            isTyping: prev[payload.userId]?.isTyping ?? false
          }
        } as Record<string, RemoteUser>));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [docId, userId]);

  const applyOperation = useCallback((op: Omit<TextOperation, 'userId'>) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "edit-op",
      payload: { ...op, userId },
    });
  }, [userId]);

  const updateCursor = useCallback((pos: number, endPos?: number) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "cursor",
      payload: { userId, userName, cursorPos: pos, selectionEnd: endPos || pos, color: userColor.current },
    });
  }, [userId, userName]);

  const setTypingStatus = useCallback((userId: string, status: boolean) => {
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId, isTyping: status },
    });
  }, []);

  return { content, setContent, lastOp, applyOperation, updateCursor, remoteUsers, isTyping, setTypingStatus, userColor: userColor.current };
}
