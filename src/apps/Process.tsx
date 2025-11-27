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
    FileText
} from 'lucide-react';
import { useOSStore } from '../store/useOSStore';
import { apps } from '../utils/apps';

interface Section {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

export const Process: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPersona, setShowPersona] = useState(false);
    const { launchApp, setFocusModeActive } = useOSStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Reset scroll position when tab changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    // Interaction: Focus Mode Simulation
    const triggerFocusMode = () => {
        setFocusModeActive(true);
        setTimeout(() => setFocusModeActive(false), 3000);
    };

    // Interaction: Notification Simulation
    const triggerNotification = () => {
        // Fallback toast logic could go here, but we're pointing to the calendar now
        // We'll keep a simple alert for this specific button if clicked, 
        // or redirect to the Calendar app as the better demo.
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
        // Assuming the file ID for the PDF in useFileSystem is 'project-alpha' based on previous read
        if (pdfApp) {
            launchApp(pdfApp, { fileId: 'project-alpha', title: 'UX Research Case Study.pdf', forceNew: true });
        }
    };

    const sections: Section[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-500' },
        { id: 'research', label: 'Research', icon: Search, color: 'text-purple-500' },
        { id: 'analysis', label: 'Analysis', icon: Lightbulb, color: 'text-amber-500' },
        { id: 'design', label: 'Design', icon: PenTool, color: 'text-pink-500' },
        { id: 'impact', label: 'Impact', icon: TrendingUp, color: 'text-green-500' },
    ];

    return (
        <div className="flex w-full h-full bg-[#f8f9fa] text-slate-800 font-sans transition-colors duration-700">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.2);
                    border-radius: 10px;
                    border: 2px solid rgba(255,255,255,0.8); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(0,0,0,0.3);
                }
            `}</style>
            
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 transition-colors duration-500">
                <div className="p-6 border-b border-inherit">
                    <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm bg-blue-600">
                            <Target size={18} />
                        </div>
                        <span>Case Study</span>
                    </div>
                    <div className="text-xs mt-2 text-slate-500">Time Management App • Q1 2025</div>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveTab(section.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium text-left group
                                ${activeTab === section.id 
                                    ? 'bg-white shadow-sm text-blue-600 ring-1 ring-slate-200' 
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                }`}
                        >
                            <section.icon size={18} className={`${activeTab === section.id ? section.color : 'text-slate-400'} group-hover:scale-110 transition-transform`} />
                            <span>{section.label}</span>
                            {activeTab === section.id && <ArrowRight size={14} className="ml-auto opacity-50" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-inherit space-y-2">
                    <button onClick={launchFullReport} className="w-full py-2 px-3 rounded-md text-xs flex items-center justify-center gap-2 border transition-colors bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                        <FileText size={12} />
                        View Full Report
                    </button>
                    <button onClick={() => setShowPersona(!showPersona)} className="w-full py-2 px-3 rounded-md text-xs flex items-center justify-center gap-2 border transition-colors bg-white border-slate-200 hover:bg-slate-50 text-slate-600">
                        <User size={12} />
                        {showPersona ? 'Hide Persona' : 'View Persona: Alex'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative custom-scrollbar">
                <div className="max-w-5xl mx-auto p-12 space-y-16 pb-32">
                    
                    {/* PERSONA CARD OVERLAY */}
                    {showPersona && (
                        <div className="sticky top-0 z-40 mb-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 shadow-2xl border border-slate-700 animate-in slide-in-from-top-4">
                            <div className="flex items-start gap-6">
                                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-slate-700 shadow-lg shrink-0">AL</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold">Alex Lee</h3>
                                            <p className="text-blue-200 mb-4">32 • Office Worker • Hybrid Work Model</p>
                                        </div>
                                        <button onClick={() => setShowPersona(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-xs">Close</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                        <div className="col-span-2">
                                            <h4 className="font-bold text-blue-400 uppercase text-xs mb-2 tracking-wider">Goals</h4>
                                            <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                                <li>Reduce time wasted on distractions</li>
                                                <li>Avoid procrastinating on non-urgent tasks</li>
                                                <li>Complete all tasks set for the week</li>
                                            </ul>
                                        </div>
                                        <div className="col-span-2">
                                            <h4 className="font-bold text-red-400 uppercase text-xs mb-2 tracking-wider">Pain Points</h4>
                                            <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                                <li>Task Switching: Frequent interruptions by coworkers</li>
                                                <li>Low Motivation: Procrastinates on repetitive tasks</li>
                                                <li>Tool Overload: Using multiple apps is overwhelming</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-emerald-400 uppercase text-xs mb-2 tracking-wider">Strategies</h4>
                                            <ul className="space-y-1 text-slate-300 text-xs">
                                                <li>Calendar Blocking</li>
                                                <li>Whiteboard reminders</li>
                                                <li>Prioritizing by urgency</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-orange-400 uppercase text-xs mb-2 tracking-wider">Distractions</h4>
                                            <ul className="space-y-1 text-slate-300 text-xs">
                                                <li>Texts & Messages</li>
                                                <li>Social Media</li>
                                                <li>Coworkers (Socializing)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT */}
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            <header className="border-b border-slate-200 pb-8">
                                <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Time Management App: UX Research Case Study</h1>
                                <p className="text-xl text-slate-500 leading-relaxed">
                                    Designing a time management app that aligns with user expectations and actual usage patterns.
                                </p>
                            </header>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Role</div>
                                    <div className="font-semibold text-slate-800">UX Researcher</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Timeline</div>
                                    <div className="font-semibold text-slate-800">Jan 2025 - Apr 2025 (3 Mos)</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Methods</div>
                                    <div className="font-semibold text-slate-800">Focus Groups, Survey, Diary Study</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Team</div>
                                    <div className="font-semibold text-slate-800">Group research / Individual contrib.</div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-slate-900">The Challenge</h2>
                                    <p className="text-slate-600 leading-relaxed">
                                        Design a time management app that aligns with user expectations and actual usage patterns. 
                                        The project needed to understand what features users <span className="font-bold text-blue-600">truly need</span> versus what they <span className="italic">think</span> they need, 
                                        and how these tools fit into their daily routines.
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <Search size={20} /> Research Question
                                    </h3>
                                    <p className="text-blue-800 italic text-lg">
                                        "Which time management tools, features, and strategies do individuals who are good at managing their time use?"
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Lightbulb size={20} className="text-amber-500" /> Hypothesis
                                </h3>
                                <p className="text-lg text-slate-700">
                                    Users are more likely to use a time management app with features customizable to their preferences.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">My Approach</h2>
                                <p className="text-slate-600 mb-6">I designed and executed a three-phase mixed-methods research study to understand user behavior from multiple angles.</p>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Exploratory</div>
                                            <div className="text-sm text-slate-500">Focus Group</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Validation</div>
                                            <div className="text-sm text-slate-500">Online Survey</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white p-5 rounded-lg border border-slate-200 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <div className="font-bold text-slate-900">In-Context</div>
                                            <div className="text-sm text-slate-500">Diary Study</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'research' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16">
                             
                             {/* PHASE 1 */}
                             <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">Phase 1</span>
                                    <h2 className="text-2xl font-bold text-slate-900">Focus Group (Exploratory)</h2>
                                </div>
                                <p className="text-slate-600">
                                    <strong>Goal:</strong> Identify user needs, preferences, and feature priorities.
                                </p>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 font-bold text-slate-700 text-sm">Research Artifact: KWHL Table</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-500">
                                                    <th className="p-4 font-semibold">K (What do I know?)</th>
                                                    <th className="p-4 font-semibold">W (What do I want to know?)</th>
                                                    <th className="p-4 font-semibold">H (How will I learn?)</th>
                                                    <th className="p-4 font-semibold">L (What do I hope to learn?)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr>
                                                    <td className="p-4 text-slate-600">Many people struggle with time management</td>
                                                    <td className="p-4 text-slate-600">What are the most effective strategies?</td>
                                                    <td className="p-4 text-slate-600">Conducting a focus group</td>
                                                    <td className="p-4 text-slate-600">Behaviors/habits that influence time management</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-4 text-slate-600">Deadlines help people stay accountable</td>
                                                    <td className="p-4 text-slate-600">How do people organize/track deadlines?</td>
                                                    <td className="p-4 text-slate-600">Survey to collect data</td>
                                                    <td className="p-4 text-slate-600">Preferred tools/features across different people</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-100 p-6 rounded-xl">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><StickyNote size={16} /> Sticky Note Findings: Challenges</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Procrastination', 'Too many tasks', 'Forgot my plan', 'Difficulty keeping track', 'Social Media', 'Tired/Bored'].map(tag => (
                                                <span key={tag} className="bg-red-200 text-red-900 px-3 py-1.5 rounded shadow-sm text-xs transform -rotate-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-100 p-6 rounded-xl">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><StickyNote size={16} /> Sticky Note Findings: Solutions</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Screen time limit', 'To-Do List', 'Reminders', 'Block social media', 'Set alarms', 'Put phone away'].map(tag => (
                                                <span key={tag} className="bg-yellow-100 text-yellow-900 px-3 py-1.5 rounded shadow-sm text-xs transform rotate-1">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             </section>

                             <hr className="border-slate-200" />

                             {/* PHASE 2 */}
                             <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Phase 2</span>
                                    <h2 className="text-2xl font-bold text-slate-900">Online Survey (Validation)</h2>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white p-4 rounded border border-slate-200">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Participants</div>
                                        <div className="text-lg font-bold">17 self-identified</div>
                                        <div className="text-xs text-slate-400">"Good at time management"</div>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-slate-200">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Platform</div>
                                        <div className="text-lg font-bold">JotForm</div>
                                        <div className="text-xs text-slate-400">12 Questions</div>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-slate-200">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Focus</div>
                                        <div className="text-lg font-bold">Usage & Features</div>
                                        <div className="text-xs text-slate-400">Anti-procrastination strategies</div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800 text-sm">Q1: What type of tasks do you manage?</h4>
                                        <div className="h-48 flex items-end space-x-4 bg-white p-4 rounded-lg border border-slate-200">
                                            <div className="w-1/4 bg-blue-800 rounded-t relative group h-[88%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">15</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Personal</div>
                                            </div>
                                            <div className="w-1/4 bg-teal-500 rounded-t relative group h-[76%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">13</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Work</div>
                                            </div>
                                            <div className="w-1/4 bg-yellow-500 rounded-t relative group h-[35%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">6</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Collab</div>
                                            </div>
                                            <div className="w-1/4 bg-slate-500 rounded-t relative group h-[29%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">5</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Academic</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-800 text-sm">Q7: Strategy to avoid procrastination?</h4>
                                        <div className="h-48 flex items-end space-x-4 bg-white p-4 rounded-lg border border-slate-200">
                                            <div className="w-1/4 bg-blue-800 rounded-t relative h-[53%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">9</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Deadlines</div>
                                            </div>
                                            <div className="w-1/4 bg-teal-500 rounded-t relative h-[53%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">9</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Breakdown</div>
                                            </div>
                                            <div className="w-1/4 bg-yellow-500 rounded-t relative h-[35%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">6</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">None</div>
                                            </div>
                                            <div className="w-1/4 bg-slate-500 rounded-t relative h-[6%]">
                                                <span className="absolute -top-6 w-full text-center text-xs font-bold">1</span>
                                                <div className="absolute bottom-2 w-full text-center text-[10px] text-white/80">Blocking</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-3">Key Stats</h4>
                                    <ul className="space-y-2 text-sm text-slate-700">
                                        <li className="flex justify-between">
                                            <span>Use weekly calendar "Several times a day"</span>
                                            <span className="font-bold">47% (8/17)</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Customize features "Rarely"</span>
                                            <span className="font-bold">47% (8/17)</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Believe advanced features increase effectiveness</span>
                                            <span className="font-bold">41% (7/17)</span>
                                        </li>
                                    </ul>
                                </div>
                             </section>

                             <hr className="border-slate-200" />

                             {/* PHASE 3 */}
                             <section className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Phase 3</span>
                                    <h2 className="text-2xl font-bold text-slate-900">Diary Study (In-Context)</h2>
                                </div>
                                <p className="text-slate-600">
                                    <strong>Goal:</strong> Observe real-world behavior and tool interactions over time (10-day study, 4 participants).
                                </p>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-slate-800 mb-4">Common Distractions</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-pink-100 p-3 rounded text-xs text-center font-medium text-pink-800">Social Media</div>
                                            <div className="bg-pink-100 p-3 rounded text-xs text-center font-medium text-pink-800">Emails</div>
                                            <div className="bg-pink-100 p-3 rounded text-xs text-center font-medium text-pink-800">Colleagues</div>
                                            <div className="bg-pink-100 p-3 rounded text-xs text-center font-medium text-pink-800">Family</div>
                                            <div className="bg-gray-100 p-3 rounded text-xs text-center font-medium text-gray-600">Boredom</div>
                                            <div className="bg-gray-100 p-3 rounded text-xs text-center font-medium text-gray-600">Anxiety</div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-slate-800 mb-4">Strategies to Refocus</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-yellow-100 p-3 rounded text-xs text-center font-medium text-yellow-800">Outlook & Teams</div>
                                            <div className="bg-yellow-100 p-3 rounded text-xs text-center font-medium text-yellow-800">Focus on one task</div>
                                            <div className="bg-teal-100 p-3 rounded text-xs text-center font-medium text-teal-800">To-Do List</div>
                                            <div className="bg-teal-100 p-3 rounded text-xs text-center font-medium text-teal-800">Time Constraints</div>
                                            <div className="bg-purple-100 p-3 rounded text-xs text-center font-medium text-purple-800">Reminders</div>
                                            <div className="bg-purple-100 p-3 rounded text-xs text-center font-medium text-purple-800">Reprioritizing</div>
                                        </div>
                                    </div>
                                </div>
                             </section>
                         </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            <section>
                                <h2 className="text-3xl font-bold mb-8">Key Findings</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: "1. Frequency Drives Engagement", desc: "Users who successfully manage their time use tools multiple times daily. Constant touchpoints keep them organized." },
                                        { title: "2. Mood Impacts Productivity", desc: "Low mood dramatically increases procrastination. Users need motivators, not just reminders." },
                                        { title: "3. Interruptions Derail Focus", desc: "Users struggle to refocus after interruptions from colleagues or digital notifications." },
                                        { title: "4. The Customization Paradox", desc: "Users want flexibility but rarely customize. They need 'smart defaults' over blank slates." },
                                        { title: "5. Breaking Tasks is Key", desc: "The most effective strategies were setting deadlines and breaking tasks into smaller steps." },
                                        { title: "6. Weekly Calendar is Essential", desc: "The majority accessed their weekly calendar view several times daily for planning." }
                                    ].map((finding, i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                            <h3 className="font-bold text-blue-700 mb-2">{finding.title}</h3>
                                            <p className="text-slate-600 text-sm">{finding.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Daily Journey Map</h2>
                                    <span className="text-sm text-slate-400">Persona: Alex Lee</span>
                                </div>
                                <div className="space-y-8">
                                    <div className="relative border-l-2 border-slate-700 pl-8 space-y-8">
                                        {[
                                            { time: "Morning", mood: "😊 Productive", title: "Reviewing & Planning", desc: "Mindset is motivated. Pain point: Reviewing full calendar feels overwhelming." },
                                            { time: "Mid-Morning", mood: "😐 Distracted", title: "Deep Work Attempt", desc: "Engaged but susceptible. Pain point: Digital notifications break concentration." },
                                            { time: "Afternoon", mood: "😫 Low Energy", title: "The Slump", desc: "Low motivation. Pain point: Shifting to personal tasks and social media temptation." },
                                            { time: "Late Afternoon", mood: "😰 Stressed", title: "The Race", desc: "Racing against deadlines. Pain point: Difficulty maintaining focus, tired." },
                                            { time: "Evening", mood: "😌 Relief/Guilt", title: "Reflection", desc: "Relaxed but guilty about incomplete work. Reviews day and plans ahead." }
                                        ].map((step, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[39px] w-5 h-5 rounded-full bg-blue-500 border-4 border-slate-900"></div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider w-32">{step.time}</span>
                                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{step.mood}</span>
                                                </div>
                                                <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                                                <p className="text-slate-400 text-sm">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'design' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Design Recommendations</h2>
                                <p className="text-slate-600 mb-8">Translating insights into actionable features. Click the button below to try the live prototype.</p>
                                <button 
                                    onClick={launchPrototype}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                                >
                                    <ExternalLink size={20} />
                                    Launch "SmartCal" Prototype
                                </button>
                            </div>

                            <div className="space-y-12">
                                {/* Rec 1 */}
                                <div className="flex gap-6 group">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <CalendarIcon size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900">1. Smart Calendar with Quick Access</h3>
                                        <p className="text-slate-600">Weekly view as default. Widget for at-a-glance planning. Drag-and-drop rescheduling.</p>
                                        <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-500 italic">
                                            "I use a whiteboard... otherwise I rely on my calendar." - Participant
                                        </div>
                                    </div>
                                </div>

                                {/* Rec 2 */}
                                <div className="flex gap-6 group">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <List size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900">2. Intelligent Task Management</h3>
                                        <p className="text-slate-600 mb-4">Automatically prioritize and break down complex work.</p>
                                        <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                <span className="font-medium">High: Prepare Q2 report</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                <span>Medium: Schedule team meeting</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                <span>Low: Respond to emails</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rec 3 */}
                                <div className="flex gap-6 group">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <Target size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-900">3. Focus Protection Features</h3>
                                        <p className="text-slate-600">Do Not Disturb mode. Silence notifications. Visual indicator when in focus mode.</p>
                                        <button 
                                            onClick={triggerFocusMode}
                                            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-all flex items-center gap-2 shadow-md"
                                        >
                                            <Target size={14} />
                                            Simulate Focus Mode (OS Wide)
                                        </button>
                                        <p className="text-xs text-slate-400 mt-2 italic">
                                            (Click to see how the OS blurs to reduce cognitive load)
                                        </p>
                                    </div>
                                </div>

                                {/* Rec 4 & 5 */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Clock className="text-teal-500" />
                                            <h4 className="font-bold text-lg">4. Time Blocking</h4>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">Built-in Pomodoro timer. Guided break prompts to prevent burnout. Time-box task suggestions.</p>
                                        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-teal-800 text-sm flex items-center gap-2">
                                            <Clock size={16} /> 25:00 Focus Session <span className="ml-auto text-teal-600 font-bold">▶︎</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Bell className="text-yellow-500" />
                                            <h4 className="font-bold text-lg">5. Gentle Nudges</h4>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">Motivational prompts during low-energy periods. End-of-day incomplete item review.</p>
                                        <button 
                                            onClick={triggerNotification}
                                            className="text-xs bg-yellow-50/50 hover:bg-yellow-50 px-3 py-1.5 rounded text-yellow-600 flex items-center gap-2 w-fit border border-yellow-200"
                                        >
                                            <Bell size={12} /> Test "Nudge" (Redirects to SmartCal)
                                        </button>
                                    </div>
                                </div>

                                {/* Rec 6 & 7 */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <RefreshCw size={18} /> System Features
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">6. Cross-Device Syncing</h4>
                                            <p className="text-xs text-slate-500 mb-2">Identified as the #1 biggest challenge. Critical for adoption.</p>
                                            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-200">
                                                <RefreshCw size={12} /> Syncing with iPhone...
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">7. Task Replication</h4>
                                            <p className="text-xs text-slate-500 mb-2">Allow users to duplicate recurring tasks easily to reduce setup friction.</p>
                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-md border border-green-200">
                                                <Check size={12} /> Duplicate "Daily Standup"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'impact' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                            
                            {/* Research Impact */}
                            <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="text-green-500" /> Research Impact
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Validated Hypothesis?</h3>
                                        <p className="text-lg text-slate-900">
                                            <span className="font-bold text-green-600">Yes, with a caveat.</span> Users want customization, but they need <span className="font-bold text-blue-600">smart defaults first</span>. The ideal app learns from user behavior.
                                        </p>
                                    </div>
                                    <hr className="border-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Design Principles Uncovered</h3>
                                        <ul className="mt-2 space-y-2 text-slate-600">
                                            <li>1. <strong>Reduce cognitive load:</strong> Smart defaults over blank slates.</li>
                                            <li>2. <strong>Protect focus time:</strong> Active interruption management.</li>
                                            <li>3. <strong>Adapt to mood:</strong> Recognize when users need extra support.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Business Value */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Business Value</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-lg">
                                        <div className="font-bold text-emerald-800 mb-1">Reduced Risk</div>
                                        <p className="text-sm text-emerald-700">Validated demand before development. Avoided building complex customization features that users wouldn't use.</p>
                                    </div>
                                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="font-bold text-blue-800 mb-1">Competitive Edge</div>
                                        <p className="text-sm text-blue-700">Differentiation through "Focus Mode" and smart prioritization logic.</p>
                                    </div>
                                    <div className="p-5 bg-purple-50 border border-purple-100 rounded-lg">
                                        <div className="font-bold text-purple-800 mb-1">Retention</div>
                                        <p className="text-sm text-purple-700">Addressing the #1 pain point (device syncing) directly improves long-term retention.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Methodology */}
                            <section className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 text-slate-900">Methodology Highlights</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded border border-slate-200">
                                            <div className="text-xs font-bold text-green-600 uppercase mb-1">What Worked Well</div>
                                            <ul className="text-sm text-slate-600 list-disc list-inside">
                                                <li>Recruiting "productive" users for positive pattern matching.</li>
                                                <li>Real-time journaling captured authentic moments of distraction.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white p-4 rounded border border-slate-200">
                                            <div className="text-xs font-bold text-orange-600 uppercase mb-1">Challenges & Solutions</div>
                                            <p className="text-sm text-slate-600 mb-2"><strong>Challenge:</strong> Low survey response rate.</p>
                                            <p className="text-sm text-slate-600"><strong>Solution:</strong> Recruited previous respondents for diary study to ensure high engagement.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-4 text-slate-900">Skills & Next Steps</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded border border-slate-200">
                                            <div className="text-xs font-bold text-blue-600 uppercase mb-1">What I'd Do Differently</div>
                                            <ul className="text-sm text-slate-600 list-disc list-inside">
                                                <li>Extend diary study to 14 days.</li>
                                                <li>Add observational component (screen recording).</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-100 p-4 rounded">
                                            <div className="text-xs font-bold text-slate-600 uppercase mb-1">Next Steps</div>
                                            <ol className="text-sm text-slate-600 list-decimal list-inside">
                                                <li>Usability Testing (Low-fi prototypes)</li>
                                                <li>Competitive Analysis audit</li>
                                                <li>A/B Testing prioritization accuracy</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="text-center pt-8 text-slate-400 text-sm italic">
                                "This case study demonstrates my ability to design and execute rigorous UX research, synthesize complex data into clear insights, and deliver recommendations that balance user needs with business objectives."
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
