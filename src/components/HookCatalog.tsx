import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Copy, 
  Check, 
  Flame, 
  Zap
} from 'lucide-react';
import { Language, HookFormula } from '../types/instagram';
import { HOOK_FORMULAS } from '../data/hookFormulas';
import { useTheme } from '../context/ThemeContext';

interface HookCatalogProps {
  language: Language;
  onUseHookInReel: (hook: HookFormula) => void;
}

export const HookCatalog: React.FC<HookCatalogProps> = ({
  language,
  onUseHookInReel,
}) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All 26 Formulas', labelFa: 'همه ۲۶ فرمول' },
    { id: 'negative', labelEn: 'Negative Framing', labelFa: 'چارچوب منفی' },
    { id: 'contrarian', labelEn: 'Contrarian Truth', labelFa: 'باور خلاف جهت' },
    { id: 'curiosity', labelEn: 'Curiosity Loops', labelFa: 'حلقه‌های کنجکاوی' },
    { id: 'authority', labelEn: 'Social Proof', labelFa: 'داده و اثبات' },
    { id: 'hack', labelEn: 'Blueprints & Speed', labelFa: 'نقشه راه و میانبر' },
    { id: 'urgency', labelEn: 'Urgency & FOMO', labelFa: 'فوریت و هشدار' },
  ];

  const filteredHooks = HOOK_FORMULAS.filter((hook) => {
    const matchesCategory = selectedCategory === 'all' || hook.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch = 
      hook.name.toLowerCase().includes(query) ||
      hook.nameFa.includes(query) ||
      hook.templateEn.toLowerCase().includes(query) ||
      hook.templateFa.includes(query) ||
      hook.exampleEn.toLowerCase().includes(query) ||
      hook.exampleFa.includes(query) ||
      hook.triggerDescriptionEn.toLowerCase().includes(query) ||
      hook.triggerDescriptionFa.includes(query);

    return matchesCategory && matchesSearch;
  });

  const copyTemplate = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Search Controls */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-4 transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-xs'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-pink-500" />
              <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'کاتالوگ ۲۶ فرمول هوک وایرال (تحلیل روانشناختی)' : 'The 26 Scored Viral Hook Formulas'}
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFa 
                ? 'استخراج شده از محبوب‌ترین استراتژی‌های تولید محتوای اینستاگرام و مهارت‌های جِیک شینکاریول'
                : 'Proven psychological triggers that stop the scroll in under 2 seconds.'}
            </p>
          </div>

          <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border shrink-0 self-start sm:self-auto ${
            isDark 
              ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' 
              : 'text-pink-700 bg-pink-50 border-pink-200 font-semibold'
          }`}>
            {filteredHooks.length} / 26 {isFa ? 'فرمول فعال' : 'Formulas Active'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? 'جستجو بر اساس عنوان فرمول، کلمات کلیدی یا محرک روانی...' : 'Search formula name, keyword, or trigger...'}
            className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Category Filter Pills (Interactive Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? isDark
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDark
                    ? 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {isFa ? cat.labelFa : cat.labelEn}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Hook Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHooks.map((hook) => (
          <div
            key={hook.id}
            className={`rounded-2xl border p-5 space-y-4 transition-all flex flex-col justify-between ${
              isDark 
                ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700' 
                : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
            }`}
          >
            
            {/* Header: Number, Name, Retention Score */}
            <div>
              <div className={`flex items-center justify-between text-xs pb-2 border-b mb-2.5 ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-pink-500">
                    #{hook.number.toString().padStart(2, '0')}
                  </span>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFa ? hook.categoryLabelFa : hook.categoryLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  <Flame className="h-3 w-3 text-emerald-500" />
                  <span>{hook.retentionScore}%</span>
                </div>
              </div>

              {/* Title in both languages */}
              <h3 className={`text-base font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? hook.nameFa : hook.name}
              </h3>
              <span className={`text-[11px] font-mono block mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isFa ? hook.name : hook.nameFa}
              </span>

              {/* Template Box */}
              <div className={`rounded-xl p-3.5 border mb-3 text-xs ${
                isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase tracking-wider block font-semibold mb-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  {isFa ? 'قالب استاندارد فرمول:' : 'Formula Template:'}
                </span>
                <p className={`font-semibold leading-relaxed font-sans ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
                  "{isFa ? hook.templateFa : hook.templateEn}"
                </p>
              </div>

              {/* Real-World Example */}
              <div className={`text-xs mb-3 space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-[10px] uppercase tracking-wider block font-semibold text-slate-500">
                  {isFa ? 'نمونه واقعی اجرا شده:' : 'Real-World Example:'}
                </span>
                <p className="italic">
                  "{isFa ? hook.exampleFa : hook.exampleEn}"
                </p>
              </div>

              {/* Trigger Insight */}
              <div className={`text-[11px] p-2.5 rounded-lg border ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                💡 <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{isFa ? 'محرک روانی:' : 'Trigger:'}</span>{' '}
                {isFa ? hook.triggerDescriptionFa : hook.triggerDescriptionEn}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`flex items-center gap-2 pt-2 border-t ${
              isDark ? 'border-slate-800/60' : 'border-slate-100'
            }`}>
              <button
                onClick={() => onUseHookInReel(hook)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:opacity-95 transition-opacity"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>{isFa ? 'طراحی سناریو با این هوک' : 'Use in Reel Studio'}</span>
              </button>

              <button
                onClick={() => copyTemplate(isFa ? hook.templateFa : hook.templateEn, hook.id)}
                className={`flex items-center gap-1 py-2 px-3 rounded-lg text-xs font-medium border ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                title={isFa ? 'کپی قالب' : 'Copy template text'}
              >
                {copiedId === hook.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{isFa ? 'کپی' : 'Copy'}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
