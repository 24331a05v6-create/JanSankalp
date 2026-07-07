'use client';

import { ArrowLeft, Globe } from 'lucide-react';
import { SubmissionForm } from '@/components/SubmissionForm';
import { useState, useEffect } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const LANGS = [
  { code: 'en', native: 'English' }, { code: 'hi', native: 'हिन्दी' }, { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' }, { code: 'kn', native: 'ಕನ್ನಡ' }, { code: 'ml', native: 'മലയാളം' },
  { code: 'mr', native: 'मराठी' }, { code: 'gu', native: 'ગુજરાતી' }, { code: 'bn', native: 'বাংলা' },
  { code: 'or', native: 'ଓଡ଼ିଆ' }, { code: 'pa', native: 'ਪੰਜਾਬੀ' }, { code: 'as', native: 'অসমীয়া' },
];

const TITLES: Record<string, string> = {
  en: 'Submit Development Request', hi: 'विकास अनुरोध सबमिट करें', ta: 'மேம்பாட்டு கோரிக்கை',
  te: 'అభివృద్ధి అభ్యర్థన', kn: 'ಅಭಿವೃದ್ಧಿ ವಿನಂತಿ', ml: 'വികസന അഭ്യർത്ഥന',
  mr: 'विकास विनंती', gu: 'વિકાસ વિનંતી', bn: 'উন্নয়ন অনুরোধ',
  or: 'ବିକାଶ ଅନୁରୋଧ', pa: 'ਵਿਕਾਸ ਬੇਨਤੀ', as: 'উন্নয়ন অনুৰোধ',
};

const SUBTITLES: Record<string, string> = {
  en: 'Help your MP understand what your community needs',
  hi: 'अपने सांसद को समझने में मदद करें',
  ta: 'உங்கள் எம்.பி. உதவுங்கள்',
  te: 'మీ ఎంపీకి సహాయం చేయండి',
  kn: 'ನಿಮ್ಮ ಸಂಸದರಿಗೆ ಸಹಾಯ ಮಾಡಿ',
  ml: 'നിങ്ങളുടെ എംപിയെ സഹായിക്കുക',
  mr: 'तुमच्या सांसदाला मदत करा',
  gu: 'તમારા સાંસદને મદદ કરો',
  bn: 'আপনার সাংসদকে সাহায্য করুন',
  or: 'ଆପଣଙ୍କ ସାଂସଦଙ୍କୁ ସାହାଯ୍ୟ କରନ୍ତୁ',
  pa: 'ਆਪਣੇ ਸਾਂਸਦ ਦੀ ਮਦਦ ਕਰੋ',
  as: 'আপোনাৰ সাংসদক সহায় কৰক',
};

export default function SubmitPage() {
  const [showLangs, setShowLangs] = useState(false);
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-lang') || 'en';
    setLang(saved);
    setMounted(true);
  }, []);

  const switchLang = (code: string) => {
    localStorage.setItem('jansankalp-lang', code);
    window.location.href = `/${code}/submit`;
  };

  const goBack = () => {
    localStorage.removeItem('jansankalp-lang');
    window.location.href = '/';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-strong" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6" style={{ background: 'var(--border-primary)' }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white font-bold text-xs">JS</span>
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>JanSankalp</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowLangs(!showLangs)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                <Globe className="w-4 h-4" />
                <span>{LANGS.find(l => l.code === lang)?.native || 'English'}</span>
              </button>
              {showLangs && (
                <div className="absolute right-0 top-full mt-2 rounded-xl shadow-xl p-2 z-50 grid grid-cols-3 gap-1 w-72"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => switchLang(l.code)}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${lang === l.code ? 'font-semibold' : ''}`}
                      style={{
                        background: lang === l.code ? 'var(--accent-primary)' : 'transparent',
                        color: lang === l.code ? 'white' : 'var(--text-secondary)',
                      }}>
                      {l.native}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{TITLES[lang] || TITLES.en}</h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{SUBTITLES[lang] || SUBTITLES.en}</p>
        </div>
        <div className="card animate-slide-up" style={{ padding: '24px 28px' }}>
          <SubmissionForm />
        </div>
      </main>
    </div>
  );
}
