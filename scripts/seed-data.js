const SAMPLE_COMPLAINTS = [
  { id: 1, category: "water", problem: "No drinking water supply for the past 4 days in our colony.", city: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185 },
  { id: 2, category: "water", problem: "Water pipeline leakage causing wastage near MVP Colony.", city: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6872, longitude: 83.2190 },
  { id: 3, category: "water", problem: "No water supply in the apartments since yesterday.", city: "Visakhapatnam", state: "Andhra Pradesh", latitude: 17.6868, longitude: 83.2185 },
  { id: 4, category: "roads", problem: "Large potholes causing accidents on NH16.", city: "Vijayawada", state: "Andhra Pradesh", latitude: 16.5062, longitude: 80.6480 },
  { id: 5, category: "roads", problem: "Street damaged after recent rains.", city: "Vijayawada", state: "Andhra Pradesh", latitude: 16.5064, longitude: 80.6481 },
  { id: 6, category: "electricity", problem: "Power cuts every evening for more than 3 hours.", city: "Hyderabad", state: "Telangana", latitude: 17.3850, longitude: 78.4867 },
  { id: 7, category: "electricity", problem: "Electric pole sparking during rain.", city: "Hyderabad", state: "Telangana", latitude: 17.3848, longitude: 78.4865 },
  { id: 8, category: "healthcare", problem: "Government hospital lacks emergency doctors at night.", city: "Patna", state: "Bihar", latitude: 25.5941, longitude: 85.1376 },
  { id: 9, category: "healthcare", problem: "Long waiting time for medicines in PHC.", city: "Patna", state: "Bihar", latitude: 25.5941, longitude: 85.1376 },
  { id: 10, category: "education", problem: "Government school has broken classroom benches.", city: "Lucknow", state: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462 },
  { id: 11, category: "education", problem: "No drinking water facility in school.", city: "Lucknow", state: "Uttar Pradesh", latitude: 26.8468, longitude: 80.9463 },
  { id: 12, category: "sanitation", problem: "Garbage has not been collected for a week.", city: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707 },
  { id: 13, category: "sanitation", problem: "Overflowing drainage causing foul smell.", city: "Chennai", state: "Tamil Nadu", latitude: 13.0828, longitude: 80.2708 },
  { id: 14, category: "employment", problem: "Skill development center is closed for the last month.", city: "Bengaluru", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { id: 15, category: "employment", problem: "Delay in issuing employment scheme certificates.", city: "Bengaluru", state: "Karnataka", latitude: 12.9717, longitude: 77.5945 },
  { id: 16, category: "other", problem: "Illegal dumping of construction waste.", city: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  { id: 17, category: "other", problem: "Noise pollution due to late-night construction.", city: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8567 },
  { id: 18, category: "roads", problem: "Traffic signals are not working at major junction.", city: "Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.2090 },
  { id: 19, category: "water", problem: "Contaminated drinking water with bad smell.", city: "Jaipur", state: "Rajasthan", latitude: 26.9124, longitude: 75.7873 },
  { id: 20, category: "healthcare", problem: "Ambulance response time exceeds 40 minutes.", city: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
];

async function seed() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('Starting to seed 20 complaints...\n');
  
  const results = [];
  
  for (const complaint of SAMPLE_COMPLAINTS) {
    const payload = {
      text_input: `${complaint.problem} in ${complaint.city}, ${complaint.state}`,
      voice_transcript: null,
      ocr_text: null,
      category: complaint.category,
      language: 'en',
      source: 'web',
      session_id: crypto.randomUUID(),
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      location_name: `${complaint.city}, ${complaint.state}`,
    };

    try {
      console.log(`[${complaint.id}/20] Submitting: ${complaint.problem.substring(0, 50)}...`);
      
      const response = await fetch(`${BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error(`  ❌ Error: ${result.error}`);
        continue;
      }

      console.log(`  ✅ Saved: ${result.submission.id}`);
      results.push(result.submission);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    }
  }

  console.log(`\nSuccessfully submitted ${results.length}/20 complaints.`);
  console.log('\nNow running AI theme analysis...\n');

  try {
    const analyzeResponse = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
    });

    const analyzeResult = await analyzeResponse.json();
    
    if (analyzeResponse.ok) {
      console.log('✅ AI analysis complete!');
      console.log(`   Created themes from ${results.length} submissions`);
    } else {
      console.error('❌ Analysis failed:', analyzeResult.error);
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }

  console.log('\nDone! Check your dashboard at http://localhost:3000/en/dashboard');
}

seed();
