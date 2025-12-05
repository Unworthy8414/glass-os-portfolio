import { useState } from 'react';
import { ChevronLeft, Monitor, FileText, ExternalLink, Clock3, Users, Target, Lightbulb, TrendingUp, CheckCircle2, Grid, Search, PenTool, LayoutDashboard, User, Calendar, ShoppingCart, MapPin, AlertTriangle, Bell, List, Clock, RefreshCw, StickyNote, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SectionId = 'about' | 'work' | 'contact' | null;

interface StandardCaseStudyProps {
  studyId: string;
  onBack: () => void;
  onNavigate: (section?: SectionId) => void;
  onSwitchToOS: () => void;
  onOpenResume: () => void;
}

// Color palette
const colors = {
  blue: '#3B82F6',
  green: '#22C55E',
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#EAB308',
  purple: '#A855F7',
  pink: '#EC4899',
  teal: '#14B8A6',
  indigo: '#6366F1',
};

// Bar chart component
const BarChart = ({ data, maxValue }: { data: { value: number; label: string; color: string }[], maxValue: number }) => {
  const maxHeight = 120; // pixels
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3 bg-white/5 p-4 pt-8 rounded-lg border border-white/10" style={{ minHeight: '180px' }}>
        {data.map((item, i) => {
          const barHeight = Math.max(8, (item.value / maxValue) * maxHeight);
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-xs font-medium text-white/70 mb-2">{item.value}</span>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {data.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
            <span className="text-white/60">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Journey Map component
const JourneyMap = ({ steps, color }: { steps: { time: string; mood: string; title: string; desc: string }[], color: string }) => (
  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
    <div className="relative border-l-2 pl-6 space-y-6" style={{ borderColor: `${color}66` }}>
      {steps.map((step, i) => (
        <div key={i} className="relative">
          <div
            className="absolute -left-[29px] w-3.5 h-3.5 rounded-full border-2 border-slate-900"
            style={{ backgroundColor: color }}
          />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase" style={{ color }}>{step.time}</span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50">{step.mood}</span>
          </div>
          <h4 className="font-medium text-sm text-white/80 mb-1">{step.title}</h4>
          <p className="text-white/50 text-sm">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Persona component
const PersonaCard = ({ persona }: { persona: { initials: string; name: string; subtitle: string; details?: string; goals: string[]; painPoints: string[]; extra1?: { title: string; items: string[]; color: string }; extra2?: { title: string; items: string[]; color: string }; color: string } }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10">
    <div className="flex items-start gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/20 shrink-0"
        style={{ backgroundColor: persona.color }}
      >
        {persona.initials}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
        <p className="text-sm" style={{ color: colors.teal }}>{persona.subtitle}</p>
        {persona.details && <p className="text-xs text-white/40 mt-1">{persona.details}</p>}

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: colors.blue }}>Goals</h4>
            <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
              {persona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: colors.red }}>Pain Points</h4>
            <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
              {persona.painPoints.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>

        {(persona.extra1 || persona.extra2) && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {persona.extra1 && (
              <div>
                <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: persona.extra1.color }}>{persona.extra1.title}</h4>
                <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
                  {persona.extra1.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
            {persona.extra2 && (
              <div>
                <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: persona.extra2.color }}>{persona.extra2.title}</h4>
                <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
                  {persona.extra2.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Time Management Study Data
const timeManagementData = {
  title: 'Time Management App',
  subtitle: 'UX Research & Strategy',
  role: 'UX Researcher',
  timeline: '3 Months',
  team: 'Group + Individual',
  methods: 'Focus Groups, Survey, Diary Study',
  gradient: 'from-blue-500 to-indigo-600',
  pdfPath: '/Time Management App - UX Research Case Study.pdf',
  challenge: 'Design a time management app that aligns with user expectations. Understand what features users truly need versus what they think they need.',
  researchQuestion: 'Which tools and strategies do individuals who are good at managing their time use?',
  hypothesis: 'Users are more likely to use a time management app with features customizable to their preferences.',
  overview: 'This project explored how young professionals manage their time, identifying key pain points and opportunities for a productivity app that balances flexibility with smart defaults.',

  persona: {
    initials: 'AL',
    name: 'Alex Lee',
    subtitle: '32 M | Office Worker | Hybrid Work',
    goals: ['Reduce time wasted on distractions', 'Avoid procrastinating on non-urgent tasks', 'Complete all tasks set for the week'],
    painPoints: ['Task switching from coworker interruptions', 'Low motivation on non-urgent tasks', 'Using multiple time management tools'],
    extra1: { title: 'Tools & Strategies', items: ['Calendar blocking', 'Whiteboard for reminders', 'Prioritizing tasks by urgency'], color: colors.green },
    extra2: { title: 'Distractions', items: ['Texts, emails & social media', 'Socializing with colleagues', 'Mobile games'], color: colors.orange },
    color: colors.blue
  },

  approach: [
    { num: '1', title: 'Exploratory', sub: 'Focus Group', color: colors.purple },
    { num: '2', title: 'Validation', sub: 'Online Survey (17 participants)', color: colors.blue },
    { num: '3', title: 'In-Context', sub: 'Diary Study (10 days)', color: colors.green },
  ],

  focusGroupChallenges: ['Procrastination', 'Too many tasks', 'Forgot my plan', 'Social Media'],
  focusGroupSolutions: ['Screen time limit', 'To-Do List', 'Reminders', 'Set alarms'],

  surveyData: {
    q1: [
      { value: 15, label: "Personal", color: colors.blue },
      { value: 13, label: "Work", color: colors.teal },
      { value: 6, label: "Collab", color: colors.orange },
      { value: 5, label: "Academic", color: "#6B7280" },
    ],
    q7: [
      { value: 9, label: "Deadlines", color: colors.blue },
      { value: 9, label: "Breakdown", color: colors.teal },
      { value: 6, label: "None", color: colors.orange },
      { value: 1, label: "Blocking", color: "#6B7280" },
    ],
  },

  keyStats: [
    { label: 'Use weekly calendar "Several times a day"', value: '47%' },
    { label: 'Customize features "Rarely"', value: '47%' },
    { label: 'Believe advanced features increase effectiveness', value: '41%' },
  ],

  diaryDistractions: ['Social Media', 'Emails', 'Colleagues', 'Family'],
  diaryStrategies: ['To-Do List', 'Time Constraints', 'Reminders', 'Reprioritizing'],

  keyFindings: [
    { title: 'Frequency Drives Engagement', desc: 'Users who successfully manage time use tools multiple times daily.' },
    { title: 'Mood Impacts Productivity', desc: 'Low mood dramatically increases procrastination.' },
    { title: 'Interruptions Derail Focus', desc: 'Users struggle to refocus after digital interruptions.' },
    { title: 'The Customization Paradox', desc: 'Users want flexibility but rarely customize features.' },
    { title: 'Breaking Tasks is Key', desc: 'Setting deadlines and breaking tasks into smaller steps works best.' },
    { title: 'Weekly Calendar is Essential', desc: 'Majority accessed weekly calendar view several times daily.' },
  ],

  journeyMap: [
    { time: "Morning", mood: "Productive", title: "Planning", desc: "Motivated but overwhelmed by full calendar." },
    { time: "Mid-Morning", mood: "Distracted", title: "Deep Work", desc: "Digital notifications break concentration." },
    { time: "Afternoon", mood: "Low Energy", title: "The Slump", desc: "Social media temptation peaks." },
    { time: "Late Afternoon", mood: "Stressed", title: "The Race", desc: "Racing against deadlines." },
    { time: "Evening", mood: "Relief", title: "Reflection", desc: "Reviews day and plans ahead." }
  ],

  recommendations: [
    { icon: Calendar, color: colors.purple, title: 'Smart Calendar', desc: 'Weekly view default with drag-and-drop rescheduling and widget for at-a-glance planning.' },
    { icon: List, color: colors.blue, title: 'Intelligent Task Management', desc: 'Automatically prioritize and break down complex work into manageable steps.' },
    { icon: Target, color: colors.red, title: 'Focus Protection', desc: 'Do Not Disturb mode with visual indicator and notification silencing.' },
    { icon: Clock, color: colors.teal, title: 'Time Blocking', desc: 'Built-in Pomodoro timer with guided break prompts.' },
    { icon: Bell, color: colors.orange, title: 'Gentle Nudges', desc: 'Motivational prompts during low-energy periods to combat procrastination.' },
    { icon: RefreshCw, color: colors.green, title: 'Cross-Device Syncing', desc: '#1 biggest challenge identified - seamless sync across all devices.' },
  ],

  impact: [
    { title: 'Validated Hypothesis', desc: 'Yes, with a caveat: Users want customization but need smart defaults first.' },
    { title: 'Reduced Risk', desc: 'Validated demand before development investment.' },
    { title: 'Competitive Edge', desc: 'Differentiation through Focus Mode feature.' },
  ],

  designPrinciples: [
    'Reduce cognitive load: Smart defaults over blank slates.',
    'Protect focus time: Active interruption management.',
    'Adapt to mood: Recognize when users need extra support.'
  ],

  methodology: {
    worked: ['Recruiting "productive" users for pattern matching', 'Real-time journaling captured authentic moments'],
    challenges: 'Low survey response rate.',
    solution: 'Recruited previous respondents for diary study.',
    nextSteps: ['Extend diary study to 14 days', 'Add observational component (screen recording)', 'Usability Testing', 'Competitive Analysis']
  }
};

// AGO Digital Study Data
const agoDigitalData = {
  title: 'AGO Digital Experience',
  subtitle: 'Purchase Journey Optimization',
  role: 'Lead UX Researcher',
  timeline: '4 Months',
  team: 'Solo Researcher',
  methods: 'Heuristic Evaluation, User Interviews, Ethnographic Research',
  gradient: 'from-pink-500 to-rose-600',
  pdfPath: '/AGO Digital Experience - UX Research Case Study.pdf',
  challenge: 'The Art Gallery of Ontario wanted to understand their digital user experience but didn\'t have clarity on where issues might exist. My task was to conduct a comprehensive evaluation to uncover usability problems and identify opportunities for improvement.',
  researchQuestion: 'How can we reduce friction in the AGO\'s digital ticket purchase journey while maintaining the cultural experience?',
  hypothesis: 'Streamlining the purchase flow and improving information architecture will increase conversion rates.',
  overview: 'This project examined the digital journey of visitors purchasing tickets for the Art Gallery of Ontario, identifying pain points and opportunities for improvement through mixed-methods research.',

  persona: {
    initials: 'JE',
    name: 'Jessica',
    subtitle: '40 F | Marketing Manager | Toronto, ON',
    details: 'Parent of 2 children (Ages: 5 & 10)',
    goals: ['Know what exhibits suit her children\'s ages', 'Plan logistics (arrival, parking, amenities)', 'Seamlessly purchase tickets'],
    painPoints: ['Searching multiple pages for basic info', 'Mandatory account creation', 'Hidden policies & fees'],
    extra1: { title: 'Motivations', items: ['Create meaningful experiences for children', 'Maximize time with efficient planning', 'Support arts and local community'], color: colors.green },
    extra2: { title: 'Behaviour', items: ['Researches on mobile during commute', 'Checks reviews before committing', 'Abandons cart if checkout > 3 min'], color: colors.orange },
    color: colors.pink
  },

  approach: [
    { num: '1', title: 'Competitive Analysis', sub: 'Heuristic Evaluation', color: colors.purple },
    { num: '2', title: 'User Interviews', sub: '6 In-depth Sessions', color: colors.blue },
    { num: '3', title: 'Ethnographic Research', sub: 'On-site Observation', color: colors.green },
  ],

  competitors: ['Art Gallery of Ontario', 'The Metropolitan Museum of Art', 'The British Museum'],

  siteIssues: [
    { title: 'Missing Digital Experiences', desc: 'AGO lacked virtual tours and digital collection access that competitors offered', color: colors.red },
    { title: 'Unintuitive Website Design', desc: 'Confusing navigation, poor information architecture, interface friction', color: colors.orange },
    { title: 'Weak Purchase Conversion', desc: 'Inefficient purchase flows causing user drop-off - became primary focus', color: colors.yellow },
  ],

  hypothesesTested: [
    'Cart editing from any page increases conversion',
    'Forced account creation increases abandonment',
    'Users prefer calendar button over list button',
    'Users prefer date picker matching real-life models',
    'Users prefer monthly view for ticket booking',
    'Seeing events on calendar increases conversion'
  ],

  observationAreas: ['Entrance & Wayfinding', 'Ticket Information', 'Purchase Process', 'User Emotions'],

  keyFindings: [
    {
      title: "Account Creation Barriers",
      items: ['Complex account creation process', 'Security and privacy concerns', 'Difficult password management', 'Forced account creation at checkout'],
      quote: '"Why do I need to create an account just to buy a ticket?"',
      color: colors.red
    },
    {
      title: "Cart Management Issues",
      items: ['Cart sessions expiring too quickly', 'Inability to edit cart efficiently', 'Long, complex checkout process', 'Poor cart customization'],
      color: colors.orange
    },
    {
      title: "Ticket Booking Complexity",
      items: ['Over-simplified calendar lacking info', 'Unintuitive time slot booking', 'Missing system status indicators', 'Fees not displayed upfront'],
      color: colors.yellow
    },
    {
      title: "Information Architecture",
      items: ['Disorganized site structure', 'Critical information hidden', 'Lack of clear wayfinding', 'Users depend on staff for basic info'],
      color: colors.purple
    },
  ],

  journeyMap: [
    { time: "Pre-Planning", mood: "Confused", title: "Research Phase", desc: "Information split across multiple pages. Parking details buried." },
    { time: "Online Purchase", mood: "Frustrated", title: "Checkout Struggle", desc: "+5 step checkout vs expected 2-3. Forced account creation." },
    { time: "Arriving On-Site", mood: "Overwhelmed", title: "Finding Way", desc: "No clear signage. Users ask staff for directions. Info desk congestion." },
    { time: "In-Person Purchase", mood: "Relieved", title: "Quick Transaction", desc: "Fast transaction. Payment processed quickly. Receives tickets." },
    { time: "Exploring Gallery", mood: "Lost", title: "Navigation", desc: "Museum wayfinding unclear. No digital gallery guide. Uses printed map." }
  ],

  cognitiveDissonance: 'Ethnographic research revealed that the physical ticket purchase was easy (2-3 minutes, clear process) while the digital experience was frustrating (+5 steps, account required). This mismatch creates negative brand perception before visitors even arrive.',

  recommendations: [
    { icon: User, color: colors.blue, title: 'Account Creation', items: ['Implement guest checkout option', 'Reduce required personal information', 'Provide clear value proposition for accounts', 'Improve password management UX'] },
    { icon: ShoppingCart, color: colors.green, title: 'Cart Management', items: ['Extend cart session timeout', 'Enable in-cart editing without restarting', 'Streamline checkout to reduce steps', 'Add cart saving functionality'] },
    { icon: Calendar, color: colors.purple, title: 'Ticket Booking', items: ['Redesign calendar to show events clearly', 'Add system status indicators', 'Display all fees upfront', 'Align digital with physical mental models'] },
    { icon: MapPin, color: colors.orange, title: 'Information Architecture', items: ['Reorganize site for intuitive trip planning', 'Develop clear content strategy', 'Improve search and filtering', 'Add digital wayfinding resources'] },
  ],

  quickWins: [
    { title: 'Guest Checkout', desc: 'Immediate reduction in cart abandonment' },
    { title: 'Extended Cart Timeout', desc: 'Let users return to complete purchase' },
    { title: 'Upfront Fee Display', desc: 'Build trust, reduce checkout surprises' },
  ],

  validatedHypotheses: [
    'Forced account creation during checkout increases cart abandonment',
    'Users prefer calendar views that show available events clearly',
    'Cart editing capabilities directly impact conversion rates',
    'Cognitive dissonance between physical and digital experiences negatively impacts satisfaction'
  ],

  businessValue: [
    { title: 'Revenue Impact', items: ['Clear roadmap to reduce cart abandonment', 'Opportunity to convert visitors into members', 'Decrease dependency on in-person sales'], color: colors.green },
    { title: 'Competitive Positioning', items: ['Insights vs leading cultural institutions', 'Strategic recommendations to match standards', 'Unique opportunities identified'], color: colors.blue },
    { title: 'User Experience & Brand', items: ['Data-driven understanding of frustrations', 'Prioritized improvements for satisfaction', 'Framework for consistent experiences'], color: colors.purple },
    { title: 'Operational Efficiency', items: ['Reduced burden on front desk staff', 'Better traffic flow in physical space', 'Foundation for future product decisions'], color: colors.orange },
  ],

  methodology: {
    worked: ['Mixed-method approach provided comprehensive insights', 'Ethnographic research revealed unexpected findings', 'Affinity mapping enabled efficient synthesis'],
    challenges: ['Participant no-shows: Recruited 2 extra participants', 'Technical issues: Tested all tech before interviews', 'Site access: Prepared official research letter'],
    nextSteps: ['Prioritize quick wins: Guest checkout, extended timeout', 'Usability testing on redesigned flows', 'Monitor conversion rates post-implementation']
  }
};

export const StandardCaseStudy = ({ studyId, onBack, onNavigate, onSwitchToOS, onOpenResume }: StandardCaseStudyProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTimeMgmt = studyId === 'time-mgmt';
  const data = isTimeMgmt ? timeManagementData : agoDigitalData;

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>Case study not found</p>
      </div>
    );
  }

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
            <span className="text-sm text-white font-medium">Work</span>
            <button onClick={onOpenResume} className="text-sm text-white/70 hover:text-white transition-colors">Resume</button>
            <button onClick={() => onNavigate('contact')} className="text-sm text-white/70 hover:text-white transition-colors">Contact</button>
            <a
              href={data.pdfPath}
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
            >
              <FileText size={14} />
              <span>Full Report</span>
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
                <span className="block w-full text-left text-white font-medium py-2">Work</span>
                <button onClick={() => { setMobileMenuOpen(false); onOpenResume(); }} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Resume</button>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('contact'); }} className="block w-full text-left text-white/70 hover:text-white transition-colors py-2">Contact</button>
                <a
                  href={data.pdfPath}
                  target="_blank"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors py-2"
                >
                  <FileText size={16} />
                  <span>Full Report</span>
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
        <div className="max-w-5xl mx-auto space-y-16">

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: OVERVIEW */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${colors.blue}33` }}>
                <LayoutDashboard size={16} style={{ color: colors.blue }} />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.blue }}>01 / Overview</h2>
            </div>

            {/* Hero */}
            <div className={`h-48 bg-gradient-to-br ${data.gradient} rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              {isTimeMgmt ? (
                <Clock3 className="text-white w-20 h-20 relative z-10 drop-shadow-lg" />
              ) : (
                <Grid className="text-white w-20 h-20 relative z-10 drop-shadow-lg" />
              )}
            </div>

            <p className="text-blue-400 font-medium mb-2">{data.subtitle}</p>
            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8">{data.overview}</p>

            {/* Meta info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Role', value: data.role },
                { label: 'Timeline', value: data.timeline },
                { label: 'Team', value: data.team },
                { label: 'Methods', value: data.methods },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">{item.label}</div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Challenge & Research Question */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-3">The Challenge</h3>
                <p className="text-sm text-white/60 leading-relaxed">{data.challenge}</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                  <Search size={14} /> Research Question
                </h4>
                <p className="text-white/80 italic">"{data.researchQuestion}"</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8">
              <h4 className="font-medium text-white/80 mb-2 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" />
                Hypothesis
              </h4>
              <p className="text-white/60">{data.hypothesis}</p>
            </div>

            {/* Approach */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-4">My Approach</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {data.approach.map((step) => (
                  <div key={step.num} className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: `${step.color}33`, color: step.color }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <div className="font-medium text-white/80">{step.title}</div>
                      <div className="text-sm text-white/50">{step.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: RESEARCH */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${colors.purple}33` }}>
                <Search size={16} style={{ color: colors.purple }} />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.purple }}>02 / Research</h2>
            </div>

            {isTimeMgmt ? (
              <div className="space-y-12">
                {/* Phase 1: Focus Group */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.purple}33`, color: colors.purple }}>Phase 1</span>
                    <h3 className="text-xl font-semibold text-white/90">Focus Group</h3>
                  </div>
                  <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Identify user needs, preferences, and feature priorities.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} /> Challenges Identified</h4>
                      <div className="flex flex-wrap gap-2">
                        {timeManagementData.focusGroupChallenges.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.red}26`, color: colors.red }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} /> Solutions Mentioned</h4>
                      <div className="flex flex-wrap gap-2">
                        {timeManagementData.focusGroupSolutions.map(tag => (
                          <span key={tag} className="px-3 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.yellow}26`, color: colors.yellow }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* Phase 2: Survey */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.blue}33`, color: colors.blue }}>Phase 2</span>
                    <h3 className="text-xl font-semibold text-white/90">Online Survey</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Participants', value: '17', sub: '"Good at time management"' },
                      { label: 'Platform', value: 'JotForm', sub: '12 Questions' },
                      { label: 'Focus', value: 'Usage & Features', sub: 'Anti-procrastination' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-xs text-white/40 uppercase">{item.label}</div>
                        <div className="text-lg font-medium text-white/80">{item.value}</div>
                        <div className="text-xs text-white/40">{item.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bar Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-white/70 mb-3 text-sm">Q1: Task types managed</h4>
                      <BarChart data={timeManagementData.surveyData.q1} maxValue={15} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white/70 mb-3 text-sm">Q7: Anti-procrastination strategy</h4>
                      <BarChart data={timeManagementData.surveyData.q7} maxValue={9} />
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white/70 mb-3 text-sm">Key Stats</h4>
                    <div className="space-y-2">
                      {timeManagementData.keyStats.map((stat, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-white/60">{stat.label}</span>
                          <span className="font-medium text-white/80">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* Phase 3: Diary Study */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.green}33`, color: colors.green }}>Phase 3</span>
                    <h3 className="text-xl font-semibold text-white/90">Diary Study</h3>
                  </div>
                  <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Observe real-world behavior over 10 days with 4 participants.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 text-sm">Common Distractions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {timeManagementData.diaryDistractions.map(tag => (
                          <div key={tag} className="p-2 rounded text-sm text-center font-medium" style={{ backgroundColor: `${colors.pink}26`, color: colors.pink }}>{tag}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 text-sm">Strategies to Refocus</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {timeManagementData.diaryStrategies.map(tag => (
                          <div key={tag} className="p-2 rounded text-sm text-center font-medium" style={{ backgroundColor: `${colors.teal}26`, color: colors.teal }}>{tag}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Phase 1: Competitive Analysis */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.purple}33`, color: colors.purple }}>Phase 1</span>
                    <h3 className="text-xl font-semibold text-white/90">Competitive Analysis & Heuristic Evaluation</h3>
                  </div>
                  <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Understand AGO's position in the market and identify usability issues across the entire site.</p>

                  <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-4">
                    <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><Users size={14} style={{ color: colors.purple }} /> Competitors Analyzed</h4>
                    <div className="flex flex-wrap gap-2">
                      {agoDigitalData.competitors.map(tag => (
                        <span key={tag} className="px-3 py-1.5 rounded text-sm" style={{ backgroundColor: `${colors.purple}26`, color: colors.purple }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white/70 mb-4 flex items-center gap-2 text-sm"><AlertTriangle size={14} style={{ color: colors.orange }} /> Initial Discovery: Site-Wide Issues</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {agoDigitalData.siteIssues.map((issue, i) => (
                        <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: `${issue.color}1A`, border: `1px solid ${issue.color}33` }}>
                          <div className="font-medium mb-1 text-sm" style={{ color: issue.color }}>{issue.title}</div>
                          <p className="text-xs text-white/50">{issue.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* Phase 2: User Interviews */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.blue}33`, color: colors.blue }}>Phase 2</span>
                    <h3 className="text-xl font-semibold text-white/90">User Interviews</h3>
                  </div>
                  <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Understand user experiences, behaviors, and pain points specifically within the purchase journey.</p>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Participants', value: '6', sub: '1-hour in-depth interviews' },
                      { label: 'Focus', value: 'Purchase Journey', sub: 'Cart, checkout, booking' },
                      { label: 'Synthesis', value: 'Affinity Mapping', sub: 'Thematic analysis' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-xs text-white/40 uppercase">{item.label}</div>
                        <div className="text-lg font-medium text-white/80">{item.value}</div>
                        <div className="text-xs text-white/40">{item.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white/70 mb-3 text-sm">Hypotheses Tested</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {agoDigitalData.hypothesesTested.map((hyp, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: `${colors.blue}33`, color: colors.blue }}>{i + 1}</span>
                          {hyp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10" />

                {/* Phase 3: Ethnographic Research */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium uppercase" style={{ backgroundColor: `${colors.green}33`, color: colors.green }}>Phase 3</span>
                    <h3 className="text-xl font-semibold text-white/90">Ethnographic Research</h3>
                  </div>
                  <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Understand the disconnect between physical and digital purchasing experiences.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><MapPin size={14} style={{ color: colors.green }} /> Observation Focus Areas</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {agoDigitalData.observationAreas.map(tag => (
                          <div key={tag} className="p-2 rounded text-sm text-center font-medium" style={{ backgroundColor: `${colors.green}26`, color: colors.green }}>{tag}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                      <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><Target size={14} style={{ color: colors.teal }} /> Key Observation</h4>
                      <p className="text-sm text-white/60 italic">
                        "Significant differences between the smooth physical ticket purchasing experience and the frustrating digital experience, creating misaligned mental models."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 3: ANALYSIS / FINDINGS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${colors.yellow}33` }}>
                <Lightbulb size={16} style={{ color: colors.yellow }} />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.yellow }}>03 / {isTimeMgmt ? 'Analysis' : 'Findings'}</h2>
            </div>

            <div className="space-y-8">
              {/* Key Findings */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white/90">Key Findings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {isTimeMgmt ? (
                    timeManagementData.keyFindings.map((finding, i) => (
                      <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10">
                        <h4 className="font-medium text-blue-400 mb-2">{i + 1}. {finding.title}</h4>
                        <p className="text-sm text-white/60">{finding.desc}</p>
                      </div>
                    ))
                  ) : (
                    agoDigitalData.keyFindings.map((finding, i) => (
                      <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10">
                        <h4 className="font-medium mb-2" style={{ color: finding.color }}>{i + 1}. {finding.title}</h4>
                        <ul className="text-sm text-white/60 space-y-1 list-disc list-inside mb-2">
                          {finding.items.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                        {finding.quote && (
                          <p className="text-xs italic text-white/40 border-l-2 pl-2" style={{ borderColor: finding.color }}>
                            {finding.quote}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Persona */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white/90">User Persona</h3>
                <PersonaCard persona={data.persona} />
              </div>

              {/* Journey Map */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white/90">
                  {isTimeMgmt ? 'Daily Journey Map' : 'User Journey Map: AGO Purchase Path'}
                </h3>
                <JourneyMap
                  steps={isTimeMgmt ? timeManagementData.journeyMap : agoDigitalData.journeyMap}
                  color={isTimeMgmt ? colors.blue : colors.pink}
                />
              </div>

              {/* Cognitive Dissonance (AGO only) */}
              {!isTimeMgmt && (
                <div className="p-5 rounded-xl border" style={{ backgroundColor: `${colors.teal}1A`, borderColor: `${colors.teal}33` }}>
                  <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: colors.teal }}>
                    <Lightbulb size={14} /> Cognitive Dissonance Discovery
                  </h4>
                  <p className="text-sm text-white/60">{agoDigitalData.cognitiveDissonance}</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 4: DESIGN / RECOMMENDATIONS */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${colors.pink}33` }}>
                <PenTool size={16} style={{ color: colors.pink }} />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.pink }}>04 / {isTimeMgmt ? 'Design' : 'Recommendations'}</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white/90">Design Recommendations</h3>
                <p className="text-white/60 mb-6">Translating insights into actionable features.</p>
              </div>

              <div className="space-y-6">
                {isTimeMgmt ? (
                  timeManagementData.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${rec.color}33`, color: rec.color }}>
                        <rec.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white/90 mb-1">{rec.title}</h4>
                        <p className="text-sm text-white/60">{rec.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  agoDigitalData.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${rec.color}33`, color: rec.color }}>
                        <rec.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white/90 mb-2">{rec.title}</h4>
                        <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
                          {rec.items.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Wins (AGO only) */}
              {!isTimeMgmt && (
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h4 className="font-medium text-white/80 mb-4">Quick Wins (High Impact, Low Effort)</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {agoDigitalData.quickWins.map((win, i) => (
                      <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: `${colors.green}1A`, border: `1px solid ${colors.green}33` }}>
                        <div className="font-medium mb-1 text-sm" style={{ color: colors.green }}>{win.title}</div>
                        <p className="text-xs text-white/50">{win.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* SECTION 5: IMPACT */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${colors.green}33` }}>
                <TrendingUp size={16} style={{ color: colors.green }} />
              </div>
              <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.green }}>05 / Impact</h2>
            </div>

            <div className="space-y-8">
              {/* Research Impact */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white/90">
                  <CheckCircle2 size={18} style={{ color: colors.green }} />
                  {isTimeMgmt ? 'Research Impact' : 'Validated Hypotheses'}
                </h3>
                {isTimeMgmt ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white/60 text-sm uppercase mb-1">Validated Hypothesis?</h4>
                      <p className="text-white/80">
                        <span className="font-medium" style={{ color: colors.green }}>Yes, with a caveat.</span> Users want customization, but they need <span style={{ color: colors.blue }}>smart defaults first</span>.
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-medium text-white/60 text-sm uppercase mb-2">Design Principles Uncovered</h4>
                      <ul className="space-y-1 text-sm text-white/60">
                        {timeManagementData.designPrinciples.map((principle, i) => (
                          <li key={i}>{i + 1}. {principle}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agoDigitalData.validatedHypotheses.map((hyp, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 size={14} style={{ color: colors.green }} />
                        {hyp}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Value */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white/90">Business Value</h3>
                <div className={`grid gap-4 ${isTimeMgmt ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                  {isTimeMgmt ? (
                    timeManagementData.impact.map((item, i) => (
                      <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: `${colors.green}1A`, border: `1px solid ${colors.green}33` }}>
                        <div className="font-medium mb-1" style={{ color: colors.green }}>{item.title}</div>
                        <p className="text-sm text-white/60">{item.desc}</p>
                      </div>
                    ))
                  ) : (
                    agoDigitalData.businessValue.map((item, i) => (
                      <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: `${item.color}1A`, border: `1px solid ${item.color}33` }}>
                        <div className="font-medium mb-2" style={{ color: item.color }}>{item.title}</div>
                        <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
                          {item.items.map((li, j) => <li key={j}>{li}</li>)}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Methodology & Next Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-white/90">Methodology</h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-xs font-medium uppercase mb-2" style={{ color: colors.green }}>What Worked Well</div>
                      <ul className="text-sm text-white/60 list-disc list-inside space-y-1">
                        {(isTimeMgmt ? timeManagementData.methodology.worked : agoDigitalData.methodology.worked).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-xs font-medium uppercase mb-2" style={{ color: colors.orange }}>Challenges</div>
                      {isTimeMgmt ? (
                        <>
                          <p className="text-sm text-white/60"><strong className="text-white/70">Challenge:</strong> {timeManagementData.methodology.challenges}</p>
                          <p className="text-sm text-white/60"><strong className="text-white/70">Solution:</strong> {timeManagementData.methodology.solution}</p>
                        </>
                      ) : (
                        <ul className="text-sm text-white/60 list-disc list-inside space-y-1">
                          {agoDigitalData.methodology.challenges.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-white/90">Next Steps</h4>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="text-xs font-medium text-white/40 uppercase mb-2">Recommended Actions</div>
                    <ol className="text-sm text-white/60 list-decimal list-inside space-y-1">
                      {(isTimeMgmt ? timeManagementData.methodology.nextSteps : agoDigitalData.methodology.nextSteps).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center pt-4 text-white/30 text-sm italic">
                "This case study demonstrates my ability to design and execute rigorous UX research, synthesize complex data, and deliver recommendations that balance user needs with business objectives."
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12 border-t border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-4">Want the full details?</h2>
            <p className="text-white/60 mb-6">
              Download the complete case study PDF with all research data and appendices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={data.pdfPath}
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
              >
                <ExternalLink size={18} />
                View Full Report
              </a>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
              >
                <ChevronLeft size={18} />
                Back to Portfolio
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};
