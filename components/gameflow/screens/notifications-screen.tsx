'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Trophy, AlertTriangle, Calendar, Radio, Check, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { notifications, markNotificationRead } = useApp();

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'score': return { icon: Trophy, color: 'bg-yellow-100', iconColor: 'text-yellow-600' };
      case 'security': return { icon: AlertTriangle, color: 'bg-red-100', iconColor: 'text-red-600' };
      case 'reminder': return { icon: Calendar, color: 'bg-blue-100', iconColor: 'text-blue-600' };
      case 'event': return { icon: Radio, color: 'bg-purple-100', iconColor: 'text-purple-600' };
      default: return { icon: Bell, color: 'bg-gray-100', iconColor: 'text-gray-600' };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              className="text-[#0c80c3] text-sm font-medium"
              whileTap={{ scale: 0.95 }}
              onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
            >
              Tout marquer lu
            </motion.button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="p-5">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const { icon: Icon, color, iconColor } = getNotificationIcon(notification.type);
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-4 shadow-sm ${
                    !notification.read ? 'border-l-4 border-[#0c80c3]' : ''
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-semibold text-gray-800 ${!notification.read ? 'text-[#0c80c3]' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#0c80c3] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
