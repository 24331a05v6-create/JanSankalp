'use client';

import { LanguagePicker } from '@/components/LanguagePicker';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  return <LanguagePicker onSelect={(lang) => router.replace(`/${lang}`)} />;
}