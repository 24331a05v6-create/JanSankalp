'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, MapPin, Building2, FileText, Download,
  Filter, Layers, Zap, Droplets, Plus, X, Trophy,
  HeartPulse, GraduationCap, Trash2, Lightbulb, Briefcase,
  MoreHorizontal, RefreshCw, Loader2, Users, IndianRupee, Clock, Info
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface MergedIssue {
  id: string;
  representative_query: string;
  representative_query_translations: Record<string, string>;
  category: string;
  complaint_count: number;
  priority_score: number;
  merged_submission_ids: string[];
  locations: string[];
  departments: string[];
  severity_keywords: string[];
  ai_suggestion?: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  };
  resolved?: boolean;
  resolved_at?: string | null;
  created_at?: string;
}

interface Proposal {
  id: string;
  name: string;
  category: string;
  targetArea: string;
  estimatedCost: string;
  description: string;
}

interface EvaluatedProposal extends Proposal {
  relatedComplaints: number;
  avgPriority: number;
  mergedCount: number;
  hotspotCount: number;
  affectedLocations: Set<string>;
  unresolvedCount: number;
  existingNeedScore: number;
  proposalScore: number;
  estimatedCitizens: number;
  suggestedBudget: string;
  whyRanked: string[];
  rank: number;
}

const SECTOR_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  roads: { label: 'Road Infrastructure', icon: Building2, color: '#f59e0b' },
  water: { label: 'Water Supply', icon: Droplets, color: '#06b6d4' },
  healthcare: { label: 'Healthcare', icon: HeartPulse, color: '#ef4444' },
  education: { label: 'Education', icon: GraduationCap, color: '#ec4899' },
  sanitation: { label: 'Sanitation', icon: Trash2, color: '#8b5cf6' },
  electricity: { label: 'Electricity', icon: Lightbulb, color: '#f97316' },
  employment: { label: 'Employment', icon: Briefcase, color: '#10b981' },
  other: { label: 'Other Sectors', icon: MoreHorizontal, color: '#64748b' },
};

const SECTOR_KEYWORDS: Record<string, string[]> = {
  roads: ['road', 'transport', 'traffic', 'highway', 'pothole', 'bridge', 'street', 'bus', 'metro', 'flyover'],
  water: ['water', 'pipe', 'supply', 'drinking', 'borewell', 'tanker', 'flood', 'rain'],
  healthcare: ['health', 'hospital', 'doctor', 'medicine', 'clinic', 'ambulance', 'pharmacy', 'medical'],
  education: ['school', 'college', 'education', 'teacher', 'student', 'library', 'university'],
  sanitation: ['sanitation', 'garbage', 'waste', 'toilet', 'sewage', 'drain', 'clean', 'swachh'],
  electricity: ['electric', 'power', 'light', 'transformer', 'outage', 'voltage', 'wire', 'meter'],
  employment: ['employment', 'job', 'work', 'skill', 'unemployment', 'labor', 'factory', 'wage'],
  other: [],
};

const PRIORITY_LEVELS = [
  { min: 7, label: 'Critical', color: '#ef4444' },
  { min: 5, label: 'High', color: '#f97316' },
  { min: 3, label: 'Medium', color: '#eab308' },
  { min: 0, label: 'Low', color: '#22c55e' },
];

const BUDGET_MAP = [
  { min: 90, budget: '₹3 Crore' },
  { min: 80, budget: '₹2 Crore' },
  { min: 70, budget: '₹1 Crore' },
  { min: 60, budget: '₹50 Lakhs' },
  { min: 0, budget: '₹25 Lakhs' },
];

const POPULATION_PER_LOCATION = 2500;

const PROPOSAL_STORAGE_KEY = 'jansankalp-evaluator-proposals';

