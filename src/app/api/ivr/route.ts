import { NextRequest, NextResponse } from 'next/server';
import { addSubmission, getSubmissions, updateSubmission } from '@/lib/firebase';
import { analyzeSubmission, checkDuplicate, calculatePriority, generateSuggestion } from '@/lib/gemini';

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

export async function POST(request: NextRequest) {
  try {
    const result = await withTimeout(handleIVRSubmission(request), 90000, 'IVR API total');
    return result;
  } catch (error: any) {
    console.error('[IVR] Request error:', error);
    return NextResponse.json(
      { error: error?.message || 'Request timed out or failed' },
      { status: 500 }
    );
  }
}

async function handleIVRSubmission(request: NextRequest) {
  const body = await request.json();

  // Validate required fields
  if (!body.language) {
    return NextResponse.json(
      { error: 'Language is required' },
      { status: 400 }
    );
  }

  // audioUrls is optional — complaint can be saved even if uploads failed
  const audioUrls: string[] = Array.isArray(body.audioUrls) ? body.audioUrls : [];

  // Build transcript from answers
  const transcript = body.transcript || '';

  // Save submission to same collection as web
  const submission = await addSubmission({
    text_input: transcript,
    voice_transcript: transcript,
    photo_url: audioUrls[0] || null,
    category: body.category || 'other',
    language: body.language,
    source: 'ivr',
    session_id: body.session_id || null,
    status: 'pending',
    duplicate_count: 0,
    category_override: false,
    location_name: body.location_name || null,
    latitude: body.latitude || null,
    longitude: body.longitude || null,
  });

  console.log(`[IVR] Submission saved: ${submission.id} (language: ${body.language})`);

  // Run AI analysis if there's meaningful text
  if (transcript && transcript.length > 5) {
    try {
      const [aiResult, recentSubs] = await Promise.all([
        withTimeout(
          analyzeSubmission(transcript, body.category || 'other', body.language),
          30000,
          'AI analyzeSubmission'
        ),
        withTimeout(
          getSubmissions({
            category: body.category || 'other',
            status: 'analyzed',
            limitCount: 20,
          }),
          15000,
          'getSubmissions for duplicate check'
        ),
      ]);

      const updates: Record<string, any> = {};

      if (aiResult) {
        updates.ai_summary = aiResult.summary;
        updates.ai_entities = aiResult.entities;
        updates.ai_category = aiResult.category;
        updates.ai_subcategory = aiResult.subcategory;
        updates.ai_category_confidence = aiResult.confidence;
        updates.category_override = aiResult.category_override;

        if (aiResult.category_override && aiResult.confidence >= 0.7) {
          updates.category = aiResult.category;
        }

        // Check for duplicates
        const duplicateResult = await withTimeout(
          checkDuplicate(transcript, recentSubs.map(s => ({
            id: s.id,
            text_input: s.text_input || '',
            category: s.category,
            latitude: s.latitude || undefined,
            longitude: s.longitude || undefined,
          }))),
          15000,
          'AI checkDuplicate'
        );
        if (duplicateResult?.is_duplicate && duplicateResult.similarity_score >= 0.85) {
          updates.duplicate_of = duplicateResult.duplicate_of_id;
        }

        // Calculate priority
        const priorityResult = await withTimeout(
          calculatePriority(
            transcript,
            updates.category || body.category || 'other',
            aiResult.entities,
            duplicateResult?.is_duplicate ? 1 : 0
          ),
          15000,
          'AI calculatePriority'
        );
        if (priorityResult) {
          updates.priority_score = priorityResult.weighted_score;
          updates.urgency_score = priorityResult.scores.severity;
        }

        // Generate suggestions
        const suggestionResult = await withTimeout(
          generateSuggestion(
            transcript,
            updates.category || body.category || 'other',
            aiResult.entities,
            priorityResult?.weighted_score || 5
          ),
          15000,
          'AI generateSuggestion'
        );
        if (suggestionResult) {
          updates.ai_suggestion = suggestionResult;
        }

        updates.status = 'analyzed';

        // Generate translations for dashboard
        const allLangs = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'];
        const sourceText = updates.ai_summary || aiResult.summary || transcript;
        try {
          const translations: Record<string, string> = { en: sourceText };
          for (const lang of allLangs.filter(l => l !== 'en')) {
            try {
              const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(sourceText)}`;
              const translateRes = await withTimeout(
                fetch(url),
                8000,
                `Google Translate for ${lang}`
              );
              const translateData = await translateRes.json();
              if (translateData && translateData[0]) {
                translations[lang] = translateData[0].map((item: any) => item[0]).join('');
              }
            } catch { /* skip failed translations */ }
          }
          if (Object.keys(translations).length > 1) {
            updates.allTranslations = translations;
          }
        } catch (transErr) {
          console.error('[IVR] Translation failed:', transErr);
        }
      }

      await updateSubmission(submission.id, updates);
      submission.status = updates.status || 'analyzed';

      console.log(`[IVR] AI analysis complete for ${submission.id}`);
    } catch (aiError) {
      console.error('[IVR] AI analysis failed, saving without AI:', aiError);
    }
  }

  return NextResponse.json({
    success: true,
    submission: {
      id: submission.id,
      status: submission.status,
      language: submission.language,
      source: submission.source,
    },
  });
}
