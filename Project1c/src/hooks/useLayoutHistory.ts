'use client';

import { useCallback, useEffect, useState } from 'react';
import type { WidgetInstance } from '../lib/types';

const HISTORY_STORAGE_KEY = 'meridian-layout-history';
const MAX_HISTORY = 10;

export interface LayoutHistoryEntry {
  timestamp: number;
  layout: WidgetInstance[];
  label: string;
}

export function useLayoutHistory() {
  const [history, setHistory] = useState<LayoutHistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore errors
    }
  }, []);

  const pushToHistory = useCallback((layout: WidgetInstance[]) => {
    const timestamp = Date.now();
    const label = new Date(timestamp).toLocaleTimeString();

    setHistory((prev) => {
      const updated = [{ timestamp, layout, label }, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const revertToVersion = useCallback((index: number) => {
    const entry = history[index];
    if (entry) {
      return entry.layout;
    }
    return null;
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return { history, pushToHistory, revertToVersion, clearHistory };
}
