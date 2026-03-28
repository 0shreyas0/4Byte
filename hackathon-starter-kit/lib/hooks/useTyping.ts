import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function useTyping(channelId: string, currentUser: { id: string, name: string }) {
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const channelRef = useRef<any>(null);

    const setTyping = useCallback((isTyping: boolean) => {
        if (!channelRef.current || !currentUser.id) return;
        
        channelRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: {
                id: currentUser.id,
                name: currentUser.name,
                isTyping
            },
        });
    }, [currentUser.id, currentUser.name]);

    useEffect(() => {
        if (!channelId || !supabase) return;

        const channel = supabase.channel(`typing:${channelId}`, {
            config: { broadcast: { self: false } }
        });
        
        channelRef.current = channel;

        const typingState: Record<string, { name: string, timestamp: number }> = {};

        channel
            .on("broadcast", { event: "typing" }, ({ payload }) => {
                if (payload.isTyping) {
                    typingState[payload.id] = { name: payload.name, timestamp: Date.now() };
                } else {
                    delete typingState[payload.id];
                }
                setTypingUsers(Object.values(typingState).map(u => u.name));
            })
            .subscribe();

        const interval = setInterval(() => {
            const now = Date.now();
            let changed = false;
            Object.keys(typingState).forEach(id => {
                if (now - typingState[id].timestamp > 3000) {
                    delete typingState[id];
                    changed = true;
                }
            });
            if (changed) {
                setTypingUsers(Object.values(typingState).map(u => u.name));
            }
        }, 1000);

        return () => {
            if (supabase) supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [channelId, currentUser.id, currentUser.name]);

    return { typingUsers, setTyping };
}
