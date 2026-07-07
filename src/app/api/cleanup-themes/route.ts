import { NextResponse } from 'next/server';
import { getAllSubmissions, updateSubmission } from '@/lib/firebase';
import { getFirestore, collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST() {
  try {
    const themesSnap = await getDocs(collection(db, 'themes'));
    const themes = themesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Group by category, keep only the one with most submissions
    const byCategory: Record<string, any[]> = {};
    themes.forEach(t => {
      const cat = (t as any).category || 'other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(t);
    });

    let deleted = 0;
    let kept = 0;

    for (const [category, catThemes] of Object.entries(byCategory)) {
      // Sort by submission_count descending, keep the best one
      catThemes.sort((a, b) => ((b as any).submission_count || 0) - ((a as any).submission_count || 0));
      
      const bestTheme = catThemes[0];
      const duplicates = catThemes.slice(1);

      // Delete duplicates
      for (const dup of duplicates) {
        await deleteDoc(doc(db, 'themes', dup.id));
        deleted++;
      }

      kept++;
    }

    // Now fix all submissions to point to the correct theme
    const allSubs = await getAllSubmissions();
    const updatedThemesSnap = await getDocs(collection(db, 'themes'));
    const updatedThemes = updatedThemesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const themeByCategory: Record<string, any> = {};
    updatedThemes.forEach(t => {
      themeByCategory[(t as any).category] = t;
    });

    let subsUpdated = 0;
    for (const sub of allSubs) {
      const correctTheme = themeByCategory[(sub as any).category];
      if (correctTheme && (sub as any).theme_id !== correctTheme.id) {
        await updateSubmission(sub.id, {
          theme_id: correctTheme.id,
          theme_name: (correctTheme as any).name,
        });
        subsUpdated++;
      }
    }

    return NextResponse.json({
      success: true,
      themes_kept: kept,
      themes_deleted: deleted,
      submissions_updated: subsUpdated,
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}