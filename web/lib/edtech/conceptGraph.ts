export type TopicStatus = "weak" | "medium" | "strong";

export interface TopicScore {
  score: number;
  time: number; // seconds spent
}

export interface DependencyGraph {
  [topic: string]: string[];
}

export interface AnalysisResult {
  weakTopics: string[];
  mediumTopics: string[];
  strongTopics: string[];
  rootCause: string;
  dependencyChain: string[];
  explanation: string[];
  learningPath: LearningStep[];
  topicStatuses: Record<string, TopicStatus>;
}

export interface LearningStep {
  topic: string;
  action: string;
  why: string;
  fixes: string;
}

export const DOMAIN_DATA: Record<
  string,
  { graph: DependencyGraph; topics: string[]; description: string }
> = {
  DSA: {
    description: "Data Structures & Algorithms",
    topics: [
      "Variables",
      "Loops",
      "Functions",
      "Arrays",
      "Strings",
      "Recursion",
      "Sorting",
      "Searching",
      "Linked Lists",
      "Trees",
    ],
    graph: {
      Variables: [],
      Loops: ["Variables"],
      Functions: ["Variables"],
      Arrays: ["Loops", "Variables"],
      Strings: ["Arrays"],
      Recursion: ["Functions"],
      Sorting: ["Arrays", "Loops"],
      Searching: ["Arrays", "Loops"],
      "Linked Lists": ["Pointers", "Functions"],
      Trees: ["Recursion", "Linked Lists"],
    },
  },
  "Web Dev": {
    description: "Web Development",
    topics: [
      "HTML Basics",
      "CSS Basics",
      "Flexbox",
      "Grid",
      "JS Basics",
      "DOM",
      "Events",
      "Fetch/API",
      "React Basics",
      "State Management",
    ],
    graph: {
      "HTML Basics": [],
      "CSS Basics": ["HTML Basics"],
      Flexbox: ["CSS Basics"],
      Grid: ["CSS Basics"],
      "JS Basics": [],
      DOM: ["HTML Basics", "JS Basics"],
      Events: ["DOM"],
      "Fetch/API": ["JS Basics", "Events"],
      "React Basics": ["JS Basics", "DOM"],
      "State Management": ["React Basics"],
    },
  },
  Aptitude: {
    description: "Quantitative Aptitude",
    topics: [
      "Arithmetic",
      "Percentages",
      "Ratios",
      "Algebra",
      "Geometry",
      "Time & Work",
      "Time & Distance",
      "Profit & Loss",
      "Probability",
      "Permutation",
    ],
    graph: {
      Arithmetic: [],
      Percentages: ["Arithmetic"],
      Ratios: ["Arithmetic"],
      Algebra: ["Arithmetic"],
      Geometry: ["Arithmetic"],
      "Time & Work": ["Ratios", "Arithmetic"],
      "Time & Distance": ["Ratios", "Arithmetic"],
      "Profit & Loss": ["Percentages", "Arithmetic"],
      Probability: ["Ratios"],
      Permutation: ["Probability"],
    },
  },
};

export function getTopicStatus(score: number): TopicStatus {
  if (score < 45) return "weak";
  if (score < 70) return "medium";
  return "strong";
}

export function findRootCause(
  weakTopics: string[],
  graph: DependencyGraph
): { rootCause: string; chain: string[] } {
  // Find the weak topic with fewest (or no) dependencies that others depend on
  const weakSet = new Set(weakTopics);

  // Score each weak topic by how many other weak topics depend on it
  let bestRoot = weakTopics[0];
  let maxDependents = -1;

  for (const candidate of weakTopics) {
    const deps = graph[candidate] || [];
    const allDepsWeak = deps.every((d) => weakSet.has(d) || deps.length === 0);

    // Count how many other weak topics depend on this one
    let dependents = 0;
    for (const other of weakTopics) {
      if (other !== candidate && (graph[other] || []).includes(candidate)) {
        dependents++;
      }
    }

    if (allDepsWeak && dependents > maxDependents) {
      maxDependents = dependents;
      bestRoot = candidate;
    }
  }

  // Build the chain from root to failures
  const chain: string[] = [bestRoot];
  let current = bestRoot;
  for (let i = 0; i < 5; i++) {
    const next = weakTopics.find(
      (t) => t !== current && (graph[t] || []).includes(current)
    );
    if (!next) break;
    chain.push(next);
    current = next;
  }

  return { rootCause: bestRoot, chain };
}

