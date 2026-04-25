'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Clock, Calendar, Users, Bell, Ticket, Navigation } from 'lucide-react';
import { useState } from 'react';
import { Event } from '@/lib/data';
import { useApp } from '@/lib/app-context';

interface EventDetailScreenProps {
  event: Event;
  onBack: () => void;
  onBuyTicket: () => void;
}

export function EventDetailScreen({ event, onBack, onBuyTicket }: EventDetailScreenProps) {
  const { user, toggleFavorite } = useApp();
  const [reminderSet, setReminderSet] = useState(false);
  const isFavorite = user?.favorites.includes(event.id);

  const getSportEmoji = (sport: string) => {
    const emojis: Record<string, string> = {
      'Football': '⚽',
      'Basketball': '🏀',
      'Breaking': '🎤',
      'Athlétisme': '🏃',
      'Natation': '🏊',
      'Beach Volley': '🏐',
      'Handball': '🤾',
      'Judo': '🥋',
    };
    return emojis[sport] || '🏅';
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Image */}
      <div className="relative h-72">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c80c3] to-[#09a552]">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-8xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {getSportEmoji(event.sport)}
            </motion.span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Top actions */}
        <div className="absolute top-12 left-0 right-0 px-5 flex items-center justify-between">
          <motion.button
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div className="flex gap-3">
            <motion.button
              className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFavorite(event.id)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </motion.button>
          </div>
        </div>

        {/* Live badge */}
        {event.isLive && (
          <motion.div 
            className="absolute top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 rounded-full flex items-center gap-2"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="w-2 h-2 bg-white rounded-full" />
            <span className="text-white font-bold text-sm">EN DIRECT</span>
          </motion.div>
        )}

        {/* Event title */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {event.sport}
          </span>
          <h1 className="text-2xl font-bold text-white mt-3">{event.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 pb-32">
        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0c80c3]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0c80c3]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-800">{event.date}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#09a552]/10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#09a552]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Heure</p>
                <p className="font-semibold text-gray-800">{event.time}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Location */}
        <motion.div 
          className="mt-4 bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{event.venue}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            </div>
            <motion.button
              className="w-10 h-10 bg-[#0c80c3] rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Navigation className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold text-gray-800 mb-3">À propos</h3>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </motion.div>

        {/* Participants */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants
          </h3>
          <div className="flex flex-wrap gap-2">
            {event.participants.map((participant, index) => (
              <motion.span
                key={participant}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
              >
                {participant}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Reminder */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => setReminderSet(!reminderSet)}
            className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 font-medium ${
              reminderSet 
                ? 'bg-[#09a552]/10 text-[#09a552] border-2 border-[#09a552]' 
                : 'bg-gray-100 text-gray-700'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <Bell className={`w-5 h-5 ${reminderSet ? 'fill-[#09a552]/20' : ''}`} />
            {reminderSet ? 'Rappel activé' : 'Activer le rappel'}
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Prix du billet</p>
            <p className="text-2xl font-bold text-gray-800">15,000 <span className="text-sm font-normal">FCFA</span></p>
          </div>
          <motion.button
            onClick={onBuyTicket}
            className="flex-1 py-4 bg-gradient-to-r from-[#0c80c3] to-[#09a552] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Ticket className="w-5 h-5" />
            Acheter un billet
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
