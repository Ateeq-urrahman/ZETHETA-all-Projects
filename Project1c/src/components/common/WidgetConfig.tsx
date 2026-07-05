'use client';

import React, { useState } from 'react';
import type { WidgetInstance } from '../../lib/types';
import './WidgetConfig.css';

interface WidgetConfigProps {
  instance: WidgetInstance;
  onSave: (instance: WidgetInstance) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function WidgetConfig({ instance, onSave, onCancel, isOpen }: WidgetConfigProps) {
  const [title, setTitle] = useState(instance.title);
  const [width, setWidth] = useState(instance.width);
  const [height, setHeight] = useState(instance.height);

  const handleSave = () => {
    onSave({ ...instance, title, width, height });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Configure Widget</h2>

        <div className="config-group">
          <label htmlFor="widget-title">Title</label>
          <input
            id="widget-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter widget title"
          />
        </div>

        <div className="config-group">
          <label htmlFor="widget-width">Width (columns)</label>
          <select id="widget-width" value={width} onChange={(e) => setWidth(parseInt(e.target.value))}>
            {[1, 2, 3, 4].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div className="config-group">
          <label htmlFor="widget-height">Height (rows)</label>
          <select id="widget-height" value={height} onChange={(e) => setHeight(parseInt(e.target.value))}>
            {[1, 2, 3].map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
