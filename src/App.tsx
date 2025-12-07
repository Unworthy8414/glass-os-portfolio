import { useEffect, useState, useRef } from 'react';
import { useOSStore } from './store/useOSStore';
import { useFileSystem } from './store/useFileSystem';
import { useViewMode } from './store/useViewMode';
import { Window } from './components/Window';
import { Dock } from './components/Dock';
import { LauncherOverlay } from './components/LauncherOverlay';
import { WelcomeModal } from './components/WelcomeModal';
import { GlobalContextMenu } from './components/GlobalContextMenu';
import { DesktopIcons } from './components/DesktopIcons';
import { ExitToStandardButton } from './components/ExitToStandardButton';
import { StandardPortfolio } from './components/StandardPortfolio';
import { useDesktopSelection } from './hooks/useDesktopSelection';
import { useAppLauncher } from './hooks/useAppLauncher';
import { useCaseStudiesOpened } from './hooks/useLocalStorage';
import { apps } from './utils/apps';
import { SYSTEM_FOLDERS, getWallpaperClass } from './constants/layout';
import { Wifi, Battery, Command, Search, Globe, RotateCcw, Smartphone, RotateCw } from 'lucide-react';
import { format } from 'date-fns';
import { Menubar } from './components/Menubar';
import './App.css';

function App() {
  const { windows, activeWindowId, wallpaper, globalContextMenu, openContextMenu, closeContextMenu, focusModeActive, snapPreview } = useOSStore();
  const { getItemsInFolder, deleteItem, moveItem, resetFileSystem } = useFileSystem();
  const { viewMode } = useViewMode();
  const { launchFile } = useAppLauncher();
  const [time, setTime] = useState(new Date());
  const [showHellscape, setShowHellscape] = useState(false);
  const [caseStudiesOpened, markCaseStudiesOpened] = useCaseStudiesOpened();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [dismissedOrientationWarning, setDismissedOrientationWarning] = useState(false);
  const { switchToStandard } = useViewMode();

  // Handle body overflow based on view mode
  useEffect(() => {
    if (viewMode === 'standard') {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [viewMode]);

  // Render standard portfolio if that view mode is selected
  if (viewMode === 'standard') {
    return <StandardPortfolio />;
  }

  const {
    selectionBox,
    selectedItems,
    setSelectedItems,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectItem,
    clearSelection
  } = useDesktopSelection();

  const activeApp = windows.find(w => w.id === activeWindowId);
  const appTitle = activeApp ? activeApp.title : 'Finder';
  const desktopItems = getItemsInFolder(SYSTEM_FOLDERS.DESKTOP);

  const fallingEmojis = useRef(Array.from({ length: 50 }).map(() => ({
    left: `${Math.random() * 95}vw`,
    animationDuration: `${Math.random() * 2 + 1}s`,
    animationDelay: `${Math.random() * 2}s`
  }))).current;

  useEffect(() => {
    // Show modal for first-time visitors who haven't seen case studies
    if (!caseStudiesOpened) {
      setShowWelcomeModal(true);
    }
  }, [caseStudiesOpened]);

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    markCaseStudiesOpened();
  };

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
        clearSelection();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItems, deleteItem, closeContextMenu, clearSelection]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleLaunchSelected = () => {
    selectedItems.forEach(id => {
      const item = desktopItems.find(i => i.id === id);
      if (item) launchFile(item, true);
    });
    closeContextMenu();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
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
        if (id) moveItem(id, SYSTEM_FOLDERS.DESKTOP);
      }}
    >
      <div
        className={`absolute inset-0 z-0 desktop-bg ${getWallpaperClass(wallpaper)} transition-all duration-500 ease-in-out`}
        style={{ filter: focusModeActive ? 'blur(8px) brightness(0.7)' : 'none' }}
      >
        <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay desktop-bg" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden gap-2">
          <span className="text-white/30 text-[2vw] font-bold tracking-[0.5em] uppercase select-none">UX Researcher</span>
          <span className="text-white/10 text-[10vw] font-black select-none whitespace-nowrap leading-none">caylin.yeung</span>
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

      <div
        className="absolute top-10 right-4 bottom-24 z-0 flex flex-col flex-wrap-reverse content-start items-end gap-6 p-4 pointer-events-none transition-all duration-500"
        style={{ filter: focusModeActive ? 'blur(8px)' : 'none' }}
      >
        <DesktopIcons
          items={desktopItems}
          selectedItems={selectedItems}
          onSelect={selectItem}
          onLaunch={(item) => launchFile(item, true)}
          onDragStart={handleDragStart}
        />
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
          <Search size={14} />
          <Command size={14} />
          <Wifi size={14} />
          <Battery size={14} />
          <span className="font-variant-numeric tabular-nums">{format(time, 'EEE MMM d h:mm aa')}</span>
        </div>
      </div>

      <div className="relative z-10 w-full h-full pointer-events-none pt-8 pb-24 px-4">
        {windows.map((win) => {
          const AppComp = apps.find(a => a.id === win.appId)?.component;
          if (!AppComp) return null;
          const isDimmed = focusModeActive && win.id !== activeWindowId;
          return (
            <div
              key={win.id}
              className="pointer-events-auto transition-all duration-500"
              style={{
                filter: isDimmed ? 'blur(4px) brightness(0.8)' : 'none',
                opacity: isDimmed ? 0.7 : 1
              }}
            >
              <Window window={win} component={AppComp} />
            </div>
          );
        })}
      </div>

      {/* Global Snap Preview */}
      {snapPreview && (
        <div
          className="fixed z-40 bg-white/10 border border-white/20 rounded-xl pointer-events-none"
          style={{
            left: snapPreview.x,
            top: snapPreview.y,
            width: snapPreview.width,
            height: snapPreview.height
          }}
        />
      )}

      <Dock />
      <LauncherOverlay />
      <ExitToStandardButton />

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
      />

      {globalContextMenu && (
        <GlobalContextMenu
          menu={globalContextMenu}
          windows={windows}
          activeWindowId={activeWindowId}
          selectedItems={selectedItems}
          onLaunchSelected={handleLaunchSelected}
        />
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

      {!dismissedOrientationWarning && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center md:hidden portrait:flex hidden">
          <div className="relative mb-6">
            <Smartphone size={64} className="text-[#2a9d8f]" />
            <RotateCw size={32} className="absolute -right-2 -bottom-2 text-[#2a9d8f] animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Please Rotate Device</h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed mb-6">
            Glass OS is designed for desktop or landscape viewing. For the best experience, please rotate your phone or switch to a larger screen.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => setDismissedOrientationWarning(true)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
            >
              I don't care, let me in
            </button>
            <button
              onClick={switchToStandard}
              className="w-full py-3 bg-[#2a9d8f] hover:bg-[#238b7e] text-white font-medium rounded-xl transition-colors"
            >
              Take me to the static site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
