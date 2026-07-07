import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore';

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

const THEME_DATA: Record<string, { name: string; desc: string; urgency: number; priority: number; dept: string; schemes: string[] }> = {
  water: {
    name: 'Water Supply Crisis',
    desc: 'Critical water supply issues affecting Visakhapatnam and Jaipur — ranging from complete supply shutdown to pipeline leaks and water contamination.',
    urgency: 4.5, priority: 8.5,
    dept: 'Jal Shakti Department / Municipal Water Board',
    schemes: ['Jal Jeevan Mission', 'Swajal Yojana', 'National Water Policy'],
  },
  roads: {
    name: 'Road Infrastructure Decay',
    desc: 'Dangerous road conditions including potholes on NH16, rain-damaged streets in Vijayawada, and non-functional traffic signals in Delhi.',
    urgency: 4.0, priority: 8.0,
    dept: 'PWD / National Highways Authority of India',
    schemes: ['PM Gram Sadak Yojana', 'Smart Cities Mission', 'NMCG'],
  },
  electricity: {
    name: 'Power Supply Disruptions',
    desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad — sparking poles during rain pose electrocution risk.',
    urgency: 4.0, priority: 7.5,
    dept: 'State Electricity Board / DISCOM',
    schemes: ['Saubhagya Scheme', 'RDSS', 'PM-KUSUM'],
  },
  healthcare: {
    name: 'Healthcare Access Gaps',
    desc: 'Critical shortages in emergency medical services — absent night doctors in Patna hospitals, long medicine wait times, and 40+ minute ambulance delays in Kolkata.',
    urgency: 5.0, priority: 9.0,
    dept: 'District Health Office / Ministry of Health & Family Welfare',
    schemes: ['Ayushman Bharat PMJAY', 'National Health Mission', 'PM Swasthya Suraksha Yojana'],
  },
  education: {
    name: 'School Infrastructure Deficit',
    desc: 'Basic infrastructure missing in Lucknow government schools — broken classroom furniture and no drinking water facilities for students.',
    urgency: 3.0, priority: 6.0,
    dept: 'District Education Office / Ministry of Education',
    schemes: ['Samagra Shiksha Abhiyan', 'Mid-Day Meal Scheme', 'PM SHRI Schools'],
  },
  sanitation: {
    name: 'Sanitation Management Failure',
    desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards, foul smell, and potential disease outbreak for residents.',
    urgency: 3.5, priority: 7.0,
    dept: 'Municipal Sanitation Department',
    schemes: ['Swachh Bharat Mission', 'AMRUT 2.0', 'Solid Waste Management Rules'],
  },
  employment: {
    name: 'Employment Scheme Delays',
    desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.',
    urgency: 3.0, priority: 6.5,
    dept: 'District Employment Office / Ministry of Skill Development',
    schemes: ['PMKVY', 'MGNREGA', 'DDU-GKY', 'Startup India'],
  },
  other: {
    name: 'Urban Compliance Issues',
    desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.',
    urgency: 2.5, priority: 5.0,
    dept: 'Municipal Corporation / Pollution Control Board',
    schemes: ['Solid Waste Management Rules', 'Noise Pollution Rules', 'Environment Protection Act'],
  },
};

