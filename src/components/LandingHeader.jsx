import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GhostButton from './ui/GhostButton';
import { useAuth } from '../hooks/useAuth';

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#how-it-works' },
  { label: 'Contact', href: '/#contact' },
];

function getInitials() {
  try {
    const raw = localStorage.getItem('bharatvoice_profile');
    if (raw) {
      const { name } = JSON.parse(raw);
      if (name) {
        return name
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
      }
    }
  } catch {
    /* ignore */
  }
  return 'BV';
}

function ProfileMenu({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const itemClass =
    'flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-body transition-colors duration-200 hover:bg-[#F0E6D8] hover:text-heading';

  return (
    <div
      className="nav-dropdown absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] overflow-hidden rounded-xl border border-black/[0.06] bg-white py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
      role="menu"
    >
      <button type="button" className={itemClass} role="menuitem" onClick={() => { onClose(); navigate('/profile'); }}>
        Profile
      </button>
      <button
        type="button"
        className={itemClass}
        role="menuitem"
        onClick={() => {
          onClose();
          navigate('/profile');
        }}
      >
        Settings
      </button>
      <hr className="my-1 border-[#F5F0E8]" />
      <button type="button" className={`${itemClass} text-[#B45353] hover:bg-[#FEF2F2] hover:text-[#B45353]`} role="menuitem" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

function ProfileAvatarButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-[#E0D8CE] bg-[#F0E6D8] font-medium text-sm text-[#8B6347] shadow-sm transition-all duration-200 hover:border-[#C4956A] hover:shadow-[0_4px_16px_rgba(196,149,106,0.25)]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Profile menu"
      >
        {getInitials()}
      </button>
      {open && <ProfileMenu onClose={() => setOpen(false)} />}
    </div>
  );
}

export default function LandingHeader() {
  const { isLoggedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-6 py-3.5 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 cursor-pointer items-center gap-2 text-heading transition-opacity hover:opacity-85"
          onClick={closeMobile}
        >
          <MicIcon />
          <span className="font-serif text-[22px] leading-none">BharatVoice</span>
        </Link>

        {/* Center nav — desktop */}
        <ul className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.href === '/' ? (
                <Link
                  to="/"
                  className="cursor-pointer text-sm font-medium text-body transition-colors duration-200 hover:text-heading"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="cursor-pointer text-sm font-medium text-body transition-colors duration-200 hover:text-heading"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* Right actions — desktop */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <ProfileAvatarButton />
          ) : (
            <GhostButton to="/login">Login</GhostButton>
          )}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#E0D8CE] bg-white/80 text-heading transition-colors hover:bg-[#F0E6D8] lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-[#E8E2DA] bg-white/95 transition-all duration-300 ease-out lg:hidden ${
          mobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.href === '/' ? (
                <Link
                  to="/"
                  onClick={closeMobile}
                  className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-[#F0E6D8] hover:text-heading"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  onClick={closeMobile}
                  className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-[#F0E6D8] hover:text-heading"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 border-t border-[#F5F0E8] px-6 py-4">
          {isLoggedIn ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-body">Signed in</span>
              <ProfileAvatarButton />
            </div>
          ) : (
            <GhostButton to="/login" className="w-full justify-center" onClick={closeMobile}>
              Login
            </GhostButton>
          )}
        </div>
      </div>
    </header>
  );
}
