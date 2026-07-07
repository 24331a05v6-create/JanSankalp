'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { IVR_LANGUAGES, type IVRLanguage } from '@/lib/types';

interface LanguageSelectorProps {
  selectedLanguage: IVRLanguage | null;
  onSelect: (lang: IVRLanguage) => void;
}

export function LanguageSelector({ selectedLanguage, onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
          <span className="text-2xl">🌐</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Choose Your Language</h2>
        <p className="text-sm text-gray-400">Select your preferred language</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {IVR_LANGUAGES.map((lang, index) => {
          const isSelected = selectedLanguage === lang.value;
          return (
            <motion.button
              key={lang.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(lang.value)}
              className={`relative p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-2xl font-bold">{lang.shortcut}</span>
              <span className="text-sm font-medium">{lang.label}</span>
              <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {lang.nativeLabel}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-blue-600" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
