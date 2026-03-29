"use client";

import { useState } from "react";
import { BookOpen, ArrowRight, Lightbulb, Code, CheckCircle2 } from "lucide-react";

interface LearningConceptProps {
  domain: string;
  onComplete: () => void;
  onBack: () => void;
}

interface ConceptCard {
  title: string;
  concept: string;
  content: string;
  visual: string;
  example: string;
}

const CONCEPT_DATA: Record<string, ConceptCard[]> = {
  DSA: [
    {
      title: "Variables & Memory",
      concept: "Storing Data",
      content: "Variables are named boxes in your computer's memory. When you define `x = 5`, you allocate a box, label it 'x', and drop the value '5' inside. Knowing how memory is allocated is the first step to optimizing code.",
      visual: "📦 x -> [ 5 ]",
      example: "let x = 5;\nconst y = 10;"
    },
    {
      title: "The Logic of Loops",
      concept: "Iteration",
      content: "Think of a loop as a 'repeat instruction'. If you want to clap 5 times, you don't write 'clap' 5 times. You tell the computer: 'Start at clap 0, keep going while claps < 5, and add 1 clap each time.'",
      visual: "🔄 cycle: Setup -> Condition -> Code -> Update",
      example: "for (let i=0; i<5; i++) { clap(); }"
    },
    {
      title: "Navigating Arrays",
      concept: "Contiguous Memory",
      content: "An array is like a street with houses. Each house has an address (index). Addresses start at 0. Accessing a house is instant (O(1)) if you have the address.",
      visual: "🏘️ [ House 0 | House 1 | House 2 | House 3 ]",
      example: "strangers_things[4] = 'Eddie';"
    },
    {
      title: "Sorting Algorithms",
      concept: "Organizing Chaos",
      content: "Sorting puts elements in a specific order (e.g., ascending). While simple sorting checks neighbors (O(n²)), fast sorting like QuickSort divides and conquers (O(n log n)).",
      visual: "📊 [3,1,2] -> [1,2,3]",
      example: "arr.sort((a,b) => a - b);"
    }
  ],
  "Web Dev": [
    {
      title: "HTML: The Skeleton",
      concept: "Tags and Elements",
      content: "HTML describes the structure of a page using tags. Tags like <h1> or <a> are the building blocks. Every single element on the web is housed inside these structural frames.",
      visual: "🧱 <h1> = Header | <a> = Link",
      example: "<a href='https://google.com'>Click Me</a>"
    },
    {
      title: "CSS: The Styling",
      concept: "Visual Rules",
      content: "CSS targets HTML elements and applies rules dictating color, size, positioning, and animation. It turns a boring document into a beautiful interface.",
      visual: "🎨 body { background: black; color: white; }",
      example: "h1 { font-size: 2rem; color: #8B5CF6; }"
    },
    {
      title: "JavaScript: The Brain",
      concept: "Interactivity",
      content: "JavaScript is the logic that lives in the browser. It responds to clicks, fetches data, and changes the HTML/CSS on the fly without reloading the page.",
      visual: "🧠 Listen -> React -> Update",
      example: "btn.addEventListener('click', () => alert('Hello'))"
    }
  ],
  Aptitude: [
    {
      title: "Percentages Demystified",
      concept: "Per Cent (Out of 100)",
      content: "A percentage is simply a fraction scaled to exactly 100. '15%' literally means '15 out of 100'. Mastering this ratio makes profit, loss, and probability trivial.",
      visual: "💯 25% = 25/100 = 1/4",
      example: "15% of 200 = (15 / 100) * 200 = 30"
    },
    {
      title: "Ratios & Proportions",
      concept: "Comparative Scaling",
      content: "A ratio defines the relationship in size between two amounts. If a recipe calls for 2 cups flour to 1 cup sugar, the ratio 2:1 remains constant whether you make 1 cake or 50.",
      visual: "⚖️ A : B = 2 : 1",
      example: "If A:B = 2:3 and B:C = 3:4, then A:C = 2:4"
    }
  ],
  "App Dev": [
    {
      title: "React Native: Hybrid Magic",
      concept: "Write Once, Run Anywhere",
      content: "Instead of writing Java for Android and Swift for iOS, React Native bridges JavaScript directly to native mobile components. One codebase builds two real apps.",
      visual: "📱 JS Code -> Native Bridge -> iOS / Android",
      example: "import { View, Text } from 'react-native';"
    },
    {
      title: "Component State",
      concept: "Dynamic Data",
      content: "In apps, data changes rapidly (likes, texts, clicks). 'State' is a variable that, when updated, automatically forces the UI component to redraw itself with the new data.",
      visual: "⚙️ State changes = Screen repaints",
      example: "const [likes, setLikes] = useState(0);"
    }
  ],
  "Data Science": [
    {
      title: "The Python Ecosystem",
      concept: "Data Tools",
      content: "Python rules data science because of its explosive ecosystem. Libraries like Pandas let you manipulate millions of rows of data like an ultra-powerful, programmable Excel spreadsheet.",
      visual: "🐍 Python + Pandas + Scikit-Learn",
      example: "import pandas as pd \ndf = pd.read_csv('data.csv')"
    },
    {
      title: "Machine Learning Basics",
      concept: "Pattern Recognition",
      content: "Traditional programming uses rules to get answers (Data + Rules = Answers). Machine learning reverses this. You provide data and answers to uncover the hidden rules.",
      visual: "🤖 Data + Answers -> ML Model -> Rules",
      example: "model = LinearRegression()\nmodel.fit(X_train, y_train)"
    }
  ],
  Cybersecurity: [
    {
      title: "Network Fundamentals",
      concept: "Ports and Protocols",
      content: "A computer has an IP address (like a street address), but it uses Ports (like apartment numbers) to direct incoming traffic to the right app. Port 80 is HTTP, Port 443 is HTTPS.",
      visual: "🚪 192.168.1.5 : 443 (HTTPS)",
      example: "nmap -p 80,443 target.com"
    },
    {
      title: "Input Validation",
      concept: "Never Trust the User",
      content: "The golden rule of hacking defense: all input is evil. If a user enters malicious database queries (SQL Injection) instead of a username, unvalidated systems will execute it.",
      visual: "🛡️ Filter -> Sanitize -> Execute",
      example: "name = escape_string(user_input);"
    }
  ],
  IoT: [
    {
      title: "The Hardware Bridge",
      concept: "Sensors to Software",
      content: "IoT connects the physical world to the digital. Microcontrollers (like Arduino) read electrical signals from sensors (temperature, light) and convert them to data.",
      visual: "🌡️ Sensor -> Microcontroller -> Network",
      example: "int temp = analogRead(A0);"
    },
    {
      title: "MQTT Messaging",
      concept: "Lightweight Telemetry",
      content: "IoT devices have weak batteries and bad internet. HTTP is too heavy. MQTT is a lightweight 'publish-subscribe' protocol built specifically for tiny hardware chips.",
      visual: "📡 Device -> Publisher -> Broker -> Subscriber",
      example: "client.publish('home/temp', '24.5');"
    }
  ],
  Python: [
    {
      title: "Python Syntax",
      concept: "Indentations not Brackets",
      content: "Unlike C++ or JavaScript, Python enforces readability by using whitespace (indentation) instead of curly braces to define scope and code blocks.",
      visual: "📏 4 Spaces = 1 Block",
      example: "if True:\n    print('Hello World')"
    },
    {
      title: "Lists vs Tuples",
      concept: "Mutability",
      content: "A List is a dynamic array you can change (mutable). A Tuple is locked data you cannot change (immutable), making it faster and memory-efficient for fixed structures.",
      visual: "🔒 Tuple: (1, 2) | 🔓 List: [1, 2]",
      example: "my_list = [1,2]\nmy_tuple = (1,2)"
    }
  ],
  Alphabets: [
    {
      title: "Meet the Letters",
      concept: "Letter Recognition",
      content: "Letters are special shapes we use to read and write. The first step is learning to spot each one quickly, like noticing a friendly face in a crowd.",
      visual: "🔠 A B C",
      example: "A is for Apple. B is for Ball."
    },
    {
      title: "Letters Make Sounds",
      concept: "Phonics",
      content: "Every letter has a sound. When children connect the shape of a letter to its sound, reading starts to feel like a fun puzzle instead of a memory game.",
      visual: "🅰️ -> /a/   🅱️ -> /b/",
      example: "A says 'a' in apple."
    },
    {
      title: "Match Letters with Pictures",
      concept: "Word Beginnings",
      content: "Pictures help letters feel real. Matching A with apple or C with cat makes the alphabet useful and memorable.",
      visual: "🍎 Apple -> A",
      example: "C is for Cat."
    }
  ],
  Numbers: [
    {
      title: "Counting What We See",
      concept: "Counting",
      content: "Young learners understand numbers best by counting real objects like stars, apples, and blocks. Seeing quantity comes before memorizing symbols.",
      visual: "⭐ ⭐ ⭐ = 3",
      example: "Count 1, 2, 3 apples."
    },
    {
      title: "Number Symbols",
      concept: "Recognition",
      content: "Once children can count, they begin matching groups to symbols like 1, 2, and 3. This is the bridge from objects to written math.",
      visual: "3 -> 🍎🍎🍎",
      example: "The number 5 means five things."
    },
    {
      title: "Tiny Math Ideas",
      concept: "Add and Take Away",
      content: "Simple addition and subtraction start as stories: two birds on a tree and one more joins, or three candies and one is eaten.",
      visual: "2 + 1 = 3",
      example: "⭐ ⭐ + ⭐ = ⭐ ⭐ ⭐"
    }
  ],
  "Colors & Shapes": [
    {
      title: "Color Spotting",
      concept: "Color Recognition",
      content: "Colors are often a child’s first sorting skill. Recognizing yellow, blue, green, and red helps children organize the world visually.",
      visual: "🔴 🔵 🟡 🟢",
      example: "The sun is yellow. The leaf is green."
    },
    {
      title: "Shape Friends",
      concept: "Shape Recognition",
      content: "Shapes are all around us. Circles, squares, and triangles help children understand how objects look and fit together.",
      visual: "⚪ 🟦 🔺",
      example: "A clock is a circle. A tile can be a square."
    },
    {
      title: "Sort and Match",
      concept: "Visual Patterns",
      content: "When children sort by color or match the same shapes, they build observation skills that later support math and problem-solving.",
      visual: "🟡🟡 | 🔺🔺",
      example: "Put all the red blocks together."
    }
  ],
  "Rhymes & Stories": [
    {
      title: "Listening for Fun",
      concept: "Attention and Sound",
      content: "Rhymes and stories grow listening skills. Children learn to notice repeated sounds, familiar words, and what happens next.",
      visual: "🎵 clap, tap, nap",
      example: "Cat and hat sound alike."
    },
    {
      title: "Rhyming Words",
      concept: "Sound Patterns",
      content: "Rhymes help children hear patterns in language. That makes it easier to remember words and later connect sounds to reading.",
      visual: "🐱 cat -> 🎩 hat",
      example: "Sun does not rhyme with cat, but hat does."
    },
    {
      title: "Story Understanding",
      concept: "Comprehension",
      content: "Simple stories teach order, feelings, and memory. Kids start to understand who did what, what happened first, and how characters feel.",
      visual: "📖 Beginning -> Middle -> End",
      example: "First the bunny wakes up, then it eats, then it sleeps."
    }
  ],
  "Nature & EVS": [
    {
      title: "Our World Around Us",
      concept: "Observation",
      content: "EVS begins with noticing everyday life: plants, animals, rain, sunshine, and the people around us. Curiosity is the starting point.",
      visual: "🌳 🐦 ☀️ 🌧️",
      example: "Birds live in nests. Fish live in water."
    },
    {
      title: "My Body and My Health",
      concept: "Body Awareness",
      content: "Young children learn EVS by understanding themselves too. Eyes help us see, hands help us hold, and clean habits keep us healthy.",
      visual: "👀 ✋ 👂",
      example: "Wash hands before eating."
    },
    {
      title: "Weather and Seasons",
      concept: "Nature Patterns",
      content: "Sunny days, rain, wind, and winter all help children notice that nature changes in patterns. This becomes their first science thinking.",
      visual: "☀️ -> 🌧️ -> 🍂",
      example: "We use an umbrella when it rains."
    }
  ]
};

