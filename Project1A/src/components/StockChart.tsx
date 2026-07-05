import { useEffect, useMemo, useRef } from 'react';
import { CandlePoint, IndicatorKey, Stock } from '@/lib/types';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';

/**
 * Technical Indicator Calculations
 * Implemented with memoization for performance on large datasets
 * Moving averages cache results to prevent O(n²) recalculation
 */

const getMovingAverage = (points: CandlePoint[], period: number) => {
  const result: { time: string; value: number }[] = [];
  for (let index = 0; index < points.length; index += 1) {
    if (index + 1 < period) continue;
    let sum = 0;
    for (let offset = index + 1 - period; offset <= index; offset += 1) {
      sum += points[offset].close;
    }
    result.push({ time: points[index].time, value: Number((sum / period).toFixed(2)) });
  }
  return result;
};

const getEMA = (points: CandlePoint[], period: number) => {
  const multiplier = 2 / (period + 1);
  const result: { time: string; value: number }[] = [];
  let previous: number | null = null;

  for (let index = 0; index < points.length; index += 1) {
    const close = points[index].close;
    if (previous === null) {
      previous = close;
    } else {
      previous = (close - previous) * multiplier + previous;
    }
    if (index >= period - 1 && previous !== null) {
      result.push({ time: points[index].time, value: Number(previous.toFixed(2)) });
    }
  }

  return result;
};

const getBollingerBands = (points: CandlePoint[], period: number) => {
  const result: { time: string; upper: number; lower: number }[] = [];

  for (let index = period - 1; index < points.length; index += 1) {
    let sum = 0;
    for (let offset = index + 1 - period; offset <= index; offset += 1) {
      sum += points[offset].close;
    }
    const mean = sum / period;
    let variance = 0;
    for (let offset = index + 1 - period; offset <= index; offset += 1) {
      const delta = points[offset].close - mean;
      variance += delta * delta;
    }
    const std = Math.sqrt(variance / period);
    result.push({
      time: points[index].time,
      upper: Number((mean + 2 * std).toFixed(2)),
      lower: Number((mean - 2 * std).toFixed(2)),
    });
  }

  return result;
};

const seriesData = (points: CandlePoint[]) =>
  points.map((point) => ({
    time: point.time,
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
  }));

const volumeData = (points: CandlePoint[]) =>
  points.map((point) => ({ time: point.time, value: point.volume, color: point.close >= point.open ? '#22c55e' : '#f97316' }));

export type StockChartProps = {
  stock: Stock;
  selectedIndicator: IndicatorKey;
  onIndicatorChange: (indicator: IndicatorKey) => void;
};

const indicatorLabels: Record<IndicatorKey, string> = {
  sma20: 'SMA 20',
  sma50: 'SMA 50',
  ema20: 'EMA 20',
  bollinger: 'Bollinger Bands',
  volume: 'Volume',
};

export default function StockChart({ stock, selectedIndicator, onIndicatorChange }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const points = stock.prices;
  const candles = useMemo(() => seriesData(points), [points]);
  const sma20 = useMemo(() => getMovingAverage(points, 20), [points]);
  const sma50 = useMemo(() => getMovingAverage(points, 50), [points]);
  const ema20 = useMemo(() => getEMA(points, 20), [points]);
  const bollinger = useMemo(() => getBollingerBands(points, 20), [points]);
  const volume = useMemo(() => volumeData(points), [points]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { color: '#08101f' },
        textColor: '#f8fafc',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      rightPriceScale: { borderColor: '#1f2937' },
      timeScale: { borderColor: '#1f2937', timeVisible: true, secondsVisible: false },
      crosshair: { mode: CrosshairMode.Normal },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#f97316',
      wickUpColor: '#86efac',
      wickDownColor: '#fb923c',
    });

    const sma20Series = chart.addLineSeries({
      color: '#60a5fa',
      lineWidth: selectedIndicator === 'sma20' ? 3 : 2,
      lineStyle: LineStyle.Solid,
    });

    const sma50Series = chart.addLineSeries({
      color: '#a78bfa',
      lineWidth: selectedIndicator === 'sma50' ? 3 : 2,
      lineStyle: LineStyle.Dashed,
    });

    const ema20Series = chart.addLineSeries({
      color: '#facc15',
      lineWidth: selectedIndicator === 'ema20' ? 3 : 2,
      lineStyle: LineStyle.Dotted,
    });

    const bollingerUpper = chart.addLineSeries({
      color: '#38bdf8',
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
    });

    const bollingerLower = chart.addLineSeries({
      color: '#38bdf8',
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      color: '#64748b',
      priceScaleId: '',
    });

    candleSeries.setData(candles);
    sma20Series.setData(sma20);
    sma50Series.setData(sma50);
    ema20Series.setData(ema20);
    bollingerUpper.setData(bollinger.map((item) => ({ time: item.time, value: item.upper })));
    bollingerLower.setData(bollinger.map((item) => ({ time: item.time, value: item.lower })));
    volumeSeries.setData(volume);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles, bollinger, ema20, selectedIndicator, sma20, sma50, volume]);

  return (
    <div className="panel">
      <div className="chart-header">
        <div>
          <p className="eyebrow">Candlestick chart</p>
          <h2>{stock.symbol} · {stock.name}</h2>
        </div>
        <div className="chart-meta">
          {Object.entries(indicatorLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="button"
              style={{ fontSize: '0.85rem', opacity: selectedIndicator === key ? 1 : 0.72 }}
              onClick={() => onIndicatorChange(key as IndicatorKey)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-shell" ref={chartContainerRef} />
    </div>
  );
}
