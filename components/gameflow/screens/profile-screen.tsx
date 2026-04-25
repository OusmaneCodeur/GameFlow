'use client';

import { motion } from 'framer-motion';
import { 
  User, Settings, Bell, Globe, CreditCard, Heart, Trophy, 
  ChevronRight, LogOut, Shield, HelpCircle, Star, Award,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/app-context';

interface ProfileScreenProps {
  onLogout: () => void;
  onPaymentClick: () => void;
  onGamificationClick: () => void;
  onNotificationsClick: () => void;
}

export function ProfileScreen({ 
  onLogout, 
  onPaymentClick, 
  onGamificationClick,
  onNotificationsClick 
}: ProfileScreenProps) {
  const { user, setLanguage, transactions } = useApp();
  const [showLanguage, setShowLanguage] = useState(false);

  const languages = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'wo' as const, name: 'Wolof', flag: '🇸🇳' },
  ];

  const menuItems = [
    { icon: Heart, label: 'Mes favoris', badge: user?.favorites.length || 0, action: () => {} },
    { icon: Ticket, label: 'Mes billets', badge: transactions.filter(t => t.type === 'ticket').length, action: () => {} },
    { icon: Trophy, label: 'Gamification', badge: user?.badges.filter(b => b.earned).length, action: onGamificationClick },
    { icon: CreditCard, label: 'Paiement', action: onPaymentClick },
    { icon: Bell, label: 'Notifications', action: onNotificationsClick },
    { icon: Globe, label: 'Langue', value: user?.preferences.language === 'fr' ? 'Français' : user?.preferences.language === 'en' ? 'English' : 'Wolof', action: () => setShowLanguage(true) },
    { icon: Shield, label: 'Sécurité & SOS', highlight: true, action: () => {} },
    { icon: Settings, label: 'Paramètres', action: () => {} },
    { icon: HelpCircle, label: 'Aide & Support', action: () => {} },
  ];

  const earnedBadges = user?.badges.filter(b => b.earned) || [];

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0c80c3] to-[#09a552] pt-12 pb-20 px-5 relative overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-[#0c80c3]" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{user?.name || 'Utilisateur'}</h1>
            <p className="text-white/80 text-sm">{user?.email}</p>
            <p className="text-white/60 text-xs mt-1">{user?.phone}</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mx-5 -mt-12 relative z-20">
        <motion.div 
          className="bg-white rounded-2xl p-5 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex justify-around">
            <motion.div 
              className="text-center"
              whileTap={{ scale: 0.95 }}
              onClick={onGamificationClick}
            >
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{user?.points || 0}</p>
              <p className="text-xs text-gray-500">Points</p>
            </motion.div>
            <div className="w-px bg-gray-100" />
            <motion.div 
              className="text-center"
              whileTap={{ scale: 0.95 }}
              onClick={onGamificationClick}
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-7 h-7 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{earnedBadges.length}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </motion.div>
            <div className="w-px bg-gray-100" />
            <motion.div 
              className="text-center"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{user?.favorites.length || 0}</p>
              <p className="text-xs text-gray-500">Favoris</p>
            </motion.div>
          </div>

          {/* Badges preview */}
          {earnedBadges.length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Badges récents</p>
                <button 
                  className="text-xs text-[#0c80c3] font-medium"
                  onClick={onGamificationClick}
                >
                  Voir tout
                </button>
              </div>
              <div className="flex gap-3">
                {earnedBadges.slice(0, 4).map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center"
                  >
                    <span className="text-xl">{badge.icon}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Menu */}
      <div className="mt-6 px-5">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              className={`w-full flex items-center gap-4 p-4 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              } ${item.highlight ? 'bg-red-50' : ''}`}
              whileTap={{ backgroundColor: '#f9fafb' }}
              onClick={item.action}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.highlight ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <item.icon className={`w-5 h-5 ${
                  item.highlight ? 'text-red-500' : 'text-gray-600'
                }`} />
              </div>
              <span className={`flex-1 text-left font-medium ${
                item.highlight ? 'text-red-600' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-1 bg-[#0c80c3]/10 text-[#0c80c3] rounded-full text-xs font-medium">
                  {item.badge}
                </span>
              )}
              {item.value && (
                <span className="text-gray-400 text-sm">{item.value}</span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          className="w-full mt-4 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-center gap-2 text-red-500 font-medium"
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </motion.button>

        {/* App version */}
        <p className="text-center text-gray-400 text-xs mt-6">
          GameFlow v1.0.0 • Tech-Deal
        </p>
      </div>

      {/* Language Modal */}
      {showLanguage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowLanguage(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full bg-white rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choisir la langue</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 ${
                    user?.preferences.language === lang.code
                      ? 'bg-[#0c80c3]/10 border-2 border-[#0c80c3]'
                      : 'bg-gray-50'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguage(false);
                  }}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  {user?.preferences.language === lang.code && (
                    <Star className="w-5 h-5 text-[#0c80c3] ml-auto fill-[#0c80c3]" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
