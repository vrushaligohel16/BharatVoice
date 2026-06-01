export default function PDFDownloadButton({ onClick, className = '' }) {
  const handleClick = () => {
    console.log('Download PDF');
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-heading py-3.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2D2018] hover:shadow-lg active:scale-[0.98] ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
      </svg>
      Download PDF
    </button>
  );
}
