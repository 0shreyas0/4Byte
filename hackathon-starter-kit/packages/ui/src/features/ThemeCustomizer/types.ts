export interface ThemeModeColors {
  background: string;
  foreground: string;
  primary: string;
  card: string;
  border: string;
  muted: string;
  secondary: string;
  accent: string;
  popover: string;
}

export interface Theme {
  id: string;
  name: string;
  /** Emoji shown beside the theme name in the card */
  tag?: string;
  modes: {
    light: ThemeModeColors;
    dark: ThemeModeColors;
  };
  /** Optional typography presets bundled with the theme */
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    actionFont?: string;
  };
}

export interface AccentColor {
  name: string;
  value: string;
  label: string;
}

export type FontCategory = 'sans' | 'serif' | 'mono' | 'display';

export interface TypographyPreset {
  id: string;
  name: string;
  label: string;
  /** CSS font-family value — either var(--font-*) for preloaded or a quoted name for dynamic fonts */
  family: string;
  familyHeading?: string;
  familyBody?: string;
  familyAction?: string;
  /** If set, font is loaded dynamically via Google Fonts on first use */
  googleFont?: string;
  category: FontCategory;
  config: {
    fs?: Record<string, string>;
    fw?: Record<string, string>;
    ls?: string;
    lh?: string;
  };
}
