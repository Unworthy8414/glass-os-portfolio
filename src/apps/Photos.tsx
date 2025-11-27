import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { useFileSystem } from '../store/useFileSystem';
import { FolderOpen } from 'lucide-react';
import { apps } from '../utils/apps';

export const Photos: React.FC<{ windowId: string }> = ({ windowId }) => {
    const { windows, launchApp } = useOSStore();
    const { getItem } = useFileSystem();
    
    const win = windows.find(w => w.id === windowId);
    const fileId = win?.props?.fileId;
    const file = getItem(fileId);

    const handleOpenFile = () => {
        const picker = apps.find(a => a.id === 'file-picker');
        if (picker) launchApp(picker, { forceNew: true, targetWindowId: windowId });
    };

    if (!file || !file.content) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-black text-white/50 space-y-4">
                <p>No photo selected</p>
                <button 
                    onClick={handleOpenFile}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors shadow-md text-sm"
                >
                    <FolderOpen size={16} className="mr-2" />
                    Open Photo...
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative group">
            <img src={file.content} alt={file.name} className="max-w-full max-h-full object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-2 text-center text-xs translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {file.name}
            </div>
        </div>
    );
};
