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
  modes: {
    light: ThemeModeColors;
    dark: ThemeModeColors;
  };
}

export interface AccentColor {
  name: string;
  value: string;
  label: string;
}

export interface TypographyPreset {
  id: string;
  name: string;
  family: string;
  familyHeading?: string;
  familyBody?: string;
  familyAction?: string;
  label: string;
  config: {
    fs?: Record<string, string>;
    fw?: Record<string, string>;
    ls?: string;
    lh?: string;
  };
}
