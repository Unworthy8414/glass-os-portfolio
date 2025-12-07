import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard,
    Search,
    Lightbulb,
    PenTool,
    TrendingUp,
    User,
    Target,
    FileText,
    ChevronLeft,
    Users
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

interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const AGODigitalStudy: React.FC<CaseStudyProps> = ({ onBack, isCompact }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [showPersona, setShowPersona] = useState(false);
    const { launchApp } = useOSStore();
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

    const launchFullReport = () => {
        const pdfApp = apps.find(a => a.id === 'pdf');
        if (pdfApp) {
            launchApp(pdfApp, { fileId: 'ago-study', title: 'AGO Digital Experience - UX Research Case Study.pdf', forceNew: true });
        }
    };

    const sections: Section[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: glassos.blue },
        { id: 'research', label: 'Research', icon: Search, color: glassos.purple },
        { id: 'analysis', label: 'Findings', icon: Lightbulb, color: glassos.yellow },
        { id: 'design', label: 'Recommendations', icon: PenTool, color: glassos.pink },
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
                    <div className="font-display font-semibold text-sm text-gray-700 truncate">AGO Digital Experience</div>
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
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-heading text-white border-2 border-gray-200 shrink-0" style={{ backgroundColor: glassos.burnt }}>JE</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-heading text-gray-800">Jessica</h3>
                                            <p className="text-xs" style={{ color: glassos.verdigris }}>40 F | Marketing Manager | Toronto, ON</p>
                                            <p className="text-xs text-gray-400">Parent of 2 children (Ages: 5 & 10)</p>
                                        </div>
                                        <button onClick={() => setShowPersona(false)} className="text-gray-400 hover:text-gray-600 text-xs">Close</button>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.charcoal }}>Goals</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Know what exhibits suit her children's ages</li>
                                                <li>Plan logistics (arrival, parking, amenities)</li>
                                                <li>Seamlessly purchase tickets</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.burnt }}>Pain Points</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Searching multiple pages for basic info</li>
                                                <li>Mandatory account creation</li>
                                                <li>Hidden policies & fees</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.verdigris }}>Motivations</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Create meaningful experiences for children</li>
                                                <li>Maximize time with efficient planning</li>
                                                <li>Support arts and local community</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.sandy }}>Behaviour</h4>
                                            <ul className="space-y-0.5 text-gray-600 list-disc list-inside">
                                                <li>Researches on mobile during commute</li>
                                                <li>Checks reviews before committing</li>
                                                <li>Abandons cart if checkout &gt; 3 min</li>
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
                                    <h1 className={`${isCompact ? 'text-3xl' : 'text-4xl'} font-heading mb-3 text-gray-800`}>Art Gallery of Ontario: Digital Purchase Journey</h1>
                                    <p className={`${isCompact ? 'text-base' : 'text-xl'} text-gray-500 leading-relaxed max-w-3xl`}>
                                        Optimizing the digital experience to uncover usability problems and increase conversion rates.
                                    </p>
                                </header>

                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-2' : 'grid-cols-4'}`}>
                                    {[
                                        { label: 'Role', value: 'Lead UX Researcher' },
                                        { label: 'Timeline', value: '4 Months' },
                                        { label: 'Methods', value: 'Heuristics, Interviews, Ethnography' },
                                        { label: 'Team', value: 'Solo Researcher' },
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
                                            The Art Gallery of Ontario wanted to understand their digital user experience but didn't have clarity on where issues might exist. My task was to conduct a comprehensive evaluation to <span className="font-semibold" style={{ color: glassos.charcoal }}>uncover usability problems</span> and <mark className="px-1 rounded" style={{ backgroundColor: `${glassos.jasmine}66` }}>identify opportunities for improvement</mark>.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-lg border" style={{ backgroundColor: `${glassos.charcoal}0D`, borderColor: `${glassos.charcoal}33` }}>
                                        <h4 className="font-display font-semibold mb-2 flex items-center gap-2 text-base" style={{ color: glassos.charcoal }}>
                                            <Target size={16} /> Research Goals
                                        </h4>
                                        <ul className="text-sm space-y-1" style={{ color: glassos.verdigris }}>
                                            <li>Conduct heuristic evaluation of AGO's digital experience</li>
                                            <li>Deep dive into the online purchase journey</li>
                                            <li>Compare digital and physical purchasing experiences</li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading text-gray-800 mb-4">My Approach</h3>
                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { num: '1', title: 'Competitive Analysis', sub: 'Heuristic Evaluation', color: glassos.verdigris },
                                            { num: '2', title: 'User Interviews', sub: '6 In-depth Sessions', color: glassos.charcoal },
                                            { num: '3', title: 'Ethnographic Research', sub: 'On-site Observation', color: glassos.sandy },
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

                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <h4 className="font-display font-semibold text-gray-700 mb-3 flex items-center gap-2 text-base">
                                        <Users size={16} style={{ color: glassos.verdigris }} /> Competitors Analyzed
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Art Gallery of Ontario', 'The Metropolitan Museum of Art', 'The British Museum'].map(tag => (
                                            <span key={tag} className="px-3 py-1.5 rounded text-sm text-white" style={{ backgroundColor: glassos.verdigris }}>{tag}</span>
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
                                        <h3 className="text-xl font-heading text-gray-800">Competitive Analysis & Heuristic Evaluation</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Evaluate AGO's position in the market and conduct a heuristic evaluation across the entire site.
                                    </p>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Initial Discovery: Site-Wide Issues</h4>
                                        <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                            {[
                                                { title: 'Missing Digital Experiences', desc: 'AGO lacked virtual tours and digital collection access that competitors offered', color: glassos.burnt, highlight: false },
                                                { title: 'Unintuitive Website Design', desc: 'Confusing navigation, poor information architecture, interface friction', color: glassos.sandy, highlight: false },
                                                { title: 'Weak Purchase Conversion', desc: 'Inefficient purchase flows causing user drop-off - became primary focus', color: glassos.burnt, highlight: true },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 rounded-lg border ${item.highlight ? 'ring-2 ring-offset-2' : ''}`}
                                                    style={{
                                                        backgroundColor: item.highlight ? `${item.color}1A` : `${item.color}0D`,
                                                        borderColor: item.highlight ? item.color : `${item.color}33`,
                                                        ['--tw-ring-color' as string]: item.highlight ? item.color : undefined
                                                    }}
                                                >
                                                    <div className="font-semibold mb-1 text-sm" style={{ color: item.color }}>{item.title}</div>
                                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                                    {item.highlight && <span className="inline-block mt-2 text-[10px] font-medium uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: item.color }}>Primary Focus</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* PHASE 2 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase text-white" style={{ backgroundColor: glassos.charcoal }}>Phase 2</span>
                                        <h3 className="text-xl font-heading text-gray-800">User Interviews</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Understand user experiences, behaviors, and pain points specifically within the purchase journey. Identify and understand users' mental models and expectations.
                                    </p>

                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                        {[
                                            { label: 'Participants', value: '6', sub: '1-hour in-depth interviews' },
                                            { label: 'Focus', value: 'Purchase Journey', sub: 'Cart, checkout, booking' },
                                            { label: 'Synthesis', value: 'Affinity Mapping', sub: 'Thematic analysis' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="text-[10px] text-gray-400 uppercase">{item.label}</div>
                                                <div className="text-lg font-heading text-gray-800">{item.value}</div>
                                                <div className="text-xs text-gray-500">{item.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                        <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Hypotheses Tested</h4>
                                        <div className={`grid gap-2 text-sm ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                            {[
                                                'Cart editing from any page increases conversion',
                                                'Forced account creation increases abandonment',
                                                'Users prefer calendar button over list button',
                                                'Users prefer date picker matching real-life models',
                                                'Users prefer monthly view for ticket booking',
                                                'Seeing events on calendar increases conversion'
                                            ].map((hyp, i) => (
                                                <div key={i} className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded text-white" style={{ backgroundColor: glassos.charcoal }}>{i + 1}</span>
                                                    {hyp}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                        <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Sample Research Questions</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {[
                                                'What do users usually expect when it comes to cart customization?',
                                                'How do users feel when signing in or creating an account to check out?',
                                                'How do they feel about the length of the checkout process?',
                                                'What do users usually expect when choosing dates & times during the booking process?',
                                                'What challenges do users face when checking out?',
                                                'Are there specific parts of the purchase path they experience challenges with?',
                                                'Is there a particular point at which users are most likely to abandon their cart?'
                                            ].map((question, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <span className="text-xs font-semibold text-gray-400">{i + 1}.</span>
                                                    <span className="italic">{question}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200" />

                                {/* PHASE 3 */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase text-white" style={{ backgroundColor: glassos.sandy }}>Phase 3</span>
                                        <h3 className="text-xl font-heading text-gray-800">Ethnographic Research</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-700">Goal:</strong> Understand the disconnect between physical and digital purchasing experiences.
                                    </p>

                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Observation Focus Areas</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Entrance & Wayfinding', 'Ticket Information', 'Purchase Process', 'User Emotions'].map(tag => (
                                                    <div key={tag} className="p-2 rounded text-xs text-center font-medium text-white" style={{ backgroundColor: glassos.verdigris }}>{tag}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-display font-semibold text-gray-700 mb-3 text-sm">Key Finding</h4>
                                            <p className="text-sm text-gray-600 italic">
                                                "Significant differences between the smooth physical ticket purchasing experience and the frustrating digital experience, creating misaligned mental models."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Journey Map - moved from Findings */}
                                    <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 mt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-heading text-gray-800">User Journey Map: AGO Purchase Path</h3>
                                            <span className="text-xs text-gray-400">Persona: Jessica</span>
                                        </div>
                                        <div className="relative border-l-2 pl-6 space-y-5" style={{ borderColor: glassos.burnt }}>
                                            {[
                                                { phase: "Pre-Planning", emotion: "Confused", desc: "Information split across multiple pages. Parking details buried." },
                                                { phase: "Online Purchase", emotion: "Frustrated & Anxious", desc: "+5 step checkout vs expected 2-3. Forced account creation." },
                                                { phase: "Arriving On-Site", emotion: "Overwhelmed", desc: "No clear signage. Users ask staff for directions. Info desk congestion." },
                                                { phase: "In-Person Purchase", emotion: "Relieved", desc: "Fast transaction. Payment processed quickly. Receives tickets." },
                                                { phase: "Exploring Gallery", emotion: "Lost", desc: "Museum wayfinding unclear. No digital gallery guide. Uses printed map." }
                                            ].map((step, i) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[29px] w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: glassos.burnt }} />
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold uppercase" style={{ color: glassos.burnt }}>{step.phase}</span>
                                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{step.emotion}</span>
                                                    </div>
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
                            id="analysis"
                            ref={(el) => { sectionRefs.current['analysis'] = el; }}
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
                                    <h3 className="text-2xl font-heading mb-4 text-gray-800">Key Findings: Purchase Journey Pain Points</h3>
                                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {[
                                            {
                                                title: "1. Account Creation Barriers",
                                                items: ['Complex account creation process', 'Security and privacy concerns', 'Difficult password management', 'Forced account creation at checkout'],
                                                quote: '"Why do I need to create an account just to buy a ticket?"',
                                                color: glassos.burnt
                                            },
                                            {
                                                title: "2. Cart Management Issues",
                                                items: ['Cart sessions expiring too quickly', 'Inability to edit cart efficiently', 'Long, complex checkout process', 'Poor cart customization'],
                                                quote: null,
                                                color: glassos.sandy
                                            },
                                            {
                                                title: "3. Ticket Booking Complexity",
                                                items: ['Over-simplified calendar lacking info', 'Unintuitive time slot booking', 'Missing system status indicators', 'Fees not displayed upfront'],
                                                quote: null,
                                                color: glassos.jasmine
                                            },
                                            {
                                                title: "4. Information Architecture",
                                                items: ['Disorganized site structure', 'Critical information hidden', 'Lack of clear wayfinding', 'Users depend on staff for basic info'],
                                                quote: null,
                                                color: glassos.verdigris
                                            },
                                        ].map((finding, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h4 className="font-display font-semibold mb-2 text-base" style={{ color: finding.color }}>{finding.title}</h4>
                                                <ul className="text-gray-500 text-sm space-y-1 list-disc list-inside mb-2">
                                                    {finding.items.map((item, j) => <li key={j}>{item}</li>)}
                                                </ul>
                                                {finding.quote && (
                                                    <p className="text-xs italic text-gray-400 border-l-2 pl-2" style={{ borderColor: finding.color }}>
                                                        {finding.quote}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 rounded-lg border" style={{ backgroundColor: `${glassos.verdigris}0D`, borderColor: `${glassos.verdigris}33` }}>
                                    <h4 className="font-display font-semibold mb-2 text-base" style={{ color: glassos.verdigris }}>Cognitive Dissonance Discovery</h4>
                                    <p className="text-sm text-gray-600">
                                        Ethnographic research revealed that the <strong className="text-gray-800">physical ticket purchase was easy</strong> (2-3 minutes, clear process) while the <strong className="text-gray-800">digital experience was frustrating</strong> (+5 steps, account required). This mismatch creates negative brand perception before visitors even arrive.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ═══════════════════════════════════════════════════════════════ */}
                        {/* SECTION 4: RECOMMENDATIONS */}
                        {/* ═══════════════════════════════════════════════════════════════ */}
                        <section
                            id="design"
                            ref={(el) => { sectionRefs.current['design'] = el; }}
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
                                    <p className="text-base text-gray-500 mb-6">Strategic recommendations across four key areas based on research findings.</p>
                                </div>

                                {/* Recommendation Cards */}
                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {/* Card 1: Account Creation */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.charcoal }}>1. Account Creation</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                            <li>Implement guest checkout option</li>
                                            <li>Reduce required personal information</li>
                                            <li>Provide clear value proposition for accounts</li>
                                            <li>Improve password management UX</li>
                                        </ul>
                                    </div>

                                    {/* Card 2: Cart Management */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.verdigris }}>2. Cart Management</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                            <li>Extend cart session timeout</li>
                                            <li>Enable in-cart editing without restarting</li>
                                            <li>Streamline checkout to reduce steps</li>
                                            <li>Add cart saving functionality</li>
                                        </ul>
                                    </div>

                                    {/* Card 3: Ticket Booking */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.sandy }}>3. Ticket Booking</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                            <li>Redesign calendar to show events clearly</li>
                                            <li>Add system status indicators</li>
                                            <li>Display all fees upfront</li>
                                            <li>Align digital with physical mental models</li>
                                        </ul>
                                    </div>

                                    {/* Card 4: Information Architecture */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.burnt }}>4. Information Architecture</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                            <li>Reorganize site for intuitive trip planning</li>
                                            <li>Develop clear content strategy</li>
                                            <li>Improve search and filtering</li>
                                            <li>Add digital wayfinding resources</li>
                                        </ul>
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
                                    <h3 className="text-xl font-heading mb-3 text-gray-800">Validated Hypotheses</h3>
                                    <div className="space-y-2">
                                        {[
                                            'Forced account creation during checkout increases cart abandonment',
                                            'Users prefer calendar views that show available events clearly',
                                            'Cart editing capabilities directly impact conversion rates',
                                            'Cognitive dissonance between physical and digital experiences negatively impacts satisfaction'
                                        ].map((hyp, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-xs font-semibold mt-0.5" style={{ color: glassos.verdigris }}>✓</span>
                                                {hyp}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading mb-4 text-gray-800">Business Value</h3>
                                    <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        {[
                                            { title: 'Revenue Impact', items: ['Clear roadmap to reduce cart abandonment', 'Opportunity to convert visitors into members', 'Decrease dependency on in-person sales'], color: glassos.verdigris },
                                            { title: 'Competitive Positioning', items: ['Insights vs leading cultural institutions', 'Strategic recommendations to match standards', 'Unique opportunities identified'], color: glassos.charcoal },
                                            { title: 'User Experience & Brand', items: ['Data-driven understanding of frustrations', 'Prioritized improvements for satisfaction', 'Framework for consistent experiences'], color: glassos.sandy },
                                            { title: 'Operational Efficiency', items: ['Reduced burden on front desk staff', 'Better traffic flow in physical space', 'Foundation for future product decisions'], color: glassos.burnt },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-lg border" style={{ backgroundColor: `${item.color}0D`, borderColor: `${item.color}33` }}>
                                                <div className="font-display font-semibold mb-2 text-base" style={{ color: item.color }}>{item.title}</div>
                                                <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                                                    {item.items.map((li, j) => <li key={j}>{li}</li>)}
                                                </ul>
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
                                                <li>Mixed-method approach provided comprehensive insights</li>
                                                <li>Ethnographic research revealed unexpected insights about physical/digital disconnect</li>
                                                <li>Affinity mapping enabled efficient synthesis of qualitative data</li>
                                                <li>Stakeholder presentations effectively communicated findings</li>
                                            </ul>
                                        </div>

                                        {/* What I'd Do Differently Card */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                            <h4 className="font-display font-semibold text-base mb-3" style={{ color: glassos.charcoal }}>What I'd Do Differently</h4>
                                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1.5">
                                                <li>Include more diverse participant demographics in future studies</li>
                                                <li>Incorporate quantitative analytics data to strengthen findings</li>
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
                                                        <td className="p-3 text-gray-600">Participant recruitment & no-shows</td>
                                                        <td className="p-3 text-gray-600">Recruited 2 extra participants (5 total for 3 needed) and sent email reminders one day before sessions</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 text-gray-600">Technical issues during remote interviews</td>
                                                        <td className="p-3 text-gray-600">Tested all technology before interviews and prepared backup software/meeting platforms</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 text-gray-600">Restricted site access for ethnography</td>
                                                        <td className="p-3 text-gray-600">Prepared official information letter explaining research purpose to present if questioned by staff</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps Card */}
                                <div className="p-6 rounded-xl border-2" style={{ backgroundColor: `${glassos.charcoal}0D`, borderColor: glassos.charcoal }}>
                                    <h3 className="text-xl font-heading mb-4" style={{ color: glassos.charcoal }}>Next Steps</h3>
                                    <div className="space-y-3">
                                        {[
                                            { num: '1', title: 'Prioritize quick wins', desc: 'Implement guest checkout and extended cart timeout' },
                                            { num: '2', title: 'Usability testing', desc: 'Conduct usability testing on redesigned flows' },
                                            { num: '3', title: 'Monitor conversion rates', desc: 'Track metrics post-implementation to measure impact' },
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: glassos.charcoal }}>{step.num}</div>
                                                <div>
                                                    <div className="font-semibold text-sm text-gray-800">{step.title}</div>
                                                    <div className="text-sm text-gray-500">{step.desc}</div>
                                                </div>
                                            </div>
                                        ))}
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
