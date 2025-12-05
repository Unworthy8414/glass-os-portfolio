import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Sparkles,
  Code2,
  Palette,
  Users
} from 'lucide-react';
import { StandardNavbar } from './StandardNavbar';

type SectionId = 'about' | 'work' | 'contact' | null;

interface ResumePageProps {
  onBack: () => void;
  onNavigate: (section?: SectionId) => void;
  onSwitchToOS: () => void;
  onOpenCaseStudy: (studyId: string) => void;
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
  research: { items: ['User Interviews', 'Contextual Inquiry', 'Ethnography', 'Diary Studies', 'Surveys', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation', 'Card Sorting', 'Tree Testing'], color: 'blue', icon: Users },
  analysis: { items: ['Affinity Mapping', 'User Personas', 'Journey Mapping', 'Task Analysis', 'Service Blueprint', 'Competitive Analysis', 'SWOT Analysis'], color: 'purple', icon: Sparkles },
  tools: { items: ['Figma', 'Adobe XD', 'Framer', 'Miro', 'Figjam', 'Photoshop', 'Illustrator', 'Zbrush', 'Blender'], color: 'green', icon: Code2 },
  soft: { items: ['Stakeholder Collaboration', 'Cross-functional Coordination', 'Design Systems', 'Visual Communication', 'Documentation'], color: 'amber', icon: Palette }
};

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

// Animated skill tag
const SkillTag = ({ skill, color, index }: { skill: string; color: string; index: number }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/20',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400/50 hover:shadow-purple-500/20',
    green: 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30 hover:border-amber-400/50 hover:shadow-amber-500/20',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`px-3 py-1.5 rounded-lg text-sm border cursor-default transition-all duration-300 hover:shadow-lg ${colorClasses[color]}`}
    >
      {skill}
    </motion.span>
  );
};

// Timeline item component
const TimelineItem = ({ item, index, color, type }: { item: typeof experience[0] | typeof education[0]; index: number; color: string; type: 'experience' | 'education' }) => {
  const isEducation = type === 'education';
  const edu = item as typeof education[0];
  const job = item as typeof experience[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
      className="relative pl-8 group"
    >
      {/* Animated timeline line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: `${color}33` }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2, duration: 0.5 }}
      />

      {/* Animated dot */}
      <motion.div
        className="absolute -left-[7px] top-1"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 + 0.3, type: 'spring', stiffness: 300 }}
      >
        <div
          className="w-4 h-4 rounded-full border-4 border-slate-900"
          style={{ backgroundColor: color }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
      </motion.div>

      {/* Content card */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.07]"
        whileHover={{ x: 5 }}
      >
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white">{isEducation ? edu.degree : job.title}</h3>
          <p style={{ color }}>{isEducation ? edu.school : job.company}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mt-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {isEducation ? edu.period : job.period}
            </span>
            {!isEducation && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {job.location}
              </span>
            )}
            {isEducation && (
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${color}20`, color }}>
                {edu.focus}
              </span>
            )}
          </div>
        </div>
        <ul className="space-y-2 text-white/70 text-sm">
          {(isEducation ? edu.highlights : job.highlights).map((highlight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + i * 0.1 }}
              className="flex items-start gap-2"
            >
              <span style={{ color }} className="mt-1.5">●</span>
              {highlight}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export const ResumePage = ({ onBack, onNavigate, onSwitchToOS, onOpenCaseStudy }: ResumePageProps) => {
  // Handler to stay on resume page (since we're already on resume)
  const handleOpenResume = () => {
    // Already on resume page, no action needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={8} size={300} color="#3B82F6" left="10%" top="20%" />
        <FloatingOrb delay={2} duration={10} size={250} color="#A855F7" left="70%" top="10%" />
        <FloatingOrb delay={4} duration={12} size={350} color="#22C55E" left="80%" top="60%" />
        <FloatingOrb delay={1} duration={9} size={200} color="#F59E0B" left="20%" top="70%" />
      </div>

      {/* Navigation */}
      <StandardNavbar
        currentPage="resume"
        onNavigate={(section) => onNavigate(section)}
        onOpenCaseStudy={onOpenCaseStudy}
        onOpenResume={handleOpenResume}
        onSwitchToOS={onSwitchToOS}
        onLogoClick={onBack}
        resumePdfPath="/Resume (2025).pdf"
      />

      {/* Content */}
      <div className="relative pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Hero Header */}
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16 relative"
          >
            {/* Gradient background card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 p-8 md:p-12 border border-white/10"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, #3B82F6, #A855F7, #EC4899, #3B82F6)',
                  backgroundSize: '400% 400%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-yellow-400" size={20} />
                  </motion.span>
                  <span className="text-blue-400 font-medium">UX Design Student</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                >
                  Caylin Yeung
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 leading-relaxed text-lg max-w-2xl mb-6"
                >
                  Third-year UX Design student with 3+ years leading creative teams and developing design systems for award-winning productions. Combining strong visual design skills with human-centered research training.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  {[
                    { icon: MapPin, text: 'Toronto, ON', href: null },
                    { icon: Mail, text: 'caylin.yeung@gmail.com', href: 'mailto:caylin.yeung@gmail.com' },
                    { icon: ExternalLink, text: 'caylin.ca', href: 'https://caylin.ca' },
                  ].map((item) => (
                    <motion.div
                      key={item.text}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all border border-white/10"
                        >
                          <item.icon size={14} />
                          {item.text}
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white/80 border border-white/10">
                          <item.icon size={14} />
                          {item.text}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.header>

          {/* Experience Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                <Briefcase size={24} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Experience</h2>
            </motion.div>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <TimelineItem key={index} item={job} index={index} color="#3B82F6" type="experience" />
              ))}
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <GraduationCap size={24} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">Education</h2>
            </motion.div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <TimelineItem key={index} item={edu} index={index} color="#A855F7" type="education" />
              ))}
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-2 rounded-xl bg-green-500/20 border border-green-500/30">
                <Award size={24} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Skills</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([key, value], sectionIndex) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <value.icon size={16} className={`text-${value.color}-400`} style={{ color: value.color === 'blue' ? '#60A5FA' : value.color === 'purple' ? '#C084FC' : value.color === 'green' ? '#4ADE80' : '#FBBF24' }} />
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                      {key === 'research' ? 'Research Methods' : key === 'analysis' ? 'Analysis & Synthesis' : key === 'tools' ? 'Tools' : 'Soft Skills'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {value.items.map((skill, index) => (
                      <SkillTag key={skill} skill={skill} color={value.color} index={index} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-10 border border-white/10"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-3"
                >
                  See My Work in Action
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-white/60 mb-6 max-w-md mx-auto"
                >
                  Check out my case studies to see how I apply these skills in real UX research projects.
                </motion.p>
                <motion.button
                  onClick={() => onNavigate('work')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/25"
                >
                  <Sparkles size={18} />
                  View Case Studies
                </motion.button>
              </div>
            </motion.div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};
