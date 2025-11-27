import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apps } from '../utils/apps';
import { useOSStore } from '../store/useOSStore';
import LiquidGlass from 'liquid-glass-react';
import { Trash2 } from 'lucide-react';
import { useFileSystem } from '../store/useFileSystem';

export const Dock = () => {
  const [hoveredApp, setHoveredApp] = useState<{ id: string; title: string; rect: DOMRect } | null>(null);
  const { launchApp, openContextMenu, closeContextMenu, globalContextMenu } = useOSStore();
  const { deleteItem } = useFileSystem();

  // Close context menu on click outside
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

  return (
    <>
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[5000] pb-2 pointer-events-auto w-auto max-w-[95vw]">
            <div className="relative h-20 px-4 flex items-center gap-4 rounded-[24px] overflow-x-auto overflow-y-visible shadow-2xl ring-1 ring-white/20 scrollbar-hide">
                <div className="absolute inset-0 -z-10 rounded-[24px] overflow-hidden pointer-events-none fixed top-0 left-0 right-0 bottom-0">
                    {/* @ts-ignore */}
                    <LiquidGlass className="w-full h-full" blurAmount={15} />
                    <div className="absolute inset-0 bg-white/10 backdrop-saturate-150" />
                </div>

                {apps.filter(app => !app.dockHidden).map((app) => (
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

function DockItem({ app, onHover, onLeave, onContextMenu }: { 
    app: any, 
    onHover: (rect: DOMRect) => void, 
    onLeave: () => void,
    onContextMenu: (e: React.MouseEvent, rect: DOMRect) => void
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
          // Update rect on hover just in case
          registerDockItem(app.id, ref.current.getBoundingClientRect());
      }
  };

  const handleClick = () => {
      if (isOpen) {
          // Bring all to front instead of toggle
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
                    // Update rect before opening context menu
                    const rect = ref.current.getBoundingClientRect();
                    registerDockItem(app.id, rect);
                    onContextMenu(e, rect);
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onLeave}
            className="w-12 h-12 rounded-[14px] flex items-center justify-center relative focus:outline-none cursor-pointer active:scale-95 active:brightness-90"
        >
             <div className="w-full h-full rounded-[14px] bg-white/5 border border-white/10 shadow-sm flex items-center justify-center overflow-hidden backdrop-blur-[4px] group-hover:bg-white/10 transition-colors pointer-events-none relative">
                <app.icon className="w-3/5 h-3/5 text-white drop-shadow-lg" strokeWidth={1.5} />
             </div>
        </motion.button>
        
        {isOpen && (
            <div className="absolute bottom-1 w-1 h-1 bg-white/60 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
        )}
    </div>
  );
}