"use client";

import React from 'react';
import { useAIChat } from './hooks/useAIChat';
import { FileIndicator } from './FileIndicator';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const AIChat: React.FC = () => {
  const {
    input,
    setInput,
    messages,
    isLoading,
    isParsing,
    isGeneratingMedia,
    isListening,
    fileName,
    setFileContext,
    setFileName,
    showTools,
    setShowTools,
    speakingMessageIndex,
    scrollRef,
    handleSend,
    handleFileUpload,
    exportToPDF,
    exportToDocx,
    exportToTxt,
    startListening,
    speak
  } = useAIChat();

  return (
    <div className="flex flex-col h-[500px] w-full bg-background/50 rounded-2xl overflow-hidden border border-border/50 shadow-inner">
      <FileIndicator 
        fileName={fileName} 
        onClear={() => { setFileContext(null); setFileName(null); }} 
      />

      <MessageList 
        messages={messages}
        isLoading={isLoading}
        isGeneratingMedia={isGeneratingMedia}
        speakingMessageIndex={speakingMessageIndex}
        scrollRef={scrollRef}
        onSend={handleSend}
        onSpeak={speak}
        onExportPDF={exportToPDF}
        onExportDocx={exportToDocx}
        onExportTxt={exportToTxt}
      />

      <ChatInput 
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isParsing={isParsing}
        isListening={isListening}
        showTools={showTools}
        setShowTools={setShowTools}
        onSend={handleSend}
        onFileUpload={handleFileUpload}
        onStartListening={startListening}
      />
    </div>
  );
};
