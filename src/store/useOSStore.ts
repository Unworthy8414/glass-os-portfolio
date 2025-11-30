import { create } from 'zustand';
import type { WindowState, Size, Position, AppConfig, ContextMenuType, ContextMenuState, WindowProps, SnapPreview } from '../types';
import { LAYOUT } from '../constants/layout';

interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  wallpaper: string;

  dockItems: Record<string, DOMRect>;
  globalContextMenu: ContextMenuState | null;
  focusModeActive: boolean;
  isLauncherOpen: boolean;
  snapPreview: SnapPreview | null;

  launchApp: (appConfig: AppConfig, props?: WindowProps) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  snapWindow: (id: string, target: { position: Position, size: Size }) => void;
  restoreWindow: (id: string, newPosition?: Position) => void;
  updateWindowPosition: (id: string, pos: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  updateWindowProps: (id: string, props: Partial<WindowProps>) => void;
  toggleWindow: (id: string) => void;
  showAppWindows: (appId: string) => void;
  hideAppWindows: (appId: string) => void;
  quitApp: (appId: string) => void;
  registerDockItem: (appId: string, rect: DOMRect) => void;
  setWallpaper: (wallpaper: string) => void;
  setFocusModeActive: (active: boolean) => void;
  setIsLauncherOpen: (isOpen: boolean) => void;
  toggleLauncher: () => void;
  openContextMenu: (type: ContextMenuType, x: number, y: number, targetId?: string) => void;
  closeContextMenu: () => void;
  setSnapPreview: (preview: SnapPreview | null) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  maxZIndex: 100,
  wallpaper: 'breathing',
  dockItems: {},
  globalContextMenu: null,
  focusModeActive: false,
  isLauncherOpen: false,
  snapPreview: null,

  launchApp: (appConfig, props) => {
    const { windows, maxZIndex, focusWindow } = get();

    if (!props?.forceNew) {
        let existingWindow: WindowState | undefined;
        if (props?.fileId) {
             existingWindow = windows.find(w => w.appId === appConfig.id && w.props?.fileId === props.fileId);
        } else {
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

          let currentMaxZ = maxZ;
          const newWindows = state.windows.map(w => {
              if (w.appId === appId) {
                  currentMaxZ++;
                  return { ...w, isMinimized: false, zIndex: currentMaxZ };
              }
              return w;
          });

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
          return {
            ...w,
            isMaximized: false,
            position: w.prevPosition || w.position,
            size: w.prevSize || w.size,
            prevPosition: undefined,
            prevSize: undefined
          };
        } else {
          return {
            ...w,
            isMaximized: true,
            prevPosition: w.position,
            prevSize: w.size,
            position: { x: 0, y: LAYOUT.TOP_BAR_HEIGHT },
            size: { width: window.innerWidth, height: window.innerHeight - LAYOUT.TOP_BAR_HEIGHT - LAYOUT.DOCK_SPACE },
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

  openContextMenu: (type, x, y, targetId) => set({ globalContextMenu: { type, x, y, targetId } }),
  closeContextMenu: () => set({ globalContextMenu: null }),
  setSnapPreview: (preview) => set({ snapPreview: preview })
}));
