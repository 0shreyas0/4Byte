"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
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
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import type { Screen } from "@/components/edtech/Navbar";

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (screen: Screen) => void;
}

const ROLE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  student: { label: "College Student", icon: GraduationCap, color: "#FFD60A" },
  professional: { label: "Working Professional", icon: Briefcase, color: "#0A84FF" },
  self_learner: { label: "Self Learner", icon: BookOpen, color: "#34C759" },
  educator: { label: "Educator", icon: Users, color: "#FF9F0A" },
  other: { label: "Just Exploring", icon: Sparkles, color: "#AF52DE" },
};

const GOAL_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  placement: { label: "Crack Placements", icon: Award },
  upskilling: { label: "Upskill at Work", icon: TrendingUp },
  academic: { label: "Academic Excellence", icon: GraduationCap },
  freelancing: { label: "Freelancing / Startup", icon: Rocket },
  curiosity: { label: "Pure Curiosity", icon: Heart },
};

const EXP_LABELS: Record<string, { label: string; dots: number }> = {
  beginner: { label: "Beginner", dots: 1 },
  intermediate: { label: "Intermediate", dots: 2 },
  advanced: { label: "Advanced", dots: 3 },
};

const DOMAIN_COLORS: Record<string, string> = {
  DSA: "#FFD60A",
  "Web Dev": "#0A84FF",
  Python: "#0D0D0D",
  "App Dev": "#FF3B3B",
  "Data Science": "#AF52DE",
  Cybersecurity: "#FF9F0A",
  IoT: "#5AC8FA",
  Aptitude: "#34C759",
};

export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { user, profile, logout, saveProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.displayName ?? user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditName(profile?.displayName ?? user?.displayName ?? "");
  }, [profile, user]);

  if (!open) return null;

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Learner";
  const initials = displayName.slice(0, 2).toUpperCase();
  const roleInfo = profile?.role ? ROLE_LABELS[profile.role] : null;
  const goalInfo = profile?.learningGoal ? GOAL_LABELS[profile.learningGoal] : null;
  const expInfo = profile?.experienceLevel ? EXP_LABELS[profile.experienceLevel] : null;

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await saveProfile({ displayName: editName });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Log out?")) {
      await logout();
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 200,
          animation: "fade-in 0.15s ease forwards",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(420px, 92vw)",
          background: "#F5F0E8",
          borderLeft: "4px solid #0D0D0D",
          boxShadow: "-8px 0 0 #0D0D0D",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slide-in-right 0.2s ease forwards",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#0D0D0D",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "4px solid #0D0D0D",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <User size={16} color="#FFD60A" strokeWidth={2.5} />
            <span style={{ fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFD60A" }}>
              My Profile
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              background: "transparent",
              border: "2px solid rgba(255,214,10,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "#FFD60A",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* Avatar + Name */}
          <div
            style={{
              background: "#FFFFFF",
              border: "3px solid #0D0D0D",
              boxShadow: "5px 5px 0 #0D0D0D",
              padding: "20px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div
                style={{
                  width: 56, height: 56,
                  background: "#FFD60A",
                  border: "3px solid #0D0D0D",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "1.2rem", color: "#0D0D0D",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {editing ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="brutal-input"
                      style={{ flex: 1, padding: "6px 10px", fontSize: "0.9rem", minWidth: 0 }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      style={{
                        width: 34, height: 34,
                        background: "#FFD60A",
                        border: "2px solid #0D0D0D",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={16} color="#0D0D0D" />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: "1.05rem", color: "#0D0D0D", letterSpacing: "-0.02em" }}>
                      {displayName}
                    </span>
                    <button
                      onClick={() => setEditing(true)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex" }}
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <Mail size={12} color="#888" />
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#888" }}>{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 0, border: "3px solid #0D0D0D", overflow: "hidden" }}>
              {[
                { icon: Flame, label: "Streak", value: `${profile?.streak ?? 0}d`, color: "#FF3B3B" },
                { icon: BookOpen, label: "Sessions", value: `${profile?.totalSessions ?? 0}`, color: "#0A84FF" },
                { icon: Layers, label: "Domains", value: `${profile?.preferredDomains?.length ?? 0}`, color: "#34C759" },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    textAlign: "center",
                    borderRight: i < 2 ? "3px solid #0D0D0D" : "none",
                    background: "#F5F0E8",
                  }}
                >
                  <Icon size={16} color={color} style={{ margin: "0 auto 4px" }} />
                  <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0D0D0D", letterSpacing: "-0.02em" }}>{value}</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Info */}
          {roleInfo && (
            <Section title="Role" icon={<roleInfo.icon size={14} color="#0D0D0D" />}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: roleInfo.color, border: "2px solid #0D0D0D" }}>
                <roleInfo.icon size={18} color="#0D0D0D" strokeWidth={2.5} />
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0D0D0D" }}>{roleInfo.label}</span>
              </div>
            </Section>
          )}

          {/* Experience */}
          {expInfo && (
            <Section title="Experience Level" icon={<Zap size={14} color="#0D0D0D" />}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#0D0D0D", border: "2px solid #0D0D0D" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 14, height: 14,
                        background: i <= expInfo.dots ? "#FFD60A" : "rgba(255,255,255,0.15)",
                        border: "2px solid #FFD60A",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#FFD60A" }}>{expInfo.label}</span>
              </div>
            </Section>
          )}

          {/* Goal */}
          {goalInfo && (
            <Section title="Learning Goal" icon={<Target size={14} color="#0D0D0D" />}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#FFFFFF", border: "2px solid #0D0D0D" }}>
                <goalInfo.icon size={18} color="#0D0D0D" strokeWidth={2.5} />
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0D0D0D" }}>{goalInfo.label}</span>
              </div>
            </Section>
          )}

          {/* Preferred Domains */}
          {profile?.preferredDomains && profile.preferredDomains.length > 0 && (
            <Section title="Preferred Domains" icon={<Layers size={14} color="#0D0D0D" />}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.preferredDomains.map((d) => (
                  <span
                    key={d}
                    style={{
                      padding: "6px 14px",
                      background: DOMAIN_COLORS[d] ?? "#E5E5E5",
                      border: "2px solid #0D0D0D",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      letterSpacing: "0.02em",
                      color: d === "Python" ? "#FFD60A" : "#0D0D0D",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* No profile yet notice */}
          {!profile?.onboardingComplete && (
            <div
              style={{
                background: "#FFD60A",
                border: "3px solid #0D0D0D",
                boxShadow: "4px 4px 0 #0D0D0D",
                padding: "16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: 6 }}>
                ⚡ Profile incomplete
              </div>
              <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "#333" }}>
                Complete the onboarding survey to personalize your learning path.
              </p>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div
          style={{
            borderTop: "4px solid #0D0D0D",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexShrink: 0,
            background: "#FFFFFF",
          }}
        >
          <button
            onClick={handleLogout}
            className="brutal-btn flex items-center justify-center gap-2"
            style={{
              width: "100%",
              padding: "12px",
              background: "#0D0D0D",
              color: "#FFD60A",
              fontWeight: 800,
              fontSize: "0.88rem",
              letterSpacing: "0.04em",
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 8,
          fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666",
        }}
      >
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
