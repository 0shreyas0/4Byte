"use client";

import { useState } from "react";
import { Lock, CheckCircle, Circle, ChevronRight, Info } from "lucide-react";

interface TimelineProps {
  domain: string;
  onStart: () => void;
  onBack: () => void;
}

type NodeStatus = "locked" | "active" | "completed";

interface TimelineNode {
  id: string;
  label: string;
  status: NodeStatus;
  why: string;
  connects: string[];
}

const TIMELINE_DATA: Record<string, TimelineNode[]> = {
  DSA: [
    { id: "variables", label: "Variables", status: "completed", why: "Everything in code starts with storing and updating values.", connects: ["Loops", "Functions"] },
    { id: "loops", label: "Loops", status: "completed", why: "Iteration powers traversal, counting, and repeated logic.", connects: ["Arrays", "Sorting", "Searching"] },
    { id: "functions", label: "Functions", status: "active", why: "Reusable logic is the base for recursion and modular problem solving.", connects: ["Recursion", "Linked Lists"] },
    { id: "arrays", label: "Arrays", status: "active", why: "The first real data structure most interview problems build on.", connects: ["Strings", "Sorting", "Searching"] },
    { id: "strings", label: "Strings", status: "locked", why: "Strings become easy once arrays and indexing feel natural.", connects: [] },
    { id: "recursion", label: "Recursion", status: "locked", why: "Requires comfort with functions and repeated subproblems.", connects: ["Trees"] },
    { id: "sorting", label: "Sorting", status: "locked", why: "Sorting combines arrays, loops, and comparison logic.", connects: [] },
    { id: "searching", label: "Searching", status: "locked", why: "Efficient search depends on traversal and sorted structures.", connects: [] },
    { id: "linked-lists", label: "Linked Lists", status: "locked", why: "Pointer-style thinking starts here and unlocks tree reasoning.", connects: ["Trees"] },
    { id: "trees", label: "Trees", status: "locked", why: "Trees combine recursion, structure traversal, and abstraction.", connects: [] },
  ],
  "Web Dev": [
    { id: "html", label: "HTML Basics", status: "completed", why: "HTML is the structure every interface sits on.", connects: ["CSS Basics", "DOM"] },
    { id: "css", label: "CSS Basics", status: "completed", why: "Styling fundamentals unlock every layout system.", connects: ["Flexbox", "Grid"] },
    { id: "js", label: "JS Basics", status: "completed", why: "JavaScript adds logic, state, and interactivity.", connects: ["DOM", "Fetch/API", "React Basics"] },
    { id: "dom", label: "DOM", status: "active", why: "DOM knowledge bridges markup and interactive behavior.", connects: ["Events"] },
    { id: "events", label: "Events", status: "active", why: "User-driven applications depend on event flow.", connects: ["Fetch/API"] },
    { id: "flexbox", label: "Flexbox", status: "active", why: "Flexbox is the fastest route to solid responsive layouts.", connects: [] },
    { id: "grid", label: "Grid", status: "locked", why: "Grid builds on CSS confidence for two-dimensional layouts.", connects: [] },
    { id: "fetch", label: "Fetch/API", status: "locked", why: "Fetching data only clicks after JS and events feel easy.", connects: ["React Basics"] },
    { id: "react", label: "React Basics", status: "locked", why: "React depends on strong JS plus DOM thinking.", connects: ["State Management"] },
    { id: "state", label: "State Management", status: "locked", why: "State is where frontend architecture really begins.", connects: [] },
  ],
  Aptitude: [
    { id: "arithmetic", label: "Arithmetic", status: "completed", why: "Arithmetic sits underneath almost every aptitude question.", connects: ["Percentages", "Ratios", "Algebra"] },
    { id: "percentages", label: "Percentages", status: "active", why: "Percentages convert raw arithmetic into practical comparisons.", connects: ["Profit & Loss"] },
    { id: "ratios", label: "Ratios", status: "active", why: "Ratios power speed, work, and probability reasoning.", connects: ["Time & Work", "Time & Distance", "Probability"] },
    { id: "algebra", label: "Algebra", status: "active", why: "Equations turn word problems into solvable structure.", connects: [] },
    { id: "geometry", label: "Geometry", status: "locked", why: "Spatial math lands better once core arithmetic is fluent.", connects: [] },
    { id: "time-work", label: "Time & Work", status: "locked", why: "Work-rate questions depend on ratio intuition.", connects: [] },
    { id: "time-distance", label: "Time & Distance", status: "locked", why: "Motion problems simplify once ratios feel automatic.", connects: [] },
    { id: "profit-loss", label: "Profit & Loss", status: "locked", why: "Business math is mostly percentage fluency in disguise.", connects: [] },
    { id: "probability", label: "Probability", status: "locked", why: "Chance problems need ratio and counting confidence.", connects: ["Permutation"] },
    { id: "permutation", label: "Permutation", status: "locked", why: "Permutations are the capstone of counting-based reasoning.", connects: [] },
  ],
  "App Dev": [
    { id: "rn-basics", label: "React Native Basics", status: "completed", why: "This is the base layer for building cross-platform mobile UI.", connects: ["Navigation & Routing", "UI Components"] },
    { id: "navigation", label: "Navigation & Routing", status: "completed", why: "Real apps need predictable movement between screens.", connects: ["State Management"] },
    { id: "ui", label: "UI Components", status: "active", why: "Reusable components speed up every mobile workflow.", connects: ["Native APIs"] },
    { id: "state", label: "State Management", status: "active", why: "State coordinates data across screens and flows.", connects: ["Firebase Integration"] },
    { id: "native-apis", label: "Native APIs", status: "locked", why: "Camera, storage, and sensors require strong component flow first.", connects: ["Performance Optimization"] },
    { id: "firebase", label: "Firebase Integration", status: "locked", why: "Backend wiring works best after routing and state feel stable.", connects: ["App Store Deployment"] },
    { id: "deployment", label: "App Store Deployment", status: "locked", why: "Shipping becomes easier when the data and auth flow are reliable.", connects: [] },
    { id: "performance", label: "Performance Optimization", status: "locked", why: "Performance tuning matters once the app already works end to end.", connects: [] },
  ],
  "Data Science": [
    { id: "python", label: "Python for Data Science", status: "completed", why: "Python is the working language behind the whole stack.", connects: ["NumPy & Pandas"] },
    { id: "numpy-pandas", label: "NumPy & Pandas", status: "completed", why: "Structured data work begins with vectorized operations and tables.", connects: ["Data Visualization", "Machine Learning"] },
    { id: "viz", label: "Data Visualization", status: "active", why: "You need to see the data before you can model it well.", connects: ["Kaggle Practice"] },
    { id: "stats", label: "Statistics Basics", status: "active", why: "Statistics explains why the patterns are meaningful.", connects: ["Machine Learning"] },
    { id: "ml", label: "Machine Learning", status: "locked", why: "ML depends on clean data plus statistical understanding.", connects: ["Deep Learning", "Model Deployment"] },
    { id: "dl", label: "Deep Learning", status: "locked", why: "Deep learning is easier after classic ML concepts are solid.", connects: ["NLP Basics"] },
    { id: "nlp", label: "NLP Basics", status: "locked", why: "NLP extends deep learning into text understanding.", connects: [] },
    { id: "deploy", label: "Model Deployment", status: "locked", why: "A model matters only when it can run in a product.", connects: [] },
  ],
  Cybersecurity: [
    { id: "networking", label: "Networking Fundamentals", status: "completed", why: "Security starts with understanding how systems communicate.", connects: ["Linux & Bash", "Web Security Basics"] },
    { id: "linux", label: "Linux & Bash", status: "completed", why: "Most security tooling and labs live in terminal-first workflows.", connects: ["Nmap Scanning", "CTF Challenges"] },
    { id: "web-sec", label: "Web Security Basics", status: "active", why: "Before exploits, you need the core request-response threat model.", connects: ["OWASP Top 10"] },
    { id: "owasp", label: "OWASP Top 10", status: "active", why: "OWASP organizes the biggest real-world web risks.", connects: ["Web App Pentesting"] },
    { id: "nmap", label: "Nmap Scanning", status: "locked", why: "Enumeration is the first step in almost every assessment.", connects: ["Metasploit Framework"] },
    { id: "pentest", label: "Web App Pentesting", status: "locked", why: "Pentesting requires both web fundamentals and threat awareness.", connects: ["CTF Challenges"] },
    { id: "metasploit", label: "Metasploit Framework", status: "locked", why: "Framework-heavy exploitation is easier after solid scanning practice.", connects: [] },
    { id: "ctf", label: "CTF Challenges", status: "locked", why: "CTFs combine enumeration, exploitation, and persistence.", connects: [] },
  ],
  IoT: [
    { id: "arduino", label: "Arduino & Raspberry Pi", status: "completed", why: "Hardware experimentation starts with accessible dev boards.", connects: ["Sensors & Actuators", "Microcontroller Programming"] },
    { id: "sensors", label: "Sensors & Actuators", status: "completed", why: "Real devices become useful when they can observe and react.", connects: ["MQTT & HTTP Protocols"] },
    { id: "microcontrollers", label: "Microcontroller Programming", status: "active", why: "Firmware logic is what makes devices reliable.", connects: ["Edge Computing"] },
    { id: "protocols", label: "MQTT & HTTP Protocols", status: "active", why: "Devices need communication patterns before they can go online.", connects: ["Cloud IoT Platforms"] },
    { id: "edge", label: "Edge Computing", status: "locked", why: "Local processing matters once device logic is stable.", connects: ["IoT Security"] },
    { id: "cloud", label: "Cloud IoT Platforms", status: "locked", why: "Cloud dashboards make sense after your devices can publish data.", connects: ["Real-time Data Streaming"] },
    { id: "streaming", label: "Real-time Data Streaming", status: "locked", why: "Streaming builds on protocol and cloud familiarity.", connects: [] },
    { id: "security", label: "IoT Security", status: "locked", why: "Connected devices demand security at every layer.", connects: [] },
  ],
  Python: [
    { id: "syntax", label: "Python Basics & Syntax", status: "completed", why: "Everything else depends on writing and reading Python cleanly.", connects: ["Control Flow", "Functions"] },
    { id: "control-flow", label: "Control Flow", status: "completed", why: "Branching and loops are the backbone of small programs.", connects: ["File I/O"] },
    { id: "functions", label: "Functions", status: "active", why: "Functions turn scripts into reusable tools.", connects: ["OOP in Python", "Modules & Packages"] },
    { id: "oop", label: "OOP in Python", status: "active", why: "Classes help organize bigger codebases and automation tools.", connects: ["Decorators & Generators"] },
    { id: "file-io", label: "File I/O", status: "locked", why: "Automation becomes practical once you can read and write files.", connects: ["Automation Scripts"] },
    { id: "modules", label: "Modules & Packages", status: "locked", why: "Understanding imports is key to larger Python projects.", connects: ["Testing & Debugging"] },
    { id: "decorators", label: "Decorators & Generators", status: "locked", why: "Advanced Python patterns land after strong function thinking.", connects: [] },
    { id: "testing", label: "Testing & Debugging", status: "locked", why: "Reliable Python work depends on good debugging discipline.", connects: [] },
  ],
  Alphabets: [
    { id: "letter-shapes", label: "Letter Shapes", status: "completed", why: "Children first need to notice how each letter looks before they can name it confidently.", connects: ["Letter Names", "Capital Letters"] },
    { id: "letter-names", label: "Letter Names", status: "completed", why: "Naming letters turns visual spotting into actual recognition.", connects: ["Letter Sounds"] },
    { id: "capital-letters", label: "Capital Letters", status: "active", why: "Big letters are easier to identify and help build early alphabet confidence.", connects: ["Small Letters"] },
    { id: "letter-sounds", label: "Letter Sounds", status: "active", why: "Phonics starts when letters connect to the sounds they make.", connects: ["Picture Matching"] },
    { id: "small-letters", label: "Small Letters", status: "locked", why: "Lowercase letters make more sense once uppercase shapes feel familiar.", connects: ["Picture Matching"] },
    { id: "picture-matching", label: "Picture Matching", status: "locked", why: "Matching A to apple or B to ball makes letters meaningful in the real world.", connects: ["Simple Words"] },
    { id: "simple-words", label: "Simple Words", status: "locked", why: "Short words are the first bridge from letters to reading.", connects: [] },
  ],
  Numbers: [
    { id: "counting-objects", label: "Counting Objects", status: "completed", why: "Young learners understand numbers best when they count real things they can see.", connects: ["Number Names", "More or Less"] },
    { id: "number-names", label: "Number Names", status: "completed", why: "Seeing and saying number names helps children connect symbols with quantity.", connects: ["Number Order"] },
    { id: "more-or-less", label: "More or Less", status: "active", why: "Comparing groups builds early number sense before formal arithmetic.", connects: ["Number Order"] },
    { id: "number-order", label: "Number Order", status: "active", why: "Recognizing what comes next creates confidence with sequences and patterns.", connects: ["Simple Addition"] },
    { id: "simple-addition", label: "Simple Addition", status: "locked", why: "Adding becomes easier once counting and order feel natural.", connects: ["Simple Subtraction"] },
    { id: "simple-subtraction", label: "Simple Subtraction", status: "locked", why: "Taking away builds on the same number sense as addition.", connects: [] },
  ],
  "Colors & Shapes": [
    { id: "basic-colors", label: "Basic Colors", status: "completed", why: "Bright familiar colors are the easiest visual category for early learners to spot.", connects: ["Object Colors", "Color Sorting"] },
    { id: "basic-shapes", label: "Basic Shapes", status: "completed", why: "Circles, squares, and triangles form the foundation for visual recognition.", connects: ["Shape Matching"] },
    { id: "object-colors", label: "Object Colors", status: "active", why: "Linking colors to things like the sun, leaves, and apples makes learning stick.", connects: ["Color Sorting"] },
    { id: "shape-matching", label: "Shape Matching", status: "active", why: "Matching shapes strengthens observation and pattern recognition.", connects: ["Shape Hunt"] },
    { id: "color-sorting", label: "Color Sorting", status: "locked", why: "Sorting groups by color turns recognition into a thinking skill.", connects: [] },
    { id: "shape-hunt", label: "Shape Hunt", status: "locked", why: "Finding shapes in the world helps children notice geometry in everyday life.", connects: [] },
  ],
  "Rhymes & Stories": [
    { id: "listening-fun", label: "Listening Fun", status: "completed", why: "Before children retell stories, they need to enjoy listening and noticing sounds.", connects: ["Animal Sounds", "Rhyme Pairs"] },
    { id: "animal-sounds", label: "Animal Sounds", status: "completed", why: "Recognizing familiar sounds builds audio memory and playful engagement.", connects: ["Story Moments"] },
    { id: "rhyme-pairs", label: "Rhyme Pairs", status: "active", why: "Rhyming trains the ear to hear similar ending sounds in words.", connects: ["Simple Story Words"] },
    { id: "story-moments", label: "Story Moments", status: "active", why: "Remembering what happens first or next builds comprehension gently.", connects: ["Feelings in Stories"] },
    { id: "simple-story-words", label: "Simple Story Words", status: "locked", why: "New vocabulary lands better once children enjoy the story flow.", connects: [] },
    { id: "feelings-in-stories", label: "Feelings in Stories", status: "locked", why: "Characters' feelings help children connect emotionally with stories.", connects: [] },
  ],
  "Nature & EVS": [
    { id: "plants-and-animals", label: "Plants and Animals", status: "completed", why: "Kids begin EVS by noticing the living things around them.", connects: ["Homes of Animals", "My Body"] },
    { id: "weather-around-us", label: "Weather Around Us", status: "completed", why: "Sunny, rainy, and windy days are easy everyday science observations.", connects: ["Seasons"] },
    { id: "homes-of-animals", label: "Homes of Animals", status: "active", why: "Linking animals to where they live builds real-world understanding.", connects: ["Healthy Habits"] },
    { id: "my-body", label: "My Body", status: "active", why: "Knowing body parts helps children connect learning to themselves.", connects: ["Healthy Habits"] },
    { id: "seasons", label: "Seasons", status: "locked", why: "Seasonal change makes more sense after weather patterns feel familiar.", connects: [] },
    { id: "healthy-habits", label: "Healthy Habits", status: "locked", why: "Handwashing, food, and rest turn EVS into useful everyday action.", connects: [] },
  ],
};

