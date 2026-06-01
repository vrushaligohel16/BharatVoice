export default function ProcessingLoader({ message = 'Processing your complaint...' }) {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.07] bg-white px-6 py-16 shadow-card">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`assistant-loader-dot h-3 w-3 rounded-full bg-accent ${
              i === 0 ? 'assistant-loader-delay-0' : i === 1 ? 'assistant-loader-delay-1' : 'assistant-loader-delay-2'
            }`}
          />
        ))}
      </div>
      <p className="mt-6 font-serif text-2xl text-heading">{message}</p>
      <p className="mt-2 text-sm text-body">AI is drafting your formal letter…</p>
    </section>
  );
}
