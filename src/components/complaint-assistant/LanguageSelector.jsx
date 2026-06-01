const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', flag: '🇮🇳' },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl text-heading">Select Language</h2>
          <p className="mt-1 text-sm text-body">Choose how you want to file your complaint</p>
        </div>
        <div
          className="hidden h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-[#F0E6D8] text-3xl sm:flex"
          aria-hidden
          title="India"
        >
          🗺
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              value === lang.code
                ? 'bg-heading text-white shadow-md'
                : 'border border-[#E0D8CE] bg-white text-body hover:border-accent hover:bg-[#F0E6D8]'
            }`}
          >
            <span className="mr-1.5">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </section>
  );
}
