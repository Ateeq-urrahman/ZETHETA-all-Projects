import { describe, it, expect } from 'vitest';
import { createInitialFeed, refreshFeed } from '../lib/data';

describe('Data feed generation', () => {
  it('creates initial feed with all required fields', () => {
    const feed = createInitialFeed();

    expect(feed.portfolio).toBeDefined();
    expect(feed.portfolio.totalAUM).toBeGreaterThan(0);
    expect(feed.performanceSeries).toHaveLength(20);
    expect(feed.correlationMatrix).toHaveLength(6);
    expect(feed.attribution).toHaveLength(4);
    expect(feed.exposure).toHaveLength(4);
  });

  it('refreshes feed maintains data structure', () => {
    const initialFeed = createInitialFeed();
    const refreshed = refreshFeed(initialFeed);

    expect(refreshed.portfolio).toBeDefined();
    expect(refreshed.performanceSeries).toHaveLength(20);
    expect(refreshed.correlationMatrix).toHaveLength(6);
    expect(refreshed.attribution).toHaveLength(4);
    expect(refreshed.exposure).toHaveLength(4);
  });

  it('portfolio AUM changes on refresh', () => {
    const initialFeed = createInitialFeed();
    const originalAUM = initialFeed.portfolio.totalAUM;

    let differentAUM = false;
    for (let i = 0; i < 10; i++) {
      const refreshed = refreshFeed(initialFeed);
      if (refreshed.portfolio.totalAUM !== originalAUM) {
        differentAUM = true;
        break;
      }
    }

    expect(differentAUM).toBe(true);
  });

  it('performance series updates correctly', () => {
    const initialFeed = createInitialFeed();
    const initialLength = initialFeed.performanceSeries.length;
    const refreshed = refreshFeed(initialFeed);

    expect(refreshed.performanceSeries).toHaveLength(initialLength);
    expect(refreshed.performanceSeries[initialLength - 1].timestamp).toBeGreaterThan(
      initialFeed.performanceSeries[initialLength - 1].timestamp
    );
  });
});
