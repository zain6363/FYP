import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  History,
  Activity,
  BookOpen,
  UserCog,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { UserAccount } from '../../types';
import { ToastMessage } from '../teacher/TeacherLayout';

export type AdminNavigationPage =
  | 'dashboard'
  | 'users'
  | 'user_details'
  | 'roles'
  | 'audit'
  | 'health'
  | 'oversight'
  | 'profile'
  | 'access_denied';

interface BreadcrumbItem {
  label: string;
  page?: AdminNavigationPage;
  params?: Record<string, string>;
}

interface AdminLayoutProps {
  currentPage: AdminNavigationPage;
  onNavigate: (page: AdminNavigationPage, params?: Record<string, string>) => void;
  currentAdmin: UserAccount;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  onSwitchPortal: (portal: 'student' | 'teacher') => void;
  onSignOut: () => void;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  onNavigate,
  currentAdmin,
  toasts,
  onDismissToast,
  onSwitchPortal,
  onSignOut,
  breadcrumbs = [],
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
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
    {
      id: 'dashboard' as AdminNavigationPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      activeMatches: ['dashboard'],
    },
    {
      id: 'users' as AdminNavigationPage,
      label: 'User Management',
      icon: Users,
      activeMatches: ['users', 'user_details'],
    },
    {
      id: 'roles' as AdminNavigationPage,
      label: 'Roles & Access',
      icon: ShieldCheck,
      activeMatches: ['roles'],
    },
    {
      id: 'audit' as AdminNavigationPage,
      label: 'Security Audit Log',
      icon: History,
      activeMatches: ['audit'],
    },
    {
      id: 'health' as AdminNavigationPage,
      label: 'System Health',
      icon: Activity,
      activeMatches: ['health'],
    },
    {
      id: 'oversight' as AdminNavigationPage,
      label: 'Course Oversight',
      icon: BookOpen,
      activeMatches: ['oversight'],
      badge: 'Read-only',
    },
  ];

  const handleNavClick = (page: AdminNavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] flex">
      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm animate-in slide-in-from-top duration-150 ${
              t.type === 'success'
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
              <span className="font-semibold text-xs sm:text-sm text-white">{t.message}</span>
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

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar (w-64) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#050711] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-cyan-500/25">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-monument font-bold text-sm text-white tracking-tight">
                  Learnova
                </span>
                <span className="block text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Governance & Admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-[#64748B] hover:text-white rounded"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Administrator navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.activeMatches.includes(currentPage);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/25 shadow-[0_0_15px_rgba(34,211,238,0.08)]'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-cyan-400'
                          : 'text-[#64748B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-white/5 text-[#94A3B8] border border-white/8">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Portal Switcher, Profile, Theme Toggle */}
        <div className="p-3 border-t border-white/8 space-y-2">
          {/* Switch Portal Section */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/8 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-1">
              Switch Workspace
            </p>
            <button
              type="button"
              onClick={() => onSwitchPortal('teacher')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-orange-400" />
                <span>Teacher Portal</span>
              </div>
              <span className="text-[10px] text-[#64748B]">Staff</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchPortal('student')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:bg-white/5 hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Student Portal</span>
              </div>
              <span className="text-[10px] text-[#64748B]">Learner</span>
            </button>
          </div>

          {/* Admin Profile Row */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition cursor-pointer"
              title="Administrator profile and security credentials"
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentAdmin.avatar || currentAdmin.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentAdmin.name}
                </p>
                <p className="text-[10px] text-[#3B82F6] font-medium truncate">
                  {currentAdmin.department || 'System Admin'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="p-1 text-[#64748B] hover:text-rose-400 rounded transition cursor-pointer"
              title="Sign out of administrative session"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Global Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#050711]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#94A3B8] rounded-lg hover:bg-white/5 cursor-pointer"
              aria-label="Open sidebar"
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
                Governance
              </button>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[#475569] shrink-0" />
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

          {/* Right Header: Health indicator, Security Badge, Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Live Operational Health Status Dot */}
            <button
              type="button"
              onClick={() => onNavigate('health')}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 transition cursor-pointer"
              title="View system telemetry"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry: Active</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#94A3B8] hover:bg-white/5 hover:text-white transition cursor-pointer"
              aria-label="Toggle theme mode"
              title="Toggle theme mode"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main
          key={currentPage}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
