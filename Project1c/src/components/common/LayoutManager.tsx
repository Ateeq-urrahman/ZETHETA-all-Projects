'use client';

import React, { useState } from 'react';
import type { WidgetInstance } from '../../lib/types';
import './LayoutManager.css';

interface LayoutManagerProps {
  layout: WidgetInstance[];
  onImport: (layout: WidgetInstance[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutManager({ layout, onImport, isOpen, onClose }: LayoutManagerProps) {
  const [layoutName, setLayoutName] = useState(`Layout-${new Date().toISOString().split('T')[0]}`);

  const handleExport = () => {
    const json = JSON.stringify(layout, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layoutName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImport(parsed);
          onClose();
        } else {
          alert('Invalid layout format');
        }
      } catch {
        alert('Error parsing file');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="layout-manager-overlay" onClick={onClose}>
      <div className="layout-manager" onClick={(e) => e.stopPropagation()}>
        <h2>Manage Layouts</h2>

        <div className="layout-actions">
          <div className="action-group">
            <label htmlFor="layout-name">Export Name</label>
            <input
              id="layout-name"
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Enter layout name"
            />
            <button type="button" onClick={handleExport} className="btn-primary">
              Export Layout as JSON
            </button>
          </div>

          <div className="action-group">
            <label htmlFor="layout-import">Import Layout</label>
            <input id="layout-import" type="file" accept=".json" onChange={handleImport} />
          </div>
        </div>

        <div className="layout-info">
          <h3>Current Layout</h3>
          <p>{layout.length} widgets configured</p>
          <div className="layout-preview">
            {layout.map((widget) => (
              <div key={widget.id} className="layout-item">
                <strong>{widget.title}</strong>
                <span>
                  {widget.width}×{widget.height}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button type="button" onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
}
