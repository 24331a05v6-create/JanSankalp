'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguagePicker } from '@/components/LanguagePicker';

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-lang');
    if (saved) {
      router.replace(`/${saved}`);
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <LanguagePicker onSelect={(lang) => router.replace(`/${lang}`)} />;
}