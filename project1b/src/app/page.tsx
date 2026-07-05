'use client';

import LoanApplication from '@/components/LoanApplication';

export default function Home() {
  return (
    <main className="page-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">LendSwift</p>
          <h1>Loan Application Simulator</h1>
          <p className="hero-copy">
            A mobile-first, accessible loan application experience optimized for tier-2 and tier-3 connectivity.
          </p>
        </div>
      </header>
      <LoanApplication />
    </main>
  );
}
