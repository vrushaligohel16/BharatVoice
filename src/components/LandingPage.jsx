import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';
import { IndiaLanguageMap } from './gsap';

const STORAGE_KEY = 'sampleComplaint';
const TYPEWRITER_TEXT = 'written for you.';

const MicIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const STEPS = [
  {
    num: '01',
    title: 'Choose Language',
    desc: 'Pick from any of India’s 22 official languages — or use English as a link language.',
  },
  {
    num: '02',
    title: 'Speak Your Grievance',
    desc: 'Record up to 2 minutes — explain your problem in your own words.',
  },
  {
    num: '03',
    title: 'AI Drafts the Letter',
    desc: 'We format a formal complaint and route it to the right ministry.',
  },
  {
    num: '04',
    title: 'Download & Submit',
    desc: 'Get a ready-to-file PDF for CPGRAMS or your state portal.',
  },
];

const SAMPLE_COMPLAINTS = [
  {
    emoji: '🌾',
    title: 'MNREGA Payment Delay',
    desc: 'Wages unpaid for 3+ months',
    prefillText:
      'My MNREGA wages for the last 3 months have not been credited to my bank account despite completing assigned work.',
  },
  {
    emoji: '🪪',
    title: 'Ration Card Issue',
    desc: 'Card not updated or rejected',
    prefillText:
      'My ration card has not been updated for the past 6 months despite multiple visits to the fair price shop and submitting all required documents.',
  },
  {
    emoji: '🏛',
    title: 'Land Dispute',
    desc: 'Encroachment or record mismatch',
    prefillText:
      'There is encroachment on my ancestral land and the revenue records do not match the actual possession on ground.',
  },
  {
    emoji: '⚡',
    title: 'Electricity Complaint',
    desc: 'Wrong billing or no connection',
    prefillText:
      'I am receiving inflated electricity bills despite low consumption, and frequent power cuts in my village.',
  },
];

const FOOTER_PILLS = [
  'MNREGA',
  'Ration Card',
  'Pension',
  'Land',
  'Electricity',
  'Water Supply',
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

function useTypewriter(text, speed = 60) {
  const reducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? text : '');
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      setDone(true);
      return undefined;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed, reducedMotion]);

  return { displayed, done, showCursor: !done && !reducedMotion };
}

function useLiveCounter(initial, intervalMs = 5000) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return count;
}

function useScrollReveal(delay = 0) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return { ref, visible, transitionDelay: `${delay}ms` };
}

function useHeroEntrance() {
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  return ready;
}

function saveSampleAndNavigate(navigate, sample) {
  localStorage.setItem(STORAGE_KEY, sample.prefillText);
  navigate('/input');
}

function LiveStatsPill({ visible }) {
  const count = useLiveCounter(47, 5000);

  return (
    <div
      className={`hero-fade-in hero-fade-in-counter mt-4 inline-flex w-fit items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${
        visible ? 'hero-fade-in--visible' : ''
      }`}
    >
      <span
        className="animate-pulse-dot h-2 w-2 shrink-0 rounded-full bg-[#22C55E]"
        aria-hidden
      />
      <span className="text-[13px] text-body">
        <span className="font-medium">{count}</span> complaints filed today
      </span>
    </div>
  );
}

function TypewriterHeading() {
  const { displayed, done, showCursor } = useTypewriter(TYPEWRITER_TEXT, 60);

  return (
    <h1 className="font-serif text-4xl leading-[1.1] text-heading md:text-5xl lg:text-[64px]">
      Speak your problem.
      <br />
      Get your complaint
      <br />
      <span className="italic">
        {displayed}
        {showCursor && (
          <span className="typewriter-cursor ml-0.5 font-normal not-italic">|</span>
        )}
        {!showCursor && done ? '' : null}
      </span>
    </h1>
  );
}

