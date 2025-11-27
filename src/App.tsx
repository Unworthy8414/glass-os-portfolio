import { useEffect, useState, useRef } from 'react';
import { useOSStore } from './store/useOSStore';
import { useFileSystem } from './store/useFileSystem';
import { Window } from './components/Window';
import { Dock } from './components/Dock';
import { apps } from './utils/apps';
import { Wifi, Battery, Command, Search, Globe, FileText, Folder, Image as ImageIcon, Trash2, RotateCcw, Check, Smartphone, RotateCw } from 'lucide-react';
import { PythonIcon } from './components/icons/PythonIcon';
import { format } from 'date-fns';
import { Menubar } from './components/Menubar';
import './App.css';

function App() {
  const { windows, activeWindowId, launchApp, snapWindow, wallpaper, setWallpaper, globalContextMenu, openContextMenu, closeContextMenu, focusWindow, showAppWindows, hideAppWindows, quitApp } = useOSStore();
  const { getItemsInFolder, deleteItem, moveItem, restoreItem, resetFileSystem, getItem, emptyTrash } = useFileSystem();
  const [time, setTime] = useState(new Date());
  const [showHellscape, setShowHellscape] = useState(false);
  
  // Local contextMenu state removed, using global store instead
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const isDraggingSelection = useRef(false);
  const dragStart = useRef<{ x: number, y: number } | null>(null);
  
  const activeApp = windows.find(w => w.id === activeWindowId);
  const appTitle = activeApp ? activeApp.title : 'Finder';
  const desktopItems = getItemsInFolder('desktop');

  // Memoize emoji generation to prevent re-renders from resetting their position
  const fallingEmojis = useRef(Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 95}vw`,
      animationDuration: `${Math.random() * 2 + 1}s`,
      animationDelay: `${Math.random() * 2}s`
  }))).current;

  useEffect(() => {
    const handleHellscape = () => {
        setShowHellscape(true);
        setTimeout(() => setShowHellscape(false), 5000);
    };
    window.addEventListener('trigger-hellscape', handleHellscape);
    return () => window.removeEventListener('trigger-hellscape', handleHellscape);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = () => closeContextMenu();

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.length > 0) {
            selectedItems.forEach(id => deleteItem(id));
            setSelectedItems([]);
        }
    };
    
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItems, deleteItem, closeContextMenu]);
  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      // Check if target is desktop icon
      const target = e.target as HTMLElement;
      const desktopIcon = target.closest('.desktop-icon');

      if (desktopIcon) {
          const itemId = desktopIcon.getAttribute('data-id');
          if (itemId) {
              openContextMenu('desktop-item', e.pageX, e.pageY, itemId);
               if (!selectedItems.includes(itemId)) {
                   setSelectedItems([itemId]);
               }
               return;
          }
      }
      
      openContextMenu('desktop-bg', e.pageX, e.pageY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      if (!(e.target as HTMLElement).classList.contains('desktop-bg')) return;
      isDraggingSelection.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      setSelectionBox({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
      setSelectedItems([]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDraggingSelection.current || !dragStart.current) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      const startX = dragStart.current.x;
      const startY = dragStart.current.y;

      const newBox = {
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY)
      };
      setSelectionBox(newBox);
  };

  const handleMouseUp = () => {
      if (isDraggingSelection.current && selectionBox) {
          const selectedIds: string[] = [];
          const icons = document.querySelectorAll('.desktop-icon');
          
          // Normalize selection box rect
          const selLeft = selectionBox.x;
          const selRight = selectionBox.x + selectionBox.width;
          const selTop = selectionBox.y;
          const selBottom = selectionBox.y + selectionBox.height;

          icons.forEach((icon) => {
              const rect = icon.getBoundingClientRect();
              
              // Strict Intersection Logic (AABB)
              const isIntersecting = !(
                  rect.right < selLeft || 
                  rect.left > selRight || 
                  rect.bottom < selTop || 
                  rect.top > selBottom
              );

              if (isIntersecting) {
                  const id = icon.getAttribute('data-id');
                  if (id) selectedIds.push(id);
              }
          });
          
          if (selectionBox.width > 5 || selectionBox.height > 5) {
              setSelectedItems(selectedIds);
          }
      }
      isDraggingSelection.current = false;
      setSelectionBox(null);
      dragStart.current = null;
  };

  const handleLaunch = (item: any) => {
      let appId = 'editor';
      if (item.kind === 'pdf') appId = 'pdf';
      else if (item.kind === 'image') appId = 'photos';
      
      const appConfig = apps.find(a => a.id === appId);
      if (appConfig) {
          launchApp(appConfig, { fileId: item.id, title: item.name, forceNew: true });
      }
  };

  const handleLaunchSelected = () => {
      selectedItems.forEach(id => {
          const item = desktopItems.find(i => i.id === id);
          if (item) handleLaunch(item);
      });
      closeContextMenu();
  };

  const getWallpaperClass = () => {
      switch(wallpaper) {
          case 'aurora': return 'bg-aurora';
          case 'midnight': return 'bg-midnight';
          case 'sunset': return 'bg-sunset';
          default: return 'bg-breathing';
      }
  };

  return (
    <div 
        className="relative w-screen max-w-[100vw] h-screen overflow-hidden bg-black text-white select-none font-sans"
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            if (id) moveItem(id, 'desktop');
        }}
    >
      <div className={`absolute inset-0 z-0 desktop-bg ${getWallpaperClass()}`}>
         <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay desktop-bg" />
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden gap-2">
             <span className="text-white/30 text-[2vw] font-bold tracking-[0.5em] uppercase select-none">UX Researcher</span>
             <span className="text-white/10 text-[10vw] font-black tracking-tighter select-none whitespace-nowrap leading-none">caylin.yeung</span>
         </div>
      </div>

      {selectionBox && (
          <div 
            className="absolute border border-blue-400/50 bg-blue-400/20 z-0 pointer-events-none"
            style={{ 
                left: selectionBox.x, 
                top: selectionBox.y, 
                width: selectionBox.width, 
                height: selectionBox.height 
            }} 
          />
      )}

      <div className="absolute top-10 right-4 bottom-24 z-0 flex flex-col flex-wrap-reverse content-start items-end gap-6 p-4 pointer-events-none">
          {desktopItems.map((item) => (
              <div 
                key={item.id}
                data-id={item.id}
                draggable={!item.isSystem}
                onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', item.id);
                    e.dataTransfer.effectAllowed = 'move';
                }}
                onDoubleClick={() => handleLaunch(item)}
                onClick={(e) => {
                    e.stopPropagation(); 
                    setSelectedItems([item.id]);
                }}
                className={`
                    desktop-icon w-24 flex flex-col items-center group cursor-pointer p-2 rounded transition-all pointer-events-auto
                    ${selectedItems.includes(item.id) ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'}
                `}
              >
                   {item.kind === 'pdf' ? <FileText size={48} strokeWidth={1} className="text-red-400 drop-shadow-lg mb-1" /> :
                   item.kind === 'image' ? <ImageIcon size={48} strokeWidth={1} className="text-purple-400 drop-shadow-lg mb-1" /> :
                   item.kind === 'python' ? <PythonIcon size={48} className="drop-shadow-lg mb-1" /> :
                   item.kind === 'text' ? <FileText size={48} strokeWidth={1} className="text-gray-300 drop-shadow-lg mb-1" /> :
                   <Folder size={48} strokeWidth={1} className="text-blue-400 fill-blue-400/20 drop-shadow-lg mb-1" />}
                  <span className={`
                      text-xs text-center text-white drop-shadow-md break-words w-full line-clamp-2 font-medium px-1 rounded-md
                      ${selectedItems.includes(item.id) ? 'bg-blue-600' : 'bg-black/20 group-hover:bg-transparent'}
                  `}>
                      {item.name}
                  </span>
              </div>
          ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-xl flex items-center justify-between px-4 z-[2000] text-xs font-medium border-b border-white/10 shadow-sm text-white/90">
          <div className="flex items-center space-x-4">
              <span className="font-bold text-sm tracking-tight flex items-center gap-2">
                  <Globe size={14} className="text-blue-400" />
              </span>
              <span className="font-bold">{appTitle}</span>
              <Menubar appTitle={appTitle} />
          </div>
              <div className="flex items-center space-x-4 text-white/80">
                  <button onClick={resetFileSystem} className="hover:text-white transition-colors" title="Reset State">
                      <RotateCcw size={14} />
                  </button>
                  <Search size={14} />              <Command size={14} />
              <Wifi size={14} />
              <Battery size={14} />
              <span className="font-variant-numeric tabular-nums">{format(time, 'EEE MMM d h:mm aa')}</span>
          </div>
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none pt-8 pb-24 px-4">
         {windows.map((win) => {
            const AppComp = apps.find(a => a.id === win.appId)?.component;
            if (!AppComp) return null;
            return (
                <Window key={win.id} window={win} component={AppComp} />
            );
         })}
      </div>

      <Dock />
      
      {/* Context Menu */}
      {globalContextMenu && (
          <div 
            className="context-menu absolute z-[9999] bg-[#1e1e1e]/90 backdrop-blur-2xl border border-white/10 rounded-lg p-1 min-w-[180px] shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10"
            style={{ 
                top: globalContextMenu.y > window.innerHeight - 300 ? 'auto' : Math.min(globalContextMenu.y, window.innerHeight - 250), 
                bottom: globalContextMenu.y > window.innerHeight - 300 ? window.innerHeight - globalContextMenu.y : 'auto',
                left: Math.min(globalContextMenu.x, window.innerWidth - 200),
                transformOrigin: globalContextMenu.y > window.innerHeight - 300 ? 'bottom left' : 'top left'
            }}
            onContextMenu={(e) => e.preventDefault()} 
          >
             {(globalContextMenu.type === 'desktop-item' || globalContextMenu.type === 'finder-item') && globalContextMenu.targetId ? (
                 <>
                     <div onClick={() => { 
                         if (globalContextMenu.type === 'desktop-item') handleLaunchSelected();
                         else {
                             const item = getItem(globalContextMenu.targetId!);
                             if (item) handleLaunch(item);
                         }
                         closeContextMenu(); 
                     }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">
                        Open
                     </div>
                     <div className="h-[1px] bg-white/10 my-1 mx-2" />
                     {getItem(globalContextMenu.targetId)?.parentId === 'trash' ? (
                        <div onClick={() => {
                            restoreItem(globalContextMenu.targetId!);
                            closeContextMenu();
                        }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors flex items-center gap-2">
                            <RotateCcw size={14} />
                            Put Back
                        </div>
                     ) : getItem(globalContextMenu.targetId)?.isSystem ? (
                        <div className="opacity-50 p-1.5 rounded-md cursor-not-allowed text-xs transition-colors text-gray-500 flex items-center gap-2">
                            <Trash2 size={14} />
                            Move to Trash
                        </div>
                     ) : (
                        <div onClick={() => {
                            deleteItem(globalContextMenu.targetId!);
                            closeContextMenu();
                        }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors text-red-400 flex items-center gap-2">
                            <Trash2 size={14} />
                            Move to Trash
                        </div>
                     )}
                 </>
             ) : globalContextMenu.type === 'dock-item' && globalContextMenu.targetId ? (
                 <>
                    {globalContextMenu.targetId === 'trash' ? (
                        <div onClick={() => {
                            emptyTrash();
                            closeContextMenu();
                        }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">
                            Empty Trash
                        </div>
                    ) : (
                    <>
                        {/* Window List */}
                        {windows.filter(w => w.appId === globalContextMenu.targetId).length > 0 && (
                            <>
                                <div className="px-2 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Open Windows</div>
                                {windows.filter(w => w.appId === globalContextMenu.targetId).map(w => (
                                    <div
                                        key={w.id}
                                        onClick={() => {
                                            focusWindow(w.id);
                                            closeContextMenu();
                                        }}
                                        className="flex items-center w-full px-2 py-1.5 rounded-md hover:bg-white/10 text-left group transition-colors gap-2 cursor-pointer"
                                    >
                                        <span className={`w-4 flex items-center justify-center ${w.id === activeWindowId ? 'text-blue-400' : 'opacity-0'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span className="truncate max-w-[180px] text-xs text-white/90">{w.title}</span>
                                        {w.isMinimized && <span className="ml-auto text-[10px] text-white/40 italic">min</span>}
                                    </div>
                                ))}
                                <div className="h-px bg-white/10 my-1.5 mx-1" />
                            </>
                        )}

                        {windows.some(w => w.appId === globalContextMenu.targetId) ? (
                            <>
                                <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors" onClick={() => {
                                    showAppWindows(globalContextMenu.targetId!);
                                    closeContextMenu();
                                }}>Show All Windows</div>
                                <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors" onClick={() => {
                                    hideAppWindows(globalContextMenu.targetId!);
                                    closeContextMenu();
                                }}>Hide</div>
                                <div className="h-[1px] bg-white/10 my-1 mx-2" />
                                
                                {/* Snap Options */}
                                <div className="px-2 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Snap</div>
                                <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors" onClick={() => {
                                    const win = windows.find(w => w.appId === globalContextMenu.targetId);
                                    if (win) {
                                        snapWindow(win.id, { position: { x: 0, y: 32 }, size: { width: window.innerWidth / 2, height: window.innerHeight - 32 - 96 } });
                                        closeContextMenu();
                                    }
                                }}>Left</div>
                                <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors" onClick={() => {
                                    const win = windows.find(w => w.appId === globalContextMenu.targetId);
                                    if (win) {
                                        snapWindow(win.id, { position: { x: window.innerWidth / 2, y: 32 }, size: { width: window.innerWidth / 2, height: window.innerHeight - 32 - 96 } });
                                        closeContextMenu();
                                    }
                                }}>Right</div>
                                <div className="h-[1px] bg-white/10 my-1 mx-2" />
                            </>
                        ) : null}

                        <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors" onClick={() => {
                            const app = apps.find(a => a.id === globalContextMenu.targetId);
                            if (app) launchApp(app, { forceNew: true });
                            closeContextMenu();
                        }}>New Window</div>
                        <div className="h-[1px] bg-white/10 my-1 mx-2" />
                        <div className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors text-red-400 hover:text-red-300" onClick={() => {
                            quitApp(globalContextMenu.targetId!);
                            closeContextMenu();
                        }}>Quit</div>
                    </>
                    )}
                 </>
             ) : globalContextMenu.type === 'desktop-bg' ? (
                 <>
                    {selectedItems.length > 0 ? (
                         <div onClick={() => { handleLaunchSelected(); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">
                            Open {selectedItems.length > 1 ? `${selectedItems.length} Items` : 'Item'}
                        </div>
                    ) : (
                        <>
                            <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Finder</div>
                            <div onClick={() => { launchApp(apps.find(a => a.id === 'finder')!, { forceNew: true }); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">
                                New Finder Window
                            </div>
                        </>
                    )}
                    
                    <div className="h-[1px] bg-white/10 my-1 mx-2" />
                    <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Wallpaper</div>
                    <div onClick={() => { setWallpaper('breathing'); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">Default (Breathing)</div>
                    <div onClick={() => { setWallpaper('aurora'); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">Aurora</div>
                    <div onClick={() => { setWallpaper('midnight'); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">Midnight</div>
                    <div onClick={() => { setWallpaper('sunset'); closeContextMenu(); }} className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors">Sunset</div>
                 </>
             ) : null}
          </div>
      )}
      {showHellscape && (
          <div className="fixed inset-0 z-[99999] bg-red-600/90 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                  <h1 className="text-[10vw] font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] text-center leading-none tracking-tighter">
                      YOUR SINS<br/>WILL NOT BE<br/>FORGIVEN
                  </h1>
              </div>
              {fallingEmojis.map((style, i) => (
                  <div 
                    key={i} 
                    className="absolute text-6xl animate-fall"
                    style={{
                        ...style,
                        top: '-10vh',
                        zIndex: 100000 
                    }}
                  >
                      😈
                  </div>
              ))}
          </div>
      )}

      {/* Mobile Portrait Warning */}
      <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center md:hidden portrait:flex hidden">
          <div className="relative mb-6">
              <Smartphone size={64} className="text-gray-400" />
              <RotateCw size={32} className="absolute -right-2 -bottom-2 text-blue-500 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Please Rotate Device</h2>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Glass OS is designed for desktop or landscape viewing. For the best experience, please rotate your phone or switch to a larger screen.
          </p>
      </div>
    </div>
  );
}

export default App;