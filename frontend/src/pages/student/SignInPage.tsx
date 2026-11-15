import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { StudentUser } from '../../types';
import { authApi, mapUserResponseToStudentUser } from '../../services/api/authApi';

interface SignInPageProps {
  onSignInSuccess: (user: StudentUser) => void;
  onNavigateToRegister: () => void;
  onNavigateToLanding?: () => void;
  onSwitchToTeacher?: () => void;
  onSwitchToAdmin?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onNavigateToRegister,
  onNavigateToLanding,
  onSwitchToTeacher,
  onSwitchToAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your university email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      });

      if (response.user) {
        const studentUser = mapUserResponseToStudentUser(response.user);
        onSignInSuccess(studentUser);
      } else {
        const me = await authApi.getMe();
        onSignInSuccess(mapUserResponseToStudentUser(me));
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020512] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#2563EB]/40 selection:text-white relative">
      {/* Ambient Cobalt Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#021A7A]/40 rounded-full blur-[130px] pointer-events-none" />

      {onNavigateToLanding && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-3 text-left relative z-10">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Overview
          </button>
        </div>
      )}

      {/* Main Form Card in Cobalt Obsidian Style */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="bg-[#080C18] text-[#F8FAFC] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-[32px]">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="font-monument text-xs font-bold tracking-[0.3em] uppercase text-[#3B82F6] block mb-2">
              Learnova
            </span>
            <h1 className="text-2xl sm:text-3xl font-editorial font-normal tracking-tight text-white">
              Student Authentication
            </h1>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              Sign in to resume your adaptive curriculum & mastery paths
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                University Email
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="alex.rivera@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-white/10 bg-white/5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Password
                </label>
                <span className="text-[11px] text-[#3B82F6] hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border border-white/10 bg-white/5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full font-semibold text-xs uppercase tracking-wider text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#94A3B8]/70 mb-2 font-medium">
              Demo Student Profile Preloaded:
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#94A3B8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Alex Rivera (CS Undergrad)</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 text-center space-y-2 text-xs">
          <p className="text-[#94A3B8]">
            Don't have a student account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              Create free account
            </button>
          </p>
          {(onSwitchToTeacher || onSwitchToAdmin) && (
            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-[#64748B]">
              {onSwitchToTeacher && (
                <button
                  type="button"
                  onClick={onSwitchToTeacher}
                  className="hover:text-white transition cursor-pointer"
                >
                  Teacher Portal
                </button>
              )}
              {onSwitchToTeacher && onSwitchToAdmin && <span>•</span>}
              {onSwitchToAdmin && (
                <button
                  type="button"
                  onClick={onSwitchToAdmin}
                  className="hover:text-white transition cursor-pointer"
                >
                  Governance & Admin
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
