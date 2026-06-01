import { useEffect, useRef, useState } from 'react';

const WAVE_CLASSES = [
  'assistant-wave-1',
  'assistant-wave-2',
  'assistant-wave-3',
  'assistant-wave-4',
  'assistant-wave-5',
  'assistant-wave-6',
  'assistant-wave-7',
];

export default function VoiceRecorder({ onRecordingComplete, disabled = false }) {
  const [state, setState] = useState('idle');
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (state !== 'recording') {
      if (timerRef.current) clearInterval(timerRef.current);
      return undefined;
    }
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [state]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleToggle = () => {
    if (disabled) return;
    if (state === 'idle') {
      setSeconds(0);
      setState('recording');
    } else if (state === 'recording') {
      setState('idle');
      onRecordingComplete?.({ duration: seconds });
    }
  };

  return (
    <div className="rounded-2xl border border-black/[0.07] border-t-[3px] border-t-accent bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-heading">Voice Recording</h3>
        {state === 'recording' && (
          <span className="flex items-center gap-2 text-xs font-medium text-[#DC2626]">
            <span className="assistant-record-pulse h-2 w-2 rounded-full bg-[#DC2626]" />
            Listening...
          </span>
        )}
      </div>

      <div className="mt-6 flex min-h-[180px] flex-col items-center justify-center">
        {state === 'recording' && (
          <>
            <p className="font-serif text-3xl tabular-nums text-heading">{formatTime(seconds)}</p>
            <div className="my-5 flex h-10 items-end gap-1.5">
              {WAVE_CLASSES.map((cls) => (
                <span key={cls} className={`w-1 rounded-full bg-accent ${cls}`} />
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200 ${
            state === 'recording'
              ? 'bg-[#DC2626] hover:scale-105 hover:bg-[#B91C1C]'
              : 'bg-heading hover:scale-105 hover:bg-[#2D2018]'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          aria-label={state === 'recording' ? 'Stop recording' : 'Start recording'}
        >
          {state === 'recording' ? (
            <span className="h-5 w-5 rounded-sm bg-white" />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          )}
        </button>

        <p className="mt-4 text-sm text-body">
          {state === 'recording' ? 'Tap to stop' : 'Tap to record your complaint'}
        </p>
        <p className="mt-1 text-xs text-muted">Speak naturally in your selected language</p>
      </div>
    </div>
  );
}
