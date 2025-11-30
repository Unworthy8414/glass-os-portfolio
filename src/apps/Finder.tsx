import React, { useState, useEffect } from 'react';
import { HardDrive, Clock, Cloud, Download, Monitor, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { useFileSystem } from '../store/useFileSystem';
import { useOSStore } from '../store/useOSStore';
import { useAppLauncher } from '../hooks/useAppLauncher';
import { SidebarItem } from '../components/SidebarItem';
import { FileIcon } from '../components/FileIcon';
import { SYSTEM_FOLDERS } from '../constants/layout';
import type { FileSystemItem } from '../types';

export const Finder: React.FC<{ windowId?: string; path?: string }> = ({ path }) => {
    const [currentPath, setCurrentPath] = useState<string>(SYSTEM_FOLDERS.DESKTOP);

    useEffect(() => {
        if (path) setCurrentPath(path);
    }, [path]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { getItemsInFolder, deleteItem, moveItem } = useFileSystem();
    const { openContextMenu, closeContextMenu } = useOSStore();
    const { launchFile } = useAppLauncher();

    const items = getItemsInFolder(currentPath);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId?: string) => {
        e.preventDefault();
        e.stopPropagation();
        const itemId = e.dataTransfer.getData('text/plain');
        const target = targetId || currentPath;

        if (itemId && itemId !== target) {
             moveItem(itemId, target);
        }
    };

    useEffect(() => {
        const handleClick = () => {
            closeContextMenu();
            setSelectedId(null);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [closeContextMenu]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                if (currentPath !== SYSTEM_FOLDERS.TRASH) {
                    deleteItem(selectedId);
                }
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteItem, currentPath]);

    const handleDoubleClick = (item: FileSystemItem) => {
        if (item.type === 'folder') {
            setCurrentPath(item.id);
            return;
        }
        launchFile(item);
    };

    return (
        <div className="w-full h-full flex bg-[#1e1e1e]/90 text-white font-sans backdrop-blur-sm">
            <div className="w-48 bg-black/20 border-r border-white/10 flex flex-col p-2 space-y-4 pt-4 select-none">
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
                    <SidebarItem
                        icon={Trash2}
                        label="Trash"
                        active={currentPath === SYSTEM_FOLDERS.TRASH}
                        onClick={() => setCurrentPath(SYSTEM_FOLDERS.TRASH)}
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

            <div className="flex-1 flex flex-col bg-[#1e1e1e]/50">
                <div className="h-12 border-b border-white/10 flex items-center px-4 space-x-4 bg-[#2d2d2d]/50 shrink-0">
                    <div className="flex space-x-2">
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer">&lt;</div>
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer">&gt;</div>
                    </div>
                    <div className="text-sm font-medium flex-1 text-center capitalize text-white/90">{currentPath}</div>
                    <div className="w-10"></div>
                </div>

                <div
                    className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-auto"
                    onClick={() => setSelectedId(null)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e)}
                >
                    {items.length === 0 && (
                        <div className="col-span-4 text-center text-gray-500 mt-10 text-sm">Folder is empty</div>
                    )}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            draggable={!item.isSystem}
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', item.id);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                                if (item.type === 'folder') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }}
                            onDrop={(e) => {
                                if (item.type === 'folder') {
                                    handleDrop(e, item.id);
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(item.id);
                            }}
                            onDoubleClick={() => handleDoubleClick(item)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openContextMenu('finder-item', e.clientX, e.clientY, item.id);
                                setSelectedId(item.id);
                            }}
                            className={`flex flex-col items-center space-y-2 group cursor-pointer p-2 rounded border transition-colors ${
                                selectedId === item.id
                                    ? 'bg-blue-500/20 border-blue-500/50'
                                    : 'border-transparent hover:bg-blue-500/20 hover:border-blue-500/30'
                            } ${item.isSystem ? 'opacity-90' : ''}`}
                        >
                            <FileIcon item={item} size={48} />
                            <span className="text-xs text-center group-hover:text-white text-gray-300 break-all line-clamp-2 w-full select-none">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
