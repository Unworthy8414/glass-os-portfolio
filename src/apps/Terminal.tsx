import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../store/useFileSystem';

declare global {
    interface Window {
        loadPyodide: any;
        pyodide: any;
    }
}

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState(['Welcome to GlassOS Terminal v1.0.0', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const [currentDir, setCurrentDir] = useState('desktop'); // ID of current folder
    const { getItemsInFolder, getItem, items } = useFileSystem(); // Need 'items' for parent lookup
    const [isPythonMode, setIsPythonMode] = useState(false);
    const [isPyodideLoading, setIsPyodideLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // Initialize Pyodide
    const initPyodide = async () => {
        if (window.pyodide) return true;
        if (!window.loadPyodide) {
            setHistory(prev => [...prev, 'Error: Python runtime not loaded.']);
            return false;
        }
        setIsPyodideLoading(true);
        setHistory(prev => [...prev, 'Initializing Python environment...']);
        try {
            window.pyodide = await window.loadPyodide();
            // Redirect stdout
            window.pyodide.setStdout({ batched: (msg: string) => {
                setHistory(prev => [...prev, msg]);
            }});
            setHistory(prev => [...prev, 'Python 3.11.3 initialized. Type "exit()" to quit.']);
            setIsPyodideLoading(false);
            return true;
        } catch (e: any) {
            setHistory(prev => [...prev, `Error loading Python: ${e.message}`]);
            setIsPyodideLoading(false);
            return false;
        }
    };

    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [history]);

    const handleCommand = async (e: React.KeyboardEvent) => {
        if (e.key !== 'Enter') return;
        
        const cmd = input; // Don't trim yet, python might need spaces (indentation) though simplistic here
        
        if (isPythonMode) {
            const newHistory = [...history, `>>> ${cmd}`];
            setHistory(newHistory);
            setInput('');

            if (cmd.trim() === 'exit()') {
                setIsPythonMode(false);
                setHistory(prev => [...prev, 'Exited Python.']);
                return;
            }

            try {
                // Very simple REPL
                // For multi-line we'd need more logic, this is 1-liner mode
                await window.pyodide.runPythonAsync(cmd);
            } catch (err: any) {
                 setHistory(prev => [...prev, String(err)]);
            }
            return;
        }

        const trimmedCmd = cmd.trim();
        const newHistory = [...history, `➜  ${getItem(currentDir)?.name || '/'}: ${trimmedCmd}`];
        
        const args = trimmedCmd.split(' ');
        const command = args[0].toLowerCase();

        switch (command) {
            case 'help':
                newHistory.push('Available commands: ls, cd, cat, clear, echo, whoami, pwd, python');
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'ls':
                const files = getItemsInFolder(currentDir);
                if (files.length === 0) newHistory.push('(empty)');
                else {
                    // Colorize
                    newHistory.push(files.map(f => f.name + (f.type === 'folder' ? '/' : '')).join('  '));
                }
                break;
            case 'pwd':
                // Construct full path (recursive parent lookup)
                let path = getItem(currentDir)?.name || '';
                let ptr = getItem(currentDir);
                while(ptr?.parentId) {
                     ptr = getItem(ptr.parentId);
                     if(ptr) path = `${ptr.name}/${path}`;
                }
                newHistory.push(`/${path}`);
                break;
            case 'whoami':
                newHistory.push('guest');
                break;
            case 'echo':
                newHistory.push(args.slice(1).join(' '));
                break;
            case 'cd':
                const target = args[1];
                if (!target) {
                     setCurrentDir('desktop');
                } else if (target === '..') {
                    const current = getItem(currentDir);
                    if (current?.parentId) setCurrentDir(current.parentId);
                    else setCurrentDir('desktop'); // Fallback or stay at root if implemented
                } else if (target === '.') {
                    // Do nothing
                } else {
                    const itemsInDir = getItemsInFolder(currentDir);
                    const folder = itemsInDir.find(i => i.name.toLowerCase() === target.toLowerCase() && i.type === 'folder');
                    if (folder) setCurrentDir(folder.id);
                    else newHistory.push(`cd: ${target}: No such directory`);
                }
                break;
            case 'cat':
                const fileName = args.slice(1).join(' ');
                const itemsInDir = getItemsInFolder(currentDir);
                const file = itemsInDir.find(i => i.name.toLowerCase() === fileName.toLowerCase());
                if (file && file.content) {
                    if (file.kind === 'image' || file.kind === 'pdf') newHistory.push(`[Binary Content: ${file.kind}]`);
                    else newHistory.push(file.content);
                } else {
                    newHistory.push(`cat: ${fileName}: No such file`);
                }
                break;
            case 'python':
                setHistory(newHistory); // Commit command
                setInput('');
                
                const pyFile = args[1];
                const success = await initPyodide();
                if (!success) return;

                if (pyFile) {
                    // Run file mode
                    const itemsInDir = getItemsInFolder(currentDir);
                    const file = itemsInDir.find(i => i.name.toLowerCase() === pyFile.toLowerCase());
                    
                    if (!file) {
                        setHistory(prev => [...prev, `python: can't open file '${pyFile}': [Errno 2] No such file or directory`]);
                    } else if (file.kind !== 'text' && file.kind !== 'python') {
                         setHistory(prev => [...prev, `python: '${pyFile}' is not a text or python file`]);
                    } else if (!file.content) {
                         // Empty file, do nothing
                    } else {
                        try {
                            setHistory(prev => [...prev, `Running ${pyFile}...`]);
                            await window.pyodide.runPythonAsync(file.content);
                        } catch (err: any) {
                            setHistory(prev => [...prev, String(err)]);
                        }
                    }
                } else {
                    // REPL mode
                    setIsPythonMode(true);
                }
                return; // Early return to skip default setHistory
            case '':
                break;
            default:
                newHistory.push(`command not found: ${command}`);
        }

        setHistory(newHistory);
        setInput('');
    };

    return (
        <div className="w-full h-full bg-[#1e1e1e]/95 text-green-400 font-mono p-4 text-sm overflow-auto backdrop-blur-md" onClick={() => document.getElementById('terminal-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-1 break-words">{line}</div>
            ))}
            <div className="flex items-center">
                <span className="mr-2 text-blue-400">
                    {isPythonMode ? '>>>' : `➜  ${getItem(currentDir)?.name || '/'}:`}
                </span>
                <input 
                    id="terminal-input"
                    className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-800/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    disabled={isPyodideLoading}
                    autoFocus
                    autoComplete="off"
                />
            </div>
            <div ref={endRef} />
        </div>
    );
};
