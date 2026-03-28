"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { X, MessageSquare, Volume2, VolumeX, Sparkles, Settings, Play } from "lucide-react";

export default function Avatar() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [msg, setMsg] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🎙️ VOICE MANAGEMENT
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      
      // Default selection: User specifically wants Google Hindi if available
      const preferred = allVoices.find(v => v.name.includes("Google Hindi")) || 
                        allVoices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
      setSelectedVoice(preferred || allVoices[0]);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // 🗣️ SPEAK FUNCTION
  const speakPromise = useCallback((text: string, voice?: SpeechSynthesisVoice) => {
    return new Promise<void>((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const activeVoice = voice || selectedVoice;
      if (activeVoice) utterance.voice = activeVoice;
      
      utterance.rate = rate; 
      utterance.pitch = pitch;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setMsg(text);
        if (videoRef.current) {
          videoRef.current.loop = true;
          videoRef.current.play().catch(() => {});
        }
      };

      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = () => {
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [selectedVoice, rate, pitch]);

  const speak = useCallback(async (input: string | string[]) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    const parts = Array.isArray(input) ? input : [input];
    
    // Initial thinking state
    setIsThinking(true);
    setMsg("🤔 Thinking...");
    await new Promise(r => setTimeout(r, 800));
    setIsThinking(false);

    try {
      for (const part of parts) {
        await speakPromise(part);
      }
    } finally {
      setIsSpeaking(false);
      setMsg("");
      if (videoRef.current) {
        videoRef.current.loop = false;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [speakPromise]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsThinking(false);
    setMsg("");
    if (videoRef.current) {
      videoRef.current.loop = false;
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Listen for global "tutor-speak" / "tutor-stop" events
  useEffect(() => {
    const handleSpeakEvent = (e: any) => {
      if (e.detail?.text) {
        if (e.detail.thinking) {
          setIsThinking(true);
          setMsg("🤔 Thinking...");
        }
        speak(e.detail.text);
      }
    };
    const handleStopEvent = () => stop();

    window.addEventListener("tutor-speak", handleSpeakEvent);
    window.addEventListener("tutor-stop", handleStopEvent);
    
    return () => {
      window.removeEventListener("tutor-speak", handleSpeakEvent);
      window.removeEventListener("tutor-stop", handleStopEvent);
    };
  }, [speak, stop]);

  // 🏛️ RENDER SETTINGS PANEL
  const renderSettings = () => (
    <div className="absolute bottom-full left-0 mb-4 w-[320px] bg-white border-4 border-black p-4 shadow-[8px_8px_0_#0D0D0D] z-[110]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black uppercase text-xs tracking-widest">Voice Engine Settings</h3>
        <button onClick={() => setShowSettings(false)} className="hover:rotate-90 transition-transform">
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-1">Select Persona Voice</label>
          <select 
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const v = voices.find(v => v.name === e.target.value);
              if (v) setSelectedVoice(v);
            }}
            className="w-full border-2 border-black p-2 text-xs font-bold focus:bg-yellow-100"
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang}) {v.name.includes("Natural") ? "✨" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase mb-1">Rate ({rate})</label>
            <input type="range" min="0.5" max="1.5" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 border border-black appearance-none cursor-pointer" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase mb-1">Pitch ({pitch})</label>
            <input type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 border border-black appearance-none cursor-pointer" />
          </div>
        </div>

        <button 
          onClick={() => speak("This is a preview of the selected voice engine. Does it sound smooth to you?")}
          className="w-full py-2 bg-[#FFD60A] border-2 border-black font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-[0px] transition-all shadow-[4px_4px_0_#0D0D0D]"
        >
          <Play size={12} fill="currentColor" /> Test Current Setting
        </button>
      </div>
    </div>
  );

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-10 left-10 w-16 h-16 bg-[#FFD60A] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center z-[100] animate-in bounce-in"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start select-none">
      {/* Voice Settings Panel */}
      {showSettings && renderSettings()}

      {/* Subtitles */}
      {(msg || isThinking) && (
        <div className="mb-4 max-w-[320px] px-6 py-4 bg-black text-white text-sm font-black border-4 border-white shadow-[8px_8px_0_#AF52DE] text-center animate-in fade-in slide-in-from-bottom-4">
           {msg}
        </div>
      )}

      {/* Tutor Frame */}
      <div className="flex flex-col items-center group relative">
        <div className="border-4 border-black p-2 bg-white shadow-[12px_12px_0px_#000] relative">
          <div className="absolute -top-3 -right-3 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 bg-[#FFD60A] border-2 border-black hover:bg-yellow-400">
              <Settings size={14} />
            </button>
            <button onClick={() => setIsVisible(false)} className="p-1.5 bg-white border-2 border-black hover:bg-gray-100">
              <X size={14} />
            </button>
          </div>

          <div className="w-64 h-64 bg-gray-200 overflow-hidden flex items-center justify-center relative">
             <video
               ref={videoRef}
               src="/avatar/talking.mp4"
               loop={true}
               muted
               playsInline
               preload="auto"
               className={`w-full h-full object-cover transition-all duration-300 ${
                 isSpeaking ? "scale-105" : "scale-100"
               } ${!isActivated ? "grayscale opacity-50" : ""}`}
             />

             {!isActivated && (
               <div className="absolute inset-0 bg-white/20 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-[#AF52DE]/10 to-[#FFD60A]/10">
                  <div className="mb-3 p-3 bg-[#FFD60A] border-4 border-black animate-bounce shadow-[4px_4px_0_#0D0D0D]">
                     <Sparkles size={32} />
                  </div>
                  <button 
                    onClick={() => { 
                      const welcome = [
                        "Namaste! I am your AI Learning Assistant from 4Byte.",
                        "I will guide you through your mistakes, explain core concepts, and provide personalized mnemonics.",
                        "Just click the button on your dashboard to start a lesson!"
                      ];
                      setIsActivated(true); 
                      speak(welcome); 
                    }}
                    className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest border-4 border-white shadow-[6px_6px_0_#0D0D0D] active:scale-95 transition-all"
                  >
                    Enable AI Tutor
                  </button>
               </div>
             )}

             {isThinking && (
               <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full animate-ping mx-1" />
                  <div className="w-2 h-2 bg-black rounded-full animate-ping mx-1 [animation-delay:200ms]" />
                  <div className="w-2 h-2 bg-black rounded-full animate-ping mx-1 [animation-delay:400ms]" />
               </div>
             )}
          </div>

          <div 
            className={`mt-3 text-sm px-3 py-1 border-2 border-black font-black uppercase tracking-widest text-center transition-all ${
              isSpeaking ? "bg-green-400" : isThinking ? "bg-[#FFD60A]" : isActivated ? "bg-[#AF52DE] text-white" : "bg-gray-100 opacity-50"
            }`}
          >
            {!isActivated ? "Locked" : isSpeaking ? "🗣️ Speaking..." : isThinking ? "🧠 Thinking..." : `✨ ${selectedVoice?.name?.split(' ')[0] || "Online"}`}
          </div>
        </div>

        {isActivated && (
           <button 
             onClick={() => setIsMuted(!isMuted)} 
             className="absolute -right-6 top-12 p-2 bg-white border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-1 transition-transform"
           >
             {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
           </button>
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
