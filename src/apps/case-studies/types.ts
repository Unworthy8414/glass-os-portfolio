import type { ComponentType } from 'react';

export interface CaseStudyProps {
    onBack: () => void;
    isCompact: boolean;
}

export interface CaseStudyConfig {
    id: string;
    title: string;
    subtitle: string;
    thumbnailGradient: string;
    icon: ComponentType<any>;
    date: string;
    role: string;
    component: ComponentType<CaseStudyProps>;
}

export const CASE_STUDY_BREAKPOINT = 900;
