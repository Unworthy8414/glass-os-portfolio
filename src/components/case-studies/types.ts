import type { LucideIcon } from 'lucide-react';

export type SectionId = 'about' | 'work' | 'contact' | null;

export interface CaseStudyProps {
  studyId: string;
  onBack: () => void;
  onNavigate: (section?: SectionId) => void;
  onSwitchToOS: () => void;
  onOpenResume: () => void;
  onOpenCaseStudy: (studyId: string) => void;
}

export interface Persona {
  initials: string;
  name: string;
  subtitle: string;
  details?: string;
  goals: string[];
  painPoints: string[];
  extra1?: { title: string; items: string[]; color: string };
  extra2?: { title: string; items: string[]; color: string };
  color: string;
}

export interface ApproachStep {
  num: string;
  title: string;
  sub: string;
  color: string;
}

export interface JourneyStep {
  time: string;
  mood: string;
  title: string;
  desc: string;
}

export interface ChartDataItem {
  value: number;
  label: string;
  color: string;
}

export interface Recommendation {
  icon: LucideIcon;
  color: string;
  title: string;
  desc?: string;
  items?: string[];
}

export interface KeyFinding {
  title: string;
  desc?: string;
  items?: string[];
  quote?: string;
  color?: string;
}

export interface BusinessValueItem {
  title: string;
  desc?: string;
  items?: string[];
  color: string;
}

export interface Methodology {
  worked: string[];
  challenges: string | string[];
  solution?: string;
  nextSteps: string[];
}

export interface BaseCaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  team: string;
  methods: string;
  gradient: string;
  pdfPath: string;
  challenge: string;
  researchQuestion: string;
  hypothesis: string;
  overview: string;
  persona: Persona;
  approach: ApproachStep[];
  keyFindings: KeyFinding[];
  journeyMap: JourneyStep[];
  recommendations: Recommendation[];
  methodology: Methodology;
}

export interface TimeManagementData extends BaseCaseStudyData {
  focusGroupChallenges: string[];
  focusGroupSolutions: string[];
  surveyData: {
    q1: ChartDataItem[];
    q7: ChartDataItem[];
  };
  keyStats: { label: string; value: string }[];
  diaryDistractions: string[];
  diaryStrategies: string[];
  impact: { title: string; desc: string }[];
  designPrinciples: string[];
}

export interface AGODigitalData extends BaseCaseStudyData {
  competitors: { name: string; url?: string }[];
  siteIssues: { title: string; desc: string; color: string }[];
  hypothesesTested: string[];
  observationAreas: string[];
  cognitiveDissonance: string;
  quickWins: { title: string; desc: string }[];
  validatedHypotheses: string[];
  businessValue: BusinessValueItem[];
}

export type CaseStudyData = TimeManagementData | AGODigitalData;

// Type guards
export function isTimeManagementData(data: CaseStudyData): data is TimeManagementData {
  return data.id === 'time-mgmt';
}

export function isAGODigitalData(data: CaseStudyData): data is AGODigitalData {
  return data.id === 'ago-digital';
}
