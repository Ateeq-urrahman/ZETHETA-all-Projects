# Architecture - project1b: LendSwift Loan Application Wizard

## System Overview

LendSwift is a multi-step loan application platform with intelligent form management, real-time validation, and automatic state persistence. Built with Next.js 14 and React 18, it streamlines the loan origination process.

```
┌──────────────────────────────────────────────────────┐
│         Loan Application Wizard UI                    │
│    (React Components with Step Navigation)            │
└────────────────┬─────────────────────────────────────┘
                 │
      ┌──────────┴──────────┬──────────┐
      │                     │          │
  ┌───▼────┐          ┌─────▼────┐  ┌─▼────────┐
  │ Step 1 │          │  Step 2  │  │ Step N   │
  │Personal│          │Financial │  │ Review   │
  │ Info   │          │  Details │  │ & Submit │
  └───┬────┘          └─────┬────┘  └─┬────────┘
      │                     │         │
      └──────────┬──────────┴─────────┘
                 │
      ┌──────────▼────────────────────┐
      │  Form State Management        │
      │  (useAutoSave Hook)           │
      │  - State persistence          │
      │  - Auto-save to storage       │
      │  - Form recovery              │
      └──────────┬────────────────────┘
                 │
      ┌──────────▼────────────────────┐
      │  Validation Layer             │
      │  (loanForm.ts)                │
      │  - Field validation           │
      │  - Cross-field checks         │
      │  - Eligibility rules          │
      └──────────┬────────────────────┘
                 │
      ┌──────────▼────────────────────┐
      │  Data Persistence Layer       │
      │  - localStorage (client)      │
      │  - API endpoints (server)     │
      │  - Data encryption            │
      └───────────────────────────────┘
```

## Core Modules

### Components Layer
**Location**: `src/components/`

- **LoanApplication.tsx**: Main multi-step wizard component
  - Step tracking and navigation
  - Progress indicator
  - Form state orchestration
  - Error handling and recovery

### Form Management
**Location**: `src/lib/` and `src/hooks/`

- **loanForm.ts**: Form configuration and validation logic
  - Field definitions for each step
  - Validation rules (required, format, range)
  - Eligibility determination algorithm
  - Loan calculation logic (APR, monthly payment)

- **useAutoSave.ts**: Custom hook for form persistence
  - Automatic saving at specified intervals (2 seconds default)
  - Graceful error handling for storage failures
  - Form recovery on session restoration
  - Conflict resolution for concurrent saves

### State Management
- Form data stored in component state
- Auto-save to localStorage (browser storage)
- Optional Redux/Context for global state (future enhancement)

## Data Model

### Loan Application Entity
```typescript
interface LoanApplication {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn: string; // Masked in storage
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Financial Information
  financialInfo: {
    annualIncome: number;
    employmentStatus: 'employed' | 'self-employed' | 'retired' | 'unemployed';
    employer: string;
    loanAmount: number;
    loanPurpose: string;
    existingDebts: Debt[];
    creditScore: number; // Range: 300-850
  };
  
  // Loan Details
  loanDetails: {
    loanType: 'personal' | 'auto' | 'home' | 'business';
    term: number; // months
    rate: number; // APR
    monthlyPayment: number;
  };
  
  // Application Status
  status: 'draft' | 'submitted' | 'pending_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

## Form Workflow

### Multi-Step Process
1. **Step 1: Personal Information**
   - Name, email, phone
   - Date of birth, SSN
   - Address

2. **Step 2: Employment**
   - Employment status
   - Employer information
   - Annual income

3. **Step 3: Financial Profile**
   - Existing debts
   - Monthly expenses
   - Credit score (retrieved from service)

4. **Step 4: Loan Details**
   - Loan type and amount
   - Desired term
   - Purpose

5. **Step 5: Review & Submit**
   - Summary of all information
   - Disclosures and agreements
   - Final submission

## Validation Strategy

### Field-Level Validation
- Real-time validation as user types
- Visual feedback (error messages, field highlighting)
- Inline help text for complex fields

### Step-Level Validation
- All required fields in step must be valid before proceeding
- Cross-field validation (e.g., loan amount vs. income)
- Eligibility checks based on income and credit

### Application-Level Validation
- Overall eligibility determination
- Fraud detection rules
- Compliance checks

## Auto-Save Implementation

### Save Triggers
1. **Time-based**: Auto-save every 2 seconds
2. **Event-based**: Save on field blur
3. **Action-based**: Save before navigation

### Storage Strategy
```
Storage Hierarchy:
1. localStorage (primary) - Fast, persistent
2. sessionStorage (fallback) - Session-only
3. Server API (future) - Encrypted, secure

