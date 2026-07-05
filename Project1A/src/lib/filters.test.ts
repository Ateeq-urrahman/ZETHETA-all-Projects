import { createStockFilterPredicate, filterStockUniverse } from './filters';
import { Stock, FilterOptions } from './types';

describe('Filter Performance', () => {
  const generateMockStocks = (count: number): Stock[] => {
    const sectors = ['Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: `STOCK${i}`,
      name: `Stock Company ${i}`,
      sector: sectors[i % sectors.length],
      lastPrice: 50 + Math.random() * 200,
      changePercent: -10 + Math.random() * 20,
      marketCap: 1e9 + Math.random() * 1e12,
      peRatio: 5 + Math.random() * 50,
      dividendYield: Math.random() * 5,
      averageVolume: 1e6 + Math.random() * 1e8,
      momentum: Math.random() * 100,
      rating: 1 + Math.random() * 5,
      w52High: 100 + Math.random() * 200,
      w52Low: 30 + Math.random() * 100,
    }));
  };

  it('should filter 1000 stocks in < 200ms', () => {
    const stocks = generateMockStocks(1000);
    const filters: FilterOptions = {
      sector: 'Tech',
      search: 'STOCK',
      minMarketCap: 1e10,
      maxPeRatio: 30,
      minDividendYield: 0,
      minAverageVolume: 1e7,
      minMomentum: 40,
      minRating: 3,
    };

    const start = performance.now();
    const result = filterStockUniverse(stocks, filters);
    const end = performance.now();

    expect(end - start).toBeLessThan(200);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should filter 5000 stocks in < 200ms', () => {
    const stocks = generateMockStocks(5000);
    const filters: FilterOptions = {
      sector: 'Finance',
      search: '',
      minMarketCap: 5e10,
      maxPeRatio: 25,
      minDividendYield: 1,
      minAverageVolume: 5e7,
      minMomentum: 50,
      minRating: 3.5,
    };

    const start = performance.now();
    const result = filterStockUniverse(stocks, filters);
    const end = performance.now();

    expect(end - start).toBeLessThan(200);
  });
});
