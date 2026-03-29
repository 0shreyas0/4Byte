"use client";

import { useState } from "react";
import {
  Code2,
  Globe,
  Brain,
  Smartphone,
  BarChart3,
  Shield,
  Cpu,
  Database,
  ChevronRight,
  Zap,
  Palette,
  Megaphone,
  TrendingUp,
  Video,
  GraduationCap,
  Calculator,
  FlaskConical,
  Beaker,
  Dna,
  Atom,
  Terminal,
  Type,
  History as HistoryIcon,
  Search,
  School,
  Briefcase,
  Layers,
} from "lucide-react";

const DIRECT_SUBJECTS_BY_EDUCATION_LEVEL: Record<string, string[]> = {
  early_childhood: ["Alphabets", "Numbers", "Colors & Shapes", "Rhymes & Stories", "Nature & EVS"],
  primary: ["Maths", "English", "EVS", "Hindi", "GK"],
  middle: ["Mathematics", "Science", "Social Studies", "English", "Computers"],
  secondary: ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Computer Science"],
  hs_science_pcm: ["Physics", "Chemistry", "Mathematics", "Computer Science", "English"],
  hs_science_pcb: ["Physics", "Chemistry", "Biology", "Zoology"],
  hs_commerce: ["Accountancy", "Economics", "Business Studies", "Applied Mathematics"],
  hs_arts: ["History", "Political Science", "Geography", "Psychology", "Sociology"],
};

const PROFESSIONAL_LEVELS = new Set([
  "engineering",
  "medical",
  "law",
  "mba",
  "competitive",
  "professional",
]);

const DIRECT_SUBJECT_LABELS: Record<string, string> = {
  early_childhood: "Pre-School / Kindergarten",
  primary: "Class 1 - 5",
  middle: "Class 6 - 8",
  secondary: "Class 9 - 10",
  hs_science_pcm: "11 - 12 Science (PCM)",
  hs_science_pcb: "11 - 12 Science (PCB)",
  hs_commerce: "11 - 12 Commerce",
  hs_arts: "11 - 12 Arts / Humanities",
};

function PythonLogoMark({
  size = 26,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M35 8H23C16.373 8 11 13.373 11 20V27H35V31H7C5.343 31 4 32.343 4 34V43C4 50.18 9.82 56 17 56H26V47C26 40.373 31.373 35 38 35H48C54.627 35 60 29.627 60 23V20C60 13.373 54.627 8 48 8H41V17C41 23.627 35.627 29 29 29H19V25H29C33.418 25 37 21.418 37 17V10C37 8.895 36.105 8 35 8Z"
        fill={color}
      />
      <circle cx="24" cy="16" r="3" fill="#F5F0E8" />
      <path
        d="M29 56H41C47.627 56 53 50.627 53 44V37H29V33H57C58.657 33 60 31.657 60 30V21C60 13.82 54.18 8 47 8H38V17C38 23.627 32.627 29 26 29H16C9.373 29 4 34.373 4 41V44C4 50.627 9.373 56 16 56H23V47C23 40.373 28.373 35 35 35H45V39H35C30.582 39 27 42.582 27 47V54C27 55.105 27.895 56 29 56Z"
        fill={color}
        opacity="0.92"
      />
      <circle cx="40" cy="48" r="3" fill="#F5F0E8" />
    </svg>
  );
}

interface DomainSelectionProps {
  onSelect: (domain: string) => void;
  onBack: () => void;
}

