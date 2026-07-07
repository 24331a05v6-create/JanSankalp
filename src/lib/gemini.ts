import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Category } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const CATEGORIES: Category[] = [
  'education', 'healthcare', 'roads', 'water', 'sanitation',
  'electricity', 'employment', 'other'
];

function getGenAI() {
  if (!GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

async function callGemini(prompt: string, retries = 2): Promise<any> {
  const genAI = getGenAI();
  if (!genAI) return null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return null;
    } catch (error) {
      if (attempt === retries) {
        console.error('Gemini failed after retries:', error);
        return null;
      }
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

// Capability 1: Understand Input + Capability 2: Auto-Categorize
export async function analyzeSubmission(text: string, userCategory: string, language: string) {
  const prompt = `You are an AI analyst for an Indian MP's constituency office. Analyze this citizen complaint/request.

INPUT TEXT: "${text}"
USER-SELECTED CATEGORY: ${userCategory}
LANGUAGE: ${language}

Extract structured information and verify the category.

Respond ONLY with valid JSON:
{
  "summary": "1-2 sentence summary of the complaint",
  "entities": {
    "location_mentioned": "specific location/landmark mentioned or null",
    "issue_type": "specific issue (e.g. pothole, water leak, power outage)",
    "department": "government department responsible",
    "severity_keywords": ["keyword1", "keyword2"],
    "affected_people": "estimated affected population or null"
  },
  "category": "one of: ${CATEGORIES.join(', ')}",
  "subcategory": "specific sub-category (e.g. road_pothole, water_contamination)",
  "confidence": 0.0-1.0,
  "category_override": true/false,
  "priority_factors": {
    "severity": 1-5,
    "safety_risk": 1-5,
    "urgency": 1-5,
    "affected_population": 1-5
  }
}

Rules:
- "category" should match the user's selection unless clearly wrong
- "category_override" = true only if you changed the category
- severity_keywords: words indicating how serious the issue is
- affected_people: try to estimate from context (e.g. "whole village" = "1000+")

Return ONLY the JSON object.`;

  return await callGemini(prompt);
}

// Capability 3: Duplicate Detection
export async function checkDuplicate(
  newText: string,
  recentSubmissions: { id: string; text_input: string; category: string; latitude?: number; longitude?: number }[]
) {
  if (!recentSubmissions.length) return null;

  const prompt = `You are a duplicate detector for citizen complaints. Check if the NEW complaint is a duplicate of any recent submissions.

NEW COMPLAINT: "${newText}"

RECENT SUBMISSIONS:
${recentSubmissions.map((s, i) => `[${i}] ID: ${s.id} | Category: ${s.category} | Text: "${s.text_input || ''}"`).join('\n')}

For each recent submission, determine if it's about the same issue.
Consider: same location, same problem type, same affected area.

Respond ONLY with valid JSON:
{
  "is_duplicate": true/false,
  "duplicate_of_id": "submission_id or null",
  "similarity_score": 0.0-1.0,
  "reason": "why it's a duplicate or why it's unique"
}

Rules:
- Only mark as duplicate if the issue is clearly the same (same location + same problem)
- Different wording about the same problem = duplicate
- Different locations = NOT duplicate
- Similar category but different specific issue = NOT duplicate
- Be strict: only flag obvious duplicates

Return ONLY the JSON object.`;

  return await callGemini(prompt);
}

// Capability 5: Enhanced Priority Scoring
export async function calculatePriority(
  text: string,
  category: string,
  entities: any,
  duplicateCount: number
) {
  const prompt = `You are a priority analyst for an Indian MP's constituency office. Calculate a detailed priority score for this complaint.

COMPLAINT: "${text}"
CATEGORY: ${category}
ENTITIES: ${JSON.stringify(entities)}
DUPLICATE_COUNT: ${duplicateCount} (number of similar complaints)

Calculate priority using this rubric:
- severity (1-5): How serious is the problem? Safety hazard = 5, cosmetic = 1
- safety_risk (1-5): Risk to human safety? Life-threatening = 5, no risk = 1
- urgency (1-5): Time-sensitive? Emergency = 5, can wait months = 1
- affected_population (1-5): How many people impacted? Thousands = 5, single household = 1
- compliance_risk (1-5): Legal/regulatory deadline pressure? Court-ordered = 5, no deadline = 1
- frequency (1-5): How common is this complaint? ${Math.min(5, 1 + duplicateCount)} based on duplicates

Respond ONLY with valid JSON:
{
  "scores": {
    "severity": 1-5,
    "safety_risk": 1-5,
    "urgency": 1-5,
    "affected_population": 1-5,
    "compliance_risk": 1-5,
    "frequency": 1-5
  },
  "weighted_score": 0.0-10.0,
  "priority_level": "critical/high/medium/low",
  "reasoning": "brief explanation of the score"
}

Calculation: weighted_score = (severity×0.25 + safety_risk×0.2 + urgency×0.2 + affected_population×0.15 + compliance_risk×0.1 + frequency×0.1) × 2

Return ONLY the JSON object.`;

  return await callGemini(prompt);
}

// Capability 6: Generate Suggestions
export async function generateSuggestion(
  text: string,
  category: string,
  entities: any,
  priorityScore: number
) {
  const prompt = `You are a helpful AI assistant for an Indian MP's constituency office. Generate actionable suggestions for this citizen complaint.

COMPLAINT: "${text}"
CATEGORY: ${category}
ENTITIES: ${JSON.stringify(entities)}
PRIORITY SCORE: ${priorityScore}/10

Generate helpful, specific guidance for the citizen.

Respond ONLY with valid JSON:
{
  "next_steps": ["step 1", "step 2", "step 3"],
  "responsible_department": "specific government department name",
  "relevant_schemes": ["scheme 1", "scheme 2"],
  "estimated_timeline": "expected resolution time",
  "required_documents": ["document 1", "document 2"]
}

Rules:
- next_steps: 3-5 concrete actions the citizen can take
- responsible_department: specific Indian government department (e.g. "Municipal Corporation Water Department", not just "Water")
- relevant_schemes: actual Indian government schemes relevant to this issue
- estimated_timeline: realistic timeframe (e.g. "2-4 weeks", "1-2 months")
- required_documents: documents that might be needed (Aadhaar, property papers, photos, etc.)

Return ONLY the JSON object.`;

  return await callGemini(prompt);
}

// Batch analyze for theme clustering (existing capability, enhanced)
export async function analyzeThemes(submissions: any[]) {
  const prompt = `You are an AI analyst for an Indian Member of Parliament's constituency office.

Analyze these citizen development requests. Group them into meaningful themes.

For each theme provide:
- A concise theme name (max 5 words)
- A 1-2 sentence description
- Urgency score 1-5 (5 = critical: safety hazard, health emergency)
- Priority score 1-10 (frequency + urgency + impact)
- What government department should handle it
- Any applicable government schemes

Submissions:
${JSON.stringify(submissions.map(p => ({
  id: p.id,
  text: p.text_input || p.voice_transcript || p.ocr_text || '',
  category: p.category,
  language: p.language,
  lat: p.latitude,
  lng: p.longitude,
})), null, 2)}

Return ONLY valid JSON:
{
  "themes": [
    {
      "name": "Theme Name",
      "description": "Brief description",
      "category": "education",
      "submission_count": 5,
      "avg_urgency": 4.0,
      "priority_score": 7.5,
      "representative_submissions": ["id1", "id2"],
      "urgency_scores": [4, 5, 3],
      "responsible_department": "Department name",
      "relevant_schemes": ["Scheme 1"]
    }
  ]
}`;

  return await callGemini(prompt);
}

// Capability 7: Project Prioritization
export async function prioritizeProjects(projects: any[], submissions: any[]) {
  const prompt = `You are an AI development planning advisor for an Indian Member of Parliament's constituency office. The MP has entered several proposed development projects and wants to know which should be prioritized based on actual citizen demand data.

PROPOSED PROJECTS:
${projects.map((p, i) => `[${i + 1}] Name: "${p.name}" | Category: ${p.category} | Area: ${p.target_area || 'Not specified'} | Cost: ${p.estimated_cost || 'Not specified'}`).join('\n')}

CITIZEN DEMAND DATA (from ${submissions.length} real complaints):
${JSON.stringify(submissions.map(s => ({
  category: s.category,
  text: (s.text_input || s.voice_transcript || s.ai_summary || '').substring(0, 150),
  priority: s.priority_score || 0,
  location: s.location_name || s.ai_entities?.location_mentioned || null,
  department: s.ai_entities?.department || null,
  severity: s.ai_entities?.severity_keywords || [],
  affected: s.ai_entities?.affected_people || null,
})), null, 2)}

For EACH proposed project, analyze:
1. How many complaints relate to this project's category
2. Average priority score of related complaints
3. How many unique locations/areas are affected (hotspots)
4. How many people are potentially affected
5. Safety risk level based on severity keywords

Then rank ALL projects from highest to lowest priority.

Respond ONLY with valid JSON:
{
  "ranked_projects": [
    {
      "rank": 1,
      "project_name": "Project Name",
      "category": "roads",
      "priority_score": 94,
      "related_complaints": 312,
      "duplicate_complaints": 45,
      "avg_priority_score": 7.8,
      "hotspot_locations": 18,
      "affected_areas": 12,
      "responsible_department": "Public Works Department",
      "reason_for_recommendation": "2-3 sentence explanation",
      "expected_impact": "Description of expected impact",
      "citizens_benefited": "50,000+",
      "urgency": "critical/high/medium/low",
      "urgency_reason": "Why this urgency level",
      "suggested_scheme": "Relevant Indian government scheme",
      "why_this_recommendation": [
        "High complaint frequency",
        "High average severity",
        "Multiple hotspot locations",
        "Large affected population",
        "High urgency"
      ]
    }
  ]
}

Rules:
- Score projects 0-100 based on complaint frequency, severity, affected population, safety risk, and urgency
- Prioritize projects with MORE complaints, HIGHER severity, LARGER affected population
- A project with 300 complaints should rank higher than one with 20 complaints
- High severity keywords (death, injury, accident, collapse, flood, outbreak) boost priority significantly
- Always provide at least 3 "why_this_recommendation" reasons
- Use actual Indian government schemes where applicable (PMGSY for roads, Swachh Bharat for sanitation, etc.)
- Be specific about departments (e.g., "Municipal Corporation Water Department" not just "Water")

Return ONLY the JSON object.`;

  return await callGemini(prompt);
}
