const { initializeApp, getApps, getApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } = require('firebase/firestore');

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

const THEMES = {
  water: { name: 'Water Supply Crisis', desc: 'Critical water supply issues affecting Visakhapatnam and Jaipur. Ranges from complete supply shutdown to pipeline leaks and water contamination.', urgency: 4.5, priority: 8.5 },
  roads: { name: 'Road Infrastructure Decay', desc: 'Dangerous road conditions including potholes on NH16, rain-damaged streets in Vijayawada, and non-functional traffic signals in Delhi.', urgency: 4.0, priority: 8.0 },
  electricity: { name: 'Power Supply Disruptions', desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad. Sparking poles during rain pose electrocution risk.', urgency: 4.0, priority: 7.5 },
  healthcare: { name: 'Healthcare Access Gaps', desc: 'Critical shortages in emergency medical services. Absent night doctors in Patna, long medicine wait times, and 40+ min ambulance delays in Kolkata.', urgency: 5.0, priority: 9.0 },
  education: { name: 'School Infrastructure Deficit', desc: 'Basic infrastructure missing in Lucknow government schools. Broken classroom furniture and no drinking water for students.', urgency: 3.0, priority: 6.0 },
  sanitation: { name: 'Sanitation Management Failure', desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards and potential disease outbreak.', urgency: 3.5, priority: 7.0 },
  employment: { name: 'Employment Scheme Delays', desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.', urgency: 3.0, priority: 6.5 },
  other: { name: 'Urban Compliance Issues', desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.', urgency: 2.5, priority: 5.0 },
};

async function createThemes() {
  console.log('Fetching all submissions...\n');
  const snap = await getDocs(collection(db, 'submissions'));
  const allSubs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`Found ${allSubs.length} submissions\n`);

  const groups = {};
  allSubs.forEach(s => {
    const cat = s.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  for (const [category, subs] of Object.entries(groups)) {
    const info = THEMES[category] || THEMES.other;
    const repIds = subs.slice(0, 3).map(s => s.id);

    const themeRef = await addDoc(collection(db, 'themes'), {
      name: info.name,
      description: info.desc,
      category,
      submission_count: subs.length,
      avg_urgency: info.urgency,
      priority_score: info.priority,
      representative_submissions: repIds,
      created_at: serverTimestamp(),
    });

    console.log(`Theme: ${info.name} (${themeRef.id}) — ${subs.length} submissions`);

    for (const sub of subs) {
      await updateDoc(doc(db, 'submissions', sub.id), {
        theme_id: themeRef.id,
        theme_name: info.name,
        status: 'analyzed',
      });
    }
    console.log(`  Updated ${subs.length} submissions`);
  }

  console.log('\n=== DONE ===');
  console.log('Check: http://localhost:3000/en/dashboard');
}

createThemes();
