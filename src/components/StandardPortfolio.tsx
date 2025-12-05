import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Linkedin,
  FileText,
  Clock3,
  Grid,
  ArrowRight,
  ExternalLink,
  Monitor,
  Menu,
  X
} from 'lucide-react';
import { useViewMode } from '../store/useViewMode';
import { StandardCaseStudy } from './StandardCaseStudy';
import { ResumePage } from './ResumePage';

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
    gradient: 'from-blue-500 to-indigo-600',
    icon: Clock3
  },
  {
    id: 'ago-digital',
    title: 'AGO Digital Experience',
    subtitle: 'Purchase Journey Optimization',
    description: 'Conducted in-depth research to optimize the Art Gallery of Ontario\'s digital ticket purchasing experience, improving conversion and user satisfaction.',
    role: 'Lead UX Researcher',
    timeline: '4 Months',
    methods: ['Heuristic Evaluation', 'User Interviews', 'Ethnographic Research'],
    gradient: 'from-pink-500 to-rose-600',
    icon: Grid
  }
];

type PageView = 'home' | 'case-study' | 'resume';
type SectionId = 'about' | 'work' | 'contact' | null;

export const StandardPortfolio = () => {
  const { switchToOS } = useViewMode();
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeStudyId, setActiveStudyId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleOpenCaseStudy = (studyId: string) => {
    setActiveStudyId(studyId);
    setCurrentView('case-study');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = (scrollTo?: SectionId) => {
    setCurrentView('home');
    setActiveStudyId(null);
    if (scrollTo) {
      setPendingScrollSection(scrollTo);
    }
  };

  const handleOpenResume = () => {
    setCurrentView('resume');
    window.scrollTo(0, 0);
  };

  const handleNavClick = (sectionId: SectionId) => {
    setMobileMenuOpen(false);
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
      />
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
      <div>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <span className="font-semibold text-lg">Caylin Yeung</span>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                  <button onClick={() => handleNavClick('about')} className="text-sm text-white/70 hover:text-white transition-colors">About</button>
                  <button onClick={() => handleNavClick('work')} className="text-sm text-white/70 hover:text-white transition-colors">Work</button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleOpenResume(); }}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Resume
                  </button>
                  <button onClick={() => handleNavClick('contact')} className="text-sm text-white/70 hover:text-white transition-colors">Contact</button>
                  <button
                    onClick={switchToOS}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    <Monitor size={14} />
                    <span>Interactive OS</span>
                  </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                  >
                    <div className="px-6 py-4 space-y-3">
                      <button onClick={() => handleNavClick('about')} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">About</button>
                      <button onClick={() => handleNavClick('work')} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Work</button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); handleOpenResume(); }}
                        className="block w-full text-left text-white/70 hover:text-white transition-colors py-2"
                      >
                        Resume
                      </button>
                      <button onClick={() => handleNavClick('contact')} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Contact</button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); switchToOS(); }}
                        className="flex items-center gap-2 w-full text-left text-white/70 hover:text-white transition-colors py-2"
                      >
                        <Monitor size={16} />
                        <span>Interactive OS</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-3xl"
                >
                  <p className="text-blue-400 font-medium mb-4">UX Design Student</p>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Hi, I'm Caylin Yeung
                  </h1>
                  <p className="text-xl text-white/60 leading-relaxed mb-8">
                    Third-year UX Design student with 3+ years leading creative teams and developing design systems for award-winning productions. I combine strong visual design skills with human-centered research training in user interviews, usability testing, and journey mapping.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleOpenResume}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
                    >
                      <FileText size={18} />
                      View Resume
                    </button>
                    <a
                      href="#work"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      See My Work
                      <ArrowRight size={18} />
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-6 bg-white/5">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-8">About Me</h2>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <p className="text-white/70 leading-relaxed mb-6">
                        I'm a third-year UX Design student at Humber Polytechnic with a unique background in film and television production. My experience leading creative teams and developing design systems for award-winning productions has taught me the importance of translating stakeholder vision and audience needs into cohesive visual solutions.
                      </p>
                      <p className="text-white/70 leading-relaxed">
                        I combine strong visual design skills with human-centered research training, including user interviews, usability testing, and journey mapping. My approach emphasizes systematic design thinking and cross-functional collaboration to create impactful user experiences.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Research Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        {['User Interviews', 'Contextual Inquiry', 'Ethnography', 'Diary Studies', 'Surveys', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation', 'Card Sorting', 'Tree Testing'].map((method) => (
                          <span
                            key={method}
                            className="px-3 py-1.5 bg-white/10 rounded-lg text-sm text-white/80"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Case Studies Section */}
            <section id="work" className="py-20 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-2">Case Studies</h2>
                  <p className="text-white/60 mb-12">Recent work in UX research, product design, and strategy.</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {caseStudies.map((study, index) => (
                      <motion.button
                        key={study.id}
                        onClick={() => handleOpenCaseStudy(study.id)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group text-left bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <div className={`h-48 bg-gradient-to-br ${study.gradient} flex items-center justify-center relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20" />
                          <study.icon className="text-white/10 w-32 h-32 absolute -bottom-8 -right-8 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                          <study.icon className="text-white w-16 h-16 relative z-10 drop-shadow-lg" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-white/50">{study.role} • {study.timeline}</span>
                            <ArrowRight className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" size={16} />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                          <p className="text-sm text-white/50 mb-4">{study.subtitle}</p>
                          <p className="text-sm text-white/60 leading-relaxed mb-4">{study.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {study.methods.map((method) => (
                              <span
                                key={method}
                                className="px-2 py-1 bg-white/10 rounded text-xs text-white/70"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Resume Download Section */}
            <section className="py-20 px-6 bg-white/5">
              <div className="max-w-7xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-4">Want to learn more?</h2>
                  <p className="text-white/60 mb-8 max-w-xl mx-auto">
                    View my resume to see my full experience, education, and skills.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={handleOpenResume}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
                    >
                      <FileText size={18} />
                      View Resume
                    </button>
                    <a
                      href="/Resume (2025).pdf"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      <ExternalLink size={18} />
                      Download PDF
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-6">
              <div className="max-w-7xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
                  <p className="text-white/60 mb-8 max-w-xl mx-auto">
                    I'm always interested in discussing new design opportunities, collaboration, or just chatting about UX.
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href="mailto:caylin.yeung@gmail.com"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      <Mail size={18} />
                      Email Me
                    </a>
                    <a
                      href="https://www.linkedin.com/in/caylin-yeung-01a8a9396/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      <Linkedin size={18} />
                      LinkedIn
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-white/40">
                <span>© 2025 Caylin Yeung</span>
                <button
                  onClick={switchToOS}
                  className="flex items-center gap-2 hover:text-white/60 transition-colors"
                >
                  <Monitor size={14} />
                  Try the interactive OS experience
                </button>
              </div>
            </footer>
      </div>
    </div>
  );
};
