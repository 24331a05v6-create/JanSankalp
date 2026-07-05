'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
];

interface LanguagePickerProps {
  onSelect: (lang: string) => void;
}

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (code: string) => {
    setSelected(code);
    localStorage.setItem('jansankalp-lang', code);
    onSelect(code);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">JS</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">JanSankalp</h1>
        <p className="text-gray-500 mb-8 text-sm">Select your language / अपनी भाषा चुनें</p>

        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                selected === lang.code
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{lang.native}</div>
                <div className="text-xs text-gray-500">{lang.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}