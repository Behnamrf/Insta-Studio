# Instagram Agent Studio (استودیوی هوشمند تولید محتوای اینستاگرام)

An all-in-one Instagram content strategy and creation studio based on the open-source **Instagram Agent Skill** (by Jake Schincariol). It transforms 13 specialized creator skills into a production-grade web application with live Gemini AI generation, 26 proven viral hook formulas, multi-slide carousel builder, AI text humanizer, caption & hashtag optimizer, and an interactive Instagram live phone preview—with full bilingual support (Persian & English) and native RTL layout.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed through Phase 1 clarification:

- **Confirmed Decision 1 (Language & Direction)**: Bilingual application with a 1-click toggle between **Persian (فارسی - RTL)** and **English (LTR)**. All UI labels, prompt templates, hook formulas, and generated copy dynamically adapt to the selected language.
- **Confirmed Decision 2 (Studio Architecture)**: All-in-one Creator Studio organized into specialized, interconnected tabs:
  1. **Reel Studio & 26 Viral Hooks**: Script generator with duration timing, retention pacing, visual cues, and audio cues.
  2. **Carousel Slide Planner**: Multi-slide educational/storytelling decks (Slide 1 Hook to Slide 10 CTA).
  3. **Caption & SEO Hashtag Studio**: High-conversion captions with keyword search optimization and smart hashtag clusters (niche, broad, community).
  4. **AI Humanizer & Tone Polisher**: Removes robotic AI clichés, passive voice, and buzzwords to sound genuine and authentic.
  5. **Profile & Post Audit**: Bio scoring, link-in-bio strategy, and post performance critique.
  6. **Viral Idea & Strategy Hub**: Content pillars, trend radar, and weekly posting calendar.
- **Confirmed Decision 3 (AI Generation Engine)**: Built-in Gemini 3.8 Flash model called via secure server-side Express proxy (`/api/instagram/generate`) with complete working fallback templates and 1-click "Copy Prompt for Claude" option for hybrid usage.
- **Confirmed Decision 4 (Live Phone Mockup)**: Interactive real-time Instagram post/reel preview card that dynamically updates as the user edits or generates scripts, captions, and carousel slides.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the gap between raw LLM prompt skills and an intuitive creator workflow. Instead of typing terminal slash commands (`/ig-reel`, `/ig-caption`, `/ig-human`), creators get a polished web application where they can select a niche, choose from 26 scored viral hooks, generate full scripts with camera directions, polish text through the humanizer, and preview their post inside a realistic Instagram frame.
- **Target Audience**: Content creators, social media managers, agency strategists, founders, and Persian & global digital marketers seeking consistent, high-retention Instagram growth.
- **Key Value**: Eliminates creative block with proven viral psychology, prevents "AI slop" copy through algorithmic and LLM humanization, and provides instant copy-paste ready scripts with timing and staging directions.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Explore & Select Mode**: User lands on the studio; selects their niche (e.g., Tech, Fitness, Business, Lifestyle, Persian Creators) and target goal (Reach, Saves, Shares, Comments).
2. **Hook & Script Crafting**:
   - Creator browses the **26 Viral Hook Formulas** categorized by psychological triggers (Curiosity Gap, Negative Inversion, Direct Challenge, Counter-Intuitive, Data Shocker).
   - Enters a topic or rough idea; clicks **"Generate Script"**.
   - Gemini produces a timed breakdown: Hook (0-3s), Retain (3-15s), Deliver (15-45s), Call to Action (45-60s) with text overlays and audio cues.
3. **Tone Humanization (`/ig-human`)**:
   - One-click trigger runs the script or caption through the Humanizer filter: strips words like "delve", "game-changer", "unleash", "testament", adds conversational cadence and natural rhythm.
4. **Live Instagram Phone Preview**:
   - Split view or toggleable drawer showing how the caption, carousel slide, or Reel cover looks on an iPhone frame with username, audio tag, caption truncation, and hashtag layout.
5. **Export & Save**:
   - Quick "Copy Clean Text", "Copy for Claude", or "Save to History" (persisted in browser localStorage).

#### Visual Identity & Theme
- **Aesthetic Direction**: Modern Instagram editorial minimalism combined with sleek dark/light studio aesthetics. High contrast, precise hairline borders, and zero clutter.
- **Color Palette**:
  - Dominant Neutral: `#090A0F` (Dark Studio Canvas) / `#FFFFFF` (Crisp Light Mode)
  - Structural Surface: `#131620` (Dark card background) / `#F8FAFC` (Light card background)
  - Instagram Accent Gradient: Subtle magenta-to-orange warm flare (`from-pink-500 via-rose-500 to-amber-500`) for primary action highlights and active state accents.
  - Semantic: Emerald `#10B981` (High Viral Score), Amber `#F59E0B` (Refinement needed), Sky `#0EA5E9` (Informational cues).
- **Typography & Font Pairing**:
  - English: `Plus Jakarta Sans` for titles and controls; `Manrope` for body prose.
  - Persian: `Vazirmatn` / clean Persian typography with proper line-height (`1.7`) and optical RTL compensation.
  - Telemetry & Timing: `tabular-nums` for timers, retention percentages, and hook scores.
