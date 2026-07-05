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