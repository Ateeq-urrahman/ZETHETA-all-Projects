import { calculateCompoundInterest, calculateEmi, calculateSip } from './calculators';

describe('financial calculators', () => {
  it('calculates EMI for amortized loans', () => {
    const result = calculateEmi(800000, 9.5, 60);
    expect(Math.round(result.value)).toBe(16801);
  });

  it('calculates SIP future value with monthly contributions', () => {
    const result = calculateSip(5000, 12, 10);
    expect(Math.round(result.value)).toBe(1161700);
  });

  it('calculates compound interest maturity value', () => {
    const result = calculateCompoundInterest(100000, 10, 8);
    expect(Math.round(result.value)).toBe(214359);
  });

  it('guards invalid calculator inputs', () => {
    expect(calculateEmi(0, 10, 12).value).toBe(0);
    expect(calculateSip(1000, -1, 10).value).toBe(0);
    expect(calculateCompoundInterest(1000, 10, 0).value).toBe(0);
  });
});
