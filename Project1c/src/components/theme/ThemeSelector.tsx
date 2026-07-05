'use client';

import React, { useContext } from 'react';
import { ThemeContext, themes } from '../../lib/theme';

export const ThemeSelector = () => {
  const { theme, setThemeId } = useContext(ThemeContext);

  return (
    <div className="theme-selector">
      <label htmlFor="theme-selector">Theme</label>
      <select
        id="theme-selector"
        value={theme.id}
        onChange={(event) => setThemeId(event.target.value)}
      >
        {Object.values(themes).map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
