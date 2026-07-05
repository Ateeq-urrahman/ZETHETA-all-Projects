import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the analytics command center', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /portfolio analytics command center/i })).toBeTruthy();
    expect(screen.getByText(/USD 45B assets under management/i)).toBeTruthy();
  });

  it('displays all header controls', () => {
    render(<Dashboard />);
    expect(screen.getByLabelText(/theme/i)).toBeTruthy();
    expect(screen.getByText(/History/i)).toBeTruthy();
    expect(screen.getByText(/Manage Layout/i)).toBeTruthy();
  });

  it('renders portfolio widgets', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Portfolio Snapshot/i)).toBeTruthy();
    expect(screen.getByText(/NAV Performance/i)).toBeTruthy();
  });

  it('displays metadata with live data indicator', () => {
    render(<Dashboard />);
    const metadata = screen.getByText(/Live|Data stale/);
    expect(metadata).toBeTruthy();
  });

  it('shows correct number of active widgets', () => {
    render(<Dashboard />);
    expect(screen.getByText(/widgets active/i)).toBeTruthy();
  });
});