// Fallback logic for unsupported domains
const getDomainConcepts = (domain: string) => {
  if (CONCEPT_DATA[domain]) return CONCEPT_DATA[domain];
  return [
    {
      title: `Introduction to ${domain}`,
      concept: "Foundations",
      content: `Welcome to ${domain}. Before you dive into the deep end, it is critical to understand the foundational principles that govern this field. Master the basics, and the complex topics will become trivial.`,
      visual: "🏗️ Foundation -> Structure -> Mastery",
      example: `// Example placeholder for ${domain}`
    }
  ];
};

export default function LearningConcept({ domain, onComplete, onBack }: LearningConceptProps) {
  const [step, setStep] = useState(0);
  const data = getDomainConcepts(domain);
  const current = data[step];

  const handleNext = () => {
    if (step < data.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-sm font-black uppercase opacity-60 hover:opacity-100 italic transition-opacity">
          ← Exit Journey
        </button>
        <div className="flex gap-2">
          {data.map((_, i) => (
            <div 
              key={i} 
              className="h-2 w-12 border-2 border-black"
              style={{ background: i <= step ? "#8B5CF6" : "#EEE" }}
            />
          ))}
        </div>
      </div>

      {/* Main Concept Card */}
      <div 
        className="p-10 mb-8 transition-all"
        style={{
          background: "#FFFFFF",
          border: "4px solid #0D0D0D",
          boxShadow: "10px 10px 0 #0D0D0D",
        }}
      >
        <div className="flex items-center gap-3 mb-4 text-[#8B5CF6]">
          <BookOpen size={24} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">{domain} Fundamentals</span>
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight">{current.title}</h1>
        <div className="inline-block px-3 py-1 bg-[#F5F0E8] border-2 border-black text-xs font-black uppercase mb-8">
          Concept: {current.concept}
        </div>

        <div className="space-y-6">
          <p className="text-lg font-bold leading-relaxed text-gray-800">
            {current.content}
          </p>

          <div className="p-6 bg-[#0D0D0D] text-[#1DB954] font-mono text-sm border-4 border-[#8B5CF6]">
             <div className="flex items-center gap-2 mb-3 text-white/40 text-[10px] uppercase font-black tracking-widest">
                <Code size={14} /> Example Snippet
             </div>
             {current.example}
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#F5F0E8] border-2 border-black border-dashed">
            <Lightbulb className="shrink-0 text-[#8B5CF6]" size={24} />
            <div>
               <div className="text-xs font-black uppercase mb-1">Visual Mental Model</div>
               <div className="text-sm font-bold opacity-80 italic">{current.visual}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-3 py-5 brutal-btn text-lg font-black uppercase tracking-wider"
        style={{ 
          background: "#0D0D0D", 
          color: "#FFFFFF",
          boxShadow: "8px 8px 0 #8B5CF6" 
        }}
      >
        {step < data.length - 1 ? (
          <>Next Concept <ArrowRight size={22} /></>
        ) : (
          <>Start Reality Check Quiz <CheckCircle2 size={22} /></>
        )}
      </button>

    </div>
  );
}
