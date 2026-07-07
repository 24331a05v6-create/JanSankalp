import { NextRequest, NextResponse } from 'next/server';
import { addSubmission, getSubmissions, updateSubmission } from '@/lib/firebase';
import { analyzeSubmission, checkDuplicate, calculatePriority, generateSuggestion } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, any>;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
      if (body.latitude) body.latitude = parseFloat(body.latitude as string);
      if (body.longitude) body.longitude = parseFloat(body.longitude as string);
    } else {
      body = await request.json();
    }

    if (!body.category || !body.language) {
      return NextResponse.json(
        { error: 'Category and language are required' },
        { status: 400 }
      );
    }

    const text = body.text_input || body.voice_transcript || body.ocr_text || '';

    // Step 1: Save submission first
    const submission = await addSubmission({
      text_input: body.text_input || null,
      voice_transcript: body.voice_transcript || null,
      photo_url: body.photo_url || null,
      ocr_text: body.ocr_text || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      location_name: body.location_name || null,
      category: body.category,
      language: body.language,
      source: body.source || 'web',
      session_id: body.session_id || null,
      status: 'pending',
      duplicate_count: 0,
      category_override: false,
      // AI fields passed from client
      ai_summary: body.ai_summary || null,
      ai_entities: body.ai_entities || null,
      ai_category: body.ai_category || null,
      ai_subcategory: body.ai_subcategory || null,
      ai_category_confidence: body.ai_category_confidence || null,
      ai_suggestion: body.ai_suggestion || null,
      priority_score: body.priority_score || null,
      urgency_score: body.urgency_score || null,
    });

    // Step 2: Run AI analysis if there's text
    if (text && text.length > 5) {
      try {
        // Run AI analysis in parallel
        const [aiResult, recentSubs] = await Promise.all([
          analyzeSubmission(text, body.category, body.language),
          getSubmissions({
            category: body.category,
            status: 'analyzed',
            limitCount: 20,
          }),
        ]);

        const updates: Record<string, any> = {};

        // Capability 1 & 2: Understand + Categorize
        if (aiResult) {
          updates.ai_summary = aiResult.summary;
          updates.ai_entities = aiResult.entities;
          updates.ai_category = aiResult.category;
          updates.ai_subcategory = aiResult.subcategory;
          updates.ai_category_confidence = aiResult.confidence;
          updates.category_override = aiResult.category_override;

          // Use AI category if confidence is high and it differs from user selection
          if (aiResult.category_override && aiResult.confidence >= 0.7) {
            updates.category = aiResult.category;
          }

          // Step 3: Check for duplicates
          const duplicateResult = await checkDuplicate(text, recentSubs.map(s => ({
            id: s.id,
            text_input: s.text_input || '',
            category: s.category,
            latitude: s.latitude || undefined,
            longitude: s.longitude || undefined,
          })));
          if (duplicateResult?.is_duplicate && duplicateResult.similarity_score >= 0.85) {
            updates.duplicate_of = duplicateResult.duplicate_of_id;
          }

          // Step 4: Calculate enhanced priority
          const priorityResult = await calculatePriority(
            text,
            updates.category || body.category,
            aiResult.entities,
            duplicateResult?.is_duplicate ? 1 : 0
          );

          if (priorityResult) {
            updates.priority_score = priorityResult.weighted_score;
            updates.urgency_score = priorityResult.scores.severity;
          }

          // Step 5: Generate suggestions
          const suggestionResult = await generateSuggestion(
            text,
            updates.category || body.category,
            aiResult.entities,
            priorityResult?.weighted_score || 5
          );

          if (suggestionResult) {
            updates.ai_suggestion = suggestionResult;
          }

          updates.status = 'analyzed';

          // Step 6: Generate multi-language translations for dashboard display
          const allLangs = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'];
          const sourceText = updates.ai_summary || aiResult.summary || text;
          try {
            const translations: Record<string, string> = { en: sourceText };
            for (const lang of allLangs.filter(l => l !== 'en')) {
              try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(sourceText)}`;
                const translateRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
                const translateData = await translateRes.json();
                if (translateData && translateData[0]) {
                  translations[lang] = translateData[0].map((item: any) => item[0]).join('');
                }
              } catch {}
            }
            if (Object.keys(translations).length > 1) {
              updates.allTranslations = translations;
            }
          } catch (transErr) {
            console.error('Translation failed:', transErr);
          }
        }

        await updateSubmission(submission.id, updates);
        submission.status = updates.status || 'analyzed';

      } catch (aiError) {
        console.error('AI analysis failed, saving without AI:', aiError);
        // Still save, just without AI enrichment
      }
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const submissions = await getSubmissions({
      category: searchParams.get('category') || undefined,
      language: searchParams.get('language') || undefined,
      status: searchParams.get('status') || undefined,
      source: searchParams.get('source') || undefined,
      theme_id: searchParams.get('theme_id') || undefined,
      limitCount: parseInt(searchParams.get('limit') || '500'),
    });

    return NextResponse.json({ submissions, total: submissions.length });
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ submissions: [], total: 0 });
  }
}
