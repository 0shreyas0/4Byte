"use client";

import { useState, useEffect } from "react";
import { AnalysisResult, TopicScore } from "@/lib/edtech/conceptGraph";
import {
  LayoutDashboard, BarChart3, GitBranch, Zap, BookOpen,
  Bell, User, Menu, X, TrendingUp, AlertTriangle, CheckCircle2,
  Target, Flame, Clock, ChevronRight, Trophy, ArrowRight, Info, Terminal,
  Brain, Sparkles, ChevronUp, ChevronDown, History, Calendar
} from "lucide-react";
import { tutorSpeak } from "../Avatar";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Types ─── */
interface Props {
  uid?: string;
  domain: string;
  scores: Record<string, TopicScore>;
  analysis: AnalysisResult;
  onRestart: () => void;
  onSimulate: () => void;
  onPractice: () => void; // 🔥 Added
  sessionHistory?: any[];
}

type Tab = "dashboard" | "analytics" | "conceptmap" | "deepdive" | "history";

/* ─── Helpers ─── */
function statusColor(score: number) {
  return score >= 70 ? "#1DB954" : score >= 45 ? "#FFD60A" : "#FF3B3B";
}
function statusLabel(score: number) {
  return score >= 70 ? "Strong ✅" : score >= 45 ? "Weak ⚠️" : "Critical ❌";
}

/* ─── Sidebar removed ─── */

