'use client';

import { useEffect, useState } from 'react';
import type { WidgetInstance } from '../lib/types';

const STORAGE_KEY = 'meridian-dashboard-layout';
const DEFAULT_LAYOUT: WidgetInstance[] = [
  { id: 'summary', widgetType: 'portfolio-summary', title: 'Portfolio Snapshot', x: 0, y: 0, width: 2, height: 1, config: {} },
  { id: 'nav', widgetType: 'nav-performance', title: 'NAV Performance', x: 2, y: 0, width: 2, height: 1, config: {} },
  { id: 'var', widgetType: 'var-gauge', title: 'Value at Risk', x: 0, y: 1, width: 1, height: 1, config: {} },
  { id: 'drawdown', widgetType: 'drawdown-analysis', title: 'Drawdown Analysis', x: 1, y: 1, width: 1, height: 1, config: {} },
  { id: 'correlation', widgetType: 'correlation-matrix', title: 'Correlation Matrix', x: 2, y: 1, width: 1, height: 1, config: {} },
  { id: 'attribution', widgetType: 'brinson-attribution', title: 'Brinson Attribution', x: 0, y: 2, width: 1, height: 1, config: {} },
  { id: 'exposure', widgetType: 'risk-exposure', title: 'Risk Exposure', x: 1, y: 2, width: 1, height: 1, config: {} },
  { id: 'liquidity', widgetType: 'liquidity-timeline', title: 'Liquidity Trend', x: 2, y: 2, width: 1, height: 1, config: {} },
  { id: 'heatmap', widgetType: 'holdings-heatmap', title: 'Holdings Heatmap', x: 0, y: 3, width: 2, height: 1, config: {} },
  { id: 'benchmark', widgetType: 'benchmark-comparison', title: 'Benchmark Spread', x: 2, y: 3, width: 1, height: 1, config: {} }
];

export function usePersistentGrid() {
  const [layout, setLayout] = useState<WidgetInstance[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_LAYOUT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_LAYOUT;
      const parsed = JSON.parse(raw) as WidgetInstance[];
      return Array.isArray(parsed) ? parsed : DEFAULT_LAYOUT;
    } catch {
      return DEFAULT_LAYOUT;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {
      // ignore storage failures
    }
  }, [layout]);

  return { layout, setLayout };
}
