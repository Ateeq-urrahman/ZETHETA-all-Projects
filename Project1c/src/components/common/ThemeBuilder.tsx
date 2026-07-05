'use client';

import React, { useContext, useState } from 'react';
import { ThemeContext, themes } from '../../lib/theme';
import type { ThemePalette } from '../../lib/types';
import './ThemeBuilder.css';

export function ThemeBuilder() {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPalette, setEditingPalette] = useState<ThemePalette>(theme.palette);
  const [customThemeName, setCustomThemeName] = useState('Custom Theme');

  const handleColorChange = (key: keyof ThemePalette, value: string) => {
    setEditingPalette((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save to localStorage as custom theme
    const customTheme = {
      id: 'custom',
      label: customThemeName,
      palette: editingPalette
    };
    localStorage.setItem('meridian-custom-theme', JSON.stringify(customTheme));
    setIsOpen(false);
  };

  const handleReset = () => {
    setEditingPalette(theme.palette);
  };

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} className="theme-builder-trigger">
        Theme Builder
      </button>
    );
  }

  return (
    <div className="theme-builder-overlay" onClick={() => setIsOpen(false)}>
      <div className="theme-builder" onClick={(e) => e.stopPropagation()}>
        <h2>Theme Builder</h2>

        <div className="theme-builder-controls">
          <label htmlFor="theme-name">Theme Name</label>
          <input
            id="theme-name"
            type="text"
            value={customThemeName}
            onChange={(e) => setCustomThemeName(e.target.value)}
            placeholder="Enter custom theme name"
          />
        </div>

        <div className="color-palette">
          {Object.entries(editingPalette).map(([key, value]) => (
            <div key={key} className="color-picker-group">
              <label htmlFor={`color-${key}`}>{key}</label>
              <div className="color-input-wrapper">
                <input
                  id={`color-${key}`}
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof ThemePalette, e.target.value)}
                />
                <span className="color-value">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="theme-preview">
          <h3>Preview</h3>
          <div
            className="preview-sample"
            style={{
              background: editingPalette.background,
              color: editingPalette.text,
              border: `1px solid ${editingPalette.border}`,
              borderRadius: '0.5rem',
              padding: '1rem'
            }}
          >
            <p>This is sample text</p>
            <div style={{ background: editingPalette.surface, padding: '0.5rem', marginTop: '0.5rem', borderRadius: '0.25rem' }}>
              Surface element
            </div>
          </div>
        </div>

        <div className="theme-builder-actions">
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
            Close
          </button>
          <button type="button" onClick={handleSave} className="btn-primary">
            Save Theme
          </button>
        </div>
      </div>
    </div>
  );
}
