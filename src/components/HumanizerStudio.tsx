import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert
} from 'lucide-react';
import { Language, HumanizerData } from '../types/instagram';
import { useTheme } from '../context/ThemeContext';

interface HumanizerStudioProps {
  language: Language;
  initialText?: string;
  onTextHumanized?: (text: string) => void;
}

export const HumanizerStudio: React.FC<HumanizerStudioProps> = ({
  language,
  initialText = '',
  onTextHumanized,
}) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const sampleEn = `In today's fast-paced digital landscape, mastering Instagram is a true game-changer that delves deep into unlocking audience engagement. It is a testament to the transformative power of content creation, enabling creators to seamlessly harness their potential and elevate their personal brand. Furthermore, it is crucial to understand that navigating this dynamic realm requires pivotal strategic shifts.`;

  const sampleFa = `در دنیای پرشتاب امروز، اینستاگرام بستری بی‌نظیر و حائز اهمیت برای ارتقای کسب‌وکارها فراهم نموده است. شایان ذکر است که تولید محتوا نقش بسزایی در تحولی شگرف و دستیابی به مخاطبان ایفا می‌کند و بی‌شک هر فردی با بهره‌گیری از این فضا می‌تواند دستخوش تغییرات بنیادین گردد.`;

  const [inputText, setInputText] = useState(initialText || (isFa ? sampleFa : sampleEn));
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HumanizerData | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync if initialText changes from parent
  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Client-side quick detector for banned clichés
  const BANNED_PATTERNS = isFa ? [
    'در دنیای پرشتاب امروز', 'بستری بی‌نظیر', 'نقش بسزایی', 'شایان ذکر است', 
    'حائز اهمیت', 'تحولی شگرف', 'بی‌شک', 'دستخوش تغییر', 'فراهم نموده است'
  ] : [
    'in today\'s fast-paced', 'digital landscape', 'game-changer', 'delve', 'delves',
    'testament', 'seamlessly', 'unleash', 'unlock', 'harness', 'crucial', 'pivotal',
    'furthermore', 'elevate', 'realm'
  ];

  const detectedLiveClichés = BANNED_PATTERNS.filter(word => 
    inputText.toLowerCase().includes(word.toLowerCase())
  );

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'humanizer',
          topic: inputText,
          existingText: inputText,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        if (onTextHumanized) {
          onTextHumanized(resData.data.humanizedText);
        }
      }
    } catch (err) {
      console.error('Error humanizing text:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyHumanized = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'انسانی‌ساز لحن اینستاگرام (حذف کلمات رباتیک و کلیشه‌های هوش مصنوعی)' : 'AI Copy Humanizer & Tone Polisher'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت /ig-human' : 'Powered by /ig-human skill'}
          </span>
        </div>

        {/* Text Input Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'متن خروجی هوش مصنوعی یا پیش‌نویس اولیه:' : 'Paste AI Generated Draft or Rough Copy:'}
            </label>
            <button
              onClick={() => setInputText(isFa ? sampleFa : sampleEn)}
              className="text-[11px] text-pink-500 hover:text-pink-600 underline font-medium"
            >
              {isFa ? 'بارگذاری متن نمونه رباتیک' : 'Load Robotic AI Sample'}
            </button>
          </div>
          
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isFa ? 'متن خود را اینجا پیست کنید تا لحن رباتیک آن حذف شود...' : 'Paste your AI drafted text to strip buzzwords and robotic phrasing...'}
            className={`w-full rounded-xl border p-3.5 text-sm focus:border-pink-500 focus:outline-none leading-relaxed font-sans ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Live Cliché Warning Indicator */}
        {detectedLiveClichés.length > 0 && (
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>
                {isFa ? `شناسایی ${detectedLiveClichés.length} عبارت کلیشه‌ای هوش مصنوعی:` : `Detected ${detectedLiveClichés.length} Robotic AI Clichés:`}
              </span>
            </div>
            <div className={`flex flex-wrap gap-1 text-[11px] ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
              {detectedLiveClichés.map((c, i) => (
                <span key={i} className={`px-2 py-0.5 rounded border line-through ${
                  isDark ? 'bg-rose-950/80 border-rose-800/80' : 'bg-white border-rose-200 text-rose-800'
                }`}>
                  "{c}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Humanize Trigger */}
        <button
          onClick={handleHumanize}
          disabled={isLoading || !inputText.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 transition-all shadow-md shadow-rose-950/20 disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isFa ? 'در حال تبدیل به لحن طبیعی انسانی...' : 'Transforming into Natural Human Voice...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>{isFa ? 'انسانی‌سازی و رفع کامل لحن رباتیک' : 'Humanize & Strip AI Patterns'}</span>
            </>
          )}
        </button>

      </div>

      {/* Results Comparison View */}
      {result && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          {/* Score Comparison Gauge Bar */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-pink-500 tracking-wider block">
                {isFa ? 'شاخص اصالت و لحن انسانی' : 'Human Authenticity Metric'}
              </span>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'ارتقای چشمگیر حس ارتباط با مخاطب' : 'Readability & Conversational Lift'}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">{isFa ? 'قبل' : 'Before'}</span>
                <span className="text-sm font-bold text-rose-500 font-mono">{result.originalScore}%</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">{isFa ? 'بعد (طبیعی)' : 'After'}</span>
                <span className="text-base font-extrabold text-emerald-500 font-mono">{result.humanizedScore}%</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Before (Original AI) */}
            <div className={`rounded-xl border p-4 space-y-2 opacity-80 ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100/70'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold text-rose-500 pb-1 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{isFa ? 'نسخه اولیه (رباتیک و کتابی)' : 'Original (AI Robotic / Stiff)'}</span>
              </div>
              <p className={`text-xs leading-relaxed font-sans whitespace-pre-line ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {inputText}
              </p>
            </div>

            {/* After (Humanized) */}
            <div className={`rounded-xl border p-4 space-y-2 shadow-xs ${
              isDark ? 'border-emerald-500/40 bg-slate-950' : 'border-emerald-300 bg-emerald-50/40'
            }`}>
              <div className={`flex items-center justify-between pb-1 border-b ${
                isDark ? 'border-slate-800' : 'border-emerald-200'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isFa ? 'نسخه صمیمی، ضربی و انسانی' : 'Humanized & Punchy'}</span>
                </div>
                <button
                  onClick={copyHumanized}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{isFa ? 'کپی متن' : 'Copy'}</span>
                </button>
              </div>
              <p className={`text-sm font-medium leading-relaxed font-sans whitespace-pre-line ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {result.humanizedText}
              </p>
            </div>

          </div>

          {/* What Was Changed Breakdown */}
          {result.explanationOfChanges && result.explanationOfChanges.length > 0 && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                {isFa ? 'تغییرات اعمال شده در ساختار متن:' : 'Architectural Adjustments Applied:'}
              </span>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {result.explanationOfChanges.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
