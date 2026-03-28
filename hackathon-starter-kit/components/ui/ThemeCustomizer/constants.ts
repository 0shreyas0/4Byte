import { Theme, AccentColor, TypographyPreset } from './types';

export const FONTS: TypographyPreset[] = [
  { 
    id: 'jakarta',
    name: 'Sans', 
    family: 'var(--font-jakarta)', 
    label: 'Plus Jakarta',
    config: {
      ls: '-0.025em',
      fw: { heading: '800', action: '700' },
      fs: { h1: '6rem' }
    }
  },
  { 
    id: 'inter',
    name: 'Modern', 
    family: 'var(--font-inter)', 
    label: 'Inter',
    config: {
      ls: '-0.011em',
      fw: { heading: '600', action: '500', body: '400' },
      fs: { h1: '5rem', base: '0.95rem' }
    }
  },
  { 
    id: 'outfit',
    name: 'Outfit', 
    family: 'var(--font-outfit)', 
    label: 'Outfit',
    config: {
      ls: '0.01em',
      fw: { heading: '900', action: '600' },
      fs: { h1: '7rem', h2: '3.5rem' }
    }
  },
  { 
    id: 'lora',
    name: 'Serif', 
    family: 'var(--font-lora)', 
    label: 'Lora',
    config: {
      ls: '0.02em',
      lh: '1.7',
      fw: { heading: '500', action: '600', body: '400' },
      fs: { h1: '4rem', h2: '2.5rem' }
    }
  },
  { 
    id: 'mono',
    name: 'Mono', 
    family: 'var(--font-space-mono)', 
    label: 'Space Mono',
    config: {
      fs: { h1: '4.5rem', h2: '2.5rem', base: '0.9rem', sm: '0.8rem' },
      ls: '-0.03em',
      fw: { heading: '700', action: '700' }
    }
  },
];

export const COLORS: AccentColor[] = [
  { name: 'Default', value: '#2563eb', label: 'bg-blue-600' },
  { name: 'Sunset', value: '#f97316', label: 'bg-orange-500' },
  { name: 'Emerald', value: '#10b981', label: 'bg-emerald-500' },
  { name: 'Ocean', value: '#0891b2', label: 'bg-cyan-600' },
  { name: 'Royal', value: '#7c3aed', label: 'bg-violet-600' },
  { name: 'Candy', value: '#db2777', label: 'bg-pink-600' },
  { name: 'Cyber', value: '#d946ef', label: 'bg-fuchsia-500' },
  { name: 'Lime', value: '#84cc16', label: 'bg-lime-500' },
  { name: 'Sky', value: '#0ea5e9', label: 'bg-sky-500' },
  { name: 'Fire', value: '#dc2626', label: 'bg-red-600' },
  { name: 'Gold', value: '#eab308', label: 'bg-yellow-500' },
  { name: 'Zinc', value: '#3f3f46', label: 'bg-zinc-600' },
];

export const APP_THEMES: Theme[] = [
  { 
    id: 'classic', 
    name: 'Classic', 
    modes: {
      light: {
        background: '#fafafa',
        foreground: '#09090b',
        primary: '#2563eb',
        card: '#ffffff',
        border: '#e4e4e7',
        popover: '#ffffff',
        muted: '#f4f4f5',
        secondary: '#f1f5f9',
        accent: '#dbe7ff'
      },
      dark: { 
        background: '#050507', 
        foreground: '#f2f2f3', 
        primary: '#3b82f6',
        card: '#09090c', 
        border: '#1c1c24',
        popover: '#09090c',
        muted: '#111116',
        secondary: '#111116',
        accent: '#1f2d45'
      }
    }
  },
  { 
    id: 'tokyo', 
    name: 'Tokyo Night', 
    modes: {
      light: {
        background: '#d5d6db',
        foreground: '#343b58',
        primary: '#3d59a1',
        card: '#e1e2e7',
        border: '#9699a3',
        popover: '#e1e2e7',
        muted: '#c0caf5',
        secondary: '#c0caf5',
        accent: '#0f4b6e'
      },
      dark: { 
        background: '#1a1b26', 
        foreground: '#c0caf5', 
        primary: '#7aa2f7',
        card: '#24283b', 
        border: '#414868',
        popover: '#24283b',
        muted: '#16161e',
        secondary: '#16161e',
        accent: '#7dcfff'
      }
    }
  },
  { 
    id: 'gruvbox', 
    name: 'Gruvbox', 
    modes: {
      light: {
        background: '#fbf1c7',
        foreground: '#3c3836',
        primary: '#458588',
        card: '#ebdbb2',
        border: '#d5c4a1',
        popover: '#ebdbb2',
        muted: '#f2e5bc',
        secondary: '#f2e5bc',
        accent: '#d65d0e'
      },
      dark: { 
        background: '#1d2021', 
        foreground: '#ebdbb2', 
        primary: '#83a598',
        card: '#282828', 
        border: '#3c3836',
        popover: '#282828',
        muted: '#32302f',
        secondary: '#32302f',
        accent: '#fe8019'
      }
    }
  },
  { 
    id: 'velvet', 
    name: 'Velvet', 
    modes: {
      light: {
        background: '#faf4ed',
        foreground: '#575279',
        primary: '#907aa9',
        card: '#fffaf3',
        border: '#dfdad9',
        popover: '#fffaf3',
        muted: '#f2e9e1',
        secondary: '#f2e9e1',
        accent: '#db006e'
      },
      dark: { 
        background: '#0f0d15', 
        foreground: '#e0def4', 
        primary: '#c4a7e7',
        card: '#16141f', 
        border: '#26233a',
        popover: '#16141f',
        muted: '#1f1d2e',
        secondary: '#1f1d2e',
        accent: '#ff80bf'
      }
    }
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    modes: {
      light: {
        background: '#f2f5f2',
        foreground: '#1a1c1a',
        primary: '#2d5a27',
        card: '#ffffff',
        border: '#d1d9d1',
        popover: '#ffffff',
        muted: '#e8ede8',
        secondary: '#e8ede8',
        accent: '#3b7f4a'
      },
      dark: { 
        background: '#0a0c0a', 
        foreground: '#e8ede8', 
        primary: '#4a7c44',
        card: '#121412', 
        border: '#1e211e',
        popover: '#121412',
        muted: '#161d16',
        secondary: '#161d16',
        accent: '#61d29d'
      }
    }
  },
  { 
    id: 'amoled', 
    name: 'AMOLED', 
    modes: {
      light: {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#000000',
        card: '#ffffff',
        border: '#e5e5e5',
        popover: '#ffffff',
        muted: '#f5f5f5',
        secondary: '#f5f5f5',
        accent: '#000000'
      },
      dark: { 
        background: '#000000', 
        foreground: '#ffffff', 
        primary: '#ffffff',
        card: '#080808', 
        border: '#121212',
        popover: '#080808',
        muted: '#0f0f0f',
        secondary: '#0f0f0f',
        accent: '#ffffff'
      }
    }
  }
];
