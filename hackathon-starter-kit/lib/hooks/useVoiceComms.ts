"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

const JOIN_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";
const LEAVE_SOUND = "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3";

export function useVoiceComms(caseId: string, currentUser: any, onActiveChange?: (active: boolean) => void) {
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [peers, setPeers] = useState<Record<string, any>>({});
    const [activeSpeakers, setActiveSpeakers] = useState<Record<string, boolean>>({});
    const [networkQuality, setNetworkQuality] = useState<'unknown' | 'good' | 'relay' | 'poor'>('unknown');
    
    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
    const channelRef = useRef<any>(null);
    const sessionId = useRef(Math.random().toString(36).substring(7)).current;
    const mounted = useRef(true);

    const playSound = (url: string) => {
        const audio = new Audio(url);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    };

    const cleanupPeer = useCallback((id: string) => {
        if (peerConnections.current[id]) {
            peerConnections.current[id].close();
            delete peerConnections.current[id];
        }
        setPeers(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setActiveSpeakers(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }
        return audioContextRef.current;
    }, []);

    const resumeAudio = useCallback(async () => {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            await ctx.resume();
        }
    }, [getAudioContext]);

    const setupSpeakerAnalysis = useCallback((peerId: string, stream: MediaStream) => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            
            // Ensure context is running
            if (ctx.state === 'suspended') ctx.resume();

            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkVolume = () => {
                if (!mounted.current) return;
                
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
                const average = sum / bufferLength;
                
                setActiveSpeakers(prev => {
                    const isSpeaking = average > 5; // Lowered threshold for better sensitivity
                    if (prev[peerId] === isSpeaking) return prev;
                    return { ...prev, [peerId]: isSpeaking };
                });
                
                // Keep monitoring if peer exists or is local session
                if (peerConnections.current[peerId] || peerId.includes(sessionId)) {
                    requestAnimationFrame(checkVolume);
                } else {
                    source.disconnect();
                    analyser.disconnect();
                }
            };
            checkVolume();
        } catch (e) {
            console.warn("Speaker analysis failed", e);
        }
    }, [getAudioContext, sessionId]);

    const createPeerConnection = useCallback((peerId: string, userName: string) => {
        if (peerConnections.current[peerId]) return peerConnections.current[peerId];

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
            ],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && channelRef.current) {
                channelRef.current.send({
                    type: "broadcast",
                    event: "candidate",
                    payload: { target: peerId, from: sessionId, candidate: event.candidate },
                });
            }
        };

        pc.ontrack = (event) => {
            setPeers(prev => ({
                ...prev,
                [peerId]: {
                    ...prev[peerId],
                    userName,
                    state: 'connected',
                    stream: event.streams[0],
                },
            }));
            setupSpeakerAnalysis(peerId, event.streams[0]);
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                cleanupPeer(peerId);
            }
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!);
            });
        }

        peerConnections.current[peerId] = pc;
        return pc;
    }, [sessionId, cleanupPeer]);

    const initiateCall = async (peerId: string, userName: string) => {
        const pc = createPeerConnection(peerId, userName);
        if (!pc) return;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        channelRef.current.send({
            type: "broadcast",
            event: "offer",
            payload: { target: peerId, from: sessionId, offer, userName: currentUser.name },
        });
    };

    const joinChannel = async () => {
        if (!supabase || !currentUser) return;
        setError(null);
        
        try {
            await resumeAudio();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = stream;
            setIsActive(true);
            setNetworkQuality('good');
            onActiveChange?.(true);
            playSound(JOIN_SOUND);
            
            setupSpeakerAnalysis(`${currentUser.id}:${sessionId}`, stream);

            const channel = supabase.channel(`voice:${caseId}`, {
                config: {
                    presence: { key: sessionId },
                },
            });

            channelRef.current = channel;

            channel
                .on("presence", { event: "sync" }, () => {
                    const state = channel.presenceState();
                    Object.keys(state).forEach(id => {
                        if (id !== sessionId && !peerConnections.current[id]) {
                            const presence = state[id][0] as any;
                            initiateCall(id, presence.name || "Peer");
                        }
                    });
                })
                .on("presence", { event: "join" }, ({ key, newPresences }) => {
                    if (key !== sessionId) {
                        playSound(JOIN_SOUND);
                        const presence = newPresences[0] as any;
                        initiateCall(key, presence.name || "Peer");
                    }
                })
                .on("presence", { event: "leave" }, ({ key }) => {
                    if (key !== sessionId) {
                        playSound(LEAVE_SOUND);
                        cleanupPeer(key);
                    }
                })
                .on("broadcast", { event: "offer" }, async ({ payload }) => {
                    if (payload.target === sessionId) {
                        const pc = createPeerConnection(payload.from, payload.userName);
                        if (!pc) return;
                        await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);

                        channelRef.current.send({
                            type: "broadcast",
                            event: "answer",
                            payload: { target: payload.from, from: sessionId, answer, userName: currentUser.name },
                        });
                    }
                })
                .on("broadcast", { event: "answer" }, async ({ payload }) => {
                    if (payload.target === sessionId) {
                        const pc = peerConnections.current[payload.from];
                        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
                    }
                })
                .on("broadcast", { event: "candidate" }, async ({ payload }) => {
                    if (payload.target === sessionId) {
                        const pc = peerConnections.current[payload.from];
                        if (pc) await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
                    }
                })
                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        await channel.track({
                            id: currentUser.id,
                            name: currentUser.name,
                            avatar: currentUser.avatar,
                            online_at: new Date().toISOString(),
                        });
                    }
                });

        } catch (err: any) {
            console.error("Mic access failed", err);
            setError("Microphone access denied. Please allow mic usage.");
            setIsActive(false);
            onActiveChange?.(false);
        }
    };

    const leaveChannel = useCallback(() => {
        if (!isActive) return;
        
        setIsActive(false);
        onActiveChange?.(false);
        playSound(LEAVE_SOUND);
        
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
            localStreamRef.current = null;
        }

        Object.values(peerConnections.current).forEach(pc => pc.close());
        peerConnections.current = {};

        if (channelRef.current) {
            channelRef.current.unsubscribe();
            channelRef.current = null;
        }

        setPeers({});
        setActiveSpeakers({});
    }, [isActive, onActiveChange]);

    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            leaveChannel();
        };
    }, []);

    return {
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
        getAudioContext,
        resumeAudio
    };
}
