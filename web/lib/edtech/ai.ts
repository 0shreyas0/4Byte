import { GoogleGenerativeAI } from "@google/generative-ai";
import { YouTubeVideo } from "./youtube";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
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
  if (!apiKey || apiKey === "YOUR_AI_KEY_HERE") {
    return null;
  }

  const prompt = `
    You are an advanced AI Learning Engine.

    Your task is to convert student performance analysis into a personalized, high-quality learning output.

    DO NOT give generic explanations.
    DO NOT output random theory.
    Your response must be tailored to the student's mistakes, level, and learning needs.

    ========================
    INPUT
    ========================

    Mode: ${mode}  
    (KINDER / SCHOOL / ENGINEERING)

    Weak Topics: ${weakTopics.join(", ")}

    Mistakes: ${mistakes.join("; ")}

    Concept Chain: ${conceptChain.join(" -> ")}

    User Level: ${level}

    ========================
    YOUR TASK
    ========================

    1. Identify the EXACT learning gaps
       - Be specific (e.g., "loop boundary condition", not just "loops")

    2. Adapt explanation BASED ON MODE:

       If KINDER:
       - Use simple words
       - Use examples, visuals, or analogies
       - Keep it playful and short

       If SCHOOL:
       - Use step-by-step explanations
       - Focus on clarity and correctness
       - Add examples and formulas

       If ENGINEERING:
       - Be precise and technical
       - Include rules, edge cases, and best practices
       - Focus on reasoning

    3. Generate a structured "Learning Capsule" including:

       - Concept Summary
       - What the student did wrong (personalized)
       - Correct Rule / Insight
       - Example (simple but clear)
       - Memory Aid (mnemonic or trick)
       - Quick Recall Question

    4. Make content:
       - concise
       - scannable
       - useful for revision

    5. Keep tone:
       - supportive
       - clear
       - slightly engaging (not robotic)

    ========================
    OUTPUT FORMAT (STRICT JSON)
    ========================

    {
      "learning_gap": "...",
      "topics": [
        {
          "name": "...",
          "summary": "...",
          "mistake": "...",
          "rule": "...",
          "example": "...",
          "mnemonic": "...",
          "recall_question": "..."
        }
      ],
      "next_action": "..."
    }

    ========================
    IMPORTANT RULES
    ========================

    - NO generic textbook definitions
    - MUST reference user's mistakes
    - MUST adapt to learning mode
    - KEEP output clean and structured
    - Avoid long paragraphs
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Learning Capsule failure:", error);
    return null;
  }
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
  if (!apiKey || apiKey === "YOUR_AI_KEY_HERE") {
    return [
      `You struggled with ${rootCause}.`,
      `Since ${rootCause} is a foundation for ${dependencyChain.slice(1).join(", ")}, you also faced issues there.`,
      `Focus on ${rootCause} first to improve your overall score.`
    ];
  }

  const prompt = `
    You are an Expert AI Tutor explaining test results.
    
    ========================
    CONTEXT
    ========================
    Domain: ${domain}
    Learning Mode: ${mode}
    Analysis:
    - Main Root Cause: ${rootCause}
    - Weak Topics: ${weakTopics.join(", ")}
    - Dependency Chain: ${dependencyChain.join(" -> ")}
    
    ========================
    YOUR TASK
    ========================
    1. Explain WHY the student failed. 
    2. Focus on the dependency (e.g. "You failed sorting BECAUSE sorting depends on loops, and your loops are weak").
    3. Tracing the "Concept Graph" is the core of this explanation.
    4. Provide clear, actionable advice.
    5. Adapt tone to ${mode} mode:
       - KINDER: Very simple, analogies, friendly.
       - SCHOOL: Clear, step-by-step, encouraging.
       - ENGINEERING: Technical, precise, focused on logic flow.
    
    ========================
    OUTPUT FORMAT
    ========================
    Return a JSON ARRAY of strings. Each string is ONE SHORT PARAGRAPH or sentence.
    The Tutor will speak these strings one by one. Max 4 to 6 parts.
    
    Example: ["You did your best!", "However, your main issue is in loops.", "Because sorting depends on loops, that's why you struggled with the sorting questions.", "Master loops first, and everything else will get easier!"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return [
      `Our analysis shows your main hurdle is ${rootCause}.`,
      `Tracing your mistakes, we see that your weakness in ${rootCause} directly affected your performance in ${dependencyChain.slice(1, 3).join(" and ")}.`,
      `This is because ${dependencyChain[1] || "these topics"} rely heavily on the foundations of ${rootCause}.`,
      `Strengthen ${rootCause} first, and you will see a massive improvement in your overall ${domain} skills!`
    ];
  }
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
