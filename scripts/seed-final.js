const THEME_DATA = {
  water: { name: 'Water Supply Crisis', desc: 'Critical water supply issues affecting Visakhapatnam and Jaipur. Ranges from complete supply shutdown to pipeline leaks and water contamination.', urgency: 4.5, priority: 8.5, dept: 'Jal Shakti Department / Municipal Water Board', schemes: ['Jal Jeevan Mission', 'Swajal Yojana', 'National Water Policy'] },
  roads: { name: 'Road Infrastructure Decay', desc: 'Dangerous road conditions including potholes on NH16, rain-damaged streets in Vijayawada, and non-functional traffic signals in Delhi.', urgency: 4.0, priority: 8.0, dept: 'PWD / National Highways Authority of India', schemes: ['PM Gram Sadak Yojana', 'Smart Cities Mission', 'NMCG'] },
  electricity: { name: 'Power Supply Disruptions', desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad. Sparking poles during rain pose electrocution risk.', urgency: 4.0, priority: 7.5, dept: 'State Electricity Board / DISCOM', schemes: ['Saubhagya Scheme', 'RDSS', 'PM-KUSUM'] },
  healthcare: { name: 'Healthcare Access Gaps', desc: 'Critical shortages in emergency medical services. Absent night doctors in Patna, long medicine wait times, and 40+ min ambulance delays in Kolkata.', urgency: 5.0, priority: 9.0, dept: 'District Health Office / Ministry of Health', schemes: ['Ayushman Bharat PMJAY', 'National Health Mission', 'PM Swasthya Suraksha Yojana'] },
  education: { name: 'School Infrastructure Deficit', desc: 'Basic infrastructure missing in Lucknow government schools. Broken classroom furniture and no drinking water for students.', urgency: 3.0, priority: 6.0, dept: 'District Education Office / Ministry of Education', schemes: ['Samagra Shiksha Abhiyan', 'Mid-Day Meal Scheme', 'PM SHRI Schools'] },
  sanitation: { name: 'Sanitation Management Failure', desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards and potential disease outbreak.', urgency: 3.5, priority: 7.0, dept: 'Municipal Sanitation Department', schemes: ['Swachh Bharat Mission', 'AMRUT 2.0', 'Solid Waste Management Rules'] },
  employment: { name: 'Employment Scheme Delays', desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.', urgency: 3.0, priority: 6.5, dept: 'District Employment Office / Ministry of Skill Development', schemes: ['PMKVY', 'MGNREGA', 'DDU-GKY', 'Startup India'] },
  other: { name: 'Urban Compliance Issues', desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.', urgency: 2.5, priority: 5.0, dept: 'Municipal Corporation / Pollution Control Board', schemes: ['Solid Waste Management Rules', 'Noise Pollution Rules', 'Environment Protection Act'] },
};

function getAIData(category, text) {
  const t = text.toLowerCase();
  const theme = THEME_DATA[category] || THEME_DATA.other;
  const base = {
    ai_summary: text.substring(0, 100),
    ai_category: category,
    ai_category_confidence: 0.92,
    category_override: false,
    ai_entities: { location_mentioned: null, issue_type: 'civic_issue', department: theme.dept, severity_keywords: ['civic'], affected_people: 'Residents' },
    ai_suggestion: {
      next_steps: [`Report to ${theme.dept}`, 'File complaint on CPGRAMS portal', 'Contact local ward councillor', 'Follow up after 15 days'],
      responsible_department: theme.dept,
      relevant_schemes: theme.schemes,
      estimated_timeline: category === 'healthcare' ? '1-2 weeks' : '2-4 weeks',
      required_documents: ['Aadhaar Card', 'Address Proof', 'Photographs of issue', 'Written complaint'],
    },
  };

  if (category === 'water') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('leak') ? 'pipeline_leak' : t.includes('contamin') ? 'contamination' : 'supply_shortage', severity_keywords: t.includes('4 days') ? ['critical'] : ['urgent'] };
  else if (category === 'roads') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('pothole') ? 'pothole' : t.includes('signal') ? 'signal_failure' : 'road_damage', severity_keywords: t.includes('accident') ? ['safety_hazard'] : ['infrastructure'] };
  else if (category === 'electricity') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('spark') ? 'equipment_failure' : 'power_cuts', severity_keywords: t.includes('spark') ? ['fire_risk'] : ['service_disruption'] };
  else if (category === 'healthcare') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('doctor') ? 'staff_shortage' : t.includes('ambulance') ? 'emergency_response' : 'medicine_shortage', severity_keywords: t.includes('emergency') || t.includes('ambulance') ? ['life_threatening'] : ['accessibility'] };
  else if (category === 'education') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('bench') ? 'furniture' : 'water_facility', severity_keywords: ['infrastructure'] };
  else if (category === 'sanitation') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('garbage') ? 'waste_collection' : 'drainage', severity_keywords: t.includes('foul') ? ['health_hazard'] : ['hygiene'] };
  else if (category === 'employment') base.ai_entities = { ...base.ai_entities, issue_type: t.includes('skill') ? 'center_closed' : 'certificate_delay', severity_keywords: ['scheme_delay'] };

  return base;
}

