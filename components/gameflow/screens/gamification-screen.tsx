'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Award, Medal, Target, Zap, TrendingUp, Crown } from 'lucide-react';
import { useApp } from '@/lib/app-context';

interface GamificationScreenProps {
  onBack: () => void;
}

export function GamificationScreen({ onBack }: GamificationScreenProps) {
  const { user } = useApp();

  const leaderboard = [
    { rank: 1, name: 'Fatou S.', points: 5200, avatar: '👩🏾' },
    { rank: 2, name: 'Moussa D.', points: 4800, avatar: '👨🏾' },
    { rank: 3, name: 'Aïda N.', points: 4500, avatar: '👩🏽' },
    { rank: 4, name: user?.name || 'Vous', points: user?.points || 0, avatar: '🧑🏾', isUser: true },
    { rank: 5, name: 'Omar T.', points: 2200, avatar: '👨🏿' },
  ].sort((a, b) => b.points - a.points).map((p, i) => ({ ...p, rank: i + 1 }));

  const challenges = [
    { id: 1, title: 'Premier événement', description: 'Assistez à votre premier événement', points: 100, progress: 100, completed: true },
    { id: 2, title: 'Explorateur', description: 'Visitez 5 sites différents', points: 200, progress: 60, completed: false },
    { id: 3, title: 'Fan inconditionnel', description: 'Assistez à 10 événements', points: 500, progress: 30, completed: false },
    { id: 4, title: 'Social', description: 'Partagez 5 moments', points: 150, progress: 0, completed: false },
  ];

  const earnedBadges = user?.badges.filter(b => b.earned) || [];
  const lockedBadges = user?.badges.filter(b => !b.earned) || [];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 pt-12 pb-8 px-5 relative overflow-hidden">
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-xl font-bold text-white">Gamification</h1>
        </div>

        {/* Points card */}
        <motion.div 
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-white" />
            <span className="text-5xl font-bold text-white">{user?.points || 0}</span>
          </div>
          <p className="text-white/80">Points GameFlow</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{earnedBadges.length}</p>
              <p className="text-xs text-white/60">Badges</p>
            </div>
            <div className="w-px bg-white/30" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">#4</p>
              <p className="text-xs text-white/60">Classement</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <section className="px-5 mt-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Mes badges
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {earnedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm"
            >
              <span className="text-3xl mb-1">{badge.icon}</span>
              <span className="text-[10px] text-center text-yellow-800 font-medium">{badge.name}</span>
            </motion.div>
          ))}
          {lockedBadges.map((badge) => (
            <motion.div
              key={badge.id}
              className="aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center p-2 opacity-50"
            >
              <span className="text-3xl mb-1 grayscale">{badge.icon}</span>
              <span className="text-[10px] text-center text-gray-500 font-medium">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section className="px-5 mt-8">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#0c80c3]" />
          Défis en cours
        </h3>
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-4 shadow-sm ${challenge.completed ? 'border-2 border-[#09a552]' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                    {challenge.completed && (
                      <span className="text-[#09a552]">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                  <Zap className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-700">{challenge.points}</span>
                </div>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    challenge.completed ? 'bg-[#09a552]' : 'bg-[#0c80c3]'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${challenge.progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">{challenge.progress}%</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="px-5 mt-8 pb-8">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#09a552]" />
          Classement
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 ${
                index !== leaderboard.length - 1 ? 'border-b border-gray-100' : ''
              } ${player.isUser ? 'bg-[#0c80c3]/5' : ''}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center font-bold ${
                player.rank === 1 ? 'text-yellow-500' :
                player.rank === 2 ? 'text-gray-400' :
                player.rank === 3 ? 'text-amber-600' :
                'text-gray-500'
              }`}>
                {player.rank === 1 ? <Crown className="w-6 h-6" /> : `#${player.rank}`}
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${player.isUser ? 'text-[#0c80c3]' : 'text-gray-800'}`}>
                  {player.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-800">{player.points.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
