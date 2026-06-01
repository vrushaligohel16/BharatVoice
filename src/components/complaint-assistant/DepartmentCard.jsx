export default function DepartmentCard({ department }) {
  const { name, description, portal, priority } = department;

  return (
    <section className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-white to-[#FAF5EF] p-6 shadow-[0_4px_24px_rgba(196,149,106,0.12)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0E6D8] text-2xl">
          🏛
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Detected Department
          </p>
          <h3 className="mt-1 font-serif text-2xl text-heading">{name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#F0EBE3] px-3 py-1 text-xs text-[#6B4E3D]">
              Portal: {portal}
            </span>
            <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs text-[#92400E]">
              Priority: {priority}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
