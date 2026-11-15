import React, { useState, useEffect } from 'react';
import { AssessmentType } from '../../types';
import { Timer, ArrowLeft, AlertTriangle } from 'lucide-react';

interface AssessmentPlayerShellProps {
  title: string;
  type: AssessmentType;
  currentQuestionIndex: number;
  totalQuestions?: number;
  timeLimitMinutes?: number;
  remainingSeconds?: number;
  onTimerExpire?: () => void;
  onExit: () => void;
  onSubmitAnswer: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  isLastQuestion?: boolean;
  children: React.ReactNode;
}

export const AssessmentPlayerShell: React.FC<AssessmentPlayerShellProps> = ({
  title,
  type,
  currentQuestionIndex,
  totalQuestions,
  timeLimitMinutes,
  remainingSeconds: initialRemainingSeconds,
  onTimerExpire,
  onExit,
  onSubmitAnswer,
  isSubmitting = false,
  canSubmit = true,
  isLastQuestion = false,
  children,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (initialRemainingSeconds !== undefined) return initialRemainingSeconds;
    if (timeLimitMinutes) return timeLimitMinutes * 60;
    return 0;
  });

  const isTimed = Boolean(timeLimitMinutes && timeLimitMinutes > 0);

  useEffect(() => {
    if (!isTimed || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onTimerExpire) onTimerExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimed, secondsLeft, onTimerExpire]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = isTimed && secondsLeft < 300; // < 5 mins
  const progressPercent = totalQuestions && totalQuestions > 0
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080C18] text-[#F8FAFC] flex flex-col">
      {/* Distraction-minimized Assessment Header */}
      <header className="sticky top-0 z-30 bg-[#060A14]/90 backdrop-blur-md border-b border-white/8 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Exit action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
              aria-label="Exit assessment"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2563EB]/15 text-[#3B82F6] border border-[#2563EB]/25">
                  {type === 'diagnostic' ? 'Diagnostic' : type === 'adaptive' ? 'Adaptive Practice' : 'Final Exam'}
                </span>
                <span className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md text-white">
                  {title}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Progress & Timer */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Question Counter */}
            <div className="text-xs sm:text-sm font-medium text-[#94A3B8]">
              {totalQuestions ? (
                <>
                  Question <span className="text-white font-bold">{currentQuestionIndex + 1}</span> of {totalQuestions}
                </>
              ) : (
                <>
                  Item <span className="text-white font-bold">{currentQuestionIndex + 1}</span> (Adaptive)
                </>
              )}
            </div>

            {/* Authoritative Timer if timed */}
            {isTimed && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs sm:text-sm font-bold border transition-colors ${isLowTime
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300 animate-pulse'
                  : 'bg-white/5 border-white/10 text-white'
                  }`}
                title="Time remaining"
              >
                <Timer className="w-4 h-4" />
                <span>{formatTime(secondsLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thin progress bar if total is known */}
        {totalQuestions && (
          <div className="w-full bg-white/8 h-1">
            <div
              className="bg-[#2563EB] h-1 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </header>

      {/* Main Question Surface */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-between">
        <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xs">
          {children}
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-6">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="text-xs sm:text-sm text-[#64748B] hover:text-[#94A3B8] cursor-pointer"
          >
            Need to take a break? Exit attempt
          </button>

          <button
            type="button"
            onClick={onSubmitAnswer}
            disabled={!canSubmit || isSubmitting}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${canSubmit && !isSubmitting
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-600/30 cursor-pointer'
              : 'bg-white/5 text-[#64748B] cursor-not-allowed border border-white/5'
              }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting response...</span>
              </>
            ) : isLastQuestion ? (
              <span>Submit & Finish Assessment</span>
            ) : (
              <span>Next Question →</span>
            )}
          </button>
        </div>
      </main>

      {/* Leave Assessment Guard Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0A0F1D] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Leave this assessment?
            </h4>
            <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
              Your answered questions will be saved. {type === 'final' ? 'Because this is a timed examination, the timer will continue running.' : 'You can return to complete this session anytime.'}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/5 cursor-pointer"
              >
                Keep Testing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Yes, Exit Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
