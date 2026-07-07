'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BarChart3, Phone, Globe } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const TITLES: Record<string, { title: string; subtitle: string; submit: string; dashboard: string; ivr: string; changeLang: string }> = {
  en: { title: 'JanSankalp', subtitle: 'AI-powered platform for citizen development requests and constituency planning', submit: 'Submit Request', dashboard: 'MP Dashboard', ivr: 'IVR Complaint', changeLang: 'Change Language' },
  hi: { title: 'जनसंकल्प', subtitle: 'नागरिक विकास अनुरोधों और संसदीय नियोजन के लिए AI-संचालित मंच', submit: 'अनुरोध सबमिट करें', dashboard: 'सांसद डैशबोर्ड', ivr: 'IVR शिकायत', changeLang: 'भाषा बदलें' },
  ta: { title: 'ஜன்சங்கல்ப்', subtitle: 'குடிமக்கள் மேம்பாட்டு கோரிக்கைகள் மற்றும் தொகுதி திட்டமிடலுக்கான AI இயங்குதளம்', submit: 'கோரிக்கை சமர்ப்பிக்கவும்', dashboard: 'எம்.பி. டாஷ்போர்டு', ivr: 'IVR புகார்', changeLang: 'மொழியை மாற்று' },
  te: { title: 'జన్\u200cసంకల్ప్', subtitle: 'పౌర అభివృద్ధి అభ్యర్థనలు మరియు నియోజకవర్గ ప్రణాళిక కోసం AI-శక్తితో కూడిన వేదిక', submit: 'అభ్యర్థన సమర్పించు', dashboard: 'ఎంపీ డాష్\u200cబోర్డ్', ivr: 'IVR ఫిర్యాదు', changeLang: 'భాష మార్చు' },
  kn: { title: 'ಜನಸಂಕಲ್ಪ', subtitle: 'ನಾಗರಿಕ ಅಭಿವೃದ್ಧಿ ವಿನಂತಿಗಳು ಮತ್ತು ಕ್ಷೇತ್ರ ಯೋಜನೆಗೆ AI-ಆಧಾರಿತ ವೇದಿಕೆ', submit: 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ', dashboard: 'ಸಂಸದ ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್', ivr: 'IVR ದೂರು', changeLang: 'ಭಾಷೆ ಬದಲಿಸಿ' },
  ml: { title: 'ജൻസംകൽപ്പ്', subtitle: 'പൗര വികസന അഭ്യർത്ഥനകൾക്കും മണ്ഡല ആസൂത്രണത്തിനുമുള്ള AI-പവർഡ് പ്ലാറ്റ്ഫോം', submit: 'അഭ്യർത്ഥന സമർപ്പിക്കുക', dashboard: 'എംപി ഡാഷ്\u200cബോർഡ്', ivr: 'IVR പരാതി', changeLang: 'ഭാഷ മാറ്റുക' },
  mr: { title: 'जनसंकल्प', subtitle: 'नागरिक विकास विनंत्या आणि मतदारसंघ नियोजनासाठी AI-संचालित व्यासपीठ', submit: 'विनंती सबमिट करा', dashboard: 'सांसद डॅशबोर्ड', ivr: 'IVR तक्रार', changeLang: 'भाषा बदला' },
  gu: { title: 'જનસંકલ્પ', subtitle: 'નાગરિક વિકાસ વિનંતીઓ અને મતવિસ્તાર આયોજન માટે AI-સંચાલિત પ્લેટફોર્મ', submit: 'વિનંતી સબમિટ કરો', dashboard: 'સાંસદ ડેશબોર્ડ', ivr: 'IVR ફરિયાદ', changeLang: 'ભાષા બદલો' },
  bn: { title: 'জনসংকল্প', subtitle: 'নাগরিক উন্নয়ন অনুরোধ এবং নির্বাচনী পরিকল্পনার জন্য AI-চালিত প্ল্যাটফর্ম', submit: 'অনুরোধ জমা দিন', dashboard: 'সাংসদ ড্যাশবোর্ড', ivr: 'IVR অভিযোগ', changeLang: 'ভাষা পরিবর্তন' },
  or: { title: 'ଜନସଂକଳ୍ପ', subtitle: 'ନାଗରିକ ବିକାଶ ଅନୁରୋଧ ଏବଂ ନିର୍ବାଚନୀ ଯୋଜନା ପାଇଁ AI-ଚାଳିତ ପ୍ଲାଟଫର୍ମ', submit: 'ଅନୁରୋଧ ଦାଖଲ କରନ୍ତୁ', dashboard: 'ସାଂସଦ ଡ୍ୟାଶବୋର୍ଡ', ivr: 'IVR ଅଭିଯୋଗ', changeLang: 'ଭାଷା ପରିବର୍ତ୍ତନ' },
  pa: { title: 'ਜਨਸੰਕਲਪ', subtitle: 'ਨਾਗਰਿਕ ਵਿਕਾਸ ਬੇਨਤੀਆਂ ਅਤੇ ਹਲਕਾ ਯੋਜਨਾ ਲਈ AI-ਸੰਚਾਲਿਤ ਪਲੇਟਫਾਰਮ', submit: 'ਬੇਨਤੀ ਜਮ੍ਹਾ ਕਰੋ', dashboard: 'ਸਾਂਸਦ ਡੈਸ਼ਬੋਰਡ', ivr: 'IVR ਸ਼ਿਕਾਇਤ', changeLang: 'ਭਾਸ਼ਾ ਬਦਲੋ' },
  as: { title: 'জনসংকল্প', subtitle: 'নাগৰিক উন্নয়ন অনুৰোধ আৰু নিৰ্বাচনী পৰিকল্পনাৰ বাবে AI-চালিত প্লাটফৰ্ম', submit: 'অনুৰোধ দাখিল কৰক', dashboard: 'সাংসদ ডেশ্বৰ্ড', ivr: 'IVR অভিযোগ', changeLang: 'ভাষা সলনি কৰক' },
};

