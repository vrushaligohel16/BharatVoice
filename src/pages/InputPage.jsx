import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { INPUT_LANGUAGE_COUNT, INPUT_LANGUAGE_OPTIONS } from '../constants/indianLanguages';

const SAMPLE_STORAGE_KEY = 'sampleComplaint';
const COMPLAINT_STORAGE_KEY = 'complaintText';
const LANGUAGE_STORAGE_KEY = 'complaintLanguage';
const MAX_CHARS = 500;

const SAMPLES = {
  mnrega: {
    label: '🌾 Farmer Payment',
    text: 'My MNREGA wages for the months of January, February, and March 2025 have not been credited to my account despite completing 60 days of work. I have raised this with the local Gram Panchayat twice but received no response.',
  },
  ration: {
    label: '🪪 Ration Card',
    text: "My ration card has not been updated for the last 6 months. My family members' names are missing and we are unable to collect our monthly food grain entitlement from the PDS shop.",
  },
  land: {
    label: '🏛 Land Dispute',
    text: 'There is an illegal encroachment on my agricultural land (Khasra No. XXXX) by a neighbouring party. The local revenue office has not taken any action despite my written complaint submitted 3 months ago.',
  },
  electricity: {
    label: '⚡ Electricity',
    text: 'I have been receiving incorrect electricity bills for the past 4 months. My bill shows consumption of 800 units whereas my actual usage is approximately 150 units per month.',
  },
};

