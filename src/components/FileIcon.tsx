import React from 'react';
import { Folder, FileText, Image as ImageIcon } from 'lucide-react';
import { PythonIcon } from './icons/PythonIcon';
import { apps } from '../utils/apps';
import type { FileSystemItem } from '../types';

// GlassOS color palette
const colors = {
  verdigris: '#2a9d8f',   // teal/green - folders, apps
  sandy: '#f4a261',       // orange - PDFs
  burnt: '#e76f51',       // red/coral - alerts
  jasmine: '#e9c46a',     // yellow - images/text files
};

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
      return <AppIcon size={size} strokeWidth={1} className={`${baseClass} text-[#2a9d8f]`} />;
    }
  }

  switch (item.kind) {
    case 'pdf':
      return <FileText size={size} strokeWidth={1} className={baseClass} style={{ color: colors.sandy }} />;
    case 'image':
      return <ImageIcon size={size} strokeWidth={1} className={baseClass} style={{ color: colors.jasmine }} />;
    case 'python':
      return <PythonIcon size={size} className={baseClass} />;
    case 'text':
      return <FileText size={size} strokeWidth={1} className={baseClass} style={{ color: '#ffffff' }} />;
    default:
      if (item.type === 'folder') {
        return <Folder size={size} strokeWidth={1} className={baseClass} style={{ color: colors.verdigris, fill: `${colors.verdigris}33` }} />;
      }
      return <FileText size={size} strokeWidth={1} className={baseClass} style={{ color: '#ffffff', opacity: 0.7 }} />;
  }
};
