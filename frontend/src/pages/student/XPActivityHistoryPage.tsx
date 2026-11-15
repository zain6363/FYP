import React, { useState } from 'react';
import { XPEvent, GamificationProfile } from '../../types';
import {
  Zap,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import { calculateLevelFromXP } from '../../utils/studentLogic';

interface XPActivityHistoryPageProps {
  xpEvents: XPEvent[];
  gamificationProfile: GamificationProfile;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const XPActivityHistoryPage: React.FC<XPActivityHistoryPageProps> = ({
  xpEvents,
  gamificationProfile,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const levelInfo = calculateLevelFromXP(gamificationProfile.xp);

  const filteredEvents = xpEvents.filter((ev) => {
    if (filterType === 'all') return true;
    return ev.type === filterType;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpen className="w-4 h-4 text-[#3B82F6]" />;
      case 'diagnostic_completed':
        return <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />;
      case 'practice_completed':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'exam_completed':
        return <Award className="w-4 h-4 text-purple-400" />;
      case 'daily_streak':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'badge_earned':
        return <Award className="w-4 h-4 text-orange-400" />;
      default:
        return <Zap className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6] transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Dashboard</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          XP Activity History
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Transparent, auditable log of experience points awarded by the server-side gamification engine.
        </p>
      </div>

      {/* Level & XP Progression Card */}
      <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-black text-lg shadow-sm">
              L{levelInfo.level}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                Current Level Tier
              </span>
              <h3 className="text-xl font-bold text-white">
                Level {levelInfo.level} Scholar ({gamificationProfile.xp} Total XP)
              </h3>
            </div>
          </div>

          <div className="text-right sm:self-auto self-start">
            <span className="text-xs text-[#64748B] block mb-0.5">
              Next Level At: {levelInfo.nextLevelXP} XP
            </span>
            <span className="text-xs font-bold text-[#3B82F6]">
              {levelInfo.progressPercent}% of current tier
            </span>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="w-full bg-white/8 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#2563EB] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Event Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'lesson_completed', label: 'Lessons' },
          { id: 'diagnostic_completed', label: 'Diagnostics' },
          { id: 'practice_completed', label: 'Practice' },
          { id: 'exam_completed', label: 'Exams' },
          { id: 'daily_streak', label: 'Streak Bonuses' },
          { id: 'badge_earned', label: 'Badges' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-xl border transition whitespace-nowrap cursor-pointer ${
              filterType === f.id
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-[#0A0F1D] text-[#94A3B8] border-white/8 hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chronological Event Ledger */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-white/6 font-bold text-sm text-white">
          Activity Stream ({filteredEvents.length})
        </div>

        {filteredEvents.length > 0 ? (
          <div className="divide-y divide-white/6">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
                    {getEventIcon(ev.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {ev.description}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                      <span className="capitalize">{ev.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(ev.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-orange-400 bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/20">
                    +{ev.xpEarned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-[#64748B]">
            No events found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};
