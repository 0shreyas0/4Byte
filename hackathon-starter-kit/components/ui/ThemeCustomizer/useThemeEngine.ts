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
  }, [activeTheme, currentMode, mounted, tempGeneratedTheme, allThemes]);

  // Reactive Typography Application
  useEffect(() => {
    if (!mounted) return;

    const preset = FONTS.find(f => f.id === activeFont);
    if (!preset) return;

    const root = document.documentElement;
    // Set the runtime vars that base CSS rules read from
    root.style.setProperty('--font-heading', preset.familyHeading ?? preset.family);
    root.style.setProperty('--font-body',    preset.familyBody    ?? preset.family);
    root.style.setProperty('--font-action',  preset.familyAction  ?? preset.family);
    
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

  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem('pref-primary-color');
    const savedTheme = localStorage.getItem('pref-app-theme');
    const savedCustomThemes = localStorage.getItem('pref-custom-themes');
    const savedFont = localStorage.getItem('pref-app-font');
    
    if (savedColor) {
      setActiveColor(savedColor);
      document.documentElement.style.setProperty('--primary', savedColor);
    }
    
    if (savedTheme) setActiveTheme(savedTheme);
    if (savedFont) setActiveFont(savedFont);

    if (savedCustomThemes) {
      setCustomThemes(JSON.parse(savedCustomThemes));
    }
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
    toast.info(`Typography: ${preset.name}`);
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
    if (!name.trim() || !tempGeneratedTheme) return;
    
    const newTheme = {
      ...tempGeneratedTheme,
      id: `custom-${Date.now()}`,
      name: name,
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
    theme,
    setTheme,
    resolvedTheme,
    mounted,
    activeColor,
    activeTheme,
    isPartyMode,
    setIsPartyMode,
    currentMode,
    allThemes,
    handleThemeChange,
    handleColorChange,
    handleRandomColor,
    handleCoolorsMode,
    saveCustomTheme,
    deleteCustomTheme,
    tempGeneratedTheme,
    activeVar,
    setActiveVar,
    activeFont,
    handleFontChange
  };
}
