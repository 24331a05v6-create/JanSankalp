import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit as firestoreLimit, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app);

export interface SubmissionData {
  text_input?: string;
  voice_transcript?: string;
  photo_url?: string | null;
  ocr_text?: string;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;
  category: string;
  language: string;
  source?: string;
  session_id?: string | null;
  theme_id?: string;
  theme_name?: string;
  urgency_score?: number;
  priority_score?: number;
  status: string;
  ai_summary?: string;
  ai_entities?: {
    location_mentioned: string | null;
    issue_type: string | null;
    department: string | null;
    severity_keywords: string[];
    affected_people: string | null;
  };
  ai_category?: string;
  ai_subcategory?: string;
  ai_category_confidence?: number;
  category_override?: boolean;
  duplicate_of?: string;
  duplicate_count?: number;
  ai_suggestion?: {
    next_steps: string[];
    responsible_department: string;
    relevant_schemes: string[];
    estimated_timeline: string;
    required_documents: string[];
  };
  allTranslations?: Record<string, string>;
  created_at?: any;
}

export async function addSubmission(data: SubmissionData) {
  // Firestore rejects undefined values — strip them before writing
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  const docRef = await addDoc(collection(db, 'submissions'), {
    ...cleanData,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function getSubmissions(options: {
  category?: string;
  language?: string;
  status?: string;
  source?: string;
  theme_id?: string;
  limitCount?: number;
} = {}) {
  const constraints: any[] = [orderBy('created_at', 'desc')];
  if (options.limitCount) constraints.push(firestoreLimit(options.limitCount));

  const q = query(collection(db, 'submissions'), ...constraints);
  const snapshot = await getDocs(q);

  let results = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (SubmissionData & { id: string })[];

  if (options.category) results = results.filter(r => r.category === options.category);
  if (options.language) results = results.filter(r => r.language === options.language);
  if (options.status) results = results.filter(r => r.status === options.status);
  if (options.source) results = results.filter(r => r.source === options.source);
  if (options.theme_id) results = results.filter(r => r.theme_id === options.theme_id);

  return results;
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

export async function getAllSubmissions() {
  const snapshot = await getDocs(collection(db, 'submissions'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as (SubmissionData & { id: string })[];
}

export async function addThemeDoc(data: ThemeData) {
  const docRef = await addDoc(collection(db, 'themes'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

// Merged Issues
export interface MergedIssue {
  id?: string;
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
  resolved_at?: any;
  created_at?: any;
}

export async function addMergedIssue(data: MergedIssue) {
  const docRef = await addDoc(collection(db, 'merged_issues'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateMergedIssue(id: string, data: Partial<MergedIssue>) {
  const { doc, updateDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'merged_issues', id);
  await updateDoc(docRef, data);
}

export async function getMergedIssues(limitCount: number = 50) {
  const q = query(
    collection(db, 'merged_issues'),
    orderBy('priority_score', 'desc'),
    firestoreLimit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as MergedIssue[];
}

export async function deleteAllMergedIssues() {
  const snapshot = await getDocs(collection(db, 'merged_issues'));
  const { doc, deleteDoc } = await import('firebase/firestore');
  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, 'merged_issues', d.id));
  }
  return snapshot.docs.length;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`[IVR Upload] ${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

async function uploadWithRetry(
  file: Blob,
  path: string,
  maxRetries: number = 3,
  onProgress?: (progress: number) => void
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[IVR Upload] Attempt ${attempt}/${maxRetries} for ${path} (${file.size} bytes)`);
      onProgress?.(attempt === 1 ? 10 : attempt === 2 ? 40 : 70);

      const storageRef = ref(storage, path);
      const snapshot = await withTimeout(
        uploadBytes(storageRef, file),
        60000,
        `uploadBytes for ${path}`
      );

      console.log(`[IVR Upload] Upload complete: ${snapshot.ref.fullPath}`);
      onProgress?.(90);

      const downloadUrl = await withTimeout(
        getDownloadURL(snapshot.ref),
        30000,
        `getDownloadURL for ${path}`
      );
      console.log(`[IVR Upload] Download URL obtained`);
      onProgress?.(100);

      return downloadUrl;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[IVR Upload] Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`[IVR Upload] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Upload failed after ${maxRetries} attempts: ${lastError?.message}`);
}

export async function uploadAudioToStorage(
  file: Blob,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return uploadWithRetry(file, path, 3, onProgress);
}

export { db, storage };
