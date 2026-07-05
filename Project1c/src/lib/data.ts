import type { RealTimeFeed } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const randomWalk = (start: number, volatility: number) =>
  start + (Math.random() - 0.5) * volatility;

const createMatrix = (size: number) =>
  Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => (row === col ? 1 : parseFloat((Math.random() * 0.4 - 0.2).toFixed(2))))
  );

export const createInitialFeed = (): RealTimeFeed => {
  const now = Date.now();
  const performanceSeries = Array.from({ length: 20 }, (_, index) => ({
    timestamp: now - (19 - index) * 3600000,
    value: 100 + index * 0.6 + Math.sin(index / 2) * 1.5
  }));
  return {
    portfolio: {
      totalAUM: 45000000000,
      cashAllocation: 5.6,
      equityAllocation: 47.2,
      fixedIncomeAllocation: 31.8,
      alternativesAllocation: 15.4,
      navChangePct: 1.3,
      varOneDay: 2.1
    },
    drawdownSeries: performanceSeries.map((item, idx) => ({
      timestamp: item.timestamp,
      value: 100 - Math.abs(Math.sin(idx / 3)) * 7
    })),
    performanceSeries,
    correlationMatrix: createMatrix(6),
    attribution: [
      { bucket: 'Equities', contribution: 67 },
      { bucket: 'Fixed Income', contribution: 14 },
      { bucket: 'Derivatives', contribution: 9 },
      { bucket: 'Alternatives', contribution: 10 }
    ],
    exposure: [
      { factor: 'Duration', weight: 21 },
      { factor: 'FX', weight: 18 },
      { factor: 'Credit', weight: 27 },
      { factor: 'Equity Beta', weight: 34 }
    ],
    liquidity: Array.from({ length: 18 }, (_, index) => ({
      timestamp: now - (17 - index) * 86400000,
      value: clamp(20 + Math.random() * 50 + index, 12, 92)
    })),
    benchmarkSpread: performanceSeries.map((item, idx) => ({
      timestamp: item.timestamp,
      value: parseFloat((Math.sin(idx / 4) * 0.4).toFixed(2))
    })),
    heatmap: Array.from({ length: 4 }, () => Array.from({ length: 12 }, () => parseFloat((Math.random() * 0.8 + 0.1).toFixed(2))))
  };
};

export const refreshFeed = (previous: RealTimeFeed): RealTimeFeed => {
  const previousTimestamp = previous.performanceSeries[previous.performanceSeries.length - 1]?.timestamp ?? Date.now();
  const now = Math.max(Date.now(), previousTimestamp + 1000);
  const last = previous.performanceSeries[previous.performanceSeries.length - 1]?.value ?? 100;
  const nextNav = randomWalk(last, 0.9);
  const updatedSeries = [...previous.performanceSeries.slice(1), { timestamp: now, value: nextNav }];
  return {
    ...previous,
    portfolio: {
      ...previous.portfolio,
      totalAUM: previous.portfolio.totalAUM + Math.round((Math.random() - 0.5) * 12000000),
      navChangePct: parseFloat((Math.random() * 0.9 - 0.2).toFixed(2)),
      varOneDay: parseFloat((1.8 + Math.random() * 0.6).toFixed(2))
    },
    performanceSeries: updatedSeries,
    drawdownSeries: updatedSeries.map((item, idx) => ({
      timestamp: item.timestamp,
      value: 100 - Math.abs(Math.sin(idx / 3)) * 6.5
    })),
    benchmarkSpread: updatedSeries.map((item, idx) => ({
      timestamp: item.timestamp,
      value: parseFloat((Math.sin(idx / 4 + 0.2) * 0.4).toFixed(2))
    })),
    correlationMatrix: previous.correlationMatrix.map((row) =>
      row.map((value, col) => (col === row.indexOf(value) ? 1 : parseFloat((value + (Math.random() - 0.5) * 0.02).toFixed(2))))
    ),
    attribution: previous.attribution.map((item) => ({
      ...item,
      contribution: parseFloat((item.contribution + (Math.random() - 0.5) * 1.2).toFixed(1))
    })),
    exposure: previous.exposure.map((item) => ({
      ...item,
      weight: clamp(item.weight + Math.random() * 2 - 1, 12, 45)
    })),
    liquidity: previous.liquidity.map((item) => ({
      timestamp: item.timestamp + 86400000,
      value: clamp(item.value + (Math.random() - 0.5) * 6, 10, 95)
    })),
    heatmap: previous.heatmap.map((row) => row.map((value) => parseFloat(clamp(value + (Math.random() - 0.5) * 0.08, 0.05, 1).toFixed(2))))
  };
};
