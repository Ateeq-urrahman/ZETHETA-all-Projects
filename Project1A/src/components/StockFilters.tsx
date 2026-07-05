import { ChangeEvent, useEffect, useState } from 'react';
import { FilterOptions, Sector } from '@/lib/types';
import { useDebouncedState } from '@/hooks/useDebouncedState';

type StockFiltersProps = {
  filters: FilterOptions;
  sectors: Sector[];
  onChange: (next: Partial<FilterOptions>) => void;
};

export default function StockFilters({ filters, sectors, onChange }: StockFiltersProps) {
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebouncedState(search, 180);

  useEffect(() => {
    onChange({ search: debouncedSearch });
  }, [debouncedSearch, onChange]);

  return (
    <div className="panel">
      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <p className="eyebrow">Filter engine</p>
          <h2>Screen stocks instantly</h2>
        </div>
      </div>
      <div className="field-group" style={{ marginTop: '1.25rem' }}>
        <div>
          <label htmlFor="search">Search symbol or name</label>
          <input
            id="search"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            placeholder="e.g. TECH, Growth, 120"
          />
        </div>
        <div>
          <label htmlFor="sector">Sector</label>
          <select
            id="sector"
            value={filters.sector}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange({ sector: event.target.value as Sector })}
          >
            <option value="All">All</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="min-marketcap">Min Market Cap ($B)</label>
          <input
            id="min-marketcap"
            type="number"
            value={filters.minMarketCap / 1e9}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ minMarketCap: Number(event.target.value) * 1e9 })
            }
            min={0}
          />
        </div>
        <div>
          <label htmlFor="max-peratio">Max P/E ratio</label>
          <input
            id="max-peratio"
            type="number"
            value={filters.maxPeRatio}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ maxPeRatio: Number(event.target.value) })
            }
            min={0}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="min-dividend">Min Dividend Yield (%)</label>
          <input
            id="min-dividend"
            type="number"
            value={filters.minDividendYield}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ minDividendYield: Number(event.target.value) })
            }
            min={0}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="min-momentum">Min Momentum</label>
          <input
            id="min-momentum"
            type="number"
            value={filters.minMomentum}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ minMomentum: Number(event.target.value) })
            }
            min={0}
            max={100}
          />
        </div>
        <div>
          <label htmlFor="min-volume">Min Avg Volume</label>
          <input
            id="min-volume"
            type="number"
            value={filters.minAverageVolume}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ minAverageVolume: Number(event.target.value) })
            }
            min={0}
          />
        </div>
        <div>
          <label htmlFor="min-rating">Min Analyst Rating</label>
          <input
            id="min-rating"
            type="number"
            value={filters.minRating}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange({ minRating: Number(event.target.value) })
            }
            min={0}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}

StockFilters.Root = StockFilters;
