import { Theme } from '@/lib/contexts/ThemeContext';

export interface ThemeConfig {
  label: string;
  value: Theme;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
  };
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  light: {
    label: 'Claro',
    value: 'light',
    emoji: '☀️',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#2563EB',
      background: '#F0F8FF',
      card: '#FFFFFF',
    },
  },
  dark: {
    label: 'Oscuro',
    value: 'dark',
    emoji: '🌙',
    colors: {
      primary: '#FFFFFF',
      secondary: '#D1D5DB',
      accent: '#3B82F6',
      background: '#1A2A44',
      card: '#1F2937',
    },
  },
  'christmas-light': {
    label: 'Navidad Claro',
    value: 'christmas-light',
    emoji: '🎄',
    colors: {
      primary: '#FF0000',
      secondary: '#6B7280',
      accent: '#008000',
      background: '#F0F8FF',
      card: '#FFFFFF',
    },
  },
  'christmas-dark': {
    label: 'Navidad Oscuro',
    value: 'christmas-dark',
    emoji: '🎅',
    colors: {
      primary: '#FFD700',
      secondary: '#D1D5DB',
      accent: '#FFD700',
      background: '#1A2A44',
      card: '#1F2937',
    },
  },
};

export const THEME_OPTIONS = Object.values(THEME_CONFIGS);

// Función para detectar si es temporada navideña (diciembre)
export const isChristmasSeason = (): boolean => {
  const currentMonth = new Date().getMonth();
  return currentMonth === 11; // Diciembre = mes 11 (0-indexed)
};

// Función para obtener el tema por defecto según la temporada
export const getDefaultTheme = (): Theme => {
  if (isChristmasSeason()) {
    return 'christmas-light';
  }
  return 'light';
};
