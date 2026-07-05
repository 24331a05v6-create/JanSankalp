'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { SubmissionForm } from '@/components/SubmissionForm';

export default function SubmitPage() {
  const t = useTranslations('submit');
  const nav = useTranslations('nav');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{nav('title')}</span>
            </div>
          </div>
          <Link href="/en/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            {nav('dashboard')}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <SubmissionForm defaultLocale="en" />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your submission will be analyzed by AI and included in the MP dashboard.</p>
          <p className="mt-1">All submissions are anonymous and secure.</p>
        </div>
      </main>
    </div>
  );
}