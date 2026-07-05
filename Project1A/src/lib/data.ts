import { CandlePoint, Sector, Stock } from './types';

// Custom error class for data loading failures
export class DataLoadError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'DataLoadError';
  }
}

const sectors: Sector[] = [
  'Technology',
  'Financials',
  'Healthcare',
  'Consumer',
  'Industrials',
  'Energy',
  'Utilities',
  'Materials',
];

const seed = 1937421;
let state = seed;
function random() {
  state = (state * 16807) % 2147483647;
  return (state - 1) / 2147483646;
}

function choose<T>(items: T[]): T {
  return items[Math.floor(random() * items.length)];
}

function formatTicker(prefix: string, index: number) {
  return `${prefix}${index}`.slice(0, 5).toUpperCase();
}

function buildSeries(base: number) {
  const days = 90;
  const series: CandlePoint[] = [];
  let price = base;
  const startDate = new Date(Date.UTC(2026, 0, 2));

  for (let index = 0; index < days; index += 1) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + index);
    const drift = (random() - 0.45) * 0.045;
    const open = price;
    const close = Math.max(1, open * (1 + drift));
    const high = Math.max(open, close) * (1 + random() * 0.02);
    const low = Math.min(open, close) * (1 - random() * 0.02);
    const volume = Math.floor(400000 + random() * 3200000);

    series.push({
      time: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return series;
}

export function generateUniverse(count = 5200): Stock[] {
  const universe: Stock[] = [];

  for (let index = 1; index <= count; index += 1) {
    const sector = choose(sectors);
    const basePrice = 10 + random() * 290;
    const prices = buildSeries(basePrice);
    const lastPoint = prices[prices.length - 1];
    const prevPoint = prices[prices.length - 2] ?? lastPoint;
    const changePercent = Number((((lastPoint.close - prevPoint.close) / prevPoint.close) * 100).toFixed(2));

    universe.push({
      id: `stock-${index}`,
      symbol: formatTicker(sector.slice(0, 3), index),
      name: `${sector} Growth ${index}`,
      sector,
      marketCap: Math.round(1 + random() * 240) * 1e9,
      peRatio: Number((5 + random() * 40).toFixed(2)),
      dividendYield: Number((random() * 4).toFixed(2)),
      averageVolume: Math.round(100000 + random() * 800000),
      momentum: Number((random() * 100).toFixed(0)),
      rating: Math.round(40 + random() * 60),
      lastPrice: lastPoint.close,
      changePercent,
      volume: lastPoint.volume,
      prices,
    });
  }

  return universe;
}
