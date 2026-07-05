import type { EducationModule } from './types';

export const sampleModule: EducationModule = {
  id: 'eduforge-loan-literacy-001',
  title: 'Borrowing Smarter: EMI, Interest, and Affordability',
  audience: 'First-time salaried borrowers',
  objective: 'Help learners compare a loan by EMI, total interest, tenure, and monthly cash-flow risk.',
  estimatedMinutes: 18,
  updatedAt: '2026-06-13T00:00:00.000Z',
  blocks: [
    {
      id: 'hero-1',
      type: 'hero',
      title: 'Borrowing Smarter',
      content: 'Build confidence before choosing a personal loan, vehicle loan, or education loan.',
      metadata: { eyebrow: 'Credit Readiness' }
    },
    {
      id: 'text-1',
      type: 'richText',
      title: 'What an EMI hides',
      content:
        '<p>An EMI makes repayment predictable, but it can hide the total cost of borrowing. Always compare the monthly amount with the total interest paid across the full tenure.</p>',
      metadata: {}
    },
    {
      id: 'emi-1',
      type: 'emiCalculator',
      title: 'Try the EMI trade-off',
      content: 'Adjust loan amount, rate, and tenure to see monthly affordability.',
      metadata: { principal: 800000, annualRate: 9.5, months: 60 }
    },
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Knowledge check',
      content: 'A longer tenure usually means:',
      metadata: {
        options: [
          { id: 'a', label: 'Lower monthly EMI but higher total interest', isCorrect: true },
          { id: 'b', label: 'Higher monthly EMI and lower interest', isCorrect: false },
          { id: 'c', label: 'No change to loan cost', isCorrect: false }
        ]
      }
    },
    {
      id: 'badge-1',
      type: 'achievementBadge',
      title: 'Affordability Analyst',
      content: 'Learner can explain EMI, tenure, and total interest trade-offs.',
      metadata: { level: 'Gold' }
    }
  ]
};
