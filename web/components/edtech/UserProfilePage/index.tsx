"use client";

import { useState, useMemo } from "react";
import {
  Flame,
  BookOpen,
  Layers,
  TrendingUp,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  Rocket,
  Sparkles,
  Users,
  LogOut,
  Edit3,
  Check,
  X,
  Code2,
  Globe,
  Brain,
  Smartphone,
  BarChart3,
  Shield,
  Cpu,
  Database,
  ChevronRight,
  Star,
  Trophy,
  Zap as ZapIcon,
  Target as TargetIcon,
  BookOpen as BookOpenIcon,
  Clock,
  Trash2,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/lib/AuthContext";
import { EDUCATION_LEVELS, getDomainChipsForLevel } from "@/lib/edtech/educationLevels";

interface UserProfilePageProps {
  onBack: () => void;
  onNavigateToDomain: (domain: string) => void;
}

// ─── Lookup maps ──────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; icon: React.ElementType; color: string; textColor: string }> = {
  student:      { label: "College Student",       icon: GraduationCap, color: "#FFD60A", textColor: "#0D0D0D" },
  professional: { label: "Working Professional",  icon: Briefcase,     color: "#0A84FF", textColor: "#FFFFFF" },
  self_learner: { label: "Self Learner",          icon: BookOpen,      color: "#34C759", textColor: "#0D0D0D" },
  educator:     { label: "Educator",              icon: Users,         color: "#FF9F0A", textColor: "#0D0D0D" },
  other:        { label: "Just Exploring",        icon: Sparkles,      color: "#AF52DE", textColor: "#FFFFFF" },
};

const GOAL_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  placement:   { label: "Crack Placements",       icon: Award,       color: "#FFD60A" },
  upskilling:  { label: "Upskill at Work",        icon: TrendingUp,  color: "#0A84FF" },
  academic:    { label: "Academic Excellence",    icon: GraduationCap, color: "#34C759" },
  freelancing: { label: "Freelancing / Startup",  icon: Rocket,      color: "#FF3B3B" },
  curiosity:   { label: "Pure Curiosity",         icon: Heart,       color: "#AF52DE" },
};

const EXP_META: Record<string, { label: string; sub: string; dots: number }> = {
  beginner:     { label: "Beginner",     sub: "< 1 year",  dots: 1 },
  intermediate: { label: "Intermediate", sub: "1–3 years", dots: 2 },
  advanced:     { label: "Advanced",     sub: "3+ years",  dots: 3 },
};