const DOMAINS = [
  {
    id: "DSA",
    name: "DSA",
    fullName: "Competitive Programming Style",
    icon: Code2,
    color: "#FFD60A",
    textColor: "#0D0D0D",
    shadow: "#ccaa00",
    description: "Arrays, recursion, trees, graphs, dynamic programming, and interview-heavy problem solving.",
    topics: ["Arrays", "Loops", "Recursion", "Sorting", "Trees"],
    tag: "CORE",
    difficulty: "Hard",
    level: "Beginner → Advanced",
    questions: 8,
  },
  {
    id: "Web Dev",
    name: "Web Dev",
    fullName: "Full Stack Development",
    icon: Globe,
    color: "#0A84FF",
    textColor: "#FFFFFF",
    shadow: "#0060CC",
    description: "HTML, CSS, JavaScript, React, APIs, databases, and deployment workflows.",
    topics: ["HTML", "CSS", "JavaScript", "React", "APIs"],
    tag: "POPULAR",
    difficulty: "Medium",
    level: "Beginner → Intermediate",
    questions: 8,
  },
  {
    id: "Aptitude",
    name: "Aptitude",
    fullName: "Placement Prep",
    icon: Brain,
    color: "#34C759",
    textColor: "#0D0D0D",
    shadow: "#229A43",
    description: "Quant, reasoning, verbal, DI, and placement-round fundamentals.",
    topics: ["Arithmetic", "Ratios", "Algebra", "Probability", "Puzzles"],
    tag: "PLACEMENT",
    difficulty: "Medium",
    level: "Basic → Expert",
    questions: 8,
  },
  {
    id: "App Dev",
    name: "App Dev",
    fullName: "Mobile Development",
    icon: Smartphone,
    color: "#FF3B30",
    textColor: "#FFFFFF",
    shadow: "#cc2e25",
    description: "React Native, navigation, native APIs, Firebase, and shipping mobile apps.",
    topics: ["React Native", "Routing", "State", "Native APIs", "Firebase"],
    tag: "MOBILE",
    difficulty: "Medium",
    level: "Intermediate",
    questions: 8,
  },
  {
    id: "Data Science",
    name: "Data Science",
    fullName: "ML / AI Track",
    icon: BarChart3,
    color: "#AF52DE",
    textColor: "#FFFFFF",
    shadow: "#8e3db3",
    description: "Python data workflows, visualization, ML, deep learning, and model deployment.",
    topics: ["Python", "Pandas", "Viz", "ML", "Deployment"],
    tag: "TRENDING",
    difficulty: "Hard",
    level: "Intermediate → Advanced",
    questions: 8,
  },
  {
    id: "Cybersecurity",
    name: "Cybersecurity",
    fullName: "Ethical Hacking",
    icon: Shield,
    color: "#FF9F0A",
    textColor: "#0D0D0D",
    shadow: "#cc7f00",
    description: "Networking, Linux, OWASP, scanning, pentesting, and security tooling.",
    topics: ["Networking", "Linux", "OWASP", "Nmap", "CTF"],
    tag: "SPECIALIZED",
    difficulty: "Hard",
    level: "Intermediate → Advanced",
    questions: 8,
  },
  {
    id: "IoT",
    name: "IoT",
    fullName: "Embedded Systems",
    icon: Cpu,
    color: "#5AC8FA",
    textColor: "#0D0D0D",
    shadow: "#3da8d8",
    description: "Microcontrollers, sensors, protocols, edge workflows, and cloud-connected hardware.",
    topics: ["Arduino", "Sensors", "MQTT", "Edge", "Security"],
    tag: "NICHE",
    difficulty: "Medium",
    level: "Intermediate",
    questions: 8,
  },
  {
    id: "Python",
    name: "Python",
    fullName: "Core to Advanced Python",
    icon: Database,
    color: "#0D0D0D",
    textColor: "#FFD60A",
    shadow: "#333333",
    description: "Syntax, OOP, modules, automation, debugging, and practical scripting foundations.",
    topics: ["Syntax", "Functions", "OOP", "Modules", "Testing"],
    tag: "BEGINNER",
    difficulty: "Easy",
    level: "Beginner → Advanced",
    questions: 8,
  },
  {
    id: "Product Design",
    name: "Design",
    fullName: "UI / UX Design",
    icon: Palette,
    color: "#FF2D55",
    textColor: "#FFFFFF",
    shadow: "#cc2444",
    description: "UI/UX principles, Figma proficiency, user research, wireframing, and building design systems.",
    topics: ["Figma", "UI", "UX", "Wireframing", "Design System"],
    tag: "CREATIVE",
    difficulty: "Medium",
    level: "Beginner → Expert",
    questions: 8,
  },
  {
    id: "Marketing",
    name: "Marketing",
    fullName: "Digital Growth",
    icon: Megaphone,
    color: "#5856D6",
    textColor: "#FFFFFF",
    shadow: "#4644ab",
    description: "SEO, SEM, social media strategy, content marketing, and performance analytics.",
    topics: ["SEO", "SEM", "Content", "Social Media", "Analytics"],
    tag: "GROWTH",
    difficulty: "Easy",
    level: "Beginner → Intermediate",
    questions: 8,
  },
  {
    id: "Business",
    name: "Business",
    fullName: "Strategy & Finance",
    icon: TrendingUp,
    color: "#171717",
    textColor: "#FFFFFF",
    shadow: "#000000",
    description: "Entrepreneurship, startup business models, finance fundamentals, and growth strategy.",
    topics: ["Startup", "Finance", "Strategy", "Management", "Growth"],
    tag: "BUSINESS",
    difficulty: "Hard",
    level: "Intermediate → Advanced",
    questions: 8,
  },
  {
    id: "Content Creation",
    name: "Creator",
    fullName: "Content & Storytelling",
    icon: Video,
    color: "#FF3B30",
    textColor: "#FFFFFF",
    shadow: "#cc2e25",
    description: "Video editing, youtube growth, brand storytelling, audience psychology, and creative scripting.",
    topics: ["Video", "Storytelling", "YouTube", "Branding", "Creative"],
    tag: "CREATOR",
    difficulty: "Medium",
    level: "Basics → Influencer",
    questions: 8,
  },
];

