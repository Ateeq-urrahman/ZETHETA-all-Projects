export type LoanType = 'Personal' | 'Home' | 'Business';
export type EmploymentType = 'Salaried' | 'Self-Employed' | 'Business Owner';
export type Gender = 'Male' | 'Female' | 'Other';
export type Relationship = 'Spouse' | 'Parent' | 'Sibling' | 'Business Partner';

export interface LoanFormData {
  loanType: LoanType;
  loanAmount: string;
  loanTenure: string;
  loanPurpose: string;
  referralCode: string;

  fullName: string;
  dob: string;
  gender: Gender;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  email: string;
  mobile: string;
  alternateMobile: string;

  panNumber: string;
  panVerified: boolean;
  aadhaarNumber: string;
  aadhaarVerified: boolean;
  aadhaarConsent: boolean;
  voterId: string;
  passportNumber: string;

  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  city: string;
  state: string;
  residenceType: string;
  rentAmount: string;
  yearsAtCurrentAddress: string;
  previousAddress: string;
  sameAsPermanentAddress: boolean;
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentPinCode: string;
  permanentCity: string;
  permanentState: string;

  employmentType: EmploymentType;
  companyName: string;
  designation: string;
  monthlyNetSalary: string;
  experienceYears: string;

  businessName: string;
  businessType: string;
  annualTurnover: string;
  yearsInBusiness: string;
  monthlyIncome: string;
  gstNumber: string;
  officeAddress: string;

  coApplicantName: string;
  coApplicantRelationship: Relationship;
  coApplicantPAN: string;
  coApplicantIncome: string;
  coApplicantConsent: boolean;

  documents: Record<string, string>;
  signatureDataUrl: string;

  consentAccuracy: boolean;
  consentCreditScore: boolean;
  consentTerms: boolean;
  consentCommunications: boolean;
}

export interface ValidationErrors {
  [field: string]: string;
}

export const initialLoanFormData: LoanFormData = {
  loanType: 'Personal',
  loanAmount: '',
  loanTenure: '',
  loanPurpose: '',
  referralCode: '',

  fullName: '',
  dob: '',
  gender: 'Male',
  maritalStatus: 'Single',
  fatherName: '',
  motherName: '',
  email: '',
  mobile: '',
  alternateMobile: '',

  panNumber: '',
  panVerified: false,
  aadhaarNumber: '',
  aadhaarVerified: false,
  aadhaarConsent: false,
  voterId: '',
  passportNumber: '',

  addressLine1: '',
  addressLine2: '',
  pinCode: '',
  city: '',
  state: '',
  residenceType: 'Owned',
  rentAmount: '',
  yearsAtCurrentAddress: '',
  previousAddress: '',
  sameAsPermanentAddress: true,
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentPinCode: '',
  permanentCity: '',
  permanentState: '',

  employmentType: 'Salaried',
  companyName: '',
  designation: '',
  monthlyNetSalary: '',
  experienceYears: '',

  businessName: '',
  businessType: '',
  annualTurnover: '',
  yearsInBusiness: '',
  monthlyIncome: '',
  gstNumber: '',
  officeAddress: '',

  coApplicantName: '',
  coApplicantRelationship: 'Spouse',
  coApplicantPAN: '',
  coApplicantIncome: '',
  coApplicantConsent: false,

  documents: {},
  signatureDataUrl: '',

  consentAccuracy: false,
  consentCreditScore: false,
  consentTerms: false,
  consentCommunications: false,
};

const PIN_LOOKUP: Record<string, { city: string; state: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
};

export function maskPII(value: string) {
  if (!value) return '';
  const length = value.length;
  if (length <= 4) return value;
  return `${'*'.repeat(length - 4)}${value.slice(-4)}`;
}

