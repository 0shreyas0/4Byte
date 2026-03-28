import { GoogleGenerativeAI } from "@google/generative-ai";
import { YouTubeVideo } from "./youtube";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface RefinedRecommendation {
  title: string;
  url: string;
  focus_concept: string;
  recommended_segment: string;
  why_this_video: string;
}

/**
 * Generate a clean, high-relevance search query using AI.
 */
export async function generateOptimizedQuery(
  concept: string, 
  learningGap: string, 
  difficulty: string
): Promise<string> {
  if (!apiKey || apiKey === "YOUR_AI_KEY_HERE") {
    return `${concept} ${difficulty} explanation`;
  }

  const prompt = `
    Generate a high-quality YouTube search query (max 6 words) for an educational video.
    Topic: ${concept}
    Student issue: ${learningGap}
    Level: ${difficulty}
    Query: 
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/"/g, '');
    return text;
  } catch (error) {
    return `${concept} ${difficulty} tutorial`;
  }
}

/**
 * PROMPT STRATEGY (as per requirements)
 * 
 * We pass the list of real YouTube videos fetched from the API to the LLM.
 * The LLM's task is to SELECT the best 3 and explain why they fit the specific learning gap.
 */
export async function refineRecommendations(
  videos: YouTubeVideo[],
  concept: string,
  mistake: string,
  difficulty: string
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
      why_this_video: `This video covers ${concept} in a way that addresses your current gap.`,
    }));
  }

  console.log("AI Layer: Real refinement for", { concept, mistake, difficulty });

  const videoList = videos.map(v => `- TITLE: "${v.title}" | URL: ${v.url}`).join('\n');
  
  const prompt = `
    You are an AI Learning Assistant. Rank and select the top 2 best videos for:
    CONCEPT: ${concept}
    STUDENT ISSUE: ${mistake}
    DIFFICULTY: ${difficulty}
    
    REAL VIDEOS:
    ${videoList}
    
    TASK:
    - Select EXACTLY from the list. DO NOT hallucinate.
    - Identify the MOST RELEVANT PART (timestamp range if possible).
    - Explain WHY it helps.
    
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
      recommended_segment: "Best available",
      why_this_video: "Selected as a top match for your learning path."
    }));
  }
}
