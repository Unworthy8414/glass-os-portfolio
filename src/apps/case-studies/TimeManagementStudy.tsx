import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard,
    Search,
    Lightbulb,
    PenTool,
    TrendingUp,
    User,
    Clock,
    Target,
    ArrowRight,
    CheckCircle2,
    Check,
    Calendar as CalendarIcon,
    Bell,
    StickyNote,
    List,
    RefreshCw,
    ExternalLink,
    FileText,
    ChevronLeft
} from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { apps } from '../../utils/apps';
import { motion } from 'framer-motion';
import type { CaseStudyProps } from './types';

const glassos = {
    blue: '#0A84FF',
    green: '#30D158',
    red: '#FF453A',
    orange: '#FF9F0A',
    yellow: '#FFD60A',
    purple: '#BF5AF2',
    pink: '#FF375F',
    teal: '#64D2FF',
    indigo: '#5E5CE6',
};

const renderLegend = (data: { color: string; label: string }[]) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3">
        {data.map((item, i) => (
            <div key={i} className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
                <span className="text-white/60">{item.label}</span>
            </div>
        ))}
    </div>
);

const q1Data = [
    { value: 15, label: "Personal", color: glassos.blue },
    { value: 13, label: "Work", color: glassos.teal },
    { value: 6, label: "Collab", color: glassos.orange },
    { value: 5, label: "Academic", color: "#98989D" },
];

const q7Data = [
    { value: 9, label: "Deadlines", color: glassos.blue },
    { value: 9, label: "Breakdown", color: glassos.teal },
    { value: 6, label: "None", color: glassos.orange },
    { value: 1, label: "Blocking", color: "#98989D" },
];

interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const TimeManagementStudy: React.FC<CaseStudyProps> = ({ onBack, isCompact }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPersona, setShowPersona] = useState(false);
    const { launchApp, setFocusModeActive } = useOSStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const triggerFocusMode = () => {
        setFocusModeActive(true);
        setTimeout(() => setFocusModeActive(false), 3000);
    };

    const triggerNotification = () => {
        if (window.confirm("The best way to experience 'Gentle Nudges' is in the live prototype. Launch it now?")) {
            launchPrototype();
        }
    };

    const launchPrototype = () => {
        const calendarApp = apps.find(a => a.id === 'calendar');
        if (calendarApp) {
            launchApp(calendarApp, { forceNew: true });
        }
    };

    const launchFullReport = () => {
        const pdfApp = apps.find(a => a.id === 'pdf');
        if (pdfApp) {
            launchApp(pdfApp, { fileId: 'project-alpha', title: 'UX Research Case Study.pdf', forceNew: true });
        }
    };

    const sections: Section[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: glassos.blue },
        { id: 'research', label: 'Research', icon: Search, color: glassos.purple },
        { id: 'analysis', label: 'Analysis', icon: Lightbulb, color: glassos.yellow },
        { id: 'design', label: 'Design', icon: PenTool, color: glassos.pink },
        { id: 'impact', label: 'Impact', icon: TrendingUp, color: glassos.green },
    ];

    return (
        <div className={`flex w-full h-full bg-[#1e1e1e] text-white font-sans ${isCompact ? 'flex-col' : ''}`}>
            {/* Sidebar */}
            <div className={`${isCompact ? 'w-full border-b h-auto' : 'w-56 border-r h-full'} border-white/10 bg-black/30 flex flex-col shrink-0`}>
                <div className={`p-3 border-b border-white/10 flex items-center gap-2 ${isCompact ? 'justify-between' : ''}`}>
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/50 group" title="Back to Case Studies">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="font-medium text-xs text-white/70 truncate">Time Management App</div>
                    {isCompact && <div className="w-6" />}
                </div>

                <nav className={`${isCompact ? 'flex overflow-x-auto space-x-1 p-2' : 'flex-1 flex-col space-y-0.5 p-2 overflow-y-auto'}`}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`${isCompact ? 'whitespace-nowrap px-3 py-1.5 text-xs flex-none' : 'w-full px-3 py-2 text-xs'} flex items-center gap-2 rounded-lg transition-all font-medium text-left group
                                ${activeTab === section.id
                                    ? 'bg-white/10 text-white border border-white/10'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                                }`}
                        >
                            <section.icon size={isCompact ? 12 : 14} style={{ color: activeTab === section.id ? section.color : 'rgba(255,255,255,0.4)' }} />
                            <span>{section.label}</span>
                            {!isCompact && activeTab === section.id && <ArrowRight size={12} className="ml-auto opacity-40" />}
                        </button>
                    ))}
                </nav>

                {!isCompact && (
                    <div className="p-2 border-t border-white/10 space-y-1.5">
                        <button onClick={launchFullReport} className="w-full py-1.5 px-2 rounded-md text-[10px] flex items-center justify-center gap-1.5 hover:brightness-110 transition-colors" style={{ backgroundColor: `${glassos.blue}33`, border: `1px solid ${glassos.blue}4D`, color: glassos.blue }}>
                            <FileText size={10} />
                            View Full Report
                        </button>
                        <button onClick={() => setShowPersona(!showPersona)} className="w-full py-1.5 px-2 rounded-md text-[10px] flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 transition-colors">
                            <User size={10} />
                            {showPersona ? 'Hide Persona' : 'View Persona: Alex Lee'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
                <div className={`max-w-4xl mx-auto ${isCompact ? 'p-4 space-y-6 pb-16' : 'p-8 space-y-10 pb-20'}`}>

                    {/* PERSONA CARD OVERLAY */}
                    {showPersona && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-0 z-40 mb-6 rounded-xl p-5 border border-white/20 shadow-2xl"
                            style={{ background: `linear-gradient(135deg, #2d2d4a, #1e1e2e)` }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/20 shrink-0" style={{ backgroundColor: glassos.blue }}>AL</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Alex Lee</h3>
                                            <p className="text-xs" style={{ color: `${glassos.teal}B3` }}>32 M | Office Worker | Hybrid Work</p>
                                        </div>
                                        <button onClick={() => setShowPersona(false)} className="text-white/40 hover:text-white/70 text-xs">Close</button>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.blue }}>Goals</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Reduce time wasted on distractions</li>
                                                <li>Avoid procrastinating on non-urgent tasks</li>
                                                <li>Complete all tasks set for the week</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.red }}>Pain Points</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Task switching from coworker interruptions</li>
                                                <li>Low motivation on non-urgent tasks</li>
                                                <li>Using multiple time management tools</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.green }}>Tools & Strategies</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Calendar blocking</li>
                                                <li>Whiteboard for reminders</li>
                                                <li>Prioritizing tasks by urgency</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.orange }}>Distractions</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Texts, emails & social media</li>
                                                <li>Socializing with colleagues</li>
                                                <li>Mobile games</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB CONTENT */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <header className="border-b border-white/10 pb-6">
                                <h1 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-semibold mb-2 text-white/90`}>Time Management App</h1>
                                <p className={`${isCompact ? 'text-sm' : 'text-base'} text-white/50`}>
                                    Designing a time management app aligned with user expectations and actual usage patterns.
                                </p>
                            </header>

                            <div className={`grid gap-3 ${isCompact ? 'grid-cols-2' : 'grid-cols-4'}`}>
                                {[
                                    { label: 'Role', value: 'UX Researcher' },
                                    { label: 'Timeline', value: '3 Months' },
                                    { label: 'Methods', value: 'Focus Groups, Survey' },
                                    { label: 'Team', value: 'Group + Individual' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                        <div className="text-[10px] uppercase text-white/40 font-medium mb-0.5">{item.label}</div>
                                        <div className="text-xs font-medium text-white/80">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className={`grid gap-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                <div className="space-y-3">
                                    <h2 className="text-base font-semibold text-white/90">The Challenge</h2>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Design a time management app that aligns with user expectations. Understand what features users <span style={{ color: glassos.blue }}>truly need</span> versus what they think they need.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border" style={{ backgroundColor: `${glassos.blue}1A`, borderColor: `${glassos.blue}33` }}>
                                    <h3 className="font-medium mb-2 flex items-center gap-2 text-sm" style={{ color: glassos.blue }}>
                                        <Search size={14} /> Research Question
                                    </h3>
                                    <p className="italic text-sm" style={{ color: `${glassos.teal}CC` }}>
                                        "Which tools and strategies do individuals who are good at managing their time use?"
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h3 className="font-medium text-white/80 mb-2 flex items-center gap-2 text-sm">
                                    <Lightbulb size={14} style={{ color: glassos.yellow }} /> Hypothesis
                                </h3>
                                <p className="text-sm text-white/60">
                                    Users are more likely to use a time management app with features customizable to their preferences.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-white/90 mb-3">My Approach</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { num: '1', title: 'Exploratory', sub: 'Focus Group', color: glassos.purple },
                                        { num: '2', title: 'Validation', sub: 'Online Survey', color: glassos.blue },
                                        { num: '3', title: 'In-Context', sub: 'Diary Study', color: glassos.green },
                                    ].map((step) => (
                                        <div key={step.num} className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${step.color}33`, color: step.color }}>{step.num}</div>
                                            <div>
                                                <div className="text-xs font-medium text-white/80">{step.title}</div>
                                                <div className="text-[10px] text-white/40">{step.sub}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'research' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            {/* PHASE 1 */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ backgroundColor: `${glassos.purple}33`, color: glassos.purple }}>Phase 1</span>
                                    <h2 className="text-base font-semibold text-white/90">Focus Group</h2>
                                </div>
                                <p className="text-sm text-white/50">
                                    <strong className="text-white/70">Goal:</strong> Identify user needs, preferences, and feature priorities.
                                </p>

                                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-medium text-white/60">KWHL Table</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="bg-white/5 text-white/40">
                                                    <th className="p-3 font-medium">Know</th>
                                                    <th className="p-3 font-medium">Want to Know</th>
                                                    <th className="p-3 font-medium">How</th>
                                                    <th className="p-3 font-medium">Learned</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                <tr>
                                                    <td className="p-3 text-white/60">People struggle with time management</td>
                                                    <td className="p-3 text-white/60">Effective strategies?</td>
                                                    <td className="p-3 text-white/60">Focus group</td>
                                                    <td className="p-3 text-white/60">Behaviors & habits</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-xs"><StickyNote size={12} /> Challenges</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['Procrastination', 'Too many tasks', 'Forgot my plan', 'Social Media'].map(tag => (
                                                <span key={tag} className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: `${glassos.red}26`, color: glassos.red }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-xs"><StickyNote size={12} /> Solutions</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['Screen time limit', 'To-Do List', 'Reminders', 'Set alarms'].map(tag => (
                                                <span key={tag} className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: `${glassos.yellow}26`, color: glassos.yellow }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-white/10" />

                            {/* PHASE 2 */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ backgroundColor: `${glassos.blue}33`, color: glassos.blue }}>Phase 2</span>
                                    <h2 className="text-base font-semibold text-white/90">Online Survey</h2>
                                </div>

                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                    {[
                                        { label: 'Participants', value: '17', sub: '"Good at time management"' },
                                        { label: 'Platform', value: 'JotForm', sub: '12 Questions' },
                                        { label: 'Focus', value: 'Usage & Features', sub: 'Anti-procrastination' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] text-white/40 uppercase">{item.label}</div>
                                            <div className="text-sm font-medium text-white/80">{item.value}</div>
                                            <div className="text-[10px] text-white/30">{item.sub}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-white/70 text-xs">Q1: Task types managed</h4>
                                        <div className="h-36 flex items-end gap-3 bg-white/5 p-3 pt-6 rounded-lg border border-white/10">
                                            {q1Data.map((item, i) => (
                                                <div key={i} className="flex-1 rounded-t relative" style={{ height: `${Math.round(item.value / 15 * 100)}%`, backgroundColor: item.color }}>
                                                    <span className="absolute -top-4 w-full text-center text-[10px] font-medium text-white/70">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {renderLegend(q1Data)}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-white/70 text-xs">Q7: Anti-procrastination strategy</h4>
                                        <div className="h-36 flex items-end gap-3 bg-white/5 p-3 pt-6 rounded-lg border border-white/10">
                                            {q7Data.map((item, i) => (
                                                <div key={i} className="flex-1 rounded-t relative" style={{ height: `${Math.round(item.value / 9 * 100)}%`, backgroundColor: item.color }}>
                                                    <span className="absolute -top-4 w-full text-center text-[10px] font-medium text-white/70">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {renderLegend(q7Data)}
                                    </div>
                                </div>

                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <h4 className="font-medium text-white/70 mb-2 text-xs">Key Stats</h4>
                                    <ul className="space-y-1.5 text-xs text-white/60">
                                        <li className="flex justify-between">
                                            <span>Use weekly calendar "Several times a day"</span>
                                            <span className="font-medium text-white/80">47%</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Customize features "Rarely"</span>
                                            <span className="font-medium text-white/80">47%</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Believe advanced features increase effectiveness</span>
                                            <span className="font-medium text-white/80">41%</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <div className="border-t border-white/10" />

                            {/* PHASE 3 */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ backgroundColor: `${glassos.green}33`, color: glassos.green }}>Phase 3</span>
                                    <h2 className="text-base font-semibold text-white/90">Diary Study</h2>
                                </div>
                                <p className="text-sm text-white/50">
                                    <strong className="text-white/70">Goal:</strong> Observe real-world behavior over 10 days with 4 participants.
                                </p>

                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 text-xs">Common Distractions</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Social Media', 'Emails', 'Colleagues', 'Family'].map(tag => (
                                                <div key={tag} className="p-2 rounded text-[10px] text-center font-medium" style={{ backgroundColor: `${glassos.pink}26`, color: glassos.pink }}>{tag}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 text-xs">Strategies to Refocus</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['To-Do List', 'Time Constraints', 'Reminders', 'Reprioritizing'].map(tag => (
                                                <div key={tag} className="p-2 rounded text-[10px] text-center font-medium" style={{ backgroundColor: `${glassos.teal}26`, color: glassos.teal }}>{tag}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'analysis' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white/90">Key Findings</h2>
                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {[
                                        { title: "Frequency Drives Engagement", desc: "Users who successfully manage time use tools multiple times daily." },
                                        { title: "Mood Impacts Productivity", desc: "Low mood dramatically increases procrastination." },
                                        { title: "Interruptions Derail Focus", desc: "Users struggle to refocus after interruptions." },
                                        { title: "The Customization Paradox", desc: "Users want flexibility but rarely customize." },
                                        { title: "Breaking Tasks is Key", desc: "Setting deadlines and breaking tasks into smaller steps works best." },
                                        { title: "Weekly Calendar is Essential", desc: "Majority accessed weekly calendar view several times daily." }
                                    ].map((finding, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <h3 className="font-medium mb-1 text-sm" style={{ color: glassos.blue }}>{i + 1}. {finding.title}</h3>
                                            <p className="text-white/50 text-xs">{finding.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="backdrop-blur-sm p-6 rounded-xl border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(30,30,46,0.8), rgba(20,20,35,0.8))' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-semibold text-white/90">Daily Journey Map</h2>
                                    <span className="text-[10px] text-white/40">Persona: Alex Lee</span>
                                </div>
                                <div className="relative border-l pl-6 space-y-5" style={{ borderColor: `${glassos.blue}4D` }}>
                                    {[
                                        { time: "Morning", mood: "Productive", title: "Planning", desc: "Motivated but overwhelmed by full calendar." },
                                        { time: "Mid-Morning", mood: "Distracted", title: "Deep Work", desc: "Digital notifications break concentration." },
                                        { time: "Afternoon", mood: "Low Energy", title: "The Slump", desc: "Social media temptation peaks." },
                                        { time: "Late Afternoon", mood: "Stressed", title: "The Race", desc: "Racing against deadlines." },
                                        { time: "Evening", mood: "Relief", title: "Reflection", desc: "Reviews day and plans ahead." }
                                    ].map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[27px] w-3 h-3 rounded-full border-2" style={{ backgroundColor: glassos.blue, borderColor: '#1e1e2e' }} />
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-medium uppercase" style={{ color: glassos.blue }}>{step.time}</span>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{step.mood}</span>
                                            </div>
                                            <h4 className="font-medium text-sm text-white/80 mb-0.5">{step.title}</h4>
                                            <p className="text-white/40 text-xs">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'design' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-3 text-white/90">Design Recommendations</h2>
                                <p className="text-sm text-white/50 mb-4">Translating insights into actionable features.</p>
                                <button
                                    onClick={launchPrototype}
                                    className="w-full py-3 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm hover:brightness-110"
                                    style={{ backgroundColor: glassos.blue }}
                                >
                                    <ExternalLink size={16} />
                                    Launch "SmartCal" Prototype
                                </button>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: CalendarIcon, color: glassos.purple, title: '1. Smart Calendar', desc: 'Weekly view default. Widget for at-a-glance planning. Drag-and-drop rescheduling.' },
                                    { icon: List, color: glassos.blue, title: '2. Intelligent Task Management', desc: 'Automatically prioritize and break down complex work.' },
                                    { icon: Target, color: glassos.red, title: '3. Focus Protection', desc: 'Do Not Disturb mode. Silence notifications. Visual indicator when in focus.' },
                                ].map((rec, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${rec.color}33`, color: rec.color }}>
                                            <rec.icon size={18} />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <h3 className="text-sm font-medium text-white/90">{rec.title}</h3>
                                            <p className="text-xs text-white/50">{rec.desc}</p>
                                            {i === 2 && (
                                                <button
                                                    onClick={triggerFocusMode}
                                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 text-xs rounded border border-white/10 transition-colors flex items-center gap-1.5"
                                                >
                                                    <Target size={10} />
                                                    Simulate Focus Mode
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={14} style={{ color: glassos.teal }} />
                                        <h4 className="font-medium text-sm text-white/80">4. Time Blocking</h4>
                                    </div>
                                    <p className="text-xs text-white/50 mb-3">Built-in Pomodoro timer. Guided break prompts.</p>
                                    <div className="p-2 rounded text-xs flex items-center gap-2" style={{ backgroundColor: `${glassos.teal}26`, border: `1px solid ${glassos.teal}4D`, color: glassos.teal }}>
                                        <Clock size={12} /> 25:00 Focus Session
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bell size={14} style={{ color: glassos.orange }} />
                                        <h4 className="font-medium text-sm text-white/80">5. Gentle Nudges</h4>
                                    </div>
                                    <p className="text-xs text-white/50 mb-3">Motivational prompts during low-energy periods.</p>
                                    <button
                                        onClick={triggerNotification}
                                        className="text-xs px-2 py-1 rounded flex items-center gap-1.5 hover:brightness-110"
                                        style={{ backgroundColor: `${glassos.orange}26`, border: `1px solid ${glassos.orange}4D`, color: glassos.orange }}
                                    >
                                        <Bell size={10} /> Test Nudge
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h3 className="font-medium text-sm mb-3 flex items-center gap-2 text-white/80">
                                    <RefreshCw size={14} /> System Features
                                </h3>
                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div>
                                        <h4 className="font-medium text-white/70 text-xs mb-1">6. Cross-Device Syncing</h4>
                                        <p className="text-[10px] text-white/40 mb-2">#1 biggest challenge identified.</p>
                                        <div className="flex items-center gap-1.5 text-[10px] p-1.5 rounded" style={{ backgroundColor: `${glassos.blue}26`, border: `1px solid ${glassos.blue}4D`, color: glassos.blue }}>
                                            <RefreshCw size={10} /> Syncing with iPhone...
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white/70 text-xs mb-1">7. Task Replication</h4>
                                        <p className="text-[10px] text-white/40 mb-2">Duplicate recurring tasks easily.</p>
                                        <div className="flex items-center gap-1.5 text-[10px] p-1.5 rounded" style={{ backgroundColor: `${glassos.green}26`, border: `1px solid ${glassos.green}4D`, color: glassos.green }}>
                                            <Check size={10} /> Duplicate "Daily Standup"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'impact' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <section className="bg-white/5 rounded-lg p-6 border border-white/10">
                                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-white/90">
                                    <CheckCircle2 size={16} style={{ color: glassos.green }} /> Research Impact
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-white/60 text-xs uppercase mb-1">Validated Hypothesis?</h3>
                                        <p className="text-sm text-white/80">
                                            <span className="font-medium" style={{ color: glassos.green }}>Yes, with a caveat.</span> Users want customization, but they need <span style={{ color: glassos.blue }}>smart defaults first</span>.
                                        </p>
                                    </div>
                                    <div className="border-t border-white/10 pt-4">
                                        <h3 className="font-medium text-white/60 text-xs uppercase mb-2">Design Principles Uncovered</h3>
                                        <ul className="space-y-1.5 text-xs text-white/60">
                                            <li>1. <strong className="text-white/80">Reduce cognitive load:</strong> Smart defaults over blank slates.</li>
                                            <li>2. <strong className="text-white/80">Protect focus time:</strong> Active interruption management.</li>
                                            <li>3. <strong className="text-white/80">Adapt to mood:</strong> Recognize when users need extra support.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-base font-semibold mb-4 text-white/90">Business Value</h2>
                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                    {[
                                        { title: 'Reduced Risk', desc: 'Validated demand before development.', color: glassos.green },
                                        { title: 'Competitive Edge', desc: 'Differentiation through Focus Mode.', color: glassos.blue },
                                        { title: 'Retention', desc: 'Addressing #1 pain point (syncing).', color: glassos.purple },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: `${item.color}1A`, border: `1px solid ${item.color}33` }}>
                                            <div className="font-medium mb-1 text-sm" style={{ color: item.color }}>{item.title}</div>
                                            <p className="text-xs text-white/50">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className={`grid gap-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                <div>
                                    <h3 className="font-medium text-sm mb-3 text-white/90">Methodology</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.green }}>What Worked Well</div>
                                            <ul className="text-xs text-white/60 list-disc list-inside space-y-0.5">
                                                <li>Recruiting "productive" users for pattern matching</li>
                                                <li>Real-time journaling captured authentic moments</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.orange }}>Challenges</div>
                                            <p className="text-xs text-white/60"><strong className="text-white/70">Challenge:</strong> Low survey response rate.</p>
                                            <p className="text-xs text-white/60"><strong className="text-white/70">Solution:</strong> Recruited previous respondents for diary study.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm mb-3 text-white/90">Next Steps</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.blue }}>What I'd Do Differently</div>
                                            <ul className="text-xs text-white/60 list-disc list-inside space-y-0.5">
                                                <li>Extend diary study to 14 days</li>
                                                <li>Add observational component (screen recording)</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium text-white/40 uppercase mb-1">Planned</div>
                                            <ol className="text-xs text-white/60 list-decimal list-inside space-y-0.5">
                                                <li>Usability Testing</li>
                                                <li>Competitive Analysis</li>
                                                <li>A/B Testing prioritization</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="text-center pt-4 text-white/30 text-xs italic">
                                "This case study demonstrates my ability to design and execute rigorous UX research, synthesize complex data, and deliver recommendations that balance user needs with business objectives."
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
