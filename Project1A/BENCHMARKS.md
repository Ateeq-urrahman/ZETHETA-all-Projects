# Performance Validation

## Filter Engine Benchmark

The filter engine is designed for a universe of 5,000+ stocks and uses a compiled predicate with early exits to ensure consistent sub-200ms response times on modern browsers.

### Benchmark script
- File: `scripts/benchmark.ts`
- Run with: `npm run bench`

### Expected results
- Full scan of 5,200 stocks across 150 iterations
- Average per filter pass: < 5 ms
- Average per stock: < 0.0005 ms

## Virtualization and rendering

The stock grid is built with `@tanstack/react-table` and `@tanstack/react-virtual`.
- Only visible rows are rendered during scrolling
- Total DOM count stays low even for 5,000+ rows
- `StockTable` uses a fixed estimate row height and overscan window for smooth scroll performance

## Live feed throughput

The simulated WebSocket layer publishes incremental updates at roughly 0.5-second intervals for multiple tickers.
- Updates are merged into state with minimal diffing
- Component re-renders are scoped to affected rows and the currently selected stock

## Notes

Because the application is fully client-side in the browser, the measure of `benchmarkMs` in `StockScreener` provides live feedback on filter latency during normal usage.
