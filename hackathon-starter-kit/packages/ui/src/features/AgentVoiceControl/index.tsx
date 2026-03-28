"use client";

import React from 'react';
import { Button } from '../../components/Button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useAgentVoice } from './hooks/useAgentVoice';

/**
 * Premium Voice Navigation & Audio Output Component
 * Part of the "Elite Agent" library.
 */

export const AgentVoiceControl: React.FC = () => {
  const {
    isListening,
    handleListen,
    handleTextToSpeech
  } = useAgentVoice();

  return (
    <div className="flex gap-2 p-2 bg-muted/30 border border-border rounded-2xl backdrop-blur-sm">
      <Button
        variant={isListening ? "primary" : "outline"}
        size="sm"
        onClick={handleListen}
        className="rounded-xl flex items-center gap-2"
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">{isListening ? 'Listening' : 'Voice Command'}</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleTextToSpeech("Hello! I am ready to process your commands.")}
        className="rounded-xl"
      >
        <Volume2 size={16} />
      </Button>
    </div>
  );
};
