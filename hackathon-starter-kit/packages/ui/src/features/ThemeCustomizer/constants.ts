import { Theme, AccentColor, TypographyPreset } from './types';

export const FONTS: TypographyPreset[] = [
  // ─── Sans-serif (preloaded via Next.js) ─────────────────────────────────────
  {
    id: 'jakarta', name: 'Jakarta', label: 'Plus Jakarta Sans', category: 'sans',
    family: 'var(--font-jakarta)',
    familyHeading: 'var(--font-jakarta)', familyBody: 'var(--font-jakarta)', familyAction: 'var(--font-jakarta)',
    config: { ls: '-0.025em', fw: { heading: '800', action: '700' }, fs: { h1: '6rem' } }
  },
  {
    id: 'inter', name: 'Inter', label: 'Inter', category: 'sans',
    family: 'var(--font-inter)',
    familyHeading: 'var(--font-outfit)', familyBody: 'var(--font-inter)', familyAction: 'var(--font-inter)',
    config: { ls: '-0.011em', fw: { heading: '600', action: '500', body: '400' }, fs: { h1: '5rem', base: '0.95rem' } }
  },
  {
    id: 'outfit', name: 'Outfit', label: 'Outfit', category: 'sans',
    family: 'var(--font-outfit)',
    familyHeading: 'var(--font-outfit)', familyBody: 'var(--font-jakarta)', familyAction: 'var(--font-outfit)',
    config: { ls: '0.01em', fw: { heading: '900', action: '600' }, fs: { h1: '7rem', h2: '3.5rem' } }
  },
  // ─── Sans-serif (dynamic Google Fonts) ──────────────────────────────────────
  {
    id: 'poppins', name: 'Poppins', label: 'Poppins', category: 'sans',
    family: "'Poppins', sans-serif", googleFont: 'Poppins',
    config: { ls: '-0.01em', fw: { heading: '700', action: '600' } }
  },
  {
    id: 'dm-sans', name: 'DM Sans', label: 'DM Sans', category: 'sans',
    family: "'DM Sans', sans-serif", googleFont: 'DM+Sans',
    config: { fw: { heading: '700', action: '500' } }
  },
  {
    id: 'nunito', name: 'Nunito', label: 'Nunito', category: 'sans',
    family: "'Nunito', sans-serif", googleFont: 'Nunito',
    config: { fw: { heading: '800', action: '700' }, fs: { h1: '5.5rem' } }
  },
  {
    id: 'raleway', name: 'Raleway', label: 'Raleway', category: 'sans',
    family: "'Raleway', sans-serif", googleFont: 'Raleway',
    config: { ls: '0.02em', fw: { heading: '700', action: '600' } }
  },
  {
    id: 'sora', name: 'Sora', label: 'Sora', category: 'sans',
    family: "'Sora', sans-serif", googleFont: 'Sora',
    config: { fw: { heading: '700', action: '600' } }
  },
  {
    id: 'figtree', name: 'Figtree', label: 'Figtree', category: 'sans',
    family: "'Figtree', sans-serif", googleFont: 'Figtree',
    config: { fw: { heading: '800', action: '600' } }
  },
  // ─── Serif ──────────────────────────────────────────────────────────────────
  {
    id: 'lora', name: 'Lora', label: 'Lora', category: 'serif',
    family: 'var(--font-lora)',
    familyHeading: 'var(--font-lora)', familyBody: 'var(--font-jakarta)', familyAction: 'var(--font-outfit)',
    config: { ls: '0.02em', lh: '1.7', fw: { heading: '500', action: '600', body: '400' }, fs: { h1: '4rem', h2: '2.5rem' } }
  },
  {
    id: 'playfair', name: 'Playfair', label: 'Playfair Display', category: 'serif',
    family: "'Playfair Display', serif", googleFont: 'Playfair+Display',
    config: { ls: '0.01em', lh: '1.3', fw: { heading: '700' }, fs: { h1: '4.5rem', h2: '2.5rem' } }
  },
  {
    id: 'merriweather', name: 'Merriweather', label: 'Merriweather', category: 'serif',
    family: "'Merriweather', serif", googleFont: 'Merriweather',
    config: { lh: '1.7', fw: { heading: '700', body: '300' }, fs: { h1: '4rem' } }
  },
  {
    id: 'cormorant', name: 'Cormorant', label: 'Cormorant Garamond', category: 'serif',
    family: "'Cormorant Garamond', serif", googleFont: 'Cormorant+Garamond',
    config: { ls: '0.03em', lh: '1.5', fw: { heading: '600' }, fs: { h1: '5.5rem', h2: '3rem' } }
  },
  // ─── Monospace ───────────────────────────────────────────────────────────────
  {
    id: 'mono', name: 'Space Mono', label: 'Space Mono', category: 'mono',
    family: 'var(--font-space-mono)',
    familyHeading: 'var(--font-space-mono)', familyBody: 'var(--font-space-mono)', familyAction: 'var(--font-space-mono)',
    config: { fs: { h1: '4.5rem', h2: '2.5rem', base: '0.9rem', sm: '0.8rem' }, ls: '-0.03em', fw: { heading: '700', action: '700' } }
  },
  {
    id: 'jetbrains', name: 'JetBrains', label: 'JetBrains Mono', category: 'mono',
    family: "'JetBrains Mono', monospace", googleFont: 'JetBrains+Mono',
    config: { ls: '-0.02em', fw: { heading: '700', action: '500' } }
  },
  {
    id: 'fira-code', name: 'Fira Code', label: 'Fira Code', category: 'mono',
    family: "'Fira Code', monospace", googleFont: 'Fira+Code',
    config: { ls: '0.01em', fw: { heading: '600' } }
  },
  {
    id: 'ibm-plex', name: 'IBM Plex', label: 'IBM Plex Mono', category: 'mono',
    family: "'IBM Plex Mono', monospace", googleFont: 'IBM+Plex+Mono',
    config: { fw: { heading: '700', action: '500' } }
  },
  // ─── Display ────────────────────────────────────────────────────────────────
  {
    id: 'space-grotesk', name: 'Space Grotesk', label: 'Space Grotesk', category: 'display',
    family: "'Space Grotesk', sans-serif", googleFont: 'Space+Grotesk',
    config: { ls: '-0.03em', fw: { heading: '700', action: '600' }, fs: { h1: '6.5rem' } }
  },
  {
    id: 'dm-serif', name: 'DM Serif', label: 'DM Serif Display', category: 'display',
    family: "'DM Serif Display', serif", googleFont: 'DM+Serif+Display',
    config: { ls: '0.01em', lh: '1.2', fw: { heading: '400' }, fs: { h1: '5rem' } }
  },
  {
    id: 'bebas', name: 'Bebas Neue', label: 'Bebas Neue', category: 'display',
    family: "'Bebas Neue', display", googleFont: 'Bebas+Neue',
    config: { ls: '0.08em', fw: { heading: '400' }, fs: { h1: '8rem', h2: '4rem' } }
  },
];

