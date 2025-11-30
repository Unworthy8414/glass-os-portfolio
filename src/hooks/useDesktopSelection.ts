import { useState, useRef, useCallback } from 'react';

interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useDesktopSelection() {
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const isDraggingSelection = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).classList.contains('desktop-bg')) return;
    isDraggingSelection.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setSelectionBox({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    setSelectedItems([]);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingSelection.current || !dragStart.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const startX = dragStart.current.x;
    const startY = dragStart.current.y;

    setSelectionBox({
      x: Math.min(startX, currentX),
      y: Math.min(startY, currentY),
      width: Math.abs(currentX - startX),
      height: Math.abs(currentY - startY)
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDraggingSelection.current && selectionBox) {
      const selectedIds: string[] = [];
      const icons = document.querySelectorAll('.desktop-icon');

      const selLeft = selectionBox.x;
      const selRight = selectionBox.x + selectionBox.width;
      const selTop = selectionBox.y;
      const selBottom = selectionBox.y + selectionBox.height;

      icons.forEach((icon) => {
        const rect = icon.getBoundingClientRect();

        const isIntersecting = !(
          rect.right < selLeft ||
          rect.left > selRight ||
          rect.bottom < selTop ||
          rect.top > selBottom
        );

        if (isIntersecting) {
          const id = icon.getAttribute('data-id');
          if (id) selectedIds.push(id);
        }
      });

      if (selectionBox.width > 5 || selectionBox.height > 5) {
        setSelectedItems(selectedIds);
      }
    }
    isDraggingSelection.current = false;
    setSelectionBox(null);
    dragStart.current = null;
  }, [selectionBox]);

  const selectItem = useCallback((id: string) => {
    setSelectedItems([id]);
  }, []);

  const addToSelection = useCallback((id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    selectionBox,
    selectedItems,
    setSelectedItems,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectItem,
    addToSelection,
    clearSelection
  };
}
