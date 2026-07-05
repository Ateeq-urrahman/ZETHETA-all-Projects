import { performance } from 'perf_hooks';
import { generateUniverse } from '../src/lib/data';
import { createStockFilterPredicate } from '../src/lib/filters';

const universe = generateUniverse(5200);
const benchmarkFilters = {
  search: '',
  sector: 'All' as const,
  minMarketCap: 20e9,
  maxPeRatio: 25,
  minDividendYield: 1,
  minAverageVolume: 200000,
  minMomentum: 35,
  minRating: 60,
};

const iterations = 150;
const start = performance.now();
let matched = 0;

for (let index = 0; index < iterations; index += 1) {
  const predicate = createStockFilterPredicate(benchmarkFilters);
  for (let i = 0; i < universe.length; i += 1) {
    if (predicate(universe[i])) {
      matched += 1;
    }
  }
}

const elapsed = performance.now() - start;
console.log(`Benchmark: ${iterations} iterations on ${universe.length} stocks => ${elapsed.toFixed(2)} ms total`);
console.log(`Average filter pass: ${(elapsed / iterations).toFixed(2)} ms`);
console.log(`Average per stock: ${(elapsed / (iterations * universe.length)).toFixed(6)} ms`);
console.log(`Matched rows captured: ${matched}`);
