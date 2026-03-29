export interface StageNodeDef {
  id: string;
  label: string;
  why: string;
  connects: string[];
}

export const TIMELINE_NODE_DEFS: Record<string, StageNodeDef[]> = {
  DSA: [
    { id: "variables", label: "Variables", why: "Everything in code starts with storing and updating values.", connects: ["Loops", "Functions"] },
    { id: "loops", label: "Loops", why: "Iteration powers traversal, counting, and repeated logic.", connects: ["Arrays", "Sorting", "Searching"] },
    { id: "functions", label: "Functions", why: "Reusable logic is the base for recursion and modular problem solving.", connects: ["Recursion", "Linked Lists"] },
    { id: "arrays", label: "Arrays", why: "The first real data structure most interview problems build on.", connects: ["Strings", "Sorting", "Searching"] },
    { id: "strings", label: "Strings", why: "Strings become easy once arrays and indexing feel natural.", connects: [] },
    { id: "recursion", label: "Recursion", why: "Requires comfort with functions and repeated subproblems.", connects: ["Trees"] },
    { id: "sorting", label: "Sorting", why: "Sorting combines arrays, loops, and comparison logic.", connects: [] },
    { id: "searching", label: "Searching", why: "Efficient search depends on traversal and sorted structures.", connects: [] },
    { id: "linked-lists", label: "Linked Lists", why: "Pointer-style thinking starts here and unlocks tree reasoning.", connects: ["Trees"] },
    { id: "trees", label: "Trees", why: "Trees combine recursion, structure traversal, and abstraction.", connects: [] },
  ],
  "Web Dev": [
    { id: "html", label: "HTML Basics", why: "HTML is the structure every interface sits on.", connects: ["CSS Basics", "DOM"] },
    { id: "css", label: "CSS Basics", why: "Styling fundamentals unlock every layout system.", connects: ["Flexbox", "Grid"] },
    { id: "js", label: "JS Basics", why: "JavaScript adds logic, state, and interactivity.", connects: ["DOM", "Fetch/API", "React Basics"] },
    { id: "dom", label: "DOM", why: "DOM knowledge bridges markup and interactive behavior.", connects: ["Events"] },
    { id: "events", label: "Events", why: "User-driven applications depend on event flow.", connects: ["Fetch/API"] },
    { id: "flexbox", label: "Flexbox", why: "Flexbox is the fastest route to solid responsive layouts.", connects: [] },
    { id: "grid", label: "Grid", why: "Grid builds on CSS confidence for two-dimensional layouts.", connects: [] },
    { id: "fetch", label: "Fetch/API", why: "Fetching data only clicks after JS and events feel easy.", connects: ["React Basics"] },
    { id: "react", label: "React Basics", why: "React depends on strong JS plus DOM thinking.", connects: ["State Management"] },
    { id: "state", label: "State Management", why: "State is where frontend architecture really begins.", connects: [] },
  ],
  Aptitude: [
    { id: "arithmetic", label: "Arithmetic", why: "Arithmetic sits underneath almost every aptitude question.", connects: ["Percentages", "Ratios", "Algebra"] },
    { id: "percentages", label: "Percentages", why: "Percentages convert raw arithmetic into practical comparisons.", connects: ["Profit & Loss"] },
    { id: "ratios", label: "Ratios", why: "Ratios power speed, work, and probability reasoning.", connects: ["Time & Work", "Time & Distance", "Probability"] },
    { id: "algebra", label: "Algebra", why: "Equations turn word problems into solvable structure.", connects: [] },
    { id: "geometry", label: "Geometry", why: "Spatial math lands better once core arithmetic is fluent.", connects: [] },
    { id: "time-work", label: "Time & Work", why: "Work-rate questions depend on ratio intuition.", connects: [] },
    { id: "time-distance", label: "Time & Distance", why: "Motion problems simplify once ratios feel automatic.", connects: [] },
    { id: "profit-loss", label: "Profit & Loss", why: "Business math is mostly percentage fluency in disguise.", connects: [] },
    { id: "probability", label: "Probability", why: "Chance problems need ratio and counting confidence.", connects: ["Permutation"] },
    { id: "permutation", label: "Permutation", why: "Permutations are the capstone of counting-based reasoning.", connects: [] },
  ],
  "App Dev": [
    { id: "rn-basics", label: "React Native Basics", why: "This is the base layer for building cross-platform mobile UI.", connects: ["Navigation & Routing", "UI Components"] },
    { id: "navigation", label: "Navigation & Routing", why: "Real apps need predictable movement between screens.", connects: ["State Management"] },
    { id: "ui", label: "UI Components", why: "Reusable components speed up every mobile workflow.", connects: ["Native APIs"] },
    { id: "state", label: "State Management", why: "State coordinates data across screens and flows.", connects: ["Firebase Integration"] },
    { id: "native-apis", label: "Native APIs", why: "Camera, storage, and sensors require strong component flow first.", connects: ["Performance Optimization"] },
    { id: "firebase", label: "Firebase Integration", why: "Backend wiring works best after routing and state feel stable.", connects: ["App Store Deployment"] },
    { id: "deployment", label: "App Store Deployment", why: "Shipping becomes easier when the data and auth flow are reliable.", connects: [] },
    { id: "performance", label: "Performance Optimization", why: "Performance tuning matters once the app already works end to end.", connects: [] },
  ],
  "Data Science": [
    { id: "python", label: "Python for Data Science", why: "Python is the working language behind the whole stack.", connects: ["NumPy & Pandas"] },
    { id: "numpy-pandas", label: "NumPy & Pandas", why: "Structured data work begins with vectorized operations and tables.", connects: ["Data Visualization", "Machine Learning"] },
    { id: "viz", label: "Data Visualization", why: "You need to see the data before you can model it well.", connects: ["Kaggle Practice"] },
    { id: "stats", label: "Statistics Basics", why: "Statistics explains why the patterns are meaningful.", connects: ["Machine Learning"] },
    { id: "ml", label: "Machine Learning", why: "ML depends on clean data plus statistical understanding.", connects: ["Deep Learning", "Model Deployment"] },
    { id: "dl", label: "Deep Learning", why: "Deep learning is easier after classic ML concepts are solid.", connects: ["NLP Basics"] },
    { id: "nlp", label: "NLP Basics", why: "NLP extends deep learning into text understanding.", connects: [] },
    { id: "deploy", label: "Model Deployment", why: "A model matters only when it can run in a product.", connects: [] },
  ],
  Cybersecurity: [
    { id: "networking", label: "Networking Fundamentals", why: "Security starts with understanding how systems communicate.", connects: ["Linux & Bash", "Web Security Basics"] },
    { id: "linux", label: "Linux & Bash", why: "Most security tooling and labs live in terminal-first workflows.", connects: ["Nmap Scanning", "CTF Challenges"] },
    { id: "web-sec", label: "Web Security Basics", why: "Before exploits, you need the core request-response threat model.", connects: ["OWASP Top 10"] },
    { id: "owasp", label: "OWASP Top 10", why: "OWASP organizes the biggest real-world web risks.", connects: ["Web App Pentesting"] },
    { id: "nmap", label: "Nmap Scanning", why: "Enumeration is the first step in almost every assessment.", connects: ["Metasploit Framework"] },
    { id: "pentest", label: "Web App Pentesting", why: "Pentesting requires both web fundamentals and threat awareness.", connects: ["CTF Challenges"] },
    { id: "metasploit", label: "Metasploit Framework", why: "Framework-heavy exploitation is easier after solid scanning practice.", connects: [] },
    { id: "ctf", label: "CTF Challenges", why: "CTFs combine enumeration, exploitation, and persistence.", connects: [] },
  ],
  IoT: [
    { id: "arduino", label: "Arduino & Raspberry Pi", why: "Hardware experimentation starts with accessible dev boards.", connects: ["Sensors & Actuators", "Microcontroller Programming"] },
    { id: "sensors", label: "Sensors & Actuators", why: "Real devices become useful when they can observe and react.", connects: ["MQTT & HTTP Protocols"] },
    { id: "microcontrollers", label: "Microcontroller Programming", why: "Firmware logic is what makes devices reliable.", connects: ["Edge Computing"] },
    { id: "protocols", label: "MQTT & HTTP Protocols", why: "Devices need communication patterns before they can go online.", connects: ["Cloud IoT Platforms"] },
    { id: "edge", label: "Edge Computing", why: "Local processing matters once device logic is stable.", connects: ["IoT Security"] },
    { id: "cloud", label: "Cloud IoT Platforms", why: "Cloud dashboards make sense after your devices can publish data.", connects: ["Real-time Data Streaming"] },
    { id: "streaming", label: "Real-time Data Streaming", why: "Streaming builds on protocol and cloud familiarity.", connects: [] },
    { id: "security", label: "IoT Security", why: "Connected devices demand security at every layer.", connects: [] },
  ],
  Python: [
    { id: "syntax", label: "Python Basics & Syntax", why: "Everything else depends on writing and reading Python cleanly.", connects: ["Control Flow", "Functions"] },
    { id: "control-flow", label: "Control Flow", why: "Branching and loops are the backbone of small programs.", connects: ["File I/O"] },
    { id: "functions", label: "Functions", why: "Functions turn scripts into reusable tools.", connects: ["OOP in Python", "Modules & Packages"] },
    { id: "oop", label: "OOP in Python", why: "Classes help organize bigger codebases and automation tools.", connects: ["Decorators & Generators"] },
    { id: "file-io", label: "File I/O", why: "Automation becomes practical once you can read and write files.", connects: ["Automation Scripts"] },
    { id: "modules", label: "Modules & Packages", why: "Understanding imports is key to larger Python projects.", connects: ["Testing & Debugging"] },
    { id: "decorators", label: "Decorators & Generators", why: "Advanced Python patterns land after strong function thinking.", connects: [] },
    { id: "testing", label: "Testing & Debugging", why: "Reliable Python work depends on good debugging discipline.", connects: [] },
  ],
  Alphabets: [
    { id: "letter-shapes", label: "Letter Shapes", why: "Children first need to notice how each letter looks before they can name it confidently.", connects: ["Letter Names", "Capital Letters"] },
    { id: "letter-names", label: "Letter Names", why: "Naming letters turns visual spotting into actual recognition.", connects: ["Letter Sounds"] },
    { id: "capital-letters", label: "Capital Letters", why: "Big letters are easier to identify and help build early alphabet confidence.", connects: ["Small Letters"] },
    { id: "letter-sounds", label: "Letter Sounds", why: "Phonics starts when letters connect to the sounds they make.", connects: ["Picture Matching"] },
    { id: "small-letters", label: "Small Letters", why: "Lowercase letters make more sense once uppercase shapes feel familiar.", connects: ["Picture Matching"] },
    { id: "picture-matching", label: "Picture Matching", why: "Matching A to apple or B to ball makes letters meaningful in the real world.", connects: ["Simple Words"] },
    { id: "simple-words", label: "Simple Words", why: "Short words are the first bridge from letters to reading.", connects: [] },
  ],
  Numbers: [
    { id: "counting-objects", label: "Counting Objects", why: "Young learners understand numbers best when they count real things they can see.", connects: ["Number Names", "More or Less"] },
    { id: "number-names", label: "Number Names", why: "Seeing and saying number names helps children connect symbols with quantity.", connects: ["Number Order"] },
    { id: "more-or-less", label: "More or Less", why: "Comparing groups builds early number sense before formal arithmetic.", connects: ["Number Order"] },
    { id: "number-order", label: "Number Order", why: "Recognizing what comes next creates confidence with sequences and patterns.", connects: ["Simple Addition"] },
    { id: "simple-addition", label: "Simple Addition", why: "Adding becomes easier once counting and order feel natural.", connects: ["Simple Subtraction"] },
    { id: "simple-subtraction", label: "Simple Subtraction", why: "Taking away builds on the same number sense as addition.", connects: [] },
  ],
  "Colors & Shapes": [
    { id: "basic-colors", label: "Basic Colors", why: "Bright familiar colors are the easiest visual category for early learners to spot.", connects: ["Object Colors", "Color Sorting"] },
    { id: "basic-shapes", label: "Basic Shapes", why: "Circles, squares, and triangles form the foundation for visual recognition.", connects: ["Shape Matching"] },
    { id: "object-colors", label: "Object Colors", why: "Linking colors to things like the sun, leaves, and apples makes learning stick.", connects: ["Color Sorting"] },
    { id: "shape-matching", label: "Shape Matching", why: "Matching shapes strengthens observation and pattern recognition.", connects: ["Shape Hunt"] },
    { id: "color-sorting", label: "Color Sorting", why: "Sorting groups by color turns recognition into a thinking skill.", connects: [] },
    { id: "shape-hunt", label: "Shape Hunt", why: "Finding shapes in the world helps children notice geometry in everyday life.", connects: [] },
  ],
  "Rhymes & Stories": [
    { id: "listening-fun", label: "Listening Fun", why: "Before children retell stories, they need to enjoy listening and noticing sounds.", connects: ["Animal Sounds", "Rhyme Pairs"] },
    { id: "animal-sounds", label: "Animal Sounds", why: "Recognizing familiar sounds builds audio memory and playful engagement.", connects: ["Story Moments"] },
    { id: "rhyme-pairs", label: "Rhyme Pairs", why: "Rhyming trains the ear to hear similar ending sounds in words.", connects: ["Simple Story Words"] },
    { id: "story-moments", label: "Story Moments", why: "Remembering what happens first or next builds comprehension gently.", connects: ["Feelings in Stories"] },
    { id: "simple-story-words", label: "Simple Story Words", why: "New vocabulary lands better once children enjoy the story flow.", connects: [] },
    { id: "feelings-in-stories", label: "Feelings in Stories", why: "Characters' feelings help children connect emotionally with stories.", connects: [] },
  ],
  "Nature & EVS": [
    { id: "plants-and-animals", label: "Plants and Animals", why: "Kids begin EVS by noticing the living things around them.", connects: ["Homes of Animals", "My Body"] },
    { id: "weather-around-us", label: "Weather Around Us", why: "Sunny, rainy, and windy days are easy everyday science observations.", connects: ["Seasons"] },
    { id: "homes-of-animals", label: "Homes of Animals", why: "Linking animals to where they live builds real-world understanding.", connects: ["Healthy Habits"] },
    { id: "my-body", label: "My Body", why: "Knowing body parts helps children connect learning to themselves.", connects: ["Healthy Habits"] },
    { id: "seasons", label: "Seasons", why: "Seasonal change makes more sense after weather patterns feel familiar.", connects: [] },
    { id: "healthy-habits", label: "Healthy Habits", why: "Handwashing, food, and rest turn EVS into useful everyday action.", connects: [] },
  ],
};

export function getTimelineNodesForDomain(domain: string): StageNodeDef[] {
  return TIMELINE_NODE_DEFS[domain] ?? TIMELINE_NODE_DEFS.DSA;
}

export function getAvailableQuizStages(domain: string): number {
  return Math.min(2, getTimelineNodesForDomain(domain).length);
}
