"use client";

import React from 'react';
import { useAIDemo } from './hooks/useAIDemo';
import { AIDemoForm } from './components/AIDemoForm';
import { AIDemoResponse } from './components/AIDemoResponse';

export const AIDemo: React.FC = () => {
  const {
    prompt,
    setPrompt,
    response,
    loading,
    handleTest
  } = useAIDemo();

  return (
    <div className="space-y-4">
      <AIDemoForm 
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleTest}
        loading={loading}
      />
      
      <AIDemoResponse response={response} />
      
      {!response && !loading && (
        <p className="text-2xs text-muted-foreground italic px-1">
          Try: "Write a tagline for a fitness app"
        </p>
      )}
    </div>
  );
};
