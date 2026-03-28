"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "away" | "busy";
  lastSeen: string;
}

export function usePresence(channelName: string, user: { id: string; name: string; avatar?: string }) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, PresenceUser>>({});

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(`presence:${channelName}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const formatted: Record<string, PresenceUser> = {};
        
        Object.entries(state).forEach(([key, presenceValues]) => {
          const val = presenceValues[0] as any;
          formatted[key] = {
            id: key,
            name: val.name || "Anonymous",
            avatar: val.avatar,
            status: val.status || "online",
            lastSeen: new Date().toISOString(),
          };
        });
        
        setOnlineUsers(formatted);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            name: user.name,
            avatar: user.avatar,
            status: "online",
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [channelName, user.id, user.name, user.avatar]);

  return { onlineUsers: Object.values(onlineUsers) };
}
