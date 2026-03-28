"use client";

import { useState, useCallback } from "react";
import Navbar, { Screen } from "@/components/edtech/Navbar";
import LandingScreen from "@/components/edtech/LandingScreen";
import DomainSelection from "@/components/edtech/DomainSelection";
import ModeSelection, { LearningMode } from "@/components/edtech/ModeSelection"; // 🔥 Added
import LearningTimeline from "@/components/edtech/LearningTimeline";
import LearningConcept from "@/components/edtech/LearningConcept"; // 🔥 Added
import QuizScreen from "@/components/edtech/QuizScreen";
import AIProcessingScreen from "@/components/edtech/AIProcessingScreen";
import MainDashboard from "@/components/edtech/MainDashboard";
import SimulationMode from "@/components/edtech/SimulationMode";
import SandboxIDE from "@/components/edtech/SandboxIDE"; // 🔥 Added
import { analyzePerformanceAsync, AnalysisResult, TopicScore, QuestionResult } from "@/lib/edtech/conceptGraph";

// Screens that show the global navbar
const NAVBAR_SCREENS: Screen[] = [
  "landing",
  "domain-select",
  "mode-select",
  "timeline",
  "learning-concept", // 🔥 Sync
  "quiz",
  "processing",
  "results",
  "simulation",
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [domain, setDomain] = useState<string>("DSA");
  const [mode, setMode] = useState<LearningMode>("beginner"); // 🔥 Added: mode state
  const [scores, setScores] = useState<Record<string, TopicScore>>({});
  const [results, setResults] = useState<QuestionResult[]>([]); // 🔥 Added: raw results state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleDomainSelect = useCallback((d: string) => {
    setDomain(d);
    setScreen("mode-select"); // 🔥 Next step: Choose mode
  }, []);

  const handleModeSelect = useCallback((m: LearningMode) => {
    setMode(m);
    // Beginner Flow -> Start learning journey
    // Revision Flow -> Jump straight to testing
    if (m === "beginner") {
      setScreen("timeline");
    } else {
      setScreen("quiz");
    }
  }, []);

  const handleQuizComplete = useCallback(
    (quizScores: Record<string, TopicScore>, rawResults: QuestionResult[]) => {
      setScores(quizScores);
      setResults(rawResults); // 🔥 Now storing micro-gap data
      setScreen("processing");
    },
    []
  );

  const handleProcessingComplete = useCallback(async () => {
    // 🔥 New: Passing raw results to trigger mistake-driven analysis
    const result = await analyzePerformanceAsync(scores, domain, results);
    setAnalysis(result);
    setScreen("results");
  }, [scores, domain, results]);

  const handleRestart = useCallback(() => {
    setScores({});
    setAnalysis(null);
    setScreen("landing");
  }, []);

  // Navbar navigation — only allow jumping to screens that have been reached
  const handleNavNavigate = useCallback(
    (target: Screen) => {
      setScreen(target);
    },
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        backgroundImage: "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Global sticky navbar */}
      <Navbar
        screen={screen}
        domain={domain}
        onNavigate={handleNavNavigate}
        onRestart={handleRestart}
      />

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

        {screen === "mode-select" && (
          <ModeSelection
            domain={domain}
            onSelect={handleModeSelect}
            onBack={() => setScreen("domain-select")}
          />
        )}

        {screen === "timeline" && (
          <LearningTimeline
            domain={domain}
            onStart={() => {
              // Beginner Mode -> Goes to Concept first
              // Revision Mode -> (Already skips timeline)
              setScreen("learning-concept");
            }}
            onBack={() => setScreen("mode-select")}
          />
        )}

        {screen === "learning-concept" && (
          <LearningConcept
            domain={domain}
            onComplete={() => setScreen("quiz")}
            onBack={() => setScreen("mode-select")}
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
          <MainDashboard
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
            onPractice={() => setScreen("sandbox")}
          />
        )}

        {screen === "sandbox" && (
          <SandboxIDE 
            domain={domain}
            mode={mode}
            onExit={() => setScreen("simulation")}
          />
        )}
      </main>
    </div>
  );
}
