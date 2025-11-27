import React, { useState, useEffect } from 'react';
import { Folder, FileText, Image as ImageIcon, HardDrive, Clock, Cloud, Download, Monitor, Trash2 } from 'lucide-react';
import { useFileSystem } from '../store/useFileSystem';
import { useOSStore } from '../store/useOSStore';
import { apps } from '../utils/apps';
import { PythonIcon } from '../components/icons/PythonIcon';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`flex items-center space-x-2 px-2 py-1 rounded ${active ? 'bg-white/10' : 'hover:bg-white/5'} cursor-pointer text-sm transition-colors`}
    >
        <Icon size={16} className={active ? 'text-blue-400' : 'text-gray-400'} />
        <span className={active ? 'text-white' : 'text-gray-300'}>{label}</span>
    </div>
);

export const Finder: React.FC<{ path?: string }> = ({ path }) => {
    const [currentPath, setCurrentPath] = useState<string>('desktop');

    useEffect(() => {
        if (path) setCurrentPath(path);
    }, [path]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { getItemsInFolder, deleteItem, moveItem } = useFileSystem();
    const { launchApp, openContextMenu, closeContextMenu } = useOSStore();
    
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

        if (itemId && itemId !== target) { // Prevent dropping on itself if logic allows
             moveItem(itemId, target);
        }
    };

    // Clear selection/context menu on click outside
    useEffect(() => {
        const handleClick = () => {
            closeContextMenu();
            setSelectedId(null);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [closeContextMenu]);
    
    // Delete Key Handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                if (currentPath === 'trash') {
                   // Maybe permanent delete? Or just ignore for now unless we add that.
                   // For now, let's allow restore via key? No, standard is delete key doesn't restore.
                } else {
                    deleteItem(selectedId);
                }
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteItem, currentPath]);

    const handleDoubleClick = (item: any) => {
        if (item.type === 'folder') {
            setCurrentPath(item.id);
            return;
        }
        
        let appId = 'editor';
        if (item.kind === 'pdf') appId = 'pdf';
        else if (item.kind === 'image') appId = 'photos';
        else if (item.kind === 'app') appId = item.content;
        
        const appConfig = apps.find(a => a.id === appId);
        if (appConfig) {
            launchApp(appConfig, { fileId: item.id, title: item.name });
        }
    };

    return (
        <div className="w-full h-full flex bg-[#1e1e1e]/90 text-white font-sans backdrop-blur-sm">
            {/* Sidebar */}
            <div className="w-48 bg-black/20 border-r border-white/10 flex flex-col p-2 space-y-4 pt-4 select-none">
                <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-500 px-2 mb-1">Favorites</div>
                    <SidebarItem icon={Clock} label="Recents" />
                    <SidebarItem 
                        icon={Monitor} 
                        label="Desktop" 
                        active={currentPath === 'desktop'} 
                        onClick={() => setCurrentPath('desktop')}
                    />
                    <SidebarItem 
                        icon={FileText} 
                        label="Documents" 
                        active={currentPath === 'documents'}
                        onClick={() => setCurrentPath('documents')}
                    />
                    <SidebarItem 
                        icon={Download} 
                        label="Downloads" 
                        active={currentPath === 'downloads'}
                        onClick={() => setCurrentPath('downloads')}
                    />
                    <SidebarItem 
                        icon={ImageIcon} 
                        label="Pictures" 
                        active={currentPath === 'pictures'}
                        onClick={() => setCurrentPath('pictures')}
                    />
                    <SidebarItem 
                        icon={Trash2} 
                        label="Trash" 
                        active={currentPath === 'trash'}
                        onClick={() => setCurrentPath('trash')}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]/50">
                {/* Toolbar */}
                <div className="h-12 border-b border-white/10 flex items-center px-4 space-x-4 bg-[#2d2d2d]/50 shrink-0">
                    <div className="flex space-x-2">
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer">&lt;</div>
                        <div className="text-gray-400 hover:bg-white/10 px-2 py-1 rounded cursor-pointer">&gt;</div>
                    </div>
                    <div className="text-sm font-medium flex-1 text-center capitalize text-white/90">{currentPath}</div>
                    <div className="w-10"></div>
                </div>
                
                {/* Grid */}
                <div 
                    className="flex-1 p-4 grid grid-cols-4 gap-4 content-start overflow-auto" 
                    onClick={() => setSelectedId(null)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e)} // Drop onto background = move to current path
                >
                    {items.length === 0 && (
                        <div className="col-span-4 text-center text-gray-500 mt-10 text-sm">Folder is empty</div>
                    )}
                    {items.map((item) => {
                        let AppIcon = null;
                        if (item.kind === 'app') {
                            const app = apps.find(a => a.id === item.content);
                            if (app) AppIcon = app.icon;
                        }
                        return (
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
                                    e.stopPropagation(); // Prioritize folder drop over background
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
                            {item.kind === 'pdf' ? <FileText size={48} strokeWidth={1} className="text-red-400 drop-shadow-lg" /> :
                             item.kind === 'image' ? <ImageIcon size={48} strokeWidth={1} className="text-purple-400 drop-shadow-lg" /> :
                             item.kind === 'python' ? <PythonIcon size={48} className="drop-shadow-lg" /> :
                             item.kind === 'app' && AppIcon ? <AppIcon size={48} strokeWidth={1} className="text-blue-500 drop-shadow-lg" /> :
                             item.kind === 'text' ? <FileText size={48} strokeWidth={1} className="text-gray-400 drop-shadow-lg" /> :
                             <Folder size={48} strokeWidth={1} className="text-blue-400 fill-blue-400/20 drop-shadow-lg" />}
                            <span className="text-xs text-center group-hover:text-white text-gray-300 break-all line-clamp-2 w-full select-none">
                                {item.name}
                            </span>
                        </div>
                    );})}
                </div>
            </div>
        </div>
    );
};
