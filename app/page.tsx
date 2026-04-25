'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from '@/lib/app-context';
import { Event } from '@/lib/data';
import { SplashScreen } from '@/components/gameflow/splash-screen';
import { BottomNav, TabType } from '@/components/gameflow/bottom-nav';
import { HomeScreen } from '@/components/gameflow/screens/home-screen';
const EventsScreen = dynamic(() => import('@/components/gameflow/screens/events-screen').then((m) => m.EventsScreen));
const MapScreen = dynamic(() => import('@/components/gameflow/screens/map-screen').then((m) => m.MapScreen));
const LiveScreen = dynamic(() => import('@/components/gameflow/screens/live-screen').then((m) => m.LiveScreen));
const AssistantScreen = dynamic(() => import('@/components/gameflow/screens/assistant-screen').then((m) => m.AssistantScreen));
const ProfileScreen = dynamic(() => import('@/components/gameflow/screens/profile-screen').then((m) => m.ProfileScreen));
const AuthScreen = dynamic(() => import('@/components/gameflow/screens/auth-screen').then((m) => m.AuthScreen));
const EventDetailScreen = dynamic(() => import('@/components/gameflow/screens/event-detail-screen').then((m) => m.EventDetailScreen));
const PaymentScreen = dynamic(() => import('@/components/gameflow/screens/payment-screen').then((m) => m.PaymentScreen));
const NotificationsScreen = dynamic(() => import('@/components/gameflow/screens/notifications-screen').then((m) => m.NotificationsScreen));
const GamificationScreen = dynamic(() => import('@/components/gameflow/screens/gamification-screen').then((m) => m.GamificationScreen));
const SOSScreen = dynamic(() => import('@/components/gameflow/screens/sos-screen').then((m) => m.SOSScreen));

type OverlayScreen = 'none' | 'eventDetail' | 'payment' | 'notifications' | 'gamification' | 'sos';

function GameFlowApp() {
  const { isAuthenticated, isLoading, logout, t } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreen>('none');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOverlayScreen('eventDetail');
  };

  const handleBuyTicket = () => {
    setOverlayScreen('payment');
  };

  const handleCloseOverlay = () => {
    setOverlayScreen('none');
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    logout();
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c80c3] to-[#09a552] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => {}} />;
  }

  // Render overlay screens
  if (overlayScreen !== 'none') {
    return (
      <AnimatePresence mode="wait">
        {overlayScreen === 'eventDetail' && selectedEvent && (
          <EventDetailScreen
            event={selectedEvent}
            onBack={handleCloseOverlay}
            onBuyTicket={handleBuyTicket}
          />
        )}
        {overlayScreen === 'payment' && (
          <PaymentScreen
            onBack={handleCloseOverlay}
            amount={selectedEvent ? 15000 : undefined}
            title={selectedEvent?.title}
          />
        )}
        {overlayScreen === 'notifications' && (
          <NotificationsScreen onBack={handleCloseOverlay} />
        )}
        {overlayScreen === 'gamification' && (
          <GamificationScreen onBack={handleCloseOverlay} />
        )}
        {overlayScreen === 'sos' && (
          <SOSScreen onBack={handleCloseOverlay} />
        )}
      </AnimatePresence>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <HomeScreen
            key="home"
            onNavigate={setActiveTab}
            onEventClick={handleEventClick}
            onNotificationsClick={() => setOverlayScreen('notifications')}
          />
        )}
        {activeTab === 'events' && (
          <EventsScreen
            key="events"
            onEventClick={handleEventClick}
          />
        )}
        {activeTab === 'map' && (
          <MapScreen key="map" />
        )}
        {activeTab === 'live' && (
          <LiveScreen key="live" />
        )}
        {activeTab === 'assistant' && (
          <AssistantScreen key="assistant" />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            key="profile"
            onLogout={handleLogout}
            onPaymentClick={() => setOverlayScreen('payment')}
            onGamificationClick={() => setOverlayScreen('gamification')}
            onNotificationsClick={() => setOverlayScreen('notifications')}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating SOS Button */}
      <button
        onClick={() => setOverlayScreen('sos')}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 bg-red-500 rounded-full shadow-lg flex items-center justify-center animate-pulse"
      >
        <span className="text-white font-bold text-sm">SOS</span>
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <GameFlowApp />
    </AppProvider>
  );
}
