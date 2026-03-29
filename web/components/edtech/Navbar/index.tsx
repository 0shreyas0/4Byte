"use client";

import { useState, useRef } from "react";
import {
  BookOpen,
  Layers,
  BarChart3,
  Menu,
  X,
  Bell,
  Trophy,
  Flame,
  Sparkles,
  RotateCcw,
  HomeIcon,
  User,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import ProfilePanel from "@/components/edtech/ProfilePanel";
import PixelCat from "@/components/edtech/PixelCat";
import NotificationCenter from "@/components/edtech/NotificationCenter";
import BrandLogo from "@/components/edtech/BrandLogo";

export type Screen =
  | "auth"
  | "landing"
  | "onboarding"
  | "profile"
  | "domain-select"
  | "mode-select"
  | "timeline"
  | "learning-concept"
  | "quiz"
  | "coding-lab"
  | "processing"
  | "results"
  | "simulation"
  | "library"
  | "sandbox"
  | "web-sandbox";

interface NavbarProps {
  screen: Screen;
  domain: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
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
  {
    label: "Library",
    icon: BookOpen,
    screen: "library",
    group: ["library"],
  },
];

export default function Navbar({ 
  screen, 
  domain, 
  searchQuery = "",
  onSearchChange,
  onNavigate, 
  onRestart, 
  onGetStarted 
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { user, profile } = useAuth();

  const isActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.group.includes(screen);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ background: "#FFD60A", borderBottom: "4px solid #0D0D0D" }}
    >
      <div className="max-w-screen-2xl mx-auto flex items-stretch" style={{ height: 64 }}>

        {/* ── Brand ──────────────────────────────────────────────────── */}
        <button
          onClick={onRestart}
          className="flex items-center gap-4 px-8 shrink-0 cursor-pointer h-full"
          style={{ borderRight: "4px solid #0D0D0D", background: "transparent" }}
        >
          <BrandLogo />
        </button>

        {/* ── Desktop nav links ───────────────────────────────────────── */}
        <nav className="hidden lg:flex items-stretch">
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
              >
                <Icon size={15} className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Middle section: search on relevant screens, cat elsewhere ── */}
        {(["library", "domain-select", "results"] as Screen[]).includes(screen) ? (
          <div
            className="hidden lg:flex items-center flex-1 px-4"
            style={{
              borderLeft: "4px solid #0D0D0D",
              borderRight: "4px solid #0D0D0D",
              background: searchFocused ? "#FFD60A" : "#0D0D0D",
              transition: "background 0.15s",
            }}
          >
            <Search
              size={15}
              color={searchFocused ? "#0D0D0D" : "#FFD60A"}
              style={{ flexShrink: 0, transition: "color 0.15s" }}
            />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search topics, concepts…"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                marginLeft: 10,
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: searchFocused ? "#0D0D0D" : "#FFD60A",
                caretColor: searchFocused ? "#0D0D0D" : "#FFD60A",
                transition: "color 0.15s",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { onSearchChange?.(""); searchRef.current?.focus(); }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 4px",
                  color: searchFocused ? "#0D0D0D" : "#FFD60A",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  transition: "color 0.15s",
                }}
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <div
            className="hidden lg:flex flex-1"
            style={{ borderLeft: "4px solid #0D0D0D", borderRight: "4px solid #0D0D0D", overflow: "hidden" }}
          >
            <PixelCat />
          </div>
        )}

        {/* ── Right actions ───────────────────────────────────────────── */}
        <div className="flex items-stretch h-full">

          {user ? (
            <div className="flex items-stretch h-full">
              {/* Active domain badge */}
              {domain && (
                <div
                  className="hidden md:flex items-center gap-2 px-4 h-full"
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
                    }}
                  >
                    {domain.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", color: "#0D0D0D" }}>
                      {domain}
                    </div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, opacity: 0.6, textTransform: "uppercase" }}>
                      Active
                    </div>
                  </div>
                </div>
              )}

              {/* Streak badge */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-4 h-full"
                style={{ borderRight: "4px solid #0D0D0D", background: "rgba(0,0,0,0.05)" }}
              >
                <Flame size={14} color="#0D0D0D" fill="#0D0D0D" />
                <span style={{ fontWeight: 900, color: "#0D0D0D", fontSize: "0.95rem" }}>{profile?.streak ?? 0}</span>
              </div>

              {/* Bell */}
              <button
                title="Notifications"
                onClick={() => setNotifOpen(prev => !prev)}
                className="flex items-center justify-center relative transition-colors duration-100 h-full"
                style={{
                  width: 56,
                  borderRight: "4px solid #0D0D0D",
                  background: notifOpen ? "#0D0D0D" : "transparent",
                  cursor: "pointer",
                }}
              >
                <Bell size={18} color={notifOpen ? "#FFD60A" : "#0D0D0D"} />
                {unreadCount > 0 && (
                  <span
                    className="absolute"
                    style={{ top: 12, right: 14, width: 8, height: 8, background: "#FF3B3B", borderRadius: "50%", border: "2px solid #FFD60A" }}
                  />
                )}
              </button>

              {/* Profile button */}
              <button
                title="My Profile"
                onClick={() => setProfileOpen(true)}
                className="flex items-center justify-center px-4 h-full transition-colors duration-100"
                style={{
                  background: "#FFD60A",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 34, height: 34,
                    background: "#0D0D0D",
                    border: "2px solid #0D0D0D",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: "0.75rem", color: "#FFD60A",
                  }}
                >
                  {profile?.displayName
                    ? profile.displayName.slice(0, 2).toUpperCase()
                    : user.email?.slice(0, 2).toUpperCase() ?? <User size={14} />}
                </div>
              </button>
            </div>
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

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} onNavigate={onNavigate} />
      <NotificationCenter 
        open={notifOpen} 
        onClose={() => setNotifOpen(false)} 
        onNewNotificationCount={setUnreadCount}
      />
    </header>
  );
}
