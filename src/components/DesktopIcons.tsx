import React from 'react';
import { FileIcon } from './FileIcon';
import type { FileSystemItem } from '../types';

interface DesktopIconsProps {
  items: FileSystemItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  onLaunch: (item: FileSystemItem) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  items,
  selectedItems,
  onSelect,
  onLaunch,
  onDragStart,
}) => {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          data-id={item.id}
          draggable={!item.isSystem}
          onDragStart={(e) => onDragStart(e, item.id)}
          onDoubleClick={() => onLaunch(item)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          className={`
            desktop-icon w-24 flex flex-col items-center group cursor-pointer p-2 rounded transition-all pointer-events-auto
            ${selectedItems.includes(item.id) ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'}
          `}
        >
          <FileIcon item={item} size={48} className="mb-1" />
          <span className={`
            text-xs text-center text-white drop-shadow-md break-words w-full line-clamp-2 font-medium px-1 rounded-md
            ${selectedItems.includes(item.id) ? 'bg-blue-600' : 'bg-black/20 group-hover:bg-transparent'}
          `}>
            {item.name}
          </span>
        </div>
      ))}
    </>
  );
};