export default function LearningTimeline({ domain, onStart, onBack }: TimelineProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const nodes = TIMELINE_DATA[domain] || TIMELINE_DATA.DSA;

  const completed = nodes.filter((n) => n.status === "completed").length;
  const total = nodes.length;
  const progress = (completed / total) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8" }}>
      <div
        style={{
          borderBottom: "2.5px solid #0D0D0D",
          background: "#FFFFFF",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button onClick={onBack} className="brutal-btn px-4 py-2 text-sm" style={{ background: "#F5F0E8" }}>
          ← Back
        </button>
        <div style={{ width: "2px", height: "24px", background: "#0D0D0D" }} />
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Step 2 of 5
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Your Learning Timeline · {domain}
          </div>
        </div>
        <div className="flex-1 ml-4 hidden md:block">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: "40%", background: "#FFD60A" }} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>
              Concept Path — {domain}
            </h1>
            <p style={{ color: "#555", fontWeight: 500, fontSize: "0.95rem" }}>
              Topics unlock in order. Each concept depends on mastering its prerequisites.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              {[
                { color: "#1DB954", label: "Done" },
                { color: "#FFD60A", label: "Active" },
                { color: "#CCCCCC", label: "Locked" },
              ].map((legend) => (
                <div key={legend.label} className="flex items-center gap-1.5">
                  <div style={{ width: 12, height: 12, background: legend.color, border: "2px solid #0D0D0D" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-4 mb-8 flex items-center gap-4"
          style={{ border: "2.5px solid #0D0D0D", background: "#FFFFFF", boxShadow: "4px 4px 0 #0D0D0D" }}
        >
          <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", minWidth: 60 }}>
            {completed}/{total}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 6 }}>Concepts Mastered</div>
            <div className="progress-bar-bg" style={{ height: 16 }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%`, background: "#1DB954" }} />
            </div>
          </div>
          <div
            style={{
              background: "#FFD60A",
              border: "2px solid #0D0D0D",
              padding: "4px 12px",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        <div className="relative">
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 0,
              bottom: 0,
              width: 3,
              background: "#0D0D0D",
            }}
          />

          <div className="space-y-4">
            {nodes.map((node, index) => (
              <TimelineNodeCard
                key={node.id}
                node={node}
                index={index}
                isTooltipOpen={tooltip === node.id}
                onTooltipToggle={() => setTooltip(tooltip === node.id ? null : node.id)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={onStart}
            className="brutal-btn flex items-center gap-3 px-8 py-4 text-lg"
            style={{ background: "#FFD60A" }}
          >
            Start Quiz Now
            <ChevronRight size={22} />
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500, textAlign: "right", marginTop: 8 }}>
          Click any unlocked node to see why it matters and what it connects to →
        </p>
      </div>
    </div>
  );
}

function TimelineNodeCard({
  node,
  index,
  isTooltipOpen,
  onTooltipToggle,
}: {
  node: TimelineNode;
  index: number;
  isTooltipOpen: boolean;
  onTooltipToggle: () => void;
}) {
  const statusColors: Record<NodeStatus, string> = {
    completed: "#1DB954",
    active: "#FFD60A",
    locked: "#CCCCCC",
  };

  const StatusIcon =
    node.status === "completed"
      ? CheckCircle
      : node.status === "locked"
        ? Lock
        : Circle;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        paddingLeft: 0,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          background: statusColors[node.status],
          border: "2.5px solid #0D0D0D",
          boxShadow: "3px 3px 0 #0D0D0D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          cursor: node.status !== "locked" ? "pointer" : "default",
        }}
        onClick={node.status !== "locked" ? onTooltipToggle : undefined}
      >
        <StatusIcon size={22} color="#0D0D0D" strokeWidth={2.5} />
      </div>

      <div
        style={{
          flex: 1,
          background: "#FFFFFF",
          border: "2.5px solid #0D0D0D",
          boxShadow: "4px 4px 0 #0D0D0D",
          padding: "16px 18px",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Node {index + 1}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {node.label}
            </div>
          </div>
          <button
            onClick={node.status !== "locked" ? onTooltipToggle : undefined}
            disabled={node.status === "locked"}
            style={{
              border: "2px solid #0D0D0D",
              background: node.status === "locked" ? "#E5E5E5" : "#F5F0E8",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: node.status === "locked" ? "not-allowed" : "pointer",
            }}
          >
            <Info size={16} />
          </button>
        </div>

        {isTooltipOpen && (
          <div
            style={{
              marginTop: 14,
              borderTop: "2px solid #0D0D0D",
              paddingTop: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.55 }}>{node.why}</p>
            <div className="flex flex-wrap gap-2">
              {node.connects.length > 0 ? (
                node.connects.map((link) => (
                  <span
                    key={link}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "4px 8px",
                      border: "2px solid #0D0D0D",
                      background: "#FFD60A",
                    }}
                  >
                    Unlocks {link}
                  </span>
                ))
              ) : (
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    border: "2px solid #0D0D0D",
                    background: "#F5F0E8",
                  }}
                >
                  Terminal concept
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
