const STEPS = [
  'Visit CPGRAMS portal or your state grievance portal',
  'Create account or login with Aadhaar / mobile OTP',
  'Upload required documents from the checklist',
  'Paste your complaint letter and save the tracking number',
];

export default function SubmissionGuide() {
  return (
    <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-card">
      <h2 className="font-serif text-xl text-heading">How to Submit</h2>
      <ol className="relative mt-6 space-y-0">
        <div className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-[#E8E2D8]" aria-hidden />
        {STEPS.map((step, index) => (
          <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-heading text-xs font-medium text-white transition-colors duration-200 hover:bg-accent">
              {index + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-body">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
