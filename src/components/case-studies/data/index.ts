import { timeManagementData } from './time-management';
import { agoDigitalData } from './ago-digital';
import type { CaseStudyData } from '../types';

// Registry of all case studies - add new case studies here
const caseStudyRegistry: Record<string, CaseStudyData> = {
  'time-mgmt': timeManagementData,
  'ago-digital': agoDigitalData,
};

export function getCaseStudyData(studyId: string): CaseStudyData | null {
  return caseStudyRegistry[studyId] || null;
}

export function getAllCaseStudyIds(): string[] {
  return Object.keys(caseStudyRegistry);
}

export { timeManagementData, agoDigitalData };
