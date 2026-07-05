export type Sector =
  | 'Technology'
  | 'Financials'
  | 'Healthcare'
  | 'Consumer'
  | 'Industrials'
  | 'Energy'
  | 'Utilities'
  | 'Materials';

export type Stock = {
  id: string;
  symbol: string;
  name: string;
  sector: Sector;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  averageVolume: number;
  momentum: number;
  rating: number;
  lastPrice: number;
  changePercent: number;
  volume: number;
  prices: CandlePoint[];
};

export type CandlePoint = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IndicatorKey =
  | 'sma20'
  | 'sma50'
  | 'ema20'
  | 'bollinger'
  | 'volume';

export type FilterOptions = {
  search: string;
  sector: Sector | 'All';
  minMarketCap: number;
  maxPeRatio: number;
  minDividendYield: number;
  minAverageVolume: number;
  minMomentum: number;
  minRating: number;
};
