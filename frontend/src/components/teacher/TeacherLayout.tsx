

import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  Menu,

  X,
  ChevronLeft,

  ChevronRight,
  LogOut,
  User,
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CURRENT_TEACHER } from '../../services/storageService';
import { ThemeToggle } from '../ui/ThemeToggle';

export type NavigationPage =
  | 'overview'
  | 'courses'
  | 'course_overview'
  | 'curriculum'
  | 'prerequisites'
  | 'resources'
  | 'questions'
  | 'question_editor'
  | 'ai_review'
  | 'assessments'
  | 'assessment_editor'
  | 'analytics';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface TeacherLayoutProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, params?: Record<string, string>) => void;
  selectedCourseId?: string;
  selectedCourseTitle?: string;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  children: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({
  currentPage,
  onNavigate,
  selectedCourseId,
  selectedCourseTitle,
  toasts,
  onDismissToast,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const navItems = [
    {
      id: 'overview' as NavigationPage,
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      activeMatches: ['overview'],
    },
    {
      id: 'courses' as NavigationPage,
      label: 'Courses',
      icon: <BookOpen className="w-5 h-5 shrink-0" />,
      activeMatches: ['courses', 'course_overview', 'curriculum', 'prerequisites', 'resources'],
    },
    {
      id: 'questions' as NavigationPage,
      label: 'Question Bank',
      icon: <ListChecks className="w-5 h-5 shrink-0" />,
      activeMatches: ['questions', 'question_editor'],
    },
    {
      id: 'ai_review' as NavigationPage,
      label: 'AI Review',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
      activeMatches: ['ai_review'],
      badge: 'Review',
    },
    {
      id: 'assessments' as NavigationPage,
      label: 'Assessments',
      icon: <ClipboardCheck className="w-5 h-5 shrink-0" />,
      activeMatches: ['assessments', 'assessment_editor'],
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
      activeMatches: ['analytics'],
    },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] flex flex-col font-sans">
      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-md text-sm animate-in slide-in-from-top duration-150 ${t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : t.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800'
                : 'bg-blue-950/90 text-blue-200 border-blue-800'
              }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="font-medium text-white">{t.message}</span>
            </div>
            <button
              onClick={() => onDismissToast(t.id)}
              className="text-white/60 hover:text-white p-0.5 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar (248px or 72px collapsed) */}
        <aside
          className={`hidden md:flex flex-col border-r border-white/10 bg-[#050711] transition-all duration-200 select-none z-20 shrink-0 ${sidebarCollapsed ? 'w-[72px]' : 'w-[248px]'
            }`}
          aria-label="Main Navigation"
        >
          {/* Brand header */}
          <div className="h-[72px] px-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/25">
                <GraduationCap className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-monument font-bold text-sm tracking-tight text-white leading-none">
                    Learnova
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mt-1">
                    Teacher Portal
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-md text-[#64748B] hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.activeMatches.includes(currentPage);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative cursor-pointer group ${isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-400/25 shadow-[0_0_15px_rgba(34,211,238,0.08)]'
                    : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  {/* Left edge indicator */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#22d3ee]"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={
                      isActive
                        ? 'text-cyan-400'
                        : 'text-[#64748B] group-hover:text-white'
                    }
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-semibold bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/25">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Course context widget if course is selected */}
          {!sidebarCollapsed && selectedCourseTitle && (
            <div className="mx-3 mb-3 p-2.5 rounded-xl bg-white/5 border border-white/8 text-xs">
              <span className="text-[10px] font-semibold uppercase text-[#64748B] block mb-0.5">
                Current Course Context
              </span>
              <p className="font-semibold text-white truncate" title={selectedCourseTitle}>
                {selectedCourseTitle}
              </p>
            </div>
          )}

          {/* Bottom user utility area */}
          <div className="p-3 border-t border-white/8">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer ${sidebarCollapsed ? 'justify-center p-1.5' : ''
                  }`}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  ER
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {CURRENT_TEACHER.name}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {CURRENT_TEACHER.department}
                    </p>
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-12 left-0 right-0 bg-[#0A0F1D] border border-white/10 rounded-xl shadow-xl p-2 z-30 flex flex-col gap-1 text-xs animate-fade-in">
                  <div className="px-2 py-1.5 border-b border-white/8">
                    <p className="font-semibold text-white">{CURRENT_TEACHER.name}</p>
                    <p className="text-[#64748B] text-[11px]">{CURRENT_TEACHER.email}</p>
                    <span className="inline-block mt-1 bg-emerald-950/60 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-medium border border-emerald-800">
                      Role: Instructor (Verified)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setHelpModalOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors cursor-pointer w-full text-left"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Documentation & Help</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer w-full text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Active Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Header and Drawer */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[72px] bg-[#050711]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 md:hidden">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-monument font-bold text-sm tracking-tight text-white">Learnova</span>
              </div>

              {/* Course breadcrumb indicator in top header */}
              {selectedCourseTitle && (
                <div className="hidden lg:flex items-center gap-2 text-xs text-[#94A3B8] pl-3 border-l border-white/10">
                  <span className="text-[#64748B]">Active Course:</span>
                  <span className="font-semibold text-white max-w-sm truncate bg-white/5 px-2 py-0.5 rounded border border-white/8">
                    {selectedCourseTitle}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <ThemeToggle />

              <button
                onClick={() => setHelpModalOpen(true)}
                className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-white/5 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-medium"
                title="Teacher Help Guide"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Guide</span>
              </button>

              <div className="w-px h-5 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ER
                </div>
                <span className="text-xs font-semibold text-white hidden sm:inline">
                  {CURRENT_TEACHER.name}
                </span>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-xs flex"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-72 bg-[#0A0F1D] border-r border-white/10 h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-white/8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-monument font-bold text-sm text-white">Learnova</p>
                      <p className="text-[11px] text-[#3B82F6] font-semibold">Teacher Portal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#64748B] hover:bg-white/5 rounded-lg cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive = item.activeMatches.includes(currentPage);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isActive
                          ? 'bg-[#2563EB]/15 text-[#3B82F6] font-semibold'
                          : 'text-[#94A3B8] hover:bg-white/5 text-left'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-semibold bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/25">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-white/8">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 mb-3">
                    <p className="text-xs font-semibold text-white">{CURRENT_TEACHER.name}</p>
                    <p className="text-[11px] text-[#64748B]">{CURRENT_TEACHER.email}</p>
                    <p className="text-[10px] text-[#3B82F6] font-medium mt-1">
                      {CURRENT_TEACHER.department}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* Main content viewport with fade in */}
          <main
            key={currentPage}
            className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1440px] w-full mx-auto overflow-x-hidden animate-fade-in"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Teacher Portal Documentation Modal */}
      {helpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#0A0F1D] rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-white/10 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">
                  Learnova Teacher Portal - System Guide
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-[#64748B] hover:bg-white/5 rounded-lg cursor-pointer"
                aria-label="Close help modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-4 text-xs text-[#94A3B8] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25">
                <p className="font-semibold text-[#93C5FD] mb-1">Teacher-in-the-Loop Principle</p>
                <p>
                  AI generates candidate questions based on your curriculum topics and learning
                  resources. Every question requires manual teacher review, edit, and explicit
                  approval before it enters the Question Bank or Assessments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Prerequisite Graph (DAG Rules)
                </h4>
                <p>
                  Topics form a Directed Acyclic Graph. The prerequisite manager mathematically
                  prevents self-dependencies and circular chains. Downstream topics cannot unlock
                  until foundational prerequisites are completed by students.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  Academic Mastery vs Gamification
                </h4>
                <p>
                  Academic mastery percentages are computed strictly from completed assessment
                  submissions. Gamification XP and badges are asynchronous rewards that are never
                  factored into grade metrics or topic mastery calculations.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/8 flex justify-end">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="bg-[#2563EB] text-white px-4 py-2 rounded-xl font-medium text-xs hover:bg-[#1D4ED8] cursor-pointer shadow-sm shadow-blue-600/30"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
