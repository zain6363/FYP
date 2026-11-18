import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Mail,
  MessageSquare,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  ChevronDown,
  Globe,
  Terminal,
  Zap
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { StudentUser } from '../../types';

interface ContactPageProps {
  currentStudent: StudentUser | null;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
  onSwitchToTeacher: () => void;
  onSwitchToAdmin: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  currentStudent,
  onNavigate,
  onSwitchToTeacher,
  onSwitchToAdmin,
}) => {
  const [formData, setFormData] = useState({
    name: currentStudent?.name || '',
    email: currentStudent?.email || '',
    category: 'admissions',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'How does Learnova verify my topic mastery?',
      a: 'Learnova uses a server-authoritative Bayesian Knowledge Tracing (BKT) engine that dynamically updates your latent mastery probability after every practice and assessment problem, factoring in slip and guess variables.'
    },
    {
      q: 'Can university teachers audit and modify course rubrics?',
      a: 'Yes. The Teacher Studio allows faculty to author questions, review AI-generated candidate items with full human-in-the-loop authorization, and sequence topics using strict acyclic DAG topology.'
    },
    {
      q: 'How do I request institutional or campus-wide access?',
      a: 'Select "Institutional Licensing & Partnerships" in the contact form or email partnerships@learnova.edu. Our university liaisons will set up single-tenant or multi-tenant SSO configurations for your department.'
    },
    {
      q: 'What is the policy regarding AI tutor interactions?',
      a: 'All AI-generated explanations and practice candidates pass through strict safety governance, university faculty approval, and deterministic DAG scope validation to prevent hallucinations.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] selection:bg-white/20 selection:text-white relative">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-950/20 via-blue-950/20 to-transparent rounded-full blur-[160px] opacity-60" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-950/15 rounded-full blur-[140px] opacity-50" />
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

        {/* Clean, Page-Only Navigation Links */}
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
            className="relative py-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Courses</span>
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
            className="relative py-1 text-white transition-colors cursor-pointer"
          >
            <span>Contact</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
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
        </div>
      </header>

      {/* ========================================================================= */}
      {/* CONTACT HERO & FORM SECTION                                               */}
      {/* ========================================================================= */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
          <span>DIRECT TRANSMISSION GATEWAY ACTIVE</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl">
          Get in Touch with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-white">
            Academic Operations
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/60 font-normal leading-relaxed max-w-2xl">
          Whether you are an inquiring student, a university department exploring institutional licensing, or faculty interested in authoring curriculum, our operations desk is standing by.
        </p>

        {/* 2-Column Contact Interface */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Inquiries & Channel Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Card 1: Admissions & Students */}
            <div className="p-6 rounded-2xl bg-[#060813] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Admissions & Learning Advisory</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-3">
                Questions regarding enrollment, diagnostic evaluations, or personalized study plans.
              </p>
              <a href="mailto:admissions@learnova.edu" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition">
                <span>admissions@learnova.edu</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Card 2: Faculty & Research */}
            <div className="p-6 rounded-2xl bg-[#060813] border border-white/10 hover:border-blue-400/40 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Faculty Studio & Curriculum Research</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-3">
                Inquiries regarding prerequisite DAG design, BKT calibration, or teaching accreditation.
              </p>
              <a href="mailto:faculty@learnova.edu" className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition">
                <span>faculty@learnova.edu</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Card 3: Technical & Enterprise */}
            <div className="p-6 rounded-2xl bg-[#060813] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Institutional Licensing & Security</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-3">
                Single sign-on, enterprise governance, and university cluster deployments.
              </p>
              <a href="mailto:partnerships@learnova.edu" className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition">
                <span>partnerships@learnova.edu</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* System Status Pill */}
            <div className="p-4 rounded-xl bg-[#04060E] border border-white/5 flex items-center justify-between text-[11px] text-white/60 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span>All Clusters Operational</span>
              </div>
              <span>Response: &lt; 4 Hours</span>
            </div>
          </div>

          {/* Right Column: High-Tech Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#090D1C] to-[#04060E] border border-white/15 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Transmission Confirmed</h3>
                <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been encrypted and routed to the corresponding academic department. A faculty liaison or technical engineer will respond to <span className="text-cyan-300 font-mono">{formData.email}</span> within 4 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: currentStudent?.name || '',
                        email: currentStudent?.email || '',
                        category: 'admissions',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-xs font-semibold uppercase tracking-wider text-white transition"
                  >
                    Send Another Transmission
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Direct Departmental Transmission</h3>
                  <p className="text-xs text-white/50">Fields marked with an asterisk are required for routing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-white/70 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#03050C] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-white/70 uppercase tracking-wider">
                      Academic / Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vance@mit.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#03050C] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/70 uppercase tracking-wider">
                    Inquiry Classification
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#03050C] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition cursor-pointer"
                  >
                    <option value="admissions" className="bg-[#03050C]">Student Admissions & Adaptive Learning Plans</option>
                    <option value="faculty" className="bg-[#03050C]">Faculty Curriculum Authoring & DAG Research</option>
                    <option value="enterprise" className="bg-[#03050C]">Institutional Licensing & University Deployments</option>
                    <option value="support" className="bg-[#03050C]">Technical Infrastructure & Account Security</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/70 uppercase tracking-wider">
                    Subject Header
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#03050C] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-white/70 uppercase tracking-wider">
                    Transmission Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed context regarding your educational background, curriculum query, or institutional requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#03050C] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Routing...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS                                                */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto z-10 border-t border-white/10">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Direct Answers</span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">
            Frequently Addressed Queries
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#060813] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-semibold text-white/90">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-white/60 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 px-4 sm:px-8 lg:px-16 py-12 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="font-bold uppercase tracking-widest text-white">Learnova</span>
          <span>&copy; {new Date().getFullYear()} University Adaptive Learning & Governance Platform.</span>
        </div>

        <div className="flex items-center gap-6">
          <button type="button" onClick={() => onNavigate('landing')} className="hover:text-white transition">Home</button>
          <button type="button" onClick={() => onNavigate('catalog')} className="hover:text-white transition">Courses</button>
          <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition">About</button>
          <button type="button" onClick={() => onNavigate('contact')} className="text-white">Contact</button>
        </div>
      </footer>
    </div>
  );
};