export function buildLearningPath(
  rootCause: string,
  chain: string[],
  domain: string
): LearningStep[] {
  const pathReasons: Record<string, { action: string; why: string; fixes: string }> = {
    Loops: {
      action: "Master Loops",
      why: "Loops are the foundation of all iteration logic",
      fixes: "Fixes array traversal, sorting, and searching problems",
    },
    Variables: {
      action: "Solidify Variables & Types",
      why: "Variables are the atomic unit of all computation",
      fixes: "Fixes type errors and logic bugs across all topics",
    },
    Arrays: {
      action: "Practice Arrays",
      why: "Arrays are the most fundamental data structure",
      fixes: "Directly unblocks Sorting, Searching, and Strings",
    },
    Sorting: {
      action: "Reattempt Sorting",
      why: "Now that prerequisites are solid, sorting is achievable",
      fixes: "Completes the DSA foundation for interviews",
    },
    Arithmetic: {
      action: "Master Arithmetic Basics",
      why: "All aptitude topics are built on arithmetic",
      fixes: "Unblocks percentages, ratios, and algebra",
    },
    "HTML Basics": {
      action: "Revisit HTML Basics",
      why: "HTML is the skeleton of every webpage",
      fixes: "Unblocks CSS, DOM, and React topics",
    },
    "JS Basics": {
      action: "Strengthen JS Basics",
      why: "JavaScript powers all interactivity on the web",
      fixes: "Unblocks DOM, Events, Fetch, and React",
    },
  };

  return chain.map((topic, idx) => {
    const preset = pathReasons[topic];
    if (preset) {
      return { topic, ...preset };
    }
    return {
      topic,
      action: idx === 0 ? `Learn ${topic}` : `Practice ${topic}`,
      why: idx === 0 ? `${topic} is the root cause of your struggles` : `${topic} depends on what you just fixed`,
      fixes: idx === chain.length - 1 ? "Completes your recovery path" : `Directly unblocks ${chain[idx + 1]}`,
    };
  });
}

export function analyzePerformance(
  scores: Record<string, TopicScore>,
  domain: string
): AnalysisResult {
  const graph = DOMAIN_DATA[domain]?.graph || {};
  const topicStatuses: Record<string, TopicStatus> = {};

  const weakTopics: string[] = [];
  const mediumTopics: string[] = [];
  const strongTopics: string[] = [];

  for (const [topic, data] of Object.entries(scores)) {
    const status = getTopicStatus(data.score);
    topicStatuses[topic] = status;
    if (status === "weak") weakTopics.push(topic);
    else if (status === "medium") mediumTopics.push(topic);
    else strongTopics.push(topic);
  }

  const { rootCause, chain } =
    weakTopics.length > 0
      ? findRootCause(weakTopics, graph)
      : { rootCause: strongTopics[0] || "N/A", chain: [strongTopics[0] || "N/A"] };

  const learningPath = buildLearningPath(rootCause, chain, domain);

  const explanation = generateExplanation(rootCause, chain, weakTopics, scores);

  return {
    weakTopics,
    mediumTopics,
    strongTopics,
    rootCause,
    dependencyChain: chain,
    explanation,
    learningPath,
    topicStatuses,
  };
}

function generateExplanation(
  rootCause: string,
  chain: string[],
  weakTopics: string[],
  scores: Record<string, TopicScore>
): string[] {
  const rootScore = scores[rootCause]?.score || 0;
  const lines: string[] = [
    `You are struggling because "${rootCause}" is fundamentally weak (score: ${rootScore}%).`,
  ];

  for (let i = 0; i < chain.length - 1; i++) {
    lines.push(
      `"${chain[i + 1]}" directly depends on "${chain[i]}" — and since "${chain[i]}" is weak, "${chain[i + 1]}" breaks.`
    );
  }

  lines.push(
    `This is a cascading failure. Fix "${rootCause}" first, and the rest of the chain will improve automatically.`
  );

  return lines;
}

export function simulateImprovement(
  scores: Record<string, TopicScore>,
  topic: string,
  newScore: number,
  graph: DependencyGraph
): Record<string, number> {
  const result: Record<string, number> = { ...Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v.score])) };
  result[topic] = newScore;

  const improvement = newScore - (scores[topic]?.score || 0);
  const cascade = 0.6;

  // Propagate improvement to dependent topics
  for (const [t, deps] of Object.entries(graph)) {
    if (deps.includes(topic) && result[t] !== undefined) {
      const boost = improvement * cascade;
      result[t] = Math.min(100, result[t] + boost);

      // Second-level
      for (const [t2, deps2] of Object.entries(graph)) {
        if (deps2.includes(t) && result[t2] !== undefined) {
          result[t2] = Math.min(100, result[t2] + boost * cascade);
        }
      }
    }
  }

  return result;
}
