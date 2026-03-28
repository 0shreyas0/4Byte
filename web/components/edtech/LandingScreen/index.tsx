"use client";

import { useState } from "react";
import { ArrowRight, Brain, Target, Zap, GitBranch, BookOpen, TrendingUp } from "lucide-react";

interface LandingScreenProps {
  onStart: () => void;
}

const FEATURES = [
  {
    icon: Target,
    title: "Detect Weak Topics",
    desc: "AI scans your quiz performance and pinpoints exactly where you're failing.",
    color: "#FF3B3B",
  },
  {
    icon: GitBranch,
    title: "Trace Root Cause",
    desc: "Follow the dependency graph to find the original knowledge gap.",
    color: "#FFD60A",
  },
  {
    icon: Brain,
    title: "Explain Why You Failed",
    desc: "Step-by-step reasoning — not just 'you got it wrong'.",
    color: "#1DB954",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Path",
    desc: "A recovery plan ordered by concept dependencies.",
    color: "#3B82F6",
  },
  {
    icon: TrendingUp,
    title: "Simulate Improvement",
    desc: "See how fixing one topic cascades to improve all connected concepts.",
    color: "#8B5CF6",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    desc: "Every answer explained in plain language. Learn as you go.",
    color: "#F97316",
  },
];

const STATS = [
  { value: "93%", label: "Root Cause Accuracy" },
  { value: "3x", label: "Faster Learning" },
  { value: "10K+", label: "Concepts Mapped" },
];

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ minHeight: "100vh", background: "#F5F0E8" }}
      className="relative overflow-hidden"
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0D0D0D22 1px, transparent 1px), linear-gradient(90deg, #0D0D0D22 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Nav */}
      <nav
        className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-5"
        style={{ borderBottom: "2.5px solid #0D0D0D", background: "#F5F0E8" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: "#FFD60A", border: "2.5px solid #0D0D0D", boxShadow: "3px 3px 0 #0D0D0D" }}
          >
            <Brain size={20} color="#0D0D0D" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
            NeuralPath
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["How it works", "Domains", "About"].map((item) => (
            <span
              key={item}
              style={{ fontWeight: 600, fontSize: "0.95rem", cursor: "pointer", letterSpacing: "-0.01em" }}
              className="hover:underline"
            >
              {item}
            </span>
          ))}
        </div>
        <button
          onClick={onStart}
          className="brutal-btn px-5 py-2.5 text-sm"
          style={{ background: "#0D0D0D", color: "#F5F0E8" }}
        >
          Get Started →
        </button>
      </nav>

      {/* Hero */}
      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-14 sm:px-6 md:px-12 md:pt-16 md:pb-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          {/* Left: Text */}
          <div className="flex-1 max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div
                className="px-4 py-1.5 text-sm font-bold"
                style={{ background: "#FFD60A", border: "2px solid #0D0D0D", boxShadow: "2px 2px 0 #0D0D0D" }}
              >
                🧠 AI-Powered EdTech
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.96,
                marginBottom: "2rem",
              }}
            >
              Understand
              <br />
              what you
              <br />
              <span
                style={{
                  background: "#0D0D0D",
                  color: "#FFD60A",
                  padding: "0.05em 0.18em",
                  display: "inline-block",
                }}
              >
                don&apos;t know
              </span>
              <br />
              — and <em style={{ fontStyle: "italic" }}>why.</em>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                maxWidth: "620px",
                lineHeight: 1.6,
                color: "#333",
                fontWeight: 500,
                marginBottom: "2.5rem",
              }}
            >
              We don&apos;t just show weak topics. We trace concept dependencies,
              find the root cause of failure, and build your personalized recovery plan.
            </p>

            {/* CTA */}
            <div className="mb-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="brutal-btn flex items-center gap-3 px-8 py-4 text-lg"
                style={{
                  background: "#FFD60A",
                  transition: "transform 0.1s, box-shadow 0.1s",
                }}
              >
                Start Learning Now
                <ArrowRight
                  size={22}
                  style={{
                    transform: hovered ? "translateX(4px)" : "translateX(0)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              <span style={{ fontWeight: 600, color: "#666", fontSize: "0.9rem" }}>
                Free • No signup needed
              </span>
            </div>

            {/* Stats */}
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="px-5 py-4"
                  style={{ border: "2.5px solid #0D0D0D", background: "#FFFFFF", boxShadow: "3px 3px 0 #0D0D0D" }}
                >
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#666", marginTop: "6px", lineHeight: 1.35 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Demo card */}
          <div className="w-full flex-1 max-w-xl self-start lg:sticky lg:top-8">
            <DemoCard />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-12 md:py-20">
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "2.5rem",
            borderBottom: "3px solid #0D0D0D",
            paddingBottom: "1rem",
          }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="mx-auto mb-14 flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-8 sm:px-8 md:mb-20 md:flex-row md:items-center md:px-10 md:py-10"
        style={{ background: "#0D0D0D", border: "2.5px solid #0D0D0D", boxShadow: "6px 6px 0 #FFD60A" }}
      >
        <div>
          <h3 style={{ color: "#FFD60A", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Ready to understand your gaps?
          </h3>
          <p style={{ color: "#CCCCCC", marginTop: "0.5rem", fontWeight: 500 }}>
            Pick a domain and take a 5-minute quiz. AI does the rest.
          </p>
        </div>
        <button
          onClick={onStart}
          className="brutal-btn px-8 py-4 text-lg whitespace-nowrap"
          style={{ background: "#FFD60A", color: "#0D0D0D", flexShrink: 0 }}
        >
          Start Now →
        </button>
      </div>
    </div>
  );
}

function DemoCard() {
  return (
    <div
      style={{
        border: "2.5px solid #0D0D0D",
        boxShadow: "8px 8px 0 #0D0D0D",
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          background: "#0D0D0D",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF3B3B" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFD60A" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1DB954" }} />
        <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "8px", fontFamily: "JetBrains Mono, monospace" }}>
          ai-analysis.json
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem" }}>
        <DemoLine color="#888">{`// NeuralPath Analysis Output`}</DemoLine>
        <br />
        <DemoLine color="#3B82F6">WEAK TOPICS:</DemoLine>
        <DemoLine color="#FF3B3B">  ▶ Loops (score: 35%)</DemoLine>
        <DemoLine color="#FF3B3B">  ▶ Arrays (score: 28%)</DemoLine>
        <DemoLine color="#FF3B3B">  ▶ Sorting (score: 22%)</DemoLine>
        <br />
        <DemoLine color="#3B82F6">ROOT CAUSE:</DemoLine>
        <DemoLine color="#FFD60A">  ⚡ Loops → dependency chain start</DemoLine>
        <br />
        <DemoLine color="#3B82F6">AI EXPLANATION:</DemoLine>
        <DemoLine color="#1DB954">  1. Sorting requires array traversal</DemoLine>
        <DemoLine color="#1DB954">  2. Traversal requires loop mastery</DemoLine>
        <DemoLine color="#1DB954">  3. Loop score is only 35%</DemoLine>
        <DemoLine color="#1DB954">  ✓ Fix loops → everything improves</DemoLine>
        <br />
        <DemoLine color="#3B82F6">LEARNING PATH:</DemoLine>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 6,
          }}
        >
          {["Learn Loops", "Practice Arrays", "Reattempt Sorting"].map((step, i) => (
            <span
              key={step}
              style={{
                background: i === 0 ? "#FFD60A" : i === 1 ? "#F5F0E8" : "#1DB954",
                color: "#0D0D0D",
                border: "2px solid #0D0D0D",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {i + 1}. {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoLine({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ color, lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <div
      className="p-6 group cursor-default"
      style={{
        border: "2.5px solid #0D0D0D",
        background: "#FFFFFF",
        boxShadow: "4px 4px 0 #0D0D0D",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 #0D0D0D";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 #0D0D0D";
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-4"
        style={{
          background: feature.color,
          border: "2.5px solid #0D0D0D",
          boxShadow: "3px 3px 0 #0D0D0D",
        }}
      >
        <Icon size={22} color="#0D0D0D" strokeWidth={2.5} />
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 800,
          color: "#888",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        Step {index + 1}
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "8px" }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.6, fontWeight: 500 }}>
        {feature.desc}
      </p>
    </div>
  );
}
