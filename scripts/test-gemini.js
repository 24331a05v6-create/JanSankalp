import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  console.log('API Key exists:', !!GEMINI_API_KEY);
  console.log('API Key prefix:', GEMINI_API_KEY?.substring(0, 10));
  
  if (!GEMINI_API_KEY) {
    console.error('No GEMINI_API_KEY found!');
    return;
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Group these complaints into themes. Return ONLY valid JSON:
{
  "themes": [
    {
      "name": "Theme Name",
      "description": "Brief description",
      "category": "water",
      "submission_count": 3,
      "avg_urgency": 4.0,
      "priority_score": 7.5,
      "representative_submissions": ["id1", "id2"],
      "urgency_scores": [4, 5, 3]
    }
  ]
}

Complaints:
1. No drinking water for 4 days (water, Visakhapatnam)
2. Water pipeline leakage (water, Visakhapatnam)
3. No water in apartments (water, Visakhapatnam)
4. Contaminated water (water, Jaipur)
5. Large potholes on NH16 (roads, Vijayawada)
6. Street damaged after rains (roads, Vijayawada)
7. Traffic signals not working (roads, Delhi)
8. Power cuts every evening (electricity, Hyderabad)
9. Electric pole sparking (electricity, Hyderabad)
10. Hospital lacks emergency doctors (healthcare, Patna)
11. Long waiting for medicines (healthcare, Patna)
12. Ambulance takes 40 minutes (healthcare, Kolkata)
13. Broken school benches (education, Lucknow)
14. No water in school (education, Lucknow)
15. Garbage not collected (sanitation, Chennai)
16. Overflowing drainage (sanitation, Chennai)
17. Skill center closed (employment, Bengaluru)
18. Employment certificate delays (employment, Bengaluru)
19. Illegal construction waste (other, Pune)
20. Noise pollution (other, Pune)`;

  try {
    console.log('\nCalling Gemini...');
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('\nRaw response (first 500 chars):');
    console.log(text.substring(0, 500));
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('\nParsed themes:', parsed.themes?.length || 0);
      parsed.themes?.forEach((t, i) => {
        console.log(`  ${i+1}. ${t.name} [${t.category}] Priority: ${t.priority_score}`);
      });
    } else {
      console.error('\nNo JSON found in response!');
    }
  } catch (error) {
    console.error('Gemini error:', error.message);
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('The API key is invalid!');
    }
  }
}

testGemini();
