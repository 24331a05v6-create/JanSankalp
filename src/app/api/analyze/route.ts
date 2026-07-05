import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.1-70b-versatile';

async function callGroq(prompt: string) {
  if (!GROQ_API_KEY) {
    return fallbackClustering(prompt);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are an AI that analyzes citizen development requests. Output only valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error('Groq API error');
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Groq error:', error);
    return fallbackClustering(prompt);
  }
}

function fallbackClustering(prompt: string) {
  const submissions = JSON.parse(prompt.match(/\[[\s\S]*\]/)?.[0] || '[]');
  const themes: Record<string, any[]> = {};
  
  submissions.forEach((s: any, i: number) => {
    const key = s.category || 'other';
    if (!themes[key]) themes[key] = [];
    themes[key].push({ ...s, index: i });
  });

  return Object.entries(themes).map(([category, items], idx) => ({
    id: `theme-${idx}`,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Issues`,
    description: `${items.length} submissions about ${category}`,
    category,
    submission_count: items.length,
    avg_urgency: 3,
    priority_score: items.length * 3,
    representative_submissions: items.slice(0, 3).map(s => s.id),
    urgency_scores: items.map(() => 3),
  }));
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

  const prompt = `Analyze these citizen development requests. Group into themes, score urgency 1-5, calculate priority.
Return JSON: { themes: [{ id, name, description, category, submission_count, avg_urgency, priority_score, representative_submissions: string[], urgency_scores: number[] }] }

Submissions: ${JSON.stringify(pending.map(p => ({
  id: p.id,
  text: p.text_input || p.voice_transcript || p.ocr_text,
  category: p.category,
  language: p.language,
  lat: p.latitude,
  lng: p.longitude,
})))}`;

  const result = await callGroq(prompt);

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
      const themeSubmissions = pending.filter((_, i) => theme.urgency_scores[i] !== undefined);
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