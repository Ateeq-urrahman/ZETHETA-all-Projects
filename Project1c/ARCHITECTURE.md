# Architecture Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Meridian Dashboard                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Global Error Boundary                    │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Dashboard Component (Main Container)         │  │   │
│  │  │                                                │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │ Header (Memoized)                      │ │  │   │
│  │  │  │ ├─ Theme Selector                      │ │  │   │
│  │  │  │ ├─ Theme Builder                       │ │  │   │
│  │  │  │ ├─ History Button                      │ │  │   │
│  │  │  │ └─ Layout Manager Button               │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  │                                                │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │ Metadata (Memoized)                    │ │  │   │
│  │  │  │ ├─ Data Status (Live/Stale)            │ │  │   │
│  │  │  │ └─ Widget Count                        │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  │                                                │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │ Grid Layout (3 columns, responsive)   │ │  │   │
│  │  │  │                                        │ │  │   │
│  │  │  │  ┌──────────┐ ┌──────────┐            │ │  │   │
│  │  │  │  │ Widget 1 │ │ Widget 2 │ ...        │ │  │   │
│  │  │  │  │ (EB)     │ │ (EB)     │            │ │  │   │
│  │  │  │  └──────────┘ └──────────┘            │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  │                                                │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │ Modals (Portals)                       │ │  │   │
│  │  │  │ ├─ Widget Config                       │ │  │   │
│  │  │  │ ├─ Layout Manager                      │ │  │   │
│  │  │  │ └─ History Panel                       │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘

Legend:
EB = Error Boundary (widget-level isolation)
```

## Data Flow

### Real-Time Data Updates
```
useRealtimeData Hook
    ↓
setInterval (1500ms)
    ↓
refreshFeed(currentFeed)
    ↓
Update Component State
    ↓
Dashboard → WidgetItems (memoized)
    ↓
renderWidget(widget, feed, ...)
    ↓
Widget Render Functions
    ↓
Screen Update (<100ms)
```

### Layout Persistence
```
User Drags Widget
    ↓
handleDragMove (callback)
    ↓
setLayout() updates state
    ↓
usePersistentGrid Hook
    ↓
useEffect saves to localStorage
    ↓
pushToHistory() (layout versioning)
    ↓
History stored in localStorage
```

### Theme System
```
ThemeProvider (Context)
    ↓
Theme Selection
    ↓
applyThemeVariables()
    ↓
document.documentElement.style.setProperty()
    ↓
CSS Custom Properties Updated
    ↓
All components react to --theme-* vars
    ↓
<100ms theme transition
```

## Component Hierarchy

### Smart Components (State Management)
- **Dashboard** - Main container, manages layout, themes, history
  - Holds: layout, draggingId, configWidgetId, showLayoutManager, showHistory
  - Handles: drag operations, config saves, imports, keyboard shortcuts

### Presentation Components (Memoized)
- **DashboardHeader** - Header with controls
- **DashboardMeta** - Metadata section (live/stale status)
- **WidgetItem** - Individual widget wrapper

### Common Components
- **ErrorBoundary** - Error handling at global/widget level
- **WidgetConfig** - Configuration modal
- **ThemeBuilder** - Theme customization UI
- **LayoutManager** - Import/export layouts
- **HistoryPanel** - Layout version history

### Provider Components
- **ThemeProvider** - Theme context provider
- **RootLayout** - App root with providers

## Widget System

### Widget Registration
```typescript
registerWidget<TConfig>({
  type: 'unique-id',
  title: 'Display Name',
  minWidth: 1,
  minHeight: 1,
  defaultConfig: {},
  description: 'Widget description',
  render: (props) => <JSX />
})
```

### Widget Rendering
```typescript
renderWidget(
  instance: WidgetInstance,
  data: RealTimeFeed,
  onConfigure: () => void
) → JSX.Element
```

### Available Widgets
1. **Portfolio Snapshot** - AUM, NAV, allocations, VaR
2. **NAV Performance** - Performance sparkline
3. **Value at Risk** - VaR gauge with percentage
4. **Drawdown Analysis** - Drawdown sparkline
5. **Correlation Matrix** - Heatmap of correlations
6. **Brinson Attribution** - Attribution percentages
7. **Risk Exposure** - Factor exposure bars
8. **Liquidity Timeline** - Liquidity sparkline
9. **Holdings Heatmap** - Holdings intensity heatmap
10. **Benchmark Comparison** - Benchmark spread sparkline

## Hooks & Utilities

### Custom Hooks
- `usePersistentGrid()` - Layout persistence with localStorage
- `useRealtimeData()` - Mock data refresh interval
- `useLayoutHistory()` - Version history management (max 10)
- `useKeyboardShortcuts()` - Global keyboard event handling

### Utilities
- `registerWidget()` - Widget registration
- `renderWidget()` - Widget rendering logic
- `applyThemeVariables()` - CSS variable application
- Performance helpers (memoization, debounce utilities)

## Error Handling Strategy

### Error Boundary Levels
```
Global Level (Dashboard)
    ↓
    ├─ Catches app-wide errors
    ├─ Shows full-screen error UI
    └─ Option to reset

