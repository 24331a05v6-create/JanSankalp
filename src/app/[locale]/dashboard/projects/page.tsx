'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Globe, ChevronDown, Loader2, Plus, X, Trash2,
  Trophy, Target, MapPin, Users, AlertTriangle, TrendingUp,
  Clock, FileText, CheckCircle2, Lightbulb, BarChart3
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Link from 'next/link';

const LANGS = [
  { code: 'en', native: 'English' }, { code: 'hi', native: 'हिन्दी' }, { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' }, { code: 'kn', native: 'ಕನ್ನಡ' }, { code: 'ml', native: 'മലയാളം' },
  { code: 'mr', native: 'मराठी' }, { code: 'gu', native: 'ગુજરાતી' }, { code: 'bn', native: 'বাংলা' },
  { code: 'or', native: 'ଓଡ଼ିଆ' }, { code: 'pa', native: 'ਪੰਜਾਬੀ' }, { code: 'as', native: 'অসমীয়া' },
];

const CATEGORIES = [
  { value: 'roads', label: 'Road Repair', icon: '🛣️' },
  { value: 'education', label: 'School Upgrade', icon: '🎓' },
  { value: 'water', label: 'Water Supply', icon: '💧' },
  { value: 'sanitation', label: 'Drainage System', icon: '🧹' },
  { value: 'healthcare', label: 'Hospital', icon: '🏥' },
  { value: 'employment', label: 'Public Transport', icon: '🚌' },
  { value: 'electricity', label: 'Street Lights', icon: '💡' },
  { value: 'other', label: 'Skill Development Centre', icon: '💼' },
];

const T: Record<string, any> = {
  en: {
    title: 'Project Prioritization',
    subtitle: 'AI-powered ranking of proposed development projects based on citizen demand',
    addProject: 'Add Project',
    analyze: 'Analyze Projects',
    analyzing: 'Analyzing...',
    noProjects: 'No projects added yet',
    noProjectsHint: 'Add proposed development projects to get AI-powered prioritization',
    projectName: 'Project Name',
    category: 'Category',
    estimatedCost: 'Estimated Cost (optional)',
    targetArea: 'Target Area',
    add: 'Add',
    cancel: 'Cancel',
    rank: 'Rank',
    priorityScore: 'Priority Score',
    relatedComplaints: 'Related Complaints',
    hotspots: 'Hotspots',
    affectedAreas: 'Affected Areas',
    whyRecommendation: 'Why This Recommendation?',
    expectedImpact: 'Expected Impact',
    citizensBenefited: 'Citizens Benefited',
    urgency: 'Urgency',
    suggestedScheme: 'Suggested Scheme',
    reason: 'Reason',
    clearAll: 'Clear All',
    totalAnalyzed: 'Total Complaints Analyzed',
    aiPowered: 'AI-Powered',
    localAnalysis: 'Local Analysis',
    filterCategory: 'All Categories',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
  hi: {
    title: 'परियोजना प्राथमिकता निर्धारण',
    subtitle: 'नागरिक मांग के आधार पर प्रस्तावित विकास परियोजनाओं की AI-संचालित रैंकिंग',
    addProject: 'परियोजना जोड़ें',
    analyze: 'परियोजनाओं का विश्लेषण करें',
    analyzing: 'विश्लेषण हो रहा है...',
    noProjects: 'अभी तक कोई परियोजना नहीं जोड़ी गई',
    noProjectsHint: 'AI-संचालित प्राथमिकता प्राप्त करने के लिए प्रस्तावित विकास परियोजनाएं जोड़ें',
    projectName: 'परियोजना का नाम',
    category: 'श्रेणी',
    estimatedCost: 'अनुमानित लागत (वैकल्पिक)',
    targetArea: 'लक्षित क्षेत्र',
    add: 'जोड़ें',
    cancel: 'रद्द करें',
    rank: 'रैंक',
    priorityScore: 'प्राथमिकता स्कोर',
    relatedComplaints: 'संबंधित शिकायतें',
    hotspots: 'हॉटस्पॉट',
    affectedAreas: 'प्रभावित क्षेत्र',
    whyRecommendation: 'यह सिफारिश क्यों?',
    expectedImpact: 'अपेक्षित प्रभाव',
    citizensBenefited: 'लाभान्वित नागरिक',
    urgency: 'तात्कालिकता',
    suggestedScheme: 'सुझाई गई योजना',
    reason: 'कारण',
    clearAll: 'सभी साफ करें',
    totalAnalyzed: 'कुल विश्लेषित शिकायतें',
    aiPowered: 'AI-संचालित',
    localAnalysis: 'स्थानीय विश्लेषण',
    filterCategory: 'सभी श्रेणियां',
    critical: 'गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
  },
};

interface ProjectInput {
  name: string;
  category: string;
  estimated_cost: string;
  target_area: string;
}

interface RankedProject {
  rank: number;
  project_name: string;
  category: string;
  priority_score: number;
  related_complaints: number;
  duplicate_complaints: number;
  avg_priority_score: number;
  hotspot_locations: number;
  affected_areas: number;
  responsible_department: string;
  reason_for_recommendation: string;
  expected_impact: string;
  citizens_benefited: string;
  urgency: string;
  urgency_reason: string;
  suggested_scheme: string;
  why_this_recommendation: string[];
  estimated_cost?: string;
  target_area?: string;
}

export default function ProjectPrioritizationPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [showLangs, setShowLangs] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectInput[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState<ProjectInput>({
    name: '', category: 'roads', estimated_cost: '', target_area: '',
  });

  // Analysis state
  const [rankedProjects, setRankedProjects] = useState<RankedProject[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);
  const [aiPowered, setAiPowered] = useState(false);

  // Filter
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-dashboard-lang') || 'en';
    setLang(saved);
    setMounted(true);
    // Load saved projects
    const savedProjects = localStorage.getItem('jansankalp-projects');
    if (savedProjects) {
      try { setProjects(JSON.parse(savedProjects)); } catch {}
    }
  }, []);

  const t = T[lang] || T.en;

  const switchLang = (code: string) => {
    localStorage.setItem('jansankalp-dashboard-lang', code);
    window.location.reload();
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const updated = [...projects, { ...newProject }];
    setProjects(updated);
    localStorage.setItem('jansankalp-projects', JSON.stringify(updated));
    setNewProject({ name: '', category: 'roads', estimated_cost: '', target_area: '' });
    setShowAddModal(false);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem('jansankalp-projects', JSON.stringify(updated));
  };

  const clearAll = () => {
    setProjects([]);
    setRankedProjects([]);
    localStorage.removeItem('jansankalp-projects');
  };

  const analyzeProjects = async () => {
    if (projects.length === 0) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/projects/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });
      const data = await res.json();
      if (data.success) {
        setRankedProjects(data.projects || []);
        setTotalAnalyzed(data.total_submissions_analyzed || 0);
        setAiPowered(data.ai_powered || false);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredRanked = filterCategory
    ? rankedProjects.filter(p => p.category === filterCategory)
    : rankedProjects;

  const getPriorityColor = (score: number) => {
    if (score >= 80) return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' };
    if (score >= 60) return { bg: 'rgba(249,115,22,0.1)', text: '#f97316', border: 'rgba(249,115,22,0.2)' };
    if (score >= 40) return { bg: 'rgba(234,179,8,0.1)', text: '#eab308', border: 'rgba(234,179,8,0.2)' };
    return { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.2)' };
      case 'high': return { bg: 'rgba(249,115,22,0.1)', text: '#f97316', border: 'rgba(249,115,22,0.2)' };
      case 'medium': return { bg: 'rgba(234,179,8,0.1)', text: '#eab308', border: 'rgba(234,179,8,0.2)' };
      default: return { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' };
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', bg: 'linear-gradient(135deg, #f59e0b, #f97316)', text: '#fff' };
    if (rank === 2) return { icon: '🥈', bg: 'linear-gradient(135deg, #94a3b8, #64748b)', text: '#fff' };
    if (rank === 3) return { icon: '🥉', bg: 'linear-gradient(135deg, #d97706, #b45309)', text: '#fff' };
    return { icon: `#${rank}`, bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)' };
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-strong" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}/dashboard`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-5 w-px" style={{ background: 'var(--border-primary)' }} />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowLangs(!showLangs)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                <Globe className="w-4 h-4" />
                <span>{LANGS.find(l => l.code === lang)?.native || 'English'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangs && (
                <div className="absolute right-0 top-full mt-2 rounded-xl shadow-xl p-2 z-50 grid grid-cols-3 gap-1 w-64"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => switchLang(l.code)}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${lang === l.code ? 'font-semibold' : ''}`}
                      style={{
                        background: lang === l.code ? 'var(--accent-primary)' : 'transparent',
                        color: lang === l.code ? 'white' : 'var(--text-secondary)',
                      }}>
                      {l.native}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.subtitle}</p>
            {rankedProjects.length > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                  <FileText className="w-3 h-3" /> {t.totalAnalyzed}: {totalAnalyzed}
                </span>
                <span className="badge" style={{
                  background: aiPowered ? 'rgba(59,130,246,0.1)' : 'rgba(234,179,8,0.1)',
                  color: aiPowered ? '#3b82f6' : '#eab308',
                  border: `1px solid ${aiPowered ? 'rgba(59,130,246,0.2)' : 'rgba(234,179,8,0.2)'}`,
                }}>
                  <Lightbulb className="w-3 h-3" /> {aiPowered ? t.aiPowered : t.localAnalysis}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {projects.length > 0 && (
              <button onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                <Trash2 className="w-4 h-4" />
                {t.clearAll}
              </button>
            )}
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--accent-gradient)', color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
              <Plus className="w-4 h-4" />
              {t.addProject}
            </button>
          </div>
        </div>

        {/* Project Input Cards */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              {t.addProject} ({projects.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {projects.map((p, i) => {
                const cat = CATEGORIES.find(c => c.value === p.category);
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                    <span>{cat?.icon || '📋'}</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                    {p.target_area && <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>• {p.target_area}</span>}
                    <button onClick={() => removeProject(i)} className="ml-1 p-0.5 rounded hover:bg-red-100 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Analyze Button */}
            <button onClick={analyzeProjects} disabled={analyzing || projects.length === 0}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  {t.analyze}
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && rankedProjects.length === 0 && (
          <div className="text-center py-20">
            <Target className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.noProjects}</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>{t.noProjectsHint}</p>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 mx-auto rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
              <Plus className="w-4 h-4" />
              {t.addProject}
            </button>
          </div>
        )}

        {/* Filter */}
        {rankedProjects.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t.filterCategory}:</span>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="input text-sm" style={{ width: 'auto', padding: '6px 12px' }}>
              <option value="">{t.filterCategory}</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Ranked Projects */}
        <div className="space-y-4">
          {filteredRanked.map((project) => {
            const priorityColor = getPriorityColor(project.priority_score);
            const urgencyColor = getUrgencyColor(project.urgency);
            const rankBadge = getRankBadge(project.rank);
            const cat = CATEGORIES.find(c => c.value === project.category);

            return (
              <div key={project.rank} className="card overflow-hidden animate-fade-in"
                style={{ borderLeft: `4px solid ${priorityColor.text}` }}>
                {/* Header */}
                <div className="flex items-start gap-4 p-5">
                  {/* Rank Badge */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                      style={{ background: rankBadge.bg, color: rankBadge.text }}>
                      {project.rank <= 3 ? rankBadge.icon : <span style={{ color: 'var(--text-secondary)' }}>{rankBadge.icon}</span>}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{cat?.icon || '📋'}</span>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{project.project_name}</h3>
                      {project.target_area && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                          📍 {project.target_area}
                        </span>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {/* Priority Score */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: priorityColor.bg, border: `1px solid ${priorityColor.border}` }}>
                        <span className="text-xs font-medium" style={{ color: priorityColor.text }}>{t.priorityScore}</span>
                        <span className="text-lg font-black" style={{ color: priorityColor.text }}>{project.priority_score}</span>
                        <span className="text-xs" style={{ color: priorityColor.text }}>/100</span>
                      </div>

                      {/* Complaints */}
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <FileText className="w-4 h-4" />
                        <span className="font-semibold">{project.related_complaints}</span> {t.relatedComplaints}
                      </div>

                      {/* Hotspots */}
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">{project.hotspot_locations}</span> {t.hotspots}
                      </div>

                      {/* Urgency */}
                      <span className="badge" style={{ background: urgencyColor.bg, color: urgencyColor.text, border: `1px solid ${urgencyColor.border}` }}>
                        <AlertTriangle className="w-3 h-3" />
                        {t.urgency}: {project.urgency}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${project.priority_score}%`, background: priorityColor.text }} />
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Section */}
                <div className="px-5 pb-5">
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                    {/* Reason */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                        <Lightbulb className="w-3 h-3" /> {t.reason}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{project.reason_for_recommendation}</p>
                    </div>

                    {/* Why This Recommendation */}
                    {project.why_this_recommendation && project.why_this_recommendation.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          {t.whyRecommendation}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.why_this_recommendation.map((reason, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                              <CheckCircle2 className="w-3 h-3" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Impact Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                        <p className="text-[10px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{t.expectedImpact}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{project.expected_impact}</p>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                        <p className="text-[10px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{t.citizensBenefited}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{project.citizens_benefited}</p>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                        <p className="text-[10px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{t.suggestedScheme}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{project.suggested_scheme || 'N/A'}</p>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                        <p className="text-[10px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{t.responsible_department}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{project.responsible_department}</p>
                      </div>
                    </div>

                    {/* Urgency Reason */}
                    {project.urgency_reason && (
                      <div className="mt-3 flex items-start gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{project.urgency_reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {analyzing && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.analyzing}</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Analyzing {projects.length} projects against {totalAnalyzed || '...'} complaints
            </p>
          </div>
        )}
      </main>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-scale-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.addProject}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.projectName} *</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="input" placeholder="e.g. Road Repair in Ward 5" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.category}</label>
                <select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="input">
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.estimatedCost}</label>
                <input type="text" value={newProject.estimated_cost} onChange={(e) => setNewProject({ ...newProject, estimated_cost: e.target.value })}
                  className="input" placeholder="e.g. ₹50,00,000" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.targetArea}</label>
                <input type="text" value={newProject.target_area} onChange={(e) => setNewProject({ ...newProject, target_area: e.target.value })}
                  className="input" placeholder="e.g. Ward 5, Central District" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                {t.cancel}
              </button>
              <button onClick={addProject} disabled={!newProject.name.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                {t.add}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
