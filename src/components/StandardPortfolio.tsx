import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Linkedin,
  FileText,
  Clock3,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Users,
  Target,
  Palette,
  Monitor
} from 'lucide-react';
import { useViewMode } from '../store/useViewMode';
import { StandardCaseStudy } from './StandardCaseStudy';
import { ResumePage } from './ResumePage';
import { StandardNavbar } from './StandardNavbar';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  timeline: string;
  methods: string[];
  gradient: string;
  icon: React.ElementType;
  color: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'time-mgmt',
    title: 'Time Management App',
    subtitle: 'UX Research & Strategy',
    description: 'Led comprehensive UX research to understand how young professionals manage their time, identifying key pain points and opportunities for a productivity app.',
    role: 'UX Researcher',
    timeline: '3 Months',
    methods: ['Focus Groups', 'Surveys', 'Diary Study'],
    gradient: 'from-[#264653] to-[#2a9d8f]',
    icon: Clock3,
    color: '#2a9d8f'
  },
  {
    id: 'ago-digital',
    title: 'AGO Digital Experience',
    subtitle: 'Purchase Journey Optimization',
    description: 'Conducted in-depth research to optimize the Art Gallery of Ontario\'s digital ticket purchasing experience, improving conversion and user satisfaction.',
    role: 'Lead UX Researcher',
    timeline: '4 Months',
    methods: ['Heuristic Evaluation', 'User Interviews', 'Ethnographic Research'],
    gradient: 'from-[#e76f51] to-[#f4a261]',
    icon: Palette,
    color: '#e76f51'
  }
];

type PageView = 'home' | 'case-study' | 'resume';
type SectionId = 'about' | 'work' | 'contact' | null;

