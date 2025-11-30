import React from 'react';
import type { SidebarItemProps } from '../types';

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-2 px-2 py-1 rounded ${active ? 'bg-white/10' : 'hover:bg-white/5'} cursor-pointer text-sm transition-colors`}
  >
    <Icon size={16} className={active ? 'text-blue-400' : 'text-gray-400'} />
    <span className={active ? 'text-white' : 'text-gray-300'}>{label}</span>
  </div>
);
