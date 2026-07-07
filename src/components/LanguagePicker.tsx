'use client';

import { useState } from 'react';
import { Globe, ChevronRight, Users, MapPin, BarChart3, Sparkles } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', script: 'A-Z', color: 'from-blue-500 to-blue-600' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', script: 'क-ज्ञ', color: 'from-orange-500 to-red-500' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', script: 'அ-ஹ', color: 'from-red-500 to-pink-500' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', script: 'అ-క్ష', color: 'from-yellow-500 to-orange-500' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', script: 'ಅ-ಜ್ಞ', color: 'from-red-600 to-red-700' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', script: 'അ-ജ', color: 'from-green-500 to-emerald-600' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', script: 'अ-ज्ञ', color: 'from-orange-600 to-amber-600' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', script: 'અ-જ્ઞ', color: 'from-blue-600 to-indigo-600' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', script: 'অ-য়', color: 'from-green-600 to-teal-600' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', script: 'ଅ-ଜ୍ଞ', color: 'from-purple-500 to-violet-600' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', script: 'ਅ-ਜ੍ਞ', color: 'from-amber-500 to-orange-500' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', script: 'অ-জ্ঞ', color: 'from-teal-500 to-cyan-600' },
];

const FEATURES = [
  { icon: Users, en: 'Submit Requests', hi: 'अनुरोध भेजें' },
  { icon: MapPin, en: 'See Hotspots', hi: 'हॉटस्पॉट देखें' },
  { icon: BarChart3, en: 'MP Dashboard', hi: 'सांसद डैशबोर्ड' },
];

interface LanguagePickerProps {
  onSelect: (lang: string) => void;
}

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (code: string) => {
    setSelected(code);
    localStorage.setItem('jansankalp-lang', code);
    setTimeout(() => onSelect(code), 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'var(--accent-primary)' }} />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15"
            style={{ background: 'var(--accent-secondary)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
            style={{ background: 'var(--accent-primary)' }} />
        </div>

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-20">
          {/* Logo */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl mb-6"
              style={{ background: 'var(--accent-gradient)', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)' }}>
              <span className="text-white font-black text-3xl tracking-tight">JS</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Jan<span className="gradient-text">Sankalp</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
              AI-powered citizen development platform for your constituency
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 stagger-children">
            {FEATURES.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                <feat.icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-medium">{feat.en}</span>
              </div>
            ))}
          </div>

          {/* Language Selection Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
              <Globe className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Choose Your Language</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              अपनी भाषा चुनें
            </h2>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Select the language you're most comfortable with
            </p>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto stagger-children">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                onMouseEnter={() => setHovered(lang.code)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 transform ${
                  selected === lang.code
                    ? 'scale-95 ring-4 ring-white shadow-2xl'
                    : hovered === lang.code
                    ? 'scale-105 shadow-xl -translate-y-1'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-90`} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl font-black text-white mb-2 leading-none">
                    {lang.script}
                  </div>
                  <div className="text-lg font-bold text-white/95 mb-0.5">
                    {lang.native}
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    {lang.label}
                  </div>
                </div>

                {selected === lang.code && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                <div className={`absolute bottom-3 right-3 transition-all duration-300 ${
                  hovered === lang.code || selected === lang.code ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  <ChevronRight className="w-5 h-5 text-white/80" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <p>AI-powered constituency development platform</p>
            <p className="mt-1">Built for India's diverse linguistic landscape</p>
          </div>
        </div>
      </div>
    </div>
  );
}
