import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Banned AI Buzzwords for the Humanizer
const AI_BUZZWORDS = [
  'delve', 'delving', 'tapestry', 'game-changer', 'testament', 'revolutionize',
  'in today\'s fast-paced world', 'in today\'s digital landscape', 'beacon',
  'unleash', 'unlock', 'harness', 'crucial', 'pivotal', 'moreover', 'furthermore',
  'seamless', 'seamlessly', 'embark', 'elevate', 'foster', 'landscape', 'realm',
  'بستری فراهم', 'در دنیای پرشتاب امروز', 'نقش بسزایی', 'شایان ذکر است', 'حائز اهمیت',
  'بی‌شک', 'تحولی شگرف', 'دستخوش تغییر'
];

interface GenerateRequest {
  mode: 'reel' | 'carousel' | 'caption' | 'humanizer' | 'hook' | 'audit' | 'strategy';
  topic: string;
  niche?: string;
  hookFormula?: string;
  targetAudience?: string;
  goal?: string;
  tone?: string;
  language: 'fa' | 'en';
  existingText?: string;
}

app.post('/api/instagram/generate', async (req: Request, res: Response) => {
  try {
    const {
      mode,
      topic,
      niche = 'General Creator',
      hookFormula = 'The Negative Frame',
      targetAudience = 'Creators & Entrepreneurs',
      goal = 'Reach & Viral Engagement',
      tone = 'Bold & Conversational',
      language = 'fa',
      existingText = ''
    }: GenerateRequest = req.body;

    const isFarsi = language === 'fa';

    // System prompt synthesizing Jake Schincariol's 13 Claude Skills
    const systemPrompt = `You are the Instagram Agent Skill Master (based on Jake Schincariol's Instagram Agent framework).
You are an elite Instagram growth architect and viral copywriter who has managed accounts with millions of followers.
Your rules:
1. Zero AI Slop: NEVER use robotic clichés like "delve", "testament", "tapestry", "game-changer", "in today's digital landscape", or robotic academic words.
2. Short, punchy cadence. Instagram users read at an 8th-grade level while scrolling on a phone screen.
3. Every Reel hook MUST stop the scroll in under 2 seconds.
4. Carousels must maintain curiosity between slides (frictionless slide swipes).
5. Output language: ${isFarsi ? 'Persian (فارسی روان، صمیمی، حرفه‌ای و جذاب برای اینستاگرام فارسی با لحن انسانی)' : 'English (punchy, natural, conversational Instagram creator tone)'}.
6. Return purely valid JSON adhering to the requested schema. No markdown code blocks around the JSON.`;

    let userPrompt = '';
    let responseSchemaDescription = '';

    if (mode === 'reel') {
      userPrompt = `Write a viral Instagram Reel script about "${topic}" in the "${niche}" niche.
Hook Formula: "${hookFormula}". Target Audience: "${targetAudience}". Goal: "${goal}". Tone: "${tone}". Language: ${isFarsi ? 'Persian' : 'English'}.
Break down the script into:
1. A 0-3 second scroll-stopping hook using the formula.
2. 3-15s Retain segment (raising stakes / addressing pain).
3. 15-45s Deliver segment (quick, actionable points with specific visual cues and camera angles).
4. 45-60s Call To Action (Save for later / Comment a trigger word).
5. Text overlay recommendations for every shot.
6. Audio / music vibe suggestion.
7. Ready-to-post caption (with 1st line hook + 5-7 targeted hashtags).
8. Viral Score prediction (1-100) and 2 specific tips to increase watch time.`;
      responseSchemaDescription = `{
        "title": "string",
        "hook": "string",
        "audioVibe": "string",
        "estimatedDuration": "string",
        "viralScore": 88,
        "segments": [
          { "timestamp": "0-3s", "stage": "Hook", "spokenText": "string", "visualCue": "string", "textOverlay": "string" },
          { "timestamp": "3-15s", "stage": "Retain", "spokenText": "string", "visualCue": "string", "textOverlay": "string" },
          { "timestamp": "15-45s", "stage": "Deliver", "spokenText": "string", "visualCue": "string", "textOverlay": "string" },
          { "timestamp": "45-60s", "stage": "CTA", "spokenText": "string", "visualCue": "string", "textOverlay": "string" }
        ],
        "caption": "string",
        "hashtags": ["string"],
        "retentionTips": ["string", "string"]
      }`;
    } else if (mode === 'carousel') {
      userPrompt = `Design a 8-10 slide viral educational/storytelling carousel about "${topic}" for "${niche}".
Target Audience: "${targetAudience}". Language: ${isFarsi ? 'Persian' : 'English'}.
Slide 1 MUST be a high-conversion hook slide with a main title and compelling sub-hook.
Slides 2 to 7 must deliver 1 bite-sized epiphany per slide with clear design/visual cues.
Slide 8-9 must be a summary checklist.
Slide 10 must be a save & share CTA.
Include companion caption and hashtags.`;
      responseSchemaDescription = `{
        "title": "string",
        "slideCount": 8,
        "slides": [
          { "slideNumber": 1, "type": "Hook", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 2, "type": "Value", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 3, "type": "Value", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 4, "type": "Value", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 5, "type": "Value", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 6, "type": "Value", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 7, "type": "Summary", "headline": "string", "subtext": "string", "visualNote": "string" },
          { "slideNumber": 8, "type": "CTA", "headline": "string", "subtext": "string", "visualNote": "string" }
        ],
        "caption": "string",
        "hashtags": ["string"],
        "designAdvice": "string"
      }`;
    } else if (mode === 'caption') {
      userPrompt = `Create 3 distinct high-converting Instagram caption variations for: "${topic}".
Niche: "${niche}". Tone: "${tone}". Language: ${isFarsi ? 'Persian' : 'English'}.
Variation 1: Storytelling / Personal Reflection (high emotion, hook in line 1).
Variation 2: Quick Bullet Breakdown / Punchy (fast scan, high saves).
Variation 3: Direct Engagement Trigger / Question (high comments).
Provide structured SEO keywords and 3 tiers of hashtags: Broad, Niche, Community.`;
      responseSchemaDescription = `{
        "seoKeywords": ["string", "string"],
        "variations": [
          { "type": "Storytelling", "hookLine": "string", "body": "string", "cta": "string" },
          { "type": "Quick Bullet / Value", "hookLine": "string", "body": "string", "cta": "string" },
          { "type": "Conversation Trigger", "hookLine": "string", "body": "string", "cta": "string" }
        ],
        "hashtagClusters": {
          "broad": ["string"],
          "niche": ["string"],
          "community": ["string"]
        }
      }`;
    } else if (mode === 'humanizer') {
      userPrompt = `Analyze and humanize the following Instagram copy or draft:
"""
${existingText || topic}
"""
Language: ${isFarsi ? 'Persian' : 'English'}.
Remove all generic AI phrases, robotic buzzwords, passive sentence structures, and academic stiffness.
Rewrite it in a crisp, punchy, conversational, authentic human voice suitable for social media.
Calculate an authenticity score before and after (0-100), identify detected robotic clichés, and explain what was changed.`;
      responseSchemaDescription = `{
        "originalScore": 45,
        "humanizedScore": 96,
        "detectedClichés": ["string"],
        "humanizedText": "string",
        "explanationOfChanges": ["string"],
        "readingPacing": "string"
      }`;
    } else if (mode === 'hook') {
      userPrompt = `Generate 10 high-converting Instagram viral hooks for the topic: "${topic}" in the "${niche}" niche.
Language: ${isFarsi ? 'Persian' : 'English'}.
Incorporate formulas from Jake Schincariol's 26 Hook Formulas (Negative Frame, Inversion, Secret Society, Time Machine, Lazy Hack, Disbelief, etc.).
Provide the hook text, psychological trigger, and estimated retention score (1-100).`;
      responseSchemaDescription = `{
        "topic": "string",
        "hooks": [
          { "id": 1, "formulaName": "string", "hookText": "string", "psychologicalTrigger": "string", "retentionScore": 94 },
          { "id": 2, "formulaName": "string", "hookText": "string", "psychologicalTrigger": "string", "retentionScore": 91 }
        ]
      }`;
    } else if (mode === 'audit') {
      userPrompt = `Audit this Instagram bio or post concept:
"""
${existingText || topic}
"""
Niche: "${niche}". Language: ${isFarsi ? 'Persian' : 'English'}.
Evaluate:
1. Hook & First Impression (0-100)
2. Clarity & Value Proposition (0-100)
3. Call to Action Efficiency (0-100)
4. Overall Profile / Post Grade (A, B, C, etc.)
5. 3 specific weak points and 3 high-converting rewrites.`;
      responseSchemaDescription = `{
        "overallGrade": "A-",
        "scores": { "hook": 85, "clarity": 78, "cta": 90, "retention": 82 },
        "strengths": ["string"],
        "weaknesses": ["string"],
        "recommendedRewrites": [
          { "label": "Optimized Bio / Hook", "text": "string" },
          { "label": "High-Conversion CTA", "text": "string" }
        ],
        "actionChecklist": ["string"]
      }`;
    } else if (mode === 'strategy') {
      userPrompt = `Create a 7-day Instagram content sprint for "${topic}" in the "${niche}" niche.
Target: "${targetAudience}". Goal: "${goal}". Language: ${isFarsi ? 'Persian' : 'English'}.
Include content pillars, a Monday-Sunday posting schedule with format (Reel vs Carousel vs Story), exact angle, and engagement goal.`;
      responseSchemaDescription = `{
        "strategySummary": "string",
        "contentPillars": ["string", "string", "string"],
        "schedule": [
          { "day": "Day 1 (شنبه / Mon)", "format": "Reel", "title": "string", "hook": "string", "goal": "Viral Reach" },
          { "day": "Day 2 (یکشنبه / Tue)", "format": "Carousel", "title": "string", "hook": "string", "goal": "Saves & Authority" }
        ],
        "weeklyGrowthGoal": "string"
      }`;
    }

    if (ai) {
      const fullPrompt = `${systemPrompt}\n\nTask:\n${userPrompt}\n\nReturn JSON matching this exact structure:\n${responseSchemaDescription}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.warn('Could not parse Gemini JSON directly, extracting substring:', parseErr);
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return res.json({ success: true, data: parsed, source: 'gemini' });
        }
      }
    }

    // Fallback Generator if Gemini API key not present or failed
    const fallbackData = generateRichFallback(mode, topic, niche, hookFormula, language, existingText);
    return res.json({ success: true, data: fallbackData, source: 'fallback' });
  } catch (error: any) {
    console.error('Instagram Agent Generation Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate Instagram content',
    });
  }
});

function generateRichFallback(
  mode: string,
  topic: string,
  niche: string,
  hookFormula: string,
  language: 'fa' | 'en',
  existingText: string
) {
  const isFa = language === 'fa';
  const cleanTopic = topic || (isFa ? 'رشد پیج اینستاگرام' : 'Instagram Organic Growth');

  if (mode === 'reel') {
    return {
      title: isFa ? `سناریوی وایرال برای ${cleanTopic}` : `Viral Reel Blueprint for ${cleanTopic}`,
      hook: isFa 
        ? `دیگه این اشتباه رو توی ${cleanTopic} تکرار نکن اگه می‌خوای پیجت بترکه...`
        : `Stop making this massive mistake in ${cleanTopic} if you actually want to grow...`,
      audioVibe: isFa ? 'ترک ریتمیک، بیس ملایم و مدرن (Trending Phonk / Lo-fi Trap)' : 'Fast rhythmic hip-hop beat with soft punchy sub-bass',
      estimatedDuration: '45s',
      viralScore: 92,
      segments: [
        {
          timestamp: '0-3s',
          stage: isFa ? 'هوک (قلاب)' : 'Hook',
          spokenText: isFa
            ? `۹۰ درصد آدما توی ${cleanTopic} این اشتباه مهلک رو می‌کنن، تو جزوشون نباش!`
            : `90% of creators in ${cleanTopic} are doing this completely backwards. Don't be one of them.`,
          visualCue: isFa ? 'نمای کلوزآپ سریع، نگاه مستقیم به لنز، اشاره دست به دوربین' : 'Fast snap zoom to tight face shot, hand gesture stopping the scroll',
          textOverlay: isFa ? `بزرگترین اشتباه در ${cleanTopic} 🚨` : `Stop Doing This in ${cleanTopic} 🚨`
        },
        {
          timestamp: '3-15s',
          stage: isFa ? 'حفظ توجه (Retain)' : 'Retain',
          spokenText: isFa
            ? `همه فکر می‌کنن باید هر روز پست بذارن، اما الگوریتم ۲۰۲۶ فقط دنبال یه چیزه: نرخ سیو و تایم تماشا.`
            : `Everyone preaches posting 3x a day. But the 2026 algorithm only rewards one thing: retention pacing.`,
          visualCue: isFa ? 'تغییر زاویه به مدیوم شات، نمایش اسکرین‌شات آمار در پس‌زمینه' : 'Cut to angle B, split-screen overlay showing real retention curve',
          textOverlay: isFa ? 'تله‌ی رایج الگوریتم!' : 'The Algorithm Trap'
        },
        {
          timestamp: '15-38s',
          stage: isFa ? 'ارائه ارزش (Deliver)' : 'Deliver',
          spokenText: isFa
            ? `به جای این کار، از فرمول سه مرحله‌ای استفاده کن: اول در ثانیه اول یه تناقض بگو، بعد بلافاصله راه‌حل عملی رو در ۳ گام نشون بده.`
            : `Instead, run this 3-step playbook: inject curiosity in frame 1, show before-and-after proof, then give a frictionless micro-step.`,
          visualCue: isFa ? 'کات به تصویر روی صفحه نمایش یا اسلاید گرافیکی مینیمال' : 'B-roll showcase with text pop-ins highlighting 3 clear steps',
          textOverlay: isFa ? 'فرمول ۳ مرحله‌ای طلایی' : 'The 3-Step Execution'
        },
        {
          timestamp: '38-45s',
          stage: isFa ? 'دعوت به اقدام (CTA)' : 'CTA',
          spokenText: isFa
            ? `کلمه «رشد» رو توی کامنت‌ها بفرست تا چک‌لیست کاملش رو برات دایرکت بفرستم. این ویدیو رو حتماً سیو کن!`
            : `Comment "GROWTH" below and I'll DM you the free 1-page template. Save this so you don't lose it!`,
          visualCue: isFa ? 'اشاره دست به پایین و نمایش آیکون سیو' : 'Finger points to save icon, clear text on screen',
          textOverlay: isFa ? 'سیو کن + کلمه «رشد» رو کامنت کن 👇' : 'Save this + Comment "GROWTH" below'
        }
      ],
      caption: isFa
        ? `اگه فکر می‌کنی الگوریتم باهات سر لج داره، این پست رو تا آخر ببین.\n\nاکثر سازنده‌ها ساعت‌ها وقت می‌ذارن اما چون هوک ابتدایی ضعیفه، ویدیو توی ۵ ثانیه اول می‌میره.\n\nسیوش کن که موقع ضبط بعدی یادت نره!\n\n#اینستاگرام #تولید_محتوا #رشد_پیج #ریلز`
        : `If you feel like the algorithm is ghosting your content, you're missing the retention bridge.\n\nThe first 3 seconds decide 80% of your reach. Stop burying the hook.\n\nSave this for your next batch filming day!\n\n#contentcreation #instagramgrowth #creatorstrategy #reeltips`,
      hashtags: isFa
        ? ['اینستاگرام', 'تولید_محتوا', 'رشد_پیج', 'ریلز', 'آموزش_اینستاگرام', 'استراتژی_محتوا']
        : ['#instagramgrowth', '#creatorstrategy', '#reeltips', '#viralcontent', '#socialmediatips'],
      retentionTips: isFa
        ? ['هر ۳ الی ۴ ثانیه زاویه دوربین یا متن روی تصویر را تغییر دهید.', 'جملات پرکننده مثل «سلام دوستان امیدوارم حالتون خوب باشه» را کاملاً حذف کنید.']
        : ['Cut out dead breaths and introduce visual motion every 3 seconds.', 'Start with action immediately without saying "Hey guys welcome back".']
    };
  }

  if (mode === 'carousel') {
    return {
      title: isFa ? `طرح اسلایدی ۱۰ مرحله‌ای: ${cleanTopic}` : `10-Slide Master Carousel: ${cleanTopic}`,
      slideCount: 8,
      slides: [
        {
          slideNumber: 1,
          type: 'Hook',
          headline: isFa ? `رازهایی درباره ${cleanTopic} که هیچ‌کس بهت نمیگه` : `What Nobody Tells You About ${cleanTopic}`,
          subtext: isFa ? `(ورق بزن تا راهکار واقعی رو ببینی ➡️)` : `(Swipe to see the exact breakdown ➡️)`,
          visualNote: isFa ? 'کاور با کنتراست بالا، متن بولد در مرکز، تصویر مینیمال مرتبط' : 'High contrast dark card, clean bold typography in center'
        },
        {
          slideNumber: 2,
          type: 'Value',
          headline: isFa ? `۰۱. توقف اشتباهات تکراری` : `01. Stop Burning Out`,
          subtext: isFa ? `بیش از ۸۰ درصد وقت صرف کارهایی میشه که تاثیری در جذب مخاطب هدف نداره.` : `80% of effort goes into busywork that has zero correlation with saves.`,
          visualNote: isFa ? 'نمودار ساده یا مقایسه بصری غلط vs درست' : 'Simple comparison chart or minimal red cross vs green tick'
        },
        {
          slideNumber: 3,
          type: 'Value',
          headline: isFa ? `۰۲. ساختار قلاب طلایی` : `02. The Hook Architecture`,
          subtext: isFa ? `هر اسلاید باید پاسخ به یک سوال ذهنی اسلاید قبلی باشه تا مخاطب بدون فکر ورق بزنه.` : `Each slide must open an open loop that the next slide resolves.`,
          visualNote: isFa ? 'پیکان‌های متصل‌کننده مینیمال' : 'Minimal directional indicator leading to slide edge'
        },
        {
          slideNumber: 4,
          type: 'Value',
          headline: isFa ? `۰۳. کمیت فدای کیفیت نمیشه` : `03. Consistency Over Hype`,
          subtext: isFa ? `به جای ۷ پست ضعیف در هفته، ۳ پست با ارزش ذخیره‌سازی بالا تولید کن.` : `3 high-save assets beat 7 disposable posts every single time.`,
          visualNote: isFa ? 'آیکون بوکمارک / سیو برجسته' : 'Highlighted bookmark metric visual'
        },
        {
          slideNumber: 5,
          type: 'Value',
          headline: isFa ? `۰۴. بهینه‌سازی کلمات کلیدی` : `04. Instagram SEO Indexing`,
          subtext: isFa ? `اینستاگرام حالا یک موتور جستجوست؛ کلمات کلیدی اصلی باید در متن اسلایدها و کپشن باشن.` : `Instagram is a semantic search engine. Put high-intent keywords directly in text.`,
          visualNote: isFa ? 'نمایش سرچ بار مینیمال اینستاگرام' : 'Clean Instagram search bar simulation'
        },
        {
          slideNumber: 6,
          type: 'Summary',
          headline: isFa ? `چک‌لیست ۳۰ ثانیه‌ای` : `The 30-Second Summary`,
          subtext: isFa ? `۱. هوک قوی در اسلاید ۱\n۲. یک ایده در هر اسلاید\n۳. دعوت به سیو در اسلاید آخر` : `1. Strong friction-free hook\n2. 1 concept per slide\n3. Clear save trigger`,
          visualNote: isFa ? 'لیست باکس با تیک‌های مدرن' : 'Minimal checklist bullet layout'
        },
        {
          slideNumber: 7,
          type: 'CTA',
          headline: isFa ? `این پست رو ذخیره کن` : `Save This For Reference`,
          subtext: isFa ? `موقع طراحی اسلایدهای بعدیت به کارت میاد! پیج رو فالو کن تا آموزش بعدی رو از دست ندی.` : `You will need this framework on your next content day. Follow for daily breakdowns.`,
          visualNote: isFa ? 'آیکون سیو و پروفایل با حاشیه گرادیان اینستاگرام' : 'Instagram gradient ring avatar with save button animation'
        }
      ],
      caption: isFa
        ? `ورق بزنید و این راهنمای کامل ${cleanTopic} رو ذخیره کنید 📑\n\nاسلاید ۴ مهم‌ترین نکته‌ای هست که اکثر پیج‌ها فراموش می‌کنن.\n\nکدوم اسلاید برای شما مفیدتر بود؟ برام بنویسید 👇`
        : `Swipe through for the blueprint on ${cleanTopic} 📑\n\nSlide 4 is where 90% of creators lose momentum.\n\nWhich slide resonated most with you? Let me know below 👇`,
      hashtags: isFa
        ? ['اسلایدی', 'آموزش_اینستاگرام', 'تولید_محتوا', 'کاروسل', 'استراتژی_محتوا']
        : ['#carouselpost', '#instagramcarousel', '#contentstrategy', '#creatorgrowth'],
      designAdvice: isFa
        ? 'از فونت بولد و خوانا استفاده کنید و حاشیه امن ۲۰ درصدی از لبه‌های تصویر را رعایت کنید.'
        : 'Maintain 40px safe margins from the borders so the Instagram UI overlay doesn\'t cover text.'
    };
  }

  if (mode === 'caption') {
    return {
      seoKeywords: isFa
        ? [cleanTopic, 'آموزش اینستاگرام', 'تولید محتوا', 'الگوریتم اینستاگرام']
        : [cleanTopic, 'Instagram Growth', 'Viral Strategy', 'Content Creator'],
      variations: [
        {
          type: isFa ? 'داستانی و شخصی' : 'Storytelling',
          hookLine: isFa
            ? `راستش رو بگم؟ ۶ ماه پیش نزدیک بود کلاً قید ${cleanTopic} رو بزنم.`
            : `I was ready to quit ${cleanTopic} 6 months ago.`,
          body: isFa
            ? `هر روز محتوا می‌ذاشتم، ساعت‌ها وقت می‌ذاشتم ولی آمار بازدید تکون نمی‌خورد. تا اینکه فهمیدم مشکل از تلاش من نیست، مشکل از ساختار قلاب و ارتباط با مخاطبه.\n\nوقتی سیستمم رو عوض کردم، رشد واقعی شروع شد.`
            : `I spent 4 hours crafting posts that reached 47 people. I thought the algorithm was rigged. Then I realized: I was writing for myself, not the reader.\n\nOnce I flipped that switch, everything unlocked.`,
          cta: isFa ? `تو هم این حس رو تجربه کردی؟ نظرت رو برام کامنت کن.` : `Have you felt this wall before? Drop your thoughts below.`
        },
        {
          type: isFa ? 'بولتی و پر از نکته (نرخ سیو بالا)' : 'Bullet Value / High Save',
          hookLine: isFa
            ? `۳ ترفند اساسی در ${cleanTopic} که فوراً باید پیاده کنی:`
            : `3 non-negotiable rules for ${cleanTopic} in 2026:`,
          body: isFa
            ? `۱. هوک منفی ۲ برابر بیشتر از هوک مثبت کلیک می‌خوره.\n۲. متن کپشن رو با فاصله‌گذاری مناسب و بدون پاراگراف‌های طولانی بنویس.\n۳. کلمات کلیدی حوزه‌ت رو در ۳ سطر اول جا بده.`
            : `1. Negative framing gets 2.3x more watch time than passive advice.\n2. Add white space between sentences—nobody reads walls of text on mobile.\n3. Put search intent keywords directly in the first 125 characters.`,
          cta: isFa ? `این پست رو ذخیره کن تا گمش نکنی 📌` : `Save this post so you have it ready for your next batch 📌`
        },
        {
          type: isFa ? 'محرک کامنت و تعامل مستقیم' : 'Conversation & Engagement Trigger',
          hookLine: isFa
            ? `یک سوال بدون تعارف: بزرگترین چالش تو در ${cleanTopic} چیه؟`
            : `Brutally honest question: What is your #1 bottleneck with ${cleanTopic}?`,
          body: isFa
            ? `اکثر بچه‌ها بین کمبود ایده و نداشتن وقت گیر افتادن. ولی به نظر من سخت‌ترین بخش، پایبندی به یک روتین مشخصه.\n\nتو کدوم سمتی؟`
            : `Most people blame lack of time or bad luck. But usually it comes down to friction in the creation workflow.\n\nWhere are you stuck right now?`,
          cta: isFa ? `عدد ۱ (ایده) یا ۲ (وقت) رو برام بنویس 👇` : `Comment "1" (Ideas) or "2" (Execution) below 👇`
        }
      ],
      hashtagClusters: {
        broad: isFa ? ['#اینستاگرام', '#تولید_محتوا', '#کسب_و_کار'] : ['#contentcreation', '#socialmediamarketing', '#creators'],
        niche: isFa ? [`#${cleanTopic.replace(/\s+/g, '_')}`, '#رشد_پیج', '#استراتژی_پیج'] : [`#${cleanTopic.toLowerCase().replace(/\s+/g, '')}`, '#instagramtips', '#contentcoach'],
        community: isFa ? ['#بلاگری', '#ادمینی', '#دیجیتال_مارکتینگ'] : ['#creatorcommunity', '#buildinpublic', '#growthhacks']
      }
    };
  }

  if (mode === 'humanizer') {
    const textToClean = existingText || topic || (isFa ? 'در دنیای پرشتاب امروز، اینستاگرام بستری بی‌نظیر برای ارتقای کسب‌وکارها فراهم نموده است...' : 'In today\'s fast-paced digital landscape, mastering Instagram is a game-changer that delves deep into unlocking audience engagement...');
    return {
      originalScore: 42,
      humanizedScore: 95,
      detectedClichés: isFa 
        ? ['در دنیای پرشتاب امروز', 'بستری بی‌نظیر فراهم نموده است', 'ارتقای کسب‌وکارها']
        : ['in today\'s fast-paced digital landscape', 'game-changer', 'delves deep into unlocking'],
      humanizedText: isFa
        ? `اگر هنوز با رشد پیجت درگیری، قضیه پیچیده نیست: مردم به محتوای کتابی و اتوکشیده توجهی ندارن. خودت باش، مستقیم سر اصل مطلب برو و به جای کلمات قلمبه‌سلمبه، راحت و دوستانه صحبت کن.`
        : `If you're still struggling to grow on Instagram, here's the unvarnished truth: people don't read robotic corporate copy. Cut the fluff, speak like you would to a friend over coffee, and get to the point in under 3 seconds.`,
      explanationOfChanges: isFa
        ? [
            'حذف عبارات کلیشه‌ای مانند «در دنیای امروز» و ساختار مجهول',
            'شکستن جملات طولانی به جملات ضربی، پرانرژی و محاوره‌ای سالم',
            'افزایش حس صمیمیت و روان‌خوانی متن در گوشی موبایل'
          ]
        : [
            'Stripped corporate filler buzzwords ("game-changer", "landscape", "delve")',
            'Split runaway complex sentences into punchy conversational cadence',
            'Shifted from passive lecture mode to direct 1-on-1 human advice'
          ],
      readingPacing: isFa ? 'روان، ریتمیک، متناسب با خوانش ۵ ثانیه‌ای موبایل' : 'Punchy, conversational, 6th-grade mobile readability'
    };
  }

  if (mode === 'hook') {
    return {
      topic: cleanTopic,
      hooks: [
        {
          id: 1,
          formulaName: isFa ? 'چارچوب منفی (The Negative Frame)' : 'The Negative Frame',
          hookText: isFa
            ? `دیگه این کار رو توی ${cleanTopic} انجام نده اگه نمی‌خوای وقتت تلف بشه.`
            : `Stop doing this in ${cleanTopic} if you don't want to waste the next 6 months.`,
          psychologicalTrigger: isFa ? 'ترس از اشتباه و از دست دادن فرصت' : 'Loss Aversion & Mistake Avoidance',
          retentionScore: 96
        },
        {
          id: 2,
          formulaName: isFa ? 'شکاف کنجکاوی و تست عملی (The Curiosity Gap)' : 'The Curiosity Gap',
          hookText: isFa
            ? `من برای ۳۰ روز متوالی این روش ${cleanTopic} رو تست کردم و نتیجه شوکه کرد منو...`
            : `I tested this viral ${cleanTopic} strategy for 30 days so you don't have to...`,
          psychologicalTrigger: isFa ? 'کنجکاوی شدید و اثبات تجربی' : 'Proof of Effort & Curiosity Gap',
          retentionScore: 94
        },
        {
          id: 3,
          formulaName: isFa ? 'وارونگی باور رایج (The Inversion)' : 'The Inversion',
          hookText: isFa
            ? `همه بهت میگن [فلان کار] رو بکن، ولی سریع‌ترین راه رشد دقیقاً برعکسشه!`
            : `Everyone preaches doing [X], but the fastest route is actually the complete opposite.`,
          psychologicalTrigger: isFa ? 'تضاد فکری و شوک شناختی' : 'Cognitive Dissonance & Contrarianism',
          retentionScore: 91
        },
        {
          id: 4,
          formulaName: isFa ? 'انجمن سری و ۱ درصد (The Secret Society)' : 'The Secret Society',
          hookText: isFa
            ? `فقط ۱ درصد از سازنده‌های حرفه‌ای این ترفند ${cleanTopic} رو می‌دونن.`
            : `Only the top 1% of creators know this ${cleanTopic} leverage point.`,
          psychologicalTrigger: isFa ? 'حس برتری و دسترسی به اطلاعات محرمانه' : 'Exclusivity & Secret Knowledge',
          retentionScore: 89
        },
        {
          id: 5,
          formulaName: isFa ? 'ماشین زمان (The Time Machine)' : 'The Time Machine',
          hookText: isFa
            ? `اگه قرار بود ${cleanTopic} رو همین امروز از صفر شروع کنم، فقط این ۳ کار رو می‌کردم:`
            : `If I had to start ${cleanTopic} completely from scratch in 2026, here is my exact playbook:`,
          psychologicalTrigger: isFa ? 'میانبر ذهنی و نقشه راه امتحان شده' : 'Zero-to-Hero Actionable Blueprint',
          retentionScore: 95
        }
      ]
    };
  }

  // Audit fallback
  return {
    overallGrade: 'B+',
    scores: {
      hook: 82,
      clarity: 88,
      cta: 75,
      retention: 84
    },
    strengths: isFa
      ? ['موضوع مشخص و دست‌گذاشتن روی نقطه درد مخاطب', 'استفاده از جملات واضح و عدم ابهام']
      : ['Clear audience relevance and specific pain-point targeting', 'Strong conceptual core'],
    weaknesses: isFa
      ? ['دعوت به اقدام (CTA) بیش از حد کلی است و انگیزه فوری برای کامنت یا سیو ایجاد نمی‌کند.', 'خط اول نیاز به کنتراست شدیدتری برای توقف اسکرول دارد.']
      : ['CTA lacks a compelling trigger word (e.g. comment "GUIDE")', 'Hook opening could raise stakes faster in the first 2 seconds.'],
    recommendedRewrites: [
      {
        label: isFa ? 'نسخه قلاب تقویت‌شده (Viral Hook)' : 'High-Voltage Hook',
        text: isFa ? `قبل از اینکه پست بعدی رو منتشر کنی، این ۱ اشتباه رو چک کن:` : `Before you post your next Reel, double check this 1 costly flaw:`
      },
      {
        label: isFa ? 'دعوت به اقدام با نرخ تبدیل بالا (High-Conversion CTA)' : 'High-Conversion CTA',
        text: isFa ? `کلمه «قالب» رو کامنت کن تا چک‌لیست رایگانش رو برات بفرستم.` : `Comment "BLUEPRINT" below and I'll send the free Notion guide straight to your DMs.`
      }
    ],
    actionChecklist: isFa
      ? [
          'کلمات کلیدی مرتبط را در بیو و خط اول کپشن قرار دهید.',
          'از هایلایت‌های پیج به عنوان قیف تبدیل مخاطب جدید به مشتری استفاده کنید.',
          'در استوری‌ها حتماً از استیکر تعاملی (کوییز یا نظرسنجی) استفاده کنید.'
        ]
      : [
          'Add targeted keywords to your Instagram display name.',
          'Turn your pinned posts into a 3-part conversion funnel.',
          'Use interactive question stickers within 2 hours of posting.'
        ]
  };
}

// Development and Production server setups
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Instagram Agent Studio server running on port ${PORT}`);
  });
}

startServer();
