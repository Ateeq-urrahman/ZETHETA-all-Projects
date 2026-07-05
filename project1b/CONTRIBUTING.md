# Contributing to LendSwift

Thank you for your interest in contributing to LendSwift! This document provides guidelines and procedures for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report inappropriate behavior to the team

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/lendswift.git
   cd lendswift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

```
feat/feature-name          # New feature
fix/bug-description        # Bug fix
perf/optimization-name     # Performance improvement
docs/documentation-update  # Documentation
test/test-description      # Tests
refactor/code-cleanup      # Code refactoring
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: Performance improvements
- **refactor**: Code changes that neither fix bugs nor add features
- **test**: Adding or updating tests
- **docs**: Documentation changes
- **style**: Changes that don't affect code meaning (formatting, semicolons, etc.)
- **ci**: CI/CD configuration changes

#### Examples
```
feat(form-validation): Add email format validation

- Implement RFC 5322 email validation
- Add unit tests for edge cases
- Update form documentation

Closes #123
```

```
fix(auto-save): Prevent duplicate saves on rapid input

The auto-save hook was not properly debouncing saves,
causing excessive localStorage writes. Fixed by adding
timeout management.

Fixes #456
```

### Pull Request Process

1. **Before submitting PR:**
   - Ensure your code passes linting: `npm run lint`
   - Test your changes locally
   - Update documentation if needed
   - Add tests for new functionality

2. **Create a Pull Request:**
   - Use a descriptive title
   - Reference related issues
   - Describe what changed and why
   - Include before/after screenshots for UI changes

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Related Issues
   Closes #issue-number

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Description of testing performed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

4. **Review Process:**
   - At least 1 code review approval required
   - All conversations must be resolved
   - CI/CD checks must pass

## Code Style Guide

### TypeScript/React

```typescript
// Component naming: PascalCase
export function LoanApplicationStep(): JSX.Element {
  return <div>Step Component</div>;
}

// Hook naming: camelCase with 'use' prefix
export function useAutoSave(formData: FormData): void {
  // Implementation
}

// Constants: UPPER_SNAKE_CASE
export const MAX_LOAN_AMOUNT = 500000;

// Interfaces: PascalCase, prefix with 'I' optional
interface LoanApplicationForm {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
}

// Utility functions: camelCase
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  // Implementation
}
```

### File Organization

```
src/
├── components/
│   ├── LoanApplication.tsx       # Main component
│   ├── steps/                     # Step components
│   └── __tests__/                 # Component tests
├── hooks/
│   ├── useAutoSave.ts            # Custom hook
│   └── __tests__/                 # Hook tests
├── lib/
│   ├── loanForm.ts               # Business logic
│   ├── validation.ts             # Validation rules
│   └── __tests__/                 # Logic tests
└── types/
    └── index.ts                  # Type definitions
```

### Formatting

- **Indentation**: 2 spaces
- **Line Length**: Maximum 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Always include
- **Trailing Commas**: Use in multi-line objects/arrays

### ESLint Configuration

```javascript
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

## Testing Guidelines

### Unit Tests

```typescript
// Example: loanForm.test.ts
describe('calculateMonthlyPayment', () => {
  it('should calculate correct monthly payment', () => {
    const payment = calculateMonthlyPayment(100000, 5, 360);
    expect(payment).toBeCloseTo(536.82, 2);
  });

  it('should handle edge cases', () => {
    expect(calculateMonthlyPayment(0, 5, 360)).toBe(0);
  });
});
```

### Test Coverage Requirements

- Aim for >80% code coverage
- Critical paths require >95% coverage
- All validation logic must be tested

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage report
```

## Documentation Standards

### README Sections

- Overview/description
- Features list
- Quick start guide
- Project structure
- API documentation
- Contributing guidelines
- License

### Code Comments

```typescript
// Use when explaining "why", not "what"
// Bad: Get the value
const val = getData();

// Good: Fetch data from cache to avoid API call
const val = cachedData || await fetchFromAPI();
```

### JSDoc Documentation

```typescript
/**
 * Validates loan application eligibility
 * @param applicant - The applicant information
 * @param loanAmount - Requested loan amount in dollars
 * @returns true if eligible, false otherwise
 * @throws {ValidationError} If required fields are missing
 */
export function isEligible(
  applicant: Applicant,
  loanAmount: number
): boolean {
  // Implementation
}
```

## Performance Guidelines

### Code Optimization

1. **Use React.memo for expensive components**
   ```typescript
   export const FormStep = React.memo(({ step }: Props) => {
     return <div>{step}</div>;
   });
   ```

2. **Implement proper memoization**
   ```typescript
   const validationRules = useMemo(() => ({
     email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
     // ...
   }), []);
   ```

3. **Avoid inline functions in props**
   ```typescript
   // Bad
   <button onClick={() => handleSave()}>Save</button>
   
   // Good
   const handleSaveClick = useCallback(() => handleSave(), []);
   <button onClick={handleSaveClick}>Save</button>
   ```

### Bundle Size

- Monitor bundle size in PRs
- Target: < 150KB (gzip)
- Use dynamic imports for large libraries

## Security Best Practices

1. **Input Validation**
   - Always validate user input
   - Sanitize before storing in localStorage
   - Use TypeScript strict mode

2. **Data Protection**
   - Never log sensitive data
   - Encrypt PII before storage
   - Use HTTPS-only cookies

3. **Dependencies**
   - Keep dependencies updated
   - Review security advisories
   - Use npm audit to check for vulnerabilities

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- MAJOR.MINOR.PATCH (e.g., 1.0.0)
- Breaking changes: increment MAJOR
- New features: increment MINOR
- Bug fixes: increment PATCH

### Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create release tag: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Create GitHub Release with notes

## Reporting Issues

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Open form
2. Enter invalid email
3. Click submit

## Expected Behavior
Error message should appear

## Actual Behavior
Form submits without validation

## Environment
- OS: Windows 10
- Browser: Chrome 120
- Node: 18.16
```

### Feature Request Template

```markdown
## Description
Clear description of the requested feature

## Use Case
Why is this feature needed?

## Implementation Ideas
Suggestions for implementation

## Alternatives
Alternative approaches considered
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## Questions?

- Join our Discord community
- Email: dev@lendswift.com
- Create an issue with the `question` label

---

**Last Updated**: 2026-06-11  
**Version**: 1.0.0
