import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpenText, ArrowDown, X, FolderOpen, LayoutGrid, Trash2, FileText, ScrollText } from 'lucide-react';
import { useViewMode } from '../store/useViewMode';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
    const [activeStep, setActiveStep] = useState(0);
    const { switchToStandard } = useViewMode();

    const handleSwitchToStandard = () => {
        onClose();
        switchToStandard();
    };

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveStep(0);
        }
    }, [isOpen]);

    // Auto-cycle through steps
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 2);
        }, 3000);
        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-10 max-w-lg w-full mx-4"
                    >
                        <div className="bg-[#1e1e1e]/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="relative px-6 pt-6 pb-4">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <h2 className="text-xl font-semibold text-white/90">
                                    Welcome to my Portfolio
                                </h2>
                                <p className="text-sm text-white/50 mt-1">
                                    This is an interactive OS experience
                                </p>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6">
                                {/* Step indicators */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <button
                                        onClick={() => setActiveStep(0)}
                                        className={`w-2 h-2 rounded-full transition-all ${activeStep === 0 ? 'bg-blue-400 w-6' : 'bg-white/20 hover:bg-white/30'}`}
                                    />
                                    <button
                                        onClick={() => setActiveStep(1)}
                                        className={`w-2 h-2 rounded-full transition-all ${activeStep === 1 ? 'bg-amber-400 w-6' : 'bg-white/20 hover:bg-white/30'}`}
                                    />
                                </div>

                                {/* Feature highlights - animated switching */}
                                <AnimatePresence mode="wait">
                                    {activeStep === 0 ? (
                                        <motion.div
                                            key="case-studies"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 animate-pulse-glow">
                                                    <BookOpenText className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white/90 mb-1">Case Studies</h3>
                                                    <p className="text-xs text-white/50 leading-relaxed">
                                                        Click the <strong className="text-blue-400">blue books</strong> icon in the dock to view my UX research case studies.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="quick-access"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                                                    <FolderOpen className="w-7 h-7 text-amber-400" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white/90 mb-1">Quick Access</h3>
                                                    <p className="text-xs text-white/50 leading-relaxed">
                                                        Click the <strong className="text-amber-400">orange folder</strong> icon for quick access to my resume and case study PDFs.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Arrow pointing down */}
                                <div className="flex flex-col items-center gap-2 py-2">
                                    <span className="text-xs text-white/40">Find them in the dock</span>
                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        <ArrowDown className="w-6 h-6 text-white/40" />
                                    </motion.div>
                                </div>

                                {/* Dock preview - shows which icon is highlighted based on step */}
                                <div className="bg-black/30 rounded-2xl p-3 border border-white/10">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* Launcher */}
                                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <LayoutGrid className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                                        </div>

                                        {/* Case Studies - highlighted when step 0 */}
                                        <div className="relative">
                                            <motion.div
                                                animate={activeStep === 0 ? {
                                                    scale: [1, 1.1, 1],
                                                    boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0)']
                                                } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeStep === 0 ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border-2 border-blue-400' : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40'}`}
                                            >
                                                <BookOpenText className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                                            </motion.div>
                                            {activeStep === 0 && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
                                            )}
                                        </div>

                                        {/* Quick Access - highlighted when step 1 */}
                                        <div className="relative">
                                            <motion.div
                                                animate={activeStep === 1 ? {
                                                    scale: [1, 1.1, 1],
                                                    boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 20px rgba(251,191,36,0.5)', '0 0 0px rgba(251,191,36,0)']
                                                } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeStep === 1 ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 border-2 border-amber-400' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40'}`}
                                            >
                                                <FolderOpen className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                                            </motion.div>
                                            {activeStep === 1 && (
                                                <>
                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                                                    {/* Popover preview */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: -8 }}
                                                        className="absolute left-1/2 bottom-full mb-2"
                                                        style={{ transform: 'translateX(-50%)' }}
                                                    >
                                                        <div className="relative flex flex-col items-center -translate-x-1/2">
                                                            <div className="bg-[#2a2a2a] rounded-lg border border-white/20 shadow-xl p-2 w-36">
                                                                <div className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/10">
                                                                    <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                                                                        <ScrollText size={10} className="text-green-400" />
                                                                    </div>
                                                                    <span className="text-[10px] text-white/70">Resume</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/10">
                                                                    <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                                                                        <FileText size={10} className="text-blue-400" />
                                                                    </div>
                                                                    <span className="text-[10px] text-white/70 truncate">Time Mgmt...</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/10">
                                                                    <div className="w-5 h-5 rounded bg-red-500/20 flex items-center justify-center">
                                                                        <FileText size={10} className="text-red-400" />
                                                                    </div>
                                                                    <span className="text-[10px] text-white/70">AGO...</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-2 h-2 bg-[#2a2a2a] rotate-45 border-r border-b border-white/20 -mt-1" />
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>

                                        {/* Separator */}
                                        <div className="w-px h-6 bg-white/20 mx-1" />

                                        {/* Trash */}
                                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Trash2 className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional tips */}
                                <div className="mt-4 text-xs text-white/40 text-center">
                                    <p>Explore the desktop, open apps, and browse files just like a real OS!</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 space-y-3">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Got it, let me explore
                                </button>
                                <button
                                    onClick={handleSwitchToStandard}
                                    className="w-full py-2.5 text-white/50 hover:text-white/70 text-sm transition-colors"
                                >
                                    No thanks, take me to the regular site
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
