import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../../types';
import { Trophy, Award, Zap, X, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { StudentNavigationPage } from '../../components/student/StudentLayout';
import {
  gamificationApi,
  mapBackendLeaderboardToLeaderboard,
  BackendLeaderboardResponse,
} from '../../services/api/gamificationApi';

interface LeaderboardPageProps {
  leaderboard: LeaderboardEntry[];
  currentStudentId: string;
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  leaderboard: initialLeaderboard,
  currentStudentId,
  onNavigate,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [optedIn, setOptedIn] = useState<boolean>(true);
  const [isTogglingOptIn, setIsTogglingOptIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    gamificationApi
      .getLeaderboard()
      .then((res: BackendLeaderboardResponse) => {
        if (!isMounted) return;
        if (res.leaderboard && res.leaderboard.length > 0) {
          setLeaderboardData(res.leaderboard.map(mapBackendLeaderboardToLeaderboard));
        }
        setOptedIn(res.current_user_opted_in);
      })
      .catch(() => {
        // Fall back to initial prop
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleOptIn = async () => {
    setIsTogglingOptIn(true);
    try {
      const nextVal = !optedIn;
      await gamificationApi.updateProfile({ is_opted_in_leaderboard: nextVal });
      setOptedIn(nextVal);
      const res = await gamificationApi.getLeaderboard();
      if (res.leaderboard) {
        setLeaderboardData(res.leaderboard.map(mapBackendLeaderboardToLeaderboard));
      }
    } catch (e) {
      console.warn('Failed to update leaderboard privacy:', e);
    } finally {
      setIsTogglingOptIn(false);
    }
  };

  const activeLeaderboard = leaderboardData.length > 0 ? leaderboardData : initialLeaderboard;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="w-7 h-7 text-orange-400" />
          <span>Academic Leaderboard</span>
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Rankings are based strictly on verified XP earned through lesson completions, diagnostics, and exams.
        </p>
      </div>

      {/* Privacy Opt-In Status Banner */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          {optedIn ? (
            <Eye className="w-4 h-4 text-emerald-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-[#64748B]" />
          )}
          <div>
            <span className="font-bold text-white">
              {optedIn ? 'Your profile is publicly ranked.' : 'You are currently hidden from public rankings.'}
            </span>
            <p className="text-[11px] text-[#64748B]">
              {optedIn
                ? 'Your pseudonym and badges are visible to course peers.'
                : 'Opt in to share your verified progress and achievements with other scholars.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleOptIn}
          disabled={isTogglingOptIn}
          className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer self-start sm:self-auto ${
            optedIn
              ? 'border border-white/10 text-[#94A3B8] hover:bg-white/5'
              : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xs'
          }`}
        >
          {isTogglingOptIn ? 'Saving...' : optedIn ? 'Make Private' : 'Opt In to Leaderboard'}
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#94A3B8]">
            <Users className="w-4 h-4 text-[#3B82F6]" />
            <span>Top Scholars ({activeLeaderboard.length} Ranked)</span>
          </div>
          <span className="text-[11px] text-[#64748B]">
            Click any scholar to inspect public badges
          </span>
        </div>

        <div className="divide-y divide-white/6">
          {activeLeaderboard.map((entry) => {
            const isMe = entry.isCurrentUser || entry.studentId === currentStudentId;

            return (
              <div
                key={entry.studentId}
                onClick={() => setSelectedEntry(entry)}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition ${
                  isMe
                    ? 'bg-[#2563EB]/10 border-l-4 border-[#2563EB]'
                    : 'hover:bg-white/5'
                }`}
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                      entry.rank === 1
                        ? 'bg-amber-500 text-amber-950 shadow-xs'
                        : entry.rank === 2
                        ? 'bg-white/15 text-[#E2E8F0]'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-white/8 text-[#94A3B8]'
                    }`}
                  >
                    {entry.rank}
                  </div>

                  <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {entry.avatar || entry.displayName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">
                        {entry.displayName}
                      </h4>
                      {isMe && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Level {entry.level} • {entry.earnedBadgesCount} Badges
                    </p>
                  </div>
                </div>

                {/* Right: XP & Inspect Badges Action */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-[#93C5FD] block">
                      {entry.xp} XP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntry(entry);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-white/8 hover:bg-white/5 text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5 transition"
                  >
                    <Award className="w-3.5 h-3.5 text-orange-400" />
                    <span className="hidden sm:inline">View Badges</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peer Badges Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#0A0F1D] border border-white/8 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white font-black text-sm flex items-center justify-center">
                {selectedEntry.avatar || selectedEntry.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedEntry.displayName}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Rank #{selectedEntry.rank} • Level {selectedEntry.level} • {selectedEntry.xp} XP
                </p>
              </div>
            </div>

            <div className="border-t border-white/6 pt-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                Public Unlocked Badges ({selectedEntry.badges.length})
              </span>

              {selectedEntry.badges.length > 0 ? (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedEntry.badges.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{b.title}</h4>
                        <p className="text-[#64748B]">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B] italic">No public badges displayed.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/6">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-full py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-xs font-bold text-[#E2E8F0] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
