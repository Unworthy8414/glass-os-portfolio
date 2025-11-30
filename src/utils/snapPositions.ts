import type { SnapTarget, SnapPreview } from '../types';
import { LAYOUT, getAvailableHeight, getHalfWidth, getHalfHeight, getFullHeight } from '../constants/layout';

type SnapZone = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | null;

export function detectSnapZone(x: number, y: number, screenW: number, screenH: number): SnapZone {
  const { SNAP_CORNER_SIZE, SNAP_EDGE_THRESHOLD } = LAYOUT;

  if (x < SNAP_CORNER_SIZE && y < SNAP_CORNER_SIZE) return 'top-left';
  if (x > screenW - SNAP_CORNER_SIZE && y < SNAP_CORNER_SIZE) return 'top-right';
  if (x < SNAP_CORNER_SIZE && y > screenH - SNAP_CORNER_SIZE) return 'bottom-left';
  if (x > screenW - SNAP_CORNER_SIZE && y > screenH - SNAP_CORNER_SIZE) return 'bottom-right';

  if (x < SNAP_EDGE_THRESHOLD) return 'left';
  if (x > screenW - SNAP_EDGE_THRESHOLD) return 'right';
  if (y < SNAP_EDGE_THRESHOLD) return 'top';

  return null;
}

export function getSnapTarget(zone: SnapZone, screenW: number, screenH: number): SnapTarget | null {
  if (!zone) return null;

  const { GAP, TOP_BAR_HEIGHT } = LAYOUT;
  const availableH = getAvailableHeight(screenH);
  const halfW = getHalfWidth(screenW);
  const halfH = getHalfHeight(availableH);
  const fullH = getFullHeight(availableH);

  const leftX = GAP;
  const rightX = (screenW / 2) + (0.5 * GAP);
  const topY = TOP_BAR_HEIGHT + GAP;
  const bottomY = TOP_BAR_HEIGHT + GAP + (availableH / 2) + (0.5 * GAP);

  switch (zone) {
    case 'top-left':
      return { position: { x: leftX, y: topY }, size: { width: halfW, height: halfH } };
    case 'top-right':
      return { position: { x: rightX, y: topY }, size: { width: halfW, height: halfH } };
    case 'bottom-left':
      return { position: { x: leftX, y: bottomY }, size: { width: halfW, height: halfH } };
    case 'bottom-right':
      return { position: { x: rightX, y: bottomY }, size: { width: halfW, height: halfH } };
    case 'left':
      return { position: { x: leftX, y: topY }, size: { width: halfW, height: fullH } };
    case 'right':
      return { position: { x: rightX, y: topY }, size: { width: halfW, height: fullH } };
    case 'top':
      return { position: { x: leftX, y: topY }, size: { width: screenW - (2 * GAP), height: fullH } };
    default:
      return null;
  }
}

export function getSnapPreview(zone: SnapZone, screenW: number, screenH: number): SnapPreview | null {
  const target = getSnapTarget(zone, screenW, screenH);
  if (!target) return null;

  return {
    x: target.position.x,
    y: target.position.y,
    width: target.size.width,
    height: target.size.height
  };
}
