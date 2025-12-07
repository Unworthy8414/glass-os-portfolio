import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Menu, X, ChevronDown, FileText, Clock3, Palette, Download } from 'lucide-react';

type SectionId = 'about' | 'work' | 'contact' | null;

interface CaseStudyItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
}

// Case studies data for the dropdown - using glassos palette
const caseStudies: CaseStudyItem[] = [
  {
    id: 'time-mgmt',
    title: 'Time Management App',
    subtitle: 'UX Research & Strategy',
    icon: Clock3,
    color: '#2a9d8f'
  },
  {
    id: 'ago-digital',
    title: 'AGO Digital Experience',
    subtitle: 'Purchase Journey Optimization',
    icon: Palette,
    color: '#e76f51'
  }
];

interface StandardNavbarProps {
  currentPage: 'home' | 'case-study' | 'resume';
  onNavigate: (section: SectionId) => void;
  onOpenCaseStudy: (studyId: string) => void;
  onOpenResume: () => void;
  onSwitchToOS: () => void;
  onLogoClick: () => void;
  // Optional: for case study page to show the Full Report PDF button
  pdfPath?: string;
  // Optional: for resume page to show the Download Resume PDF button
  resumePdfPath?: string;
}

export const StandardNavbar = ({
  currentPage,
  onNavigate,
  onOpenCaseStudy,
  onOpenResume,
  onSwitchToOS,
  onLogoClick,
  pdfPath,
  resumePdfPath
}: StandardNavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: SectionId) => {
    setMobileMenuOpen(false);
    setWorkDropdownOpen(false);
    onNavigate(sectionId);
  };

  const handleCaseStudyClick = (studyId: string) => {
    setMobileMenuOpen(false);
    setWorkDropdownOpen(false);
    onOpenCaseStudy(studyId);
  };

  const handleResumeClick = () => {
    setMobileMenuOpen(false);
    setWorkDropdownOpen(false);
    onOpenResume();
  };

  const handleOSClick = () => {
    setMobileMenuOpen(false);
    onSwitchToOS();
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    setWorkDropdownOpen(false);
    onLogoClick();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2a32]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.button
          onClick={handleLogoClick}
          className="font-heading text-lg hover:text-white/80 transition-colors"
          whileHover={{ x: -3 }}
        >
          Caylin Yeung
        </motion.button>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center gap-6"
        >
          <motion.button
            onClick={() => handleNavClick('about')}
            className="text-sm text-white/70 hover:text-white transition-colors font-display"
            whileHover={{ y: -2 }}
          >
            About
          </motion.button>

          {/* Work Dropdown */}
          <div className="relative">
            <button
              onClick={() => setWorkDropdownOpen(!workDropdownOpen)}
              onBlur={() => setTimeout(() => setWorkDropdownOpen(false), 150)}
              className={`flex items-center gap-1 text-sm transition-colors font-display ${
                currentPage === 'case-study' ? 'text-white font-medium' : 'text-white/70 hover:text-white'
              }`}
            >
              Work
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${workDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {workDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#1a2a32]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="p-2">
                    <button
                      onClick={() => handleNavClick('work')}
                      className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-display"
                    >
                      View All Work
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    {caseStudies.map((study) => (
                      <button
                        key={study.id}
                        onClick={() => handleCaseStudyClick(study.id)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${study.color}20` }}
                          >
                            <study.icon size={16} style={{ color: study.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white/90 group-hover:text-white font-display">{study.title}</div>
                            <div className="text-xs text-white/50 font-body">{study.subtitle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleResumeClick}
            className={`text-sm transition-colors font-display ${
              currentPage === 'resume' ? 'text-white font-medium' : 'text-white/70 hover:text-white'
            }`}
            whileHover={{ y: -2 }}
          >
            Resume
          </motion.button>

          <motion.button
            onClick={() => handleNavClick('contact')}
            className="text-sm text-white/70 hover:text-white transition-colors font-display"
            whileHover={{ y: -2 }}
          >
            Contact
          </motion.button>

          {/* PDF Button - only shown on case study pages */}
          {pdfPath && (
            <motion.a
              href={pdfPath}
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-lg text-sm transition-colors font-display"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText size={14} />
              <span>Full Report</span>
            </motion.a>
          )}

          {/* Resume PDF Button - only shown on resume page */}
          {resumePdfPath && (
            <motion.a
              href={resumePdfPath}
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-lg text-sm transition-colors font-display"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </motion.a>
          )}

          <motion.button
            onClick={handleOSClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors border border-white/10 font-display"
          >
            <Monitor size={14} />
            <span>Interactive OS</span>
          </motion.button>
        </motion.div>

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
            className="md:hidden bg-[#1a2a32]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              <button
                onClick={() => handleNavClick('about')}
                className="block w-full text-left text-white/70 hover:text-white transition-colors py-2 font-display"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('work')}
                className={`block w-full text-left transition-colors py-2 font-display ${
                  currentPage === 'case-study' ? 'text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                Work
              </button>
              {/* Mobile Case Study Links */}
              <div className="pl-4 space-y-1 border-l-2 border-white/10 ml-2">
                {caseStudies.map((study) => (
                  <button
                    key={study.id}
                    onClick={() => handleCaseStudyClick(study.id)}
                    className="flex items-center gap-2 w-full text-left text-white/50 hover:text-white transition-colors py-1.5"
                  >
                    <study.icon size={14} style={{ color: study.color }} />
                    <span className="text-sm font-display">{study.title}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleResumeClick}
                className={`block w-full text-left transition-colors py-2 font-display ${
                  currentPage === 'resume' ? 'text-white font-medium' : 'text-white/70 hover:text-white'
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left text-white/70 hover:text-white transition-colors py-2 font-display"
              >
                Contact
              </button>
              {/* PDF Link - only on case study pages */}
              {pdfPath && (
                <a
                  href={pdfPath}
                  target="_blank"
                  className="flex items-center gap-2 text-[#2a9d8f] hover:text-[#3dbfaf] transition-colors py-2 font-display"
                >
                  <FileText size={16} />
                  <span>Full Report</span>
                </a>
              )}
              {/* Resume PDF Link - only on resume page */}
              {resumePdfPath && (
                <a
                  href={resumePdfPath}
                  target="_blank"
                  className="flex items-center gap-2 text-[#2a9d8f] hover:text-[#3dbfaf] transition-colors py-2 font-display"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </a>
              )}
              <button
                onClick={handleOSClick}
                className="flex items-center gap-2 w-full text-left text-white/70 hover:text-white transition-colors py-2 font-display"
              >
                <Monitor size={16} />
                <span>Interactive OS</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
