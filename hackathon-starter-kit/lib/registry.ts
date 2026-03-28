import { 
  Bot, Layout, Search, Mail, Type, 
  Palette, MousePointer2, FileText, 
  Settings, CreditCard, MessageSquare, 
  Mic, User, CheckSquare, Navigation,
  Code2, Moon, Sparkles, Zap, ChevronsUpDown,
  Activity, Globe
} from 'lucide-react';
import React from 'react';

export type ComponentCategory = 'Layout' | 'AI & Tools' | 'Search & Data' | 'Base UI' | 'Auth' | 'Payment' | 'Real-Time';

export interface ModularFile {
  name: string;
  type: 'file' | 'directory';
  path: string;
}

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: any;
  difficulty: 'Simple' | 'Modular' | 'Advanced';
  modularStructure: ModularFile[];
  props?: PropDef[];
  usage?: string;
}

export const COMPONENT_REGISTRY: ComponentMetadata[] = [
  // ─── BASE UI ─────────────────────────────────────────────────────────────────
  {
    id: 'button',
    name: 'Button',
    description: 'Animated primitive with multiple variants, sizes, and loading states.',
    category: 'Base UI',
    icon: MousePointer2,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'Button.tsx', type: 'file', path: 'Button.tsx' },
      { name: 'Button.types.ts', type: 'file', path: 'Button.types.ts' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'variant', type: '"default" | "outline" | "ghost" | "destructive"', default: '"default"', description: 'Visual style of the button.' },
      { name: 'size', type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: 'Controls padding and font size.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the button.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and reduces opacity.' },
      { name: 'className', type: 'string', description: 'Merge additional Tailwind classes.' },
      { name: 'onClick', type: '() => void', description: 'Click handler.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Button label or icon content.' },
    ],
    usage: `import { Button } from '@/ui';

// Default
<Button>Click me</Button>

// Variants
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Saving...</Button>`,
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Structural container for grouping related content and actions.',
    category: 'Base UI',
    icon: Layout,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'Card.tsx', type: 'file', path: 'Card.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'className', type: 'string', description: 'Additional classes for the card wrapper.' },
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Card body content.' },
    ],
    usage: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/ui';

<Card>
  <CardHeader>
    <CardTitle>Hello World</CardTitle>
    <CardDescription>A short description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>`,
  },
  {
    id: 'input',
    name: 'Input',
    description: 'Form primitive with label support, error states, and focus animations.',
    category: 'Base UI',
    icon: Type,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'Input.tsx', type: 'file', path: 'Input.tsx' },
      { name: 'Input.types.ts', type: 'file', path: 'Input.types.ts' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'label', type: 'string', description: 'Floating label shown above the input.' },
      { name: 'error', type: 'string', description: 'Error message shown below the input in red.' },
      { name: 'type', type: 'string', default: '"text"', description: 'HTML input type (text, email, password, etc).' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text shown inside the input.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Marks the input as required.' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes.' },
      { name: 'onChange', type: '(e: React.ChangeEvent<HTMLInputElement>) => void', description: 'Change handler.' },
    ],
    usage: `import { Input } from '@/ui';

// Basic
<Input label="Email" type="email" placeholder="you@example.com" />

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// Controlled
const [value, setValue] = useState('');
<Input
  label="Username"
  value={value}
  onChange={e => setValue(e.target.value)}
/>`,
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    description: 'Horizontal segmented switch with animated active pill and icon support.',
    category: 'Base UI',
    icon: ChevronsUpDown,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'index.tsx', type: 'file', path: 'SegmentedControl/index.tsx' },
    ],
    props: [
      { name: 'items', type: '{ value: string; label: string; icon?: React.ReactNode; disabled?: boolean }[]', required: true, description: 'Segments to render.' },
      { name: 'value', type: 'string', description: 'Controlled active value.' },
      { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Change handler.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Segment height and padding.' },
      { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Layout direction of segments.' },
      { name: 'className', type: 'string', description: 'Additional Tailwind classes.' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible label for the tablist.' },
    ],
    usage: `import { SegmentedControl } from '@/ui';

const [view, setView] = useState('overview');

