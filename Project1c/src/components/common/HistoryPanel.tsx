'use client';

import React, { useState } from 'react';
import type { LayoutHistoryEntry } from '../../hooks/useLayoutHistory';
import type { WidgetInstance } from '../../lib/types';
import './HistoryPanel.css';

interface HistoryPanelProps {
  history: LayoutHistoryEntry[];
  onRevert: (layout: WidgetInstance[]) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryPanel({ history, onRevert, onClear, isOpen, onClose }: HistoryPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleRevert = () => {
    if (history[selectedIndex]) {
      onRevert(history[selectedIndex].layout);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="history-panel-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h2>Layout History</h2>
          <button type="button" onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">No history yet. Edit your layout to create versions.</p>
        ) : (
          <>
            <div className="history-list">
              {history.map((entry, index) => (
                <button
                  key={entry.timestamp}
                  type="button"
                  className={`history-item ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div>
                    <span className="history-time">{entry.label}</span>
                    <span className="history-widgets">{entry.layout.length} widgets</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="history-actions">
              <button type="button" onClick={handleRevert} className="btn-primary">
                Revert to Selected
              </button>
              <button type="button" onClick={onClear} className="btn-danger">
                Clear History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
