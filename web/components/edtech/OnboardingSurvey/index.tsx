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
  School,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

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

const STEP_LABELS = ["Identity", "Academic Scale", "Your Grade", "Stream", "Interests", "Experience", "Goals"];

const ACADEMIC_LEVELS = [
  { id: "primary", name: "Primary", range: "K-5th", icon: School, color: "#FFD60A" },
  { id: "middle", name: "Middle School", range: "6th-8th", icon: GraduationCap, color: "#0A84FF" },
  { id: "high", name: "Secondary", range: "9th-10th", icon: GraduationCap, color: "#34C759" },
  { id: "senior", name: "Senior Secondary", range: "11th-12th", icon: GraduationCap, color: "#FF3B30" },
  { id: "higher", name: "Higher Ed", range: "UG / PG", icon: GraduationCap, color: "#AF52DE" },
  { id: "professional", name: "Skills", range: "Jobs & Tech", icon: BriefcaseIcon, color: "#FF9F0A" },
];

const GRADES_BY_LEVEL: Record<string, string[]> = {
  primary: ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"],
  middle: ["6th Grade", "7th Grade", "8th Grade"],
  high: ["9th Grade", "10th Grade"],
  senior: ["11th Grade", "12th Grade"],
  higher: ["Undergraduate", "Post-Graduate"],
};

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const { saveProfile, user } = useAuth();

  const [step, setStep] = useState<number>(0);
  const [role, setRole] = useState<string>("");
  const [academicLevel, setAcademicLevel] = useState<string>("");
  const [academicGrade, setAcademicGrade] = useState<string>("");
  const [academicStream, setAcademicStream] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [domains, setDomains] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  const toggleDomain = (id: string) => {
    setDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const skipStream = (grade: string) => {
    return grade !== "11th Grade" && grade !== "12th Grade" && grade !== "Undergraduate";
  };

  const handleNext = () => {
    if (step === 2 && skipStream(academicGrade)) {
      setStep(4);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 4 && skipStream(academicGrade)) {
      setStep(2);
    } else {
      setStep((s) => s - 1);
    }
  };

  const canNext = () => {
    if (step === 0) return role !== "";
    if (step === 1) return academicLevel !== "";
    if (step === 2) return academicGrade !== "";
    if (step === 3) return academicStream !== "" || skipStream(academicGrade);
    if (step === 4) return domains.length > 0;
    if (step === 5) return experience !== "";
    if (step === 6) return goal !== "";
    return false;
  };

  const handleFinish = async () => {
    if (!canNext()) return;
    setSaving(true);
    try {
      await saveProfile({
        displayName: displayName || user?.email?.split("@")[0] || "Learner",
        role: role as any,
        academicLevel,
        academicGrade,
        academicStream,
        experienceLevel: experience as any,
        learningGoal: goal as any,
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
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FFD60A", border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #0D0D0D", padding: "6px 16px", marginBottom: 20 }}>
            <Zap size={14} color="#0D0D0D" strokeWidth={2.5} />
            <span style={{ fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Tailoring Experience · {step + 1} of 7
            </span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 10 }}>
            {step === 0 && "Who are you?"}
            {step === 1 && "What is your academic scale?"}
            {step === 2 && "Which grade are you in?"}
            {step === 3 && "And your specialization?"}
            {step === 4 && "Choose your interests"}
            {step === 5 && "Your proficiency level?"}
            {step === 6 && "What is your main goal?"}
          </h1>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 36, border: "3px solid #0D0D0D", overflow: "hidden", boxShadow: "4px 4px 0 #0D0D0D" }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ flex: 1, padding: "10px 4px", textAlign: "center", background: i <= step ? "#0D0D0D" : "#FFFFFF", color: i <= step ? "#FFD60A" : "#999", fontWeight: 800, fontSize: "0.68rem", textTransform: "uppercase", borderRight: i < STEP_LABELS.length - 1 ? "3px solid #0D0D0D" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {i < step ? <Check size={12} /> : null}
              <span className="hidden sm:inline" style={{ whiteSpace: "nowrap" }}>{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#FFFFFF", border: "4px solid #0D0D0D", boxShadow: "8px 8px 0 #0D0D0D", padding: "32px", minHeight: 400 }}>
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Your Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What should we call you?" className="brutal-input" style={{ width: "100%", padding: "12px 14px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "3px solid #0D0D0D", background: role === r.id ? r.color : "#F5F0E8", boxShadow: role === r.id ? "2px 2px 0 #000" : "4px 4px 0 #000", textAlign: "left" }}>
                    <r.icon size={20} />
                    <div>
                      <div style={{ fontWeight: 800 }}>{r.label}</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ACADEMIC_LEVELS.map((lvl) => (
                 <button key={lvl.id} onClick={() => setAcademicLevel(lvl.id)} style={{ padding: "16px", border: "3px solid #0D0D0D", background: academicLevel === lvl.id ? lvl.color : "#F5F0E8", boxShadow: academicLevel === lvl.id ? "2px 2px 0 #000" : "4px 4px 0 #000", textAlign: "left" }}>
                   <lvl.icon size={24} />
                   <div style={{ fontWeight: 900, marginTop: 8 }}>{lvl.name}</div>
                   <div style={{ fontSize: "0.7rem", fontWeight: 700 }}>{lvl.range}</div>
                 </button>
               ))}
            </div>
          )}

          {step === 2 && (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GRADES_BY_LEVEL[academicLevel]?.map((grade) => (
                  <button key={grade} onClick={() => setAcademicGrade(grade)} style={{ padding: "16px", border: "3px solid #0D0D0D", background: academicGrade === grade ? "#0D0D0D" : "#FFFFFF", color: academicGrade === grade ? "#FFD60A" : "#0D0D0D", fontWeight: 900 }}>
                    {grade}
                  </button>
                ))}
             </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               {(academicGrade === "11th Grade" || academicGrade === "12th Grade" ? ["Science", "Commerce", "Arts"] : ["Engineering", "Medical", "Business", "Humanities"]).map((s) => (
                 <button key={s} onClick={() => setAcademicStream(s)} style={{ padding: "20px", border: "3px solid #0D0D0D", background: academicStream === s ? "#0D0D0D" : "#F5F0E8", color: academicStream === s ? "#FFD60A" : "#0D0D0D", fontWeight: 900, textAlign: "left" }}>
                   {s}
                 </button>
               ))}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["Physics", "Chemistry", "Mathematics", "English", "Economics", "Computer Science"].map((d) => (
                <button key={d} onClick={() => toggleDomain(d)} style={{ padding: "10px 20px", border: "3px solid #0D0D0D", background: domains.includes(d) ? "#FFD60A" : "#FFFFFF", fontWeight: 800 }}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {EXPERIENCE.map((exp) => (
                <button key={exp.id} onClick={() => setExperience(exp.id)} style={{ padding: "20px", border: "3px solid #0D0D0D", background: experience === exp.id ? "#0D0D0D" : "#F5F0E8", color: experience === exp.id ? "#FFD60A" : "#0D0D0D", textAlign: "left" }}>
                  <div style={{ fontWeight: 900 }}>{exp.label}</div>
                  <div style={{ fontSize: "0.8rem" }}>{exp.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOALS.map((g) => (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{ padding: "20px", border: "3px solid #0D0D0D", background: goal === g.id ? g.color : "#FFFFFF", boxShadow: goal === g.id ? "2px 2px 0 #000" : "4px 4px 0 #000", textAlign: "left" }}>
                  <g.icon size={22} style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 800 }}>{g.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button onClick={handleBack} disabled={step === 0} className="brutal-btn px-6 py-3" style={{ background: "#FFFFFF", opacity: step === 0 ? 0.3 : 1, fontWeight: 800 }}>← Back</button>
          {step < 6 ? (
            <button onClick={handleNext} disabled={!canNext()} className="brutal-btn flex items-center gap-2 px-8 py-3" style={{ background: canNext() ? "#FFD60A" : "#E5E5E5", fontWeight: 800 }}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!canNext() || saving} className="brutal-btn flex items-center gap-2 px-8 py-3" style={{ background: canNext() ? "#FFD60A" : "#E5E5E5", fontWeight: 800 }}>
              {saving ? "Saving…" : "Let's Go"} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
