import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/firebase';
import { prioritizeProjects } from '@/lib/gemini';

interface ProjectInput {
  name: string;
  category: string;
  estimated_cost?: string;
  target_area?: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  roads: ['roads', 'road', 'transport', 'traffic', 'highway', 'pothole', 'bridge', 'street'],
  education: ['education', 'school', 'college', 'university', 'student', 'teacher', 'library'],
  healthcare: ['healthcare', 'health', 'hospital', 'clinic', 'medical', 'doctor', 'medicine'],
  water: ['water', 'drinking water', 'supply', 'pipeline', 'borewell', 'tank', 'pond'],
  sanitation: ['sanitation', 'drainage', 'sewage', 'toilet', 'waste', 'garbage', 'cleanliness'],
  electricity: ['electricity', 'power', 'electrical', 'transformer', 'outage', 'street light', 'streetlight'],
  employment: ['employment', 'skill', 'training', 'job', 'vocational', 'centre', 'center'],
  other: ['other'],
};

function matchCategory(projectCategory: string, submissionCategory: string): boolean {
  const pc = projectCategory.toLowerCase();
  const sc = submissionCategory.toLowerCase();
  if (pc === sc) return true;
  const aliases = CATEGORY_MAP[pc] || [];
  return aliases.some(a => sc.includes(a) || a.includes(sc));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projects } = body as { projects: ProjectInput[] };

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Projects array is required' }, { status: 400 });
    }

    const submissions = await getAllSubmissions();

    // Pre-compute local statistics for each project (used as fallback if Gemini fails)
    const localStats = projects.map(project => {
      const related = submissions.filter(s => matchCategory(project.category, s.category));
      const avgPriority = related.length > 0
        ? related.reduce((sum, s) => sum + (s.priority_score || 0), 0) / related.length
        : 0;
      const locations = new Set(related.map(s => s.location_name || s.ai_entities?.location_mentioned).filter(Boolean));
      const departments = new Set(related.map(s => s.ai_entities?.department).filter(Boolean));
      const severityKeywords = related.flatMap(s => s.ai_entities?.severity_keywords || []);
      const highSeverity = severityKeywords.filter(k =>
        ['death', 'injury', 'accident', 'collapse', 'flood', 'outbreak', 'emergency', 'critical'].includes(k.toLowerCase())
      ).length;

      // Score: 0-100 based on complaint count, priority, severity
      const countScore = Math.min(40, (related.length / Math.max(1, submissions.length)) * 40);
      const priorityScore = (avgPriority / 10) * 30;
      const severityScore = Math.min(15, highSeverity * 3);
      const hotspotScore = Math.min(15, locations.size * 2);
      const totalScore = Math.round(Math.min(100, countScore + priorityScore + severityScore + hotspotScore));

      return {
        related_complaints: related.length,
        duplicate_complaints: related.filter(s => s.duplicate_of).length,
        avg_priority_score: Math.round(avgPriority * 10) / 10,
        hotspot_locations: locations.size,
        affected_areas: locations.size,
        responsible_department: [...departments][0] || 'General Administration',
        priority_score: totalScore,
        urgency: totalScore >= 80 ? 'critical' : totalScore >= 60 ? 'high' : totalScore >= 40 ? 'medium' : 'low',
      };
    });

    // Try Gemini AI prioritization
    let aiResult = await prioritizeProjects(projects, submissions);

    let rankedProjects: any[];

    if (aiResult && aiResult.ranked_projects) {
      // Merge AI results with local stats
      rankedProjects = aiResult.ranked_projects.map((ai: any, i: number) => ({
        ...ai,
        rank: i + 1,
        project_name: ai.project_name || projects[i]?.name,
        category: ai.category || projects[i]?.category,
        estimated_cost: projects[i]?.estimated_cost,
        target_area: projects[i]?.target_area,
        related_complaints: ai.related_complaints ?? localStats[i]?.related_complaints ?? 0,
        duplicate_complaints: ai.duplicate_complaints ?? localStats[i]?.duplicate_complaints ?? 0,
        avg_priority_score: ai.avg_priority_score ?? localStats[i]?.avg_priority_score ?? 0,
        hotspot_locations: ai.hotspot_locations ?? localStats[i]?.hotspot_locations ?? 0,
        affected_areas: ai.affected_areas ?? localStats[i]?.affected_areas ?? 0,
        responsible_department: ai.responsible_department ?? localStats[i]?.responsible_department ?? 'General Administration',
        priority_score: ai.priority_score ?? localStats[i]?.priority_score ?? 0,
        urgency: ai.urgency ?? localStats[i]?.urgency ?? 'medium',
        why_this_recommendation: ai.why_this_recommendation || [],
        reason_for_recommendation: ai.reason_for_recommendation || '',
        expected_impact: ai.expected_impact || '',
        citizens_benefited: ai.citizens_benefited || 'N/A',
        urgency_reason: ai.urgency_reason || '',
        suggested_scheme: ai.suggested_scheme || '',
      }));
    } else {
      // Fallback: use local stats only
      rankedProjects = projects.map((project, i) => ({
        rank: i + 1,
        project_name: project.name,
        category: project.category,
        estimated_cost: project.estimated_cost,
        target_area: project.target_area,
        ...localStats[i],
        reason_for_recommendation: `Based on analysis of ${localStats[i].related_complaints} related citizen complaints in the database.`,
        expected_impact: `Addressing ${localStats[i].related_complaints} reported issues across ${localStats[i].hotspot_locations} locations.`,
        citizens_benefited: `Approximately ${localStats[i].related_complaints * 50}+ citizens`,
        urgency_reason: `Score of ${localStats[i].priority_score}/100 based on complaint frequency, severity, and affected population.`,
        suggested_scheme: '',
        why_this_recommendation: [
          `${localStats[i].related_complaints} related complaints`,
          `Average priority score: ${localStats[i].avg_priority_score}/10`,
          `${localStats[i].hotspot_locations} hotspot locations identified`,
          `${localStats[i].duplicate_complaints} duplicate complaints showing recurring demand`,
        ],
      }));

      // Sort by priority score
      rankedProjects.sort((a, b) => b.priority_score - a.priority_score);
      rankedProjects = rankedProjects.map((p, i) => ({ ...p, rank: i + 1 }));
    }

    return NextResponse.json({
      success: true,
      projects: rankedProjects,
      total_submissions_analyzed: submissions.length,
      ai_powered: !!(aiResult && aiResult.ranked_projects),
    });
  } catch (error: any) {
    console.error('Project prioritization error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