const DASHBOARD_TEXT: Record<string, Record<string, string>> = {
  en: {
    title: 'Development Proposal Evaluator',
    back: 'Dashboard',
    addProposal: 'Add Proposal',
    evaluateAll: 'Evaluate Proposals',
    evaluating: 'Evaluating...',
    projectName: 'Project Name',
    category: 'Category',
    targetArea: 'Target Area',
    estimatedCost: 'Estimated Cost (optional)',
    description: 'Description (optional)',
    cancel: 'Cancel',
    save: 'Save Proposal',
    proposalScore: 'Proposal Score',
    relatedComplaints: 'Related Complaints',
    mergedComplaints: 'Merged Complaints',
    affectedLocations: 'Affected Locations',
    hotspots: 'Hotspots',
    unresolved: 'Unresolved',
    estimatedCitizens: 'Est. Citizens',
    suggestedBudget: 'Suggested Budget',
    whyRanked: 'Why this Proposal Ranked Here',
    comparisonView: 'Comparison View',
    bestProposal: 'Best Proposal Recommendation',
    recommended: 'Recommended Project',
    reason: 'Reason',
    charts: 'Visual Analytics',
    exportPdf: 'Export PDF',
    filters: 'Filters',
    all: 'All',
    rank: 'Rank',
    project: 'Project',
    score: 'Score',
    complaints: 'Complaints',
    needScore: 'Need Score',
    citizens: 'Citizens',
    budget: 'Budget',
    priority: 'Priority',
    winner: 'Winner',
    noProposals: 'No proposals yet. Click "Add Proposal" to get started.',
    loading: 'Loading complaint data...',
    lastUpdated: 'Last Updated',
    deleteProposal: 'Delete',
    editProposal: 'Edit',
    proposalRanking: 'Proposal Ranking',
    scoreComparison: 'Score Comparison',
    citizenDemand: 'Citizen Demand',
    budgetComparison: 'Budget Comparison',
    hotspotComparison: 'Hotspot Comparison',
    highestScore: 'Highest Proposal Score',
    largestImpact: 'Largest citizen demand',
    mostHotspots: 'Most hotspot coverage',
    mostUnresolved: 'Most unresolved complaints',
    proposalSaved: 'Proposals saved',
  },
  hi: {
    title: 'विकास प्रस्ताव मूल्यांकनकर्ता',
    back: 'डैशबोर्ड',
    addProposal: 'प्रस्ताव जोड़ें',
    evaluateAll: 'प्रस्तावों का मूल्यांकन करें',
    evaluating: 'मूल्यांकन हो रहा है...',
    projectName: 'परियोजना का नाम',
    category: 'श्रेणी',
    targetArea: 'लक्षित क्षेत्र',
    estimatedCost: 'अनुमानित लागत (वैकल्पिक)',
    description: 'विवरण (वैकल्पिक)',
    cancel: 'रद्द करें',
    save: 'प्रस्ताव सहेजें',
    proposalScore: 'प्रस्ताव स्कोर',
    relatedComplaints: 'संबंधित शिकायतें',
    mergedComplaints: 'विलय शिकायतें',
    affectedLocations: 'प्रभावित स्थान',
    hotspots: 'हॉटस्पॉट',
    unresolved: 'अनसुलझी',
    estimatedCitizens: 'अनुमानित नागरिक',
    suggestedBudget: 'अनुशंसित बजट',
    whyRanked: 'यह प्रस्ताव यहाँ क्यों रैंक किया गया',
    comparisonView: 'तुलना दृश्य',
    bestProposal: 'सर्वोत्तम प्रस्ताव सिफारिश',
    recommended: 'अनुशंसित परियोजना',
    reason: 'कारण',
    charts: 'दृश्य विश्लेषण',
    exportPdf: 'PDF निर्यात',
    filters: 'फ़िल्टर',
    all: 'सभी',
    rank: 'रैंक',
    project: 'परियोजना',
    score: 'स्कोर',
    complaints: 'शिकायतें',
    needScore: 'आवश्यकता स्कोर',
    citizens: 'नागरिक',
    budget: 'बजट',
    priority: 'प्राथमिकता',
    winner: 'विजेता',
    noProposals: 'अभी तक कोई प्रस्ताव नहीं। शुरू करने के लिए "प्रस्ताव जोड़ें" पर क्लिक करें।',
    loading: 'शिकायत डेटा लोड हो रहा है...',
    lastUpdated: 'अंतिम अपडेट',
    deleteProposal: 'हटाएं',
    editProposal: 'संपादित करें',
    proposalRanking: 'प्रस्ताव रैंकिंग',
    scoreComparison: 'स्कोर तुलना',
    citizenDemand: 'नागरिक माँग',
    budgetComparison: 'बजट तुलना',
    hotspotComparison: 'हॉटस्पॉट तुलना',
    highestScore: 'सर्वोच्च प्रस्ताव स्कोर',
    largestImpact: 'सबसे बड़ी नागरिक माँग',
    mostHotspots: 'सबसे अधिक हॉटस्पॉत कवरेज',
    mostUnresolved: 'सबसे अधिक अनसुलझी शिकायतें',
    proposalSaved: 'प्रस्ताव सहेजे गए',
  },
  ta: {
    title: 'மேம்பாட்டு திட்ட மதிப்பீட்டாளர்',
    back: 'டாஷ்போர்டு',
    addProposal: 'திட்டம் சேர்',
    evaluateAll: 'திட்டங்களை மதிப்பிடு',
    evaluating: 'மதிப்பிடுகிறது...',
    projectName: 'திட்டத்தின் பெயர்',
    category: 'வகை',
    targetArea: 'இலக்கு பகுதி',
    estimatedCost: 'மதிப்பிடப்பட்ட செலவு (விரும்பினால்)',
    description: 'விளக்கம் (விரும்பினால்)',
    cancel: 'ரத்துசெய்',
    save: 'திட்டத்தைச் சேமி',
    proposalScore: 'திட்ட மதிப்பெண்',
    relatedComplaints: 'தொடர்புடைய புகார்கள்',
    mergedComplaints: 'இணைக்கப்பட்ட புகார்கள்',
    affectedLocations: 'பாதிக்கப்பட்ட இடங்கள்',
    hotspots: 'ஹாட்ஸ்பாட்கள்',
    unresolved: 'தீர்க்கப்படாத',
    estimatedCitizens: 'மதிப்பிடப்பட்ட குடிமக்கள்',
    suggestedBudget: 'பரிந்துரைக்கப்பட்ட பட்ஜெட்',
    whyRanked: 'இந்த திட்டம் ஏன் இங்கே தரவரிசை',
    comparisonView: 'ஒப்பீட்டு காட்சி',
    bestProposal: 'சிறந்த திட்ட பரிந்துரை',
    recommended: 'பரிந்துரைக்கப்பட்ட திட்டம்',
    reason: 'காரணம்',
    charts: 'காட்சி பகுப்பாய்வு',
    exportPdf: 'PDF ஏற்றுமதி',
    filters: 'வடிகட்டிகள்',
    all: 'அனைத்தும்',
    rank: 'தரவரிசை',
    project: 'திட்டம்',
    score: 'மதிப்பெண்',
    complaints: 'புகார்கள்',
    needScore: 'தேவை மதிப்பெண்',
    citizens: 'குடிமக்கள்',
    budget: 'பட்ஜெட்',
    priority: 'முன்னுரிமை',
    winner: 'வெற்றியாளர்',
    noProposals: 'இன்னும் திட்டங்கள் இல்லை. தொடங்க "திட்டம் சேர்" என்பதைக் கிளிக் செய்யவும்.',
    loading: 'புகார் தரவு ஏற்றுகிறது...',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    deleteProposal: 'நீக்கு',
    editProposal: 'திருத்து',
    proposalRanking: 'திட்ட தரவரிசை',
    scoreComparison: 'மதிப்பெண் ஒப்பீடு',
    citizenDemand: 'குடிமக்கள் தேவை',
    budgetComparison: 'பட்ஜெட் ஒப்பீடு',
    hotspotComparison: 'ஹாட்ஸ்பாட் ஒப்பீடு',
    highestScore: 'உயர்ந்த திட்ட மதிப்பெண்',
    largestImpact: 'மிகப்பெரிய குடிமக்கள் தேவை',
    mostHotspots: 'அதிக ஹாட்ஸ்பாட் கவரேஜ்',
    mostUnresolved: 'அதிக தீர்க்கப்படாத புகார்கள்',
    proposalSaved: 'திட்டங்கள் சேமிக்கப்பட்டன',
  },
};

