import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy, limit } from 'firebase/firestore';

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

async function resetAndAnalyze() {
  console.log('Resetting submissions to pending status...\n');
  
  const q = query(collection(db, 'submissions'), orderBy('created_at', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  
  let count = 0;
  for (const docSnap of snapshot.docs) {
    await updateDoc(doc(db, 'submissions', docSnap.id), {
      status: 'pending',
      theme_id: null,
      theme_name: null,
    });
    count++;
  }
  
  console.log(`Reset ${count} submissions to pending.\n`);
  console.log('Now run: node -e "fetch(\'http://localhost:3000/api/analyze\', {method:\'POST\'}).then(r=>r.json()).then(d=>console.log(d))"');
}

resetAndAnalyze();
