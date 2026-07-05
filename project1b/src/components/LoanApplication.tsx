'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LoanFormData,
  initialLoanFormData,
  maskPII,
  formatCurrency,
  formatIndianNumber,
  getPurposeOptions,
  getLoanLimits,
  getTenureRange,
  validateStep,
  getPINLookup,
  getLoanDocumentRequirements,
  isCoApplicantRequired,
  getInterestRate,
  calculateEMI,
  getMaxAllowedTenure,
  getCoApplicantOptions,
  getCombinedMonthlyIncome,
  getAffordabilityText,
} from '@/lib/loanForm';
import { useAutoSave } from '@/hooks/useAutoSave';

const stepTitles = [
  'Loan type & basics',
  'Personal information',
  'Identity verification',
  'Address information',
  'Employment & income',
  'Co-applicant details',
  'Documents & e-sign',
  'Review & submit',
];

function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function LoanApplication() {
  const [form, setForm] = useState<LoanFormData>(initialLoanFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [panVerifying, setPanVerifying] = useState(false);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [signatureBlurred, setSignatureBlurred] = useState(false);
  const [signatureReady, setSignatureReady] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureDrawn = useRef(false);
  const firstInputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  const errors = useMemo(() => validateStep(currentStep, form), [currentStep, form]);
  const stepFields: Record<number, Array<string>> = {
    1: ['loanType', 'loanAmount', 'loanTenure', 'loanPurpose', 'referralCode'],
    2: ['fullName', 'dob', 'gender', 'maritalStatus', 'fatherName', 'motherName', 'email', 'mobile', 'alternateMobile'],
    3: ['panNumber', 'aadhaarNumber', 'aadhaarConsent', 'voterId', 'passportNumber'],
    4: ['addressLine1', 'pinCode', 'city', 'state', 'residenceType', 'rentAmount', 'yearsAtCurrentAddress', 'previousAddress', 'sameAsPermanentAddress', 'permanentAddressLine1', 'permanentPinCode', 'permanentCity', 'permanentState'],
    5: ['employmentType', 'companyName', 'designation', 'monthlyNetSalary', 'experienceYears', 'businessName', 'businessType', 'annualTurnover', 'yearsInBusiness', 'monthlyIncome', 'gstNumber', 'officeAddress'],
    6: ['coApplicantName', 'coApplicantRelationship', 'coApplicantPAN', 'coApplicantIncome', 'coApplicantConsent'],
    7: ['signatureDataUrl'],
    8: ['consentAccuracy', 'consentCreditScore', 'consentTerms', 'consentCommunications'],
  };

  const loanLimits = getLoanLimits(form.loanType);
  const tenureRange = getTenureRange(form.loanType);
  const maxAllowedTenure = getMaxAllowedTenure(form);
  const pinned = getPINLookup(form.pinCode);
  const loanDocuments = getLoanDocumentRequirements(form);
  const coApplicantVisible = isCoApplicantRequired(form);
  const interestRate = getInterestRate(form);
  const emi = calculateEMI(parseNumber(form.loanAmount), Number(form.loanTenure), interestRate);
  const processingFee = Math.round(parseNumber(form.loanAmount) * 0.015);
  const totalCost = emi * Number(form.loanTenure) - parseNumber(form.loanAmount);
  const combinedIncome = getCombinedMonthlyIncome(form);
  const affordability = getAffordabilityText(form);
  const reviewReady = form.consentAccuracy && form.consentCreditScore && form.consentTerms && form.consentCommunications;

  useAutoSave(form, saveEnabled, (data) => setForm(data));

  useEffect(() => {
    setSaveEnabled(true);
  }, []);

  useEffect(() => {
    if (pinned) {
      setForm((prev) => ({ ...prev, city: pinned.city, state: pinned.state }));
    }
  }, [pinned]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, [currentStep]);

  useEffect(() => {
    if (!signatureReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setForm((prev) => ({ ...prev, signatureDataUrl: dataUrl }));
  }, [signatureReady]);

  const updateField = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const setAllStepTouched = (step: number) => {
    const fields = stepFields[step] ?? [];
    const nextTouched = { ...touched };
    fields.forEach((field) => {
      nextTouched[field] = true;
    });
    setTouched(nextTouched);
  };

  const handleNext = () => {
    const currentErrors = validateStep(currentStep, form);
    setAllStepTouched(currentStep);
    if (Object.keys(currentErrors).length > 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, stepTitles.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canProceed = Object.keys(errors).length === 0;

  const handleVerifyPan = async () => {
    if (!form.panNumber || errors.panNumber) return;
    setPanVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setForm((prev) => ({ ...prev, panVerified: true }));
    setPanVerifying(false);
  };

  const handleVerifyAadhaar = async () => {
    if (!form.aadhaarNumber || errors.aadhaarNumber) return;
    setAadhaarVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setForm((prev) => ({ ...prev, aadhaarVerified: true }));
    setAadhaarVerifying(false);
  };

  const canSubmit = reviewReady && loanDocuments.every((doc) => !doc.required || Boolean(form.documents[doc.key]));

  const handleSubmit = () => {
    const finalErrors = validateStep(8, form);
    setTouched((prev) => ({ ...prev, ...stepFields[8].reduce((acc, key) => ({ ...acc, [key]: true }), {}) }));
    if (Object.keys(finalErrors).length > 0) return;
    setApplicationId(createUuid());
    setShowSuccess(true);
  };

  const handleFileChange = (docKey: string, file: File | null) => {
    if (!file) return;
    const accepted = loanDocuments.find((doc) => doc.key === docKey)?.accepted ?? '';
    const maxSize = loanDocuments.find((doc) => doc.key === docKey)?.maxSizeMB ?? 5;
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!accepted.includes(`.${extension}`)) return;
    if (file.size / 1024 / 1024 > maxSize) return;
    setForm((prev) => ({ ...prev, documents: { ...prev.documents, [docKey]: file.name } }));
    setTouched((prev) => ({ ...prev, [`document:${docKey}`]: true }));
  };

  const handleSignaturePointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (event.buttons !== 1) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    const move = (moveEvent: PointerEvent) => {
      ctx.lineTo(moveEvent.clientX - rect.left, moveEvent.clientY - rect.top);
      ctx.stroke();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      signatureDrawn.current = true;
      setSignatureReady((prev) => !prev);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureDrawn.current = false;
    setForm((prev) => ({ ...prev, signatureDataUrl: '' }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }, []);

  useEffect(() => {
    if (currentStep === 4 && !form.pinCode) {
      setForm((prev) => ({ ...prev, city: '', state: '' }));
    }
  }, [currentStep, form.pinCode]);

  const renderFieldError = (field: string) => {
    const message = errors[field];
    if (!message || !touched[field]) return null;
    return (
      <div role="alert" aria-live="polite" className="field-error">
        {message}
      </div>
    );
  };

  return (
    <div className="form-shell">
      <div className="section-card">
        <div className="progress-panel" aria-label="Application progress">
          <div className="step-indicator">Step {currentStep} of {stepTitles.length}</div>
          <div className="progress-list">
            {stepTitles.map((title, index) => (
              <div
                key={title}
                className="progress-pill"
                aria-current={currentStep === index + 1 ? 'step' : undefined}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card">
        <h2>{stepTitles[currentStep - 1]}</h2>
        <div className="field-group">
          {currentStep === 1 && (
            <div className="field-group">
              <div className="field-row">
                <label htmlFor="loanType">Loan Type</label>
                <select
                  id="loanType"
                  ref={firstInputRef as React.LegacyRef<HTMLSelectElement>}
                  value={form.loanType}
                  onChange={(event) => updateField('loanType', event.target.value)}
                >
                  <option value="Personal">Personal Loan</option>
                  <option value="Home">Home Loan</option>
                  <option value="Business">Business Loan</option>
                </select>
                {renderFieldError('loanType')}
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="loanAmount">Loan Amount</label>
                  <input
                    id="loanAmount"
                    type="text"
                    inputMode="numeric"
                    value={form.loanAmount}
                    onChange={(event) => updateField('loanAmount', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, loanAmount: true }))}
                    placeholder="50,000"
                  />
                  <div className="upload-status">Allowed: INR {formatIndianNumber(loanLimits.min)}–{formatIndianNumber(loanLimits.max)}</div>
                  {renderFieldError('loanAmount')}
                </div>
                <div>
                  <label htmlFor="loanTenure">Loan Tenure (months)</label>
                  <select
                    id="loanTenure"
                    value={form.loanTenure}
                    onChange={(event) => updateField('loanTenure', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, loanTenure: true }))}
                  >
                    <option value="">Select tenure</option>
                    {Array.from({ length: maxAllowedTenure - tenureRange.min + 1 }, (_, i) => tenureRange.min + i)
                      .filter((months) => months <= maxAllowedTenure)
                      .map((months) => (
                        <option key={months} value={months}>{months} months</option>
                      ))}
                  </select>
                  <div className="upload-status">Max tenure allowed by age/loan: {maxAllowedTenure} months</div>
                  {renderFieldError('loanTenure')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="loanPurpose">Loan Purpose</label>
                  <select
                    id="loanPurpose"
                    value={form.loanPurpose}
                    onChange={(event) => updateField('loanPurpose', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, loanPurpose: true }))}
                  >
                    <option value="">Select purpose</option>
                    {getPurposeOptions(form.loanType).map((purpose) => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                  {renderFieldError('loanPurpose')}
                </div>

                <div>
                  <label htmlFor="referralCode">Referral Code (optional)</label>
                  <input
                    id="referralCode"
                    value={form.referralCode}
                    onChange={(event) => updateField('referralCode', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, referralCode: true }))}
                  />
                  {renderFieldError('referralCode')}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="field-group">
              <div className="field-row">
                <div>
                  <label htmlFor="fullName">Full Name (as per PAN)</label>
                  <input
                    id="fullName"
                    ref={firstInputRef as React.LegacyRef<HTMLInputElement>}
                    value={form.fullName}
                    onChange={(event) => updateField('fullName', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                  />
                  {renderFieldError('fullName')}
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob"
                    type="date"
                    value={form.dob}
                    onChange={(event) => updateField('dob', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, dob: true }))}
                  />
                  {renderFieldError('dob')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(event) => updateField('gender', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, gender: true }))}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {renderFieldError('gender')}
                </div>
                <div>
                  <label htmlFor="maritalStatus">Marital Status</label>
                  <select
                    id="maritalStatus"
                    value={form.maritalStatus}
                    onChange={(event) => updateField('maritalStatus', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, maritalStatus: true }))}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  {renderFieldError('maritalStatus')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="fatherName">Father’s Name</label>
                  <input
                    id="fatherName"
                    value={form.fatherName}
                    onChange={(event) => updateField('fatherName', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, fatherName: true }))}
                  />
                  {renderFieldError('fatherName')}
                </div>
                <div>
                  <label htmlFor="motherName">Mother’s Name</label>
                  <input
                    id="motherName"
                    value={form.motherName}
                    onChange={(event) => updateField('motherName', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, motherName: true }))}
                  />
                  {renderFieldError('motherName')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  />
                  {renderFieldError('email')}
                </div>
                <div>
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    id="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(event) => updateField('mobile', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, mobile: true }))}
                    placeholder="9876543210"
                  />
                  {renderFieldError('mobile')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="alternateMobile">Alternate Mobile (optional)</label>
                  <input
                    id="alternateMobile"
                    type="tel"
                    value={form.alternateMobile}
                    onChange={(event) => updateField('alternateMobile', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, alternateMobile: true }))}
                    placeholder="Leave empty if none"
                  />
                  {renderFieldError('alternateMobile')}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="field-group">
              <div className="field-row">
                <div>
                  <label htmlFor="panNumber">PAN Number</label>
                  <input
                    id="panNumber"
                    ref={firstInputRef as React.LegacyRef<HTMLInputElement>}
                    value={form.panVerified ? maskPII(form.panNumber) : form.panNumber}
                    onChange={(event) => updateField('panNumber', event.target.value.toUpperCase())}
                    onBlur={() => setTouched((prev) => ({ ...prev, panNumber: true }))}
                    placeholder="AAAAA9999A"
                  />
                  {renderFieldError('panNumber')}
                  <button className="button button-secondary" type="button" onClick={handleVerifyPan} disabled={panVerifying || Boolean(errors.panNumber)}>
                    {panVerifying ? 'Verifying…' : form.panVerified ? 'Verified' : 'Verify PAN'}
                  </button>
                </div>
                <div>
                  <label htmlFor="aadhaarNumber">Aadhaar Number</label>
                  <input
                    id="aadhaarNumber"
                    value={form.aadhaarVerified ? maskPII(form.aadhaarNumber) : form.aadhaarNumber}
                    onChange={(event) => updateField('aadhaarNumber', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, aadhaarNumber: true }))}
                    placeholder="123412341234"
                  />
                  {renderFieldError('aadhaarNumber')}
                  <button className="button button-secondary" type="button" onClick={handleVerifyAadhaar} disabled={aadhaarVerifying || Boolean(errors.aadhaarNumber)}>
                    {aadhaarVerifying ? 'Verifying…' : form.aadhaarVerified ? 'Verified' : 'Verify Aadhaar'}
                  </button>
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={form.aadhaarConsent}
                      onChange={(event) => updateField('aadhaarConsent', event.target.checked)}
                      onBlur={() => setTouched((prev) => ({ ...prev, aadhaarConsent: true }))}
                    />
                    {' '}I consent to Aadhaar verification
                  </label>
                  {renderFieldError('aadhaarConsent')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="voterId">Voter ID (optional)</label>
                  <input
                    id="voterId"
                    value={form.voterId}
                    onChange={(event) => updateField('voterId', event.target.value.toUpperCase())}
                    onBlur={() => setTouched((prev) => ({ ...prev, voterId: true }))}
                    placeholder="ABC1234567"
                  />
                  {renderFieldError('voterId')}
                </div>
                <div>
                  <label htmlFor="passportNumber">Passport (optional)</label>
                  <input
                    id="passportNumber"
                    value={form.passportNumber}
                    onChange={(event) => updateField('passportNumber', event.target.value.toUpperCase())}
                    onBlur={() => setTouched((prev) => ({ ...prev, passportNumber: true }))}
                    placeholder="A1234567"
                  />
                  {renderFieldError('passportNumber')}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="field-group">
              <div className="field-row">
                <div>
                  <label htmlFor="addressLine1">Current Address Line 1</label>
                  <input
                    id="addressLine1"
                    ref={firstInputRef as React.LegacyRef<HTMLInputElement>}
                    value={form.addressLine1}
                    onChange={(event) => updateField('addressLine1', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, addressLine1: true }))}
                  />
                  {renderFieldError('addressLine1')}
                </div>
                <div>
                  <label htmlFor="addressLine2">Current Address Line 2</label>
                  <input
                    id="addressLine2"
                    value={form.addressLine2}
                    onChange={(event) => updateField('addressLine2', event.target.value)}
                  />
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="pinCode">PIN Code</label>
                  <input
                    id="pinCode"
                    value={form.pinCode}
                    onChange={(event) => updateField('pinCode', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, pinCode: true }))}
                    placeholder="110001"
                  />
                  {renderFieldError('pinCode')}
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
                  />
                  {renderFieldError('city')}
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    value={form.state}
                    onChange={(event) => updateField('state', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, state: true }))}
                  />
                  {renderFieldError('state')}
                </div>
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="residenceType">Residence Type</label>
                  <select
                    id="residenceType"
                    value={form.residenceType}
                    onChange={(event) => updateField('residenceType', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, residenceType: true }))}
                  >
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Company">Company</option>
                    <option value="Family">Family</option>
                  </select>
                  {renderFieldError('residenceType')}
                </div>
                {form.residenceType === 'Rented' && (
                  <div>
                    <label htmlFor="rentAmount">Monthly Rent</label>
                    <input
                      id="rentAmount"
                      type="text"
                      value={form.rentAmount}
                      onChange={(event) => updateField('rentAmount', event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, rentAmount: true }))}
                    />
                    {renderFieldError('rentAmount')}
                  </div>
                )}
              </div>
              <div className="field-row">
                <div>
                  <label htmlFor="yearsAtCurrentAddress">Years at current address</label>
                  <input
                    id="yearsAtCurrentAddress"
                    type="number"
                    min="0"
                    max="50"
                    value={form.yearsAtCurrentAddress}
                    onChange={(event) => updateField('yearsAtCurrentAddress', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, yearsAtCurrentAddress: true }))}
                  />
                  {renderFieldError('yearsAtCurrentAddress')}
                </div>
                {Number(form.yearsAtCurrentAddress) < 1 && (
                  <div>
                    <label htmlFor="previousAddress">Previous Address</label>
                    <input
                      id="previousAddress"
                      value={form.previousAddress}
                      onChange={(event) => updateField('previousAddress', event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, previousAddress: true }))}
                    />
                    {renderFieldError('previousAddress')}
                  </div>
                )}
              </div>
              <div className="field-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.sameAsPermanentAddress}
                    onChange={(event) => updateField('sameAsPermanentAddress', event.target.checked)}
                  />
                  {' '}Same as permanent address
                </label>
              </div>
              {!form.sameAsPermanentAddress && (
                <div className="field-row">
                  <div>
                    <label htmlFor="permanentAddressLine1">Permanent Address Line 1</label>
                    <input
                      id="permanentAddressLine1"
                      value={form.permanentAddressLine1}
                      onChange={(event) => updateField('permanentAddressLine1', event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, permanentAddressLine1: true }))}
                    />
                    {renderFieldError('permanentAddressLine1')}
                  </div>
                  <div>
                    <label htmlFor="permanentPinCode">Permanent PIN Code</label>
                    <input
                      id="permanentPinCode"
                      value={form.permanentPinCode}
                      onChange={(event) => updateField('permanentPinCode', event.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, permanentPinCode: true }))}
                    />
                    {renderFieldError('permanentPinCode')}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="field-group">
              <div className="field-row">
                <div>
                  <label htmlFor="employmentType">Employment Type</label>
                  <select
                    id="employmentType"
                    ref={firstInputRef as React.LegacyRef<HTMLSelectElement>}
                    value={form.employmentType}
                    onChange={(event) => updateField('employmentType', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, employmentType: true }))}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                  </select>
                  {renderFieldError('employmentType')}
                </div>
                <div>
                  <label htmlFor="experienceYears">Years of Experience</label>
                  <input
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={form.experienceYears}
                    onChange={(event) => updateField('experienceYears', event.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, experienceYears: true }))}
                  />
                  {renderFieldError('experienceYears')}
                </div>
              </div>
              {form.employmentType === 'Salaried' ? (
                <>
                  <div className="field-row">
                    <div>
                      <label htmlFor="companyName">Company Name</label>
                      <input
                        id="companyName"
                        value={form.companyName}
                        onChange={(event) => updateField('companyName', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, companyName: true }))}
                      />
                      {renderFieldError('companyName')}
                    </div>
                    <div>
                      <label htmlFor="designation">Designation</label>
                      <input
                        id="designation"
                        value={form.designation}
                        onChange={(event) => updateField('designation', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, designation: true }))}
                      />
                      {renderFieldError('designation')}
                    </div>
                  </div>
                  <div className="field-row">
                    <div>
                      <label htmlFor="monthlyNetSalary">Monthly Net Salary</label>
                      <input
                        id="monthlyNetSalary"
                        type="text"
                        value={form.monthlyNetSalary}
                        onChange={(event) => updateField('monthlyNetSalary', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, monthlyNetSalary: true }))}
                      />
                      {renderFieldError('monthlyNetSalary')}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="field-row">
                    <div>
                      <label htmlFor="businessName">Business Name</label>
                      <input
                        id="businessName"
                        value={form.businessName}
                        onChange={(event) => updateField('businessName', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, businessName: true }))}
                      />
                      {renderFieldError('businessName')}
                    </div>
                    <div>
                      <label htmlFor="businessType">Business Type</label>
                      <input
                        id="businessType"
                        value={form.businessType}
                        onChange={(event) => updateField('businessType', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, businessType: true }))}
                      />
                      {renderFieldError('businessType')}
                    </div>
                  </div>
                  <div className="field-row">
                    <div>
                      <label htmlFor="annualTurnover">Annual Turnover</label>
                      <input
                        id="annualTurnover"
                        type="text"
                        value={form.annualTurnover}
                        onChange={(event) => updateField('annualTurnover', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, annualTurnover: true }))}
                      />
                      {renderFieldError('annualTurnover')}
                    </div>
                    <div>
                      <label htmlFor="yearsInBusiness">Years in Business</label>
                      <input
                        id="yearsInBusiness"
                        type="number"
                        min="0"
                        max="50"
                        value={form.yearsInBusiness}
                        onChange={(event) => updateField('yearsInBusiness', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, yearsInBusiness: true }))}
                      />
                      {renderFieldError('yearsInBusiness')}
                    </div>
                  </div>
                  <div className="field-row">
                    <div>
                      <label htmlFor="monthlyIncome">Monthly Income</label>
                      <input
                        id="monthlyIncome"
                        type="text"
                        value={form.monthlyIncome}
                        onChange={(event) => updateField('monthlyIncome', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, monthlyIncome: true }))}
                      />
                      {renderFieldError('monthlyIncome')}
                    </div>
                    {form.employmentType === 'Business Owner' && (
                      <div>
                        <label htmlFor="gstNumber">GST Number</label>
                        <input
                          id="gstNumber"
                          value={form.gstNumber}
                          onChange={(event) => updateField('gstNumber', event.target.value.toUpperCase())}
                          onBlur={() => setTouched((prev) => ({ ...prev, gstNumber: true }))}
                        />
                        {renderFieldError('gstNumber')}
                      </div>
                    )}
                  </div>
                  <div className="field-row">
                    <div>
                      <label htmlFor="officeAddress">Office / Business Address</label>
                      <input
                        id="officeAddress"
                        value={form.officeAddress}
                        onChange={(event) => updateField('officeAddress', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, officeAddress: true }))}
                      />
                      {renderFieldError('officeAddress')}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 6 && (
            <div className="field-group">
              <p className="upload-status">Co-applicant step is {coApplicantVisible ? 'active' : 'skipped'} for this application.</p>
              {coApplicantVisible ? (
                <>
                  <div className="field-row">
                    <div>
                      <label htmlFor="coApplicantName">Co-applicant Name</label>
                      <input
                        id="coApplicantName"
                        ref={firstInputRef as React.LegacyRef<HTMLInputElement>}
                        value={form.coApplicantName}
                        onChange={(event) => updateField('coApplicantName', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, coApplicantName: true }))}
                      />
                      {renderFieldError('coApplicantName')}
                    </div>
                    <div>
                      <label htmlFor="coApplicantRelationship">Relationship</label>
                      <select
                        id="coApplicantRelationship"
                        value={form.coApplicantRelationship}
                        onChange={(event) => updateField('coApplicantRelationship', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, coApplicantRelationship: true }))}
                      >
                        {getCoApplicantOptions(form.maritalStatus).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {renderFieldError('coApplicantRelationship')}
                    </div>
                  </div>
                  <div className="field-row">
                    <div>
                      <label htmlFor="coApplicantPAN">Co-applicant PAN</label>
                      <input
                        id="coApplicantPAN"
                        value={form.coApplicantPAN}
                        onChange={(event) => updateField('coApplicantPAN', event.target.value.toUpperCase())}
                        onBlur={() => setTouched((prev) => ({ ...prev, coApplicantPAN: true }))}
                      />
                      {renderFieldError('coApplicantPAN')}
                    </div>
                    <div>
                      <label htmlFor="coApplicantIncome">Co-applicant Monthly Income</label>
                      <input
                        id="coApplicantIncome"
                        type="text"
                        value={form.coApplicantIncome}
                        onChange={(event) => updateField('coApplicantIncome', event.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, coApplicantIncome: true }))}
                      />
                      {renderFieldError('coApplicantIncome')}
                    </div>
                  </div>
                  <div className="field-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.coApplicantConsent}
                        onChange={(event) => updateField('coApplicantConsent', event.target.checked)}
                      />
                      {' '}I confirm that the co-applicant has consented to this application.
                    </label>
                    {renderFieldError('coApplicantConsent')}
                  </div>
                </>
              ) : (
                <div className="alert">Co-applicant details are not required for this loan configuration.</div>
              )}
            </div>
          )}

          {currentStep === 7 && (
            <div className="field-group">
              <div className="file-uploader">
                {loanDocuments.map((doc) => (
                  <div key={doc.key} className="file-card">
                    <label htmlFor={`file-${doc.key}`}>{doc.label}</label>
                    <input
                      id={`file-${doc.key}`}
                      type="file"
                      accept={doc.accepted}
                      onChange={(event) => handleFileChange(doc.key, event.target.files?.[0] ?? null)}
                    />
                    <div className="upload-status">{doc.required ? 'Required' : 'Optional'} · Accepts {doc.accepted} · Max {doc.maxSizeMB} MB</div>
                    {form.documents[doc.key] && <div className="file-name">{form.documents[doc.key]}</div>}
                    {renderFieldError(`document:${doc.key}`)}
                  </div>
                ))}
              </div>
              <div className="field-group">
                <label>Capture E-Signature</label>
                <div
                  className="canvas-shell"
                  onFocus={() => setSignatureBlurred(false)}
                  onBlur={() => setSignatureBlurred(true)}
                  tabIndex={0}
                >
                  <canvas
                    ref={canvasRef}
                    style={{ width: '100%', height: '220px' }}
                    onPointerDown={handleSignaturePointer}
                  />
                  {signatureBlurred && (
                    <div className="signature-overlay">Signature area blurred to discourage screen capture</div>
                  )}
                </div>
                <div className="canvas-actions">
                  <button className="button button-secondary" type="button" onClick={clearSignature}>
                    Clear
                  </button>
                  <button className="button button-primary" type="button" onClick={() => setSignatureReady((prev) => !prev)}>
                    Save Signature
                  </button>
                </div>
                {renderFieldError('signatureDataUrl')}
                {form.signatureDataUrl && (
                  <div className="upload-status">Signature captured successfully.</div>
                )}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="field-group">
              <div className="summary-card">
                <h2>Pre-Approval Summary</h2>
                <div className="summary-metric">
                  <span>Loan Amount</span>
                  <strong>{formatCurrency(form.loanAmount) || 'INR 0'}</strong>
                </div>
                <div className="summary-metric">
                  <span>Tenure</span>
                  <strong>{form.loanTenure || '0'} months</strong>
                </div>
                <div className="summary-metric">
                  <span>Indicative Interest Rate</span>
                  <strong>{(interestRate * 100).toFixed(2)}%</strong>
                </div>
                <div className="summary-metric">
                  <span>Estimated EMI</span>
                  <strong>{emi ? formatCurrency(String(emi)) : 'INR 0'}</strong>
                </div>
                <div className="summary-metric">
                  <span>Total Cost of Borrowing</span>
                  <strong>{totalCost > 0 ? formatCurrency(String(totalCost)) : 'INR 0'}</strong>
                </div>
                <div className="summary-metric">
                  <span>Processing Fee</span>
                  <strong>{formatCurrency(String(processingFee))}</strong>
                </div>
              </div>
              <div className="field-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.consentAccuracy}
                    onChange={(event) => updateField('consentAccuracy', event.target.checked)}
                  />
                  {' '}I confirm all information provided is accurate.
                </label>
                {renderFieldError('consentAccuracy')}
              </div>
              <div className="field-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.consentCreditScore}
                    onChange={(event) => updateField('consentCreditScore', event.target.checked)}
                  />
                  {' '}I authorise LendSwift to check my credit score via CIBIL/Equifax.
                </label>
                {renderFieldError('consentCreditScore')}
              </div>
              <div className="field-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.consentTerms}
                    onChange={(event) => updateField('consentTerms', event.target.checked)}
                  />
                  {' '}I agree to the Terms and Conditions.
                </label>
                {renderFieldError('consentTerms')}
              </div>
              <div className="field-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.consentCommunications}
                    onChange={(event) => updateField('consentCommunications', event.target.checked)}
                  />
                  {' '}I consent to receive communications about this application.
                </label>
                {renderFieldError('consentCommunications')}
              </div>
              <div className="review-row">
                <h3>Verification snapshot</h3>
                <p>{affordability}</p>
                <p>Combined monthly income: {formatCurrency(String(combinedIncome))}</p>
              </div>
              <div className="review-row">
                <h3>E-signature preview</h3>
                {form.signatureDataUrl ? (
                  <img src={form.signatureDataUrl} alt="E-signature preview" style={{ width: '100%', borderRadius: '1rem', border: '1px solid var(--border)' }} />
                ) : (
                  <p className="upload-status">No signature captured yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="field-group">
          <div className="field-row">
            <button className="button button-secondary" type="button" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </button>
            {currentStep < stepTitles.length ? (
              <button className="button button-primary" type="button" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button className="button button-primary" type="button" onClick={handleSubmit} disabled={!canSubmit}>
                Submit Application
              </button>
            )}
          </div>
          {currentStep === 8 && !canSubmit && (
            <div className="alert">Please mark all consents and upload all required documents before submission.</div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="section-card">
          <h2>Application submitted</h2>
          <p className="upload-status">Your application reference number is <strong>{applicationId}</strong>.</p>
          <p className="upload-status">A downloadable summary PDF feature can be added as a bonus improvement.</p>
        </div>
      )}
    </div>
  );
}