export function formatIndianNumber(value: number) {
  const rounded = Math.round(value);
  const raw = String(rounded);
  if (raw.length <= 3) return raw;
  const lastThree = raw.slice(-3);
  const rest = raw.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${lastThree}`;
}

export function formatCurrency(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(parsed) || parsed === 0) return '';
  return `₹${formatIndianNumber(parsed)}`;
}

export function getLoanLimits(type: LoanType) {
  if (type === 'Personal') return { min: 50000, max: 1000000 };
  if (type === 'Home') return { min: 50000, max: 10000000 };
  return { min: 50000, max: 5000000 };
}

export function getTenureRange(type: LoanType) {
  if (type === 'Personal') return { min: 12, max: 60 };
  if (type === 'Home') return { min: 60, max: 360 };
  return { min: 12, max: 120 };
}

export function getPurposeOptions(type: LoanType) {
  if (type === 'Personal') return ['Medical', 'Education', 'Wedding', 'Travel', 'Cashflow'];
  if (type === 'Home') return ['Purchase', 'Construction', 'Renovation', 'Refinance'];
  return ['Working Capital', 'Inventory', 'Expansion', 'Equipment'];
}

export function getEmploymentDocuments(type: EmploymentType) {
  if (type === 'Salaried') return ['Salary Slips', 'Bank Statements'];
  if (type === 'Self-Employed') return ['ITR', 'Bank Statements'];
  return ['GST Returns', 'Business Registration', 'Bank Statements'];
}

export function getLoanDocumentRequirements(data: LoanFormData) {
  const docs: Array<{ key: string; label: string; required: boolean; accepted: string; maxSizeMB: number }> = [
    { key: 'PAN Card Copy', label: 'PAN Card Copy', required: !data.panVerified, accepted: '.pdf,.jpg,.jpeg,.png', maxSizeMB: 5 },
    { key: 'Aadhaar Front', label: 'Aadhaar Front', required: true, accepted: '.pdf,.jpg,.jpeg,.png', maxSizeMB: 5 },
    { key: 'Aadhaar Back', label: 'Aadhaar Back', required: true, accepted: '.pdf,.jpg,.jpeg,.png', maxSizeMB: 5 },
    { key: 'Bank Statements', label: 'Bank Statements (Last 6 months)', required: true, accepted: '.pdf', maxSizeMB: 10 },
    { key: 'Photograph', label: 'Passport Size Photograph', required: true, accepted: '.jpg,.jpeg,.png', maxSizeMB: 2 },
  ];

  if (data.employmentType === 'Salaried') {
    docs.push({ key: 'Salary Slips', label: 'Salary Slips (Last 3 months)', required: true, accepted: '.pdf', maxSizeMB: 5 });
  }

  if (data.employmentType !== 'Salaried') {
    docs.push({ key: 'ITR', label: 'ITR (Last 2 years)', required: true, accepted: '.pdf', maxSizeMB: 5 });
  }

  if (data.loanType === 'Home') {
    docs.push({ key: 'Property Documents', label: 'Property Documents', required: true, accepted: '.pdf', maxSizeMB: 10 });
  }

  if (data.loanType === 'Business') {
    docs.push({ key: 'Business Registration', label: 'Business Registration Certificate', required: true, accepted: '.pdf', maxSizeMB: 5 });
    docs.push({ key: 'GST Returns', label: 'GST Returns (Last 4 quarters)', required: true, accepted: '.pdf', maxSizeMB: 5 });
  }

  return docs;
}

export function isCoApplicantRequired(data: LoanFormData) {
  const amount = Number(data.loanAmount);
  if (data.loanType === 'Home') return true;
  if (data.loanType === 'Personal') return amount > 500000;
  if (data.loanType === 'Business') return amount > 2000000;
  return false;
}

export function getInterestRate(data: LoanFormData) {
  const base = data.loanType === 'Personal' ? 0.12 : data.loanType === 'Home' ? 0.08 : 0.14;
  const amount = Number(data.loanAmount);
  const tenure = Number(data.loanTenure);
  let rate = base;
  if (amount > 2000000) rate += 0.01;
  if (tenure > 180) rate += 0.005;
  const age = getApplicantAge(data.dob);
  if (age >= 50) rate += 0.01;
  return Math.min(rate, 0.185);
}

export function calculateEMI(principal: number, months: number, annualRate: number) {
  if (!principal || !months || !annualRate) return 0;
  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

export function getApplicantAge(dob: string) {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function getMaxAllowedTenure(data: LoanFormData) {
  const range = getTenureRange(data.loanType);
  const age = getApplicantAge(data.dob);
  if (!age) return range.max;
  const yearsLeft = Math.max(0, 65 - age);
  const maxByAge = yearsLeft * 12;
  return Math.min(range.max, maxByAge || range.max);
}

export function validateStep(step: number, data: LoanFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const amount = Number(data.loanAmount);
  const tenure = Number(data.loanTenure);
  const loanLimits = getLoanLimits(data.loanType);
  const tenureRange = getTenureRange(data.loanType);

  if (step === 1) {
    if (!data.loanType) errors.loanType = 'Select a loan type';
    if (!data.loanAmount) errors.loanAmount = 'Enter the loan amount';
    else if (Number.isNaN(amount) || amount < loanLimits.min || amount > loanLimits.max) {
      errors.loanAmount = `Enter INR ${formatIndianNumber(loanLimits.min)} to INR ${formatIndianNumber(loanLimits.max)}`;
    }
    if (!data.loanTenure) errors.loanTenure = 'Select a tenure';
    else if (Number.isNaN(tenure) || tenure < tenureRange.min || tenure > getMaxAllowedTenure(data)) {
      errors.loanTenure = `Choose between ${tenureRange.min} and ${getMaxAllowedTenure(data)} months`;
    }
    if (!data.loanPurpose) errors.loanPurpose = 'Choose a loan purpose';
    if (data.referralCode && !/^[a-zA-Z0-9]{6,10}$/.test(data.referralCode)) {
      errors.referralCode = 'Referral code must be 6–10 alphanumeric characters';
    }
  }

  if (step === 2) {
    if (!data.fullName) errors.fullName = 'Enter your full name';
    else if (!/^[A-Za-z. ]{2,100}$/.test(data.fullName)) {
      errors.fullName = 'Name may only contain letters, spaces, and periods';
    }
    if (!data.dob) errors.dob = 'Enter your date of birth';
    else {
      const age = getApplicantAge(data.dob);
      if (age < 21 || age > 65) errors.dob = 'Applicant age must be 21–65 years';
    }
    if (!data.gender) errors.gender = 'Select a gender';
    if (!data.maritalStatus) errors.maritalStatus = 'Select marital status';
    if (!data.fatherName) errors.fatherName = 'Enter father’s name';
    if (!data.motherName) errors.motherName = 'Enter mother’s name';
    if (!data.email) errors.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!data.mobile) errors.mobile = 'Enter your mobile number';
    else if (!/^[6-9][0-9]{9}$/.test(data.mobile)) {
      errors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (data.alternateMobile && data.alternateMobile === data.mobile) {
      errors.alternateMobile = 'Alternate number must differ from primary mobile';
    }
  }

  if (step === 3) {
    if (!data.panNumber) errors.panNumber = 'Enter your PAN number';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber)) {
      errors.panNumber = 'PAN must match AAAAA9999A format';
    }
    if (!data.aadhaarNumber) errors.aadhaarNumber = 'Enter your Aadhaar number';
    else if (!/^[0-9]{12}$/.test(data.aadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar must be exactly 12 digits';
    }
    if (!data.aadhaarConsent) errors.aadhaarConsent = 'Consent is required to proceed';
    if (data.voterId && !/^[A-Za-z]{3}[0-9]{7}$/.test(data.voterId)) {
      errors.voterId = 'Voter ID must be 3 letters followed by 7 digits';
    }
    if (data.passportNumber && !/^[A-Za-z][0-9]{7}$/.test(data.passportNumber)) {
      errors.passportNumber = 'Passport must be 1 letter followed by 7 digits';
    }
    if (data.loanType === 'Home' && Number(data.loanAmount) > 5000000 && !data.passportNumber) {
      errors.passportNumber = 'Passport is required for Home Loans over INR 50L';
    }
  }

  if (step === 4) {
    if (!data.addressLine1) errors.addressLine1 = 'Enter current address line 1';
    if (!data.pinCode) errors.pinCode = 'Enter PIN code';
    else if (!/^[0-9]{6}$/.test(data.pinCode)) errors.pinCode = 'PIN code must be 6 digits';
    if (!data.city) errors.city = 'City is required';
    if (!data.state) errors.state = 'State is required';
    if (!data.residenceType) errors.residenceType = 'Choose residence type';
    if (data.residenceType === 'Rented' && !data.rentAmount) {
      errors.rentAmount = 'Enter your monthly rent amount';
    }
    if (!data.yearsAtCurrentAddress) {
      errors.yearsAtCurrentAddress = 'Enter years at current address';
    }
    if (Number(data.yearsAtCurrentAddress) < 1 && !data.previousAddress) {
      errors.previousAddress = 'Enter previous address for less than one year at current address';
    }
    if (!data.sameAsPermanentAddress) {
      if (!data.permanentAddressLine1) errors.permanentAddressLine1 = 'Enter permanent address line 1';
      if (!data.permanentPinCode) errors.permanentPinCode = 'Enter permanent PIN code';
      if (!data.permanentCity) errors.permanentCity = 'Enter permanent city';
      if (!data.permanentState) errors.permanentState = 'Enter permanent state';
    }
  }

  if (step === 5) {
    if (!data.employmentType) errors.employmentType = 'Select employment type';
    if (data.employmentType === 'Salaried') {
      if (!data.companyName) errors.companyName = 'Enter company name';
      if (!data.designation) errors.designation = 'Enter designation';
      if (!data.monthlyNetSalary) errors.monthlyNetSalary = 'Enter monthly net salary';
      else if (Number(data.monthlyNetSalary) < 15000) {
        errors.monthlyNetSalary = 'Salary must be at least INR 15,000';
      }
    }
    if (data.employmentType !== 'Salaried') {
      if (!data.businessName) errors.businessName = 'Enter business name';
      if (!data.businessType) errors.businessType = 'Enter business type';
      if (!data.annualTurnover) errors.annualTurnover = 'Enter annual turnover';
      if (!data.yearsInBusiness || Number(data.yearsInBusiness) < 2) {
        errors.yearsInBusiness = 'Years in business must be at least 2';
      }
      if (!data.monthlyIncome) errors.monthlyIncome = 'Enter monthly income';
    }
    if (data.employmentType === 'Business Owner' && !data.gstNumber) {
      errors.gstNumber = 'Enter GST number';
    }
  }

  if (step === 6 && isCoApplicantRequired(data)) {
    if (!data.coApplicantName) errors.coApplicantName = 'Enter co-applicant name';
    if (!data.coApplicantRelationship) errors.coApplicantRelationship = 'Choose relationship';
    if (!data.coApplicantPAN) errors.coApplicantPAN = 'Enter co-applicant PAN';
    if (!data.coApplicantIncome) errors.coApplicantIncome = 'Enter co-applicant income';
    if (!data.coApplicantConsent) errors.coApplicantConsent = 'Co-applicant consent is required';
  }

  if (step === 7) {
    const requiredDocs = getLoanDocumentRequirements(data).filter((doc) => doc.required);
    requiredDocs.forEach((doc) => {
      if (!data.documents[doc.key]) {
        errors[`document:${doc.key}`] = `Upload ${doc.label}`;
      }
    });
    if (!data.signatureDataUrl) {
      errors.signatureDataUrl = 'Capture your e-signature';
    }
  }

  if (step === 8) {
    if (!data.consentAccuracy) errors.consentAccuracy = 'Required';
    if (!data.consentCreditScore) errors.consentCreditScore = 'Required';
    if (!data.consentTerms) errors.consentTerms = 'Required';
    if (!data.consentCommunications) errors.consentCommunications = 'Required';
  }

  return errors;
}

export function getPINLookup(pinCode: string) {
  return PIN_LOOKUP[pinCode] || null;
}

export function getCoApplicantOptions(maritalStatus: string) {
  const options: Relationship[] = ['Parent', 'Sibling', 'Business Partner'];
  if (maritalStatus === 'Married') {
    return ['Spouse', 'Parent', 'Sibling', 'Business Partner'];
  }
  return options;
}

export function getCombinedMonthlyIncome(data: LoanFormData) {
  const mainIncome = data.employmentType === 'Salaried' ? Number(data.monthlyNetSalary) : Number(data.monthlyIncome);
  const coIncome = isCoApplicantRequired(data) ? Number(data.coApplicantIncome) : 0;
  return mainIncome + coIncome;
}

export function getAffordabilityText(data: LoanFormData) {
  const emi = calculateEMI(Number(data.loanAmount), Number(data.loanTenure), getInterestRate(data));
  const income = getCombinedMonthlyIncome(data);
  if (!income || !emi) return 'Income or EMI data incomplete';
  return emi <= income * 0.5 ? 'Within affordability threshold' : 'EMI exceeds 50% of combined income';
}
