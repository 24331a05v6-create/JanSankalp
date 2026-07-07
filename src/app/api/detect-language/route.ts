import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: 'No text' }, { status: 400 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ language: 'en', text: text });
  }

  try {
    const langNames: Record<string, string> = {
      en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
      ml: 'Malayalam', mr: 'Marathi', gu: 'Gujarati', bn: 'Bengali',
      or: 'Odia', pa: 'Punjabi', as: 'Assamese',
    };

    const prompt = `You are a language detection expert for Indian languages. Analyze this spoken text transcript and:
1. Detect which language was actually spoken (even if transcribed in Roman/English script)
2. If it's an Indian language, transliterate it to the proper native script

Input text: "${text}"

Respond in JSON format only:
{
  "detected_language": "xx",
  "native_script": "transliterated text in proper script",
  "original_script": "original text as-is"
}

Rules:
- detected_language must be one of: en, hi, ta, te, kn, ml, mr, gu, bn, or, pa, as
- If the text is already in native script (Devanagari, Tamil, Telugu, etc.), keep it as-is
- If the text is Roman script but clearly Indian language words (e.g., "namaste", "vanakkam", "namaskaram"), transliterate to native script
- If it's English, keep in English and set detected_language to "en"
- For mixed language, use the dominant language`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 500 },
        }),
      }
    );

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const finalText = parsed.native_script || parsed.original_script || text;
      const detectedLang = langNames[parsed.detected_language] ? parsed.detected_language : 'en';
      return NextResponse.json({ language: detectedLang, text: finalText });
    }

    return NextResponse.json({ language: 'en', text: text });
  } catch {
    return NextResponse.json({ language: 'en', text: text });
  }
}