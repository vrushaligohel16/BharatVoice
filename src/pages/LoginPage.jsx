import { useEffect, useState } from 'react';
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
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

export default function LoginPage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log('Login', { email });
    setLoggedIn(true);
    navigate('/input');
  };

  const handleGoogle = () => {
    console.log('Continue with Google');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12">
      <div
        className={`orb-lavender pointer-events-none absolute left-0 top-0 z-0 -translate-x-1/3 translate-y-8 ${
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
        className={`relative z-10 w-full max-w-[420px] rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-10 ${
          reducedMotion ? '' : 'login-card-entrance'
        }`}
      >
        <Link
          to="/"
          className="mb-8 flex cursor-pointer items-center justify-center gap-2 text-heading transition-opacity hover:opacity-80"
        >
          <MicIcon />
          <span className="font-serif text-[22px] leading-none">BharatVoice</span>
        </Link>

        <div className="text-center">
          <h1 className="font-serif text-3xl text-heading">Welcome back</h1>
          <p className="mt-2 text-sm text-body">Login to continue your grievance process</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-heading">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="login-input w-full rounded-xl border border-[#E0D8CE] bg-white px-4 py-3 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-heading">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="cursor-pointer text-xs text-[#C4956A] transition-colors hover:text-heading hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input w-full rounded-xl border border-[#E0D8CE] bg-white px-4 py-3 text-sm text-heading transition-[border-color,box-shadow] duration-200 placeholder:text-[#A89880]"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full cursor-pointer rounded-full py-3.5 text-sm font-medium text-white transition-all duration-200 ${
              canSubmit
                ? 'bg-heading hover:scale-[1.02] hover:bg-[#2D2018] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                : 'cursor-not-allowed bg-heading opacity-45'
            }`}
          >
            Login
          </button>
        </form>

        <div className="relative my-8">
          <hr className="border-0 border-t border-[#E0D8CE]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-[#A89880]">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[#E0D8CE] bg-transparent py-3 text-sm font-medium text-heading transition-all duration-200 hover:scale-[1.01] hover:border-[#C4956A] hover:bg-[#F0E6D8]"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-body">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="cursor-pointer font-medium text-[#C4956A] transition-colors hover:text-heading hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
