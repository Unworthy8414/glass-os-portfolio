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
  research: { items: ['User Interviews', 'Contextual Inquiry', 'Ethnography', 'Diary Studies', 'Surveys', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation', 'Card Sorting', 'Tree Testing'], color: 'verdigris', icon: Users },
  analysis: { items: ['Affinity Mapping', 'User Personas', 'Journey Mapping', 'Task Analysis', 'Service Blueprint', 'Competitive Analysis', 'SWOT Analysis'], color: 'charcoal', icon: Sparkles },
  tools: { items: ['Figma', 'Adobe XD', 'Framer', 'Miro', 'Figjam', 'Photoshop', 'Illustrator', 'Zbrush', 'Blender'], color: 'jasmine', icon: Code2 },
  soft: { items: ['Stakeholder Collaboration', 'Cross-functional Coordination', 'Design Systems', 'Visual Communication', 'Documentation'], color: 'sandy', icon: Palette }
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
    verdigris: 'bg-[#2a9d8f]/20 text-[#2a9d8f] border-[#2a9d8f]/30 hover:bg-[#2a9d8f]/30 hover:border-[#2a9d8f]/50 hover:shadow-[#2a9d8f]/20',
    charcoal: 'bg-[#2a9d8f]/20 text-[#2a9d8f] border-[#2a9d8f]/30 hover:bg-[#2a9d8f]/30 hover:border-[#2a9d8f]/50 hover:shadow-[#2a9d8f]/20',
    jasmine: 'bg-[#e9c46a]/20 text-[#e9c46a] border-[#e9c46a]/30 hover:bg-[#e9c46a]/30 hover:border-[#e9c46a]/50 hover:shadow-[#e9c46a]/20',
    sandy: 'bg-[#f4a261]/20 text-[#f4a261] border-[#f4a261]/30 hover:bg-[#f4a261]/30 hover:border-[#f4a261]/50 hover:shadow-[#f4a261]/20',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`px-3 py-1.5 rounded-lg text-sm border cursor-default transition-all duration-300 hover:shadow-lg font-body ${colorClasses[color]}`}
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
          <h3 className="text-lg font-heading text-white">{isEducation ? edu.degree : job.title}</h3>
          <p className="font-display" style={{ color }}>{isEducation ? edu.school : job.company}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mt-2 font-body">
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
              <span className="px-2 py-0.5 rounded-full text-xs font-display" style={{ backgroundColor: `${color}20`, color }}>
                {edu.focus}
              </span>
            )}
          </div>
        </div>
        <ul className="space-y-2 text-white/70 text-sm font-body">
          {(isEducation ? edu.highlights : job.highlights).map((highlight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + i * 0.1 }}
              className="flex items-start gap-2"
            >
              <span style={{ color }} className="flex-shrink-0 leading-relaxed">●</span>
              <span className="leading-relaxed">{highlight}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a32] via-[#162229] to-[#0f171b] text-white overflow-x-hidden">
      {/* Animated background orbs - glassos palette */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={0} duration={8} size={300} color="#264653" left="10%" top="20%" />
        <FloatingOrb delay={2} duration={10} size={250} color="#2a9d8f" left="70%" top="10%" />
        <FloatingOrb delay={4} duration={12} size={350} color="#e9c46a" left="80%" top="60%" />
        <FloatingOrb delay={1} duration={9} size={200} color="#f4a261" left="20%" top="70%" />
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
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#264653]/30 via-[#2a9d8f]/20 to-[#e9c46a]/20 p-8 md:p-12 border border-white/10"
            >
              {/* Animated gradient overlay */}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
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
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-heading mb-4 bg-gradient-to-r from-white via-[#e9c46a]/30 to-[#2a9d8f]/30 bg-clip-text text-transparent"
                >
                  Caylin Yeung
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 leading-relaxed text-lg max-w-2xl mb-6 font-body"
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
              <div className="p-2 rounded-xl bg-[#2a9d8f]/20 border border-[#2a9d8f]/30">
                <Briefcase size={24} className="text-[#2a9d8f]" />
              </div>
              <h2 className="text-2xl font-heading">Experience</h2>
            </motion.div>
            <div className="space-y-6">
              {experience.map((job, index) => (
                <TimelineItem key={index} item={job} index={index} color="#2a9d8f" type="experience" />
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
              <div className="p-2 rounded-xl bg-[#2a9d8f]/20 border border-[#2a9d8f]/30">
                <GraduationCap size={24} className="text-[#2a9d8f]" />
              </div>
              <h2 className="text-2xl font-heading">Education</h2>
            </motion.div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <TimelineItem key={index} item={edu} index={index} color="#2a9d8f" type="education" />
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
              <div className="p-2 rounded-xl bg-[#e9c46a]/20 border border-[#e9c46a]/30">
                <Award size={24} className="text-[#e9c46a]" />
              </div>
              <h2 className="text-2xl font-heading">Skills</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([key, value], sectionIndex) => {
                const iconColors: Record<string, string> = {
                  verdigris: '#2a9d8f',
                  charcoal: '#2a9d8f',
                  jasmine: '#e9c46a',
                  sandy: '#f4a261'
                };
                return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <value.icon size={16} style={{ color: iconColors[value.color] }} />
                    <h3 className="text-sm font-heading text-white/70 uppercase tracking-wider">
                      {key === 'research' ? 'Research Methods' : key === 'analysis' ? 'Analysis & Synthesis' : key === 'tools' ? 'Tools' : 'Soft Skills'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {value.items.map((skill, index) => (
                      <SkillTag key={skill} skill={skill} color={value.color} index={index} />
                    ))}
                  </div>
                </motion.div>
              );})}
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
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#264653]/30 via-[#2a9d8f]/20 to-[#e9c46a]/20 p-10 border border-white/10"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(42, 157, 143, 0.1) 0%, transparent 50%)',
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
                  className="text-2xl font-heading mb-3"
                >
                  See My Work in Action
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-white/60 mb-6 max-w-md mx-auto font-body"
                >
                  Check out my case studies to see how I apply these skills in real UX research projects.
                </motion.p>
                <motion.button
                  onClick={() => onNavigate('work')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-xl font-semibold font-display transition-colors shadow-lg shadow-[#2a9d8f]/25"
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
