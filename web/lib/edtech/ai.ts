import { YouTubeVideo } from "./youtube";

// This library now calls the backend API route instead of using Groq directly

// 🔥 DOMAIN CONTEXT MAP
export const DOMAIN_CONTEXT: Record<string, string> = {
  DSA: "data structures algorithms programming c++ java python dsa tutorial",
  "Web Dev": "html css javascript react web development frontend backend fullstack",
  Aptitude: "quantitative aptitude maths reasoning problem solving placement prep",
  "Data Science": "machine learning python pandas numpy data science analytics",
  Cybersecurity: "network security ethical hacking penetration testing cyber security",
  IoT: "embedded systems arduino sensors hardware internet of things",
  "App Dev": "react native mobile app development android ios flutter",
  Python: "python programming basics oop scripting python tutorial",
  "Product Design": "ui ux design figma user experience interface research prototyping",
  Marketing: "digital marketing seo sem social media content strategy analytics",
  Business: "finance accounting entrepreneurship business strategy startup management",
  "Content Creation": "video editing storytelling youtube growth podcasting creative writing"
};

// 🔥 DOMAIN KEYWORDS FOR FILTERING
export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  DSA: ["c++", "java", "python", "algorithm", "array", "dsa", "structure", "leet", "code"],
  "Web Dev": ["html", "css", "javascript", "react", "web", "frontend", "backend", "js"],
  Aptitude: ["aptitude", "quant", "reasoning", "tricks", "math", "placement"],
  "Data Science": ["python", "machine", "data", "ml", "pandas", "numpy", "science"],
  Cybersecurity: ["security", "hacking", "network", "cyber", "penetration", "threat"],
  IoT: ["arduino", "iot", "sensor", "embedded", "hardware", "raspberry"],
  "App Dev": ["mobile", "react", "native", "flutter", "android", "ios", "app"],
  Python: ["python", "programming", "scripting", "basics", "oop"],
  "Product Design": ["design", "ui", "ux", "figma", "experience", "interface", "prototype"],
  Marketing: ["marketing", "seo", "content", "social", "media", "brand", "analytics"],
  Business: ["finance", "business", "startup", "strategy", "management", "accounting"],
  "Content Creation": ["video", "editing", "storytelling", "creative", "podcast", "content"]
};

/**
 * Generate a clean, domain-aware search query using AI.
 */
export async function generateOptimizedQuery(
  concept: string, 
  learningGap: string, 
  difficulty: string,
  domain: string
): Promise<string> {
  const context = DOMAIN_CONTEXT[domain] || "";
  
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generateQuery",
        concept,
        learningGap,
        difficulty,
        domain,
      }),
    });

    if (!response.ok) throw new Error("Failed to generate query");
    
    const data = await response.json();
    return data.query || `${concept} ${context} ${difficulty} tutorial`.trim();
  } catch (error) {
    console.error("Query generation failed:", error);
    return `${concept} ${context} ${difficulty} tutorial`.trim();
  }
}

/**
 * Filter videos based on domain-specific keywords to remove 80% garbage.
 */
export function filterVideosByDomain(videos: YouTubeVideo[], domain: string): YouTubeVideo[] {
  const keywords = DOMAIN_KEYWORDS[domain];
  if (!keywords) return videos;

  return videos.filter(v => {
    const combined = (v.title + " " + (v as any).channel).toLowerCase();
    return keywords.some(k => combined.includes(k.toLowerCase()));
  });
}

/**
 * PROMPT STRATEGY (Improved with Domain Awareness)
 */
export async function refineRecommendations(
  videos: YouTubeVideo[],
  concept: string,
  mistake: string,
  difficulty: string,
  domain: string
): Promise<RefinedRecommendation[]> {
  if (videos.length === 0) return [];

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "refineVideos",
        concept,
        mistake,
        difficulty,
        domain,
        videos: videos.map(v => ({
          title: v.title,
          url: v.url,
          channel: v.channel,
        })),
      }),
    });

    if (!response.ok) throw new Error("Failed to refine recommendations");
    
    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error("Groq Refinement failed, using fallback:", error);
    return videos.slice(0, 3).map(v => ({
      title: v.title,
      url: v.url,
      focus_concept: concept,
      recommended_segment: "Start to finish",
      why_this_video: `Core resource for ${concept} in the ${domain} path.`
    }));
  }
}

export interface RefinedRecommendation {
  title: string;
  url: string;
  focus_concept: string;
  recommended_segment: string;
  why_this_video: string;
}

export interface LearningCapsule {
  learning_gap: string;
  topics: {
    name: string;
    summary: string;
    mistake: string;
    rule: string;
    example: string;
    mnemonic: string;
    recall_question: string;
  }[];
  next_action: string;
}

/**
 * 🔥 NEW: Generate a personalized Learning Capsule based on student analysis.
 */
export async function generateLearningCapsule(
  mode: "KINDER" | "SCHOOL" | "ENGINEERING",
  weakTopics: string[],
  mistakes: string[],
  conceptChain: string[],
  level: string
): Promise<LearningCapsule | null> {
  // Learning Capsule generation is currently disabled
  // Use /api/ai endpoint for AI-powered features
  return null;
}

/**
 * 🔥 NEW: Generate a conversational, sequential explanation based on the Concept Graph.
 * Identifies WHY the user failed by tracing dependencies.
 */
export async function generateRootCauseExplanation(
  mode: "KINDER" | "SCHOOL" | "ENGINEERING",
  domain: string,
  rootCause: string,
  weakTopics: string[],
  dependencyChain: string[]
): Promise<string[]> {
  // Fallback to simple explanation template
  return [
    `You struggled with ${rootCause}.`,
    `Since ${rootCause} is a foundation for ${dependencyChain.slice(1).join(", ")}, you also faced issues there.`,
    `Focus on ${rootCause} first to improve your overall score.`
  ];
}

/**
 * 🔥 NEW: Explain a specific piece of text (highlighted by user).
 * Returns a sequential array of strings for the tutor to speak.
 */
/**
 * 🔥 NEW: Explain a specific piece of text using the server-side API.
 */
export async function explainTextSelection(
  selection: string,
  mode: "KINDER" | "SCHOOL" | "ENGINEERING" = "ENGINEERING"
): Promise<string[]> {
  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection, mode })
    });

    if (!response.ok) {
       const err = await response.json().catch(() => ({}));
       throw new Error(err.error || "API Route Failure");
    }

    const segments = await response.json();
    if (Array.isArray(segments)) return segments;
    
    return [
      "Analyzing: " + (selection.length > 20 ? selection.slice(0, 20) + "..." : selection),
      "Found internal conceptual dependencies.",
      "Stand by while I synchronize your learning path."
    ];
  } catch (error: any) {
    console.error("Selection explanation failed:", error.message);
    return [
      `Status: ${error.message}`,
      `Selection: "${selection.slice(0, 20)}..."`,
      "Identifying the core conceptual dependencies.",
      "Try again in a moment!"
    ];
  }
}
