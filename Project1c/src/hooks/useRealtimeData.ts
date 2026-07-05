import { useEffect, useMemo, useState } from 'react';
import { createInitialFeed, refreshFeed } from '../lib/data';
import type { RealTimeFeed } from '../lib/types';

const STALE_THRESHOLD_MS = 5000;

export function useRealtimeData() {
  const [feed, setFeed] = useState<RealTimeFeed>(() => createInitialFeed());
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFeed((current) => {
        const next = refreshFeed(current);
        setLastUpdate(Date.now());
        return next;
      });
    }, 1500);
    return () => window.clearInterval(interval);
  }, []);

  const metadata = useMemo(
    () => ({
      lastUpdated: lastUpdate,
      isStale: Date.now() - lastUpdate > STALE_THRESHOLD_MS
    }),
    [lastUpdate]
  );

  return { feed, metadata };
}
