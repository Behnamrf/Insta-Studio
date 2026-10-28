import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
} from 'lucide-react';
import { Language, AuditData } from '../types/instagram';
import { useTheme } from '../context/ThemeContext';

interface AuditStudioProps {
  language: Language;
}

export const AuditStudio: React.FC<AuditStudioProps> = ({ language }) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const sampleBioEn = `Helping creators grow 🚀\nDM for collabs 📩\nNew video every Tuesday\nCheck out my link 👇\nlinktr.ee/mycreator`;
  const sampleBioFa = `آموزش اینستاگرام و رشد پیج 📈\nپاسخگویی در دایرکت 📥\nپست‌های جدید هر هفته\nبرای مشاوره کلیک کنید 👇\nzil.ink/myprofile`;

  const [auditText, setAuditText] = useState(isFa ? sampleBioFa : sampleBioEn);
  const [niche, setNiche] = useState(isFa ? 'آموزش و بیزینس آنلاین' : 'Creator Growth & Coaching');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditData | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAudit = async () => {
    if (!auditText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'audit',
          topic: auditText,
          existingText: auditText,
          niche,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setAuditResult(resData.data);
      }
    } catch (err) {
      console.error('Error running audit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Form */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'آنالایزر بیو و پست‌های اینستاگرام (آدیت تخصصی)' : 'Profile Bio & Content Audit Studio'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت‌های /ig-profile و /ig-audit' : 'Powered by /ig-profile & /ig-audit skills'}
          </span>
        </div>

        {/* Audit Input Textarea */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'متن بیوگرافی پیج یا پیش‌نویس پست برای آنالیز:' : 'Instagram Bio or Post Caption to Audit:'}
          </label>
          <textarea
            rows={5}
            value={auditText}
            onChange={(e) => setAuditText(e.target.value)}
            className={`w-full rounded-xl border p-3.5 text-sm focus:border-emerald-400 focus:outline-none leading-relaxed font-sans ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Niche Input */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'حوزه فعالیت پیج (Niche):' : 'Profile Niche:'}
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-emerald-400 focus:outline-none ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white' 
                : 'border-slate-200 bg-slate-50 text-slate-900'
            }`}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleAudit}
          disabled={isLoading || !auditText.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:opacity-95 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isFa ? 'در حال ارزیابی تخصصی...' : 'Running Profile Audit...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>{isFa ? 'آنالیز حرفه‌ای و دریافت بازنویسی بهینه' : 'Audit Content & Generate High-Conversion Rewrites'}</span>
            </>
          )}
        </button>

      </div>

      {/* Audit Report Results */}
      {auditResult && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          {/* Header Grade & Score Breakdown */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-wider block">
                {isFa ? 'نتیجه آدیت اینستاگرام' : 'Audit Evaluation Results'}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'گرید کلی و تحلیل عملکرد:' : 'Overall Profile Assessment:'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className={`px-3.5 py-1.5 rounded-xl border font-extrabold text-base font-mono ${
                isDark 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                {auditResult.overallGrade}
              </div>
            </div>
          </div>

          {/* Metric Bar Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFa ? 'قدرت قلاب' : 'Hook Strength'}
              </span>
              <span className="text-lg font-bold font-mono text-pink-500">
                {auditResult.scores.hook}%
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFa ? 'وضوح ارزش' : 'Value Clarity'}
              </span>
              <span className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">
                {auditResult.scores.clarity}%
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFa ? 'اثربخشی CTA' : 'CTA Efficiency'}
              </span>
              <span className="text-lg font-bold font-mono text-amber-500">
                {auditResult.scores.cta}%
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFa ? 'حفظ مخاطب' : 'Retention Rate'}
              </span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {auditResult.scores.retention}%
              </span>
            </div>
          </div>

          {/* Strengths & Weaknesses Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className={`rounded-xl border p-4 space-y-2 ${
              isDark ? 'border-emerald-500/20 bg-slate-950' : 'border-emerald-200 bg-emerald-50/30'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b ${
                isDark ? 'text-emerald-400 border-slate-800' : 'text-emerald-800 border-emerald-200'
              }`}>
                <CheckCircle2 className="h-4 w-4" />
                <span>{isFa ? 'نقاط قوت شناسایی شده:' : 'Identified Strengths:'}</span>
              </div>
              <ul className={`list-disc list-inside space-y-1.5 text-xs leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}>
                {auditResult.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className={`rounded-xl border p-4 space-y-2 ${
              isDark ? 'border-rose-500/20 bg-slate-950' : 'border-rose-200 bg-rose-50/30'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b ${
                isDark ? 'text-rose-400 border-slate-800' : 'text-rose-800 border-rose-200'
              }`}>
                <AlertCircle className="h-4 w-4" />
                <span>{isFa ? 'نقاط ضعف و فرصت‌های از دست رفته:' : 'Identified Leaks & Bottlenecks:'}</span>
              </div>
              <ul className={`list-disc list-inside space-y-1.5 text-xs leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-800'
              }`}>
                {auditResult.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Recommended Rewrites */}
          <div className="space-y-3 pt-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'پیشنهاد بازنویسی با نرخ تبدیل بالا:' : 'High-Conversion Rewrites:'}
            </h4>

            {auditResult.recommendedRewrites.map((rw, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 space-y-2 ${
                  isDark ? 'border-emerald-500/40 bg-slate-950' : 'border-emerald-200 bg-white shadow-xs'
                }`}
              >
                <div className={`flex items-center justify-between text-xs pb-1 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{rw.label}</span>
                  <button
                    onClick={() => copyRewrite(rw.text, idx)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{isFa ? 'کپی بازنویسی' : 'Copy'}</span>
                  </button>
                </div>
                <p className={`text-sm font-medium whitespace-pre-line leading-relaxed font-sans ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {rw.text}
                </p>
              </div>
            ))}
          </div>

          {/* Action Checklist */}
          {auditResult.actionChecklist && auditResult.actionChecklist.length > 0 && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                {isFa ? 'چک‌لیست فوری اقدامات پیشنهادی:' : 'Immediate Action Plan:'}
              </span>
              <ul className={`space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {auditResult.actionChecklist.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
