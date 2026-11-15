import React, { useState } from 'react';
import {
  Course,
  Topic,
  Lesson,
  MasteryState,
  AssessmentAttempt,
  LessonCompletion,
} from '../../types';
import {
  BarChart2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface ProgressAnalyticsPageProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  masteryStates: MasteryState[];
  attempts: AssessmentAttempt[];
  completions: LessonCompletion[];
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const ProgressAnalyticsPage: React.FC<ProgressAnalyticsPageProps> = ({
  courses,
  topics,
  lessons,
  masteryStates,
  attempts,
  completions,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'mastery' | 'attempts' | 'lessons'>('mastery');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseTopics = activeCourse ? topics.filter((t) => t.courseId === activeCourse.id) : [];
  const courseMasteryStates = activeCourse ? masteryStates.filter((m) => m.courseId === activeCourse.id) : [];
  const courseAttempts = activeCourse ? attempts.filter((a) => a.courseId === activeCourse.id) : attempts;
  const courseCompletions = activeCourse ? completions.filter((c) => c.courseId === activeCourse.id) : completions;

  // Counts
  const assessedCount = courseMasteryStates.filter((m) => m.status !== 'not_assessed').length;
  const masteredCount = courseMasteryStates.filter((m) => m.status === 'mastered').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Course Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Progress & Mastery Analytics
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Empirical evidence of your cognitive mastery, sequential attempt history, and syllabus completion.
          </p>
        </div>

        {/* Course Filter Dropdown */}
        {courses.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="course-select" className="text-xs font-semibold text-[#64748B]">
              Course:
            </label>
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-[#0A0F1D] text-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Assessed Topics
          </span>
          <div className="text-2xl font-black text-white">
            {assessedCount} <span className="text-sm font-normal text-[#64748B]">of {courseTopics.length} Units</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Mastered Units (85%+)
          </span>
          <div className="text-2xl font-black text-emerald-400">
            {masteredCount} Topics
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] block mb-1">
            Completed Lessons
          </span>
          <div className="text-2xl font-black text-[#3B82F6]">
            {courseCompletions.length} Lessons
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-white/8 flex items-center gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('mastery')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'mastery'
              ? 'border-[#2563EB] text-[#3B82F6]'
              : 'border-transparent text-[#64748B] hover:text-[#E2E8F0]'
          }`}
        >
          Topic Mastery Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attempts')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'attempts'
              ? 'border-[#2563EB] text-[#3B82F6]'
              : 'border-transparent text-[#64748B] hover:text-[#E2E8F0]'
          }`}
        >
          Assessment History ({courseAttempts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lessons')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'lessons'
              ? 'border-[#2563EB] text-[#3B82F6]'
              : 'border-transparent text-[#64748B] hover:text-[#E2E8F0]'
          }`}
        >
          Completed Lessons ({courseCompletions.length})
        </button>
      </div>

      {/* TAB 1: TOPIC MASTERY MATRIX */}
      {activeTab === 'mastery' && (
        <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-white/6 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Syllabus Units & Cognitive Mastery Status
            </h3>
            <span className="text-xs text-[#64748B]">
              Threshold: Competent ≥ 70%, Mastered ≥ 85%
            </span>
          </div>

          <div className="divide-y divide-white/6">
            {courseTopics.map((topic, idx) => {
              const state = courseMasteryStates.find((m) => m.topicId === topic.id);
              const score = state?.scorePercent;
              const isAssessed = state && state.status !== 'not_assessed' && score !== undefined && score >= 0;

              return (
                <div
                  key={topic.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white/8 text-[#94A3B8] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0 self-end sm:self-auto">
                    {isAssessed ? (
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-white/8 rounded-full h-2 overflow-hidden hidden sm:block">
                            <div
                              className={`h-2 rounded-full ${
                                score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-[#2563EB]' : 'bg-orange-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              state.status === 'mastered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : state.status === 'competent'
                                ? 'bg-[#2563EB]/10 text-[#3B82F6] border-[#2563EB]/20'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}
                          >
                            {state.status.toUpperCase()} ({score}%)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-[#64748B] italic px-2.5 py-0.5 rounded-full bg-white/8">
                        Not assessed yet
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onNavigate('course_map', { courseId: activeCourse.id })}
                      className="p-1 text-[#64748B] hover:text-[#3B82F6] transition cursor-pointer"
                      title="View on Map"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENT HISTORY */}
      {activeTab === 'attempts' && (
        <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-white/6">
            <h3 className="text-base font-bold text-white">
              Assessment Attempt Records
            </h3>
          </div>

          {courseAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/8 text-[#64748B] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Assessment Title</th>
                    <th className="px-5 py-3.5">Score</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {courseAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-white/5 transition">
                      <td className="px-5 py-4 font-semibold text-white">
                        {att.assessmentTitle}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-black text-sm ${
                            att.scorePercent >= 70 ? 'text-emerald-400' : 'text-orange-400'
                          }`}
                        >
                          {att.scorePercent}%
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {att.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#64748B]">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No assessment attempts recorded for this course yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED LESSONS */}
      {activeTab === 'lessons' && (
        <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-white/6">
            <h3 className="text-base font-bold text-white">
              Verified Completed Lessons
            </h3>
          </div>

          {courseCompletions.length > 0 ? (
            <div className="divide-y divide-white/6">
              {courseCompletions.map((comp) => {
                const lesson = lessons.find((l) => l.id === comp.lessonId);
                const topic = topics.find((t) => t.id === comp.topicId);

                return (
                  <div key={comp.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {lesson?.title || comp.lessonId}
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          Topic: {topic?.title || 'Curriculum unit'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#64748B]">
                      Completed {new Date(comp.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No completed lessons recorded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
