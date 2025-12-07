import { StandardNavbar } from './StandardNavbar';
import { colors } from './case-studies/colors';
import { FloatingOrb } from './case-studies/components';
import { getCaseStudyData } from './case-studies/data';
import {
  OverviewSection,
  ResearchSection,
  AnalysisSection,
  DesignSection,
  ImpactSection,
  CTASection,
} from './case-studies/sections';
import type { CaseStudyProps } from './case-studies/types';

export const StandardCaseStudy = ({ studyId, onBack, onNavigate, onSwitchToOS, onOpenResume, onOpenCaseStudy }: CaseStudyProps) => {
  const data = getCaseStudyData(studyId);
  const isTimeMgmt = studyId === 'time-mgmt';

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-body">
        <p>Case study not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a32] via-[#162229] to-[#0f171b] text-white overflow-hidden">
      {/* Floating Orbs Background - glassos palette */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={8} size={300} color={isTimeMgmt ? colors.verdigris : colors.burnt} left="10%" top="20%" />
        <FloatingOrb delay={2} duration={10} size={200} color={colors.charcoal} left="70%" top="10%" />
        <FloatingOrb delay={4} duration={12} size={250} color={isTimeMgmt ? colors.charcoal : colors.sandy} left="80%" top="60%" />
        <FloatingOrb delay={1} duration={9} size={180} color={colors.jasmine} left="20%" top="70%" />
      </div>

      {/* Navigation */}
      <StandardNavbar
        currentPage="case-study"
        onNavigate={(section) => onNavigate(section)}
        onOpenCaseStudy={onOpenCaseStudy}
        onOpenResume={onOpenResume}
        onSwitchToOS={onSwitchToOS}
        onLogoClick={onBack}
        pdfPath={data.pdfPath}
      />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          <OverviewSection data={data} isTimeMgmt={isTimeMgmt} />
          <ResearchSection data={data} isTimeMgmt={isTimeMgmt} />
          <AnalysisSection data={data} isTimeMgmt={isTimeMgmt} />
          <DesignSection data={data} isTimeMgmt={isTimeMgmt} />
          <ImpactSection data={data} isTimeMgmt={isTimeMgmt} />
          <CTASection data={data} isTimeMgmt={isTimeMgmt} onBack={onBack} />
        </div>
      </div>
    </div>
  );
};