export const COLORS: AccentColor[] = [
  { name: 'Blue',    value: '#2563eb', label: 'bg-blue-600' },
  { name: 'Sunset',  value: '#f97316', label: 'bg-orange-500' },
  { name: 'Emerald', value: '#10b981', label: 'bg-emerald-500' },
  { name: 'Ocean',   value: '#0891b2', label: 'bg-cyan-600' },
  { name: 'Royal',   value: '#7c3aed', label: 'bg-violet-600' },
  { name: 'Candy',   value: '#db2777', label: 'bg-pink-600' },
  { name: 'Cyber',   value: '#d946ef', label: 'bg-fuchsia-500' },
  { name: 'Lime',    value: '#84cc16', label: 'bg-lime-500' },
  { name: 'Sky',     value: '#0ea5e9', label: 'bg-sky-500' },
  { name: 'Fire',    value: '#dc2626', label: 'bg-red-600' },
  { name: 'Gold',    value: '#eab308', label: 'bg-yellow-500' },
  { name: 'Zinc',    value: '#3f3f46', label: 'bg-zinc-600' },
];

export const APP_THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    modes: {
      light: {
        background: '#fafafa', foreground: '#09090b', primary: '#2563eb',
        card: '#ffffff', border: '#e4e4e7', popover: '#ffffff',
        muted: '#f4f4f5', secondary: '#f1f5f9', accent: '#dbe7ff'
      },
      dark: {
        background: '#050507', foreground: '#f2f2f3', primary: '#3b82f6',
        card: '#09090c', border: '#1c1c24', popover: '#09090c',
        muted: '#111116', secondary: '#111116', accent: '#1f2d45'
      }
    }
  },
  {
    id: 'tokyo',
    name: 'Tokyo Night',
    modes: {
      light: {
        background: '#d5d6db', foreground: '#343b58', primary: '#3d59a1',
        card: '#e1e2e7', border: '#9699a3', popover: '#e1e2e7',
        muted: '#c0caf5', secondary: '#c0caf5', accent: '#0f4b6e'
      },
      dark: {
        background: '#1a1b26', foreground: '#c0caf5', primary: '#7aa2f7',
        card: '#24283b', border: '#414868', popover: '#24283b',
        muted: '#16161e', secondary: '#16161e', accent: '#7dcfff'
      }
    },
    typography: { headingFont: 'space-grotesk', bodyFont: 'inter', actionFont: 'inter' }
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    modes: {
      light: {
        background: '#fbf1c7', foreground: '#3c3836', primary: '#458588',
        card: '#ebdbb2', border: '#d5c4a1', popover: '#ebdbb2',
        muted: '#f2e5bc', secondary: '#f2e5bc', accent: '#d65d0e'
      },
      dark: {
        background: '#1d2021', foreground: '#ebdbb2', primary: '#83a598',
        card: '#282828', border: '#3c3836', popover: '#282828',
        muted: '#32302f', secondary: '#32302f', accent: '#fe8019'
      }
    },
    typography: { headingFont: 'jetbrains', bodyFont: 'merriweather', actionFont: 'mono' }
  },
  {
    id: 'velvet',
    name: 'Velvet',
    modes: {
      light: {
        background: '#faf4ed', foreground: '#575279', primary: '#907aa9',
        card: '#fffaf3', border: '#dfdad9', popover: '#fffaf3',
        muted: '#f2e9e1', secondary: '#f2e9e1', accent: '#db006e'
      },
      dark: {
        background: '#0f0d15', foreground: '#e0def4', primary: '#c4a7e7',
        card: '#16141f', border: '#26233a', popover: '#16141f',
        muted: '#1f1d2e', secondary: '#1f1d2e', accent: '#ff80bf'
      }
    },
    typography: { headingFont: 'cormorant', bodyFont: 'lora', actionFont: 'outfit' }
  },
  {
    id: 'forest',
    name: 'Forest',
    modes: {
      light: {
        background: '#f2f5f2', foreground: '#1a1c1a', primary: '#2d5a27',
        card: '#ffffff', border: '#d1d9d1', popover: '#ffffff',
        muted: '#e8ede8', secondary: '#e8ede8', accent: '#3b7f4a'
      },
      dark: {
        background: '#0a0c0a', foreground: '#e8ede8', primary: '#4a7c44',
        card: '#121412', border: '#1e211e', popover: '#121412',
        muted: '#161d16', secondary: '#161d16', accent: '#61d29d'
      }
    },
    typography: { headingFont: 'jakarta', bodyFont: 'inter', actionFont: 'inter' }
  },
  {
    id: 'amoled',
    name: 'AMOLED',
    modes: {
      light: {
        background: '#ffffff', foreground: '#000000', primary: '#000000',
        card: '#ffffff', border: '#e5e5e5', popover: '#ffffff',
        muted: '#f5f5f5', secondary: '#f5f5f5', accent: '#000000'
      },
      dark: {
        background: '#000000', foreground: '#ffffff', primary: '#ffffff',
        card: '#080808', border: '#121212', popover: '#080808',
        muted: '#0f0f0f', secondary: '#0f0f0f', accent: '#ffffff'
      }
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    modes: {
      light: {
        background: '#eceff4', foreground: '#2e3440', primary: '#5e81ac',
        card: '#e5e9f0', border: '#d8dee9', popover: '#e5e9f0',
        muted: '#e5e9f0', secondary: '#d8dee9', accent: '#88c0d0'
      },
      dark: {
        background: '#2e3440', foreground: '#d8dee9', primary: '#88c0d0',
        card: '#3b4252', border: '#4c566a', popover: '#3b4252',
        muted: '#434c5e', secondary: '#434c5e', accent: '#88c0d0'
      }
    },
    typography: { headingFont: 'sora', bodyFont: 'inter', actionFont: 'inter' }
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    modes: {
      light: {
        background: '#eff1f5', foreground: '#4c4f69', primary: '#1e66f5',
        card: '#e6e9ef', border: '#ccd0da', popover: '#e6e9ef',
        muted: '#dce0e8', secondary: '#ccd0da', accent: '#2a6ef5'
      },
      dark: {
        background: '#1e1e2e', foreground: '#cdd6f4', primary: '#89b4fa',
        card: '#313244', border: '#45475a', popover: '#313244',
        muted: '#181825', secondary: '#181825', accent: '#7287fd'
      }
    },
    typography: { headingFont: 'nunito', bodyFont: 'inter', actionFont: 'inter' }
  },
];
