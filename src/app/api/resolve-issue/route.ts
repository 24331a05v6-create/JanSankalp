import { NextResponse } from 'next/server';
import { updateMergedIssue } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { id, resolved } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing issue id' }, { status: 400 });
    }

    if (typeof resolved !== 'boolean') {
      return NextResponse.json({ error: 'resolved must be a boolean' }, { status: 400 });
    }

    const updateData: any = { resolved };
    if (resolved) {
      updateData.resolved_at = new Date().toISOString();
    } else {
      updateData.resolved_at = null;
    }

    await updateMergedIssue(id, updateData);

    return NextResponse.json({ success: true, id, resolved });
  } catch (error: any) {
    console.error('Resolve error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
