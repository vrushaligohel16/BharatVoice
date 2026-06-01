import { Link, useNavigate } from 'react-router-dom';

const MicIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
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

const NAV_LINKS = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Sample Cases', href: '/#sample-complaints' },
  { label: 'About', href: '/#about' },
];

export default function Navbar({ minimal = false }) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 border-b border-black/[0.06]"
      style={{
        backgroundColor: 'rgba(242, 237, 228, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav className="mx-auto flex max-w-page items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex cursor-pointer items-center gap-2 text-heading">
          <MicIcon className="text-heading" />
          <span className="font-serif text-[22px] leading-none">BharatVoice</span>
        </Link>

        {!minimal && (
          <>
            <ul className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-sm text-body transition-colors duration-200 hover:text-heading"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigate('/input')}
              className="cursor-pointer rounded-full bg-heading px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#2D2018]"
            >
              Start Complaint
            </button>
          </>
        )}

        {minimal && <div className="w-[120px]" aria-hidden />}
      </nav>
    </header>
  );
}
