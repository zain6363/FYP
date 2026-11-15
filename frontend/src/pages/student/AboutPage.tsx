import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GitBranch,
  Brain,
  Award,
  Users,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  GraduationCap,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { StudentUser } from '../../types';

interface AboutPageProps {
  currentStudent: StudentUser | null;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
  onSwitchToTeacher: () => void;
  onSwitchToAdmin: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  currentStudent,
  onNavigate,
  onSwitchToTeacher,
  onSwitchToAdmin,
}) => {
  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] selection:bg-white/20 selection:text-white relative">
      {/* Background Ambient Glow */}
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
            className="relative py-1 text-white transition-colors cursor-pointer"
          >
            <span>About</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
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
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ABOUT HERO SECTION                                                        */}
      {/* ========================================================================= */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
          <span>LEARNOVA ACADEMIC COMPUTING & COGNITIVE LABS</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl">
          Architecting the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-white">
            Adaptive Intelligence
          </span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-white/60 font-normal leading-relaxed max-w-3xl">
          Learnova was founded to dismantle the rigid, one-size-fits-all model of modern education. By synthesizing <span className="text-white font-medium">Bayesian Knowledge Tracing</span> with <span className="text-white font-medium">Directed Acyclic Prerequisite Graphs</span>, we create personalized cognitive pathways that adapt to every student in real time.
        </p>

        {/* Telemetry Stats Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#060813]/80 border border-white/10 backdrop-blur-xl">
          <div className="p-4 border-r border-white/5">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Mastery Precision</span>
            <div className="text-3xl sm:text-4xl font-bold text-white mt-1">99.8%</div>
            <p className="text-[11px] text-white/40 mt-1">BKT probabilistic certainty</p>
          </div>
          <div className="p-4 border-r border-white/5">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Prerequisite Engine</span>
            <div className="text-3xl sm:text-4xl font-bold text-white mt-1">0 Cycles</div>
            <p className="text-[11px] text-white/40 mt-1">Strict DAG topological order</p>
          </div>
          <div className="p-4 border-r border-white/5">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Faculty Rigor</span>
            <div className="text-3xl sm:text-4xl font-bold text-white mt-1">100%</div>
            <p className="text-[11px] text-white/40 mt-1">Audited university curriculum</p>
          </div>
          <div className="p-4">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Active Learners</span>
            <div className="text-3xl sm:text-4xl font-bold text-white mt-1">12,400+</div>
            <p className="text-[11px] text-white/40 mt-1">Across 18 accredited domains</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 CORE PILLARS                                                            */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto z-10 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Our Foundation</span>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white mt-2 tracking-tight">
            How Learnova Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
            Every feature in Learnova is mathematically modeled to maximize retention and eliminate cognitive bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0B0F1F] to-[#04060E] border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Pillar 01</span>
            <h3 className="font-sans text-xl font-bold text-white mt-2 mb-3 group-hover:text-cyan-300 transition-colors">
              Bayesian Knowledge Tracing
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Our BKT inference engine dynamically calculates the probability that a student has genuinely mastered a concept versus guessed correctly. As you solve questions, your cognitive state updates in real time.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0B0F1F] to-[#04060E] border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <GitBranch className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">Pillar 02</span>
            <h3 className="font-sans text-xl font-bold text-white mt-2 mb-3 group-hover:text-blue-300 transition-colors">
              Directed Acyclic Graphs (DAG)
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Knowledge is a network, not a straight line. Our DAG topological engine prevents cognitive dead ends by strictly sequencing foundational concepts before unlocking advanced domains, ensuring solid foundations.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0B0F1F] to-[#04060E] border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">Pillar 03</span>
            <h3 className="font-sans text-xl font-bold text-white mt-2 mb-3 group-hover:text-amber-300 transition-colors">
              Faculty Governance & Rigor
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              We reject unverified AI generation. Every question, rubric, and prerequisite mapping is audited, approved, and maintained by university faculty in the Teacher Studio, guaranteeing verifiable academic credentials.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHILOSOPHY & VISION                                                       */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto z-10 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Our Mission</span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold text-white mt-2 tracking-tight">
              Empowering Students with Sovereign Mastery
            </h2>
            <p className="mt-6 text-sm sm:text-base text-white/60 leading-relaxed">
              Traditional education tests students on fixed exam dates, regardless of whether their neural pathways have consolidated the knowledge. In Learnova, time is variable, but mastery is constant.
            </p>
            <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
              Whether you are a career switcher tackling complex systems architecture or an undergraduate solidifying algorithms, our adaptive engine personalizes practice sets, diagnoses weaknesses, and rewards relentless consistency.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Curricula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white font-medium text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Interactive Feature Checklist */}
          <div className="space-y-4 p-8 rounded-3xl bg-[#060813] border border-white/10 backdrop-blur-xl">
            <h3 className="font-sans text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Platform Safeguards</span>
            </h3>

            {[
              'Zero Hallucination AI Sandbox: LLM answers verified by professors',
              'Server-Authoritative Evaluation: Tamper-proof test results',
              'Mathematical DAG Validation: Instant circular dependency detection',
              'Bayesian Slip & Guess Calibration: Robust anti-cheat metrics',
              'Multi-Role Governance: Admin, Teacher, and Student RBAC security',
              'Gamification Ledger: Idempotent XP transactions and cryptographic badges'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>
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
          <button type="button" onClick={() => onNavigate('about')} className="text-white">About</button>
          <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact</button>
        </div>
      </footer>
    </div>
  );
};
