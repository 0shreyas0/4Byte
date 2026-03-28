"use client";

import { AnalysisResult, TopicScore } from "@/lib/edtech/conceptGraph";
import { ArrowLeft, Play, ExternalLink, Sparkles, Clock, Target, AlertCircle } from "lucide-react";

interface SimulationModeProps {
  domain: string;
  originalScores: Record<string, TopicScore>;
  originalAnalysis: AnalysisResult;
  onBack: () => void;
}

export default function SimulationMode({
  domain,
  originalAnalysis,
  onBack,
}: SimulationModeProps) {
  // Get all weak topics (score < 45)
  const weakTopics = originalAnalysis.learningPath.filter(step => originalAnalysis.topicStatuses[step.topic] === "weak");
  
  // Collect all recommendations from these topics
  interface FlatRec {
    topic: string;
    title: string;
    url: string;
    segment: string;
    why: string;
  }

  const allRecs: FlatRec[] = [];
  weakTopics.forEach(step => {
    step.recommendations?.forEach(rec => {
      allRecs.push({
        topic: step.topic,
        title: rec.title,
        url: rec.url,
        segment: rec.recommended_segment,
        why: rec.why_this_video
      });
    });
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "4.0px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button 
          onClick={onBack} 
          className="brutal-btn flex items-center gap-2 px-5 py-2.5 text-sm font-bold" 
          style={{ background: "#F5F0E8" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <div style={{ width: 2, height: 32, background: "#0D0D0D" }} />
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8B5CF6", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            🧠 Deep Learning Path
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            NeuralPath Booster: {domain}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Banner Section */}
        <div
          style={{
            border: "4px solid #0D0D0D",
            background: "#8B5CF6",
            padding: "32px",
            boxShadow: "8px 8px 0 #0D0D0D",
            marginBottom: "40px",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle size={28} />
              <h1 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>Weak Topic Deep-Dive</h1>
            </div>
            <p style={{ fontSize: "1rem", fontWeight: 700, opacity: 0.9 }}>
              Master these concepts to fix the {weakTopics.length} gaps identified in your {domain} analysis.
            </p>
          </div>
          <div 
             className="hidden md:flex flex-col items-center justify-center p-4 bg-white/20 border-2 border-white/40"
             style={{ backdropFilter: "blur(4px)" }}
          >
             <div style={{ fontSize: "1.5rem", fontWeight: 900 }}>{allRecs.length}</div>
             <div style={{ fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase" }}>Resources</div>
          </div>
        </div>

        {allRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allRecs.map((rec, i) => (
              <div
                key={`${rec.url}-${i}`}
                style={{
                  border: "4px solid #0D0D0D",
                  background: "#FFFFFF",
                  boxShadow: "8px 8px 0 #0D0D0D",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Video Preview */}
                <div className="relative aspect-video bg-gray-900 group overflow-hidden">
                   <img 
                      src={rec.url.includes('v=') 
                        ? `https://img.youtube.com/vi/${rec.url.split('v=')[1].split('&')[0]}/maxresdefault.jpg`
                        : `https://img.youtube.com/vi/${rec.url.split('/').pop()}/maxresdefault.jpg`}
                      alt={rec.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-105"
                   />
                   <a 
                      href={rec.url} 
                      target="_blank" 
                      className="absolute inset-0 flex items-center justify-center"
                   >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 border-4 border-black transition-transform hover:scale-110">
                        <Play fill="#FFF" color="#FFF" size={24} />
                      </div>
                   </a>
                   <div 
                      className="absolute top-4 left-4 px-3 py-1 text-xs font-black uppercase"
                      style={{ background: "#FFD60A", border: "2px solid #0D0D0D" }}
                   >
                      {rec.topic}
                   </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>{rec.title}</h2>
                  
                  <div 
                    className="p-4 mb-6 flex-1" 
                    style={{ background: "#F3F4F6", borderLeft: "4px solid #8B5CF6", fontSize: "0.9rem", fontWeight: 600, color: "#4B5563", fontStyle: "italic" }}
                  >
                    "{rec.why}"
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-black text-gray-500">
                       <Clock size={14} />
                       WATCH: {rec.segment}
                    </div>
                    <a
                      href={rec.url}
                      target="_blank"
                      className="brutal-btn px-4 py-2 text-sm font-black flex items-center gap-2"
                      style={{ background: "#1DB954" }}
                    >
                      WATCH <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="p-16 text-center"
            style={{ border: "4px solid #0D0D0D", background: "#FFFFFF", boxShadow: "10px 10px 0 #0D0D0D" }}
          >
            <div className="animate-bounce mb-4 flex justify-center text-8B5CF6">
              <Sparkles size={48} />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0D0D0D", marginBottom: 8 }}>
              Finding Learning Gaps...
            </div>
            <p className="text-gray-500 font-bold">We couldn't find any weak topics with video recommendations. Complete another quiz to refresh the analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
