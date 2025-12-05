import type { TimeManagementData, AGODigitalData } from '../types';

export interface SectionProps {
  data: TimeManagementData | AGODigitalData;
  isTimeMgmt: boolean;
}

export interface CTASectionProps extends SectionProps {
  onBack: () => void;
}
