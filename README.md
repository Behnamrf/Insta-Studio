# Instagram Agent Studio

<div align="center">

**All-in-one AI Instagram Content & Growth Studio**

[English](#-english-documentation) • [فارسی (Persian)](#-راهنمای-فارسی--persian-documentation)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)

</div>

---

## 🇺🇸 English Documentation

An all-in-one Instagram content strategy and creation studio based on the open-source **Instagram Agent Skills** framework (by Jake Schincariol). It transforms 13 specialized creator skills into a production-grade web application featuring live Google Gemini AI generation, 26 proven viral hook formulas, a multi-slide carousel planner, an AI copy humanizer, caption & hashtag optimizer, and an interactive Instagram live phone preview—with complete bilingual support (English & Persian) and native RTL layout with Vazirmatn typography.

### ✨ Key Features

#### 1. 🎬 Reel Scripting Studio (`/ig-reel`)
- **Staged Second-by-Second Breakdown:**
  - **0–3s:** Scroll-Stopping Hook (leveraging proven viral psychology).
  - **3–15s:** Retain Segment (agitating pain points and building curiosity).
  - **15–45s:** Deliver Segment (actionable, high-retention value delivery).
  - **45–60s:** High-Conversion Call-To-Action (save trigger or comment trigger word).
- **Camera & Visual Direction:** Detailed shot suggestions, camera motions, and on-screen text overlays (Text Overlays).
- **Audio & Retention Scoring:** Vibe and music recommendations, viral probability score (0–100), and algorithmic watch-time tips.

#### 2. 📑 Carousel Slide Deck Planner (`/ig-carousel`)
- **Slide-by-Slide Narrative Architecture (7–10 slides):**
  - **Slide 1:** High-contrast, scroll-stopping title hook.
  - **Slides 2–7:** Bite-sized value epiphanies with progressive swipe curiosity loops.
  - **Slide 8:** Summary checklist.
  - **Slide 9–10:** Follow, save, and share CTA.
- **Visual Design Rules:** Guidance on typography hierarchy, 20% safe border margins, and high-contrast color choices.

#### 3. ✍️ Caption & SEO Keyword Studio (`/ig-caption`)
- **3 High-Conversion Caption Variations:**
  1. *Storytelling / Personal Reflection:* First-line emotional hook, vulnerability, and genuine transformation.
  2. *Bullet Value / High Save:* Fast-scanning, actionable bullet tips engineered for maximum saves.
  3. *Conversation & Engagement Trigger:* Provocative opening question driving high comment volume.
- **Search Engine Optimization (SEO):** High-intent keyword extraction for Instagram's semantic search indexing.
- **3-Tier Hashtag Clusters:** Broad (>100k posts), Niche (10k–100k posts), and Community (<10k posts).

#### 4. 🤖 AI Copy Humanizer (`/ig-human`)
- **Banned Cliché Detection:** Automatically identifies robotic AI phrases (e.g., *"in today's digital landscape"*, *"delve"*, *"game-changer"*, *"testament"*, *"seamlessly"*, *"unleash"*, *"harness"*, and Persian corporate clichés).
- **Side-by-Side Comparison:** Before (robotic AI) vs. After (punchy, human, conversational cadence).
- **Authenticity Metric:** Calculates human authenticity score percentage and explains structural improvements.

#### 5. 🧭 26 Scored Viral Hook Formulas
- Complete library of 26 field-tested hook formulas (Negative Frame, The Inversion, The Secret Society, The Time Machine, The Lazy Hack, Unpopular Truth, The Warning, 60-Second Quick Fix, etc.).
- Includes retention percentage scores, fill-in-the-blank templates, real-world examples, and psychological trigger breakdowns.
- One-click transfer to the Reel Studio.

#### 6. 🛡️ Profile & Content Audit (`/ig-audit` & `/ig-profile`)
- Evaluates first-impression hook, value clarity, CTA efficiency, and retention potential.
- Provides letter grades (A+, A, B, etc.), strengths, weakness diagnostics, and two high-converting rewrites.

#### 7. 📅 7-Day Strategy Sprint (`/ig-strategy` & `/ig-calendar`)
- Identifies 3 core content pillars and weekly objectives.
- Delivers a Monday–Sunday schedule detailing format (Reel vs. Carousel vs. Story), concept angle, and engagement goal.

#### 8. 📱 Interactive Live Phone Mockup
- Realistic iPhone frame with Dynamic Island and status bar.
- Switch seamlessly between **Reel Player**, **Carousel Deck (swipeable)**, and **Feed Post** views.
- **Safe Zone Overlay:** Visualizes Instagram header and bottom action danger zones so critical text is never covered by UI icons.
- One-click copy for captions and hashtag sets.

#### 9. 🌐 Bilingual & Dual Themes
- **Persian & English:** One-click toggle switching UI direction (`dir="rtl"` vs. `dir="ltr"`), system fonts (**Vazirmatn** for Persian, **Plus Jakarta Sans** for English), and prompt contexts.
- **Dark & Light Modes:** Sleek dark studio aesthetic or crisp minimalist light theme, saved across sessions in `localStorage`.

---

### 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Motion (Framer Motion)
- **Styling:** Tailwind CSS v4, Vazirmatn Persian Font, Plus Jakarta Sans
- **Icons:** Lucide React
- **Backend:** Node.js, Express, tsx
- **AI Integration:** Google Gemini 3.8 Flash (`@google/genai`) with rich offline fallback engine

---

### 🚀 Getting Started & Installation

#### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm**, **bun**, or **yarn**

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/instagram-agent-studio.git
cd instagram-agent-studio
```

#### 2. Install dependencies
```bash
npm install
```
*(or with bun: `bun install`)*

#### 3. Set up environment variables
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env`:
```env
# Google Gemini API key (optional; app includes a full offline fallback engine)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Port (defaults to 3000)
PORT=3000
```
> *Tip:* You can generate a free API key at [Google AI Studio](https://aistudio.google.com/).

#### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Build for production
```bash
npm run build
npm start
```

---

### ⚙️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts full-stack Express + Vite development server on port 3000 |
| `npm run build` | Compiles production assets into `dist/` |
| `npm start` | Runs the production Express server |
| `npm run lint` | Runs TypeScript type checking via `tsc --noEmit` |
| `npm run preview` | Previews the production build locally |

---

### 🏛️ Architecture & Request Flow

```text
┌───────────────────────────────────────────────────────────────┐
│               Instagram Agent Studio (Client SPA)             │
│                                                               │
│  Navbar (Wordmark · Tab Switcher · EN/FA · Dark/Light)        │
│  ├── Workspace Panel (Reel / Carousel / Caption / ...)        │
│  └── Live Instagram Phone Mockup (Interactive Real-Time Sync) │
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTP POST (/api/instagram/generate)
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                Full-Stack Express Server (server.ts)          │
│                                                               │
│  ├── System Instructions (13 Instagram Creator Skills)       │
│  ├── Google GenAI SDK (@google/genai, gemini-3.8-flash)       │
│  ├── Intelligent Offline Fallback Engine (26 Hook Formulas)   │
│  └── Vite Middlewares (SPA serving in Dev & Dist in Prod)     │
└───────────────────────────────────────────────────────────────┘
```

---

## 🇮🇷 راهنمای فارسی / Persian Documentation

استودیوی هوشمند تولید محتوای اینستاگرام (**Instagram Agent Studio**)، یک پلتفرم جامع و مدرن برای ساخت سناریوهای وایرال، اسلایدهای کاروسل، کپشن‌های سئو شده و استراتژی رشد ارگانیک در اینستاگرام است که بر پایه چارچوب متن‌باز **Instagram Agent Skills** توسعه یافته است.

### 🌟 قابلیت‌های برجسته

1. **سناریونویسی ریلز (Reels):** زمان‌بندی دقیق ثانیه‌ای شامل هوک (۰-۳ ثانیه)، حفظ توجه (۳-۱۵ ثانیه)، ارائه ارزش (۱۵-۴۵ ثانیه) و دعوت به اقدام (۴۵-۶۰ ثانیه) به همراه زوایای فیلم‌برداری و متن‌های روی تصویر.
2. **پست‌های اسلایدی (Carousels):** طراحی ساختار اسلاید به اسلاید با حلقه‌های کنجکاوی و چک‌لیست جمع‌بندی با نرخ ذخیره‌سازی (Save) بالا.
3. **کپشن‌نویسی و سئوی اینستاگرام:** تولید ۳ مدل کپشن (داستانی، بولتی، و تعاملی)، کلمات کلیدی برای موتور جستجوی اینستاگرام و خوشه‌های ۳ سطحی هشتگ.
4. **انسانی‌ساز لحن متن (Humanizer):** حذف خودکار اصطلاحات رباتیک و کلیشه‌های هوش مصنوعی و جایگزینی با لحن روان، صمیمی و ضربی مناسب گوشی موبایل.
5. **۲۶ فرمول طلایی هوک:** کاتالوگ کامل فرمول‌های تست‌شده روانشناسی قلاب با امتیاز Retention، قالب‌های آماده و نمونه‌های واقعی.
6. **آنالیز بیو و پست‌ها (Audit):** بررسی تخصصی و نمره‌دهی به بیوگرافی و محتوا همراه با ارائه بازنویسی‌های آماده با نرخ تبدیل بالا.
7. **تقویم ۷ روزه محتوا (Sprint):** برنامه‌ریزی هفتگی تفکیک‌شده شامل ریلز، اسلایدی و استوری بر پایه ستون‌های محتوایی.
8. **شبیه‌ساز زنده در قاب اینستاگرام:** پیش‌نمایش ریلز، اسلایدها و پست‌های فید به همراه خطوط راهنمای حاشیه امن (Safe Zones).
9. **پشتیبانی دو زبانه و تم تیره/روشن:** چیدمان بومی راست‌چین با فونت استاندارد **وزیرمتن**، دکمه تغییر زبان لحظه‌ای و تم‌های تیره و روشن.

### 🚀 نحوه نصب و اجرا

```bash
# ۱. دریافت کدهای پروژه
git clone https://github.com/your-username/instagram-agent-studio.git
cd instagram-agent-studio

# ۲. نصب پکیج‌ها
npm install

# ۳. تنظیم فایل متغیرهای محیطی
cp .env.example .env

# ۴. اجرای برنامه
npm run dev
```
سپس در مرورگر خود آدرس `http://localhost:3000` را باز کنید.

---

## 📄 License

This project is open-source and licensed under the **[MIT License](./LICENSE)**.

---

<div align="center">
  Crafted with ❤️ for creators, marketers, and entrepreneurs worldwide.
</div>
