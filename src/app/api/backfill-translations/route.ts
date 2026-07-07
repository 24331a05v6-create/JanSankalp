import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, updateSubmission } from '@/lib/firebase';

const ALL_LANGS = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'];

async function googleTranslate(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const batch = parseInt(request.nextUrl.searchParams.get('batch') || '0');
    const batchSize = 5;

    const submissions = await getAllSubmissions();
    const needTranslation = submissions.filter(s => !s.allTranslations || !s.allTranslations['en'] || Object.keys(s.allTranslations).length < 4);
    const batchSubs = needTranslation.slice(batch * batchSize, (batch + 1) * batchSize);

    if (batchSubs.length === 0) {
      return NextResponse.json({ done: true, total: needTranslation.length, processed: 0 });
    }

    let updated = 0;
    for (const sub of batchSubs) {
      const text = sub.ai_summary || sub.text_input || sub.voice_transcript || '';
      if (!text) continue;

      const translations: Record<string, string> = sub.allTranslations ? { ...sub.allTranslations } : {};

      // Always set English as the original text
      if (!translations['en']) {
        translations['en'] = text;
      }

      // Translate to all missing languages using Google Translate
      const missingLangs = ALL_LANGS.filter(l => !translations[l]);
      for (const lang of missingLangs) {
        const result = await googleTranslate(text, lang);
        if (result) translations[lang] = result;
        await new Promise(r => setTimeout(r, 150));
      }

      if (Object.keys(translations).length > Object.keys(sub.allTranslations || {}).length) {
        await updateSubmission(sub.id, { allTranslations: translations });
        updated++;
      }
    }

    return NextResponse.json({
      done: (batch + 1) * batchSize >= needTranslation.length,
      batch: batch + 1,
      totalBatches: Math.ceil(needTranslation.length / batchSize),
      updated,
      remaining: Math.max(0, needTranslation.length - (batch + 1) * batchSize),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
