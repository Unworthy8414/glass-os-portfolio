import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Plus, X, Globe, ShieldAlert, Search } from 'lucide-react';

interface Tab {
    id: string;
    url: string;
    title: string;
    history: string[];
    historyIndex: number;
}

export const Browser: React.FC = () => {
    const defaultUrl = 'https://www.wikipedia.org';
    
    const [tabs, setTabs] = useState<Tab[]>([
        { id: '1', url: defaultUrl, title: 'Wikipedia', history: [defaultUrl], historyIndex: 0 }
    ]);
    const [activeTabId, setActiveTabId] = useState('1');
    const [inputValue, setInputValue] = useState('wikipedia.org');
    const [loading, setLoading] = useState(false);

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    const updateTab = (id: string, updates: Partial<Tab>) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const addTab = () => {
        const newId = Date.now().toString();
        setTabs([...tabs, { id: newId, url: defaultUrl, title: 'New Tab', history: [defaultUrl], historyIndex: 0 }]);
        setActiveTabId(newId);
        setInputValue('wikipedia.org');
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (tabs.length === 1) return;
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id) setActiveTabId(newTabs[newTabs.length - 1].id);
    };

    const handleNavigate = (input: string) => {
        setLoading(true);
        let url = input.trim();
        let title = 'Loading...';

        if (!url.includes('.') || url.includes(' ')) {
            url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(url)}`;
            title = `Search: ${input}`;
        } else {
            if (!url.startsWith('http')) url = 'https://' + url;
            title = url.replace('https://', '').split('/')[0];
        }

        setInputValue(url.replace('https://', '').replace('http://', ''));

        const newHistory = [...activeTab.history.slice(0, activeTab.historyIndex + 1), url];
        updateTab(activeTabId, { 
            url, 
            history: newHistory, 
            historyIndex: newHistory.length - 1,
            title
        });

        setTimeout(() => setLoading(false), 800);
    };

    const goBack = () => {
        if (activeTab.historyIndex > 0) {
            const newIndex = activeTab.historyIndex - 1;
            const url = activeTab.history[newIndex];
            updateTab(activeTabId, { url, historyIndex: newIndex });
            setInputValue(url.replace('https://', '').replace('http://', ''));
        }
    };

    const goForward = () => {
        if (activeTab.historyIndex < activeTab.history.length - 1) {
            const newIndex = activeTab.historyIndex + 1;
            const url = activeTab.history[newIndex];
            updateTab(activeTabId, { url, historyIndex: newIndex });
            setInputValue(url.replace('https://', '').replace('http://', ''));
        }
    };

    const isBlocked = (url: string) => {
        return url.includes('google.com') || 
               url.includes('youtube.com') || 
               url.includes('facebook.com') || 
               url.includes('twitter.com') ||
               url.includes('x.com') ||
               url.includes('linkedin.com');
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#2d2d2d] text-white overflow-hidden font-sans">
            {/* Tab Bar - Dark */}
            <div className="h-9 flex items-end px-2 space-x-1 pt-1 bg-[#1e1e1e] border-b border-black/20">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => { setActiveTabId(tab.id); setInputValue(tab.url.replace('https://', '')); }}
                        className={`w-40 h-full rounded-t-md flex items-center px-2 space-x-2 relative group cursor-pointer transition-colors border-t border-l border-r border-transparent select-none
                            ${activeTabId === tab.id ? 'bg-[#2d2d2d] border-white/5 shadow-sm z-10' : 'bg-[#252525] hover:bg-[#2a2a2a] opacity-80'}`}
                    >
                        <Globe size={12} className="text-blue-400 shrink-0" />
                        <span className="text-[11px] text-gray-300 truncate flex-1 font-medium">{tab.title}</span>
                        <div onClick={(e) => closeTab(e, tab.id)} className="p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X size={10} className="text-gray-400" />
                        </div>
                    </div>
                ))}
                <div onClick={addTab} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer text-gray-400 ml-1">
                    <Plus size={14} />
                </div>
            </div>

            {/* Address Bar - Dark */}
            <div className="h-11 bg-[#2d2d2d] flex items-center px-3 space-x-3 shadow-sm z-10 border-b border-black/20">
                <div className="flex space-x-2">
                    <ArrowLeft 
                        size={16} 
                        className={`${activeTab.historyIndex > 0 ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600'} rounded cursor-pointer transition-colors p-1 box-content`} 
                        onClick={goBack}
                    />
                    <ArrowRight 
                        size={16} 
                        className={`${activeTab.historyIndex < activeTab.history.length - 1 ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600'} rounded cursor-pointer transition-colors p-1 box-content`} 
                        onClick={goForward}
                    />
                </div>
                <RotateCw size={14} className={`text-gray-400 hover:bg-white/10 rounded cursor-pointer p-1 box-content ${loading ? 'animate-spin' : ''}`} onClick={() => handleNavigate(activeTab.url)} />
                
                <div className="flex-1 bg-[#1a1a1a] rounded-md px-2 h-7 flex items-center text-sm text-gray-300 group focus-within:bg-black/40 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all border border-white/5 shadow-inner">
                     {activeTab.url.includes('search') ? <Search size={12} className="mr-2 text-gray-500" /> : <Lock size={10} className="mr-2 text-gray-500" />}
                     <input 
                        className="flex-1 outline-none text-[11px] bg-transparent text-gray-300 placeholder-gray-600" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputValue)}
                        placeholder="Search Wikipedia or enter URL"
                     />
                </div>
            </div>

            {/* Web Content */}
            <div className="flex-1 relative bg-white">
                {isBlocked(activeTab.url) ? (
                     <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-[#1e1e1e] p-10 text-center select-text">
                        <ShieldAlert size={48} className="text-gray-500 mb-4" />
                        <h2 className="text-lg font-medium text-gray-300">Content Security Policy</h2>
                        <p className="max-w-md mt-2 text-sm">
                            The website <b>{activeTab.url}</b> does not permit embedding.
                        </p>
                     </div>
                ) : (
                    <iframe 
                        key={activeTab.id} 
                        src={activeTab.url}
                        className="absolute inset-0 w-full h-full border-none" 
                        title="Browser" 
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    />
                )}
            </div>
        </div>
    );
}
