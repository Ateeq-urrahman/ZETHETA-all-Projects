'use client';

import React, { useCallback, useState, useMemo, memo } from 'react';
import { usePersistentGrid } from '../../hooks/usePersistentGrid';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { useLayoutHistory } from '../../hooks/useLayoutHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { getAllWidgets, renderWidget } from '../../lib/widget-framework';
import { registerDefaultWidgets } from '../../lib/widget-definitions';
import { ThemeSelector } from '../theme/ThemeSelector';
import { WidgetConfig, ThemeBuilder, LayoutManager, HistoryPanel, ErrorBoundary } from '../common';
import type { WidgetInstance } from '../../lib/types';
import './Dashboard.css';
import '../common/ErrorBoundary.css';

registerDefaultWidgets();

// Memoized header component for performance
const DashboardHeader = memo(
  ({
    onShowHistory,
    onShowLayoutManager
  }: {
    onShowHistory: () => void;
    onShowLayoutManager: () => void;
  }) => (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Meridian Capital</p>
        <h1>Portfolio Analytics Command Center</h1>
        <p className="subhead">USD 45B assets under management — equities, fixed income, derivatives, alternatives.</p>
      </div>
      <div className="header-controls">
        <ThemeSelector />
        <ThemeBuilder />
        <button type="button" onClick={onShowHistory} className="history-btn" title="Ctrl+H">
          History
        </button>
        <button type="button" onClick={onShowLayoutManager} className="layout-btn" title="Ctrl+S">
          Manage Layout
        </button>
      </div>
    </header>
  )
);

DashboardHeader.displayName = 'DashboardHeader';

// Memoized metadata section for performance
const DashboardMeta = memo(({ isStale, timestamp, widgetCount }: { isStale: boolean; timestamp: number; widgetCount: number }) => (
  <section className="dashboard-meta" aria-live="polite">
    <span>{isStale ? 'Data stale' : 'Live'} as of {new Date(timestamp).toLocaleTimeString()}</span>
    <span>{widgetCount} widgets active</span>
  </section>
));

DashboardMeta.displayName = 'DashboardMeta';

// Memoized widget item component
const WidgetItem = memo(
  ({
    widget,
    isDragging,
    feed,
    onDragStart,
    onConfigClick
  }: {
    widget: WidgetInstance;
    isDragging: boolean;
    feed: unknown;
    onDragStart: (event: React.PointerEvent<HTMLDivElement>, id: string) => void;
    onConfigClick: (id: string) => void;
  }) => (
    <ErrorBoundary level="widget">
      <article
        className={`dashboard-grid-item ${isDragging ? 'dragging' : ''}`}
        style={{
          gridColumn: `${widget.x + 1} / span ${widget.width}`,
          gridRow: `${widget.y + 1} / span ${widget.height}`
        }}
      >
        <div
          role="button"
          tabIndex={0}
          className="dashboard-widget-handle"
          onPointerDown={(event) => onDragStart(event, widget.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onConfigClick(widget.id);
            }
          }}
          aria-label={`Drag ${widget.title}`}
        >
          <span>{widget.title}</span>
        </div>
        {renderWidget(widget, feed, () => onConfigClick(widget.id))}
      </article>
    </ErrorBoundary>
  )
);

WidgetItem.displayName = 'WidgetItem';

export function Dashboard() {
  const { layout, setLayout } = usePersistentGrid();
  const { feed, metadata } = useRealtimeData();
  const { history, pushToHistory, revertToVersion, clearHistory } = useLayoutHistory();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [configWidgetId, setConfigWidgetId] = useState<string | null>(null);
  const [showLayoutManager, setShowLayoutManager] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const configWidget = useMemo(() => {
    return layout.find((w) => w.id === configWidgetId);
  }, [layout, configWidgetId]);

  const handleDragStart = useCallback((event: React.PointerEvent<HTMLDivElement>, id: string) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    setDraggingId(id);
    setDragOffset({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, []);

  const handleDragMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingId) return;
      event.preventDefault();
      const columnWidth = 320;
      const rowHeight = 220;
      const gridLeft = 24;
      const gridTop = 96;
      const x = Math.max(0, Math.floor((event.clientX - gridLeft - dragOffset.x + columnWidth / 2) / columnWidth));
      const y = Math.max(0, Math.floor((event.clientY - gridTop - dragOffset.y + rowHeight / 2) / rowHeight));
      setLayout((prev) => prev.map((item) => (item.id === draggingId ? { ...item, x, y } : item)));
    },
    [draggingId, dragOffset, setLayout]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleConfigSave = useCallback((instance: WidgetInstance) => {
    setLayout((prev) => prev.map((item) => (item.id === instance.id ? instance : item)));
    pushToHistory(layout);
    setConfigWidgetId(null);
  }, [layout, setLayout, pushToHistory]);

  const handleLayoutImport = useCallback((imported: WidgetInstance[]) => {
    setLayout(imported);
    pushToHistory(imported);
  }, [setLayout, pushToHistory]);

  const handleHistoryRevert = useCallback((previous: WidgetInstance[]) => {
    setLayout(previous);
  }, [setLayout]);

  const shortcuts = useMemo(
    () => ({
      'ctrl+z': () => {
        if (history.length > 0) {
          const previous = revertToVersion(0);
          if (previous) {
            setLayout(previous);
          }
        }
      },
      'ctrl+s': (e?: Event) => {
        e?.preventDefault?.();
        setShowLayoutManager(true);
      },
      'ctrl+h': (e?: Event) => {
        e?.preventDefault?.();
        setShowHistory(!showHistory);
      }
    }),
    [history, revertToVersion, setLayout, showHistory]
  );

  useKeyboardShortcuts(shortcuts);

  const headerCallbacks = useMemo(
    () => ({
      onShowHistory: () => setShowHistory(true),
      onShowLayoutManager: () => setShowLayoutManager(true)
    }),
    []
  );

  return (
    <ErrorBoundary level="global" onError={(error) => console.error('Dashboard error:', error)}>
      <main className="dashboard-shell">
        <DashboardHeader {...headerCallbacks} />

        <DashboardMeta isStale={metadata.isStale} timestamp={metadata.lastUpdated} widgetCount={layout.length} />

        <section className="dashboard-grid" onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
          {layout.map((widget) => (
            <WidgetItem
              key={widget.id}
              widget={widget}
              isDragging={draggingId === widget.id}
              feed={feed}
              onDragStart={handleDragStart}
              onConfigClick={setConfigWidgetId}
            />
          ))}
        </section>

        {configWidget && (
          <WidgetConfig
            instance={configWidget}
            onSave={handleConfigSave}
            onCancel={() => setConfigWidgetId(null)}
            isOpen={!!configWidgetId}
          />
        )}

        <LayoutManager
          layout={layout}
          onImport={handleLayoutImport}
          isOpen={showLayoutManager}
          onClose={() => setShowLayoutManager(false)}
        />

        <HistoryPanel
          history={history}
          onRevert={handleHistoryRevert}
          onClear={clearHistory}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </main>
    </ErrorBoundary>
  );
}