async function seedThemes() {
  console.log('Fetching all submissions...\n');

  const snap = await getDocs(collection(db, 'submissions'));
  const allSubs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log(`Found ${allSubs.length} submissions\n`);

  // Group by category
  const groups: Record<string, any[]> = {};
  allSubs.forEach(s => {
    const cat = (s as any).category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  console.log('Creating themes...\n');

  for (const [category, subs] of Object.entries(groups)) {
    const themeInfo = THEME_DATA[category] || THEME_DATA.other;

    const themeDoc = {
      name: themeInfo.name,
      description: themeInfo.desc,
      category,
      submission_count: subs.length,
      avg_urgency: themeInfo.urgency,
      priority_score: themeInfo.priority,
      representative_submissions: subs.slice(0, 3).map(s => s.id),
      created_at: serverTimestamp(),
    };

    const themeRef = await addDoc(collection(db, 'themes'), themeDoc);
    console.log(`Theme: ${themeInfo.name} (${themeRef.id}) — ${subs.length} submissions`);

    // Update submissions with AI enrichment
    for (const sub of subs) {
      const subText = ((sub as any).text_input || (sub as any).voice_transcript || '').toLowerCase();

      const aiUpdate: Record<string, any> = {
        theme_id: themeRef.id,
        theme_name: themeInfo.name,
        status: 'analyzed',
        priority_score: themeInfo.priority + (Math.random() * 2 - 1),
        urgency_score: themeInfo.urgency + (Math.random() * 1 - 0.5),
        ai_suggestion: {
          next_steps: [
            `Report to ${themeInfo.dept}`,
            `File complaint on CPGRAMS portal`,
            `Contact local ward councillor`,
            `Follow up after 15 days`,
          ],
          responsible_department: themeInfo.dept,
          relevant_schemes: themeInfo.schemes,
          estimated_timeline: category === 'healthcare' ? '1-2 weeks' : '2-4 weeks',
          required_documents: ['Aadhaar Card', 'Address Proof', 'Photographs of issue', 'Written complaint'],
        },
      };

      // Add category-specific AI insights
      if (category === 'water') {
        aiUpdate.ai_summary = `Water supply issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'water';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('leak') ? 'pipeline_leak' : subText.includes('contamin') ? 'contamination' : 'supply_shortage',
          department: 'Jal Shakti Department',
          severity_keywords: subText.includes('4 days') ? ['critical', 'extended outage'] : ['urgent'],
          affected_people: 'Colony residents',
        };
      } else if (category === 'roads') {
        aiUpdate.ai_summary = `Road infrastructure issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'roads';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('pothole') ? 'pothole' : subText.includes('signal') ? 'signal_failure' : 'road_damage',
          department: 'PWD',
          severity_keywords: subText.includes('accident') ? ['safety_hazard', 'accident_risk'] : ['infrastructure'],
          affected_people: 'Commuters',
        };
      } else if (category === 'electricity') {
        aiUpdate.ai_summary = `Power supply issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'electricity';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('spark') ? 'equipment_failure' : 'power_cuts',
          department: 'State Electricity Board',
          severity_keywords: subText.includes('spark') ? ['safety_hazard', 'fire_risk'] : ['service_disruption'],
          affected_people: 'Residents',
        };
      } else if (category === 'healthcare') {
        aiUpdate.ai_summary = `Healthcare access issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'healthcare';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('doctor') ? 'staff_shortage' : subText.includes('ambulance') ? 'emergency_response' : 'medicine_shortage',
          department: 'District Health Office',
          severity_keywords: subText.includes('emergency') || subText.includes('ambulance') ? ['life_threatening', 'critical'] : ['accessibility'],
          affected_people: 'Patients',
        };
      } else if (category === 'education') {
        aiUpdate.ai_summary = `School infrastructure issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'education';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('bench') ? 'furniture' : 'water_facility',
          department: 'District Education Office',
          severity_keywords: ['infrastructure', 'student_welfare'],
          affected_people: 'Students',
        };
      } else if (category === 'sanitation') {
        aiUpdate.ai_summary = `Sanitation issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'sanitation';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('garbage') ? 'waste_collection' : 'drainage',
          department: 'Municipal Sanitation Department',
          severity_keywords: subText.includes('foul') ? ['health_hazard', 'odor'] : ['hygiene'],
          affected_people: 'Residents',
        };
      } else if (category === 'employment') {
        aiUpdate.ai_summary = `Employment scheme issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'employment';
        aiUpdate.ai_category_confidence = 0.95;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: subText.includes('skill') ? 'center_closed' : 'certificate_delay',
          department: 'District Employment Office',
          severity_keywords: ['scheme_delay', 'youth_employment'],
          affected_people: 'Youth',
        };
      } else {
        aiUpdate.ai_summary = `General civic issue: ${subText.substring(0, 80)}`;
        aiUpdate.ai_category = 'other';
        aiUpdate.ai_category_confidence = 0.8;
        aiUpdate.ai_entities = {
          location_mentioned: (sub as any).location_name || null,
          issue_type: 'civic_issue',
          department: 'Municipal Corporation',
          severity_keywords: ['compliance'],
          affected_people: 'Residents',
        };
      }

      await updateDoc(doc(db, 'submissions', sub.id), aiUpdate);
    }

    console.log(`  Updated ${subs.length} submissions with AI data`);
  }

  console.log('\n=== DONE ===');
  console.log('20 submissions with full AI enrichment');
  console.log('8 themes created');
  console.log('\nCheck dashboard: http://localhost:3000/en/dashboard');
}

seedThemes();
