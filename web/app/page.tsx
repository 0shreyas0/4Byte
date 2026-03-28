"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar, { Screen } from "@/components/edtech/Navbar";
import LandingScreen from "@/components/edtech/LandingScreen";
import DomainSelection from "@/components/edtech/DomainSelection";
import LoginScreen from "@/components/edtech/LoginScreen";
import ModeSelection, { QuizMode } from "@/components/edtech/ModeSelection";
import LearningTimeline from "@/components/edtech/LearningTimeline";
import LearningConcept from "@/components/edtech/LearningConcept";
import QuizScreen from "@/components/edtech/QuizScreen";
import CodingLabScreen from "@/components/edtech/CodingLabScreen";
import AIProcessingScreen from "@/components/edtech/AIProcessingScreen";
import MainDashboard from "@/components/edtech/MainDashboard";
import SimulationMode from "@/components/edtech/SimulationMode";
import SandboxIDE, { LearningMode } from "@/components/edtech/SandboxIDE";

import WebPlayground from "@/components/edtech/WebPlayground";

import { useAuth } from "@/lib/AuthContext";

import { analyzePerformanceAsync, AnalysisResult, TopicScore, QuestionResult } from "@/lib/edtech/conceptGraph";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [domain, setDomain] = useState<string>("DSA");
  const [quizMode, setQuizMode] = useState<QuizMode>("mcq");
  const [mode, setMode] = useState<LearningMode>("beginner");
  const [scores, setScores] = useState<Record<string, TopicScore>>({});
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const { user } = useAuth();

  // Linear Step-by-Step Navigation
  const navigate = useCallback((next: Screen) => {
    window.history.pushState({ screen: next }, "", `#${next}`);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // History entry and back-support
  useEffect(() => {
    window.history.replaceState({ screen: "landing" }, "", "#landing");
    const onPop = (e: PopStateEvent) => {
      const s: Screen = (e.state?.screen as Screen) ?? "landing";
      setScreen(s);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Handlers for Linear Flow
  const handleDomainSelect = useCallback((d: string) => {
    setDomain(d);
    
    // Auth Check
    if (!user) {
      navigate("auth");
      return;
    }

    // Non-coding-capable domains go straight to timeline
    const CODING_DOMAINS = ["DSA", "Web Dev", "Python", "App Dev"];
    if (CODING_DOMAINS.includes(d)) {
      navigate("mode-select");
    } else {
      setQuizMode("mcq");
      navigate("timeline");
    }
  }, [navigate, user]);

  const handleModeSelect = useCallback((m: QuizMode) => {
    setQuizMode(m);
    // Map quiz mode to IDE difficulty mode
    setMode(m === "coding" ? "revision" : "beginner");
    navigate("timeline"); // 100% Linear
  }, [navigate]);

  const handleTimelineStart = useCallback(() => {
    navigate("learning-concept");
  }, [navigate]);

  const handleConceptComplete = useCallback(() => {
    if (quizMode === "coding") {
      navigate("coding-lab");
    } else {
      navigate("quiz");
    }
  }, [quizMode, navigate]);

  const handleQuizComplete = useCallback((quizScores: Record<string, TopicScore>, rawResults: QuestionResult[]) => {
    setScores(quizScores);
    setResults(rawResults);
    navigate("processing");
  }, [navigate]);

  const handleProcessingComplete = useCallback(async () => {
    const result = await analyzePerformanceAsync(scores, domain, results);
    setAnalysis(result);
    navigate("results");
  }, [scores, domain, results, navigate]);

  const handleRestart = useCallback(() => {
    setScores({});
    setResults([]);
    setAnalysis(null);
    navigate("landing");
  }, [navigate]);

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
        onNavigate={navigate}
        onRestart={handleRestart}
        onGetStarted={() => navigate("auth")}
      />

      <main>
        {screen === "landing" && (
          <LandingScreen onStart={() => navigate("domain-select")} />
        )}

        {screen === "auth" && (
          <LoginScreen 
            onLogin={() => navigate("mode-select")} 
            onGetStarted={() => navigate("domain-select")} 
          />
        )}

        {screen === "domain-select" && (
          <DomainSelection
            onSelect={handleDomainSelect}
            onBack={() => navigate("landing")}
          />
        )}

        {screen === "mode-select" && (
          <ModeSelection
            domain={domain}
            onSelect={handleModeSelect}
            onBack={() => navigate("domain-select")}
          />
        )}

        {screen === "timeline" && (
          <LearningTimeline
            domain={domain}
            onStart={handleTimelineStart}
            onBack={() => navigate("mode-select")}
          />
        )}

        {screen === "learning-concept" && (
          <LearningConcept
            domain={domain}
            onComplete={handleConceptComplete}
            onBack={() => navigate("timeline")}
          />
        )}

        {screen === "quiz" && (
          <QuizScreen
            domain={domain}
            onComplete={handleQuizComplete}
            onBack={() => navigate("learning-concept")}
          />
        )}

        {screen === "coding-lab" && (
          <CodingLabScreen
            domain={domain}
            onComplete={handleQuizComplete}
            onBack={() => navigate("learning-concept")}
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
            onSimulate={() => navigate("simulation")}
            onPractice={() => navigate(domain === "Web Dev" ? "web-sandbox" : "sandbox")}
            onRestart={handleRestart}
          />
        )}

        {screen === "simulation" && analysis && (
          <SimulationMode
            domain={domain}
            originalScores={scores}
            originalAnalysis={analysis}
            onBack={() => navigate("results")}
            onPractice={() => navigate("coding-lab")}
          />
        )}

        {screen === "sandbox" && (
          <SandboxIDE
            domain={domain}
            mode={mode}
            onExit={() => navigate("simulation")}
          />
        )}

        {screen === "web-sandbox" && (
          <WebPlayground
            mode={mode}
            onExit={() => navigate("simulation")}
          />
        )}
      </main>
    </div>
  );
}
