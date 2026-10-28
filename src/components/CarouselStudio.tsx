import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  FileCode, 
  Palette,
} from 'lucide-react';
import { Language, CarouselData } from '../types/instagram';
import { useTheme } from '../context/ThemeContext';

interface CarouselStudioProps {
  language: Language;
  onCarouselGenerated: (data: CarouselData) => void;
  onSendToHumanizer: (text: string) => void;
}

export const CarouselStudio: React.FC<CarouselStudioProps> = ({
  language,
  onCarouselGenerated,
  onSendToHumanizer,
}) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const [topic, setTopic] = useState(
    isFa ? 'راهنمای گام‌به‌گام سئوی اینستاگرام برای جذب فالوور جدید' : 'Complete Step-by-Step Instagram SEO Framework'
  );
  const [niche, setNiche] = useState(isFa ? 'آموزش اینستاگرام و دیجیتال مارکتینگ' : 'Digital Marketing & Creator Economy');
  const [audience, setAudience] = useState(isFa ? 'صاحبان پیج‌های کاری و مدرسان آنلاین' : 'Small business owners & solo creators');
  const [isLoading, setIsLoading] = useState(false);
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'carousel',
          topic,
          niche,
          targetAudience: audience,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setCarouselData(resData.data);
        setActiveSlideIndex(0);
        onCarouselGenerated(resData.data);
      }
    } catch (err) {
      console.error('Error generating carousel:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getFullSlidesText = () => {
    if (!carouselData) return '';
    const slidesText = carouselData.slides
      .map(s => `[SLIDE ${s.slideNumber} - ${s.type}]\nHeadline: ${s.headline}\nText: ${s.subtext}\nVisual Note: ${s.visualNote}`)
      .join('\n\n---\n\n');
    return `CAROUSEL TITLE: ${carouselData.title}\n\n${slidesText}\n\n=== CAPTION ===\n${carouselData.caption}\n\n${carouselData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
  };

  const copyClaudePrompt = () => {
    const prompt = `Use Jake Schincariol's /ig-carousel skill:
Topic: "${topic}"
Niche: "${niche}"
Target Audience: "${audience}"
Language: ${isFa ? 'Persian' : 'English'}
Design an 8-10 slide high-save carousel deck with an irresistible Slide 1 hook, progressive swipe curiosity loops, summary checklist, and companion caption.`;
    copyToClipboard(prompt, 'claude');
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Form */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'طراح پست‌های اسلایدی کاروسل (نرخ سیو بالا)' : 'Carousel Slide Deck Planner'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت /ig-carousel' : 'Powered by /ig-carousel skill'}
          </span>
        </div>

        {/* Topic Input */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'موضوع اصلی اسلایدها' : 'Carousel Master Topic'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Niche & Audience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'حوزه تخصصی (Niche)' : 'Niche'}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-amber-400 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'مخاطب هدف' : 'Target Audience'}
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-amber-400 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Slide Count & Generation Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:opacity-95 transition-all shadow-md shadow-amber-950/20 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isFa ? 'در حال طراحی اسلایدها...' : 'Designing Slide Deck...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{isFa ? 'تولید کامل اسلایدها و کپشن' : 'Generate Carousel Blueprint'}</span>
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

      {/* Generated Carousel Results */}
      {carouselData && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-500 tracking-wider">
                {isFa ? 'طرح اسلایدی کامل' : 'Carousel Deck Blueprint'}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {carouselData.title}
              </h3>
            </div>

            <div className={`px-3 py-1 rounded-lg border text-xs font-semibold ${
              isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {carouselData.slides.length} {isFa ? 'اسلاید آماده' : 'Slides Designed'}
            </div>
          </div>

          {/* Design Advice Banner */}
          {carouselData.designAdvice && (
            <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Palette className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className={`font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {isFa ? 'توصیه گرافیکی و چیدمان متن:' : 'Typography & Visual Design Rules:'}
                </span>
                <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{carouselData.designAdvice}</p>
              </div>
            </div>
          )}

          {/* Slide Navigator Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {carouselData.slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  activeSlideIndex === idx
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : isDark
                      ? 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isFa ? `اسلاید ${s.slideNumber}` : `Slide ${s.slideNumber}`} ({s.type})
              </button>
            ))}
          </div>

          {/* Active Slide Spotlight */}
          {carouselData.slides[activeSlideIndex] && (
            <div className={`rounded-xl border p-5 space-y-3 ${
              isDark 
                ? 'border-amber-500/40 bg-slate-950' 
                : 'border-amber-300 bg-amber-50/40 shadow-xs'
            }`}>
              <div className={`flex items-center justify-between text-xs pb-2 border-b ${
                isDark ? 'border-slate-800' : 'border-amber-200'
              }`}>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {isFa ? `اسلاید شماره ${carouselData.slides[activeSlideIndex].slideNumber}` : `Slide #${carouselData.slides[activeSlideIndex].slideNumber}`}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                  isDark ? 'bg-slate-900 text-slate-400' : 'bg-white border border-amber-200 text-slate-600'
                }`}>
                  Type: {carouselData.slides[activeSlideIndex].type}
                </span>
              </div>

              <div>
                <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isFa ? 'تیتر اصلی اسلاید (Headline):' : 'Slide Headline:'}
                </span>
                <h4 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {carouselData.slides[activeSlideIndex].headline}
                </h4>
              </div>

              <div>
                <span className={`text-xs block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isFa ? 'متن توضیحی / زیرتیتر:' : 'Body / Subtext:'}
                </span>
                <p className={`text-sm whitespace-pre-line leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  {carouselData.slides[activeSlideIndex].subtext}
                </p>
              </div>

              {carouselData.slides[activeSlideIndex].visualNote && (
                <div className={`p-2.5 rounded-lg border text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-amber-200 text-slate-700'
                }`}>
                  <span className={`font-semibold block mb-0.5 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                    💡 {isFa ? 'ایده بصری و طراحی:' : 'Visual Cue / Illustration:'}
                  </span>
                  {carouselData.slides[activeSlideIndex].visualNote}
                </div>
              )}
            </div>
          )}

          {/* Companion Caption */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'کپشن اختصاصی کاروسل:' : 'Companion Caption:'}
              </span>
              <button
                onClick={() => copyToClipboard(carouselData.caption, 'caption')}
                className={`flex items-center gap-1 text-[11px] ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {copiedType === 'caption' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{isFa ? 'کپی کپشن' : 'Copy'}</span>
              </button>
            </div>
            <p className={`whitespace-pre-line leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {carouselData.caption}
            </p>
            <div className="pt-2 text-amber-500 text-[11px] flex flex-wrap gap-1 font-semibold">
              {carouselData.hashtags.map((h, i) => (
                <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => copyToClipboard(getFullSlidesText(), 'full')}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copiedType === 'full' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isFa ? 'کپی متن تمام اسلایدها' : 'Copy Full Slide Deck'}</span>
            </button>

            <button
              onClick={() => onSendToHumanizer(carouselData.caption)}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30' 
                  : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 shadow-xs'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isFa ? 'ارسال کپشن به انسانی‌ساز لحن' : 'Polish in Humanizer'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
