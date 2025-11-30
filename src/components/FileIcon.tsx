import React from 'react';
import { Folder, FileText, Image as ImageIcon } from 'lucide-react';
import { PythonIcon } from './icons/PythonIcon';
import { apps } from '../utils/apps';
import type { FileSystemItem } from '../types';

interface FileIconProps {
  item: FileSystemItem;
  size?: number;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ item, size = 48, className = '' }) => {
  const baseClass = `drop-shadow-lg ${className}`;

  if (item.kind === 'app' && item.content) {
    const app = apps.find(a => a.id === item.content);
    if (app) {
      const AppIcon = app.icon;
      return <AppIcon size={size} strokeWidth={1} className={`text-blue-500 ${baseClass}`} />;
    }
  }

  switch (item.kind) {
    case 'pdf':
      return <FileText size={size} strokeWidth={1} className={`text-red-400 ${baseClass}`} />;
    case 'image':
      return <ImageIcon size={size} strokeWidth={1} className={`text-purple-400 ${baseClass}`} />;
    case 'python':
      return <PythonIcon size={size} className={baseClass} />;
    case 'text':
      return <FileText size={size} strokeWidth={1} className={`text-gray-400 ${baseClass}`} />;
    default:
      if (item.type === 'folder') {
        return <Folder size={size} strokeWidth={1} className={`text-blue-400 fill-blue-400/20 ${baseClass}`} />;
      }
      return <FileText size={size} strokeWidth={1} className={`text-gray-300 ${baseClass}`} />;
  }
};
