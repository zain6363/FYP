import React, { useState } from 'react';
import { Sparkles, X, Send, BookOpen, Lightbulb, Code2, HelpCircle, RefreshCw, Layers } from 'lucide-react';
import { aiApi } from '../../services/api/aiApi';

interface AIHelperPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  topicTitle: string;
  courseTitle: string;
  lessonContent: string;
  lessonId?: string;
}

export const AIHelperPanel: React.FC<AIHelperPanelProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  topicTitle,
  courseTitle,
  lessonContent,
  lessonId,
}) => {
  const [mode, setMode] = useState<'simplify' | 'analogy' | 'example' | 'custom'>('simplify');
  const [customPrompt, setCustomPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'gemini' | 'gemini_cache' | 'academic_cache' | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchExplanation = async (selectedMode: 'simplify' | 'analogy' | 'example' | 'custom', promptOverride?: string) => {
    setIsLoading(true);
    setError(null);
    setMode(selectedMode);

    try {
      let explanationText = '';
      let sourceVal: any = null;
      let cachedFlag = false;

      try {
        const data = await aiApi.simplifyLesson({
          lessonId,
          lessonTitle,
          topicTitle,
          courseTitle,
          lessonContent,
          mode: selectedMode,
          customPrompt: promptOverride !== undefined ? promptOverride : customPrompt,
        });
        if (data.success) {
          explanationText = data.explanation;
          sourceVal = data.source;
          cachedFlag = Boolean(data.is_cached);
        }
      } catch (fastApiErr) {
        const res = await fetch('/api/ai/simplify-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            lessonTitle,
            topicTitle,
            courseTitle,
            lessonContent,
            mode: selectedMode,
            customPrompt: promptOverride !== undefined ? promptOverride : customPrompt,
          }),
        });
        if (!res.ok) {
          throw new Error('Failed to generate response. Please try again.');
        }
        const fallbackData = await res.json();
        explanationText = fallbackData.explanation;
        sourceVal = fallbackData.source;
        cachedFlag = Boolean(fallbackData.isCached);
      }

      setResponse(explanationText);
      setSource(sourceVal);
      setIsCached(cachedFlag);
    } catch (err: any) {
      setError(err?.message || 'Could not connect to AI service. Using cached concepts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isLoading) return;
    handleFetchExplanation('custom', customPrompt.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="AI Lesson Helper"
    >
      <div className="w-full max-w-lg bg-[#080C18] h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-white/8 flex items-center justify-between shrink-0 bg-[#060A14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#3B82F6] flex items-center justify-center border border-[#2563EB]/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                AI Lesson Assistant
              </h3>
              <p className="text-xs text-[#94A3B8] truncate max-w-[260px]">
                Context: {lessonTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label="Close AI helper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Preset Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Instant Explanations:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFetchExplanation('simplify')}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  mode === 'simplify' && response
                    ? 'border-[#2563EB] bg-[#2563EB]/15 text-[#3B82F6]'
                    : 'border-white/8 bg-white/5 hover:bg-white/8 text-[#94A3B8] hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                <span>Simplify</span>
              </button>

              <button
                type="button"
                onClick={() => handleFetchExplanation('analogy')}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  mode === 'analogy' && response
                    ? 'border-[#2563EB] bg-[#2563EB]/15 text-[#3B82F6]'
                    : 'border-white/8 bg-white/5 hover:bg-white/8 text-[#94A3B8] hover:text-white'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-orange-400" />
                <span>Analogy</span>
              </button>

              <button
                type="button"
                onClick={() => handleFetchExplanation('example')}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  mode === 'example' && response
                    ? 'border-[#2563EB] bg-[#2563EB]/15 text-[#3B82F6]'
                    : 'border-white/8 bg-white/5 hover:bg-white/8 text-[#94A3B8] hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Example</span>
              </button>
            </div>
          </div>

          {/* AI Response Display */}
          {isLoading && (
            <div className="p-6 rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/10 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-[#93C5FD]">
                Generating educational clarification...
              </p>
              <p className="text-xs text-[#3B82F6]/70">
                Analyzing lesson syllabus: "{lessonTitle}"
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-300 text-sm flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
                <button
                  type="button"
                  onClick={() => handleFetchExplanation(mode)}
                  className="mt-2 text-xs font-semibold underline hover:no-underline text-rose-400"
                >
                  Retry request
                </button>
              </div>
            </div>
          )}

          {response && !isLoading && (
            <div className="space-y-3">
              {/* Context & Source badge */}
              <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    Source:{' '}
                    <strong className="text-white">
                      {source === 'gemini' ? 'Gemini 2.5 Flash' : source === 'gemini_cache' ? 'Verified Cached Response' : 'Academic Syllabus Cache'}
                    </strong>
                  </span>
                </div>
                {isCached && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 text-[11px] font-medium border border-emerald-800">
                    Cached
                  </span>
                )}
              </div>

              {/* Rendered content */}
              <div className="p-5 rounded-2xl border border-white/8 bg-[#0A0F1D] text-sm text-[#E2E8F0] leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                {response}
              </div>
            </div>
          )}

          {!response && !isLoading && !error && (
            <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl text-[#64748B] space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-[#3B82F6] opacity-60" />
              <p className="text-sm font-medium text-[#94A3B8]">Have questions about this lesson?</p>
              <p className="text-xs">
                Click one of the instant chips above or ask a specific question below. The official lesson notes will stay safe and accessible at all times.
              </p>
            </div>
          )}
        </div>

        {/* Custom Question Footer Form */}
        <div className="p-4 border-t border-white/8 bg-[#060A14] shrink-0">
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask about this lesson (e.g. 'Why use a tuple?')..."
                className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <button
                type="submit"
                disabled={!customPrompt.trim() || isLoading}
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg transition ${
                  customPrompt.trim() && !isLoading
                    ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] cursor-pointer'
                    : 'text-[#475569] cursor-not-allowed'
                }`}
                aria-label="Send custom question"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-[#64748B] text-center">
              AI responses are supplemental aids grounded in the official syllabus.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
