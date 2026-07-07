'use client';

import { X, AlertTriangle, MapPin, Users, Lightbulb, TrendingUp, FileText, Clock, Building2, Shield } from 'lucide-react';

interface ThemeDetailProps {
  theme: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    submission_count: number;
    avg_urgency: number | null;
    priority_score: number | null;
    representative_submissions: string[];
  };
  submissions: Array<{
    id: string;
    text_input: string | null;
    voice_transcript: string | null;
    category: string;
    location_name: string | null;
    urgency_score: number | null;
    priority_score: number | null;
    created_at: string;
    ai_summary: string | null;
    ai_category: string | null;
    ai_category_confidence: number | null;
    ai_entities: {
      location_mentioned: string | null;
      issue_type: string | null;
      department: string | null;
      severity_keywords: string[];
      affected_people: string | null;
    } | null;
    ai_suggestion: {
      next_steps: string[];
      responsible_department: string;
      relevant_schemes: string[];
      estimated_timeline: string;
      required_documents: string[];
    } | null;
    allTranslations?: Record<string, string>;
  }>;
  lang?: string;
  onClose: () => void;
}

function getTranslated(sub: { ai_summary?: string | null; text_input?: string | null; voice_transcript?: string | null; allTranslations?: Record<string, string> }, lang: string): string {
  if (sub.allTranslations && sub.allTranslations[lang]) return sub.allTranslations[lang];
  if (sub.allTranslations && sub.allTranslations['en']) return sub.allTranslations['en'];
  return sub.ai_summary || sub.text_input || sub.voice_transcript || '';
}

export function ThemeDetailModal({ theme, submissions, lang = 'en', onClose }: ThemeDetailProps) {
  const urgency = theme.avg_urgency || 3;

  // Merge AI suggestions from submissions
  const allSuggestions = submissions
    .filter(s => s.ai_suggestion)
    .map(s => s.ai_suggestion!);

  const mergedSuggestions = {
    next_steps: [...new Set(allSuggestions.flatMap(s => s.next_steps))].slice(0, 5),
    responsible_department: allSuggestions[0]?.responsible_department || 'Relevant Government Department',
    relevant_schemes: [...new Set(allSuggestions.flatMap(s => s.relevant_schemes))].slice(0, 3),
    estimated_timeline: allSuggestions[0]?.estimated_timeline || '2-4 weeks',
    required_documents: [...new Set(allSuggestions.flatMap(s => s.required_documents))].slice(0, 4),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{theme.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 capitalize">
                {theme.category || 'General'}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                urgency >= 4 ? 'bg-red-50 text-red-700' :
                urgency >= 3 ? 'bg-orange-50 text-orange-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                Urgency: {urgency.toFixed(1)}/5
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-6 max-h-[calc(85vh-80px)]">
          {theme.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600" />
                Summary
              </h3>
              <p className="text-gray-700">{theme.description}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-700">{theme.submission_count}</div>
              <div className="text-xs text-blue-600">People Reported</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-700">{urgency.toFixed(1)}</div>
              <div className="text-xs text-orange-600">Urgency Level</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-700">{theme.priority_score?.toFixed(1) || 'N/A'}</div>
              <div className="text-xs text-green-600">Priority Score</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Citizen Complaints ({submissions.length} people reported)
            </h3>
            <div className="space-y-2">
              {submissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No individual complaints loaded</p>
              ) : (
                submissions.map((sub, idx) => (
                  <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-gray-400 mt-0.5">#{idx + 1}</span>
                      <p className="text-sm text-gray-800 flex-1">
                        {getTranslated(sub, lang) || '(Voice submission)'}
                      </p>
                    </div>
                    {sub.ai_entities && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {sub.ai_entities.issue_type && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {sub.ai_entities.issue_type.replace(/_/g, ' ')}
                          </span>
                        )}
                        {sub.ai_entities.department && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {sub.ai_entities.department.split('/')[0].trim()}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {sub.location_name || 'No location'}
                      </span>
                      <span>•</span>
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                      {sub.priority_score && (
                        <>
                          <span>•</span>
                          <span className={`font-medium ${
                            sub.priority_score >= 7 ? 'text-red-600' :
                            sub.priority_score >= 4 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            Priority: {sub.priority_score.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI-Generated Suggestions */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI-Generated Action Plan
            </h3>

            <div className="space-y-4">
              {/* Responsible Department */}
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Responsible Department</p>
                  <p className="text-sm text-amber-900 font-medium">{mergedSuggestions.responsible_department}</p>
                </div>
              </div>

              {/* Next Steps */}
              {mergedSuggestions.next_steps.length > 0 && (
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Recommended Actions</p>
                    <ul className="mt-1 space-y-1">
                      {mergedSuggestions.next_steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                          <span className="font-bold text-amber-600">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Relevant Schemes */}
              {mergedSuggestions.relevant_schemes.length > 0 && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Relevant Government Schemes</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {mergedSuggestions.relevant_schemes.map((scheme, i) => (
                        <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                          {scheme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline & Documents */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Expected Timeline</p>
                    <p className="text-sm text-amber-900 font-medium">{mergedSuggestions.estimated_timeline}</p>
                  </div>
                </div>
                {mergedSuggestions.required_documents.length > 0 && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Required Documents</p>
                      <p className="text-sm text-amber-900">{mergedSuggestions.required_documents.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}