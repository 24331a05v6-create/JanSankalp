export type Category = 
  | 'education' 
  | 'healthcare' 
  | 'roads' 
  | 'water' 
  | 'sanitation' 
  | 'electricity' 
  | 'employment' 
  | 'other';

export type Language = 
  | 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'mr' | 'gu' | 'bn' | 'or' | 'pa' | 'as';

export type Source = 'web' | 'whatsapp' | 'mobile' | 'kiosk';
export type Status = 'pending' | 'processing' | 'analyzed' | 'archived';

export interface Submission {
  id: string;
  created_at: string;
  text_input: string | null;
  voice_transcript: string | null;
  photo_url: string | null;
  ocr_text: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  category: Category;
  language: Language;
  source: Source;
  session_id: string | null;
  theme_id: string | null;
  theme_name: string | null;
  urgency_score: number | null;
  priority_score: number | null;
  status: Status;
  // AI-extracted fields (Capability 1: Understand Input)
  ai_summary: string | null;
  ai_entities: {
    location_mentioned: string | null;
    issue_type: string | null;
    department: string | null;
    severity_keywords: string[];
    affected_people: string | null;
  } | null;
  // AI categorization fields (Capability 2: Auto-Categorize)
  ai_category: Category | null;
  ai_subcategory: string | null;
  ai_category_confidence: number | null;
  category_override: boolean;
  // Duplicate detection fields (Capability 3: Merge Duplicates)
  duplicate_of: string | null;
  duplicate_count: number;
  // AI suggestion fields (Capability 6: Generate Suggestions)
  ai_suggestion: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  } | null;
}

export interface Theme {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  category: Category | null;
  submission_count: number;
  avg_urgency: number | null;
  priority_score: number | null;
  representative_submissions: string[];
  bbox: GeoJSON.Polygon | null;
  center_point: GeoJSON.Point | null;
}

export interface ConstituencyData {
  id: string;
  name: string;
  state: string | null;
  district: string | null;
  population: number | null;
  literacy_rate: number | null;
  geom: GeoJSON.Polygon | null;
  metadata: Record<string, unknown> | null;
}

export interface InfrastructureGap {
  id: string;
  category: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  geom: GeoJSON.Point | null;
  severity: number | null;
  source: string | null;
  metadata: Record<string, unknown> | null;
}

export interface SubmissionInput {
  text_input?: string;
  voice_transcript?: string;
  photo_url?: string;
  ocr_text?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  category: Category;
  language: Language;
  source?: Source;
  session_id?: string;
}

// IVR Complaint types
export type IVRLanguage = 'te' | 'hi' | 'en' | 'ta' | 'kn' | 'ml';

export type IVRQuestionType = 'problem' | 'location' | 'category';

export type IVRCallStep =
  | 'ringing'
  | 'connected'
  | 'welcome'
  | 'languageSelect'
  | 'questionPrompt'
  | 'keypadMenu'
  | 'categorySelect'
  | 'uploading'
  | 'processing'
  | 'success';

export interface IVRComplaint {
  complaintId: string;
  language: IVRLanguage;
  audioUrl: string;
  createdAt: string;
  status: 'Submitted' | 'Processing' | 'Resolved';
  source: 'IVR';
  processingStage: 'Waiting for AI' | 'AI Processing' | 'Completed';
  transcript: string;
  category: string;
  priority: string;
  summary: string;
  location: string;
  suggestion: string;
}

export const IVR_LANGUAGES: { value: IVRLanguage; label: string; nativeLabel: string; shortcut: number }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English', shortcut: 1 },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', shortcut: 2 },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', shortcut: 3 },
  { value: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', shortcut: 4 },
  { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', shortcut: 5 },
  { value: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', shortcut: 6 },
];

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'education', label: 'Education', icon: 'graduation-cap' },
  { value: 'healthcare', label: 'Healthcare', icon: 'heart-pulse' },
  { value: 'roads', label: 'Roads & Transport', icon: 'road' },
  { value: 'water', label: 'Water Supply', icon: 'droplets' },
  { value: 'sanitation', label: 'Sanitation', icon: 'flush' },
  { value: 'electricity', label: 'Electricity', icon: 'zap' },
  { value: 'employment', label: 'Employment', icon: 'briefcase' },
  { value: 'other', label: 'Other', icon: 'more-horizontal' },
];

export const LANGUAGES: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { value: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { value: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { value: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { value: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { value: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { value: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { value: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { value: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
];