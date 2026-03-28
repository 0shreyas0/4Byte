import { fetchYouTubeVideos } from "./youtube";
import { refineRecommendations, generateOptimizedQuery, filterVideosByDomain } from "./ai";

export type TopicStatus = "weak" | "medium" | "strong";

export interface YouTubeRecommendation {
  title: string;
  url: string;
  focus_concept: string;
  recommended_segment: string;
  why_this_video: string;
}

export interface LearningStep {
  topic: string;
  concept?: string; // 🔥 Added: micro-gap concept
  action: string;
  why: string;
  fixes: string;
  recommendations?: YouTubeRecommendation[];
}

export interface QuestionResult {
  questionId: string;
  topic: string;
  concept?: string; // 🔥 Added: concept-level tracking
  isCorrect: boolean;
  timeSpent: number;
}

import { QuestionAnalysis } from "@/lib/rag";

export interface AnalysisResult {
  weakTopics: string[];
  mediumTopics: string[];
  strongTopics: string[];
  rootCause: string;
  dependencyChain: string[];
  explanation: string[];
  learningPath: LearningStep[];
  topicStatuses: Record<string, TopicStatus>;
  microGaps: string[]; // 🔥 Added: list of specific concept mistakes
  detailedAiReport?: QuestionAnalysis[];
}

export interface TopicScore {
  score: number;
  time: number;
}

export const DOMAIN_DATA: Record<string, { topics: string[]; graph: Record<string, string[]> }> = {
  DSA: {
    topics: ["Variables", "Loops", "Arrays", "Sorting", "Searching", "Recursion"],
    graph: {
      Variables: [],
      Loops: ["Variables"],
      Arrays: ["Variables", "Loops"],
      Sorting: ["Arrays", "Loops"],
      Searching: ["Arrays", "Loops"],
      Recursion: ["Variables", "Loops"],
    },
  },
  "Web Dev": {
    topics: ["HTML Basics", "CSS Basics", "JS Basics", "DOM", "Events", "Fetch/API", "Flexbox", "React Basics"],
    graph: {
      "HTML Basics": [],
      "CSS Basics": ["HTML Basics"],
      "JS Basics": ["HTML Basics"],
      DOM: ["HTML Basics", "JS Basics"],
      Events: ["DOM"],
      "Fetch/API": ["JS Basics"],
      Flexbox: ["CSS Basics"],
      "React Basics": ["JS Basics", "DOM", "Events"],
    },
  },
  Aptitude: {
    topics: ["Arithmetic", "Percentages", "Ratios", "Algebra", "Time & Work", "Profit & Loss", "Time & Distance", "Probability"],
    graph: {
      Arithmetic: [],
      Percentages: ["Arithmetic"],
      Ratios: ["Arithmetic"],
      Algebra: ["Arithmetic"],
      "Profit & Loss": ["Percentages"],
      "Time & Work": ["Ratios"],
      "Time & Distance": ["Ratios", "Algebra"],
      Probability: ["Percentages", "Ratios"],
    },
  },
  "App Dev": {
    topics: ["React Native Basics", "Navigation & Routing", "UI Components", "State Management", "Native APIs", "Firebase Integration", "App Store Deployment", "Performance Optimization"],
    graph: {
      "React Native Basics": [],
      "UI Components": ["React Native Basics"],
      "Navigation & Routing": ["UI Components"],
      "State Management": ["React Native Basics"],
      "Native APIs": ["React Native Basics"],
      "Firebase Integration": ["State Management"],
      "App Store Deployment": ["UI Components"],
      "Performance Optimization": ["State Management", "Native APIs"],
    },
  }
};

/**
 * 🔥 NEW MISTAKE-DRIVEN Performance Analysis
 */
