import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden
    />
  );
}

function SuccessCheck() {
  return (
    <span className="auth-success-pop flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('default');

  const canSubmit = isValidEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || state === 'loading') return;

    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 1400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12">
      <div
        className={`orb-lavender pointer-events-none absolute left-0 top-1/4 z-0 -translate-x-1/3 ${
          reducedMotion ? '' : 'orb-lavender--animate'
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-0 translate-x-1/4 translate-y-1/4"
        aria-hidden
      >
        <div className={`orb-mocha ${reducedMotion ? '' : 'orb-mocha--animate'}`} />
      </div>

      <div
        className={`relative z-10 w-full max-w-[400px] rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-9 ${
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

        {state === 'success' ? (
          <div className={`text-center ${reducedMotion ? '' : 'auth-success-fade'}`}>
            <div className="flex justify-center">
              <SuccessCheck />
            </div>
            <h1 className="mt-5 font-serif text-2xl text-heading">Reset link sent to your email</h1>
            <p className="mt-2 text-sm text-body">
              We sent instructions to <span className="font-medium text-heading">{email}</span>
            </p>
            <p className="mt-3 text-xs text-[#A89880]">
              Check spam folder if you don&apos;t see the email
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-heading py-3.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#2D2018]"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="font-serif text-2xl text-heading">Forgot your password?</h1>
              <p className="mt-2 text-sm text-body">
                Enter your email and we&apos;ll send a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              <div>
                <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-heading">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={state === 'loading'}
                  className="login-input w-full rounded-xl border border-[#E0D8CE] bg-white px-4 py-3 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880] disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit || state === 'loading'}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-white transition-all duration-200 ${
                  canSubmit && state !== 'loading'
                    ? 'bg-heading hover:scale-[1.02] hover:bg-[#2D2018] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                    : 'cursor-not-allowed bg-heading opacity-45'
                }`}
              >
                {state === 'loading' ? (
                  <>
                    <Spinner />
                    Sending…
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-[#A89880]">
              Check spam folder if you don&apos;t see the email
            </p>

            <p className="mt-4 text-center text-sm text-body">
              <Link
                to="/login"
                className="cursor-pointer text-[#C4956A] transition-colors hover:text-heading hover:underline"
              >
                ← Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
