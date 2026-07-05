import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    const { data, error } = await supabase
      .from('submissions')
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ submission: data });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const language = searchParams.get('language');
    const status = searchParams.get('status');
    const theme_id = searchParams.get('theme_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) query = query.eq('category', category);
    if (language) query = query.eq('language', language);
    if (status) query = query.eq('status', status);
    if (theme_id) query = query.eq('theme_id', theme_id);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({ submissions: data, total: count });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}