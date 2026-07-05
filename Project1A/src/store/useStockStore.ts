import { create } from 'zustand';
import { FilterOptions, IndicatorKey, Stock } from '@/lib/types';

const defaultFilters: FilterOptions = {
  search: '',
  sector: 'All',
  minMarketCap: 0,
  maxPeRatio: 999,
  minDividendYield: 0,
  minAverageVolume: 0,
  minMomentum: 0,
  minRating: 0,
};

type StockStoreState = {
  universe: Stock[];
  filters: FilterOptions;
  selectedStockId: string | null;
  selectedIndicator: IndicatorKey;
  benchmarkMs: number;
  initializeUniverse: (stocks: Stock[]) => void;
  updateFilters: (patch: Partial<FilterOptions>) => void;
  selectStock: (stockId: string) => void;
  selectIndicator: (indicator: IndicatorKey) => void;
  applyPriceUpdate: (update: { id: string; lastPrice: number; changePercent: number; volume: number }) => void;
  setBenchmark: (ms: number) => void;
};

export const useStockStore = create<StockStoreState>((set) => ({
  universe: [],
  filters: defaultFilters,
  selectedStockId: null,
  selectedIndicator: 'sma20',
  benchmarkMs: 0,
  initializeUniverse: (stocks) =>
    set({
      universe: stocks,
      selectedStockId: stocks[0]?.id ?? null,
      filters: defaultFilters,
    }),
  updateFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
  selectStock: (stockId) => set({ selectedStockId: stockId }),
  selectIndicator: (indicator) => set({ selectedIndicator: indicator }),
  applyPriceUpdate: (update) =>
    set((state) => ({
      universe: state.universe.map((stock) =>
        stock.id === update.id
          ? {
              ...stock,
              lastPrice: update.lastPrice,
              changePercent: update.changePercent,
              volume: update.volume,
            }
          : stock,
      ),
    })),
  setBenchmark: (ms) => set({ benchmarkMs: ms }),
}));
