import { SAMPLE_COMPLAINTS } from '../../constants/samples';

export default function SampleComplaintButtons({ onSelect }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E0D8CE] bg-[#FAF8F5]/80 p-4">
      <p className="text-xs font-medium text-muted">Quick start — autofill a sample</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(SAMPLE_COMPLAINTS).map(([key, sample]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(sample.text)}
            className="cursor-pointer rounded-full border border-[#E0D8CE] bg-white px-4 py-2 text-xs text-body transition-all duration-200 hover:border-accent hover:bg-[#F0E6D8] hover:text-heading"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
