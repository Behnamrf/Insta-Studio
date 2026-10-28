import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music2, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Clapperboard, 
  FileText,
  Eye,
  Check,
  Copy
} from 'lucide-react';
import { Language, Theme, ReelScriptData, CarouselData, CaptionVariation } from '../types/instagram';

interface PhoneMockupProps {
  language: Language;
  theme?: Theme;
  activeTab: string;
  reelData: ReelScriptData | null;
  carouselData: CarouselData | null;
  captionData: CaptionVariation | null;
  selectedHashtags: string[];
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  language,
  theme = 'dark',
  activeTab,
  reelData,
  carouselData,
  captionData,
  selectedHashtags
}) => {
  const isFa = language === 'fa';
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'reel' | 'carousel' | 'feed'>(
    activeTab === 'carousel' ? 'carousel' : 'reel'
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync default view mode with studio tab
  React.useEffect(() => {
    if (activeTab === 'carousel') setViewMode('carousel');
    else if (activeTab === 'reel' || activeTab === 'hooks') setViewMode('reel');
    else if (activeTab === 'caption' || activeTab === 'humanizer') setViewMode('feed');
  }, [activeTab]);

  const slides = carouselData?.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    slideNumber: 1,
    type: 'Hook',
    headline: isFa ? 'رازهایی که درباره اینستاگرام بهت نمیگن' : 'The Truth About Instagram Algorithms',
    subtext: isFa ? 'ورق بزن تا نقشه راه واقعی رو ببینی ➡️' : 'Swipe to see the full breakdown ➡️',
    visualNote: ''
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const copyLiveCaption = () => {
    let textToCopy = '';
    if (viewMode === 'reel' && reelData) {
      textToCopy = `${reelData.caption}\n\n${reelData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
    } else if (viewMode === 'carousel' && carouselData) {
      textToCopy = `${carouselData.caption}\n\n${carouselData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
    } else if (captionData) {
      textToCopy = `${captionData.hookLine}\n\n${captionData.body}\n\n${captionData.cta}\n\n${selectedHashtags.join(' ')}`;
    }
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      
      {/* View Mode & Safe Zone Selector Toolbar */}
      <div className="flex items-center justify-between w-full mb-3 px-1 text-xs">
        <div className={`flex items-center gap-1 p-1 border rounded-lg ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setViewMode('reel')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'reel' 
                ? isDark 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : 'bg-white text-slate-900 font-semibold shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clapperboard className="h-3 w-3 text-pink-400" />
            <span>{isFa ? 'ریلز' : 'Reel'}</span>
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'carousel' 
                ? isDark 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : 'bg-white text-slate-900 font-semibold shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3 w-3 text-amber-400" />
            <span>{isFa ? 'اسلایدی' : 'Carousel'}</span>
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'feed' 
                ? isDark 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : 'bg-white text-slate-900 font-semibold shadow-xs'
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3 w-3 text-sky-400" />
            <span>{isFa ? 'فید پست' : 'Post'}</span>
          </button>
        </div>

        <button
          onClick={() => setShowSafeZones(!showSafeZones)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
            showSafeZones
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isFa ? 'نمایش محدوده امن برای قرارگیری متن' : 'Toggle Instagram UI Safe Zones'}
        >
          <Eye className="h-3 w-3" />
          <span>{isFa ? 'حاشیه امن' : 'Safe Zones'}</span>
        </button>
      </div>

      {/* Realistic Phone Enclosure */}
      <div className="relative w-full aspect-[9/18.5] max-h-[640px] rounded-[44px] bg-slate-900 p-3 shadow-2xl shadow-black/80 border-4 border-slate-700/80 ring-1 ring-white/10 select-none">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-5 w-24 bg-black rounded-full z-30 flex items-center justify-between px-2">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
        </div>

        {/* Screen Container */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black text-white flex flex-col font-sans">
          
          {/* Status Bar */}
          <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-medium text-white/90 z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="h-2.5 w-5 rounded-sm border border-white/60 p-0.5 flex items-center">
                <div className="h-full w-full bg-white rounded-xs" />
              </div>
            </div>
          </div>

          {/* Safe Zone Visual Overlays (if enabled) */}
          {showSafeZones && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <div className="h-20 bg-rose-500/20 border-b border-dashed border-rose-400 flex items-end justify-center pb-1">
                <span className="text-[10px] text-rose-200 font-mono">⚠️ Top Danger Zone (UI Header)</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-rose-500/20 border-t border-dashed border-rose-400 flex items-start justify-center pt-1">
                <span className="text-[10px] text-rose-200 font-mono">⚠️ Bottom Danger Zone (Caption & Buttons)</span>
              </div>
              <div className="absolute right-0 top-20 bottom-40 w-16 bg-amber-500/15 border-l border-dashed border-amber-400 flex items-center justify-center">
                <span className="text-[9px] text-amber-200 font-mono -rotate-90">Side Bar</span>
              </div>
            </div>
          )}

          {/* View Content: Reel Player View */}
          {viewMode === 'reel' && (
            <div className="relative flex-1 flex flex-col justify-between p-4 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/40">
              
              {/* Background Ambient Visual Graphic */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(244,63,94,0.3),transparent_70%)]" />

              {/* Reel Header */}
              <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-white/90 pt-1">
                <span>Reels</span>
                <Clapperboard className="h-4 w-4" />
              </div>

              {/* Center Staged Hook & Visual */}
              <div className="relative z-10 my-auto text-center px-4 py-6">
                <div className="inline-block px-3 py-1 mb-3 text-[11px] font-semibold bg-white/20 backdrop-blur-md rounded-full text-white uppercase tracking-wider">
                  {reelData?.segments?.[0]?.stage || (isFa ? 'هوک ۳ ثانیه‌ای' : '3-Second Hook')}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-md text-balance leading-snug">
                  {reelData?.hook || (isFa ? 'دیگه این اشتباه رو توی پیجت تکرار نکن!' : 'Stop making this mistake if you want to grow!')}
                </h3>
                {reelData?.segments?.[0]?.textOverlay && (
                  <p className="mt-3 text-xs font-medium text-amber-300 bg-black/60 px-2.5 py-1 rounded-md inline-block">
                    {reelData.segments[0].textOverlay}
                  </p>
                )}
              </div>

              {/* Side Floating Actions (Likes, Comments, Shares, Audio) */}
              <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4 text-white text-xs">
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className="flex flex-col items-center gap-1 focus:outline-none"
                >
                  <Heart className={`h-6 w-6 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  <span className="text-[10px] font-mono">14.2k</span>
                </button>
                <button className="flex flex-col items-center gap-1 focus:outline-none">
                  <MessageCircle className="h-6 w-6 text-white" />
                  <span className="text-[10px] font-mono">382</span>
                </button>
                <button className="flex flex-col items-center gap-1 focus:outline-none">
                  <Send className="h-6 w-6 text-white" />
                  <span className="text-[10px] font-mono">1.1k</span>
                </button>
                <button 
                  onClick={() => setIsSaved(!isSaved)} 
                  className="flex flex-col items-center gap-1 focus:outline-none"
                >
                  <Bookmark className={`h-6 w-6 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                  <span className="text-[10px] font-mono">2.8k</span>
                </button>
                <div className="h-7 w-7 rounded-full border-2 border-white/60 overflow-hidden bg-slate-800 animate-spin [animation-duration:8s] flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-pink-500" />
                </div>
              </div>

              {/* Bottom Creator Info & Caption Bar */}
              <div className="relative z-10 pr-14 pb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5 shrink-0">
                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold">
                      IG
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white">your.creator.handle</span>
                  <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/40 text-white">
                    {isFa ? 'دنبال کردن' : 'Follow'}
                  </button>
                </div>

                {/* Caption Snippet with Expand */}
                <div className="text-[11px] leading-relaxed text-white/90">
                  <p className={isCaptionExpanded ? '' : 'line-clamp-2'}>
                    {reelData?.caption || (isFa 
                      ? 'اولین ۳ ثانیه ریلز آینده محتوای تو رو تعیین می‌کنه. این پست رو سیو کن که موقع ضبط بعدی یادت نره!'
                      : 'The first 3 seconds of your Reel decide 80% of its reach. Stop burying the lead! Save this now.'
                    )}
                  </p>
                  <button 
                    onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                    className="text-[10px] text-white/60 hover:text-white mt-0.5 font-medium"
                  >
                    {isCaptionExpanded ? (isFa ? 'بستن' : 'less') : (isFa ? 'بیشتر...' : '...more')}
                  </button>
                </div>

                {/* Audio Track Ticker */}
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/80">
                  <Music2 className="h-3 w-3 animate-pulse text-pink-400" />
                  <span className="truncate max-w-[180px]">
                    {reelData?.audioVibe || 'Trending Creator Audio · Original Sound'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* View Content: Carousel Deck View */}
          {viewMode === 'carousel' && (
            <div className="relative flex-1 flex flex-col justify-between p-4 bg-slate-950 overflow-hidden">
              
              {/* Carousel Header & Counter */}
              <div className="flex items-center justify-between text-xs text-white/80 pb-2 border-b border-white/10">
                <span className="font-semibold text-slate-300">
                  {currentSlide.type} {isFa ? 'اسلاید' : 'Slide'}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 bg-white/10 rounded-full">
                  {currentSlideIndex + 1} / {slides.length || 1}
                </span>
              </div>

              {/* Current Slide Display Canvas */}
              <div className="my-auto py-6 px-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 text-center relative shadow-lg">
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-2">
                  {currentSlide.type}
                </span>
                <h4 className="text-lg font-bold text-white mb-3 text-balance leading-snug">
                  {currentSlide.headline}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed text-balance">
                  {currentSlide.subtext}
                </p>

                {currentSlide.visualNote && (
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                    💡 <span className="italic">{currentSlide.visualNote}</span>
                  </div>
                )}
              </div>

              {/* Slide Navigation Buttons & Dots */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded-full bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-1">
                  {slides.slice(0, 8).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlideIndex
                          ? 'w-4 bg-pink-500'
                          : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex >= slides.length - 1}
                  className="p-1.5 rounded-full bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Save Trigger */}
              <div className="text-center pt-2 text-[10px] text-slate-400">
                {isFa ? 'برای دیدن اسلایدها ورق بزنید' : 'Swipe for next key insight'}
              </div>

            </div>
          )}

          {/* View Content: Feed Post View */}
          {viewMode === 'feed' && (
            <div className="relative flex-1 flex flex-col justify-between p-3 overflow-y-auto bg-slate-950">
              
              {/* Post Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5">
                    <div className="h-full w-full rounded-full bg-slate-900" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-white">your.creator.handle</span>
                    <span className="text-[10px] text-slate-400 block">{isFa ? 'ایران' : 'Global'}</span>
                  </div>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </div>

              {/* Media Graphic Card */}
              <div className="my-2 aspect-square w-full rounded-xl bg-gradient-to-tr from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[10px] font-mono text-pink-400 mb-2">INSTAGRAM SEO POST</span>
                <p className="text-sm font-bold text-white text-balance">
                  {captionData?.hookLine || (isFa ? '۳ اصل طلایی برای رشد تضمینی در سال ۲۰۲۶' : 'The 3 Golden Rules of Retention in 2026')}
                </p>
              </div>

              {/* Post Action Icons */}
              <div className="flex items-center justify-between py-1 text-white">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <MessageCircle className="h-5 w-5" />
                  <Send className="h-5 w-5" />
                </div>
                <Bookmark className="h-5 w-5" />
              </div>

              {/* Caption Text & Hashtags */}
              <div className="text-[11px] leading-relaxed text-slate-200 mt-1">
                <p className="font-semibold text-white mb-0.5">
                  {captionData?.hookLine || (isFa ? 'راستش رو بگم؟ اولش باور نمی‌کردم...' : 'Honestly? I didn\'t believe it at first...')}
                </p>
                <p className="text-slate-300">
                  {captionData?.body || (isFa ? 'برای رشد واقعی باید روی ارزش پایدار تمرکز کنید نه ترندهای زودگذر.' : 'Focus on sustained retention and actionable clarity over empty hype.')}
                </p>
                <p className="mt-1 font-medium text-pink-400">
                  {captionData?.cta || (isFa ? 'این پست رو سیو کن و نظرت رو بنویس 👇' : 'Save this for your next batch filming day 👇')}
                </p>
                <div className="mt-2 text-[10px] text-sky-400 flex flex-wrap gap-1">
                  {selectedHashtags.slice(0, 6).map((tag, i) => (
                    <span key={i}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Copy Live Post Button */}
      <button
        onClick={copyLiveCaption}
        className={`mt-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400">{isFa ? 'کپشن کپی شد!' : 'Caption Copied!'}</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>{isFa ? 'کپی متن کپشن و هشتگ‌ها' : 'Copy Caption & Hashtags'}</span>
          </>
        )}
      </button>

    </div>
  );
};
