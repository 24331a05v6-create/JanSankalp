'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MapPin, Clock, Globe, Filter, Loader2, ChevronDown, ChevronRight, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; department: string }> = {
  healthcare: { label: 'Healthcare', icon: '🏥', color: '#EF4444', department: 'Health & Family Welfare' },
  water: { label: 'Water Supply', icon: '💧', color: '#3B82F6', department: 'Water Resources & PHE' },
  roads: { label: 'Roads & Transport', icon: '🛣️', color: '#F59E0B', department: 'Public Works (PWD)' },
  electricity: { label: 'Electricity', icon: '⚡', color: '#8B5CF6', department: 'Power Distribution' },
  sanitation: { label: 'Sanitation', icon: '🗑️', color: '#10B981', department: 'Swachh Bharat / Sanitation' },
  employment: { label: 'Employment', icon: '💼', color: '#6366F1', department: 'Employment & Skill Dev' },
  education: { label: 'Education', icon: '🎓', color: '#EC4899', department: 'Education Department' },
  other: { label: 'Other Issues', icon: '📋', color: '#6B7280', department: 'General Administration' },
};

const LANG_MAP: Record<string, string> = {
  en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil', kn: 'Kannada', ml: 'Malayalam',
  mr: 'Marathi', gu: 'Gujarati', bn: 'Bengali', or: 'Odia', pa: 'Punjabi', as: 'Assamese',
};

interface IVRComplaint {
  id: string;
  category: string;
  language: string;
  status: string;
  text_input: string | null;
  voice_transcript: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  ai_summary: string | null;
  ai_category: string | null;
  priority_score: number | null;
  urgency_score: number | null;
  ai_suggestion?: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  } | null;
  photo_url: string | null;
  created_at?: { seconds: number; nanoseconds: number } | string | null;
  allTranslations?: Record<string, string>;
}

