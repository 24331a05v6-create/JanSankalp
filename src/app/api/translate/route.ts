import { NextRequest, NextResponse } from 'next/server';

const LANG_NAMES: Record<string, string> = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
  ml: 'Malayalam', mr: 'Marathi', gu: 'Gujarati', bn: 'Bengali',
  or: 'Odia', pa: 'Punjabi', as: 'Assamese',
};

// MyMemory free translation API (no key required, 5000 chars/day)
async function translateMyMemory(text: string, from: string, to: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    return null;
  } catch {
    return null;
  }
}

async function translateViaGemini(text: string, targetLang: string): Promise<string | null> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY || !text) return null;
  const langName = LANG_NAMES[targetLang] || targetLang;
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Translate the following text to ${langName}. Keep the meaning accurate. Only return the translated text, nothing else.\n\nText: "${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^["']|["']$/g, '');
  } catch {
    return null;
  }
}

async function smartTranslate(text: string, targetLang: string): Promise<string | null> {
  // Try Gemini first, fall back to MyMemory
  const geminiResult = await translateViaGemini(text, targetLang);
  if (geminiResult) return geminiResult;
  return translateMyMemory(text, 'en', targetLang);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguages } = body;

    if (!text || !targetLanguages || !Array.isArray(targetLanguages)) {
      return NextResponse.json(
        { error: 'text and targetLanguages[] are required' },
        { status: 400 }
      );
    }

    const translations: Record<string, string> = {};
    const batchSize = 4;

    for (let i = 0; i < targetLanguages.length; i += batchSize) {
      const batch = targetLanguages.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(lang => smartTranslate(text, lang))
      );
      batch.forEach((lang, idx) => {
        if (results[idx]) {
          translations[lang] = results[idx]!;
        }
      });
      if (i + batchSize < targetLanguages.length) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    return NextResponse.json({ translations });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
