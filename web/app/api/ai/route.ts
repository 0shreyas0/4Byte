import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Domain context for AI refinement
const DOMAIN_CONTEXT: Record<string, string> = {
  DSA: "data structures algorithms programming c++ java python dsa tutorial",
  "Web Dev": "html css javascript react web development frontend backend fullstack",
  Aptitude: "quantitative aptitude maths reasoning problem solving placement prep",
  "Data Science": "machine learning python pandas numpy data science analytics",
  Cybersecurity: "network security ethical hacking penetration testing cyber security",
  IoT: "embedded systems arduino sensors hardware internet of things",
  "App Dev": "react native mobile app development android ios flutter",
  Python: "python programming basics oop scripting python tutorial",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, concept, learningGap, difficulty, domain, videos } = body;

    if (action === "generateQuery") {
      return await generateOptimizedQuery(concept, learningGap, difficulty, domain);
    } else if (action === "refineVideos") {
      return await refineVideoRecommendations(videos, concept, learningGap, difficulty, domain);
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process AI request" },
      { status: 500 }
    );
  }
}

async function generateOptimizedQuery(
  concept: string,
  learningGap: string,
  difficulty: string,
  domain: string
): Promise<NextResponse> {
  const context = DOMAIN_CONTEXT[domain] || "";

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
    const result = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    let text = result.choices[0]?.message?.content?.trim() || "";
    text = text.replace(/"/g, "");

    // Ensure domain keywords are present if AI misses them
    if (domain === "DSA" && !text.toLowerCase().includes("dsa") && !text.toLowerCase().includes("algorithm")) {
      text += " dsa algorithm";
    }

    return NextResponse.json({ query: text });
  } catch (error) {
    const fallback = `${concept} ${context} ${difficulty} tutorial`.trim();
    return NextResponse.json({ query: fallback });
  }
}

async function refineVideoRecommendations(
  videos: any[],
  concept: string,
  mistake: string,
  difficulty: string,
  domain: string
): Promise<NextResponse> {
  if (videos.length === 0) {
    return NextResponse.json({ recommendations: [] });
  }

  const videoList = videos
    .map((v) => `- TITLE: "${v.title}" | CHANNEL: ${v.channel || "Unknown"} | URL: ${v.url}`)
    .join("\n");

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
    const result = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = result.choices[0]?.message?.content?.trim() || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("No JSON in AI response");
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Groq Refinement failed:", error);
    // Return fallback recommendations
    const fallback = videos.slice(0, 3).map((v) => ({
      title: v.title,
      url: v.url,
      focus_concept: concept,
      recommended_segment: "Start to finish",
      why_this_video: `Core resource for ${concept} in the ${domain} path.`,
    }));
    return NextResponse.json({ recommendations: fallback });
  }
}
