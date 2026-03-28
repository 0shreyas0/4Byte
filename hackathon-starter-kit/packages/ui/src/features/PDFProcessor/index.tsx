"use client";

import React from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FileText } from 'lucide-react';
import { usePDFProcessor } from './hooks/usePDFProcessor';
import { FileUpload } from './components/FileUpload';
import { QueryInput } from './components/QueryInput';
import { AnalysisResult } from './components/AnalysisResult';

export const PDFProcessor: React.FC = () => {
  const {
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
  } = usePDFProcessor();

  return (
    <Card className="p-4 bg-background/40 border-primary/10 shadow-lg space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm">PDF Processing Agent</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Elite Tooling</p>
        </div>
      </div>

      <div className="space-y-3">
        <FileUpload file={file} onFileChange={handleFileChange} />

        {file && !extractedText && (
          <Button 
            className="w-full rounded-xl" 
            onClick={parsePDF} 
            loading={isParsing}
            variant="primary"
          >
            Extract Text
          </Button>
        )}

        {extractedText && (
          <QueryInput 
            query={query}
            setQuery={setQuery}
            onAnalyze={analyzeWithAgent}
            isAnalyzing={isAnalyzing}
            extractedTextLength={extractedText.length}
          />
        )}

        <AnalysisResult result={result} />
      </div>
    </Card>
  );
};
