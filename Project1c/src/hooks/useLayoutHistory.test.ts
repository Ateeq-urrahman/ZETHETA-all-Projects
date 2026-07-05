import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLayoutHistory } from '../hooks/useLayoutHistory';
import type { WidgetInstance } from '../lib/types';

describe('useLayoutHistory', () => {
  const mockLayout: WidgetInstance[] = [
    { id: '1', widgetType: 'test', title: 'Test', x: 0, y: 0, width: 1, height: 1, config: {} }
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => useLayoutHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it('pushes layout to history', () => {
    const { result } = renderHook(() => useLayoutHistory());

    act(() => {
      result.current.pushToHistory(mockLayout);
    });

    expect(result.current.history).toHaveLength(1);
  });

  it('reverts to version from history', () => {
    const { result } = renderHook(() => useLayoutHistory());

    act(() => {
      result.current.pushToHistory(mockLayout);
    });

    const reverted = result.current.revertToVersion(0);
    expect(reverted).toEqual(mockLayout);
  });

  it('maintains max history entries', () => {
    const { result } = renderHook(() => useLayoutHistory());

    // Push more than MAX_HISTORY (10) entries
    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.pushToHistory([{ ...mockLayout[0], id: `${i}` }]);
      }
    });

    expect(result.current.history.length).toBeLessThanOrEqual(10);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useLayoutHistory());

    act(() => {
      result.current.pushToHistory(mockLayout);
    });

    expect(result.current.history).toHaveLength(1);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
  });
});
