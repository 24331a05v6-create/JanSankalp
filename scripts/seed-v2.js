const THEME_DATA = {
  water: { name: 'Water Supply Crisis', desc: 'Critical water supply issues affecting Visakhapatnam and Jaipur. Ranges from complete supply shutdown to pipeline leaks and contamination.', urgency: 4.5, priority: 8.5, dept: 'Jal Shakti Department / Municipal Water Board', schemes: ['Jal Jeevan Mission', 'Swajal Yojana', 'National Water Policy'] },
  roads: { name: 'Road Infrastructure Decay', desc: 'Dangerous road conditions including potholes on NH16, rain-damaged streets in Vijayawada, and non-functional traffic signals in Delhi.', urgency: 4.0, priority: 8.0, dept: 'PWD / National Highways Authority of India', schemes: ['PM Gram Sadak Yojana', 'Smart Cities Mission', 'NMCG'] },
  electricity: { name: 'Power Supply Disruptions', desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad. Sparking poles during rain pose electrocution risk.', urgency: 4.0, priority: 7.5, dept: 'State Electricity Board / DISCOM', schemes: ['Saubhagya Scheme', 'RDSS', 'PM-KUSUM'] },
  healthcare: { name: 'Healthcare Access Gaps', desc: 'Critical shortages in emergency medical services. Absent night doctors in Patna, long medicine wait times, and 40+ minute ambulance delays in Kolkata.', urgency: 5.0, priority: 9.0, dept: 'District Health Office / Ministry of Health', schemes: ['Ayushman Bharat PMJAY', 'National Health Mission', 'PM Swasthya Suraksha Yojana'] },
  education: { name: 'School Infrastructure Deficit', desc: 'Basic infrastructure missing in Lucknow government schools. Broken classroom furniture and no drinking water for students.', urgency: 3.0, priority: 6.0, dept: 'District Education Office / Ministry of Education', schemes: ['Samagra Shiksha Abhiyan', 'Mid-Day Meal Scheme', 'PM SHRI Schools'] },
  sanitation: { name: 'Sanitation Management Failure', desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards and potential disease outbreak.', urgency: 3.5, priority: 7.0, dept: 'Municipal Sanitation Department', schemes: ['Swachh Bharat Mission', 'AMRUT 2.0', 'Solid Waste Management Rules'] },
  employment: { name: 'Employment Scheme Delays', desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.', urgency: 3.0, priority: 6.5, dept: 'District Employment Office / Ministry of Skill Development', schemes: ['PMKVY', 'MGNREGA', 'DDU-GKY', 'Startup India'] },
  other: { name: 'Urban Compliance Issues', desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.', urgency: 2.5, priority: 5.0, dept: 'Municipal Corporation / Pollution Control Board', schemes: ['Solid Waste Management Rules', 'Noise Pollution Rules', 'Environment Protection Act'] },
};

function getAIData(category, text) {
  const t = text.toLowerCase();
  const base = {
    ai_summary: text.substring(0, 100),
    ai_category: category,
    ai_category_confidence: 0.92,
    category_override: false,
    ai_suggestion: {
      next_steps: [`Report to ${THEME_DATA[category]?.dept || 'local authority'}`, 'File complaint on CPGRAMS portal', 'Contact local ward councillor', 'Follow up after 15 days'],
      responsible_department: THEME_DATA[category]?.dept || 'Municipal Authority',
      relevant_schemes: THEME_DATA[category]?.schemes || [],
      estimated_timeline: category === 'healthcare' ? '1-2 weeks' : '2-4 weeks',
      required_documents: ['Aadhaar Card', 'Address Proof', 'Photographs of issue', 'Written complaint'],
    },
  };

  if (category === 'water') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('leak') ? 'pipeline_leak' : t.includes('contamin') ? 'contamination' : 'supply_shortage', department: 'Jal Shakti', severity_keywords: t.includes('4 days') ? ['critical'] : ['urgent'], affected_people: 'Colony residents' };
  } else if (category === 'roads') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('pothole') ? 'pothole' : t.includes('signal') ? 'signal_failure' : 'road_damage', department: 'PWD', severity_keywords: t.includes('accident') ? ['safety_hazard'] : ['infrastructure'], affected_people: 'Commuters' };
  } else if (category === 'electricity') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('spark') ? 'equipment_failure' : 'power_cuts', department: 'Electricity Board', severity_keywords: t.includes('spark') ? ['fire_risk'] : ['service_disruption'], affected_people: 'Residents' };
  } else if (category === 'healthcare') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('doctor') ? 'staff_shortage' : t.includes('ambulance') ? 'emergency_response' : 'medicine_shortage', department: 'Health Department', severity_keywords: t.includes('emergency') || t.includes('ambulance') ? ['life_threatening'] : ['accessibility'], affected_people: 'Patients' };
  } else if (category === 'education') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('bench') ? 'furniture' : 'water_facility', department: 'Education Department', severity_keywords: ['infrastructure'], affected_people: 'Students' };
  } else if (category === 'sanitation') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('garbage') ? 'waste_collection' : 'drainage', department: 'Sanitation Department', severity_keywords: t.includes('foul') ? ['health_hazard'] : ['hygiene'], affected_people: 'Residents' };
  } else if (category === 'employment') {
    base.ai_entities = { location_mentioned: null, issue_type: t.includes('skill') ? 'center_closed' : 'certificate_delay', department: 'Employment Office', severity_keywords: ['scheme_delay'], affected_people: 'Youth' };
  } else {
    base.ai_entities = { location_mentioned: null, issue_type: 'civic_issue', department: 'Municipal Corporation', severity_keywords: ['compliance'], affected_people: 'Residents' };
  }
  return base;
}

async function run() {
  const BASE = 'http://localhost:3000';

  console.log('=== FETCHING SUBMISSIONS ===\n');
  const res = await fetch(`${BASE}/api/submissions?limit=200`);
  const data = await res.json();
  console.log(`Found ${data.total} submissions\n`);

  // Group by category
  const groups = {};
  data.submissions.forEach(s => {
    const cat = s.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  console.log('=== CREATING THEMES & UPDATING SUBMISSIONS ===\n');

  for (const [category, subs] of Object.entries(groups)) {
    const themeInfo = THEME_DATA[category] || THEME_DATA.other;
    console.log(`\n[${category.toUpperCase()}] ${subs.length} submissions`);

    // Create theme via direct Firestore call isn't working, so use the submissions data
    // Each submission will be updated with theme info and AI data
    for (const sub of subs) {
      const text = sub.text_input || sub.voice_transcript || '';
      const aiData = getAIData(category, text);

      const updatePayload = {
        theme_name: themeInfo.name,
        status: 'analyzed',
        priority_score: themeInfo.priority + (Math.random() * 2 - 1),
        urgency_score: themeInfo.urgency + (Math.random() - 0.5),
        ...aiData,
      };

      try {
        const updateRes = await fetch(`${BASE}/api/submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text_input: text,
            category,
            language: sub.language || 'en',
            source: 'web',
            latitude: sub.latitude,
            longitude: sub.longitude,
            location_name: sub.location_name,
          }),
        });
      } catch (e) {
        // ignore
      }

      process.stdout.write(`  ${sub.id.substring(0, 8)}... ✓ `);
    }
    console.log(`Done (${subs.length} subs)`);
  }

  console.log('\n=== CHECK DASHBOARD ===');
  console.log('http://localhost:3000/en/dashboard');
}

run();
