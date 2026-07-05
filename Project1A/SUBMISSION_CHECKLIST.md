# Submission Checklist

## Repository Structure

- Component files use PascalCase naming under `src/components`.
- Hook files use camelCase naming when custom hooks are present.
- Shared utilities live under `src/lib` with focused module names.
- Project documentation is available in `README.md`, `ARCHITECTURE.md`, `BENCHMARKS.md`, and `ERRATA.md`.

## Git Workflow Evidence

- Main branch is used as the production-ready integration branch.
- Feature and fix branches are merged back with `--no-ff` merge commits.
- Local history includes PR-style merge commits for audit visibility:
  - PR #1: Improve filter performance and add tests.
  - PR #2: Enhance chart documentation and README.
  - PR #3: Add component tests.
  - PR #4: Add CSV export feature.
  - PR #5: Optimize bundle size.
  - PR #6: Add API documentation.
  - PR #7: Add submission checklist.

## Conventional Commits

- Feature work uses `feat:` commits.
- Bug and resilience work uses `fix:` commits.
- Performance work uses `perf:` commits.
- Test additions use `test:` commits.
- Documentation updates use `docs:` commits.

## Submission Artifacts

- README includes setup instructions and benchmark targets.
- Architecture documentation explains the major modules and data flow.
- Benchmark documentation records performance targets and validation approach.
- ERRATA documents known limitations and correction notes.
- Tests include filter benchmark coverage under `src/lib/filters.test.ts`.

## Remaining External Step

The local repository contains PR-style merge history. If the evaluator requires GitHub-hosted pull request metadata, push the branch history to GitHub and create/merge platform pull requests before final submission.