Storage Format:
{
  "loanapp_draft": {
    "version": 1,
    "data": {...},
    "timestamp": 1234567890,
    "hash": "checksum"
  }
}
```

### Error Handling
- Graceful degradation if storage unavailable
- Retry logic with exponential backoff
- User notification for critical failures

## Eligibility Engine

### Minimum Requirements
- Age: 18+ years
- Income: $20,000+ annually
- Credit Score: 600+ (varies by loan type)
- Debt-to-Income Ratio: <50%

### Scoring Algorithm
```
Score = (Income Factor) + (Credit Factor) + (Debt Factor) - (Risk Factor)
- Income Factor: 0-40 points
- Credit Factor: 0-35 points
- Debt Factor: 0-20 points
- Risk Factor: 0-15 points

Final Score: 0-100
- 80+: Excellent - Auto-approved at best rates
- 60-79: Good - Standard approval process
- 40-59: Fair - Manual review required
- <40: Poor - Likely rejection
```

## Security Considerations

### Data Protection
- SSN masked in storage (display as XXX-XX-1234)
- Sensitive fields encrypted before storage
- HTTPS only for data transmission
- Content Security Policy headers

### Input Validation
- XSS prevention via React escaping
- SQL injection prevention (parameterized queries)
- CSRF token validation
- Rate limiting on API endpoints

### Privacy Compliance
- GDPR-compliant data handling
- CCPA opt-in for marketing
- PII encryption at rest
- Audit logs for data access

## Testing Strategy

### Unit Tests (Planned)
- Validation rule correctness
- Eligibility algorithm accuracy
- Loan calculation precision

### Integration Tests (Planned)
- Multi-step form flow
- Auto-save functionality
- Data persistence verification

### E2E Tests (Planned)
- Complete application submission
- Error recovery scenarios
- Cross-browser compatibility

## Deployment Architecture

### Environment Setup
```
Development: http://localhost:3000
Staging: https://staging.lendswift.app
Production: https://app.lendswift.com
```

### Environment Variables
```
NEXT_PUBLIC_API_ENDPOINT=https://api.lendswift.com
NEXT_PUBLIC_AUTO_SAVE_INTERVAL=2000
ENCRYPTION_KEY=<secure-key>
DATABASE_URL=<database-connection>
```

## Performance Optimization

### Client-side
- Code splitting for multi-step form
- Lazy loading of validation library
- Debounced auto-save (prevents excessive writes)

### Server-side (Future)
- Database indexing on application status
- Caching frequently accessed data
- Load balancing across regions

## Scalability Roadmap

### Phase 1 (Current)
- Single-server deployment
- localStorage-based persistence
- Manual review workflows

### Phase 2 (Q3 2026)
- Server-side persistence
- Integration with credit check services
- Automated approval workflows

### Phase 3 (Q4 2026)
- Microservices architecture
- Event-driven processing
- Real-time dashboard analytics

## Dependencies & Versions
- React: 18.2+
- Next.js: 14+
- TypeScript: 5+
- Zod or Yup: Latest (validation library)

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-06-11  
**Maintainer**: Development Team
