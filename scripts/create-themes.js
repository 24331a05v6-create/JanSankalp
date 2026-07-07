import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

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

async function createThemes() {
  console.log('Fetching processing submissions...\n');
  
  const q = query(collection(db, 'submissions'), orderBy('created_at', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  
  const subs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  const processing = subs.filter(s => s.status === 'processing');
  
  console.log(`Found ${processing.length} processing submissions\n`);

  // Group by category
  const groups = {};
  processing.forEach(s => {
    const cat = s.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  console.log('Creating themes by category...\n');

  for (const [category, items] of Object.entries(groups)) {
    const themeData = {
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Issues`,
      description: `${items.length} submissions about ${category} problems across multiple cities`,
      category,
      submission_count: items.length,
      avg_urgency: 3.5,
      priority_score: items.length * 2.5,
      representative_submissions: items.slice(0, 3).map(s => s.id),
      created_at: serverTimestamp(),
    };

    const themeRef = await addDoc(collection(db, 'themes'), themeData);
    console.log(`Created theme: ${themeData.name} (${themeRef.id}) with ${items.length} submissions`);

    // Update each submission
    for (const sub of items) {
      await updateDoc(doc(db, 'submissions', sub.id), {
        theme_id: themeRef.id,
        theme_name: themeData.name,
        urgency_score: 3,
        priority_score: themeData.priority_score,
        status: 'analyzed',
      });
    }
  }

  console.log('\nDone! All submissions analyzed and themed.');
}

createThemes();
