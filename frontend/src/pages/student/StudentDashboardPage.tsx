import React from 'react';
import {
  Course,
  Topic,
  Lesson,
  Enrollment,
  GamificationProfile,
  StudentUser,
  MasteryState,
  Badge,
  AssessmentAttempt,
} from '../../types';
import {
  Play,
  ArrowRight,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface StudentDashboardPageProps {
  currentUser: StudentUser;
  gamificationProfile: GamificationProfile;
  enrollments: Enrollment[];
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  masteryStates: MasteryState[];
  badges: Badge[];
  recentAttempts: AssessmentAttempt[];
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  currentUser,
  gamificationProfile,
  enrollments,
  courses,
  topics,
  lessons,
  masteryStates,
  badges,
  recentAttempts,
  onNavigate,
}) => {
  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const primaryCourse = courses.find((c) => enrolledCourseIds.has(c.id)) || courses[0];

  // Find next lesson to study in primary course
  const courseTopics = primaryCourse ? topics.filter((t) => t.courseId === primaryCourse.id) : [];
  const primaryTopic = courseTopics[1] || courseTopics[0]; // e.g. topic-control
  const topicLessons = primaryTopic ? lessons.filter((l) => l.topicId === primaryTopic.id) : [];
  const nextLesson = topicLessons[0];

  // Learning stats
  const assessedTopicsCount = masteryStates.filter((m) => m.status !== 'not_assessed').length;
  const masteredTopicsCount = masteryStates.filter((m) => m.status === 'mastered').length;
  const recentBadge = badges.filter((b) => b.isUnlocked)[0];
  const latestAttempt = recentAttempts[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Pick up where you left off or explore recommended practice sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0A0F1D] hover:bg-white/5 text-sm font-semibold text-[#E2E8F0] transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#3B82F6]" />
          <span>Explore Course Catalog</span>
        </button>
      </div>

      {/* Main Grid: Left Primary Column (8 cols) & Right Insights Column (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Priority 1: CONTINUE LEARNING CARD */}
          {primaryCourse && nextLesson ? (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                  Continue Learning
                </span>
                <span className="text-xs text-[#64748B] font-medium">
                  {primaryCourse.title}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {nextLesson.title}
              </h2>

              <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed max-w-2xl">
                Topic: <strong className="text-[#E2E8F0]">{primaryTopic?.title}</strong>. {nextLesson.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('lesson', {
                      courseId: primaryCourse.id,
                      topicId: primaryTopic.id,
                      lessonId: nextLesson.id,
                    })
                  }
                  className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Lesson</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('course_map', { courseId: primaryCourse.id })}
                  className="px-4 py-3 rounded-xl border border-white/8 hover:bg-white/5 text-[#94A3B8] font-semibold text-sm transition"
                >
                  View Full Course Map
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0A0F1D] border border-white/8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#2563EB]/10 text-[#3B82F6] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Start your learning journey
                </h3>
                <p className="text-sm text-[#64748B] mt-1">
                  You are not currently enrolled in any course. Discover available courses in our catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition cursor-pointer"
              >
                Browse Course Catalog
              </button>
            </div>
          )}

          {/* Recommended Next Activity */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#2563EB]/8 border border-[#2563EB]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6]">
                  Adaptive Engine Recommendation
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Recalibrate Mastery: Conditional Logic & Control Flow
                </h4>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Targeted practice questions with dynamic difficulty based on your latest quiz responses.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('practice_player', { assessmentId: 'asm-adapt-1' })}
              className="px-4 py-2.5 rounded-xl bg-[#0A0F1D] hover:bg-[#2563EB]/15 border border-[#2563EB]/25 text-[#3B82F6] text-xs font-bold transition shrink-0 self-start sm:self-auto shadow-2xs cursor-pointer"
            >
              Start Adaptive Practice →
            </button>
          </div>

          {/* My Active Courses Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Active Enrolled Courses ({activeEnrollments.length})
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('my_learning')}
                className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEnrollments.map((enr) => {
                const course = courses.find((c) => c.id === enr.courseId);
                if (!course) return null;
                const cTopics = topics.filter((t) => t.courseId === course.id);
                return (
                  <div
                    key={enr.id}
                    onClick={() => onNavigate('course_map', { courseId: course.id })}
                    className="p-5 rounded-2xl bg-[#0A0F1D] border border-white/8 hover:border-[#2563EB]/40 transition shadow-xs cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                        <span className="font-semibold text-[#3B82F6]">
                          {cTopics.length} Curriculum Topics
                        </span>
                        <span>{enr.progressPercent || 0}% Complete</span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#3B82F6] transition leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/6">
                      <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${enr.progressPercent || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Insights Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in-delayed">
          {/* Gamification Strip */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Gamification Stats
              </span>
              <button
                type="button"
                onClick={() => onNavigate('achievements')}
                className="text-xs font-semibold text-[#3B82F6] hover:underline"
              >
                All Badges
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Streak */}
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-1.5 text-orange-400 mb-1">
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="text-xs font-semibold">Active Streak</span>
                </div>
                <div className="text-xl font-black text-orange-300">
                  {gamificationProfile.streakDays} Days
                </div>
              </div>

              {/* XP */}
              <div className="p-3.5 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20">
                <div className="flex items-center gap-1.5 text-[#3B82F6] mb-1">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-xs font-semibold">Level {gamificationProfile.level}</span>
                </div>
                <div className="text-xl font-black text-[#93C5FD]">
                  {gamificationProfile.xp} XP
                </div>
              </div>
            </div>

            {/* Recent Achievement */}
            {recentBadge && (
              <div
                onClick={() => onNavigate('achievements')}
                className="p-3.5 rounded-xl border border-white/8 bg-white/5 flex items-center gap-3 cursor-pointer hover:border-[#2563EB]/40 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {recentBadge.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate">
                    {recentBadge.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Academic Learning Snapshot */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Mastery Snapshot
              </span>
              <button
                type="button"
                onClick={() => onNavigate('progress')}
                className="text-xs font-semibold text-[#3B82F6] hover:underline"
              >
                View Analytics
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/6">
                <span className="text-[#94A3B8]">Assessed Topics</span>
                <span className="font-bold text-white">{assessedTopicsCount} of {courseTopics.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/6">
                <span className="text-[#94A3B8]">Mastered Units (85%+)</span>
                <span className="font-bold text-emerald-400">{masteredTopicsCount} Topics</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-[#94A3B8]">Recent Quiz Result</span>
                <span className="font-bold text-[#3B82F6]">
                  {latestAttempt ? `${latestAttempt.scorePercent}%` : 'Not assessed yet'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="w-full py-2 rounded-xl border border-white/8 hover:bg-white/5 text-xs font-semibold text-[#94A3B8] transition"
            >
              Open Topic Mastery Matrix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
