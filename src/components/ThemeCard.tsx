'use client';

import { BarChart3, AlertTriangle, ChevronRight } from 'lucide-react';

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    submission_count: number;
    avg_urgency: number | null;
    priority_score: number | null;
  };
  onClick?: () => void;
}

export function ThemeCard({ theme, onClick }: ThemeCardProps) {
  const urgency = theme.avg_urgency || 0;
  const priority = theme.priority_score || 0;
  const urgencyLabel = urgency >= 4 ? 'Critical' : urgency >= 3 ? 'High' : urgency >= 2 ? 'Medium' : 'Low';
  const urgencyColor = urgency >= 4 ? 'text-red-600 bg-red-50' : urgency >= 3 ? 'text-orange-600 bg-orange-50' : urgency >= 2 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {theme.name}
          </h3>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 capitalize">
            {theme.category || 'General'}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>

      {theme.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{theme.description}</p>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">{theme.submission_count}</span>
          <span className="text-xs text-gray-500">people reported</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${urgencyColor}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{urgencyLabel}</span>
        </div>

        {priority > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs text-gray-500">Priority</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (priority / 10) * 100)}%`,
                  backgroundColor: `hsl(${(10 - priority) * 12}, 70%, 50%)`,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700">{priority.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}