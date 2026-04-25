'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Calendar, MapPin, Radio, Sparkles, ChevronRight, Star, Clock, Trophy } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Event } from '@/lib/data';
import type { TabType } from '../bottom-nav';
import Image from 'next/image';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onEventClick: (event: Event) => void;
  onNotificationsClick: () => void;
}

export function HomeScreen({ onNavigate, onEventClick, onNotificationsClick }: HomeScreenProps) {
  const { user, events, notifications, language, setLanguage, t } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;
  const featuredEvents = events.filter(e => e.isFeatured);
  const recommendedEvents = events.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'en' ? 'Good morning' : language === 'wo' ? 'Asalaamaalekum' : 'Bonjour';
    if (hour < 18) return language === 'en' ? 'Good afternoon' : language === 'wo' ? 'Naka ngeen' : 'Bon apres-midi';
    return language === 'en' ? 'Good evening' : language === 'wo' ? 'Good evening' : 'Bonsoir';
  };

  const quickActions = [
    { icon: Calendar, label: t('nav.events'), color: 'bg-[#0c80c3]', tab: 'events' as TabType },
    { icon: MapPin, label: t('nav.map'), color: 'bg-[#09a552]', tab: 'map' as TabType },
    { icon: Radio, label: t('common.live'), color: 'bg-red-500', tab: 'live' as TabType },
    { icon: Sparkles, label: t('nav.assistant'), color: 'bg-purple-500', tab: 'assistant' as TabType },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header / Hero */}
      <div
        className="relative w-full px-5 pt-12 pb-8 rounded-b-3xl overflow-hidden"
        style={{
          backgroundImage: "url('/couvertueGameflow.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Full overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <motion.div
            className="flex items-start justify-between gap-3"
            variants={itemVariants}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              <p className="text-white text-sm">{getGreeting()}</p>
              <h1 className="text-white text-2xl md:text-3xl font-bold mt-0.5">
                {user?.name || t('common.welcome')}
              </h1>
            </div>
            <div className="flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              <Image src="/logoGameflow.jpeg" alt="GameFlow" width={36} height={36} className="rounded-full border border-white/40 shadow-md object-cover" />
              <span className="text-sm text-white font-semibold">{t('common.appName')}</span>
            </div>
            <div className="flex gap-3">
              <motion.button
                className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNotificationsClick}
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-4 space-y-4 md:space-y-5">
          <motion.div className="flex flex-wrap items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" variants={itemVariants}>
            <span className="text-xs text-white">{t('common.language')}</span>
            {(['fr', 'en', 'wo'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                  language === lang ? 'bg-white text-[#0c80c3]' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Points badge */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{user?.points || 0} pts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{user?.badges.filter(b => b.earned).length || 0} badges</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Banner */}
      <motion.div
        className="mx-5 mt-6 relative overflow-hidden rounded-2xl shadow-lg"
        variants={itemVariants}
      >
        <div className="relative h-40 bg-gradient-to-r from-[#09a552] to-[#0c80c3] p-5 flex flex-col justify-between">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">Jeux Olympiques de la Jeunesse</p>
            <h2 className="text-white text-2xl font-bold mt-1">Sénégal 2026</h2>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm">Dans 186 jours</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="px-5 mt-6"
        variants={itemVariants}
      >
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              className="flex flex-col items-center"
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(action.tab)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-600 mt-2 font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Events */}
      <motion.section
        className="mt-8 px-5"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{t('home.title')}</h3>
          <button
            className="flex items-center gap-1 text-[#0c80c3] text-sm font-medium"
            onClick={() => onNavigate('events')}
          >
            {t('home.seeAll')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {featuredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEventClick(event)}
            >
              <div className="h-32 bg-gradient-to-br from-[#0c80c3] to-[#09a552] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">{
                    event.sport === 'Football' ? '⚽' :
                      event.sport === 'Basketball' ? '🏀' :
                        event.sport === 'Breaking' ? '🎤' : '🏃'
                  }</span>
                </div>
                {event.isLive && (
                  <motion.div
                    className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full flex items-center gap-1"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </motion.div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 truncate">{event.title}</h4>
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section
        className="mt-8 px-5"
        variants={itemVariants}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('home.recommended')}</h3>
        <div className="space-y-3">
          {recommendedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEventClick(event)}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0c80c3]/20 to-[#09a552]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{
                  event.sport === 'Football' ? '⚽' :
                    event.sport === 'Basketball' ? '🏀' :
                      event.sport === 'Breaking' ? '🎤' :
                        event.sport === 'Athlétisme' ? '🏃' : '🏊'
                }</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">{event.title}</h4>
                <p className="text-sm text-gray-500 truncate">{event.venue}</p>
                <p className="text-xs text-[#0c80c3] font-medium mt-1">{event.date} • {event.time}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Nearby Activities */}
      <motion.section
        className="mt-8 px-5 pb-4"
        variants={itemVariants}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t('home.nearby')}</h3>
        <motion.div
          className="bg-gradient-to-r from-[#09a552]/10 to-[#0c80c3]/10 rounded-2xl p-5"
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('map')}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#09a552] rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">3 sites à moins de 2 km</h4>
              <p className="text-sm text-gray-500">Découvrez les événements près de vous</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
