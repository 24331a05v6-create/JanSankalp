const SUBMISSIONS_BY_CATEGORY = {
  water: [
    { text: "No drinking water supply for the past 4 days in our colony. Visakhapatnam, Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
    { text: "Water pipeline leakage causing wastage near MVP Colony. Visakhapatnam, Andhra Pradesh", lat: 17.6872, lng: 83.2190 },
    { text: "No water supply in the apartments since yesterday. Visakhapatnam, Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
    { text: "Contaminated drinking water with bad smell. Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873 },
  ],
  roads: [
    { text: "Large potholes causing accidents on NH16. Vijayawada, Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
    { text: "Street damaged after recent rains. Vijayawada, Andhra Pradesh", lat: 16.5064, lng: 80.6481 },
    { text: "Traffic signals are not working at major junction. Delhi", lat: 28.6139, lng: 77.2090 },
  ],
  electricity: [
    { text: "Power cuts every evening for more than 3 hours. Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
    { text: "Electric pole sparking during rain. Hyderabad, Telangana", lat: 17.3848, lng: 78.4865 },
  ],
  healthcare: [
    { text: "Government hospital lacks emergency doctors at night. Patna, Bihar", lat: 25.5941, lng: 85.1376 },
    { text: "Long waiting time for medicines in PHC. Patna, Bihar", lat: 25.5941, lng: 85.1376 },
    { text: "Ambulance response time exceeds 40 minutes. Kolkata, West Bengal", lat: 22.5726, lng: 88.3639 },
  ],
  education: [
    { text: "Government school has broken classroom benches. Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { text: "No drinking water facility in school. Lucknow, Uttar Pradesh", lat: 26.8468, lng: 80.9463 },
  ],
  sanitation: [
    { text: "Garbage has not been collected for a week. Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { text: "Overflowing drainage causing foul smell. Chennai, Tamil Nadu", lat: 13.0828, lng: 80.2708 },
  ],
  employment: [
    { text: "Skill development center is closed for the last month. Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
    { text: "Delay in issuing employment scheme certificates. Bengaluru, Karnataka", lat: 12.9717, lng: 77.5945 },
  ],
  other: [
    { text: "Illegal dumping of construction waste. Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
    { text: "Noise pollution due to late-night construction. Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  ],
};

const THEME_DEFINITIONS = [
  { category: 'water', name: 'Water Supply Crisis', desc: 'Critical water supply issues affecting multiple cities including Visakhapatnam and Jaipur. Issues range from complete supply shutdown to contamination.', urgency: 4.5, priority: 8.5, dept: 'Municipal Water Department / Jal Shakti Ministry', schemes: ['Jal Jeevan Mission', 'Swajal Scheme'] },
  { category: 'roads', name: 'Road Infrastructure Decay', desc: 'Dangerous road conditions including potholes on national highways, damaged streets, and non-functional traffic signals across Vijayawada and Delhi.', urgency: 4.0, priority: 8.0, dept: 'PWD / National Highways Authority of India', schemes: ['PM Gram Sadak Yojana', 'Smart Cities Mission'] },
  { category: 'electricity', name: 'Power Supply Disruptions', desc: 'Frequent power cuts and dangerous electrical infrastructure in Hyderabad. Risk of electrocution from sparking poles during rain.', urgency: 4.0, priority: 7.5, dept: 'State Electricity Board / DISCOM', schemes: ['Saubhagya Scheme', 'RDSS'] },
  { category: 'healthcare', name: 'Healthcare Access Gaps', desc: 'Critical shortages in emergency medical services including absent night doctors, long medicine wait times, and slow ambulance response across Patna and Kolkata.', urgency: 5.0, priority: 9.0, dept: 'District Health Office / Ministry of Health', schemes: ['Ayushman Bharat', 'National Health Mission'] },
  { category: 'education', name: 'School Infrastructure Deficit', desc: 'Basic infrastructure missing in government schools in Lucknow including broken furniture and no drinking water facilities.', urgency: 3.0, priority: 6.0, dept: 'District Education Office / Ministry of Education', schemes: ['Samagra Shiksha Abhiyan', 'Mid-Day Meal Scheme'] },
  { category: 'sanitation', name: 'Sanitation Management Failure', desc: 'Uncollected garbage and overflowing drainage in Chennai causing health hazards and foul smell for residents.', urgency: 3.5, priority: 7.0, dept: 'Municipal Sanitation Department', schemes: ['Swachh Bharat Mission', 'AMRUT'] },
  { category: 'employment', name: 'Employment Scheme Delays', desc: 'Skill development centers closed and certificate delays in Bengaluru blocking employment opportunities for youth.', urgency: 3.0, priority: 6.5, dept: 'District Employment Office / Ministry of Skill Development', schemes: ['PMKVY', 'MGNREGA', 'DDU-GKY'] },
  { category: 'other', name: 'Urban Compliance Issues', desc: 'Illegal construction waste dumping and noise pollution from late-night construction in Pune violating environmental norms.', urgency: 2.5, priority: 5.0, dept: 'Municipal Corporation / Pollution Control Board', schemes: ['Solid Waste Management Rules', 'Noise Pollution Rules'] },
];

async function createThemesAndAnalyze() {
  const BASE_URL = 'http://localhost:3000';
  
  console.log('=== CREATING AI-ENRICHED THEMES ===\n');
  
  // Step 1: Create themes via the analyze endpoint
  console.log('Running Gemini AI theme analysis...');
  
  try {
    const analyzeRes = await fetch(`${BASE_URL}/api/analyze`, { method: 'POST' });
    const analyzeData = await analyzeRes.json();
    console.log('Analyze result:', analyzeData);
  } catch (e) {
    console.log('Analyze endpoint issue, creating themes manually...');
  }

  // Step 2: Check current state
  const subsRes = await fetch(`${BASE_URL}/api/submissions?limit=200`);
  const subsData = await subsRes.json();
  
  console.log(`\nFound ${subsData.total} submissions`);
  
  // Step 3: Check themes
  const themesRes = await fetch(`${BASE_URL}/api/analyze?limit=20`);
  const themesData = await themesRes.json();
  
  console.log(`Found ${themesData.themes.length} themes\n`);
  
  if (themesData.themes.length === 0) {
    console.log('No themes created. The AI analysis needs Gemini API key in .env.local');
    console.log('Please add: GEMINI_API_KEY=your_key_here');
  } else {
    console.log('=== THEMES CREATED ===\n');
    themesData.themes.forEach((t, i) => {
      console.log(`${i+1}. ${t.name}`);
      console.log(`   Category: ${t.category}`);
      console.log(`   Priority: ${t.priority_score}/10`);
      console.log(`   Urgency: ${t.avg_urgency}/5`);
      console.log(`   Submissions: ${t.submission_count}`);
      console.log('');
    });
  }
  
  console.log('\nCheck your dashboard: http://localhost:3000/en/dashboard');
}

createThemesAndAnalyze();
