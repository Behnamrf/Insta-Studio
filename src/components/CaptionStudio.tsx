import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Hash, 
  Search, 
  FileCode,
} from 'lucide-react';
import { Language, CaptionData, CaptionVariation } from '../types/instagram';
import { useTheme } from '../context/ThemeContext';

interface CaptionStudioProps {
  language: Language;
  onSelectVariation: (variation: CaptionVariation, hashtags: string[]) => void;
  onSendToHumanizer: (text: string) => void;
}

export const CaptionStudio: React.FC<CaptionStudioProps> = ({
  language,
  onSelectVariation,
  onSendToHumanizer,
}) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const [topic, setTopic] = useState(
    isFa ? 'چرا اکثر سازنده‌ها بعد از ۳ ماه تولید محتوا در اینستاگرام ناامید میشن' : 'Why 90% of creators quit Instagram after 90 days'
  );
  const [niche, setNiche] = useState(isFa ? 'تولید محتوا و رشد کسب‌وکار' : 'Content Marketing & Creator Mindset');
  const [tone, setTone] = useState(isFa ? 'صادقانه، الهام‌بخش و صمیمی' : 'Vulnerable, honest, actionable');
  
  const [isLoading, setIsLoading] = useState(false);
  const [captionData, setCaptionData] = useState<CaptionData | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'caption',
          topic,
          niche,
          tone,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setCaptionData(resData.data);
        setActiveVariationIndex(0);
        const variation = resData.data.variations[0];
        const allTags = [
          ...resData.data.hashtagClusters.niche,
          ...resData.data.hashtagClusters.community
        ];
        onSelectVariation(variation, allTags);
      }
    } catch (err) {
      console.error('Error generating captions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getAllHashtags = () => {
    if (!captionData) return [];
    return [
      ...captionData.hashtagClusters.broad,
      ...captionData.hashtagClusters.niche,
      ...captionData.hashtagClusters.community,
    ];
  };

  const copyFullCaption = (variation: CaptionVariation) => {
    const tags = getAllHashtags().map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    const full = `${variation.hookLine}\n\n${variation.body}\n\n${variation.cta}\n\n${tags}`;
    copyToClipboard(full, `var-${variation.type}`);
  };

  const copyClaudePrompt = () => {
    const prompt = `Use Jake Schincariol's /ig-caption skill:
Topic: "${topic}"
Niche: "${niche}"
Tone: "${tone}"
Language: ${isFa ? 'Persian' : 'English'}
Generate 3 distinct high-converting Instagram caption variations (Storytelling, Bullet Value, Conversation Trigger) with line-break formatting, SEO keywords, and 3-tier hashtag sets.`;
    copyToClipboard(prompt, 'claude');
  };

  return (
    <div className="space-y-6">
      
      {/* Parameter Control Form */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'استودیوی کپشن‌نویسی و سئوی اینستاگرام' : 'Caption & SEO Keyword Studio'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت /ig-caption' : 'Powered by /ig-caption skill'}
          </span>
        </div>

        {/* Topic Input */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'موضوع یا پیام اصلی کپشن' : 'Caption Topic / Message'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-sky-400 focus:outline-none ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Niche & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'حوزه تخصصی (Niche)' : 'Niche'}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-sky-400 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'لحن کپشن' : 'Tone'}
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-sky-400 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Generate Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:opacity-95 transition-all shadow-md shadow-sky-950/20 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isFa ? 'در حال نگارش ۳ مدل کپشن...' : 'Drafting 3 Caption Styles...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{isFa ? 'تولید ۳ مدل کپشن + سئو و هشتگ' : 'Generate 3 Caption Styles + SEO'}</span>
              </>
            )}
          </button>

          <button
            onClick={copyClaudePrompt}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-semibold border transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
          >
            {copiedType === 'claude' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <FileCode className="h-3.5 w-3.5 text-amber-500" />}
            <span>{isFa ? 'کپی پرامپت کلود' : 'Copy Claude Prompt'}</span>
          </button>
        </div>

      </div>

      {/* Generated Caption Results */}
      {captionData && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          {/* SEO Keywords Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-sky-500" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'کلمات کلیدی نمایه شده در الگوریتم سئو:' : 'Target SEO Keywords for Indexing:'}
              </span>
            </div>
            
            {/* Clean unboxed text metadata (Anti-slop zero pill rule) */}
            <div className={`flex flex-wrap items-center gap-2 text-xs font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {captionData.seoKeywords.map((kw, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-400 font-mono">·</span>}
                  <span className="text-sky-600 dark:text-sky-400 font-semibold">{kw}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3 Variations Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {captionData.variations.map((v, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveVariationIndex(idx);
                  onSelectVariation(v, getAllHashtags());
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  activeVariationIndex === idx
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : isDark
                      ? 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {idx + 1}. {v.type}
              </button>
            ))}
          </div>

          {/* Active Variation Display */}
          {captionData.variations[activeVariationIndex] && (
            <div className={`rounded-xl border p-5 space-y-4 ${
              isDark 
                ? 'border-sky-500/40 bg-slate-950' 
                : 'border-sky-200 bg-sky-50/30 shadow-xs'
            }`}>
              
              <div className={`flex items-center justify-between text-xs pb-2 border-b ${
                isDark ? 'border-slate-800' : 'border-sky-100'
              }`}>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  {captionData.variations[activeVariationIndex].type}
                </span>
                <button
                  onClick={() => copyFullCaption(captionData.variations[activeVariationIndex])}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  {copiedType === `var-${captionData.variations[activeVariationIndex].type}` ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400" />
                  )}
                  <span>{isFa ? 'کپی کامل این نسخه' : 'Copy Full'}</span>
                </button>
              </div>

              {/* Line 1: Hook */}
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isFa ? 'سطر اول (قلاب اسکرول - قبل از ...more):' : 'Line 1 Hook (Before ...more fold):'}
                </span>
                <p className={`text-base font-bold p-3 rounded-lg border ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                }`}>
                  {captionData.variations[activeVariationIndex].hookLine}
                </p>
              </div>

              {/* Body */}
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isFa ? 'بدنه کپشن (با فاصله‌گذاری مناسب موبایل):' : 'Caption Body (Formatted Spacing):'}
                </span>
                <p className={`text-xs whitespace-pre-line leading-relaxed p-4 rounded-lg border font-sans ${
                  isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                }`}>
                  {captionData.variations[activeVariationIndex].body}
                </p>
              </div>

              {/* CTA */}
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isFa ? 'دعوت به اقدام (Call To Action):' : 'Call To Action (CTA):'}
                </span>
                <p className={`text-xs font-semibold p-3 rounded-lg border ${
                  isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  {captionData.variations[activeVariationIndex].cta}
                </p>
              </div>

            </div>
          )}

          {/* 3-Tier Hashtag Clusters */}
          <div className="space-y-3 pt-2">
            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Hash className="h-4 w-4 text-pink-500" />
              <span>{isFa ? 'خوشه‌های ۳ سطحی هشتگ (الگوریتم اینستاگرام):' : '3-Tier Semantic Hashtag Clusters:'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              
              {/* Broad Tier */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isFa ? 'سطح ۱: هشتگ‌های فراگیر (Broad)' : 'Tier 1: Broad (100k+)'}
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                  {captionData.hashtagClusters.broad.map((tag, i) => (
                    <span key={i}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>

              {/* Niche Tier */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[11px] font-bold block text-amber-600 dark:text-amber-400">
                  {isFa ? 'سطح ۲: هشتگ‌های تخصصی (Niche)' : 'Tier 2: Niche (10k-100k)'}
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  {captionData.hashtagClusters.niche.map((tag, i) => (
                    <span key={i}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>

              {/* Community Tier */}
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[11px] font-bold block text-pink-600 dark:text-pink-400">
                  {isFa ? 'سطح ۳: انجمن و لوکال (Community)' : 'Tier 3: Community (<10k)'}
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-pink-700 dark:text-pink-300 font-medium">
                  {captionData.hashtagClusters.community.map((tag, i) => (
                    <span key={i}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => onSendToHumanizer(
                `${captionData.variations[activeVariationIndex].hookLine}\n\n${captionData.variations[activeVariationIndex].body}`
              )}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30' 
                  : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 shadow-xs'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isFa ? 'بررسی این کپشن در انسانی‌ساز لحن' : 'Run Through AI Humanizer'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
