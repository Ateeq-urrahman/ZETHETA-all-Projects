import React from 'react';
import type { ThemeDefinition } from './types';

export const themes: Record<string, ThemeDefinition> = {
  meridian: {
    id: 'meridian',
    label: 'Meridian Capital',
    palette: {
      background: '#061B2F',
      surface: '#0F2A47',
      text: '#F5FBFF',
      muted: '#A9BBCF',
      accent: '#4FD1C5',
      success: '#8EE5A3',
      warning: '#F2B562',
      danger: '#F46B78',
      border: '#21415B'
    }
  },
  neutral: {
    id: 'neutral',
    label: 'Neutral Slate',
    palette: {
      background: '#F4F7FA',
      surface: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
      accent: '#2563EB',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
      border: '#E5E7EB'
    }
  }
};

export const ThemeContext = React.createContext({
  theme: themes.meridian,
  setThemeId: (id: string) => {}
});

export function applyThemeVariables(theme: ThemeDefinition) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(theme.palette).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}
