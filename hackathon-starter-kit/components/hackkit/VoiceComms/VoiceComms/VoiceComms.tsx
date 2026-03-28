"use client";

import { useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Signal,
  Volume2,
  ShieldCheck,
  Headphones,
  AlertCircle,
  Wifi,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/ui/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceComms } from "@/lib/hooks/useVoiceComms";
import { PeerAudioPlayer } from "./PeerAudioPlayer";
import { Button } from "@/ui/components/Button";

interface VoiceCommsProps {
  caseId: string;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onActiveChange?: (active: boolean) => void;
}

export const VoiceComms: React.FC<VoiceCommsProps> = ({ caseId, currentUser, onActiveChange }) => {
    const {
        isActive,
        isMuted,
        error,
        peers,
        activeSpeakers,
        networkQuality,
        joinChannel,
        leaveChannel,
        toggleMute,
        sessionId,
        resumeAudio
    } = useVoiceComms(caseId, currentUser, onActiveChange);

    const [isSecure, setIsSecure] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsSecure(window.isSecureContext);
        }
    }, []);

    const peerList = Object.entries(peers);
    const totalConnected = peerList.filter(([, p]) => p.state === "connected").length;

    const networkBadge = ({
        unknown: { color: "amber", label: "PROBING ROUTE" },
        good: { color: "emerald", label: "DIRECT P2P" },
        relay: { color: "blue", label: "TURN RELAY" },
        poor: { color: "red", label: "POOR SIGNAL" },
    }[networkQuality] || { color: "amber", label: "PROBING ROUTE" });

    return (
        <div className="bg-card/40 border border-primary/20 rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden shadow-lg w-full">
            <div className="absolute inset-0 bg-size-[20px_20px] bg-[linear-gradient(var(--primary)_0.5px,transparent_0.5px),linear-gradient(90deg,var(--primary)_0.5px,transparent_0.5px)] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none opacity-5" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isActive ? "bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] ring-1 ring-primary/50" : "bg-white/5 border border-white/10"
                        )}
                    >
                        {isActive ? (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Headphones size={22} className="text-white" />
                            </motion.div>
                        ) : (
                            <Users size={22} className="text-slate-500" />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[0.15em]">Comms Channel</h4>
                            <div
                                className={cn(
                                    "px-1.5 py-0.5 rounded flex items-center gap-1 border",
                                    isSecure ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
                                )}
                            >
                                <div className={cn("w-1 h-1 rounded-full", isSecure ? "bg-emerald-400" : "bg-amber-400")} />
                                <span className={cn("text-[7px] font-black uppercase tracking-tighter", isSecure ? "text-emerald-400" : "text-amber-400")}>
                                    {isSecure ? "Secure" : "Insecure"}
                                </span>
                            </div>
                            {isActive && (
                                <div
                                    className={cn(
                                        "px-1.5 py-0.5 rounded flex items-center gap-1 border",
                                        networkQuality === "good" ? "bg-emerald-500/10 border-emerald-500/20" : networkQuality === "relay" ? "bg-blue-500/10 border-blue-500/20" : "bg-amber-500/10 border-amber-500/20"
                                    )}
                                >
                                    {networkQuality === "good" ? <Wifi size={7} className="text-emerald-400" /> : <Signal size={7} className="text-amber-400" />}
                                    <span className={cn("text-[7px] font-black uppercase tracking-tighter", networkQuality === "good" ? "text-emerald-400" : networkQuality === "relay" ? "text-blue-400" : "text-amber-400")}>
                                        {networkBadge.label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-0.5">
                            {isActive ? (
                                <>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map((i) => (
                                            <motion.div key={i} animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-0.5 bg-primary/60" />
                                        ))}
                                    </div>
                                    {totalConnected + 1} Operative{totalConnected + 1 !== 1 ? "s" : ""} Linked
                                </>
                            ) : "Encryption Layer Offline"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isActive ? (
                        <Button
                            onClick={joinChannel}
                            disabled={!currentUser.id}
                            className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 border-primary/30"
                        >
                            {!currentUser.id ? "Identity Missing" : "Establish Link"}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 shadow-inner">
                            <button
                                onClick={toggleMute}
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                    isMuted ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "hover:bg-white/10 text-slate-400 hover:text-white"
                                )}
                                title={isMuted ? "Unmute Mic" : "Mute Mic"}
                            >
                                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                            
                            <button
                                onClick={() => {
                                    const audioTags = document.querySelectorAll('audio');
                                    audioTags.forEach(tag => tag.play().catch(()=>{}));
                                    resumeAudio();
                                }}
                                className="w-10 h-10 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                                title="Force Audio Resume (Click if you can't hear)"
                            >
                                <RefreshCw size={18} className={isActive ? "animate-spin" : ""} />
                            </button>

                            <div className="w-px h-6 bg-white/10 mx-1" />

                            <button
                                onClick={leaveChannel}
                                className="w-10 h-10 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all border border-red-600/20"
                                title="Disconnect"
                            >
                                <PhoneOff size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>
                    </motion.div>
                )}

                {isActive && (
                    <motion.div initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: "auto", opacity: 1, marginTop: 24 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} className="flex flex-wrap gap-4 overflow-hidden">
                        <div className="flex flex-col items-center gap-2 group/user">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl border flex items-center justify-center relative transition-all duration-300", 
                                activeSpeakers[`${currentUser.id}:${sessionId}`] 
                                    ? "border-primary ring-4 ring-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] bg-primary/20 scale-105" 
                                    : "border-white/10 bg-white/5", 
                                isMuted && "opacity-40 grayscale"
                            )}>
                                {/* Pulsing Ring */}
                                {activeSpeakers[`${currentUser.id}:${sessionId}`] && !isMuted && (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 1.4, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 rounded-2xl border-2 border-primary"
                                    />
                                )}

                                <div className="text-[12px] font-black text-white uppercase">{currentUser.name.substring(0, 2)}</div>
                                
                                {activeSpeakers[`${currentUser.id}:${sessionId}`] && !isMuted && (
                                    <div className="absolute -bottom-1 -right-1 flex gap-0.5 p-1.5 bg-primary rounded-lg border-2 border-card shadow-lg">
                                        {[0, 100, 200].map((d) => (
                                            <motion.div 
                                                key={d} 
                                                animate={{ height: [4, 12, 4] }} 
                                                transition={{ repeat: Infinity, duration: 0.6, delay: d / 1000 }} 
                                                className="w-1 bg-white rounded-full" 
                                            />
                                        ))}
                                    </div>
                                )}
                                {isMuted && <MicOff size={12} className="absolute -top-1 -right-1 text-white bg-destructive rounded-full p-1 border-2 border-card" />}
                            </div>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-[0.2em] transition-colors",
                                activeSpeakers[`${currentUser.id}:${sessionId}`] ? "text-primary" : "text-slate-500"
                            )}>You</span>
                        </div>

                        {peerList.map(([peerKey, peer]) => (
                            <div key={peerKey} className="flex flex-col items-center gap-2 group/peer">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl border flex items-center justify-center relative transition-all duration-300 shadow-lg", 
                                    peer.state === "failed" ? "border-red-500/50 bg-red-500/5" : 
                                    peer.state === "connecting" ? "border-amber-500/50 bg-amber-500/5" : 
                                    activeSpeakers[peerKey] ? "border-emerald-500 ring-4 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-500/20 scale-105" : 
                                    "border-white/10 bg-white/5"
                                )}>
                                    {/* Pulsing Ring for Remote */}
                                    {activeSpeakers[peerKey] && peer.state === "connected" && (
                                        <motion.div 
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ scale: 1.4, opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 rounded-2xl border-2 border-emerald-500"
                                        />
                                    )}

                                    <div className="text-[12px] font-black text-white uppercase">{peer.userName.substring(0, 2)}</div>
                                    <PeerAudioPlayer stream={peer.stream} peerKey={peerKey} />
                                    
                                    {peer.state === "connecting" && (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="absolute -top-1 -right-1 bg-card rounded-full p-1 border border-amber-500/30">
                                            <RefreshCw size={8} className="text-amber-400" />
                                        </motion.div>
                                    )}
                                    
                                    {peer.state === "connected" && activeSpeakers[peerKey] && (
                                        <div className="absolute -bottom-1 -right-1 flex gap-0.5 p-1.5 bg-emerald-500 rounded-lg border-2 border-card shadow-lg">
                                            {[0, 100, 200].map((d) => (
                                                <motion.div 
                                                    key={d} 
                                                    animate={{ height: [4, 12, 4] }} 
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: d / 1000 }} 
                                                    className="w-1 bg-white rounded-full" 
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-[0.2em] max-w-[56px] truncate text-center transition-colors",
                                    activeSpeakers[peerKey] ? "text-emerald-500" : "text-slate-500"
                                )}>{peer.userName}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">DTLS-SRTP Encrypted</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                        <Signal size={12} className="text-primary" />
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">STUN + TURN Mesh</span>
                    </div>
                </div>
                {isActive && (
                    <div className="flex items-center gap-2">
                        <Volume2 size={10} className="text-primary/60" />
                        <span className="text-[8px] font-bold text-muted-foreground/60 uppercase tabular-nums">CROSS_NET_READY</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VoiceComms;
