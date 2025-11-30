import React from 'react';
import { Search, X } from 'lucide-react';

interface WelcomeToastProps {
  onExplore: () => void;
  onDismiss: () => void;
}

export const WelcomeToast: React.FC<WelcomeToastProps> = ({ onExplore, onDismiss }) => {
  return (
    <div className="absolute top-12 right-4 z-[5000] bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg p-4 max-w-sm animate-in slide-in-from-right-10 fade-in duration-500 group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors z-10"
      >
        <X size={14} />
      </button>
      <div
        onClick={onExplore}
        className="flex items-start gap-3 cursor-pointer relative z-0"
      >
        <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:text-blue-300 transition-colors">
          <Search size={20} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-white mb-1">Not sure where to start?</h3>
          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors pr-4">Click here to explore my files and projects.</p>
        </div>
      </div>
    </div>
  );
};
