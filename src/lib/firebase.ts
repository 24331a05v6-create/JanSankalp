import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit as firestoreLimit, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface SubmissionData {
  text_input?: string;
  voice_transcript?: string;
  photo_url?: string;
  ocr_text?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  category: string;
  language: string;
  source?: string;
  session_id?: string;
  theme_id?: string;
  theme_name?: string;
  urgency_score?: number;
  priority_score?: number;
  status: string;
  created_at?: any;
}

export async function addSubmission(data: SubmissionData) {
  const docRef = await addDoc(collection(db, 'submissions'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function getSubmissions(options: {
  category?: string;
  language?: string;
  status?: string;
  theme_id?: string;
  limitCount?: number;
} = {}) {
  const constraints: any[] = [orderBy('created_at', 'desc')];
  
  if (options.category) constraints.push(where('category', '==', options.category));
  if (options.language) constraints.push(where('language', '==', options.language));
  if (options.status) constraints.push(where('status', '==', options.status));
  if (options.theme_id) constraints.push(where('theme_id', '==', options.theme_id));
  if (options.limitCount) constraints.push(firestoreLimit(options.limitCount));

  const q = query(collection(db, 'submissions'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (SubmissionData & { id: string })[];
}

export interface ThemeData {
  name: string;
  description?: string;
  category?: string;
  submission_count: number;
  avg_urgency?: number;
  priority_score?: number;
  representative_submissions?: string[];
}

export async function addTheme(data: ThemeData) {
  const docRef = await addDoc(collection(db, 'themes'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function getThemes(limitCount: number = 20) {
  const q = query(
    collection(db, 'themes'),
    orderBy('priority_score', 'desc'),
    firestoreLimit(limitCount)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (ThemeData & { id: string })[];
}

export async function updateSubmission(id: string, data: Partial<SubmissionData>) {
  const { doc, updateDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'submissions', id);
  await updateDoc(docRef, data);
}

export { db };