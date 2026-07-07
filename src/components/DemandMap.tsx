'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Users, Clock, Building2, Lightbulb, X } from 'lucide-react';

interface Submission {
  id: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  theme_name: string | null;
  urgency_score: number | null;
  priority_score: number | null;
  status: string;
  location_name: string | null;
  text_input: string | null;
  voice_transcript: string | null;
  source?: string;
  ai_summary: string | null;
  ai_entities?: {
    location_mentioned: string | null;
    issue_type: string | null;
    department: string | null;
    severity_keywords: string[];
    affected_people: string | null;
  } | null;
  ai_suggestion?: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  } | null;
  allTranslations?: Record<string, string>;
}

interface DemandMapProps {
  submissions: Submission[];
  lang?: string;
  filterCategory?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  education: '#3B82F6',
  healthcare: '#EF4444',
  roads: '#F59E0B',
  water: '#06B6D4',
  sanitation: '#8B5CF6',
  electricity: '#F97316',
  employment: '#10B981',
  other: '#6B7280',
};

const CATEGORY_ICONS: Record<string, string> = {
  education: '🎓',
  healthcare: '🏥',
  roads: '🛣️',
  water: '💧',
  sanitation: '🗑️',
  electricity: '⚡',
  employment: '💼',
  other: '📋',
};

function getPriorityLabel(score: number | null): { label: string; color: string } {
  if (!score) return { label: 'Low', color: '#22C55E' };
  if (score >= 7) return { label: 'Critical', color: '#DC2626' };
  if (score >= 5) return { label: 'High', color: '#EA580C' };
  if (score >= 3) return { label: 'Medium', color: '#CA8A04' };
  return { label: 'Low', color: '#22C55E' };
}

function getTranslated(sub: Submission, lang: string): string {
  if (sub.allTranslations?.[lang]) return sub.allTranslations[lang];
  if (sub.allTranslations?.['en']) return sub.allTranslations['en'];
  return sub.ai_summary || sub.text_input || sub.voice_transcript || '';
}

