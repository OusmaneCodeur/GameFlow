'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Mic, MapPin, Calendar, Trophy, HelpCircle, History } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { quickSuggestions } from '@/lib/data';
import { detectLanguage, Language } from '@/lib/i18n';
import { useApp } from '@/lib/app-context';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const aiResponses: Record<string, string> = {
  "Que faire aujourd'hui ?": "Aujourd'hui, je vous recommande:\n\n🏀 Basketball 3x3 à 15h30 - Arena Dakar\n⚽ Finale Football à 18h00 - Stade Abdoulaye Wade\n🎤 Show Breakdance à 20h00 - Place centrale\n\nVoulez-vous que je vous guide vers l'un de ces événements?",
  "Comment aller au stade ?": "Pour aller au Stade Abdoulaye Wade:\n\n🚆 TER depuis Dakar: 25 min (5€)\n🚌 Bus navette JOJ: 35 min (gratuit)\n🚗 Taxi: 20 min (~15€)\n\nJe recommande le TER pour éviter les embouteillages. Voulez-vous voir l'itinéraire sur la carte?",
  "Prochains matchs du Sénégal": "Les Lions sont en feu! 🇸🇳\n\n⚽ Finale Football vs Brésil\n📅 Aujourd'hui à 18h00\n📍 Stade Abdoulaye Wade\n\n🏀 Basketball vs Nigeria\n📅 Demain à 16h00\n📍 Arena Dakar\n\nVoulez-vous des billets ou activer un rappel?",
  "Restaurants à proximité": "Voici les meilleures options à proximité:\n\n🍽️ Village Gastronomique JOJ\n   └ Cuisine sénégalaise • 200m\n\n🌍 Food Court International\n   └ Cuisine mondiale • 350m\n\n🥗 Teranga Café\n   └ Healthy & Fresh • 500m\n\nTous acceptent le paiement mobile!",
  "Programme de demain": "Programme du 26 Octobre:\n\n🏃 10h00 - Finale 100m Athlétisme\n🏊 14h00 - 200m Nage libre\n🏀 16h00 - Basketball Sénégal vs Nigeria\n⚽ 18h00 - Match 3ème place Football\n\nSouhaitez-vous ajouter ces événements à votre calendrier?",
  "Billets disponibles": "Billets disponibles:\n\n🎫 Finale Football - 15,000 FCFA\n   └ Places VIP encore disponibles!\n\n🎫 Breakdance - 8,000 FCFA\n   └ Dernières places!\n\n🎫 Athlétisme - 10,000 FCFA\n   └ Bon stock\n\nVoulez-vous réserver maintenant?",
};

const multilingualFallback: Record<Language, string> = {
  fr: "Je comprends votre demande. Je peux vous aider sur les evenements, lieux, horaires et transports. Voulez-vous des suggestions personnalisees ?",
  en: "I can help with events, venues, schedules and transport. Would you like upcoming match suggestions?",
  wo: "Maa ngi man la dimbali ci xew-xew yi, barab yi, waxtu yi ak yoon yi. Ndax nga bëgg ma digal la li ngay seetaan?",
};

