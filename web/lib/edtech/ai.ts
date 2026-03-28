import { GoogleGenerativeAI } from "@google/generative-ai";
import { YouTubeVideo } from "./youtube";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🔥 DOMAIN CONTEXT MAP
export const DOMAIN_CONTEXT: Record<string, string> = {
  DSA: "data structures algorithms programming c++ java python dsa tutorial",
  "Web Dev": "html css javascript react web development frontend backend fullstack",
  Aptitude: "quantitative aptitude maths reasoning problem solving placement prep",
  "Data Science": "machine learning python pandas numpy data science analytics",
  Cybersecurity: "network security ethical hacking penetration testing cyber security",
  IoT: "embedded systems arduino sensors hardware internet of things",
  "App Dev": "react native mobile app development android ios flutter",
  Python: "python programming basics oop scripting python tutorial"
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
  Python: ["python", "programming", "scripting", "basics", "oop"]
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
  
  if (!apiKey || apiKey === "YOUR_AI_KEY_HERE") {
    return `${concept} ${context} ${difficulty} tutorial -microsoft -product`.trim();
  }

  const prompt = `
    Generate a high-quality YouTube search query (max 7 words) for an educational video.
    Domain: ${domain} (Context: ${context})
    Topic: ${concept}
    Student issue: ${learningGap}
    Level: ${difficulty}
    
    Instruction: Ensure the query is highly focused on the ${domain} domain. Exclude generic results.
    Query: 
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim().replace(/"/g, '');
    // Ensure domain keywords are present if AI misses them
    if (domain === "DSA" && !text.toLowerCase().includes("dsa") && !text.toLowerCase().includes("algorithm")) {
        text += " dsa algorithm";
    }
    return text;
  } catch (error) {
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

  // Fallback if no API key
  if (!apiKey || apiKey === "YOUR_AI_KEY_HERE") {
    console.warn("Gemini API Key missing. Returning unrefined data.");
    return videos.slice(0, 3).map((v, i) => ({
      title: v.title,
      url: v.url,
      focus_concept: `Mastering ${concept}`,
      recommended_segment: "Start to middle",
      why_this_video: `This ${domain} tutorial specifically addresses ${concept}.`,
    }));
  }

  console.log(`AI Layer: Domain-Aware refinement for [${domain}]`, { concept, mistake, difficulty });

  const videoList = videos.map(v => `- TITLE: "${v.title}" | CHANNEL: ${v.channel} | URL: ${v.url}`).join('\n');
  
  const prompt = `
    You are an Expert ${domain} AI Tutor. Rank and select the top 2 best videos for:
    DOMAIN: ${domain}
    CONCEPT: ${concept}
    STUDENT ISSUE: ${mistake}
    DIFFICULTY: ${difficulty}
    
    REAL VIDEOS:
    ${videoList}
    
    CRITICAL INSTRUCTIONS:
    - ONLY recommend videos that are strictly relevant to ${domain}.
    - Ignore generic or unrelated "product" videos (e.g., ignore Microsoft Loop if domain is DSA).
    - Identify EXACT segment (timestamps) that solves the student's issue.
    - Explain WHY this specific video is perfect for a ${difficulty} student in ${domain}.
    
    RETURN ONLY CLEAN JSON ARRAY:
    [{ "title": "...", "url": "...", "focus_concept": "...", "recommended_segment": "...", "why_this_video": "..." }]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON in AI response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Refinement failed, using fallback:", error);
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
