import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard,
    Search,
    Lightbulb,
    PenTool,
    TrendingUp,
    User,
    ShoppingCart,
    Target,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Eye,
    FileText,
    ChevronLeft,
    MapPin,
    Users,
    Calendar
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

interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const AGODigitalStudy: React.FC<CaseStudyProps> = ({ onBack, isCompact }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPersona, setShowPersona] = useState(false);
    const { launchApp } = useOSStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

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
        <div className={`flex w-full h-full bg-[#1e1e1e] text-white font-sans ${isCompact ? 'flex-col' : ''}`}>
            {/* Sidebar */}
            <div className={`${isCompact ? 'w-full border-b h-auto' : 'w-56 border-r h-full'} border-white/10 bg-black/30 flex flex-col shrink-0`}>
                <div className={`p-3 border-b border-white/10 flex items-center gap-2 ${isCompact ? 'justify-between' : ''}`}>
                    <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/50 group" title="Back to Case Studies">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="font-medium text-xs text-white/70 truncate">AGO Digital Experience</div>
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
                            {showPersona ? 'Hide Persona' : 'View Persona: Jessica'}
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
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/20 shrink-0" style={{ backgroundColor: glassos.pink }}>JE</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Jessica</h3>
                                            <p className="text-xs" style={{ color: `${glassos.teal}B3` }}>40 F | Marketing Manager | Toronto, ON</p>
                                            <p className="text-xs text-white/40">Parent of 2 children (Ages: 5 & 10)</p>
                                        </div>
                                        <button onClick={() => setShowPersona(false)} className="text-white/40 hover:text-white/70 text-xs">Close</button>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.blue }}>Goals</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Know what exhibits suit her children's ages</li>
                                                <li>Plan logistics (arrival, parking, amenities)</li>
                                                <li>Seamlessly purchase tickets</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.red }}>Pain Points</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Searching multiple pages for basic info</li>
                                                <li>Mandatory account creation</li>
                                                <li>Hidden policies & fees</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className={`grid gap-4 text-xs mt-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.green }}>Motivations</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Create meaningful experiences for children</li>
                                                <li>Maximize time with efficient planning</li>
                                                <li>Support arts and local community</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[10px] uppercase mb-1" style={{ color: glassos.orange }}>Behaviour</h4>
                                            <ul className="space-y-0.5 text-white/60 list-disc list-inside">
                                                <li>Researches on mobile during commute</li>
                                                <li>Checks reviews before committing</li>
                                                <li>Abandons cart if checkout &gt; 3 min</li>
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
                                <h1 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-semibold mb-2 text-white/90`}>Art Gallery of Ontario: Digital Purchase Journey</h1>
                                <p className={`${isCompact ? 'text-sm' : 'text-base'} text-white/50`}>
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
                                        The Art Gallery of Ontario wanted to understand their digital user experience but didn't have clarity on where issues might exist. My task was to conduct a comprehensive evaluation to <span style={{ color: glassos.blue }}>uncover usability problems</span> and identify opportunities for improvement.
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border" style={{ backgroundColor: `${glassos.blue}1A`, borderColor: `${glassos.blue}33` }}>
                                    <h3 className="font-medium mb-2 flex items-center gap-2 text-sm" style={{ color: glassos.blue }}>
                                        <Target size={14} /> Research Goals
                                    </h3>
                                    <ul className="text-sm space-y-1" style={{ color: `${glassos.teal}CC` }}>
                                        <li>Conduct heuristic evaluation of AGO's digital experience</li>
                                        <li>Deep dive into the online purchase journey</li>
                                        <li>Compare digital and physical purchasing experiences</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-white/90 mb-3">My Approach</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { num: '1', title: 'Competitive Analysis', sub: 'Heuristic Evaluation', color: glassos.purple },
                                        { num: '2', title: 'User Interviews', sub: '6 In-depth Sessions', color: glassos.blue },
                                        { num: '3', title: 'Ethnographic Research', sub: 'On-site Observation', color: glassos.green },
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

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h3 className="font-medium text-white/80 mb-3 flex items-center gap-2 text-sm">
                                    <Users size={14} style={{ color: glassos.purple }} /> Competitors Analyzed
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Art Gallery of Ontario', 'The Metropolitan Museum of Art', 'The British Museum'].map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded text-xs" style={{ backgroundColor: `${glassos.purple}26`, color: glassos.purple }}>{tag}</span>
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
                                    <h2 className="text-base font-semibold text-white/90">Competitive Analysis & Heuristic Evaluation</h2>
                                </div>
                                <p className="text-sm text-white/50">
                                    <strong className="text-white/70">Goal:</strong> Understand AGO's position in the market and identify usability issues across the entire site.
                                </p>

                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-xs"><AlertTriangle size={12} style={{ color: glassos.orange }} /> Initial Discovery: Site-Wide Issues</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { title: 'Missing Digital Experiences', desc: 'AGO lacked virtual tours and digital collection access that competitors offered', color: glassos.red },
                                            { title: 'Unintuitive Website Design', desc: 'Confusing navigation, poor information architecture, interface friction', color: glassos.orange },
                                            { title: 'Weak Purchase Conversion', desc: 'Inefficient purchase flows causing user drop-off - became primary focus', color: glassos.yellow },
                                        ].map((item, i) => (
                                            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: `${item.color}1A`, border: `1px solid ${item.color}33` }}>
                                                <div className="font-medium mb-1 text-xs" style={{ color: item.color }}>{item.title}</div>
                                                <p className="text-[10px] text-white/50">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-white/10" />

                            {/* PHASE 2 */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ backgroundColor: `${glassos.blue}33`, color: glassos.blue }}>Phase 2</span>
                                    <h2 className="text-base font-semibold text-white/90">User Interviews</h2>
                                </div>
                                <p className="text-sm text-white/50">
                                    <strong className="text-white/70">Goal:</strong> Understand user experiences, behaviors, and pain points specifically within the purchase journey.
                                </p>

                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                    {[
                                        { label: 'Participants', value: '6', sub: '1-hour in-depth interviews' },
                                        { label: 'Focus', value: 'Purchase Journey', sub: 'Cart, checkout, booking' },
                                        { label: 'Synthesis', value: 'Affinity Mapping', sub: 'Thematic analysis' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] text-white/40 uppercase">{item.label}</div>
                                            <div className="text-sm font-medium text-white/80">{item.value}</div>
                                            <div className="text-[10px] text-white/30">{item.sub}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="font-medium text-white/70 mb-3 text-xs">Hypotheses Tested</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        {[
                                            'Cart editing from any page increases conversion',
                                            'Forced account creation increases abandonment',
                                            'Users prefer calendar button over list button',
                                            'Users prefer date picker matching real-life models',
                                            'Users prefer monthly view for ticket booking',
                                            'Seeing events on calendar increases conversion'
                                        ].map((hyp, i) => (
                                            <div key={i} className="flex items-start gap-2 text-white/60">
                                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: `${glassos.blue}33`, color: glassos.blue }}>{i + 1}</span>
                                                {hyp}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-white/10" />

                            {/* PHASE 3 */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase" style={{ backgroundColor: `${glassos.green}33`, color: glassos.green }}>Phase 3</span>
                                    <h2 className="text-base font-semibold text-white/90">Ethnographic Research</h2>
                                </div>
                                <p className="text-sm text-white/50">
                                    <strong className="text-white/70">Goal:</strong> Understand the disconnect between physical and digital purchasing experiences.
                                </p>

                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-xs"><MapPin size={12} style={{ color: glassos.green }} /> Observation Focus Areas</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Entrance & Wayfinding', 'Ticket Information', 'Purchase Process', 'User Emotions'].map(tag => (
                                                <div key={tag} className="p-2 rounded text-[10px] text-center font-medium" style={{ backgroundColor: `${glassos.green}26`, color: glassos.green }}>{tag}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-xs"><Eye size={12} style={{ color: glassos.teal }} /> Key Observation</h4>
                                        <p className="text-xs text-white/60 italic">
                                            "Significant differences between the smooth physical ticket purchasing experience and the frustrating digital experience, creating misaligned mental models."
                                        </p>
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
                                <h2 className="text-xl font-semibold mb-4 text-white/90">Key Findings: Purchase Journey Pain Points</h2>
                                <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {[
                                        {
                                            title: "1. Account Creation Barriers",
                                            items: ['Complex account creation process', 'Security and privacy concerns', 'Difficult password management', 'Forced account creation at checkout'],
                                            quote: '"Why do I need to create an account just to buy a ticket?"',
                                            color: glassos.red
                                        },
                                        {
                                            title: "2. Cart Management Issues",
                                            items: ['Cart sessions expiring too quickly', 'Inability to edit cart efficiently', 'Long, complex checkout process', 'Poor cart customization'],
                                            quote: null,
                                            color: glassos.orange
                                        },
                                        {
                                            title: "3. Ticket Booking Complexity",
                                            items: ['Over-simplified calendar lacking info', 'Unintuitive time slot booking', 'Missing system status indicators', 'Fees not displayed upfront'],
                                            quote: null,
                                            color: glassos.yellow
                                        },
                                        {
                                            title: "4. Information Architecture",
                                            items: ['Disorganized site structure', 'Critical information hidden', 'Lack of clear wayfinding', 'Users depend on staff for basic info'],
                                            quote: null,
                                            color: glassos.purple
                                        },
                                    ].map((finding, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <h3 className="font-medium mb-2 text-sm" style={{ color: finding.color }}>{finding.title}</h3>
                                            <ul className="text-white/50 text-xs space-y-1 list-disc list-inside mb-2">
                                                {finding.items.map((item, j) => <li key={j}>{item}</li>)}
                                            </ul>
                                            {finding.quote && (
                                                <p className="text-[10px] italic text-white/40 border-l-2 pl-2" style={{ borderColor: finding.color }}>
                                                    {finding.quote}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="backdrop-blur-sm p-6 rounded-xl border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(30,30,46,0.8), rgba(20,20,35,0.8))' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-base font-semibold text-white/90">User Journey Map: AGO Purchase Path</h2>
                                    <span className="text-[10px] text-white/40">Persona: Jessica</span>
                                </div>
                                <div className="relative border-l pl-6 space-y-5" style={{ borderColor: `${glassos.blue}4D` }}>
                                    {[
                                        { phase: "Pre-Planning", emotion: "Confused", desc: "Information split across multiple pages. Parking details buried." },
                                        { phase: "Online Purchase", emotion: "Frustrated & Anxious", desc: "+5 step checkout vs expected 2-3. Forced account creation." },
                                        { phase: "Arriving On-Site", emotion: "Overwhelmed", desc: "No clear signage. Users ask staff for directions. Info desk congestion." },
                                        { phase: "In-Person Purchase", emotion: "Relieved", desc: "Fast transaction. Payment processed quickly. Receives tickets." },
                                        { phase: "Exploring Gallery", emotion: "Lost", desc: "Museum wayfinding unclear. No digital gallery guide. Uses printed map." }
                                    ].map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[27px] w-3 h-3 rounded-full border-2" style={{ backgroundColor: glassos.pink, borderColor: '#1e1e2e' }} />
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-medium uppercase" style={{ color: glassos.pink }}>{step.phase}</span>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{step.emotion}</span>
                                            </div>
                                            <p className="text-white/40 text-xs">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="p-4 rounded-lg border" style={{ backgroundColor: `${glassos.teal}1A`, borderColor: `${glassos.teal}33` }}>
                                <h3 className="font-medium mb-2 flex items-center gap-2 text-sm" style={{ color: glassos.teal }}>
                                    <Lightbulb size={14} /> Cognitive Dissonance Discovery
                                </h3>
                                <p className="text-sm text-white/60">
                                    Ethnographic research revealed that the <strong className="text-white/80">physical ticket purchase was easy</strong> (2-3 minutes, clear process) while the <strong className="text-white/80">digital experience was frustrating</strong> (+5 steps, account required). This mismatch creates negative brand perception before visitors even arrive.
                                </p>
                            </div>
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
                                <p className="text-sm text-white/50 mb-4">Strategic recommendations across four key areas based on research findings.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: User,
                                        color: glassos.blue,
                                        title: '1. Account Creation',
                                        items: ['Implement guest checkout option', 'Reduce required personal information', 'Provide clear value proposition for accounts', 'Improve password management UX']
                                    },
                                    {
                                        icon: ShoppingCart,
                                        color: glassos.green,
                                        title: '2. Cart Management',
                                        items: ['Extend cart session timeout', 'Enable in-cart editing without restarting', 'Streamline checkout to reduce steps', 'Add cart saving functionality']
                                    },
                                    {
                                        icon: Calendar,
                                        color: glassos.purple,
                                        title: '3. Ticket Booking',
                                        items: ['Redesign calendar to show events clearly', 'Add system status indicators', 'Display all fees upfront', 'Align digital with physical mental models']
                                    },
                                    {
                                        icon: MapPin,
                                        color: glassos.orange,
                                        title: '4. Information Architecture',
                                        items: ['Reorganize site for intuitive trip planning', 'Develop clear content strategy', 'Improve search and filtering', 'Add digital wayfinding resources']
                                    },
                                ].map((rec, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${rec.color}33`, color: rec.color }}>
                                            <rec.icon size={18} />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <h3 className="text-sm font-medium text-white/90">{rec.title}</h3>
                                            <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
                                                {rec.items.map((item, j) => <li key={j}>{item}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h3 className="font-medium text-sm mb-3 text-white/80">Quick Wins (High Impact, Low Effort)</h3>
                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                    {[
                                        { title: 'Guest Checkout', desc: 'Immediate reduction in cart abandonment' },
                                        { title: 'Extended Cart Timeout', desc: 'Let users return to complete purchase' },
                                        { title: 'Upfront Fee Display', desc: 'Build trust, reduce checkout surprises' },
                                    ].map((win, i) => (
                                        <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: `${glassos.green}1A`, border: `1px solid ${glassos.green}33` }}>
                                            <div className="font-medium mb-1 text-xs" style={{ color: glassos.green }}>{win.title}</div>
                                            <p className="text-[10px] text-white/50">{win.desc}</p>
                                        </div>
                                    ))}
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
                                    <CheckCircle2 size={16} style={{ color: glassos.green }} /> Validated Hypotheses
                                </h2>
                                <div className="space-y-2">
                                    {[
                                        'Forced account creation during checkout increases cart abandonment',
                                        'Users prefer calendar views that show available events clearly',
                                        'Cart editing capabilities directly impact conversion rates',
                                        'Cognitive dissonance between physical and digital experiences negatively impacts satisfaction'
                                    ].map((hyp, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                            <CheckCircle2 size={12} style={{ color: glassos.green }} />
                                            {hyp}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-base font-semibold mb-4 text-white/90">Business Value</h2>
                                <div className={`grid gap-3 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                    {[
                                        { title: 'Revenue Impact', items: ['Clear roadmap to reduce cart abandonment', 'Opportunity to convert visitors into members', 'Decrease dependency on in-person sales'], color: glassos.green },
                                        { title: 'Competitive Positioning', items: ['Insights vs leading cultural institutions', 'Strategic recommendations to match standards', 'Unique opportunities identified'], color: glassos.blue },
                                        { title: 'User Experience & Brand', items: ['Data-driven understanding of frustrations', 'Prioritized improvements for satisfaction', 'Framework for consistent experiences'], color: glassos.purple },
                                        { title: 'Operational Efficiency', items: ['Reduced burden on front desk staff', 'Better traffic flow in physical space', 'Foundation for future product decisions'], color: glassos.orange },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: `${item.color}1A`, border: `1px solid ${item.color}33` }}>
                                            <div className="font-medium mb-2 text-sm" style={{ color: item.color }}>{item.title}</div>
                                            <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
                                                {item.items.map((li, j) => <li key={j}>{li}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className={`grid gap-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                <div>
                                    <h3 className="font-medium text-sm mb-3 text-white/90">Methodology Highlights</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.green }}>What Worked Well</div>
                                            <ul className="text-xs text-white/60 list-disc list-inside space-y-0.5">
                                                <li>Mixed-method approach provided comprehensive insights</li>
                                                <li>Ethnographic research revealed unexpected findings</li>
                                                <li>Affinity mapping enabled efficient synthesis</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.orange }}>Challenges Overcome</div>
                                            <ul className="text-xs text-white/60 list-disc list-inside space-y-0.5">
                                                <li>Participant no-shows: Recruited 2 extra participants</li>
                                                <li>Technical issues: Tested all tech before interviews</li>
                                                <li>Site access: Prepared official research letter</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm mb-3 text-white/90">Next Steps</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium text-white/40 uppercase mb-1">Recommended Actions</div>
                                            <ol className="text-xs text-white/60 list-decimal list-inside space-y-0.5">
                                                <li>Prioritize quick wins: Guest checkout, extended timeout</li>
                                                <li>Usability testing on redesigned flows</li>
                                                <li>Monitor conversion rates post-implementation</li>
                                            </ol>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="text-[10px] font-medium uppercase mb-1" style={{ color: glassos.blue }}>What I'd Do Differently</div>
                                            <ul className="text-xs text-white/60 list-disc list-inside space-y-0.5">
                                                <li>Include more diverse participant demographics</li>
                                                <li>Incorporate quantitative analytics data</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="text-center pt-4 text-white/30 text-xs italic">
                                "This case study demonstrates my ability to design and execute comprehensive UX research, synthesize complex qualitative data, and deliver strategic recommendations that balance user needs with business objectives."
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
