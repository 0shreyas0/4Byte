"use client";

import { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Award,
  Heart,
  ChevronRight,
  Check,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  EDUCATION_LEVELS,
  getDomainChipsForLevel,
} from "@/lib/edtech/educationLevels";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4;

const ROLES = [
  { id: "student", label: "College Student", icon: GraduationCap, desc: "Currently enrolled in a CS/tech program", color: "#FFD60A", textColor: "#0D0D0D" },
  { id: "professional", label: "Working Professional", icon: Briefcase, desc: "Already in the industry, leveling up", color: "#0A84FF", textColor: "#FFFFFF" },
  { id: "self_learner", label: "Self Learner", icon: BookOpen, desc: "Learning independently on my own pace", color: "#34C759", textColor: "#0D0D0D" },
  { id: "educator", label: "Educator", icon: Users, desc: "Teaching or mentoring others", color: "#FF9F0A", textColor: "#0D0D0D" },
  { id: "other", label: "Just Exploring", icon: Sparkles, desc: "Curious mind, no specific label", color: "#AF52DE", textColor: "#FFFFFF" },
];

const EXPERIENCE = [
  { id: "beginner", label: "Beginner", sub: "< 1 year", desc: "Just getting started, learning the basics", dots: 1 },
  { id: "intermediate", label: "Intermediate", sub: "1–3 years", desc: "Comfortable with fundamentals, want to go deeper", dots: 2 },
  { id: "advanced", label: "Advanced", sub: "3+ years", desc: "Solid foundation, targeting expert-level gaps", dots: 3 },
];

const GOALS = [
  { id: "placement", label: "Crack Placements", icon: Award, desc: "Campus or off-campus job interviews", color: "#FFD60A" },
  { id: "upskilling", label: "Upskill at Work", icon: TrendingUp, desc: "Get better at what I already do", color: "#0A84FF" },
  { id: "academic", label: "Academic Excellence", icon: GraduationCap, desc: "Exams, projects, and coursework", color: "#34C759" },
  { id: "freelancing", label: "Freelancing / Startup", icon: Rocket, desc: "Build real products and ship fast", color: "#FF3B3B" },
  { id: "curiosity", label: "Pure Curiosity", icon: Heart, desc: "I just love learning, no end goal", color: "#AF52DE" },
];

