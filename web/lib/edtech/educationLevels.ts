/**
 * Education-level → Domain mapping
 *
 * Each education level has its own set of domains with icons, colors,
 * descriptions, topics, difficulty, and level info. The old hardcoded
 * engineering domains are preserved under the "engineering" level.
 */

import {
  Code2,
  Globe,
  Brain,
  Smartphone,
  BarChart3,
  Shield,
  Cpu,
  Database,
  BookOpen,
  PenTool,
  Calculator,
  FlaskConical,
  Atom,
  Leaf,
  TreeDeciduous,
  Heart,
  Scale,
  Landmark,
  TrendingUp,
  Users,
  Palette,
  Music,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Languages,
  FileText,
  Microscope,
  Stethoscope,
  Pill,
  type LucideIcon,
} from "lucide-react";

/* ─────────────────────────── Education Levels ─────────────────────────── */

export interface EducationLevel {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  shadow: string;
}

export const EDUCATION_LEVELS: EducationLevel[] = [
  { id: "early_childhood",  label: "Pre-School & Kindergarten", sub: "Ages 3–6",    icon: Lightbulb,      color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00" },
  { id: "primary",          label: "Class 1 – 5",              sub: "Ages 6–11",   icon: BookOpen,       color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43" },
  { id: "middle",           label: "Class 6 – 8",              sub: "Ages 11–14",  icon: PenTool,        color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC" },
  { id: "secondary",        label: "Class 9 – 10",             sub: "Ages 14–16",  icon: GraduationCap,  color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3" },
  { id: "hs_science_pcm",   label: "11 – 12 · Science (PCM)",  sub: "Ages 16–18",  icon: Atom,           color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25" },
  { id: "hs_science_pcb",   label: "11 – 12 · Science (PCB)",  sub: "Ages 16–18",  icon: Microscope,     color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00" },
  { id: "hs_commerce",      label: "11 – 12 · Commerce",       sub: "Ages 16–18",  icon: TrendingUp,     color: "#5AC8FA", textColor: "#0D0D0D", shadow: "#3da8d8" },
  { id: "hs_arts",          label: "11 – 12 · Arts / Humanities", sub: "Ages 16–18", icon: Palette,      color: "#FF6B6B", textColor: "#FFFFFF", shadow: "#cc5555" },
  { id: "engineering",      label: "Engineering / B.Tech",      sub: "College",     icon: Code2,          color: "#0D0D0D", textColor: "#FFD60A", shadow: "#333333" },
  { id: "medical",          label: "Medical / MBBS / BDS",      sub: "College",     icon: Stethoscope,    color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43" },
  { id: "law",              label: "Law / LLB",                 sub: "College",     icon: Scale,          color: "#8B6914", textColor: "#FFFFFF", shadow: "#6b5010" },
  { id: "mba",              label: "MBA / Business",            sub: "College / PG", icon: Briefcase,     color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC" },
  { id: "competitive",      label: "Competitive Exams",         sub: "UPSC, SSC…",  icon: FileText,       color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00" },
  { id: "professional",     label: "Working Professional",      sub: "Post-college", icon: Users,         color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3" },
];

/* ─────────────────────────── Domain Definition ─────────────────────────── */

export interface DomainDef {
  id: string;
  name: string;
  fullName: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  shadow: string;
  description: string;
  topics: string[];
  tag: string;
  difficulty: string;
  level: string;
  questions: number;
}

/* ─────────────────────────── Domain Data ─────────────────────────── */

const ENGINEERING_DOMAINS: DomainDef[] = [
  { id: "DSA", name: "DSA", fullName: "Competitive Programming Style", icon: Code2, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Arrays, recursion, trees, graphs, dynamic programming, and interview-heavy problem solving.", topics: ["Arrays", "Loops", "Recursion", "Sorting", "Trees"], tag: "CORE", difficulty: "Hard", level: "Beginner → Advanced", questions: 8 },
  { id: "Web Dev", name: "Web Dev", fullName: "Full Stack Development", icon: Globe, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "HTML, CSS, JavaScript, React, APIs, databases, and deployment workflows.", topics: ["HTML", "CSS", "JavaScript", "React", "APIs"], tag: "POPULAR", difficulty: "Medium", level: "Beginner → Intermediate", questions: 8 },
  { id: "Aptitude", name: "Aptitude", fullName: "Placement Prep", icon: Brain, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Quant, reasoning, verbal, DI, and placement-round fundamentals.", topics: ["Arithmetic", "Ratios", "Algebra", "Probability", "Puzzles"], tag: "PLACEMENT", difficulty: "Medium", level: "Basic → Expert", questions: 8 },
  { id: "App Dev", name: "App Dev", fullName: "Mobile Development", icon: Smartphone, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "React Native, navigation, native APIs, Firebase, and shipping mobile apps.", topics: ["React Native", "Routing", "State", "Native APIs", "Firebase"], tag: "MOBILE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Data Science", name: "Data Science", fullName: "ML / AI Track", icon: BarChart3, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Python data workflows, visualization, ML, deep learning, and model deployment.", topics: ["Python", "Pandas", "Viz", "ML", "Deployment"], tag: "TRENDING", difficulty: "Hard", level: "Intermediate → Advanced", questions: 8 },
  { id: "Cybersecurity", name: "Cybersecurity", fullName: "Ethical Hacking", icon: Shield, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Networking, Linux, OWASP, scanning, pentesting, and security tooling.", topics: ["Networking", "Linux", "OWASP", "Nmap", "CTF"], tag: "SPECIALIZED", difficulty: "Hard", level: "Intermediate → Advanced", questions: 8 },
  { id: "IoT", name: "IoT", fullName: "Embedded Systems", icon: Cpu, color: "#5AC8FA", textColor: "#0D0D0D", shadow: "#3da8d8", description: "Microcontrollers, sensors, protocols, edge workflows, and cloud-connected hardware.", topics: ["Arduino", "Sensors", "MQTT", "Edge", "Security"], tag: "NICHE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Python", name: "Python", fullName: "Core to Advanced Python", icon: Database, color: "#0D0D0D", textColor: "#FFD60A", shadow: "#333333", description: "Syntax, OOP, modules, automation, debugging, and practical scripting foundations.", topics: ["Syntax", "Functions", "OOP", "Modules", "Testing"], tag: "BEGINNER", difficulty: "Easy", level: "Beginner → Advanced", questions: 8 },
];

const EARLY_CHILDHOOD_DOMAINS: DomainDef[] = [
  { id: "Alphabets", name: "Alphabets", fullName: "Letters & Phonics", icon: Languages, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Learn A-Z, letter sounds, and basic phonics for early reading readiness.", topics: ["A–Z", "Phonics", "Letter Tracing", "Sounds", "Words"], tag: "BASICS", difficulty: "Easy", level: "Starter", questions: 5 },
  { id: "Numbers", name: "Numbers", fullName: "Counting & Early Math", icon: Calculator, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Counting 1–100, basic addition & subtraction, and number recognition.", topics: ["Counting", "Addition", "Subtraction", "Patterns", "Shapes"], tag: "BASICS", difficulty: "Easy", level: "Starter", questions: 5 },
  { id: "Colors & Shapes", name: "Colors & Shapes", fullName: "Visual Learning", icon: Palette, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "Identify colors, basic shapes, and develop visual-spatial awareness.", topics: ["Colors", "Shapes", "Patterns", "Matching", "Sorting"], tag: "FUN", difficulty: "Easy", level: "Starter", questions: 5 },
  { id: "Rhymes & Stories", name: "Rhymes & Stories", fullName: "Language & Imagination", icon: Music, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Nursery rhymes, short stories, and vocabulary building through fun activities.", topics: ["Rhymes", "Stories", "Vocabulary", "Listening", "Speaking"], tag: "FUN", difficulty: "Easy", level: "Starter", questions: 5 },
  { id: "Nature & EVS", name: "Nature & EVS", fullName: "My World Around Me", icon: Leaf, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Plants, animals, seasons, and basic environmental science for tiny explorers.", topics: ["Animals", "Plants", "Seasons", "My Body", "Hygiene"], tag: "EXPLORE", difficulty: "Easy", level: "Starter", questions: 5 },
];

const PRIMARY_DOMAINS: DomainDef[] = [
  { id: "Maths", name: "Mathematics", fullName: "Class 1–5 Maths", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Arithmetic, fractions, measurements, geometry basics, and word problems.", topics: ["Arithmetic", "Fractions", "Geometry", "Measurement", "Word Problems"], tag: "CORE", difficulty: "Easy", level: "Beginner", questions: 6 },
  { id: "English", name: "English", fullName: "Language & Grammar", icon: BookOpen, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Grammar, vocabulary, comprehension, and creative writing fundamentals.", topics: ["Grammar", "Vocabulary", "Reading", "Writing", "Comprehension"], tag: "CORE", difficulty: "Easy", level: "Beginner", questions: 6 },
  { id: "EVS", name: "EVS", fullName: "Environmental Studies", icon: TreeDeciduous, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Science and social studies combined — nature, community, health, and the world.", topics: ["Nature", "Community", "Health", "Water", "Transport"], tag: "EXPLORE", difficulty: "Easy", level: "Beginner", questions: 6 },
  { id: "Hindi", name: "Hindi", fullName: "Hindi Language", icon: Languages, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Hindi alphabets, grammar, stories, poems, and writing practice.", topics: ["Varnamala", "Grammar", "Stories", "Poems", "Writing"], tag: "LANG", difficulty: "Easy", level: "Beginner", questions: 6 },
  { id: "GK", name: "GK", fullName: "General Knowledge", icon: Lightbulb, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Fun facts, current affairs, famous people, and the world around us.", topics: ["Facts", "Countries", "Science", "History", "Sports"], tag: "FUN", difficulty: "Easy", level: "Beginner", questions: 6 },
];

const MIDDLE_DOMAINS: DomainDef[] = [
  { id: "Mathematics", name: "Mathematics", fullName: "Class 6–8 Maths", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Algebra, geometry, data handling, rational numbers, and mensuration.", topics: ["Algebra", "Geometry", "Ratios", "Data Handling", "Mensuration"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Science", name: "Science", fullName: "General Science", icon: FlaskConical, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Physics, chemistry, and biology foundations — forces, reactions, living organisms.", topics: ["Physics", "Chemistry", "Biology", "Light", "Electricity"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Social Studies", name: "Social Studies", fullName: "History, Civics & Geo", icon: Landmark, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "History, geography, civics, and understanding society and governance.", topics: ["History", "Geography", "Civics", "Economics", "Maps"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "English-Mid", name: "English", fullName: "Language & Literature", icon: BookOpen, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Grammar, literature, essay writing, and advanced comprehension skills.", topics: ["Grammar", "Literature", "Essays", "Comprehension", "Poetry"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Computers", name: "Computers", fullName: "Intro to Computing", icon: Cpu, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Basics of computers, internet, MS Office, and intro to coding.", topics: ["Hardware", "Software", "Internet", "Scratch", "Typing"], tag: "TRENDING", difficulty: "Easy", level: "Beginner", questions: 6 },
];

const SECONDARY_DOMAINS: DomainDef[] = [
  { id: "Math-10", name: "Mathematics", fullName: "Class 9–10 Maths", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Polynomials, coordinate geometry, trigonometry, probability and advanced algebra.", topics: ["Polynomials", "Trigonometry", "Coordinate Geo", "Probability", "Quadratics"], tag: "BOARD", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Physics-10", name: "Physics", fullName: "Motion, Light & More", icon: Atom, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Motion, force, electricity, magnetism, light refraction and optics.", topics: ["Motion", "Force", "Electricity", "Light", "Energy"], tag: "BOARD", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Chemistry-10", name: "Chemistry", fullName: "Reactions & Elements", icon: FlaskConical, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "Chemical reactions, acids & bases, periodic table, metals, and carbon compounds.", topics: ["Reactions", "Acids & Bases", "Periodic Table", "Carbon", "Metals"], tag: "BOARD", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Biology-10", name: "Biology", fullName: "Life Processes", icon: Leaf, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Life processes, heredity, ecology, control & coordination, and reproduction.", topics: ["Life Processes", "Heredity", "Ecology", "Reproduction", "Evolution"], tag: "BOARD", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "History-10", name: "History", fullName: "Modern World History", icon: Landmark, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Nationalism, world wars, colonialism, and the making of the modern world.", topics: ["Nationalism", "Industrialization", "Colonialism", "World Wars", "Independence"], tag: "BOARD", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "CS-10", name: "Computer Science", fullName: "Programming Basics", icon: Code2, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Python basics, algorithms, networking, and cybersafety.", topics: ["Python Basics", "Algorithms", "Lists", "Networking", "Cybersafety"], tag: "OPTIONAL", difficulty: "Medium", level: "Beginner → Intermediate", questions: 8 },
];

const HS_SCIENCE_PCM: DomainDef[] = [
  { id: "Physics-12", name: "Physics", fullName: "Board + JEE/NEET", icon: Atom, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Mechanics, electrodynamics, optics, modern physics, and thermodynamics.", topics: ["Mechanics", "Electrodynamics", "Optics", "Modern Physics", "Thermo"], tag: "BOARD+JEE", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Chemistry-12", name: "Chemistry", fullName: "Organic, Inorganic, Physical", icon: FlaskConical, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "Organic reactions, coordination compounds, electrochemistry, and kinetics.", topics: ["Organic", "Inorganic", "Physical", "Electrochemistry", "Kinetics"], tag: "BOARD+JEE", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Maths-12", name: "Mathematics", fullName: "Calculus & Beyond", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Calculus, vectors, 3D geometry, matrices, probability, and differential equations.", topics: ["Calculus", "Vectors", "3D Geometry", "Matrices", "Probability"], tag: "BOARD+JEE", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "CS-12", name: "Computer Science", fullName: "Python & Databases", icon: Code2, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Python programming, SQL databases, data structures, and networking.", topics: ["Python", "SQL", "Data Structures", "Networking", "Boolean Algebra"], tag: "OPTIONAL", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "English-12", name: "English", fullName: "Language & Literature", icon: BookOpen, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Advanced grammar, prose, poetry, letter writing, and comprehension.", topics: ["Grammar", "Prose", "Poetry", "Writing", "Comprehension"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
];

const HS_SCIENCE_PCB: DomainDef[] = [
  { id: "Physics-PCB", name: "Physics", fullName: "Board + NEET Physics", icon: Atom, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Mechanics, optics, electro, modern physics with NEET-focus.", topics: ["Mechanics", "Optics", "Electro", "Modern Physics", "Waves"], tag: "BOARD+NEET", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Chemistry-PCB", name: "Chemistry", fullName: "Board + NEET Chem", icon: FlaskConical, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "Organic, inorganic, physical chemistry with NEET emphasis.", topics: ["Organic", "Inorganic", "Physical", "Biomolecules", "Polymers"], tag: "BOARD+NEET", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Biology-PCB", name: "Biology", fullName: "Botany & Zoology", icon: Leaf, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Cell biology, genetics, ecology, human physiology, and plant anatomy.", topics: ["Cell Biology", "Genetics", "Ecology", "Physiology", "Anatomy"], tag: "BOARD+NEET", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Zoology", name: "Zoology", fullName: "Animal Sciences", icon: Microscope, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Animal diversity, structural organization, reproduction, and evolution.", topics: ["Animal Diversity", "Morphology", "Reproduction", "Evolution", "Ecology"], tag: "NEET", difficulty: "Hard", level: "Advanced", questions: 8 },
];

const HS_COMMERCE_DOMAINS: DomainDef[] = [
  { id: "Accountancy", name: "Accountancy", fullName: "Financial Accounting", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Double-entry, partnership accounts, company accounts, and financial statements.", topics: ["Journal", "Ledger", "Partnership", "Company Accounts", "Cash Flow"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Economics", name: "Economics", fullName: "Micro & Macro", icon: TrendingUp, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Demand & supply, national income, money & banking, and government budget.", topics: ["Demand & Supply", "National Income", "Banking", "Budget", "Trade"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Business Studies", name: "Business Studies", fullName: "Business Principles", icon: Briefcase, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Management, marketing, finance, and business environment fundamentals.", topics: ["Management", "Marketing", "Finance", "Planning", "Organizing"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Commerce-Maths", name: "Mathematics", fullName: "Applied Mathematics", icon: Calculator, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Linear programming, probability, calculus, and statistics for commerce.", topics: ["LP", "Probability", "Statistics", "Calculus", "Matrices"], tag: "OPTIONAL", difficulty: "Medium", level: "Intermediate", questions: 8 },
];

const HS_ARTS_DOMAINS: DomainDef[] = [
  { id: "History-Arts", name: "History", fullName: "World & Indian History", icon: Landmark, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Ancient civilizations, medieval India, modern world history, and historiography.", topics: ["Ancient India", "Medieval", "Modern World", "Freedom Struggle", "Cultures"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Political Science", name: "Political Science", fullName: "Governance & Constitution", icon: Scale, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Indian constitution, political theory, international relations, and governance.", topics: ["Constitution", "Political Theory", "IR", "Governance", "Rights"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Geography-Arts", name: "Geography", fullName: "Physical & Human", icon: Globe, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Physical geography, human geography, maps, resources, and climatology.", topics: ["Physical Geo", "Human Geo", "Maps", "Resources", "Climate"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Psychology", name: "Psychology", fullName: "Mind & Behavior", icon: Brain, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Cognition, personality, social influence, therapy approaches, and mental health.", topics: ["Cognition", "Personality", "Social", "Disorders", "Therapy"], tag: "POPULAR", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Sociology", name: "Sociology", fullName: "Society & Culture", icon: Users, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Indian society, social change, caste, class, institutions, and cultural studies.", topics: ["Society", "Caste", "Class", "Institutions", "Change"], tag: "EXPLORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
];

const MEDICAL_DOMAINS: DomainDef[] = [
  { id: "Anatomy", name: "Anatomy", fullName: "Human Structure", icon: Heart, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "Bones, muscles, organs, and systems — the structural blueprint of the human body.", topics: ["Musculoskeletal", "Thorax", "Abdomen", "Head & Neck", "Limbs"], tag: "PRE-CLINICAL", difficulty: "Hard", level: "Foundation", questions: 8 },
  { id: "Physiology", name: "Physiology", fullName: "Body Functions", icon: Stethoscope, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "How organ systems function — cardiovascular, renal, neuro, and endocrine.", topics: ["CVS", "Respiratory", "Renal", "Neuro", "Endocrine"], tag: "PRE-CLINICAL", difficulty: "Hard", level: "Foundation", questions: 8 },
  { id: "Biochemistry", name: "Biochemistry", fullName: "Molecular Basis of Life", icon: FlaskConical, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Enzymes, metabolism, molecular biology, and clinical biochemistry.", topics: ["Enzymes", "Metabolism", "DNA/RNA", "Vitamins", "Clinical"], tag: "PRE-CLINICAL", difficulty: "Hard", level: "Foundation", questions: 8 },
  { id: "Pathology", name: "Pathology", fullName: "Disease Mechanisms", icon: Microscope, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Inflammation, neoplasia, hemodynamics, and systemic pathology.", topics: ["Inflammation", "Neoplasia", "Hemodynamics", "Immune", "Systemic"], tag: "CLINICAL", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Pharmacology", name: "Pharmacology", fullName: "Drugs & Therapeutics", icon: Pill, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Drug mechanisms, pharmacokinetics, adverse effects, and clinical therapeutics.", topics: ["ANS", "CNS", "CVS Drugs", "Antimicrobials", "Kinetics"], tag: "CLINICAL", difficulty: "Hard", level: "Advanced", questions: 8 },
];

const LAW_DOMAINS: DomainDef[] = [
  { id: "Constitutional Law", name: "Constitutional Law", fullName: "Indian Constitution", icon: Landmark, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Fundamental rights, directive principles, amendments, and constitutional interpretation.", topics: ["Fundamental Rights", "DPSP", "Amendments", "Federalism", "Judiciary"], tag: "CORE", difficulty: "Hard", level: "Foundation", questions: 8 },
  { id: "Criminal Law", name: "Criminal Law", fullName: "IPC & CrPC", icon: Shield, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "IPC offenses, criminal procedure, evidence law, and landmark judgments.", topics: ["IPC", "CrPC", "Evidence", "Bail", "Trials"], tag: "CORE", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "Contract Law", name: "Contract Law", fullName: "Agreements & Obligations", icon: FileText, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Formation of contracts, breach, specific relief, and commercial agreements.", topics: ["Formation", "Breach", "Specific Relief", "Agency", "Sale of Goods"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Environmental Law", name: "Env. Law", fullName: "Environmental Protection", icon: Leaf, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Environmental protection acts, pollution control, and sustainable development law.", topics: ["EPA", "Pollution", "Wildlife", "Forest Act", "PIL"], tag: "SPECIALIZED", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Legal Reasoning", name: "Legal Reasoning", fullName: "CLAT / Entrance Prep", icon: Brain, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Logical reasoning, legal aptitude, critical thinking for law entrance exams.", topics: ["Reasoning", "Aptitude", "Comprehension", "Legal GK", "Critical Thinking"], tag: "ENTRANCE", difficulty: "Medium", level: "Beginner → Advanced", questions: 8 },
];

const MBA_DOMAINS: DomainDef[] = [
  { id: "Marketing", name: "Marketing", fullName: "Strategy & Growth", icon: TrendingUp, color: "#FF3B30", textColor: "#FFFFFF", shadow: "#cc2e25", description: "4Ps, branding, digital marketing, consumer behavior, and market research.", topics: ["4Ps", "Branding", "Digital", "Consumer Behavior", "Research"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Finance", name: "Finance", fullName: "Corporate & Investment", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Valuation, capital budgeting, portfolio management, and financial statements.", topics: ["Valuation", "Capital Budgeting", "Portfolio", "Risk", "Statements"], tag: "CORE", difficulty: "Hard", level: "Advanced", questions: 8 },
  { id: "HR", name: "HR", fullName: "Human Resources", icon: Users, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Recruitment, performance management, labor laws, and organizational behavior.", topics: ["Recruitment", "Performance", "Labor Laws", "OB", "Culture"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Operations", name: "Operations", fullName: "Supply Chain & Ops", icon: Cpu, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Supply chain, quality management, lean, six sigma, and process optimization.", topics: ["Supply Chain", "Quality", "Lean", "Six Sigma", "Logistics"], tag: "SPECIALIZED", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "Analytics", name: "Analytics", fullName: "Business Analytics", icon: BarChart3, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Data-driven decisions, statistics, SQL, dashboards, and predictive models.", topics: ["Statistics", "SQL", "Dashboards", "Prediction", "Excel"], tag: "TRENDING", difficulty: "Medium", level: "Intermediate", questions: 8 },
];

const COMPETITIVE_DOMAINS: DomainDef[] = [
  { id: "Quant", name: "Quantitative", fullName: "Numerical Ability", icon: Calculator, color: "#FFD60A", textColor: "#0D0D0D", shadow: "#ccaa00", description: "Arithmetic, algebra, geometry, number systems, and data interpretation.", topics: ["Arithmetic", "Algebra", "Geometry", "DI", "Number Systems"], tag: "CORE", difficulty: "Hard", level: "Beginner → Advanced", questions: 8 },
  { id: "Reasoning", name: "Reasoning", fullName: "Logical & Analytical", icon: Brain, color: "#0A84FF", textColor: "#FFFFFF", shadow: "#0060CC", description: "Logical reasoning, analytical puzzles, seating arrangements, and coding-decoding.", topics: ["Logic", "Puzzles", "Seating", "Coding-Decoding", "Syllogisms"], tag: "CORE", difficulty: "Hard", level: "Beginner → Advanced", questions: 8 },
  { id: "English-Comp", name: "English", fullName: "Verbal Ability", icon: BookOpen, color: "#34C759", textColor: "#0D0D0D", shadow: "#229A43", description: "Comprehension, grammar, para-jumbles, vocabulary, and sentence correction.", topics: ["Comprehension", "Grammar", "Para-jumbles", "Vocabulary", "Fill-ups"], tag: "CORE", difficulty: "Medium", level: "Intermediate", questions: 8 },
  { id: "GK-CA", name: "GK & Current Affairs", fullName: "General Awareness", icon: Globe, color: "#FF9F0A", textColor: "#0D0D0D", shadow: "#cc7f00", description: "Current events, polity, economy, history, geography, and science GK.", topics: ["Current Affairs", "Polity", "Economy", "History", "Science"], tag: "ESSENTIAL", difficulty: "Medium", level: "Ongoing", questions: 8 },
  { id: "Essay-Interview", name: "Essay & Interview", fullName: "Written Exam + PI", icon: PenTool, color: "#AF52DE", textColor: "#FFFFFF", shadow: "#8e3db3", description: "Essay writing, answer structuring, personality development, and mock interviews.", topics: ["Essay", "Answer Writing", "Personality", "Ethics", "Current Topics"], tag: "FINAL", difficulty: "Hard", level: "Advanced", questions: 8 },
];

/* ─────────────────────────── Level → Domains Map ─────────────────────────── */

const DOMAINS_BY_LEVEL: Record<string, DomainDef[]> = {
  early_childhood: EARLY_CHILDHOOD_DOMAINS,
  primary: PRIMARY_DOMAINS,
  middle: MIDDLE_DOMAINS,
  secondary: SECONDARY_DOMAINS,
  hs_science_pcm: HS_SCIENCE_PCM,
  hs_science_pcb: HS_SCIENCE_PCB,
  hs_commerce: HS_COMMERCE_DOMAINS,
  hs_arts: HS_ARTS_DOMAINS,
  engineering: ENGINEERING_DOMAINS,
  medical: MEDICAL_DOMAINS,
  law: LAW_DOMAINS,
  mba: MBA_DOMAINS,
  competitive: COMPETITIVE_DOMAINS,
  professional: ENGINEERING_DOMAINS, // professionals default to same as engineering
};

/* ─────────────────────────── Public API ─────────────────────────── */

export function getDomainsForLevel(levelId: string): DomainDef[] {
  return DOMAINS_BY_LEVEL[levelId] ?? ENGINEERING_DOMAINS;
}

/** Flat list of every domain id for quick lookup */
export function getAllDomainIds(): string[] {
  return Object.values(DOMAINS_BY_LEVEL).flatMap((arr) => arr.map((d) => d.id));
}

/** Quick domain IDs for onboarding's multi-select */
export function getDomainChipsForLevel(levelId: string): { id: string; label: string; color: string }[] {
  return getDomainsForLevel(levelId).map((d) => ({ id: d.id, label: d.name, color: d.color }));
}
