import React from 'react';
import { StudentAssessmentResult, Course, Topic } from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Zap,
  ArrowRight,
  Map,
  BookOpen,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface AssessmentResultsPageProps {
  result: StudentAssessmentResult;
  course?: Course;
  topic?: Topic;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const AssessmentResultsPage: React.FC<AssessmentResultsPageProps> = ({
  result,
  course,
  topic,
  onNavigate,
}) => {
  const isPassed = result.scorePercent >= 70;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-fade-in">
      {/* 1. OUTCOME HEADER CARD */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-5">
        <div
          className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
            isPassed
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
          }`}
        >
          {isPassed ? <CheckCircle2 className="w-8 h-8 stroke-[2.5]" /> : <AlertCircle className="w-8 h-8 stroke-[2.5]" />}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 inline-block mb-2">
            {result.type === 'diagnostic' ? 'Diagnostic Baseline Calibrated' : result.type === 'adaptive' ? 'Adaptive Practice Completed' : 'Summative Examination Recorded'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {result.assessmentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Course: <strong className="text-white">{course?.title || 'Computer Science'}</strong> {topic ? `• Unit: ${topic.title}` : ''}
          </p>
        </div>

        {/* Score & Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/8">
            <span className="text-xs text-[#64748B] block mb-1">Final Score</span>
            <span className={`text-2xl font-black ${isPassed ? 'text-emerald-400' : 'text-orange-400'}`}>
              {result.scorePercent}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/8">
            <span className="text-xs text-[#64748B] block mb-1">Correct Items</span>
            <span className="text-2xl font-black text-white">
              {result.correctCount} / {result.totalQuestions}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/8">
            <span className="text-xs text-[#64748B] block mb-1">Evaluation</span>
            <span className="text-sm font-bold uppercase text-white">
              {isPassed ? 'Proficient' : 'Developing'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. LEARNING INTERPRETATION CARD */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3B82F6]" />
          <span>Curriculum Mastery Recalibration</span>
        </h3>

        <div className="p-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-xs sm:text-sm text-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between font-bold">
            <span>Calibrated Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 text-[#93C5FD] uppercase text-xs">
              {result.masteryStatus.replace('_', ' ')} ({result.scorePercent}%)
            </span>
          </div>
          <p className="text-[#94A3B8] text-xs leading-relaxed">
            {result.type === 'diagnostic'
              ? 'Your prerequisite baseline has been calibrated. Recommended topics have been populated into your personalized learning map.'
              : result.type === 'adaptive'
              ? 'Your topic-level cognitive mastery has been updated in the evidence matrix. Downstream prerequisites will reflect this new score.'
              : 'Official summative examination results have been verified. Course syllabus completion has been updated.'}
          </p>
        </div>
      </div>

      {/* 3. GAMIFICATION REWARD STRIP (Visually separated from academic outcome) */}
      <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Verified Experience Reward
            </span>
            <h4 className="text-base font-bold text-orange-200">
              +{result.xpAwarded} XP Confirmed by Gamification Engine
            </h4>
          </div>
        </div>

        {result.badgeAwarded && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-orange-500/30 text-xs font-bold text-orange-200">
            <Award className="w-4 h-4 text-orange-400" />
            <span>Badge: {result.badgeAwarded.title}</span>
          </div>
        )}
      </div>

      {/* 4. PRIMARY NEXT RECOMMENDED ACTION */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
            Recommended Next Step
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            {result.nextRecommendedAction.label}
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('course_map', { courseId: course?.id || '' })}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-[#94A3B8] hover:text-white transition cursor-pointer"
          >
            <Map className="w-4 h-4 inline-block mr-1.5" />
            <span>Course Map</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (result.nextRecommendedAction.type === 'lesson') {
                onNavigate('lesson', {
                  courseId: course?.id || '',
                  topicId: topic?.id || '',
                  lessonId: result.nextRecommendedAction.targetId,
                });
              } else if (result.nextRecommendedAction.type === 'adaptive_practice') {
                onNavigate('practice_player', { assessmentId: 'asm-adapt-1' });
              } else {
                onNavigate('course_map', { courseId: course?.id || '' });
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer transition"
          >
            <span>Continue Progression</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
