# Contributing Guide

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`

3. **Run Tests**
   ```bash
   npm run test           # Watch mode
   npm run test:coverage  # With coverage
   npm run test:ui        # Interactive UI
   ```

4. **Browse Components**
   ```bash
   npm run storybook
   ```
   Navigate to `http://localhost:6006`

## Code Style & Conventions

### React Components
- Use functional components with hooks
- Wrap reusable components with `React.memo` for performance
- Add `displayName` to memoized components for debugging
- Use TypeScript for type safety

```typescript
// ✅ Good
const MyComponent = memo(() => {
  return <div>Component</div>;
});

MyComponent.displayName = 'MyComponent';

// ❌ Avoid
export default () => <div>Anonymous</div>;
```

### Hooks
- Custom hooks should start with `use` prefix
- List all dependencies in dependency arrays
- Return stable references when possible

```typescript
// ✅ Good
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// ❌ Avoid
const handleClick = () => {
  console.log('Clicked');
};
```

### Styling
- Use CSS custom properties for themes: `var(--theme-accent)`
- Use BEM for class naming: `dashboard-grid`, `dashboard-grid-item`
- Ensure responsive design with mobile-first approach

```css
/* ✅ Good */
.widget-handle {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
}

@media (max-width: 768px) {
  .widget-handle {
    padding: 0.5rem;
  }
}

/* ❌ Avoid */
.widget_handle { ... }      /* Avoid underscores */
background: #0f2a47;        /* Avoid hardcoded colors */
```

## Adding New Widgets

### 1. Define Widget Types
Update `src/lib/types.ts` if new data types are needed.

### 2. Generate Mock Data
Add to `src/lib/data.ts`:
```typescript
export const createInitialFeed = (): RealTimeFeed => {
  return {
    // ... new fields
    myNewMetric: []
  };
};
```

### 3. Register Widget
Add to `src/lib/widget-definitions.tsx`:
```typescript
registerWidget({
  type: 'my-widget',
  title: 'My Widget',
  minWidth: 1,
  minHeight: 1,
  defaultConfig: {},
  description: 'Widget description',
  render: ({ data, instance, onConfigure }) => {
    const feed = data as RealTimeFeed;
    return (
      <div className="widget-content">
        {/* Widget UI */}
      </div>
    );
  }
});
```

### 4. Create Tests
Add to `src/lib/widget-definitions.test.tsx`:
```typescript
describe('My Widget', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

### 5. Create Storybook Story
Add to `src/lib/widget-definitions.stories.tsx`:
```typescript
export const MyWidget: Story = {
  render: () => <MyWidgetPreview />
};
```

## Updating Themes

### Adding a New Theme
1. Update `src/lib/types.ts` - Ensure `ThemePalette` type is complete
2. Add theme to `src/lib/theme.ts`:
```typescript
export const themes = {
  // ... existing themes
  myTheme: {
    id: 'my-theme',
    label: 'My Theme',
    palette: {
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      // ... rest of palette
    }
  }
};
```

### Testing Themes
- Use Storybook with ThemeProvider decorator
- Test in both light and dark modes
- Verify WCAG AA contrast ratios
- Check accessibility with screen readers

## Performance Optimization

### Before Optimization
```bash
npm run build  # Check bundle size
npm run test:coverage  # Identify dead code
```

### Optimization Techniques
1. **Memoization**
   ```typescript
   const Header = memo(({ title }) => <h1>{title}</h1>);
   ```

2. **Code Splitting**
   ```typescript
   const Widget = lazy(() => import('./Widget'));
   ```

3. **Lazy Loading**
   ```typescript
   useEffect(() => {
     if (widgetVisible) {
       loadWidgetData();
     }
   }, [widgetVisible]);
   ```

## Testing Guidelines

### Unit Tests
```typescript
describe('MyComponent', () => {
  it('renders with correct props', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeTruthy();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(/* assertion */);
  });
});
```

### Coverage Requirements
- Components: ≥80%
- Hooks: ≥90%
- Utilities: ≥95%

## Accessibility Checklist

Before submitting:
- [ ] Tab navigation works correctly
- [ ] Focus indicators visible
- [ ] ARIA labels present on interactive elements
- [ ] Keyboard shortcuts documented
- [ ] Color contrast passes WCAG AA
- [ ] Semantic HTML used
- [ ] No keyboard traps
- [ ] Screen reader tested (NVDA/JAWS)

## Commit Guidelines

Use conventional commits:
```
feat: add new portfolio widget
fix: resolve drag-drop issue on mobile
test: add widget configuration tests
docs: update architecture guide
perf: optimize component re-renders
refactor: simplify theme system
```

## Pull Request Process

1. **Branch Naming**
   - `feature/widget-name`
   - `fix/issue-description`
   - `docs/documentation-update`

2. **PR Description**
   - What changes were made?
   - Why were they needed?
   - How can this be tested?

3. **Checklist**
   - [ ] Tests pass (`npm run test`)
   - [ ] No TypeScript errors (`npm run build`)
   - [ ] Storybook updated if needed
   - [ ] Documentation updated
   - [ ] Accessibility verified

4. **Review Process**
   - Code review for style compliance
   - Testing verification
   - Performance impact assessment

## Debugging

### React DevTools
```bash
# Install React DevTools extension
# Use Profiler tab to identify re-render issues
```

### Console Logging
```typescript
// ✅ Use for development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', value);
}

// ❌ Never commit
console.log('TODO: remove this log');
```

### Performance Profiling
```typescript
// Measure component render time
console.time('ComponentName');
// ... code to measure
console.timeEnd('ComponentName');
```

## Common Issues & Solutions

### Issue: Widget not rendering
**Solution**: Check widget registration in `registerDefaultWidgets()`

### Issue: Theme not updating
**Solution**: Verify `applyThemeVariables()` called and CSS properties set

### Issue: Layout not persisting
**Solution**: Check localStorage quota and browser permissions

### Issue: Tests failing in CI
**Solution**: Ensure mock localStorage implemented in test setup

## Release Process

1. **Bump Version** in `package.json`
2. **Update CHANGELOG** with new features
3. **Run Tests** - `npm run test`
4. **Build** - `npm run build`
5. **Build Storybook** - `npm run build-storybook`
6. **Create Release** in GitHub

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vitest Documentation](https://vitest.dev)
- [Storybook Guide](https://storybook.js.org/docs/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Security: security@meridian.capital
