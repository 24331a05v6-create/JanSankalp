'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, MapPin, Building2, FileText, Download,
  Filter, Layers, Zap, Droplets,
  HeartPulse, GraduationCap, Trash2, Lightbulb, Briefcase,
  MoreHorizontal, RefreshCw, Loader2, Info, Clock, Users, IndianRupee
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

interface Submission {
  id: string;
  category: string;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;
  priority_score?: number;
  status: string;
  ai_summary?: string;
  voice_transcript?: string;
  text_input?: string;
  source?: string;
  created_at?: string;
}

interface SectorData {
  key: string;
  label: string;
  icon: any;
  color: string;
  totalComplaints: number;
  mergedIssues: number;
  avgPriority: number;
  hotspotCount: number;
  affectedLocations: Set<string>;
  percentOfTotal: number;
  unresolvedCount: number;
  unresolvedPercent: number;
  needScore: number;
  trend: 'up' | 'down' | 'stable';
  estimatedCitizens: number;
  suggestedBudget: string;
  budgetReasons: string[];
  whyRanked: string[];
  resolvedPercent: number;
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

const PRIORITY_LEVELS = [
  { min: 7, label: 'Critical', color: '#ef4444', dot: '🔴', desc: 'Immediate action required, safety risk' },
  { min: 5, label: 'High', color: '#f97316', dot: '🟠', desc: 'Urgent attention needed within days' },
  { min: 3, label: 'Medium', color: '#eab308', dot: '🟡', desc: 'Important but not time-critical' },
  { min: 0, label: 'Low', color: '#22c55e', dot: '🟢', desc: 'Can be scheduled for routine maintenance' },
];

const BUDGET_MAP = [
  { min: 90, budget: '₹3 Crore', label: '3 Crore' },
  { min: 80, budget: '₹2 Crore', label: '2 Crore' },
  { min: 70, budget: '₹1 Crore', label: '1 Crore' },
  { min: 60, budget: '₹50 Lakhs', label: '50 Lakhs' },
  { min: 0, budget: '₹25 Lakhs', label: '25 Lakhs' },
];

const POPULATION_PER_LOCATION = 2500;

const DASHBOARD_TEXT: Record<string, Record<string, string>> = {
  en: {
    title: 'Development Planner',
    subtitle: 'AI-powered constituency development analysis',
    back: 'Dashboard',
    totalComplaints: 'Total Complaints',
    resolvedPercent: 'Resolved',
    unresolvedPercent: 'Unresolved',
    highestDemand: 'Highest Demand',
    lowestDemand: 'Lowest Demand',
    mostAffected: 'Most Affected',
    totalHotspots: 'Hotspots',
    needScore: 'Need Score',
    complaints: 'Complaints',
    merged: 'Merged',
    hotspots: 'Hotspots',
    unresolved: 'Unresolved',
    recommendedOrder: 'Recommended Development Order',
    investmentRec: 'Investment Recommendation',
    constituencySummary: 'Constituency Health Summary',
    charts: 'Visual Analytics',
    exportPdf: 'Export PDF',
    filters: 'Filters',
    all: 'All',
    sectorRanking: 'Sector Ranking',
    complaintDistribution: 'Complaint Distribution',
    topSectors: 'Top 5 Sectors',
    resolutionStatus: 'Resolution Status',
    amount: 'If ₹1 Crore becomes available',
    recommended: 'Recommended Investment',
    expectedBenefit: 'Expected Benefit',
    reason: 'Reason',
    refresh: 'Refresh',
    loading: 'Loading...',
    noData: 'No complaint data available',
    district: 'District',
    village: 'Village',
    department: 'Department',
    priority: 'Priority Level',
    resolved: 'Resolved',
    category: 'Category',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    active: 'Active',
    highestScore: 'Highest need score in the constituency',
    lowestScore: 'Lowest need score',
    mostHotspots: 'Most hotspot clusters identified',
    unresolvedIssues: 'Issues requiring immediate attention',
    whyRanked: 'Why Ranked',
    estimatedCitizens: 'Estimated Citizens Affected',
    estimatedValue: 'Estimated Value',
    suggestedBudget: 'Suggested Budget',
    priorityLevels: 'Priority Levels',
    lastUpdated: 'Last Updated',
    resolvedOf: 'Resolved',
    whyReasons: 'Ranking Reasons',
    budgetReason: 'Budget Rationale',
    citizensNote: 'Based on affected locations × avg population per location',
    tooltipNeedScore: 'Composite score (0-100) based on complaint frequency, severity, hotspots, and unresolved ratio',
    tooltipHotspots: 'Distinct geographic clusters where multiple complaints originate',
    tooltipResolved: 'Percentage of merged issues marked as resolved by the MP',
    tooltipBudget: 'Suggested allocation based on the Need Score and expected impact',
    tooltipCitizens: 'Estimated using affected locations × 2,500 avg population per location',
  },
  hi: {
    title: 'विकास योजनाकार',
    subtitle: 'AI-संचालित निर्वाचन क्षेत्र विकास विश्लेषण',
    back: 'डैशबोर्ड',
    totalComplaints: 'कुल शिकायतें',
    resolvedPercent: 'हल',
    unresolvedPercent: 'अनसुलझी',
    highestDemand: 'सर्वाधिक माँग',
    lowestDemand: 'न्यूनतम माँग',
    mostAffected: 'सर्वाधिक प्रभावित',
    totalHotspots: 'हॉटस्पॉट',
    needScore: 'आवश्यकता स्कोर',
    complaints: 'शिकायतें',
    merged: 'विलय',
    hotspots: 'हॉटस्पॉट',
    unresolved: 'अनसुलझी',
    recommendedOrder: 'अनुशंसित विकास क्रम',
    investmentRec: 'निवेश सिफारिश',
    constituencySummary: 'निर्वाचन क्षेत्र स्वास्थ्य सारांश',
    charts: 'दृश्य विश्लेषण',
    exportPdf: 'PDF निर्यात',
    filters: 'फ़िल्टर',
    all: 'सभी',
    sectorRanking: 'क्षेत्र रैंकिंग',
    complaintDistribution: 'शिकायत वितरण',
    topSectors: 'शीर्ष 5 क्षेत्र',
    resolutionStatus: 'समाधान स्थिति',
    amount: 'यदि ₹1 करोड़ उपलब्ध हो',
    recommended: 'अनुशंसित निवेश',
    expectedBenefit: 'अपेक्षित लाभ',
    reason: 'कारण',
    refresh: 'रिफ्रेश',
    loading: 'लोड हो रहा है...',
    noData: 'कोई शिकायत डेटा उपलब्ध नहीं',
    district: 'जिला',
    village: 'गाँव',
    department: 'विभाग',
    priority: 'प्राथमिकता स्तर',
    resolved: 'हल',
    category: 'श्रेणी',
    critical: 'गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
    active: 'सक्रिय',
    highestScore: 'निर्वाचन क्षेत्र में सर्वाधिक आवश्यकता स्कोर',
    lowestScore: 'न्यूनतम आवश्यकता स्कोर',
    mostHotspots: 'सर्वाधिक हॉटस्पॉट क्लस्टर',
    unresolvedIssues: 'तत्काल ध्यान देने योग्य मुद्दे',
    whyRanked: 'क्यों रैंक किया गया',
    estimatedCitizens: 'अनुमानित प्रभावित नागरिक',
    estimatedValue: 'अनुमानित मूल्य',
    suggestedBudget: 'अनुशंसित बजट',
    priorityLevels: 'प्राथमिकता स्तर',
    lastUpdated: 'अंतिम अपडेट',
    resolvedOf: 'हल',
    whyReasons: 'रैंकिंग कारण',
    budgetReason: 'बजट कारण',
    citizensNote: 'प्रभावित स्थानों × औसत जनसंख्या के आधार पर',
    tooltipNeedScore: 'शिकायत आवृत्ति, गंभीरता, हॉटस्पॉट और अनसुलझी अनुपात पर आधारित संयुक्त स्कोर (0-100)',
    tooltipHotspots: 'वे भौगोलिक क्लस्टर जहाँ कई शिकायतें आती हैं',
    tooltipResolved: 'MP द्वारा हल किए गए विलय मुद्दों का प्रतिशत',
    tooltipBudget: 'आवश्यकता स्कोर और अपेक्षित प्रभाव के आधार पर अनुशंसित आवंटन',
    tooltipCitizens: 'प्रभावित स्थानों × 2,500 औसत जनसंख्या का उपयोग करके अनुमानित',
  },
  ta: {
    title: 'மேம்பாட்டு திட்டமிடுபவர்',
    subtitle: 'AI-இயங்கும் தொகுதி மேம்பாட்டு பகுப்பாய்வு',
    back: 'டாஷ்போர்டு',
    totalComplaints: 'மொத்த புகார்கள்',
    resolvedPercent: 'தீர்வு',
    unresolvedPercent: 'தீர்க்கப்படாத',
    highestDemand: 'மிக அதிக தேவை',
    lowestDemand: 'குறைந்த தேவை',
    mostAffected: 'மிகவும் பாதிக்கப்பட்ட',
    totalHotspots: 'ஹாட்ஸ்பாட்கள்',
    needScore: 'தேவை மதிப்பெண்',
    complaints: 'புகார்கள்',
    merged: 'இணைக்கப்பட்ட',
    hotspots: 'ஹாட்ஸ்பாட்கள்',
    unresolved: 'தீர்க்கப்படாத',
    recommendedOrder: 'பரிந்துரைக்கப்பட்ட மேம்பாட்டு வரிசை',
    investmentRec: 'முதலீட்டு பரிந்துரை',
    constituencySummary: 'தொகுதி ஆரோக்கிய சுருக்கம்',
    charts: 'காட்சி பகுப்பாய்வு',
    exportPdf: 'PDF ஏற்றுமதி',
    filters: 'வடிகட்டிகள்',
    all: 'அனைத்தும்',
    sectorRanking: 'துறை தரவரிசை',
    complaintDistribution: 'புகார் விநியோகம்',
    topSectors: 'சிறந்த 5 துறைகள்',
    resolutionStatus: 'தீர்வு நிலை',
    amount: '₹1 கோடி கிடைத்தால்',
    recommended: 'பரிந்துரைக்கப்பட்ட முதலீடு',
    expectedBenefit: 'எதிர்பார்க்கப்படும் நன்மை',
    reason: 'காரணம்',
    refresh: 'புதுப்பி',
    loading: 'ஏற்றுகிறது...',
    noData: 'புகார் தரவு இல்லை',
    district: 'மாவட்டம்',
    village: 'கிராமம்',
    department: 'துறை',
    priority: 'முன்னுரிமை நிலை',
    resolved: 'தீர்வு',
    category: 'வகை',
    critical: 'முக்கியமான',
    high: 'உயர்',
    medium: 'நடுத்தர',
    low: 'குறைந்த',
    active: 'செயலில்',
    highestScore: 'தொகுதியில் மிக உயர்ந்த தேவை மதிப்பெண்',
    lowestScore: 'குறைந்த தேவை மதிப்பெண்',
    mostHotspots: 'மிகவும் ஹாட்ஸ்பாட் குழுக்கள்',
    unresolvedIssues: 'உடனடி கவனம் தேவை',
    whyRanked: 'ஏன் தரவரிசை',
    estimatedCitizens: 'மதிப்பிடப்பட்ட பாதிக்கப்பட்ட குடிமக்கள்',
    estimatedValue: 'மதிப்பிடப்பட்ட மதிப்பு',
    suggestedBudget: 'பரிந்துரைக்கப்பட்ட பட்ஜெட்',
    priorityLevels: 'முன்னுரிமை நிலைகள்',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    resolvedOf: 'தீர்வு',
    whyReasons: 'தரவரிசை காரணங்கள்',
    budgetReason: 'பட்ஜெட் காரணம்',
    citizensNote: 'பாதிக்கப்பட்ட இடங்கள் × இடம் ஒன்றுக்கு சராசரி மக்கள்தொகையின் அடிப்படையில்',
    tooltipNeedScore: 'புகார் அதிர்வெண், தீவிரம், ஹாட்ஸ்பாட் மற்றும் தீர்க்கப்படாத விகிதத்தின் அடிப்படையில் கூட்டு மதிப்பெண் (0-100)',
    tooltipHotspots: 'பல புகார்கள் வரும் புவியியல் குழுக்கள்',
    tooltipResolved: 'MP மூலம் தீர்க்கப்பட்ட இணைக்கப்பட்ட பிரச்சினைகளின் சதவீதம்',
    tooltipBudget: 'தேவை மதிப்பெண் மற்றும் எதிர்பார்க்கப்படும் தாக்கத்தின் அடிப்படையில் பரிந்துரைக்கப்பட்ட ஒதுக்கீடு',
    tooltipCitizens: 'பாதிக்கப்பட்ட இடங்கள் × 2,500 சராசரி மக்கள்தொகையைப் பயன்படுத்தி மதிப்பிடப்பட்டது',
  },
};

const LANGUAGES = ['en', 'hi', 'ta'] as const;

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) { setDisplay(end); return; }
    const startTime = Date.now();
    const dur = duration * 1000;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function DevelopmentPlannerPage() {
  const [mergedIssues, setMergedIssues] = useState<MergedIssue[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterResolved, setFilterResolved] = useState<'all' | 'active' | 'resolved'>('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const t = DASHBOARD_TEXT[lang] || DASHBOARD_TEXT.en;

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('jansankalp-dashboard-lang') : null;
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) setLang(saved);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [issuesRes, submissionsRes] = await Promise.all([
        fetch('/api/merge-complaints'),
        fetch('/api/submissions?limit=500'),
      ]);
      const issuesData = await issuesRes.json();
      const subsData = await submissionsRes.json();
      setMergedIssues(issuesData.merged_issues || []);
      setSubmissions(subsData.submissions || []);
      setLastUpdated(new Date());
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredIssues = useMemo(() => {
    return mergedIssues.filter(issue => {
      if (filterCategory !== 'all' && issue.category !== filterCategory) return false;
      if (filterResolved === 'active' && issue.resolved) return false;
      if (filterResolved === 'resolved' && !issue.resolved) return false;
      if (filterPriority !== 'all') {
        const level = PRIORITY_LEVELS.find(p => issue.priority_score >= p.min);
        if (level && level.label.toLowerCase() !== filterPriority) return false;
      }
      return true;
    });
  }, [mergedIssues, filterCategory, filterResolved, filterPriority]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      if (filterCategory !== 'all' && sub.category !== filterCategory) return false;
      if (filterResolved === 'active' && sub.status === 'resolved') return false;
      if (filterResolved === 'resolved' && sub.status !== 'resolved') return false;
      return true;
    });
  }, [submissions, filterCategory, filterResolved]);

  const sectorData = useMemo(() => {
    const totalComplaints = filteredIssues.reduce((sum, i) => sum + i.complaint_count, 0);

    const sectors: SectorData[] = Object.entries(SECTOR_CONFIG).map(([key, config]) => {
      const sectorIssues = filteredIssues.filter(i => i.category === key);

      const totalComp = sectorIssues.reduce((sum, i) => sum + i.complaint_count, 0);
      const mergedCount = sectorIssues.length;
      const avgPri = mergedCount > 0
        ? sectorIssues.reduce((sum, i) => sum + i.priority_score, 0) / mergedCount
        : 0;

      const hotspotSet = new Set<string>();
      const locationSet = new Set<string>();
      sectorIssues.forEach(issue => {
        issue.locations.forEach(loc => {
          locationSet.add(loc);
          const match = loc.match(/,\s*([^,]+)$/);
          if (match) hotspotSet.add(match[1].trim());
        });
      });

      const unresolved = sectorIssues.filter(i => !i.resolved).reduce((sum, i) => sum + i.complaint_count, 0);
      const resolvedCount = totalComp - unresolved;

      const percent = totalComplaints > 0 ? (totalComp / totalComplaints) * 100 : 0;
      const unresolvedPct = totalComp > 0 ? (unresolved / totalComp) * 100 : 0;
      const resolvedPct = totalComp > 0 ? 100 - unresolvedPct : 0;

      const estimatedCitizens = locationSet.size * POPULATION_PER_LOCATION;

      return {
        key,
        label: config.label,
        icon: config.icon,
        color: config.color,
        totalComplaints: totalComp,
        mergedIssues: mergedCount,
        avgPriority: avgPri,
        hotspotCount: hotspotSet.size,
        affectedLocations: locationSet,
        percentOfTotal: percent,
        unresolvedCount: unresolved,
        unresolvedPercent: unresolvedPct,
        resolvedPercent: resolvedPct,
        needScore: 0,
        trend: 'stable' as const,
        estimatedCitizens,
        suggestedBudget: '',
        budgetReasons: [],
        whyRanked: [],
      };
    });

    const maxComplaints = Math.max(...sectors.map(s => s.totalComplaints), 1);
    const maxHotspots = Math.max(...sectors.map(s => s.hotspotCount), 1);

    sectors.forEach(sector => {
      const priorityNorm = (sector.avgPriority / 10) * 100;
      const countNorm = (sector.totalComplaints / maxComplaints) * 100;
      const hotspotNorm = (sector.hotspotCount / maxHotspots) * 100;
      const unresolvedNorm = sector.unresolvedPercent;

      sector.needScore = Math.round(
        (priorityNorm * 0.35) +
        (countNorm * 0.25) +
        (hotspotNorm * 0.20) +
        (unresolvedNorm * 0.20)
      );

      sector.trend = sector.unresolvedPercent > 70 ? 'up' :
        sector.unresolvedPercent < 30 ? 'down' : 'stable';

      const budgetEntry = BUDGET_MAP.find(b => sector.needScore >= b.min);
      sector.suggestedBudget = budgetEntry?.budget || '₹25 Lakhs';

      sector.budgetReasons = [];
      if (sector.needScore >= 90) sector.budgetReasons.push('Highest need score in the constituency');
      else if (sector.needScore >= 70) sector.budgetReasons.push('High need score requiring significant investment');
      else if (sector.needScore >= 50) sector.budgetReasons.push('Moderate need with room for impactful allocation');
      else sector.budgetReasons.push('Lower priority but still requires baseline funding');
      if (sector.estimatedCitizens > 5000) sector.budgetReasons.push(`Large citizen impact: ~${sector.estimatedCitizens.toLocaleString()} people`);
      if (sector.hotspotCount > 2) sector.budgetReasons.push(`${sector.hotspotCount} geographic hotspots need targeted investment`);
      if (sector.avgPriority >= 7) sector.budgetReasons.push('Critical severity issues reported');
    });

    sectors.sort((a, b) => b.needScore - a.needScore);

    sectors.forEach((sector, idx) => {
      sector.whyRanked = [];
      if (sector.totalComplaints === Math.max(...sectors.filter(s => s.totalComplaints > 0).map(s => s.totalComplaints))) {
        sector.whyRanked.push(`Highest complaint count: ${sector.totalComplaints} total complaints`);
      }
      if (sector.hotspotCount > 0) {
        sector.whyRanked.push(`${sector.hotspotCount} hotspot location${sector.hotspotCount > 1 ? 's' : ''} identified`);
      }
      if (sector.unresolvedCount > 0) {
        sector.whyRanked.push(`${sector.unresolvedCount} unresolved complaint${sector.unresolvedCount > 1 ? 's' : ''} requiring attention`);
      }
      if (sector.avgPriority > 0) {
        sector.whyRanked.push(`Average Priority Score: ${sector.avgPriority.toFixed(1)}`);
      }
      const priorityLevel = PRIORITY_LEVELS.find(p => sector.avgPriority >= p.min);
      if (priorityLevel?.label === 'Critical') {
        sector.whyRanked.push('Critical public service — immediate action needed');
      } else if (priorityLevel?.label === 'High') {
        sector.whyRanked.push('High-demand public service with safety concerns');
      }
      if (sector.totalComplaints >= maxComplaints * 0.5) {
        sector.whyRanked.push('High citizen demand across the constituency');
      }
      if (sector.whyRanked.length === 0) {
        sector.whyRanked.push('Consistently high demand across multiple indicators');
      }
    });

    return { sectors, totalComplaints, totalMerged: filteredIssues.length };
  }, [filteredIssues, filteredSubmissions]);

  const summary = useMemo(() => {
    const { sectors } = sectorData;
    const totalResolved = mergedIssues.filter(i => i.resolved).length;
    const totalAll = mergedIssues.length;
    const resolvedPct = totalAll > 0 ? Math.round((totalResolved / totalAll) * 100) : 0;

    const allHotspots = new Set<string>();
    const allLocations = new Set<string>();
    mergedIssues.forEach(issue => {
      issue.locations.forEach(loc => {
        allLocations.add(loc);
        const match = loc.match(/,\s*([^,]+)$/);
        if (match) allHotspots.add(match[1].trim());
      });
    });

    const activeSectors = sectors.filter(s => s.totalComplaints > 0);

    return {
      totalAll,
      resolvedPct,
      unresolvedPct: 100 - resolvedPct,
      highestDemand: activeSectors[0] || null,
      lowestDemand: activeSectors[activeSectors.length - 1] || null,
      hotspotCount: allHotspots.size,
      locationCount: allLocations.size,
    };
  }, [sectorData, mergedIssues]);

  const investmentRec = useMemo(() => {
    const { sectors } = sectorData;
    const activeSectors = sectors.filter(s => s.totalComplaints > 0);
    if (activeSectors.length === 0) return null;

    const top = activeSectors[0];
    const reasons: string[] = [];
    if (top.totalComplaints === Math.max(...activeSectors.map(s => s.totalComplaints))) {
      reasons.push('Highest complaint density in the constituency');
    }
    if (top.unresolvedCount === Math.max(...activeSectors.map(s => s.unresolvedCount))) {
      reasons.push('Largest number of unresolved complaints requiring attention');
    }
    if (top.hotspotCount === Math.max(...activeSectors.map(s => s.hotspotCount))) {
      reasons.push('Multiple hotspot clusters identified across the area');
    }
    if (top.avgPriority >= 7) reasons.push('Critical severity issues reported consistently');
    else if (top.avgPriority >= 5) reasons.push('High priority issues with significant safety concerns');
    if (reasons.length === 0) reasons.push('Consistently high demand across multiple indicators');

    const expectedBenefits: string[] = [];
    if (top.affectedLocations.size > 0) expectedBenefits.push(`${top.affectedLocations.size} locations will benefit directly`);
    if (top.hotspotCount > 0) expectedBenefits.push(`${top.hotspotCount} hotspot clusters will be addressed`);
    expectedBenefits.push(`${top.totalComplaints} citizen complaints addressed`);

    return { sector: top, reasons, expectedBenefits };
  }, [sectorData]);

  const exportPdf = useCallback(() => { window.print(); }, []);

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
        .tooltip-trigger:hover .tooltip-content { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .tooltip-content { opacity: 0; pointer-events: none; transform: translateY(4px); transition: all 0.15s ease; }
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
              <Layers className="w-5 h-5" style={{ color: '#8b5cf6' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 no-print">
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" />
                <span>{t.lastUpdated}: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
            <button onClick={() => { setRefreshing(true); fetchData(); }} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={exportPdf} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{
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
        {/* Filters + Priority Legend Row */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card no-print lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t.filters}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field text-sm">
                <option value="all">{t.category}: {t.all}</option>
                {Object.entries(SECTOR_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
              <select value={filterResolved} onChange={e => setFilterResolved(e.target.value as any)} className="input-field text-sm">
                <option value="all">{t.resolved}: {t.all}</option>
                <option value="active">{t.active}</option>
                <option value="resolved">{t.resolved}</option>
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field text-sm">
                <option value="all">{t.priority}: {t.all}</option>
                <option value="critical">{t.critical}</option>
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>
          </motion.div>

          {/* Priority Legend */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card">
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t.priorityLevels}</p>
            <div className="space-y-2">
              {PRIORITY_LEVELS.map(level => (
                <div key={level.label} className="flex items-center gap-2">
                  <span className="text-sm">{level.dot}</span>
                  <span className="text-xs font-bold" style={{ color: level.color }}>{level.label}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {level.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Constituency Health Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.constituencySummary}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: t.totalComplaints, value: summary.totalAll, icon: FileText, color: '#3b82f6' },
              { label: t.resolvedPercent, value: summary.resolvedPct, suffix: '%', icon: CheckCircle2, color: '#10b981' },
              { label: t.unresolvedPercent, value: summary.unresolvedPct, suffix: '%', icon: AlertTriangle, color: '#ef4444' },
              { label: t.totalHotspots, value: summary.hotspotCount, icon: MapPin, color: '#f59e0b' },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                className="card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    <AnimatedCounter value={item.value} />{item.suffix || ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div className="card">
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t.highestDemand}</p>
              <p className="font-bold" style={{ color: summary.highestDemand?.color || 'var(--text-primary)' }}>
                {summary.highestDemand?.label || '—'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.highestScore}</p>
            </div>
            <div className="card">
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t.lowestDemand}</p>
              <p className="font-bold" style={{ color: summary.lowestDemand?.color || 'var(--text-primary)' }}>
                {summary.lowestDemand?.label || '—'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.lowestScore}</p>
            </div>
            <div className="card">
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t.mostAffected}</p>
              <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{summary.locationCount} locations</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.unresolvedIssues}</p>
            </div>
          </div>
        </motion.div>

        {/* Sector Ranking */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.sectorRanking}</h2>
          <div className="grid gap-4">
            <AnimatePresence>
              {sectorData.sectors.filter(s => s.totalComplaints > 0).map((sector, idx) => {
                const Icon = sector.icon;
                const priorityLevel = PRIORITY_LEVELS.find(p => sector.avgPriority >= p.min);
                return (
                  <motion.div key={sector.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                    layout className="card group hover:scale-[1.005] transition-transform">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
                        style={{ background: `${sector.color}20`, color: sector.color }}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Icon className="w-5 h-5" style={{ color: sector.color }} />
                          <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{sector.label}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                            background: `${priorityLevel?.color || '#64748b'}20`, color: priorityLevel?.color || '#64748b',
                          }}>
                            {priorityLevel?.label}
                          </span>
                          {sector.trend === 'up' && <TrendingUp className="w-4 h-4" style={{ color: '#ef4444' }} />}
                          {sector.trend === 'down' && <TrendingDown className="w-4 h-4" style={{ color: '#10b981' }} />}
                        </div>

                        {/* Need Score + Progress */}
                        <div className="flex items-center gap-3 mb-3">
                          <Tooltip text={t.tooltipNeedScore}>
                            <div className="flex items-center gap-1.5 cursor-help">
                              <Zap className="w-4 h-4" style={{ color: sector.needScore >= 70 ? '#ef4444' : sector.needScore >= 40 ? '#f59e0b' : '#10b981' }} />
                              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.needScore}: {sector.needScore}</span>
                              <Info className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </Tooltip>
                        </div>
                        <div className="w-full h-2.5 rounded-full mb-3" style={{ background: 'var(--bg-secondary)' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${sector.needScore}%` }} transition={{ duration: 1, delay: idx * 0.08, ease: 'easeOut' }}
                            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${sector.color}, ${sector.color}aa)` }} />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.complaints}: <strong style={{ color: 'var(--text-primary)' }}><AnimatedCounter value={sector.totalComplaints} /></strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.merged}: <strong style={{ color: 'var(--text-primary)' }}>{sector.mergedIssues}</strong></span>
                          </div>
                          <Tooltip text={t.tooltipHotspots}>
                            <div className="flex items-center gap-1.5 cursor-help">
                              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.hotspots}: <strong style={{ color: 'var(--text-primary)' }}>{sector.hotspotCount}</strong></span>
                              <Info className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </Tooltip>
                          <Tooltip text={t.tooltipResolved}>
                            <div className="flex items-center gap-1.5 cursor-help">
                              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.resolvedPercent}: <strong style={{ color: '#10b981' }}>{sector.resolvedPercent.toFixed(0)}%</strong></span>
                              <Info className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" style={{ color: sector.unresolvedCount > 0 ? '#ef4444' : 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.unresolved}: <strong style={{ color: sector.unresolvedCount > 0 ? '#ef4444' : 'var(--text-primary)' }}>{sector.unresolvedCount}</strong></span>
                          </div>
                          <Tooltip text={t.tooltipCitizens}>
                            <div className="flex items-center gap-1.5 cursor-help">
                              <Users className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.estimatedCitizens}: <strong style={{ color: 'var(--text-primary)' }}><AnimatedCounter value={sector.estimatedCitizens} /></strong></span>
                              <Info className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </Tooltip>
                          <Tooltip text={t.tooltipBudget}>
                            <div className="flex items-center gap-1.5 cursor-help">
                              <IndianRupee className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.suggestedBudget}: <strong style={{ color: sector.color }}>{sector.suggestedBudget}</strong></span>
                              <Info className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </Tooltip>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>% of Total: <strong style={{ color: 'var(--text-primary)' }}>{sector.percentOfTotal.toFixed(1)}%</strong></span>
                          </div>
                        </div>

                        {/* Why Ranked Section */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.06 + 0.3 }}
                          className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
                          <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: sector.color }}>
                            <Zap className="w-3 h-3" />
                            {t.whyRanked} #{idx + 1}?
                          </p>
                          <div className="grid md:grid-cols-2 gap-1.5">
                            {sector.whyRanked.map((reason, ri) => (
                              <motion.div key={ri} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 + 0.35 + ri * 0.05 }}
                                className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Budget Reasons */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.06 + 0.4 }}
                          className="mt-2 pt-2" style={{ borderTop: '1px dashed var(--border-primary)' }}>
                          <p className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                            <IndianRupee className="w-3 h-3" />
                            {t.budgetReason}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {sector.budgetReasons.map((reason, ri) => (
                              <span key={ri} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                                {reason}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recommended Development Order */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.recommendedOrder}</h2>
          <div className="grid gap-3">
            {sectorData.sectors.filter(s => s.totalComplaints > 0).slice(0, 5).map((sector, idx) => {
              const Icon = sector.icon;
              const reasons: string[] = [];
              if (idx === 0) reasons.push('Highest complaint density in the constituency');
              if (sector.unresolvedCount > 0) reasons.push(`${sector.unresolvedCount} unresolved complaints requiring immediate attention`);
              if (sector.hotspotCount > 0) reasons.push(`${sector.hotspotCount} hotspot clusters identified`);
              if (sector.avgPriority >= 7) reasons.push('Critical severity issues reported');
              else if (sector.avgPriority >= 5) reasons.push('High safety risk concerns');
              if (sector.affectedLocations.size > 3) reasons.push(`Large affected population across ${sector.affectedLocations.size} locations`);
              if (reasons.length === 0) reasons.push('Consistently high demand across indicators');

              return (
                <motion.div key={sector.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                  className="card-glass">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: `${sector.color}20`, color: sector.color }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" style={{ color: sector.color }} />
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{sector.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${sector.color}20`, color: sector.color }}>
                          Score: {sector.needScore}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                          {sector.suggestedBudget}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {reasons.slice(0, 3).map((reason, ri) => (
                          <p key={ri} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                            <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                            {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Investment Recommendation */}
        {investmentRec && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.investmentRec}</h2>
            <div className="card-glass">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{t.amount}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: `${investmentRec.sector.color}20`, color: investmentRec.sector.color }}>
                      {t.recommended}: {investmentRec.sector.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: investmentRec.sector.color }}>{investmentRec.sector.suggestedBudget}</span>
                  </div>
                  <div className="space-y-2">
                    {investmentRec.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#10b981' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.expectedBenefit}</p>
                  <div className="space-y-2">
                    {investmentRec.expectedBenefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: investmentRec.sector.color }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.charts}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.sectorRanking}</h3>
              <SectorBarChart sectors={sectorData.sectors.filter(s => s.totalComplaints > 0)} />
            </div>
            <div className="card">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.complaintDistribution}</h3>
              <ComplaintPieChart sectors={sectorData.sectors.filter(s => s.totalComplaints > 0)} />
            </div>
            <div className="card">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.topSectors}</h3>
              <TopSectorsChart sectors={sectorData.sectors.filter(s => s.totalComplaints > 0).slice(0, 5)} />
            </div>
            <div className="card">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.resolutionStatus}</h3>
              <ResolutionPieChart sectors={sectorData.sectors.filter(s => s.totalComplaints > 0)} />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function SectorBarChart({ sectors }: { sectors: SectorData[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        BarChart: recharts.BarChart, Bar: recharts.Bar, XAxis: recharts.XAxis,
        YAxis: recharts.YAxis, CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip, ResponsiveContainer: recharts.ResponsiveContainer, Cell: recharts.Cell,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } = ChartComponents;
  const data = sectors.map(s => ({ name: s.label.length > 12 ? s.label.slice(0, 12) + '…' : s.label, score: s.needScore, color: s.color }));
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

function ComplaintPieChart({ sectors }: { sectors: SectorData[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        PieChart: recharts.PieChart, Pie: recharts.Pie, Cell: recharts.Cell,
        ResponsiveContainer: recharts.ResponsiveContainer, Tooltip: recharts.Tooltip, Legend: recharts.Legend,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const data = sectors.map(s => ({ name: s.label, value: s.totalComplaints, color: s.color }));
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

function TopSectorsChart({ sectors }: { sectors: SectorData[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        BarChart: recharts.BarChart, Bar: recharts.Bar, XAxis: recharts.XAxis,
        YAxis: recharts.YAxis, CartesianGrid: recharts.CartesianGrid,
        Tooltip: recharts.Tooltip, ResponsiveContainer: recharts.ResponsiveContainer, Cell: recharts.Cell,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } = ChartComponents;
  const data = sectors.map(s => ({ name: s.label.length > 10 ? s.label.slice(0, 10) + '…' : s.label, complaints: s.totalComplaints, color: s.color }));
  return (
    <BarChart data={data} margin={{ left: 10, right: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8 }} />
      <Bar dataKey="complaints" radius={[4, 4, 0, 0]} animationDuration={800}>
        {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
      </Bar>
    </BarChart>
  );
}

function ResolutionPieChart({ sectors }: { sectors: SectorData[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const recharts = await import('recharts');
      setChartComponents({
        PieChart: recharts.PieChart, Pie: recharts.Pie, Cell: recharts.Cell,
        ResponsiveContainer: recharts.ResponsiveContainer, Tooltip: recharts.Tooltip, Legend: recharts.Legend,
      });
    })();
  }, []);
  if (!ChartComponents) return <div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;
  const totalResolved = sectors.reduce((sum, s) => sum + (s.totalComplaints - s.unresolvedCount), 0);
  const totalUnresolved = sectors.reduce((sum, s) => sum + s.unresolvedCount, 0);
  const data = [
    { name: 'Resolved', value: totalResolved, color: '#10b981' },
    { name: 'Unresolved', value: totalUnresolved, color: '#ef4444' },
  ].filter(d => d.value > 0);
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
