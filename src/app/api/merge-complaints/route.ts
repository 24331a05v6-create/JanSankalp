import { NextResponse } from 'next/server';
import { getAllSubmissions, addMergedIssue, deleteAllMergedIssues, type MergedIssue } from '@/lib/firebase';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'because', 'but', 'and',
  'or', 'if', 'while', 'about', 'against', 'up', 'down', 'that', 'this',
  'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you',
  'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their',
  'what', 'which', 'who', 'whom', 'also', 'like', 'much', 'many',
  'get', 'got', 'getting', 'goes', 'going', 'make', 'made', 'making',
  'take', 'took', 'give', 'gave', 'say', 'said', 'tell', 'told',
  'need', 'use', 'used', 'come', 'came', 'keep', 'kept', 'let',
  'seem', 'help', 'show', 'hear', 'play', 'run', 'move', 'live',
  'believe', 'happen', 'sit', 'stand', 'lose', 'pay', 'meet',
  'include', 'continue', 'set', 'learn', 'change', 'lead', 'understand',
  'watch', 'follow', 'stop', 'speak', 'read', 'allow', 'add',
  'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
  'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die',
  'send', 'expect', 'build', 'stay', 'fall', 'cut', 'reach',
  'kill', 'remain', 'suggest', 'raise', 'pass', 'sell', 'require',
  'report', 'decide', 'pull', 'citizen', 'complaint', 'issue', 'problem',
  'request', 'department', 'government', 'scheme', 'area', 'local',
  'please', 'kindly', 'immediately', 'urgent', 'seriously', 'badly',
  'very', 'really', 'quite', 'around', 'near', 'every', 'day',
  'since', 'last', 'long', 'well', 'back', 'even', 'still',
  'new', 'want', 'good', 'great', 'right', 'sure', 'thing',
  'things', 'going', 'place', 'people', 'time', 'way', 'work',
]);

function extractKeywords(text: string): Set<string> {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

function getEnglishText(sub: any): string {
  return sub.allTranslations?.['en'] || sub.ai_summary || sub.text_input || sub.voice_transcript || '';
}

function getTranslatedText(sub: any, lang: string): string {
  if (sub.allTranslations?.[lang]) return sub.allTranslations[lang];
  if (sub.allTranslations?.['en']) return sub.allTranslations['en'];
  return sub.ai_summary || sub.text_input || sub.voice_transcript || '';
}

async function translateViaGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    console.log('Starting merge complaints...');
    const submissions = await getAllSubmissions();
    console.log(`Fetched ${submissions.length} submissions`);

    // Clear old merged issues
    const deleted = await deleteAllMergedIssues();
    console.log(`Deleted ${deleted} old merged issues`);

    // Group by category
    const byCategory: Record<string, any[]> = {};
    submissions.forEach(sub => {
      const cat = sub.category || 'other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(sub);
    });

    const mergedIssues: MergedIssue[] = [];

    for (const [category, catSubs] of Object.entries(byCategory)) {
      console.log(`Processing ${category}: ${catSubs.length} submissions`);

      // Extract keywords for each submission
      const subKeywords = catSubs.map(sub => ({
        sub,
        keywords: extractKeywords(getEnglishText(sub)),
      }));

      // Cluster by keyword similarity
      const clusters: any[][] = [];
      const assigned = new Set<number>();

      for (let i = 0; i < subKeywords.length; i++) {
        if (assigned.has(i)) continue;
        const cluster = [subKeywords[i].sub];
        assigned.add(i);

        for (let j = i + 1; j < subKeywords.length; j++) {
          if (assigned.has(j)) continue;
          const sim = jaccardSimilarity(subKeywords[i].keywords, subKeywords[j].keywords);
          if (sim >= 0.25) {
            cluster.push(subKeywords[j].sub);
            assigned.add(j);
          }
        }
        clusters.push(cluster);
      }

      // Create merged issue for each cluster
      for (const cluster of clusters) {
        // Pick representative: highest priority score
        cluster.sort((a: any, b: any) => (b.priority_score || 0) - (a.priority_score || 0));
        const representative = cluster[0];

        // Compute merged priority (weighted by count)
        const avgPriority = cluster.reduce((sum: number, s: any) => sum + (s.priority_score || 0), 0) / cluster.length;
        const countBoost = Math.min(2, Math.log2(cluster.length + 1) * 0.5);
        const mergedPriority = Math.min(10, avgPriority + countBoost);

        // Collect unique locations and departments
        const locations = [...new Set(cluster.map((s: any) => s.location_name || s.ai_entities?.location_mentioned).filter(Boolean))];
        const departments = [...new Set(cluster.map((s: any) => s.ai_entities?.department).filter(Boolean))];
        const allKeywords = [...new Set(cluster.flatMap((s: any) => s.ai_entities?.severity_keywords || []).filter(Boolean))].slice(0, 5);

        // Generate representative query (English)
        const repText = getEnglishText(representative);

        // Translate representative query to all languages
        const allLangs = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'];
        const translations: Record<string, string> = { en: repText };

        for (const lang of allLangs.filter(l => l !== 'en')) {
          // Check if any submission already has this translation
          const existingTrans = cluster.find((s: any) => s.allTranslations?.[lang]);
          if (existingTrans) {
            translations[lang] = existingTrans.allTranslations[lang];
          } else {
            const translated = await translateViaGoogle(repText, lang);
            if (translated) translations[lang] = translated;
            await new Promise(r => setTimeout(r, 150));
          }
        }

        // Get merged suggestion from highest priority submission
        const mergedSuggestion = representative.ai_suggestion || {
          next_steps: [],
          responsible_department: departments[0] || 'General Administration',
          relevant_schemes: [],
          estimated_timeline: '2-4 weeks',
          required_documents: [],
        };

        const mergedIssue: MergedIssue = {
          representative_query: repText,
          representative_query_translations: translations,
          category,
          complaint_count: cluster.length,
          priority_score: Math.round(mergedPriority * 10) / 10,
          merged_submission_ids: cluster.map((s: any) => s.id),
          locations: locations.slice(0, 5),
          departments,
          severity_keywords: allKeywords,
          ai_suggestion: mergedSuggestion,
        };

        mergedIssues.push(mergedIssue);
      }
    }

    // Sort by priority score descending
    mergedIssues.sort((a, b) => b.priority_score - a.priority_score);

    // Save to Firebase
    let saved = 0;
    for (const issue of mergedIssues) {
      await addMergedIssue(issue);
      saved++;
    }

    console.log(`Saved ${saved} merged issues`);

    return NextResponse.json({
      success: true,
      total_submissions: submissions.length,
      merged_issues: saved,
      categories: Object.keys(byCategory).length,
    });
  } catch (error: any) {
    console.error('Merge error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getMergedIssues } = await import('@/lib/firebase');
    const issues = await getMergedIssues(50);
    return NextResponse.json({ merged_issues: issues, total: issues.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
