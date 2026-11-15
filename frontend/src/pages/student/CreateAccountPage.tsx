import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { StudentUser } from '../../types';
import { authApi, mapUserResponseToStudentUser } from '../../services/api/authApi';

interface CreateAccountPageProps {
  onRegisterSuccess: (user: StudentUser) => void;
  onNavigateToSignIn: () => void;
  onNavigateToLanding?: () => void;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({
  onRegisterSuccess,
  onNavigateToSignIn,
  onNavigateToLanding,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters in length.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.register({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      });

      if (response.user) {
        onRegisterSuccess(mapUserResponseToStudentUser(response.user));
      } else {
        const me = await authApi.getMe();
        onRegisterSuccess(mapUserResponseToStudentUser(me));
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try a different email or try again.');
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

      {/* Main Form Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="bg-[#080C18] text-[#F8FAFC] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-[32px]">
          <div className="text-center mb-6">
            <span className="font-monument text-xs font-bold tracking-[0.3em] uppercase text-[#3B82F6] block mb-2">
              Learnova
            </span>
            <h1 className="text-2xl sm:text-3xl font-editorial font-normal tracking-tight text-white">
              Create an Account
            </h1>
            <p className="mt-1.5 text-xs text-[#94A3B8]">
              Join Learnova to unlock personalized mastery & diagnostic learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Full Name
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-white/10 bg-white/5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="regEmail" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                University Email
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="regEmail"
                  type="email"
                  required
                  placeholder="alex.rivera@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-white/10 bg-white/5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="regPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Password
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="regPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                Confirm Password
              </label>
              <div className="relative rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-white/10 bg-white/5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full font-semibold text-xs uppercase tracking-wider text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs">
          <p className="text-[#94A3B8]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
