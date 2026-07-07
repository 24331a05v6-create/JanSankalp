<div align="center">

# 🇮🇳 JanSankalp

### AI-Powered Citizen Development Platform for Smart Governance

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase)
![Google Gemini](https://img.shields.io/badge/Gemini%20AI-2.0-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)

**Bridging the gap between citizens and governance through AI, voice, and multilingual access.**

[Features](#-key-highlights) · [Tech Stack](#-tech-stack) · [AI Features](#-ai-features) · [API Docs](#-api-endpoints) · [Setup](#-installation)

</div>

---

## 🎯 Problem Statement

India has **1.4 billion citizens** across **28 states and 8 union territories**, speaking **22 official languages**. Most citizens—especially in rural areas—face significant barriers when trying to report infrastructure issues, civic problems, or development needs to their elected representatives:

- **Language barriers** exclude non-English speakers from digital platforms
- **Literacy limitations** prevent written complaint submission
- **Duplicate complaints** overwhelm government systems with redundant data
- **No prioritization** means critical issues get buried under noise
- **No action tracking** leaves citizens without accountability
- **Fragmented data** across departments prevents systemic analysis

---

## 💡 Solution Overview

**JanSankalp** is a comprehensive, AI-driven citizen development platform that enables:

1. **Multilingual complaint submission** in 12 Indian languages via text, voice, or phone call
2. **AI-powered analysis** that categorizes, prioritizes, deduplicates, and generates actionable recommendations
3. **Interactive GIS dashboard** for MPs and government officials with hotspot detection, department-wise analytics, and downloadable reports
4. **Realistic IVR system** that allows citizens to submit complaints via voice with telephone keypad navigation—no smartphone required
5. **Department-wise tracking** with resolution status and government scheme mapping

---

## ⭐ Key Highlights

| | Feature | Description |
|---|---|---|
| 🌍 | **12 Language Support** | English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, Odia, Punjabi, Assamese |
| 🎙️ | **Voice Complaints** | Record voice messages with real-time speech-to-text transcription |
| 📞 | **IVR Phone System** | Realistic telephone keypad simulation with DTMF tones, TTS prompts, and voice navigation |
| 🗣️ | **Speech-to-Text** | Browser Web Speech API for real-time transcript during recording |
| 📷 | **Photo OCR** | Tesseract.js client-side OCR extracts text from uploaded images |
| 📍 | **GPS Mapping** | Automatic geolocation capture with location name resolution |
| 🗺️ | **Interactive GIS** | Leaflet map with category-colored markers, sized by urgency, with AI popups |
| 🔥 | **Hotspot Detection** | AI identifies geographic clusters of similar complaints |
| 🤖 | **AI Categorization** | Gemini 2.0 Flash auto-classifies complaints into 8 government departments |
| 🧠 | **Duplicate Detection** | Jaccard similarity-based deduplication prevents redundant entries |
| 📊 | **Priority Scoring** | 6-factor weighted algorithm (severity, safety risk, urgency, population, compliance, frequency) |
| 📈 | **Analytics Dashboard** | Real-time stats, pie charts, department breakdown, and trend analysis |
| 📂 | **Department Management** | Complaints mapped to specific government departments and assigned officers |
| 🧾 | **AI Action Plans** | Next steps, responsible departments, relevant government schemes, and timelines |
| 📑 | **12-Language Translations** | Every complaint automatically translated to all 12 supported languages |
| 📱 | **Fully Responsive** | Works seamlessly on desktop, tablet, and mobile devices |
| 🌙 | **Dark/Light Mode** | Theme-aware UI with smooth transitions and localStorage persistence |
| ⚡ | **Modern UI/UX** | Glass morphism, Framer Motion animations, enterprise-grade design |
| ☁️ | **Cloud Database** | Firebase Firestore with real-time sync and Firebase Storage for audio files |

---

## 📋 Features

| Category | Feature | Status |
|---|---|---|
| **Complaint Submission** | Text Input | ✅ |
| | Voice Recording | ✅ |
| | Photo Upload + OCR | ✅ |
| | GPS Geolocation | ✅ |
| | Category Selection | ✅ |
| **IVR System** | Phone Keypad Simulation | ✅ |
| | DTMF Tone Generation | ✅ |
| | TTS Voice Prompts (6 languages) | ✅ |
| | Speech-to-Text Transcription | ✅ |
| | Audio Recording & Upload | ✅ |
| **AI Analysis** | Complaint Classification | ✅ |
| | Duplicate Detection | ✅ |
| | Priority Scoring (6-factor) | ✅ |
| | Keyword Extraction | ✅ |
| | Suggestion Generation | ✅ |
| | Government Scheme Mapping | ✅ |
| **Translation** | 12-Language Translation | ✅ |
| | Language Detection | ✅ |
| | Native Script Transliteration | ✅ |
| **Dashboard** | Interactive GIS Map | ✅ |
| | Category Pie Charts | ✅ |
| | Department-wise Grouping | ✅ |
| | Complaint Merging/Dedup | ✅ |
| | Resolved/Unresolved Tracking | ✅ |
| | Search & Filter | ✅ |
| | IVR Complaints View | ✅ |
| **UI/UX** | Dark Mode | ✅ |
| | Light Mode | ✅ |
| | Theme Persistence | ✅ |
| | Framer Motion Animations | ✅ |
| | Glass Morphism | ✅ |
| | Responsive Design | ✅ |
| **Infrastructure** | Firebase Firestore DB | ✅ |
| | Firebase Audio Storage | ✅ |
| | Retry Logic (3 attempts) | ✅ |
| | 90s Request Timeouts | ✅ |
| | Graceful Degradation | ✅ |

---

## 🧠 AI Features

### 1. Complaint Understanding & Classification
Gemini 2.0 Flash analyzes raw complaint text (or voice transcript) and extracts:
- **Summary** — concise description of the issue
- **Entities** — location mentioned, issue type, responsible department, severity keywords, affected population
- **Category verification** — AI validates or overrides the user-selected category with confidence score

### 2. Duplicate Detection
Compares each new complaint against the 20 most recent analyzed submissions in the same category using **Jaccard similarity** on extracted keywords. Complaints with ≥0.85 similarity are flagged as duplicates.

### 3. Priority Scoring
A 6-factor weighted algorithm computes a 0–10 priority score:

| Factor | Weight |
|---|---|
| Severity of Issue | 0.25 |
| Safety Risk | 0.20 |
| Urgency Level | 0.20 |
| Affected Population | 0.15 |
| Compliance Risk | 0.10 |
| Frequency | 0.10 (×2 multiplier) |

### 4. Actionable Suggestion Engine
Generates department-specific recommendations including:
- **Next Steps** — 3–5 concrete actions
- **Responsible Department** — specific Indian government department
- **Relevant Schemes** — actual Indian government welfare schemes
- **Estimated Timeline** — realistic completion timeframe
- **Required Documents** — documentation needed for resolution

### 5. Complaint Merging & Deduplication
The `/api/merge-complaints` endpoint groups similar complaints using keyword clustering (Jaccard ≥ 0.25), selects the highest-priority complaint as representative, and computes a merged priority score with a count-based boost.

### 6. Multilingual Translation
Every complaint is automatically translated to all 12 supported languages using Google Translate API (with Gemini and MyMemory fallbacks), enabling MPs to read complaints in any language.

### 7. Language Detection
Detects the spoken language from voice transcripts and transliterates Roman-script Indian words to their native script (e.g., "pani" → "पानी").

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | React framework with SSR, routing, API routes |
| | React 19 | UI library |
| | TypeScript 5 | Type safety |
| | Tailwind CSS 4 | Utility-first styling |
| | Framer Motion 12 | Animations and transitions |
| | Lucide React | Icon library |
| **Backend** | Next.js API Routes | REST API endpoints (14 routes) |
| | Google Gemini 2.0 Flash | AI analysis, categorization, suggestions |
| **Database** | Firebase Firestore | Complaints, themes, merged issues storage |
| | Firebase Storage | Audio file storage with retry logic |
| **Maps** | Leaflet + React-Leaflet | Interactive GIS map with circle markers |
| | OpenStreetMap | Map tiles |
| **Charts** | Recharts | Pie charts for category distribution |
| **Speech** | Web Speech API | Browser speech-to-text (real-time) |
| | MediaRecorder API | Microphone audio recording |
| | Web Audio API | DTMF tones, beeps, sound effects |
| | Browser SpeechSynthesis | Text-to-speech with fallback |
| **OCR** | Tesseract.js | Client-side image text extraction |
| **i18n** | next-intl | 12-language internationalization |
| **Database (Alt)** | Supabase | PostGIS spatial schema (configured) |
| **Deployment** | Vercel | Recommended hosting platform |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITIZEN LAYER                            │
│  🌐 Web Form  │  🎙️ Voice Recording  │  📞 IVR Phone System    │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     INPUT PROCESSING                            │
│  Speech-to-Text │ Photo OCR │ GPS Geolocation │ Lang Detection  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI ANALYSIS PIPELINE                        │
│  Gemini 2.0 Flash                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Classify  │ │Detect    │ │Calculate │ │Generate          │  │
│  │& Extract │ │Duplicates│ │Priority  │ │Suggestions       │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUD STORAGE                                │
│  Firebase Firestore          Firebase Storage                   │
│  ├── submissions             └── ivr-audio/*.webm               │
│  ├── merged_issues                                            │
│  └── themes                                                   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MP DASHBOARD                                │
│  🗺️ GIS Map │ 📊 Analytics │ 📂 Department View │ 🔍 Search   │
│  📈 Stats   │ 🧾 AI Insights │ ✅ Resolution Tracking          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Project Workflow

```
1. CITIZEN SUBMITS
   └─ Selects language → Records voice/types text → Uploads photo → GPS captured

2. AI PROCESSES
   └─ Gemini analyzes → Categorizes → Deduplicates → Scores priority → Generates suggestions

3. DATA STORED
   └─ Saved to Firestore → Audio to Storage → Translated to 12 languages

4. DASHBOARD DISPLAYS
   └─ Map shows hotspots → Stats update → Issues grouped by department → Searchable

5. MP TAKES ACTION
   └─ Reviews priority issues → Views AI recommendations → Marks resolved → Tracks progress

6. CITIZEN IMPACT
   └─ Real accountability → Data-driven governance → Inclusive participation
```

---

## 📁 Folder Structure

```
JanSankalp/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (ThemeProvider, dark mode)
│   │   ├── page.tsx                      # Language picker (12 languages)
│   │   ├── globals.css                   # Design tokens, animations, glass morphism
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                # Locale layout (next-intl)
│   │   │   ├── page.tsx                  # Home (submit/dashboard/ivr)
│   │   │   ├── submit/page.tsx           # Citizen submission form
│   │   │   └── dashboard/
│   │   │       ├── page.tsx              # MP Dashboard (map + analytics)
│   │   │       └── ivr-complaints/
│   │   │           └── page.tsx          # IVR complaints list
│   │   ├── ivr/page.tsx                  # IVR phone simulation
│   │   └── api/
│   │       ├── submissions/route.ts      # CRUD complaints
│   │       ├── merge-complaints/route.ts # AI deduplication
│   │       ├── ivr/route.ts             # IVR submission
│   │       ├── resolve-issue/route.ts   # Mark resolved
│   │       ├── translate/route.ts       # 12-lang translation
│   │       ├── detect-language/route.ts # Language detection
│   │       ├── analyze/route.ts        # AI theme analysis
│   │       ├── seed-themes/route.ts    # Seed initial themes
│   │       ├── cleanup-themes/route.ts # Deduplicate themes
│   │       └── backfill-translations/route.ts
│   ├── components/
│   │   ├── LanguagePicker.tsx            # 12-language selector
│   │   ├── ThemeProvider.tsx             # Dark/light context
│   │   ├── ThemeSwitcher.tsx             # Animated toggle
│   │   ├── SubmissionForm.tsx            # Voice + photo + GPS form
│   │   ├── DemandMap.tsx                 # Leaflet GIS map
│   │   ├── CategoryChart.tsx             # Recharts pie chart
│   │   ├── StatsCard.tsx                 # Animated stat card
│   │   └── ivr/
│   │       ├── PhoneFrame.tsx            # Phone bezel container
│   │       ├── CallScreen.tsx            # Ringing animation
│   │       ├── LanguageSelector.tsx      # IVR language picker
│   │       ├── PhoneKeypad.tsx           # DTMF keypad
│   │       ├── RecordingPanel.tsx        # Recording UI
│   │       ├── AudioPreview.tsx          # Playback controls
│   │       ├── ProcessingScreen.tsx      # AI processing anim
│   │       └── SuccessScreen.tsx         # Success confirmation
│   ├── hooks/
│   │   ├── useSpeechSynthesis.ts         # TTS with fallback
│   │   ├── useSpeechRecognition.ts       # STT (Web Speech API)
│   │   ├── useMediaRecorder.ts           # Microphone recording
│   │   └── useComplaintId.ts            # ID generator
│   ├── lib/
│   │   ├── firebase.ts                   # Firebase init + CRUD
│   │   ├── gemini.ts                     # Gemini AI functions
│   │   ├── types.ts                      # TypeScript interfaces
│   │   ├── i18n.ts                       # next-intl config
│   │   ├── ivr-prompts.ts               # IVR prompts (6 langs)
│   │   ├── ivr-sounds.ts                # DTMF + sound effects
│   │   └── ivr-audio.ts                 # Pre-recorded audio
│   └── messages/                         # 12 language JSON files
├── public/audio/ivr/                     # Pre-recorded IVR audio
├── package.json
├── next.config.ts
├── tsconfig.json
└── .env.example
```

---

## 📸 Screenshots

| Home | IVR Phone | Dashboard |
|:---:|:---:|:---:|
| ![Home](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=🏠+Language+Selection+%26+Home) | ![IVR](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=📞+IVR+Phone+Simulation) | ![Dashboard](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=📊+MP+Dashboard+with+Maps) |

| Complaint Form | Maps | Analytics |
|:---:|:---:|:---:|
| ![Form](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=📝+Multilingual+Complaint+Form) | ![Maps](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=🗺️+Interactive+GIS+Map) | ![Analytics](https://via.placeholder.com/400x250/0a0e1a/60a5fa?text=📈+Analytics+%26+Charts) |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- Firebase project (Firestore + Storage enabled)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/JanSankalp.git
cd JanSankalp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables)).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |

> **Note:** `GEMINI_API_KEY` is server-side only. Firebase variables use `NEXT_PUBLIC_` prefix for client-side Firestore access.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/submissions` | Submit a complaint with AI analysis |
| `GET` | `/api/submissions` | List complaints (filterable) |
| `POST` | `/api/merge-complaints` | AI-powered deduplication & merging |
| `GET` | `/api/merge-complaints` | List merged issues |
| `POST` | `/api/ivr` | Submit IVR complaint |
| `POST` | `/api/resolve-issue` | Mark issue resolved/unresolved |
| `POST` | `/api/translate` | Translate text to multiple languages |
| `POST` | `/api/detect-language` | Detect language + transliterate |
| `POST` | `/api/analyze` | Trigger AI theme analysis |
| `GET` | `/api/analyze` | List AI-generated themes |
| `POST` | `/api/seed-themes` | Seed initial category themes |
| `POST` | `/api/cleanup-themes` | Deduplicate themes |
| `GET` | `/api/backfill-translations` | Batch translate missing entries |

### Sample Request — Submit Complaint
```json
POST /api/submissions
{
  "text_input": "Broken road near school, children are getting hurt",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "location_name": "Near Delhi Public School, Central Delhi",
  "category": "roads",
  "language": "en",
  "source": "web"
}
```

### Sample Response
```json
{
  "submission": {
    "id": "abc123",
    "status": "analyzed",
    "ai_summary": "Road damage near school posing safety risk to children",
    "priority_score": 8.2,
    "ai_suggestion": {
      "next_steps": ["Immediate barricading", "PWD inspection", "Temporary repair"],
      "responsible_department": "Public Works Department",
      "relevant_schemes": ["PMGSY", "Amrit Bharat Station Scheme"],
      "estimated_timeline": "2-4 weeks"
    }
  }
}
```

---

## 🗄 Database Schema

### `submissions` Collection
| Field | Type | Description |
|---|---|---|
| `id` | string | Auto-generated Firestore ID |
| `text_input` | string | Citizen typed text |
| `voice_transcript` | string | Voice-to-text result |
| `photo_url` | string | Firebase Storage URL |
| `ocr_text` | string | OCR-extracted text |
| `latitude` / `longitude` | number | GPS coordinates |
| `location_name` | string | Human-readable location |
| `category` | string | Issue category (8 types) |
| `language` | string | Submission language (12 types) |
| `source` | string | web / ivr / mobile / whatsapp / kiosk |
| `priority_score` | number | AI-scored priority (0-10) |
| `urgency_score` | number | Severity level (1-5) |
| `ai_summary` | string | AI-generated summary |
| `ai_entities` | object | Extracted entities (location, department, keywords) |
| `ai_suggestion` | object | Action plan (steps, department, schemes, timeline) |
| `allTranslations` | map | 12-language translations |
| `status` | string | pending / processing / analyzed / archived |

### `merged_issues` Collection
| Field | Type | Description |
|---|---|---|
| `id` | string | Auto-generated ID |
| `representative_query` | string | Best representative complaint text |
| `category` | string | Issue category |
| `complaint_count` | number | Number of merged complaints |
| `priority_score` | number | Merged priority with count boost |
| `merged_submission_ids` | string[] | All merged submission IDs |
| `locations` | string[] | Unique locations |
| `departments` | string[] | Relevant departments |
| `severity_keywords` | string[] | Top keywords |
| `ai_suggestion` | object | Merged action plan |
| `resolved` | boolean | Resolution status |
| `resolved_at` | timestamp | When resolved |

---

## ⚡ Performance

- **Graceful Degradation** — Complaints save even if AI analysis fails
- **Retry Logic** — 3-attempt retry with exponential backoff for uploads and AI calls
- **Request Timeouts** — 90s for IVR, 30s for AI calls, 15s for uploads
- **Client-Side OCR** — Tesseract.js runs in browser, no server load
- **Lazy Charts** — Recharts loaded dynamically to reduce initial bundle
- **Static Pages** — Pre-rendered at build time where possible
- **30-Second Auto-Refresh** — Dashboard data refreshes automatically

---

## 🔒 Security

- **Server-Side API Keys** — `GEMINI_API_KEY` never exposed to client
- **Firebase Rules** — Firestore access controlled per collection
- **Upload Validation** — File type and size validation on client
- **Input Sanitization** — All inputs validated before AI processing
- **No PII Storage** — No user accounts or personal data collected

---

## 🔮 Future Scope

| Enhancement | Description |
|---|---|
| 📱 **Mobile App** | Native React Native app with offline support |
| 💬 **WhatsApp Integration** | Submit complaints via WhatsApp Business API |
| 📴 **Offline Mode** | Service workers for offline complaint queuing |
| 🔮 **Predictive AI** | Forecast infrastructure needs based on historical data |
| 🔔 **Smart Notifications** | Push notifications for complaint status updates |
| 🏛️ **Government APIs** | Integration with MyGov, UMANG, and RTI portals |
| 🗣️ **More Languages** | Expand to all 22 scheduled languages |
| 📊 **Advanced Analytics** | Time-series trends, seasonal patterns, predictive modeling |
| 🔐 **Role-Based Access** | MP, Officer, Citizen role-based dashboards |
| 🌐 **Open Data** | Public API for civic data transparency |

---

## 🏆 Hackathon Highlights

### Why JanSankalp Stands Out

**🏛️ Solves a Real Societal Problem**
India's 543 MPs handle millions of citizen complaints annually. JanSankalp digitizes and intelligently processes this workflow, making governance more responsive and accountable.

**🤖 AI-Driven Decision Support**
Every complaint is analyzed by Gemini 2.0 Flash—categorized, deduplicated, priority-scored, and paired with actionable recommendations including relevant government schemes. This transforms raw complaints into decision-ready insights.

**🌍 Multilingual Accessibility**
Supporting 12 Indian languages ensures no citizen is excluded due to language barriers. The IVR system extends this to non-literate citizens who can submit complaints entirely by voice.

**🎙️ Voice-First Citizen Interaction**
The realistic IVR phone system with DTMF tones, TTS prompts, and speech-to-text makes the platform accessible to citizens who cannot type or read.

**🗺️ Interactive GIS Visualization**
The Leaflet-powered map provides geographic intelligence—hotspots, density, and spatial patterns that text-only dashboards miss.

**🧠 Intelligent Complaint Prioritization**
A 6-factor weighted algorithm ensures the most critical issues—safety risks, high-impact, urgent—rise to the top automatically.

**📋 Actionable Recommendations**
AI doesn't just analyze; it recommends. Specific government schemes, responsible departments, estimated timelines, and required documents give MPs a ready-to-execute action plan.

**⚡ Scalable Architecture**
Built on Next.js 16, Firebase, and Gemini AI—serverless, cloud-native, and ready to scale from a single constituency to a national platform.

**🎨 Enterprise-Grade UI/UX**
Glass morphism, dark mode, Framer Motion animations, responsive design—the kind of polish expected from a production SaaS product, not a hackathon project.

**📊 Data-Driven Governance**
Real-time analytics, trend analysis, and downloadable reports transform gut-feel governance into evidence-based decision-making.

**🌐 Built for Digital India**
Aligned with India's Digital Public Infrastructure vision—multilingual, voice-first, accessible, and designed for the last-mile citizen.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 JanSankalp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgements

- **Google Gemini AI** — Powering all AI analysis, categorization, and suggestion generation
- **Firebase** — Cloud database and storage infrastructure
- **Next.js** — The React framework powering the application
- **Leaflet / OpenStreetMap** — Interactive map visualization
- **Framer Motion** — Beautiful UI animations
- **Tesseract.js** — Client-side OCR for image text extraction
- **next-intl** — Seamless 12-language internationalization
- **Tailwind CSS** — Utility-first CSS framework
- **Lucide Icons** — Beautiful, consistent iconography
- **Open Source Community** — For the incredible tools and libraries that made this possible

---

<div align="center">

**Built with ❤️ for India's 1.4 billion citizens**

*Empowering data-driven governance, one complaint at a time.*

</div>
