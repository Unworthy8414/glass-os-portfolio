import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { useFileSystem } from '../store/useFileSystem';

export const Editor: React.FC<{ windowId: string }> = ({ windowId }) => {
    const { windows } = useOSStore(); // We might need setWindowProps later to update title/id
    const { getItem, updateFileContent, createItem } = useFileSystem();
    const [content, setContent] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [cursorPos, setCursorPos] = useState(0);
    
    const win = windows.find(w => w.id === windowId);
    const fileId = win?.props?.fileId;
    const file = getItem(fileId);

    useEffect(() => {
        if (file && file.content !== undefined) {
            setContent(file.content);
        } else if (!fileId) {
            setContent(`// Welcome to GlassOS Editor
// -------------------------

function init() {
  console.log("Start typing...");
}`);
        }
    }, [fileId, file]);

    const getLineCol = (text: string, pos: number) => {
        const upToCursor = text.substring(0, pos);
        const lines = upToCursor.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        return { line, col };
    };

    const { line, col } = getLineCol(content, cursorPos);

    const handleSave = () => {
        if (fileId) {
            updateFileContent(fileId, content);
            setIsDirty(false);
        } else {
            // Save As Logic
            const filename = prompt("Enter filename to save (e.g. script.py or note.txt):", "Untitled.txt");
            if (filename) {
                const newId = filename.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
                const isPython = filename.endsWith('.py');
                
                createItem({
                    id: newId,
                    parentId: 'desktop', // Default to desktop
                    name: filename,
                    type: 'file',
                    kind: isPython ? 'python' : 'text',
                    content: content
                });
                
                // Update window to point to new file
                // This requires a store action to update window props, or we force a reload.
                // Since we don't have updateWindowProps exposed yet, we'll just reload the app or let the user find it.
                // Ideally, we should update the window state.
                
                alert(`File saved to Desktop as ${filename}`);
                setIsDirty(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
        }
    };
    
    const updateCursor = (e: any) => {
        setCursorPos(e.target.selectionStart);
    };

    return (
        <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] flex flex-col font-mono text-sm" onKeyDown={handleKeyDown}>
             <div className="h-9 bg-[#252526] flex items-center px-4 text-xs space-x-2 select-none border-b border-black/20 shrink-0">
                 <span className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors text-gray-300 font-medium" onClick={handleSave}>
                     {fileId ? 'Save' : 'Save As...'}
                 </span>
                 {/* Removed "Edit" button as requested */}
                 <div className="flex-1" />
                 <span className="text-gray-500">{file ? file.name : 'Untitled'}{isDirty ? '*' : ''}</span>
             </div>
             <textarea 
                className="flex-1 bg-[#1e1e1e] resize-none p-4 focus:outline-none leading-relaxed selection:bg-blue-500/40 text-gray-300"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    setIsDirty(true);
                    updateCursor(e);
                }}
                onSelect={updateCursor}
                onClick={updateCursor}
                onKeyUp={updateCursor}
                spellCheck={false}
             />
             <div className="h-6 bg-[#007acc] text-white flex items-center px-2 text-[10px] space-x-4 shrink-0">
                 <span>Ln {line}, Col {col}</span>
                 <span>UTF-8</span>
                 <span>{fileId ? 'Saved' : 'Unsaved'}</span>
             </div>
        </div>
    );
}