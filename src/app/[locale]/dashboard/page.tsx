'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft, Users, Lightbulb, TrendingUp, MapPin,
  RefreshCw, Loader2
} from 'lucide-react';
import { DemandMap } from '@/components/DemandMap';
import { ThemeCard } from '@/components/ThemeCard';
import { StatsCard } from '@/components/StatsCard';
import { CategoryChart } from '@/components/CategoryChart';
import { ThemeDetailModal } from '@/components/ThemeDetailModal';

interface Submission {
  id: string;
  text_input: string | null;
  voice_transcript: string | null;
  category: string;
  language: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  theme_id: string | null;
  theme_name: string | null;
  urgency_score: number | null;
  priority_score: number | null;
  status: string;
  created_at: string;
}

interface Theme {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  submission_count: number;
  avg_urgency: number | null;
  priority_score: number | null;
  representative_submissions: string[];
  center_lat?: number;
  center_lng?: number;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const nav = useTranslations('nav');

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [themeSubmissions, setThemeSubmissions] = useState<Submission[]>([]);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subRes, themeRes] = await Promise.all([
        fetch('/api/submissions?limit=200'),
        fetch('/api/analyze?limit=20'),
      ]);

      const subData = await subRes.json();
      const themeData = await themeRes.json();

      setSubmissions(subData.submissions || []);
      setThemes(themeData.themes || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load data. Make sure your environment variables are set.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      await fetch('/api/analyze', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const openThemeDetail = async (theme: Theme) => {
    setSelectedTheme(theme);
    try {
      const res = await fetch(`/api/submissions?theme_id=${theme.id}&limit=10`);
      const data = await res.json();
      setThemeSubmissions(data.submissions || []);
    } catch {
      setThemeSubmissions([]);
    }
  };

  const filteredSubmissions = filterCategory
    ? submissions.filter(s => s.category === filterCategory)
    : submissions;

  const categoryCounts = submissions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    total: submissions.length,
    activeThemes: themes.length,
    topPriority: themes.reduce((max, t) => Math.max(max, t.priority_score || 0), 0),
    coverage: new Set(submissions.filter(s => s.latitude).map(s => `${s.latitude?.toFixed(2)},${s.longitude?.toFixed(2)}`)).size,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JS</span>
              </div>
              <span className="font-bold text-lg text-gray-900">{t('title')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Users} label={t('stats.totalSubmissions')} value={stats.total} color="#3B82F6" />
          <StatsCard icon={Lightbulb} label={t('stats.activeThemes')} value={stats.activeThemes} color="#8B5CF6" />
          <StatsCard icon={TrendingUp} label={t('stats.topPriority')} value={stats.topPriority.toFixed(1)} color="#EF4444" />
          <StatsCard icon={MapPin} label={t('stats.coverage')} value={`${stats.coverage} areas`} color="#10B981" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">{t('map.title')}</h2>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="roads">Roads</option>
                  <option value="water">Water</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="employment">Employment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ height: '450px' }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  <DemandMap submissions={filteredSubmissions} themes={themes} />
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{t('themes.title')}</h2>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : themes.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No themes analyzed yet</p>
                  <p className="text-sm text-gray-400">Submit some requests, then click Run AI Analysis</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <ThemeCard key={theme.id} theme={theme} onClick={() => openThemeDetail(theme)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Submissions by Category</h3>
              <CategoryChart data={categoryCounts} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Submissions</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : submissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No submissions yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {submissions.slice(0, 15).map((sub) => (
                    <div key={sub.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {sub.text_input || sub.voice_transcript || '(Voice/Photo)'}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="capitalize px-1.5 py-0.5 bg-white rounded border border-gray-200">{sub.category}</span>
                        <span>{sub.language.toUpperCase()}</span>
                        {sub.location_name && <span className="truncate max-w-[100px]">{sub.location_name}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  Citizens submit requests via text, voice, or photos
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  AI clusters similar requests into themes
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  Urgency and priority scores are calculated
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">4.</span>
                  MP sees ranked priorities on the dashboard
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      {selectedTheme && (
        <ThemeDetailModal
          theme={selectedTheme}
          submissions={themeSubmissions}
          onClose={() => { setSelectedTheme(null); setThemeSubmissions([]); }}
        />
      )}
    </div>
  );
}