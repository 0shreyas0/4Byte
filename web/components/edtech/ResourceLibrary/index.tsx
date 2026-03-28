"use client";

import { useState } from "react";
import { 
  Play, ExternalLink, Search, Filter, BookOpen, Layers, 
  Code2, Globe, Brain, Smartphone, BarChart3, Shield, Cpu, Database,
  CheckCircle2, Star, Sparkles, Clock, ArrowRight, Zap
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

/* ─── Domain Icons/Colors ─── */
const DOMAIN_META: Record<string, { icon: any; color: string; bg: string }> = {
  "DSA":           { icon: Code2,     color: "#FFD60A", bg: "#0D0D0D" },
  "Web Dev":       { icon: Globe,     color: "#0A84FF", bg: "#0D0D0D" },
  "Aptitude":      { icon: Brain,     color: "#34C759", bg: "#0D0D0D" },
  "App Dev":       { icon: Smartphone,color: "#FF3B30", bg: "#0D0D0D" },
  "Data Science":  { icon: BarChart3, color: "#AF52DE", bg: "#0D0D0D" },
  "Cybersecurity": { icon: Shield,    color: "#FF9F0A", bg: "#0D0D0D" },
  "IoT":           { icon: Cpu,       color: "#5AC8FA", bg: "#0D0D0D" },
  "Python":        { icon: Database,  color: "#FFD60A", bg: "#0D0D0D" },
};

/* ─── Mock Video Data ─── */
const MOCK_RESOURCES = [
  // DSA
  { id: 1, domain: "DSA", topic: "Arrays", title: "Mastering Array Manipulations", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", duration: "12:45", level: "Beginner" },
  { id: 2, domain: "DSA", topic: "Sorting", title: "Quick Sort vs Merge Sort Explained", url: "https://www.youtube.com/watch?v=Ho9pZ_3T_m8", duration: "15:20", level: "Intermediate" },
  { id: 3, domain: "DSA", topic: "Recursion", title: "Deep Dive into Recursion Tree", url: "https://www.youtube.com/watch?v=ngCos392W4w", duration: "18:10", level: "Advanced" },
  
  // Web Dev
  { id: 4, domain: "Web Dev", topic: "React Basics", title: "React Component Lifecycle", url: "https://www.youtube.com/watch?v=O6P86uwfdO0", duration: "22:00", level: "Intermediate" },
  { id: 5, domain: "Web Dev", topic: "CSS Basics", title: "Modern CSS Flexbox & Grid", url: "https://www.youtube.com/watch?v=jzZ_pA6A_W0", duration: "14:30", level: "Beginner" },
  { id: 6, domain: "Web Dev", topic: "JS Basics", title: "Asynchronous JavaScript (Promises/Async)", url: "https://www.youtube.com/watch?v=V_Kr9OSfDeU", duration: "19:45", level: "Advanced" },
  
  // Aptitude
  { id: 7, domain: "Aptitude", topic: "Arithmetic", title: "Mental Math: Speed Addition & Subtraction", url: "https://www.youtube.com/watch?v=L2zR9O2f4M8", duration: "10:30", level: "Beginner" },
  { id: 8, domain: "Aptitude", topic: "Percentages", title: "Smart Percentage Calculations", url: "https://www.youtube.com/watch?v=y38uXv_Nl_Y", duration: "11:15", level: "Intermediate" },
];

export default function ResourceLibrary({ currentDomain }: { currentDomain: string }) {
  const { profile } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string>(currentDomain || "DSA");
  const [search, setSearch] = useState("");

  const domains = Object.keys(DOMAIN_META);
  
  // Filter resources
  const filtered = MOCK_RESOURCES.filter(r => 
    r.domain === selectedDomain && 
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase()))
  );

  // Recommendation logic: find topics with scores < 50
  const weakTopicsInDomain = Object.entries(profile?.topicMastery?.[selectedDomain] || {})
    .filter(([, score]) => score < 60)
    .map(([topic]) => topic);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex" }}>
      {/* Sidebar - Domain Selection */}
      <aside 
        style={{ 
          width: 80, borderRight: "4px solid #0D0D0D", background: "#FFFFFF",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 32
        }}
        className="hidden sm:flex"
      >
        {domains.map(d => {
          const m = DOMAIN_META[d];
          const isActive = selectedDomain === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              title={d}
              style={{
                width: 48, height: 48,
                background: isActive ? m.color : "#FFFFFF",
                border: "3px solid #0D0D0D",
                boxShadow: isActive ? "3px 3px 0 #0D0D0D" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.1s"
              }}
            >
              <m.icon size={20} color="#0D0D0D" />
            </button>
          );
        })}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Layers size={24} color="#0D0D0D" />
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1 }}>
              Resource Hub
            </h1>
          </div>
          <p style={{ fontWeight: 700, opacity: 0.6, fontSize: "1.1rem" }}>
            Curated learning path for <span style={{ color: DOMAIN_META[selectedDomain]?.color, background: "#0D0D0D", padding: "0 8px" }}>{selectedDomain}</span>
          </p>
        </div>

        {/* Search & Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
            <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>
              <Search size={18} color="#0D0D0D" />
            </div>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic or title..."
              className="brutal-input w-full"
              style={{ padding: "14px 14px 14px 44px", fontWeight: 700 }}
            />
          </div>
          
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ 
              background: "#0D0D0D", color: "#FFFFFF", padding: "12px 20px", 
              border: "3px solid #0D0D0D", boxShadow: "4px 4px 0 #FFD60A",
              display: "flex", alignItems: "center", gap: 8 
            }}>
              <Zap size={16} color="#FFD60A" fill="#FFD60A" />
              <span style={{ fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase" }}>{filtered.length} Resources</span>
            </div>
          </div>
        </div>

        {/* Recommendations alert if any */}
        {weakTopicsInDomain.length > 0 && (
          <div style={{ 
            background: "#FF3B3B", border: "4px solid #0D0D0D", color: "#FFFFFF", 
            padding: "20px", marginBottom: 32, boxShadow: "8px 8px 0 #0D0D0D",
            display: "flex", alignItems: "center", gap: 16
          }}>
            <Sparkles size={32} />
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase" }}>Focus Needed!</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", opacity: 0.9 }}>
                You're scoring below 60% in <span style={{ fontWeight: 900, textDecoration: "underline" }}>{weakTopicsInDomain.join(", ")}</span>. 
                We've pinned relevant study material below.
              </div>
            </div>
          </div>
        )}

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(res => {
            const isWeak = weakTopicsInDomain.includes(res.topic);
            const mastery = profile?.topicMastery?.[selectedDomain]?.[res.topic] || 0;
            const isMastered = mastery >= 85;

            return (
              <div 
                key={res.id}
                style={{ 
                  background: "#FFFFFF", border: "4px solid #0D0D0D", 
                  boxShadow: "6px 6px 0 #0D0D0D", display: "flex", flexDirection: "column",
                  position: "relative"
                }}
              >
                {/* Labels */}
                <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", gap: 6 }}>
                  <div style={{ background: "#0D0D0D", color: "#FFFFFF", padding: "4px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", border: "1px solid #0D0D0D" }}>
                    {res.topic}
                  </div>
                  {isWeak && (
                    <div style={{ background: "#FFD60A", color: "#0D0D0D", padding: "4px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", border: "1px solid #0D0D0D" }}>
                      Recommended
                    </div>
                  )}
                  {isMastered && (
                    <div style={{ background: "#34C759", color: "#FFFFFF", padding: "4px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", border: "1px solid #0D0D0D" }}>
                      Mastered
                    </div>
                  )}
                </div>

                {/* Thumb Placeholder */}
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                   <div style={{ 
                     position: "absolute", inset: 0, 
                     background: isWeak ? "rgba(255, 214, 10, 0.05)" : "transparent"
                   }} />
                   <Play size={40} color="#0D0D0D" opacity={0.2} />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                {/* Details */}
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "#888" }}>{res.level}</div>
                    <div style={{ width: 4, height: 4, background: "#888", borderRadius: "50%" }} />
                    <div style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "#888" }}>{res.duration}</div>
                  </div>
                  
                  <h3 style={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1.2, marginBottom: 16 }}>{res.title}</h3>
                  
                  <div className="mt-auto flex items-center justify-between">
                    {isMastered ? (
                      <div className="flex items-center gap-2 text-[#34C759] font-black text-xs uppercase">
                        <CheckCircle2 size={16} /> Concepts Clear
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase">
                        <Clock size={16} /> Unwatched
                      </div>
                    )}
                    
                    <a 
                      href={res.url} 
                      target="_blank" 
                      className="brutal-btn p-3 bg-white hover:bg-[#F5F0E8] transition-all"
                      style={{ border: "2px solid #0D0D0D", boxShadow: "3px 3px 0 #0D0D0D" }}
                    >
                      <ExternalLink size={16} color="#0D0D0D" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ 
            padding: "80px 40px", textAlign: "center", border: "4px dashed rgba(0,0,0,0.1)", marginTop: 20
          }}>
            <Search size={48} color="rgba(0,0,0,0.1)" style={{ margin: "0 auto 20px" }} />
            <h2 style={{ fontWeight: 900, fontSize: "1.4rem", color: "rgba(0,0,0,0.2)" }}>
              NO RESOURCES FOUND FOR "{search.toUpperCase()}"
            </h2>
            <button 
              onClick={() => { setSearch(""); setSelectedDomain("DSA"); }}
              style={{ marginTop: 20, fontWeight: 900, textDecoration: "underline", color: "#0D0D0D" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
