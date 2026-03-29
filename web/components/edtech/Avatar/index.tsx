"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { X, MessageSquare } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function normalizeTutorText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[ \t]*[#>-]+[ \t]*/gm, "")
    .trim();
}

export default function Avatar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Namaste! I am your tutor. Ask me any concept and I will explain it step by step."
    }
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Listen for global "tutor-speak" / "tutor-stop" events
  useEffect(() => {
    const handleSpeakEvent = (e: any) => {
      if (e.detail?.thinking) {
        setIsChatLoading(true);
        setIsVisible(true);
        setIsChatOpen(true);
      }

      const payload = e.detail?.text;
      if (Array.isArray(payload) && payload.length > 0) {
        const clean = payload.map((part) => normalizeTutorText(String(part))).join("\n\n");
        setChatMessages((prev) => [...prev, { role: "assistant", content: clean }]);
        setIsChatLoading(false);
        setIsVisible(true);
        setIsChatOpen(true);
      } else if (typeof payload === "string" && payload.trim()) {
        const clean = normalizeTutorText(payload);
        setChatMessages((prev) => [...prev, { role: "assistant", content: clean }]);
        setIsChatLoading(false);
        setIsVisible(true);
        setIsChatOpen(true);
      }
    };
    const handleStopEvent = () => setIsChatLoading(false);

    window.addEventListener("tutor-speak", handleSpeakEvent);
    window.addEventListener("tutor-stop", handleStopEvent);
    
    return () => {
      window.removeEventListener("tutor-speak", handleSpeakEvent);
      window.removeEventListener("tutor-stop", handleStopEvent);
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  const sendChatMessage = useCallback(async () => {
    const userText = chatInput.trim();
    if (!userText || isChatLoading) return;

    const nextMessages: ChatMessage[] = [...chatMessages, { role: "user", content: userText }];
    setChatMessages(nextMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Chat request failed");
      }

      const data = await response.json();
      const reply = typeof data.reply === "string" ? data.reply : "I could not generate a response right now.";
      const cleanReply = normalizeTutorText(reply);
      setChatMessages((prev) => [...prev, { role: "assistant", content: cleanReply }]);
    } catch (error: any) {
      const fallback = `Chat error: ${error?.message || "Unknown failure"}`;
      setChatMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, chatMessages]);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-10 left-10 w-16 h-16 bg-[#FFD60A] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center z-100"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-10 left-10 z-100 flex flex-col items-start select-none">
      <div className="w-[320px] bg-white border-4 border-black shadow-[8px_8px_0px_#000]">
        <div className="flex items-center justify-between px-3 py-2 bg-[#FFD60A] border-b-4 border-black">
          <p className="text-[10px] font-black uppercase tracking-widest">Tutor Chat</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsChatOpen((prev) => !prev)}
              className="p-1 border-2 border-black bg-white hover:bg-gray-100"
              title={isChatOpen ? "Collapse chat" : "Open chat"}
            >
              <MessageSquare size={12} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 border-2 border-black bg-white hover:bg-gray-100"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {isChatOpen && (
          <>
            <div ref={chatScrollRef} className="h-52 overflow-y-auto p-3 bg-[#f6f6f6] space-y-2">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[90%] px-2 py-2 border-2 border-black text-[10px] font-bold leading-relaxed ${
                    message.role === "user"
                      ? "ml-auto bg-black text-white"
                      : "mr-auto bg-white text-black"
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {isChatLoading && (
                <div className="mr-auto inline-flex items-center gap-1 px-2 py-2 border-2 border-black bg-white text-[10px] font-black uppercase">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:240ms]" />
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChatMessage();
              }}
              className="p-2 border-t-4 border-black bg-white"
            >
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your tutor..."
                  className="flex-1 border-2 border-black px-2 py-1.5 text-[11px] font-bold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-3 py-1.5 border-2 border-black bg-black text-white text-[10px] font-black uppercase tracking-wider disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function tutorSpeak(text: string | string[], thinking: boolean = false) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tutor-speak", { detail: { text, thinking } }));
  }
}
