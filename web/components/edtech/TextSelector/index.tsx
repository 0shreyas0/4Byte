"use client";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { explainTextSelection } from "@/lib/edtech/ai";
import { tutorSpeak } from "@/components/edtech/Avatar";

export default function TextSelector({ persona = "ENGINEERING" }: { persona?: "KINDER" | "SCHOOL" | "ENGINEERING" }) {
  const [selection, setSelection] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const selectedText = window.getSelection()?.toString().trim();
      
      if (selectedText && selectedText.length > 5) {
        const range = window.getSelection()?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 10
          });
          setSelection(selectedText);
          setIsVisible(true);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
       // Only close if not clicking our button
       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsVisible(false);
          setLoading(false);
       }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleExplain = async () => {
    if (!selection || loading) return;
    
    setLoading(true);
    // Show immediate thinking bubble in tutor
    tutorSpeak([], true); 

    try {
      const parts = await explainTextSelection(selection, persona);
      tutorSpeak(parts);
      setIsVisible(false);
    } catch (error) {
      console.error("Selection explanation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed z-[9999] pointer-events-none"
      style={{ left: `${position.x}px`, top: `${position.y}px`, transform: "translate(-50%, -100%)" }}
    >
      <div className="pointer-events-auto flex items-center gap-1 bg-black text-white px-3 py-2 border-2 border-white shadow-[6px_6px_0_#AF52DE] animate-in slide-in-from-bottom-2 fade-in">
        <button 
          onClick={handleExplain}
          disabled={loading}
          className="flex items-center gap-2 hover:text-[#FFD60A] transition-colors group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Sparkles size={14} className="group-hover:animate-pulse text-[#FFD60A]" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {loading ? "Analysing..." : "Deep Explain"}
          </span>
        </button>
        <div className="w-[1px] h-3 bg-white/30 mx-1" />
        <button 
          onClick={() => setIsVisible(false)}
          className="hover:text-red-400 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      
      {/* Little arrow down */}
      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black border-r-2 border-b-2 border-white rotate-45" />
    </div>
  );
}
