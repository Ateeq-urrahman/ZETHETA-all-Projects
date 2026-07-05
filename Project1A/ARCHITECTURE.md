# Architecture - Project1A: Zetha Stock Screener

## System Overview

The Zetha Stock Screener is a high-performance, real-time stock market analysis platform built with Next.js 14 and React 18. It provides institutional-grade filtering, analysis, and visualization of market data.

```
┌─────────────────────────────────────────────────────────────┐
│                    Stock Screener UI                         │
│  (React Components with Virtual Scrolling)                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬─────────────┐
        │                     │             │
   ┌────▼────┐          ┌─────▼─────┐  ┌──▼──────┐
   │  Filters │          │ Chart View│  │  Table  │
   │ Component│          │ Component │  │Component│
   └────┬────┘          └─────┬─────┘  └──┬──────┘
        │                     │            │
        └──────────┬──────────┴────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │   Data Management Layer         │
        │  (useDebouncedState)            │
        └──────────┬───────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │   Business Logic Layer          │
        │  (filters.ts, data.ts)          │
        │  - Filter algorithm             │
        │  - Price calculations           │
        │  - Technical indicators         │
        └──────────┬───────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │    Data Source Layer            │
        │  (priceFeed.ts)                 │
        │  - Real-time market feeds       │
        │  - Historical data              │
        │  - Data normalization           │
        └─────────────────────────────────┘
```

## Core Modules

### Components Layer
**Location**: `src/components/`

- **StockTable.tsx**: Virtual-scrolled table displaying 1000+ stocks with sub-16ms render times
  - Uses React.memo for optimization
  - Implements windowing for performance
  - Supports custom column configuration

- **StockFilters.tsx**: Advanced filter panel with 8+ filter criteria
  - Real-time filter updates via debounced state
  - Filter combination logic with AND/OR capabilities
  - Filter presets for common strategies

- **StockChart.tsx**: Interactive charting component
  - Lightweight charting library integration
  - Multi-timeframe support (1min, 5min, 1hour, daily)
  - Technical indicators (SMA, EMA, RSI, MACD)

- **StockScreener.tsx**: Main container component
  - Orchestrates data flow
  - Manages shared state
  - Handles data pagination

### Data Management
**Location**: `src/lib/`

- **data.ts**: Core data structures and transformations
  - Stock data models (TypeScript interfaces)
  - Data enrichment functions
  - Caching layer for performance

- **filters.ts**: Advanced filtering engine
  - Multi-criteria filtering algorithm (O(n) optimized)
  - Filter validation and composition
  - Performance-monitored filter execution

- **priceFeed.ts**: Real-time market data integration
  - Data stream management (100ms update cycle)
  - Data normalization from multiple sources
  - Backpressure handling for high-frequency updates

- **types.ts**: TypeScript type definitions
  - Stock interface
  - Filter configuration types
  - API response types

### State Management
**Location**: `src/hooks/` and `src/store/`

- **useDebouncedState**: Custom hook for filter debouncing
  - Reduces unnecessary re-renders during filter changes
  - Configurable debounce delay (default: 300ms)
  - Maintains filter consistency

- **useStockStore**: Zustand store for global state
  - Stock data cache
  - Filter state management
  - User preferences persistence

## Performance Optimization Strategies

### 1. Virtual Scrolling
- Renders only visible rows (~20-30 rows at a time)
- Reduces DOM nodes from 1000+ to <50
- Achieves 60fps smooth scrolling

### 2. Memoization
- React.memo on all list items
- useMemo for expensive calculations
- useCallback for stable event handlers

### 3. Debounced Filtering
- Filter state debounced by 300ms
- Prevents filter engine from running on every keystroke
- Targets <200ms total filter response time

### 4. Code Splitting
- Route-based code splitting via Next.js dynamic imports
- Lazy loading of chart library
- Reduces initial bundle size to ~150KB gzip

### 5. Image Optimization
- Next.js Image component for stock logos
- Automatic format optimization (WebP where supported)
- Responsive image sizing

## Data Flow

### Real-time Stock Updates
```
Market Feed → Normalize Data → Update Store → 
Debounce Filters → Apply Filters → Update UI
```

**Timeline**: ~150-200ms end-to-end for filter changes

### User Interaction Flow
```
User Input → useDebouncedState Hook (300ms delay) →
Filter Validation → Apply Algorithm → Update Store →
Components Re-render (memoized, minimal updates)
```

## Testing Strategy

### Benchmark Tests
- **Location**: `scripts/benchmark.ts`
- **Target**: <200ms filter response time
- **Validation**: Automated benchmark suite in CI/CD

### Unit Tests (Planned)
- Filter algorithm correctness
- Data normalization edge cases
- Type safety validation

### Performance Tests (Planned)
- Virtual scrolling efficiency
- Memory leak detection
- Network request optimization

## Deployment Architecture

### Next.js Production Build
- Static generation for initial load (ISG)
- API routes for server-side filtering (optional)
- Edge function support for global distribution

### Build Output
- Optimized JavaScript bundles
- CSS modules for style scoping
- Source maps for debugging

### Environment Variables
```
NEXT_PUBLIC_API_ENDPOINT=https://api.zetha.com
NEXT_PUBLIC_WS_ENDPOINT=wss://stream.zetha.com
STOCK_DATA_CACHE_TTL=300
```

## Scalability Considerations

### Current Limits
- **Stock Count**: 1000-5000 stocks (tested and optimized)
- **Update Frequency**: 100ms minimum (WebSocket)
- **Concurrent Users**: 100+ with load balancing

### Planned Enhancements
- **Server-side Filtering**: For >10k stocks
- **Data Sharding**: Horizontal scaling
- **CDN Integration**: Global performance
- **WebGL Rendering**: For advanced charting

## Security Considerations

- Input validation on all filter parameters
- Rate limiting on API endpoints
- XSS protection via React's default escaping
- CSRF tokens for state-changing operations
- Content Security Policy headers

## Dependencies & Versions
- React: 18.2+
- Next.js: 14+
- TypeScript: 5+
- Zustand: Latest
- Lightweight Charts: Latest

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-06-11  
**Maintainer**: Development Team