const LANGUAGES = ['en', 'hi', 'ta'] as const;

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const dur = duration * 1000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

export default function ProposalEvaluatorPage() {
  const [mergedIssues, setMergedIssues] = useState<MergedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('roads');
  const [formArea, setFormArea] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const t = DASHBOARD_TEXT[lang] || DASHBOARD_TEXT.en;

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('jansankalp-dashboard-lang') : null;
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) setLang(saved);
    const savedProposals = typeof window !== 'undefined' ? localStorage.getItem(PROPOSAL_STORAGE_KEY) : null;
    if (savedProposals) {
      try { setProposals(JSON.parse(savedProposals)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (proposals.length > 0 || typeof window !== 'undefined') {
      localStorage.setItem(PROPOSAL_STORAGE_KEY, JSON.stringify(proposals));
    }
  }, [proposals]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/merge-complaints');
      const data = await res.json();
      setMergedIssues(data.merged_issues || []);
      setLastUpdated(new Date());
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const matchedIssues = useMemo(() => {
    return mergedIssues.filter(issue => {
      if (filterCategory !== 'all' && issue.category !== filterCategory) return false;
      return true;
    });
  }, [mergedIssues, filterCategory]);

  const evaluatedProposals = useMemo(() => {
    if (matchedIssues.length === 0) return [];

    const totalComplaints = matchedIssues.reduce((s, i) => s + i.complaint_count, 0);
    const maxComplaints = Math.max(...matchedIssues.map(i => i.complaint_count), 1);

    const evaluated: EvaluatedProposal[] = proposals.map(proposal => {
      const keywords = SECTOR_KEYWORDS[proposal.category] || [];
      const nameLower = proposal.name.toLowerCase();
      const areaLower = proposal.targetArea.toLowerCase();

      const relatedIssues = matchedIssues.filter(issue => {
        if (issue.category === proposal.category) return true;
        const query = issue.representative_query.toLowerCase();
        const locs = issue.locations.join(' ').toLowerCase();
        if (keywords.some(kw => query.includes(kw) || locs.includes(kw))) return true;
        if (nameLower.split(' ').some(w => w.length > 3 && query.includes(w))) return true;
        if (areaLower && locs.includes(areaLower)) return true;
        return false;
      });

      const relatedCount = relatedIssues.reduce((s, i) => s + i.complaint_count, 0);
      const avgPri = relatedIssues.length > 0
        ? relatedIssues.reduce((s, i) => s + i.priority_score, 0) / relatedIssues.length
        : 0;

      const hotspotSet = new Set<string>();
      const locationSet = new Set<string>();
      relatedIssues.forEach(issue => {
        issue.locations.forEach(loc => {
          locationSet.add(loc);
          const match = loc.match(/,\s*([^,]+)$/);
          if (match) hotspotSet.add(match[1].trim());
        });
      });

      const unresolved = relatedIssues.filter(i => !i.resolved).reduce((s, i) => s + i.complaint_count, 0);
      const needScore = relatedIssues.length > 0
        ? relatedIssues.reduce((s, i) => s + i.priority_score, 0) / relatedIssues.length * 10
        : 0;

      const countNorm = totalComplaints > 0 ? (relatedCount / maxComplaints) * 100 : 0;
      const priorityNorm = (avgPri / 10) * 100;
      const hotspotNorm = hotspotSet.size > 0 ? Math.min(100, hotspotSet.size * 20) : 0;
      const unresolvedPct = relatedCount > 0 ? (unresolved / relatedCount) * 100 : 0;

      const proposalScore = Math.round(
        (Math.min(needScore, 100) * 0.30) +
        (countNorm * 0.25) +
        (priorityNorm * 0.20) +
        (hotspotNorm * 0.15) +
        (unresolvedPct * 0.10)
      );

      const estimatedCitizens = locationSet.size * POPULATION_PER_LOCATION;
      const budgetEntry = BUDGET_MAP.find(b => proposalScore >= b.min);

      const whyRanked: string[] = [];
      if (relatedCount > 0) whyRanked.push(`Highest complaint demand: ${relatedCount} related complaints`);
      if (hotspotSet.size > 0) whyRanked.push(`${hotspotSet.size} hotspot location${hotspotSet.size > 1 ? 's' : ''}`);
      if (avgPri >= 7) whyRanked.push('Critical average priority score');
      else if (avgPri >= 5) whyRanked.push('High average priority score');
      if (unresolved > 0) whyRanked.push(`${unresolved} unresolved complaints`);
      if (locationSet.size > 3) whyRanked.push(`Largest citizen impact across ${locationSet.size} locations`);
      if (whyRanked.length === 0) whyRanked.push('Moderate demand across indicators');

      return {
        ...proposal,
        relatedComplaints: relatedCount,
        avgPriority: avgPri,
        mergedCount: relatedIssues.length,
        hotspotCount: hotspotSet.size,
        affectedLocations: locationSet,
        unresolvedCount: unresolved,
        existingNeedScore: Math.round(needScore),
        proposalScore: Math.min(proposalScore, 100),
        estimatedCitizens,
        suggestedBudget: budgetEntry?.budget || '₹25 Lakhs',
        whyRanked,
        rank: 0,
      };
    });

    evaluated.sort((a, b) => b.proposalScore - a.proposalScore);
    evaluated.forEach((p, i) => { p.rank = i + 1; });

    return evaluated;
  }, [proposals, matchedIssues]);

  const bestProposal = useMemo(() => {
    if (evaluatedProposals.length === 0) return null;
    const top = evaluatedProposals[0];
    const reasons: string[] = [];
    if (top.proposalScore === Math.max(...evaluatedProposals.map(p => p.proposalScore))) {
      reasons.push('Highest Proposal Score');
    }
    if (top.relatedComplaints === Math.max(...evaluatedProposals.map(p => p.relatedComplaints))) {
      reasons.push('Highest citizen demand');
    }
    if (top.hotspotCount === Math.max(...evaluatedProposals.map(p => p.hotspotCount))) {
      reasons.push('Largest hotspot coverage');
    }
    if (top.unresolvedCount === Math.max(...evaluatedProposals.map(p => p.unresolvedCount))) {
      reasons.push('Most unresolved complaints');
    }
    if (reasons.length === 0) reasons.push('Consistently strong performance across metrics');
    return { proposal: top, reasons };
  }, [evaluatedProposals]);

  const openAddModal = useCallback(() => {
    setEditingId(null); setFormName(''); setFormCategory('roads');
    setFormArea(''); setFormCost(''); setFormDesc(''); setShowModal(true);
  }, []);

  const openEditModal = useCallback((p: Proposal) => {
    setEditingId(p.id); setFormName(p.name); setFormCategory(p.category);
    setFormArea(p.targetArea); setFormCost(p.estimatedCost); setFormDesc(p.description); setShowModal(true);
  }, []);

  const saveProposal = useCallback(() => {
    if (!formName.trim()) return;
    if (editingId) {
      setProposals(prev => prev.map(p => p.id === editingId ? {
        ...p, name: formName, category: formCategory, targetArea: formArea,
        estimatedCost: formCost, description: formDesc,
      } : p));
    } else {
      setProposals(prev => [...prev, {
        id: Date.now().toString(), name: formName, category: formCategory,
        targetArea: formArea, estimatedCost: formCost, description: formDesc,
      }]);
    }
    setShowModal(false);
  }, [formName, formCategory, formArea, formCost, formDesc, editingId]);

  const deleteProposal = useCallback((id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          main { max-width: 100% !important; padding: 0 !important; }
          .card, .card-glass { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <nav className="sticky top-0 z-50 no-print" style={{
        background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{t.back}</span>
            </Link>
            <div className="w-px h-6" style={{ background: 'var(--border-primary)' }} />
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 no-print">
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" />
                <span>{t.lastUpdated}: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
            <button onClick={() => { fetchData(); }} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)',
            }}>
              <Download className="w-4 h-4" />
              {t.exportPdf}
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-6 no-print">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{
            background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
          }}>
            <Plus className="w-4 h-4" />
            {t.addProposal}
          </button>
          <div className="flex-1" />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field text-sm">
            <option value="all">{t.category}: {t.all}</option>
            {Object.entries(SECTOR_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </motion.div>

        {/* No Proposals */}
        {proposals.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-12">
            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.noProposals}</p>
            <button onClick={openAddModal} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
              {t.addProposal}
            </button>
          </motion.div>
        )}

        {/* Proposal Ranking */}
        {evaluatedProposals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.proposalRanking}</h2>
            <div className="grid gap-4">
              <AnimatePresence>
                {evaluatedProposals.map((proposal, idx) => {
                  const Icon = SECTOR_CONFIG[proposal.category]?.icon || MoreHorizontal;
                  const color = SECTOR_CONFIG[proposal.category]?.color || '#64748b';
                  const priorityLevel = PRIORITY_LEVELS.find(p => proposal.avgPriority >= p.min);
                  return (
                    <motion.div key={proposal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                      className="card group hover:scale-[1.005] transition-transform">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
                          style={{ background: `${color}20`, color }}>
                          #{proposal.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <Icon className="w-5 h-5" style={{ color }} />
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{proposal.name}</h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                              background: `${priorityLevel?.color || '#64748b'}20`, color: priorityLevel?.color || '#64748b',
                            }}>
                              {priorityLevel?.label || 'N/A'}
                            </span>
                            {proposal.targetArea && (
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                                📍 {proposal.targetArea}
                              </span>
                            )}
                          </div>

                          {/* Score + Progress */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-4 h-4" style={{ color: proposal.proposalScore >= 70 ? '#ef4444' : proposal.proposalScore >= 40 ? '#f59e0b' : '#10b981' }} />
                              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.proposalScore}: {proposal.proposalScore}</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 rounded-full mb-3" style={{ background: 'var(--bg-secondary)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${proposal.proposalScore}%` }} transition={{ duration: 1, delay: idx * 0.08, ease: 'easeOut' }}
                              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.relatedComplaints}: <strong style={{ color: 'var(--text-primary)' }}><AnimatedCounter value={proposal.relatedComplaints} /></strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.mergedComplaints}: <strong style={{ color: 'var(--text-primary)' }}>{proposal.mergedCount}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.affectedLocations}: <strong style={{ color: 'var(--text-primary)' }}>{proposal.affectedLocations.size}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" style={{ color: proposal.hotspotCount > 0 ? '#f59e0b' : 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.hotspots}: <strong style={{ color: 'var(--text-primary)' }}>{proposal.hotspotCount}</strong></span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" style={{ color: proposal.unresolvedCount > 0 ? '#ef4444' : 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.unresolved}: <strong style={{ color: proposal.unresolvedCount > 0 ? '#ef4444' : 'var(--text-primary)' }}>{proposal.unresolvedCount}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.estimatedCitizens}: <strong style={{ color: 'var(--text-primary)' }}><AnimatedCounter value={proposal.estimatedCitizens} /></strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.suggestedBudget}: <strong style={{ color }}>{proposal.suggestedBudget}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.needScore}: <strong style={{ color: 'var(--text-primary)' }}>{proposal.existingNeedScore}</strong></span>
                            </div>
                          </div>

                          {/* Why Ranked */}
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.06 + 0.3 }}
                            className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
                            <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color }}>
                              <Info className="w-3 h-3" />
                              {t.whyRanked}
                            </p>
                            <div className="grid md:grid-cols-2 gap-1.5">
                              {proposal.whyRanked.map((reason, ri) => (
                                <motion.div key={ri} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 + 0.35 + ri * 0.05 }}
                                  className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3 no-print">
                            <button onClick={() => openEditModal(proposal)} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                              {t.editProposal}
                            </button>
                            <button onClick={() => deleteProposal(proposal.id)} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                              {t.deleteProposal}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Best Proposal */}
        {bestProposal && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.bestProposal}</h2>
            <div className="card-glass">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <Trophy className="w-6 h-6" style={{ color: '#f59e0b' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: `${SECTOR_CONFIG[bestProposal.proposal.category]?.color || '#64748b'}20`, color: SECTOR_CONFIG[bestProposal.proposal.category]?.color || '#64748b' }}>
                      {t.recommended}: {bestProposal.proposal.name}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>Score: {bestProposal.proposal.proposalScore}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{bestProposal.proposal.suggestedBudget}</span>
                  </div>
                  <div className="space-y-1.5">
                    {bestProposal.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Table */}
        {evaluatedProposals.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.comparisonView}</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    {[t.rank, t.project, t.score, t.complaints, t.needScore, t.hotspots, t.affectedLocations, t.citizens, t.budget, t.priority].map(h => (
                      <th key={h} className="text-left py-3 px-3 font-bold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluatedProposals.map((p, idx) => {
                    const color = SECTOR_CONFIG[p.category]?.color || '#64748b';
                    const priorityLevel = PRIORITY_LEVELS.find(l => p.avgPriority >= l.min);
                    const isWinner = idx === 0;
                    return (
                      <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                        style={{ borderBottom: '1px solid var(--border-primary)', background: isWinner ? `${color}08` : undefined }}>
                        <td className="py-3 px-3 font-bold" style={{ color }}>#{p.rank}</td>
                        <td className="py-3 px-3 font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${color}20`, color }}>
                            {p.proposalScore}
                          </span>
                        </td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>{p.relatedComplaints}</td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>{p.existingNeedScore}</td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>{p.hotspotCount}</td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}>{p.affectedLocations.size}</td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-secondary)' }}><AnimatedCounter value={p.estimatedCitizens} /></td>
                        <td className="py-3 px-3" style={{ color: 'var(--text-muted)' }}>{p.suggestedBudget}</td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-bold" style={{ color: priorityLevel?.color }}>{priorityLevel?.label || 'N/A'}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        {evaluatedProposals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.charts}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.proposalRanking}</h3>
                <ProposalBarChart proposals={evaluatedProposals} />
              </div>
              <div className="card">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.citizenDemand}</h3>
                <CitizenPieChart proposals={evaluatedProposals} />
              </div>
              <div className="card">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.budgetComparison}</h3>
                <BudgetBarChart proposals={evaluatedProposals} />
              </div>
              <div className="card">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.hotspotComparison}</h3>
                <HotspotBarChart proposals={evaluatedProposals} />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md card-glass p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingId ? t.editProposal : t.addProposal}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.projectName} *</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="input-field w-full text-sm"
                    placeholder="e.g., Road Repair, Water Pipeline" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.category}</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="input-field w-full text-sm">
                    {Object.entries(SECTOR_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.targetArea}</label>
                  <input value={formArea} onChange={e => setFormArea(e.target.value)} className="input-field w-full text-sm"
                    placeholder="e.g., Central Delhi, Ward 5" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.estimatedCost}</label>
                  <input value={formCost} onChange={e => setFormCost(e.target.value)} className="input-field w-full text-sm"
                    placeholder="e.g., ₹50 Lakhs" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.description}</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} className="input-field w-full text-sm" rows={3}
                    placeholder="Brief description of the proposal" />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium" style={{
                  background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                }}>
                  {t.cancel}
                </button>
                <button onClick={saveProposal} disabled={!formName.trim()} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{
                  background: formName.trim() ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                  color: formName.trim() ? 'white' : 'var(--text-muted)',
                }}>
                  {t.save}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProposalBarChart({ proposals }: { proposals: EvaluatedProposal[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        BarChart: recharts.BarChart, Bar: recharts.Bar, XAxis: recharts.XAxis,
        YAxis: recharts.YAxis, CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip, Cell: recharts.Cell,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } = ChartComponents;
  const data = proposals.map(p => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name, score: p.proposalScore, color: SECTOR_CONFIG[p.category]?.color || '#64748b' }));
  return (
    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
      <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
      <Bar dataKey="score" radius={[0, 4, 4, 0]} animationDuration={800}>
        {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
      </Bar>
    </BarChart>
  );
}

