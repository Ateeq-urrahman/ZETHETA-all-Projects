import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeContext, themes } from '../../lib/theme';
import { ThemeSelector } from './ThemeSelector';

describe('ThemeSelector', () => {
  it('renders theme options', () => {
    render(
      <ThemeContext.Provider value={{ theme: themes.meridian, setThemeId: () => undefined }}>
        <ThemeSelector />
      </ThemeContext.Provider>
    );

    expect(screen.getByLabelText(/theme/i)).toBeTruthy();
    expect(screen.getByRole('option', { name: /Meridian Capital/i })).toBeTruthy();
  });
});
