import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setLoggedIn } from '../hooks/useAuth';

const MicIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

function getPasswordStrength(password) {
  if (!password) {
    return { percent: 0, label: '', color: '#E0D8CE' };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { percent: 33, label: 'Weak', color: '#E8A598' };
  }
  if (score <= 3) {
    return { percent: 66, label: 'Fair', color: '#D4A574' };
  }
  return { percent: 100, label: 'Strong', color: '#C4956A' };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FieldCheck() {
  return (
    <span className="field-valid-check flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  valid,
  touched,
  autoComplete,
  optional,
  rightSlot,
  inputClassName = '',
}) {
  const showValid = touched && valid && !error;

  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-sm font-medium text-heading">
        {label}
        {optional && <span className="text-xs font-normal text-[#A89880]">(optional)</span>}
      </label>
      <div className="relative flex items-center gap-2">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`login-input w-full rounded-xl border bg-white py-3 pl-4 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880] ${
            error && touched
              ? 'border-[#E8B4B4] pr-4'
              : 'border-[#E0D8CE] pr-4'
          } ${rightSlot ? 'pr-12' : showValid ? 'pr-12' : ''} ${inputClassName}`}
          aria-invalid={error && touched ? 'true' : undefined}
          aria-describedby={error && touched ? `${id}-error` : undefined}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
        {showValid && !rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <FieldCheck />
          </div>
        )}
        {showValid && rightSlot && (
          <div className="absolute right-11 top-1/2 -translate-y-1/2">
            <FieldCheck />
          </div>
        )}
      </div>
      {error && touched && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#C97B7B]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const errors = useMemo(() => {
    const e = {};
    if (fullName.trim().length < 2) e.fullName = 'Please enter your full name';
    if (!isValidEmail(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match';
    if (phone.trim() && !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      e.phone = 'Enter a valid 10-digit phone number';
    }
    return e;
  }, [fullName, email, password, confirmPassword, phone]);

  const valids = useMemo(
    () => ({
      fullName: fullName.trim().length >= 2,
      email: isValidEmail(email),
      password: password.length >= 8,
      confirmPassword: confirmPassword.length > 0 && confirmPassword === password,
      phone: !phone.trim() || /^\d{10}$/.test(phone.replace(/\s/g, '')),
    }),
    [fullName, email, password, confirmPassword, phone]
  );

  const canSubmit =
    valids.fullName &&
    valids.email &&
    valids.password &&
    valids.confirmPassword &&
    valids.phone;

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    });
    if (!canSubmit) return;
    console.log('Register', { fullName, email, phone: phone || undefined });
    setLoggedIn(true);
    navigate('/input');
  };

  const showError = (field) => (touched[field] || submitted) && errors[field];

  const showValid = (field) => (touched[field] || submitted) && valids[field] && !errors[field];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-14">
      <div
        className={`orb-lavender pointer-events-none absolute right-0 top-0 z-0 translate-x-1/4 -translate-y-1/4 ${
          reducedMotion ? '' : 'orb-lavender--animate'
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 -translate-x-1/4 translate-y-1/4"
        aria-hidden
      >
        <div className={`orb-mocha ${reducedMotion ? '' : 'orb-mocha--animate'}`} />
      </div>

      <div
        className={`relative z-10 w-full max-w-[480px] rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-10 ${
          reducedMotion ? '' : 'login-card-entrance'
        }`}
      >
        <Link
          to="/"
          className="mb-6 flex cursor-pointer items-center justify-center gap-2 text-heading transition-opacity hover:opacity-80"
        >
          <MicIcon />
          <span className="font-serif text-[22px] leading-none">BharatVoice</span>
        </Link>

        <div className="text-center">
          <h1 className="font-serif text-3xl text-heading">Create your account</h1>
          <p className="mt-2 text-sm text-body">Start filing complaints in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <FormField
            id="fullName"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => touch('fullName')}
            placeholder="Your full name"
            autoComplete="name"
            error={errors.fullName}
            valid={valids.fullName}
            touched={touched.fullName || submitted}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch('email')}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
            valid={valids.email}
            touched={touched.email || submitted}
          />

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-heading">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => touch('password')}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={`login-input w-full rounded-xl border bg-white py-3 pl-4 pr-20 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880] ${
                  showError('password') ? 'border-[#E8B4B4]' : 'border-[#E0D8CE]'
                }`}
                aria-invalid={showError('password') ? 'true' : undefined}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {showValid('password') && <FieldCheck />}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="cursor-pointer text-[#A89880] transition-colors hover:text-heading"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>
            {password.length > 0 && (
              <div className="mt-2.5">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#F0EBE3]">
                  <div
                    className="password-strength-fill h-full rounded-full"
                    style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                  />
                </div>
                {strength.label && (
                  <p className="mt-1 text-xs text-[#A89880]">
                    Strength: <span style={{ color: strength.color }}>{strength.label}</span>
                  </p>
                )}
              </div>
            )}
            {showError('password') && (
              <p className="mt-1.5 text-xs text-[#C97B7B]">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-heading">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => touch('confirmPassword')}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`login-input w-full rounded-xl border bg-white py-3 pl-4 pr-20 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880] ${
                  showError('confirmPassword') ? 'border-[#E8B4B4]' : 'border-[#E0D8CE]'
                }`}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {showValid('confirmPassword') && <FieldCheck />}
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="cursor-pointer text-[#A89880] transition-colors hover:text-heading"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>
            {showError('confirmPassword') && (
              <p className="mt-1.5 text-xs text-[#C97B7B]">{errors.confirmPassword}</p>
            )}
          </div>

          <FormField
            id="phone"
            label="Phone number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
            onBlur={() => touch('phone')}
            placeholder="10-digit mobile number"
            autoComplete="tel"
            optional
            error={errors.phone}
            valid={valids.phone}
            touched={touched.phone || submitted}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-2 w-full cursor-pointer rounded-full py-3.5 text-sm font-medium text-white transition-all duration-200 ${
              canSubmit
                ? 'bg-heading hover:scale-[1.02] hover:bg-[#2D2018] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                : 'cursor-not-allowed bg-heading opacity-45'
            }`}
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-[#A89880]">
          Used by citizens across India for faster grievance filing
        </p>

        <p className="mt-6 text-center text-sm text-body">
          Already have an account?{' '}
          <Link
            to="/login"
            className="cursor-pointer font-medium text-[#C4956A] transition-colors hover:text-heading hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
