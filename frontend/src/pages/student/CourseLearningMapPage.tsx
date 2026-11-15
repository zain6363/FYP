import React, { useState, useEffect } from 'react';
import {
  Course,
  Topic,
  Lesson,
  LearningResource,
  Enrollment,
  MasteryState,
  Assessment,
} from '../../types';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  BookOpen,
  FileText,
  AlertCircle,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { determineTopicReadiness } from '../../utils/studentLogic';
import {
  learningPathApi,
  LearningMapResponse,
  CourseLearningPathResponse,
} from '../../services/api/learningPathApi';

interface CourseLearningMapPageProps {
  courseId: string;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  resources: LearningResource[];
  enrollments: Enrollment[];
  masteryStates: MasteryState[];
  assessments: Assessment[];
  completedLessonIds: Set<string>;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const CourseLearningMapPage: React.FC<CourseLearningMapPageProps> = ({
  courseId,
  courses,
  topics,
  lessons,
  resources,
  enrollments,
  masteryStates,
  assessments,
  completedLessonIds,
  onNavigate,
}) => {
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseTopics = course ? topics.filter((t) => t.courseId === course.id).sort((a, b) => a.order - b.order) : [];
  const enr = enrollments.find((e) => e.courseId === course?.id);

  // Expanded topics state: default first topic expanded
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    if (courseTopics[0]) init[courseTopics[0].id] = true;
    if (courseTopics[1]) init[courseTopics[1].id] = true;
    return init;
  });

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [learningMap, setLearningMap] = useState<LearningMapResponse | null>(null);
  const [learningPath, setLearningPath] = useState<CourseLearningPathResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (course?.id) {
      learningPathApi
        .getLearningMap(course.id)
        .then((map) => {
          if (isMounted) setLearningMap(map);
        })
        .catch(() => {
          // Graceful fallback to client DAG
        });

      learningPathApi
        .getLearningPath(course.id)
        .then((path) => {
          if (isMounted) setLearningPath(path);
        })
        .catch(() => {
          // Graceful fallback
        });
    }
    return () => {
      isMounted = false;
    };
  }, [course?.id]);

  // Build topic mastery lookup map
  const masteryMap: Record<string, { status: any; scorePercent: number }> = {};
  for (const m of masteryStates) {
    masteryMap[m.topicId] = { status: m.status, scorePercent: m.scorePercent };
  }

  // Find assessments for this course
  const courseAssessments = assessments.filter((a) => a.courseId === course?.id && a.status === 'published');
  const diagnostic = courseAssessments.find((a) => a.type === 'diagnostic');
  const adaptive = courseAssessments.find((a) => a.type === 'adaptive');
  const finalExam = courseAssessments.find((a) => a.type === 'final');

  // Check if student meets prerequisites for final exam
  const allTopicsMastered = courseTopics.every((t) => {
    const m = masteryMap[t.id];
    return m && (m.status === 'competent' || m.status === 'mastered');
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Course Overview Banner */}
      <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                Course Learning Map
              </span>
              <span className="text-xs text-[#64748B]">•</span>
              <span className="text-xs font-semibold text-[#94A3B8]">
                {courseTopics.length} Topics
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {course?.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
              {course?.description}
            </p>
          </div>

          <div className="md:w-60 shrink-0 bg-white/5 p-4 rounded-xl border border-white/8">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#94A3B8]">Course Progress</span>
              <span className="text-[#3B82F6]">{enr?.progressPercent || 0}%</span>
            </div>
            <div className="w-full bg-white/8 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
                style={{ width: `${enr?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Curriculum Tree (8 cols) & Right Assessment Status (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Curriculum Topic Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-bold text-white">
            Curriculum Structure & Lesson Sequence
          </h2>

          <div className="space-y-4">
            {courseTopics.map((topic, index) => {
              const isExpanded = Boolean(expandedTopics[topic.id]);
              const topicLessons = lessons.filter((l) => l.topicId === topic.id).sort((a, b) => a.order - b.order);
              const serverNode = learningMap?.nodes.find((n) => n.id === topic.id);
              const localReadiness = determineTopicReadiness(topic.prerequisiteTopicIds, masteryMap);
              const isTopicReady = serverNode
                ? serverNode.readiness === 'ready' || serverNode.readiness === 'in_progress'
                : localReadiness.isReady;
              const readiness = {
                isReady: isTopicReady,
                unmetPrerequisites: serverNode ? serverNode.unmet_prerequisites : localReadiness.unmetPrerequisites,
              };
              const mastery = masteryMap[topic.id];

              // Prerequisite titles
              const prereqTopics = courseTopics.filter((t) =>
                serverNode ? serverNode.prerequisite_ids.includes(t.id) : topic.prerequisiteTopicIds.includes(t.id)
              );

              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl border transition-all ${
                    readiness.isReady
                      ? 'bg-[#0A0F1D] border-white/8 shadow-xs'
                      : 'bg-white/5 border-white/8 opacity-90'
                  }`}
                >
                  {/* Topic Header Accordion Button */}
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          readiness.isReady
                            ? 'bg-[#2563EB]/10 text-[#3B82F6]'
                            : 'bg-white/8 text-[#64748B]'
                        }`}
                      >
                        {readiness.isReady ? index + 1 : <Lock className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">
                            {topic.title}
                          </h3>

                          {/* Mastery Status Pill */}
                          {mastery ? (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                mastery.status === 'mastered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-700'
                                  : mastery.status === 'competent'
                                  ? 'bg-[#2563EB]/10 text-[#3B82F6] border-[#2563EB]/20'
                                  : mastery.status === 'developing'
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                  : 'bg-white/8 text-[#94A3B8] border-white/8'
                              }`}
                            >
                              {mastery.status === 'not_assessed'
                                ? 'Not assessed yet'
                                : `${mastery.status.toUpperCase()} (${mastery.scorePercent}%)`}
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-[#64748B] border border-white/8">
                              Not assessed yet
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#94A3B8] line-clamp-1">
                          {topic.description}
                        </p>

                        {/* Blocked Prerequisite Warning */}
                        {!readiness.isReady && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>
                              Requires foundational completion in:{' '}
                              <strong>{prereqTopics.map((p) => p.title).join(', ')}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[#64748B]">
                      <span className="text-xs hidden sm:inline">
                        {topicLessons.length} {topicLessons.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Lessons List */}
                  {isExpanded && (
                    <div className="border-t border-white/6 px-4 sm:px-5 py-3 space-y-2 bg-white/5 rounded-b-2xl">
                      {topicLessons.map((lesson) => {
                        const isDone = completedLessonIds.has(lesson.id);
                        const lessonResources = resources.filter((r) => r.lessonId === lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            className="p-3 rounded-xl bg-[#0A0F1D] border border-white/8 flex items-center justify-between gap-3 hover:border-[#2563EB]/40 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-white/10 text-[#64748B]'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] font-bold">{lesson.order}</span>
                                )}
                              </span>

                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                                  <span>{lessonResources.length} learning resources</span>
                                  {isDone && <span className="text-emerald-400 font-medium">• Completed</span>}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                onNavigate('lesson', {
                                  courseId: course.id,
                                  topicId: topic.id,
                                  lessonId: lesson.id,
                                })
                              }
                              className="px-3 py-1.5 rounded-lg bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#3B82F6] text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                            >
                              <span>{isDone ? 'Review' : 'Open'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Assessment Availability & Next Action (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Dynamic Personalized Recommended Next Step */}
          {learningPath?.recommended_next_step && (
            <div className="p-5 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/25 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Next Step</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#2563EB]/15 text-[#93C5FD] uppercase">
                  {learningPath.recommended_next_step.type.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                {learningPath.recommended_next_step.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {learningPath.recommended_next_step.reason}
              </p>
              {learningPath.recommended_next_step.lesson_id && (
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('lesson', {
                      courseId: course?.id || '',
                      topicId: learningPath.recommended_next_step.topic_id,
                      lessonId: learningPath.recommended_next_step.lesson_id!,
                    })
                  }
                  className="w-full py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <span>Start Recommended Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Diagnostic Baseline Card */}
          {diagnostic && (
            <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                  Diagnostic Baseline
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2563EB]/10 text-[#3B82F6] border border-[#2563EB]/20">
                  {diagnostic.timeLimitMinutes} min
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {diagnostic.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Calibrates your baseline topic mastery and generates your initial recommended learning sequence.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('diagnostic_intro', { assessmentId: diagnostic.id })}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Take Diagnostic Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Adaptive Practice Card */}
          {adaptive && (
            <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Adaptive Practice
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-700">
                  Interactive
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {adaptive.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Item difficulty adjusts after each answer. Your responses recalibrate topic mastery after completion.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('practice_player', { assessmentId: adaptive.id })}
                className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Adaptive Practice</span>
              </button>
            </div>
          )}

          {/* Final Examination Card */}
          {finalExam && (
            <div className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Summative Exam
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {finalExam.timeLimitMinutes} min
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {finalExam.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Formal summative exam covering all topics in {course?.title}. Auto-submitted upon expiration.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('exam_player', { assessmentId: finalExam.id })}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Start Final Examination</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
