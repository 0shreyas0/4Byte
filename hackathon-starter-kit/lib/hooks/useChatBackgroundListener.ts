import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useInvestigationStore } from "@/lib/store/investigationStore";

export function useChatBackgroundListener(caseId: string | null) {
    const { incrementUnreadMessagesCount } = useInvestigationStore();

    useEffect(() => {
        if (!caseId || !supabase) return;

        const channel = supabase
            .channel(`chat:${caseId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `case_id=eq.${caseId}`,
                },
                () => {
                    incrementUnreadMessagesCount();
                }
            )
            .on(
                "broadcast",
                { event: "message" },
                () => {
                    incrementUnreadMessagesCount();
                }
            )
            .subscribe();

        return () => {
            if (supabase) {
                supabase.removeChannel(channel);
            }
        };
    }, [caseId, incrementUnreadMessagesCount]);
}