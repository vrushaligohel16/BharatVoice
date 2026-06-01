export default function TextInput({ value, onChange, maxLength = 500 }) {
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-card">
      <label htmlFor="complaint-input" className="block text-sm font-medium text-heading">
        Type your complaint
      </label>
      <p className="mt-1 text-xs text-muted">
        Describe your issue clearly — dates, department, and what action you need
      </p>
      <textarea
        id="complaint-input"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="e.g. My MNREGA payment has not arrived for the last 3 months despite completing work..."
        className="mt-3 min-h-[140px] w-full resize-y rounded-xl border border-[#E0D8CE] bg-white p-4 text-sm leading-relaxed text-heading transition-all duration-200 placeholder:italic placeholder:text-muted focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
      />
      <p className="mt-2 text-right text-xs text-muted">
        {value.length} / {maxLength}
      </p>
    </div>
  );
}
