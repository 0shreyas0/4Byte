'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api/fetcher';
import { toast } from 'sonner';

export const usePDFProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [query, setQuery] = useState("Summarize this document");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedText("");
      setResult("");
    }
  }, []);

  const parsePDF = useCallback(async () => {
    if (!file) return;

    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to parse");

      setExtractedText(data.text);
      toast.success("PDF Parsed successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsParsing(false);
    }
  }, [file]);

  const analyzeWithAgent = useCallback(async () => {
    if (!extractedText) return;

    setIsAnalyzing(true);
    try {
      const response = await api.post<{ message: string }>('/api/chat', {
        prompt: `DOCUMENT TEXT: ${extractedText.substring(0, 8000)}\n\nQUERY: ${query}\n\nAct as a Document Auditor and answer the query based on the text provided.`,
      });

      setResult(response.message);
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error("Agent failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  }, [extractedText, query]);

  return {
    file,
    isParsing,
    extractedText,
    query,
    setQuery,
    isAnalyzing,
    result,
    handleFileChange,
    parsePDF,
    analyzeWithAgent
  };
};
