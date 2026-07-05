'use client';

import Link from 'next/link';
import { useTranslations, useMessages } from 'next-intl';
import { Languages, Mic, Image, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  const nav = useTranslations('nav');
  const messages = useMessages();

  const features = [
    { key: 'multilingual', icon: Languages, color: '#3B82F6', title: (messages as any)?.home?.features?.multilingual?.title || 'Multilingual Support', desc: (messages as any)?.home?.features?.multilingual?.desc || 'Submit in 12+ Indian languages' },
    { key: 'voice', icon: Mic, color: '#10B981', title: (messages as any)?.home?.features?.voice?.title || 'Voice Input', desc: (messages as any)?.home?.features?.voice?.desc || 'Speak your request in your language' },
    { key: 'photo', icon: Image, color: '#F59E0B', title: (messages as any)?.home?.features?.photo?.title || 'Photo & OCR', desc: (messages as any)?.home?.features?.photo?.desc || 'Upload photos of issues' },
    { key: 'ai', icon: Sparkles, color: '#8B5CF6', title: (messages as any)?.home?.features?.ai?.title || 'AI Prioritization', desc: (messages as any)?.home?.features?.ai?.desc || 'Smart clustering & urgency scoring' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JS</span>
          </div>
          <span className="font-bold text-xl text-gray-900">{nav('title')}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/en/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            {nav('dashboard')}
          </Link>
          <Link
            href="/en/submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {nav('submit')}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Constituency Development
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <Link
            href="/en/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200"
          >
            {t('hero.cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={feature.key} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">For MPs & Administrators</h2>
              <p className="text-blue-100 mb-6">
                AI-powered dashboard that consolidates citizen feedback, identifies recurring themes, and recommends high-priority development projects based on real demand data.
              </p>
              <Link
                href="/en/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                View Dashboard
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Languages', value: '12+' },
                  { label: 'AI Themes', value: 'Auto' },
                  { label: 'Priority', value: 'Ranked' },
                  { label: 'Map', value: 'Live' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-white/10 rounded-xl">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span>JanSankalp — AI for Constituency Development</span>
          <span>Google Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
}