const DOMAIN_META: Record<string, { icon: React.ElementType; color: string; textColor: string; shadow: string }> = {
  "DSA":           { icon: Code2,     color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00" },
  "Web Dev":       { icon: Globe,     color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC" },
  "Aptitude":      { icon: Brain,     color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43" },
  "App Dev":       { icon: Smartphone,color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25" },
  "Data Science":  { icon: BarChart3, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3" },
  "Cybersecurity": { icon: Shield,    color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00" },
  "IoT":           { icon: Cpu,       color: "#5AC8FA", textColor: "#0D0D0D", shadow: "#3da8d8" },
  "Python":        { icon: Database,  color: "#0D0D0D", textColor: "#FFD60A", shadow: "#333333" },
};

const ALL_GOALS = Object.keys(GOAL_META);
const ALL_EXP = Object.keys(EXP_META);

// ─── Achievements definition ──────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: "first_session",  icon: Star,        label: "First Steps",        desc: "Completed your first quiz session",            unlockAt: (s: number) => s >= 1 },
  { id: "streak_3",       icon: Flame,        label: "On a Roll",          desc: "Maintained a 3-day streak",                   unlockAt: (_: number, streak: number) => streak >= 3 },
  { id: "streak_7",       icon: Flame,        label: "Week Warrior",       desc: "Maintained a 7-day streak",                   unlockAt: (_: number, streak: number) => streak >= 7 },
  { id: "sessions_5",     icon: BookOpenIcon, label: "Committed",          desc: "Completed 5 quiz sessions",                   unlockAt: (s: number) => s >= 5 },
  { id: "sessions_10",    icon: Trophy,       label: "Dedicated Learner",  desc: "Completed 10 quiz sessions",                  unlockAt: (s: number) => s >= 10 },
  { id: "sessions_25",    icon: Trophy,       label: "Knowledge Seeker",   desc: "Completed 25 quiz sessions",                  unlockAt: (s: number) => s >= 25 },
  { id: "multi_domain",   icon: Layers,       label: "Polymath",           desc: "Explored 3 or more domains",                  unlockAt: (_s: number, _st: number, d: number) => d >= 3 },
  { id: "all_domains",    icon: ZapIcon,      label: "Domain Master",      desc: "Explored all 8 domains",                      unlockAt: (_s: number, _st: number, d: number) => d >= 8 },
  { id: "goal_set",       icon: TargetIcon,   label: "Goal Oriented",      desc: "Set a clear learning goal in your profile",   unlockAt: (_s: number, _st: number, _d: number, hasGoal: boolean) => hasGoal },
  { id: "onboarded",      icon: Clock,        label: "Profile Complete",   desc: "Completed your onboarding survey",             unlockAt: (_s: number, _st: number, _d: number, _g: boolean, onboarded: boolean) => onboarded },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function UserProfilePage({ onBack, onNavigateToDomain }: UserProfilePageProps) {
  const { user, profile, saveProfile, logout, resetProfile } = useAuth();

  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName ?? user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);

  const [editingPrefs, setEditingPrefs] = useState(false);
  const [editRole, setEditRole] = useState(profile?.role ?? "student");
  const [editEducationLevel, setEditEducationLevel] = useState(profile?.educationLevel ?? "");
  const [editDomains, setEditDomains] = useState<string[]>(profile?.preferredDomains ?? []);
  const [editExp, setEditExp] = useState(profile?.experienceLevel ?? "");
  const [editGoal, setEditGoal] = useState(profile?.learningGoal ?? "");
  const [savingPrefs, setSavingPrefs] = useState(false);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Learner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const roleInfo = profile?.role ? ROLE_META[profile.role] : null;
  const educationInfo = profile?.educationLevel
    ? EDUCATION_LEVELS.find((level) => level.id === profile.educationLevel) ?? null
    : null;
  const goalInfo = profile?.learningGoal ? GOAL_META[profile.learningGoal] : null;
  const expInfo = profile?.experienceLevel ? EXP_META[profile.experienceLevel] : null;
  const sessions = profile?.totalSessions ?? 0;
  const streak = profile?.streak ?? 0;
  const domainsCount = profile?.preferredDomains?.length ?? 0;
  const questionsAnswered = sessions * 8; // 8 questions per session
  const availableDomainChips = useMemo(
    () => (editEducationLevel ? getDomainChipsForLevel(editEducationLevel) : []),
    [editEducationLevel]
  );

  // Unlock check
  const isUnlocked = (a: typeof ACHIEVEMENTS[0]) =>
    a.unlockAt(sessions, streak, domainsCount, !!profile?.learningGoal, !!profile?.onboardingComplete);

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await saveProfile({ 
        displayName: editName,
        onboardingComplete: true
      });
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await saveProfile({
        role: editRole as any,
        educationLevel: editEducationLevel,
        preferredDomains: editDomains.filter((domain) =>
          availableDomainChips.some((chip) => chip.id === domain)
        ),
        experienceLevel: editExp as "beginner" | "intermediate" | "advanced",
        learningGoal: editGoal as "placement" | "upskilling" | "academic" | "freelancing" | "curiosity",
        onboardingComplete: true,
      });
      setEditingPrefs(false);
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleEditDomain = (d: string) => {
    setEditDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const startEditingPrefs = () => {
    const nextEducationLevel = profile?.educationLevel ?? "";
    setEditRole(profile?.role ?? "other");
    setEditEducationLevel(nextEducationLevel);
    setEditDomains(profile?.preferredDomains ?? []);
    setEditExp(profile?.experienceLevel ?? "");
    setEditGoal(profile?.learningGoal ?? "");
    setEditingPrefs(true);
  };

  const handleEducationLevelChange = (levelId: string) => {
    setEditEducationLevel(levelId);
    const allowedDomains = new Set(getDomainChipsForLevel(levelId).map((chip) => chip.id));
    setEditDomains((prev) => prev.filter((domain) => allowedDomains.has(domain)));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        backgroundImage: "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ── Page header bar ── */}
      <div style={{ borderBottom: "4px solid #0D0D0D", background: "#0D0D0D", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "2px solid rgba(255,214,10,0.4)", padding: "6px 14px", cursor: "pointer", color: "#FFD60A", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}
          >
            ← Back
          </button>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ color: "#FFD60A", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            My Profile
          </span>
        </div>
        <button
          onClick={() => { if (confirm("Sign out?")) logout(); }}
          style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.15)", padding: "6px 14px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 6 }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── HERO CARD ── */}
        <div style={{ background: "#FFFFFF", border: "4px solid #0D0D0D", boxShadow: "8px 8px 0 #0D0D0D", display: "flex", flexWrap: "wrap", gap: 0, overflow: "hidden" }}>
          {/* Left: avatar + identity */}
          <div style={{ flex: "1 1 280px", padding: "32px 28px", borderRight: "4px solid #0D0D0D", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 72, height: 72, background: "#FFD60A", border: "4px solid #0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.6rem", color: "#0D0D0D", flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingName ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="brutal-input"
                      style={{ flex: 1, padding: "8px 12px", fontSize: "1rem", fontWeight: 700, minWidth: 0 }}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    />
                    <button onClick={handleSaveName} disabled={savingName} style={{ width: 36, height: 36, background: "#FFD60A", border: "2px solid #0D0D0D", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={16} color="#0D0D0D" />
                    </button>
                    <button onClick={() => setEditingName(false)} style={{ width: 36, height: 36, background: "#FFFFFF", border: "2px solid #0D0D0D", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <X size={16} color="#0D0D0D" />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em", color: "#0D0D0D", lineHeight: 1.1 }}>{displayName}</span>
                    <button onClick={() => { setEditName(displayName); setEditingName(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAA", display: "flex", padding: 2 }}>
                      <Edit3 size={15} />
                    </button>
                  </div>
                )}
                <div style={{ color: "#888", fontSize: "0.82rem", fontWeight: 500, marginTop: 4 }}>{user?.email}</div>

                {/* Role badge (clickable) */}
                {roleInfo && (
                  <button 
                    onClick={startEditingPrefs}
                    style={{ 
                      display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, 
                      background: roleInfo.color, border: "2px solid #0D0D0D", padding: "4px 12px",
                      cursor: "pointer", transition: "transform 0.1s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                  >
                    <roleInfo.icon size={13} color={roleInfo.textColor} strokeWidth={2.5} />
                    <span style={{ fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: roleInfo.textColor }}>{roleInfo.label}</span>
                    <Edit3 size={10} color={roleInfo.textColor} style={{ marginLeft: 4, opacity: 0.6 }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: stats */}
          <div style={{ flex: "1 1 320px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
            {[
              { icon: Flame,   label: "Day Streak",       value: streak,              color: "#FF3B3B", bg: "#0D0D0D" },
              { icon: BookOpen,label: "Sessions Done",     value: sessions,            color: "#FFD60A", bg: "#0D0D0D" },
              { icon: ZapIcon, label: "Questions Answered",value: questionsAnswered,   color: "#34C759", bg: "#FFFFFF" },
              { icon: Layers,  label: "Domains Explored",  value: domainsCount,        color: "#0A84FF", bg: "#FFFFFF" },
            ].map(({ icon: Icon, label, value, color, bg }, i) => (
              <div
                key={label}
                style={{
                  padding: "24px 20px",
                  background: bg,
                  borderLeft: "4px solid #0D0D0D",
                  borderBottom: i < 2 ? "4px solid #0D0D0D" : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Icon size={22} color={color} strokeWidth={2.5} />
                <div style={{ fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.04em", color: bg === "#0D0D0D" ? "#FFFFFF" : "#0D0D0D", lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: bg === "#0D0D0D" ? "rgba(255,255,255,0.45)" : "#888" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITY HEATMAP ── */}
        <ActivityHeatmap 
          streak={streak} 
          sessions={sessions} 
          userId={user?.uid ?? ""} 
          activityLog={profile?.activityLog} 
        />

        {/* ── SMART RECOMMENDATIONS ── */}
        <SmartRecommendations profile={profile} onNavigateToDomain={onNavigateToDomain} />

        {/* ── TWO COLUMN LAYOUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-cols-1 lg:grid-cols-2">

          {/* LEFT COL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Experience + Goal */}
            <Section title="Learning Profile" accent="#FFD60A">
              {!editingPrefs ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Ed Level (clickable) */}
                  {educationInfo && (
                    <div onClick={startEditingPrefs} style={{ cursor: "pointer" }}>
                      <Label text="Education Level" />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: educationInfo.color, border: "2px solid #0D0D0D", position: "relative" }}>
                        <educationInfo.icon size={18} color={educationInfo.textColor} strokeWidth={2.5} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: educationInfo.textColor }}>{educationInfo.label}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: educationInfo.textColor, opacity: 0.75 }}>{educationInfo.sub}</span>
                        </div>
                        <Edit3 size={14} color={educationInfo.textColor} style={{ marginLeft: "auto", opacity: 0.5 }} />
                      </div>
                    </div>
                  )}
                  {/* Exp */}
                  {expInfo && (
                    <div>
                      <Label text="Experience Level" />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#0D0D0D", border: "2px solid #0D0D0D" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3].map((i) => (
                            <div key={i} style={{ width: 13, height: 13, background: i <= expInfo.dots ? "#FFD60A" : "rgba(255,255,255,0.15)", border: "2px solid #FFD60A" }} />
                          ))}
                        </div>
                        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#FFD60A" }}>{expInfo.label}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginLeft: "auto" }}>{expInfo.sub}</span>
                      </div>
                    </div>
                  )}
                  {/* Goal */}
                  {goalInfo && (
                    <div>
                      <Label text="Learning Goal" />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: goalInfo.color, border: "2px solid #0D0D0D" }}>
                        <goalInfo.icon size={18} color="#0D0D0D" strokeWidth={2.5} />
                        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0D0D0D" }}>{goalInfo.label}</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={startEditingPrefs}
                    className="brutal-btn"
                    style={{ width: "100%", padding: "10px", background: "#F5F0E8", fontWeight: 800, fontSize: "0.8rem", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Edit3 size={14} />
                    Edit Preferences
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Edit Role */}
                  <div>
                    <Label text="Your Role" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {Object.entries(ROLE_META).map(([key, meta]) => {
                        const Icon = meta.icon;
                        const sel = editRole === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setEditRole(key as any)}
                            style={{ 
                              display: "flex", alignItems: "center", gap: 8, padding: "10px", 
                              border: "2px solid #0D0D0D", background: sel ? meta.color : "#F5F0E8", 
                              cursor: "pointer", textAlign: "left", transition: "all 0.1s ease",
                              color: sel ? meta.textColor : "#0D0D0D",
                              boxShadow: sel ? "2px 2px 0 #0D0D0D" : "4px 4px 0 #0D0D0D",
                              transform: sel ? "translate(2px, 2px)" : "none"
                            }}
                          >
                            <Icon size={14} color={sel ? meta.textColor : "#888"} />
                            <span style={{ fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase" }}>{meta.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Edit Ed Level */}
                  <div>
                    <Label text="Education Level" />
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(1, 1fr)", 
                      gap: 8, 
                      maxHeight: "360px", 
                      overflowY: "auto",
                      paddingRight: "8px",
                      border: "3px solid #0D0D0D",
                      padding: "12px",
                      background: "#FFFFFF",
                      boxShadow: "inset 4px 4px 0 rgba(0,0,0,0.05)"
                    }}>
                      {EDUCATION_LEVELS.map((level) => {
                        const Icon = level.icon;
                        const sel = editEducationLevel === level.id;
                        return (
                          <button
                            key={level.id}
                            onClick={() => handleEducationLevelChange(level.id)}
                            style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 10, 
                              padding: "10px 12px", 
                              border: "2px solid #0D0D0D", 
                              background: sel ? level.color : "#F5F0E8", 
                              cursor: "pointer", 
                              textAlign: "left", 
                              boxShadow: sel ? "2px 2px 0 #0D0D0D" : "3px 3px 0 #0D0D0D", 
                              transform: sel ? "translate(1px, 1px)" : "none",
                              flexShrink: 0
                            }}
                          >
                            <Icon size={16} color={sel ? level.textColor : "#0D0D0D"} strokeWidth={2.5} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <span style={{ fontWeight: 800, fontSize: "0.82rem", color: sel ? level.textColor : "#0D0D0D" }}>{level.label}</span>
                              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: sel ? level.textColor : "#888", opacity: sel ? 0.75 : 1 }}>{level.sub}</span>
                            </div>
                            {sel && <Check size={14} color={level.textColor} style={{ marginLeft: "auto" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Edit Exp */}
                  <div>
                    <Label text="Experience Level" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {ALL_EXP.map((key) => {
                        const m = EXP_META[key];
                        const sel = editExp === key;
                        return (
                          <button key={key} onClick={() => setEditExp(key)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2px solid #0D0D0D", background: sel ? "#0D0D0D" : "#F5F0E8", cursor: "pointer", textAlign: "left", boxShadow: sel ? "2px 2px 0 #0D0D0D" : "3px 3px 0 #0D0D0D", transform: sel ? "translate(1px, 1px)" : "none" }}>
                            <div style={{ display: "flex", gap: 3 }}>{[1,2,3].map((i) => <div key={i} style={{ width: 10, height: 10, background: i <= m.dots ? (sel ? "#FFD60A" : "#0D0D0D") : (sel ? "rgba(255,255,255,0.2)" : "#DDD"), border: `2px solid ${sel ? "#FFD60A" : "#0D0D0D"}` }} />)}</div>
                            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: sel ? "#FFD60A" : "#0D0D0D" }}>{m.label}</span>
                            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: sel ? "rgba(255,255,255,0.5)" : "#888", marginLeft: "auto" }}>{m.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Edit Goal */}
                  <div>
                    <Label text="Learning Goal" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {ALL_GOALS.map((key) => {
                        const m = GOAL_META[key];
                        const Icon = m.icon;
                        const sel = editGoal === key;
                        return (
                          <button key={key} onClick={() => setEditGoal(key)}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "2px solid #0D0D0D", background: sel ? m.color : "#F5F0E8", cursor: "pointer", textAlign: "left", boxShadow: sel ? "2px 2px 0 #0D0D0D" : "3px 3px 0 #0D0D0D", transform: sel ? "translate(1px, 1px)" : "none" }}>
                            <Icon size={16} color="#0D0D0D" strokeWidth={2.5} />
                            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0D0D0D" }}>{m.label}</span>
                            {sel && <Check size={14} color="#0D0D0D" style={{ marginLeft: "auto" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingPrefs(false)} className="brutal-btn" style={{ flex: 1, padding: "10px", background: "#FFFFFF", fontWeight: 800, fontSize: "0.8rem" }}>Cancel</button>
                    <button onClick={handleSavePrefs} disabled={savingPrefs} className="brutal-btn" style={{ flex: 2, padding: "10px", background: "#FFD60A", fontWeight: 800, fontSize: "0.8rem" }}>
                      {savingPrefs ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </Section>

            {/* Achievements */}
            <Section title="Achievements" accent="#0D0D0D" accentText="#FFD60A">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {ACHIEVEMENTS.map((a) => {
                  const unlocked = isUnlocked(a);
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.id}
                      title={a.desc}
                      style={{
                        padding: "12px 10px",
                        border: "2px solid #0D0D0D",
                        background: unlocked ? "#0D0D0D" : "#F5F0E8",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        opacity: unlocked ? 1 : 0.45,
                        boxShadow: unlocked ? "3px 3px 0 #0D0D0D" : "2px 2px 0 #DDD",
                      }}
                    >
                      <Icon size={18} color={unlocked ? "#FFD60A" : "#888"} strokeWidth={2.5} />
                      <div style={{ fontWeight: 800, fontSize: "0.75rem", color: unlocked ? "#FFD60A" : "#666", lineHeight: 1.2 }}>{a.label}</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 500, color: unlocked ? "rgba(255,255,255,0.5)" : "#AAA", lineHeight: 1.3 }}>{a.desc}</div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* RIGHT COL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Preferred Domains */}
            <Section title="Your Domains" accent="#34C759">
              {!editingPrefs ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(profile?.preferredDomains ?? []).length === 0 ? (
                    <div style={{ padding: "20px", background: "#F5F0E8", border: "2px solid #0D0D0D", textAlign: "center", color: "#888", fontWeight: 700, fontSize: "0.82rem" }}>
                      No domains selected yet.
                    </div>
                  ) : (
                    (profile?.preferredDomains ?? []).map((d) => {
                      const meta = DOMAIN_META[d] ?? { icon: Code2, color: "#E5E5E5", textColor: "#0D0D0D", shadow: "#CCC" };
                      const Icon = meta.icon;
                      // Get top 3 topics by mastery for this domain
                      const domainMastery = profile?.topicMastery?.[d] || {};
                      const topTopics = Object.entries(domainMastery)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 2);

                      return (
                        <div
                          key={d}
                          style={{
                            padding: "16px",
                            border: "3px solid #0D0D0D",
                            background: meta.color,
                            boxShadow: `4px 4px 0 ${meta.shadow}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <div
                            onClick={() => onNavigateToDomain(d)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", border: `2px solid ${meta.textColor === "#FFFFFF" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={18} color={meta.textColor} strokeWidth={2.5} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: meta.textColor }}>{d}</div>
                              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: meta.textColor, opacity: 0.6 }}>
                                {sessions === 0 ? "No attempts yet" : "Click to continue path"}
                              </div>
                            </div>
                            <ChevronRight size={16} color={meta.textColor} />
                          </div>

                          {/* Topic Mastery Bars */}
                          {topTopics.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 10, borderTop: `2px solid ${meta.textColor === "#FFFFFF" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}` }}>
                              {topTopics.map(([topic, score]) => (
                                <div key={topic}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 800, color: meta.textColor, textTransform: "uppercase" }}>{topic}</span>
                                    <span style={{ fontSize: "0.65rem", fontWeight: 900, color: meta.textColor }}>{score}%</span>
                                  </div>
                                  <div style={{ height: 6, background: "rgba(0,0,0,0.1)", border: `1px solid ${meta.textColor === "#FFFFFF" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)"}` }}>
                                    <div style={{ height: "100%", width: `${score}%`, background: meta.textColor === "#FFFFFF" ? "#FFFFFF" : "#0D0D0D" }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <button
                    onClick={startEditingPrefs}
                    className="brutal-btn"
                    style={{ width: "100%", padding: "10px", background: "#F5F0E8", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}
                  >
                    <Edit3 size={14} />
                    Edit Domains
                  </button>
                </div>
              ) : (
                <div>
                  <Label text={editEducationLevel ? "Select Your Domains" : "Pick an Education Level First"} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {availableDomainChips.map(({ id, label, color }) => {
                      const meta = DOMAIN_META[id] ?? { color, textColor: "#0D0D0D", icon: Code2, shadow: "#CCC" };
                      const d = id;
                      const sel = editDomains.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleEditDomain(d)}
                          style={{ padding: "7px 14px", border: "2px solid #0D0D0D", background: sel ? meta.color : "#FFFFFF", cursor: "pointer", fontWeight: 800, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 5, color: "#0D0D0D", boxShadow: sel ? "2px 2px 0 #0D0D0D" : "3px 3px 0 #0D0D0D", transform: sel ? "translate(1px, 1px)" : "none" }}
                        >
                          {sel && <Check size={12} strokeWidth={3} />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {editEducationLevel && availableDomainChips.length === 0 && (
                    <div style={{ padding: "12px", background: "#FFFFFF", border: "2px solid #0D0D0D", fontSize: "0.8rem", fontWeight: 700, color: "#666", marginBottom: 12 }}>
                      No domain presets found for this education level yet.
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingPrefs(false)} className="brutal-btn" style={{ flex: 1, padding: "10px", background: "#FFFFFF", fontWeight: 800, fontSize: "0.8rem" }}>Cancel</button>
                    <button onClick={handleSavePrefs} disabled={savingPrefs} className="brutal-btn" style={{ flex: 2, padding: "10px", background: "#FFD60A", fontWeight: 800, fontSize: "0.8rem" }}>
                      {savingPrefs ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </Section>

            {/* achievements section above */}

            {/* Community Rank Mock */}
            <Section title="Community Rank" accent="#AF52DE" accentText="#FFFFFF">
              <div style={{ padding: "12px", background: "#0D0D0D", border: "2px solid #0D0D0D", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, background: "#AF52DE", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0D0D0D", flexShrink: 0 }}>
                  <Trophy size={22} color="#FFFFFF" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ color: "#FFFFFF", fontWeight: 900, fontSize: "1.2rem", lineHeight: 1 }}>Top 12%</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>Global Learner Rank</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "You", score: `${questionsAnswered}`, rank: 1242, isMe: true },
                  { name: "CodeMaster", score: "1520", rank: 1241, isMe: false },
                  { name: "NexusDev", score: "1105", rank: 1243, isMe: false },
                ].map((p) => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", padding: "6px 10px", background: p.isMe ? "#AF52DE" : "#F5F0E8", border: "2px solid #0D0D0D", opacity: p.isMe ? 1 : 0.6 }}>
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", width: 40, color: p.isMe ? "#FFF" : "#000" }}>#{p.rank}</span>
                    <span style={{ fontWeight: 800, fontSize: "0.75rem", flex: 1, color: p.isMe ? "#FFF" : "#000" }}>{p.name}</span>
                    <span style={{ fontWeight: 900, fontSize: "0.75rem", color: p.isMe ? "#FFF" : "#000" }}>{p.score} pts</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* ── DANGER ZONE ── */}
        <div style={{ marginTop: 20 }}>
          <Section title="Danger Zone" accent="#FF3B3B" accentText="#FFFFFF">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0D0D0D" }}>Reset Account Progress</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666", marginTop: 4 }}>
                  This will permanently wipe your streaks, session history, and topic mastery. This cannot be undone.
                </div>
              </div>
              <button
                onClick={async () => {
                  if (confirm("⚠️ ARE YOU ABSOLUTELY SURE? This will wipe ALL your learning progress, history, and streaks permanently.")) {
                    try {
                      await resetProfile();
                      alert("Profile Reset Successfully! Starting from scratch...");
                      onBack(); // Go back to landing/domains
                    } catch (err) {
                      alert("Reset failed. Please try again.");
                    }
                  }
                }}
                className="brutal-btn"
                style={{ 
                  background: "#FF3B3B", color: "#FFFFFF", padding: "12px 24px", 
                  fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                <Trash2 size={18} />
                Wipe All Data
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────
const HEAT_COLORS = [
  "#EDEAE0", // 0 — empty (matches cream bg)
  "#9BE9A8", // 1 — light green
  "#40C463", // 2 — medium
  "#30A14E", // 3 — dark
  "#216E39", // 4 — darkest
];

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS  = ["","Mon","","Wed","","Fri",""];

// Seeded pseudo-random so it's stable per user
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildActivityData(streak: number, sessions: number, uid: string, activityLog?: Record<string, number>): number[] {
  const DAYS = 371; // 53 weeks × 7
  const activity = Array.from({ length: DAYS }, () => 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Map each cell in the 371-day grid to a specific date
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    
    // Format to YYYY-MM-DD to match our log keys
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    if (activityLog && activityLog[iso]) {
      const count = activityLog[iso];
      // Cap at 4 levels
      activity[i] = count >= 4 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1;
    }
  }

  // Fallback: If map is empty but sessions > 0, scatter some mock data
  // (This handles users who had sessions before we added activityLog)
  const loggedDays = Object.keys(activityLog || {}).length;
  if (loggedDays === 0 && sessions > 0) {
    const seed = uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) || 42;
    const rand = seededRand(seed);
    const activityDensity = Math.min(sessions / 30, 0.4);
    for (let i = 0; i < DAYS - streak; i++) {
      const r = rand();
      if (r < activityDensity) {
        activity[i] = r < activityDensity * 0.2 ? 4 : r < activityDensity * 0.6 ? 2 : 1;
      }
    }
    // Stamp the current streak
    for (let i = 0; i < streak; i++) {
      activity[DAYS - 1 - i] = 3;
    }
  }

  return activity;
}

function ActivityHeatmap({ streak, sessions, userId, activityLog }: { streak: number; sessions: number; userId: string; activityLog?: Record<string, number> }) {
  const WEEKS = 53;
  const CELL = 13;
  const GAP  = 3;

  // Build flat day array using real log
  const activity = useMemo(() => buildActivityData(streak, sessions, userId, activityLog), [streak, sessions, userId, activityLog]);

  // Figure out which column each week starts on for month labels
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));

  // Build weeks as 2D: weeks[w][d] = level
  const weeks: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(activity.slice(w * 7, w * 7 + 7));
  }

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + w * 7);
    if (w === 0 || d.getDate() <= 7) {
      const label = MONTH_NAMES[d.getMonth()];
      if (!monthLabels.length || monthLabels[monthLabels.length - 1].label !== label) {
        monthLabels.push({ label, col: w });
      }
    }
  }

  const totalActive = activity.filter((v) => v > 0).length;
  const gridW = WEEKS * (CELL + GAP);

  return (
    <div style={{ background: "#FFFFFF", border: "3px solid #0D0D0D", boxShadow: "6px 6px 0 #0D0D0D", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#0D0D0D", borderBottom: "3px solid #0D0D0D", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Flame size={15} color="#FF3B3B" strokeWidth={2.5} />
          <span style={{ fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#FFFFFF" }}>Activity Heatmap</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{totalActive} active days this year</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Less</span>
            {HEAT_COLORS.map((c, i) => (
              <div key={i} style={{ width: 11, height: 11, background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
            ))}
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>More</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, minWidth: gridW + 36 }}>

          {/* Day labels (left side) */}
          <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 8, paddingTop: 22 }}>
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{ height: CELL, display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#AAA", width: 28, textAlign: "right" }}>{d}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ flex: 1 }}>
            {/* Month labels */}
            <div style={{ display: "flex", height: 18, marginBottom: 4, position: "relative", width: gridW }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={`${label}-${col}`}
                  style={{
                    position: "absolute",
                    left: col * (CELL + GAP),
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Cells (columns = weeks, rows = days) */}
            <div style={{ display: "flex", gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                  {week.map((level, di) => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + wi * 7 + di);
                    const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                    return (
                      <div
                        key={di}
                        title={level > 0 ? `${dateStr} — ${level} session${level > 1 ? "s" : ""}` : dateStr}
                        style={{
                          width: CELL,
                          height: CELL,
                          background: HEAT_COLORS[level],
                          border: `1px solid ${level === 0 ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.12)"}`,
                          cursor: level > 0 ? "pointer" : "default",
                          transition: "transform 0.1s ease",
                        }}
                        onMouseEnter={(e) => { if (level > 0) (e.currentTarget as HTMLDivElement).style.transform = "scale(1.3)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer stats */}
        <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "Current Streak", value: `${streak} day${streak !== 1 ? "s" : ""}`, color: "#FF3B3B", icon: Flame },
            { label: "Total Sessions", value: sessions.toString(), color: "#216E39", icon: BookOpenIcon },
            { label: "Active Days", value: totalActive.toString(), color: "#30A14E", icon: ZapIcon },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon size={13} color={color} strokeWidth={2.5} />
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0D0D0D" }}>{value}</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#AAA" }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 700, color: streak === 0 ? "#FF3B3B" : streak < 7 ? "#FF9F0A" : "#216E39" }}>
            {streak === 0 ? "⚡ Start your streak today!" : streak < 3 ? "🔥 Keep it going!" : streak < 7 ? "🔥 You're on fire!" : "🏆 Unstoppable!"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────
function Section({
  title, accent = "#FFD60A", accentText = "#0D0D0D", children,
}: {
  title: string; accent?: string; accentText?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#FFFFFF", border: "3px solid #0D0D0D", boxShadow: "6px 6px 0 #0D0D0D", overflow: "hidden" }}>
      <div style={{ background: accent, borderBottom: "3px solid #0D0D0D", padding: "10px 16px" }}>
        <span style={{ fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: accentText }}>{title}</span>
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <div style={{ fontWeight: 800, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: 6 }}>{text}</div>;
}

// ─── Smart Recommendations Component ──────────────────────────────────────
function SmartRecommendations({ profile, onNavigateToDomain }: { profile: UserProfile | null; onNavigateToDomain: (d: string) => void }) {
  // Find topics < 60% score in preferred domains
  const recommendations: { domain: string; topic: string; score: number }[] = [];
  
  if (profile?.topicMastery) {
    Object.entries(profile.topicMastery as Record<string, Record<string, number>>).forEach(([domain, topics]) => {
      if (profile.preferredDomains?.includes(domain)) {
        Object.entries(topics).forEach(([topic, score]) => {
          if (score < 70) {
            recommendations.push({ domain, topic, score });
          }
        });
      }
    });
  }

  // Sort by lowest score
  const focusTopics = recommendations.sort((a, b) => a.score - b.score).slice(0, 2);

  if (focusTopics.length === 0) return null;

  return (
    <div style={{ background: "#FF9F0A", border: "4px solid #0D0D0D", boxShadow: "8px 8px 0 #0D0D0D", padding: "20px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
      {/* Icon + Intro */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0D0D0D" }}>
          <Sparkles size={22} color="#FFD60A" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0D0D0D", letterSpacing: "-0.02em" }}>Recommended Next Steps</div>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Based on your focus areas</div>
        </div>
      </div>

      {/* Recs */}
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {focusTopics.map((rec) => (
          <div key={rec.topic} style={{ flex: "1 1 200px", padding: "14px", background: "#FFFFFF", border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: "0.9rem", color: "#0D0D0D" }}>{rec.topic}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#888" }}>{rec.domain} · {rec.score}% Mastered</div>
            </div>
            <button 
              onClick={() => onNavigateToDomain(rec.domain)}
              style={{ padding: "8px 12px", background: "#0D0D0D", color: "#FFD60A", fontWeight: 800, fontSize: "0.7rem", border: "none", cursor: "pointer", transition: "transform 0.1s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Master Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
