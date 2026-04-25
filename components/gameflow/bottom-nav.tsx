'use client';

import { motion } from 'framer-motion';
import { Home, Calendar, MapPin, Radio, MessageCircle, User } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/lib/app-context';

export type TabType = 'home' | 'events' | 'map' | 'live' | 'assistant' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useApp();
  const tabs = [
    { id: 'home' as TabType, label: t('nav.home'), icon: Home },
    { id: 'events' as TabType, label: t('nav.events'), icon: Calendar },
    { id: 'map' as TabType, label: t('nav.map'), icon: MapPin },
    { id: 'live' as TabType, label: t('common.live'), icon: Radio },
    { id: 'assistant' as TabType, label: t('nav.assistant'), icon: MessageCircle },
    { id: 'profile' as TabType, label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg safe-area-bottom">
      <div className="max-w-lg mx-auto px-4 pt-2">
        <div className="flex items-center justify-center gap-2 py-1 rounded-full bg-gradient-to-r from-[#0c80c3]/10 to-[#09a552]/10">
          <Image src="/logoGameflow.jpeg" alt="GameFlow" width={20} height={20} className="rounded-full object-cover" />
          <span className="text-xs font-semibold text-[#0c80c3]">{t('common.appName')}</span>
        </div>
      </div>
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isLive = tab.id === 'live';
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={`flex flex-col items-center ${
                  isActive ? 'text-[#0c80c3]' : 'text-gray-400'
                }`}
                animate={{ y: isActive ? -2 : 0 }}
              >
                <div className="relative">
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`} 
                  />
                  {isLive && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-[#0c80c3]' : 'text-gray-400'
                }`}>
                  {tab.label}
                </span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0c80c3] rounded-b-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
