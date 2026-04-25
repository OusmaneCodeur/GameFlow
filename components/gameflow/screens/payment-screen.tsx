'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Check, X, Clock, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/app-context';

interface PaymentScreenProps {
  onBack: () => void;
  amount?: number;
  title?: string;
}

type PaymentMethod = 'orange' | 'wave' | 'free';
type PaymentStep = 'method' | 'confirm' | 'processing' | 'success' | 'history';

export function PaymentScreen({ onBack, amount = 15000, title = 'Billet JOJ' }: PaymentScreenProps) {
  const { transactions, addPoints } = useApp();
  const [step, setStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');

  const paymentMethods = [
    { id: 'orange' as const, name: 'Orange Money', color: 'bg-orange-500', icon: '🟠' },
    { id: 'wave' as const, name: 'Wave', color: 'bg-blue-500', icon: '🌊' },
    { id: 'free' as const, name: 'Free Money', color: 'bg-green-600', icon: '💚' },
  ];

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      addPoints(100);
    }, 2500);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <motion.button
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Paiement</h1>
            <p className="text-sm text-gray-500">Mobile Money</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setStep('method')}
            className={`flex-1 py-3 rounded-xl font-medium text-sm ${
              step !== 'history' ? 'bg-[#0c80c3] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Nouveau paiement
          </button>
          <button
            onClick={() => setStep('history')}
            className={`flex-1 py-3 rounded-xl font-medium text-sm ${
              step === 'history' ? 'bg-[#0c80c3] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Historique
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'history' ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5"
          >
            <h3 className="font-semibold text-gray-700 mb-4">Transactions récentes</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">Aucune transaction</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.status === 'completed' ? 'bg-green-100' :
                          tx.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {tx.status === 'completed' ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : tx.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{tx.title}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${
                        tx.status === 'completed' ? 'text-green-600' : 'text-gray-800'
                      }`}>
                        {tx.amount.toLocaleString()} F
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : step === 'method' ? (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5"
          >
            {/* Amount */}
            <div className="bg-gradient-to-br from-[#0c80c3] to-[#09a552] rounded-2xl p-6 text-center">
              <p className="text-white/80 text-sm">Montant à payer</p>
              <p className="text-4xl font-bold text-white mt-2">{amount.toLocaleString()} <span className="text-lg">FCFA</span></p>
              <p className="text-white/60 text-sm mt-2">{title}</p>
            </div>

            {/* Payment methods */}
            <h3 className="font-semibold text-gray-700 mt-6 mb-4">Choisir le mode de paiement</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-xl flex items-center gap-4 border-2 transition-colors ${
                    selectedMethod === method.id
                      ? 'border-[#0c80c3] bg-[#0c80c3]/5'
                      : 'border-gray-200 bg-white'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                    <span className="text-2xl">{method.icon}</span>
                  </div>
                  <span className="font-medium text-gray-800">{method.name}</span>
                  {selectedMethod === method.id && (
                    <Check className="w-5 h-5 text-[#0c80c3] ml-auto" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Phone input */}
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                <label className="text-sm font-medium text-gray-700 mb-2 block">Numéro de téléphone</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 XXX XXXX"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0c80c3]/20"
                  />
                </div>
              </motion.div>
            )}

            {/* Continue button */}
            <motion.button
              onClick={() => setStep('confirm')}
              disabled={!selectedMethod || !phone}
              className="w-full mt-6 py-4 bg-[#0c80c3] text-white rounded-xl font-semibold disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              Continuer
            </motion.button>
          </motion.div>
        ) : step === 'confirm' ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-5"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Confirmer le paiement</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Article</span>
                  <span className="font-medium text-gray-800">{title}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Mode de paiement</span>
                  <span className="font-medium text-gray-800">
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Téléphone</span>
                  <span className="font-medium text-gray-800">{phone}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-xl text-[#0c80c3]">{amount.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={() => setStep('method')}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                Annuler
              </motion.button>
              <motion.button
                onClick={handlePayment}
                className="flex-1 py-4 bg-[#09a552] text-white rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                Confirmer
              </motion.button>
            </div>
          </motion.div>
        ) : step === 'processing' ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[60vh]"
          >
            <motion.div
              className="w-24 h-24 border-4 border-[#0c80c3]/20 border-t-[#0c80c3] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 mt-6 font-medium">Traitement en cours...</p>
            <p className="text-gray-400 text-sm mt-2">Veuillez confirmer sur votre téléphone</p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-[60vh] px-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-[#09a552] rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-800 mt-6"
            >
              Paiement réussi!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 mt-2 text-center"
            >
              Votre billet a été envoyé par SMS et email
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 px-4 py-2 bg-yellow-100 rounded-full"
            >
              <span className="text-yellow-700 font-medium">🎉 +100 points gagnés!</span>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onBack}
              className="mt-8 px-8 py-4 bg-[#0c80c3] text-white rounded-xl font-semibold"
              whileTap={{ scale: 0.98 }}
            >
              Retour à l'accueil
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
