import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, addTheme, getThemes, updateSubmission } from '@/lib/firebase';
import { analyzeThemes } from '@/lib/gemini';

async function processSubmissions() {
  // Try pending first, then processing (in case previous run got stuck)
  let subs = await getSubmissions({ status: 'pending', limitCount: 100 });
  
  if (!subs.length) {
    subs = await getSubmissions({ status: 'processing', limitCount: 100 });
  }

  if (!subs.length) return;

  for (const sub of subs) {
    await updateSubmission(sub.id, { status: 'processing' });
  }

  const result = await analyzeThemes(subs);

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

    const themeSubs = subs.filter((_, i) => theme.urgency_scores?.[i] !== undefined);
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
