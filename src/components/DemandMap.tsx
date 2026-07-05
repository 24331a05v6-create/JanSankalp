'use client';

import { useEffect, useRef, useState } from 'react';

interface Submission {
  id: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  theme_name: string | null;
  urgency_score: number | null;
  status: string;
}

interface Theme {
  id: string;
  name: string;
  submission_count: number;
  priority_score: number | null;
  center_lat?: number;
  center_lng?: number;
}

interface DemandMapProps {
  submissions: Submission[];
  themes: Theme[];
  onMarkerClick?: (submissionId: string) => void;
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

const URGENCY_COLORS = ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444'];

export function DemandMap({ submissions, themes, onMarkerClick }: DemandMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const [L, setL] = useState<any>(null);

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

    submissions.forEach((sub) => {
      if (sub.latitude && sub.longitude) {
        const color = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.other;
        const urgency = sub.urgency_score || 3;
        const radius = 6 + urgency * 2;

        const marker = L.circleMarker([sub.latitude, sub.longitude], {
          radius,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        });

        marker.bindPopup(`
          <div style="min-width:180px;font-family:system-ui">
            <div style="font-weight:600;margin-bottom:4px;color:${color}">${sub.theme_name || sub.category}</div>
            <div style="font-size:12px;color:#666">
              <div>Urgency: ${'★'.repeat(urgency)}${'☆'.repeat(5 - urgency)}</div>
            </div>
          </div>
        `);
        markersRef.current.addLayer(marker);
        bounds.extend([sub.latitude, sub.longitude]);
      }
    });

    themes.forEach((theme) => {
      if (theme.center_lat && theme.center_lng) {
        const size = Math.min(80, 20 + theme.submission_count * 3);
        const color = `hsl(${(theme.priority_score || 0) * 36}, 70%, 50%)`;

        const icon = L.divIcon({
          className: '',
          html: `<div style="width:${size}px;height:${size}px;background:${color}20;border:3px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:${color};font-family:system-ui">${theme.submission_count}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([theme.center_lat, theme.center_lng], { icon });
        marker.bindPopup(`
          <div style="min-width:200px;font-family:system-ui">
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${theme.name}</div>
            <div style="font-size:12px;color:#666">${theme.submission_count} submissions</div>
          </div>
        `);
        markersRef.current.addLayer(marker);
        bounds.extend([theme.center_lat, theme.center_lng]);
      }
    });

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [submissions, themes, onMarkerClick, L]);

  if (!L) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-xs font-semibold text-gray-700 mb-2">Categories</div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{cat}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs font-semibold text-gray-700 mb-1">Urgency</div>
          <div className="flex gap-1">
            {URGENCY_COLORS.map((c, i) => (
              <div key={i} className="w-5 h-3 rounded" style={{ backgroundColor: c }} title={`Level ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}