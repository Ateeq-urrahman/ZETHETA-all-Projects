import StockScreener from '@/components/StockScreener';

export default function Home() {
  return (
    <main className="page-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Zetha Algorithms</p>
          <h1>Real-Time Stock Screener</h1>
          <p className="hero-copy">
            Live price streaming, responsive filtering, and virtualized market insights for 5,000+ instruments.
          </p>
        </div>
      </header>
      <StockScreener />
    </main>
  );
}
