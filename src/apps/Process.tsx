import React, { useState } from 'react';
import { Grid, Clock3, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudyConfig } from './case-studies/types';
import { TimeManagementStudy } from './case-studies/TimeManagementStudy';
import { AGODigitalStudy } from './case-studies/AGODigitalStudy';
import { CASE_STUDY_BREAKPOINT } from './case-studies/types';

const caseStudies: CaseStudyConfig[] = [
    {
        id: 'time-mgmt',
        title: 'Time Management App',
        subtitle: 'UX Research & Strategy',
        thumbnailGradient: 'from-blue-500/80 to-indigo-600/80',
        icon: Clock3,
        date: 'Q1 2025',
        role: 'UX Researcher',
        component: TimeManagementStudy
    },
    {
        id: 'ago-digital',
        title: 'AGO Digital Experience',
        subtitle: 'Purchase Journey Optimization',
        thumbnailGradient: 'from-pink-500/80 to-rose-600/80',
        icon: Grid,
        date: 'Q4 2024',
        role: 'Lead UX Researcher',
        component: AGODigitalStudy
    }
];

interface ProcessProps {
    size?: { width: number; height: number };
}

export const Process: React.FC<ProcessProps> = ({ size }) => {
    const [activeStudyId, setActiveStudyId] = useState<string | null>(null);
    const isCompact = size ? size.width < CASE_STUDY_BREAKPOINT : false;

    const ActiveComponent = activeStudyId
        ? caseStudies.find(c => c.id === activeStudyId)?.component
        : null;

    return (
        <div className="w-full h-full bg-[#1e1e1e] overflow-hidden font-sans text-white">
            <AnimatePresence mode="wait">
                {!activeStudyId ? (
                    <motion.div
                        key="launcher"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-y-auto ${isCompact ? 'p-4' : 'p-8'}`}
                    >
                        <div className="max-w-4xl mx-auto">
                            <header className={isCompact ? 'mb-6' : 'mb-10'}>
                                <h1 className={`font-semibold text-white/90 tracking-tight ${isCompact ? 'text-xl mb-1' : 'text-2xl mb-2'}`}>
                                    Case Studies
                                </h1>
                                <p className={`text-white/50 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                                    Recent work in UX research, product design, and strategy.
                                </p>
                            </header>

                            <div className={isCompact ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-4'}>
                                {caseStudies.map((study) => (
                                    <motion.button
                                        key={study.id}
                                        onClick={() => setActiveStudyId(study.id)}
                                        className={`group relative text-left bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isCompact ? 'flex flex-row items-stretch' : 'flex flex-col'}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`bg-gradient-to-br ${study.thumbnailGradient} flex items-center justify-center relative overflow-hidden shrink-0 ${isCompact ? 'w-20 h-20' : 'w-full h-32'}`}>
                                            <div className="absolute inset-0 bg-black/20" />
                                            {!isCompact && (
                                                <study.icon className="text-white/10 w-24 h-24 absolute -bottom-6 -right-6 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                                            )}
                                            <study.icon className={`text-white relative z-10 drop-shadow-lg ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />
                                        </div>
                                        <div className={`flex-1 ${isCompact ? 'p-3 flex flex-col justify-center' : 'p-4'}`}>
                                            <div className={`flex justify-between items-center w-full ${isCompact ? 'mb-1' : 'mb-2'}`}>
                                                <span className={`px-2 py-0.5 bg-white/10 text-white/60 font-medium rounded ${isCompact ? 'text-[9px]' : 'text-[10px]'}`}>
                                                    {study.date}
                                                </span>
                                                <ArrowRight className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" size={isCompact ? 14 : 16} />
                                            </div>
                                            <h3 className={`font-medium text-white/90 ${isCompact ? 'text-sm' : 'text-base mb-0.5'}`}>
                                                {study.title}
                                            </h3>
                                            <p className={`text-white/50 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                                                {study.subtitle}
                                            </p>
                                            {!isCompact && (
                                                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/40">
                                                    {study.role}
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="study"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full h-full"
                    >
                        {ActiveComponent && (
                            <ActiveComponent
                                onBack={() => setActiveStudyId(null)}
                                isCompact={isCompact}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
