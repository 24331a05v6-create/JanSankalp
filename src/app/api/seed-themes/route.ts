import { NextResponse } from 'next/server';
import { addThemeDoc, getAllSubmissions, updateSubmission } from '@/lib/firebase';

const THEMES: Record<string, { name: string; desc: string; urgency: number; priority: number }> = {
  water: { name: 'Water Supply Crisis', desc: 'Critical water supply issues affecting Visakhapatnam and Jaipur. Ranges from complete supply shutdown to pipeline leaks and water contamination.', urgency: 4.5, priority: 8.5 },
  roads: { name: 'Road Infrastructure Decay', desc: 'Dangerous road conditions including potholes on NH16, rain-damaged streets in Vijayawada, and non-functional traffic signals in Delhi.', urgency: 4.0, priority: 8.0 },
  electricity: { name: 'Power Supply Disruptions', desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad. Sparking poles during rain pose electrocution risk.', urgency: 4.0, priority: 7.5 },
  healthcare: { name: 'Healthcare Access Gaps', desc: 'Critical shortages in emergency medical services. Absent night doctors in Patna, long medicine wait times, and 40+ min ambulance delays in Kolkata.', urgency: 5.0, priority: 9.0 },
  education: { name: 'School Infrastructure Deficit', desc: 'Basic infrastructure missing in Lucknow government schools. Broken classroom furniture and no drinking water for students.', urgency: 3.0, priority: 6.0 },
  sanitation: { name: 'Sanitation Management Failure', desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards and potential disease outbreak.', urgency: 3.5, priority: 7.0 },
  employment: { name: 'Employment Scheme Delays', desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.', urgency: 3.0, priority: 6.5 },
  other: { name: 'Urban Compliance Issues', desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.', urgency: 2.5, priority: 5.0 },
};

export async function POST() {
  try {
    const allSubs = await getAllSubmissions();
    const ungrouped = allSubs.filter(s => !s.theme_id);

    if (!ungrouped.length) {
      return NextResponse.json({ message: 'All submissions already have themes', count: 0 });
    }

    const groups: Record<string, any[]> = {};
    ungrouped.forEach(s => {
      const cat = s.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });

    let themeCount = 0;
    let subCount = 0;

    for (const [category, subs] of Object.entries(groups)) {
      const info = THEMES[category] || THEMES.other;
      const repIds = subs.slice(0, 3).map(s => s.id);

      const newTheme = await addThemeDoc({
        name: info.name,
        description: info.desc,
        category,
        submission_count: subs.length,
        avg_urgency: info.urgency,
        priority_score: info.priority,
        representative_submissions: repIds,
      });

      themeCount++;

      for (const sub of subs) {
        await updateSubmission(sub.id, {
          theme_id: newTheme.id,
          theme_name: info.name,
          status: 'analyzed',
        });
        subCount++;
      }
    }

    return NextResponse.json({
      success: true,
      themes_created: themeCount,
      submissions_updated: subCount,
    });
  } catch (error: any) {
    console.error('Seed themes error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
