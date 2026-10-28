import React from 'react';
import { StudioTab, Language, Theme } from '../types/instagram';
import { 
  Clapperboard, 
  Layers, 
  FileText, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Calendar,
  Languages,
  Plus,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onNewDraft: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  theme,
  onToggleTheme,
  onNewDraft,
}) => {
  const isFa = language === 'fa';
  const isDark = theme === 'dark';

  const navItems: { id: StudioTab; labelEn: string; labelFa: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'reel', labelEn: 'Reel Studio', labelFa: 'سناریوی ریلز', icon: Clapperboard },
    { id: 'carousel', labelEn: 'Carousels', labelFa: 'پست اسلایدی', icon: Layers },
    { id: 'caption', labelEn: 'Captions & SEO', labelFa: 'کپشن و هشتگ', icon: FileText },
    { id: 'humanizer', labelEn: 'AI Humanizer', labelFa: 'انسانی‌ساز لحن', icon: Sparkles },
    { id: 'hooks', labelEn: '26 Viral Hooks', labelFa: '۲۶ فرمول هوک', icon: Compass },
    { id: 'audit', labelEn: 'Bio & Audit', labelFa: 'آنالیز پیج', icon: ShieldCheck },
    { id: 'strategy', labelEn: '7-Day Sprint', labelFa: 'تقویم محتوا', icon: Calendar },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isDark 
        ? 'border-slate-800/80 bg-slate-950/90 text-white' 
        : 'border-slate-200 bg-white/90 text-slate-900 shadow-xs'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 shadow-sm shadow-rose-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className={`text-base font-bold tracking-tight whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isFa ? 'استودیوی اینستاگرام' : 'Instagram Agent Studio'}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border overflow-x-auto ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800/60' 
            : 'bg-slate-100/80 border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? isDark
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                      : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-pink-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span>{isFa ? item.labelFa : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Theme toggle + Language toggle + New Draft) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isFa ? (isDark ? 'تغییر به تم روشن' : 'تغییر به تم تیره') : (isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme')}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(isFa ? 'en' : 'fa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isFa ? 'Switch to English' : 'تغییر به زبان فارسی'}
          >
            <Languages className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold">{isFa ? 'EN' : 'فارسی'}</span>
          </button>

          {/* New Draft Button */}
          <button
            onClick={onNewDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 rounded-lg hover:opacity-95 transition-opacity shadow-sm shadow-rose-950/20 whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isFa ? 'پست جدید' : 'New Post'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className={`flex lg:hidden overflow-x-auto border-t px-4 py-2 gap-1.5 scrollbar-none ${
        isDark ? 'border-slate-800/60 bg-slate-950/95' : 'border-slate-200 bg-white/95'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? isDark
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{isFa ? item.labelFa : item.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
