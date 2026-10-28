import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Copy, 
  Check, 
} from 'lucide-react';
import { Language, StrategyData } from '../types/instagram';
import { useTheme } from '../context/ThemeContext';

interface StrategySprintProps {
  language: Language;
}

export const StrategySprint: React.FC<StrategySprintProps> = ({ language }) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const [topic, setTopic] = useState(
    isFa ? 'برنامه رشد پیج بیزینس خدمات آنلاین و مشاوره' : 'Scale online coaching business to 10k engaged followers'
  );
  const [niche, setNiche] = useState(isFa ? 'خدمات، کوچینگ و آموزش' : 'Online Coaching & Creator Agency');
  const [audience, setAudience] = useState(isFa ? 'مشتریان بالقوه و صاحبان کسب‌وکار' : 'Solopreneurs & agency founders');
  const [goal, setGoal] = useState(isFa ? 'افزایش لید و پیام در دایرکت' : 'Inbound DMs & Qualified Leads');

  const [isLoading, setIsLoading] = useState(false);
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'strategy',
          topic,
          niche,
          targetAudience: audience,
          goal,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setStrategyData(resData.data);
      }
    } catch (err) {
      console.error('Error generating strategy:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyStrategyText = () => {
    if (!strategyData) return;
    const days = strategyData.schedule
      .map(s => `${s.day} [${s.format}]: ${s.title}\nHook: "${s.hook}"\nGoal: ${s.goal}`)
      .join('\n\n');
    const text = `STRATEGY OVERVIEW: ${strategyData.strategySummary}\n\nPILLARS: ${strategyData.contentPillars.join(' · ')}\n\nWEEKLY SPRINT:\n${days}\n\nWEEKLY GOAL: ${strategyData.weeklyGrowthGoal}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Parameters Form */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'اسپرینت استراتژی و تقویم محتوای ۷ روزه' : '7-Day Content Sprint & Strategy Engine'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت‌های /ig-strategy و /ig-calendar' : 'Powered by /ig-strategy & /ig-calendar skills'}
          </span>
        </div>

        {/* Topic Input */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'محور اصلی یا کمپین هفته:' : 'Sprint Campaign Focus:'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-purple-400 focus:outline-none ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Niche & Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFa ? 'حوزه تخصصی' : 'Niche'}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFa ? 'مخاطب هدف' : 'Target Audience'}
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFa ? 'هدف اصلی هفته' : 'Weekly Goal'}
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-95 transition-all shadow-md shadow-purple-950/20 disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isFa ? 'در حال طراحی تقویم و ستون‌های محتوا...' : 'Formulating 7-Day Content Sprint...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>{isFa ? 'تولید برنامه کامل هفتگی و ستون‌های محتوا' : 'Generate 7-Day Instagram Strategy Sprint'}</span>
            </>
          )}
        </button>

      </div>

      {/* Strategy Results */}
      {strategyData && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-500 tracking-wider block">
                {isFa ? 'برنامه اسپرینت آماده' : '7-Day Editorial Sprint'}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'استراتژی ترکیبی ریلز، اسلایدی و تعاملی:' : 'Multi-Format Instagram Schedule:'}
              </h3>
            </div>

            <button
              onClick={copyStrategyText}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isFa ? 'کپی کل تقویم' : 'Copy Schedule'}</span>
            </button>
          </div>

          {/* Pillars Box */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'ستون‌های اصلی محتوا (Content Pillars):' : 'Core Content Pillars:'}
            </span>
            <div className={`flex flex-wrap items-center gap-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {strategyData.contentPillars.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className={`font-semibold ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>{p}</span>
                </div>
              ))}
            </div>
            <p className={`pt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {strategyData.strategySummary}
            </p>
          </div>

          {/* Schedule 7 Days Cards */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'جدول زمان‌بندی روزبه‌روز:' : 'Daily Schedule & Formats:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strategyData.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 space-y-2 transition-colors ${
                    isDark 
                      ? 'border-slate-800 bg-slate-950 hover:border-slate-700' 
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className={`flex items-center justify-between text-xs pb-1 border-b ${
                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                  }`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.day}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      item.format === 'Reel'
                        ? isDark ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20' : 'bg-pink-50 text-pink-700 border border-pink-200'
                        : item.format === 'Carousel'
                        ? isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        : isDark ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20' : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}>
                      {item.format}
                    </span>
                  </div>

                  <div>
                    <h5 className={`text-xs font-bold mb-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.title}
                    </h5>
                    <p className={`text-[11px] italic mb-1.5 ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
                      "{item.hook}"
                    </p>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] pt-1 border-t ${
                    isDark ? 'border-slate-900 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{isFa ? 'هدف تعامل:' : 'Goal:'}</span>
                    <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{item.goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goal Banner */}
          {strategyData.weeklyGrowthGoal && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              <span className="font-semibold">
                🎯 {isFa ? 'هدف نهایی هفته:' : 'Primary Target:'} {strategyData.weeklyGrowthGoal}
              </span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
