import React, { useState } from 'react';
import { Course, Topic, Lesson, Enrollment } from '../../types';
import {
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface CourseDetailsPageProps {
  courseId: string;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  onEnroll: (courseId: string) => void;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  courseId,
  courses,
  topics,
  lessons,
  enrollments,
  onEnroll,
  onNavigate,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseTopics = course ? topics.filter((t) => t.courseId === course.id).sort((a, b) => a.order - b.order) : [];
  const isEnrolled = enrollments.some((e) => e.courseId === course?.id);

  if (!course) {
    return (
      <div className="p-8 text-center bg-[#0A0F1D] rounded-2xl border border-white/8">
        <p className="text-sm text-[#94A3B8]">Course not found.</p>
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-semibold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleEnrollClick = async () => {
    if (isEnrolling || isEnrolled) return;
    setIsEnrolling(true);
    try {
      await onEnroll(course.id);
      onNavigate('course_map', { courseId: course.id });
    } catch {
      // Error handled by onEnroll notification
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </button>

      {/* Main Course Hero & Details Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#3B82F6] border border-[#2563EB]/20">
                Undergraduate Syllabus
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                Accredited Curriculum
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                <span>{courseTopics.length} Comprehensive Topics</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                <span>Adaptive Practice & Diagnostic Baseline</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="w-4 h-4 text-[#3B82F6]" />
                <span>Summative Final Exam Included</span>
              </span>
            </div>
          </div>

          {/* Action Box */}
          <div className="lg:w-72 shrink-0 p-5 rounded-2xl bg-white/5 border border-white/8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#64748B] block mb-1">
                Enrollment Status
              </span>
              {isEnrolled ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Enrolled & Active</span>
                </div>
              ) : (
                <div className="text-sm font-bold text-white">
                  Open for Self-Enrollment
                </div>
              )}
            </div>

            {isEnrolled ? (
              <button
                type="button"
                onClick={() => onNavigate('course_map', { courseId: course.id })}
                className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Continue Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnrollClick}
                disabled={isEnrolling}
                className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isEnrolling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enrolling...</span>
                  </>
                ) : (
                  <>
                    <span>Enroll in Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <p className="text-[11px] text-[#64748B] text-center leading-normal">
              Self-enrollment instantly creates your personalized learning path and prerequisite checks.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Curriculum Structure ({courseTopics.length} Topics)
          </h2>
          <span className="text-xs text-[#64748B]">
            Ordered by prerequisite progression
          </span>
        </div>

        <div className="space-y-3">
          {courseTopics.map((topic, index) => {
            const topicLessonsList = lessons.filter((l) => l.topicId === topic.id);
            const prereqs = courseTopics.filter((t) => topic.prerequisiteTopicIds.includes(t.id));

            return (
              <div
                key={topic.id}
                className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#3B82F6] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {topic.description}
                      </p>

                      {/* Prerequisites if any */}
                      {prereqs.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-orange-400">
                          <span className="font-semibold">Requires:</span>
                          {prereqs.map((p) => (
                            <span
                              key={p.id}
                              className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[11px]"
                            >
                              {p.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-[#64748B] shrink-0 font-medium">
                    {topicLessonsList.length} Lessons
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
