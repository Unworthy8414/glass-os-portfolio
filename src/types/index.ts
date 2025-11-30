import type { ComponentType } from 'react';
import type { PanInfo } from 'framer-motion';

// ============================================
// Core Layout & Position Types
// ============================================

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface SnapTarget {
  position: Position;
  size: Size;
}

export interface SnapPreview {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================
// App Configuration Types
// ============================================

export interface BaseAppProps {
  windowId: string;
  size?: Size;
  [key: string]: unknown;
}

export interface FileAppProps extends BaseAppProps {
  fileId?: string;
  title?: string;
}

export interface AppConfig {
  id: string;
  title: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  component: ComponentType<BaseAppProps>;
  defaultSize: Size;
  defaultPosition?: Position;
  isResizable?: boolean;
  minWidth?: number;
  minHeight?: number;
  dockHidden?: boolean;
}

// ============================================
// Window State Types
// ============================================

export interface WindowProps {
  fileId?: string;
  title?: string;
  forceNew?: boolean;
  initialPosition?: Position;
  initialSize?: Size;
  targetWindowId?: string;
  path?: string;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: Position;
  size: Size;
  zIndex: number;
  prevPosition?: Position;
  prevSize?: Size;
  props?: WindowProps;
}

// ============================================
// Context Menu Types
// ============================================

export type ContextMenuType = 'desktop-bg' | 'desktop-item' | 'dock-item' | 'finder-item';

export interface ContextMenuState {
  type: ContextMenuType;
  x: number;
  y: number;
  targetId?: string;
}

// ============================================
// File System Types
// ============================================

export type FileKind = 'text' | 'image' | 'pdf' | 'python' | 'app';

export interface FileSystemItem {
  id: string;
  parentId: string | null;
  originalParentId?: string | null;
  name: string;
  type: 'folder' | 'file';
  kind?: FileKind;
  content?: string;
  dateModified: Date;
  isSystem?: boolean;
}

// ============================================
// Framer Motion Event Types
// ============================================

export type DragEvent = MouseEvent | TouchEvent | PointerEvent;
export type DragInfo = PanInfo;

// ============================================
// Sidebar Item Types (shared component)
// ============================================

export interface SidebarItemProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