// 🔥 NEW HIERARCHICAL DATA
const GRADE_LEVELS = [
  { id: "primary", name: "Primary", range: "K - 5th", icon: School, color: "#FFD60A" },
  { id: "middle", name: "Middle School", range: "6th - 8th", icon: GraduationCap, color: "#0A84FF" },
  { id: "high", name: "Secondary", range: "9th - 10th", icon: GraduationCap, color: "#34C759" },
  { id: "senior", name: "Senior Secondary", range: "11th - 12th", icon: GraduationCap, color: "#FF3B30" },
  { id: "higher", name: "Higher Ed", range: "UG / PG", icon: GraduationCap, color: "#AF52DE" },
  { id: "professional", name: "Skills", range: "Jobs & Tech", icon: Briefcase, color: "#FF9F0A" },
];

const GRADES_BY_LEVEL: Record<string, string[]> = {
  primary: ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"],
  middle: ["6th Grade", "7th Grade", "8th Grade"],
  high: ["9th Grade", "10th Grade"],
  senior: ["11th Grade", "12th Grade"],
  higher: ["Undergraduate", "Post-Graduate"],
};

const STREAMS = ["Science", "Commerce", "Arts"];

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  Kindergarten: ["Basic Counting", "Alphabets", "Colors & Shapes"],
  "1st Grade": ["Arithmetic", "English Reading", "Environment"],
  "9th Grade": ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Social Studies"],
  "10th Grade": ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Social Studies"],
  "11th Grade": ["Physics", "Chemistry", "Biology", "Mathematics", "Accountancy", "Economics", "History", "Computer Science"],
  "12th Grade": ["Physics", "Chemistry", "Biology", "Mathematics", "Accountancy", "Economics", "History", "Computer Science"],
  Undergraduate: ["Data Structures", "Operating Systems", "Microeconomics", "Psychology", "Law"],
};

import { useAuth } from "@/lib/AuthContext";

