import { Folder, Globe, Calculator as CalcIcon, FileText, Code, Image as ImageIcon, Terminal as TerminalIcon, Gamepad, Search, BookOpenText, Calendar as CalendarIcon } from 'lucide-react';
import type { AppConfig } from '../types';
import { Finder } from '../apps/Finder';
import { Calculator } from '../apps/Calculator';
import { Browser } from '../apps/Browser';
import { Editor } from '../apps/Editor';
import { PDFViewer } from '../apps/PDFViewer';
import { Photos } from '../apps/Photos';
import { GameLauncher } from '../apps/GameLauncher';
import { Terminal } from '../apps/Terminal';
import { D20 } from '../apps/D20';
import { Process } from '../apps/Process';
import { Calendar } from '../apps/Calendar';
import { D20Icon } from '../components/icons/D20Icon';
import { FilePicker } from '../components/FilePicker';

export const apps: AppConfig[] = [
  {
    id: 'finder',
    title: 'Finder',
    icon: Folder,
    component: Finder,
    defaultSize: { width: 800, height: 500 },
    defaultPosition: { x: 100, y: 100 },
    dockHidden: true
  },
  {
    id: 'case-studies',
    title: 'Case Studies',
    icon: BookOpenText,
    component: Process,
    defaultSize: { width: 1100, height: 800 },
    defaultPosition: { x: 120, y: 40 }
  },
  {
    id: 'calendar',
    title: 'SmartCal',
    icon: CalendarIcon,
    component: Calendar,
    defaultSize: { width: 1000, height: 700 },
    defaultPosition: { x: 220, y: 120 },
    dockHidden: true
  },
  {
    id: 'browser',
    dockHidden: true,
    title: 'Safari',
    icon: Globe,
    component: Browser,
    defaultSize: { width: 1000, height: 600 },
    defaultPosition: { x: 150, y: 50 }
  },
  {
    id: 'editor',
    dockHidden: true,
    title: 'Code',
    icon: Code,
    component: Editor,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 200, y: 150 }
  },
  {
    id: 'terminal',
    dockHidden: true,
    title: 'Terminal',
    icon: TerminalIcon,
    component: Terminal,
    defaultSize: { width: 600, height: 400 },
    defaultPosition: { x: 250, y: 200 }
  },
  {
    id: 'games',
    dockHidden: true,
    title: 'Arcade',
    icon: Gamepad,
    component: GameLauncher,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 300, y: 150 },
    isResizable: true
  },
  {
    id: 'pdf',
    dockHidden: true,
    title: 'Preview',
    icon: FileText,
    component: PDFViewer,
    defaultSize: { width: 850, height: 800 },
    defaultPosition: { x: 300, y: 50 }
  },
  {
    id: 'photos',
    dockHidden: true,
    title: 'Photos',
    icon: ImageIcon,
    component: Photos,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 250, y: 100 }
  },
  {
    id: 'calculator',
    dockHidden: true,
    title: 'Calculator',
    icon: CalcIcon,
    component: Calculator,
    defaultSize: { width: 300, height: 400 },
    defaultPosition: { x: 400, y: 200 },
    isResizable: true
  },
  {
    id: 'd20',
    dockHidden: true,
    title: 'D20',
    icon: D20Icon,
    component: D20,
    defaultSize: { width: 400, height: 500 },
    defaultPosition: { x: 450, y: 250 },
    isResizable: false
  },
  {
    id: 'file-picker',
    title: 'Open File',
    icon: Search, // Internal util icon
    component: FilePicker,
    defaultSize: { width: 500, height: 400 },
    defaultPosition: { x: 300, y: 200 },
    isResizable: false,
    dockHidden: true
  }
];