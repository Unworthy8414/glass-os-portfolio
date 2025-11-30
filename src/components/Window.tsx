import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useOSStore } from '../store/useOSStore';
import type { WindowState, BaseAppProps } from '../types';
import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import { detectSnapZone, getSnapTarget, getSnapPreview } from '../utils/snapPositions';
import 'react-resizable/css/styles.css';

interface WindowProps {
  window: WindowState;
  component: React.ComponentType<BaseAppProps>;
}

export const Window: React.FC<WindowProps> = ({ window: win, component: App }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, snapWindow, restoreWindow, updateWindowPosition, updateWindowSize, dockItems, setSnapPreview } = useOSStore();
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const lastZoneRef = useRef<string | null>(null);

  const x = useMotionValue(win.position.x);
  const y = useMotionValue(win.position.y);

  useEffect(() => {
    if (!isDragging) {
      x.set(win.position.x);
      y.set(win.position.y);
    }
  }, [win.position.x, win.position.y, x, y, isDragging]);

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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      lastZoneRef.current = null;
      setSnapPreview(null);

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const { x: currentX, y: currentY } = info.point;

      updateWindowPosition(win.id, { x: x.get(), y: y.get() });

      const zone = detectSnapZone(currentX, currentY, screenW, screenH);

      if (zone === 'top') {
          maximizeWindow(win.id);
          return;
      }

      const target = getSnapTarget(zone, screenW, screenH);
      if (target) {
          snapWindow(win.id, target);
      }
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const { x: posX, y: posY } = info.point;

      const zone = detectSnapZone(posX, posY, screenW, screenH);

      if (zone !== lastZoneRef.current) {
          lastZoneRef.current = zone;
          const preview = getSnapPreview(zone, screenW, screenH);
          setSnapPreview(preview);
      }
  };

  const handleResize = (_: React.SyntheticEvent, data: ResizeCallbackData) => {
      updateWindowSize(win.id, { width: data.size.width, height: data.size.height });
  };

  return (
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
        transition={isDragging ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
        layout={false}
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
            onResize={handleResize}
            draggableOpts={{ enableUserSelectHack: false }}
            minConstraints={[350, 250]}
            maxConstraints={[3000, 2000]}
            handle={
                !win.isMaximized ? (
                    <span className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center group">
                        <div className="w-2 h-2 border-r-2 border-b-2 border-white/30 group-hover:border-white/80 transition-colors" />
                    </span>
                ) : <span />
            }
            className="relative w-full h-full flex flex-col rounded-xl overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 bg-[#1e1e1e]/80 backdrop-blur-2xl transition-colors duration-300 pointer-events-auto"
        >
            <div
                onPointerDown={(e) => {
                    if (win.isMaximized && win.prevSize) {
                        e.preventDefault();
                        const clientX = e.clientX;
                        const relativeX = (clientX - win.position.x) / win.size.width;
                        const newOffset = relativeX * win.prevSize.width;
                        const newX = clientX - newOffset;

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

            <div className="flex-1 overflow-hidden relative bg-transparent cursor-auto" onPointerDown={(e) => e.stopPropagation()}>
                <App windowId={win.id} size={win.size} {...win.props} />
            </div>
        </ResizableBox>
        </motion.div>
  );
};
