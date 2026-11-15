import React, { useState } from 'react';
import { Badge, GamificationProfile } from '../../types';
import {
  Award,
  Lock,
  CheckCircle2,
  Zap,
  Flame,
  Compass,
  Code,
  GraduationCap,
  Crown,
  Footprints,
  Calendar,
  X,
} from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface AchievementsBadgesPageProps {
  badges: Badge[];
  gamificationProfile: GamificationProfile;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const AchievementsBadgesPage: React.FC<AchievementsBadgesPageProps> = ({
  badges,
  gamificationProfile,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-7 h-7 ${isUnlocked ? 'text-orange-400' : 'text-[#64748B]'}`;
    switch (iconName) {
      case 'Footprints':
        return <Footprints className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Achievements & Badges
          </h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Celebrate verified academic milestones, diagnostic baselines, and streak progression.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/8 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'all'
              ? 'bg-[#0A0F1D] text-[#3B82F6] shadow-2xs'
              : 'text-[#94A3B8] hover:text-white'
              }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'unlocked'
              ? 'bg-[#0A0F1D] text-[#3B82F6] shadow-2xs'
              : 'text-[#94A3B8] hover:text-white'
              }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'locked'
              ? 'bg-[#0A0F1D] text-[#3B82F6] shadow-2xs'
              : 'text-[#94A3B8] hover:text-white'
              }`}
          >
            Locked ({badges.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Gamification Progress Bar Banner */}
      <div className="p-6 rounded-2xl bg-[#0A0F1D] border border-white/8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
            Gamification Profile Status
          </span>
          <div className="text-xl font-black text-white">
            {unlockedCount} of {badges.length} Achievements Unlocked
          </div>
          <p className="text-xs text-[#64748B]">
            Earned badges contribute to your public leaderboard standing and verifiable learning portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('xp_history')}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-[#94A3B8] transition"
          >
            XP Activity History
          </button>
          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition shadow-2xs"
          >
            View Leaderboard
          </button>
        </div>
      </div>

      {/* Badges Grid (3 columns desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${badge.isUnlocked
              ? 'bg-[#0A0F1D] border-white/8 hover:border-[#2563EB]/40 shadow-xs'
              : 'bg-white/5 border-white/8 opacity-70 hover:opacity-100'
              }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${badge.isUnlocked
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-white/8 border border-white/8'
                    }`}
                >
                  {renderBadgeIcon(badge.icon, badge.isUnlocked)}
                </div>

                {badge.isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] bg-white/8 px-2 py-0.5 rounded-full border border-white/8">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {badge.title}
              </h3>

              <p className="mt-2 text-xs text-[#94A3B8] leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="capitalize font-semibold text-[#3B82F6]">
                {badge.category}
              </span>
              {badge.earnedAt && (
                <span>Unlocked {new Date(badge.earnedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
              {renderBadgeIcon(selectedBadge.icon, selectedBadge.isUnlocked)}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6]">
                {selectedBadge.category} Achievement
              </span>
              {selectedBadge.isUnlocked ? (
                <span className="text-[11px] font-bold text-emerald-400">
                  • Confirmed Unlocked
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#64748B]">• Locked</span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {selectedBadge.title}
            </h3>

            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
              {selectedBadge.description}
            </p>

            {selectedBadge.earnedAt && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs text-[#94A3B8] mb-6 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3B82F6]" />
                <span>Earned on: {new Date(selectedBadge.earnedAt).toLocaleString()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