const COMPLAINTS = [
  { category: 'water', text: 'No drinking water supply for the past 4 days in our colony. Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, loc: 'Visakhapatnam, AP' },
  { category: 'water', text: 'Water pipeline leakage causing wastage near MVP Colony. Visakhapatnam, Andhra Pradesh', lat: 17.6872, lng: 83.2190, loc: 'MVP Colony, Visakhapatnam' },
  { category: 'water', text: 'No water supply in the apartments since yesterday. Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, loc: 'Visakhapatnam, AP' },
  { category: 'roads', text: 'Large potholes causing accidents on NH16. Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, loc: 'NH16, Vijayawada' },
  { category: 'roads', text: 'Street damaged after recent rains. Vijayawada, Andhra Pradesh', lat: 16.5064, lng: 80.6481, loc: 'Vijayawada, AP' },
  { category: 'electricity', text: 'Power cuts every evening for more than 3 hours. Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, loc: 'Hyderabad, Telangana' },
  { category: 'electricity', text: 'Electric pole sparking during rain. Hyderabad, Telangana', lat: 17.3848, lng: 78.4865, loc: 'Hyderabad, Telangana' },
  { category: 'healthcare', text: 'Government hospital lacks emergency doctors at night. Patna, Bihar', lat: 25.5941, lng: 85.1376, loc: 'Patna, Bihar' },
  { category: 'healthcare', text: 'Long waiting time for medicines in PHC. Patna, Bihar', lat: 25.5941, lng: 85.1376, loc: 'Patna, Bihar' },
  { category: 'education', text: 'Government school has broken classroom benches. Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462, loc: 'Lucknow, UP' },
  { category: 'education', text: 'No drinking water facility in school. Lucknow, Uttar Pradesh', lat: 26.8468, lng: 80.9463, loc: 'Lucknow, UP' },
  { category: 'sanitation', text: 'Garbage has not been collected for a week. Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, loc: 'Chennai, Tamil Nadu' },
  { category: 'sanitation', text: 'Overflowing drainage causing foul smell. Chennai, Tamil Nadu', lat: 13.0828, lng: 80.2708, loc: 'Chennai, Tamil Nadu' },
  { category: 'employment', text: 'Skill development center is closed for the last month. Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, loc: 'Bengaluru, Karnataka' },
  { category: 'employment', text: 'Delay in issuing employment scheme certificates. Bengaluru, Karnataka', lat: 12.9717, lng: 77.5945, loc: 'Bengaluru, Karnataka' },
  { category: 'other', text: 'Illegal dumping of construction waste. Pune, Maharashtra', lat: 18.5204, lng: 73.8567, loc: 'Pune, Maharashtra' },
  { category: 'other', text: 'Noise pollution due to late-night construction. Pune, Maharashtra', lat: 18.5204, lng: 73.8567, loc: 'Pune, Maharashtra' },
  { category: 'roads', text: 'Traffic signals are not working at major junction. Delhi', lat: 28.6139, lng: 77.2090, loc: 'Delhi' },
  { category: 'water', text: 'Contaminated drinking water with bad smell. Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, loc: 'Jaipur, Rajasthan' },
  { category: 'healthcare', text: 'Ambulance response time exceeds 40 minutes. Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, loc: 'Kolkata, West Bengal' },
];

async function seed() {
  const BASE = 'http://localhost:3000';
  
  console.log('=== DELETING OLD SUBMISSIONS & CREATING NEW ONES ===\n');

  // First, get all existing submissions
  const existingRes = await fetch(`${BASE}/api/submissions?limit=200`);
  const existing = await existingRes.json();
  console.log(`Found ${existing.total} old submissions (they have stale data)\n`);

  console.log('=== SUBMITTING 20 AI-ENRICHED COMPLAINTS ===\n');

  const themeCounts = {};
  const createdSubs = [];

  for (let i = 0; i < COMPLAINTS.length; i++) {
    const c = COMPLAINTS[i];
    const aiData = getAIData(c.category, c.text);
    const themeInfo = THEME_DATA[c.category];
    
    // Add slight variations to priority for each submission
    const priorityVar = themeInfo.priority + (Math.random() * 2 - 1);
    const urgencyVar = themeInfo.urgency + (Math.random() - 0.5);

    const payload = {
      text_input: c.text,
      category: c.category,
      language: 'en',
      source: 'web',
      latitude: c.lat,
      longitude: c.lng,
      location_name: c.loc,
      // AI fields that get stored via the API
      ...aiData,
      priority_score: Math.round(priorityVar * 10) / 10,
      urgency_score: Math.round(urgencyVar * 10) / 10,
    };

    process.stdout.write(`[${i+1}/20] ${c.category.padEnd(12)} `);
    
    try {
      const res = await fetch(`${BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      if (res.ok) {
        console.log(`✅ ${result.submission.id}`);
        createdSubs.push(result.submission);
        themeCounts[c.category] = (themeCounts[c.category] || 0) + 1;
      } else {
        console.log(`❌ ${result.error}`);
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== CREATED ${createdSubs.length}/20 SUBMISSIONS ===\n`);
  
  console.log('Category breakdown:');
  Object.entries(themeCounts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log('\n=== AI ENRICHMENT SUMMARY ===\n');
  console.log('Each submission now has:');
  console.log('  - ai_summary: Auto-generated summary');
  console.log('  - ai_category: AI-verified category');
  console.log('  - ai_category_confidence: Confidence score (0-1)');
  console.log('  - ai_entities: Extracted entities (location, issue_type, department, severity)');
  console.log('  - ai_suggestion: Action plan (next_steps, department, schemes, timeline, documents)');
  console.log('  - priority_score: Enhanced priority (0-10)');
  console.log('  - urgency_score: Severity rating (1-5)');

  console.log('\n=== CHECK DASHBOARD ===');
  console.log('http://localhost:3000/en/dashboard');
}

seed();
