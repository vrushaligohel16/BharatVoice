import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Assistant', to: '/assistant' },
  { label: 'Login', to: '/login' },
  { label: 'Profile', to: '/profile' },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#E8E2D8] bg-[#E8E2D8]/50 py-10">
      <div className="mx-auto flex max-w-page flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg text-heading">BharatVoice</p>
          <p className="mt-1 text-xs text-muted">Voice-based grievance assistant for India</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-4">
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-sm text-body transition-colors hover:text-heading">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">© {new Date().getFullYear()} BharatVoice</p>
      </div>
    </footer>
  );
}
