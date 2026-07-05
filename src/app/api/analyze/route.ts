import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
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
      id: `theme-${idx}`,
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

async function processSubmissions(supabase: ReturnType<typeof createServerClient>) {
  const { data: pending, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('status', 'pending')
    .limit(100);

  if (error || !pending?.length) return;

  await supabase
    .from('submissions')
    .update({ status: 'processing' })
    .in('id', pending.map(p => p.id));

  const prompt = `You are an AI analyst for an Indian Member of Parliament's constituency office.

Analyze these citizen development requests. Group them into meaningful themes based on similarity.

For each theme provide:
- A concise theme name (max 5 words)
- A 1-2 sentence description of the core issue
- Urgency score 1-5 (5 = critical: safety hazard, health emergency, immediate need)
- Priority score 1-10 (combines: request frequency, urgency, population impact)

Submissions:
${JSON.stringify(pending.map(p => ({
  id: p.id,
  text: p.text_input || p.voice_transcript || p.ocr_text,
  category: p.category,
  language: p.language,
  lat: p.latitude,
  lng: p.longitude,
})), null, 2)}

Return ONLY valid JSON in this exact format:
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
    const { data: newTheme } = await supabase
      .from('themes')
      .insert({
        name: theme.name,
        description: theme.description,
        category: theme.category,
        submission_count: theme.submission_count,
        avg_urgency: theme.avg_urgency,
        priority_score: theme.priority_score,
        representative_submissions: theme.representative_submissions,
      })
      .select()
      .single();

    if (newTheme) {
      const themeSubmissions = pending.filter((_, i) => theme.urgency_scores?.[i] !== undefined);
      const updates = themeSubmissions.map((sub, idx) => ({
        id: sub.id,
        theme_id: newTheme.id,
        theme_name: theme.name,
        urgency_score: theme.urgency_scores[idx],
        priority_score: theme.priority_score,
        status: 'analyzed' as const,
      }));

      for (const update of updates) {
        await supabase
          .from('submissions')
          .update(update)
          .eq('id', update.id);
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    await processSubmissions(supabase);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const { data: themes, error } = await supabase
      .from('themes')
      .select('*')
      .order('priority_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Themes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}