Widget Level (Individual Widget)
    ↓
    ├─ Catches widget-specific errors
    ├─ Shows isolated error message
    ├─ Other widgets continue rendering
    └─ No cascade to parent
```

## Performance Optimizations

### Memoization
```
Dashboard (no memo - owns state)
    ├─ DashboardHeader (memo) - stable props
    ├─ DashboardMeta (memo) - stable props
    └─ WidgetItem (memo) - stable widget object + callbacks
```

### Callback Memoization
- `handleDragStart` - depends on nothing (stable)
- `handleDragMove` - depends on [draggingId, dragOffset, setLayout]
- `handleConfigSave` - depends on [layout, setLayout, pushToHistory]
- `shortcuts` - depends on [history, revertToVersion, setLayout, showHistory]

### State Optimization
- Computed values use useMemo (e.g., configWidget lookup)
- Header callbacks memoized for prop stability
- Widget items memoized to prevent re-renders

### Potential Optimizations
- Lazy widget loading (React.lazy, Suspense)
- Virtual scrolling for widget list
- Code splitting per widget type
- Service Worker for offline capability

## Keyboard Navigation

### Shortcuts
- **Ctrl+Z** - Undo (revert to previous layout)
- **Ctrl+S** - Save (open layout manager)
- **Ctrl+H** - History (toggle history panel)
- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate button on widget handle
- **Arrow Keys** - Navigate between widgets (future)

## Accessibility

### WCAG 2.1 AA Compliance
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus management with focus-visible
- ✅ ARIA labels on interactive elements
- ✅ Live regions for status updates
- ✅ Semantic HTML structure
- ✅ Color contrast ratios
- ✅ Alternative text for visual indicators

### Accessibility Features
```
<main role="main">
  <header>
    <button aria-label="Drag widget">
    <select aria-label="Theme selector">
  </header>
  
  <section aria-live="polite">
    Data status updates
  </section>
  
  <section className="grid" role="main">
    <article>
      <div role="button" tabIndex={0}>
        Widget handle (draggable)
      </div>
    </article>
  </section>
</main>
```

## Testing Strategy

### Unit Tests
- `data.test.ts` - Feed generation and refresh
- `Dashboard.test.tsx` - Component rendering
- `ThemeSelector.test.tsx` - Theme switching
- `usePersistentGrid.test.ts` - Layout persistence
- `useLayoutHistory.test.ts` - Version history

### Test Tools
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing
- **@testing-library/user-event** - User interaction simulation

### Coverage Goals
- Components: >80% coverage
- Hooks: >90% coverage
- Utilities: >95% coverage

## Deployment

### Build Process
```bash
npm run build          # Next.js optimized build
npm run build-storybook # Static Storybook site
```

### Bundle Analysis
- Main chunk: <200KB
- Total: <500KB (gzipped)
- Code splitting per widget (future)

### Performance Targets
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Largest Contentful Paint: <2.5s
- Data refresh latency: <100ms

## Future Architectural Improvements

1. **Real WebSocket Integration** - Replace mock data with live feeds
2. **Widget Marketplace** - Plugin system for third-party widgets
3. **Multi-Monitor Support** - BroadcastChannel API for sync
4. **Advanced Analytics** - Real portfolio calculations
5. **Collaboration** - Real-time multi-user layouts
6. **Offline Support** - Service Worker caching
7. **Performance Monitoring** - Built-in metrics dashboard
8. **Mobile Optimization** - Touch gestures, responsive grid

## File Structure

```
Project1c/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── common/              # Shared components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── WidgetConfig.tsx
│   │   │   ├── ThemeBuilder.tsx
│   │   │   ├── LayoutManager.tsx
│   │   │   └── HistoryPanel.tsx
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.css
│   │   │   └── Dashboard.test.tsx
│   │   └── theme/               # Theme components
│   │       ├── ThemeProvider.tsx
│   │       └── ThemeSelector.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePersistentGrid.ts
│   │   ├── useRealtimeData.ts
│   │   ├── useLayoutHistory.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── lib/                     # Utilities & logic
│   │   ├── widget-framework.tsx # Widget registration
│   │   ├── widget-definitions.tsx # Widget implementations
│   │   ├── theme.ts             # Theme definitions
│   │   ├── data.ts              # Mock data generation
│   │   ├── types.ts             # TypeScript types
│   │   └── performance.ts       # Performance utilities
│   └── styles/
│       └── globals.css          # Global styles
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── package.json
├── tsconfig.json
├── next.config.mjs
└── vitest.config.ts
```

## Related Documentation

- **README.md** - Quick start and feature overview
- **BENCHMARKS.md** - Performance benchmarks
- **Case Studies** - Architecture inspiration from Bloomberg, Grafana, Zerodha, Refinitiv
