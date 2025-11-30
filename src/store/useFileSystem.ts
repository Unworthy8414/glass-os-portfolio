import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileSystemItem {
  id: string;
  parentId: string | null;
  originalParentId?: string | null; // For restoration
  name: string;
  type: 'folder' | 'file';
  kind?: 'text' | 'image' | 'pdf' | 'python' | 'app'; 
  content?: string; 
  dateModified: Date;
  isSystem?: boolean;
}

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
  resolvePath: (path: string) => FileSystemItem | undefined; // Helper for Terminal
}

const initialItems: FileSystemItem[] = [
  { id: 'trash', parentId: null, name: 'Trash', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: 'desktop', parentId: null, name: 'Desktop', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: 'documents', parentId: null, name: 'Documents', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: 'downloads', parentId: null, name: 'Downloads', type: 'folder', dateModified: new Date(), isSystem: true },
  { id: 'pictures', parentId: null, name: 'Pictures', type: 'folder', dateModified: new Date(), isSystem: true },
  
  { id: 'case-studies-app', parentId: 'desktop', name: 'Case Studies', type: 'file', kind: 'app', dateModified: new Date(), content: 'case-studies', isSystem: false },
  { id: 'resume', parentId: 'desktop', name: 'Resume 2025.pdf', type: 'file', kind: 'pdf', dateModified: new Date(), content: 'resume-data', isSystem: false },
  { id: 'project-alpha', parentId: 'desktop', name: 'Time Management App - UX Research Case Study.pdf', type: 'file', kind: 'pdf', dateModified: new Date(), content: '/Time Management App - UX Research Case Study.pdf', isSystem: false },
  { id: 'notes', parentId: 'desktop', name: 'Instructions.txt', type: 'file', kind: 'text', dateModified: new Date(), content: 'Welcome to Glass OS!\n\n- Double-click icons to open applications.\n- Drag windows to move them around the desktop.\n- Use the dock at the bottom to switch between apps.\n- Click the "Finder" icon to browse your files.', isSystem: false },
  { id: 'design-sys', parentId: 'documents', name: 'Design System.txt', type: 'file', kind: 'text', dateModified: new Date(), content: '// Typography\nPrimary: Inter\nSecondary: Merriweather\n\n// Colors\nPrimary: #3B82F6\nSecondary: #10B981', isSystem: false },
  { id: 'env-trap', parentId: 'desktop', name: '.env', type: 'file', kind: 'text', dateModified: new Date(), content: 'RICK_ROLL=true', isSystem: false },
  { id: 'mockup1', parentId: 'pictures', name: 'Dashboard_Mockup.png', type: 'file', kind: 'image', dateModified: new Date(), content: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', isSystem: false }
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
          if (!item || item.isSystem) return state; // Cannot delete system files
          return {
              items: state.items.map(i => i.id === id ? { ...i, parentId: 'trash', originalParentId: i.parentId } : i)
          };
      }),

      restoreItem: (id) => set((state) => {
        const item = state.items.find(i => i.id === id);
        if (!item) return state;
        // Restore to original parent or desktop if original is missing/invalid
        const targetParent = item.originalParentId || 'desktop';
        return {
            items: state.items.map(i => i.id === id ? { ...i, parentId: targetParent, originalParentId: undefined } : i)
        };
      }),
      
      emptyTrash: () => set((state) => ({
          items: state.items.filter(i => i.parentId !== 'trash')
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
          // Simple resolver: strictly checks if name exists in current structure or by ID
          // Real path resolution is complex, for this simplified OS we assume flat searching or specific folder lookups
          // If path is "Desktop", return desktop folder. 
          const lower = path.toLowerCase();
          return state.items.find(i => i.name.toLowerCase() === lower || i.id === lower);
      }
    }),
    {
      name: 'glass-os-filesystem',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          const items = persistedState.items?.map((item: any) => {
            if (item.content === 'process') {
              return { ...item, content: 'case-studies', name: 'Case Studies' };
            }
            return item;
          }) || initialItems;
          return { ...persistedState, items };
        }
        return persistedState;
      }
    }
  )
);