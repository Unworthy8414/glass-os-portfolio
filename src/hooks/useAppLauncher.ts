import { useOSStore } from '../store/useOSStore';
import { apps } from '../utils/apps';
import type { FileSystemItem } from '../types';

export function useAppLauncher() {
  const { launchApp } = useOSStore();

  const getAppIdForFile = (item: FileSystemItem): string => {
    if (item.kind === 'app' && item.content) return item.content;
    if (item.kind === 'pdf') return 'pdf';
    if (item.kind === 'image') return 'photos';
    return 'editor';
  };

  const launchFile = (item: FileSystemItem, forceNew = false) => {
    if (item.type === 'folder') return;

    const appId = getAppIdForFile(item);
    const appConfig = apps.find(a => a.id === appId);

    if (appConfig) {
      launchApp(appConfig, { fileId: item.id, title: item.name, forceNew });
    }
  };

  return { launchFile, getAppIdForFile };
}
