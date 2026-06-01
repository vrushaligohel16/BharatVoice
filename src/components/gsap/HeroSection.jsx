import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import VoiceRecorder from './VoiceRecorder';
import IndiaLanguageMap from './IndiaLanguageMap';

export default function HeroSection({ onRecordingComplete, voiceDisabled }) {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current?.children || [], {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.1,
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          scale: 0.92,
          duration: 0.5,
          delay: 0.55,
          ease: 'back.out(1.5)',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToInput = () => {
    document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8F3EC] via-cream to-[#EDE8E0] px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-[#C4956A]/25 to-[#D4A8C7]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#D4A8C7]/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div ref={leftRef}>
            <span className="inline-flex rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-medium text-accent shadow-sm backdrop-blur-sm">
              GSAP · Voice-Powered Grievances
            </span>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-heading md:text-5xl lg:text-[3.25rem]">
              Speak your grievance.
              <br />
              <span className="bg-gradient-to-r from-[#8B6347] to-[#C4956A] bg-clip-text text-transparent">
                We draft the letter.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-body">
              BharatVoice turns your voice into a formal government complaint — in Hindi,
              Gujarati, Tamil, Bengali, and more. No forms. No jargon. Just speak.
            </p>
            <div ref={ctaRef} className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToInput}
                className="cursor-pointer rounded-full bg-heading px-8 py-3.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.03] hover:bg-[#2D2018] hover:shadow-lg"
              >
                Start Your Complaint →
              </button>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('supported-languages')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="cursor-pointer rounded-full border-[1.5px] border-heading/30 bg-white/60 px-8 py-3.5 text-sm font-medium text-heading backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-white"
              >
                Explore Languages
              </button>
            </div>
          </div>

          <VoiceRecorder onRecordingComplete={onRecordingComplete} disabled={voiceDisabled} />
        </div>
      </div>

      <div id="language-map" className="mt-4">
        <IndiaLanguageMap id="supported-languages-assistant" />
      </div>
    </section>
  );
}
