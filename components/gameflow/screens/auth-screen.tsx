'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/app-context';

interface AuthScreenProps {
  onSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'onboarding';

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const { login, register } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const sports = [
    { id: 'football', name: 'Football', emoji: '⚽' },
    { id: 'basketball', name: 'Basketball', emoji: '🏀' },
    { id: 'athletics', name: 'Athlétisme', emoji: '🏃' },
    { id: 'swimming', name: 'Natation', emoji: '🏊' },
    { id: 'breaking', name: 'Breaking', emoji: '🎤' },
    { id: 'volleyball', name: 'Volleyball', emoji: '🏐' },
    { id: 'handball', name: 'Handball', emoji: '🤾' },
    { id: 'judo', name: 'Judo', emoji: '🥋' },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      onSuccess();
    } else {
      setError('Email ou mot de passe incorrect');
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const success = await register(name, email, phone, password);
    if (success) {
      setMode('onboarding');
    } else {
      setError('Erreur lors de l\'inscription');
    }
    setIsLoading(false);
  };

  const handleOnboardingComplete = () => {
    onSuccess();
  };

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(s => s !== sportId)
        : [...prev, sportId]
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {mode === 'onboarding' ? (
          <OnboardingScreen 
            key="onboarding"
            sports={sports}
            selectedSports={selectedSports}
            onToggleSport={toggleSport}
            onComplete={handleOnboardingComplete}
          />
        ) : (
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0c80c3] to-[#09a552] pt-12 pb-16 px-5 relative overflow-hidden">
              <motion.div 
                className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {mode !== 'login' && (
                <motion.button
                  className="absolute top-12 left-5 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode('login')}
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
              )}

              <div className="text-center mt-8">
                <motion.h1 
                  className="text-3xl font-bold text-white"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                >
                  {mode === 'login' ? 'Connexion' : mode === 'register' ? 'Inscription' : 'Mot de passe oublié'}
                </motion.h1>
                <p className="text-white/80 mt-2">
                  {mode === 'login' 
                    ? 'Bienvenue sur GameFlow' 
                    : mode === 'register'
                    ? 'Créez votre compte JOJ'
                    : 'Récupérez votre accès'}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 -mt-8">
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                {error && (
                  <motion.div 
                    className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                {mode === 'register' && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+221 77 XXX XXXX"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
                      />
                    </div>
                  </div>
                )}

                {mode !== 'forgot' && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-[#0c80c3] text-sm font-medium mb-6 block"
                  >
                    Mot de passe oublié ?
                  </button>
                )}

                <motion.button
                  onClick={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : () => setMode('login')}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#0c80c3] to-[#09a552] text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      {mode === 'login' ? 'Se connecter' : mode === 'register' ? "S'inscrire" : 'Envoyer le lien'}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {mode === 'login' && (
                  <p className="text-center text-gray-500 text-sm mt-6">
                    Pas encore de compte ?{' '}
                    <button 
                      onClick={() => setMode('register')}
                      className="text-[#0c80c3] font-semibold"
                    >
                      S'inscrire
                    </button>
                  </p>
                )}

                {mode === 'register' && (
                  <p className="text-center text-gray-500 text-sm mt-6">
                    Déjà un compte ?{' '}
                    <button 
                      onClick={() => setMode('login')}
                      className="text-[#0c80c3] font-semibold"
                    >
                      Se connecter
                    </button>
                  </p>
                )}
              </motion.div>

              {/* Demo login hint */}
              <p className="text-center text-gray-400 text-xs mt-6">
                Pour tester, utilisez n'importe quel email et mot de passe
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface OnboardingScreenProps {
  sports: Array<{ id: string; name: string; emoji: string }>;
  selectedSports: string[];
  onToggleSport: (id: string) => void;
  onComplete: () => void;
}

function OnboardingScreen({ sports, selectedSports, onToggleSport, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Bienvenue sur GameFlow! 🎉',
      subtitle: 'Votre assistant personnel pour les JOJ Sénégal 2026',
      content: null,
    },
    {
      title: 'Vos sports préférés',
      subtitle: 'Sélectionnez pour personnaliser votre expérience',
      content: (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {sports.map((sport) => (
            <motion.button
              key={sport.id}
              onClick={() => onToggleSport(sport.id)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                selectedSports.includes(sport.id)
                  ? 'border-[#0c80c3] bg-[#0c80c3]/10'
                  : 'border-gray-200 bg-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl block mb-2">{sport.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{sport.name}</span>
            </motion.button>
          ))}
        </div>
      ),
    },
    {
      title: 'Vous êtes prêt! 🏆',
      subtitle: 'Profitez de l\'expérience JOJ comme jamais',
      content: null,
    },
  ];

  const currentStep = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0c80c3] to-[#09a552] flex flex-col items-center justify-center px-6"
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            {currentStep.title}
          </motion.h2>
          <p className="text-white/80 mt-2">{currentStep.subtitle}</p>
        </div>

        {currentStep.content && (
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            {currentStep.content}
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
          className="w-full mt-8 py-4 bg-white text-[#0c80c3] rounded-xl font-semibold flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          {step < steps.length - 1 ? 'Continuer' : 'Commencer'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {step > 0 && step < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full mt-4 py-3 text-white/80 font-medium text-sm"
          >
            Passer cette étape
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
