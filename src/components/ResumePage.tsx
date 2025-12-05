import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Download,
  Menu,
  X
} from 'lucide-react';

type SectionId = 'about' | 'work' | 'contact' | null;

interface ResumePageProps {
  onBack: () => void;
  onNavigate: (section?: SectionId) => void;
  onSwitchToOS: () => void;
}

const experience = [
  {
    title: 'Film & Television Makeup Artist',
    company: 'Freelance',
    period: '2021 - 2023',
    location: 'Toronto, ON',
    highlights: [
      'Conducted narrative analysis (script breakdowns) to understand character motivations, contexts, and emotional arcs—informing design decisions based on user needs',
      'Led stakeholder collaboration with director and production departments, translating research insights into actionable design requirements',
      'Developed comprehensive design system (lookbook guides) and documentation ensuring consistency and team alignment',
      'Led team of 3 through design process from concept through execution, maintaining quality standards across production timeline',
      'Managed cross-functional coordination to balance creative vision with technical and budget constraints'
    ]
  }
];

const education = [
  {
    degree: 'Bachelor of Design - User Experience Design',
    school: 'Humber Polytechnic',
    period: '2024 - 2027',
    focus: 'Human-Centered Design & Research',
    highlights: [
      'Human-Centered Design & Research',
      'Interaction Design & Service Design',
      'User Interface Design & Visual Communication',
      'Usability Testing & Prototyping',
      'Information Architecture'
    ]
  },
  {
    degree: 'The Complete Makeup Artist Program',
    school: 'CMU College of Makeup Art & Design',
    period: '2020 - 2021',
    focus: 'Makeup Artistry',
    highlights: [
      'Professional makeup artistry for film and television',
      'Character design and development',
      'Special effects and prosthetics'
    ]
  }
];

const skills = {
  research: ['User Interviews', 'Contextual Inquiry', 'Ethnography', 'Diary Studies', 'Surveys', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation', 'Card Sorting', 'Tree Testing'],
  analysis: ['Affinity Mapping', 'User Personas', 'Journey Mapping', 'Task Analysis', 'Service Blueprint', 'Competitive Analysis', 'SWOT Analysis'],
  tools: ['Figma', 'Adobe XD', 'Framer', 'Miro', 'Figjam', 'Photoshop', 'Illustrator', 'Zbrush', 'Blender'],
  soft: ['Stakeholder Collaboration', 'Cross-functional Coordination', 'Design Systems', 'Visual Communication', 'Documentation']
};

export const ResumePage = ({ onBack, onNavigate, onSwitchToOS }: ResumePageProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="font-semibold text-lg hover:text-white/80 transition-colors"
          >
            Caylin Yeung
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="text-sm text-white/70 hover:text-white transition-colors">About</button>
            <button onClick={() => onNavigate('work')} className="text-sm text-white/70 hover:text-white transition-colors">Work</button>
            <span className="text-sm text-white font-medium">Resume</span>
            <button onClick={() => onNavigate('contact')} className="text-sm text-white/70 hover:text-white transition-colors">Contact</button>
            <a
              href="/Resume (2025).pdf"
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onSwitchToOS}
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
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('about'); }} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">About</button>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('work'); }} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Work</button>
                <span className="block w-full text-left text-white font-medium py-2">Resume</span>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('contact'); }} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Contact</button>
                <a
                  href="/Resume (2025).pdf"
                  target="_blank"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors py-2"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => { setMobileMenuOpen(false); onSwitchToOS(); }}
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

      {/* Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">Caylin Yeung</h1>
            <p className="text-xl text-blue-400 mb-4">UX Design Student</p>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                Toronto, ON
              </span>
              <a href="mailto:caylin.yeung@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail size={14} />
                caylin.yeung@gmail.com
              </a>
              <a href="https://caylin.ca" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink size={14} />
                caylin.ca
              </a>
            </div>
          </motion.header>

          {/* Summary */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <p className="text-white/70 leading-relaxed text-lg">
              Third-year UX Design student with 3+ years leading creative teams and developing design systems for award-winning productions.
              Experienced translating stakeholder vision and audience needs into cohesive visual solutions through systematic design thinking and cross-functional collaboration.
              Combines strong visual design skills with human-centered research training in user interviews, usability testing, and journey mapping.
            </p>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Briefcase size={20} className="text-blue-400" />
              <h2 className="text-2xl font-semibold">Experience</h2>
            </div>
            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-white/10">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900" />
                  <div className="mb-2">
                    <h3 className="text-lg font-medium leading-tight">{job.title}</h3>
                    <p className="text-blue-400">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {job.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-white/70 text-sm">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap size={20} className="text-purple-400" />
              <h2 className="text-2xl font-semibold">Education</h2>
            </div>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-white/10">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-900" />
                  <div className="mb-2">
                    <h3 className="text-lg font-medium leading-tight">{edu.degree}</h3>
                    <p className="text-purple-400">{edu.school}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {edu.period}
                      </span>
                      <span>Focus: {edu.focus}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-white/70 text-sm">
                    {edu.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-green-400" />
              <h2 className="text-2xl font-semibold">Skills</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Research Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.research.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Analysis & Synthesis</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.analysis.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Case Studies CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12 border-t border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-4">See My Work</h2>
            <p className="text-white/60 mb-6">
              Check out my case studies to see how I apply these skills in real projects.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
            >
              View Case Studies
            </button>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