<SegmentedControl
  value={view}
  onValueChange={setView}
  items={[
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity' },
    { value: 'settings', label: 'Settings' },
  ]}
/>`,
  },
  {
    id: 'code-snippet',
    name: 'CodeSnippet',
    description: 'Syntax-highlighted code block with inline variant. Powered by react-syntax-highlighter.',
    category: 'Base UI',
    icon: Code2,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'CodeSnippet.tsx', type: 'file', path: 'CodeSnippet.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'code', type: 'string', required: true, description: 'The source code string to display.' },
      { name: 'language', type: 'string', default: '"tsx"', description: 'Language for syntax highlighting (tsx, typescript, bash, python, etc).' },
      { name: 'inline', type: 'boolean', default: 'false', description: 'Renders as an inline <code> span instead of a block.' },
      { name: 'background', type: '"theme" | "background"', default: '"theme"', description: 'Controls whether the code surface uses the syntax theme background or the app background.' },
      { name: 'windowVariant', type: '"none" | "mac" | "windows" | "linux"', default: '"none"', description: 'Optional window chrome style.' },
      { name: 'title', type: 'string', description: 'Optional window title (when windowVariant is enabled).' },
      { name: 'className', type: 'string', description: 'Additional classes for the container.' },
    ],
    usage: `import { CodeSnippet } from '@/ui';