/* ─── DASHBOARD TAB ─── */
function DashboardTab({ domain, scores, analysis, onSimulate, onPractice }: {
  domain: string; scores: Record<string, TopicScore>;
  analysis: AnalysisResult; onSimulate: () => void; onPractice: () => void;
}) {
  const entries = Object.entries(scores);
  const overallScore = Math.round(entries.reduce((s, [, t]) => s + t.score, 0) / Math.max(entries.length, 1));
  const weak = analysis.weakTopics;
  const strong = analysis.strongTopics;
  const [showDeepDive, setShowDeepDive] = useState(false);

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* AI Behavioral Insight Section (FOR OLLAMA/LLAMA3 INTEGRATION) */}
      <div style={{ 
        background: "#AF52DE", border: "4px solid #0D0D0D", 
        padding: "24px", boxShadow: "8px 8px 0 #0D0D0D", position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 50, height: 50, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FFF" }}>
            <Brain size={28} color="#AF52DE" />
          </div>
          <div>
            <h2 style={{ color: "#FFF", fontWeight: 900, fontSize: "1.4rem", textTransform: "uppercase", lineHeight: 1 }}>Neural Mentor Audit</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>LLM behavioral analysis powered by Ollama</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", border: "2px solid #0D0D0D" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>Hesitancy Score</div>
            <div style={{ color: "#FFF", fontSize: "1.5rem", fontWeight: 900 }}>Low (14%)</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", marginTop: 8 }}>
              <div style={{ height: "100%", width: "14%", background: "#FFF" }} />
            </div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", padding: "16px", border: "2px solid #0D0D0D" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>Confidence Index</div>
            <div style={{ color: "#FFF", fontSize: "1.5rem", fontWeight: 900 }}>High (88%)</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", marginTop: 8 }}>
              <div style={{ height: "100%", width: "88%", background: "#FFF" }} />
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,1)", padding: "16px", border: "2px solid #0D0D0D", color: "#0D0D0D" }}>
            <div style={{ color: "#888", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>AI Summary Recommendation</div>
            <p style={{ fontSize: "0.78rem", fontWeight: 800, lineHeight: 1.3 }}>User shows peak performance in logic chains but struggles with syntax memorization under time pressure.</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "#0D0D0D", border: "4px solid #0D0D0D", padding: "28px", boxShadow: "8px 8px 0 #FFD60A", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, background: "#FFD60A", opacity: 0.08, borderRadius: "50%" }} />
        
        <CapsuleCard analysis={analysis} />

        <div style={{ position: "relative" }}>
          <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
            📍 Official {domain} Skill Audit
          </div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", textTransform: "uppercase", lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.03em" }}>
            Your Score: <span style={{ color: "#FFD60A" }}>{overallScore}%</span> ⚡
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 700, fontSize: "0.9rem", marginBottom: 20 }}>
            {weak.length} weak topics found. Root cause: <strong style={{ color: "#FF3B3B" }}>{analysis.rootCause}</strong>
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button onClick={onSimulate}
              style={{ background: "#FFD60A", color: "#0D0D0D", border: "3px solid #FFD60A", padding: "12px 28px", fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "5px 5px 0 #fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Zap size={16} /> Simulate Improvement →
            </button>
            <button onClick={onPractice}
              style={{ background: "#1DB954", color: "#fff", border: "3px solid #1DB954", padding: "12px 28px", fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "5px 5px 0 #0D0D0D", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Terminal size={16} fill="currentColor" /> Practice IDE
            </button>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      {analysis.explanation && analysis.explanation.length > 0 && (
        <div style={{ 
          background: "#fff", 
          border: "4px solid #0D0D0D", 
          padding: "24px", 
          boxShadow: "6px 6px 0 #0D0D0D",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ 
              width: 48, height: 48, 
              background: "#0D0D0D", 
              border: "3px solid #FFD60A",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              fontSize: "1.4rem"
            }}>
              🧠
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 900, 
                fontSize: "0.75rem", 
                color: "#888", 
                textTransform: "uppercase", 
                letterSpacing: "0.1em",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                Neural Mentor Report <span style={{ background: "#FFD60A", color: "#0D0D0D", padding: "1px 6px", borderRadius: 4, fontSize: "0.6rem", fontWeight: 900 }}>PERSONALIZED</span>
              </div>
              <h2 style={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1.4, marginBottom: 10, color: "#1A1A1A" }}>
                {analysis.explanation[0]}
              </h2>
              
              {!showDeepDive ? (
                <button 
                  onClick={() => setShowDeepDive(true)}
                  style={{ background: "transparent", border: "none", color: "#3B82F6", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}
                >
                  <TrendingUp size={14} /> View Mentor's Thought Process →
                </button>
              ) : (
                <div style={{ marginTop: 20, borderTop: "2px solid #F0EBE0", paddingTop: 20 }}>
                   <div style={{ fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", color: "#FF3B3B", marginBottom: 12 }}>
                     🧭 Recommended Thought Process:
                   </div>
                   <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                     {analysis.explanation.slice(1, 4).map((step, i) => (
                       <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "#F9FAFB", border: "2px solid #0D0D0D", padding: "10px 14px" }}>
                         <div style={{ width: 24, height: 24, background: "#0D0D0D", color: "#FFD60A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.7rem", flexShrink: 0 }}>
                           {i + 1}
                         </div>
                         <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#333" }}>{step}</span>
                       </div>
                     ))}
                   </div>
                   <button 
                    onClick={() => setShowDeepDive(false)}
                    style={{ marginTop: 16, background: "transparent", border: "none", color: "#888", fontWeight: 800, fontSize: "0.7rem", cursor: "pointer", padding: 0 }}
                  >
                    Close Deep-Dive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {[
          { label: "Overall Score", value: `${overallScore}%`, icon: <Target size={16} />, bg: "#3B82F6", text: "#fff", shadow: "#2563EB" },
          { label: "Topics Strong", value: `${strong.length}/${entries.length}`, icon: <CheckCircle2 size={16} />, bg: "#1DB954", text: "#0D0D0D", shadow: "#15803d" },
          { label: "Root Cause", value: analysis.rootCause.slice(0,12), icon: <AlertTriangle size={16} />, bg: "#FF3B3B", text: "#fff", shadow: "#b91c1c" },
          { label: "Weak Topics", value: String(weak.length), icon: <Flame size={16} />, bg: "#FFD60A", text: "#0D0D0D", shadow: "#ca8a04" },
        ].map(({ label, value, icon, bg, text, shadow }) => (
          <div key={label} style={{ background: bg, border: "3px solid #0D0D0D", padding: "16px", boxShadow: `5px 5px 0 ${shadow}` }}>
            <div style={{ width: 32, height: 32, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <span style={{ color: bg }}>{icon}</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: "1.6rem", color: text, lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontWeight: 700, fontSize: "0.7rem", color: text, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Progress + Weak */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24 }} className="lg:grid-cols-[2fr_1fr] grid-cols-1">
        {/* Progress */}
        <div style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "20px", boxShadow: "6px 6px 0 #0D0D0D" }}>
          <h2 style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={18} /> Progress Overview
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {entries.map(([topic, { score }]) => (
              <div key={topic}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{topic}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 900, background: statusColor(score), color: score >= 45 ? "#0D0D0D" : "#fff", border: "2px solid #0D0D0D", padding: "2px 8px" }}>
                    {statusLabel(score)}
                  </span>
                </div>
                <div style={{ height: 24, background: "#F0EBE0", border: "3px solid #0D0D0D", position: "relative", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: statusColor(score), borderRight: "3px solid #0D0D0D", transition: "width 0.7s ease" }} />
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", fontWeight: 900 }}>{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak areas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
          <h2 style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={16} color="#FF3B3B" /> Weak Areas
          </h2>
          {weak.slice(0,3).map((topic) => {
            const score = scores[topic]?.score || 0;
            const isCritical = score < 45;
            return (
              <div key={topic} style={{
                background: isCritical ? "#FF3B3B" : "#FFD60A",
                border: "3px solid #0D0D0D",
                padding: "14px",
                boxShadow: `5px 5px 0 ${isCritical ? "#b91c1c" : "#ca8a04"}`,
                cursor: "pointer",
              }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{isCritical ? "❌" : "⚠️"}</div>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase" }}>{topic}</div>
                <div style={{ fontWeight: 700, fontSize: "0.7rem", opacity: 0.7, marginTop: 2 }}>Score: {score}%</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase" }}>
                  Fix this first <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning path strip */}
      <div style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "20px", boxShadow: "6px 6px 0 #0D0D0D" }}>
        <h2 style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <BookOpen size={18} /> Recovery Path
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          {analysis.learningPath.slice(0, 5).map((step, i) => (
            <div key={`${step.topic}-${i}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: i === 0 ? "#FF3B3B" : i === 1 ? "#FFD60A" : "#1DB954",
                border: "3px solid #0D0D0D",
                boxShadow: "4px 4px 0 #0D0D0D",
                padding: "10px 16px",
                textAlign: "center",
                minWidth: 100,
              }}>
                <span style={{ fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{step.topic}</span>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, opacity: 0.7, marginTop: 2 }}>{step.action.slice(0,8)}</div>
              </div>
              {i < 4 && <ChevronRight size={20} strokeWidth={3} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AI LEARNING CAPSULE ─── */
function CapsuleCard({ analysis }: { analysis: AnalysisResult }) {
  const capsule = analysis.capsule;
  const [expanded, setExpanded] = useState(false);

  if (!capsule) return null;

  return (
    <div style={{ 
      background: "#fff", 
      border: "4px solid #0D0D0D", 
      boxShadow: "8px 8px 0 #AF52DE", 
      padding: "20px",
      marginBottom: "24px",
      position: "relative",
      zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#AF52DE", color: "#fff", padding: "8px", border: "2px solid #0D0D0D" }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#AF52DE" }}>AI_LEARNING_CAPSULE</h3>
            <p style={{ fontWeight: 800, fontSize: "1rem", margin: 0, color: "#0D0D0D" }}>{capsule.learning_gap}</p>
          </div>
        </div>
        <button 
           onClick={() => setExpanded(!expanded)}
           style={{ background: "#0D0D0D", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "HIDE INSIGHTS" : "TALK TO TUTOR"}
        </button>
      </div>

      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }} className="lg:grid-cols-[1fr_300px] grid-cols-1">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {capsule.topics.map((topic, i) => (
              <div key={i} style={{ padding: "16px", border: "3px solid #0D0D0D", background: "#f8f8f8", boxShadow: "4px 4px 0 #0D0D0D" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Brain size={16} color="#AF52DE" />
                  <h4 style={{ fontWeight: 900, fontSize: "0.9rem", textTransform: "uppercase", color: "#0D0D0D" }}>{topic.name}</h4>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 900, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>THE_MISTAKE</div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FF3B3B", margin: 0 }}>{topic.mistake}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 900, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>THE_RULE</div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1DB954", margin: 0 }}>{topic.rule}</p>
                  </div>
                </div>

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "2px dashed #DDD" }}>
                   <div style={{ fontSize: "0.65rem", fontWeight: 900, color: "#AF52DE", textTransform: "uppercase", marginBottom: 4 }}>PRO_TIP</div>
                   <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#555", fontStyle: "italic", margin: 0 }}>"{topic.mnemonic}"</p>
                </div>
              </div>
            ))}
            
            <div style={{ background: "#F0FDF4", border: "3px solid #1DB954", padding: "16px", fontWeight: 800, fontSize: "0.85rem" }}>
               🎯 NEXT ACTION: {capsule.next_action}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, borderLeft: "4px solid #F5F0E8", paddingLeft: "24px" }} className="lg:border-l-4 border-l-0 lg:pl-6 pl-0">
             <div style={{ fontWeight: 900, fontSize: "0.7rem", textTransform: "uppercase", color: "#AF52DE", marginBottom: -8 }}>AI Tutor Assistant</div>
             
             <button
               onClick={() => {
                 if (analysis.explanation && analysis.explanation.length > 0) {
                   tutorSpeak(analysis.explanation);
                 } else {
                   const fullText = capsule.topics.map(t => `${t.name}: ${t.summary}. Your mistake was ${t.mistake}. Remember: ${t.rule}`).join(". ");
                   tutorSpeak(`Let me explain your results. ${fullText} Your next move should be ${capsule.next_action}`);
                 }
               }}
               style={{
                 width: "100%",
                 padding: "20px",
                 background: "#FFD60A",
                 border: "4px solid #0D0D0D",
                 boxShadow: "6px 6px 0 #0D0D0D",
                 fontWeight: 900,
                 textTransform: "uppercase",
                 cursor: "pointer",
               }}
             >
               🔊 Explain Highlights
             </button>

             <p style={{ fontSize: "0.7rem", fontWeight: 600, textAlign: "center", color: "#666", lineHeight: 1.4 }}>
               "I can explain your mistakes in detail. Just click the button to hear my reasoning!"
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ANALYTICS TAB ─── */
function AnalyticsTab({ scores, analysis }: { scores: Record<string, TopicScore>; analysis: AnalysisResult }) {
  const entries = Object.entries(scores);
  const overallScore = Math.round(entries.reduce((s, [, t]) => s + t.score, 0) / Math.max(entries.length, 1));
  const [activeView, setActiveView] = useState<"bars" | "topics" | "breakdown">("bars");

  const tabs = [
    { id: "bars" as const, label: "Overview" },
    { id: "topics" as const, label: "By Topic" },
    { id: "breakdown" as const, label: "Breakdown" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "-0.03em" }}>📈 Analytics</h1>
          <p style={{ fontWeight: 700, color: "#666", fontSize: "0.85rem", marginTop: 4 }}>Performance breakdown for {entries[0] ? "this quiz session" : "your quiz"}</p>
        </div>
        <div style={{ background: "#FFD60A", border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D", padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} />
          <span style={{ fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase" }}>Score: {overallScore}%</span>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
        {[
          { label: "Overall Score", value: `${overallScore}%`, up: true, delta: "vs 50% avg", color: "#3B82F6" },
          { label: "Topics Passed", value: `${analysis.strongTopics.length}/${entries.length}`, up: true, delta: "scored >70%", color: "#1DB954" },
          { label: "Quiz Accuracy", value: `${overallScore}%`, up: overallScore >= 50, delta: overallScore >= 50 ? "above avg" : "needs work", color: "#FFD60A" },
          { label: "Weak Topics", value: String(analysis.weakTopics.length), up: false, delta: "need review", color: "#FF3B3B" },
        ].map(({ label, value, up, delta, color }) => (
          <div key={label} style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "16px", boxShadow: "5px 5px 0 #0D0D0D" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, background: color, border: "3px solid #0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 900, fontSize: "0.7rem", color: color === "#FFD60A" ? "#0D0D0D" : "#fff" }}>%</span>
              </div>
              <div style={{ fontSize: "0.65rem", fontWeight: 900, padding: "3px 8px", border: "2px solid #0D0D0D", background: up ? "#1DB954" : "#FF3B3B", color: up ? "#0D0D0D" : "#fff" }}>
                {up ? "▲" : "▼"} {delta}
              </div>
            </div>
            <div style={{ fontWeight: 900, fontSize: "1.6rem", lineHeight: 1, marginBottom: 4 }}>{value}</div>
            <div style={{ fontWeight: 700, fontSize: "0.7rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", border: "3px solid #0D0D0D", width: "fit-content" }}>
        {tabs.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveView(id)}
            style={{ padding: "10px 20px", fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", background: activeView === id ? "#0D0D0D" : "#fff", color: activeView === id ? "#FFD60A" : "#0D0D0D", borderTop: "none", borderBottom: "none", borderLeft: "none", borderRight: id !== "breakdown" ? "3px solid #0D0D0D" : "none" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === "bars" && (
        <div style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "20px", boxShadow: "6px 6px 0 #0D0D0D" }}>
          <h2 style={{ fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: 20 }}>📊 Performance Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {entries.map(([topic, { score }]) => (
              <div key={topic} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 140, fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right", flexShrink: 0 }}>{topic}</div>
                <div style={{ flex: 1, height: 32, background: "#F0EBE0", border: "3px solid #0D0D0D", position: "relative", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: statusColor(score), borderRight: "3px solid #0D0D0D", transition: "width 0.7s" }} />
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", fontWeight: 900 }}>{score}%</span>
                </div>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 900, padding: "4px 8px", border: "2px solid #0D0D0D", textAlign: "center", background: statusColor(score), color: score >= 45 ? "#0D0D0D" : "#fff" }}>
                    {statusLabel(score).split(" ")[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "topics" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {entries.map(([topic, { score, time }]) => {
            const color = statusColor(score);
            return (
              <div key={topic} style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "16px", boxShadow: "6px 6px 0 #0D0D0D" }}>
                <div style={{ width: "100%", height: 6, background: "#F0EBE0", border: "2px solid #0D0D0D", marginBottom: 12 }}>
                  <div style={{ height: "100%", width: `${score}%`, background: color }} />
                </div>
                <h3 style={{ fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>{topic}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 900, fontSize: "1.8rem" }}>{score}%</span>
                  <div style={{ padding: "3px 8px", border: "2px solid #0D0D0D", fontWeight: 900, fontSize: "0.65rem", textTransform: "uppercase", background: color, color: score >= 45 ? "#0D0D0D" : "#fff" }}>
                    {statusLabel(score).split(" ")[0]}
                  </div>
                </div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#666", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} /> {time || 0}s spent
                </div>
                <div style={{ marginTop: 10, height: 20, background: "#F0EBE0", border: "2px solid #0D0D0D", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeView === "breakdown" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="sm:grid-cols-2 grid-cols-1">
          <div style={{ background: "#FFF0F0", border: "3px solid #FF3B3B", boxShadow: "5px 5px 0 #FF3B3B", padding: "20px" }}>
            <h2 style={{ fontWeight: 900, fontSize: "1rem", color: "#FF3B3B", marginBottom: 16 }}>⚠️ Weak Topics (&lt;45%)</h2>
            {analysis.weakTopics.length === 0 ? <p style={{ fontWeight: 700, color: "#555" }}>No weak topics 🎉</p> : analysis.weakTopics.map(t => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: 12, marginBottom: 8, border: "2px solid #FF3B3B", background: "#fff" }}>
                <div><div style={{ fontWeight: 900 }}>{t}</div><div style={{ fontSize: "0.75rem", color: "#888" }}>{scores[t]?.time || 0}s spent</div></div>
                <div style={{ background: "#FF3B3B", color: "#fff", fontWeight: 900, padding: "4px 12px" }}>{scores[t]?.score || 0}%</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#F0FDF4", border: "3px solid #1DB954", boxShadow: "5px 5px 0 #1DB954", padding: "20px" }}>
            <h2 style={{ fontWeight: 900, fontSize: "1rem", color: "#1DB954", marginBottom: 16 }}>✅ Strong Topics (&gt;70%)</h2>
            {analysis.strongTopics.length === 0 ? <p style={{ fontWeight: 700, color: "#555" }}>Keep practicing!</p> : analysis.strongTopics.map(t => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: 12, marginBottom: 8, border: "2px solid #1DB954", background: "#fff" }}>
                <span style={{ fontWeight: 700 }}>{t}</span>
                <span style={{ fontWeight: 900, color: "#1DB954" }}>{scores[t]?.score}%</span>
              </div>
            ))}
          </div>
          <div style={{ gridColumn: "1 / -1", background: "#0D0D0D", border: "3px solid #0D0D0D", boxShadow: "6px 6px 0 #FFD60A", padding: "20px" }}>
            <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>⚡ Root Cause Chain</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              {analysis.dependencyChain.map((t, i) => (
                <div key={`${t}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: i === 0 ? "#FF3B3B" : "#fff", color: "#0D0D0D", border: "2.5px solid #FFD60A", padding: "8px 16px", fontWeight: 900, fontSize: "0.9rem" }}>
                    {i === 0 && "⚡ "}{t}
                  </div>
                  {i < analysis.dependencyChain.length - 1 && <ArrowRight size={18} color="#FFD60A" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CONCEPT MAP TAB ─── */
function ConceptMapTab({ domain, scores, analysis }: {
  domain: string; scores: Record<string, TopicScore>; analysis: AnalysisResult;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const { DOMAIN_DATA } = require("@/lib/edtech/conceptGraph");
  const graph = DOMAIN_DATA[domain]?.graph || {};
  const allTopics = Object.keys(graph);
  const chainSet = new Set(analysis.dependencyChain);

  const W = 560, H = 380;
  const depths: Record<string, number> = {};
  const roots = allTopics.filter(t => (graph[t] || []).length === 0);
  const visited = new Set<string>();
  const assignDepth = (t: string, d: number) => {
    if (visited.has(t)) return;
    visited.add(t);
    depths[t] = Math.max(depths[t] || 0, d);
    allTopics.forEach(u => { if ((graph[u] || []).includes(t)) assignDepth(u, d + 1); });
  };
  roots.forEach(r => assignDepth(r, 0));
  const maxDepth = Math.max(...Object.values(depths), 0);
  const byDepth: Record<number, string[]> = {};
  Object.entries(depths).forEach(([t, d]) => { if (!byDepth[d]) byDepth[d] = []; byDepth[d].push(t); });
  const pos: Record<string, { x: number; y: number }> = {};
  for (let d = 0; d <= maxDepth; d++) {
    const xVal = 60 + (d / Math.max(maxDepth, 1)) * (W - 100);
    const items = byDepth[d] || [];
    items.forEach((t, i) => { pos[t] = { x: xVal, y: items.length === 1 ? H / 2 : 60 + (i / Math.max(items.length - 1, 1)) * (H - 120) }; });
  }
  const sc = (t: string) => { const s = analysis.topicStatuses[t]; return !s ? "#CCC" : s === "weak" ? "#FF3B3B" : s === "medium" ? "#FFD60A" : "#1DB954"; };

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontWeight: 900, fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "-0.03em" }}>🧠 Concept Map</h1>
        <p style={{ fontWeight: 700, color: "#666", marginTop: 4, fontSize: "0.85rem" }}>Visual dependency graph — highlighted chain shows root cause</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="lg:grid-cols-[2fr_1fr] grid-cols-1">
        {/* SVG */}
        <div style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "20px", boxShadow: "8px 8px 0 #0D0D0D" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#666", marginBottom: 12 }}>
            Chain: {analysis.dependencyChain.join(" → ")}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", border: "2px solid #E5E5E5", background: "#FAFAF5" }}>
            {allTopics.map(t => (graph[t] || []).map((dep: string) => {
              if (!pos[t] || !pos[dep]) return null;
              const isChain = chainSet.has(t) && chainSet.has(dep);
              return <line key={`${dep}-${t}`} x1={pos[dep].x} y1={pos[dep].y} x2={pos[t].x} y2={pos[t].y}
                stroke={isChain ? "#FF3B3B" : "#CCCCCC"} strokeWidth={isChain ? 3 : 1.5} strokeDasharray={isChain ? "none" : "4,3"} />;
            }))}
            {allTopics.map(t => {
              if (!pos[t]) return null;
              const isChain = chainSet.has(t);
              const isRoot = t === analysis.rootCause;
              const r = isRoot ? 26 : isChain ? 22 : 18;
              const color = sc(t);
              const score = scores[t]?.score;
              return (
                <g key={t} onClick={() => setSelected(selected === t ? null : t)} style={{ cursor: "pointer" }}>
                  <circle cx={pos[t].x + 3} cy={pos[t].y + 3} r={r} fill="#0D0D0D" opacity={0.2} />
                  <circle cx={pos[t].x} cy={pos[t].y} r={r} fill={color} stroke={isRoot ? "#FF3B3B" : "#0D0D0D"} strokeWidth={isRoot ? 3.5 : 2.5} />
                  {isRoot && <circle cx={pos[t].x} cy={pos[t].y} r={r + 6} fill="none" stroke="#FF3B3B" strokeWidth={2} strokeDasharray="4,3" opacity={0.7} />}
                  <text x={pos[t].x} y={pos[t].y + r + 14} textAnchor="middle" fill="#0D0D0D" fontSize={10} fontWeight={isChain ? 800 : 600} fontFamily="Space Grotesk, sans-serif">{t.length > 10 ? t.slice(0, 9) + "…" : t}</text>
                  {score !== undefined && <text x={pos[t].x} y={pos[t].y + 4} textAnchor="middle" fill={color === "#FFD60A" ? "#0D0D0D" : "#fff"} fontSize={9} fontWeight={800} fontFamily="JetBrains Mono, monospace">{score}%</text>}
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            {[["#FF3B3B", "Weak (<45%)"], ["#FFD60A", "Medium (45–70%)"], ["#1DB954", "Strong (>70%)"], ["#CCC", "Not tested"]].map(([color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 14, height: 14, background: color, border: "2px solid #0D0D0D" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail + stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selected ? (
            <div style={{ background: sc(selected), border: "4px solid #0D0D0D", padding: "20px", boxShadow: "6px 6px 0 #0D0D0D" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>
                     {analysis.topicStatuses[selected] === "weak" ? "⚠️" : analysis.topicStatuses[selected] === "strong" ? "✅" : "🔵"}
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase" }}>{selected}</h3>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, opacity: 0.7, marginTop: 2 }}>
                    Status: {analysis.topicStatuses[selected]?.toUpperCase() || "NOT TESTED"}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ width: 28, height: 28, background: "#0D0D0D", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} color="#fff" />
                </button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase" }}>Mastery</span>
                  <span style={{ fontWeight: 900, fontSize: "0.85rem" }}>{scores[selected]?.score ?? "—"}%</span>
                </div>
                <div style={{ height: 20, background: "rgba(255,255,255,0.5)", border: "3px solid #0D0D0D" }}>
                  <div style={{ height: "100%", width: `${scores[selected]?.score || 0}%`, background: "#0D0D0D" }} />
                </div>
              </div>
              {chainSet.has(selected) && (
                <div style={{ background: "rgba(0,0,0,0.1)", border: "2px solid #0D0D0D", padding: "8px 12px", fontSize: "0.75rem", fontWeight: 700 }}>
                  ⚡ Part of root cause chain
                </div>
              )}
            </div>
          ) : (
            <div style={{ border: "3px dashed #0D0D0D", padding: "24px", textAlign: "center" }}>
              <Info size={28} color="rgba(0,0,0,0.3)" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontWeight: 900, fontSize: "0.8rem", color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>Click a node to see details</p>
            </div>
          )}

          {/* Grid stats */}
          <div style={{ background: "#fff", border: "4px solid #0D0D0D", padding: "16px", boxShadow: "6px 6px 0 #0D0D0D" }}>
            <h3 style={{ fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>📊 Topic Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(["strong", "medium", "weak"] as const).map(s => {
                const count = Object.values(analysis.topicStatuses).filter(v => v === s).length;
                const bg = s === "strong" ? "#1DB954" : s === "medium" ? "#FFD60A" : "#FF3B3B";
                const shadow = s === "strong" ? "#15803d" : s === "medium" ? "#ca8a04" : "#b91c1c";
                return (
                  <div key={s} style={{ background: bg, border: "3px solid #0D0D0D", boxShadow: `3px 3px 0 ${shadow}`, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontWeight: 900, fontSize: "1.4rem" }}>{count}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase" }}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: "#0D0D0D", border: "4px solid #0D0D0D", padding: "16px", boxShadow: "6px 6px 0 #FFD60A" }}>
            <h3 style={{ fontWeight: 900, fontSize: "0.75rem", color: "#FFD60A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>⚡ Key Insights</h3>
            {analysis.dependencyChain.slice(0, 3).map((t, i) => (
              <div key={`insight-${t}-${i}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 2 ? "1px solid #333" : "none" }}>
                <div style={{ width: 20, height: 20, background: i === 0 ? "#FF3B3B" : "#FFD60A", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.6rem", flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#fff" }}>{t}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#888" }}>{scores[t]?.score ?? "—"}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DEEP DIVE TAB ─── */
function DeepDiveTab({ analysis }: { analysis: AnalysisResult }) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [globalExpanded, setGlobalExpanded] = useState(false);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (globalExpanded) {
      setExpandedCards(new Set());
      setGlobalExpanded(false);
    } else {
      setExpandedCards(new Set(analysis.detailedAiReport?.map(q => q.question_id) || []));
      setGlobalExpanded(true);
    }
  };

  if (!analysis.detailedAiReport || analysis.detailedAiReport.length === 0) {
    return (
      <div style={{ padding: "28px", maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#fff", border: "3px solid #0D0D0D", padding: "24px", boxShadow: "6px 6px 0 #0D0D0D" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Sparkles size={22} color="#FFD60A" strokeWidth={2} />
            <h2 style={{ fontWeight: 900, fontSize: "1.05rem", textTransform: "uppercase", margin: 0 }}>
              Neural Mentor Summary
            </h2>
          </div>
          <p style={{ fontWeight: 700, color: "#333", lineHeight: 1.7, margin: 0 }}>
            {(analysis.explanation && analysis.explanation[0]) || "Mentor summary is available, but per-question deep dive could not be generated for this attempt."}
          </p>
        </div>

        <div style={{ background: "#0D0D0D", border: "3px solid #FFD60A", padding: "18px 20px" }}>
          <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 8 }}>
            What this means
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#fff", lineHeight: 1.8, fontSize: "0.92rem", fontWeight: 600 }}>
            {((analysis.explanation && analysis.explanation.length > 1) ? analysis.explanation.slice(1, 5) : [
              "Detailed per-question thought process is missing for this run.",
              "You can retake once to regenerate the full Neural Mentor deep dive.",
            ]).map((line, idx) => (
              <li key={`${line}-${idx}`}>{line}</li>
            ))}
          </ul>
        </div>

        <div style={{ border: "2px dashed #0D0D0D", padding: "14px 16px", background: "#fff" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#555" }}>
            Deep dive appears only when backend returns question-level mentor output (`detailed_report`).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header + Global Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: "1.4rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
            🧠 Neural Mentor Review
          </h1>
          <p style={{ color: "#666", fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>
            {analysis.detailedAiReport.length} questions reviewed · Tap a card for full analysis
          </p>
        </div>
        <button
          onClick={toggleAll}
          style={{
            background: "#0D0D0D", color: "#FFD60A", border: "3px solid #0D0D0D",
            padding: "10px 20px", fontWeight: 900, fontSize: "0.78rem",
            textTransform: "uppercase", cursor: "pointer", letterSpacing: "0.05em",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {globalExpanded ? "⬆ Collapse All" : "⬇ Expand All"}
        </button>
      </div>

      {/* AI Summary Card */}
      {analysis.explanation && analysis.explanation[0] && (
        <div style={{ background: "#0D0D0D", border: "3px solid #FFD60A", padding: "20px 24px", boxShadow: "6px 6px 0 #FFD60A" }}>
          <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.1em" }}>
            💬 Mentor's Take
          </div>
          <p style={{ color: "#fff", fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 600 }}>
            {analysis.explanation[0]}
          </p>
        </div>
      )}

      {/* Per-Question Cards */}
      {analysis.detailedAiReport.map((q, i) => {
        const isExpanded = expandedCards.has(q.question_id);
        return (
          <div
            key={q.question_id}
            style={{
              background: "#fff", border: "3px solid #0D0D0D",
              boxShadow: isExpanded ? "5px 5px 0 #FFD60A" : "4px 4px 0 #0D0D0D",
              transition: "box-shadow 0.15s ease",
              overflow: "hidden",
            }}
          >
            {/* ── QUICK VIEW (always visible) ── */}
            <div
              style={{
                padding: "18px 22px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                gap: 12, flexWrap: "wrap", cursor: "pointer",
              }}
              onClick={() => toggleCard(q.question_id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                {/* Number badge */}
                <div style={{
                  width: 34, height: 34, flexShrink: 0,
                  background: q.is_correct ? "#1DB954" : "#FF3B3B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 900, fontSize: "0.85rem",
                  border: "2.5px solid #0D0D0D",
                }}>
                  {q.is_correct ? "✓" : i + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  {/* Takeaway — the TL;DR */}
                  <p style={{
                    fontWeight: 800, fontSize: "0.92rem", color: "#0D0D0D",
                    margin: 0, lineHeight: 1.4,
                  }}>
                    {q.key_takeaway || q.concept}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#888", fontWeight: 700, marginTop: 3 }}>
                    {q.topic} · {q.concept}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{
                  background: q.is_correct ? "#1DB954" : "#FF3B3B",
                  color: "#fff", padding: "4px 10px",
                  fontWeight: 900, fontSize: "0.68rem", textTransform: "uppercase",
                  border: "2px solid #0D0D0D",
                }}>
                  {q.is_correct ? "✅ Correct" : "⚠️ Missed"}
                </span>
                <span style={{
                  background: isExpanded ? "#FFD60A" : "#0D0D0D",
                  color: isExpanded ? "#0D0D0D" : "#FFD60A",
                  padding: "4px 12px", fontWeight: 900, fontSize: "0.68rem",
                  textTransform: "uppercase", border: "2px solid #0D0D0D",
                  transition: "all 0.1s",
                }}>
                  {isExpanded ? "▲ Less" : "▼ Full Analysis"}
                </span>
              </div>
            </div>

            {/* ── FULL ANALYSIS (expandable) ── */}
            {isExpanded && (
              <div style={{
                borderTop: "3px solid #0D0D0D",
                background: "#0D0D0D",
                padding: "28px 24px",
                display: "flex", flexDirection: "column", gap: 24,
              }}>
                {/* Grid: Thought Process + Right Column */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }}>
                  {/* Left: Full Thought Process */}
                  <div>
                    <div style={{ color: "#FF3B3B", fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <Zap size={16} /> Mentor's Mental Mapping
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.75, fontWeight: 600 }}>
                      {q.mentor_thought_process}
                    </p>
                  </div>

                  {/* Right: Insight + Drill */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: "rgba(29, 185, 84, 0.07)", borderLeft: "4px solid #1DB954", padding: "20px" }}>
                      <div style={{ color: "#1DB954", fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 8 }}>💡 Professional Insight</div>
                      <p style={{ color: "#fff", fontSize: "0.93rem", fontWeight: 800, fontStyle: "italic" }}>
                        "{q.key_takeaway}"
                      </p>
                    </div>
                    <div style={{ background: "rgba(255,214,10,0.07)", borderLeft: "4px solid #FFD60A", padding: "20px" }}>
                      <div style={{ color: "#FFD60A", fontWeight: 900, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 8 }}>🛠 Recommended Drill</div>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 700 }}>
                        Practice {q.topic} labs with a focus on {q.concept} edge cases. Try solving variations without looking at notes first.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── HISTORY TAB ─── */
function HistoryTab({ sessionHistory, onSelect }: { 
  sessionHistory?: any[]; onSelect: (hist: any) => void 
}) {
  const sessions = sessionHistory || [];

  if (sessions.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <History size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
        <h2 style={{ fontWeight: 900, textTransform: "uppercase" }}>No test history found</h2>
        <p style={{ fontWeight: 700, color: "#666" }}>Complete a quiz to see your progress tracked here!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ fontWeight: 900, fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "-0.03em" }}>🕰 Session History</h1>
        <p style={{ fontWeight: 700, color: "#666", fontSize: "0.85rem", marginTop: 4 }}>Select a past session to revisit its knowledge graph and Neural Mentor review.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map((s, idx) => {
          const overall = s.scores ? Math.round(Object.values(s.scores as Record<string, any>).reduce((sum, t) => sum + t.score, 0) / Math.max(Object.keys(s.scores).length, 1)) : 0;
          const isCurrent = idx === 0;

          return (
            <div 
              key={`${s.timestamp}-${idx}`}
              onClick={() => onSelect(s)}
              style={{
                background: "#fff",
                border: "4px solid #0D0D0D",
                padding: "20px",
                boxShadow: isCurrent ? "6px 6px 0 #FFD60A" : "4px 4px 0 #0D0D0D",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "100px 1fr 120px 48px",
                alignItems: "center",
                gap: 20,
                transition: "transform 0.1s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {/* Score Badge */}
              <div style={{ 
                background: statusColor(overall), 
                border: "3px solid #0D0D0D", 
                height: "60px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" 
              }}>
                <span style={{ fontWeight: 900, fontSize: "1.2rem", lineHeight: 1 }}>{overall}%</span>
                <span style={{ fontWeight: 900, fontSize: "0.55rem", textTransform: "uppercase" }}>SCORE</span>
              </div>

              {/* Info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 900, fontSize: "0.85rem", textTransform: "uppercase", color: "#0D0D0D" }}>
                    {s.domain} Assessment
                  </span>
                  {isCurrent && (
                    <span style={{ background: "#0D0D0D", color: "#FFD60A", fontSize: "0.6rem", fontWeight: 900, padding: "2px 6px", borderRadius: 4 }}>LATEST</span>
                  )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, color: "#666", fontSize: "0.72rem", fontWeight: 700 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {s.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#FF3B3B" }}>
                    <Brain size={12} /> Hurdle: {s.analysis?.rootCause || "Universal Logic"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {Object.keys(s.scores || {}).length * 8} Questions
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                 <div style={{ fontSize: "0.65rem", fontWeight: 900, color: "#888", textTransform: "uppercase" }}>Topics Overview</div>
                 <div style={{ display: "flex", gap: 4 }}>
                    <div style={{ width: 12, height: 12, background: "#1DB954", border: "1px solid #0D0D0D" }} title="Strong" />
                    <div style={{ width: 12, height: 12, background: "#FFD60A", border: "1px solid #0D0D0D" }} title="Medium" />
                    <div style={{ width: 12, height: 12, background: "#FF3B3B", border: "1px solid #0D0D0D" }} title="Weak" />
                 </div>
              </div>

              {/* Go Icon */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 32, height: 32, background: "#0D0D0D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <ChevronRight size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function MainDashboard({ uid, domain, scores, analysis, onRestart, onSimulate, onPractice, sessionHistory }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");

  if (!analysis) {
    return <div style={{ padding: 40 }}>Missing Analysis</div>;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard",  label: "Behavioral Insight", icon: LayoutDashboard },
    { id: "analytics",  label: "Performance Map",   icon: BarChart3 },
    { id: "conceptmap", label: "Knowledge Graph",    icon: GitBranch },
    { id: "deepdive",   label: "Neural Mentor",         icon: Sparkles },
    { id: "history",    label: "All Tests",         icon: History },
  ];

  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult>(analysis);
  const [activeScores, setActiveScores] = useState<Record<string, TopicScore>>(scores);
  const [activeTabDomain, setActiveTabDomain] = useState<string>(domain);

  // Sync state if props change (e.g. after a new quiz)
  useEffect(() => {
    setActiveAnalysis(analysis);
    setActiveScores(scores);
    setActiveTabDomain(domain);
  }, [analysis, scores, domain]);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Secondary Unified Sub-Nav */}
      <div style={{ 
        background: "#FFF", borderBottom: "4px solid #0D0D0D", 
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", justifyContent: "center", gap: 0
      }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, maxWidth: 240, padding: "16px",
                background: active ? "#0D0D0D" : "transparent",
                color: active ? "#FFD60A" : "#0D0D0D",
                borderRight: "4px solid #0D0D0D",
                cursor: "pointer", transition: "all 0.1s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase"
              }}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
        <button
          onClick={onRestart}
          style={{
            flex: 1, maxWidth: 180, padding: "16px",
            background: "#FF3B3B", color: "#FFF",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontWeight: 900, fontSize: "0.8rem", textTransform: "uppercase"
          }}
        >
          <Zap size={18} fill="#FFF" />
          Retake
        </button>
      </div>

      <main style={{ flex: 1 }}>
        {tab === "dashboard"  && <DashboardTab  domain={activeTabDomain} scores={activeScores} analysis={activeAnalysis} onSimulate={onSimulate} onPractice={onPractice} />}
        {tab === "analytics"  && <AnalyticsTab  scores={activeScores} analysis={activeAnalysis} />}
        {tab === "conceptmap" && <ConceptMapTab domain={activeTabDomain} scores={activeScores} analysis={activeAnalysis} />}
        {tab === "deepdive"   && <DeepDiveTab   analysis={activeAnalysis} />}
        {tab === "history"    && (
          <HistoryTab 
            sessionHistory={sessionHistory}
            onSelect={(hist) => {
              setActiveAnalysis(hist.analysis);
              setActiveScores(hist.scores);
              setActiveTabDomain(hist.domain);
              setTab("dashboard"); // Go to dashboard after selecting
            }} 
          />
        )}
      </main>
    </div>
  );
}
