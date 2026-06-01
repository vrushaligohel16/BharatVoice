import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const BAR_COUNT = 14;
const IDLE_HEIGHT = 10;
const MIN_HEIGHT = 14;
const MAX_HEIGHT = 52;

export default function VoiceRecorder({ onRecordingComplete, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const rootRef = useRef(null);
  const micRef = useRef(null);
  const glowRef = useRef(null);
  const glowOuterRef = useRef(null);
  const barsRef = useRef([]);
  const barTweensRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: 'power3.out',
      });

      gsap.from(micRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.65,
        delay: 0.15,
        ease: 'back.out(1.8)',
      });

      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        gsap.set(bar, { height: IDLE_HEIGHT, transformOrigin: 'bottom center' });
        gsap.from(bar, {
          opacity: 0,
          scaleY: 0,
          duration: 0.45,
          delay: 0.25 + i * 0.035,
          ease: 'power2.out',
          transformOrigin: 'bottom center',
        });
      });

      gsap.set(glowRef.current, { opacity: 0.3, scale: 1 });
      gsap.set(glowOuterRef.current, { opacity: 0.15, scale: 1 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const stopBarAnimations = () => {
    barTweensRef.current.forEach((t) => t?.kill());
    barTweensRef.current = [];
    gsap.to(barsRef.current, {
      height: IDLE_HEIGHT,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.inOut',
      overwrite: true,
    });
  };

  const startBarAnimations = () => {
    stopBarAnimations();

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const peak = gsap.utils.random(MIN_HEIGHT, MAX_HEIGHT);
      const tween = gsap.to(bar, {
        height: peak,
        duration: gsap.utils.random(0.45, 0.85),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.04,
      });
      barTweensRef.current.push(tween);
    });
  };

  useEffect(() => {
    if (!isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopBarAnimations();

      gsap.to(micRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' });
      gsap.killTweensOf([glowRef.current, glowOuterRef.current]);
      gsap.to(glowRef.current, { opacity: 0.35, scale: 1, duration: 0.45 });
      gsap.to(glowOuterRef.current, { opacity: 0.12, scale: 1, duration: 0.45 });
      return undefined;
    }

    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
    }, 1000);

    gsap.to(micRef.current, {
      scale: 1.1,
      duration: 0.45,
      ease: 'power2.out',
    });

    gsap.to(glowRef.current, {
      opacity: 0.9,
      scale: 1.2,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(glowOuterRef.current, {
      opacity: 0.45,
      scale: 1.35,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.15,
    });

    startBarAnimations();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopBarAnimations();
      gsap.killTweensOf([glowRef.current, glowOuterRef.current, micRef.current]);
    };
  }, [isRecording]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleToggle = () => {
    if (disabled) return;

    if (!isRecording) {
      secondsRef.current = 0;
      setSeconds(0);
      setIsRecording(true);
    } else {
      const duration = secondsRef.current;
      setIsRecording(false);
      onRecordingComplete?.({ duration });
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-white/70 bg-gradient-to-b from-white to-[#FAF6F0] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.09)]"
    >
      <div
        className={`mb-5 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
          isRecording ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#F0E6D8] text-body'
        }`}
      >
        {isRecording && (
          <span className="h-2 w-2 rounded-full bg-[#DC2626] shadow-[0_0_8px_#DC2626]" />
        )}
        {isRecording ? `Listening… ${formatTime(seconds)}` : 'Ready to record'}
      </div>

      <div className="flex h-32 w-full max-w-[280px] items-end justify-center gap-[5px] px-2">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className="w-[5px] max-w-[8px] flex-1 rounded-full bg-gradient-to-t from-[#8B6347] via-[#C4956A] to-[#E8D4BC]"
            style={{ height: IDLE_HEIGHT }}
          />
        ))}
      </div>

      <div className="relative mt-8 flex h-28 w-28 items-center justify-center">
        <div
          ref={glowOuterRef}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4A8C7]/50 to-[#C4956A]/30"
          aria-hidden
        />
        <div
          ref={glowRef}
          className="absolute inset-2 rounded-full bg-gradient-to-br from-[#C4956A]/50 to-[#8B6347]/40"
          aria-hidden
        />
        <button
          ref={micRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`relative z-10 flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full shadow-[0_8px_28px_rgba(28,20,16,0.35)] transition-colors duration-200 md:h-20 md:w-20 ${
            isRecording ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-heading hover:bg-[#2D2018]'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          aria-pressed={isRecording}
        >
          {isRecording ? (
            <span className="h-6 w-6 rounded-sm bg-white" />
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-body">
        {isRecording ? 'Tap the button to stop' : 'Tap the microphone to start'}
      </p>
    </div>
  );
}