export default function LocalePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-lang') || 'en';
    setLang(saved);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const t = TITLES[lang] || TITLES.en;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--accent-primary)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'var(--accent-secondary)' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
          style={{ background: 'var(--accent-primary)' }} />
      </div>
      <div className="absolute inset-0 noise-overlay" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 py-4">
        <button
          onClick={() => { localStorage.removeItem('jansankalp-lang'); router.replace('/'); }}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
            <span className="text-white font-bold text-xs">JS</span>
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>JanSankalp</span>
        </div>
        <ThemeSwitcher />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl shadow-2xl mb-8 animate-float"
          style={{ background: 'var(--accent-gradient)', boxShadow: '0 12px 40px rgba(59, 130, 246, 0.3)' }}>
          <span className="text-white font-black text-4xl tracking-tight">JS</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black mb-4 tracking-tight animate-fade-in" style={{ color: 'var(--text-primary)' }}>
          {lang === 'en' ? (
            <>Jan<span className="gradient-text">Sankalp</span></>
          ) : t.title}
        </h1>
        <p className="text-lg sm:text-xl max-w-lg mx-auto mb-14 animate-slide-up" style={{ color: 'var(--text-secondary)' }}>
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-children">
          <button
            onClick={() => router.push(`/${lang}/submit`)}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            style={{ background: 'var(--accent-gradient)', color: 'white', boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)' }}
          >
            {t.submit}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push(`/${lang}/dashboard`)}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <BarChart3 className="w-5 h-5" />
            {t.dashboard}
          </button>

          <button
            onClick={() => router.push('/ivr')}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <Phone className="w-5 h-5" />
            {t.ivr}
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 stagger-children">
          {['12 Languages', 'AI Analysis', 'Real-time Tracking', 'Voice Input'].map((feat, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
              <Globe className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              {feat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