export function analyzePerformance(
  scores: Record<string, TopicScore>,
  domain: string,
  rawResults: QuestionResult[] = []
): AnalysisResult {
  const data = DOMAIN_DATA[domain] || DOMAIN_DATA["DSA"];
  const topics = data.topics;
  const graph = data.graph;

  const weakTopics: string[] = [];
  const mediumTopics: string[] = [];
  const strongTopics: string[] = [];
  const topicStatuses: Record<string, TopicStatus> = {};
  const microGaps: string[] = [];

  // 1. Identify Micro-Gaps (Mistake-Driven)
  rawResults.forEach(res => {
    if (!res.isCorrect && res.concept) {
      if (!microGaps.includes(res.concept)) {
        microGaps.push(res.concept);
      }
    }
  });

  // 2. Identify Macro-Gaps (Score-Driven)
  topics.forEach((t) => {
    const s = scores[t]?.score || 0;
    if (s < 45) {
      weakTopics.push(t);
      topicStatuses[t] = "weak";
    } else if (s < 75) {
      mediumTopics.push(t);
      topicStatuses[t] = "medium";
    } else {
      // 💡 NEW: Even if strong, if mistakes exist in this topic, it remains a focus
      const hasConceptMistakeInTopic = rawResults.some(r => r.topic === t && !r.isCorrect);
      if (hasConceptMistakeInTopic) {
        mediumTopics.push(t);
        topicStatuses[t] = "medium";
      } else {
        strongTopics.push(t);
        topicStatuses[t] = "strong";
      }
    }
  });

  // 3. Find Root Cause among Weak Topics
  let rootCause = weakTopics.length > 0 ? weakTopics[0] : microGaps.length > 0 ? microGaps[0] : topics[0];
  if (weakTopics.length > 0) {
    for (const t of weakTopics) {
      const deps = graph[t] || [];
      const hasWeakDep = deps.some((d) => weakTopics.includes(d));
      if (!hasWeakDep) {
        rootCause = t;
        break;
      }
    }
  }

  // 4. Build Dependency Chain
  const chain: string[] = [];
  let current = rootCause;
  const visited = new Set();
  while (current && !visited.has(current)) {
    visited.add(current);
    chain.push(current);
    const dependents = Object.entries(graph).filter(([t, deps]) => deps.includes(current));
    const nextWeak = dependents.find(([t]) => weakTopics.includes(t) || mediumTopics.includes(t));
    if (nextWeak) {
      current = nextWeak[0];
    } else {
      break;
    }
  }

  // 5. Generate Micro-Gap Learning Steps
  const learningPath: LearningStep[] = [];
  
  // First, address micro-gaps (specific conceptual mistakes)
  microGaps.forEach(concept => {
    const parentTopic = rawResults.find(r => r.concept === concept)?.topic || "General";
    learningPath.push({
      topic: parentTopic,
      concept: concept,
      action: `Master ${concept}`,
      why: `You made mistakes in ${concept} even though your general knowledge of ${parentTopic} might be high.`,
      fixes: `Focused study on ${concept} logic and common pitfalls.`
    });
  });

  // Then add macro steps if not already covered
  const seenTopics = new Set(learningPath.map(s => s.topic));
  chain.forEach((t) => {
    if (!seenTopics.has(t)) {
      learningPath.push({
        topic: t,
        action: `Strengthen ${t}`,
        why: `Topic ${t} is a critical dependency in your ${domain} path.`,
        fixes: `Deep dive into ${t} fundamentals and practical applications.`
      });
    }
  });

  return {
    weakTopics,
    mediumTopics,
    strongTopics,
    rootCause,
    dependencyChain: chain,
    explanation: [
      `Our analysis identified ${microGaps.length} conceptual micro-gaps.`,
      `Root cause: ${rootCause}`
    ],
    learningPath: learningPath.slice(0, 5), // Keep it concise
    topicStatuses,
    microGaps,
  };
}

/**
 * Async version with YouTube and AI
 */
export async function analyzePerformanceAsync(
  scores: Record<string, TopicScore>,
  domain: string,
  rawResults: QuestionResult[] = []
): Promise<AnalysisResult> {
  const result = analyzePerformance(scores, domain, rawResults);
  
  const enhancedPath = await Promise.all(result.learningPath.map(async (step, i) => {
    // Only fetch for first 3 critical steps (micro or macro)
    if (i > 2) return step; 

    const focalPoint = step.concept || step.topic;
    const query = await generateOptimizedQuery(focalPoint, step.fixes, "beginner", domain);
    const rawVideos = await fetchYouTubeVideos(query);
    const filteredVideos = filterVideosByDomain(rawVideos, domain);
    const refined = await refineRecommendations(filteredVideos, focalPoint, step.fixes, "beginner", domain);

    return { ...step, recommendations: refined };
  }));

  return { ...result, learningPath: enhancedPath };
}

export function simulateImprovement(
  originalScores: Record<string, TopicScore>,
  improvedTopic: string,
  newScore: number,
  graph: Record<string, string[]>
): Record<string, number> {
  const result: Record<string, number> = {};
  Object.entries(originalScores).forEach(([t, v]) => (result[t] = v.score));

  result[improvedTopic] = newScore;

  const queue = [improvedTopic];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.add(current);

    const dependents = Object.entries(graph).filter(([t, deps]) => deps.includes(current));
    for (const [depName] of dependents) {
      if (!visited.has(depName)) {
        const currentScore = result[depName] || 0;
        const gain = (result[current] - (originalScores[current]?.score || 0)) * 0.6;
        result[depName] = Math.min(100, Math.max(currentScore, currentScore + gain));
        queue.push(depName);
      }
    }
  }

  return result;
}
