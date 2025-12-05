import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'os' | 'standard';

interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  switchToOS: () => void;
  switchToStandard: () => void;
}

export const useViewMode = create<ViewModeState>()(
  persist(
    (set) => ({
      viewMode: 'os',
      setViewMode: (mode) => set({ viewMode: mode }),
      switchToOS: () => {
        set({ viewMode: 'os' });
        setTimeout(() => window.location.reload(), 50);
      },
      switchToStandard: () => {
        set({ viewMode: 'standard' });
        setTimeout(() => window.location.reload(), 50);
      },
    }),
    {
      name: 'glass-os-view-mode',
    }
  )
);
