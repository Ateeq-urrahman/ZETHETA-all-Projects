import { blockCatalog } from './blockCatalog';
import type { BoardReview, EducationModule } from './types';

export function runContentCreatorPanel(module: EducationModule): BoardReview {
  const hasQuiz = module.blocks.some((block) => block.type === 'quiz');
  const hasCalculator = module.blocks.some((block) => block.type.includes('Calculator') || block.type === 'compoundInterest');
  const hasPlainTitles = module.blocks.every((block) => block.title.trim().length >= 4);
  const score = [hasQuiz, hasCalculator, hasPlainTitles, module.blocks.length >= 6].filter(Boolean).length * 25;

  return {
    name: 'Content Creator Panel',
    verdict: score >= 75 ? 'pass' : score >= 50 ? 'watch' : 'fail',
    score,
    findings: [
      hasQuiz ? 'Knowledge checks are available.' : 'Add at least one quiz block.',
      hasCalculator ? 'Interactive financial practice is present.' : 'Add EMI, SIP, or compound interest practice.',
      hasPlainTitles ? 'Block titles are editorially scannable.' : 'Some block titles need clearer labels.',
      module.blocks.length >= 6 ? 'Module has enough learning depth.' : 'Add more blocks before publishing.'
    ]
  };
}

export function runArchitectureReview(module: EducationModule): BoardReview {
  const uniqueTypes = new Set(module.blocks.map((block) => block.type));
  const portable = module.blocks.every((block) => block.id && block.type && typeof block.metadata === 'object');
  const coverage = Math.round((uniqueTypes.size / blockCatalog.length) * 100);
  const score = Math.min(100, Math.round((coverage + (portable ? 100 : 0) + (module.blocks.length <= 50 ? 100 : 70)) / 3));

  return {
    name: 'Technical Architecture Review Board',
    verdict: score >= 85 ? 'pass' : score >= 65 ? 'watch' : 'fail',
    score,
    findings: [
      `${uniqueTypes.size} of ${blockCatalog.length} block types are represented in this module.`,
      portable ? 'JSON schema is portable across backend services.' : 'Some blocks are missing portable fields.',
      module.blocks.length <= 50 ? 'Canvas remains within operational performance limits.' : 'Consider splitting very large modules.'
    ]
  };
}
