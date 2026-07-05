import type { CalculatorResult } from './types';

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export function formatCurrency(value: number) {
  return rupeeFormatter.format(Math.round(value));
}

export function calculateEmi(principal: number, annualRate: number, months: number): CalculatorResult {
  if (principal <= 0 || annualRate < 0 || months <= 0) {
    return { label: 'Monthly EMI', value: 0, formatted: formatCurrency(0) };
  }

  const monthlyRate = annualRate / 12 / 100;
  const value =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  return { label: 'Monthly EMI', value, formatted: formatCurrency(value) };
}

export function calculateSip(monthlyInvestment: number, annualReturn: number, years: number): CalculatorResult {
  if (monthlyInvestment <= 0 || annualReturn < 0 || years <= 0) {
    return { label: 'Future Value', value: 0, formatted: formatCurrency(0) };
  }

  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  const value =
    monthlyRate === 0
      ? monthlyInvestment * months
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  const roundedValue = Math.round(value / 100) * 100;

  return { label: 'Future Value', value: roundedValue, formatted: formatCurrency(roundedValue) };
}

export function calculateCompoundInterest(principal: number, annualRate: number, years: number): CalculatorResult {
  if (principal <= 0 || annualRate < 0 || years <= 0) {
    return { label: 'Maturity Value', value: 0, formatted: formatCurrency(0) };
  }

  const value = principal * Math.pow(1 + annualRate / 100, years);
  return { label: 'Maturity Value', value, formatted: formatCurrency(value) };
}
