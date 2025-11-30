import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FileSystemItem } from '../types';
import { SYSTEM_FOLDERS } from '../constants/layout';

interface FileSystemState {
  items: FileSystemItem[];

  createItem: (item: Omit<FileSystemItem, 'dateModified'>) => void;
  updateFileContent: (id: string, content: string) => void;
  moveItem: (itemId: string, targetFolderId: string) => void;
  deleteItem: (id: string) => void;
  restoreItem: (id: string) => void;
  emptyTrash: () => void;
  resetFileSystem: () => void;
  getItemsInFolder: (folderId: string | null, showHidden?: boolean) => FileSystemItem[];
  getItem: (id: string) => FileSystemItem | undefined;
  resolvePath: (path: string) => FileSystemItem | undefined;
}

const initialItems: FileSystemItem[] = [
  { id: SYSTEM_FOLDERS.TRASH, parentId: null, name: 'Trash', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: SYSTEM_FOLDERS.DESKTOP, parentId: null, name: 'Desktop', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: SYSTEM_FOLDERS.DOCUMENTS, parentId: null, name: 'Documents', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: SYSTEM_FOLDERS.DOWNLOADS, parentId: null, name: 'Downloads', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: SYSTEM_FOLDERS.PICTURES, parentId: null, name: 'Pictures', type: 'folder', dateModified: new Date(), isSystem: true },

  { id: 'case-studies-app', parentId: SYSTEM_FOLDERS.DESKTOP, name: 'Case Studies', type: 'file', kind: 'app', dateModified: new Date(), content: 'case-studies', isSystem: false },
  { id: 'resume', parentId: SYSTEM_FOLDERS.DESKTOP, name: 'Resume 2025.pdf', type: 'file', kind: 'pdf', dateModified: new Date(), content: '/Resume (2025).pdf', isSystem: false },
  { id: 'project-alpha', parentId: SYSTEM_FOLDERS.DESKTOP, name: 'Time Management App - UX Research Case Study.pdf', type: 'file', kind: 'pdf', dateModified: new Date(), content: '/Time Management App - UX Research Case Study.pdf', isSystem: false },
  { id: 'notes', parentId: SYSTEM_FOLDERS.DESKTOP, name: 'Instructions.txt', type: 'file', kind: 'text', dateModified: new Date(), content: 'Welcome to Glass OS!\n\n- Double-click icons to open applications.\n- Drag windows to move them around the desktop.\n- Use the dock at the bottom to switch between apps.\n- Click the "Finder" icon to browse your files.', isSystem: false },
  { id: 'design-sys', parentId: SYSTEM_FOLDERS.DOCUMENTS, name: 'Design System.txt', type: 'file', kind: 'text', dateModified: new Date(), content: '// Typography\nPrimary: Inter\nSecondary: Merriweather\n\n// Colors\nPrimary: #3B82F6\nSecondary: #10B981', isSystem: false },
  { id: 'env-trap', parentId: SYSTEM_FOLDERS.DESKTOP, name: '.env', type: 'file', kind: 'text', dateModified: new Date(), content: 'RICK_ROLL=true', isSystem: false },
  { id: 'mockup1', parentId: SYSTEM_FOLDERS.PICTURES, name: 'Dashboard_Mockup.png', type: 'file', kind: 'image', dateModified: new Date(), content: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', isSystem: false }
];

export const useFileSystem = create<FileSystemState>()(
  persist(
    (set, get) => ({
      items: initialItems,

      createItem: (item) => set((state) => ({
        items: [...state.items, { ...item, dateModified: new Date(), isSystem: false }]
      })),

      updateFileContent: (id, content) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, content, dateModified: new Date() } : i)
      })),

      moveItem: (itemId, targetFolderId) => set((state) => {
        const item = state.items.find(i => i.id === itemId);
        if (!item || item.isSystem) return state;
        return {
            items: state.items.map(i => i.id === itemId ? { ...i, parentId: targetFolderId } : i)
        };
      }),

      deleteItem: (id) => set((state) => {
          const item = state.items.find(i => i.id === id);
          if (!item || item.isSystem) return state;
          return {
              items: state.items.map(i => i.id === id ? { ...i, parentId: SYSTEM_FOLDERS.TRASH, originalParentId: i.parentId } : i)
          };
      }),

      restoreItem: (id) => set((state) => {
        const item = state.items.find(i => i.id === id);
        if (!item) return state;
        const targetParent = item.originalParentId || SYSTEM_FOLDERS.DESKTOP;
        return {
            items: state.items.map(i => i.id === id ? { ...i, parentId: targetParent, originalParentId: undefined } : i)
        };
      }),

      emptyTrash: () => set((state) => ({
          items: state.items.filter(i => i.parentId !== SYSTEM_FOLDERS.TRASH)
      })),

      resetFileSystem: () => set({ items: initialItems }),

      getItemsInFolder: (folderId, showHidden = false) => {
        return get().items.filter(i => {
            if (i.parentId !== folderId) return false;
            if (!showHidden && i.name.startsWith('.')) return false;
            return true;
        });
      },

      getItem: (id) => get().items.find(i => i.id === id),

      resolvePath: (path) => {
          const state = get();
          const lower = path.toLowerCase();
          return state.items.find(i => i.name.toLowerCase() === lower || i.id === lower);
      }
    }),
    {
      name: 'glass-os-filesystem',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { items?: FileSystemItem[] };
        if (version < 2) {
          const items = state.items?.map((item) => {
            if (item.content === 'process') {
              return { ...item, content: 'case-studies', name: 'Case Studies' };
            }
            return item;
          }) || initialItems;
          return { ...state, items };
        }
        return persistedState;
      }
    }
  )
);
