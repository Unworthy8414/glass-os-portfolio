import React from 'react';
import { Trash2, RotateCcw, Check } from 'lucide-react';
import { useOSStore } from '../store/useOSStore';
import { useFileSystem } from '../store/useFileSystem';
import { useAppLauncher } from '../hooks/useAppLauncher';
import { apps } from '../utils/apps';
import { SYSTEM_FOLDERS } from '../constants/layout';
import type { ContextMenuState, WindowState } from '../types';

interface GlobalContextMenuProps {
  menu: ContextMenuState;
  windows: WindowState[];
  activeWindowId: string | null;
  selectedItems: string[];
  onLaunchSelected: () => void;
}

export const GlobalContextMenu: React.FC<GlobalContextMenuProps> = ({
  menu,
  windows,
  activeWindowId,
  selectedItems,
  onLaunchSelected,
}) => {
  const { launchApp, closeContextMenu, focusWindow, showAppWindows, hideAppWindows, quitApp, snapWindow, setWallpaper } = useOSStore();
  const { getItem, deleteItem, restoreItem, emptyTrash } = useFileSystem();
  const { launchFile } = useAppLauncher();

  const menuStyle = {
    top: menu.y > window.innerHeight - 300 ? 'auto' : Math.min(menu.y, window.innerHeight - 250),
    bottom: menu.y > window.innerHeight - 300 ? window.innerHeight - menu.y : 'auto',
    left: Math.min(menu.x, window.innerWidth - 200),
    transformOrigin: menu.y > window.innerHeight - 300 ? 'bottom left' : 'top left'
  };

  const renderDesktopItemMenu = () => {
    const item = getItem(menu.targetId!);
    const isInTrash = item?.parentId === SYSTEM_FOLDERS.TRASH;

    return (
      <>
        <div
          onClick={() => {
            if (menu.type === 'desktop-item') onLaunchSelected();
            else if (item) launchFile(item);
            closeContextMenu();
          }}
          className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
        >
          Open
        </div>
        <div className="h-[1px] bg-white/10 my-1 mx-2" />
        {isInTrash ? (
          <div
            onClick={() => {
              restoreItem(menu.targetId!);
              closeContextMenu();
            }}
            className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Put Back
          </div>
        ) : item?.isSystem ? (
          <div className="opacity-50 p-1.5 rounded-md cursor-not-allowed text-xs transition-colors text-gray-500 flex items-center gap-2">
            <Trash2 size={14} />
            Move to Trash
          </div>
        ) : (
          <div
            onClick={() => {
              deleteItem(menu.targetId!);
              closeContextMenu();
            }}
            className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors text-red-400 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Move to Trash
          </div>
        )}
      </>
    );
  };

  const renderDockItemMenu = () => {
    if (menu.targetId === SYSTEM_FOLDERS.TRASH) {
      return (
        <div
          onClick={() => {
            emptyTrash();
            closeContextMenu();
          }}
          className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
        >
          Empty Trash
        </div>
      );
    }

    const appWindows = windows.filter(w => w.appId === menu.targetId);

    return (
      <>
        {appWindows.length > 0 && (
          <>
            <div className="px-2 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Open Windows</div>
            {appWindows.map(w => (
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

        {appWindows.length > 0 && (
          <>
            <div
              className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
              onClick={() => {
                showAppWindows(menu.targetId!);
                closeContextMenu();
              }}
            >
              Show All Windows
            </div>
            <div
              className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
              onClick={() => {
                hideAppWindows(menu.targetId!);
                closeContextMenu();
              }}
            >
              Hide
            </div>
            <div className="h-[1px] bg-white/10 my-1 mx-2" />

            <div className="px-2 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Snap</div>
            <div
              className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
              onClick={() => {
                const win = windows.find(w => w.appId === menu.targetId);
                if (win) {
                  snapWindow(win.id, { position: { x: 0, y: 32 }, size: { width: window.innerWidth / 2, height: window.innerHeight - 32 - 96 } });
                  closeContextMenu();
                }
              }}
            >
              Left
            </div>
            <div
              className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
              onClick={() => {
                const win = windows.find(w => w.appId === menu.targetId);
                if (win) {
                  snapWindow(win.id, { position: { x: window.innerWidth / 2, y: 32 }, size: { width: window.innerWidth / 2, height: window.innerHeight - 32 - 96 } });
                  closeContextMenu();
                }
              }}
            >
              Right
            </div>
            <div className="h-[1px] bg-white/10 my-1 mx-2" />
          </>
        )}

        <div
          className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
          onClick={() => {
            const app = apps.find(a => a.id === menu.targetId);
            if (app) launchApp(app, { forceNew: true });
            closeContextMenu();
          }}
        >
          New Window
        </div>
        <div className="h-[1px] bg-white/10 my-1 mx-2" />
        <div
          className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors text-red-400 hover:text-red-300"
          onClick={() => {
            quitApp(menu.targetId!);
            closeContextMenu();
          }}
        >
          Quit
        </div>
      </>
    );
  };

  const renderDesktopBgMenu = () => {
    return (
      <>
        {selectedItems.length > 0 ? (
          <div
            onClick={() => {
              onLaunchSelected();
              closeContextMenu();
            }}
            className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
          >
            Open {selectedItems.length > 1 ? `${selectedItems.length} Items` : 'Item'}
          </div>
        ) : (
          <>
            <div className="px-2 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Finder</div>
            <div
              onClick={() => {
                const finderApp = apps.find(a => a.id === 'finder');
                if (finderApp) launchApp(finderApp, { forceNew: true });
                closeContextMenu();
              }}
              className="hover:bg-blue-600 hover:text-white p-1.5 rounded-md cursor-default text-xs transition-colors"
            >
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
    );
  };

  return (
    <div
      className="context-menu absolute z-[9999] bg-[#1e1e1e]/90 backdrop-blur-2xl border border-white/10 rounded-lg p-1 min-w-[180px] shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10"
      style={menuStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      {(menu.type === 'desktop-item' || menu.type === 'finder-item') && menu.targetId
        ? renderDesktopItemMenu()
        : menu.type === 'dock-item' && menu.targetId
        ? renderDockItemMenu()
        : menu.type === 'desktop-bg'
        ? renderDesktopBgMenu()
        : null}
    </div>
  );
};
