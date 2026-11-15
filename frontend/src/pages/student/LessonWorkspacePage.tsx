import React, { useState } from 'react';
import {
  Course,
  Topic,
  Lesson,
  LearningResource,
} from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Code,
  Video,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Download,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { AIHelperPanel } from '../../components/student/AIHelperPanel';
import { curriculumApi } from '../../services/api/curriculumApi';

interface LessonWorkspacePageProps {
  courseId: string;
  topicId: string;
  lessonId: string;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  resources: LearningResource[];
  isCompleted: boolean;
  onMarkComplete: (lessonId: string, courseId: string, topicId: string) => void;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const LessonWorkspacePage: React.FC<LessonWorkspacePageProps> = ({
  courseId,
  topicId,
  lessonId,
  courses,
  topics,
  lessons,
  resources,
  isCompleted,
  onMarkComplete,
  onNavigate,
}) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const topic = topics.find((t) => t.id === topicId) || topics[0];
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  const topicLessons = lessons.filter((l) => l.topicId === topic?.id).sort((a, b) => a.order - b.order);
  const currentIdx = topicLessons.findIndex((l) => l.id === lesson?.id);
  const prevLesson = currentIdx > 0 ? topicLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < topicLessons.length - 1 ? topicLessons[currentIdx + 1] : null;

  const lessonResources = resources.filter((r) => r.lessonId === lesson?.id);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    curriculumApi.recordResourceActivity(id, { event_type: 'read', duration_seconds: 15 }).catch(() => {});
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleResourceClick = (id: string, type: string) => {
    const event_type = type === 'video' ? 'watch' : 'read';
    curriculumApi.recordResourceActivity(id, { event_type, duration_seconds: 30 }).catch(() => {});
  };

  const handleComplete = () => {
    if (!isCompleted && lesson && course && topic) {
      onMarkComplete(lesson.id, course.id, topic.id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Top Bar with Navigation & AI Helper Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('course_map', { courseId: course.id })}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Learning Map</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/25 text-[#3B82F6] font-bold text-xs transition shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#3B82F6]" />
            <span>Simplify with AI</span>
          </button>

          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition shadow-2xs ${
              isCompleted
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-700 cursor-default'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Lesson Completed (+50 XP)' : 'Mark Lesson Complete'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#3B82F6] border border-[#2563EB]/20">
              Unit {lesson?.order || 1}
            </span>
            <span className="text-xs text-[#64748B]">
              {topic?.title}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lesson?.title}
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed max-w-3xl">
            {lesson?.description}
          </p>
        </div>

        {/* Learning Content Body */}
        <div className="prose prose-invert max-w-none pt-4 border-t border-white/6 space-y-4 text-sm leading-relaxed text-[#E2E8F0]">
          <p>
            In this unit, we investigate foundational principles and structural abstractions in <strong>{course?.title}</strong>.
            Understanding how state variables bind to physical registers and heap references gives you predictive control over application memory.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Core Architectural Invariants:
            </h4>
            <ul className="list-disc pl-5 text-xs text-[#94A3B8] space-y-1">
              <li>Deterministic state evaluation prevents runtime divergence.</li>
              <li>Prerequisite validation ensures downstream modules receive strictly typed inputs.</li>
              <li>Immutability safeguards memory references from unexpected shared concurrency mutations.</li>
            </ul>
          </div>
        </div>

        {/* Published Learning Resources Group */}
        <div className="pt-6 border-t border-white/6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3B82F6]" />
              <span>Published Learning Resources ({lessonResources.length})</span>
            </h3>
            <span className="text-xs text-[#64748B]">Official syllabus material</span>
          </div>

          {lessonResources.length > 0 ? (
            <div className="space-y-3">
              {lessonResources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-white/8 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      {res.type === 'document' ? (
                        <FileText className="w-4 h-4" />
                      ) : res.type === 'code' ? (
                        <Code className="w-4 h-4" />
                      ) : res.type === 'video' ? (
                        <Video className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {res.title}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        Type: <span className="font-semibold uppercase">{res.type}</span> {res.fileSize ? `• ${res.fileSize}` : ''}
                      </p>

                      {/* If code snippet, preview code */}
                      {res.type === 'code' && (
                        <pre className="mt-2 p-3 rounded-lg bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto">
                          {res.contentOrUrl}
                        </pre>
                      )}

                      {/* If markdown notes, render markdown snippet */}
                      {res.type === 'markdown' && (
                        <div className="mt-2 p-3 rounded-lg bg-[#0A0F1D] border border-white/8 text-xs font-mono text-[#94A3B8]">
                          {res.contentOrUrl}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {res.type === 'code' ? (
                      <button
                        type="button"
                        onClick={() => handleCopyCode(res.id, res.contentOrUrl)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-semibold flex items-center gap-1.5 text-[#94A3B8]"
                      >
                        {copiedCodeId === res.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        href={res.contentOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleResourceClick(res.id, res.type)}
                        className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#64748B] italic">No supplemental media uploaded for this unit.</p>
          )}
        </div>
      </div>

      {/* Lesson Navigation Footer: Previous / Next */}
      <div className="flex items-center justify-between border-t border-white/8 pt-6">
        {prevLesson ? (
          <button
            type="button"
            onClick={() =>
              onNavigate('lesson', {
                courseId: course.id,
                topicId: topic.id,
                lessonId: prevLesson.id,
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs sm:text-sm font-semibold text-[#94A3B8] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: {prevLesson.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            type="button"
            onClick={() =>
              onNavigate('lesson', {
                courseId: course.id,
                topicId: topic.id,
                lessonId: nextLesson.id,
              })
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
          >
            <span>Next: {nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('course_map', { courseId: course.id })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer"
          >
            <span>Return to Course Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Attached AI Helper Drawer */}
      <AIHelperPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        lessonId={lesson?.id || lessonId}
        lessonTitle={lesson?.title || 'Current Lesson'}
        topicTitle={topic?.title || 'Topic'}
        courseTitle={course?.title || 'Course'}
        lessonContent={lesson?.description || ''}
      />
    </div>
  );
};
