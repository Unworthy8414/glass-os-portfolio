import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apps } from '../utils/apps';
import { useOSStore } from '../store/useOSStore';
import LiquidGlass from 'liquid-glass-react';
import { Trash2, LayoutGrid, FileText, ScrollText, FolderOpen } from 'lucide-react';
import { useFileSystem } from '../store/useFileSystem';
import { useCaseStudiesOpened } from '../hooks/useLocalStorage';
import type { AppConfig } from '../types';

// Quicklaunch files configuration
const quickLaunchFiles = [
  { id: 'resume', fileId: 'resume', title: 'Resume', icon: ScrollText, color: '#30D158' },
  { id: 'time-mgmt-pdf', fileId: 'project-alpha', title: 'Time Management Case Study', icon: FileText, color: '#0A84FF' },
  { id: 'ago-pdf', fileId: 'ago-study', title: 'AGO Case Study', icon: FileText, color: '#FF375F' },
];

export { quickLaunchFiles };

export const Dock = () => {
  const [hoveredApp, setHoveredApp] = useState<{ id: string; title: string; rect: DOMRect } | null>(null);
  const [quickLaunchOpen, setQuickLaunchOpen] = useState(false);
  const { launchApp, openContextMenu, closeContextMenu, globalContextMenu, toggleLauncher, windows } = useOSStore();
  const { deleteItem } = useFileSystem();
  const [caseStudiesOpened, markCaseStudiesOpened] = useCaseStudiesOpened();

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [closeContextMenu]);

  const handleTrashDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const fileId = e.dataTransfer.getData('text/plain');
      if (fileId) {
          deleteItem(fileId);
      }
  };

  // Get permanent dock apps (not hidden)
  const permanentApps = apps.filter(app => !app.dockHidden);

  // Get running apps that aren't in permanent dock
  const runningAppIds = [...new Set(windows.map(w => w.appId))];
  const runningHiddenApps = apps.filter(app =>
    app.dockHidden &&
    runningAppIds.includes(app.id) &&
    app.id !== 'file-picker'
  );

  return (
    <>
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[5000] pb-2 pointer-events-auto w-auto max-w-[95vw]">
            <div className="relative h-20 px-4 flex items-center gap-4 rounded-[24px] overflow-x-auto overflow-y-visible shadow-2xl ring-1 ring-white/20 scrollbar-hide">
                <div className="absolute inset-0 -z-10 rounded-[24px] overflow-hidden pointer-events-none fixed top-0 left-0 right-0 bottom-0">
                    {/* @ts-ignore */}
                    <LiquidGlass className="w-full h-full" blurAmount={15} />
                    <div className="absolute inset-0 bg-white/10 backdrop-saturate-150" />
                </div>

                {/* Launcher */}
                <div className="relative flex flex-col items-center justify-center h-full dock-item pointer-events-auto">
                    <motion.button
                        onClick={toggleLauncher}
                        onMouseEnter={(e) => setHoveredApp({ id: 'launcher', title: 'Launchpad', rect: e.currentTarget.getBoundingClientRect() })}
                        onMouseLeave={() => setHoveredApp(null)}
                        className="w-12 h-12 rounded-[14px] flex items-center justify-center relative focus:outline-none cursor-pointer active:scale-95 active:brightness-90"
                    >
                        <div className="w-full h-full rounded-[14px] bg-white/5 border border-white/10 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] hover:bg-white/10 transition-colors pointer-events-none relative">
                            <LayoutGrid className="w-3/5 h-3/5 text-white/90 drop-shadow-lg" strokeWidth={1.5} />
                        </div>
                    </motion.button>
                </div>

                {/* Permanent Apps */}
                {permanentApps.map((app) => (
                    <DockItem
                        key={app.id}
                        app={app}
                        onHover={(rect) => setHoveredApp({ id: app.id, title: app.title, rect })}
                        onLeave={() => setHoveredApp(null)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openContextMenu('dock-item', e.clientX, e.clientY, app.id);
                        }}
                        shouldPulse={app.id === 'case-studies' && !caseStudiesOpened}
                        onPulseStop={app.id === 'case-studies' ? markCaseStudiesOpened : undefined}
                    />
                ))}

                {/* Running Apps (launched from Launchpad) */}
                {runningHiddenApps.map((app) => (
                    <DockItem
                        key={app.id}
                        app={app}
                        onHover={(rect) => setHoveredApp({ id: app.id, title: app.title, rect })}
                        onLeave={() => setHoveredApp(null)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openContextMenu('dock-item', e.clientX, e.clientY, app.id);
                        }}
                    />
                ))}

                {/* Quicklaunch Button */}
                <QuickLaunchButton
                    isOpen={quickLaunchOpen}
                    onToggle={() => setQuickLaunchOpen(!quickLaunchOpen)}
                    onClose={() => setQuickLaunchOpen(false)}
                    onHover={(rect) => setHoveredApp({ id: 'quicklaunch', title: 'Quick Access', rect })}
                    onLeave={() => setHoveredApp(null)}
                />

                {/* Separator */}
                <div className="w-px h-10 bg-white/20 mx-1" />

                {/* Trash Can */}
                 <div
                    className="relative flex flex-col items-center justify-center h-full dock-item pointer-events-auto"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleTrashDrop}
                >
                    <motion.button
                        onClick={() => launchApp(apps.find(a => a.id === 'finder')!, { path: 'trash', title: 'Trash' })}
                        onMouseEnter={(e) => setHoveredApp({ id: 'trash', title: 'Trash', rect: e.currentTarget.getBoundingClientRect() })}
                        onMouseLeave={() => setHoveredApp(null)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openContextMenu('dock-item', e.clientX, e.clientY, 'trash');
                        }}
                        className="w-12 h-12 rounded-[14px] flex items-center justify-center relative focus:outline-none cursor-pointer active:scale-95 active:brightness-90"
                    >
                        <div className="w-full h-full rounded-[14px] bg-white/5 border border-white/10 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] hover:bg-white/10 transition-colors pointer-events-none relative">
                            <Trash2 className="w-3/5 h-3/5 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>

        {/* Tooltip */}
        {createPortal(
            <AnimatePresence>
                {hoveredApp && !globalContextMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'fixed',
                            left: hoveredApp.rect.left + hoveredApp.rect.width / 2,
                            top: hoveredApp.rect.top - 10,
                            transform: 'translateX(-50%) translateY(-100%)',
                            zIndex: 9999,
                            pointerEvents: 'none'
                        }}
                    >
                        <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full">
                             <div className="bg-[#2d2d2d] text-white/95 font-medium text-[12px] px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap flex items-center justify-center">
                                {hoveredApp.title}
                             </div>
                             <div className="w-2.5 h-2.5 bg-[#2d2d2d] rotate-45 border-r border-b border-white/10 -mt-1.5 z-10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        )}

    </>
  );
};

