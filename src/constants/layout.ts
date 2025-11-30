// ============================================
// Layout Constants
// ============================================

export const LAYOUT = {
  GAP: 8,
  TOP_BAR_HEIGHT: 32,
  DOCK_SPACE: 96,
  SNAP_CORNER_SIZE: 50,
  SNAP_EDGE_THRESHOLD: 20,
} as const;

// ============================================
// System Folder IDs
// ============================================

export const SYSTEM_FOLDERS = {
  TRASH: 'trash',
  DESKTOP: 'desktop',
  DOCUMENTS: 'documents',
  DOWNLOADS: 'downloads',
  PICTURES: 'pictures',
} as const;

// ============================================
// Wallpaper Configuration
// ============================================

export const WALLPAPERS = {
  breathing: 'bg-breathing',
  aurora: 'bg-aurora',
  midnight: 'bg-midnight',
  sunset: 'bg-sunset',
} as const;

export type WallpaperKey = keyof typeof WALLPAPERS;

// ============================================
// Helper Functions
// ============================================

export function getAvailableHeight(screenHeight: number): number {
  return screenHeight - LAYOUT.TOP_BAR_HEIGHT - LAYOUT.DOCK_SPACE;
}

export function getHalfWidth(screenWidth: number): number {
  return (screenWidth / 2) - (1.5 * LAYOUT.GAP);
}

export function getHalfHeight(availableHeight: number): number {
  return (availableHeight / 2) - (1.5 * LAYOUT.GAP);
}

export function getFullHeight(availableHeight: number): number {
  return availableHeight - (2 * LAYOUT.GAP);
}

export function getWallpaperClass(wallpaper: string): string {
  return WALLPAPERS[wallpaper as WallpaperKey] || WALLPAPERS.breathing;
}
