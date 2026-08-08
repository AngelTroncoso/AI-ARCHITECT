/**
 * Types for AI Architect Challenge
 */

export type Language = 'es' | 'en' | 'zh';

export type ProgrammingLanguage = 'python' | 'javascript' | 'cpp';

export interface MentorCharacter {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string; // Avatar icon or styled graphic
  color: string; // Accent color for character
  greeting: Record<Language, string>;
  bio: Record<Language, string>;
  voiceName: string; // Gemini TTS voice (Kore, Fenrir, Zephyr, Puck, Charon)
  models: HFModel[];
  customAdvice: Record<Language, string>;
}

export interface HFModel {
  id: string;
  name: string;
  hfTag: string;
  type: 'pequeño' | 'optimizado' | 'intermedio' | 'avanzado';
  baseMetrics: ModelMetrics;
  description: Record<Language, string>;
}

export interface ModelMetrics {
  latencyMs: number;
  sizeMb: number;
  paramsM: number;
  costPer1k: number;
  accuracy: number;
  memoryUsageMb: number;
  energyJoules: number;
}

export interface Challenge {
  id: number;
  level: number;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  stars: number;
  badgeName: string;
  badgeIcon: string;
  xpReward: number;
  targetMetrics: {
    maxLatencyMs?: number;
    maxSizeMb?: number;
    maxParamsM?: number;
    maxCostPer1k?: number;
    minAccuracy?: number;
  };
  hint: Record<Language, string>;
  mentorId: string;
  starterCode: Record<ProgrammingLanguage, string>;
  videoLesson?: {
    title: Record<Language, string>;
    summary: Record<Language, string>;
    mentorName: string;
  };
}

export interface EvaluationResult {
  success: boolean;
  score: number;
  xpEarned: number;
  updatedMetrics: ModelMetrics;
  feedback: string;
  mentorReaction: 'happy' | 'thinking' | 'celebrating' | 'alert';
  audioBase64?: string;
  complexity: string;
  suggestions: string[];
  executionLogs: string[];
  weightDelta: {
    prunedPercentage: number;
    quantizationBits: number;
    attentionHeadsSaved: number;
    speedupFactor: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor' | 'system';
  mentorId?: string;
  text: string;
  timestamp: string;
  audioUrl?: string;
  imageAttachment?: string;
  codeAttachment?: string;
}

export interface UserProgress {
  username?: string;
  hasSeenIntro?: boolean;
  xp: number;
  levelName: string;
  streakDays: number;
  globalRank: number;
  unlockedLevel: number;
  badges: string[];
  completedChallenges: number[];
  currentChallengeId: number;
  selectedMentorId: string;
  selectedModelId: string;
  activeLanguage: Language;
  selectedProgLang: ProgrammingLanguage;
  savedCode: Record<number, Record<ProgrammingLanguage, string>>;
  unlockedSkills?: string[];
  unlockedAchievements?: string[];
  themeMode?: 'cyberpunk' | 'crt' | 'matrix' | 'clean';
  bossHp?: number;
}

export interface SkillTreeNode {
  id: string;
  name: Record<Language, string>;
  category: 'cuantizacion' | 'atencion' | 'memoria' | 'compilacion';
  icon: string;
  xpCost: number;
  prerequisites: string[];
  description: Record<Language, string>;
  perk: Record<Language, string>;
  buffLatencyPct: number;
  buffMemoryPct: number;
}

export interface AchievementItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: 'gamification' | 'llm' | 'ux';
  xpReward: number;
  isUnlocked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  countryFlag: string;
  modelName: string;
  optimizationNote: string;
  latencyDelta: string;
  sizeDelta: string;
  score: number;
  date: string;
}
