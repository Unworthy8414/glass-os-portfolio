import { create } from 'zustand';
import type { WindowState, Size, Position, AppConfig } from '../types';

interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  wallpaper: string; // Add wallpaper state
  
  dockItems: Record<string, DOMRect>;
  globalContextMenu: { type: 'desktop-bg' | 'desktop-item' | 'dock-item' | 'finder-item', targetId?: string, x: number, y: number, data?: any } | null;
  focusModeActive: boolean;
  isLauncherOpen: boolean;

  launchApp: (appConfig: AppConfig, props?: any) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  snapWindow: (id: string, target: { position: Position, size: Size }) => void;
  restoreWindow: (id: string, newPosition?: Position) => void;
  updateWindowPosition: (id: string, pos: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  updateWindowProps: (id: string, props: any) => void;
  toggleWindow: (id: string) => void;
  showAppWindows: (appId: string) => void;
  hideAppWindows: (appId: string) => void;
  quitApp: (appId: string) => void;
  registerDockItem: (appId: string, rect: DOMRect) => void;
  setWallpaper: (wallpaper: string) => void;
  setFocusModeActive: (active: boolean) => void;
  setIsLauncherOpen: (isOpen: boolean) => void;
  toggleLauncher: () => void;
  openContextMenu: (type: 'desktop-bg' | 'desktop-item' | 'dock-item' | 'finder-item', x: number, y: number, targetId?: string, data?: any) => void;
  closeContextMenu: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: 100,
  wallpaper: 'breathing', // Default
  dockItems: {},
  globalContextMenu: null,
  focusModeActive: false,
  isLauncherOpen: false,
  launchApp: (appConfig, props) => {
    const { windows, maxZIndex, focusWindow } = get();
    
    if (!props?.forceNew) {
        let existingWindow: WindowState | undefined;
        if (props?.fileId) {
             existingWindow = windows.find(w => w.appId === appConfig.id && w.props?.fileId === props.fileId);
        } else {
             // If checking for existing window, prefer one that is not minimized if possible, or just the last one
             existingWindow = windows.filter(w => w.appId === appConfig.id).pop();
        }

        if (existingWindow) {
          set(state => ({
               windows: state.windows.map(w => w.id === existingWindow!.id ? { 
                   ...w, 
                   isMinimized: false,
                   title: props?.title || w.title,
                   props: { ...w.props, ...props }
               } : w)
          }));
          focusWindow(existingWindow.id);
          return;
        }
    }
    
    const id = `${appConfig.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // Add random offset to cascade windows so they don't stack perfectly
    const offset = windows.length * 20; 
    const basePos = appConfig.defaultPosition || { x: 100, y: 50 };
    
    const newWindow: WindowState = {
      id,
      appId: appConfig.id,
      title: props?.title || appConfig.title,
      isMinimized: false,
      isMaximized: false,
      position: props?.initialPosition || { x: basePos.x + offset, y: basePos.y + offset },
      size: props?.initialSize || appConfig.defaultSize,
      zIndex: maxZIndex + 1,
      props
    };

    set({ 
      windows: [...windows, newWindow], 
      activeWindowId: id, 
      maxZIndex: maxZIndex + 1 
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  quitApp: (appId) => {
      set((state) => ({
          windows: state.windows.filter((w) => w.appId !== appId),
          activeWindowId: state.activeWindowId && state.windows.find(w => w.id === state.activeWindowId)?.appId === appId ? null : state.activeWindowId
      }));
  },

  focusWindow: (id) => {
    set((state) => {
      if (state.activeWindowId === id) return state;
      const maxZ = state.maxZIndex + 1;
      return {
        activeWindowId: id,
        maxZIndex: maxZ,
        windows: state.windows.map((w) => w.id === id ? { ...w, zIndex: maxZ } : w),
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w),
      activeWindowId: null, 
    }));
  },
  
  registerDockItem: (appId, rect) => {
      set((state) => ({
          dockItems: { ...state.dockItems, [appId]: rect }
      }));
  },
  
  toggleWindow: (id) => {
     const state = get();
     const win = state.windows.find(w => w.id === id);
     if (!win) return;
     
     if (win.isMinimized) {
         state.focusWindow(id);
         set(s => ({ windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: false } : w) }));
     } else if (state.activeWindowId === id) {
         state.minimizeWindow(id);
     } else {
         state.focusWindow(id);
     }
  },

  showAppWindows: (appId) => {
      set((state) => {
          const maxZ = state.maxZIndex + 1;
          const appWindows = state.windows.filter(w => w.appId === appId);
          if (appWindows.length === 0) return state;

          // Sort windows by their current z-index to maintain relative order when bringing to front
          // or just bring them all to front. 
          // Simple approach: bring them all to front, maintaining internal order is harder but let's just increment zIndex for each.
          
          let currentMaxZ = maxZ;
          const newWindows = state.windows.map(w => {
              if (w.appId === appId) {
                  currentMaxZ++;
                  return { ...w, isMinimized: false, zIndex: currentMaxZ };
              }
              return w;
          });
          
          // Set the last one as active
          const lastAppWindow = appWindows[appWindows.length - 1];
          
          return {
              windows: newWindows,
              maxZIndex: currentMaxZ,
              activeWindowId: lastAppWindow ? lastAppWindow.id : state.activeWindowId
          };
      });
  },

  hideAppWindows: (appId) => {
      set((state) => ({
          windows: state.windows.map(w => w.appId === appId ? { ...w, isMinimized: true } : w),
          activeWindowId: state.activeWindowId && state.windows.find(w => w.id === state.activeWindowId)?.appId === appId ? null : state.activeWindowId
      }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            position: w.prevPosition || w.position,
            size: w.prevSize || w.size,
            prevPosition: undefined,
            prevSize: undefined
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevPosition: w.position,
            prevSize: w.size,
            position: { x: 0, y: 32 }, // Account for Top Bar
            size: { width: window.innerWidth, height: window.innerHeight - 32 - 96 }, // Minus dock height + margins
          };
        }
      }),
      activeWindowId: id,
      maxZIndex: state.maxZIndex + 1
    }));
  },

  snapWindow: (id, target) => {
      set((state) => ({
          windows: state.windows.map((w) => {
              if (w.id !== id) return w;
              // Save state only if not already snapped/maximized
              const isAlreadySnapped = w.isMaximized || !!w.prevSize;
              return {
                  ...w,
                  isMaximized: true, 
                  prevPosition: isAlreadySnapped ? w.prevPosition : w.position,
                  prevSize: isAlreadySnapped ? w.prevSize : w.size,
                  position: target.position,
                  size: target.size
              };
          })
      }));
  },

  restoreWindow: (id, newPosition) => {
      set((state) => ({
          windows: state.windows.map((w) => {
              if (w.id !== id) return w;
              if (!w.prevPosition || !w.prevSize) return w;
              return {
                  ...w,
                  isMaximized: false,
                  position: newPosition || w.prevPosition,
                  size: w.prevSize,
                  prevPosition: undefined,
                  prevSize: undefined
              };
          })
      }));
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === id ? { ...w, position } : w)
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => w.id === id ? { ...w, size } : w)
    }));
  },

  updateWindowProps: (id, props) => {
    set((state) => ({
        windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            return {
                ...w,
                title: props.title || w.title,
                props: { ...w.props, ...props }
            };
        })
    }));
  },

  setWallpaper: (wallpaper) => set({ wallpaper }),
  setFocusModeActive: (active) => set({ focusModeActive: active }),
  setIsLauncherOpen: (isOpen) => set({ isLauncherOpen: isOpen }),
  toggleLauncher: () => set((state) => ({ isLauncherOpen: !state.isLauncherOpen })),

  openContextMenu: (type, x, y, targetId, data) => set({ globalContextMenu: { type, x, y, targetId, data } }),
  closeContextMenu: () => set({ globalContextMenu: null })
}));