// Floating orb component
const FloatingOrb = ({ delay, duration, size, color, left, top }: { delay: number; duration: number; size: number; color: string; left: string; top: string }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      filter: 'blur(40px)',
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Animated skill tag for about section
const SkillTag = ({ skill, index }: { skill: string; index: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
    whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
    className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80 border border-white/10 cursor-default transition-all duration-300 font-body"
  >
    {skill}
  </motion.span>
);

// Case study card component
const CaseStudyCard = ({ study, index, onClick }: { study: CaseStudy; index: number; onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="group text-left bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500"
  >
    {/* Gradient header with icon */}
    <div className={`h-52 bg-gradient-to-br ${study.gradient} flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10" />

      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 70%, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '30px 30px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Large background icon */}
      <motion.div
        className="absolute -bottom-10 -right-10"
        animate={{ rotate: [12, 0, 12], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <study.icon className="text-white/10 w-40 h-40" strokeWidth={1} />
      </motion.div>

      {/* Main icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative z-10"
      >
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
          <study.icon className="text-white w-10 h-10" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{ left: `${20 + i * 30}%`, top: `${30 + i * 15}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
    </div>

    {/* Card content */}
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/50 font-medium font-display">{study.role} • {study.timeline}</span>
        <motion.div
          className="flex items-center gap-1 text-white/30 group-hover:text-white/70"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity font-display">View</span>
          <ArrowRight size={16} />
        </motion.div>
      </div>

      <h3 className="text-xl font-heading mb-2 group-hover:text-white transition-colors">{study.title}</h3>
      <p className="text-sm text-white/50 mb-3 font-display">{study.subtitle}</p>
      <p className="text-sm text-white/60 leading-relaxed mb-4 font-body">{study.description}</p>

      <div className="flex flex-wrap gap-2">
        {study.methods.map((method) => (
          <span
            key={method}
            className="px-2.5 py-1 rounded-lg text-xs font-medium font-display transition-all duration-300"
            style={{
              backgroundColor: `${study.color}15`,
              color: study.color,
              border: `1px solid ${study.color}30`,
            }}
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  </motion.button>
);

// History state type for browser navigation
interface HistoryState {
  view: PageView;
  studyId?: string | null;
}

export const StandardPortfolio = () => {
  const { switchToOS } = useViewMode();
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeStudyId, setActiveStudyId] = useState<string | null>(null);
  const [pendingScrollSection, setPendingScrollSection] = useState<SectionId>(null);

  const scrollToSection = (sectionId: SectionId) => {
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Navigate with history push (for user-initiated navigation)
  const navigateWithHistory = useCallback((view: PageView, studyId?: string | null) => {
    const state: HistoryState = { view, studyId };
    window.history.pushState(state, '', '');
  }, []);

  // Handle browser back/forward navigation (mouse buttons 4/5)
  useEffect(() => {
    // Set initial history state on mount
    const initialState: HistoryState = { view: 'home', studyId: null };
    window.history.replaceState(initialState, '', '');

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null;
      if (state) {
        setCurrentView(state.view);
        setActiveStudyId(state.studyId ?? null);
        window.scrollTo(0, 0);
      } else {
        // No state means we're at the initial entry, go home
        setCurrentView('home');
        setActiveStudyId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenCaseStudy = (studyId: string) => {
    navigateWithHistory('case-study', studyId);
    setActiveStudyId(studyId);
    setCurrentView('case-study');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = (scrollTo?: SectionId) => {
    navigateWithHistory('home', null);
    setCurrentView('home');
    setActiveStudyId(null);
    if (scrollTo) {
      setPendingScrollSection(scrollTo);
    }
  };

  const handleOpenResume = () => {
    navigateWithHistory('resume', null);
    setCurrentView('resume');
    window.scrollTo(0, 0);
  };

  const handleNavClick = (sectionId: SectionId) => {
    if (currentView === 'home') {
      scrollToSection(sectionId);
    } else {
      handleBackToHome(sectionId);
    }
  };

  // Handle pending scroll after view change
  if (currentView === 'home' && pendingScrollSection) {
    scrollToSection(pendingScrollSection);
    setPendingScrollSection(null);
  }

  // Case Study View
  if (currentView === 'case-study' && activeStudyId) {
    return (
      <StandardCaseStudy
        studyId={activeStudyId}
        onBack={() => handleBackToHome()}
        onNavigate={handleBackToHome}
        onSwitchToOS={switchToOS}
        onOpenResume={handleOpenResume}
        onOpenCaseStudy={handleOpenCaseStudy}
      />
    );
  }

  // Resume View
  if (currentView === 'resume') {
    return (
      <ResumePage
        onBack={() => handleBackToHome()}
        onNavigate={handleBackToHome}
        onSwitchToOS={switchToOS}
        onOpenCaseStudy={handleOpenCaseStudy}
      />
    );
  }

  const researchMethods = ['User Interviews', 'Contextual Inquiry', 'Ethnography', 'Diary Studies', 'Surveys', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation', 'Card Sorting', 'Tree Testing'];

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a32] via-[#162229] to-[#0f171b] text-white overflow-x-hidden">
      {/* Animated background orbs - glassos palette */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={8} size={400} color="#264653" left="5%" top="10%" />
        <FloatingOrb delay={2} duration={10} size={300} color="#e76f51" left="75%" top="5%" />
        <FloatingOrb delay={4} duration={12} size={350} color="#2a9d8f" left="85%" top="50%" />
        <FloatingOrb delay={1} duration={9} size={250} color="#f4a261" left="10%" top="60%" />
        <FloatingOrb delay={3} duration={11} size={200} color="#e9c46a" left="50%" top="80%" />
      </div>

      <div className="relative">
        <StandardNavbar
          currentPage="home"
          onNavigate={handleNavClick}
          onOpenCaseStudy={handleOpenCaseStudy}
          onOpenResume={handleOpenResume}
          onSwitchToOS={switchToOS}
          onLogoClick={() => handleBackToHome()}
        />

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-6"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="text-[#e9c46a]" size={20} />
                </motion.span>
                <span className="text-[#2a9d8f] font-medium font-display">UX Design Student</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-heading mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-[#e9c46a]/30 to-[#2a9d8f]/30 bg-clip-text text-transparent">
                  Hi, I'm Caylin Yeung
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/60 leading-relaxed mb-10 font-body"
              >
                Third-year UX Design student with 3+ years leading creative teams and developing design systems for award-winning productions. I combine strong visual design skills with human-centered research training.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  onClick={handleOpenResume}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-xl font-medium font-display transition-colors shadow-lg shadow-[#2a9d8f]/25"
                >
                  <FileText size={18} />
                  View Resume
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('work')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium font-display transition-colors border border-white/10"
                >
                  See My Work
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="p-2 rounded-xl bg-[#2a9d8f]/30 border border-[#2a9d8f]/50">
                <Users size={24} className="text-[#2a9d8f]" />
              </div>
              <h2 className="text-3xl font-heading">About Me</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-white/70 leading-relaxed font-body">
                    I'm a third-year UX Design student at Humber Polytechnic with a unique background in film and television production. My experience leading creative teams and developing design systems for award-winning productions has taught me the importance of translating stakeholder vision and audience needs into cohesive visual solutions.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <p className="text-white/70 leading-relaxed font-body">
                    I combine strong visual design skills with human-centered research training, including user interviews, usability testing, and journey mapping. My approach emphasizes systematic design thinking and cross-functional collaboration to create impactful user experiences.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-6">
                    <Target size={18} className="text-[#2a9d8f]" />
                    <h3 className="text-lg font-heading">Research Methods</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {researchMethods.map((method, index) => (
                      <SkillTag key={method} skill={method} index={index} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section id="work" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2 rounded-xl bg-[#e76f51]/20 border border-[#e76f51]/30">
                <Palette size={24} className="text-[#e76f51]" />
              </div>
              <h2 className="text-3xl font-heading">Case Studies</h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/60 mb-12 max-w-xl font-body"
            >
              Recent work in UX research, product design, and strategy.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  index={index}
                  onClick={() => handleOpenCaseStudy(study.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Resume CTA Section */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#264653]/30 via-[#2a9d8f]/20 to-[#e9c46a]/20 p-12 border border-white/10"
            >
              {/* Animated gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, #264653, #2a9d8f, #e9c46a, #264653)',
                  backgroundSize: '400% 400%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex justify-center mb-6"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 rounded-2xl bg-white/10 border border-white/20"
                  >
                    <FileText size={32} className="text-[#2a9d8f]" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-heading mb-4"
                >
                  Want to learn more?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-white/60 mb-8 max-w-md mx-auto font-body"
                >
                  View my resume to see my full experience, education, and skills.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <motion.button
                    onClick={handleOpenResume}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-xl font-semibold font-display transition-colors shadow-lg shadow-[#2a9d8f]/25"
                  >
                    <Sparkles size={18} />
                    View Resume
                  </motion.button>
                  <motion.a
                    href="/Resume (2025).pdf"
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold font-display transition-colors border border-white/10"
                  >
                    <ExternalLink size={18} />
                    Download PDF
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex justify-center mb-6"
              >
                <div className="p-3 rounded-2xl bg-[#f4a261]/20 border border-[#f4a261]/30">
                  <Mail size={32} className="text-[#f4a261]" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-heading mb-4">Let's Connect</h2>
              <p className="text-white/60 mb-10 max-w-md mx-auto font-body">
                I'm always interested in discussing new design opportunities, collaboration, or just chatting about UX.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="mailto:caylin.yeung@gmail.com"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-medium font-display transition-all border border-white/10 hover:border-white/20"
                >
                  <div className="p-2 rounded-lg bg-[#2a9d8f]/20">
                    <Mail size={20} className="text-[#2a9d8f]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/50 font-body">Email</div>
                    <div className="text-sm font-body">caylin.yeung@gmail.com</div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/caylin-yeung-01a8a9396/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-medium font-display transition-all border border-white/10 hover:border-white/20"
                >
                  <div className="p-2 rounded-lg bg-[#2a9d8f]/20">
                    <Linkedin size={20} className="text-[#2a9d8f]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-white/50 font-body">LinkedIn</div>
                    <div className="text-sm font-body">Connect with me</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-white/40 font-body">
            <span>© 2025 Caylin Yeung</span>
            <motion.button
              onClick={switchToOS}
              whileHover={{ scale: 1.05, color: 'rgba(255,255,255,0.7)' }}
              className="flex items-center gap-2 transition-colors font-display"
            >
              <Monitor size={14} />
              Try the interactive OS experience
            </motion.button>
          </div>
        </footer>
      </div>
    </div>
  );
};
