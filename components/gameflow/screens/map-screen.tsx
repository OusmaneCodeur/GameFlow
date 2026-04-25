'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, X, Clock, Route, Building2, Train, Utensils, Cross, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { mockVenues, Venue } from '@/lib/data';
import { useApp } from '@/lib/app-context';
import Image from 'next/image';

export function MapScreen() {
  const { t } = useApp();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite' | 'hybrid'>('satellite');

  const filters = [
    { id: 'stadium', label: 'Stades', icon: Building2, color: '#0c80c3' },
    { id: 'transport', label: 'Transport', icon: Train, color: '#09a552' },
    { id: 'food', label: 'Restaurants', icon: Utensils, color: '#f59e0b' },
    { id: 'medical', label: 'Médical', icon: Cross, color: '#ef4444' },
  ];

  const filteredVenues = selectedFilter 
    ? mockVenues.filter(v => v.type === selectedFilter)
    : mockVenues;

  const getVenueIcon = (type: string) => {
    switch(type) {
      case 'stadium': return '🏟️';
      case 'transport': return '🚆';
      case 'food': return '🍽️';
      case 'medical': return '🏥';
      case 'service': return '📍';
      default: return '📍';
    }
  };

  const getVenueColor = (type: string) => {
    switch(type) {
      case 'stadium': return 'bg-[#0c80c3]';
      case 'transport': return 'bg-[#09a552]';
      case 'food': return 'bg-amber-500';
      case 'medical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const crowdLevels = ['low', 'medium', 'high'] as const;
  const getCrowdLevel = (id: string) => crowdLevels[Number(id) % crowdLevels.length];

  return (
    <motion.div 
      className="h-screen bg-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Map placeholder with gradient */}
      <div
        className={`absolute inset-0 ${
          mapMode === 'satellite'
            ? 'bg-[radial-gradient(circle_at_top,_#1f2937_0%,_#111827_35%,_#0f766e_100%)]'
            : mapMode === 'hybrid'
              ? 'bg-[linear-gradient(145deg,_#1e3a8a_0%,_#0f766e_45%,_#e5e7eb_100%)]'
              : 'bg-gradient-to-b from-blue-100 to-green-50'
        }`}
      >
        {/* Simulated map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0c80c3" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Venue markers */}
        {filteredVenues.map((venue, index) => (
          <motion.button
            key={venue.id}
            className={`absolute ${getVenueColor(venue.type)} w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white`}
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${25 + (index * 20) % 50}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedVenue(venue)}
          >
            <span className="text-xl">{getVenueIcon(venue.type)}</span>
          </motion.button>
        ))}

        {/* User location */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-6 bg-[#0c80c3] rounded-full border-4 border-white shadow-lg">
            <div className="absolute inset-0 bg-[#0c80c3] rounded-full animate-ping opacity-30" />
          </div>
        </motion.div>
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 pt-12 px-5 z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logoGameflow.jpeg"
                alt="GameFlow"
                width={28}
                height={28}
                className="rounded-full object-cover border border-gray-200"
              />
              <p className="text-sm font-semibold text-gray-800">GameFlow Map</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {[
                { id: 'standard', label: 'Standard' },
                { id: 'satellite', label: 'Satellite' },
                { id: 'hybrid', label: 'Hybride' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setMapMode(mode.id as 'standard' | 'satellite' | 'hybrid')}
                  className={`px-2.5 py-1 text-[11px] rounded-full transition ${
                    mapMode === mode.id ? 'bg-white text-[#0c80c3] shadow-sm font-semibold' : 'text-gray-600'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('map.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md whitespace-nowrap ${
                selectedFilter === filter.id 
                  ? 'bg-[#0c80c3] text-white' 
                  : 'bg-white text-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <filter.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Floating buttons */}
      <div className="absolute right-5 bottom-32 z-10 flex flex-col gap-3">
        <motion.button
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          <Navigation className="w-6 h-6 text-[#0c80c3]" />
        </motion.button>
        <motion.button
          className="w-14 h-14 bg-[#0c80c3] rounded-full shadow-lg flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          <MapPin className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Bottom sheet for venue details */}
      <AnimatePresence>
        {selectedVenue && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 pb-24"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${getVenueColor(selectedVenue.type)} rounded-2xl flex items-center justify-center`}>
                  <span className="text-3xl">{getVenueIcon(selectedVenue.type)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{selectedVenue.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{selectedVenue.address}</p>
                  {selectedVenue.description && (
                    <p className="text-gray-600 text-sm mt-2">{selectedVenue.description}</p>
                  )}
                </div>
              </div>

              {/* Distance & time */}
              <div className="flex items-center gap-6 mt-6 py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#0c80c3]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">1.2 km</p>
                    <p className="text-xs text-gray-500">{t('map.distance')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#09a552]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">15 min</p>
                    <p className="text-xs text-gray-500">{t('map.travelTime')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-500">{t('map.crowd')}</span>
                <span className="text-xs font-semibold text-gray-700">
                  {t(`map.${getCrowdLevel(selectedVenue.id)}`)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  className="flex-1 py-4 bg-[#0c80c3] text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDirections(true)}
                >
                  <Navigation className="w-5 h-5" />
                  Itinéraire
                </motion.button>
                <motion.button
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                  whileTap={{ scale: 0.98 }}
                >
                  Partager
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directions modal */}
      <AnimatePresence>
        {showDirections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 flex items-end"
            onClick={() => setShowDirections(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl p-6 pb-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Itinéraire</h3>
                <button onClick={() => setShowDirections(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#0c80c3] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dirigez-vous vers le nord</p>
                    <p className="text-sm text-gray-500">200m</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#0c80c3] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Tournez à droite sur Avenue JOJ</p>
                    <p className="text-sm text-gray-500">500m</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#09a552]/10 rounded-xl border-2 border-[#09a552]">
                  <div className="w-10 h-10 bg-[#09a552] rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Arrivée à destination</p>
                    <p className="text-sm text-[#09a552]">{selectedVenue?.name}</p>
                  </div>
                </div>
              </div>

              <motion.button
                className="w-full py-4 bg-[#09a552] text-white rounded-xl font-semibold mt-6 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Navigation className="w-5 h-5" />
                Démarrer la navigation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