function DockItem({ app, onHover, onLeave, onContextMenu, shouldPulse, onPulseStop }: {
    app: AppConfig,
    onHover: (rect: DOMRect) => void,
    onLeave: () => void,
    onContextMenu: (e: React.MouseEvent, rect: DOMRect) => void,
    shouldPulse?: boolean,
    onPulseStop?: () => void
}) {
  const { launchApp, windows, showAppWindows, registerDockItem } = useOSStore();
  const ref = useRef<HTMLButtonElement>(null);
  const isOpen = windows.some(w => w.appId === app.id);

  useEffect(() => {
      if (ref.current) {
          registerDockItem(app.id, ref.current.getBoundingClientRect());
      }
  }, [registerDockItem, app.id]);

  const handleMouseEnter = () => {
      if (ref.current) {
          onHover(ref.current.getBoundingClientRect());
          registerDockItem(app.id, ref.current.getBoundingClientRect());
      }
  };

  const handleClick = () => {
      // Stop pulsing when clicked
      if (shouldPulse && onPulseStop) {
          onPulseStop();
      }

      if (isOpen) {
          showAppWindows(app.id);
      } else {
          launchApp(app);
      }
  };

  return (
    <div
        className="relative flex flex-col items-center justify-center h-full dock-item pointer-events-auto"
        data-dock-app-id={app.id}
    >
        <motion.button
            ref={ref}
            onClick={handleClick}
            onContextMenu={(e) => {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    registerDockItem(app.id, rect);
                    onContextMenu(e, rect);
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onLeave}
            className="w-12 h-12 rounded-[14px] flex items-center justify-center relative focus:outline-none cursor-pointer active:scale-95 active:brightness-90"
        >
             {app.id === 'case-studies' ? (
                <div className={`w-full h-full rounded-[14px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/40 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] hover:brightness-110 transition-all pointer-events-none relative ${shouldPulse ? 'animate-pulse-glow' : ''}`}>
                    <app.icon className="w-3/5 h-3/5 text-blue-400 drop-shadow-lg" strokeWidth={1.5} />
                </div>
             ) : (
                <div className={`w-full h-full rounded-[14px] bg-white/5 border border-white/10 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] group-hover:bg-white/10 transition-colors pointer-events-none relative ${shouldPulse ? 'animate-pulse-glow' : ''}`}>
                    <app.icon className="w-3/5 h-3/5 text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>
             )}

             {/* Pulse ring effect */}
             {shouldPulse && (
                <div className="absolute inset-0 rounded-[14px] animate-ping-slow bg-blue-400/30 pointer-events-none" />
             )}
        </motion.button>

        {isOpen && (
            <div className="absolute bottom-1 w-1 h-1 bg-white/60 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
        )}
    </div>
  );
}

function QuickLaunchButton({ isOpen, onToggle, onClose, onHover, onLeave }: {
    isOpen: boolean,
    onToggle: () => void,
    onClose: () => void,
    onHover: (rect: DOMRect) => void,
    onLeave: () => void
}) {
    const { launchApp } = useOSStore();
    const { getItem } = useFileSystem();
    const ref = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node) &&
                ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleFileClick = (fileId: string) => {
        const fileItem = getItem(fileId);
        if (fileItem) {
            const pdfApp = apps.find(a => a.id === 'pdf');
            if (pdfApp) {
                launchApp(pdfApp, {
                    fileId: fileId,
                    title: fileItem.name,
                    forceNew: true
                });
            }
        }
        onClose();
    };

    const handleMouseEnter = () => {
        if (ref.current) {
            onHover(ref.current.getBoundingClientRect());
        }
    };

    const handleClick = () => {
        if (ref.current) {
            setButtonRect(ref.current.getBoundingClientRect());
        }
        onToggle();
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full dock-item pointer-events-auto">
            <motion.button
                ref={ref}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={onLeave}
                className="w-12 h-12 rounded-[14px] flex items-center justify-center relative focus:outline-none cursor-pointer active:scale-95 active:brightness-90"
            >
                <div className={`w-full h-full rounded-[14px] bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] hover:brightness-110 transition-all pointer-events-none relative ${isOpen ? 'ring-2 ring-amber-400/50' : ''}`}>
                    <FolderOpen
                        className="w-3/5 h-3/5 drop-shadow-lg text-amber-400"
                        strokeWidth={1.5}
                    />
                </div>
            </motion.button>

            {/* Popover Menu - rendered via portal */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && buttonRect && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'fixed',
                                left: buttonRect.left + buttonRect.width / 2,
                                top: buttonRect.top - 10,
                                transform: 'translateX(-50%) translateY(-100%)',
                                zIndex: 9998,
                            }}
                        >
                            <div className="relative flex flex-col items-center -translate-x-1/2 -translate-y-full">
                            <div className="bg-[#1e1e1e]/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden min-w-[240px]">
                                <div className="px-3 py-2 border-b border-white/10">
                                    <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Quick Access</span>
                                </div>
                                <div className="py-1">
                                    {quickLaunchFiles.map((file, index) => (
                                        <motion.button
                                            key={file.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleFileClick(file.fileId)}
                                            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left group"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${file.color}20` }}
                                            >
                                                <file.icon size={16} style={{ color: file.color }} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                                                {file.title}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            {/* Arrow */}
                            <div className="w-3 h-3 bg-[#1e1e1e]/95 rotate-45 border-r border-b border-white/20 -mt-1.5" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
