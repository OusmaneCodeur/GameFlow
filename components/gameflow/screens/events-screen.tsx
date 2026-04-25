'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Clock, Heart, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Event, sportsList } from '@/lib/data';

interface EventsScreenProps {
  onEventClick: (event: Event) => void;
}

export function EventsScreen({ onEventClick }: EventsScreenProps) {
  const { events, user, toggleFavorite, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.sport.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !selectedSport || event.sport === selectedSport;
    const matchesDate = !selectedDate || event.date === selectedDate;
    const matchesLocation = !selectedLocation || event.location.toLowerCase() === selectedLocation.toLowerCase();
    return matchesSearch && matchesSport && matchesDate && matchesLocation;
  });

  const availableDates = Array.from(new Set(events.map((event) => event.date)));
  const availableLocations = Array.from(new Set(events.map((event) => event.location)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">{t('events.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('events.subtitle')}</p>
        
        {/* Search */}
        <div className="mt-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('events.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
            />
          </div>
          <motion.button
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              showFilters ? 'bg-[#0c80c3] text-white' : 'bg-gray-100 text-gray-600'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Filter Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <p className="text-sm text-gray-500 mb-2">{t('events.filterBySport')}</p>
              <div className="flex flex-wrap gap-2">
                {sportsList.map((sport) => (
                  <motion.button
                    key={sport}
                    onClick={() => setSelectedSport(selectedSport === sport ? null : sport)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSport === sport
                        ? 'bg-[#0c80c3] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {sport}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">{t('events.filterByDate')}</option>
                  {availableDates.map((date) => <option key={date} value={date}>{date}</option>)}
                </select>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">
                  <option value="">{t('events.filterByLocation')}</option>
                  {availableLocations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter badge */}
        {selectedSport && (
          <motion.div 
            className="mt-3 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-sm text-gray-500">{t('events.activeFilter')}</span>
            <span className="flex items-center gap-1 px-3 py-1 bg-[#0c80c3]/10 text-[#0c80c3] rounded-full text-sm font-medium">
              {selectedSport}
              <button onClick={() => setSelectedSport(null)}>
                <X className="w-4 h-4" />
              </button>
            </span>
          </motion.div>
        )}
      </div>

      {/* Events List */}
      <motion.div 
        className="px-5 py-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('events.none')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const isFavorite = user?.favorites.includes(event.id);
              
              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div 
                    className="p-4"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex gap-4">
                      {/* Event Image */}
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#0c80c3] to-[#09a552] flex items-center justify-center flex-shrink-0 relative">
                        <span className="text-4xl">{
                          event.sport === 'Football' ? '⚽' :
                          event.sport === 'Basketball' ? '🏀' :
                          event.sport === 'Breaking' ? '🎤' :
                          event.sport === 'Athlétisme' ? '🏃' :
                          event.sport === 'Natation' ? '🏊' :
                          event.sport === 'Beach Volley' ? '🏐' : '🎯'
                        }</span>
                        {event.isLive && (
                          <motion.div 
                            className="absolute top-1 left-1 px-2 py-0.5 bg-red-500 rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <span className="text-white text-[10px] font-bold">LIVE</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 bg-[#0c80c3]/10 text-[#0c80c3] text-xs font-medium rounded-full mb-2">
                              {event.sport}
                            </span>
                            <h3 className="font-bold text-gray-800 truncate">{event.title}</h3>
                          </div>
                          <motion.button
                            className="ml-2 p-2"
                            title={isFavorite ? t('events.removeFromFavorites') : t('events.addToFavorites')}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(event.id);
                            }}
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                isFavorite 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          </motion.button>
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="mt-2 flex items-center gap-1">
                          {event.participants.slice(0, 3).map((p, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {p}
                            </span>
                          ))}
                          {event.participants.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{event.participants.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
