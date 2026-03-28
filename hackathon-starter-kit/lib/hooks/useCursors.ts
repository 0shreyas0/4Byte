"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Cursor {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

export function useCursors(channelName: string, user: { id: string; name: string }) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(`cursors:${channelName}`);

    channel
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        if (payload.id === user.id) return;
        setCursors((prev) => ({
          ...prev,
          [payload.id]: payload,
        }));
      })
      .subscribe();

    const lastSent = { current: 0 };
    const THROTTLE_MS = 20;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSent.current < THROTTLE_MS) return;
      lastSent.current = now;

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      channel.send({
        type: "broadcast",
        event: "cursor",
        payload: {
          id: user.id,
          name: user.name,
          x,
          y,
          color: `hsl(${parseInt(user.id.substring(0, 8), 16) % 360}, 70%, 50%)`,
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      channel.unsubscribe();
    };
  }, [channelName, user.id, user.name]);

  return { cursors: Object.values(cursors) };
}
