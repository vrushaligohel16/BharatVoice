import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { DEFAULT_ENGLISH_LETTER, DEFAULT_GUJARATI_LETTER } from '../constants/letters';

const STEP_LABELS = [
  'Speech recognized',
  'Understanding your grievance',
  'Finding the right department',
  'Drafting your complaint letter',
  'Preparing documents checklist',
];

const STEP_DURATIONS = [1500, 2000, 2000, 2500, 1500];

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

function VoiceOrb({ animate }) {
  return (
    <div
      className={`relative mx-auto my-10 h-[250px] w-[250px] ${animate ? 'voice-orb-float' : ''}`}
    >
      <svg width="250" height="250" viewBox="0 0 250 250" aria-hidden>
        <circle cx="125" cy="125" r="90" fill="rgba(196,149,106,0.12)" />
        <circle cx="125" cy="125" r="70" fill="rgba(196,149,106,0.1)" />

        <path
          d="M40,125 Q80,60 125,125 Q170,190 210,125"
          fill="none"
          stroke="#C4956A"
          strokeWidth="1.5"
          opacity="0.6"
        >
          {animate && (
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values="M40,125 Q80,60 125,125 Q170,190 210,125;M40,125 Q80,190 125,125 Q170,60 210,125;M40,125 Q80,60 125,125 Q170,190 210,125"
            />
          )}
        </path>

        <path
          d="M55,125 Q90,75 125,125 Q160,175 195,125"
          fill="none"
          stroke="#B8A0CC"
          strokeWidth="1.5"
          opacity="0.5"
        >
          {animate && (
            <animate
              attributeName="d"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.3s"
              values="M55,125 Q90,75 125,125 Q160,175 195,125;M55,125 Q90,175 125,125 Q160,75 195,125;M55,125 Q90,75 125,125 Q160,175 195,125"
            />
          )}
        </path>

        <path
          d="M70,125 Q97,90 125,125 Q153,160 180,125"
          fill="none"
          stroke="#A07848"
          strokeWidth="1.5"
          opacity="0.5"
        >
          {animate && (
            <animate
              attributeName="d"
              dur="2s"
              repeatCount="indefinite"
              begin="0.6s"
              values="M70,125 Q97,90 125,125 Q153,160 180,125;M70,125 Q97,160 125,125 Q153,90 180,125;M70,125 Q97,90 125,125 Q153,160 180,125"
            />
          )}
        </path>

        <path
          d="M85,125 Q105,103 125,125 Q145,147 165,125"
          fill="none"
          stroke="#D4A8C7"
          strokeWidth="1"
          opacity="0.6"
        >
          {animate && (
            <animate
              attributeName="d"
              dur="1.8s"
              repeatCount="indefinite"
              begin="0.15s"
              values="M85,125 Q105,103 125,125 Q145,147 165,125;M85,125 Q105,147 125,125 Q145,103 165,125;M85,125 Q105,103 125,125 Q145,147 165,125"
            />
          )}
        </path>

        <path
          d="M25,125 Q75,40 125,125 Q175,210 225,125"
          fill="none"
          stroke="#C4956A"
          strokeWidth="1"
          opacity="0.3"
        >
          {animate && (
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              begin="0.5s"
              values="M25,125 Q75,40 125,125 Q175,210 225,125;M25,125 Q75,210 125,125 Q175,40 225,125;M25,125 Q75,40 125,125 Q175,210 225,125"
            />
          )}
        </path>

        <circle cx="125" cy="125" r="6" fill="#C4956A" opacity="0.8">
          {animate && (
            <>
              <animate attributeName="r" dur="2s" repeatCount="indefinite" values="6;9;6" />
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="0.8;0.4;0.8"
              />
            </>
          )}
        </circle>
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StepCircle({ index, activeStep }) {
  const isDone = index < activeStep || activeStep >= STEP_LABELS.length;
  const isActive = index === activeStep && activeStep < STEP_LABELS.length;

  if (isDone) {
    return (
      <span className="step-check-pop relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
        <CheckIcon />
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="step-active-ring relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-heading">
        <span className="step-spinner absolute h-7 w-7 rounded-full border-2 border-transparent border-t-[#C4956A]" />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#E0D8CE] bg-[#F0EBE3] text-[13px] text-[#A89880]">
      {index + 1}
    </span>
  );
}

function ProgressStepsCard({ activeStep, animate }) {
  const progressPercent = Math.min(activeStep / STEP_LABELS.length, 1) * 100;

  return (
    <div
      className={`w-full rounded-2xl bg-white px-8 py-6 shadow-[0_4px_32px_rgba(0,0,0,0.06)] ${
        animate ? 'processing-card-fade' : ''
      }`}
    >
      <div className="relative">
        <div
          className="absolute bottom-6 left-[15px] top-6 w-0.5 bg-[#E8E2D8]"
          aria-hidden
        />
        <div
          className="absolute left-[15px] top-6 w-0.5 bg-gradient-to-b from-[#C4956A] to-[#8B6347] transition-[height] duration-500 ease-out"
          style={{ height: `calc((100% - 48px) * ${progressPercent / 100})` }}
          aria-hidden
        />

        <ul className="relative space-y-0">
          {STEP_LABELS.map((label, index) => {
            const isDone = index < activeStep || activeStep >= STEP_LABELS.length;
            const isActive = index === activeStep && activeStep < STEP_LABELS.length;

            let textClass = 'text-sm text-[#A89880]';
            if (isActive) textClass = 'text-sm font-medium text-heading';
            if (isDone) textClass = 'text-sm text-body';

            return (
              <li key={label} className="flex items-center gap-3 py-2.5">
                <StepCircle index={index} activeStep={activeStep} />
                <span className={textClass}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const animate = !reducedMotion;

  useEffect(() => {
    const timeouts = [];
    let elapsed = 0;

    STEP_DURATIONS.forEach((duration, index) => {
      elapsed += duration;
      if (index < STEP_DURATIONS.length - 1) {
        timeouts.push(setTimeout(() => setActiveStep(index + 1), elapsed));
      } else {
        timeouts.push(setTimeout(() => setActiveStep(STEP_LABELS.length), elapsed));
        timeouts.push(
          setTimeout(() => {
            const complaint = localStorage.getItem('complaintText');
            if (!localStorage.getItem('generatedLetter')) {
              localStorage.setItem(
                'generatedLetter',
                complaint
                  ? `${DEFAULT_ENGLISH_LETTER}\n\n---\nOriginal grievance:\n${complaint}`
                  : DEFAULT_ENGLISH_LETTER
              );
            }
            if (!localStorage.getItem('generatedLetterGujarati')) {
              localStorage.setItem('generatedLetterGujarati', DEFAULT_GUJARATI_LETTER);
            }
            navigate('/results');
          }, elapsed + 1000)
        );
      }
    });

    return () => timeouts.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div
        className={`orb-processing-center pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 ${
          animate ? 'orb-processing-center--animate' : ''
        }`}
        aria-hidden
      />
      <div
        className={`orb-processing-tr pointer-events-none absolute right-0 top-0 z-0 translate-x-1/4 -translate-y-1/4 ${
          animate ? 'orb-processing-tr--animate' : ''
        }`}
        aria-hidden
      />

      <Navbar minimal />

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[560px]">
          <h1
            className={`text-center font-serif text-4xl text-heading ${
              animate ? 'processing-fade-down' : ''
            }`}
          >
            Analyzing your complaint...
          </h1>
          <p
            className={`mt-2 text-center text-base text-body ${
              animate ? 'processing-fade-down-delay' : ''
            }`}
          >
            Claude AI is reading your words. This takes about 10 seconds.
          </p>

          <VoiceOrb animate={animate} />

          <ProgressStepsCard activeStep={activeStep} animate={animate} />

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="flex gap-1.5" aria-hidden>
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[#C4956A] ${
                  animate ? 'status-dot-bounce' : ''
                }`}
              />
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[#C4956A] ${
                  animate ? 'status-dot-bounce status-dot-bounce-delay-1' : ''
                }`}
              />
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[#C4956A] ${
                  animate ? 'status-dot-bounce status-dot-bounce-delay-2' : ''
                }`}
              />
            </span>
            <span className="text-xs text-[#A89880]">Powered by Claude AI + OpenAI Whisper</span>
          </div>
        </div>
      </main>
    </div>
  );
}
