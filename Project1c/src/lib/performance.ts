import React from 'react';

/**
 * Performance utilities for component memoization and optimization
 */

export const memoizeComponent = <P extends object>(Component: React.ComponentType<P>) => {
  return React.memo(Component, (prevProps, nextProps) => {
    // Custom equality check - return true if props are equal (no re-render)
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
};

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
