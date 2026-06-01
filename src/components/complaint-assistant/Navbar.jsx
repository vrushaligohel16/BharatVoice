import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GhostButton from '../ui/GhostButton';

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
  </svg>
);

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Assistant', to: '/assistant' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const { isLoggedIn } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/[0.06] shadow-sm"
      style={{
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <nav className="mx-auto flex max-w-page items-center justify-between gap-4 px-6 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-heading">
          <MicIcon />
          <span className="font-serif text-xl">BharatVoice</span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              {link.to ? (
                <Link to={link.to} className="text-sm text-body transition-colors hover:text-heading">
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="text-sm text-body transition-colors hover:text-heading">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0E6D8] text-xs font-medium text-[#8B6347] transition hover:ring-2 hover:ring-accent/30"
            >
              BV
            </Link>
          ) : (
            <GhostButton to="/login">Login</GhostButton>
          )}
        </div>
      </nav>
    </header>
  );
}
