"use client";

import { useState, useCallback } from "react";
import LandingScreen from "@/components/edtech/LandingScreen";
import DomainSelection from "@/components/edtech/DomainSelection";
import LearningTimeline from "@/components/edtech/LearningTimeline";
import QuizScreen from "@/components/edtech/QuizScreen";
import AIProcessingScreen from "@/components/edtech/AIProcessingScreen";
import ResultsDashboard from "@/components/edtech/ResultsDashboard";
import SimulationMode from "@/components/edtech/SimulationMode";
import { analyzePerformance, AnalysisResult, TopicScore } from "@/lib/edtech/conceptGraph";

type Screen =
  | "landing"
  | "domain-select"
  | "timeline"
  | "quiz"
  | "processing"
  | "results"
  | "simulation";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [domain, setDomain] = useState<string>("DSA");
  const [scores, setScores] = useState<Record<string, TopicScore>>({});
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleDomainSelect = useCallback((d: string) => {
    setDomain(d);
    setScreen("timeline");
  }, []);

  const handleQuizComplete = useCallback(
    (quizScores: Record<string, TopicScore>) => {
      setScores(quizScores);
      setScreen("processing");
    },
    []
  );

  const handleProcessingComplete = useCallback(() => {
    const result = analyzePerformance(scores, domain);
    setAnalysis(result);
    setScreen("results");
  }, [scores, domain]);

  const handleRestart = useCallback(() => {
    setScores({});
    setAnalysis(null);
    setScreen("landing");
  }, []);

  return (
    <main>
      {screen === "landing" && (
        <LandingScreen onStart={() => setScreen("domain-select")} />
      )}

      {screen === "domain-select" && (
        <DomainSelection
          onSelect={handleDomainSelect}
          onBack={() => setScreen("landing")}
        />
      )}

      {screen === "timeline" && (
        <LearningTimeline
          domain={domain}
          onStart={() => setScreen("quiz")}
          onBack={() => setScreen("domain-select")}
        />
      )}

      {screen === "quiz" && (
        <QuizScreen
          domain={domain}
          onComplete={handleQuizComplete}
          onBack={() => setScreen("timeline")}
        />
      )}

      {screen === "processing" && (
        <AIProcessingScreen onComplete={handleProcessingComplete} />
      )}

      {screen === "results" && analysis && (
        <ResultsDashboard
          domain={domain}
          scores={scores}
          analysis={analysis}
          onSimulate={() => setScreen("simulation")}
          onRestart={handleRestart}
        />
      )}

      {screen === "simulation" && analysis && (
        <SimulationMode
          domain={domain}
          originalScores={scores}
          originalAnalysis={analysis}
          onBack={() => setScreen("results")}
        />
      )}
    </main>
  );
}
