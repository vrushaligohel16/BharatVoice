import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_ENGLISH_LETTER, DEFAULT_GUJARATI_LETTER } from '../constants/letters';

const CHECKLIST_ITEMS = [
  'Aadhaar Card',
  'Address Proof (any government-issued)',
  'Existing Ration Card copy',
  'Supporting evidence (photos, receipts if any)',
];

const SUBMISSION_STEPS = [
  'Visit CPGRAMS portal or your state portal',
  'Create account or login with Aadhaar',
  'Upload required documents',
  'Paste complaint & save tracking number',
];

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

function CheckIcon({ className = '' }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ResultsTopBar() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[#E8E2DA]"
      style={{
        backgroundColor: 'rgba(242, 237, 228, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link
          to="/input"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-body transition-colors duration-200 hover:text-heading"
        >
          <span aria-hidden>←</span>
          New Complaint
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-[#F0E6D8] px-4 py-1.5 text-xs font-medium text-[#8B6347]">
            <CheckIcon /> 1 Input
          </span>
          <span className="text-[#D8D0C4]">→</span>
          <span className="flex items-center gap-1.5 rounded-full bg-[#F0E6D8] px-4 py-1.5 text-xs font-medium text-[#8B6347]">
            <CheckIcon /> 2 Processing
          </span>
          <span className="text-[#D8D0C4]">→</span>
          <span className="rounded-full bg-heading px-4 py-1.5 text-xs font-medium text-white">
            3 Result ●
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" aria-hidden />
          <span className="text-[13px] font-medium text-[#16A34A]">Complaint Ready</span>
        </div>
      </div>
    </header>
  );
}

function SuccessToast({ visible, exiting, animate }) {
  if (!visible && !exiting) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-[100] max-w-sm rounded-xl border-l-4 border-[#16A34A] bg-white px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${
        exiting ? 'results-toast-exit' : animate ? 'results-toast-enter' : ''
      }`}
      role="status"
    >
      <div className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
          <CheckIcon />
        </span>
        <div>
          <p className="text-sm text-heading">Complaint generated successfully!</p>
          <p className="text-xs text-body">Ration Card Issue · Food &amp; Civil Supplies</p>
        </div>
      </div>
    </div>
  );
}

function CreamPill({ children, className = '' }) {
  return (
    <span className={`rounded-full bg-[#F0E6D8] px-3 py-1 text-xs text-[#6B4E3D] ${className}`}>
      {children}
    </span>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F5F0E8] py-2.5">
      <span className="text-[13px] text-[#A89880]">{label}</span>
      {children}
    </div>
  );
}

function LeftSidebar({ animate }) {
  return (
    <aside className="space-y-4">
      <div
        className={`rounded-2xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-slide-right' : ''
        }`}
      >
        <h2 className="mb-4 font-serif text-xl text-heading">Complaint Summary</h2>
        <InfoRow label="Category">
          <CreamPill>Ration Card Issue</CreamPill>
        </InfoRow>
        <InfoRow label="Language">
          <CreamPill>Gujarati</CreamPill>
        </InfoRow>
        <InfoRow label="Status">
          <span className="rounded-full bg-[#DCFCE7] px-3 py-1 text-xs text-[#15803D]">
            Ready to Submit
          </span>
        </InfoRow>
      </div>

      <div
        className={`rounded-2xl border-t-[3px] border-t-[#C4956A] bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-slide-right-d2' : ''
        }`}
      >
        <h2 className="mb-4 font-serif text-xl text-heading">Routed To</h2>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
          </svg>
          <p className="text-lg font-medium text-heading">Food &amp; Civil Supplies</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px] text-[#A89880]">Portal:</span>
          <button
            type="button"
            onClick={() => console.log('Open CPGRAMS')}
            className="cursor-pointer text-[13px] text-[#C4956A] hover:underline"
          >
            CPGRAMS ↗
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] text-[#A89880]">Priority:</span>
          <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs text-[#92400E]">Medium</span>
        </div>
        <button
          type="button"
          onClick={() => console.log('Visit Portal')}
          className="mt-4 w-full cursor-pointer rounded-full border-[1.5px] border-[#C4956A] py-2.5 text-sm text-[#C4956A] transition-all duration-200 hover:bg-[#C4956A] hover:text-white"
        >
          Visit Portal →
        </button>
      </div>

      <div
        className={`rounded-2xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-slide-right-d3' : ''
        }`}
      >
        <h2 className="mb-4 font-serif text-xl text-heading">Know Your Rights</h2>
        {[
          { icon: '🕐', label: 'Expected resolution', value: '30–45 Days' },
          { icon: '✓', label: 'Appeal available', value: 'Yes', valueClass: 'text-[#16A34A]' },
          { icon: '🔍', label: 'Tracking', value: 'Yes — save ref. number' },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-[#F5F0E8] py-2.5"
          >
            <span className="flex items-center gap-2 text-[13px] text-[#A89880]">
              <span className="text-sm">{row.icon}</span>
              {row.label}
            </span>
            <span className={`text-[13px] font-medium text-heading ${row.valueClass || ''}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function CustomCheckbox({ checked, onToggle, animate, delayClass }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
      aria-checked={checked}
      role="checkbox"
    >
      {checked ? (
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-[#C4956A] text-white shadow-[0_2px_8px_rgba(196,149,106,0.4)] ${
            animate ? `checklist-check-entrance ${delayClass}` : ''
          }`}
        >
          <CheckIcon />
        </span>
      ) : (
        <span className="h-6 w-6 rounded-full border-2 border-[#E0D8CE] bg-white transition-colors duration-200 hover:border-[#C4956A]" />
      )}
    </button>
  );
}

function CenterColumn({
  animate,
  activeTab,
  setActiveTab,
  englishLetter,
  setEnglishLetter,
  gujaratiLetter,
  setGujaratiLetter,
  checkedItems,
  toggleCheck,
}) {
  const letter = activeTab === 'en' ? englishLetter : gujaratiLetter;
  const setLetter = activeTab === 'en' ? setEnglishLetter : setGujaratiLetter;

  return (
    <div>
      <div className={animate ? 'results-fade-up' : ''}>
        <h1 className="font-serif text-[30px] text-heading">Your complaint letter</h1>
        <p className="mt-1 text-sm text-body">Review and edit before downloading</p>
      </div>

      <div className="mb-4 mt-6 flex gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`cursor-pointer rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-200 ${
            activeTab === 'en'
              ? 'bg-heading text-white'
              : 'border border-[#E0D8CE] bg-transparent text-body hover:bg-[#F0E6D8]'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gu')}
          className={`cursor-pointer rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-200 ${
            activeTab === 'gu'
              ? 'bg-heading text-white'
              : 'border border-[#E0D8CE] bg-transparent text-body hover:bg-[#F0E6D8]'
          }`}
        >
          Local Language (Gujarati)
        </button>
      </div>

      <div
        className={`transition-opacity duration-200 ${animate ? 'results-fade-up-d1' : ''}`}
        style={{ opacity: 1 }}
      >
        <textarea
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          className="results-letter-textarea min-h-[360px] w-full resize-y rounded-xl border border-[#E0D8CE] bg-white p-5 text-sm leading-[1.85] text-heading transition-all duration-200"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-[#A89880]">
          <span aria-hidden>✎</span>
          You can edit this letter freely
        </span>
        <button
          type="button"
          onClick={() => console.log('Regenerate letter')}
          className="cursor-pointer rounded-full border border-[#E0D8CE] px-3 py-1.5 text-xs text-body transition-all duration-200 hover:border-[#C4956A] hover:text-[#C4956A]"
        >
          Regenerate ↺
        </button>
      </div>

      <div
        className={`mt-6 rounded-2xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-fade-up-d3' : ''
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-heading">Documents checklist</h2>
          <span className="rounded-full bg-[#F0E6D8] px-3 py-0.5 text-xs text-[#8B6347]">
            4 items
          </span>
        </div>
        <ul className="space-y-3">
          {CHECKLIST_ITEMS.map((item, i) => (
            <li key={item} className="flex cursor-pointer items-center gap-3">
              <CustomCheckbox
                checked={checkedItems[i]}
                onToggle={() => toggleCheck(i)}
                animate={animate}
                delayClass={`checklist-check-d${i + 1}`}
              />
              <span
                className="text-sm text-heading"
                onClick={() => toggleCheck(i)}
                onKeyDown={(e) => e.key === 'Enter' && toggleCheck(i)}
                role="presentation"
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RightSidebar({ animate, navigate }) {
  return (
    <aside className="space-y-4">
      <div
        className={`rounded-2xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-slide-left-d2' : ''
        }`}
      >
        <h2 className="mb-4 font-serif text-xl text-heading">How to Submit</h2>
        <div className="relative">
          <div
            className="absolute bottom-6 left-[13px] top-6 w-0.5 bg-[#F0EBE3]"
            aria-hidden
          />
          <ol className="space-y-0">
            {SUBMISSION_STEPS.map((text, i) => (
              <li key={text} className="relative flex gap-3 pb-4">
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-heading text-xs font-medium text-white transition-colors duration-200 hover:bg-[#C4956A]">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-body">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        className={`rounded-2xl bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] ${
          animate ? 'results-slide-left-d3' : ''
        }`}
      >
        <h2 className="mb-4 font-serif text-xl text-heading">Download &amp; Share</h2>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => console.log('Download PDF')}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-heading py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2D2018] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] active:scale-[0.98]"
          >
            <span aria-hidden>📄</span>
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => console.log('Download DOCX')}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] border-heading py-3 text-sm font-medium text-heading transition-all duration-200 hover:-translate-y-0.5 hover:bg-heading hover:text-white"
          >
            Download DOCX
          </button>
          <button
            type="button"
            onClick={() => console.log('Share WhatsApp')}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1DA851] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]"
          >
            <span aria-hidden>💬</span>
            Share on WhatsApp
          </button>
        </div>
        <hr className="my-4 border-[#F0EBE3]" />
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full cursor-pointer text-center text-[13px] text-[#A89880] hover:underline"
        >
          ← Start New Complaint
        </button>
      </div>
    </aside>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;

  const [activeTab, setActiveTab] = useState('en');
  const [englishLetter, setEnglishLetter] = useState(DEFAULT_ENGLISH_LETTER);
  const [gujaratiLetter, setGujaratiLetter] = useState(DEFAULT_GUJARATI_LETTER);
  const [checkedItems, setCheckedItems] = useState([true, true, true, true]);
  const [toastVisible, setToastVisible] = useState(true);
  const [toastExiting, setToastExiting] = useState(false);

  useEffect(() => {
    const storedEn = localStorage.getItem('generatedLetter');
    const storedGu = localStorage.getItem('generatedLetterGujarati');
    const complaint = localStorage.getItem('complaintText');

    if (storedEn) setEnglishLetter(storedEn);
    else if (complaint) {
      const merged = `${DEFAULT_ENGLISH_LETTER}\n\n---\nOriginal grievance:\n${complaint}`;
      setEnglishLetter(merged);
      localStorage.setItem('generatedLetter', merged);
    } else {
      localStorage.setItem('generatedLetter', DEFAULT_ENGLISH_LETTER);
    }

    if (storedGu) setGujaratiLetter(storedGu);
    else localStorage.setItem('generatedLetterGujarati', DEFAULT_GUJARATI_LETTER);
  }, []);

  useEffect(() => {
    const dismissTimer = setTimeout(() => setToastExiting(true), 4000);
    const hideTimer = setTimeout(() => setToastVisible(false), 4300);
    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('generatedLetter', englishLetter);
  }, [englishLetter]);

  useEffect(() => {
    localStorage.setItem('generatedLetterGujarati', gujaratiLetter);
  }, [gujaratiLetter]);

  const toggleCheck = (index) => {
    setCheckedItems((prev) => prev.map((c, i) => (i === index ? !c : c)));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream">
      <div
        className={`orb-results-tr pointer-events-none fixed right-0 top-0 z-0 translate-x-1/4 -translate-y-1/4 ${
          animate ? 'orb-results-tr--animate' : ''
        }`}
        aria-hidden
      />
      <div
        className={`orb-results-bl pointer-events-none fixed bottom-0 left-0 z-0 -translate-x-1/4 translate-y-1/4 ${
          animate ? 'orb-results-bl--animate' : ''
        }`}
        aria-hidden
      />

      <SuccessToast visible={toastVisible} exiting={toastExiting} animate={animate} />
      <ResultsTopBar />

      <main className="relative z-10 mx-auto max-w-page px-6 pb-16 pt-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px] lg:items-start">
          <LeftSidebar animate={animate} />
          <CenterColumn
            animate={animate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            englishLetter={englishLetter}
            setEnglishLetter={setEnglishLetter}
            gujaratiLetter={gujaratiLetter}
            setGujaratiLetter={setGujaratiLetter}
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
          />
          <RightSidebar animate={animate} navigate={navigate} />
        </div>
      </main>
    </div>
  );
}
