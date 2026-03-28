"use client";

import { useState } from "react";
import {
  Flame,
  BookOpen,
  Layers,
  Target,
  Zap,
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
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

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

const ALL_DOMAINS = Object.keys(DOMAIN_META);
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
  const { user, profile, saveProfile, logout } = useAuth();

  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName ?? user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);

  const [editingPrefs, setEditingPrefs] = useState(false);
  const [editDomains, setEditDomains] = useState<string[]>(profile?.preferredDomains ?? []);
  const [editExp, setEditExp] = useState(profile?.experienceLevel ?? "");
  const [editGoal, setEditGoal] = useState(profile?.learningGoal ?? "");
  const [savingPrefs, setSavingPrefs] = useState(false);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Learner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const roleInfo = profile?.role ? ROLE_META[profile.role] : null;
  const goalInfo = profile?.learningGoal ? GOAL_META[profile.learningGoal] : null;
  const expInfo = profile?.experienceLevel ? EXP_META[profile.experienceLevel] : null;
  const sessions = profile?.totalSessions ?? 0;
  const streak = profile?.streak ?? 0;
  const domainsCount = profile?.preferredDomains?.length ?? 0;
  const questionsAnswered = sessions * 8; // 8 questions per session

  // Unlock check
  const isUnlocked = (a: typeof ACHIEVEMENTS[0]) =>
    a.unlockAt(sessions, streak, domainsCount, !!profile?.learningGoal, !!profile?.onboardingComplete);

  const handleSaveName = async () => {
    setSavingName(true);
    try {
      await saveProfile({ displayName: editName });
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await saveProfile({
        preferredDomains: editDomains,
        experienceLevel: editExp as "beginner" | "intermediate" | "advanced",
        learningGoal: editGoal as "placement" | "upskilling" | "academic" | "freelancing" | "curiosity",
      });
      setEditingPrefs(false);
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleEditDomain = (d: string) => {
    setEditDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
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

                {/* Role badge */}
                {roleInfo && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: roleInfo.color, border: "2px solid #0D0D0D", padding: "4px 12px" }}>
                    <roleInfo.icon size={13} color={roleInfo.textColor} strokeWidth={2.5} />
                    <span style={{ fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: roleInfo.textColor }}>{roleInfo.label}</span>
                  </div>
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

        {/* ── TWO COLUMN LAYOUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-cols-1 lg:grid-cols-2">

          {/* LEFT COL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Experience + Goal */}
            <Section title="Learning Profile" accent="#FFD60A">
              {!editingPrefs ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                    onClick={() => { setEditDomains(profile?.preferredDomains ?? []); setEditExp(profile?.experienceLevel ?? ""); setEditGoal(profile?.learningGoal ?? ""); setEditingPrefs(true); }}
                    className="brutal-btn"
                    style={{ width: "100%", padding: "10px", background: "#F5F0E8", fontWeight: 800, fontSize: "0.8rem", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Edit3 size={14} />
                    Edit Preferences
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                      return (
                        <button
                          key={d}
                          onClick={() => onNavigateToDomain(d)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            border: "3px solid #0D0D0D",
                            background: meta.color,
                            boxShadow: `4px 4px 0 ${meta.shadow}`,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.1s ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = `2px 2px 0 ${meta.shadow}`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `4px 4px 0 ${meta.shadow}`; }}
                        >
                          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", border: `2px solid ${meta.textColor === "#FFFFFF" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={18} color={meta.textColor} strokeWidth={2.5} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: meta.textColor }}>{d}</div>
                            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: meta.textColor, opacity: 0.6 }}>
                              {sessions === 0 ? "No attempts yet" : "Tap to start a session"}
                            </div>
                          </div>
                          <ChevronRight size={16} color={meta.textColor} />
                        </button>
                      );
                    })
                  )}
                  <button
                    onClick={() => { setEditDomains(profile?.preferredDomains ?? []); setEditExp(profile?.experienceLevel ?? ""); setEditGoal(profile?.learningGoal ?? ""); setEditingPrefs(true); }}
                    className="brutal-btn"
                    style={{ width: "100%", padding: "10px", background: "#F5F0E8", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}
                  >
                    <Edit3 size={14} />
                    Edit Domains
                  </button>
                </div>
              ) : (
                <div>
                  <Label text="Select Your Domains" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {ALL_DOMAINS.map((d) => {
                      const meta = DOMAIN_META[d];
                      const sel = editDomains.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleEditDomain(d)}
                          style={{ padding: "7px 14px", border: "2px solid #0D0D0D", background: sel ? meta.color : "#FFFFFF", cursor: "pointer", fontWeight: 800, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 5, color: "#0D0D0D", boxShadow: sel ? "2px 2px 0 #0D0D0D" : "3px 3px 0 #0D0D0D", transform: sel ? "translate(1px, 1px)" : "none" }}
                        >
                          {sel && <Check size={12} strokeWidth={3} />}
                          {d}
                        </button>
                      );
                    })}
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

            {/* Streak motivation */}
            <Section title="Your Momentum" accent="#FF3B3B" accentText="#FFFFFF">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Streak visual */}
                <div style={{ padding: "20px", background: "#0D0D0D", border: "2px solid #0D0D0D", display: "flex", alignItems: "center", gap: 14 }}>
                  <Flame size={32} color="#FF3B3B" strokeWidth={2.5} />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: "2rem", color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1 }}>{streak} day{streak !== 1 ? "s" : ""}</div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Current Streak</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: "0.75rem", color: "#FFD60A", letterSpacing: "0.04em" }}>
                      {streak === 0 ? "Start today!" : streak < 3 ? "Keep going!" : streak < 7 ? "You're on fire!" : "Unstoppable! 🏆"}
                    </div>
                  </div>
                </div>

                {/* Weekly dots */}
                <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "12px 0" }}>
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                    const active = i < Math.min(streak, 7);
                    return (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 32, height: 32, background: active ? "#FF3B3B" : "#F5F0E8", border: "2px solid #0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {active && <Flame size={14} color="#FFFFFF" strokeWidth={2.5} />}
                        </div>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#888" }}>{day}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick guidance */}
                <div style={{ padding: "12px 14px", background: "#FFD60A", border: "2px solid #0D0D0D", fontWeight: 700, fontSize: "0.8rem", color: "#0D0D0D", lineHeight: 1.5 }}>
                  💡 Take a quiz today to {streak === 0 ? "start your streak" : "extend your streak"}. Even one session counts!
                </div>
              </div>
            </Section>
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
