import type { ComponentType } from 'react';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface AppConfig {
  id: string;
  title: string;
  icon: ComponentType<any>;
  component: ComponentType<any>;
  defaultSize: Size;
  defaultPosition?: Position;
  isResizable?: boolean;
  minWidth?: number;
  minHeight?: number;
  dockHidden?: boolean;
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
  props?: any; // Extra data passed to the app (e.g., fileId)
}