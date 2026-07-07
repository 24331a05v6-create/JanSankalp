const COMPLAINTS = [
  // WATER SUPPLY (6 complaints from 4 cities - duplicate patterns)
  { cat: 'water', text: 'पिछले चार दिनों से हमारे मोहल्ले में पानी नहीं आ रहा है।', lang: 'hi', city: 'Bhopal', state: 'MP', lat: 23.2599, lng: 77.4126 },
  { cat: 'water', text: 'हमारे इलाके में तीन दिन से पानी की सप्लाई बंद है।', lang: 'hi', city: 'Bhopal', state: 'MP', lat: 23.2601, lng: 77.4128 },
  { cat: 'water', text: 'पानी नहीं आने से पूरे क्षेत्र के लोग परेशान हैं।', lang: 'hi', city: 'Bhopal', state: 'MP', lat: 23.2598, lng: 77.4127 },
  { cat: 'water', text: 'పంపు పనిచేయక నీళ్లు రావడం లేదు.', lang: 'te', city: 'Visakhapatnam', state: 'AP', lat: 17.6868, lng: 83.2185 },
  { cat: 'water', text: 'మూడు రోజులుగా తాగునీరు అందడం లేదు.', lang: 'te', city: 'Visakhapatnam', state: 'AP', lat: 17.6869, lng: 83.2184 },
  { cat: 'water', text: 'Drinking water has a bad smell and is contaminated.', lang: 'en', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },

  // ROADS (6 complaints from 4 cities)
  { cat: 'roads', text: 'రోడ్డుపై పెద్ద గుంతలు ఉండటంతో ప్రమాదాలు జరుగుతున్నాయి.', lang: 'te', city: 'Vijayawada', state: 'AP', lat: 16.5062, lng: 80.6480 },
  { cat: 'roads', text: 'మా కాలనీలో రోడ్డు మొత్తం గుంతలతో నిండిపోయింది.', lang: 'te', city: 'Vijayawada', state: 'AP', lat: 16.5064, lng: 80.6482 },
  { cat: 'roads', text: 'గుంతల వల్ల వాహనాలు వెళ్లడం చాలా కష్టంగా ఉంది.', lang: 'te', city: 'Vijayawada', state: 'AP', lat: 16.5063, lng: 80.6481 },
  { cat: 'roads', text: 'Traffic signal not working for two days causing accidents.', lang: 'en', city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { cat: 'roads', text: 'Flyover construction is causing huge traffic jams.', lang: 'en', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },

  // ELECTRICITY (6 complaints from 3 cities)
  { cat: 'electricity', text: 'மின்சாரம் தினமும் இரவு நேரத்தில் துண்டிக்கப்படுகிறது.', lang: 'ta', city: 'Chennai', state: 'TN', lat: 13.0827, lng: 80.2707 },
  { cat: 'electricity', text: 'எங்கள் பகுதியில் தினமும் பல மணி நேரம் மின்வெட்டு ஏற்படுகிறது.', lang: 'ta', city: 'Chennai', state: 'TN', lat: 13.0828, lng: 80.2708 },
  { cat: 'electricity', text: 'Power cuts are happening every afternoon for hours.', lang: 'en', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { cat: 'electricity', text: 'విద్యుత్ స్తంభం నుండి మంటలు వస్తున్నాయి - sparking danger!', lang: 'te', city: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },

  // HEALTHCARE (7 complaints from 4 cities)
  { cat: 'healthcare', text: 'সরকারি হাসপাতালে ডাক্তার পাওয়া যাচ্ছে না।', lang: 'bn', city: 'Kolkata', state: 'WB', lat: 22.5726, lng: 88.3639 },
  { cat: 'healthcare', text: 'হাসপাতালে ডাক্তার না থাকায় রোগীরা অপেক্ষা করছেন।', lang: 'bn', city: 'Kolkata', state: 'WB', lat: 22.5727, lng: 88.3640 },
  { cat: 'healthcare', text: 'अस्पताल में दवाइयाँ उपलब्ध नहीं हैं।', lang: 'hi', city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { cat: 'healthcare', text: 'मरीजों को दवा बाहर से खरीदनी पड़ रही है।', lang: 'hi', city: 'Patna', state: 'Bihar', lat: 25.5942, lng: 85.1377 },
  { cat: 'healthcare', text: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಸಮಯಕ್ಕೆ ಬರುತ್ತಿಲ್ಲ - emergency response delayed.', lang: 'kn', city: 'Hubballi', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  { cat: 'healthcare', text: 'ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಆಂಬ್ಯುಲೆನ್ಸ್ ತಡವಾಗಿ ಬಂದಿದೆ.', lang: 'kn', city: 'Hubballi', state: 'Karnataka', lat: 15.3648, lng: 75.1241 },

  // SANITATION (5 complaints from 3 cities)
  { cat: 'sanitation', text: 'कचरा पिछले एक सप्ताह से नहीं उठाया गया।', lang: 'hi', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { cat: 'sanitation', text: 'हमारे मोहल्ले में कूड़ा जमा हो गया है।', lang: 'hi', city: 'Jaipur', state: 'Rajasthan', lat: 26.9126, lng: 75.7874 },
  { cat: 'sanitation', text: 'குப்பை தொட்டிகள் நிரம்பி வழிகின்றன.', lang: 'ta', city: 'Madurai', state: 'TN', lat: 9.9252, lng: 78.1198 },
  { cat: 'sanitation', text: 'Drain water is overflowing onto the road creating health hazard.', lang: 'en', city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },

  // EDUCATION (5 complaints from 3 cities)
  { cat: 'education', text: 'ಶಾಲೆಯಲ್ಲಿ ಶಿಕ್ಷಕರ ಕೊರತೆ ಇದೆ - students affected.', lang: 'kn', city: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { cat: 'education', text: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪಾಠ ಹೇಳಲು ಸಾಕಷ್ಟು ಶಿಕ್ಷಕರು ಇಲ್ಲ.', lang: 'kn', city: 'Mysuru', state: 'Karnataka', lat: 12.2959, lng: 76.6395 },
  { cat: 'education', text: 'School toilets are not clean causing student illness.', lang: 'en', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },

  // EMPLOYMENT (5 complaints from 3 cities)
  { cat: 'employment', text: 'నిరుద్యోగ భృతి దరఖాస్తు ఇంకా ఆమోదం పొందలేదు.', lang: 'te', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { cat: 'employment', text: 'ఉద్యోగ నమోదు చేసినా స్పందన లేదు.', lang: 'te', city: 'Hyderabad', state: 'Telangana', lat: 17.3851, lng: 78.4868 },
  { cat: 'employment', text: 'रोजगार कार्यालय में आवेदन लंबित है।', lang: 'hi', city: 'Lucknow', state: 'UP', lat: 26.8467, lng: 80.9462 },

  // OTHER (4 complaints from 3 cities)
  { cat: 'other', text: 'Illegal garbage dumping near the lake polluting water.', lang: 'en', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { cat: 'other', text: 'People are dumping waste beside the lake every day.', lang: 'en', city: 'Pune', state: 'Maharashtra', lat: 18.5205, lng: 73.8568 },
  { cat: 'other', text: 'রাতে অতিরিক্ত শব্দ দূষণ হচ্ছে।', lang: 'bn', city: 'Siliguri', state: 'WB', lat: 26.7271, lng: 88.3953 },
  { cat: 'other', text: 'রাতভর জোরে মাইক বাজানো হচ্ছে।', lang: 'bn', city: 'Siliguri', state: 'WB', lat: 26.7272, lng: 88.3954 },
];

const THEME_MAP = {
  water: {
    name: 'Water Supply Crisis',
    desc: 'Critical water supply disruptions across Bhopal, Visakhapatnam, and Ahmedabad. Includes supply shutdowns, pump failures, and water contamination affecting thousands.',
    urgency: 4.5, priority: 8.5,
    dept: 'Jal Shakti Department / Municipal Water Board',
    schemes: ['Jal Jeevan Mission', 'Swajal Yojana', 'National Water Policy'],
    duplicate_groups: [
      { ids: [0,1,2], note: 'Bhopal water shutdown - 3 people reporting same colony issue' },
      { ids: [3,4], note: 'Visakhapatnam pump failure - 2 people same area' },
      { ids: [5], note: 'Ahmedabad water contamination - separate issue' },
    ],
  },
  roads: {
    name: 'Road Infrastructure Decay',
    desc: 'Dangerous road conditions across Vijayawada (potholes), Delhi (signal failure), and Mumbai (construction traffic). Safety hazards causing accidents.',
    urgency: 4.0, priority: 8.0,
    dept: 'PWD / National Highways Authority / Municipal Corporation',
    schemes: ['PM Gram Sadak Yojana', 'Smart Cities Mission', 'NMCG'],
    duplicate_groups: [
      { ids: [6,7,8], note: 'Vijayawada potholes - 3 reports same location' },
      { ids: [9], note: 'Delhi signal failure - separate issue' },
      { ids: [10], note: 'Mumbai flyover traffic - separate issue' },
    ],
  },
  electricity: {
    name: 'Power Supply Disruptions',
    desc: 'Frequent power cuts in Chennai and Nagpur, plus dangerous sparking electrical poles in Warangal. Fire and electrocution risk.',
    urgency: 4.0, priority: 7.5,
    dept: 'State Electricity Board / DISCOM',
    schemes: ['Saubhagya Scheme', 'RDSS', 'PM-KUSUM'],
    duplicate_groups: [
      { ids: [11,12], note: 'Chennai power cuts - 2 people same area' },
      { ids: [13], note: 'Nagpur power cuts - separate location' },
      { ids: [14], note: 'Warangal sparking pole - CRITICAL safety hazard' },
    ],
  },
  healthcare: {
    name: 'Healthcare Access Gaps',
    desc: 'Critical medical service shortages: doctor absence in Kolkata hospitals, medicine unavailability in Patna, and delayed ambulance response in Hubballi.',
    urgency: 5.0, priority: 9.0,
    dept: 'District Health Office / Ministry of Health & Family Welfare',
    schemes: ['Ayushman Bharat PMJAY', 'National Health Mission', 'PM Swasthya Suraksha Yojana'],
    duplicate_groups: [
      { ids: [15,16], note: 'Kolkata hospital no doctors - 2 reports same hospital' },
      { ids: [17,18], note: 'Patna medicine shortage - 2 people same hospital' },
      { ids: [19,20], note: 'Hubballi ambulance delay - 2 reports same issue' },
    ],
  },
  sanitation: {
    name: 'Sanitation Management Failure',
    desc: 'Uncollected garbage in Jaipur and Madurai, overflowing drainage in Kochi. Health hazards from waste accumulation.',
    urgency: 3.5, priority: 7.0,
    dept: 'Municipal Sanitation Department',
    schemes: ['Swachh Bharat Mission', 'AMRUT 2.0', 'Solid Waste Management Rules'],
    duplicate_groups: [
      { ids: [21,22], note: 'Jaipur garbage not collected - 2 reports same ward' },
      { ids: [23], note: 'Madurai overflow bins - separate location' },
      { ids: [24], note: 'Kochi drainage overflow - separate issue' },
    ],
  },
  education: {
    name: 'Education Infrastructure & Staffing',
    desc: 'Teacher shortages in Mysuru schools and unhygienic toilet facilities in Surat. Both impacting student learning outcomes.',
    urgency: 3.0, priority: 6.0,
    dept: 'District Education Office / Ministry of Education',
    schemes: ['Samagra Shiksha Abhiyan', 'Mid-Day Meal Scheme', 'PM SHRI Schools'],
    duplicate_groups: [
      { ids: [25,26], note: 'Mysuru teacher shortage - 2 reports same school' },
      { ids: [27], note: 'Surat toilet hygiene - separate issue' },
    ],
  },
  employment: {
    name: 'Employment Scheme Delays',
    desc: 'Unemployment benefit applications pending in Hyderabad and Lucknow. Youth unable to access government employment schemes.',
    urgency: 3.0, priority: 6.5,
    dept: 'District Employment Office / Ministry of Skill Development',
    schemes: ['PMKVY', 'MGNREGA', 'DDU-GKY', 'Startup India'],
    duplicate_groups: [
      { ids: [28,29], note: 'Hyderabad unemployment benefit delay - 2 reports' },
      { ids: [30], note: 'Lucknow employment office delay - separate city' },
    ],
  },
  other: {
    name: 'Urban Environmental Violations',
    desc: 'Illegal lake dumping in Pune and excessive noise pollution in Siliguri. Environmental compliance issues.',
    urgency: 2.5, priority: 5.0,
    dept: 'Municipal Corporation / Pollution Control Board',
    schemes: ['Solid Waste Management Rules', 'Noise Pollution Rules', 'Environment Protection Act'],
    duplicate_groups: [
      { ids: [31,32], note: 'Pune lake dumping - 2 reports same location' },
      { ids: [33,34], note: 'Siliguri noise pollution - 2 reports same area' },
    ],
  },
};

function getAICategoryConfidence(cat, text) {
  const keywords = {
    water: ['पानी', 'నీళ్లు', 'water', 'pipeline', 'supply', 'సప్లాయ్'],
    roads: ['road', 'గుంతల', 'pothole', 'signal', 'traffic', 'flyover'],
    electricity: ['electricity', 'మిన్నె', 'power', 'மின்சாரம்', 'spark', 'current'],
    healthcare: ['hospital', 'doctor', 'ambulance', 'medicine', 'डॉक्टर', 'ಆಂಬ್ಯುಲೆನ್ಸ್', 'হাসপাতাল', 'दवा'],
    sanitation: ['garbage', 'कचरा', 'drainage', 'overflow', 'कूड़ा', 'குப்பை'],
    education: ['school', 'teacher', 'ಶಿಕ್ಷಕ', 'student', 'toilet'],
    employment: ['job', 'employment', 'unemployment', 'నిరుద్యోగ', 'रोजगार', 'application'],
    other: ['noise', 'dumping', 'pollution', 'শব্দ', 'illegal'],
  };
  const t = text.toLowerCase();
  const matches = keywords[cat]?.filter(k => t.includes(k.toLowerCase())) || [];
  return Math.min(0.98, 0.75 + matches.length * 0.07);
}

function getSeverityKeywords(cat, text) {
  const t = text.toLowerCase();
  const base = {
    water: ['supply_disruption'],
    roads: ['infrastructure'],
    electricity: ['service_disruption'],
    healthcare: ['accessibility'],
    sanitation: ['hygiene'],
    education: ['staffing'],
    employment: ['scheme_delay'],
    other: ['compliance'],
  };
  if (cat === 'electricity' && (t.includes('spark') || t.includes('మంటల') || t.includes('fire'))) return ['fire_risk', 'life_threatening'];
  if (cat === 'healthcare' && (t.includes('ambulance') || t.includes('emergency'))) return ['life_threatening', 'critical'];
  if (cat === 'water' && (t.includes('contamin') || t.includes('bad smell'))) return ['health_hazard', 'contamination'];
  if (t.includes('accident') || t.includes('danger') || t.includes('ప్రమాద')) return ['safety_hazard'];
  return base[cat] || ['general'];
}

function getIssueType(cat, text) {
  const t = text.toLowerCase();
  if (cat === 'water') return t.includes('smell') || t.includes('contamin') ? 'contamination' : t.includes('pump') || t.includes('పంపు') ? 'pump_failure' : 'supply_shortage';
  if (cat === 'roads') return t.includes('signal') ? 'signal_failure' : t.includes('flyover') || t.includes('construction') ? 'construction_delay' : 'pothole';
  if (cat === 'electricity') return t.includes('spark') || t.includes('మంటల') || t.includes('fire') ? 'equipment_failure' : 'power_cuts';
  if (cat === 'healthcare') return t.includes('ambulance') ? 'emergency_response' : t.includes('doctor') || t.includes('డాక్టర') || t.includes('ডাক্তার') ? 'staff_shortage' : 'medicine_shortage';
  if (cat === 'sanitation') return t.includes('drain') || t.includes('overflow') ? 'drainage' : 'waste_collection';
  if (cat === 'education') return t.includes('toilet') || t.includes('.hygiene') ? 'facilities' : 'teacher_shortage';
  if (cat === 'employment') return t.includes('application') || t.includes('pending') ? 'application_delay' : 'registration_no_response';
  return 'civic_issue';
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function seed() {
  const BASE = 'http://localhost:3000';
  const timestamps = [];
  
  // Create timestamps spread over the last 7 days
  const now = Date.now();
  for (let i = 0; i < COMPLAINTS.length; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    timestamps.push(new Date(now - daysAgo * 86400000 - hoursAgo * 3600000).toISOString());
  }

  console.log('=== PHASE 1: SUBMITTING 50 MULTILINGUAL COMPLAINTS ===\n');
  
  const createdSubs = [];
  const themeCounts = {};

  for (let i = 0; i < COMPLAINTS.length; i++) {
    const c = COMPLAINTS[i];
    const theme = THEME_MAP[c.cat];
    const confidence = getAICategoryConfidence(c.cat, c.text);
    const priority = theme.priority + (Math.random() * 1.5 - 0.75);
    const urgency = theme.urgency + (Math.random() * 0.8 - 0.4);

    const payload = {
      text_input: c.text,
      category: c.cat,
      language: c.lang,
      source: 'web',
      latitude: c.lat,
      longitude: c.lng,
      location_name: `${c.city}, ${c.state}`,
      ai_summary: c.text.substring(0, 80),
      ai_category: c.cat,
      ai_category_confidence: Math.round(confidence * 100) / 100,
      category_override: false,
      ai_entities: {
        location_mentioned: `${c.city}, ${c.state}`,
        issue_type: getIssueType(c.cat, c.text),
        department: theme.dept,
        severity_keywords: getSeverityKeywords(c.cat, c.text),
        affected_people: c.cat === 'healthcare' ? 'Patients' : c.cat === 'education' ? 'Students' : 'Residents',
      },
      ai_suggestion: {
        next_steps: [`Report to ${theme.dept}`, 'File complaint on CPGRAMS portal', 'Contact local representative', 'Follow up in 15 days'],
        responsible_department: theme.dept,
        relevant_schemes: theme.schemes,
        estimated_timeline: c.cat === 'healthcare' ? '1-2 weeks' : '2-4 weeks',
        required_documents: ['Aadhaar Card', 'Address Proof', 'Photographs', 'Written complaint'],
      },
      priority_score: Math.round(priority * 10) / 10,
      urgency_score: Math.round(urgency * 10) / 10,
    };

    process.stdout.write(`[${String(i+1).padStart(2)}/50] ${c.cat.padEnd(13)} ${c.city.padEnd(15)} `);
    
    try {
      const res = await fetch(`${BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        createdSubs.push({ ...result.submission, _complaint_idx: i, _timestamp: timestamps[i] });
        themeCounts[c.cat] = (themeCounts[c.cat] || 0) + 1;
        console.log(`✅`);
      } else {
        console.log(`❌ ${result.error}`);
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
    await sleep(200);
  }

  console.log(`\n✅ Submitted ${createdSubs.length}/50 complaints\n`);
  console.log('Category breakdown:');
  Object.entries(themeCounts).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat.padEnd(13)} ${count} complaints`);
  });

  console.log('\n=== PHASE 2: CREATING THEMES WITH DUPLICATE MERGING ===\n');

  // Use the seed-themes API to create themes
  try {
    const themeRes = await fetch(`${BASE}/api/seed-themes`, { method: 'POST' });
    const themeData = await themeRes.json();
    console.log(`Themes created: ${themeData.themes_created}`);
    console.log(`Submissions updated: ${themeData.submissions_updated}`);
  } catch (e) {
    console.log('Theme creation failed:', e.message);
  }

  console.log('\n=== PHASE 3: VERIFICATION ===\n');

  const [subsRes, themesRes] = await Promise.all([
    fetch(`${BASE}/api/submissions?limit=200`),
    fetch(`${BASE}/api/analyze?limit=20`),
  ]);
  const subsData = await subsRes.json();
  const themesData = await themesRes.json();

  console.log(`Total submissions: ${subsData.total}`);
  console.log(`Total themes: ${themesData.themes.length}`);
  
  console.log('\n=== THEMES BY PRIORITY ===\n');
  themesData.themes.forEach((t, i) => {
    console.log(`${i+1}. ${t.name}`);
    console.log(`   Category: ${t.category} | Priority: ${t.priority_score}/10 | Urgency: ${t.avg_urgency}/5`);
    console.log(`   Submissions: ${t.submission_count} | Duplicates merged: ${t.submission_count - (THEME_MAP[t.category]?.duplicate_groups?.length || 0)}`);
    console.log('');
  });

  console.log('=== DUPLICATE MERGING SUMMARY ===\n');
  Object.entries(THEME_MAP).forEach(([cat, theme]) => {
    console.log(`${theme.name}:`);
    theme.duplicate_groups.forEach(g => {
      console.log(`  - ${g.note}`);
    });
  });

  console.log('\n=== CHECK DASHBOARD ===');
  console.log('http://localhost:3000/en/dashboard');
}

seed();
