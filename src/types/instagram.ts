export type Language = 'fa' | 'en';
export type Theme = 'dark' | 'light';

export type StudioTab = 'reel' | 'carousel' | 'caption' | 'humanizer' | 'hooks' | 'audit' | 'strategy';

export interface HookFormula {
  id: string;
  number: number;
  name: string;
  nameFa: string;
  category: 'curiosity' | 'negative' | 'contrarian' | 'authority' | 'hack' | 'urgency';
  categoryLabel: string;
  categoryLabelFa: string;
  templateEn: string;
  templateFa: string;
  exampleEn: string;
  exampleFa: string;
  retentionScore: number;
  triggerDescriptionEn: string;
  triggerDescriptionFa: string;
}

export interface ReelSegment {
  timestamp: string;
  stage: string;
  spokenText: string;
  visualCue: string;
  textOverlay: string;
}

export interface ReelScriptData {
  title: string;
  hook: string;
  audioVibe: string;
  estimatedDuration: string;
  viralScore: number;
  segments: ReelSegment[];
  caption: string;
  hashtags: string[];
  retentionTips: string[];
}

export interface CarouselSlide {
  slideNumber: number;
  type: string;
  headline: string;
  subtext: string;
  visualNote: string;
}

export interface CarouselData {
  title: string;
  slideCount: number;
  slides: CarouselSlide[];
  caption: string;
  hashtags: string[];
  designAdvice: string;
}

export interface CaptionVariation {
  type: string;
  hookLine: string;
  body: string;
  cta: string;
}

export interface CaptionData {
  seoKeywords: string[];
  variations: CaptionVariation[];
  hashtagClusters: {
    broad: string[];
    niche: string[];
    community: string[];
  };
}

export interface HumanizerData {
  originalScore: number;
  humanizedScore: number;
  detectedClichés: string[];
  humanizedText: string;
  explanationOfChanges: string[];
  readingPacing: string;
}

export interface AuditData {
  overallGrade: string;
  scores: {
    hook: number;
    clarity: number;
    cta: number;
    retention: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendedRewrites: {
    label: string;
    text: string;
  }[];
  actionChecklist: string[];
}

export interface StrategyScheduleItem {
  day: string;
  format: string;
  title: string;
  hook: string;
  goal: string;
}

export interface StrategyData {
  strategySummary: string;
  contentPillars: string[];
  schedule: StrategyScheduleItem[];
  weeklyGrowthGoal: string;
}

export interface SavedDraft {
  id: string;
  tab: StudioTab;
  title: string;
  createdAt: number;
  data: any;
}
