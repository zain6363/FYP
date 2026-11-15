import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  BarChart2,
  Award,
  Trophy,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Flame,
  Zap,
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudentUser, GamificationProfile } from '../../types';

export type StudentNavigationPage =
  | 'landing'
  | 'about'
  | 'contact'
  | 'sign_in'
  | 'register'
  | 'dashboard'
  | 'catalog'
  | 'course_details'
  | 'my_learning'
  | 'course_map'
  | 'lesson'
  | 'diagnostic_intro'
  | 'diagnostic_player'
  | 'practice_player'
  | 'exam_player'
  | 'results'
  | 'progress'
  | 'achievements'
  | 'xp_history'
  | 'leaderboard'
  | 'profile';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StudentLayoutProps {
  currentPage: StudentNavigationPage;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
  currentUser: StudentUser;
  gamificationProfile: GamificationProfile;
  toasts?: ToastMessage[];
  onDismissToast?: (id: string) => void;
  onSwitchPortal?: () => void;
  onSwitchToAdmin?: () => void;
  onSignOut?: () => void;
  breadcrumbs?: Array<{ label: string; page?: StudentNavigationPage; params?: Record<string, string> }>;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  gamificationProfile,
  toasts = [],
  onDismissToast,
  onSwitchPortal,
  onSwitchToAdmin,
  onSignOut,
  breadcrumbs = [],
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('learnova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('learnova_theme', 'light');
    }
  };

  const navItems = [
    { id: 'landing' as StudentNavigationPage, label: 'Home', icon: Sparkles },
    { id: 'dashboard' as StudentNavigationPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my_learning' as StudentNavigationPage, label: 'My Learning', icon: BookOpen },
    { id: 'catalog' as StudentNavigationPage, label: 'Explore Courses', icon: Compass },
    { id: 'progress' as StudentNavigationPage, label: 'Progress & Mastery', icon: BarChart2 },
    { id: 'achievements' as StudentNavigationPage, label: 'Achievements', icon: Award },
    { id: 'leaderboard' as StudentNavigationPage, label: 'Leaderboard', icon: Trophy },
  ];

  const handleNavClick = (page: StudentNavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] flex">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar (248px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-62 bg-[#050711] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Portal Label */}
        <div>
          <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => handleNavClick('landing')}
              title="Return to Home / Overview"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-cyan-500/25">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8Z" />
                </svg>
              </div>
              <div>
                <span className="font-monument text-sm font-bold text-white tracking-tight">
                  Learnova
                </span>
                <span className="block text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-[#64748B] hover:text-white rounded"
              aria-label="Close sidebar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Student primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.08)]'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Portal Switcher & Profile Quick Menu */}
        <div className="p-3 border-t border-white/8 space-y-2">
          {/* Portal Switcher Buttons */}
          <div className="space-y-1">
            {onSwitchPortal && (
              <button
                type="button"
                onClick={onSwitchPortal}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] bg-white/5 hover:bg-white/8 border border-white/8 transition cursor-pointer"
                title="Switch to Teacher Portal"
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Teacher Portal</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2563EB]/15 text-[#3B82F6] font-medium">
                  Staff
                </span>
              </button>
            )}

            {onSwitchToAdmin && (
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] bg-white/5 hover:bg-white/8 border border-white/8 transition cursor-pointer"
                title="Switch to Administrator Portal"
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium">
                  Admin
                </span>
              </button>
            )}
          </div>

          {/* Student Profile Row */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition"
              title="View profile and settings"
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  Level {gamificationProfile.level} • {gamificationProfile.xp} XP
                </p>
              </div>
            </button>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="p-1 text-[#64748B] hover:text-rose-400 rounded transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 lg:pl-62 flex flex-col min-h-screen">
        {/* Global Student Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#050711]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#94A3B8] rounded-lg hover:bg-white/5"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Path */}
            <nav className="flex items-center text-xs sm:text-sm text-[#64748B] truncate" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="hover:text-cyan-400 font-medium"
              >
                Learnova
              </button>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 mx-1 text-[#475569] shrink-0" />
                  {crumb.page ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(crumb.page!, crumb.params)}
                      className="hover:text-cyan-400 truncate"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="font-semibold text-white truncate">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right: Gamification Badges, Notifications, Theme & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Gamification XP & Streak Badge */}
            <button
              type="button"
              onClick={() => onNavigate('xp_history')}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/30 border border-cyan-400/25 text-cyan-200 hover:bg-cyan-950/50 transition text-xs font-bold shadow-[0_0_12px_rgba(34,211,238,0.1)]"
              title="View XP Activity History"
            >
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{gamificationProfile.streakDays}d</span>
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                <span>{gamificationProfile.xp} XP</span>
              </span>
            </button>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/5 relative transition"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#03050C] shadow-[0_0_8px_#22d3ee]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0A0F1D] border border-white/10 rounded-2xl shadow-xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/8 font-bold text-white">
                    <span>Recent Updates</span>
                    <span className="text-[10px] text-[#3B82F6] font-medium">3 unread</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20">
                      <p className="font-semibold text-[#93C5FD]">Daily Streak Bonus</p>
                      <p className="text-[#94A3B8]">You earned +70 XP for studying 4 days in a row!</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/8">
                      <p className="font-semibold text-white">Diagnostic Calibrated</p>
                      <p className="text-[#94A3B8]">Pre-Course Python Proficiency calibrated baseline mastery.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/8">
                      <p className="font-semibold text-white">New Achievement Badge</p>
                      <p className="text-[#94A3B8]">Unlocked 'Streak Sentinel' on your profile.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-white/5 transition"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center ring-2 ring-transparent hover:ring-[#3B82F6]/50 transition"
                aria-label="User menu"
              >
                {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0A0F1D] border border-white/10 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-white/8">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[#64748B] truncate">{currentUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-[#94A3B8] hover:text-white"
                  >
                    <User className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('xp_history');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-[#94A3B8] hover:text-white"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>XP Activity History</span>
                  </button>
                  {onSignOut && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-950/30 text-rose-400 flex items-center gap-2 border-t border-white/8"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Toast Alerts */}
        {toasts.length > 0 && (
          <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`p-3.5 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between gap-3 pointer-events-auto transition-all ${
                  toast.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-700 text-emerald-100'
                    : toast.type === 'error'
                    ? 'bg-rose-950/90 border-rose-700 text-rose-100'
                    : 'bg-blue-950/90 border-blue-700 text-blue-100'
                }`}
              >
                <span>{toast.message}</span>
                {onDismissToast && (
                  <button
                    type="button"
                    onClick={() => onDismissToast(toast.id)}
                    className="opacity-60 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Page Content Outlet with Smooth Page Transition Key */}
        <main
          key={currentPage}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
