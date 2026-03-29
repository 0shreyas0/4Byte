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
import { AnalysisResponse as AIRagResponse } from "@/lib/rag";
import MainDashboard from "@/components/edtech/MainDashboard";
import SimulationMode from "@/components/edtech/SimulationMode";
import SandboxIDE, { LearningMode } from "@/components/edtech/SandboxIDE";
import WebPlayground from "@/components/edtech/WebPlayground";
import OnboardingSurvey from "@/components/edtech/OnboardingSurvey";
import UserProfilePage from "@/components/edtech/UserProfilePage";
import ResourceLibrary from "@/components/edtech/ResourceLibrary";
import Avatar from "@/components/edtech/Avatar";
import TextSelector from "@/components/edtech/TextSelector";
import { useAuth } from "@/lib/AuthContext";
import { analyzePerformanceAsync, AnalysisResult, TopicScore, QuestionResult, LearningPersona } from "@/lib/edtech/conceptGraph";
import { recordSession } from "@/lib/edtech/streakService";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [domain, setDomain] = useState<string>("DSA");
  const [quizMode, setQuizMode] = useState<QuizMode>("mcq");
  const [mode, setMode] = useState<LearningMode>("beginner");
  const [scores, setScores] = useState<Record<string, TopicScore>>({});
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [aiPersona, setAiPersona] = useState<LearningPersona>("ENGINEERING");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Whether we're waiting for the profile to load after a login event
  const [awaitingPostLogin, setAwaitingPostLogin] = useState(false);

  const { user, profile, profileLoading, refreshProfile } = useAuth();

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
      setSearchQuery(""); // clear search on navigation
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // After login: once profile finishes loading, route to onboarding or domain-select
  useEffect(() => {
    if (awaitingPostLogin && !profileLoading) {
      setAwaitingPostLogin(false);
      if (!profile?.onboardingComplete) {
        navigate("onboarding");
      } else {
        navigate("domain-select");
      }
    }
  }, [awaitingPostLogin, profileLoading, profile, navigate]);

  // Called by LoginScreen after successful auth
  const handlePostLogin = useCallback(() => {
    setAwaitingPostLogin(true);
  }, []);

  // Handlers for Linear Flow
  const handleDomainSelect = useCallback((d: string) => {
    setDomain(d);

    // Auth Check
    if (!user) {
      navigate("auth");
      return;
    }

    // Only engineering/professional levels have coding-capable domains
    const CODING_LEVELS = ["engineering", "professional"];
    const CODING_DOMAINS = ["DSA", "Web Dev", "Python", "App Dev", "IoT", "Cybersecurity", "Data Science", "CS-10", "CS-12"];
    const eduLevel = profile?.educationLevel || "engineering";

    if (CODING_LEVELS.includes(eduLevel) && CODING_DOMAINS.includes(d)) {
      navigate("mode-select");
    } else {
      setQuizMode("mcq");
      navigate("timeline");
    }
  }, [navigate, user, profile]);

  const handleModeSelect = useCallback((m: QuizMode, p: LearningPersona) => {
    setQuizMode(m);
    setAiPersona(p);
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

  const handleProcessingComplete = useCallback(async (aiResult: AIRagResponse | null) => {
    const result = await analyzePerformanceAsync(scores, domain, results, aiPersona);
    
    // Inject Ollama-generated summary if available
    if (aiResult) {
      result.explanation = [aiResult.summary, ...(aiResult.reasoning_chain || [])];
      result.detailedAiReport = aiResult.detailed_report;
    }

    setAnalysis(result);

    // Record the completed session → updates streak, totalSessions, activityLog, topicMastery & latestAnalysis
    if (user) {
      try {
        await recordSession(user.uid, domain, scores, result);
        await refreshProfile?.(); // pull fresh data so everything is in sync
      } catch (e) {
        console.error("Failed to record session:", e);
      }
    }
    navigate("results");
  }, [scores, domain, results, aiPersona, navigate, user, refreshProfile]);

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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={(s) => {
          setSearchQuery(""); // Clear search on explicit navigation
          navigate(s);
        }}
        onRestart={handleRestart}
        onGetStarted={() => navigate("auth")}
      />

      <main>
        {screen === "landing" && (
          <LandingScreen onStart={(p) => { setAiPersona(p); navigate("domain-select"); }} />
        )}

        {screen === "auth" && (
          <LoginScreen
            onLogin={handlePostLogin}
            onGetStarted={() => navigate("domain-select")}
          />
        )}

        {screen === "onboarding" && (
          <OnboardingSurvey onComplete={() => navigate("domain-select")} />
        )}

        {screen === "profile" && (
          <UserProfilePage
            onBack={() => navigate("landing")}
            onNavigateToDomain={(d) => { setDomain(d); navigate("domain-select"); }}
          />
        )}

        {screen === "domain-select" && (
          <DomainSelection
            onSelect={handleDomainSelect}
            onBack={() => navigate("landing")}
            searchQuery={searchQuery}
          />
        )}

        {screen === "results" && (
          <MainDashboard
            uid={user?.uid}
            analysis={analysis || profile?.latestAnalysis}
            scores={Object.keys(scores).length > 0 ? scores : (profile?.latestScores || {})}
            domain={domain || (profile?.latestAnalysis?.domain || "DSA")}
            sessionHistory={profile?.sessionHistory}
            onRestart={handleRestart}
            onSimulate={() => navigate("simulation")}
            onPractice={() => navigate(domain === "Web Dev" ? "web-sandbox" : "sandbox")}
          />
        )}

        {screen === "simulation" && (
          <SimulationMode
            originalAnalysis={analysis || profile?.latestAnalysis}
            originalScores={Object.keys(scores).length > 0 ? scores : (profile?.latestScores || {})}
            domain={domain || (profile?.latestAnalysis?.domain || "DSA")}
            onBack={() => navigate("results")}
            onPractice={() => navigate("coding-lab")}
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

        {screen === "coding-lab" && domain !== "Web Dev" && (
          <CodingLabScreen
            domain={domain}
            onComplete={handleQuizComplete}
            onBack={() => navigate("learning-concept")}
          />
        )}

        {screen === "coding-lab" && domain === "Web Dev" && (
          <WebPlayground
            mode={mode}
            onExit={() => navigate("learning-concept")}
          />
        )}

        {screen === "processing" && (
          <AIProcessingScreen 
            onComplete={handleProcessingComplete} 
            scores={scores}
            results={results}
            domain={domain}
          />
        )}

        {screen === "library" && (
          <ResourceLibrary currentDomain={domain} />
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

      {/* Persistent AI Tutor Avatar — hidden during quiz */}
      {screen !== "quiz" && <Avatar />}
      {screen !== "quiz" && <TextSelector persona={aiPersona} />}
    </div>
  );
}
