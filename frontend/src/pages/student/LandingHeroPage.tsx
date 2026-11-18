import React, { useState, useEffect, useRef } from 'react';
import { Course, Enrollment, StudentUser, Topic, Lesson } from '../../types';
import {
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle,
  Layers,
  Sparkles,
  Award,
  Grid,
  ChevronDown,
  Compass,
  BarChart2,
  Trophy,
  ShieldCheck,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { DalaParticleBrain } from '../../components/student/DalaParticleBrain';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reusable section wrapper with bidirectional scroll-triggered fade in & fade out animation
 */
const FadeInSection: React.FC<{
  children: React.ReactNode;
  id?: string;
  className?: string;
}> = ({ children, id, className = '' }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fade in when visible, smoothly fade out when scrolled out of view
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.08,
        rootMargin: '20px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      id={id}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-[0.99]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface LandingHeroPageProps {
  courses: Course[];
  topics?: Topic[];
  lessons?: Lesson[];
  enrollments?: Enrollment[];
  currentStudent: StudentUser | null;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
  onEnroll?: (courseId: string) => Promise<void> | void;
  onSwitchToTeacher: () => void;
  onSwitchToAdmin: () => void;
}

export const LandingHeroPage: React.FC<LandingHeroPageProps> = ({
  courses,
  topics = [],
  lessons = [],
  enrollments = [],
  currentStudent,
  onNavigate,
  onEnroll,
  onSwitchToTeacher,
  onSwitchToAdmin,
}) => {
  // ══════════════════════════════════════════════════════════════════════════
  // DALA 3D PARTICLE BRAIN ENGINE — Pinterest Pin 418905202857789895 Inspired
  // Interactive WebGL 3D Holographic Brain Cortex with 4,800 iridescent particles,
  // floating wireframe prisms, mouse parallax, and 1:1 scroll turntable rotation
  // ══════════════════════════════════════════════════════════════════════════
  const heroProgressRef = useRef<number>(0);
  const ribbonRef       = useRef<HTMLDivElement | null>(null);

  const [activeStage, setActiveStage]       = useState(0);
  const activeStageRef                       = useRef(0);
  const [searchQuery, setSearchQuery]        = useState('');
  const [courseFilter, setCourseFilter]      = useState<'all' | 'enrolled' | 'available'>('all');
  const [showAllCourses, setShowAllCourses]  = useState(false);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen]  = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const heroRef       = useRef<HTMLDivElement>(null);
  const heroTrackRef  = useRef<HTMLDivElement>(null);
  const lastGridScrollRef = useRef<number>(0);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const publishedCourses  = courses.filter((c) => c.status === 'published' || !c.status);
  const filteredCourses   = publishedCourses.filter((course) => {
    const isEnrolled = enrolledCourseIds.has(course.id);
    if (courseFilter === 'enrolled' && !isEnrolled) return false;
    if (courseFilter === 'available' && isEnrolled) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        (course.description && course.description.toLowerCase().includes(q))
      );
    }
    return true;
  });
  const displayedCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 6);

  const handleEnrollFromHome = async (courseId: string) => {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#curriculum-grid' || hash === '#courses') {
        setTimeout(() => {
          const gridEl = document.getElementById('curriculum-grid');
          gridEl?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  // ── GSAP ScrollTrigger: scrub:true drives 3D turntable particle rotation ──
  useEffect(() => {
    const track = heroTrackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger : track,
      start   : 'top top',
      end     : 'bottom bottom',
      scrub   : true,
      onUpdate: (self) => {
        const p = self.progress;
        heroProgressRef.current = p;

        if (ribbonRef.current)
          ribbonRef.current.style.opacity = String(0.35 + p * 0.65);

        setIsScrolledPastHero(p > 0.95);
        const stage = p < 0.33 ? 0 : p < 0.67 ? 1 : 2;
        if (stage !== activeStageRef.current) {
          activeStageRef.current = stage;
          setActiveStage(stage);
        }
      },
    });
    return () => { st.kill(); };
  }, []);

  // ── KEYBOARD NAVIGATION ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const track = heroTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const totalScroll = track.offsetHeight - window.innerHeight;
      const scrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && scrollProgress < 0.985) {
        e.preventDefault();
        const nextY = Math.min(totalScroll, window.scrollY + 180);
        window.scrollTo({ top: nextY, behavior: 'smooth' });
      } else if (['ArrowUp', 'PageUp'].includes(e.key) && scrollProgress > 0.015) {
        e.preventDefault();
        const prevY = Math.max(0, window.scrollY - 180);
        window.scrollTo({ top: prevY, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectStage = (stageIdx: number) => {
    const track = heroTrackRef.current;
    if (!track) return;
    const totalScroll = track.offsetHeight - window.innerHeight;
    const targets = [0.0, 0.5, 1.0];
    const targetY = (targets[stageIdx] ?? 0) * totalScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const scrollToCurriculum = () => {
    setMobileMenuOpen(false);
    const gridEl = document.getElementById('curriculum-grid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRankings = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById('rankings-preview');
    el ? el.scrollIntoView({ behavior: 'smooth' }) : onNavigate('leaderboard');
  };

  return (
    <div className="min-h-screen bg-[#03050C] text-[#F8FAFC] selection:bg-white/20 selection:text-white relative">
      
      {/* Background Ambient Cybernetic Obsidian Space Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[800px] h-[700px] bg-gradient-to-tr from-cyan-950/20 via-blue-950/20 to-transparent rounded-full blur-[160px] opacity-60" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-blue-950/15 rounded-full blur-[140px] opacity-50" />
      </div>

      {/* ========================================================================= */}
      {/* GLOBAL FIXED GLASSMORPHIC NAVBAR                                          */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#03050C]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-14 h-16 sm:h-20 flex items-center justify-between transition-all">
        {/* Brand Title */}
        <div
          onClick={() => selectStage(0)}
          className="cursor-pointer group flex items-center gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:border-white/40 transition-colors">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sans text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-white group-hover:text-cyan-300 transition-colors">
            Learnova
          </span>
        </div>

        {/* Desktop Navigation Links — Only Actual Pages */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
          <button
            type="button"
            onClick={() => selectStage(0)}
            className={`relative py-1 transition-colors cursor-pointer ${
              !isScrolledPastHero ? 'text-white' : 'hover:text-white'
            }`}
          >
            <span>Home</span>
            {!isScrolledPastHero && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            )}
          </button>

          <button
            type="button"
            onClick={scrollToCurriculum}
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

        {/* Right Auth / Quick Actions */}
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

          {/* Quick Catalog Grid Shortcut */}
          <button
            type="button"
            onClick={scrollToCurriculum}
            className="hidden sm:block p-2 text-white/60 hover:text-white transition cursor-pointer"
            title="View Courses on Home"
          >
            <Grid className="w-4 h-4" />
          </button>

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
                  selectStage(0);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-white hover:text-cyan-400 border-b border-white/5"
              >
                01. Home
              </button>
              <button
                type="button"
                onClick={() => {
                  scrollToCurriculum();
                }}
                className="text-left py-2 text-white hover:text-cyan-400 border-b border-white/5"
              >
                02. Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-white hover:text-cyan-400 border-b border-white/5"
              >
                03. About
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-white hover:text-cyan-400 border-b border-white/5"
              >
                04. Contact Us
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchToTeacher();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#94A3B8] hover:text-white border-b border-white/5"
              >
                Teacher Studio
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-[#94A3B8] hover:text-white border-b border-white/5"
              >
                Governance & Admin
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            {!currentStudent ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('sign_in');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center rounded-xl border border-white/20 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 text-center rounded-xl bg-[#2563EB] text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/40"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center rounded-xl bg-[#2563EB] text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-blue-600/40"
              >
                Enter Student Portal →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SECTION: FULL-SCREEN CYBERNETIC MUSEUM VIEWPORT                     */}
      {/* 220vh Native Sticky Scroll Track for 120 FPS hardware-accelerated 3D turn */}
      {/* ========================================================================= */}
      <div ref={heroTrackRef} className="relative h-[250vh] w-full">
        <div
          ref={heroRef}
          className="sticky top-0 h-screen min-h-[700px] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-0 px-4 sm:px-10 lg:px-16 overflow-hidden bg-[#03050C] z-10"
        >
        {/* Fullscreen Subtle Architectural Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-10">
          <div className="border-r border-white/15 h-full" />
          <div className="border-r border-white/15 h-full" />
          <div className="border-r border-white/15 h-full" />
          <div className="border-r border-white/15 h-full" />
          <div className="border-r border-white/15 h-full" />
          <div className="h-full" />
        </div>

        {/* Cyber Laser Scanline Beam drifting vertically across hero */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent pointer-events-none animate-scanline z-10" />

        {/* Ambient Neural Backlight Gradient — Focused solely on right quadrant */}
        <div className="absolute right-[-5%] top-[15%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full pointer-events-none blur-[140px] bg-[radial-gradient(circle,rgba(34,211,238,0.10)_0%,rgba(37,99,235,0.05)_50%,transparent_75%)]" />

        {/* Deep Dark Protective Backdrop for Left Text Column (Guarantees Razor-Sharp Contrast) */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 lg:w-3/5 pointer-events-none z-22 bg-gradient-to-r from-[#03050C] via-[#03050C]/95 via-60% to-transparent" />

        {/* Left Vertical Pagination Indicator */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3.5">
          <button
            type="button"
            onClick={() => selectStage(0)}
            className={`transition-all duration-300 cursor-pointer ${
              activeStage === 0
                ? 'w-7 h-1 bg-white rounded-full shadow-[0_0_8px_white]'
                : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/60'
            }`}
            title="Stage 1: Overview"
          />
          <button
            type="button"
            onClick={() => selectStage(1)}
            className={`transition-all duration-300 cursor-pointer ${
              activeStage === 1
                ? 'w-7 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]'
                : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/60'
            }`}
            title="Stage 2: Methodology"
          />
          <button
            type="button"
            onClick={() => selectStage(2)}
            className={`transition-all duration-300 cursor-pointer ${
              activeStage === 2
                ? 'w-7 h-1 bg-white rounded-full shadow-[0_0_8px_white]'
                : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/60'
            }`}
            title="Stage 3: Capability & Action"
          />
        </div>

        {/* ===================================================================== */}
        {/* FLOATING STARDUST & COSMIC PARTICLES (Surrounding Space)              */}
        {/* ===================================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
          <div className="absolute top-[18%] right-[36%] w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_10px_white] animate-stardust" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[28%] right-[26%] w-1 h-1 rounded-full bg-cyan-300/80 shadow-[0_0_8px_#22d3ee] animate-stardust" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[48%] right-[32%] w-1.5 h-1.5 rounded-full bg-white/75 shadow-[0_0_8px_white] animate-stardust" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-[22%] right-[16%] w-1.5 h-1.5 rounded-full bg-amber-300/85 shadow-[0_0_8px_#f59e0b] animate-stardust" style={{ animationDelay: '1.8s' }} />
          <div className="absolute top-[62%] right-[18%] w-2 h-2 rounded-full bg-cyan-400/90 shadow-[0_0_12px_#22d3ee] animate-stardust" style={{ animationDelay: '3.6s' }} />
          <div className="absolute top-[38%] right-[8%] w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_white] animate-stardust" style={{ animationDelay: '4.2s' }} />
          <div className="absolute top-[72%] right-[28%] w-1 h-1 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b] animate-stardust" style={{ animationDelay: '2.9s' }} />
          <div className="absolute top-[14%] right-[22%] w-2 h-2 rounded-full bg-white/95 shadow-[0_0_12px_white] animate-stardust" style={{ animationDelay: '5s' }} />
        </div>

        {/* ================================================================== */}
        {/* DALA 3D PARTICLE BRAIN — WebGL Holographic Cortex (Pinterest Inspired) */}
        {/* Multi-spectral 3D brain with glowing triangular particles, wireframe  */}
        {/* prisms, and true 3D turntable rotation synchronized with scroll!      */}
        {/* ================================================================== */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
          {/* Ethereal luminous energy ribbon wave */}
          <div
            ref={ribbonRef}
            className="absolute right-[5%] top-[20%] w-[420px] h-[300px] rounded-full blur-3xl pointer-events-none animate-ribbon-wave bg-gradient-to-r from-blue-600/15 via-cyan-500/20 to-purple-600/10"
            style={{ opacity: 0.35 }}
          />

          {/* Three.js Holographic Brain Canvas Container */}
          <div className="w-full h-full relative">
            <DalaParticleBrain progressRef={heroProgressRef} />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* STAGE CONTENT CONTAINERS                                              */}
        {/* ===================================================================== */}
        <div className="relative flex-1 flex items-center px-4 sm:px-10 lg:px-16 py-8 z-30">
          
          {/* STAGE 0: Overview (Identical to Pinterest Pin 895512707171363409) */}
          <div
            className={`max-w-2xl pl-2 sm:pl-8 transition-all duration-500 ease-out ${
              activeStage === 0
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-6 pointer-events-none absolute'
            }`}
          >
            {/* Pill Badges with Live Cyber Telemetry */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.8)] w-fit">
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[9px] font-bold text-black uppercase tracking-wider">
                  NEW
                </span>
                <span className="text-xs text-white font-medium">
                  Latest integration just arrived
                </span>
              </div>

              {/* High-tech Cyber HUD telemetry pill */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                <span className="font-semibold tracking-wider">NEURAL ENGINE ACTIVE</span>
              </div>
            </div>

            {/* Headline with High-Contrast Crisp Visibility */}
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.98)]">
              Revolutionize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-cyan-300 drop-shadow-[0_0_35px_rgba(34,211,238,0.5)]">
                Learning
              </span>{' '}
              with AI
            </h1>

            {/* Subtitle with High-Contrast Crisp Visibility */}
            <p className="mt-6 text-sm sm:text-lg text-slate-100 font-normal leading-relaxed max-w-lg drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              Experience cutting-edge solutions designed to elevate productivity and deliver results like never before.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate(currentStudent ? 'dashboard' : 'register')}
                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-white font-semibold text-sm transition-all duration-300 backdrop-blur-md shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToCurriculum}
                className="px-7 py-3.5 rounded-full border border-white/20 hover:border-white/50 bg-white/[0.05] hover:bg-white/[0.12] text-white font-medium text-sm transition-all cursor-pointer backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              >
                Explore Curriculum
              </button>
            </div>
          </div>

          {/* STAGE 1: Synaptic Neural Methodology */}
          <div
            className={`max-w-xl pl-2 sm:pl-8 space-y-6 transition-all duration-500 ease-out ${
              activeStage === 1
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-6 pointer-events-none absolute'
            }`}
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md mb-2 w-fit shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-[9px] font-bold text-black uppercase tracking-wider">
                SYSTEM
              </span>
              <span className="text-xs text-white font-medium">
                Directed Acyclic Synaptic Graph
              </span>
            </div>

            {/* Row 1 */}
            <div className="space-y-1.5 group cursor-pointer" onClick={scrollToCurriculum}>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-cyan-400 font-mono font-bold">01</span>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Prerequisite Knowledge DAG
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Concepts are sequenced mathematically. Foundational topics prevent dead ends, ensuring cognitive readiness before unlocking advanced domains.
              </p>
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5 group cursor-pointer" onClick={() => onNavigate('progress')}>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-cyan-400 font-mono font-bold">02</span>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Bayesian Knowledge Tracing
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Server-authoritative evaluations dynamically compute probability of mastery per topic, tailoring adaptive practice to individual cognitive gaps.
              </p>
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5 group cursor-pointer" onClick={onSwitchToTeacher}>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-cyan-400 font-mono font-bold">03</span>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  Accredited Faculty Studio
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Curriculum, assessments, and rubrics are curated and audited by practicing faculty, maintaining university rigor and credential integrity.
              </p>
            </div>
          </div>

          {/* STAGE 2: Level Up & Action View */}
          <div
            className={`max-w-2xl pl-2 sm:pl-8 transition-all duration-500 ease-out ${
              activeStage === 2
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-6 pointer-events-none absolute'
            }`}
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md mb-6 w-fit shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[9px] font-bold text-black uppercase tracking-wider">
                ACCELERATE
              </span>
              <span className="text-xs text-white font-medium">
                Elevate Your Potential
              </span>
            </div>

            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl text-white font-extrabold leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              Built for career <br />
              switchers, juniors, and <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300">
                creators ready to level up.
              </span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              You enter with one set of beliefs, tools, and self-perception — and leave with a verifiable new identity.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToCurriculum}
                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 border border-blue-400/40 text-white font-semibold text-sm transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] cursor-pointer flex items-center gap-2 group"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="px-7 py-3.5 rounded-full border border-white/20 hover:border-white/50 bg-white/[0.05] hover:bg-white/[0.12] text-white font-medium text-sm transition cursor-pointer backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              >
                Start Free Trial
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>

      {/* ========================================================================= */}
      {/* SECTION 2: VERIFIED CURRICULUM GRID (Scroll Fade In & Fade Out)           */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-4 sm:p-8 lg:p-12 max-w-[1600px] mx-auto">
        <FadeInSection id="curriculum-grid" className="pt-12 sm:pt-20 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Curriculum Registry
              </span>
              <h2 className="font-sans font-bold text-2xl sm:text-4xl text-white mt-1 tracking-tight">
                Verified University Curriculum
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64 md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Filter courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-full bg-[#060813] border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setCourseFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    courseFilter === 'all'
                      ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  All ({publishedCourses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilter('available')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    courseFilter === 'available'
                      ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Available
                </button>
                {currentStudent && (
                  <button
                    type="button"
                    onClick={() => setCourseFilter('enrolled')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                      courseFilter === 'enrolled'
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    Enrolled ({enrolledCourseIds.size})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {displayedCourses.length === 0 ? (
            <div className="text-center py-16 bg-[#060813] border border-white/10 rounded-3xl mt-10 p-8 space-y-3">
              <BookOpen className="w-8 h-8 text-cyan-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No courses match your filter</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Try adjusting your search keywords or clearing your filter to view all verified courses.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCourseFilter('all');
                }}
                className="mt-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
              {displayedCourses.map((course, idx) => {
                const isEnrolled = enrolledCourseIds.has(course.id);
                return (
                  <div
                    key={course.id || idx}
                    className="rounded-3xl bg-[#060813] border border-white/10 p-6 sm:p-7 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-950/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group animate-fade-in"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-3">
                        <span>MODULE {String(idx + 1).padStart(2, '0')}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold ${
                          isEnrolled ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-cyan-950/50 text-cyan-300 border border-cyan-800'
                        }`}>
                          {isEnrolled ? 'Active' : 'Verified'}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedCourseForSyllabus(course)}
                        className="font-sans font-bold text-xl text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {course.title}
                      </h3>

                      <p className="mt-2.5 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                        {course.description || 'Comprehensive curriculum covering foundational theory, guided practice modules, and real-world project mastery.'}
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
                            handleEnrollFromHome(course.id);
                          }
                        }}
                        disabled={enrollingCourseId === course.id}
                        className="px-4 py-2 rounded-full text-xs font-bold btn-primary-pill shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {enrollingCourseId === course.id ? 'Enrolling...' : isEnrolled ? 'Open Map' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Toggle View All Courses */}
          {filteredCourses.length > 6 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setShowAllCourses(!showAllCourses)}
                className="px-6 py-2.5 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/[0.12] text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer backdrop-blur-md"
              >
                {showAllCourses ? 'Show Fewer Courses' : `View All Courses (${filteredCourses.length})`}
              </button>
            </div>
          )}
        </FadeInSection>

        {/* ========================================================================= */}
        {/* SECTION 3: GLOBAL RANKINGS PREVIEW (Scroll Fade In & Fade Out)            */}
        {/* ========================================================================= */}
        <FadeInSection id="rankings-preview" className="mt-8 mb-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#060813] border border-white/10 relative overflow-hidden">
            <div className="absolute left-0 bottom-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Global Competence Rankings
                </span>
                <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white mt-1 tracking-tight">
                  Top University Scholars
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                className="shrink-0 px-5 py-2.5 rounded-full btn-primary-pill text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer w-fit"
              >
                <span>View Full Leaderboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
              <div
                onClick={() => onNavigate('leaderboard')}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/50 transition cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-amber-400">RANK #01</div>
                  <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">Sophia Lin</div>
                  <div className="text-xs text-[#94A3B8]">4,850 XP • 24 Topics Mastered</div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('leaderboard')}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-slate-400/50 transition cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-400/20 border border-slate-400/30 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0">
                  <Award className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">RANK #02</div>
                  <div className="font-semibold text-white group-hover:text-slate-300 transition-colors">Marcus Vance</div>
                  <div className="text-xs text-[#94A3B8]">4,210 XP • 21 Topics Mastered</div>
                </div>
              </div>

              <div
                onClick={() => onNavigate('leaderboard')}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 transition cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0">
                  <Award className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-cyan-400">RANK #03</div>
                  <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">Elena Rostova</div>
                  <div className="text-xs text-[#94A3B8]">3,980 XP • 19 Topics Mastered</div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ========================================================================= */}
        {/* SECTION 4: ARCHITECTURAL PILLARS BANNER (Scroll Fade In & Fade Out)       */}
        {/* ========================================================================= */}
        <FadeInSection id="academic-governance" className="mt-8 mb-10">
          <section className="p-8 sm:p-12 rounded-3xl bg-[#060813] border border-white/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                Academic Integrity & Governance
              </span>
              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white mt-1 tracking-tight">
                A Platform Engineered for Verifiable Competence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 relative z-10">
              <div
                onClick={scrollToCurriculum}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 transition cursor-pointer space-y-2 group"
              >
                <div className="text-[11px] font-mono text-cyan-400">01 / TOPOLOGY</div>
                <h3 className="font-sans font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Knowledge Graph DAG
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Prerequisites are validated using depth-first search cycle detection. Students always learn in prerequisite order.
                </p>
              </div>

              <div
                onClick={() => onNavigate('progress')}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 transition cursor-pointer space-y-2 group"
              >
                <div className="text-[11px] font-mono text-cyan-400">02 / MASTERY</div>
                <h3 className="font-sans font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Bayesian Tracing
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Real-time probability recalibration guarantees that attempts update mastery authoritatively without browser tampering.
                </p>
              </div>

              <div
                onClick={onSwitchToTeacher}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/50 transition cursor-pointer space-y-2 group"
              >
                <div className="text-[11px] font-mono text-cyan-400">03 / GOVERNANCE</div>
                <h3 className="font-sans font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Faculty Studio
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Faculty verify question banks, author assessments, and inspect student progress ledgers with strict role-based access.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE FOOTER (Scroll Fade In & Fade Out)                          */}
        {/* ========================================================================= */}
        <FadeInSection className="pt-8 pb-6 border-t border-white/10 text-xs text-[#64748B]">
          <footer className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-2.5">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-white">
                  Learner Views
                </span>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition cursor-pointer">Student Dashboard</button></li>
                  <li><button onClick={scrollToCurriculum} className="hover:text-white transition cursor-pointer">Courses (Home)</button></li>
                  <li><button onClick={() => onNavigate('my_learning')} className="hover:text-white transition cursor-pointer">Enrolled Modules</button></li>
                  <li><button onClick={() => onNavigate('progress')} className="hover:text-white transition cursor-pointer">Mastery Analytics</button></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-white">
                  Progression
                </span>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li><button onClick={() => onNavigate('leaderboard')} className="hover:text-white transition cursor-pointer">Global Rankings</button></li>
                  <li><button onClick={() => onNavigate('achievements')} className="hover:text-white transition cursor-pointer">Badges & Achievements</button></li>
                  <li><button onClick={() => onNavigate('profile')} className="hover:text-white transition cursor-pointer">Account Settings</button></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-white">
                  Faculty
                </span>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li><button onClick={onSwitchToTeacher} className="hover:text-white transition cursor-pointer">Teacher Studio</button></li>
                  <li><button onClick={onSwitchToTeacher} className="hover:text-white transition cursor-pointer">Curriculum DAG Editor</button></li>
                  <li><button onClick={onSwitchToTeacher} className="hover:text-white transition cursor-pointer">Question Bank</button></li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-white">
                  Governance
                </span>
                <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                  <li><button onClick={onSwitchToAdmin} className="hover:text-white transition cursor-pointer">System Health</button></li>
                  <li><button onClick={onSwitchToAdmin} className="hover:text-white transition cursor-pointer">Security Audit Log</button></li>
                  <li><button onClick={onSwitchToAdmin} className="hover:text-white transition cursor-pointer">Role Safeguards</button></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3">
                <span className="font-sans uppercase tracking-widest text-white font-bold">Learnova</span>
                <span>— University Adaptive Learning & Governance Platform</span>
              </div>
              <span>&copy; {new Date().getFullYear()} Learnova. All rights reserved.</span>
            </div>
          </footer>
        </FadeInSection>

      </div>

      {/* ========================================================================= */}
      {/* COURSE DETAILS & SYLLABUS MODAL (Home Page Sub-Page Experience)           */}
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
                    handleEnrollFromHome(courseId);
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
    </div>
  );
};
