'use client';

import React from 'react';
import { registerWidget } from './widget-framework';
import type { WidgetInstance, WidgetDefinition, RealTimeFeed } from './types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const shortPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

const createSparkline = (series: Array<{ timestamp: number; value: number }>) => (
  <div className="chart-sparkline" role="img" aria-label="Performance sparkline">
    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%' }}>
      {series.map((point) => (
        <span
          key={point.timestamp}
          style={{
            display: 'inline-block',
            width: '100%',
            height: `${Math.max(10, Math.min(100, (point.value % 100) + 10))}%`,
            backgroundColor: 'var(--theme-accent)',
            borderRadius: '999px'
          }}
        />
      ))}
    </div>
  </div>
);

const createGridMatrix = (matrix: number[][]) => (
  <div className="chart-grid" role="table">
    {matrix.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: '4px' }}>
        {row.map((value, colIndex) => (
          <div
            key={colIndex}
            role="cell"
            style={{
              flex: 1,
              minHeight: 20,
              backgroundColor: `rgba(79, 209, 197, ${0.18 + Math.abs(value) * 0.6})`,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--theme-text)',
              fontSize: '0.75rem'
            }}
          >
            {value.toFixed(2)}
          </div>
        ))}
      </div>
    ))}
  </div>
);

function statLabel(label: string, value: string) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const renderer = <TConfig extends Record<string, unknown>>(
  title: string,
  content: (props: {
    feed: RealTimeFeed;
    instance: WidgetInstance;
  }) => React.ReactNode
): WidgetDefinition<TConfig> => ({
  type: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  minWidth: 1,
  minHeight: 1,
  defaultConfig: {} as TConfig,
  description: `${title} widget`,
  render: ({ instance, data, onConfigure }) => {
    const feed = data as RealTimeFeed;
    return (
      <div className="widget-content">
        <div className="widget-summary">
          <span className="widget-tag">Live</span>
          <button type="button" onClick={onConfigure} style={{ justifySelf: 'end', background: 'none', border: 'none', color: 'var(--theme-muted)', cursor: 'pointer' }}>
            Configure
          </button>
        </div>
        {content({ feed, instance })}
      </div>
    );
  }
});

export function registerDefaultWidgets() {
  registerWidget<{}>({
    type: 'portfolio-summary',
    title: 'Portfolio Snapshot',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Summary of AUM, allocation and NAV movement.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Portfolio</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {statLabel('AUM', formatCurrency(feed.portfolio.totalAUM))}
          {statLabel('NAV change', shortPercent(feed.portfolio.navChangePct))}
          {statLabel('VaR 1D', shortPercent(feed.portfolio.varOneDay))}
          {statLabel('Equity allocation', `${feed.portfolio.equityAllocation.toFixed(1)}%`)}
          {statLabel('Fixed income allocation', `${feed.portfolio.fixedIncomeAllocation.toFixed(1)}%`)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'nav-performance',
    title: 'NAV Performance',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'NAV performance over time with benchmark comparison.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Performance</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createSparkline(feed.performanceSeries)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'var-gauge',
    title: 'Value at Risk',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'One-day VaR gauge and risk exposure quick view.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Risk</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <strong>{feed.portfolio.varOneDay.toFixed(2)}%</strong>
              <p style={{ marginTop: 8, color: 'var(--theme-muted)' }}>Daily portfolio VaR at 95% confidence.</p>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: '6px solid var(--theme-accent)', display: 'grid', placeItems: 'center' }}>
              <span>{Math.round(feed.portfolio.varOneDay)}%</span>
            </div>
          </div>
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'drawdown-analysis',
    title: 'Drawdown Analysis',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Review portfolio drawdowns across cycles.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Analysis</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createSparkline(feed.drawdownSeries)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'correlation-matrix',
    title: 'Correlation Matrix',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Heatmap of correlations across major risk factors and sectors.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Correlation</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createGridMatrix(feed.correlationMatrix)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'brinson-attribution',
    title: 'Brinson Attribution',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Attribution analysis against benchmark and regions.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Attribution</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {feed.attribution.map((item) => (
              <div key={item.bucket} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.bucket}</span>
                <strong>{shortPercent(item.contribution / 100)}</strong>
              </div>
            ))}
          </div>
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'risk-exposure',
    title: 'Risk Exposure',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Factor exposure distribution and concentration insights.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Exposure</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {feed.exposure.map((item) => (
              <div key={item.factor} style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--theme-muted)' }}>{item.factor}</span>
                <div style={{ height: 10, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
                  <div style={{ width: `${item.weight}%`, height: '100%', background: 'var(--theme-accent)', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'liquidity-timeline',
    title: 'Liquidity Timeline',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Liquidity profile across the business cycle.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Liquidity</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createSparkline(feed.liquidity)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'holdings-heatmap',
    title: 'Holdings Heatmap',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Overlay of holdings intensity across themes and sectors.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Holdings</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createGridMatrix(feed.heatmap)}
        </div>
      );
    }
  });

  registerWidget<{}>({
    type: 'benchmark-comparison',
    title: 'Benchmark Spread',
    minWidth: 1,
    minHeight: 1,
    defaultConfig: {},
    description: 'Spread versus benchmark and relative performance drivers.',
    render: ({ data, onConfigure }) => {
      const feed = data as RealTimeFeed;
      return (
        <div className="widget-content">
          <div className="widget-summary">
            <span className="widget-tag">Benchmark</span>
            <button type="button" onClick={onConfigure}>Configure</button>
          </div>
          {createSparkline(feed.benchmarkSpread)}
        </div>
      );
    }
  });
}
