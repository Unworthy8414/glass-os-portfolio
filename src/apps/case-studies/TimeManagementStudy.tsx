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
    CheckCircle2,
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
import type { CaseStudyProps } from './types';

// New color palette
const glassos = {
    charcoal: '#264653',
    verdigris: '#2a9d8f',
    jasmine: '#e9c46a',
    sandy: '#f4a261',
    burnt: '#e76f51',
    // Convenience mappings
    blue: '#264653',
    green: '#2a9d8f',
    red: '#e76f51',
    orange: '#f4a261',
    yellow: '#e9c46a',
    purple: '#2a9d8f',
    pink: '#e76f51',
    teal: '#2a9d8f',
    indigo: '#264653',
};

const renderLegend = (data: { color: string; label: string }[]) => (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3">
        {data.map((item, i) => (
            <div key={i} className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.label}</span>
            </div>
        ))}
    </div>
);

const q1Data = [
    { value: 15, label: "Personal", color: glassos.charcoal },
    { value: 13, label: "Work", color: glassos.verdigris },
    { value: 6, label: "Collab", color: glassos.sandy },
    { value: 5, label: "Academic", color: "#98989D" },
];

const q7Data = [
    { value: 9, label: "Deadlines", color: glassos.charcoal },
    { value: 9, label: "Breakdown", color: glassos.verdigris },
    { value: 6, label: "None", color: glassos.sandy },
    { value: 1, label: "Blocking", color: "#98989D" },
];

interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const TimeManagementStudy: React.FC<CaseStudyProps> = ({ onBack, isCompact }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [showPersona, setShowPersona] = useState(false);
    const { launchApp, setFocusModeActive } = useOSStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Scroll-spy: track which section is in view
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const observerOptions = {
            root: scrollContainer,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (sectionId: string) => {
        const section = sectionRefs.current[sectionId];
        if (section && scrollRef.current) {
            const containerTop = scrollRef.current.getBoundingClientRect().top;
            const sectionTop = section.getBoundingClientRect().top;
            const offset = sectionTop - containerTop + scrollRef.current.scrollTop - 24;
            scrollRef.current.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

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
            launchApp(pdfApp, { fileId: 'project-alpha', title: 'Time Management App - UX Research Case Study.pdf', forceNew: true });
        }
    };

    const sections: Section[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: glassos.blue },
        { id: 'research', label: 'Research', icon: Search, color: glassos.purple },
        { id: 'findings', label: 'Findings', icon: Lightbulb, color: glassos.yellow },
        { id: 'recommendations', label: 'Recommendations', icon: PenTool, color: glassos.pink },
        { id: 'impact', label: 'Impact', icon: TrendingUp, color: glassos.green },
    ];

    return (
        <div className={`flex w-full h-full bg-white text-gray-800 font-body ${isCompact ? 'flex-col' : ''}`}>
            {/* Sidebar - now acts as scroll-spy navigation */}
            <div className={`${isCompact ? 'w-full border-b h-auto' : 'w-56 border-r h-full'} border-gray-200 bg-gray-50 flex flex-col shrink-0`}>
                <div className={`p-3 border-b border-gray-200 flex items-center gap-2 ${isCompact ? 'justify-between' : ''}`}>
                    <button onClick={onBack} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 group" title="Back to Case Studies">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="font-display font-semibold text-sm text-gray-700 truncate">Time Management App</div>
                    {isCompact && <div className="w-6" />}
                </div>

                <nav className={`${isCompact ? 'flex overflow-x-auto space-x-1 p-2' : 'flex-1 flex-col space-y-0.5 p-2 overflow-y-auto'}`}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`${isCompact ? 'whitespace-nowrap px-3 py-1.5 text-xs flex-none' : 'w-full px-3 py-2 text-sm'} flex items-center gap-2 rounded-lg transition-all font-medium text-left group
                                ${activeSection === section.id
                                    ? 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                        >
                            <section.icon size={isCompact ? 12 : 14} style={{ color: activeSection === section.id ? section.color : 'rgba(100,100,100,0.6)' }} />
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>

                {!isCompact && (
                    <div className="p-3 border-t border-gray-200 space-y-2">
                        <button onClick={launchFullReport} className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors shadow-sm" style={{ backgroundColor: glassos.charcoal, color: 'white' }}>
                            <FileText size={14} />
                            View Full Report
                        </button>
                        <button onClick={() => setShowPersona(!showPersona)} className="w-full py-2.5 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700 transition-colors">
                            <User size={14} />
                            {showPersona ? 'Hide Persona' : 'View Persona'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content - continuous scroll, full width */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative bg-white">
                <div className={`w-full ${isCompact ? 'p-4 pb-16' : 'p-8 pb-20'}`}>

                    {/* PERSONA CARD OVERLAY */}
                    {showPersona && (
                        <div
                            className="sticky top-0 z-40 mb-8 rounded-xl p-5 border border-gray-200 shadow-lg max-w-4xl bg-white"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-heading text-white border-2 border-gray-200 shrink-0" style={{ backgroundColor: glassos.charcoal }}>AL</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-heading text-gray-800">Alex Lee</h3>
                                            <p className="text-xs" style={{ color: glassos.verdigris }}>32 M | Office Worker | Hybrid Work</p>
                                        </div>
                                        <button onClick={() => setShowPersona(false)} className="text-gray-400 hover:text-gray-600 text-xs">Close</button>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.charcoal }}>Goals</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Reduce time wasted on distractions</li>
                                                <li>Avoid procrastinating on non-urgent tasks</li>
                                                <li>Complete all tasks set for the week</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.burnt }}>Pain Points</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Task switching from coworker interruptions</li>
                                                <li>Low motivation on non-urgent tasks</li>
                                                <li>Using multiple time management tools</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.verdigris }}>Tools & Strategies</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Calendar blocking</li>
                                                <li>Whiteboard for reminders</li>
                                                <li>Prioritizing tasks by urgency</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.sandy }}>Distractions</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Texts, emails & social media</li>
                                                <li>Socializing with colleagues</li>
                                                <li>Mobile games</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTINUOUS SCROLL CONTENT */}
                    <div className="space-y-16">

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 1: OVERVIEW */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="overview"
                            ref={(el) => { sectionRefs.current['overview'] = el; }}
                            className="scroll-mt-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${glassos.charcoal}1A` }}>
                                    <LayoutDashboard size={18} style={{ color: glassos.charcoal }} />
                                </div>
                                <h2 className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: glassos.charcoal }}>01 / Overview</h2>
                            </div>

                            <div className="space-y-8">
                                <header className="border-b border-gray-200 pb-6">
                                    <h1 className={`${isCompact ? 'text-3xl' : 'text-4xl'} font-heading mb-3 text-gray-800`}>Time Management App</h1>
                                    <p className={`${isCompact ? 'text-base' : 'text-xl'} text-gray-500 leading-relaxed max-w-3xl`}>
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
                                        <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="text-[10px] uppercase text-gray-400 font-medium mb-1">{item.label}</div>
                                            <div className="text-sm font-medium text-gray-700">{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className={`grid gap-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-heading text-gray-800">The Challenge</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Design a time management app that aligns with user expectations. Understand what features users <span className="font-semibold" style={{ color: glassos.charcoal }}>truly need</span> versus what they think they need.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg border" style={{ backgroundColor: `${glassos.charcoal}0D`, borderColor: `${glassos.charcoal}33` }}>
                                        <h4 className="font-display font-semibold mb-2 flex items-center gap-2 text-base" style={{ color: glassos.charcoal }}>
                                            <Search size={16} /> Research Question
                                        </h4>
                                        <p className="italic text-sm" style={{ color: glassos.verdigris }}>
                                            "Which tools and strategies do individuals who are good at managing their time use?"
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <h4 className="font-display font-semibold text-gray-700 mb-2 flex items-center gap-2 text-base">
                                        <Lightbulb size={16} style={{ color: glassos.jasmine }} /> Hypothesis
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Users are more likely to use a time management app with features customizable to their preferences.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading text-gray-800 mb-4">My Approach</h3>
                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { num: '1', title: 'Exploratory', sub: 'Focus Group', color: glassos.verdigris },
                                            { num: '2', title: 'Validation', sub: 'Online Survey', color: glassos.charcoal },
                                            { num: '3', title: 'In-Context', sub: 'Diary Study', color: glassos.sandy },
                                        ].map((step) => (
                                            <div key={step.num} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: step.color }}>{step.num}</div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-700">{step.title}</div>
                                                    <div className="text-xs text-gray-400">{step.sub}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 2: RESEARCH */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="research"
                            ref={(el) => { sectionRefs.current['research'] = el; }}
                            className="scroll-mt-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${glassos.verdigris}1A` }}>
                                    <Search size={18} style={{ color: glassos.verdigris }} />
                                </div>
                                <h2 className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: glassos.verdigris }}>02 / Research</h2>
                            </div>

                            <div className="space-y-12">
                                {/* PHASE 1 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase text-white" style={{ backgroundColor: glassos.verdigris }}>Phase 1</span>
                                        <h3 className="text-xl font-heading text-gray-800">Focus Group</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Identify user needs, preferences, and feature priorities.
                                    </p>

                                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-600">KWHL Table</div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 text-gray-500">
                                                        <th className="p-3 font-medium">Know</th>
                                                        <th className="p-3 font-medium">Want to Know</th>
                                                        <th className="p-3 font-medium">How</th>
                                                        <th className="p-3 font-medium">Learned</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    <tr>
                                                        <td className="p-3 text-gray-600">People struggle with time management</td>
                                                        <td className="p-3 text-gray-600">Effective strategies?</td>
                                                        <td className="p-3 text-gray-600">Focus group</td>
                                                        <td className="p-3 text-gray-600">Behaviors & habits</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} style={{ color: glassos.burnt }} /> Challenges + Improvements</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {['Procrastination', 'Too many tasks', 'Forgot my plan', 'Social Media'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: glassos.burnt }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} style={{ color: glassos.jasmine }} /> Behaviour + Anti-Procrastination Strategies</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {['Screen time limit', 'To-Do List', 'Reminders', 'Set alarms'].map(tag => (
                                                    <span key={tag} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${glassos.jasmine}33`, color: '#7a6a2a' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* PHASE 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase text-white" style={{ backgroundColor: glassos.charcoal }}>Phase 2</span>
                                        <h3 className="text-xl font-heading text-gray-800">Online Survey</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Validate findings from focus group and quantify user preferences for time management features.
                                    </p>

                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { label: 'Participants', value: '17', sub: 'Identified as good @ time management' },
                                            { label: 'Platform', value: 'JotForm', sub: '12 Questions' },
                                            { label: 'Focus', value: 'Usage + Features', sub: 'Challenges + Improvements' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="text-[10px] text-gray-400 uppercase">{item.label}</div>
                                                <div className="text-lg font-heading text-gray-800">{item.value}</div>
                                                <div className="text-xs text-gray-500">{item.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sample Survey Questions */}
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                        <h4 className="font-display font-semibold text-gray-700 mb-4 text-sm">Sample Survey Questions</h4>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex gap-3">
                                                <span className="font-medium text-gray-400">Q1:</span>
                                                <span>What types of tasks do you typically manage? (Personal, Work, Collaborative, Academic)</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <span className="font-medium text-gray-400">Q4:</span>
                                                <span>How often do you use a calendar or planning tool?</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <span className="font-medium text-gray-400">Q7:</span>
                                                <span>What strategies do you use to avoid procrastination?</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <span className="font-medium text-gray-400">Q10:</span>
                                                <span>Do you customize features in your time management tools?</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="space-y-2">
                                            <h4 className="font-display font-semibold text-gray-700 text-sm">Q1: Task types managed</h4>
                                            <div className="h-36 flex items-end gap-3 bg-gray-50 p-3 pt-6 rounded-lg border border-gray-200">
                                                {q1Data.map((item, i) => (
                                                    <div key={i} className="flex-1 rounded-t relative" style={{ height: `${Math.round(item.value / 15 * 100)}%`, backgroundColor: item.color }}>
                                                        <span className="absolute -top-4 w-full text-center text-[10px] font-medium text-gray-600">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {renderLegend(q1Data)}
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-display font-semibold text-gray-700 text-sm">Q7: Anti-procrastination strategy</h4>
                                            <div className="h-36 flex items-end gap-3 bg-gray-50 p-3 pt-6 rounded-lg border border-gray-200">
                                                {q7Data.map((item, i) => (
                                                    <div key={i} className="flex-1 rounded-t relative" style={{ height: `${Math.round(item.value / 9 * 100)}%`, backgroundColor: item.color }}>
                                                        <span className="absolute -top-4 w-full text-center text-[10px] font-medium text-gray-600">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {renderLegend(q7Data)}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-display font-semibold text-gray-700 mb-2 text-sm">Key Stats</h4>
                                        <ul className="space-y-1.5 text-sm text-gray-600">
                                            <li className="flex justify-between">
                                                <span>Use weekly calendar "Several times a day"</span>
                                                <span className="font-semibold text-gray-800">47%</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Customize features "Rarely"</span>
                                                <span className="font-semibold text-gray-800">47%</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Believe advanced features increase effectiveness</span>
                                                <span className="font-semibold text-gray-800">41%</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* PHASE 3 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase text-white" style={{ backgroundColor: glassos.sandy }}>Phase 3</span>
                                        <h3 className="text-xl font-heading text-gray-800">Diary Study</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Observe real-world behaviour and time management tool usage in real time.
                                    </p>

                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { label: 'Participants', value: '4', sub: 'Diary study participants' },
                                            { label: 'Duration', value: '10 Days', sub: 'Real-time journaling' },
                                            { label: 'Method', value: 'Daily Logs', sub: 'Behaviour tracking' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="text-[10px] text-gray-400 uppercase">{item.label}</div>
                                                <div className="text-lg font-heading text-gray-800">{item.value}</div>
                                                <div className="text-xs text-gray-500">{item.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Common Distractions</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Social Media', 'Emails', 'Colleagues', 'Family'].map(tag => (
                                                    <div key={tag} className="p-2 rounded text-xs text-center font-medium text-white" style={{ backgroundColor: glassos.burnt }}>{tag}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Strategies to Refocus</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['To-Do List', 'Time Constraints', 'Reminders', 'Reprioritizing'].map(tag => (
                                                    <div key={tag} className="p-2 rounded text-xs text-center font-medium text-white" style={{ backgroundColor: glassos.verdigris }}>{tag}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Journey Map - moved here from Analysis */}
                                    <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 mt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-heading text-gray-800">Daily Journey Map</h3>
                                            <span className="text-xs text-gray-400">Persona: Alex Lee</span>
                                        </div>
                                        <div className="relative border-l-2 pl-6 space-y-5" style={{ borderColor: glassos.charcoal }}>
                                            {[
                                                { time: "Morning", mood: "Productive", title: "Planning", desc: "Motivated but overwhelmed by full calendar." },
                                                { time: "Mid-Morning", mood: "Distracted", title: "Deep Work", desc: "Digital notifications break concentration." },
                                                { time: "Afternoon", mood: "Low Energy", title: "The Slump", desc: "Social media temptation peaks." },
                                                { time: "Late Afternoon", mood: "Stressed", title: "The Race", desc: "Racing against deadlines." },
                                                { time: "Evening", mood: "Relief", title: "Reflection", desc: "Reviews day and plans ahead." }
                                            ].map((step, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[29px] w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: glassos.charcoal }} />
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold uppercase" style={{ color: glassos.charcoal }}>{step.time}</span>
                                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{step.mood}</span>
                                                    </div>
                                                    <h4 className="font-display font-semibold text-base text-gray-700 mb-0.5">{step.title}</h4>
                                                    <p className="text-gray-500 text-sm">{step.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 3: FINDINGS */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="findings"
                            ref={(el) => { sectionRefs.current['findings'] = el; }}
                            className="scroll-mt-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${glassos.jasmine}33` }}>
                                    <Lightbulb size={18} style={{ color: glassos.jasmine }} />
                                </div>
                                <h2 className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: '#7a6a2a' }}>03 / Findings</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-heading mb-4 text-gray-800">Key Insights</h3>
                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {[
                                            { title: "Frequent Tool Usage", desc: "Users use time management tools several times a day." },
                                            { title: "Weekly Calendar Preference", desc: "Users prefer using the weekly calendar view several times a day." },
                                            { title: "Top Anti-Procrastination Strategies", desc: "The strategies used the most to avoid procrastination are setting deadlines and breaking down tasks." },
                                            { title: "The Customization Paradox", desc: "Users want flexibility but rarely customize." },
                                            { title: "Mood Impacts Productivity", desc: "Low mood dramatically increases procrastination." },
                                            { title: "Interruptions Derail Focus", desc: "Users struggle to refocus after interruptions." }
                                        ].map((finding, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h4 className="font-display font-semibold mb-1 text-base" style={{ color: glassos.charcoal }}>{i + 1}. {finding.title}</h4>
                                                <p className="text-gray-500 text-sm">{finding.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 4: RECOMMENDATIONS */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="recommendations"
                            ref={(el) => { sectionRefs.current['recommendations'] = el; }}
                            className="scroll-mt-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${glassos.burnt}1A` }}>
                                    <PenTool size={18} style={{ color: glassos.burnt }} />
                                </div>
                                <h2 className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: glassos.burnt }}>04 / Recommendations</h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-heading mb-3 text-gray-800">Design Recommendations</h3>
                                    <p className="text-base text-gray-500 mb-6">Translating insights into actionable features.</p>
                                </div>

                                {/* Recommendation Cards with Embedded Prototype Buttons */}
                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {/* Card 1: Smart Calendar */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.verdigris }}>
                                                <CalendarIcon size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">1. Smart Calendar</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">Weekly view default. Widget for at-a-glance planning. Drag-and-drop rescheduling.</p>
                                        <button
                                            onClick={launchPrototype}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors text-white"
                                            style={{ backgroundColor: glassos.verdigris }}
                                        >
                                            <ExternalLink size={14} />
                                            View Prototype
                                        </button>
                                    </div>

                                    {/* Card 2: Intelligent Task Management */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.charcoal }}>
                                                <List size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">2. Intelligent Task Management</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">Automatically prioritize and break down complex work into manageable steps.</p>
                                        <button
                                            onClick={launchPrototype}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors text-white"
                                            style={{ backgroundColor: glassos.charcoal }}
                                        >
                                            <ExternalLink size={14} />
                                            View Prototype
                                        </button>
                                    </div>

                                    {/* Card 3: Focus Protection */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.burnt }}>
                                                <Target size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">3. Focus Protection</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">Do Not Disturb mode. Silence notifications. Visual indicator when in focus.</p>
                                        <button
                                            onClick={triggerFocusMode}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors text-white"
                                            style={{ backgroundColor: glassos.burnt }}
                                        >
                                            <Target size={14} />
                                            Simulate Focus Mode
                                        </button>
                                    </div>

                                    {/* Card 4: Time Blocking */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.sandy }}>
                                                <Clock size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">4. Time Blocking</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">Built-in Pomodoro timer. Guided break prompts for sustained productivity.</p>
                                        <button
                                            onClick={launchPrototype}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors text-white"
                                            style={{ backgroundColor: glassos.sandy }}
                                        >
                                            <ExternalLink size={14} />
                                            View Prototype
                                        </button>
                                    </div>

                                    {/* Card 5: Gentle Nudges */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.jasmine }}>
                                                <Bell size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">5. Gentle Nudges</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">Motivational prompts during low-energy periods to keep you on track.</p>
                                        <button
                                            onClick={triggerNotification}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors"
                                            style={{ backgroundColor: glassos.jasmine, color: '#5a4a1a' }}
                                        >
                                            <Bell size={14} />
                                            Test Nudge
                                        </button>
                                    </div>

                                    {/* Card 6: Cross-Device Syncing */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: glassos.charcoal }}>
                                                <RefreshCw size={18} />
                                            </div>
                                            <h4 className="font-display font-semibold text-base text-gray-800">6. Cross-Device Syncing</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 flex-1">#1 biggest challenge identified. Seamless sync across all your devices.</p>
                                        <button
                                            onClick={launchPrototype}
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-colors text-white"
                                            style={{ backgroundColor: glassos.charcoal }}
                                        >
                                            <ExternalLink size={14} />
                                            View Prototype
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 5: IMPACT */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="impact"
                            ref={(el) => { sectionRefs.current['impact'] = el; }}
                            className="scroll-mt-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${glassos.verdigris}1A` }}>
                                    <TrendingUp size={18} style={{ color: glassos.verdigris }} />
                                </div>
                                <h2 className="text-sm font-display font-semibold uppercase tracking-wider" style={{ color: glassos.verdigris }}>05 / Impact</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-xl font-heading mb-3 flex items-center gap-2 text-gray-800">
                                        <CheckCircle2 size={18} style={{ color: glassos.verdigris }} /> Research Impact
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-display font-semibold text-gray-500 text-xs uppercase mb-1">Validated Hypothesis?</h4>
                                            <p className="text-base text-gray-700">
                                                <span className="font-semibold" style={{ color: glassos.verdigris }}>Yes, with a caveat.</span> Users want customization, but they need <span className="font-semibold" style={{ color: glassos.charcoal }}>smart defaults first</span>.
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-display font-semibold text-gray-500 text-xs uppercase mb-2">Design Principles Uncovered</h4>
                                            <ul className="space-y-1.5 text-sm text-gray-600">
                                                <li>1. <strong className="text-gray-800">Reduce cognitive load:</strong> Smart defaults over blank slates.</li>
                                                <li>2. <strong className="text-gray-800">Protect focus time:</strong> Active interruption management.</li>
                                                <li>3. <strong className="text-gray-800">Adapt to mood:</strong> Recognize when users need extra support.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading mb-4 text-gray-800">Business Value</h3>
                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { title: 'Reduced Risk', desc: 'Validated demand before development.', color: glassos.verdigris },
                                            { title: 'Competitive Edge', desc: 'Differentiation through Focus Mode.', color: glassos.charcoal },
                                            { title: 'Retention', desc: 'Addressing #1 pain point (syncing).', color: glassos.sandy },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: `${item.color}0D`, borderColor: `${item.color}33` }}>
                                                <div className="font-display font-semibold mb-1 text-base" style={{ color: item.color }}>{item.title}</div>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Methodology Section */}
                                <div>
                                    <h3 className="text-2xl font-heading mb-4 text-gray-800">Methodology</h3>

                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {/* What Worked Well Card */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                            <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.verdigris }}>What Worked Well</h4>
                                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                                <li>Mixed methods approach provided both breadth (survey) and depth (diary study)</li>
                                                <li>Recruiting productive users gave insights into successful patterns</li>
                                                <li>Real-time journaling captured authentic moments of distraction</li>
                                                <li>Three-phase progression allowed each study to inform the next</li>
                                            </ul>
                                        </div>

                                        {/* What I'd Do Differently Card */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                            <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.charcoal }}>What I'd Do Differently</h4>
                                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                                <li>Extend diary study to 14 days to capture full work weeks</li>
                                                <li>Include participants who struggle with time management for comparison</li>
                                                <li>Add observational component to see actual tool usage vs. self-reported</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Challenges + Solutions Table */}
                                    <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="px-5 py-3 border-b border-gray-200">
                                            <h4 className="font-display font-semibold text-base" style={{ color: glassos.sandy }}>Challenges + Solutions</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="text-left p-3 font-semibold text-gray-700 w-1/2">Challenge</th>
                                                        <th className="text-left p-3 font-semibold text-gray-700 w-1/2">Solution</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="p-3 text-gray-600">Low survey response rate (17 vs. goal of 25)</td>
                                                        <td className="p-3 text-gray-600">Recruited previous survey respondents for diary study, ensuring highly engaged participants</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 text-gray-600">Participants forgetting diary entries</td>
                                                        <td className="p-3 text-gray-600">Daily check-ins and gentle reminders, maintained consistency</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 text-gray-600">Balancing feature requests with observed behavior</td>
                                                        <td className="p-3 text-gray-600">Journey mapping revealed gaps between stated preferences and actual usage patterns</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};
