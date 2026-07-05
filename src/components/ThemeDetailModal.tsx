'use client';

import { X, AlertTriangle, MapPin, Users, Lightbulb, TrendingUp } from 'lucide-react';

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
    created_at: string;
  }>;
  onClose: () => void;
}

const RECOMMENDED_ACTIONS: Record<string, string[]> = {
  education: [
    'Conduct needs assessment survey in the area',
    'Coordinate with District Education Officer',
    'Allocate funds for infrastructure upgrade in next budget',
    'Explore PPP partnerships for school facilities',
  ],
  healthcare: [
    'Deploy mobile health unit for immediate relief',
    'Coordinate with District Health Officer',
    'Set up health camp at identified location',
    'Escalate to State Health Department if critical',
  ],
  roads: [
    'File work order for pothole repair through PWD',
    'Coordinate with Municipal Corporation',
    'Allocate funds from MPLAD scheme',
    'Request state government matching grant',
  ],
  water: [
    'Assess groundwater levels in the area',
    'Coordinate with Jal Shakti Department',
    'Install water purification systems if needed',
    'Plan rainwater harvesting infrastructure',
  ],
  sanitation: [
    'Coordinate with Municipal Sanitation Department',
    'Organize community cleanliness drives',
    'Install public toilets at identified locations',
    'Connect with Swachh Bharat Mission funds',
  ],
  electricity: [
    'Coordinate with State Electricity Board',
    'Address transformer overload issues',
    'Explore solar power for underserved areas',
    'Submit grievance to DISCOM if needed',
  ],
  employment: [
    'Organize skill development camps',
    'Connect with District Employment Office',
    'Promote MGNREGA implementation',
    'Facilitate connections with local industries',
  ],
  other: [
    'Gather more information from constituents',
    'Coordinate with relevant department',
    'Include in next constituency development meeting',
    'Track and follow up within 30 days',
  ],
};

export function ThemeDetailModal({ theme, submissions, onClose }: ThemeDetailProps) {
  const urgency = theme.avg_urgency || 3;
  const actions = RECOMMENDED_ACTIONS[theme.category || 'other'] || RECOMMENDED_ACTIONS.other;

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
              <div className="text-xs text-blue-600">Submissions</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-700">{urgency.toFixed(1)}</div>
              <div className="text-xs text-orange-600">Avg Urgency</div>
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
              Recent Submissions
            </h3>
            <div className="space-y-2">
              {submissions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-800">
                    {sub.text_input || sub.voice_transcript || '(Voice submission)'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{sub.location_name || 'No location'}</span>
                    <span>•</span>
                    <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Recommended Actions
            </h3>
            <ul className="space-y-2">
              {actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                  <span className="font-bold text-amber-600">{i + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}