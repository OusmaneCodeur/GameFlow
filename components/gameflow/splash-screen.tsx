'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0c80c3 0%, #09a552 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/10"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Official logo */}
        <motion.div 
          className="mb-6 relative"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/40 shadow-2xl">
            <Image src="/logoGameflow.jpeg" alt="GameFlow logo" width={96} height={96} className="w-full h-full object-cover" priority />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1 
          className="text-5xl font-extrabold text-white tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          GameFlow
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          className="text-white/90 text-lg mt-3 font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Vivez les JOJ autrement
        </motion.p>

        {/* JOJ Badge */}
        <motion.div
          className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
        >
          <p className="text-white text-sm font-semibold">🇸🇳 Sénégal 2026</p>
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <motion.div 
        className="absolute bottom-20 left-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/70 text-center text-sm mt-3">Chargement...</p>
      </motion.div>

      {/* Tech-Deal branding */}
      <motion.p 
        className="absolute bottom-6 text-white/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Développé par Tech-Deal
      </motion.p>
    </motion.div>
  );
}
