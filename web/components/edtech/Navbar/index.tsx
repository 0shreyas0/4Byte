"use client";

import { useState } from "react";
import {
  BookOpen,
  Layers,
  Zap,
  BarChart3,
  Menu,
  X,
  Bell,
  User,
  Trophy,
  Flame,
  Sparkles,
  RotateCcw,
  HomeIcon,
} from "lucide-react";

export type Screen =
  | "login"
  | "landing"
  | "domain-select"
  | "mode-select"
  | "timeline"
  | "learning-concept"
  | "quiz"
  | "coding-lab"
  | "processing"
  | "results"
  | "simulation"
  | "sandbox";

interface NavbarProps {
  screen: Screen;
  domain: string;
  isLoggedIn: boolean;
  onNavigate: (screen: Screen) => void;
  onRestart: () => void;
  onGetStarted: () => void;
}

const NAV_ITEMS: {
  label: string;
  icon: React.ElementType;
  screen: Screen;
  group: Screen[];
}[] = [
  {
    label: "Home",
    icon: HomeIcon,
    screen: "landing",
    group: ["landing"],
  },
  {
    label: "Domains",
    icon: Layers,
    screen: "domain-select",
    group: ["domain-select", "mode-select", "timeline", "learning-concept"],
  },
  {

    label: "Results",
    icon: BarChart3,
    screen: "results",
    group: ["results"],
  },
  {
    label: "Deep Dive",
    icon: Sparkles,
    screen: "simulation",
    group: ["simulation"],
  },
];

export default function Navbar({ 
  screen, 
  domain, 
  isLoggedIn, 
  onNavigate, 
  onRestart, 
  onGetStarted 
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.group.includes(screen);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "#FFD60A", borderBottom: "4px solid #0D0D0D" }}
    >
      <div className="max-w-screen-2xl mx-auto flex items-stretch" style={{ height: 56 }}>

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <button
          onClick={onRestart}
          className="flex items-center gap-2.5 px-5 shrink-0 cursor-pointer"
          style={{ borderRight: "4px solid #0D0D0D", background: "transparent" }}
        >
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ background: "#0D0D0D", boxShadow: "2px 2px 0px rgba(0,0,0,0.3)" }}
          >
            <BookOpen size={18} color="#FFD60A" />
          </div>
          <span
            className="hidden sm:block"
            style={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#0D0D0D" }}
          >
            NeuralPath
          </span>
        </button>

        {/* ── Desktop nav links ───────────────────────────────────────── */}
        <nav className="hidden lg:flex flex-1 items-stretch">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.screen)}
                className="flex items-center gap-2 px-5 transition-colors duration-100"
                style={{
                  borderRight: "4px solid #0D0D0D",
                  background: active ? "#0D0D0D" : "transparent",
                  color: active ? "#FFD60A" : "#0D0D0D",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "#0D0D0D";
                    e.currentTarget.style.color = "#FFD60A";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0D0D0D";
                  }
                }}
              >
                <Icon size={15} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right actions ───────────────────────────────────────────── */}
        <div className="ml-auto flex items-stretch" style={{ borderLeft: "4px solid #0D0D0D" }}>

          {isLoggedIn ? (
            <>
              {/* Active domain badge */}
              {domain && (
                <div
                  className="hidden md:flex items-center gap-2 px-4"
                  style={{ borderRight: "4px solid #0D0D0D" }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 32, height: 32,
                      background: "#0D0D0D",
                      color: "#FFD60A",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {domain.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", color: "#0D0D0D" }}>
                      {domain}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy size={10} color="#0D0D0D" />
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#0D0D0D" }}>
                        Active Domain
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Streak badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-4"
                style={{ borderRight: "4px solid #0D0D0D", background: "#0D0D0D" }}
              >
                <Flame size={14} color="#FFD60A" />
                <span style={{ fontWeight: 800, color: "#FFD60A", fontSize: "0.9rem" }}>7</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Streak
                </span>
              </div>

              {/* Restart */}
              <button
                onClick={onRestart}
                title="Restart"
                className="flex items-center justify-center transition-colors duration-100"
                style={{
                  width: 56,
                  borderRight: "4px solid #0D0D0D",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0D0D0D")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <RotateCcw size={18} color="#0D0D0D" />
              </button>

              {/* Bell */}
              <button
                title="Notifications"
                className="flex items-center justify-center relative group transition-colors duration-100"
                style={{
                  width: 56,
                  borderRight: "4px solid #0D0D0D",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0D0D0D")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Bell size={18} color="#0D0D0D" />
                <span
                  className="absolute animate-pulse"
                  style={{ top: 10, right: 12, width: 8, height: 8, background: "#FF3B3B", borderRadius: "50%", border: "2px solid #FFD60A" }}
                />
              </button>

              {/* Profile */}
              <button
                title="Profile"
                className="flex items-center justify-center transition-colors duration-100"
                style={{
                  width: 56,
                  background: "#0D0D0D",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0D0D0D")}
              >
                <User size={18} color="#FFD60A" />
              </button>
            </>
          ) : (
            /* ── Guest CTA ── */
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 transition-colors duration-100"
              style={{
                background: "#0D0D0D",
                color: "#FFD60A",
                fontWeight: 900,
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                height: "100%",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0D0D0D")}
            >
              Get Started
              <Sparkles size={15} color="#FFD60A" />
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center transition-colors duration-100"
            style={{
              width: 56,
              borderLeft: "4px solid #0D0D0D",
              background: "transparent",
              cursor: "pointer",
            }}
            onClick={() => setMobileOpen((o) => !o)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0D0D0D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {mobileOpen ? <X size={20} color="#0D0D0D" /> : <Menu size={20} color="#0D0D0D" />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden flex flex-col" style={{ borderTop: "4px solid #0D0D0D" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.screen);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 px-6 py-4 text-left transition-colors duration-100"
                style={{
                  borderBottom: "3px solid #0D0D0D",
                  background: active ? "#0D0D0D" : "#FFD60A",
                  color: active ? "#FFD60A" : "#0D0D0D",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
