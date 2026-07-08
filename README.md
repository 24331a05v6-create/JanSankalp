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

🚀 **[Live Demo →](https://jan-sankalp.vercel.app)** · 🎬 **[Watch Video →](https://drive.google.com/file/d/1IlG3RwTifMsymjYKbfVQknr2U31ZE8qB/view?usp=sharing)**

[Features](#-key-highlights) · [Tech Stack](#-tech-stack) · [AI Features](#-ai-features) · [API Docs](#-api-endpoints) · [Setup](#-installation)

</div>

---

## 🎯 Problem Statement

Members of Parliament receive development requests through a chaotic mix of channels — **public meetings, letters, social media, grievance portals, and direct representations** — while local development plans contain **dozens of competing proposed projects**. There is currently **no objective, data-driven way** to:

- **Consolidate** thousands of citizen requests scattered across multiple channels into a single, structured view
- **Spot recurring needs** — the same road complaint or water shortage reported 200 times across villages is indistinguishable from 200 unrelated issues
- **Weigh competing proposals against real demand** — for example, comparing community requests for school upgrades against actual enrollment data and travel-distance metrics versus a proposed vocational centre, or evaluating a new road against verified complaint density in that corridor

The result: **critical issues get buried**, **similar complaints duplicate effort**, **resource allocation is politically driven rather than evidence-based**, and **citizens lose trust** when their voices disappear into a void with no feedback loop. MPs lack a unified, intelligent system to transform raw citizen input into prioritized, actionable development decisions.

---

## 💡 Solution Overview

**JanSankalp** is an AI-powered citizen development platform that gives MPs a **single, intelligent system** to consolidate, analyze, and act on development requests from every channel:

1. **Unified submission** — citizens submit via web form, voice recording, or IVR phone call in 12 Indian languages. Every request — regardless of channel — enters one structured database.
2. **AI-powered consolidation** — Gemini 2.0 Flash automatically categorizes complaints into 8 government departments, detects duplicates, and merges recurring complaints into prioritized issue clusters.
3. **Demand-driven prioritization** — a 6-factor weighted scoring algorithm ranks issues by severity, safety risk, urgency, affected population, compliance risk, and frequency — replacing gut-feel with evidence.
4. **Actionable recommendations** — AI generates department-specific next steps, maps complaints to relevant government schemes, estimates timelines, and identifies required documents.
5. **Interactive GIS dashboard** — MPs visualize complaint hotspots on a map, filter by department, track resolution status, and export data — turning scattered feedback into spatial intelligence for competing project decisions.

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
| 📊 | **Project Prioritization** | AI ranks proposed projects against real citizen demand data with explainable reasons |
| 🏗️ | **Development Planner** | Constituency-wide sector analysis with Need Score, budget recommendations, and visual charts |
| 🏆 | **Proposal Evaluator** | Compare development proposals against complaint data with Score Breakdown and budget rationale |
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
| **Project Prioritization** | AI-Powered Project Ranking | ✅ |
| | Explainable AI Recommendations | ✅ |
| | Complaint-to-Project Matching | ✅ |
| | Hotspot & Impact Analysis | ✅ |
| | Government Scheme Suggestions | ✅ |
| | Local Storage Persistence | ✅ |
| **Development Planner** | Sector-Wide Need Analysis | ✅ |
| | Development Need Score (4-factor) | ✅ |
| | Recommended Development Order | ✅ |
| | Investment Recommendation | ✅ |
| | 4 Recharts Visualizations | ✅ |
| | Priority Legend | ✅ |
| | Estimated Citizens Affected | ✅ |
| | Suggested Budget by Score | ✅ |
| | Why Ranked #N? Explanation | ✅ |
| | Export PDF | ✅ |
| **Proposal Evaluator** | Add/Edit/Delete Proposals | ✅ |
| | Proposal Score (5-factor weighted) | ✅ |
| | Score Breakdown Transparency | ✅ |
| | Comparison View Table | ✅ |
| | Best Proposal Recommendation | ✅ |
| | Budget Rationale per Proposal | ✅ |
| | Why Ranked Explanation | ✅ |
| | 4 Recharts Charts | ✅ |
| | Category Filter | ✅ |
| | LocalStorage Persistence | ✅ |
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

### 8. AI Project Prioritization
The `/api/projects/prioritize` endpoint uses Gemini 2.0 Flash to analyze proposed development projects against real citizen demand data. For each project, it matches complaints by category, calculates a 0-100 priority score based on complaint frequency (40%), severity (30%), hotspot density (15%), and affected population (15%). Returns ranked projects with explainable reasons, expected impact, suggested government schemes, and responsible departments — helping MPs decide which projects to fund based on actual demand rather than guesswork.

### 9. Constituency Development Planner
All calculations done locally from Firebase complaint data — no Gemini API required. Groups complaints into 8 sectors and calculates a Development Need Score (35% priority + 25% count + 20% hotspots + 20% unresolved%). Generates recommended development order, investment recommendations ("If ₹1 Crore becomes available"), estimated citizens affected, suggested budgets mapped from Need Score, and explainable "Why Ranked #N?" reasons per sector. Includes 4 Recharts visualizations, priority legend, and PDF export.

### 10. Development Proposal Evaluator
MPs add real development proposals (e.g., "Upgrade Power Network", "Build Water Pipeline") and the system evaluates them against existing complaint data. Proposal Score is calculated locally using a 5-factor weighted formula: 30% Base Sector Need Score + 25% Complaint Count + 20% Average Priority + 15% Hotspot Count + 10% Unresolved Complaints. Features Score Breakdown transparency, budget rationale ("Budget Based On: Proposal Score: 90"), comparison view table, best proposal recommendation, and 4 Recharts charts. All without Gemini API.

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
| **Backend** | Next.js API Routes | REST API endpoints (15 routes) |
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
│  📋 Project Prioritization │ 📈 Development Planner            │
│  🏆 Proposal Evaluator │ 📞 IVR Complaints │ ✅ Resolved       │
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

## 🎥 Demo

| | Link |
|---|---|
| 🎬 **Demo Video** | [Watch Demo Video](https://drive.google.com/file/d/1IlG3RwTifMsymjYKbfVQknr2U31ZE8qB/view?usp=sharing) |
| 🚀 **Live App** | [jan-sankalp.vercel.app](https://jan-sankalp.vercel.app) |

> **Note:** Replace `#` in the Demo Video row with your actual video URL (YouTube, Google Drive, or any video hosting platform).

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
git clone https://github.com/24331a05v6-create/JanSankalp.git
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
| `POST` | `/api/projects/prioritize` | AI-rank projects against complaint data |
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

### Sample Request — Prioritize Projects
```json
POST /api/projects/prioritize
{
  "projects": [
    {
      "id": "1",
      "name": "Road repair in Central Delhi",
      "category": "roads",
      "cost": 5000000,
      "area": "Central Delhi"
    },
    {
      "id": "2",
      "name": "New hospital in South Delhi",
      "category": "healthcare",
      "cost": 20000000,
      "area": "South Delhi"
    }
  ]
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
- **Manual Refresh** — Dashboard refreshes on page load or manual click

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

**🏛️ Solves a Real Institutional Problem**
MPs juggle public meetings, letters, social media, and grievance portals with no unified view. JanSankalp consolidates every channel into one intelligent system — turning scattered citizen voices into structured, actionable data.

**🤖 AI-Driven Demand Intelligence**
Gemini 2.0 Flash doesn't just categorize — it detects recurring patterns across hundreds of complaints, clusters similar issues, and scores demand intensity. An MP can now objectively compare: "200 complaints about school infrastructure in Block A" versus "15 requests for a new vocational centre in Block B."

**🌍 Multilingual Accessibility**
Supporting 12 Indian languages ensures no citizen is excluded. The IVR system extends this to non-literate citizens who can submit complaints entirely by voice — no smartphone, no typing, no literacy required.

**🎙️ Voice-First Citizen Interaction**
The realistic IVR phone system with DTMF tones, TTS prompts, and speech-to-text makes the platform accessible to the last-mile citizen who has never used a computer.

**🗺️ Interactive GIS Visualization**
The Leaflet-powered map reveals geographic demand patterns — where complaints cluster, where infrastructure gaps overlap, and where proposed projects would have the most impact based on verified citizen demand.

**🧠 Evidence-Based Prioritization**
A 6-factor weighted algorithm replaces political lobbying with data. Severity, safety risk, urgency, affected population, compliance risk, and frequency — every issue scored objectively so the most critical needs rise to the top.

**📋 Actionable Recommendations**
AI generates department-specific next steps, maps complaints to relevant government schemes (PMGSY, Swachh Bharat, etc.), estimates timelines, and identifies required documents — giving MPs a ready-to-execute action plan.

**⚡ Scalable Architecture**
Built on Next.js 16, Firebase, and Gemini AI — serverless, cloud-native, and ready to scale from a single constituency to a national platform handling millions of requests.

**🎨 Enterprise-Grade UI/UX**
Glass morphism, dark mode, Framer Motion animations, responsive design — the polish of a production SaaS product, built for real deployment, not just a demo.

**📊 Data-Driven Governance**
Real-time analytics, trend analysis, and downloadable reports transform gut-feel governance into evidence-based decision-making. Competing project proposals can now be weighed against verified demand data.

**🌐 Built for Digital India**
Aligned with India's Digital Public Infrastructure vision — multilingual, voice-first, accessible, and designed for the governance challenges of a 1.4-billion-person democracy.

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
