'use client';

import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { SubmissionForm } from '@/components/SubmissionForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
    setLang(code);
    setShowLangs(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">JS</span>
              </div>
              <span className="font-bold text-gray-900">JanSankalp</span>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowLangs(!showLangs)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
              <Globe className="w-4 h-4" />
              <span>{LANGS.find(l => l.code === lang)?.native || 'English'}</span>
            </button>
            {showLangs && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 grid grid-cols-3 gap-1 w-72">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => switchLang(l.code)} className={`px-3 py-2 rounded-lg text-sm text-left hover:bg-blue-50 ${lang === l.code ? 'bg-blue-100 font-semibold' : ''}`}>
                    {l.native}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{TITLES[lang] || TITLES.en}</h1>
          <p className="text-gray-500 text-sm">{SUBTITLES[lang] || SUBTITLES.en}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7">
          <SubmissionForm />
        </div>
      </main>
    </div>
  );
}