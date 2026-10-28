import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Music, 
  Copy, 
  Check, 
  Flame, 
  Lightbulb, 
  Video,
  FileCode,
} from 'lucide-react';
import { Language, ReelScriptData } from '../types/instagram';
import { HOOK_FORMULAS } from '../data/hookFormulas';
import { useTheme } from '../context/ThemeContext';

interface ReelStudioProps {
  language: Language;
  onScriptGenerated: (script: ReelScriptData) => void;
  onSendToHumanizer: (text: string) => void;
  initialTopic?: string;
  initialHookId?: string;
}

export const ReelStudio: React.FC<ReelStudioProps> = ({
  language,
  onScriptGenerated,
  onSendToHumanizer,
  initialTopic = '',
  initialHookId = 'negative-frame'
}) => {
  const isFa = language === 'fa';
  const { isDark } = useTheme();

  const [topic, setTopic] = useState(initialTopic || (isFa ? '۳ اشتباه در تولید محتوای اینستاگرام' : '3 costly mistakes creators make on Instagram'));
  const [niche, setNiche] = useState(isFa ? 'تولید محتوا و رشد پیج' : 'Content Creation & Marketing');
  const [selectedHookId, setSelectedHookId] = useState(initialHookId);
  const [audience, setAudience] = useState(isFa ? 'سازندگان محتوا و بیزینس‌های آنلاین' : 'Content creators & solo entrepreneurs');
  const [goal, setGoal] = useState(isFa ? 'افزایش بازدید و جذب مخاطب جدید' : 'Viral Reach & New Followers');
  const [tone, setTone] = useState(isFa ? 'صمیمی، پرانرژی و ضربی' : 'Punchy, direct, conversational');
  
  const [isLoading, setIsLoading] = useState(false);
  const [reelData, setReelData] = useState<ReelScriptData | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const selectedHook = HOOK_FORMULAS.find(h => h.id === selectedHookId) || HOOK_FORMULAS[0];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/instagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'reel',
          topic,
          niche,
          hookFormula: selectedHook.name,
          targetAudience: audience,
          goal,
          tone,
          language,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setReelData(resData.data);
        onScriptGenerated(resData.data);
      }
    } catch (err) {
      console.error('Error generating reel:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getFullScriptText = () => {
    if (!reelData) return '';
    const segmentsText = reelData.segments
      .map(s => `[${s.timestamp} - ${s.stage}]\n🎙️ ${s.spokenText}\n🎥 Visual: ${s.visualCue}\n💬 Overlay: ${s.textOverlay}`)
      .join('\n\n');
    return `TITILE: ${reelData.title}\nHook: ${reelData.hook}\nAudio Vibe: ${reelData.audioVibe}\n\n--- SCRIPT BREAKDOWN ---\n${segmentsText}\n\n--- CAPTION ---\n${reelData.caption}\n\n${reelData.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`;
  };

  const copyClaudePrompt = () => {
    const prompt = `Use Jake Schincariol's /ig-reel skill:
Topic: "${topic}"
Niche: "${niche}"
Hook Formula: "${selectedHook.name}" (${selectedHook.templateEn})
Target Audience: "${audience}"
Tone: "${tone}"
Generate a 45s timed Instagram Reel script with visual cues, camera directions, text overlays, retention tips, and caption.`;
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
            <Video className="h-4 w-4 text-pink-500" />
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isFa ? 'استودیوی سناریونویسی ریلز (فرمول‌های وایرال)' : 'Reel Scripting Studio'}
            </h2>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFa ? 'بر پایه مهارت /ig-reel' : 'Powered by /ig-reel skill'}
          </span>
        </div>

        {/* Topic Input */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isFa ? 'موضوع یا ایده اصلی ریلز' : 'Reel Topic or Core Idea'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={isFa ? 'مثلاً: ۳ ترفند افزایش بازدید ریلز...' : 'e.g. 3 ways to double reel retention...'}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 ${
              isDark 
                ? 'border-slate-800 bg-slate-950 text-white placeholder-slate-500' 
                : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Niche & Hook Formula Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'حوزه تخصصی (Niche)' : 'Niche / Industry'}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-pink-500 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1.5 flex items-center justify-between ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <span>{isFa ? 'فرمول هوک (از ۲۶ فرمول شینکاریول)' : 'Hook Formula (from 26 Formulas)'}</span>
              <span className="text-[10px] text-pink-500 font-mono">Score: {selectedHook.retentionScore}%</span>
            </label>
            <select
              value={selectedHookId}
              onChange={(e) => setSelectedHookId(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:border-pink-500 focus:outline-none ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            >
              {HOOK_FORMULAS.map((h) => (
                <option key={h.id} value={h.id}>
                  #{h.number} {isFa ? h.nameFa : h.name} ({h.retentionScore}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Hook Template Helper Box */}
        <div className={`rounded-xl border p-3 text-xs ${
          isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5 text-pink-500 font-semibold mb-1">
            <Flame className="h-3.5 w-3.5" />
            <span>{isFa ? 'قالب هوک انتخابی:' : 'Selected Formula Template:'}</span>
          </div>
          <p className={`italic mb-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800 font-medium'}`}>
            "{isFa ? selectedHook.templateFa : selectedHook.templateEn}"
          </p>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {isFa ? selectedHook.triggerDescriptionFa : selectedHook.triggerDescriptionEn}
          </p>
        </div>

        {/* Audience & Goal Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              {isFa ? 'هدف ویدیو' : 'Primary Goal'}
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

          <div>
            <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFa ? 'لحن بیان' : 'Tone'}
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                isDark 
                  ? 'border-slate-800 bg-slate-950 text-white' 
                  : 'border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 transition-all shadow-md shadow-rose-950/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isFa ? 'در حال طراحی سناریو...' : 'Scripting with Gemini AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{isFa ? 'تولید سناریوی کامل ریلز' : 'Generate Viral Reel Script'}</span>
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
            title={isFa ? 'کپی پرامپت استاندارد برای کلود' : 'Copy prompt formatted for Claude Code / Skills'}
          >
            {copiedType === 'claude' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <FileCode className="h-3.5 w-3.5 text-amber-500" />}
            <span>{isFa ? 'کپی پرامپت کلود' : 'Copy Claude Prompt'}</span>
          </button>
        </div>

      </div>

      {/* Generated Script Result Container */}
      {reelData && (
        <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-sm space-y-6 transition-colors ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-xs'
        }`}>
          
          {/* Header Score & Meta Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase text-pink-500 tracking-wider">
                {isFa ? 'سناریوی نهایی' : 'Generated Blueprint'}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {reelData.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                isDark 
                  ? 'bg-pink-500/10 border-pink-500/20 text-pink-300' 
                  : 'bg-pink-50 border-pink-200 text-pink-700'
              }`}>
                <Flame className="h-3.5 w-3.5 text-pink-500" />
                <span>{isFa ? 'نمره وایرال:' : 'Viral Score:'} {reelData.viralScore}/100</span>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>{reelData.estimatedDuration}</span>
              </div>
            </div>
          </div>

          {/* Audio Vibe Card */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Music className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <span className={`font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'پیشنهاد موزیک و ریتم صدا:' : 'Audio & Music Recommendation:'}
              </span>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{reelData.audioVibe}</p>
            </div>
          </div>

          {/* Timed Segments Timeline Breakdown */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFa ? 'زمان‌بندی و دکوپاژ شات‌ها:' : 'Staged Timeline & Camera Directions:'}
            </h4>

            {reelData.segments.map((seg, idx) => (
              <div 
                key={idx}
                className={`rounded-xl border p-4 space-y-2 transition-colors ${
                  isDark ? 'border-slate-800 bg-slate-950 hover:border-slate-700' : 'border-slate-200 bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-center justify-between text-xs pb-1 border-b ${
                  isDark ? 'border-slate-800/60' : 'border-slate-200'
                }`}>
                  <span className="font-mono font-bold text-pink-500">{seg.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {seg.stage}
                  </span>
                </div>

                {/* Spoken Line */}
                <div className={`text-sm font-medium leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span className={`text-xs block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isFa ? 'جمله دیالوگ گوینده:' : 'Spoken Dialogue:'}
                  </span>
                  "{seg.spokenText}"
                </div>

                {/* Visual Cue & On-Screen Text Overlay */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className={`p-2 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <span className={`text-[10px] block font-semibold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      🎥 {isFa ? 'زاویه و حرکت دوربین:' : 'Camera / Visual Action:'}
                    </span>
                    {seg.visualCue}
                  </div>
                  <div className={`p-2 rounded-lg border font-medium ${
                    isDark ? 'bg-slate-900 border-slate-800/80 text-amber-300' : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}>
                    <span className={`text-[10px] block font-semibold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      💬 {isFa ? 'متن روی صفحه (Text Overlay):' : 'On-Screen Text:'}
                    </span>
                    {seg.textOverlay}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Retention Advice Tips */}
          {reelData.retentionTips && reelData.retentionTips.length > 0 && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              isDark ? 'bg-amber-500/10 border-amber-500/20 text-slate-300' : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-amber-500">
                <Lightbulb className="h-4 w-4" />
                <span>{isFa ? 'نکات طلایی افزایش نرخ تماشا (Retention):' : 'Retention Watch-Time Accelerators:'}</span>
              </div>
              <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {reelData.retentionTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Caption Box */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isFa ? 'کپشن آماده انتشار:' : 'Ready-to-Post Companion Caption:'}
              </span>
              <button
                onClick={() => copyToClipboard(reelData.caption, 'caption')}
                className={`flex items-center gap-1 text-[11px] ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {copiedType === 'caption' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{isFa ? 'کپی کپشن' : 'Copy Caption'}</span>
              </button>
            </div>
            <p className={`whitespace-pre-line leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {reelData.caption}
            </p>
            <div className="pt-2 text-pink-500 text-[11px] flex flex-wrap gap-1 font-semibold">
              {reelData.hashtags.map((h, i) => (
                <span key={i}>{h.startsWith('#') ? h : `#${h}`}</span>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => copyToClipboard(getFullScriptText(), 'full')}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                isDark 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
              }`}
            >
              {copiedType === 'full' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isFa ? 'کپی کل سناریو با دکوپاژ' : 'Copy Full Script Deck'}</span>
            </button>

            <button
              onClick={() => onSendToHumanizer(reelData.caption)}
              className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30' 
                  : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 shadow-xs'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isFa ? 'ارسال به انسانی‌ساز لحن' : 'Polish in Humanizer'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