export function DemandMap({ submissions, lang = 'en', filterCategory }: DemandMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const [L, setL] = useState<any>(null);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      setL(leaflet.default || leaflet);
    })();
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = null;
      initializedRef.current = false;
    };
  }, [L]);

  useEffect(() => {
    if (!L || !mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();
    const bounds = L.latLngBounds([]);

    const filtered = filterCategory
      ? submissions.filter(s => s.category === filterCategory)
      : submissions;

    filtered.forEach((sub) => {
      if (sub.latitude && sub.longitude) {
        const color = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.other;
        const urgency = sub.urgency_score || 3;
        const radius = 7 + urgency * 2;
        const priority = getPriorityLabel(sub.priority_score);

        const marker = L.circleMarker([sub.latitude, sub.longitude], {
          radius,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        });

        const summary = getTranslated(sub, lang);
        const loc = sub.location_name || sub.ai_entities?.location_mentioned || '';
        const dept = sub.ai_entities?.department || '';
        const keywords = sub.ai_entities?.severity_keywords?.slice(0, 3) || [];

        marker.bindPopup(`
          <div style="min-width:260px;max-width:320px;font-family:system-ui;padding:0">
            <div style="background:${color};color:white;padding:10px 14px;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:8px">
              <span style="font-size:20px">${CATEGORY_ICONS[sub.category] || '📋'}</span>
              <div style="flex:1">
                <div style="font-weight:700;font-size:13px;text-transform:capitalize">${sub.category}</div>
                <div style="font-size:11px;opacity:0.9">${priority.label} Priority • Score: ${(sub.priority_score || 0).toFixed(1)}</div>
              </div>
              ${sub.source === 'ivr' ? '<span style="font-size:10px;background:rgba(255,255,255,0.25);padding:2px 8px;border-radius:999px;font-weight:600">📞 IVR</span>' : ''}
            </div>
            <div style="padding:12px 14px">
              <div style="font-size:13px;font-weight:600;color:#1f2937;line-height:1.4;margin-bottom:8px">
                ${summary || '(Voice/Photo submission)'}
              </div>
              ${loc ? `<div style="font-size:11px;color:#6b7280;display:flex;align-items:center;gap:4px;margin-bottom:4px">📍 ${loc}</div>` : ''}
              ${dept ? `<div style="font-size:11px;color:#6b7280;display:flex;align-items:center;gap:4px;margin-bottom:4px">🏢 ${dept}</div>` : ''}
              ${keywords.length > 0 ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">${keywords.map((k: string) => `<span style="font-size:10px;background:#f3f4f6;color:#374151;padding:2px 6px;border-radius:999px">${k}</span>`).join('')}</div>` : ''}
              ${sub.ai_suggestion ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;font-size:11px;color:#92400e">💡 ${sub.ai_suggestion.next_steps[0] || ''}</div>` : ''}
            </div>
          </div>
        `, { maxWidth: 340 });

        marker.on('click', () => {
          setSelectedSub(sub);
          mapInstanceRef.current.setView([sub.latitude!, sub.longitude!], 14, { animate: true });
        });

        markersRef.current.addLayer(marker);
        bounds.extend([sub.latitude, sub.longitude]);
      }
    });

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else if (filterCategory) {
      mapInstanceRef.current.setView([20.5937, 78.9629], 5);
    }
  }, [submissions, filterCategory, lang, L]);

  if (!L) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-lg" style={{ minHeight: '400px', background: 'var(--bg-tertiary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {selectedSub && (
        <div className="absolute top-3 right-3 rounded-xl shadow-2xl z-[1001] w-80 max-h-[70vh] overflow-y-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="sticky top-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: CATEGORY_COLORS[selectedSub.category] || '#6B7280' }}>
            <div className="flex items-center gap-2 text-white">
              <span className="text-xl">{CATEGORY_ICONS[selectedSub.category] || '📋'}</span>
              <div>
                <div className="font-bold text-sm capitalize">{selectedSub.category}</div>
                <div className="text-xs opacity-90">{getPriorityLabel(selectedSub.priority_score).label} • {(selectedSub.priority_score || 0).toFixed(1)}/10</div>
              </div>
            </div>
            <button onClick={() => setSelectedSub(null)} className="text-white/80 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {getTranslated(selectedSub, lang) || '(Voice/Photo submission)'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedSub.location_name && (
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5" style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedSub.location_name}</span>
                </div>
              )}
              {selectedSub.ai_entities?.department && (
                <div className="flex items-start gap-1.5">
                  <Building2 className="w-3.5 h-3.5 mt-0.5" style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedSub.ai_entities.department}</span>
                </div>
              )}
              {selectedSub.ai_entities?.affected_people && (
                <div className="flex items-start gap-1.5">
                  <Users className="w-3.5 h-3.5 mt-0.5" style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Affects: {selectedSub.ai_entities.affected_people}</span>
                </div>
              )}
              {selectedSub.ai_suggestion?.estimated_timeline && (
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 mt-0.5" style={{ color: 'var(--text-tertiary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedSub.ai_suggestion.estimated_timeline}</span>
                </div>
              )}
            </div>

            {selectedSub.ai_entities?.severity_keywords && selectedSub.ai_entities.severity_keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedSub.ai_entities.severity_keywords.slice(0, 4).map((kw, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{kw}</span>
                ))}
              </div>
            )}

            {selectedSub.ai_suggestion && (
              <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>
                  <Lightbulb className="w-3.5 h-3.5" />
                  AI Suggested Action
                </div>
                {selectedSub.ai_suggestion.next_steps.length > 0 && (
                  <ol className="space-y-1">
                    {selectedSub.ai_suggestion.next_steps.slice(0, 3).map((step, i) => (
                      <li key={i} className="text-[11px] flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-bold shrink-0" style={{ color: '#f59e0b' }}>{i + 1}.</span>{step}
                      </li>
                    ))}
                  </ol>
                )}
                {selectedSub.ai_suggestion.relevant_schemes && selectedSub.ai_suggestion.relevant_schemes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedSub.ai_suggestion.relevant_schemes.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 rounded-lg shadow-lg p-3 z-[1000]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Categories</div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
