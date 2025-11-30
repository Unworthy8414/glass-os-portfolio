import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import type { CaseStudyProps } from './types';

export const DemoPlaceholderStudy: React.FC<CaseStudyProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e] items-center justify-center relative">
            <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm">
                <ChevronLeft size={18} /> Back
            </button>
            <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 text-white/40 border border-white/10">
                    <Sparkles size={28} />
                </div>
                <h2 className="text-xl font-semibold text-white/90 mb-2">Coming Soon</h2>
                <p className="text-white/50 text-sm leading-relaxed">
                    This case study is currently being documented. Check back later for updates on the new design system project.
                </p>
            </div>
        </div>
    );
};
