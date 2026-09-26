export type ControlLevel = "Guided" | "Balanced" | "Author Control";

export type ProjectMode = "beginner" | "advanced";

export type ChapterStatus = "Approved" | "Needs Review" | "Ready to Write" | "Not Started";

export interface Character {
  id: string;
  name: string;
  role: string;
  age: string | number;
  description: string;
  relationship: "Family" | "Allies" | "Rivals" | "Colonial Rival" | "Neutral" | string;
  wants?: string;
  fears?: string;
  avatarUrl?: string;
  storyJourney?: string[];
  relationshipsList?: { targetName: string; relationshipType: string; note: string }[];
}

export interface TechnologyItem {
  id: string;
  name: string;
  stage: "Idea" | "Experiment" | "Prototype" | "Workshop" | "Factory" | "Mass Production";
  description: string;
  whyNeeded: string;
  whatRequired: string;
  whatHappened: string;
  nextStep: string;
}

export interface HistoricalFact {
  id: string;
  claim: string;
  status: "Confirmed" | "Needs checking" | "Story-created";
  usedIn: string;
  details: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  type: "Historical Record" | "My Story";
  isDivergence: boolean;
}

export interface ChapterVersion {
  id: string;
  timestamp: string;
  label: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: number;
  act: string;
  actTitle: string;
  title: string;
  description: string;
  status: ChapterStatus;
  content?: string;
  wordCount?: number;
  versions?: ChapterVersion[];
}

export interface StoryIllustration {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  imageUrl: string;
  character: string;
  location: string;
  mood: "Calm" | "Dramatic" | "Emotional" | "Mysterious" | "Epic";
  isCharacterReference?: boolean;
}

export interface StoryQuestion {
  id: string;
  title: string;
  question: string;
  whyAsking: string;
  options: string[];
  selectedOption?: string;
  aiSuggestion?: {
    recommendedOption: string;
    reasoning: string;
  };
  isCritical?: boolean;
  affectedChapters?: string[];
}

export interface ContinuityAlert {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "info" | "critical";
  chaptersInvolved: string[];
  suggestedFix: string;
  applied?: boolean;
  dismissed?: boolean;
}

export interface BookProject {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  series?: string;
  volume?: string;
  genres: string[];
  controlLevel: ControlLevel;
  setting: string;
  bookType: string;
  summary: string;
  isHistorical: boolean;
  historicalIdentityNote?: string;
  protagonistName: string;
  protagonistAge: string | number;
  protagonistRole: string;
  protagonistBio: string;
  protagonistWants: string;
  protagonistFears: string;
  coverImage?: string;
  coverStyle?: string;
  characters: Character[];
  chapters: Chapter[];
  technologies: TechnologyItem[];
  historicalFacts: HistoricalFact[];
  timeline: TimelineEvent[];
  questions: StoryQuestion[];
  illustrations: StoryIllustration[];
  continuityAlerts: ContinuityAlert[];
  trailers?: BookTrailer[];
  publishingMetadata?: PublishingMetadata;
  currentStep: number; // 1 to 10
  planningMode: "Plan Everything First" | "Start Writing Now" | "Let AI Plan As We Go";
  sourceText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookTrailer {
  id: string;
  title: string;
  prompt: string;
  aspectRatio: "16:9" | "9:16";
  resolution: "720p" | "1080p";
  status: "idle" | "rendering" | "completed" | "failed";
  videoUrl?: string;
  operationName?: string;
  chapterNumber?: number;
  durationSeconds?: number;
  createdAt: string;
}

export interface PublishingMetadata {
  isbn?: string;
  doi?: string;
  publisher?: string;
  publicationDate?: string;
  language?: string;
  rightsNotice?: string;
  aiDisclosure?: boolean;
  contentRating?: "All Ages" | "PG-13 (Teens)" | "16+ (Mature Young Adult)" | "18+ (Explicit/Mature)";
  contentAdvisories?: string[];
  pageProgressionDirection?: "ltr" | "rtl";
  cipCatalogBlock?: string;
  printTrimSize?: "5 x 7.25 in (Standard B6 Light Novel)" | "6 x 9 in (Standard Trade Paperback)" | "A5 (International Digest)";
}

export interface ComplianceSettings {
  highContrast: boolean;
  dyslexicFont: boolean;
  fontSize: "sm" | "md" | "lg" | "xl";
  reducedMotion: boolean;
  cookieConsentAccepted: boolean;
  cookiePreferences: {
    essential: boolean;
    preferences: boolean;
    analytics: boolean;
  };
  greenAiMode: boolean;
}

export type IllustrationItem = StoryIllustration;

export interface GenerationOptions {
  length: "Short" | "Standard" | "Detailed";
  style: "Balanced" | "More emotional" | "More cinematic" | "More detailed" | "More dialogue";
  fidelity: "Stay close to source" | "Expand naturally" | "Develop creatively";
}
