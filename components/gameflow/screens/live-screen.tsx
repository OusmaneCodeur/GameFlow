'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Radio, RefreshCw, Bell, BellOff, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { LiveScore } from '@/lib/data';

export function LiveScreen() {
  const { liveScores } = useApp();
  const [selectedTab, setSelectedTab] = useState<'live' | 'finished' | 'upcoming'>('live');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredScores = liveScores.filter(score => score.status === selectedTab);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleNotification = (scoreId: string) => {
    setNotifications(prev => ({
      ...prev,
      [scoreId]: !prev[scoreId]
    }));
  };

  const tabs = [
    { id: 'live' as const, label: 'En direct', count: liveScores.filter(s => s.status === 'live').length },
    { id: 'finished' as const, label: 'Terminés', count: liveScores.filter(s => s.status === 'finished').length },
    { id: 'upcoming' as const, label: 'À venir', count: 3 },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 pt-12 pb-6 px-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Radio className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Scores Live</h1>
            </div>
            <p className="text-red-100 text-sm mt-1">Suivez les matchs en temps réel</p>
          </div>
          <motion.button
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-red-500'
                  : 'bg-white/20 text-white'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedTab === tab.id
                    ? 'bg-red-500 text-white'
                    : 'bg-white/30'
                }`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Live Scores List */}
      <div className="px-5 py-4">
        <AnimatePresence mode="wait">
          {filteredScores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500">
                {selectedTab === 'live' 
                  ? 'Aucun match en direct pour le moment'
                  : selectedTab === 'finished'
                  ? 'Aucun match terminé'
                  : 'Aucun match à venir'}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredScores.map((score, index) => (
                <ScoreCard 
                  key={score.id} 
                  score={score} 
                  index={index}
                  hasNotification={!!notifications[score.id]}
                  onToggleNotification={() => toggleNotification(score.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming matches placeholder */}
        {selectedTab === 'upcoming' && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {i === 1 ? 'Football' : i === 2 ? 'Basketball' : 'Athlétisme'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Demain {14 + i}:00
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{i === 1 ? '🇸🇳' : i === 2 ? '🇫🇷' : '🇯🇵'}</span>
                    <span className="font-semibold text-gray-800">{i === 1 ? 'Sénégal' : i === 2 ? 'France' : 'Japon'}</span>
                  </div>
                  <span className="text-gray-400 font-medium">VS</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">{i === 1 ? 'Nigéria' : i === 2 ? 'USA' : 'Kenya'}</span>
                    <span className="text-2xl">{i === 1 ? '🇳🇬' : i === 2 ? '🇺🇸' : '🇰🇪'}</span>
                  </div>
                </div>
                <motion.button
                  className="w-full mt-4 py-3 bg-[#0c80c3]/10 text-[#0c80c3] rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Bell className="w-4 h-4" />
                  Activer le rappel
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface ScoreCardProps {
  score: LiveScore;
  index: number;
  hasNotification: boolean;
  onToggleNotification: () => void;
}

function ScoreCard({ score, index, hasNotification, onToggleNotification }: ScoreCardProps) {
  const [animatedScore1, setAnimatedScore1] = useState(score.team1.score);
  const [animatedScore2, setAnimatedScore2] = useState(score.team2.score);
  const [justScored, setJustScored] = useState<'team1' | 'team2' | null>(null);

  useEffect(() => {
    if (score.team1.score !== animatedScore1) {
      setJustScored('team1');
      setAnimatedScore1(score.team1.score);
      setTimeout(() => setJustScored(null), 2000);
    }
    if (score.team2.score !== animatedScore2) {
      setJustScored('team2');
      setAnimatedScore2(score.team2.score);
      setTimeout(() => setJustScored(null), 2000);
    }
  }, [score.team1.score, score.team2.score, animatedScore1, animatedScore2]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-[#0c80c3]/10 text-[#0c80c3] rounded-full text-xs font-medium">
            {score.sport}
          </span>
          {score.status === 'live' && (
            <motion.div 
              className="flex items-center gap-1 px-2 py-1 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{score.time}</span>
          <motion.button
            onClick={onToggleNotification}
            whileTap={{ scale: 0.9 }}
          >
            {hasNotification ? (
              <Bell className="w-5 h-5 text-[#0c80c3] fill-[#0c80c3]/20" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Score */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-3xl">{score.team1.flag}</span>
            <div>
              <p className="font-bold text-gray-800">{score.team1.name}</p>
              <p className="text-xs text-gray-500">{score.team1.country}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 px-4">
            <motion.span 
              className={`text-4xl font-bold ${justScored === 'team1' ? 'text-[#09a552]' : 'text-gray-800'}`}
              animate={justScored === 'team1' ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {animatedScore1}
            </motion.span>
            <span className="text-2xl text-gray-300">-</span>
            <motion.span 
              className={`text-4xl font-bold ${justScored === 'team2' ? 'text-[#09a552]' : 'text-gray-800'}`}
              animate={justScored === 'team2' ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {animatedScore2}
            </motion.span>
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <div className="text-right">
              <p className="font-bold text-gray-800">{score.team2.name}</p>
              <p className="text-xs text-gray-500">{score.team2.country}</p>
            </div>
            <span className="text-3xl">{score.team2.flag}</span>
          </div>
        </div>

        {/* Period */}
        {score.period && (
          <p className="text-center text-sm text-gray-500 mt-4">{score.period}</p>
        )}
      </div>

      {/* Footer */}
      <motion.button
        className="w-full py-3 bg-gray-50 text-[#0c80c3] font-medium text-sm flex items-center justify-center gap-1 border-t border-gray-100"
        whileTap={{ backgroundColor: '#f3f4f6' }}
      >
        Voir les détails <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
