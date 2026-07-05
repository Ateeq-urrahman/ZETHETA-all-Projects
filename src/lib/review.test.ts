import { blockCatalog, createBlock } from './blockCatalog';
import { runArchitectureReview, runContentCreatorPanel } from './review';
import { sampleModule } from './sampleModule';

describe('review panels', () => {
  it('passes content review for the starter module', () => {
    const review = runContentCreatorPanel(sampleModule);
    expect(review.verdict).toBe('pass');
    expect(review.score).toBeGreaterThanOrEqual(75);
  });

  it('tracks representation of all supported block types', () => {
    const moduleDraft = {
      ...sampleModule,
      blocks: blockCatalog.map((block) => createBlock(block.type))
    };

    const review = runArchitectureReview(moduleDraft);
    expect(review.verdict).toBe('pass');
    expect(review.findings[0]).toContain('12 of 12');
  });
});
