import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../store/useFileSystem';

interface PyodideInterface {
    runPythonAsync: (code: string) => Promise<unknown>;
    setStdout: (config: { batched: (msg: string) => void }) => void;
}

declare global {
    interface Window {
        loadPyodide: (() => Promise<PyodideInterface>) | undefined;
        pyodide: PyodideInterface | undefined;
    }
}

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState(['Welcome to GlassOS Terminal v1.0.0', 'Type "help" for commands.']);
    const [input, setInput] = useState('');
    const [currentDir, setCurrentDir] = useState<string | null>('desktop'); // ID of current folder
    const { getItemsInFolder, getItem } = useFileSystem(); // Need 'items' for parent lookup
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
        } catch (e) {
            setHistory(prev => [...prev, `Error loading Python: ${e instanceof Error ? e.message : String(e)}`]);
            setIsPyodideLoading(false);
            return false;
        }
    };

    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [history]);

    // Helper to split args respecting quotes
    const parseArgs = (input: string) => {
        const args: string[] = [];
        let current = '';
        let inQuote = false;
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ' ' && !inQuote) {
                if (current) args.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        if (current) args.push(current);
        return args;
    };

    const resolvePath = (startDir: string | null, path: string): string | null | undefined => {
        if (!path || path === '.' || path === './') return startDir;
        // Remove quotes if present for path resolution
        const cleanPath = path.replace(/^"|"$/g, '');
        
        if (cleanPath === '/' || cleanPath === '~' || cleanPath === '~/') return null; 
        
        let current = startDir;
        let segments = cleanPath.split('/').filter(p => p.length > 0);
        
        if (cleanPath.startsWith('/') || cleanPath.startsWith('~')) {
            current = null;
            if (cleanPath.startsWith('~')) segments = segments.slice(1);
            if (segments[0] === '~') segments.shift();
        }

        for (const part of segments) {
            if (part === '.') continue;
            if (part === '..') {
                if (current === null) continue; 
                const item = getItem(current);
                current = item?.parentId ?? null;
            } else {
                const items = getItemsInFolder(current);
                const found = items.find(i => i.name.toLowerCase() === part.toLowerCase() && i.type === 'folder');
                if (!found) return undefined;
                current = found.id;
            }
        }
        return current;
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (isPythonMode) return; 

            const lastSpaceIndex = input.lastIndexOf(' ');
            const prefix = lastSpaceIndex === -1 ? '' : input.substring(0, lastSpaceIndex + 1);
            const incomplete = input.substring(lastSpaceIndex + 1).replace(/^"/, ''); 

            const files = getItemsInFolder(currentDir);
            const matches = files.filter(f => f.name.toLowerCase().startsWith(incomplete.toLowerCase()));

            if (matches.length === 1) {
                let completion = matches[0].name;
                const suffix = matches[0].type === 'folder' ? '/' : '';
                
                if (completion.includes(' ')) {
                    completion = `"${completion}${suffix}"`;
                } else {
                    completion += suffix;
                }

                setInput(prefix + completion);
            }
            return;
        }

        if (e.key !== 'Enter') return;
        
        const cmd = input; 
        
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
                await window.pyodide?.runPythonAsync(cmd);
            } catch (err) {
                 setHistory(prev => [...prev, String(err)]);
            }
            return;
        }

                const trimmedCmd = cmd.trim();
                const dirName = currentDir ? (getItem(currentDir)?.name || '?') : '/';
                const newHistory = [...history, `➜  ${dirName}: ${trimmedCmd}`];
                
                const args = parseArgs(trimmedCmd);
                const command = args[0]?.toLowerCase();
        
                switch (command) {
                    case 'help':
                        newHistory.push('Available commands: ls, cd, cat, clear, echo, whoami, pwd, python');
                        break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'ls':
                const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
                const files = getItemsInFolder(currentDir, showHidden);
                if (files.length === 0) newHistory.push('(empty)');
                else {
                    // Colorize
                    newHistory.push(files.map(f => {
                        const name = f.name + (f.type === 'folder' ? '/' : '');
                        return name.includes(' ') ? `"${name}"` : name;
                    }).join('  '));
                }
                break;
            case 'sudo':
                // THE TRAP
                window.dispatchEvent(new Event('trigger-hellscape'));
                setHistory(prev => [...prev, 'ACCESS DENIED: INCIDENT REPORTED TO AUTHORITIES']);
                setInput('');
                // Lock terminal temporarily?
                setIsPyodideLoading(true); // Reuse loading state to disable input
                setTimeout(() => setIsPyodideLoading(false), 5000);
                return;
            case 'pwd':
                        if (!currentDir) {
                            newHistory.push('/');
                        } else {
                            let path = getItem(currentDir)?.name || '';
                            let ptr = getItem(currentDir);
                            while(ptr?.parentId) {
                                ptr = getItem(ptr.parentId);
                                if(ptr) path = `${ptr.name}/${path}`;
                            }
                            newHistory.push(`/${path}`);
                        }
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
                            // cd with no args -> go home (root in this case)
                             setCurrentDir(null);
                        } else {
                            const resolved = resolvePath(currentDir, target);
                            if (resolved !== undefined) {
                                setCurrentDir(resolved);
                            } else {
                                newHistory.push(`cd: ${target}: No such directory`);
                            }
                        }
                        break;
                                case 'cat':
                                    const fileName = args[1];
                                    
                                    if (!fileName) {
                                         break; 
                                    }
                            
                                    // Hidden File Trap
                                    if (fileName === '.env' || fileName === '".env"') {
                                         window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                                         newHistory.push('Rickroll initialized...');
                                         break;
                                    }
                    
                                    const itemsInDir = getItemsInFolder(currentDir, true); // Allow finding hidden files if they know name
                                    const file = itemsInDir.find(i => i.name.toLowerCase() === fileName.toLowerCase().replace(/"/g, ''));
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
                                    await window.pyodide?.runPythonAsync(file.content);
                                } catch (err) {
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
                setInput('');    };

    return (
        <div className="w-full h-full bg-[#1e1e1e]/95 text-green-400 font-mono p-4 text-sm overflow-auto backdrop-blur-md" onClick={() => document.getElementById('terminal-input')?.focus()}>
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap mb-1 break-words">{line}</div>
            ))}
            <div className="flex items-center">
                <span className="mr-2 text-blue-400">
                    {isPythonMode ? '>>>' : `➜  ${currentDir ? (getItem(currentDir)?.name || '/') : '/'}:`}
                </span>
                <input 
                    id="terminal-input"
                    className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-800/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isPyodideLoading}
                    autoFocus
                    autoComplete="off"
                />
            </div>
            <div ref={endRef} />
        </div>
    );
};
