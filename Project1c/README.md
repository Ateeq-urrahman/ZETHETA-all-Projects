# Meridian Capital Portfolio Analytics Dashboard

A fully customisable institutional-grade portfolio analytics dashboard built with Next.js 14, React 18, and TypeScript strict mode. Inspired by Bloomberg Terminal, Grafana, and Zerodha Kite.

## Features

### Core Dashboard
- **10+ Configurable Analytics Widgets** - Portfolio snapshot, NAV performance, VaR analysis, drawdown analysis, correlation matrix, attribution, exposure, liquidity, heatmaps, benchmark comparison
- **Drag-and-Drop Grid Layout** - Freely rearrange widgets with persistent storage
- **Layout Persistence** - Automatic save to localStorage with version history (last 10 versions)
- **Layout Import/Export** - Export layouts as JSON, import shared layouts
- **Error Boundaries** - Hierarchical error handling (Global > Widget levels)

### Theming & Customization
- **White-Label Theming Engine** - Multiple pre-built themes (Meridian Capital, Neutral Slate)
- **Dynamic Theme Builder** - Create custom color palettes with live preview
- **CSS Custom Properties** - Instant theme switching with <100ms transitions
- **WCAG 2.1 AA Accessibility** - Keyboard navigation, ARIA labels, focus management

### Real-Time Data
- **Mock WebSocket Simulation** - Continuous data refresh with configurable intervals
- **Stale Data Indicators** - Visual feedback when data becomes outdated
- **Portfolio Metrics** - AUM tracking, NAV changes, VaR calculation
- **Multi-Series Data** - Performance, drawdown, correlation, attribution feeds

### Performance & Developer Experience
- **React.memo Optimization** - Memoized components prevent unnecessary re-renders
- **Widget Configuration UI** - Edit widget title, dimensions on-the-fly
- **Keyboard Shortcuts** - Ctrl+Z (undo), Ctrl+S (save layout), Ctrl+H (history)
- **Storybook Library** - 10+ component stories with interactive documentation
- **Vitest Unit Tests** - Comprehensive test coverage for hooks, utilities, data

## Quick Start

```bash
cd Project1c
npm install
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## Development

### Local Development
```bash
npm run dev          # Start Next.js dev server on port 3000
npm run storybook    # Launch Storybook on port 6006
npm run test         # Run unit tests with Vitest
npm run test:ui      # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### Build for Production
```bash
npm run build        # Build optimized Next.js bundle
npm run build-storybook # Build Storybook as static site
```

## Architecture

### Widget Framework
```
src/lib/widget-framework.tsx
├── registerWidget()      - Register custom widgets
├── getWidgetDefinition() - Retrieve widget by type
├── renderWidget()        - Render widget instance with data
└── getAllWidgets()       - List all registered widgets
```

Each widget implements the `WidgetDefinition<TConfig>` interface:
```typescript
type WidgetDefinition<TConfig = Record<string, unknown>> = {
  type: string;                    // Unique widget identifier
  title: string;                   // Display name
  minWidth: number;                // Minimum grid columns
  minHeight: number;               // Minimum grid rows
  defaultConfig: TConfig;          // Default configuration
  description: string;             // Widget description
  render: (props) => JSX.Element;  // Render function
};
```

### Data Layer
- `src/lib/data.ts` - Mock data generation and refresh
- `src/hooks/useRealtimeData.ts` - Real-time feed hook with 1500ms refresh interval
- `src/hooks/useLayoutHistory.ts` - Layout version management (max 10 versions)

### Theme System
- `src/lib/theme.ts` - Theme definitions and CSS variable application
- `src/components/theme/` - Theme provider and selector components
- `src/components/common/ThemeBuilder.tsx` - Interactive theme customization

### Error Handling
- `src/components/common/ErrorBoundary.tsx` - React Error Boundary with fallback UI
- Widget-level: Errors don't cascade to other widgets
- Global-level: Catches dashboard-level errors

### Keyboard Shortcuts
- **Ctrl+Z** - Revert to previous layout version
- **Ctrl+S** - Open layout manager (export/import)
- **Ctrl+H** - Toggle layout history panel

## Layout Persistence

### Storage Structure
```typescript
// localStorage keys:
meridian-dashboard-layout    // Current layout state
meridian-theme-id            // Selected theme
meridian-layout-history      // Version history (JSON)
meridian-custom-theme        // Custom theme (if saved)
```

### Layout Version History
- Maximum 10 versions maintained
- Automatic timestamps for each version
- Revert to any historical layout
- Clear history when needed

## Component Library (Storybook)

```bash
npm run storybook  # Start Storybook dev server
```

Browse components and their variants:
- Dashboard Command Center (default, mobile, tablet views)
- Theme Selector (meridian & neutral themes)
- Error Boundary (widget & global levels)
- Widget Config modal
- Theme Builder tool
- Layout Manager (import/export)
- History Panel

## Testing

### Unit Tests
```bash
npm run test              # Run all tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:ui           # Interactive UI for test results
```

Test files cover:
- `data.test.ts` - Feed generation and refresh
- `Dashboard.test.tsx` - Component rendering and interactions
- `ThemeSelector.test.tsx` - Theme switching
- `usePersistentGrid.test.ts` - Layout persistence
- `useLayoutHistory.test.ts` - Version history logic

## Performance Optimizations

1. **Component Memoization** - Headers, metadata, and widget items wrapped with React.memo
2. **Callback Memoization** - useCallback for drag handlers, config saves
3. **Derived State** - useMemo for computed values (current layout, shortcuts)
4. **Lazy Widget Loading** - Widgets render on demand (future enhancement)

## Accessibility Features

- WCAG 2.1 AA compliance
- Keyboard-navigable widgets (Tab, Enter, Space)
- ARIA labels for interactive elements
- Focus-visible outlines
- Live region for data status updates
- High contrast theme support
- Semantic HTML structure

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Inspired By

- **Bloomberg Terminal** - Component isolation, keyboard navigation, data normalization
- **Grafana** - Plugin architecture, JSON-based layouts, variable templating
- **Zerodha Kite** - WebSocket-first architecture, minimal bundle size (<300KB initial)
- **Refinitiv Eikon** - Cross-widget linking, multi-monitor support patterns

## Case Study References

See the PART C case studies documentation for detailed architectural decisions:
- Bloomberg's layout persistence and component isolation patterns
- Grafana's plugin architecture and lazy-loading approach
- Zerodha's performance optimization techniques
- Refinitiv's white-label theming and workspace management

## Project Status

✅ Complete (100%)
- Widget framework and registration
- 10 portfolio analytics widgets
- Drag-and-drop layout system
- Layout persistence and versioning
- Theme system and builder
- Error boundaries
- Keyboard shortcuts
- Widget configuration UI
- Layout import/export
- Storybook documentation
- Vitest unit tests

## Future Enhancements

- Real-time WebSocket integration (replace mock data)
- Widget marketplace for third-party extensions
- Multi-monitor layout sync (BroadcastChannel API)
- Advanced charting (Chart.js, Recharts integration)
- Performance monitoring dashboard
- Portfolio analysis algorithms
- Export reports (PDF, Excel)
- Collaborative layouts (real-time sync)

## License

Strictly Private and Confidential - Not for Circulation

