import { FilterOptions, Stock } from './types';

/**
 * Creates an optimized filter predicate using early returns to minimize checks
 * Performance: O(1) per stock, optimized for < 200ms filtering of 5000 stocks
 * Early exit strategy: Sector filtering first (most selective)
 */
export function createStockFilterPredicate(filters: FilterOptions) {
  const search = filters.search.trim().toLowerCase();
  const requiresSearch = search.length > 0;

  return (stock: Stock) => {
    // Sector filter first - most selective, early exit
    if (filters.sector !== 'All' && stock.sector !== filters.sector) {
      return false;
    }

    if (requiresSearch) {
      const normalized = `${stock.symbol} ${stock.name}`.toLowerCase();
      if (!normalized.includes(search)) {
        return false;
      }
    }

    if (stock.marketCap < filters.minMarketCap) {
      return false;
    }

    if (stock.peRatio > filters.maxPeRatio) {
      return false;
    }

    if (stock.dividendYield < filters.minDividendYield) {
      return false;
    }

    if (stock.averageVolume < filters.minAverageVolume) {
      return false;
    }

    if (stock.momentum < filters.minMomentum) {
      return false;
    }

    if (stock.rating < filters.minRating) {
      return false;
    }

    return true;
  };
}

export function filterStockUniverse(stocks: Stock[], filters: FilterOptions) {
  const predicate = createStockFilterPredicate(filters);
  const filtered: Stock[] = [];
  const source = stocks;

  for (let index = 0; index < source.length; index += 1) {
    const stock = source[index];
    if (predicate(stock)) {
      filtered.push(stock);
    }
  }

  return filtered;
}