const STEP_LABELS = ["Who are you?", "Education", "Interests", "Your level", "Your goal"];

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const { saveProfile, user } = useAuth();

  const [step, setStep] = useState<Step>(0);
  const [role, setRole] = useState<string>("");
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [domains, setDomains] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  // Dynamic domain chips based on selected education level
  const domainChips = educationLevel ? getDomainChipsForLevel(educationLevel) : [];

  const toggleDomain = (id: string) => {
    setDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (step === 0) return role !== "";
    if (step === 1) return educationLevel !== "";
    if (step === 2) return domains.length > 0;
    if (step === 3) return experience !== "";
    if (step === 4) return goal !== "";
    return false;
  };

  const handleFinish = async () => {
    if (!canNext()) return;
    setSaving(true);
    try {
      await saveProfile({
        displayName: displayName || user?.email?.split("@")[0] || "Learner",
        role: role as UserRole,
        educationLevel,
        experienceLevel: experience as ExpLevel,
        learningGoal: goal as LearningGoal,
        preferredDomains: domains,
        onboardingComplete: true,
        streak: 0,
        totalSessions: 0,
      });
      onComplete();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  type UserRole = "student" | "professional" | "self_learner" | "educator" | "other";
  type ExpLevel = "beginner" | "intermediate" | "advanced";
  type LearningGoal = "placement" | "upskilling" | "academic" | "freelancing" | "curiosity";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        backgroundImage: "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 680 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#FFD60A",
              border: "3px solid #0D0D0D",
              boxShadow: "4px 4px 0 #0D0D0D",
              padding: "6px 16px",
              marginBottom: 20,
            }}
          >
            <Zap size={14} color="#0D0D0D" strokeWidth={2.5} />
            <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Quick Setup · {step + 1} of 5
            </span>
          </div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: 10,
            }}
          >
            {step === 0 && "Tell us about yourself"}
            {step === 1 && "What's your education level?"}
            {step === 2 && "Pick your domains"}
            {step === 3 && "What's your experience level?"}
            {step === 4 && "What's your main goal?"}
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem", fontWeight: 500 }}>
            {step === 0 && "This helps us tailor your entire learning journey."}
            {step === 1 && "We'll show you the right subjects and difficulty for your stage."}
            {step === 2 && "Select the domains you want to master. You can always change these later."}
            {step === 3 && "We'll calibrate the quiz difficulty and content to your level."}
            {step === 4 && "Your goal shapes the concepts we prioritize for you."}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 0, marginBottom: 36, border: "3px solid #0D0D0D", overflow: "hidden", boxShadow: "4px 4px 0 #0D0D0D" }}>
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "10px 4px",
                textAlign: "center",
                background: i <= step ? "#0D0D0D" : "#FFFFFF",
                color: i <= step ? "#FFD60A" : "#999",
                fontWeight: 800,
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRight: i < 4 ? "3px solid #0D0D0D" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {i < step ? <Check size={12} /> : null}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "4px solid #0D0D0D",
            boxShadow: "8px 8px 0 #0D0D0D",
            padding: "32px",
          }}
        >
          {/* Step 0 — Role + Name */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="What should we call you?"
                  className="brutal-input"
                  style={{ width: "100%", padding: "12px 14px", fontSize: "0.95rem" }}
                />
              </div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
                I am a...
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const sel = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 16px",
                        border: "3px solid #0D0D0D",
                        background: sel ? r.color : "#F5F0E8",
                        boxShadow: sel ? "3px 3px 0 #0D0D0D" : "4px 4px 0 #0D0D0D",
                        transform: sel ? "translate(1px, 1px)" : "none",
                        transition: "all 0.1s ease",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: 40, height: 40,
                          background: sel ? "rgba(255,255,255,0.2)" : "#FFFFFF",
                          border: "2px solid #0D0D0D",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={20} color={sel ? r.textColor : "#0D0D0D"} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: sel ? r.textColor : "#0D0D0D" }}>{r.label}</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 500, color: sel ? r.textColor : "#888", opacity: 0.85 }}>{r.desc}</div>
                      </div>
                      {sel && (
                        <div style={{ marginLeft: "auto", width: 24, height: 24, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={14} color="#FFD60A" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1 — Education Level */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#888", marginBottom: 16 }}>
                Choose your current stage — this determines which subjects appear.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                {EDUCATION_LEVELS.map((lvl) => {
                  const Icon = lvl.icon;
                  const sel = educationLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setEducationLevel(lvl.id);
                        setDomains([]); // reset domains when level changes
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        border: "3px solid #0D0D0D",
                        background: sel ? lvl.color : "#F5F0E8",
                        boxShadow: sel ? "3px 3px 0 #0D0D0D" : "4px 4px 0 #0D0D0D",
                        transform: sel ? "translate(1px, 1px)" : "none",
                        transition: "all 0.1s ease",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: 36, height: 36,
                          background: sel ? "rgba(255,255,255,0.2)" : "#FFFFFF",
                          border: "2px solid #0D0D0D",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={sel ? lvl.textColor : "#0D0D0D"} strokeWidth={2.5} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: "0.88rem", color: sel ? lvl.textColor : "#0D0D0D" }}>{lvl.label}</div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: sel ? lvl.textColor : "#888", opacity: 0.8 }}>{lvl.sub}</div>
                      </div>
                      {sel && (
                        <div style={{ width: 22, height: 22, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check size={13} color="#FFD60A" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Domains (dynamic based on education level) */}
          {step === 2 && (
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#888", marginBottom: 16 }}>
                Select all that apply — you can always switch domains later.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {domainChips.map((d) => {
                  const sel = domains.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDomain(d.id)}
                      style={{
                        padding: "10px 20px",
                        border: "3px solid #0D0D0D",
                        background: sel ? d.color : "#FFFFFF",
                        boxShadow: sel ? "3px 3px 0 #0D0D0D" : "4px 4px 0 #0D0D0D",
                        transform: sel ? "translate(1px, 1px)" : "none",
                        transition: "all 0.1s ease",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        letterSpacing: "0.02em",
                        color: "#0D0D0D",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {sel && <Check size={14} color="#0D0D0D" strokeWidth={3} />}
                      {d.label}
                    </button>
                  );
                })}
              </div>
              {domains.length === 0 && (
                <p style={{ marginTop: 16, fontSize: "0.8rem", fontWeight: 700, color: "#FF3B3B" }}>
                  ⚡ Pick at least one domain to continue.
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Experience */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {EXPERIENCE.map((exp) => {
                const sel = experience === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "20px 20px",
                      border: "3px solid #0D0D0D",
                      background: sel ? "#0D0D0D" : "#F5F0E8",
                      boxShadow: sel ? "3px 3px 0 #0D0D0D" : "5px 5px 0 #0D0D0D",
                      transform: sel ? "translate(2px, 2px)" : "none",
                      transition: "all 0.1s ease",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {/* Dot indicators */}
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 12, height: 12,
                            background: i <= exp.dots
                              ? (sel ? "#FFD60A" : "#0D0D0D")
                              : (sel ? "rgba(255,255,255,0.2)" : "#D0D0D0"),
                            border: `2px solid ${sel ? "#FFD60A" : "#0D0D0D"}`,
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 900, fontSize: "1.1rem", color: sel ? "#FFD60A" : "#0D0D0D" }}>{exp.label}</span>
                        <span
                          style={{
                            fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em",
                            padding: "2px 8px",
                            border: `2px solid ${sel ? "#FFD60A" : "#0D0D0D"}`,
                            color: sel ? "#FFD60A" : "#0D0D0D",
                            textTransform: "uppercase",
                          }}
                        >
                          {exp.sub}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 500, color: sel ? "rgba(255,255,255,0.7)" : "#666" }}>{exp.desc}</div>
                    </div>
                    {sel && (
                      <div style={{ width: 28, height: 28, background: "#FFD60A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={16} color="#0D0D0D" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 4 — Goal */}
          {step === 4 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {GOALS.map((g) => {
                const Icon = g.icon;
                const sel = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      padding: "20px 18px",
                      border: "3px solid #0D0D0D",
                      background: sel ? g.color : "#FFFFFF",
                      boxShadow: sel ? "3px 3px 0 #0D0D0D" : "5px 5px 0 #0D0D0D",
                      transform: sel ? "translate(2px, 2px)" : "none",
                      transition: "all 0.1s ease",
                      cursor: "pointer",
                      textAlign: "left",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 44, height: 44,
                        background: sel ? "rgba(0,0,0,0.12)" : "#F5F0E8",
                        border: "2px solid #0D0D0D",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Icon size={22} color="#0D0D0D" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0D0D0D", marginBottom: 4 }}>{g.label}</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#555" }}>{g.desc}</div>
                    </div>
                    {sel && (
                      <div
                        style={{
                          position: "absolute", top: 10, right: 10,
                          width: 22, height: 22,
                          background: "#0D0D0D",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Check size={13} color="#FFD60A" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}


        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
          <button
            onClick={() => step > 0 && setStep((s) => (s - 1) as Step)}
            disabled={step === 0}
            className="brutal-btn px-6 py-3"
            style={{
              background: "#FFFFFF",
              opacity: step === 0 ? 0.3 : 1,
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            ← Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => canNext() && setStep((s) => (s + 1) as Step)}
              disabled={!canNext()}
              className="brutal-btn flex items-center gap-2 px-8 py-3"
              style={{
                background: canNext() ? "#FFD60A" : "#E5E5E5",
                color: canNext() ? "#0D0D0D" : "#999",
                cursor: canNext() ? "pointer" : "not-allowed",
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: canNext() ? "6px 6px 0 #0D0D0D" : "4px 4px 0 #CCC",
              }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext() || saving}
              className="brutal-btn flex items-center gap-2 px-8 py-3"
              style={{
                background: canNext() ? "#FFD60A" : "#E5E5E5",
                color: canNext() ? "#0D0D0D" : "#999",
                cursor: canNext() ? "pointer" : "not-allowed",
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: canNext() ? "6px 6px 0 #0D0D0D" : "4px 4px 0 #CCC",
              }}
            >
              {saving ? "Saving…" : "Let's Go"}
              {!saving && <ArrowRight size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
