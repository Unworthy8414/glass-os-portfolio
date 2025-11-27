import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';
import { apps } from '../utils/apps';

interface MenuBarProps {
    appTitle: string;
}

export const Menubar: React.FC<MenuBarProps> = ({ appTitle }) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { activeWindowId, windows, closeWindow, minimizeWindow, maximizeWindow, launchApp } = useOSStore();

    const menus = {
        File: ['New Window', 'Open...', 'Close Window'],
        Edit: ['Copy', 'Paste'],
        View: ['Toggle Full Screen', 'Zoom In', 'Zoom Out'],
        Window: ['Minimize', 'Zoom'],
        Help: [`${appTitle} Help`]
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = async (action: string) => {
        setActiveMenu(null);
        
        if (action === `${appTitle} Help`) {
            alert(`Help for ${appTitle}:\n\nDouble-click items to open.\nDrag windows to snap.\nRight-click for options.`);
            return;
        }

        if (action === 'New Window') {
             // Always launch a fresh instance logic
             // Store's launchApp usually focuses existing if same ID, BUT we can bypass if we make ID unique or props unique
             // Actually, my previous store logic forces focus if appId matches.
             // I need to fix Store to allow multiple instances if requested.
             // For now, I will pass a random prop "instance" to force uniqueness if I update store logic, 
             // or I can rely on the fact that standard apps might just need focusing. 
             // User requested "create new windows for all apps even if theyre already open".
             
             if (activeWindowId) {
                 const activeApp = windows.find(w => w.id === activeWindowId);
                 if (activeApp) {
                     const appConfig = apps.find(a => a.id === activeApp.appId);
                     if (appConfig) launchApp(appConfig, { forceNew: true });
                 }
             } else {
                 launchApp(apps.find(a => a.id === 'finder')!, { forceNew: true });
             }
             return;
        }

        if (action === 'Open...') {
            const picker = apps.find(a => a.id === 'file-picker');
            if (picker) launchApp(picker, { forceNew: true });
            return;
        }
        
        if (!activeWindowId) return;

        switch (action) {
            case 'Close Window':
                closeWindow(activeWindowId);
                break;
            case 'Minimize':
                minimizeWindow(activeWindowId);
                break;
            case 'Toggle Full Screen':
            case 'Zoom':
                maximizeWindow(activeWindowId);
                break;
            case 'Zoom In':
                window.dispatchEvent(new CustomEvent('app-zoom', { detail: { action: 'zoom-in', windowId: activeWindowId } }));
                break;
            case 'Zoom Out':
                window.dispatchEvent(new CustomEvent('app-zoom', { detail: { action: 'zoom-out', windowId: activeWindowId } }));
                break;
            case 'Copy':
                try {
                    const selection = window.getSelection()?.toString();
                    if (selection) await navigator.clipboard.writeText(selection);
                } catch (e) { console.error(e); }
                break;
            case 'Paste':
                try {
                    const text = await navigator.clipboard.readText();
                    if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
                        const start = document.activeElement.selectionStart || 0;
                        const end = document.activeElement.selectionEnd || 0;
                        const val = document.activeElement.value;
                        document.activeElement.value = val.slice(0, start) + text + val.slice(end);
                        document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                } catch (e) { console.error(e); }
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center space-x-1" ref={menuRef}>
            {Object.entries(menus).map(([label, items]) => (
                <div key={label} className="relative group">
                    <button 
                        className={`px-3 py-1 rounded hover:bg-white/10 transition-colors cursor-default ${activeMenu === label ? 'bg-white/10' : ''}`}
                        onClick={() => setActiveMenu(activeMenu === label ? null : label)}
                        onMouseEnter={() => activeMenu && setActiveMenu(label)}
                    >
                        {label}
                    </button>
                    
                    {activeMenu === label && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl py-1 z-[6000] animate-in fade-in zoom-in-95 duration-75 ring-1 ring-black/20">
                            {items.map((item) => (
                                <div 
                                    key={item} 
                                    onClick={() => handleAction(item)}
                                    className="px-4 py-1.5 hover:bg-blue-600 hover:text-white text-white/90 cursor-default text-xs transition-colors"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};