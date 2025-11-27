import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { useFileSystem } from '../store/useFileSystem';
import { ZoomIn, ZoomOut, FolderOpen } from 'lucide-react';
import { apps } from '../utils/apps';

export const PDFViewer: React.FC<{ windowId: string }> = ({ windowId }) => {
    const { windows, launchApp } = useOSStore();
    const { getItem } = useFileSystem();
    const [scale, setScale] = useState(1);
    
    const win = windows.find(w => w.id === windowId);
    const fileId = win?.props?.fileId;
    const file = getItem(fileId);

    useEffect(() => {
        const handleZoom = (e: CustomEvent) => {
            if (e.detail.windowId === windowId) {
                if (e.detail.action === 'zoom-in') setScale(s => Math.min(s + 0.1, 3));
                if (e.detail.action === 'zoom-out') setScale(s => Math.max(s - 0.1, 0.5));
            }
        };

        window.addEventListener('app-zoom', handleZoom as EventListener);
        return () => window.removeEventListener('app-zoom', handleZoom as EventListener);
    }, [windowId]);

    const handleOpenFile = () => {
        const picker = apps.find(a => a.id === 'file-picker');
        if (picker) launchApp(picker, { forceNew: true, targetWindowId: windowId });
    };

    if (!file) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-white/50 space-y-4">
                <p>No document loaded</p>
                <button 
                    onClick={handleOpenFile}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors shadow-md text-sm"
                >
                    <FolderOpen size={16} className="mr-2" />
                    Open Document...
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-white font-sans overflow-hidden">
            {/* Toolbar */}
            <div className="h-10 bg-[#2d2d2d] flex items-center px-4 justify-between shrink-0 shadow-md z-10 border-b border-black/20">
                <div className="text-xs text-gray-400 font-medium">{file.name}</div>
                <div className="flex space-x-2 items-center">
                    <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-1 hover:bg-white/10 rounded">
                        <ZoomOut size={14} className="text-gray-400" />
                    </button>
                    <span className="text-[10px] text-gray-500 w-8 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-1 hover:bg-white/10 rounded">
                        <ZoomIn size={14} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {file.content?.startsWith('/') ? (
                <div className="flex-1 bg-[#525659] overflow-hidden flex flex-col">
                    <iframe src={file.content} className="w-full h-full border-none" title={file.name} />
                </div>
            ) : (
                <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#1e1e1e]">
                    <div 
                        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                        className="w-[800px] min-h-[1000px] bg-white text-black shadow-2xl mb-8 p-12 flex flex-col space-y-6 transition-transform duration-200 origin-top"
                    >
                        {/* Mock Content - Case Study Layout */}
                        <div className="border-b pb-6 border-gray-200">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{file.name.replace('.pdf', '')}</h1>
                            <p className="text-gray-500 text-lg">A comprehensive UX Case Study</p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 py-4">
                            <div className="col-span-1">
                                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider mb-2">Role</h3>
                                <p className="text-sm text-gray-600">Lead Product Designer</p>
                            </div>
                            <div className="col-span-1">
                                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider mb-2">Duration</h3>
                                <p className="text-sm text-gray-600">3 Months (Q1 2024)</p>
                            </div>
                            <div className="col-span-1">
                                <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider mb-2">Tools</h3>
                                <p className="text-sm text-gray-600">Figma, React, Tailwind</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">The Problem</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Users were struggling to navigate the complex hierarchy of the previous dashboard. 
                                Analytics showed a drop-off rate of 45% on the main navigation page. 
                                Our goal was to simplify the information architecture without sacrificing functionality.
                            </p>
                        </div>

                        <div className="py-6">
                            <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 flex-col">
                                <span className="font-medium">Interactive Prototype Preview</span>
                                <span className="text-xs mt-2">Figure 1.1: Initial Wireframes</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">The Solution</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We introduced a "Glass" aesthetic to create depth and context. 
                                By using translucency, users can maintain context of their background tasks while focusing on the active window.
                                Usability testing confirmed a 30% increase in task completion speed.
                            </p>
                        </div>
                        
                        <div className="flex-1" />
                        <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-8">
                            Page 1 of 1 • Generated by GlassOS PDF Engine
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