function CitizenPieChart({ proposals }: { proposals: EvaluatedProposal[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        PieChart: recharts.PieChart, Pie: recharts.Pie, Cell: recharts.Cell,
        Tooltip: recharts.Tooltip, Legend: recharts.Legend,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const data = proposals.map(p => ({ name: p.name, value: p.estimatedCitizens, color: SECTOR_CONFIG[p.category]?.color || '#64748b' }));
  return (
    <ChartComponents.PieChart>
      <ChartComponents.Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" animationDuration={800}>
        {data.map((entry: any, idx: number) => <ChartComponents.Cell key={idx} fill={entry.color} />)}
      </ChartComponents.Pie>
      <ChartComponents.Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
      <ChartComponents.Legend iconType="circle" iconSize={8} />
    </ChartComponents.PieChart>
  );
}

function BudgetBarChart({ proposals }: { proposals: EvaluatedProposal[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        BarChart: recharts.BarChart, Bar: recharts.Bar, XAxis: recharts.XAxis,
        YAxis: recharts.YAxis, CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip, Cell: recharts.Cell,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } = ChartComponents;
  const budgetToNum = (b: string) => { if (b.includes('3 Crore')) return 300; if (b.includes('2 Crore')) return 200; if (b.includes('1 Crore')) return 100; if (b.includes('50 Lakhs')) return 50; return 25; };
  const data = proposals.map(p => ({ name: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name, budget: budgetToNum(p.suggestedBudget), color: SECTOR_CONFIG[p.category]?.color || '#64748b' }));
  return (
    <BarChart data={data} margin={{ left: 10, right: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} label={{ value: '₹ Lakhs', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-muted)', fontSize: 11 } }} />
      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
      <Bar dataKey="budget" radius={[4, 4, 0, 0]} animationDuration={800}>
        {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
      </Bar>
    </BarChart>
  );
}

function HotspotBarChart({ proposals }: { proposals: EvaluatedProposal[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        BarChart: recharts.BarChart, Bar: recharts.Bar, XAxis: recharts.XAxis,
        YAxis: recharts.YAxis, CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip, Cell: recharts.Cell,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } = ChartComponents;
  const data = proposals.map(p => ({ name: p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name, hotspots: p.hotspotCount, color: SECTOR_CONFIG[p.category]?.color || '#64748b' }));
  return (
    <BarChart data={data} margin={{ left: 10, right: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
      <Bar dataKey="hotspots" radius={[4, 4, 0, 0]} animationDuration={800}>
        {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
      </Bar>
    </BarChart>
  );
}
