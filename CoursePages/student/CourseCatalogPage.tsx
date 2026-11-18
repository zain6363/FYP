import React, { useState } from 'react';
import { Course, Topic, Lesson, Enrollment, StudentUser } from '../../types';
import {
  Search,
  BookOpen,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
  ArrowUpRight,
  Menu,
  ShieldCheck,
  Compass,
  GraduationCap
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface CourseCatalogPageProps {
  courses: Course[];
  topics?: Topic[];
  lessons?: Lesson[];
  enrollments?: Enrollment[];
  currentStudent: StudentUser | null;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
  onEnroll?: (courseId: string) => Promise<void> | void;
  onSwitchToTeacher: () => void;
  onSwitchToAdmin: () => void;
  initialSelectedCourseId?: string;
}

export const CourseCatalogPage: React.FC<CourseCatalogPageProps> = ({
  courses,
  topics = [],
  lessons = [],
  enrollments = [],
  currentStudent,
  onNavigate,
  onEnroll,
  onSwitchToTeacher,
  onSwitchToAdmin,
  initialSelectedCourseId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<'all' | 'available' | 'enrolled'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(() => {
    if (initialSelectedCourseId) {
      return courses.find((c) => c.id === initialSelectedCourseId) || null;
    }
    return null;
  });
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const publishedCourses = courses.filter((c) => c.status === 'published' || !c.status);

  const filteredCourses = publishedCourses.filter((course) => {
    const isEnrolled = enrolledCourseIds.has(course.id);
    if (courseFilter === 'enrolled' && !isEnrolled) return false;
    if (courseFilter === 'available' && isEnrolled) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description && course.description.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }
    return true;
  });

  const handleEnroll = async (courseId: string) => {
    if (!currentStudent) {
      onNavigate('register');
      return;
    }
    if (enrolledCourseIds.has(courseId)) {
      onNavigate('course_map', { courseId });
      return;
    }
    if (onEnroll) {
      setEnrollingCourseId(courseId);
      try {
        await onEnroll(courseId);
        onNavigate('course_map', { courseId });
      } finally {
        setEnrollingCourseId(null);
      }
    } else {
      onNavigate('course_map', { courseId });
    }
  };

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] selection:bg-white/20 selection:text-white relative">
      {/* Background Ambient Cyber Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[750px] h-[750px] bg-gradient-to-tr from-cyan-950/20 via-blue-950/20 to-transparent rounded-full blur-[160px] opacity-60" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-blue-950/15 rounded-full blur-[140px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.06)_0%,transparent_60%)]" />
      </div>

      {/* ========================================================================= */}
      {/* GLOBAL NAVBAR                                                             */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#03050C]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-14 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="cursor-pointer group flex items-center gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:border-white/40 transition-colors">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sans text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-white group-hover:text-cyan-300 transition-colors">
            Learnova
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="relative py-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="relative py-1 text-white transition-colors cursor-pointer"
          >
            <span>Courses</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="relative py-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>About</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="relative py-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Contact</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            type="button"
            onClick={onSwitchToTeacher}
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            Teacher Studio
          </button>

          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            Governance
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {currentStudent ? (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-full text-xs font-bold btn-primary-pill flex items-center gap-2 cursor-pointer"
            >
              <span>Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('sign_in')}
                className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.06)]"
              >
                Get Started
              </button>
            </>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#03050C]/95 backdrop-blur-xl pt-20 px-6 pb-8 flex flex-col justify-between lg:hidden animate-fade-in">
          <div className="space-y-4 pt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3B82F6]">Navigation</span>
            <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#94A3B8] hover:text-white border-b border-white/5"
              >
                01. Home
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('catalog');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-cyan-400 border-b border-white/5 font-bold"
              >
                02. Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#94A3B8] hover:text-white border-b border-white/5"
              >
                03. About
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#94A3B8] hover:text-white border-b border-white/5"
              >
                04. Contact
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            {currentStudent ? (
              <button
                type="button"
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full text-xs font-bold btn-primary-pill text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('sign_in');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full border border-white/20 text-xs font-semibold text-white"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-blue-600 text-xs font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-[10px] font-mono uppercase tracking-widest text-cyan-300 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Curriculum Registry & Knowledge Graph</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Explore University <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-300">
              Courses & Curricula
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Discover verified academic programs designed with mathematical prerequisite sequences, Bayesian mastery recalibration, and interactive lesson workspaces.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search courses by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#060813] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/8 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCourseFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                courseFilter === 'all'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All Courses ({publishedCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setCourseFilter('available')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                courseFilter === 'available'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Available to Join
            </button>
            {currentStudent && (
              <button
                type="button"
                onClick={() => setCourseFilter('enrolled')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  courseFilter === 'enrolled'
                    ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                My Enrolled ({enrolledCourseIds.size})
              </button>
            )}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-[#060813] border border-white/10 rounded-3xl mt-8 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No courses match your criteria</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Try adjusting your search query or reset your filter to view all university courses.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCourseFilter('all');
              }}
              className="mt-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {filteredCourses.map((course, idx) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              const courseTopics = topics.filter((t) => t.courseId === course.id);
              return (
                <div
                  key={course.id || idx}
                  className="rounded-3xl bg-[#060813] border border-white/10 p-6 sm:p-7 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-950/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-3">
                      <span>MODULE {String(idx + 1).padStart(2, '0')}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold ${
                          isEnrolled
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-cyan-950/50 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {isEnrolled ? 'Active Enrollment' : 'Verified Syllabus'}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedCourseForSyllabus(course)}
                      className="font-sans font-bold text-xl text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#64748B]">
                      <span>{courseTopics.length} Curriculum Topics</span>
                      <span>•</span>
                      <span>Bayesian Ready</span>
                    </div>

                    <p className="mt-3 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {course.description ||
                        'Comprehensive curriculum covering foundational theory, guided practice modules, and real-world project mastery.'}
                    </p>
                  </div>

                  <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForSyllabus(course)}
                      className="text-xs font-semibold text-[#94A3B8] hover:text-white flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Syllabus</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isEnrolled) {
                          onNavigate('course_map', { courseId: course.id });
                        } else {
                          handleEnroll(course.id);
                        }
                      }}
                      disabled={enrollingCourseId === course.id}
                      className="px-4 py-2 rounded-full text-xs font-bold btn-primary-pill shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {enrollingCourseId === course.id
                        ? 'Enrolling...'
                        : isEnrolled
                        ? 'Open Map'
                        : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* COURSE DETAILS & SYLLABUS MODAL                                           */}
      {/* ========================================================================= */}
      {selectedCourseForSyllabus && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedCourseForSyllabus(null)}
        >
          <div
            className="bg-[#070A18] border border-cyan-500/30 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] text-[#F8FAFC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#050713]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800">
                    Accredited Syllabus
                  </span>
                  <span className="text-xs text-[#64748B]">
                    {topics.filter((t) => t.courseId === selectedCourseForSyllabus.id).length} Topics
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedCourseForSyllabus.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourseForSyllabus(null)}
                className="p-2 rounded-full hover:bg-white/10 text-[#94A3B8] hover:text-white transition cursor-pointer"
                aria-label="Close syllabus modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Course Overview
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {selectedCourseForSyllabus.description ||
                    'Comprehensive curriculum covering foundational theory, guided practice modules, and real-world project mastery.'}
                </p>
              </div>

              {/* Topics & Lessons Syllabus */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Curriculum Breakdown
                </h3>
                <div className="space-y-3">
                  {topics
                    .filter((t) => t.courseId === selectedCourseForSyllabus.id)
                    .sort((a, b) => a.order - b.order)
                    .map((topic, tIdx) => {
                      const topicLessons = lessons.filter((l) => l.topicId === topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-cyan-500/30 transition"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-mono font-bold text-cyan-400">
                              TOPIC {String(tIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              {topicLessons.length} {topicLessons.length === 1 ? 'lesson' : 'lessons'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {topic.title}
                          </h4>
                          {topic.description && (
                            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                              {topic.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  {topics.filter((t) => t.courseId === selectedCourseForSyllabus.id).length === 0 && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6 text-xs text-[#94A3B8]">
                      Foundational curriculum syllabus with adaptive Bayesian mastery testing.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-white/10 bg-[#050713] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCourseForSyllabus(null)}
                className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs font-semibold text-[#94A3B8] hover:text-white transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const courseId = selectedCourseForSyllabus.id;
                  setSelectedCourseForSyllabus(null);
                  if (enrolledCourseIds.has(courseId)) {
                    onNavigate('course_map', { courseId });
                  } else {
                    handleEnroll(courseId);
                  }
                }}
                disabled={enrollingCourseId === selectedCourseForSyllabus.id}
                className="px-6 py-2.5 rounded-full text-xs font-bold btn-primary-pill shadow-sm cursor-pointer disabled:opacity-50"
              >
                {enrollingCourseId === selectedCourseForSyllabus.id
                  ? 'Enrolling...'
                  : enrolledCourseIds.has(selectedCourseForSyllabus.id)
                  ? 'Open Course Map'
                  : 'Enroll in Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOBAL FOOTER                                                             */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 px-4 sm:px-8 lg:px-16 py-12 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="font-bold uppercase tracking-widest text-white">Learnova</span>
          <span>&copy; {new Date().getFullYear()} University Adaptive Learning & Governance Platform.</span>
        </div>

        <div className="flex items-center gap-6">
          <button type="button" onClick={() => onNavigate('landing')} className="hover:text-white transition cursor-pointer">Home</button>
          <button type="button" onClick={() => onNavigate('catalog')} className="text-white cursor-pointer">Courses</button>
          <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">About</button>
          <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white transition cursor-pointer">Contact</button>
        </div>
      </footer>
    </div>
  );
};
