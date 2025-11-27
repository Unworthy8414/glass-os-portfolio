import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion, useDragControls, AnimatePresence, useMotionValue } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useOSStore } from '../store/useOSStore';
import type { WindowState } from '../types';
import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface WindowProps {
  window: WindowState;
  component: React.ComponentType<any>;
}

export const Window: React.FC<WindowProps> = ({ window: win, component: App }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, snapWindow, restoreWindow, updateWindowPosition, updateWindowSize, dockItems } = useOSStore();
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [snapPreview, setSnapPreview] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const x = useMotionValue(win.position.x);
  const y = useMotionValue(win.position.y);

  useEffect(() => {
    if (!isDragging) {
      x.set(win.position.x);
      y.set(win.position.y);
    }
  }, [win.position.x, win.position.y, x, y, isDragging]);

  // Calculate target position for minimize animation
  const dockRect = dockItems[win.appId];
  const scale = 0.1;
  const minimizeTarget = dockRect ? {
      x: dockRect.left + dockRect.width / 2 - (win.size.width * scale) / 2, 
      y: dockRect.top + dockRect.height / 2 - (win.size.height * scale) / 2,
      scale: scale,
      opacity: 0
  } : {
      x: win.position.x,
      y: window.innerHeight,
      scale: 0,
      opacity: 0
  };

  const handleDragStart = () => {
      setIsDragging(true);
  };
  
  const handleDragEnd = (_: any, info: any) => {
      setIsDragging(false);
      setSnapPreview(null);
      
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const { x: currentX, y: currentY } = info.point; 

      updateWindowPosition(win.id, { x: x.get(), y: y.get() });

      // Corner Snaps (Top Priority)
      const cornerSize = 50;
      const GAP = 8;
      const TOP_BAR = 32;
      const BOTTOM_SPACE = 96;
      const availableH = screenH - TOP_BAR - BOTTOM_SPACE;
      
      if (currentX < cornerSize && currentY < cornerSize) { // Top Left
          snapWindow(win.id, { 
              position: { x: GAP, y: TOP_BAR + GAP }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: (availableH / 2) - (1.5 * GAP) } 
          });
          return;
      }
      if (currentX > screenW - cornerSize && currentY < cornerSize) { // Top Right
          snapWindow(win.id, { 
              position: { x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: (availableH / 2) - (1.5 * GAP) } 
          });
          return;
      }
      if (currentX < cornerSize && currentY > screenH - cornerSize) { // Bottom Left
          snapWindow(win.id, { 
              position: { x: GAP, y: TOP_BAR + GAP + (availableH / 2) + (0.5 * GAP) }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: (availableH / 2) - (1.5 * GAP) } 
          });
          return;
      }
      if (currentX > screenW - cornerSize && currentY > screenH - cornerSize) { // Bottom Right
          snapWindow(win.id, { 
              position: { x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP + (availableH / 2) + (0.5 * GAP) }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: (availableH / 2) - (1.5 * GAP) } 
          });
          return;
      }

      // Edge Snaps
      if (currentX < 20) { // Left Half
          snapWindow(win.id, { 
              position: { x: GAP, y: TOP_BAR + GAP }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: availableH - (2 * GAP) } 
          });
          return;
      }
      if (currentX > screenW - 20) { // Right Half
          snapWindow(win.id, { 
              position: { x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP }, 
              size: { width: (screenW / 2) - (1.5 * GAP), height: availableH - (2 * GAP) } 
          });
          return;
      }
      if (currentY < 20) { 
          maximizeWindow(win.id);
          return;
      }
  };

  const handleDrag = (_: any, info: any) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const { x, y } = info.point;
      const cornerSize = 50;
      const GAP = 8;
      const TOP_BAR = 32;
      const BOTTOM_SPACE = 96;
      const availableH = screenH - TOP_BAR - BOTTOM_SPACE;
      const halfW = (screenW / 2) - (1.5 * GAP);
      const halfH = (availableH / 2) - (1.5 * GAP);
      const fullH = availableH - (2 * GAP);

      if (x < cornerSize && y < cornerSize) setSnapPreview({ 
          x: GAP, y: TOP_BAR + GAP, width: halfW, height: halfH 
      });
      else if (x > screenW - cornerSize && y < cornerSize) setSnapPreview({ 
          x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP, width: halfW, height: halfH 
      });
      else if (x < cornerSize && y > screenH - cornerSize) setSnapPreview({ 
          x: GAP, y: TOP_BAR + GAP + (availableH / 2) + (0.5 * GAP), width: halfW, height: halfH 
      });
      else if (x > screenW - cornerSize && y > screenH - cornerSize) setSnapPreview({ 
          x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP + (availableH / 2) + (0.5 * GAP), width: halfW, height: halfH 
      });
      else if (x < 20) setSnapPreview({ 
          x: GAP, y: TOP_BAR + GAP, width: halfW, height: fullH 
      });
      else if (x > screenW - 20) setSnapPreview({ 
          x: (screenW / 2) + (0.5 * GAP), y: TOP_BAR + GAP, width: halfW, height: fullH 
      });
      else if (y < 20) setSnapPreview({ 
          x: GAP, y: TOP_BAR + GAP, width: screenW - (2 * GAP), height: fullH 
      });
      else setSnapPreview(null);
  };

  return (
    <>
        <AnimatePresence>
            {isDragging && snapPreview && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed z-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pointer-events-none"
                    style={{
                        left: snapPreview.x,
                        top: snapPreview.y,
                        width: snapPreview.width,
                        height: snapPreview.height
                    }}
                />
            )}
        </AnimatePresence>

        <motion.div
        drag={true}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={
            win.isMinimized ? { 
                x: minimizeTarget.x,
                y: minimizeTarget.y,
                width: win.size.width,
                height: win.size.height,
                scale: minimizeTarget.scale, 
                opacity: minimizeTarget.opacity,
                pointerEvents: 'none' 
            } : {
                x: win.position.x,
                y: win.position.y,
                width: win.size.width,
                height: win.size.height,
                scale: 1, 
                opacity: 1,
                pointerEvents: 'auto' 
            }
        }
        transition={isDragging ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 300 }}
        style={{ 
            zIndex: win.zIndex,
            position: 'absolute',
            x,
            y,
            transformOrigin: 'top left'
        }}
        className="absolute flex flex-col pointer-events-auto"
        onMouseDown={() => focusWindow(win.id)}
        >
        <ResizableBox
            width={win.size.width}
            height={win.size.height}
            onResize={(_: any, data: ResizeCallbackData) => {
                updateWindowSize(win.id, { width: data.size.width, height: data.size.height });
            }}
            draggableOpts={{ enableUserSelectHack: false }}
            minConstraints={[350, 250]}
            maxConstraints={[3000, 2000]}
            handle={
                !win.isMaximized ? (
                    <span className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center group">
                        {/* Visible subtle handle */}
                        <div className="w-2 h-2 border-r-2 border-b-2 border-white/30 group-hover:border-white/80 transition-colors" />
                    </span>
                ) : <span />
            }
            className="relative w-full h-full flex flex-col rounded-xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 bg-[#1e1e1e]/80 backdrop-blur-2xl transition-colors duration-300 pointer-events-auto"
        >
            {/* Title Bar */}
            <div 
                onPointerDown={(e) => {
                    if (win.isMaximized && win.prevSize) {
                        e.preventDefault();
                        // Calculate
                        const clientX = e.clientX;
                        const relativeX = (clientX - win.position.x) / win.size.width;
                        const newOffset = relativeX * win.prevSize.width;
                        const newX = clientX - newOffset;

                        // Flush updates
                        flushSync(() => {
                             restoreWindow(win.id);
                             updateWindowPosition(win.id, { x: newX, y: win.position.y });
                        });
                    }
                    dragControls.start(e);
                }}
                onDoubleClick={() => maximizeWindow(win.id)}
                className="h-10 flex items-center px-4 justify-between shrink-0 select-none cursor-default border-b border-white/5 bg-white/5"
            >
                <div className="flex space-x-2 items-center group" onPointerDown={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => closeWindow(win.id)} 
                    className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 flex items-center justify-center shadow-inner border border-black/20"
                >
                    <X size={8} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />
                </button>
                <button 
                    onClick={() => minimizeWindow(win.id)} 
                    className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 flex items-center justify-center shadow-inner border border-black/20"
                >
                    <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />
                </button>
                <button 
                    onClick={() => maximizeWindow(win.id)} 
                    className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 flex items-center justify-center shadow-inner border border-black/20"
                >
                    <Maximize2 size={6} className="opacity-0 group-hover:opacity-100 text-black/50" strokeWidth={3} />
                </button>
                </div>
                
                <div className="text-sm font-medium text-white/70 drop-shadow-sm pointer-events-none absolute left-1/2 transform -translate-x-1/2">
                    {win.title}
                </div>
                
                <div className="w-10" />
            </div>

            {/* App Content */}
            <div className="flex-1 overflow-hidden relative bg-transparent cursor-auto" onPointerDown={(e) => e.stopPropagation()}>
                <App windowId={win.id} size={win.size} {...win.props} />
            </div>
        </ResizableBox>
        </motion.div>
    </>
  );
};
