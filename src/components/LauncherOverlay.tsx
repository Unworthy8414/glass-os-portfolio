import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { apps } from '../utils/apps';
import { useOSStore } from '../store/useOSStore';
import { Search, X } from 'lucide-react';

export const LauncherOverlay = () => {
  const { isLauncherOpen, toggleLauncher, launchApp } = useOSStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search when closed
  useEffect(() => {
    if (!isLauncherOpen) setSearchQuery('');
  }, [isLauncherOpen]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLauncherOpen) {
        toggleLauncher();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLauncherOpen, toggleLauncher]);

  const filteredApps = apps.filter(app => 
    app.id !== 'file-picker' && 
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isLauncherOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[6000] overflow-hidden flex flex-col items-center justify-center"
          onClick={(e) => {
              if (e.target === e.currentTarget) toggleLauncher();
          }}
        >
          {/* Background with Blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl -z-10 pointer-events-none" />

          {/* Search Bar */}
          <div className="w-full max-w-md mb-12 relative z-10 px-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all text-center font-medium"
                />
            </div>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-4 min-[900px]:grid-cols-5 lg:grid-cols-7 gap-x-4 gap-y-8 min-[900px]:gap-x-8 min-[900px]:gap-y-12 max-w-6xl px-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
            {filteredApps.map((app, index) => (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                onClick={() => {
                    launchApp(app, { forceNew: true });
                    toggleLauncher();
                }}
                className="flex flex-col items-center gap-3 group focus:outline-none"
              >
                <div className="w-16 h-16 min-[900px]:w-24 min-[900px]:h-24 rounded-[22px] bg-white/10 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-active:scale-95 border border-white/10 backdrop-blur-md">
                   <app.icon className="w-1/2 h-1/2 text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>
                <span className="text-white font-medium text-sm drop-shadow-md tracking-wide group-hover:text-white/90">
                    {app.title}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Empty State */}
          {filteredApps.length === 0 && (
              <div className="text-white/50 font-medium text-lg">No apps found</div>
          )}
          
          {/* Close hint/button for mobile/accessibility */}
           <button 
            onClick={toggleLauncher}
            className="absolute top-8 left-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors md:hidden"
          >
            <X size={24} />
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
