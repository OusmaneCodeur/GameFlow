'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Shield, Heart, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';

interface SOSScreenProps {
  onBack: () => void;
}

export function SOSScreen({ onBack }: SOSScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const emergencyContacts = [
    { name: 'Urgences JOJ', number: '800-JOJ-SOS', icon: Shield, color: 'bg-red-500' },
    { name: 'Police', number: '17', icon: Shield, color: 'bg-blue-600' },
    { name: 'SAMU', number: '15', icon: Heart, color: 'bg-red-600' },
    { name: 'Pompiers', number: '18', icon: AlertTriangle, color: 'bg-orange-500' },
  ];

  const handleSOS = () => {
    setShowConfirm(false);
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <motion.div 
      className="min-h-screen bg-red-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-red-500 pt-12 pb-6 px-5">
        <div className="flex items-center gap-4">
          <motion.button
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-white">Urgence & Sécurité</h1>
            <p className="text-red-100 text-sm">Assistance rapide</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* SOS Button */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-gray-600 mb-4">En cas d&apos;urgence, appuyez sur le bouton</p>
          
          <motion.button
            onClick={() => setShowConfirm(true)}
            className="relative w-40 h-40 mx-auto block"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-red-200 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-4 bg-red-300 rounded-full"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <div className="absolute inset-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">SOS</span>
            </div>
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Votre position sera partagée avec les secours
          </p>
        </motion.div>

        {/* Alert sent notification */}
        {alertSent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-green-100 rounded-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Alerte envoyée!</p>
              <p className="text-sm text-green-600">Les secours ont été notifiés</p>
            </div>
          </motion.div>
        )}

        {/* Location */}
        <motion.div 
          className="mt-6 bg-white rounded-xl p-4 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Votre position</p>
              <p className="text-sm text-gray-500">Stade Abdoulaye Wade, Diamniadio</p>
            </div>
          </div>
        </motion.div>

        {/* Emergency contacts */}
        <h3 className="font-bold text-gray-800 mt-6 mb-3">Numéros d&apos;urgence</h3>
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={`tel:${contact.number}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center`}>
                <contact.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.number}</p>
              </div>
              <Phone className="w-5 h-5 text-gray-400" />
            </motion.a>
          ))}
        </div>

        {/* Safety tips */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Conseils de sécurité</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Gardez toujours votre téléphone chargé</li>
            <li>• Notez les points de rassemblement</li>
            <li>• Suivez les instructions du personnel</li>
            <li>• En cas de foule, restez calme</li>
          </ul>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <button onClick={() => setShowConfirm(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Confirmer l&apos;alerte SOS ?</h3>
            <p className="text-gray-500 mt-2">
              Cette action enverra votre position aux services d&apos;urgence JOJ.
            </p>
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
              <motion.button
                onClick={handleSOS}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                Confirmer SOS
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