function HeroCard() {
  const reducedMotion = usePrefersReducedMotion();
  const [floatActive, setFloatActive] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const t = setTimeout(() => setFloatActive(true), 1300);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return (
    <div
      className={`relative z-10 w-full max-w-md ${!reducedMotion ? 'hero-card-entrance' : ''} ${
        floatActive && !reducedMotion ? 'hero-card-float' : ''
      }`}
    >
      <div
        className="hero-card-inner cursor-default rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] lg:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-3 py-1.5 text-xs font-medium text-[#2E7D32]">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[#22C55E]" />
            Complaint Generated
          </div>
          <span className="shrink-0 text-[10px] text-[#A89880]">Ration Card · MNREGA</span>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-[#A89880]">
            Generated letter preview
          </p>
          <div className="letter-fade-mask">
            <p className="whitespace-pre-line text-[11px] italic leading-[1.7] text-body">
              {`To, The District Supply Officer,
Food & Civil Supplies Dept.

Sub: Non-updation of Ration Card

Respected Sir/Madam, I wish to bring 
to your attention that my ration card 
has not been updated for the past 6 
months despite multiple visits...`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#F0EBE3] px-3 py-1 text-[11px] text-[#6B4E3D]">
            Ministry: Food &amp; Civil Supplies
          </span>
          <span className="rounded-full bg-[#F0EBE3] px-3 py-1 text-[11px] text-[#6B4E3D]">
            Portal: CPGRAMS
          </span>
          <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-[11px] text-[#92400E]">
            Priority: Medium
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const heroReady = useHeroEntrance();

  return (
    <section id="hero" className="relative min-h-[90vh] overflow-hidden">
      <div
        className={`orb-lavender pointer-events-none absolute left-0 top-0 z-0 -translate-x-1/4 translate-y-8 ${
          reducedMotion ? '' : 'orb-lavender--animate'
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-0 -translate-y-1/2 translate-x-1/4 lg:translate-x-0"
        aria-hidden
      >
        <div className={`orb-mocha ${reducedMotion ? '' : 'orb-mocha--animate'}`} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-page flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:gap-10 lg:px-8 lg:py-20">
        <div className="flex w-full flex-col justify-center lg:w-[55%]">
          <div className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full bg-[#E8E0D6] px-4 py-2 text-[13px] text-body">
            <span
              className="animate-pulse-dot h-2 w-2 shrink-0 rounded-full bg-[#C4956A]"
              aria-hidden
            />
            AI-Powered · All 22 Official Languages
          </div>

          <TypewriterHeading />

          <p
            className={`hero-fade-in hero-fade-in-subtext mt-6 max-w-[480px] text-[17px] leading-[1.6] text-body ${
              heroReady ? 'hero-fade-in--visible' : ''
            }`}
          >
            BharatVoice turns a 2-minute voice recording into a formal government grievance
            letter — in your language, routed to the right department.
          </p>

          <div
            className={`hero-fade-in hero-fade-in-buttons mt-8 flex flex-wrap gap-4 ${
              heroReady ? 'hero-fade-in--visible' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => navigate('/input')}
              className="cursor-pointer rounded-full bg-heading px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#2D2018]"
              style={{ padding: '14px 32px' }}
            >
              Start Your Complaint →
            </button>
            <a
              href="#how-it-works"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border-[1.5px] border-heading bg-transparent px-8 py-3.5 text-sm font-medium text-heading transition-all duration-200 hover:bg-[rgba(28,20,16,0.06)]"
              style={{ padding: '14px 32px' }}
            >
              See How It Works
            </a>
          </div>

          <p className="mt-10 text-[13px] tracking-[0.02em] text-[#A89880]">
            MNREGA Payments · Ration Card Issues · Pension Delays · Land Disputes
          </p>

          <LiveStatsPill visible={heroReady} />
        </div>

        <div className="relative flex w-full items-center justify-center lg:w-[45%]">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  const { ref, visible, transitionDelay } = useScrollReveal(index * 100);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <article
      ref={ref}
      style={{ transitionDelay }}
      className={`step-card relative z-10 rounded-card border border-black/[0.07] bg-white p-8 shadow-card ${
        visible || reducedMotion ? 'step-card--visible' : 'step-card--hidden'
      }`}
    >
      <span className="step-card-num font-serif text-[48px] leading-none text-accent">
        {step.num}
      </span>
      <h3 className="mt-4 font-serif text-xl text-heading">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{step.desc}</p>
    </article>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-cream-dark py-24">
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-8">
        <h2 className="mb-12 text-center font-serif text-3xl text-heading lg:text-[40px]">
          From voice to official complaint — in under a minute
        </h2>

        <div className="relative hidden lg:block">
          <div className="steps-connector" aria-hidden />
        </div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STEPS.map((step, index) => (
            <StepCard key={step.num} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleCard({ item, index, onSelect }) {
  const { ref, visible, transitionDelay } = useScrollReveal(index * 100);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      style={{ transitionDelay }}
      className={`sample-card rounded-card border border-black/[0.07] bg-white p-6 shadow-card ${
        visible || reducedMotion ? 'sample-card--visible' : 'sample-card--hidden'
      }`}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E6D8] text-2xl"
        aria-hidden
      >
        {item.emoji}
      </div>
      <h3 className="mt-3 font-serif text-xl text-heading">{item.title}</h3>
      <p className="mt-1 text-[13px] text-body">{item.desc}</p>
      <span className="sample-card-link mt-4 inline-block text-[13px] font-medium text-[#C4956A]">
        Try this example →
      </span>
    </article>
  );
}

function SampleComplaintsSection() {
  const navigate = useNavigate();

  return (
    <section id="sample-complaints" className="bg-cream py-20">
      <div className="mx-auto max-w-[800px] px-6 lg:px-8">
        <h2 className="text-center font-serif text-[36px] text-heading">
          Common complaints we handle
        </h2>
        <p className="mt-3 text-center text-[15px] text-body">
          Click any card to try a sample complaint
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SAMPLE_COMPLAINTS.map((item, index) => (
            <SampleCard
              key={item.title}
              item={item}
              index={index}
              onSelect={(sample) => saveSampleAndNavigate(navigate, sample)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="about" className="border-t border-[#D8D0C4] bg-[#E8E2D8] py-8">
      <div className="mx-auto flex max-w-page flex-col items-center gap-8 px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="flex flex-col items-center lg:items-start">
          <a href="#hero" className="flex cursor-pointer items-center gap-2 text-heading">
            <MicIcon className="text-heading" />
            <span className="font-serif text-lg">BharatVoice</span>
          </a>
          <p id="contact" className="mt-1 text-xs text-body/80">
            Built for 900 million Indians — reach us via your state grievance portal
          </p>
        </div>

        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {FOOTER_PILLS.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-[#D8D0C4] bg-white px-3 py-1 text-[11px] text-body"
            >
              {pill}
            </span>
          ))}
        </div>

        <p className="text-center text-xs text-body/80 lg:text-right">
          Made with ♥ at AcadHacks 1.0 2026
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-noise min-h-screen">
      <LandingHeader />
      <main className="relative z-10">
        <HeroSection />
        <section className="bg-cream px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-page">
            <IndiaLanguageMap id="supported-languages" />
          </div>
        </section>
        <HowItWorksSection />
        <SampleComplaintsSection />
      </main>
      <Footer />
    </div>
  );
}
