import { fetchYouTubeVideos } from "./youtube";
import { 
  refineRecommendations, generateOptimizedQuery, filterVideosByDomain, 
  generateLearningCapsule, LearningCapsule, generateRootCauseExplanation 
} from "./ai";

export type LearningPersona = "KINDER" | "SCHOOL" | "ENGINEERING";
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
  concept?: string;
  action: string;
  why: string;
  fixes: string;
  recommendations?: YouTubeRecommendation[];
}

export interface QuestionResult {
  questionId: string;
  topic: string;
  concept?: string;
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
  microGaps: string[];
  detailedAiReport?: QuestionAnalysis[];
  capsule?: LearningCapsule | null;
}

export interface TopicScore {
  score: number;
  time: number;
}

export const DOMAIN_DATA: Record<string, { topics: string[]; graph: Record<string, string[]> }> = {
  DSA: {
    topics: ["Variables", "Loops", "Arrays", "Sorting", "Searching", "Recursion"],
    graph: {
      "Variables": [],
      "Loops": ["Variables"],
      "Arrays": ["Loops", "Variables"],
      "Sorting": ["Arrays", "Loops"],
      "Searching": ["Sorting", "Arrays"],
      "Recursion": ["Loops"]
    }
  },
  "Web Dev": {
    topics: ["HTML", "CSS", "JS Basics", "DOM", "React Basics", "State", "Hooks"],
    graph: {
      "HTML": [],
      "CSS": ["HTML"],
      "JS Basics": ["HTML"],
      "DOM": ["JS Basics", "HTML"],
      "React Basics": ["DOM", "JS Basics"],
      "State": ["React Basics"],
      "Hooks": ["State", "React Basics"]
    }
  },
  Aptitude: {
    topics: ["Arithmetic", "Algebra", "Geometry", "Probability", "Logic"],
    graph: {
      "Arithmetic": [],
      "Algebra": ["Arithmetic"],
      "Geometry": ["Arithmetic", "Algebra"],
      "Probability": ["Arithmetic", "Algebra"],
      "Logic": ["Arithmetic"]
    }
  },
  "Data Science": {
    topics: ["Python", "Pandas", "NumPy", "ML Basics", "Regression", "Classification"],
    graph: {
      "Python": [],
      "NumPy": ["Python"],
      "Pandas": ["NumPy", "Python"],
      "ML Basics": ["Pandas", "NumPy"],
      "Regression": ["ML Basics"],
      "Classification": ["ML Basics"]
    }
  },
  Cybersecurity: {
    topics: ["Networking", "Encryption", "OWASP", "PenTesting", "Firewalls"],
    graph: {
      "Networking": [],
      "Encryption": ["Networking"],
      "OWASP": ["Networking"],
      "PenTesting": ["OWASP", "Encryption", "Networking"],
      "Firewalls": ["Networking"]
    }
  },
  IoT: {
    topics: ["Circuits", "Arduino", "Sensors", "MQTT", "Cloud Connect"],
    graph: {
      "Circuits": [],
      "Arduino": ["Circuits"],
      "Sensors": ["Arduino", "Circuits"],
      "MQTT": ["Sensors", "Arduino"],
      "Cloud Connect": ["MQTT", "Sensors"]
    }
  },
  "App Dev": {
    topics: ["JS Setup", "RN Components", "Navigation", "API Fetch", "Persistence"],
    graph: {
      "JS Setup": [],
      "RN Components": ["JS Setup"],
      "Navigation": ["RN Components"],
      "API Fetch": ["Navigation", "RN Components"],
      "Persistence": ["API Fetch"]
    }
  },
  Python: {
    topics: ["Syntax", "Control Flow", "Functions", "OOP Basics", "Modules"],
    graph: {
      "Syntax": [],
      "Control Flow": ["Syntax"],
      "Functions": ["Control Flow", "Syntax"],
      "OOP Basics": ["Functions"],
      "Modules": ["Functions"]
    }
  },
  Alphabets: {
    topics: ["Letter Shapes", "Letter Names", "Capital Letters", "Letter Sounds", "Picture Matching"],
    graph: {
      "Letter Shapes": [],
      "Letter Names": ["Letter Shapes"],
      "Capital Letters": ["Letter Shapes"],
      "Letter Sounds": ["Letter Names"],
      "Picture Matching": ["Letter Sounds", "Capital Letters"]
    }
  },
  Numbers: {
    topics: ["Counting Objects", "Number Names", "More or Less", "Number Order", "Simple Addition"],
    graph: {
      "Counting Objects": [],
      "Number Names": ["Counting Objects"],
      "More or Less": ["Counting Objects"],
      "Number Order": ["Number Names", "More or Less"],
      "Simple Addition": ["Number Order"]
    }
  },
  "Colors & Shapes": {
    topics: ["Basic Colors", "Basic Shapes", "Object Colors", "Shape Matching", "Color Sorting"],
    graph: {
      "Basic Colors": [],
      "Basic Shapes": [],
      "Object Colors": ["Basic Colors"],
      "Shape Matching": ["Basic Shapes"],
      "Color Sorting": ["Basic Colors", "Object Colors"]
    }
  },
  "Rhymes & Stories": {
    topics: ["Listening Fun", "Animal Sounds", "Rhyme Pairs", "Story Moments", "Feelings in Stories"],
    graph: {
      "Listening Fun": [],
      "Animal Sounds": ["Listening Fun"],
      "Rhyme Pairs": ["Listening Fun"],
      "Story Moments": ["Animal Sounds"],
      "Feelings in Stories": ["Story Moments"]
    }
  },
  "Nature & EVS": {
    topics: ["Plants and Animals", "Weather Around Us", "Homes of Animals", "My Body", "Healthy Habits"],
    graph: {
      "Plants and Animals": [],
      "Weather Around Us": [],
      "Homes of Animals": ["Plants and Animals"],
      "My Body": ["Plants and Animals"],
      "Healthy Habits": ["My Body", "Weather Around Us"]
    }
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

  rawResults.forEach(res => {
    if (!res.isCorrect && res.concept) {
      if (!microGaps.includes(res.concept)) {
        microGaps.push(res.concept);
      }
    }
  });

  topics.forEach((t) => {
    const s = scores[t]?.score || 0;
    if (s < 45) {
      weakTopics.push(t);
      topicStatuses[t] = "weak";
    } else if (s < 75) {
      mediumTopics.push(t);
      topicStatuses[t] = "medium";
    } else {
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

  const chain: string[] = [];
  let current = rootCause;
  const visited = new Set();
  while (current && !visited.has(current)) {
    visited.add(current);
    chain.push(current);
    const dependents = Object.entries(graph).filter(([, deps]) => deps.includes(current));
    const nextWeak = dependents.find(([t]) => weakTopics.includes(t) || mediumTopics.includes(t));
    if (nextWeak) {
      current = nextWeak[0];
    } else {
      break;
    }
  }

  const learningPath: LearningStep[] = [];
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

  const topicStatusesResult: Record<string, TopicStatus> = {};
  topics.forEach(t => {
     topicStatusesResult[t] = topicStatuses[t] || "strong";
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
    learningPath: learningPath.slice(0, 5),
    topicStatuses: topicStatusesResult,
    microGaps,
  };
}

/**
 * Async version with YouTube and AI
 */
export async function analyzePerformanceAsync(
  scores: Record<string, TopicScore>,
  domain: string,
  rawResults: QuestionResult[] = [],
  persona: LearningPersona = "ENGINEERING"
): Promise<AnalysisResult> {
  const result = analyzePerformance(scores, domain, rawResults);
  
  const enhancedPath = await Promise.all(result.learningPath.map(async (step, i) => {
    if (i > 4) return step; 
    const focalPoint = step.concept || step.topic;
    const query = await generateOptimizedQuery(focalPoint, step.fixes, "beginner", domain);
    const rawVideos = await fetchYouTubeVideos(query);
    const filteredVideos = filterVideosByDomain(rawVideos, domain);
    const refined = await refineRecommendations(filteredVideos, focalPoint, step.fixes, "beginner", domain);
    return { ...step, recommendations: refined };
  }));

  const capsule = await generateLearningCapsule(
    persona,
    result.weakTopics,
    rawResults.filter(r => !r.isCorrect).map(r => r.concept || r.topic),
    result.dependencyChain,
    "beginner"
  );

  const dynamicExplanation = await generateRootCauseExplanation(
    persona,
    domain,
    result.rootCause,
    result.weakTopics,
    result.dependencyChain
  );

  return { ...result, learningPath: enhancedPath, capsule, explanation: dynamicExplanation };
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
    const dependents = Object.entries(graph).filter(([, deps]) => deps.includes(current));
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
