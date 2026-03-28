import { YouTubeVideo } from "./youtube";

export interface RefinedRecommendation {
  title: string;
  url: string;
  focus_concept: string;
  recommended_segment: string;
  why_this_video: string;
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
  // In a real implementation, this would call OpenAI/Gemini/Anthropic
  // For now, we simulate the LLM logic by choosing the best matches from the provided list.
  
  if (videos.length === 0) return [];

  console.log("AI Layer: Refining videos for", { concept, mistake, difficulty });

  // Simulate AI selection logic
  // We'll pick the first 3 (or fewer) and generate "AI" explanations for them
  return videos.slice(0, 3).map((v, i) => {
    return {
      title: v.title,
      url: v.url,
      focus_concept: `Mastering ${concept} through practical examples`,
      recommended_segment: i === 0 ? "2:10 - 5:30" : i === 1 ? "1:15 - 4:00" : "3:45 - 7:20",
      why_this_video: `This video directly addresses the struggle with ${mistake} by providing a clear, ${difficulty}-friendly walkthrough of the underlying logic.`,
    };
  });
}

/**
 * Updated Prompt (for reference in backend/LLM calls)
 */
export const REFINEMENT_PROMPT = `
You are an intelligent learning recommendation system.
You are given REAL YouTube videos.
DO NOT create or hallucinate videos.
Select ONLY from the provided list.

VIDEOS:
{{video_list}}

TASK:
1. Identify best 3 videos for the user's learning gap
2. Explain WHY each video is useful
3. Map each video to a specific concept
4. Identify the MOST RELEVANT PART (timestamp range if possible)

Return JSON only.
`;
