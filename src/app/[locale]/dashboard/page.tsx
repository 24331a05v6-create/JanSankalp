'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Users, Lightbulb, TrendingUp, MapPin,
  RefreshCw, Loader2, Globe, ChevronDown, ChevronRight,
  AlertTriangle, Building2, Clock, FileText, Shield,
  Search, CheckCircle2, Circle, AlertCircle, Copy, Phone, BarChart3, Layers, Trophy
} from 'lucide-react';
import { DemandMap } from '@/components/DemandMap';
import { StatsCard } from '@/components/StatsCard';
import { CategoryChart } from '@/components/CategoryChart';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Link from 'next/link';

const LANGS = [
  { code: 'en', native: 'English' }, { code: 'hi', native: 'हिन्दी' }, { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' }, { code: 'kn', native: 'ಕನ್ನಡ' }, { code: 'ml', native: 'മലയാളം' },
  { code: 'mr', native: 'मराठी' }, { code: 'gu', native: 'ગુજરાતી' }, { code: 'bn', native: 'বাংলা' },
  { code: 'or', native: 'ଓଡ଼ିଆ' }, { code: 'pa', native: 'ਪੰਜਾਬੀ' }, { code: 'as', native: 'অসমীয়া' },
];

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

function getPriorityLevel(score: number): { label: string; color: string; bgColor: string; textColor: string } {
  if (score >= 7) return { label: 'Critical', color: '#DC2626', bgColor: 'rgba(239,68,68,0.1)', textColor: '#ef4444' };
  if (score >= 5) return { label: 'High', color: '#EA580C', bgColor: 'rgba(249,115,22,0.1)', textColor: '#f97316' };
  if (score >= 3) return { label: 'Medium', color: '#CA8A04', bgColor: 'rgba(234,179,8,0.1)', textColor: '#eab308' };
  return { label: 'Low', color: '#22C55E', bgColor: 'rgba(34,197,94,0.1)', textColor: '#22c55e' };
}

const DASHBOARD_TEXT: Record<string, {
  title: string; totalSubs: string; mergedIssues: string; topPriority: string; coverage: string;
  mapTitle: string; byDepartment: string; categoryChart: string;
  runMerge: string; merging: string; noIssues: string; noIssuesHint: string;
  allCategories: string; error: string;
  critical: string; high: string; medium: string; low: string;
  similarComplaints: string; department: string; officer: string; status: string;
  locations: string; departments: string; keywords: string;
  aiActionPlan: string; nextSteps: string; timeline: string; schemes: string; documents: string;
  searchPlaceholder: string; expand: string; collapse: string;
  totalComplaints: string; uniqueIssues: string; mergedFrom: string;
  resolve: string; unresolve: string; resolved: string; resolvedOn: string; showResolved: string; showAll: string;
}> = {
  en: {
    title: 'MP Dashboard', totalSubs: 'Total Complaints', mergedIssues: 'Merged Issues', topPriority: 'Top Priority', coverage: 'Area Coverage',
    mapTitle: 'Demand Hotspots', byDepartment: 'Issues by Department', categoryChart: 'By Category',
    runMerge: 'AI Merge & Analyze', merging: 'Merging...', noIssues: 'No merged issues yet', noIssuesHint: 'Click "AI Merge & Analyze" to group similar complaints',
    allCategories: 'All Departments', error: 'Error',
    critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
    similarComplaints: 'Similar Complaints', department: 'Department', officer: 'Officer', status: 'Status',
    locations: 'Locations', departments: 'Departments', keywords: 'Keywords',
    aiActionPlan: 'AI Action Plan', nextSteps: 'Next Steps', timeline: 'Timeline', schemes: 'Government Schemes', documents: 'Required Documents',
    searchPlaceholder: 'Search issues...', expand: 'Expand', collapse: 'Collapse',
    totalComplaints: 'Total Complaints', uniqueIssues: 'Unique Issues', mergedFrom: 'merged from',
    resolve: 'Mark Resolved', unresolve: 'Mark Unresolved', resolved: 'Resolved', resolvedOn: 'Resolved on', showResolved: 'Show Resolved', showAll: 'Show All',
  },
  hi: {
    title: 'सांसद डैशबोर्ड', totalSubs: 'कुल शिकायतें', mergedIssues: 'मर्ज की गई समस्याएं', topPriority: 'शीर्ष प्राथमिकता', coverage: 'क्षेत्र कवरेज',
    mapTitle: 'मांग हॉटस्पॉट', byDepartment: 'विभाग अनुसार समस्याएं', categoryChart: 'श्रेणी अनुसार',
    runMerge: 'AI मर्ज और विश्लेषण', merging: 'मर्ज हो रहा है...', noIssues: 'अभी तक कोई मर्ज समस्या नहीं', noIssuesHint: 'समान शिकायतों को समूहित करने के लिए "AI मर्ज" पर क्लिक करें',
    allCategories: 'सभी विभाग', error: 'त्रुटि',
    critical: 'गंभीर', high: 'उच्च', medium: 'मध्यम', low: 'निम्न',
    similarComplaints: 'समान शिकायतें', department: 'विभाग', officer: 'अधिकारी', status: 'स्थिति',
    locations: 'स्थान', departments: 'विभाग', keywords: 'कीवर्ड',
    aiActionPlan: 'AI कार्य योजना', nextSteps: 'अगले कदम', timeline: 'समयसीमा', schemes: 'सरकारी योजनाएं', documents: 'आवश्यक दस्तावेज',
    searchPlaceholder: 'समस्याएं खोजें...', expand: 'विस्तारित करें', collapse: 'संक्षिप्त करें',
    totalComplaints: 'कुल शिकायतें', uniqueIssues: 'अद्वितीय समस्याएं', mergedFrom: 'मर्ज किया गया',
    resolve: 'हल के रूप में चिन्हित करें', unresolve: 'अनसॉल्व्ड के रूप में चिन्हित करें', resolved: 'हल हो गया', resolvedOn: 'हल हो गया', showResolved: 'हल दिखाएं', showAll: 'सभी दिखाएं',
  },
  te: {
    title: 'ఎంపీ డాష్\u200cబోర్డ్', totalSubs: 'మొత్తం ఫిర్యాదులు', mergedIssues: 'మర్జ్ చేసిన సమస్యలు', topPriority: 'శీర్ష ప్రాధాన్యత', coverage: 'కవరేజ్',
    mapTitle: 'డిమాండ్ హాట్\u200cస్పాట్\u200cలు', byDepartment: 'విభాగం వారీగా సమస్యలు', categoryChart: 'వర్గం వారీగా',
    runMerge: 'AI మర్జ్ & విశ్లేషణ', merging: 'మర్జ్ అవుతోంది...', noIssues: 'ఇంకా మర్జ్ సమస్యలు లేవు', noIssuesHint: 'సమాన ఫిర్యాదులను సమూహపరచడానికి "AI మర్జ్" క్లిక్ చేయండి',
    allCategories: 'అన్ని విభాగాలు', error: 'లోపం',
    critical: 'క్లిష్టమైన', high: 'అధిక', medium: 'మధ్యస్థం', low: 'తక్కువ',
    similarComplaints: 'సమాన ఫిర్యాదులు', department: 'విభాగం', officer: 'అధికారి', status: 'స్థితి',
    locations: 'ప్రదేశాలు', departments: 'విభాగాలు', keywords: 'కీవర్డ్\u200cలు',
    aiActionPlan: 'AI చర్యా ప్రణాళిక', nextSteps: 'తదుపరి దశలు', timeline: 'సమయపట్టిక', schemes: 'ప్రభుత్వ పథకాలు', documents: 'అవసరమైన పత్రాలు',
    searchPlaceholder: 'సమస్యలు శోధించండి...', expand: 'విస్తరించండి', collapse: 'సంక్షిప్తం చేయండి',
    totalComplaints: 'మొత్తం ఫిర్యాదులు', uniqueIssues: 'అనోఖి సమస్యలు', mergedFrom: 'మర్జ్ చేసిన',
    resolve: 'పరిష్కరించబడినదిగా గుర్తించండి', unresolve: 'పరిష్కరించబడలేదుగా గుర్తించండి', resolved: 'పరిష్కరించబడింది', resolvedOn: 'పరిష్కరించబడింది', showResolved: 'పరిష్కరించబడినవి చూపించండి', showAll: 'అన్నీ చూపించండి',
  },
  ta: {
    title: 'எம்.பி. டாஷ்போர்டு', totalSubs: 'மொத்த புகார்கள்', mergedIssues: 'இணைக்கப்பட்ட பிரச்சினைகள்', topPriority: 'உயர் முன்னுரிமை', coverage: 'பகுதி கவரேஜ்',
    mapTitle: 'தேவை ஹாட்ஸ்பாட்கள்', byDepartment: 'துறை வாரியான பிரச்சினைகள்', categoryChart: 'வகை வாரியாக',
    runMerge: 'AI இணைப்பு & பகுப்பாய்வு', merging: 'இணைக்கிறது...', noIssues: 'இன்னும் இணைக்கப்பட்ட பிரச்சினைகள் இல்லை', noIssuesHint: 'ஒத்த புகார்களை குழுப்படுத்த "AI இணைப்பு" என்பதைக் கிளிக் செய்யவும்',
    allCategories: 'அனைத்து துறைகள்', error: 'பிழை',
    critical: 'முக்கியமான', high: 'உயர்', medium: 'நடுத்தரம்', low: 'குறைந்த',
    similarComplaints: 'ஒத்த புகார்கள்', department: 'துறை', officer: 'அதிகாரி', status: 'நிலை',
    locations: 'இடங்கள்', departments: 'துறைகள்', keywords: 'முக்கிய வார்த்தைகள்',
    aiActionPlan: 'AI செயல் திட்டம்', nextSteps: 'அடுத்த படிகள்', timeline: 'காலவரிசை', schemes: 'அரசு திட்டங்கள்', documents: 'தேவையான ஆவணங்கள்',
    searchPlaceholder: 'பிரச்சினைகளைத் தேடுங்கள்...', expand: 'விரிவாக்கு', collapse: 'சுருக்கு',
    totalComplaints: 'மொத்த புகார்கள்', uniqueIssues: 'தனிப்பட்ட பிரச்சினைகள்', mergedFrom: 'இணைக்கப்பட்டது',
    resolve: 'தீர்வாகக் குறி', unresolve: 'தீர்க்கப்படாததாகக் குறி', resolved: 'தீர்க்கப்பட்டது', resolvedOn: 'தீர்க்கப்பட்டது', showResolved: 'தீர்க்கப்பட்டவைகளைக் காட்டு', showAll: 'அனைத்தையும் காட்டு',
  },
  bn: {
    title: 'সাংসদ ড্যাশবোর্ড', totalSubs: 'মোট অভিযোগ', mergedIssues: 'মার্জ করা সমস্যা', topPriority: 'শীর্ষ অগ্রাধিকার', coverage: 'এলাকা কভারেজ',
    mapTitle: 'চাহিদা হটস্পট', byDepartment: 'বিভাগ অনুযায়ী সমস্যা', categoryChart: 'বিভাগ অনুযায়ী',
    runMerge: 'AI মার্জ ও বিশ্লেষণ', merging: 'মার্জ হচ্ছে...', noIssues: 'এখনো কোনো মার্জ সমস্যা নেই', noIssuesHint: 'অনুরূপ অভিযোগ গ্রুপ করতে "AI মার্জ" ক্লিক করুন',
    allCategories: 'সব বিভাগ', error: 'ত্রুটি',
    critical: 'গুরুতর', high: 'উচ্চ', medium: 'মাঝারি', low: 'কম',
    similarComplaints: 'অনুরূপ অভিযোগ', department: 'বিভাগ', officer: 'কর্মকর্তা', status: 'অবস্থা',
    locations: 'অবস্থান', departments: 'বিভাগ', keywords: 'কীওয়ার্ড',
    aiActionPlan: 'AI কর্মপরিকল্পনা', nextSteps: 'পরবর্তী পদক্ষেপ', timeline: 'সময়সীমা', schemes: 'সরকারি প্রকল্প', documents: 'প্রয়োজনীয় কাগজপত্র',
    searchPlaceholder: 'সমস্যা খুঁজুন...', expand: 'বিস্তারিত', collapse: 'সংক্ষিপ্ত',
    totalComplaints: 'মোট অভিযোগ', uniqueIssues: 'অদ্বিতীয় সমস্যা', mergedFrom: 'মার্জ করা হয়েছে',
    resolve: 'সমাধান হিসাবে চিহ্নিত করুন', unresolve: 'সমাধান হয়নি হিসাবে চিহ্নিত করুন', resolved: 'সমাধান হয়েছে', resolvedOn: 'সমাধান হয়েছে', showResolved: 'সমাধান দেখান', showAll: 'সব দেখান',
  },
  kn: {
    title: 'ಸಂಸದ ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್', totalSubs: 'ಒಟ್ಟು ದೂರುಗಳು', mergedIssues: 'ಮರ್ಜ್ ಮಾಡಿದ ಸಮಸ್ಯೆಗಳು', topPriority: 'ಉನ್ನತ ಆದ್ಯತೆ', coverage: 'ಕವರೇಜ್',
    mapTitle: 'ಬೇಡಿಕೆ ಹಾಟ್\u200cಸ್ಪಾಟ್\u200cಗಳು', byDepartment: 'ಇಲಾಖೆ ವಾರು ಸಮಸ್ಯೆಗಳು', categoryChart: 'ವರ್ಗವಾರು',
    runMerge: 'AI ಮರ್ಜ್ & ವಿಶ್ಲೇಷಣೆ', merging: 'ಮರ್ಜ್ ಆಗುತ್ತಿದೆ...', noIssues: 'ಇನ್ನೂ ಮರ್ಜ್ ಸಮಸ್ಯೆಗಳು ಇಲ್ಲ', noIssuesHint: 'ಸಮಾನ ದೂರುಗಳನ್ನು ಗುಂಪುಮಾಡಲು "AI ಮರ್ಜ್" ಕ್ಲಿಕ್ ಮಾಡಿ',
    allCategories: 'ಎಲ್ಲಾ ಇಲಾಖೆಗಳು', error: 'ದೋಷ',
    critical: 'ಗಂಭೀರ', high: 'ಹೆಚ್ಚು', medium: 'ಮಧ್ಯಮ', low: 'ಕಡಿಮೆ',
    similarComplaints: 'ಸಮಾನ ದೂರುಗಳು', department: 'ಇಲಾಖೆ', officer: 'ಅಧಿಕಾರಿ', status: 'ಸ್ಥಿತಿ',
    locations: 'ಸ್ಥಳಗಳು', departments: 'ಇಲಾಖೆಗಳು', keywords: 'ಕೀವರ್ಡ್\u200cಗಳು',
    aiActionPlan: 'AI ಕ್ರಿಯಾ ಯೋಜನೆ', nextSteps: 'ಮುಂದಿನ ಹಂತಗಳು', timeline: 'ಸಮಯಪಟ್ಟಿ', schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', documents: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
    searchPlaceholder: 'ಸಮಸ್ಯೆಗಳನ್ನು ಹುಡುಕಿ...', expand: 'ವಿಸ್ತರಿಸಿ', collapse: 'ಸಂಕ್ಷಿಪ್ತ',
    totalComplaints: 'ಒಟ್ಟು ದೂರುಗಳು', uniqueIssues: 'ಅನನ್ಯ ಸಮಸ್ಯೆಗಳು', mergedFrom: 'ಮರ್ಜ್ ಮಾಡಲಾಗಿದೆ',
    resolve: 'ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ', unresolve: 'ಪರಿಹರಿಸಲಾಗಿಲ್ಲ ಎಂದು ಗುರುತಿಸಿ', resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ', resolvedOn: 'ಪರಿಹರಿಸಲಾಗಿದೆ', showResolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ ತೋರಿಸಿ', showAll: 'ಎಲ್ಲವನ್ನೂ ತೋರಿಸಿ',
  },
  ml: {
    title: 'എംപി ഡാഷ്\u200cബോർഡ്', totalSubs: 'മൊത്തം പരാതികൾ', mergedIssues: 'മർജ് ചെയ്ത പ്രശ്നങ്ങൾ', topPriority: 'ഉയർന്ന മുൻ\u200cഗണന', coverage: 'കവറേജ്',
    mapTitle: 'ആവശ്യകത ഹോട്ട്\u200cസ്പോട്ടുകൾ', byDepartment: 'വകുപ്പ് അനുസരിച്ചുള്ള പ്രശ്നങ്ങൾ', categoryChart: 'വിഭാഗം അനുസരിച്ച്',
    runMerge: 'AI മർജ് & വിശകലനം', merging: 'മർജ് ചെയ്യുന്നു...', noIssues: 'ഇതുവരെ മർജ് പ്രശ്നങ്ങൾ ഇല്ല', noIssuesHint: 'സമാന പരാതികൾ ഗ്രൂപ്പ് ചെയ്യാൻ "AI മർജ്" ക്ലിക്ക് ചെയ്യുക',
    allCategories: 'എല്ലാ വകുപ്പുകളും', error: 'പിശക്',
    critical: 'ഗുരുതരം', high: 'ഉയർന്നത്', medium: 'ഇടത്തരം', low: 'താഴ്ന്നത്',
    similarComplaints: 'സമാന പരാതികൾ', department: 'വകുപ്പ്', officer: 'ഉദ്യോഗസ്ഥൻ', status: 'അവസ്ഥ',
    locations: 'സ്ഥലങ്ങൾ', departments: 'വകുപ്പുകൾ', keywords: 'കീവേഡുകൾ',
    aiActionPlan: 'AI പ്രവർത്തന പദ്ധതി', nextSteps: 'അടുത്ത ഘട്ടങ്ങൾ', timeline: 'സമയപരിധി', schemes: 'സർക്കാർ പദ്ധതികൾ', documents: 'ആവശ്യമായ രേഖകൾ',
    searchPlaceholder: 'പ്രശ്നങ്ങൾ തിരയുക...', expand: 'വിപുലീകരിക്കുക', collapse: 'ചുരുക്കുക',
    totalComplaints: 'മൊത്തം പരാതികൾ', uniqueIssues: 'അദ്വിതീയ പ്രശ്നങ്ങൾ', mergedFrom: 'മർജ് ചെയ്തു',
    resolve: 'പരിഹരിച്ചതായി അടയാളപ്പെടുത്തുക', unresolve: 'പരിഹരിച്ചിട്ടില്ലെന്ന് അടയാളപ്പെടുത്തുക', resolved: 'പരിഹരിച്ചു', resolvedOn: 'പരിഹരിച്ചു', showResolved: 'പരിഹരിച്ചവ കാണിക്കുക', showAll: 'എല്ലാം കാണിക്കുക',
  },
  mr: {
    title: 'सांसद डॅशबोर्ड', totalSubs: 'एकूण तक्रारी', mergedIssues: 'मर्ज केलेल्या समस्या', topPriority: 'शीर्ष प्राथमिकता', coverage: 'क्षेत्र कव्हरेज',
    mapTitle: 'माग हॉटस्पॉट', byDepartment: 'विभागानुसार समस्या', categoryChart: 'श्रेणीनुसार',
    runMerge: 'AI मर्ज आणि विश्लेषण', merging: 'मर्ज होत आहे...', noIssues: 'अजून मर्ज समस्या नाहीत', noIssuesHint: 'समान तक्रारी गट करण्यासाठी "AI मर्ज" वर क्लिक करा',
    allCategories: 'सर्व विभाग', error: 'त्रुटी',
    critical: 'गंभीर', high: 'उच्च', medium: 'मध्यम', low: 'कमी',
    similarComplaints: 'समान तक्रारी', department: 'विभाग', officer: 'अधिकारी', status: 'स्थिती',
    locations: 'ठिकाणे', departments: 'विभाग', keywords: 'कीवर्ड',
    aiActionPlan: 'AI क्रिया योजना', nextSteps: 'पुढील पायऱ्या', timeline: 'वेळापत्रक', schemes: 'सरकारी योजना', documents: 'आवश्यक कागदपत्रे',
    searchPlaceholder: 'समस्या शोधा...', expand: 'विस्तारित करा', collapse: 'संक्षिप्त करा',
    totalComplaints: 'एकूण तक्रारी', uniqueIssues: 'अद्वितीय समस्या', mergedFrom: 'मर्ज केले',
    resolve: 'निराकरित म्हणून चिन्हांकित करा', unresolve: 'निराकरित नाही म्हणून चिन्हांकित करा', resolved: 'निराकरित', resolvedOn: 'निराकरित', showResolved: 'निराकरित दाखवा', showAll: 'सर्व दाखवा',
  },
  gu: {
    title: 'સાંસદ ડેશબોર્ડ', totalSubs: 'કુલ ફરિયાદો', mergedIssues: 'મર્જ કરેલ સમસ્યાઓ', topPriority: 'ટોચની પ્રાથમિકતા', coverage: 'કવરેજ',
    mapTitle: 'માંગ હોટસ્પોટ્સ', byDepartment: 'વિભાગ મુજબ સમસ્યાઓ', categoryChart: 'કેટેગરી મુજબ',
    runMerge: 'AI મર્જ & વિશ્લેષણ', merging: 'મર્જ થઈ રહ્યું છે...', noIssues: 'હજુ કોઈ મર્જ સમસ્યા નથી', noIssuesHint: 'સમાન ફરિયાદો જૂથ કરવા "AI મર્જ" પર ક્લિક કરો',
    allCategories: 'બધા વિભાગો', error: 'ભૂલ',
    critical: 'ગંભીર', high: 'ઊંચું', medium: 'મધ્યમ', low: 'ઓછું',
    similarComplaints: 'સમાન ફરિયાદો', department: 'વિભાગ', officer: 'અધિકારી', status: 'સ્થિતિ',
    locations: 'સ્થળો', departments: 'વિભાગો', keywords: 'કીવર્ડ્સ',
    aiActionPlan: 'AI ક્રિયા યોજના', nextSteps: 'આગળના પગલાં', timeline: 'સમયમર્યાદા', schemes: 'સરકારી યોજનાઓ', documents: 'જરૂરી દસ્તાવેજો',
    searchPlaceholder: 'સમસ્યાઓ શોધો...', expand: 'વિસ્તૃત કરો', collapse: 'ટૂંકું કરો',
    totalComplaints: 'કુલ ફરિયાદો', uniqueIssues: 'અનોખી સમસ્યાઓ', mergedFrom: 'મર્જ કરેલ',
    resolve: 'ઉકેલાયેલ તરીકે ચિહ્નિત કરો', unresolve: 'ઉકેલાયેલ નથી તરીકે ચિહ્નિત કરો', resolved: 'ઉકેલાયેલ', resolvedOn: 'ઉકેલાયેલ', showResolved: 'ઉકેલાયેલ બતાવો', showAll: 'બધું બતાવો',
  },
  or: {
    title: 'ସାଂସଦ ଡ୍ୟାଶବୋର୍ଡ', totalSubs: 'ମୋଟ ଅଭିଯୋଗ', mergedIssues: 'ମର୍ଜ ସମସ୍ୟା', topPriority: 'ଶୀର୍ଷ ପ୍ରାଥମିକତା', coverage: 'ଅଞ୍ଚଳ କଭରେଜ୍',
    mapTitle: 'ଚାହିଦା ହଟସ୍ପଟ୍', byDepartment: 'ବିଭାଗ ଅନୁସାରେ ସମସ୍ୟା', categoryChart: 'ବିଭାଗ ଅନୁସାରେ',
    runMerge: 'AI ମର୍ଜ & ବିଶ୍ଳେଷଣ', merging: 'ମର୍ଜ ହେଉଛି...', noIssues: 'ଏପର୍ଯ୍ୟନ୍ତ ମର୍ଜ ସମସ୍ୟା ନାହିଁ', noIssuesHint: 'ସମାନ ଅଭିଯୋଗ ଗ୍ରୁପ୍ କରିବାକୁ "AI ମର୍ଜ" କ୍ଲିକ୍ କରନ୍ତୁ',
    allCategories: 'ସମସ୍ତ ବିଭାଗ', error: 'ତ୍ରୁଟି',
    critical: 'ଗୁରୁତର', high: 'ଉଚ୍ଚ', medium: 'ମଧ୍ୟମ', low: 'କମ୍',
    similarComplaints: 'ସମାନ ଅଭିଯୋଗ', department: 'ବିଭାଗ', officer: 'ଅଧିକାରୀ', status: 'ସ୍ଥିତି',
    locations: 'ସ୍ଥାନ', departments: 'ବିଭାଗ', keywords: 'କିୱାର୍ଡ',
    aiActionPlan: 'AI କାର୍ଯ୍ୟ ଯୋଜନା', nextSteps: 'ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ', timeline: 'ସମୟସୀମା', schemes: 'ସରକାରୀ ଯୋଜନା', documents: 'ଆବଶ୍ୟକ ଦସ୍ତାବିଜ୍',
    searchPlaceholder: 'ସମସ୍ୟା ଖୋଜନ୍ତୁ...', expand: 'ବିସ୍ତୃତ', collapse: 'ସଂକ୍ଷିପ୍ତ',
    totalComplaints: 'ମୋଟ ଅଭିଯୋଗ', uniqueIssues: 'ଅଦ୍ୱିତୀୟ ସମସ୍ୟା', mergedFrom: 'ମର୍ଜ ହୋଇଛି',
    resolve: 'ସମାଧାନ ହିସାବରେ ଚିହ୍ନିତ କରନ୍ତୁ', unresolve: 'ସମାଧାନ ହୋଇନାହିଁ ହିସାବରେ ଚିହ୍ନିତ କରନ୍ତୁ', resolved: 'ସମାଧାନ ହୋଇଛି', resolvedOn: 'ସମାଧାନ ହୋଇଛି', showResolved: 'ସମାଧାନ ଦେଖାନ୍ତୁ', showAll: 'ସବୁ ଦେଖାନ୍ତୁ',
  },
  pa: {
    title: 'ਸਾਂਸਦ ਡੈਸ਼ਬੋਰਡ', totalSubs: 'ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ', mergedIssues: 'ਮਰਜ ਕੀਤੀਆਂ ਸਮੱਸਿਆਵਾਂ', topPriority: 'ਉੱਚ ਤਰਜੀਹ', coverage: 'ਖੇਤਰ ਕਵਰੇਜ',
    mapTitle: 'ਮੰਗ ਹਾਟਸਪਾਟ', byDepartment: 'ਵਿਭਾਗ ਅਨੁਸਾਰ ਸਮੱਸਿਆਵਾਂ', categoryChart: 'ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ',
    runMerge: 'AI ਮਰਜ & ਵਿਸ਼ਲੇਸ਼ਣ', merging: 'ਮਰਜ ਹੋ ਰਿਹਾ ਹੈ...', noIssues: 'ਹਜੇ ਕੋਈ ਮਰਜ ਸਮੱਸਿਆ ਨਹੀਂ', noIssuesHint: 'ਸਮਾਨ ਸ਼ਿਕਾਇਤਾਂ ਸਮੂਹ ਕਰਨ ਲਈ "AI ਮਰਜ" ਤੇ ਕਲਿੱਕ ਕਰੋ',
    allCategories: 'ਸਾਰੇ ਵਿਭਾਗ', error: 'ਗਲਤੀ',
    critical: 'ਗੰਭੀਰ', high: 'ਉੱਚ', medium: 'ਦਰਮਿਆਨਾ', low: 'ਘੱਟ',
    similarComplaints: 'ਸਮਾਨ ਸ਼ਿਕਾਇਤਾਂ', department: 'ਵਿਭਾਗ', officer: 'ਅਧਿਕਾਰੀ', status: 'ਸਥਿਤੀ',
    locations: 'ਟਿਕਾਣੇ', departments: 'ਵਿਭਾਗ', keywords: 'ਕੀਵਰਡ',
    aiActionPlan: 'AI ਕਾਰਵਾਈ ਯੋਜਨਾ', nextSteps: 'ਅਗਲੇ ਕਦਮ', timeline: 'ਸਮਾਂਸੀਮਾ', schemes: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ', documents: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
    searchPlaceholder: 'ਸਮੱਸਿਆਵਾਂ ਲੱਭੋ...', expand: 'ਵਿਸਤਾਰਿਤ', collapse: 'ਸੰਖੇਪ',
    totalComplaints: 'ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ', uniqueIssues: 'ਵਿਲੱਖਣ ਸਮੱਸਿਆਵਾਂ', mergedFrom: 'ਮਰਜ ਕੀਤੀਆਂ',
    resolve: 'ਹੱਲ ਹੋਇਆ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ', unresolve: 'ਹੱਲ ਨਹੀਂ ਹੋਇਆ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ', resolved: 'ਹੱਲ ਹੋ ਗਿਆ', resolvedOn: 'ਹੱਲ ਹੋ ਗਿਆ', showResolved: 'ਹੱਲ ਹੋਇਆ ਦਿਖਾਓ', showAll: 'ਸਭ ਦਿਖਾਓ',
  },
  as: {
    title: 'সাংসদ ডেশ্বৰ্ড', totalSubs: 'মুঠ অভিযোগ', mergedIssues: 'মার্জ কৰা সমস্যা', topPriority: 'শীৰ্ষ প্ৰাধিকাৰ', coverage: 'এলেকা কভাৰেজ',
    mapTitle: 'চাহিদা হটস্পট', byDepartment: 'বিভাগ অনুসৰি সমস্যা', categoryChart: 'শ্ৰেণী অনুসৰি',
    runMerge: 'AI মার্জ & বিশ্লেষণ', merging: 'মার্জ হৈ আছে...', noIssues: 'এতিয়াও কোনো মার্জ সমস্যা নাই', noIssuesHint: 'একেবোৰ অভিযোগ দলবদ্ধ কৰিবলৈ "AI মার্জ" ক্লিক কৰক',
    allCategories: 'সকলো বিভাগ', error: 'ত্ৰুটি',
    critical: 'গুৰুতৰ', high: 'উচ্চ', medium: 'মধ্যম', low: 'কম',
    similarComplaints: 'একেবোৰ অভিযোগ', department: 'বিভাগ', officer: 'কৰ্মচাৰী', status: 'অৱস্থা',
    locations: 'স্থান', departments: 'বিভাগ', keywords: 'কীৱৰ্ড',
    aiActionPlan: 'AI কাৰ্য পৰিকল্পনা', nextSteps: 'পৰৱৰ্তী পদক্ষেপ', timeline: 'সময়সীমা', schemes: 'চৰকাৰী আঁচনি', documents: 'প্ৰয়োজনীয় কাগজপত্ৰ',
    searchPlaceholder: 'সমস্যা বিচাৰক...', expand: 'বিস্তৃত', collapse: 'সংক্ষিপ্ত',
    totalComplaints: 'মুঠ অভিযোগ', uniqueIssues: 'অদ্বিতীয় সমস্যা', mergedFrom: 'মার্জ কৰা হৈছে',
    resolve: 'সমাধান হিচাপে চিহ্নিত কৰক', unresolve: 'সমাধান হোৱা নাই হিচাপে চিহ্নিত কৰক', resolved: 'সমাধান হৈছে', resolvedOn: 'সমাধান হৈছে', showResolved: 'সমাধান দেখুৱাওক', showAll: 'সকলো দেখুৱাওক',
  },
};

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
  resolved?: boolean;
  resolved_at?: string | null;
  ai_suggestion?: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  };
}