export default function DomainSelection({ onSelect, onBack }: DomainSelectionProps) {
  const { profile } = useAuth();
  const savedEducationLevel = profile?.educationLevel ?? null;
  const opensDirectSubjects = savedEducationLevel ? !PROFESSIONAL_LEVELS.has(savedEducationLevel) : false;
  const opensDirectDomains = savedEducationLevel ? PROFESSIONAL_LEVELS.has(savedEducationLevel) : false;

  const [step, setStep] = useState<"level" | "grade" | "stream" | "subject" | "professional">(
    opensDirectSubjects ? "subject" : opensDirectDomains ? "professional" : profile?.academicGrade ? "subject" : "level"
  );
  const [selectedLevel, setSelectedLevel] = useState<string | null>(profile?.academicLevel ?? null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(
    opensDirectSubjects ? DIRECT_SUBJECT_LABELS[savedEducationLevel ?? ""] ?? null : profile?.academicGrade ?? null
  );
  const [selectedStream, setSelectedStream] = useState<string | null>(profile?.academicStream ?? null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const [confirming, setConfirming] = useState(false);

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId);
    if (levelId === "professional") {
      setStep("professional");
    } else {
      setStep("grade");
    }
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    if (grade === "11th Grade" || grade === "12th Grade" || grade === "Undergraduate") {
      setStep("stream");
    } else {
      setStep("subject");
    }
  };

  const handleStreamSelect = (stream: string) => {
    setSelectedStream(stream);
    setStep("subject");
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleFinalConfirm = () => {
    const finalSelection = step === "professional" || opensDirectSubjects
      ? selectedSubject || ""
      : `${selectedSubject} (${selectedGrade}${selectedStream ? ` - ${selectedStream}` : ""})`;
      
    setConfirming(true);
    setTimeout(() => onSelect(finalSelection), 400);
  };

  const handleStepBack = () => {
    if (step === "level") onBack();
    else if (step === "grade") setStep("level");
    else if (step === "stream") setStep("grade");
    else if (step === "subject") {
      if (opensDirectSubjects) onBack();
      else setStep(selectedLevel === "senior" || selectedLevel === "higher" ? "stream" : "grade");
    } else if (step === "professional") {
      if (opensDirectDomains) onBack();
      else setStep("level");
    }
  };

  // ── Render Helpers ────────────────────────────────────────────────────────────

  const renderLevels = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {GRADE_LEVELS.map((lvl) => {
        const Icon = lvl.icon;
        return (
          <button
            key={lvl.id}
            onClick={() => handleLevelSelect(lvl.id)}
            className="text-left p-6 group transition-all"
            style={{
              border: "4px solid #0D0D0D",
              background: "#FFFFFF",
              boxShadow: "6px 6px 0 #0D0D0D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-2px, -2px)";
              e.currentTarget.style.boxShadow = "8px 8px 0 #0D0D0D";
              e.currentTarget.style.background = lvl.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "6px 6px 0 #0D0D0D";
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            <div className="flex items-center justify-between mb-4">
               <div className="p-3 border-2 border-black bg-white">
                 <Icon size={28} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-1">
                 {lvl.range}
               </span>
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">{lvl.name}</h3>
            <p className="text-sm font-bold opacity-70">Trace gaps in {lvl.name} fundamentals.</p>
          </button>
        );
      })}
    </div>
  );

  const renderGrades = () => {
    const grades = selectedLevel ? GRADES_BY_LEVEL[selectedLevel] : [];
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => handleGradeSelect(grade)}
            className="p-5 text-center font-black text-lg border-4 border-black bg-white hover:bg-[#FFD60A] shadow-[4px_4px_0_#0D0D0D] hover:shadow-[2px_2px_0_#0D0D0D] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {grade}
          </button>
        ))}
      </div>
    );
  };

  const renderStreams = () => {
    const streamOptions = selectedLevel === "higher" 
      ? ["Engineering", "Medical", "Commerce", "Humanities", "Law"]
      : STREAMS;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streamOptions.map((stream) => (
          <button
            key={stream}
            onClick={() => handleStreamSelect(stream)}
            className="p-8 text-left border-4 border-black bg-white hover:bg-black hover:text-white shadow-[6px_6px_0_#0D0D0D] transition-all"
          >
            <div className="text-xs font-bold uppercase opacity-60 mb-1">Select Stream</div>
            <div className="text-2xl font-black">{stream}</div>
          </button>
        ))}
      </div>
    );
  };

  const renderSubjects = () => {
    const subjects = opensDirectSubjects
      ? DIRECT_SUBJECTS_BY_EDUCATION_LEVEL[savedEducationLevel ?? ""] || []
      : selectedGrade
        ? (SUBJECTS_BY_GRADE[selectedGrade] || ["Math", "Science", "English", "History"])
        : [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const isSelected = selectedSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => handleSubjectSelect(sub)}
              className="p-4 flex items-center gap-4 border-4 border-black transition-all"
              style={{
                background: isSelected ? "#0D0D0D" : "#FFFFFF",
                color: isSelected ? "#FFD60A" : "#0D0D0D",
                boxShadow: isSelected ? "2px 2px 0 #FFD60A" : "4px 4px 0 #000",
                transform: isSelected ? "translate(2px, 2px)" : "none",
              }}
            >
              <div className={`p-2 border-2 ${isSelected ? 'border-[#FFD60A]' : 'border-black'}`}>
                <Layers size={20} />
              </div>
              <span className="font-black text-lg">{sub}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderProfessional = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {DOMAINS.map((domain) => {
        const Icon = domain.icon;
        const isSelected = selectedSubject === domain.id;
        const usePythonMark = domain.id === "Python";
        return (
          <button
            key={domain.id}
            onClick={() => handleSubjectSelect(domain.id)}
            className="text-left flex flex-col gap-3 p-5"
            style={{
              border: "4px solid #0D0D0D",
              background: isSelected ? domain.color : "#FFFFFF",
              boxShadow: isSelected
                ? `3px 3px 0px ${domain.shadow}`
                : `6px 6px 0px ${domain.shadow}`,
              transform: isSelected ? "translate(3px, 3px)" : "translate(0,0)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              minHeight: 280,
            }}
          >
            {/* Same internal logic as before */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "0.62rem", fontWeight: 800, padding: "2px 8px", border: `2px solid ${isSelected ? domain.textColor : "#0D0D0D"}`, color: isSelected ? domain.textColor : "#0D0D0D" }}>
                {domain.tag}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${isSelected ? domain.textColor : "#0D0D0D"}`, background: isSelected ? "rgba(255,255,255,0.12)" : "#F5F0E8", color: isSelected ? domain.textColor : "#0D0D0D" }}>
                {usePythonMark ? <PythonLogoMark size={28} color={isSelected ? domain.textColor : "#0D0D0D"} /> : <Icon size={26} strokeWidth={2.25} />}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: isSelected ? domain.textColor : "#0D0D0D" }}>{domain.name}</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, opacity: 0.7, color: isSelected ? domain.textColor : "#444" }}>{domain.fullName}</div>
            </div>
            <p style={{ fontSize: "0.85rem", fontWeight: 500, color: isSelected ? domain.textColor : "#555" }}>{domain.description}</p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      <div
        style={{
          background: "#0D0D0D",
          borderBottom: "4px solid #0D0D0D",
          padding: "24px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#FFD60A", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronRight size={14} /> 
            {step === "level" && "Level Selection"}
            {step === "grade" && `${selectedLevel} / Grade Selection`}
            {step === "stream" && `${selectedGrade} / Stream Selection`}
            {step === "subject" && `${selectedGrade ?? "Subjects"} / Subject Selection`}
            {step === "professional" && "Professional Tracks"}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#FFFFFF", marginBottom: 12 }}>
            {step === "level" && <>What is your <span style={{ color: "#FFD60A" }}>Current Scale?</span></>}
            {step === "grade" && <>Which <span style={{ color: "#FFD60A" }}>Grade?</span></>}
            {step === "stream" && <>Choose <span style={{ color: "#FFD60A" }}>Specialization</span></>}
            {step === "subject" && <>Select <span style={{ color: "#FFD60A" }}>Subject</span></>}
            {step === "professional" && <>Select <span style={{ color: "#FFD60A" }}>Domain</span></>}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {step === "level" && renderLevels()}
        {step === "grade" && renderGrades()}
        {step === "stream" && renderStreams()}
        {step === "subject" && renderSubjects()}
        {step === "professional" && renderProfessional()}

        <div className="flex items-center justify-between gap-4 mt-12 border-t-4 border-black pt-8">
          <button onClick={handleStepBack} className="brutal-btn px-8 py-4 text-sm font-black bg-white border-4 border-black shadow-[4px_4px_0_#000]">
            ← BACK
          </button>

          {step === "subject" && profile?.academicGrade && !opensDirectSubjects && (
            <button onClick={() => setStep("level")} className="text-xs font-black uppercase underline p-2">
              Change My Level / Grade
            </button>
          )}

          {(step === "subject" || step === "professional") && (
            <button
              onClick={handleFinalConfirm}
              disabled={!selectedSubject || confirming}
              className="brutal-btn flex items-center gap-3 px-12 py-4"
              style={{
                background: selectedSubject ? "#FFD60A" : "#E5E5E5",
                color: selectedSubject ? "#0D0D0D" : "#999",
                cursor: selectedSubject ? "pointer" : "not-allowed",
                opacity: confirming ? 0.7 : 1,
                fontSize: "1.1rem",
                fontWeight: 900,
                border: "4px solid #0D0D0D",
                boxShadow: selectedSubject ? "6px 6px 0 #0D0D0D" : "none",
              }}
            >
              <Zap size={22} />
              {confirming ? "LAUNCHING..." : `START ${selectedSubject?.toUpperCase()} QUIZ`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
