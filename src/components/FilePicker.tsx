import React, { useState } from 'react';
import { HardDrive, Clock, Cloud, Download, Monitor, FileText, Image as ImageIcon } from 'lucide-react';
import { useFileSystem } from '../store/useFileSystem';
import { useOSStore } from '../store/useOSStore';
import { useAppLauncher } from '../hooks/useAppLauncher';
import { SidebarItem } from './SidebarItem';
import { FileIcon } from './FileIcon';
import { SYSTEM_FOLDERS } from '../constants/layout';
import { apps } from '../utils/apps';
import type { FileSystemItem } from '../types';

export const FilePicker: React.FC<{ windowId: string }> = ({ windowId }) => {
    const { getItemsInFolder } = useFileSystem();
    const { closeWindow, windows, updateWindowProps, launchApp } = useOSStore();
    const { getAppIdForFile } = useAppLauncher();
    const [currentPath, setCurrentPath] = useState<string>(SYSTEM_FOLDERS.DESKTOP);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const thisWindow = windows.find(w => w.id === windowId);
    const targetWindowId = thisWindow?.props?.targetWindowId;

    const items = getItemsInFolder(currentPath);

    const handleSelect = (file: FileSystemItem) => {
        const appId = getAppIdForFile(file);

        if (targetWindowId) {
            const targetWindow = windows.find(w => w.id === targetWindowId);
            if (targetWindow && targetWindow.appId === appId) {
                updateWindowProps(targetWindowId, { fileId: file.id, title: file.name });
                closeWindow(windowId);
                return;
            }
        }

        const appConfig = apps.find(a => a.id === appId);
        if (appConfig) {
            launchApp(appConfig, { fileId: file.id, title: file.name });
        }
        closeWindow(windowId);
    };

    return (
        <div className="w-full h-full flex bg-[#1e1e1e]/90 text-white font-sans backdrop-blur-sm">
            <div className="w-40 bg-black/20 border-r border-white/10 flex flex-col p-2 space-y-4 pt-4 select-none shrink-0">
                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-500 px-2 mb-1">Favorites</div>
                    <SidebarItem icon={Clock} label="Recents" />
                    <SidebarItem
                        icon={Monitor}
                        label="Desktop"
                        active={currentPath === SYSTEM_FOLDERS.DESKTOP}
                        onClick={() => setCurrentPath(SYSTEM_FOLDERS.DESKTOP)}
                    />
                    <SidebarItem
                        icon={FileText}
                        label="Documents"
                        active={currentPath === SYSTEM_FOLDERS.DOCUMENTS}
                        onClick={() => setCurrentPath(SYSTEM_FOLDERS.DOCUMENTS)}
                    />
                    <SidebarItem
                        icon={Download}
                        label="Downloads"
                        active={currentPath === SYSTEM_FOLDERS.DOWNLOADS}
                        onClick={() => setCurrentPath(SYSTEM_FOLDERS.DOWNLOADS)}
                    />
                    <SidebarItem
                        icon={ImageIcon}
                        label="Pictures"
                        active={currentPath === SYSTEM_FOLDERS.PICTURES}
                        onClick={() => setCurrentPath(SYSTEM_FOLDERS.PICTURES)}
                    />
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-500 px-2 mb-1">iCloud</div>
                    <SidebarItem icon={Cloud} label="iCloud Drive" />
                </div>
                <div className="space-y-1">
                     <div className="text-[10px] font-bold text-gray-500 px-2 mb-1">Locations</div>
                    <SidebarItem icon={HardDrive} label="Macintosh HD" />
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#1e1e1e]/50 overflow-hidden">
                <div className="h-10 border-b border-white/10 flex items-center px-4 space-x-4 bg-[#2d2d2d]/50 shrink-0">
                    <div className="flex space-x-2">
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer text-xs">&lt;</div>
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer text-xs">&gt;</div>
                    </div>
                    <div className="text-xs font-medium flex-1 text-center capitalize text-white/90">{currentPath}</div>
                    <div className="w-10"></div>
                </div>

                <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-auto">
                    {items.length === 0 && (
                        <div className="col-span-4 text-center text-gray-500 mt-10 text-sm">Folder is empty</div>
                    )}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.type !== 'folder') setSelectedFileId(item.id);
                            }}
                            onDoubleClick={() => {
                                if (item.type === 'folder') setCurrentPath(item.id);
                                else handleSelect(item);
                            }}
                            className={`flex flex-col items-center space-y-2 group cursor-pointer p-2 rounded transition-colors border border-transparent ${
                                selectedFileId === item.id ? 'bg-blue-500/20 border-blue-500/40' : 'hover:bg-blue-500/10 hover:border-blue-500/20'
                            }`}
                        >
                            <FileIcon item={item} size={32} />
                            <span className="text-xs text-center group-hover:text-white text-gray-300 break-all line-clamp-2 w-full leading-tight">{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="h-12 border-t border-white/10 flex items-center justify-end px-4 space-x-2 bg-[#2d2d2d]/80 shrink-0">
                    <button onClick={() => closeWindow(windowId)} className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs transition-colors">Cancel</button>
                    <button
                        disabled={!selectedFileId}
                        onClick={() => {
                            const file = items.find(i => i.id === selectedFileId);
                            if (file) handleSelect(file);
                        }}
                        className="px-4 py-1.5 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
                    >
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
};