interface Submission {
  id: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  theme_name: string | null;
  urgency_score: number | null;
  priority_score: number | null;
  status: string;
  location_name: string | null;
  text_input: string | null;
  voice_transcript: string | null;
  source?: string;
  language?: string;
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
  created_at?: { seconds: number; nanoseconds: number } | null;
}

export default function DashboardPage() {
  const [mergedIssues, setMergedIssues] = useState<MergedIssue[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [lang, setLang] = useState('en');
  const [showLangs, setShowLangs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selectedIssue, setSelectedIssue] = useState<MergedIssue | null>(null);
  const [showResolvedFilter, setShowResolvedFilter] = useState<'all' | 'active' | 'resolved'>('active');

  useEffect(() => {
    const saved = localStorage.getItem('jansankalp-dashboard-lang') || 'en';
    setLang(saved);
  }, []);

  const t = DASHBOARD_TEXT[lang] || DASHBOARD_TEXT.en;

  const switchLang = (code: string) => {
    localStorage.setItem('jansankalp-dashboard-lang', code);
    window.location.reload();
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mergedRes, subRes] = await Promise.all([
        fetch('/api/merge-complaints'),
        fetch('/api/submissions?limit=500'),
      ]);
      const mergedData = await mergedRes.json();
      const subData = await subRes.json();
      setMergedIssues(mergedData.merged_issues || []);
      // Filter out audio-only IVR complaints (no speech-to-text)
      const allSubs = (subData.submissions || []).filter((s: any) => {
        if (s.source !== 'ivr') return true;
        const text = s.text_input || s.voice_transcript || '';
        if (!text || text.trim().length === 0) return false;
        if (text.toLowerCase().includes('audio recorded')) return false;
        return true;
      });
      setSubmissions(allSubs);
      setExpandedDepts(new Set(Object.keys(CATEGORY_META)));
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {}, []);

  const runMerge = async () => {
    setMerging(true);
    try {
      await fetch('/api/merge-complaints', { method: 'POST' });
      await fetchData();
    } catch {} finally {
      setMerging(false);
    }
  };

  const toggleDept = (cat: string) => {
    setExpandedDepts(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleResolved = async (issue: MergedIssue, e: React.MouseEvent) => {
    e.stopPropagation();
    const newResolved = !issue.resolved;
    try {
      await fetch('/api/resolve-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: issue.id, resolved: newResolved }),
      });
      setMergedIssues(prev => prev.map(i =>
        i.id === issue.id ? { ...i, resolved: newResolved, resolved_at: newResolved ? new Date().toISOString() : null } : i
      ));
    } catch (err) {
      console.error('Failed to toggle resolved:', err);
    }
  };

  const getTranslatedQuery = (issue: MergedIssue): string => {
    if (issue.representative_query_translations?.[lang]) return issue.representative_query_translations[lang];
    if (issue.representative_query_translations?.['en']) return issue.representative_query_translations['en'];
    return issue.representative_query || '';
  };

  const filteredIssues = filterCategory ? mergedIssues.filter(i => i.category === filterCategory) : mergedIssues;
  const resolvedFiltered = filteredIssues.filter(i => {
    if (showResolvedFilter === 'active') return !i.resolved;
    if (showResolvedFilter === 'resolved') return i.resolved;
    return true;
  });
  const searchFiltered = searchQuery
    ? resolvedFiltered.filter(i => {
        const q = searchQuery.toLowerCase();
        return getTranslatedQuery(i).toLowerCase().includes(q)
          || i.locations.some(l => l.toLowerCase().includes(q))
          || i.departments.some(d => d.toLowerCase().includes(q))
          || i.severity_keywords.some(k => k.toLowerCase().includes(q));
      })
    : resolvedFiltered;
  const sortedFiltered = [...searchFiltered].sort((a, b) => {
    if (a.resolved && !b.resolved) return 1;
    if (!a.resolved && b.resolved) return -1;
    return b.priority_score - a.priority_score;
  });

  const allMergedSubIds = new Set(mergedIssues.flatMap(i => i.merged_submission_ids));
  const unmergedSubs = submissions.filter(s => !allMergedSubIds.has(s.id) && (!filterCategory || s.category === filterCategory));

  const categoryCounts = mergedIssues.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + i.complaint_count;
    return acc;
  }, {} as Record<string, number>);
  unmergedSubs.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  const departmentGroups = Object.keys(CATEGORY_META)
    .filter(cat => sortedFiltered.some(i => i.category === cat) || unmergedSubs.some(s => s.category === cat))
    .sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));

  const deptIssueCounts: Record<string, Record<string, number>> = {};
  sortedFiltered.forEach(i => {
    if (!deptIssueCounts[i.category]) deptIssueCounts[i.category] = { critical: 0, high: 0, medium: 0, low: 0 };
    const level = getPriorityLevel(i.priority_score);
    deptIssueCounts[i.category][level.label.toLowerCase()]++;
  });

  const stats = {
    totalComplaints: mergedIssues.reduce((sum, i) => sum + i.complaint_count, 0) + unmergedSubs.length,
    uniqueIssues: mergedIssues.length + unmergedSubs.length,
    topPriority: mergedIssues.reduce((max, i) => Math.max(max, i.priority_score), 0),
    coverage: new Set(submissions.filter(s => s.latitude).map(s => `${s.latitude?.toFixed(2)},${s.longitude?.toFixed(2)}`)).size,
    ivrCount: submissions.filter(s => s.source === 'ivr').length,
    webCount: submissions.filter(s => s.source !== 'ivr').length,
  };

  const getOfficerForCategory = (cat: string): string => {
    const officers: Record<string, string> = {
      healthcare: 'Dr. Priya Sharma (CMO)',
      water: 'Rajesh Kumar (Executive Engineer)',
      roads: 'Amit Patel (Superintendent Engineer)',
      electricity: 'Vikram Singh (Dy. Director)',
      sanitation: 'Sunita Devi (Municipal Commissioner)',
      employment: 'Mohan Das (District Employment Officer)',
      education: 'Kavita Reddy (District Education Officer)',
      other: 'Suresh Nair (Sub-Divisional Magistrate)',
    };
    return officers[cat] || 'Not Assigned';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-40 glass-strong" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => { localStorage.removeItem('jansankalp-lang'); window.location.href = '/'; }}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6" style={{ background: 'var(--border-primary)' }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white font-bold text-xs">JS</span>
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
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
            <button onClick={() => { setRefreshing(true); fetchData().finally(() => setRefreshing(false)); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: 'var(--accent-gradient)', color: 'white', opacity: refreshing ? 0.6 : 1 }}>
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {refreshing ? t.merging : 'Refresh Data'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatsCard icon={Users} label={t.totalComplaints} value={stats.totalComplaints} color="#3B82F6" />
            <StatsCard icon={Copy} label={t.mergedIssues} value={stats.uniqueIssues} color="#8B5CF6" />
            <StatsCard icon={TrendingUp} label={t.topPriority} value={stats.topPriority.toFixed(1)} color="#EF4444" />
            <StatsCard icon={MapPin} label={t.coverage} value={`${stats.coverage}`} color="#10B981" />
          </div>
          <Link href={`/${lang}/dashboard/ivr-complaints`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white' }}>
            <Phone className="w-4 h-4" />
            IVR Complaints
            {stats.ivrCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>{stats.ivrCount}</span>
            )}
          </Link>
          <Link href={`/${lang}/dashboard/projects`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}>
            <BarChart3 className="w-4 h-4" />
            Project Prioritization
          </Link>
          <Link href={`/${lang}/dashboard/planner`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white' }}>
            <Layers className="w-4 h-4" />
            Development Planner
          </Link>
          <Link href={`/${lang}/dashboard/evaluator`}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white' }}>
            <Trophy className="w-4 h-4" />
            Proposal Evaluator
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="card overflow-hidden" style={{ padding: 0 }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t.mapTitle}</h2>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  className="input text-sm" style={{ width: 'auto', padding: '6px 12px' }}>
                  <option value="">{t.allCategories}</option>
                  {Object.entries(CATEGORY_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ height: '420px' }}>
                {loading
                  ? <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--text-tertiary)' }} /></div>
                  : <DemandMap submissions={submissions} lang={lang} filterCategory={filterCategory} />}
              </div>
            </div>

            {/* Issues */}
            <div className="card" style={{ padding: '20px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t.byDepartment}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg p-0.5" style={{ background: 'var(--bg-tertiary)' }}>
                    {(['active', 'all', 'resolved'] as const).map(f => (
                      <button key={f} onClick={() => setShowResolvedFilter(f)}
                        className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                        style={{
                          background: showResolvedFilter === f ? 'var(--bg-card)' : 'transparent',
                          color: showResolvedFilter === f ? 'var(--text-primary)' : 'var(--text-tertiary)',
                          boxShadow: showResolvedFilter === f ? 'var(--shadow-sm)' : 'none',
                        }}>
                        {f === 'active' ? 'Active' : f === 'resolved' ? t.resolved : t.showAll}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder} className="input pl-9" style={{ width: '240px', padding: '8px 12px 8px 36px' }} />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--text-tertiary)' }} /></div>
              ) : departmentGroups.length === 0 ? (
                <div className="text-center py-10">
                  <Lightbulb className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>{t.noIssues}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{t.noIssuesHint}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {departmentGroups.map(cat => {
                    const meta = CATEGORY_META[cat];
                    const catIssues = sortedFiltered
                      .filter(i => i.category === cat)
                      .sort((a, b) => {
                        if (a.resolved && !b.resolved) return 1;
                        if (!a.resolved && b.resolved) return -1;
                        return b.priority_score - a.priority_score;
                      });
                    const totalCount = catIssues.reduce((sum, i) => sum + i.complaint_count, 0);
                    const counts = deptIssueCounts[cat] || { critical: 0, high: 0, medium: 0, low: 0 };
                    const isExpanded = expandedDepts.has(cat);

                    return (
                      <div key={cat} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                        <button onClick={() => toggleDept(cat)}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <span className="text-2xl">{meta.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{meta.label}</span>
                              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({meta.department})</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{catIssues.length} {t.mergedIssues} • {totalCount} {t.totalComplaints.toLowerCase()}</span>
                              {counts.critical > 0 && <span className="badge badge-danger">{counts.critical} {t.critical}</span>}
                              {counts.high > 0 && <span className="badge" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>{counts.high} {t.high}</span>}
                              {counts.medium > 0 && <span className="badge" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>{counts.medium} {t.medium}</span>}
                              {counts.low > 0 && <span className="badge badge-success">{counts.low} {t.low}</span>}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 transition-transform" style={{ color: 'var(--text-tertiary)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)' }} />
                        </button>

                        {isExpanded && (
                          <div style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                            {catIssues.length === 0 && unmergedSubs.filter(s => s.category === cat).length === 0 ? (
                              <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>No issues in this department</p>
                            ) : (
                              <div style={{ borderTop: '1px solid var(--border-secondary)' }}>
                                {catIssues.map((issue) => {
                                  const priority = getPriorityLevel(issue.priority_score);
                                  const isSelected = selectedIssue?.id === issue.id;
                                  const query = getTranslatedQuery(issue);

                                  return (
                                    <div key={issue.id} onClick={() => setSelectedIssue(isSelected ? null : issue)}
                                      className="px-4 py-3 transition-colors cursor-pointer"
                                      style={{
                                        background: issue.resolved ? 'rgba(16,185,129,0.05)' : 'transparent',
                                        borderLeft: issue.resolved ? '4px solid #10b981' : '4px solid transparent',
                                      }}
                                      onMouseEnter={(e) => { if (!issue.resolved) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                                      onMouseLeave={(e) => { if (!issue.resolved) e.currentTarget.style.background = 'transparent'; }}>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
                                          style={{ background: priority.bgColor }}>
                                          <span className="text-xs font-bold" style={{ color: priority.textColor }}>{issue.complaint_count}</span>
                                          {issue.complaint_count > 1 && <span className="text-[9px]" style={{ color: priority.textColor }}>merged</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm line-clamp-2 font-medium" style={{ color: issue.resolved ? '#10b981' : 'var(--text-primary)' }}>{query}</p>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              {issue.resolved && (
                                                <span className="badge badge-success flex items-center gap-1">
                                                  <CheckCircle2 className="w-3 h-3" />
                                                  {t.resolved}
                                                </span>
                                              )}
                                              <span className="badge" style={{ background: priority.bgColor, color: priority.textColor, border: `1px solid ${priority.textColor}22` }}>
                                                {priority.label}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-3 text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                                            {issue.complaint_count > 1 && (
                                              <span className="flex items-center gap-1 font-medium" style={{ color: 'var(--text-accent)' }}>
                                                <Copy className="w-3 h-3" />
                                                {issue.complaint_count} {t.similarComplaints.toLowerCase()}
                                              </span>
                                            )}
                                            {issue.locations.length > 0 && (
                                              <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {issue.locations.slice(0, 2).join(', ')}
                                              </span>
                                            )}
                                            {issue.severity_keywords.length > 0 && (
                                              <span className="flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {issue.severity_keywords.slice(0, 2).join(', ')}
                                              </span>
                                            )}
                                          </div>

                                          <button onClick={(e) => toggleResolved(issue, e)}
                                            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                                            style={{
                                              background: issue.resolved ? 'rgba(16,185,129,0.1)' : 'var(--bg-tertiary)',
                                              border: `1px solid ${issue.resolved ? 'rgba(16,185,129,0.2)' : 'var(--border-primary)'}`,
                                              color: issue.resolved ? '#10b981' : 'var(--text-secondary)',
                                            }}>
                                            {issue.resolved
                                              ? <><CheckCircle2 className="w-3.5 h-3.5" />{t.unresolve}</>
                                              : <><Circle className="w-3.5 h-3.5" />{t.resolve}</>}
                                          </button>

                                          {issue.resolved && issue.resolved_at && (
                                            <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>{t.resolvedOn}: {new Date(issue.resolved_at).toLocaleDateString()}</p>
                                          )}

                                          {isSelected && (
                                            <div className="mt-3 space-y-3 rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                                              <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                  <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>{t.department}</span>
                                                  <p className="mt-0.5" style={{ color: 'var(--text-primary)' }}>{issue.departments[0] || meta.department}</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>{t.officer}</span>
                                                  <p className="mt-0.5" style={{ color: 'var(--text-primary)' }}>{getOfficerForCategory(cat)}</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>{t.totalComplaints}</span>
                                                  <p className="mt-0.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{issue.complaint_count} {t.mergedFrom} {issue.merged_submission_ids.length} reports</p>
                                                </div>
                                                <div>
                                                  <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>{t.locations}</span>
                                                  <p className="mt-0.5" style={{ color: 'var(--text-primary)' }}>{issue.locations.slice(0, 3).join(', ') || 'Multiple areas'}</p>
                                                </div>
                                              </div>

                                              {issue.severity_keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                                                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{t.keywords}:</span>
                                                  {issue.severity_keywords.map((kw, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{kw}</span>
                                                  ))}
                                                </div>
                                              )}

                                              {issue.ai_suggestion && (
                                                <div className="pt-2 space-y-2" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                                                  <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#f59e0b' }}>
                                                    <Lightbulb className="w-3 h-3" />
                                                    {t.aiActionPlan}
                                                  </p>
                                                  {issue.ai_suggestion.next_steps.length > 0 && (
                                                    <div>
                                                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t.nextSteps}</p>
                                                      <ul className="mt-1 space-y-0.5">
                                                        {issue.ai_suggestion.next_steps.slice(0, 3).map((step, i) => (
                                                          <li key={i} className="text-xs flex items-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                                                            <span className="font-bold" style={{ color: '#f59e0b' }}>{i + 1}.</span>{step}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  )}
                                                  <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                      <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t.timeline}</p>
                                                      <p className="text-xs" style={{ color: 'var(--text-primary)' }}>{issue.ai_suggestion.estimated_timeline}</p>
                                                    </div>
                                                    {issue.ai_suggestion.relevant_schemes.length > 0 && (
                                                      <div>
                                                        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{t.schemes}</p>
                                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                                          {issue.ai_suggestion.relevant_schemes.slice(0, 2).map((s, i) => (
                                                            <span key={i} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{s}</span>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {unmergedSubs.filter(s => s.category === cat).length > 0 && catIssues.length > 0 && (
                                  <div className="px-4 py-2" style={{ borderTop: '1px dashed var(--border-primary)' }}>
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Individual Reports</span>
                                  </div>
                                )}
                                {unmergedSubs.filter(s => s.category === cat).sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0)).map((sub) => {
                                  const priority = getPriorityLevel(sub.priority_score || 0);
                                  const text = sub.allTranslations?.[lang] || sub.allTranslations?.['en'] || sub.ai_summary || sub.text_input || sub.voice_transcript || '(No description)';
                                  return (
                                    <div key={sub.id}
                                      className="px-4 py-3 transition-colors"
                                      style={{ borderLeft: '4px solid transparent' }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-0.5 w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
                                          style={{ background: priority.bgColor }}>
                                          <span className="text-xs font-bold" style={{ color: priority.textColor }}>1</span>
                                          <span className="text-[9px]" style={{ color: priority.textColor }}>new</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm line-clamp-2 font-medium" style={{ color: 'var(--text-primary)' }}>{text}</p>
                                          <div className="flex items-center gap-3 text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                                            {sub.location_name && (
                                              <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {sub.location_name}
                                              </span>
                                            )}
                                            {sub.source === 'ivr' && (
                                              <span className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
                                                <Phone className="w-3 h-3" />
                                                IVR
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card" style={{ padding: '20px' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t.categoryChart}</h3>
              <CategoryChart data={categoryCounts} />
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t.byDepartment} - {t.totalComplaints}</h3>
              <div className="space-y-2">
                {departmentGroups.slice(0, 5).map(cat => {
                  const meta = CATEGORY_META[cat];
                  const catIssues = mergedIssues.filter(i => i.category === cat);
                  const totalCount = catIssues.reduce((sum, i) => sum + i.complaint_count, 0);
                  const avgPriority = catIssues.length > 0
                    ? catIssues.reduce((sum, i) => sum + i.priority_score, 0) / catIssues.length
                    : 0;
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-lg">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{totalCount} reports</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full mt-1" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (avgPriority / 10) * 100)}%`, backgroundColor: meta.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-glass" style={{ padding: '20px', background: 'var(--bg-card)' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                {t.department}
              </h3>
              <div className="space-y-2">
                {departmentGroups.slice(0, 4).map(cat => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <div key={cat} className="rounded-lg p-2.5" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{meta.department}</p>
                          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{getOfficerForCategory(cat)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