// Block snippet
<CodeSnippet
  code={\`const greeting = 'Hello, World!';\`}
  language="typescript"
  windowVariant="mac"
  title="hello.ts"
/>

// Bash command
<CodeSnippet code="npm install @your/package" language="bash" />

// Inline
<p>Use the <CodeSnippet code="useState" inline /> hook.</p>`,
  },
  {
    id: 'theme-toggler',
    name: 'ThemeToggler',
    description: 'Dark/light mode toggle with a cinematic View Transitions API wipe animation.',
    category: 'Base UI',
    icon: Moon,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'ThemeToggler.tsx', type: 'file', path: 'ThemeToggler.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'className', type: 'string', description: 'Additional classes for the toggle button.' },
    ],
    usage: `import { ThemeToggler } from '@/ui';

// Drop it anywhere — it reads from next-themes automatically
<ThemeToggler />

// Typically used inside a Navbar
<nav>
  <Logo />
  <NavLinks />
  <ThemeToggler />
</nav>`,
  },
  {
    id: 'user-profile',
    name: 'UserProfile',
    description: 'Premium user profile dropdown with animated transitions, sectioned actions, and status badges.',
    category: 'Base UI',
    icon: User,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'UserProfile.tsx', type: 'file', path: 'UserProfile.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'user', type: '{ name: string; email?: string; avatar?: string }', required: true, description: 'User data to display in the dropdown.' },
      { name: 'isProfileOpen', type: 'boolean', required: true, description: 'Controls whether the dropdown is open.' },
      { name: 'setIsProfileOpen', type: '(open: boolean) => void', required: true, description: 'Setter for the open state.' },
      { name: 'onLogout', type: '() => void', description: 'Callback fired when user clicks "Log out".' },
      { name: 'onSwitchAccount', type: '() => void', description: 'Callback for the "Switch Account" action.' },
    ],
    usage: `import { UserProfile } from '@/ui';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<UserProfile
  user={{ name: 'Jane Doe', email: 'jane@example.com' }}
  isProfileOpen={open}
  setIsProfileOpen={setOpen}
  onLogout={() => supabase.auth.signOut()}
/>`,
  },
  {
    id: 'page-transition',
    name: 'PageTransition',
    description: 'Framer Motion wrapper that adds a smooth fade-slide animation to any page or section.',
    category: 'Base UI',
    icon: ChevronsUpDown,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'PageTransition.tsx', type: 'file', path: 'PageTransition.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to animate in.' },
      { name: 'className', type: 'string', description: 'Additional classes applied to the motion wrapper.' },
    ],
    usage: `import { PageTransition } from '@/ui';

// Wrap any page or section
export default function AboutPage() {
  return (
    <PageTransition>
      <h1>About Us</h1>
      <p>Content fades in smoothly on mount.</p>
    </PageTransition>
  );
}`,
  },
  {
    id: 'logo',
    name: 'Logo',
    description: 'Elite SVG logo with abstract geometric symbols, upward momentum themes, and interactive glow effects.',
    category: 'Base UI',
    icon: Zap,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'Logo.tsx', type: 'file', path: 'Logo.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'variant', type: '"small" | "med" | "big"', default: '"med"', description: 'Preset size variant (24 / 40 / 64px).' },
      { name: 'size', type: 'number', description: 'Explicit pixel size — overrides variant.' },
      { name: 'showText', type: 'boolean', default: 'false', description: 'Renders the brand name next to the symbol.' },
      { name: 'href', type: 'string', default: '"/"', description: 'Link destination when the logo is clicked.' },
      { name: 'className', type: 'string', description: 'Additional classes for the wrapper link.' },
    ],
    usage: `import { Logo } from '@/ui';

// Default (medium, symbol only)
<Logo />

// With text
<Logo showText />

// Custom size
<Logo size={80} />

// Link to a custom path
<Logo href="/home" />`,
  },
  {
    id: 'scrollbar',
    name: 'ScrollBar',
    description: 'Theme-aware custom scrollbar that automatically matches every color scheme and dark/light mode via CSS variables.',
    category: 'Base UI',
    icon: ChevronsUpDown,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'scrollbar.css', type: 'file', path: 'styles/scrollbar.css' },
    ],
    props: [
      { name: '.no-scrollbar', type: 'CSS class', description: 'Apply to any element to completely hide its scrollbar while preserving scroll behaviour.' },
    ],
    usage: `/* Already imported globally via styles/globals.css — no JS needed. */

/* Hide scrollbar on a specific element */
<div className="no-scrollbar overflow-y-auto h-64">
  {/* content */}
</div>

/* The themed scrollbar applies automatically to all scrollable elements. */`,
  },

  // ─── LAYOUT ──────────────────────────────────────────────────────────────────
  {
    id: 'navbar',
    name: 'Navbar',
    description: 'Responsive navigation bar with search, user profile, mobile menu, and theme toggle.',
    category: 'Layout',
    icon: Navigation,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'Navbar.tsx', type: 'file', path: 'Navbar.tsx' },
      { name: 'hooks/useNavbar.ts', type: 'file', path: 'hooks/useNavbar.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'links', type: 'NavLink[]', default: '[]', description: 'Array of { label, href } objects rendered as nav links.' },
      { name: 'user', type: 'NavbarUser | null', default: 'null', description: 'Logged-in user data. When provided, shows the UserProfile dropdown.' },
      { name: 'onSearch', type: '(query: string) => void', description: 'Enables and handles the command-palette search.' },
      { name: 'onLogout', type: '() => void', description: 'Callback for the logout action in the user dropdown.' },
      { name: 'onSwitchAccount', type: '() => void', description: 'Callback for the switch-account action.' },
      { name: 'actions', type: 'React.ReactNode', description: 'Slot for custom right-side actions (e.g. a Login button) when no user is logged in.' },
      { name: 'showThemeToggle', type: 'boolean', default: 'true', description: 'Whether to render the ThemeToggler.' },
      { name: 'logoHref', type: 'string', default: '"/"', description: 'Destination of the logo link.' },
      { name: 'layoutId', type: 'string', description: 'Framer Motion layoutId for the active-link pill animation.' },
      { name: 'className', type: 'string', description: 'Additional classes on the <nav> element.' },
    ],
    usage: `import Navbar from '@/components/layouts/Navbar/Navbar';

<Navbar
  links={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
  ]}
  user={{ name: 'Jane', email: 'jane@example.com' }}
  onLogout={() => supabase.auth.signOut()}
  onSearch={(q) => console.log('search:', q)}
  showThemeToggle
/>`,
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Composable footer with brand section, multi-column link groups, and copyright.',
    category: 'Layout',
    icon: Layout,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'Footer.tsx', type: 'file', path: 'Footer.tsx' },
      { name: 'hooks/useFooter.ts', type: 'file', path: 'hooks/useFooter.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'brandDescription', type: 'string', description: 'Tagline shown under the logo.' },
      { name: 'sections', type: '{ title: string; links: { label: string; href: string }[] }[]', description: 'Link column groups rendered in the footer.' },
      { name: 'className', type: 'string', description: 'Additional classes on the footer wrapper.' },
    ],
    usage: `import { Footer } from '@/ui';

<Footer
  brandDescription="Built for speed and aesthetics."
  sections={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ]}
/>`,
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Collapsible application sidebar with animated active states and grouped navigation.',
    category: 'Layout',
    icon: Layout,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'Sidebar.tsx', type: 'file', path: 'Sidebar.tsx' },
      { name: 'components/SidebarItem.tsx', type: 'file', path: 'components/SidebarItem.tsx' },
      { name: 'components/SidebarGroup.tsx', type: 'file', path: 'components/SidebarGroup.tsx' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Initial state of the sidebar.' },
      { name: 'className', type: 'string', description: 'Additional classes on the sidebar container.' },
    ],
    usage: `import { Sidebar, SidebarItem, SidebarGroup } from '@/ui';
import { Home, Settings } from 'lucide-react';

<Sidebar>
  <SidebarGroup label="Menu">
    <SidebarItem icon={<Home size={18} />} label="Dashboard" active />
  </SidebarGroup>
  <SidebarGroup label="System">
    <SidebarItem icon={<Settings size={18} />} label="Preferences" />
  </SidebarGroup>
</Sidebar>`,
  },

  // ─── AUTH ────────────────────────────────────────────────────────────────────
  {
    id: 'log-in',
    name: 'LogIn',
    description: 'Unified auth card that toggles between login & register modes with animated transitions and a switch link.',
    category: 'Auth',
    icon: User,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'LogIn.tsx', type: 'file', path: 'LogIn/LogIn.tsx' },
      { name: 'index.ts',  type: 'file', path: 'LogIn/index.ts'  },
    ],
    props: [
      { name: 'defaultMode', type: '"login" | "register"', default: '"login"', description: 'Which form is shown initially.' },
      { name: 'registrationMode', type: '"otp" | "confirmation-link"', default: '"otp"', description: 'Post-registration flow: advance to OTP entry or show "check inbox" screen.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'External loading flag that disables the form.' },
      { name: 'onLoginSubmit', type: '(values: { email; password }) => void', description: 'Called on password login form submit.' },
      { name: 'onRegisterSubmit', type: '(values: { name; email; password }) => void', description: 'Called on registration form submit.' },
      { name: 'onGoogleSignIn', type: '() => void', description: 'Shows and handles Google OAuth login.' },
      { name: 'onGoogleSignUp', type: '() => void', description: 'Shows and handles Google OAuth sign-up.' },
      { name: 'onSendOtp', type: '(email: string) => void', description: 'Called to send a 6-digit OTP to the given email.' },
      { name: 'onVerifyOtp', type: '(email: string, token: string) => void', description: 'Called to verify the OTP token.' },
      { name: 'extraFields', type: 'React.ReactNode', description: 'Slot for injecting additional content (e.g. error messages) inside the form.' },
    ],
    usage: `import { LogIn } from '@/ui/features/LogIn';

<LogIn
  registrationMode="otp"
  onLoginSubmit={async ({ email, password }) => {
    await supabase.auth.signInWithPassword({ email, password });
  }}
  onRegisterSubmit={async ({ name, email, password }) => {
    await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
  }}
  onSendOtp={async (email) => {
    await supabase.auth.signInWithOtp({ email });
  }}
  onVerifyOtp={async (email, token) => {
    await supabase.auth.verifyOtp({ email, token, type: 'signup' });
  }}
/>`,
  },

  // ─── AI & TOOLS ──────────────────────────────────────────────────────────────
  {
    id: 'ai-chat',
    name: 'AIChat',
    description: 'Comprehensive AI chat interface with file upload, voice dictation, and media generation.',
    category: 'AI & Tools',
    icon: MessageSquare,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'AIChat.tsx', type: 'file', path: 'AIChat.tsx' },
      { name: 'hooks/useAIChat.ts', type: 'file', path: 'hooks/useAIChat.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'apiEndpoint', type: 'string', default: '"/api/chat"', description: 'The API route that receives messages and streams responses.' },
      { name: 'systemPrompt', type: 'string', description: 'System-level instructions prepended to every conversation.' },
      { name: 'className', type: 'string', description: 'Additional classes on the chat container.' },
    ],
    usage: `import { AIChat } from '@/ui/features/AIChat';

<AIChat
  apiEndpoint="/api/chat"
  systemPrompt="You are a helpful assistant."
/>`,
  },
  {
    id: 'ai-demo',
    name: 'AIDemo',
    description: 'Minimal prompt-response widget for quickly testing AI model integrations.',
    category: 'AI & Tools',
    icon: Sparkles,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'AIDemo.tsx', type: 'file', path: 'AIDemo.tsx' },
      { name: 'hooks/useAIDemo.ts', type: 'file', path: 'hooks/useAIDemo.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'apiEndpoint', type: 'string', default: '"/api/ai-demo"', description: 'API route for the demo prompt.' },
      { name: 'placeholder', type: 'string', default: '"Ask anything..."', description: 'Placeholder for the prompt input.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { AIDemo } from '@/ui/features/AIDemo';

<AIDemo
  apiEndpoint="/api/ai-demo"
  placeholder="Try asking a question..."
/>`,
  },
  {
    id: 'agent-voice-control',
    name: 'AgentVoiceControl',
    description: 'Voice-input and text-to-speech widget for AI agents using Web Speech API.',
    category: 'AI & Tools',
    icon: Mic,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'AgentVoiceControl.tsx', type: 'file', path: 'AgentVoiceControl.tsx' },
      { name: 'hooks/useAgentVoice.ts', type: 'file', path: 'hooks/useAgentVoice.ts' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'onTranscript', type: '(text: string) => void', description: 'Called with the recognised speech text.' },
      { name: 'speakText', type: 'string', description: 'Text to read aloud via TTS when provided.' },
      { name: 'lang', type: 'string', default: '"en-US"', description: 'BCP-47 language tag for speech recognition.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { AgentVoiceControl } from '@/ui/features/AgentVoiceControl';

const [reply, setReply] = useState('');

<AgentVoiceControl
  onTranscript={async (text) => {
    const res = await fetch('/api/chat', { body: JSON.stringify({ message: text }) });
    const data = await res.json();
    setReply(data.reply);
  }}
  speakText={reply}
/>`,
  },
  {
    id: 'pdf-processor',
    name: 'PDFProcessor',
    description: 'Autonomous PDF agent that extracts text and answers questions via AI.',
    category: 'AI & Tools',
    icon: FileText,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'PDFProcessor.tsx', type: 'file', path: 'PDFProcessor.tsx' },
      { name: 'hooks/usePDFProcessor.ts', type: 'file', path: 'hooks/usePDFProcessor.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'apiEndpoint', type: 'string', default: '"/api/pdf"', description: 'Route that receives the PDF and returns extracted text / answers.' },
      { name: 'maxFileSizeMb', type: 'number', default: '10', description: 'Maximum allowed PDF size in megabytes.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { PDFProcessor } from '@/ui/features/PDFProcessor';

<PDFProcessor
  apiEndpoint="/api/pdf"
  maxFileSizeMb={20}
/>`,
  },
  {
    id: 'scraper-service',
    name: 'ScraperService',
    description: 'Modular high-performance Python scraper with specialized extractors for News, Finance, and generic sites.',
    category: 'AI & Tools',
    icon: Globe,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'api/main.py', type: 'file', path: 'scraper-service/api/main.py' },
      { name: 'crawler/crawler.py', type: 'file', path: 'scraper-service/crawler/crawler.py' },
      { name: 'scrapers/', type: 'directory', path: 'scraper-service/scrapers/' },
      { name: 'utils/', type: 'directory', path: 'scraper-service/utils/' },
      { name: 'models/page_data.py', type: 'file', path: 'scraper-service/models/page_data.py' },
      { name: 'requirements.txt', type: 'file', path: 'scraper-service/requirements.txt' },
    ],
    props: [
      { name: 'targetUrl', type: 'string', required: true, description: 'The URL to scrape.' },
      { name: 'scraperType', type: '"generic" | "news" | "finance"', default: '"generic"', description: 'Selects the specialised extractor pipeline.' },
      { name: 'onResult', type: '(data: PageData) => void', description: 'Callback fired with the extracted page data.' },
      { name: 'apiBase', type: 'string', default: '"http://localhost:8000"', description: 'Base URL of the running Python scraper service.' },
    ],
    usage: `import { ScraperService } from '@/ui/features/ScraperService';

<ScraperService
  targetUrl="https://news.ycombinator.com"
  scraperType="news"
  onResult={(data) => console.log(data)}
/>`,
  },

  // ─── REAL-TIME ────────────────────────────────────────────────────────────────
  {
    id: 'team-chat',
    name: 'TeamChat',
    description: 'Real-time collaborative chat with group channels and instant message broadcasting.',
    category: 'Real-Time',
    icon: MessageSquare,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'TeamChat.tsx', type: 'file', path: 'TeamChat/TeamChat.tsx' },
      { name: 'lib/hooks/useTeamChat.ts', type: 'file', path: 'lib/hooks/useTeamChat.ts' },
      { name: 'lib/supabase.ts', type: 'file', path: 'lib/supabase.ts' },
    ],
    props: [
      { name: 'channelId', type: 'string', required: true, description: 'Supabase Realtime channel identifier.' },
      { name: 'userId', type: 'string', required: true, description: 'Current user ID used to attribute messages.' },
      { name: 'userName', type: 'string', required: true, description: 'Display name shown next to messages.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { TeamChat } from '@/ui/features/TeamChat';

<TeamChat
  channelId="room:general"
  userId={user.id}
  userName={user.name}
/>`,
  },
  {
    id: 'voice-comms',
    name: 'VoiceComms',
    description: 'High-fidelity WebRTC voice communication layer with P2P mesh networking and encryption.',
    category: 'Real-Time',
    icon: Mic,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'VoiceComms.tsx', type: 'file', path: 'VoiceComms/VoiceComms.tsx' },
      { name: 'PeerAudioPlayer.tsx', type: 'file', path: 'VoiceComms/PeerAudioPlayer.tsx' },
      { name: 'lib/hooks/useVoiceComms.ts', type: 'file', path: 'lib/hooks/useVoiceComms.ts' },
    ],
    props: [
      { name: 'roomId', type: 'string', required: true, description: 'Unique room identifier for the WebRTC session.' },
      { name: 'userId', type: 'string', required: true, description: 'Current user ID.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { VoiceComms } from '@/ui/features/VoiceComms';

<VoiceComms
  roomId="hackathon-room-1"
  userId={user.id}
/>`,
  },
  {
    id: 'presence-indicator',
    name: 'PresenceIndicator',
    description: 'Animated multi-user presence tracking with absolute status visualization and tooltips.',
    category: 'Real-Time',
    icon: User,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'PresenceIndicator.tsx', type: 'file', path: 'Collaboration/PresenceIndicator.tsx' },
      { name: 'lib/hooks/usePresence.ts', type: 'file', path: 'lib/hooks/usePresence.ts' },
    ],
    props: [
      { name: 'channelId', type: 'string', required: true, description: 'Supabase Realtime channel to broadcast presence on.' },
      { name: 'currentUser', type: '{ id: string; name: string; avatar?: string }', required: true, description: 'The local user joining the presence channel.' },
      { name: 'maxVisible', type: 'number', default: '5', description: 'Maximum avatars to show before a +N overflow badge.' },
    ],
    usage: `import { PresenceIndicator } from '@/ui/features/PresenceIndicator';

<PresenceIndicator
  channelId="document:abc123"
  currentUser={{ id: user.id, name: user.name }}
  maxVisible={4}
/>`,
  },
  {
    id: 'typing-indicator',
    name: 'TypingIndicator',
    description: 'Dynamic typing occupancy indicator with pulse animations and name clustering.',
    category: 'Real-Time',
    icon: MessageSquare,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'TypingIndicator.tsx', type: 'file', path: 'Collaboration/TypingIndicator.tsx' },
    ],
    props: [
      { name: 'typingUsers', type: 'string[]', required: true, description: 'Array of display names currently typing.' },
      { name: 'className', type: 'string', description: 'Additional classes.' },
    ],
    usage: `import { TypingIndicator } from '@/ui/features/TypingIndicator';

// From your real-time hook
const { typingUsers } = useTeamChat(channelId);

<TypingIndicator typingUsers={typingUsers} />`,
  },
  {
    id: 'realtime-cursor',
    name: 'RealtimeCursor',
    description: 'Infinite-canvas cursor tracking with spring physics and unique user coloring.',
    category: 'Real-Time',
    icon: MousePointer2,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'RealtimeCursor.tsx', type: 'file', path: 'Collaboration/RealtimeCursor.tsx' },
      { name: 'lib/hooks/useCursors.ts', type: 'file', path: 'lib/hooks/useCursors.ts' },
    ],
    props: [
      { name: 'channelId', type: 'string', required: true, description: 'Supabase Realtime channel for cursor positions.' },
      { name: 'userId', type: 'string', required: true, description: 'Local user ID.' },
      { name: 'userName', type: 'string', required: true, description: 'Display name shown next to cursor.' },
      { name: 'className', type: 'string', description: 'Class applied to the cursor canvas container.' },
    ],
    usage: `import { RealtimeCursor } from '@/ui/features/RealtimeCursor';

// Render over a relative-positioned container
<div className="relative w-full h-screen">
  <RealtimeCursor
    channelId="canvas:room1"
    userId={user.id}
    userName={user.name}
  />
  {/* your canvas content */}
</div>`,
  },
  {
    id: 'live-notifications',
    name: 'LiveNotifications',
    description: 'Global notification system for real-time broadcast events with priority styling.',
    category: 'Real-Time',
    icon: Sparkles,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'LiveNotifications.tsx', type: 'file', path: 'Collaboration/LiveNotifications.tsx' },
    ],
    props: [
      { name: 'channelId', type: 'string', required: true, description: 'Supabase Realtime channel to subscribe for notifications.' },
      { name: 'position', type: '"top-right" | "bottom-right" | "top-left" | "bottom-left"', default: '"top-right"', description: 'Corner where toasts appear.' },
      { name: 'maxVisible', type: 'number', default: '3', description: 'Max number of simultaneous notification toasts.' },
    ],
    usage: `import { LiveNotifications } from '@/ui/features/LiveNotifications';

// Mount once at the app level
<LiveNotifications channelId="global:alerts" position="top-right" />`,
  },
  {
    id: 'activity-feed',
    name: 'ActivityFeed',
    description: 'Live event stream with action-specific iconography and glassmorphism styling.',
    category: 'Real-Time',
    icon: Activity,
    difficulty: 'Simple',
    modularStructure: [
      { name: 'ActivityFeed.tsx', type: 'file', path: 'Collaboration/ActivityFeed.tsx' },
    ],
    props: [
      { name: 'channelId', type: 'string', required: true, description: 'Realtime channel supplying activity events.' },
      { name: 'maxItems', type: 'number', default: '20', description: 'Max number of events shown in the feed.' },
      { name: 'className', type: 'string', description: 'Additional classes on the feed container.' },
    ],
    usage: `import { ActivityFeed } from '@/ui/features/ActivityFeed';

<ActivityFeed
  channelId="project:abc123"
  maxItems={15}
/>`,
  },
  {
    id: 'collaborative-editor',
    name: 'CollaborativeEditor',
    description: 'Multi-user text synchronization with broadcast edit layers and typing presence.',
    category: 'Real-Time',
    icon: FileText,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'CollaborativeEditor.tsx', type: 'file', path: 'Collaboration/CollaborativeEditor.tsx' },
      { name: 'lib/hooks/useCollaborativeText.ts', type: 'file', path: 'lib/hooks/useCollaborativeText.ts' },
    ],
    props: [
      { name: 'documentId', type: 'string', required: true, description: 'Unique identifier for the shared document.' },
      { name: 'userId', type: 'string', required: true, description: 'Current editor user ID.' },
      { name: 'userName', type: 'string', required: true, description: 'Display name shown in the typing indicator.' },
      { name: 'initialContent', type: 'string', default: '""', description: 'Initial text content to seed the editor.' },
      { name: 'onSave', type: '(content: string) => void', description: 'Called when the user explicitly saves.' },
    ],
    usage: `import { CollaborativeEditor } from '@/ui/features/CollaborativeEditor';

<CollaborativeEditor
  documentId="doc:abc123"
  userId={user.id}
  userName={user.name}
  initialContent="Start writing here..."
  onSave={(text) => saveToDatabase(text)}
/>`,
  },
  {
    id: 'theme-customizer',
    name: 'ThemeCustomizer',
    description: 'Real-time theme engine for controlling HSL colors, typography, and custom theme generation.',
    category: 'AI & Tools',
    icon: Palette,
    difficulty: 'Advanced',
    modularStructure: [
      { name: 'ThemeCustomizer.tsx', type: 'file', path: 'ThemeCustomizer.tsx' },
      { name: 'useThemeEngine.ts', type: 'file', path: 'useThemeEngine.ts' },
      { name: 'typography/', type: 'directory', path: 'typography/' },
      { name: 'colors/', type: 'directory', path: 'colors/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the customizer panel starts open.' },
      { name: 'className', type: 'string', description: 'Additional classes on the panel container.' },
    ],
    usage: `import { ThemeCustomizer } from '@/ui';

// Mount once in your root layout — it adds a floating trigger button
<ThemeCustomizer />`,
  },

  // ─── SEARCH & DATA ────────────────────────────────────────────────────────────
  {
    id: 'search-bar',
    name: 'SearchBar',
    description: 'Command-palette search with fuzzy matching, keyboard navigation, and category grouping.',
    category: 'Search & Data',
    icon: Search,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'SearchBar.tsx', type: 'file', path: 'SearchBar.tsx' },
      { name: 'hooks/useSearch.ts', type: 'file', path: 'hooks/useSearch.ts' },
      { name: 'components/', type: 'directory', path: 'components/' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'onItemSelect', type: '(item: Item) => void', description: 'Called when the user selects a result.' },
      { name: 'placeholder', type: 'string', default: '"Search components..."', description: 'Placeholder shown in the trigger button.' },
      { name: 'maxResults', type: 'number', default: '8', description: 'Maximum number of fuzzy results to display.' },
    ],
    usage: `import { SearchBar } from '@/ui/features/SearchBar';

// Drop anywhere — trigger button + ⌘K shortcut included
<SearchBar
  placeholder="Search docs..."
  onItemSelect={(item) => router.push(item.href)}
  maxResults={6}
/>`,
  },

  // ─── PAYMENT ─────────────────────────────────────────────────────────────────
  {
    id: 'razorpay-button',
    name: 'RazorpayButton',
    description: 'One-click Razorpay payment button with server-side order creation and signature verification.',
    category: 'Payment',
    icon: CreditCard,
    difficulty: 'Modular',
    modularStructure: [
      { name: 'RazorpayButton.tsx', type: 'file', path: 'RazorpayButton.tsx' },
      { name: 'hooks/useRazorpay.ts', type: 'file', path: 'hooks/useRazorpay.ts' },
      { name: 'index.ts', type: 'file', path: 'index.ts' },
    ],
    props: [
      { name: 'amount', type: 'number', required: true, description: 'Amount in smallest currency unit (paise for INR).' },
      { name: 'currency', type: 'string', default: '"INR"', description: 'ISO 4217 currency code.' },
      { name: 'name', type: 'string', required: true, description: 'Business / product name shown in the Razorpay modal.' },
      { name: 'description', type: 'string', description: 'Short description of the purchase.' },
      { name: 'onSuccess', type: '(paymentId: string) => void', description: 'Called after successful payment verification.' },
      { name: 'onError', type: '(error: Error) => void', description: 'Called if payment fails.' },
      { name: 'className', type: 'string', description: 'Additional classes on the button.' },
    ],
    usage: `import { RazorpayButton } from '@/ui/features/RazorpayButton';

<RazorpayButton
  amount={49900}
  currency="INR"
  name="Hackathon Kit"
  description="Lifetime access"
  onSuccess={(id) => toast.success('Payment successful! ID: ' + id)}
  onError={(err) => toast.error(err.message)}
/>`,
  },
];
