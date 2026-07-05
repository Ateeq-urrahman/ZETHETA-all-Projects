'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ThemeContext, themes, applyThemeVariables } from '../../lib/theme';

const STORAGE_KEY = 'meridian-theme-id';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeId, setThemeId] = useState<string>(themes.meridian.id);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && themes[stored]) {
      setThemeId(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, themeId);
    applyThemeVariables(themes[themeId] ?? themes.meridian);
  }, [themeId]);

  const contextValue = useMemo(
    () => ({ theme: themes[themeId] ?? themes.meridian, setThemeId }),
    [themeId]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
