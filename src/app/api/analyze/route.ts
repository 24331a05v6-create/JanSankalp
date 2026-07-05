import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, addTheme, getThemes, updateSubmission } from '@/lib/firebase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    return fallbackClustering(prompt);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini error:', error);
    return fallbackClustering(prompt);
  }
}

function fallbackClustering(prompt: string) {
  const submissions = JSON.parse(prompt.match(/\[[\s\S]*\]/)?.[0] || '[]');
  const themes: Record<string, any[]> = {};
  
  submissions.forEach((s: any) => {
    const key = s.category || 'other';
    if (!themes[key]) themes[key] = [];
    themes[key].push(s);
  });

  return {
    themes: Object.entries(themes).map(([category, items], idx) => ({
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Issues`,
      description: `${items.length} submissions about ${category}`,
      category,
      submission_count: items.length,
      avg_urgency: 3,
      priority_score: items.length * 3,
      representative_submissions: items.slice(0, 3).map((s: any) => s.id),
      urgency_scores: items.map(() => 3),
    })),
  };
}

async function processSubmissions() {
  const pending = await getSubmissions({ status: 'pending', limitCount: 100 });

  if (!pending.length) return;

  for (const sub of pending) {
    await updateSubmission(sub.id, { status: 'processing' });
  }

  const prompt = `You are an AI analyst for an Indian Member of Parliament's constituency office.

Analyze these citizen development requests. Group them into meaningful themes.

For each theme provide:
- A concise theme name (max 5 words)
- A 1-2 sentence description
- Urgency score 1-5 (5 = critical: safety hazard, health emergency)
- Priority score 1-10 (frequency + urgency + impact)

Submissions:
${JSON.stringify(pending.map(p => ({
  id: p.id,
  text: p.text_input || p.voice_transcript || p.ocr_text || '',
  category: p.category,
  language: p.language,
  lat: p.latitude,
  lng: p.longitude,
})), null, 2)}

Return ONLY valid JSON:
{
  "themes": [
    {
      "name": "Theme Name",
      "description": "Brief description",
      "category": "education",
      "submission_count": 5,
      "avg_urgency": 4.0,
      "priority_score": 7.5,
      "representative_submissions": ["id1", "id2"],
      "urgency_scores": [4, 5, 3]
    }
  ]
}`;

  const result = await callGemini(prompt);

  if (!result?.themes) return;

  for (const theme of result.themes) {
    const newTheme = await addTheme({
      name: theme.name,
      description: theme.description,
      category: theme.category,
      submission_count: theme.submission_count,
      avg_urgency: theme.avg_urgency,
      priority_score: theme.priority_score,
      representative_submissions: theme.representative_submissions,
    });

    const themeSubs = pending.filter((_, i) => theme.urgency_scores?.[i] !== undefined);
    for (let idx = 0; idx < themeSubs.length; idx++) {
      await updateSubmission(themeSubs[idx].id, {
        theme_id: newTheme.id,
        theme_name: theme.name,
        urgency_score: theme.urgency_scores[idx],
        priority_score: theme.priority_score,
        status: 'analyzed',
      });
    }
  }
}

export async function POST() {
  try {
    await processSubmissions();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error?.message || 'Analysis failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitCount = parseInt(searchParams.get('limit') || '20');

    const themes = await getThemes(limitCount);
    return NextResponse.json({ themes });
  } catch (error: any) {
    console.error('Themes fetch error:', error);
    return NextResponse.json({ themes: [] });
  }
}