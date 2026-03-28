'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/fetcher';
import { toast } from 'sonner';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { Message, MediaRequestType } from '../types';

export const useAIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI assistant. I can chat, generate images, and export files for you. What's on your mind?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [fileContext, setFileContext] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = useCallback((text: string, force: boolean = false, index: number | null = null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (index !== null && speakingMessageIndex === index && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeakingMessageIndex(null);
      return;
    }

    if (isMuted && !force) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    
    utterance.onstart = () => {
      if (index !== null) setSpeakingMessageIndex(index);
    };
    
    utterance.onend = () => {
      setSpeakingMessageIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [isMuted, speakingMessageIndex]);

  const generateImage = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setMessages(prev => [...prev, { role: 'user', content: `Generate image: ${prompt}` }]);
    setIsGeneratingMedia(true);
    setIsLoading(true);

    try {
      const response = await api.post<{ imageUrl: string }>('/api/image', { prompt });
      setMessages(prev => [...prev, { role: 'image', content: response.imageUrl }]);
      toast.success("Image generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGeneratingMedia(false);
      setIsLoading(false);
    }
  }, []);

  const generateVideo = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setMessages(prev => [...prev, { role: 'user', content: `Generate video: ${prompt}` }]);
    setIsGeneratingMedia(true);
    setIsLoading(true);

    try {
      const response = await api.post<{ videoUrl: string }>('/api/video', { prompt });
      setMessages(prev => [...prev, { role: 'video', content: response.videoUrl }]);
      toast.success("Video generation started!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate video");
    } finally {
      setIsGeneratingMedia(false);
      setIsLoading(false);
    }
  }, []);

  const handleSend = useCallback(async (text?: string, forceType?: MediaRequestType) => {
    const rawMessage = text || input.trim();
    
    const isImageRequest = forceType === 'image' || 
                        rawMessage.toLowerCase().startsWith('/image') ||
                        rawMessage.toLowerCase().startsWith('generate image') ||
                        rawMessage.toLowerCase().startsWith('draw');
    
    const isVideoRequest = forceType === 'video' ||
                        rawMessage.toLowerCase().startsWith('/video') ||
                        rawMessage.toLowerCase().startsWith('generate video') ||
                        rawMessage.toLowerCase().startsWith('make a video');

    if (!rawMessage && !isImageRequest && !isVideoRequest) return;
    if (isLoading) return;

    setInput('');
    setShowTools(false);

    if (isVideoRequest) {
      let videoPrompt = rawMessage
        .replace(/^\/video\s*/i, '')
        .replace(/^generate video\b\s*/i, '')
        .replace(/^make a video\b\s*/i, '')
        .trim();
      
      if (!videoPrompt) {
        toast.error("Please provide a description for the video!");
        return;
      }
      await generateVideo(videoPrompt);
      return;
    }

    if (isImageRequest) {
      let imagePrompt = rawMessage
        .replace(/^\/image\s*/i, '')
        .replace(/^generate image\b\s*/i, '')
        .replace(/^generate an image\b\s*/i, '')
        .replace(/^draw\b\s*/i, '')
        .trim();
      
      if (!imagePrompt) {
        toast.error("Please provide a description for the image!");
        return;
      }
      
      await generateImage(imagePrompt);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: rawMessage }]);
    setIsLoading(true);

    try {
      let promptWithContext = rawMessage;
      if (fileContext) {
        promptWithContext = `CONTEXT FROM UPLOADED FILE (${fileName}):\n${fileContext.substring(0, 8000)}\n\nUSER QUESTION: ${rawMessage}`;
      }

      const response = await api.post<{ message: string }>('/api/chat', {
        prompt: promptWithContext,
        history: messages.filter(m => m.role !== 'image' && m.role !== 'video').slice(-5)
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
      speak(response.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, fileContext, fileName, messages, speak, generateImage, generateVideo]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error("Currently only PDF files are supported");
      return;
    }

    setIsParsing(true);
    setFileName(file.name);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/pdf', { method: 'POST', body: formData });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to parse");
        setFileContext(data.text);
        toast.success(`${file.name} context linked!`);
      } else {
        const text = await response.text();
        throw new Error(`Server error (${response.status}).`);
      }
    } catch (error: any) {
      toast.error(error.message);
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const exportToPDF = (text: string) => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save("ai-export.pdf");
    toast.success("PDF Downloaded");
  };

  const exportToDocx = async (text: string) => {
    const doc = new Document({
      sections: [{
        children: [new Paragraph({ children: [new TextRun(text)] })],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-export.docx");
    toast.success("DOCX Downloaded");
  };

  const exportToTxt = (text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "ai-export.txt");
    toast.success("TXT Downloaded");
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return {
    input,
    setInput,
    messages,
    setMessages,
    isLoading,
    isParsing,
    isGeneratingMedia,
    isListening,
    fileContext,
    setFileContext,
    fileName,
    setFileName,
    showTools,
    setShowTools,
    isMuted,
    setIsMuted,
    speakingMessageIndex,
    scrollRef,
    handleSend,
    handleFileUpload,
    exportToPDF,
    exportToDocx,
    exportToTxt,
    startListening,
    speak
  };
};
