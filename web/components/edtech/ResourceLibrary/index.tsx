import { useEffect, useState } from "react";
import { 
  Play, ExternalLink, Search, Filter, BookOpen, Layers, 
  Code2, Globe, Brain, Smartphone, BarChart3, Shield, Cpu, Database,
  CheckCircle2, Star, Sparkles, Clock, ArrowRight, Zap, Loader2
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchYouTubeVideos, YouTubeVideo } from "@/lib/edtech/youtube";
import { generateOptimizedQuery } from "@/lib/edtech/ai";

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

export default function ResourceLibrary({ currentDomain }: { currentDomain: string }) {
  const { profile } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string>(currentDomain || "DSA");
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);

  const domains = Object.keys(DOMAIN_META);
  
  // Recommendation logic: find topics with scores < 60
  const weakTopicsInDomain = Object.entries(profile?.topicMastery?.[selectedDomain] || {})
    .filter(([, score]) => score < 60)
    .map(([topic]) => topic);

  useEffect(() => {
    let isMounted = true;
    const fetchResources = async () => {
      setLoading(true);
      try {
        // Build a query based on search or weak topics
        let query = "";
        if (search) {
          query = `${selectedDomain} ${search}`;
        } else if (weakTopicsInDomain.length > 0) {
          query = `${selectedDomain} ${weakTopicsInDomain[0]} tutorial`;
        } else {
          query = `${selectedDomain} beginner tutorial`;
        }

        const res = await fetchYouTubeVideos(query);
        if (isMounted) {
          setVideos(res);
        }
      } catch (err) {
        console.error("Failed to fetch library resources:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    return () => { isMounted = false; };
  }, [selectedDomain, search, weakTopicsInDomain.length > 0]);

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
              <span style={{ fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase" }}>{videos.length} Results</span>
            </div>
          </div>
        </div>

        {/* Recommendations alert if any */}
        {!search && weakTopicsInDomain.length > 0 && (
          <div style={{ 
            background: "#FF3B3B", border: "4px solid #0D0D0D", color: "#FFFFFF", 
            padding: "20px", marginBottom: 32, boxShadow: "8px 8px 0 #0D0D0D",
            display: "flex", alignItems: "center", gap: 16
          }}>
            <Sparkles size={32} />
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.1rem", textTransform: "uppercase" }}>Personalized Support!</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", opacity: 0.9 }}>
                Based on your test results, you should focus on <span style={{ fontWeight: 900, textDecoration: "underline" }}>{weakTopicsInDomain.join(", ")}</span>. 
                We've fetched live tutorials for you.
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-[#0D0D0D]">Syncing with YouTube...</p>
          </div>
        )}

        {/* Resource Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {videos.map((res, idx) => {
              const mastery = profile?.topicMastery?.[selectedDomain]?.[selectedDomain] || 0; // fallback
              const isMastered = mastery >= 85;

              return (
                <div 
                  key={res.videoId + idx}
                  style={{ 
                    background: "#FFFFFF", border: "4px solid #0D0D0D", 
                    boxShadow: "6px 6px 0 #0D0D0D", display: "flex", flexDirection: "column",
                    position: "relative"
                  }}
                >
                  {/* Labels */}
                  <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", gap: 6 }}>
                    <div style={{ background: "#0D0D0D", color: "#FFFFFF", padding: "4px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", border: "1px solid #0D0D0D" }}>
                      {selectedDomain}
                    </div>
                    {idx < 2 && !search && weakTopicsInDomain.length > 0 && (
                      <div style={{ background: "#FFD60A", color: "#0D0D0D", padding: "4px 8px", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", border: "1px solid #0D0D0D" }}>
                        Recommended
                      </div>
                    )}
                  </div>

                  {/* Thumb Placeholder */}
                  <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden group">
                     <img 
                       src={`https://img.youtube.com/vi/${res.videoId}/maxresdefault.jpg`} 
                       alt={res.title}
                       className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-300"
                       onError={(e) => {
                         (e.target as any).src = `https://img.youtube.com/vi/${res.videoId}/0.jpg`;
                       }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={48} color="#FFD60A" fill="#FFD60A" className="drop-shadow-lg" />
                     </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "#888" }}>{res.channel}</div>
                      {res.duration && (
                        <>
                          <div style={{ width: 4, height: 4, background: "#888", borderRadius: "50%" }} />
                          <div style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "#888" }}>{res.duration}</div>
                        </>
                      )}
                    </div>
                    
                    <h3 
                      style={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1.2, marginBottom: 16 }}
                      dangerouslySetInnerHTML={{ __html: res.title }}
                    />
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase">
                        <Clock size={14} /> Video Tutorial
                      </div>
                      
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="brutal-btn p-3 bg-white hover:bg-[#FFD60A] transition-all"
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
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
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