const INFO_STEPS = [
  'Your speech is transcribed accurately',
  'AI understands your grievance type',
  'Correct department is identified',
  'Formal complaint letter is drafted',
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDurationShort(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MicIconLarge() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return <div className="h-5 w-5 rounded-sm bg-white" />;
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function StepIndicator() {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-heading px-5 py-2 text-[13px] font-medium text-white">
        1 — Input
      </span>
      <span className="text-[#D8D0C4]">→</span>
      <span className="rounded-full border-[1.5px] border-[#D8D0C4] px-5 py-2 text-[13px] font-medium text-[#A89880]">
        2 — Processing
      </span>
      <span className="text-[#D8D0C4]">→</span>
      <span className="rounded-full border-[1.5px] border-[#D8D0C4] px-5 py-2 text-[13px] font-medium text-[#A89880]">
        3 — Result
      </span>
    </div>
  );
}

function WaveformBars() {
  const classes = [
    'wave-bar-1',
    'wave-bar-2',
    'wave-bar-3',
    'wave-bar-4',
    'wave-bar-5',
    'wave-bar-6',
    'wave-bar-7',
  ];
  return (
    <div className="flex h-10 items-end justify-center gap-1.5">
      {classes.map((cls) => (
        <span key={cls} className={`w-1 rounded bg-[#C4956A] ${cls}`} />
      ))}
    </div>
  );
}

function VoiceRecordingCard({ recordState, setRecordState, seconds, setSeconds }) {
  const [ripple, setRipple] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recordState !== 'recording') {
      if (timerRef.current) clearInterval(timerRef.current);
      return undefined;
    }
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [recordState, setSeconds]);

  const handleStart = () => {
    setRipple(true);
    setSeconds(0);
    setRecordState('recording');
    setTimeout(() => setRipple(false), 600);
  };

  const handleStop = () => {
    setRecordState('done');
  };

  const handleRerecord = () => {
    setSeconds(0);
    setRecordState('ready');
  };

  return (
    <div className="rounded-2xl border border-black/[0.07] border-t-[3px] border-t-[#C4956A] bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
          <span className="text-[15px] font-medium text-heading">Voice Recording</span>
        </div>
        <span className="rounded-full bg-[#F0E6D8] px-3 py-1 text-[11px] text-[#8B6347]">
          Recommended
        </span>
      </div>

      <div className="flex min-h-[200px] flex-col items-center justify-center">
        {recordState === 'ready' && (
          <>
            <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-dashed border-[#E0D8CE]">
              {ripple && (
                <span className="ripple-active absolute h-20 w-20 rounded-full bg-[#C4956A]" />
              )}
              <button
                type="button"
                onClick={handleStart}
                className="relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-heading transition-all duration-200 hover:scale-105 hover:bg-[#2D2018]"
                aria-label="Start recording"
              >
                <MicIconLarge />
              </button>
            </div>
            <p className="mt-5 text-sm text-body">Tap to record your complaint</p>
            <p className="mt-1 text-xs text-[#A89880]">Speak naturally in your selected language</p>
          </>
        )}

        {recordState === 'recording' && (
          <>
            <p className="font-serif text-[40px] tabular-nums text-heading">{formatTime(seconds)}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="record-pulse-dot h-2 w-2 rounded-full bg-[#DC2626]" />
              <span className="text-sm text-[#DC2626]">Recording...</span>
            </div>
            <div className="my-5">
              <WaveformBars />
            </div>
            <div className="relative flex h-[120px] w-[120px] items-center justify-center">
              <span className="record-ring absolute h-20 w-20 rounded-full bg-[rgba(196,149,106,0.15)]" />
              <span className="record-ring record-ring-delay-1 absolute h-[100px] w-[100px] rounded-full bg-[rgba(196,149,106,0.1)]" />
              <span className="record-ring record-ring-delay-2 absolute h-[120px] w-[120px] rounded-full bg-[rgba(196,149,106,0.05)]" />
              <button
                type="button"
                onClick={handleStop}
                className="relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-[#DC2626] transition-all duration-200 hover:scale-105 hover:bg-[#B91C1C]"
                aria-label="Stop recording"
              >
                <StopIcon />
              </button>
            </div>
          </>
        )}

        {recordState === 'done' && (
          <>
            <div className="check-bounce flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
              <CheckIcon />
            </div>
            <p className="mt-4 text-sm text-[#16A34A]">
              Recording complete ·{' '}
              <span className="text-[#A89880]">{formatDurationShort(seconds)}</span>
            </p>
            <div className="mt-4 flex w-full max-w-xs items-center gap-3 rounded-xl border border-[#E0D8CE] bg-white px-3 py-2">
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-heading"
                aria-label="Play"
              >
                <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
              </button>
              <div className="flex flex-1 items-end gap-0.5">
                {[3, 5, 2, 6, 4, 3, 5, 2, 4, 6].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 rounded bg-[#C4956A]"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#A89880]">{formatDurationShort(seconds)}</span>
            </div>
            <button
              type="button"
              onClick={handleRerecord}
              className="mt-3 cursor-pointer text-[13px] text-[#C4956A] underline"
            >
              Re-record
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <aside className="input-fade-up-delay-2 lg:sticky lg:top-[100px] lg:self-start">
      <div className="rounded-2xl border border-black/[0.07] bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
        <h2 className="font-serif text-[22px] text-heading">What happens next?</h2>
        <div className="relative mt-6 space-y-4 pl-2">
          <div
            className="absolute bottom-6 left-[15px] top-6 w-0.5 border-l-2 border-dashed border-[#E8E2D8]"
            aria-hidden
          />
          {INFO_STEPS.map((text, i) => (
            <div key={text} className="relative flex gap-3">
              <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0E6D8] text-[13px] font-medium text-[#8B6347]">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm text-body">{text}</p>
            </div>
          ))}
        </div>
        <hr className="my-6 border-[#F0EBE3]" />
        <div className="flex items-start gap-2">
          <LockIcon />
          <p className="text-xs text-[#A89880]">
            Your voice is processed securely and never stored.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { value: String(INPUT_LANGUAGE_COUNT), label: 'Languages' },
          { value: '6', label: 'Dept. Types' },
          { value: '~10s', label: 'Processing' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[#F8F5F0] p-3 text-center">
            <p className="font-serif text-2xl text-heading">{stat.value}</p>
            <p className="text-[11px] text-[#A89880]">{stat.label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function InputPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('hi');
  const [recordState, setRecordState] = useState('ready');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [complaintText, setComplaintText] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const sample = localStorage.getItem(SAMPLE_STORAGE_KEY);
    if (sample) {
      setComplaintText(sample.slice(0, MAX_CHARS));
      localStorage.removeItem(SAMPLE_STORAGE_KEY);
    }
  }, []);

  const charCount = complaintText.length;
  const canSubmit = complaintText.trim().length > 0 || recordState === 'done';

  const handleSubmit = () => {
    if (!canSubmit) return;
    const text =
      complaintText.trim() ||
      `[Voice recording — ${formatDurationShort(recordSeconds)} — transcription pending]`;
    localStorage.setItem(COMPLAINT_STORAGE_KEY, text);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    navigate('/processing');
  };

  const handleChipClick = (key) => {
    setComplaintText(SAMPLES[key].text.slice(0, MAX_CHARS));
  };

  return (
    <div className="relative min-h-screen bg-cream">
      <div
        className={`orb-input-lavender pointer-events-none absolute left-0 top-0 z-0 -translate-x-1/4 translate-y-4 ${
          reducedMotion ? '' : 'orb-lavender--animate'
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 z-0 translate-x-1/4"
        aria-hidden
      >
        <div className={`orb-input-mocha ${reducedMotion ? '' : 'orb-mocha--animate'}`} />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-8 lg:px-8">
        <Link
          to="/"
          className="cursor-pointer text-[13px] text-[#C4956A] hover:underline"
        >
          ← Home
        </Link>

        <StepIndicator />

        <div className={reducedMotion ? '' : 'input-heading-fade'}>
          <h1 className="font-serif text-[38px] text-heading">Tell us your grievance</h1>
          <p className="mt-2 text-base text-body">
            Speak in your language — we&apos;ll handle the formalities.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[55%_45%] lg:gap-10">
          <div className={reducedMotion ? '' : 'input-fade-up-delay-1'}>
            <div className="mb-6">
              <label
                htmlFor="language"
                className="mb-2 block text-[11px] uppercase tracking-[0.1em] text-[#A89880]"
              >
                Select language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-select max-h-64 w-full cursor-pointer appearance-none rounded-xl border border-[#E0D8CE] bg-white py-3 pl-4 pr-12 text-[15px] text-heading transition-[border-color,box-shadow] duration-200"
                >
                  {INPUT_LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-[#A89880]">
                  {INPUT_LANGUAGE_COUNT} official Indian languages + English
                </p>
                <ChevronIcon />
              </div>
            </div>

            <VoiceRecordingCard
              recordState={recordState}
              setRecordState={setRecordState}
              seconds={recordSeconds}
              setSeconds={setRecordSeconds}
            />

            <div className="relative my-6 text-center">
              <hr className="border-0 border-t border-[#E0D8CE]" />
              <span className="absolute left-1/2 top-[-10px] -translate-x-1/2 bg-cream px-3 text-xs text-[#A89880]">
                or type your complaint
              </span>
            </div>

            <textarea
              id="complaint"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="e.g. My MNREGA payment has not arrived for the last 3 months..."
              className="input-textarea w-full min-h-[140px] resize-y rounded-xl border border-[#E0D8CE] bg-white p-4 text-sm leading-[1.7] text-heading transition-[border-color,box-shadow] duration-200 placeholder:italic placeholder:text-[#A89880]"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[#A89880]">
                {charCount} / {MAX_CHARS}
              </span>
              <button
                type="button"
                onClick={() => setComplaintText('')}
                className="cursor-pointer text-xs text-[#C4956A] hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs text-[#A89880]">Quick start:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(SAMPLES).map(([key, sample]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleChipClick(key)}
                    className="cursor-pointer rounded-full border border-[#E0D8CE] bg-white px-4 py-2 text-xs text-body transition-all duration-200 hover:border-[#C4956A] hover:bg-[#F0E6D8] hover:text-heading"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={`mt-8 w-full cursor-pointer rounded-full py-4 text-base font-medium text-white transition-all duration-200 ${
                canSubmit
                  ? 'bg-heading hover:scale-[1.01] hover:bg-[#2D2018] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
                  : 'cursor-not-allowed bg-heading opacity-45'
              }`}
            >
              Generate My Complaint →
            </button>
            <p className="mt-3 text-center text-xs text-[#A89880]">
              Takes about 10 seconds · Powered by Claude AI + Whisper
            </p>
          </div>

          <InfoPanel />
        </div>
      </div>
    </div>
  );
}
