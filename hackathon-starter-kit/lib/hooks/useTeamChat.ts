import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface Message {
    id: string;
    content?: string;
    sender_id: string;
    sender_name: string;
    sender_avatar?: string;
    message_type: 'text' | 'image' | 'gif' | 'pdf' | 'file';
    file_url?: string;
    case_id: string;
    created_at: string;
}

export function useTeamChat(caseId: string, currentUser: { id: string, name: string, avatar?: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [onlineCount, setOnlineCount] = useState(1);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const channelRef = useRef<any>(null);
    const [typingUsers, setTypingUsers] = useState<Record<string, { name: string, timestamp: number }>>({});
    const typingTimeoutRef = useRef<any>(null);
    const lastBroadcastRef = useRef<number>(0);

    const setTyping = useCallback((isTyping: boolean) => {
        if (!channelRef.current || !currentUser.id) return;
        
        const now = Date.now();
        if (isTyping && now - lastBroadcastRef.current < 2000) return;
        
        lastBroadcastRef.current = now;
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

    const fetchMessages = useCallback(async () => {
        const client = supabase;
        if (!client) {
            setError("Realtime chat is disabled: Supabase is not configured.");
            return;
        }
        try {
            const { data, error: fetchError } = await client
                .from("chat_messages")
                .select("*")
                .eq("case_id", caseId)
                .order("created_at", { ascending: true });

            if (fetchError) {
                console.error("Supabase fetch error:", fetchError);
                throw fetchError;
            }
            setMessages(data || []);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching messages:", err);
            setError(`Failed to load message history: ${err.message || "Unauthorized Access"}`);
        }
    }, [caseId]);

    useEffect(() => {
        if (!caseId || !supabase) return;

        const channel = supabase
            .channel(`chat:${caseId}`, {
                config: {
                    broadcast: { self: false },
                    presence: { key: currentUser.id }
                },
            });
            
        channelRef.current = channel;

        channel
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `case_id=eq.${caseId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .on(
                "broadcast",
                { event: "message" },
                ({ payload }) => {
                    setMessages((prev) => {
                        if (prev.some(m => m.id === payload.id)) return prev;
                        return [...prev, payload as Message];
                    });
                }
            )
            .on(
                "broadcast",
                { event: "typing" },
                ({ payload }) => {
                    setTypingUsers(prev => {
                        const next = { ...prev };
                        if (payload.isTyping) {
                            next[payload.id] = { name: payload.name, timestamp: Date.now() };
                        } else {
                            delete next[payload.id];
                        }
                        return next;
                    });
                }
            )
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                const state = channel.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                const state = channel.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: currentUser.id,
                        user_name: currentUser.name,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // Cleanup stale typing users
        const interval = setInterval(() => {
            setTypingUsers(prev => {
                const now = Date.now();
                const next = { ...prev };
                let changed = false;
                Object.keys(next).forEach(id => {
                    if (now - next[id].timestamp > 3000) {
                        delete next[id];
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }, 1000);

        fetchMessages();

        return () => {
            if (supabase) {
                supabase.removeChannel(channel);
            }
            clearInterval(interval);
        };
    }, [caseId, fetchMessages, currentUser.id, currentUser.name]);

    async function uploadAndSendFile(file: File) {
        const client = supabase;
        if (!client) {
            setError("Storage is disabled: Supabase is not configured.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
            const filePath = `${caseId}/${fileName}`;

            const { error: uploadError } = await client.storage
                .from('chat-attachments')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = client.storage
                .from('chat-attachments')
                .getPublicUrl(filePath);

            let type: Message['message_type'] = 'file';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '')) type = 'image';
            else if (fileExt === 'pdf') type = 'pdf';

            await sendInternalMessage({
                message_type: type,
                file_url: publicUrl,
                content: file.name
            });
        } catch (err: any) {
            console.error("Error uploading file:", err);
            setError(`Upload Error: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    }

    async function sendInternalMessage(params: { content?: string, message_type: Message['message_type'], file_url?: string }) {
        const client = supabase;
        if (!client || !caseId) return;

        const messageId = crypto.randomUUID();
        const messageObj: Message = {
            id: messageId,
            content: params.content,
            message_type: params.message_type,
            file_url: params.file_url,
            case_id: caseId as any,
            sender_id: currentUser.id,
            sender_name: currentUser.name,
            sender_avatar: currentUser.avatar || undefined,
            created_at: new Date().toISOString(),
        };

        // Broadcast immediately
        if (channelRef.current) {
            channelRef.current.send({
                type: "broadcast",
                event: "message",
                payload: messageObj,
            });
        }

        // Optimistic UI
        setMessages((prev) => [...prev, messageObj]);

        const { error: sendError } = await client.from("chat_messages").insert([
            {
                id: messageId,
                content: params.content,
                message_type: params.message_type,
                file_url: params.file_url,
                case_id: caseId,
                sender_id: messageObj.sender_id,
                sender_name: messageObj.sender_name,
                sender_avatar: messageObj.sender_avatar || null,
            },
        ]);

        if (sendError) throw sendError;
    }

    async function sendMessage(e?: React.FormEvent) {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            await sendInternalMessage({
                content: newMessage.trim(),
                message_type: 'text'
            });
            setNewMessage("");
            
            // Stop typing broadcast
            if (channelRef.current) {
                channelRef.current.send({
                    type: "broadcast",
                    event: "typing",
                    payload: { id: currentUser.id, name: currentUser.name, isTyping: false },
                });
            }
        } catch (err: any) {
            setError(`Transmission Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    return {
        messages,
        newMessage,
        setNewMessage,
        loading,
        isUploading,
        error,
        sendMessage,
        uploadAndSendFile,
        onlineCount,
        typingUsers: Object.values(typingUsers).map(u => u.name),
        setTyping
    };
}