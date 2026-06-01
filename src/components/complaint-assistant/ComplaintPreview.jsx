export default function ComplaintPreview({ value, onChange, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-black/[0.07] bg-white shadow-card ${className}`}
    >
      <div className="border-b border-[#F5F0E8] px-6 py-4">
        <h2 className="font-serif text-xl text-heading">Generated Complaint</h2>
        <p className="mt-1 text-sm text-body">Review and edit before downloading</p>
      </div>
      <div className="max-h-[420px] overflow-y-auto p-6">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[320px] w-full resize-y rounded-xl border border-[#E0D8CE] bg-[#FAF8F5] p-4 text-sm leading-[1.85] text-heading transition-all duration-200 focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
          aria-label="Complaint text"
        />
      </div>
    </section>
  );
}