export function AssistantScreen() {
  const { t, language, events } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: "Bonjour! 👋 Je suis votre assistant GameFlow. Comment puis-je vous aider a profiter au maximum des JOJ Senegal 2026?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('gameflow_chat_history');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Message[];
      if (parsed.length > 0) {
        setMessages(parsed.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
      }
    } catch {
      // Ignore invalid local cache
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('gameflow_chat_history', JSON.stringify(messages));
  }, [messages]);

  const buildDynamicSuggestions = (lang: Language): string[] => {
    const nextMatches = events.slice(0, 3).map((event) => `${event.sport} - ${event.time}`);
    const defaults: Record<Language, string[]> = {
      fr: ['Quels matchs cette semaine ?', 'Comment aller a Arena Dakar ?', 'Evenements populaires aujourd hui'],
      en: ['What matches are coming up?', 'How do I get to Arena Dakar?', 'Popular events today'],
      wo: ['Yan match la ñu am ay?', 'Naka laa dem Arena Dakar?', 'Xew-xew yu siiw tey'],
    };
    return [...defaults[lang], ...nextMatches];
  };

  const resolveResponse = (text: string): string => {
    const detected = detectLanguage(text);
    const lowered = text.toLowerCase();
    const direct = aiResponses[text];
    if (direct) return direct;

    if (lowered.includes('match') || lowered.includes('event') || lowered.includes('xew')) {
      const top = events.slice(0, 3);
      if (detected === 'en') {
        return `Upcoming highlights:\n\n${top.map((e) => `- ${e.title} (${e.date} ${e.time}) at ${e.venue}`).join('\n')}\n\nWant me to set reminders?`;
      }
      if (detected === 'wo') {
        return `Xew-xew yu dikk:\n\n${top.map((e) => `- ${e.title} (${e.date} ${e.time}) ci ${e.venue}`).join('\n')}\n\nNdax ma toggal la rappel yi?`;
      }
      return `Matchs a venir:\n\n${top.map((e) => `- ${e.title} (${e.date} ${e.time}) a ${e.venue}`).join('\n')}\n\nVoulez-vous activer des rappels ?`;
    }

    if (lowered.includes('transport') || lowered.includes('aller') || lowered.includes('get')) {
      return detected === 'en'
        ? 'Best routes: TER (fast), JOJ shuttle (free), or taxi. Tell me your destination for exact travel time.'
        : detected === 'wo'
          ? 'Yoon yi gën a baax: TER, navette JOJ, wala taxi. Wax ma fu ngay dem ngir ma jox la waxtu bu leer.'
          : 'Trajets conseilles: TER (rapide), navette JOJ (gratuite), ou taxi. Donnez votre destination pour un temps precis.';
    }

    return multilingualFallback[detected];
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = resolveResponse(text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <motion.div 
      className="h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 pt-12 pb-6 px-5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-purple-500" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('assistant.title')}</h1>
            <p className="text-purple-200 text-sm">{t('assistant.subtitle')}</p>
          </div>
          <button onClick={() => setShowHistory((v) => !v)} className="ml-auto w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="px-5 py-3 bg-purple-50 border-b border-purple-100">
          <p className="text-sm font-semibold text-purple-700 mb-1">{t('assistant.history')}</p>
          <p className="text-xs text-purple-600">
            {messages.length > 1 ? `${messages.length} messages` : t('assistant.emptyHistory')}
          </p>
        </div>
      )}

      {/* Quick suggestions (when no messages) */}
      {messages.length <= 1 && (
        <div className="px-5 py-4">
          <p className="text-sm text-gray-500 mb-3">{t('assistant.quickSuggestions')}</p>
          <div className="flex flex-wrap gap-2">
            {[...quickSuggestions.slice(0, 3), ...buildDynamicSuggestions(language).slice(0, 3)].map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm border border-gray-100"
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${
                message.type === 'user'
                  ? 'bg-[#0c80c3] text-white rounded-2xl rounded-br-md'
                  : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
              } px-4 py-3`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    </div>
                    <span className="text-xs font-medium text-purple-500">{t('assistant.name')}</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <motion.span
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {messages.length > 1 && (
        <div className="px-5 py-2 flex gap-2 overflow-x-auto">
          {[
            { icon: MapPin, label: 'Carte' },
            { icon: Calendar, label: 'Événements' },
            { icon: Trophy, label: 'Scores' },
            { icon: HelpCircle, label: 'Aide' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100 whitespace-nowrap"
              whileTap={{ scale: 0.95 }}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-5 pb-24 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder={t('assistant.placeholder')}
              className="w-full px-5 py-4 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <motion.button
            className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5 text-gray-500" />
          </motion.button>
          <motion.button
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              inputValue.trim() ? 'bg-purple-500' : 'bg-gray-200'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(inputValue)}
          >
            <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : 'text-gray-400'}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
