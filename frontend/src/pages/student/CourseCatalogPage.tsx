import React, { useState } from 'react';
import { Course, Topic, Enrollment } from '../../types';
import { Search, BookOpen, CheckCircle, ArrowRight, X } from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface CourseCatalogPageProps {
  courses: Course[];
  topics: Topic[];
  enrollments: Enrollment[];
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const CourseCatalogPage: React.FC<CourseCatalogPageProps> = ({
  courses,
  topics,
  enrollments,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const publishedCourses = courses.filter((c) => c.status === 'published');

  const filteredCourses = publishedCourses.filter((course) => {
    const isEnrolled = enrolledCourseIds.has(course.id);
    if (filter === 'enrolled' && !isEnrolled) return false;
    if (filter === 'available' && isEnrolled) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Explore Course Catalog
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Discover verified university curricula with adaptive diagnostics and personalized learning paths.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course title or keyword..."
            className="block w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-white"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/8 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all'
                ? 'bg-[#2563EB]/15 text-[#3B82F6] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All Courses ({publishedCourses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'available'
                ? 'bg-[#2563EB]/15 text-[#3B82F6] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Available to Join
          </button>
          <button
            type="button"
            onClick={() => setFilter('enrolled')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'enrolled'
                ? 'bg-[#2563EB]/15 text-[#3B82F6] font-bold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            My Enrolled ({enrolledCourseIds.size})
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id);
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const enr = enrollments.find((e) => e.courseId === course.id);

            return (
              <div
                key={course.id}
                className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[#3B82F6] border border-[#2563EB]/20">
                      Computer Science
                    </span>

                    {isEnrolled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <span className="text-xs text-[#64748B] font-medium">
                        Open for Self-Enrollment
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition leading-snug">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{courseTopics.length} Topics</span>
                    </span>
                    {isEnrolled && (
                      <span className="font-semibold text-[#3B82F6]">
                        {enr?.progressPercent || 0}% Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('course_details', { courseId: course.id })}
                    className="text-xs font-semibold text-[#94A3B8] hover:text-[#3B82F6] cursor-pointer"
                  >
                    View Syllabus Details
                  </button>

                  {isEnrolled ? (
                    <button
                      type="button"
                      onClick={() => onNavigate('course_map', { courseId: course.id })}
                      className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm shadow-blue-600/30 cursor-pointer"
                    >
                      <span>Go to Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate('course_details', { courseId: course.id })}
                      className="px-4 py-2 rounded-full border border-white/15 hover:border-[#2563EB]/50 text-white hover:bg-[#2563EB]/10 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Inspect & Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#0A0F1D] border border-white/8 rounded-2xl space-y-3">
          <Search className="w-8 h-8 mx-auto text-[#64748B]" />
          <h3 className="text-base font-bold text-white">
            No courses match your query
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Try adjusting your search terms or clear the filter to see all available university courses.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
            }}
            className="px-4 py-2 rounded-xl border border-white/15 text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/5"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