- **Component Styling & Layout**:
  - Top Bar Contract: Brand logo ("Instagram Agent Studio" / "استودیو اینستاگرام") + Mode tabs + Language toggle (FA / EN) + Theme toggle + Primary "New Post" action.
  - Workspace: Left control & input panel + Right sticky Instagram Phone Mockup with tabs for Feed Post, Reel View, and Carousel Deck preview.
  - Anti-Slop Discipline: No static pill clusters, no thick left border callouts, unboxed metadata with `·` separators, and natural title case headers.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Server-Side Gemini API Proxy**:
  - *Chosen Approach*: Implement an Express proxy route at `/api/instagram/generate` utilizing `@google/genai` with `gemini-3.8-flash`.
  - *Why*: Conforms strictly to AI Studio security guidelines (API keys never sent to the browser), provides fast response latency, and handles prompt engineering on the server.
  - *Alternatives Considered*: Client-side API calls (prohibited by platform guidelines).
- **Decision 2: Integrated 26 Scored Viral Hook Formulas**:
  - *Chosen Approach*: Built-in catalog of all 26 viral hook formulas from the Jake Schincariol skill repo (e.g., "The Negative Frame", "The Secret Society", "The Curiosity Inversion", "The Stop Doing This", etc.) with both English and Persian localized templates.
  - *Why*: Allows instant offline browsing and manual insertion even before generating, giving creators immediate inspiration.
- **Decision 3: Multi-Tab Studio vs Multi-Page App**:
  - *Chosen Approach*: Single-page responsive studio with tabbed views (Reels, Carousels, Captions, Humanizer, Profile Audit, Strategy).
  - *Why*: Creators frequently move between drafting a Reel script, polishing its caption, humanizing the text, and testing different hooks. Tabbed state in React keeps everything in memory without page refreshes.
- **Decision 4: Local Persistence**:
  - *Chosen Approach*: Store user drafts, saved hooks, and recent generations in browser `localStorage`.
  - *Why*: Immediate zero-configuration persistence across sessions without requiring external auth logins or complex backend database setup.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Instagram Agent Studio                          │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark · Tab Switcher · FA/EN · Dark/Light)    │
├──────────────────────────────────┬─────────────────────────────────────┤
│ Left Panel: Generator & Editor    │ Right Panel: Live Phone Mockup      │
│                                  │                                     │
│ ┌──────────────────────────────┐ │ ┌─────────────────────────────────┐ │
│ │ Mode Tabs:                   │ │ │ Instagram Device Preview Frame  │ │
│ │  [Reels] [Carousel] [Caption]│ │ │  • Reels Video Staging View     │ │
│ │  [Humanizer] [Hooks] [Audit] │ │ │  • Carousel Multi-Slide Deck    │ │
│ ├──────────────────────────────┤ │ │  • Post Caption & Hashtag View  │ │
│ │ Input Parameters:            │ │ │  • Safe-Zone & Retention Overlay│ │
│ │  • Topic / Concept / Niche   │ │ └─────────────────────────────────┘ │
│ │  • 26 Hook Formula Selector  │ │                                     │
│ │  • Target Tone & Audience    │ │ ┌─────────────────────────────────┐ │
│ │  • Goal (Viral, Saves, etc.) │ │ │ Action Bar:                     │ │
│ ├──────────────────────────────┤ │ │  [Copy Script] [Copy Caption]   │ │
│ │ [✨ Generate with Gemini AI]  │ │ │  [Copy Claude Prompt] [Save]    │ │
│ └──────────────────────────────┘ │ └─────────────────────────────────┘ │
└──────────────────────────────────┴─────────────────────────────────────┘
                 │ (HTTP POST)
                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Express Server Proxy (`server.ts`)                                     │
│   POST /api/instagram/generate                                         │
│   • Injects System Instructions based on Jake Schincariol's 13 skills  │
│   • Calls `@google/genai` with `gemini-3.8-flash`                      │
│   • Returns structured JSON with Hook, Retention Plan, Body, CTA, SEO  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Entities & State Model
- **`PostDraft`**:
  - `id`: string (uuid)
  - `type`: `'reel' | 'carousel' | 'caption' | 'audit'`
  - `title`: string
  - `topic`: string
  - `niche`: string
  - `hookFormulaId`: string
  - `hook`: string
  - `retentionPacing`: `{ timestamp: string; visual: string; audio: string; spoken: string }[]`
  - `caption`: string
  - `hashtags`: string[]
  - `carouselSlides`: `{ slideNumber: number; headline: string; body: string; visualNote: string }[]`
  - `humanizedScore`: number
  - `createdAt`: number
- **`Language`**: `'fa' | 'en'`
- **`Theme`**: `'dark' | 'light'`

#### State & Interaction Flow
1. Tab switching updates active mode without losing user topic input.
2. Hook formula click automatically pre-fills or influences the prompt context.
3. Generation triggers a sleek loading skeleton in the editor and phone preview.
4. Humanizer button can be invoked on any generated text chunk to compare "Before" (AI generated) vs "After" (Humanized conversational tone).
5. Language toggle switches direction `dir="rtl"` vs `dir="ltr"` and re-renders all UI strings, formulas, and prompt guidelines in Persian or English.
