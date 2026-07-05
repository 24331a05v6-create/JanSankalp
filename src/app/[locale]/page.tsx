'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguagePicker } from '@/components/LanguagePicker';

export default function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-white font-bold text-2xl">JS</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">JanSankalp</h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          AI-powered platform for citizen development requests and constituency planning
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push(`/${localStorage.getItem('jansankalp-lang') || 'en'}/submit`)}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            Submit Request
          </button>
          <button
            onClick={() => router.push(`/${localStorage.getItem('jansankalp-lang') || 'en'}/dashboard`)}
            className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl text-lg font-semibold hover:border-blue-300 transition-all"
          >
            MP Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}