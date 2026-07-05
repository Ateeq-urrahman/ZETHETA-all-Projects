'use client';

import { useEffect, useMemo } from 'react';
import StockFilters from '@/components/StockFilters';
import StockTable from '@/components/StockTable';
import StockChart from '@/components/StockChart';
import { generateUniverse } from '@/lib/data';
import { filterStockUniverse } from '@/lib/filters';
import { connectLivePriceFeed } from '@/lib/priceFeed';
import { useStockStore } from '@/store/useStockStore';
import type { Sector } from '@/lib/types';

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

export default function StockScreener() {
  const {
    universe,
    filters,
    selectedStockId,
    selectedIndicator,
    benchmarkMs,
    initializeUniverse,
    updateFilters,
    selectStock,
    selectIndicator,
    applyPriceUpdate,
    setBenchmark,
  } = useStockStore();

  useEffect(() => {
    if (universe.length === 0) {
      initializeUniverse(generateUniverse());
    }
  }, [initializeUniverse, universe.length]);

  useEffect(() => {
    if (universe.length === 0) {
      return undefined;
    }

    const feed = connectLivePriceFeed(universe);
    const unsubscribe = feed.subscribe((update) => {
      applyPriceUpdate(update);
    });

    return () => {
      unsubscribe();
      feed.close();
    };
  }, [applyPriceUpdate, universe]);

  const filteredStocks = useMemo(() => {
    const start = performance.now();
    const result = filterStockUniverse(universe, filters);
    setBenchmark(Math.round(performance.now() - start));
    return result;
  }, [filters, setBenchmark, universe]);

  const selectedStock = filteredStocks.find((stock) => stock.id === selectedStockId) ?? filteredStocks[0] ?? universe[0] ?? null;

  useEffect(() => {
    if (selectedStock && selectedStock.id !== selectedStockId) {
      selectStock(selectedStock.id);
    }
  }, [selectedStock, selectedStockId, selectStock]);

  return (
    <div className="data-grid">
      <div className="grid-2">
        <StockFilters filters={filters} sectors={sectors} onChange={updateFilters} />
        <div className="panel">
          <div className="status-bar">
            <div className="status-card">
              <strong>{filteredStocks.length.toLocaleString()}</strong>
              Stocks matching filters
            </div>
            <div className="status-card">
              <strong>{universe.length.toLocaleString()}</strong>
              Total universe size
            </div>
            <div className="status-card">
              <strong>{benchmarkMs} ms</strong>
              Filter latency
            </div>
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <p className="eyebrow">Live stream</p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              Simulated WebSocket updates are flowing into the stock universe for intraday pricing.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <StockTable
          stocks={filteredStocks}
          selectedStockId={selectedStock?.id ?? null}
          onSelect={selectStock}
        />
        {selectedStock ? (
          <StockChart
            stock={selectedStock}
            selectedIndicator={selectedIndicator}
            onIndicatorChange={selectIndicator}
          />
        ) : (
          <div className="panel">No stock selected</div>
        )}
      </div>
    </div>
  );
}
