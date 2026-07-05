import { NextRequest, NextResponse } from 'next/server';
import { addSubmission, getSubmissions } from '@/lib/firebase';

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
    });

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
      theme_id: searchParams.get('theme_id') || undefined,
      limitCount: parseInt(searchParams.get('limit') || '200'),
    });

    return NextResponse.json({ submissions, total: submissions.length });
  } catch (error: any) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ submissions: [], total: 0 });
  }
}