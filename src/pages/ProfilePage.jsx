import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { setLoggedIn } from '../hooks/useAuth';

const PROFILE_STORAGE_KEY = 'bharatvoice_profile';

const LANGUAGES = [
  { value: 'hi', label: 'Hindi' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'mr', label: 'Marathi' },
  { value: 'bn', label: 'Bengali' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'en', label: 'English' },
];

const RECENT_COMPLAINTS = [
  { id: 1, title: 'Ration Card Not Updated', status: 'Submitted' },
  { id: 2, title: 'MNREGA Payment Delay', status: 'Pending' },
  { id: 3, title: 'Electricity Billing Issue', status: 'Resolved' },
];

const DEFAULT_PROFILE = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '9876543210',
  language: 'gu',
};

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function StatusBadge({ status }) {
  const styles = {
    Resolved: 'bg-[#DCFCE7] text-[#15803D]',
    Pending: 'bg-[#FEF3C7] text-[#92400E]',
    Submitted: 'bg-[#DBEAFE] text-[#1D4ED8]',
  };

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[status] || styles.Pending}`}
    >
      {status}
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

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* use defaults */
  }
  return { ...DEFAULT_PROFILE };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;

  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(loadProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saveState, setSaveState] = useState('idle');

  const stats = {
    total: 12,
    resolved: 5,
    pending: 4,
  };

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleEditToggle = () => {
    if (isEditing) {
      setDraft(profile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setSaveState('saving');
    setTimeout(() => {
      setProfile(draft);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft));
      setIsEditing(false);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    }, 600);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/login');
  };

  const cardClass =
    'rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)]';

  return (
    <div className="relative min-h-screen bg-cream">
      <div
        className={`orb-lavender pointer-events-none absolute right-0 top-0 z-0 translate-x-1/4 opacity-50 ${
          animate ? 'orb-lavender--animate' : ''
        }`}
        aria-hidden
      />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1000px] px-6 py-8 lg:px-8 lg:py-10">
        <header className={animate ? 'profile-fade-up' : ''}>
          <h1 className="font-serif text-4xl text-heading">My Profile</h1>
          <p className="mt-2 text-body">Manage your account and track complaints</p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* Left — Profile */}
          <section className={animate ? 'profile-fade-up profile-delay-1' : ''}>
            <div className={cardClass}>
              <div className="flex flex-col items-center border-b border-[#F5F0E8] pb-6 text-center sm:flex-row sm:items-start sm:gap-5 sm:text-left">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#F0E6D8] font-serif text-2xl text-[#8B6347]">
                  {getInitials(profile.name)}
                </div>
                <div className="mt-4 sm:mt-0 sm:flex-1">
                  <h2 className="font-serif text-xl text-heading">{profile.name}</h2>
                  <p className="mt-1 text-sm text-body">{profile.email}</p>
                  <p className="text-sm text-[#A89880]">{profile.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="mt-4 cursor-pointer text-sm font-medium text-[#C4956A] transition-colors hover:text-heading hover:underline sm:mt-0"
                >
                  {isEditing ? 'Cancel' : 'Edit profile'}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-[#A89880]">
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? draft.name : profile.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    className="login-input w-full rounded-xl border border-[#E0D8CE] bg-white px-4 py-2.5 text-sm text-heading transition-all duration-200 disabled:cursor-default disabled:bg-[#FAF8F5] disabled:text-body"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A89880]">Email</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full rounded-xl border border-[#E0D8CE] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#A89880]"
                  />
                </div>

                <div>
                  <label htmlFor="profile-phone" className="mb-1.5 block text-xs font-medium text-[#A89880]">
                    Phone
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    disabled={!isEditing}
                    value={isEditing ? draft.phone : profile.phone}
                    onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                    className="login-input w-full rounded-xl border border-[#E0D8CE] bg-white px-4 py-2.5 text-sm text-heading transition-all duration-200 disabled:cursor-default disabled:bg-[#FAF8F5] disabled:text-body"
                  />
                </div>

                <div>
                  <label htmlFor="profile-lang" className="mb-1.5 block text-xs font-medium text-[#A89880]">
                    Language preference
                  </label>
                  <select
                    id="profile-lang"
                    disabled={!isEditing}
                    value={isEditing ? draft.language : profile.language}
                    onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                    className="login-input w-full cursor-pointer appearance-none rounded-xl border border-[#E0D8CE] bg-white px-4 py-2.5 text-sm text-heading transition-all duration-200 disabled:cursor-default disabled:bg-[#FAF8F5] disabled:text-body"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={!isEditing || saveState === 'saving'}
                className={`mt-6 w-full cursor-pointer rounded-full py-3 text-sm font-medium text-white transition-all duration-200 ${
                  !isEditing
                    ? 'cursor-not-allowed bg-heading opacity-40'
                    : saveState === 'saved'
                      ? 'bg-[#16A34A] hover:bg-[#15803D]'
                      : 'bg-heading hover:scale-[1.01] hover:bg-[#2D2018] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]'
                }`}
              >
                {saveState === 'saving' && 'Saving…'}
                {saveState === 'saved' && '✓ Saved'}
                {saveState === 'idle' && 'Save Changes'}
              </button>
            </div>
          </section>

          {/* Right — Activity */}
          <div className={`space-y-6 ${animate ? 'profile-fade-up profile-delay-2' : ''}`}>
            <div className={cardClass}>
              <h2 className="font-serif text-xl text-heading">Recent Complaints</h2>
              <ul className="mt-4 space-y-3">
                {RECENT_COMPLAINTS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => console.log('Open complaint', item.id)}
                      className="complaint-row flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#F5F0E8] bg-[#FAF8F5]/50 px-4 py-3 text-left transition-all duration-200 hover:border-[#E0D8CE] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                    >
                      <span className="text-sm font-medium text-heading">{item.title}</span>
                      <StatusBadge status={item.status} />
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to="/input"
                className="mt-4 inline-block cursor-pointer text-sm text-[#C4956A] hover:underline"
              >
                File a new complaint →
              </Link>
            </div>

            <div className={cardClass}>
              <h2 className="font-serif text-xl text-heading">Account Settings</h2>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full cursor-pointer rounded-xl border border-[#E0D8CE] bg-white px-4 py-3 text-left text-sm text-heading transition-all duration-200 hover:border-[#C4956A] hover:bg-[#F0E6D8]"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full cursor-pointer rounded-xl border border-[#E8B4B4] bg-white px-4 py-3 text-left text-sm text-[#B45353] transition-all duration-200 hover:bg-[#FEF2F2]"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className={`${cardClass} grid grid-cols-3 gap-4`}>
              {[
                { label: 'Total Complaints', value: stats.total },
                { label: 'Resolved', value: stats.resolved, accent: 'text-[#16A34A]' },
                { label: 'Pending', value: stats.pending, accent: 'text-[#D97706]' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`font-serif text-3xl text-heading ${stat.accent || ''}`}>{stat.value}</p>
                  <p className="mt-1 text-[11px] text-[#A89880]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
