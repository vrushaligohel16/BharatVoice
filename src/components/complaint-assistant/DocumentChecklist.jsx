import { useState } from 'react';

const DEFAULT_ITEMS = [
  'Aadhaar Card',
  'Address Proof (government-issued)',
  'Existing Ration Card copy',
  'Supporting evidence (photos, receipts)',
];

export default function DocumentChecklist({ items = DEFAULT_ITEMS }) {
  const [checked, setChecked] = useState(items.map(() => true));

  const toggle = (index) => {
    setChecked((prev) => prev.map((c, i) => (i === index ? !c : c)));
  };

  return (
    <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-card">
      <h2 className="font-serif text-xl text-heading">Documents Checklist</h2>
      <p className="mt-1 text-sm text-body">Attach these when submitting on the portal</p>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() => toggle(index)}
                className="peer sr-only"
              />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  checked[index]
                    ? 'border-accent bg-accent text-white'
                    : 'border-[#E0D8CE] bg-white peer-hover:border-accent'
                }`}
              >
                {checked[index] && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-heading">{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
