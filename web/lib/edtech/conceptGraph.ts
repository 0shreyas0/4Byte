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
      "Linked Lists": ["Functions", "Arrays"],
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
  "App Dev": {
    description: "Mobile App Development",
    topics: [
      "React Native Basics",
      "Navigation & Routing",
      "UI Components",
      "State Management",
      "Native APIs",
      "Firebase Integration",
      "App Store Deployment",
      "Performance Optimization",
    ],
    graph: {
      "React Native Basics": [],
      "Navigation & Routing": ["React Native Basics"],
      "UI Components": ["React Native Basics"],
      "State Management": ["Navigation & Routing"],
      "Native APIs": ["UI Components"],
      "Firebase Integration": ["State Management"],
      "App Store Deployment": ["Firebase Integration"],
      "Performance Optimization": ["Native APIs", "State Management"],
    },
  },
  "Data Science": {
    description: "Data Science and Machine Learning",
    topics: [
      "Python for Data Science",
      "NumPy & Pandas",
      "Data Visualization",
      "Statistics Basics",
      "Machine Learning",
      "Deep Learning",
      "NLP Basics",
      "Model Deployment",
    ],
    graph: {
      "Python for Data Science": [],
      "NumPy & Pandas": ["Python for Data Science"],
      "Data Visualization": ["NumPy & Pandas"],
      "Statistics Basics": ["Python for Data Science"],
      "Machine Learning": ["NumPy & Pandas", "Statistics Basics"],
      "Deep Learning": ["Machine Learning"],
      "NLP Basics": ["Deep Learning"],
      "Model Deployment": ["Machine Learning"],
    },
  },
  Cybersecurity: {
    description: "Ethical Hacking and Security",
    topics: [
      "Networking Fundamentals",
      "Linux & Bash",
      "Web Security Basics",
      "OWASP Top 10",
      "Nmap Scanning",
      "Web App Pentesting",
      "Metasploit Framework",
      "CTF Challenges",
    ],
    graph: {
      "Networking Fundamentals": [],
      "Linux & Bash": ["Networking Fundamentals"],
      "Web Security Basics": ["Networking Fundamentals"],
      "OWASP Top 10": ["Web Security Basics"],
      "Nmap Scanning": ["Linux & Bash"],
      "Web App Pentesting": ["OWASP Top 10", "Linux & Bash"],
      "Metasploit Framework": ["Nmap Scanning"],
      "CTF Challenges": ["Web App Pentesting", "Linux & Bash"],
    },
  },
  IoT: {
    description: "Internet of Things and Embedded Systems",
    topics: [
      "Arduino & Raspberry Pi",
      "Sensors & Actuators",
      "Microcontroller Programming",
      "MQTT & HTTP Protocols",
      "Edge Computing",
      "Cloud IoT Platforms",
      "Real-time Data Streaming",
      "IoT Security",
    ],
    graph: {
      "Arduino & Raspberry Pi": [],
      "Sensors & Actuators": ["Arduino & Raspberry Pi"],
      "Microcontroller Programming": ["Arduino & Raspberry Pi"],
      "MQTT & HTTP Protocols": ["Sensors & Actuators"],
      "Edge Computing": ["Microcontroller Programming"],
      "Cloud IoT Platforms": ["MQTT & HTTP Protocols"],
      "Real-time Data Streaming": ["Cloud IoT Platforms"],
      "IoT Security": ["Edge Computing", "Cloud IoT Platforms"],
    },
  },
  Python: {
    description: "Core to Advanced Python",
    topics: [
      "Python Basics & Syntax",
      "Control Flow",
      "Functions",
      "OOP in Python",
      "File I/O",
      "Modules & Packages",
      "Decorators & Generators",
      "Testing & Debugging",
    ],
    graph: {
      "Python Basics & Syntax": [],
      "Control Flow": ["Python Basics & Syntax"],
      Functions: ["Python Basics & Syntax"],
      "OOP in Python": ["Functions"],
      "File I/O": ["Control Flow"],
      "Modules & Packages": ["Functions"],
      "Decorators & Generators": ["Functions", "OOP in Python"],
      "Testing & Debugging": ["Modules & Packages"],
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
    "React Native Basics": {
      action: "Rebuild React Native Basics",
      why: "Mobile architecture is hard without strong RN fundamentals",
      fixes: "Unblocks routing, UI composition, and app state",
    },
    "Python for Data Science": {
      action: "Revisit Python Data Basics",
      why: "The whole data workflow depends on Python fluency",
      fixes: "Unblocks Pandas, visualization, and machine learning",
    },
    "Networking Fundamentals": {
      action: "Strengthen Networking Fundamentals",
      why: "Security reasoning starts with packets, ports, and protocols",
      fixes: "Unblocks Linux workflows, web security, and scanning",
    },
    "Arduino & Raspberry Pi": {
      action: "Practice Board Fundamentals",
      why: "IoT projects start with reliable hardware experimentation",
      fixes: "Unblocks sensors, firmware, and device protocols",
    },
    "Python Basics & Syntax": {
      action: "Lock In Python Syntax",
      why: "Every advanced Python concept depends on clear fundamentals",
      fixes: "Unblocks control flow, functions, and larger scripts",
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