export default function IVRComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<IVRComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lang, setLang] = useState('en');
  const [showLangs, setShowLangs] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-dashboard-lang') || 'en';
    setLang(saved);
  }, []);

  const switchLang = (code: string) => {
    localStorage.setItem('jansankalp-dashboard-lang', code);
    window.location.reload();
  };

  useEffect(() => {
    const fetchIVRComplaints = async () => {
      try {
        const res = await fetch('/api/submissions?limit=1000');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const ivrOnly = (data.submissions || []).filter((s: any) => s.source === 'ivr');
        setComplaints(ivrOnly);
      } catch (err) {
        setError('Failed to load IVR complaints');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIVRComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    if (filterCategory && c.category !== filterCategory) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  const formatDate = (createdAt: any): string => {
    if (!createdAt) return 'N/A';
    if (typeof createdAt === 'string') return new Date(createdAt).toLocaleString();
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();
    return 'N/A';
  };

  const getTranscript = (c: IVRComplaint): string => {
    if (c.text_input && c.text_input.length > 0) return c.text_input;
    if (c.voice_transcript) return c.voice_transcript;
    return 'No transcript available';
  };

  const getDisplayTranscript = (c: IVRComplaint): string => {
    const raw = getTranscript(c);
    if (raw.startsWith('Category:')) {
      const lines = raw.split('\n').filter(l => l.trim());
      const categoryLine = lines.find(l => l.startsWith('Category:'));
      const recordingLines = lines.filter(l => l.startsWith('['));
      return [
        categoryLine || null, '',
        recordingLines.length > 0 ? 'Complaint:' : null,
        ...recordingLines.map(l => l.replace(/^\[|\]$/g, '').replace(':', ': ')),
      ].filter(Boolean).join('\n');
    }
    return raw;
  };

  const getTranslatedTranscript = (c: IVRComplaint): string => {
    if (c.allTranslations?.[lang]) return c.allTranslations[lang];
    if (c.allTranslations?.['en']) return c.allTranslations['en'];
    return getTranscript(c);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 glass-strong" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </button>
              <div className="h-5 w-px" style={{ background: 'var(--border-primary)' }} />
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: '#f59e0b' }} />
                <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>IVR Complaints</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{filtered.length} complaints</span>
              <div className="relative">
                <button onClick={() => setShowLangs(!showLangs)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  <Globe className="w-4 h-4" />
                  {LANG_MAP[lang] || 'English'}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangs && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    {Object.entries(LANG_MAP).map(([code, name]) => (
                      <button key={code} onClick={() => switchLang(code)}
                        className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2"
                        style={{
                          background: lang === code ? 'var(--accent-primary)' : 'transparent',
                          color: lang === code ? 'white' : 'var(--text-secondary)',
                        }}>
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href="/ivr"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white' }}>
                <Phone className="w-4 h-4" />
                New IVR Complaint
              </a>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filters:</span>
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="input text-sm" style={{ width: 'auto', padding: '6px 12px' }}>
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_META).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="input text-sm" style={{ width: 'auto', padding: '6px 12px' }}>
            <option value="">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="analyzed">✅ Analyzed</option>
            <option value="processing">🔄 Processing</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--text-tertiary)' }} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Phone className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No IVR complaints found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Try adjusting your filters or submit a new complaint</p>
            <a href="/ivr" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#f59e0b', color: 'white' }}>
              <Phone className="w-4 h-4" /> Submit IVR Complaint
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((complaint) => {
              const meta = CATEGORY_META[complaint.category] || CATEGORY_META.other;
              const isExpanded = expandedId === complaint.id;

              return (
                <motion.div key={complaint.id} layout
                  className="card overflow-hidden"
                  style={{ transition: 'box-shadow 0.2s' }}>
                  <button onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                    className="w-full flex items-center gap-4 p-4 text-left transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta.color}15` }}>
                      <span className="text-xl">{meta.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{meta.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                          {complaint.language?.toUpperCase() || 'EN'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: complaint.status === 'analyzed' ? 'rgba(16,185,129,0.1)' : complaint.status === 'pending' ? 'rgba(234,179,8,0.1)' : 'var(--bg-tertiary)',
                            color: complaint.status === 'analyzed' ? '#10b981' : complaint.status === 'pending' ? '#eab308' : 'var(--text-secondary)',
                          }}>
                          {complaint.status === 'analyzed' ? '✓ Analyzed' : complaint.status === 'pending' ? '⏳ Pending' : complaint.status}
                        </span>
                      </div>
                      <p className="text-xs truncate max-w-lg" style={{ color: 'var(--text-tertiary)' }}>
                        {(() => {
                          const text = getTranslatedTranscript(complaint);
                          if (text.startsWith('Category:')) {
                            const lines = text.split('\n');
                            const categoryLine = lines.find(l => l.startsWith('Category:'));
                            const problemLine = lines.find(l => l.startsWith('[PROBLEM]:'));
                            const cat = categoryLine?.replace('Category: ', '') || '';
                            const problem = problemLine?.replace('[PROBLEM]:', '').trim() || '';
                            if (problem && problem !== 'Audio recorded' && problem !== 'Audio recorded - no speech detected') {
                              return `${cat} — ${problem.substring(0, 80)}`;
                            }
                            return cat || 'IVR Complaint';
                          }
                          return text.substring(0, 100) || 'IVR Complaint';
                        })()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(complaint.created_at)}
                        </div>
                      </div>
                      {isExpanded
                        ? <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                        : <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid var(--border-primary)' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Left */}
                            <div className="space-y-3">
                              <div className="rounded-lg p-3" style={{ background: 'var(--bg-tertiary)' }}>
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Complaint Details</h4>
                                <p className="text-sm whitespace-pre-wrap font-mono" style={{ color: 'var(--text-secondary)' }}>{getTranslatedTranscript(complaint)}</p>
                                {complaint.photo_url && (
                                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
                                    <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                      <Volume2 className="w-3 h-3" /> Audio Recording Available
                                    </p>
                                    <audio controls className="w-full h-8" src={complaint.photo_url}>
                                      Your browser does not support audio.
                                    </audio>
                                  </div>
                                )}
                              </div>

                              {(complaint.location_name || complaint.latitude) && (
                                <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.05)' }}>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                    <MapPin className="w-3 h-3" /> Location
                                  </h4>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{complaint.location_name || 'Location recorded'}</p>
                                  {complaint.latitude && complaint.longitude && (
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                                      📍 {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                                    </p>
                                  )}
                                </div>
                              )}

                              {complaint.ai_summary && (
                                <div className="rounded-lg p-3" style={{ background: 'rgba(139,92,246,0.05)' }}>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>AI Summary</h4>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{complaint.ai_summary}</p>
                                </div>
                              )}
                            </div>

                            {/* Right */}
                            <div className="space-y-3">
                              <div className="rounded-lg p-3" style={{ background: 'var(--bg-tertiary)' }}>
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span style={{ color: 'var(--text-tertiary)' }}>ID:</span>
                                    <span className="ml-1 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{complaint.id.substring(0, 8)}...</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-tertiary)' }}>Category:</span>
                                    <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-tertiary)' }}>Language:</span>
                                    <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>{LANG_MAP[complaint.language] || complaint.language}</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-tertiary)' }}>Department:</span>
                                    <span className="ml-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{meta.department}</span>
                                  </div>
                                  {complaint.priority_score != null && (
                                    <div>
                                      <span style={{ color: 'var(--text-tertiary)' }}>Priority:</span>
                                      <span className="ml-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>{complaint.priority_score.toFixed(1)}/10</span>
                                    </div>
                                  )}
                                  {complaint.urgency_score != null && (
                                    <div>
                                      <span style={{ color: 'var(--text-tertiary)' }}>Urgency:</span>
                                      <span className="ml-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>{complaint.urgency_score.toFixed(1)}/10</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {complaint.ai_suggestion && (
                                <div className="rounded-lg p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>AI Action Plan</h4>
                                  <div className="space-y-2">
                                    {complaint.ai_suggestion.next_steps?.slice(0, 3).map((step, i) => (
                                      <div key={i} className="flex items-start gap-2 text-sm">
                                        <span style={{ color: '#10b981' }} className="mt-0.5">✓</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{step}</span>
                                      </div>
                                    ))}
                                    {complaint.ai_suggestion.responsible_department && (
                                      <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                        <span className="font-medium">Responsible:</span> {complaint.ai_suggestion.responsible_department}
                                      </p>
                                    )}
                                    {complaint.ai_suggestion.estimated_timeline && (
                                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                        <span className="font-medium">Timeline:</span> {complaint.ai_suggestion.estimated_timeline}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {complaint.photo_url && (
                                <div className="rounded-lg p-3" style={{ background: 'rgba(245,158,11,0.05)' }}>
                                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                                    <Volume2 className="w-3 h-3" /> Audio Recording
                                  </h4>
                                  <audio controls className="w-full h-8" src={complaint.photo_url}>
                                    Your browser does not support audio.
                                  </audio>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
