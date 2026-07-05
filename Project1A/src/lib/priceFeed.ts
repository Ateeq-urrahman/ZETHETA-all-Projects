import { Stock } from './types';

export type PriceUpdate = {
  id: string;
  lastPrice: number;
  changePercent: number;
  volume: number;
};

export type LivePriceFeed = {
  subscribe: (listener: (update: PriceUpdate) => void) => () => void;
  close: () => void;
};

const createUpdate = (stock: Stock): PriceUpdate => {
  const volatility = 0.015 * (1 + Math.random());
  const direction = Math.random() > 0.5 ? 1 : -1;
  const delta = stock.lastPrice * volatility * direction;
  const lastPrice = Number(Math.max(0.5, stock.lastPrice + delta).toFixed(2));
  const changePercent = Number(((lastPrice - stock.lastPrice) / stock.lastPrice) * 100).toFixed(2) as unknown as number;
  const volume = stock.volume + Math.round(Math.random() * 5000 - 2500);

  return {
    id: stock.id,
    lastPrice,
    changePercent,
    volume: Math.max(1, volume),
  };
};

export function connectLivePriceFeed(stocks: Stock[]): LivePriceFeed {
  const listeners = new Set<(update: PriceUpdate) => void>();
  let timer: number | null = null;

  const publish = () => {
    const count = Math.max(8, Math.floor(stocks.length * 0.005));
    for (let index = 0; index < count; index += 1) {
      const stock = stocks[Math.floor(Math.random() * stocks.length)];
      const update = createUpdate(stock);
      listeners.forEach((listener) => listener(update));
    }
  };

  const subscribe = (listener: (update: PriceUpdate) => void) => {
    listeners.add(listener);
    if (timer === null && typeof window !== 'undefined') {
      timer = window.setInterval(publish, 600);
    }
    return () => listeners.delete(listener);
  };

  const close = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    listeners.clear();
  };

  return { subscribe, close };
}
