import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneMockup } from './components/PhoneMockup';
import { ReelStudio } from './components/ReelStudio';
import { CarouselStudio } from './components/CarouselStudio';
import { CaptionStudio } from './components/CaptionStudio';
import { HumanizerStudio } from './components/HumanizerStudio';
import { HookCatalog } from './components/HookCatalog';
import { AuditStudio } from './components/AuditStudio';
import { StrategySprint } from './components/StrategySprint';
import { useTheme } from './context/ThemeContext';
import { 
  Language, 
  StudioTab, 
  ReelScriptData, 
  CarouselData, 
  CaptionVariation, 
  HookFormula 
} from './types/instagram';
import { Sparkles } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme, isDark } = useTheme();

  // Language state (Persian default based on user request)
  const [language, setLanguage] = useState<Language>('fa');
  const [activeTab, setActiveTab] = useState<StudioTab>('reel');

  // Shared Data States for Live Phone Mockup
  const [activeReel, setActiveReel] = useState<ReelScriptData | null>(null);
  const [activeCarousel, setActiveCarousel] = useState<CarouselData | null>(null);
  const [activeCaption, setActiveCaption] = useState<CaptionVariation | null>(null);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([
    '#instagramgrowth', '#contentcreator', '#viralreels', '#reeltips'
  ]);

  // Transition state for Hook -> Reel and Script -> Humanizer
  const [reelTopicOverride, setReelTopicOverride] = useState<string>('');
  const [reelHookIdOverride, setReelHookIdOverride] = useState<string>('negative-frame');
  const [humanizerTextOverride, setHumanizerTextOverride] = useState<string>('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isFa = language === 'fa';

  // Apply RTL/LTR document direction dynamically
  useEffect(() => {
    document.documentElement.dir = isFa ? 'rtl' : 'ltr';
    document.documentElement.lang = isFa ? 'fa' : 'en';
  }, [isFa]);

  // Handlers for cross-studio transitions
  const handleUseHookInReel = (hook: HookFormula) => {
    setReelHookIdOverride(hook.id);
    setActiveTab('reel');
    showToast(isFa ? `فرمول #${hook.number} برای ریلز انتخاب شد` : `Formula #${hook.number} loaded in Reel Studio`);
  };

  const handleSendToHumanizer = (text: string) => {
    setHumanizerTextOverride(text);
    setActiveTab('humanizer');
    showToast(isFa ? 'متن به انسانی‌ساز لحن منتقل شد' : 'Text sent to AI Humanizer');
  };

  const handleNewDraft = () => {
    setActiveReel(null);
    setActiveCarousel(null);
    setActiveCaption(null);
    setReelTopicOverride('');
    setHumanizerTextOverride('');
    showToast(isFa ? 'پیش‌نویس جدید ایجاد شد' : 'Fresh draft workspace cleared');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    } ${isFa ? 'text-right' : 'text-left'}`}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewDraft={handleNewDraft}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-pink-500/50 text-white text-xs font-semibold shadow-xl shadow-black/60 animate-bounce">
            <Sparkles className="h-4 w-4 text-pink-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Active Studio Generator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {activeTab === 'reel' && (
              <ReelStudio
                language={language}
                onScriptGenerated={(script) => {
                  setActiveReel(script);
                  showToast(isFa ? 'سناریوی ریلز در قاب گوشی بارگذاری شد' : 'Reel loaded in phone preview');
                }}
                onSendToHumanizer={handleSendToHumanizer}
                initialTopic={reelTopicOverride}
                initialHookId={reelHookIdOverride}
              />
            )}

            {activeTab === 'carousel' && (
              <CarouselStudio
                language={language}
                onCarouselGenerated={(data) => {
                  setActiveCarousel(data);
                  showToast(isFa ? 'اسلایدهای کاروسل در قاب گوشی بارگذاری شد' : 'Carousel loaded in phone preview');
                }}
                onSendToHumanizer={handleSendToHumanizer}
              />
            )}

            {activeTab === 'caption' && (
              <CaptionStudio
                language={language}
                onSelectVariation={(variation, hashtags) => {
                  setActiveCaption(variation);
                  setSelectedHashtags(hashtags);
                  showToast(isFa ? 'کپشن در پیش‌نمایش پست اعمال شد' : 'Caption updated in post preview');
                }}
                onSendToHumanizer={handleSendToHumanizer}
              />
            )}

            {activeTab === 'humanizer' && (
              <HumanizerStudio
                language={language}
                initialText={humanizerTextOverride}
                onTextHumanized={(_humanizedText) => {
                  showToast(isFa ? 'متن با لحن طبیعی آماده استفاده شد' : 'Humanized copy ready');
                }}
              />
            )}

            {activeTab === 'hooks' && (
              <HookCatalog
                language={language}
                onUseHookInReel={handleUseHookInReel}
              />
            )}

            {activeTab === 'audit' && (
              <AuditStudio
                language={language}
              />
            )}

            {activeTab === 'strategy' && (
              <StrategySprint
                language={language}
              />
            )}

          </div>

          {/* Right Panel: Sticky Live Instagram Phone Mockup (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-sm transition-colors ${
              isDark 
                ? 'border-slate-800 bg-slate-900/30' 
                : 'border-slate-200 bg-white/80 shadow-sm'
            }`}>
              <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {isFa ? 'پیش‌نمایش زنده در قاب اینستاگرام' : 'Live Instagram Phone Preview'}
                </span>
                <span className="text-[10px] text-pink-500 font-mono">
                  {isFa ? 'همگام با ویرایشگر' : 'Real-Time Sync'}
                </span>
              </div>

              <PhoneMockup
                language={language}
                theme={theme}
                activeTab={activeTab}
                reelData={activeReel}
                carouselData={activeCarousel}
                captionData={activeCaption}
                selectedHashtags={selectedHashtags}
              />
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className={`w-full border-t py-6 mt-12 text-xs text-center transition-colors ${
        isDark 
          ? 'border-slate-800/80 bg-slate-950 text-slate-500' 
          : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {isFa 
              ? 'استودیوی هوشمند تولید محتوای اینستاگرام · بر پایه چارچوب متن‌باز Jake Schincariol'
              : 'Instagram Agent Studio · Ported from Jake Schincariol\'s 13 Instagram Agent Skills'}
          </p>
          <div className={`flex items-center gap-4 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            <span>26 Viral Hook Formulas</span>
            <span>·</span>
            <span>AI Humanizer</span>
            <span>·</span>
            <span>Light & Dark Modes</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
