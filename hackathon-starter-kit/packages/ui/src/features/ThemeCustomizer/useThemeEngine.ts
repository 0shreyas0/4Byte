'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { APP_THEMES, FONTS } from './constants';
import { Theme } from './types';
import { toast } from 'sonner';

export function useThemeEngine() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeColor, setActiveColor] = useState('#2563eb');
  const [activeTheme, setActiveTheme] = useState('classic');
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [tempGeneratedTheme, setTempGeneratedTheme] = useState<Theme | null>(null);
  const [activeVar, setActiveVar] = useState<string>('primary');
  const [activeFont, setActiveFont] = useState<string>('jakarta');
  const [headingFont, setHeadingFont] = useState<string>('jakarta');
  const [bodyFont, setBodyFont] = useState<string>('jakarta');
  const [actionFont, setActionFont] = useState<string>('jakarta');
  // Per-role weight (font-weight value: 100-900)
  const [headingWeight, setHeadingWeight] = useState<number>(700);
  const [bodyWeight, setBodyWeight] = useState<number>(400);
  const [actionWeight, setActionWeight] = useState<number>(600);
  // Per-role size scale (% of baseline: 70-140)
  const [headingSize, setHeadingSize] = useState<number>(100);
  const [bodySize, setBodySize] = useState<number>(100);
  const [actionSize, setActionSize] = useState<number>(100);
  // Global UI Radius (px: 0-24)
  const [globalRadius, setGlobalRadius] = useState<number>(12);
  
  const currentMode = (resolvedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  const allThemes = [...APP_THEMES, ...customThemes];

  // Reactive App Theme & Colors Application
  useEffect(() => {
    if (!mounted) return;

    let themeData = allThemes.find(t => t.id === activeTheme);
    if (activeTheme === 'custom-coolors' && tempGeneratedTheme) {
      themeData = tempGeneratedTheme;
    }

    if (!themeData) return;
    
    const colors = themeData.modes[currentMode];
    if (!colors) return;

    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });

    if (colors.primary && activeTheme !== 'custom-coolors') {
      setActiveColor(colors.primary as string);
    }

    // Apply bundled typography if the theme defines it
    if (themeData.typography) {
      const { headingFont, bodyFont, actionFont } = themeData.typography;
      if (headingFont) { setHeadingFont(headingFont); localStorage.setItem('pref-font-heading', headingFont); }
      if (bodyFont)    { setBodyFont(bodyFont);        localStorage.setItem('pref-font-body', bodyFont);    }
      if (actionFont)  { setActionFont(actionFont);    localStorage.setItem('pref-font-action', actionFont); }
    }
  }, [activeTheme, currentMode, mounted, tempGeneratedTheme, allThemes]);

  // Reactive Typography Application for scale / weights
  useEffect(() => {
    if (!mounted) return;

    const preset = FONTS.find(f => f.id === activeFont);
    if (!preset) return;

    const root = document.documentElement;
    // The semantic sizing lists (expanded to include 2xs-5xs)
    const sizes = ['h1', 'h2', 'h3', 'base', 'sm', 'xs', '2xs', '3xs', '4xs', '5xs'];
    sizes.forEach(size => root.style.removeProperty(`--fs-${size}`));
    if (preset.config.fs) {
      Object.entries(preset.config.fs).forEach(([size, val]) => {
        root.style.setProperty(`--fs-${size}`, val as string);
      });
    }

    // The semantic weight lists
    const weights = ['heading', 'body', 'action'];
    weights.forEach(weight => root.style.removeProperty(`--fw-${weight}`));
    if (preset.config.fw) {
      Object.entries(preset.config.fw).forEach(([weight, val]) => {
        root.style.setProperty(`--fw-${weight}`, val as string);
      });
    }

    // Spacing and Line Heights
    if (preset.config.ls) {
      root.style.setProperty('--ls-heading', preset.config.ls);
    } else {
      root.style.removeProperty('--ls-heading');
    }

    if (preset.config.lh) {
      root.style.setProperty('--lh-heading', preset.config.lh);
    } else {
      root.style.removeProperty('--lh-heading');
    }
  }, [activeFont, mounted]);

  // Reactive: apply font-family for each role directly to html element
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const headingPreset = FONTS.find(f => f.id === headingFont);
    const bodyPreset    = FONTS.find(f => f.id === bodyFont);
    const actionPreset  = FONTS.find(f => f.id === actionFont);
    if (headingPreset) root.style.setProperty('--font-heading', headingPreset.familyHeading ?? headingPreset.family);
    if (bodyPreset)    root.style.setProperty('--font-body',    bodyPreset.familyBody    ?? bodyPreset.family);
    if (actionPreset)  root.style.setProperty('--font-action',  actionPreset.familyAction ?? actionPreset.family);
  }, [headingFont, bodyFont, actionFont, mounted]);

  // Reactive: apply per-role weight
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty('--fw-heading', String(headingWeight));
    root.style.setProperty('--fw-body',    String(bodyWeight));
    root.style.setProperty('--fw-action',  String(actionWeight));
  }, [headingWeight, bodyWeight, actionWeight, mounted]);

  // Reactive: apply per-role size
  // Heading baseline = 6rem (h1), Body baseline = 1rem, Action baseline = 0.875rem
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty('--fs-h1',     `${(headingSize / 100) * 6}rem`);
    root.style.setProperty('--fs-h2',     `${(headingSize / 100) * 3}rem`);
    root.style.setProperty('--fs-h3',     `${(headingSize / 100) * 1.5}rem`);
    root.style.setProperty('--fs-base',   `${(bodySize    / 100) * 1}rem`);
    root.style.setProperty('--fs-action', `${(actionSize  / 100) * 0.875}rem`);
  }, [headingSize, bodySize, actionSize, mounted]);

  // Reactive: apply global radius
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--radius', `${globalRadius}px`);
  }, [globalRadius, mounted]);

  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem('pref-primary-color');
    const savedTheme = localStorage.getItem('pref-app-theme');
    const savedCustomThemes = localStorage.getItem('pref-custom-themes');
    const savedFont = localStorage.getItem('pref-app-font');
    const savedHeadingFont = localStorage.getItem('pref-font-heading');
    const savedBodyFont = localStorage.getItem('pref-font-body');
    const savedActionFont = localStorage.getItem('pref-font-action');
    
    const savedHeadingWeight = localStorage.getItem('pref-fw-heading');
    const savedBodyWeight    = localStorage.getItem('pref-fw-body');
    const savedActionWeight  = localStorage.getItem('pref-fw-action');
    const savedHeadingSize   = localStorage.getItem('pref-fs-heading');
    const savedBodySize      = localStorage.getItem('pref-fs-body');
    const savedActionSize    = localStorage.getItem('pref-fs-action');
    const savedRadius        = localStorage.getItem('pref-ui-radius');

    if (savedColor) {
      setActiveColor(savedColor);
      document.documentElement.style.setProperty('--primary', savedColor);
    }
    if (savedTheme) setActiveTheme(savedTheme);
    if (savedFont) setActiveFont(savedFont);
    if (savedHeadingFont) setHeadingFont(savedHeadingFont);
    if (savedBodyFont)    setBodyFont(savedBodyFont);
    if (savedActionFont)  setActionFont(savedActionFont);
    if (savedHeadingWeight) setHeadingWeight(Number(savedHeadingWeight));
    if (savedBodyWeight)    setBodyWeight(Number(savedBodyWeight));
    if (savedActionWeight)  setActionWeight(Number(savedActionWeight));
    if (savedHeadingSize)   setHeadingSize(Number(savedHeadingSize));
    if (savedBodySize)      setBodySize(Number(savedBodySize));
    if (savedActionSize)    setActionSize(Number(savedActionSize));
    if (savedRadius)        setGlobalRadius(Number(savedRadius));
    if (savedCustomThemes) setCustomThemes(JSON.parse(savedCustomThemes));
  }, []);

  const handleThemeChange = (id: string) => {
    setActiveTheme(id);
    localStorage.setItem('pref-app-theme', id);
    const themeName = allThemes.find(t => t.id === id)?.name || 'Theme';
    toast.success(`${themeName} applied`);
  };

  const handleColorChange = (color: string) => {
    setIsPartyMode(false);
    if (activeVar === 'primary') {
      setActiveColor(color);
      localStorage.setItem('pref-primary-color', color);
    }
    document.documentElement.style.setProperty(`--${activeVar}`, color);
    setActiveTheme('custom-coolors');
  };

  const handleRandomColor = () => {
    setIsPartyMode(false);
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    handleColorChange(randomColor);
  };

  const handleFontChange = (id: string) => {
    const preset = FONTS.find(f => f.id === id);
    if (!preset) return;
    setActiveFont(id);
    localStorage.setItem('pref-app-font', id);
  };

  /** Inject a Google Fonts <link> tag on first use */
  const loadGoogleFont = (googleFont: string) => {
    const id = `gfont-${googleFont}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleFont}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  };

  const handleHeadingFontChange = (id: string) => {
    const preset = FONTS.find(f => f.id === id);
    if (preset?.googleFont) loadGoogleFont(preset.googleFont);
    setHeadingFont(id);
    localStorage.setItem('pref-font-heading', id);
    // Sync weight from preset default
    if (preset?.config.fw?.heading) {
      const w = parseInt(preset.config.fw.heading);
      setHeadingWeight(w);
      localStorage.setItem('pref-fw-heading', String(w));
    }
    toast.success(`Headings → ${preset?.label ?? id}`);
    setActiveFont(id);
    localStorage.setItem('pref-app-font', id);
  };

  const handleBodyFontChange = (id: string) => {
    const preset = FONTS.find(f => f.id === id);
    if (preset?.googleFont) loadGoogleFont(preset.googleFont);
    setBodyFont(id);
    localStorage.setItem('pref-font-body', id);
    if (preset?.config.fw?.body) {
      const w = parseInt(preset.config.fw.body);
      setBodyWeight(w);
      localStorage.setItem('pref-fw-body', String(w));
    }
    toast.success(`Body → ${preset?.label ?? id}`);
  };

  const handleActionFontChange = (id: string) => {
    const preset = FONTS.find(f => f.id === id);
    if (preset?.googleFont) loadGoogleFont(preset.googleFont);
    setActionFont(id);
    localStorage.setItem('pref-font-action', id);
    if (preset?.config.fw?.action) {
      const w = parseInt(preset.config.fw.action);
      setActionWeight(w);
      localStorage.setItem('pref-fw-action', String(w));
    }
    toast.success(`UI & Actions → ${preset?.label ?? id}`);
  };

  const handleHeadingWeightChange = (w: number) => { setHeadingWeight(w); localStorage.setItem('pref-fw-heading', String(w)); };
  const handleBodyWeightChange    = (w: number) => { setBodyWeight(w);    localStorage.setItem('pref-fw-body',    String(w)); };
  const handleActionWeightChange  = (w: number) => { setActionWeight(w);  localStorage.setItem('pref-fw-action',  String(w)); };
  const handleHeadingSizeChange   = (s: number) => { setHeadingSize(s);   localStorage.setItem('pref-fs-heading', String(s)); };
  const handleBodySizeChange      = (s: number) => { setBodySize(s);      localStorage.setItem('pref-fs-body',    String(s)); };
  const handleActionSizeChange    = (s: number) => { setActionSize(s);    localStorage.setItem('pref-fs-action',  String(s)); };
  
  const handleRadiusChange = (r: number) => {
    setGlobalRadius(r);
    localStorage.setItem('pref-ui-radius', String(r));
  };

  const handleCoolorsMode = () => {
    setIsPartyMode(false);
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 45 + Math.random() * 35;
    
    const secondaryHue = (baseHue + 180) % 360;
    const accentHue = (baseHue + 30) % 360;

    const generateModeColors = (mode: 'light' | 'dark') => {
      const isDark = mode === 'dark';
      return {
        background: isDark ? `hsl(${baseHue}, 15%, 4%)` : `hsl(${baseHue}, 15%, 98%)`,
        foreground: isDark ? `hsl(${baseHue}, 10%, 95%)` : `hsl(${baseHue}, 10%, 10%)`,
        primary: `hsl(${baseHue}, ${saturation}%, 55%)`,
        card: isDark ? `hsl(${baseHue}, 12%, 7%)` : `hsl(${baseHue}, 12%, 99%)`,
        border: isDark ? `hsl(${baseHue}, 10%, 14%)` : `hsl(${baseHue}, 10%, 88%)`,
        muted: isDark ? `hsl(${baseHue}, 10%, 10%)` : `hsl(${baseHue}, 10%, 94%)`,
        secondary: `hsl(${secondaryHue}, 20%, ${isDark ? '15%' : '90%'})`,
        accent: `hsl(${accentHue}, 60%, ${isDark ? '40%' : '60%'})`,
        popover: isDark ? `hsl(${baseHue}, 12%, 7%)` : `hsl(${baseHue}, 12%, 99%)`,
      };
    };

    const newTheme: Theme = {
      id: 'custom-coolors',
      name: 'Dynamic Theme',
      modes: {
        light: generateModeColors('light'),
        dark: generateModeColors('dark')
      }
    };

    setTempGeneratedTheme(newTheme);
    setActiveTheme('custom-coolors');
  };

  const saveCustomTheme = (name: string) => {
    if (!name.trim()) return;
    
    // Snapshot current colors from state/DOM
    const root = document.documentElement;
    const getVar = (v: string) => getComputedStyle(root).getPropertyValue(`--${v}`).trim();
    
    const themesVars = ['background', 'foreground', 'primary', 'card', 'border', 'popover', 'muted', 'secondary', 'accent'];
    const currentColors: any = {};
    themesVars.forEach(v => {
      currentColors[v] = getVar(v);
    });

    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: name,
      modes: {
        // Since we snapshot the live DOM, we save the current mode's colors for both slots for now
        // A more advanced version would let them toggle light/dark and snapshot both
        light: { ...currentColors },
        dark: { ...currentColors },
      },
      typography: {
        headingFont,
        bodyFont,
        actionFont,
      },
      // Note: We'd need to extend Theme type to store radius per theme if we want it fully semantic
    };

    const updated = [...customThemes, newTheme];
    setCustomThemes(updated);
    localStorage.setItem('pref-custom-themes', JSON.stringify(updated));
    setActiveTheme(newTheme.id);
    setTempGeneratedTheme(null);
    toast.success(`"${name}" saved to library`);
  };

  const deleteCustomTheme = (id: string) => {
    const updated = customThemes.filter(t => t.id !== id);
    setCustomThemes(updated);
    localStorage.setItem('pref-custom-themes', JSON.stringify(updated));
    if (activeTheme === id) {
      handleThemeChange('classic');
    }
    toast.error("Theme deleted");
  };

  return {
    theme, setTheme, resolvedTheme, mounted,
    activeColor, activeTheme, isPartyMode, setIsPartyMode,
    currentMode, allThemes,
    handleThemeChange, handleColorChange, handleRandomColor,
    handleCoolorsMode, saveCustomTheme, deleteCustomTheme,
    tempGeneratedTheme, activeVar, setActiveVar,
    activeFont, handleFontChange,
    headingFont, bodyFont, actionFont,
    handleHeadingFontChange, handleBodyFontChange, handleActionFontChange,
    headingWeight, bodyWeight, actionWeight,
    handleHeadingWeightChange, handleBodyWeightChange, handleActionWeightChange,
    headingSize, bodySize, actionSize,
    handleHeadingSizeChange, handleBodySizeChange, handleActionSizeChange,
    globalRadius, handleRadiusChange,
  };
}
