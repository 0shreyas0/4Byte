'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useAgentVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      setBrowserSupported(true);
    }
  }, []);

  const handleTextToSpeech = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleListen = useCallback(() => {
    if (!browserSupported) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      toast.success(`Heard: "${transcript}"`);
      
      if (transcript.toLowerCase().includes('help')) {
        handleTextToSpeech("I am your AI agent. I can help you with research, extraction, and more.");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition failed.");
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [browserSupported, handleTextToSpeech]);

  return {
    isListening,
    browserSupported,
    handleListen,
    handleTextToSpeech
  };
};
