import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePersistentGrid } from '../hooks/usePersistentGrid';

describe('usePersistentGrid', () => {
  it('initializes with default layout', () => {
    const { result } = renderHook(() => usePersistentGrid());
    expect(result.current.layout).toHaveLength(10);
    expect(result.current.layout[0].id).toBe('summary');
  });

  it('layout includes all default widgets', () => {
    const { result } = renderHook(() => usePersistentGrid());
    const widgets = result.current.layout.map((item) => item.widgetType);

    expect(widgets).toContain('portfolio-summary');
    expect(widgets).toContain('nav-performance');
    expect(widgets).toContain('var-gauge');
    expect(widgets).toContain('drawdown-analysis');
  });

  it('each widget has required properties', () => {
    const { result } = renderHook(() => usePersistentGrid());

    result.current.layout.forEach((widget) => {
      expect(widget.id).toBeDefined();
      expect(widget.widgetType).toBeDefined();
      expect(widget.title).toBeDefined();
      expect(typeof widget.x).toBe('number');
      expect(typeof widget.y).toBe('number');
      expect(typeof widget.width).toBe('number');
      expect(typeof widget.height).toBe('number');
    });
  });
});
