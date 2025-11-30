import React, { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Bell,
    Clock,
    Calendar as CalendarIcon,
    MoreHorizontal,
    Zap,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Move,
    GripHorizontal,
    Trash2,
    Edit,
    Repeat
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    duration: number;
    type: 'deep-work' | 'meeting' | 'admin';
    color: string;
    isRecurring?: boolean;
}

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    startHour: number;
    duration: number;
    type: 'deep-work' | 'meeting' | 'admin' | 'break';
    color: string;
}

const COLORS = [
    { name: 'Blue', value: 'bg-blue-500/30 border-blue-500 text-blue-300' },
    { name: 'Green', value: 'bg-emerald-500/30 border-emerald-500 text-emerald-300' },
    { name: 'Purple', value: 'bg-purple-500/30 border-purple-500 text-purple-300' },
    { name: 'Orange', value: 'bg-orange-500/30 border-orange-500 text-orange-300' },
    { name: 'Red', value: 'bg-red-500/30 border-red-500 text-red-300' },
    { name: 'Gray', value: 'bg-white/10 border-white/30 text-white/70' }
];

const formatDate = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export const Calendar: React.FC = () => {
    const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 24));
    const [focusMode, setFocusMode] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [syncDots, setSyncDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setSyncDots(prev => prev.length < 3 ? prev + '.' : '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: "Review Q1 Research", type: "deep-work", duration: 120, priority: "high", color: COLORS[0].value },
        { id: '2', title: "Team Sync", type: "meeting", duration: 30, priority: "medium", color: COLORS[3].value },
        { id: '3', title: "Email Catch-up", type: "admin", duration: 15, priority: "low", color: COLORS[5].value },
        { id: '4', title: "Weekly Report", type: "admin", duration: 15, priority: "low", color: COLORS[5].value, isRecurring: true },
    ]);

    const getInitialEvents = (): CalendarEvent[] => {
        const baseDate = new Date(2025, 1, 24);
        const wednesday = new Date(baseDate);
        wednesday.setDate(baseDate.getDate() + 2);
        return [
            { id: 'e1', title: 'Deep Work', date: formatDate(wednesday), startHour: 10, duration: 2, type: 'deep-work', color: COLORS[0].value },
            { id: 'e2', title: 'Client Call', date: formatDate(baseDate), startHour: 14, duration: 1, type: 'meeting', color: COLORS[3].value }
        ];
    };

    const [events, setEvents] = useState<CalendarEvent[]>(getInitialEvents());
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskColor, setNewTaskColor] = useState(COLORS[5].value);
    const [editingEvent, setEditingEvent] = useState<string | null>(null);
    const [newEventName, setNewEventName] = useState("");
    const [resizingEvent, setResizingEvent] = useState<string | null>(null);
    const resizeStartY = useRef<number>(0);
    const resizeStartDuration = useRef<number>(0);
    const [eventContextMenu, setEventContextMenu] = useState<{ eventId: string, x: number, y: number } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9);

    const showNotification = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const navigate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (currentView === 'day') {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (currentView === 'week') {
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => setCurrentDate(new Date());

    const getDisplayedDates = () => {
        if (currentView === 'day') return [currentDate];
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const displayedDates = getDisplayedDates();

    const getOverlappingEvents = (date: string, start: number, duration: number, excludeEventId: string | null = null) => {
        const end = start + duration;
        return events.filter(ev => {
            if (ev.id === excludeEventId) return false;
            if (ev.date !== date) return false;
            const evEnd = ev.startHour + ev.duration;
            return (start >= ev.startHour && start < evEnd) || (end > ev.startHour && end <= evEnd) || (start <= ev.startHour && end >= evEnd);
        });
    };

    const findFirstAvailableSlot = (duration: number): { date: string, start: number } | null => {
        const searchDates = getDisplayedDates();
        for (const dateObj of searchDates) {
            const dateStr = formatDate(dateObj);
            for (let hour = 9; hour <= 17 - duration; hour += 0.25) {
                if (getOverlappingEvents(dateStr, hour, duration).length === 0) {
                    return { date: dateStr, start: hour };
                }
            }
        }
        const firstDate = formatDate(searchDates[0]);
        return { date: firstDate, start: 9 };
    };

    const handleCreateTask = () => {
        if (!newTaskName.trim()) return;
        const newTask: Task = {
            id: `t-${Date.now()}`,
            title: newTaskName,
            priority: 'medium',
            duration: 30,
            type: 'admin',
            color: newTaskColor
        };
        setTasks([...tasks, newTask]);
        setIsCreatingTask(false);
        setNewTaskName("");
        setNewTaskColor(COLORS[5].value);
        showNotification(`Task "${newTaskName}" added to queue.`);
    };

    const handleTaskDrop = (task: Task) => {
        const durationHours = task.duration / 60;

        if (task.isRecurring) {
            const startOfWeek = new Date(currentDate);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            const mondayStr = formatDate(startOfWeek);
            const usualSlotFree = getOverlappingEvents(mondayStr, 9, durationHours).length === 0;

            let targetSlot;
            let message;

            if (usualSlotFree) {
                targetSlot = { date: mondayStr, start: 9 };
                message = `Scheduled "${task.title}" at usual time (Mon 9:00).`;
            } else {
                targetSlot = findFirstAvailableSlot(durationHours);
                if (!targetSlot) {
                    showNotification("No available slots found!");
                    return;
                }
                const [y, m, d] = targetSlot.date.split('-').map(Number);
                const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
                const timeStr = `${Math.floor(targetSlot.start)}:${(targetSlot.start % 1) * 60 === 0 ? '00' : (targetSlot.start % 1) * 60}`;
                message = `Usual slot (Mon 9:00) taken. Moved to next opening (${dayName} ${timeStr}).`;
            }

            const newEvent: CalendarEvent = {
                id: `e-${Date.now()}`,
                title: task.title,
                date: targetSlot.date,
                startHour: targetSlot.start,
                duration: durationHours,
                type: task.type,
                color: task.color
            };
            setEvents([...events, newEvent]);
            showNotification(message);
            return;
        }

        const slot = findFirstAvailableSlot(durationHours);
        if (slot) {
            const newEvent: CalendarEvent = {
                id: `e-${Date.now()}`,
                title: task.title,
                date: slot.date,
                startHour: slot.start,
                duration: durationHours,
                type: task.type,
                color: task.color
            };
            setEvents([...events, newEvent]);
            setTasks(tasks.filter(t => t.id !== task.id));
            const [y, m, d] = slot.date.split('-').map(Number);
            const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
            showNotification(`Scheduled "${task.title}" on ${dayName} at ${Math.floor(slot.start)}:${(slot.start % 1) * 60 === 0 ? '00' : (slot.start % 1) * 60}`);
        } else {
            showNotification("No available slots found in this week!");
        }
    };

    const onDragStart = (e: React.DragEvent, id: string, type: 'event' | 'task', taskData?: Task) => {
        if (type === 'event') {
            e.dataTransfer.setData('application/json', JSON.stringify({ type: 'event', id }));
        } else {
            e.dataTransfer.setData('application/json', JSON.stringify({ type: 'task', task: taskData }));
        }
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDropGrid = (e: React.DragEvent, dateStr: string, hour: number) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (!data) return;

        try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'event') {
                const eventId = parsed.id;
                const eventToMove = events.find(ev => ev.id === eventId);
                if (!eventToMove) return;
                setEvents(events.map(ev => ev.id === eventId ? { ...ev, date: dateStr, startHour: hour } : ev));
            } else if (parsed.type === 'task') {
                const task = parsed.task as Task;
                const durationHours = task.duration / 60;
                const newEvent: CalendarEvent = {
                    id: `e-${Date.now()}`,
                    title: task.title,
                    date: dateStr,
                    startHour: hour,
                    duration: durationHours,
                    type: task.type,
                    color: task.color
                };
                setEvents([...events, newEvent]);
                if (!task.isRecurring) {
                    setTasks(tasks.filter(t => t.id !== task.id));
                }
                showNotification(`Scheduled "${task.title}"`);
            }
        } catch (err) {
            console.error("Failed to parse drop data", err);
        }
    };

    const handleGridClick = (dateStr: string, hour: number) => {
        const newEvent: CalendarEvent = {
            id: `e-${Date.now()}`,
            title: 'New Event',
            date: dateStr,
            startHour: hour,
            duration: 1,
            type: 'admin',
            color: COLORS[5].value
        };
        setEvents([...events, newEvent]);
        setEditingEvent(newEvent.id);
        setNewEventName("New Event");
    };

    const startResize = (e: React.MouseEvent, eventId: string, currentDuration: number) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingEvent(eventId);
        resizeStartY.current = e.clientY;
        resizeStartDuration.current = currentDuration;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - resizeStartY.current;
            const deltaHours = deltaY / 80;
            let newDuration = Math.max(0.25, resizeStartDuration.current + deltaHours);
            const roundedDuration = Math.round(newDuration * 4) / 4;
            setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, duration: roundedDuration } : ev));
        };

        const handleMouseUp = () => {
            setResizingEvent(null);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const getEventStyle = (event: CalendarEvent, allEvents: CalendarEvent[]) => {
        const overlapping = allEvents.filter(ev =>
            ev.date === event.date &&
            ev.id !== event.id &&
            Math.max(ev.startHour, event.startHour) < Math.min(ev.startHour + ev.duration, event.startHour + event.duration)
        );

        if (overlapping.length === 0) {
            return {
                top: `${(event.startHour - 9) * 80}px`,
                height: `${Math.max(20, event.duration * 80)}px`,
                left: '4px',
                right: '4px',
                width: 'calc(100% - 8px)'
            };
        }

        const group = [...overlapping, event].sort((a, b) => a.id.localeCompare(b.id));
        const index = group.findIndex(e => e.id === event.id);
        const count = group.length;
        const widthPercent = 100 / count;
        const leftPercent = index * widthPercent;

        return {
            top: `${(event.startHour - 9) * 80}px`,
            height: `${Math.max(20, event.duration * 80)}px`,
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
        };
    };

    const updateEventName = () => {
        if (editingEvent && newEventName.trim()) {
            setEvents(events.map(ev => ev.id === editingEvent ? { ...ev, title: newEventName } : ev));
        }
        setEditingEvent(null);
        setNewEventName("");
    };

    const handleEventContextMenu = (e: React.MouseEvent, eventId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (calendarRef.current) {
            const rect = calendarRef.current.getBoundingClientRect();
            setEventContextMenu({ eventId, x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const deleteEvent = (eventId: string) => {
        setEvents(events.filter(ev => ev.id !== eventId));
        setEventContextMenu(null);
        showNotification("Event deleted.");
    };

    const startRenameEvent = (eventId: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            setEditingEvent(eventId);
            setNewEventName(event.title);
        }
        setEventContextMenu(null);
    };

    const handleSmartSuggest = () => {
        const duration = 90;
        const durationHours = duration / 60;
        const searchDates = getDisplayedDates();
        let targetSlot = null;

        for (const dateObj of searchDates) {
            const dateStr = formatDate(dateObj);
            if (getOverlappingEvents(dateStr, 10, durationHours).length === 0) {
                targetSlot = { date: dateStr, start: 10 };
                break;
            }
        }

        if (!targetSlot) {
            targetSlot = findFirstAvailableSlot(durationHours);
        }

        if (targetSlot) {
            const newEvent: CalendarEvent = {
                id: `s-${Date.now()}`,
                title: 'Focus Block: Analysis',
                type: 'deep-work',
                color: COLORS[2].value,
                date: targetSlot.date,
                startHour: targetSlot.start,
                duration: durationHours
            };
            setEvents([...events, newEvent]);
            const [y, m, d] = targetSlot.date.split('-').map(Number);
            const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
            showNotification(`Smart Suggestion: Scheduled Focus Block on ${dayName} at ${Math.floor(targetSlot.start)}:${(targetSlot.start % 1) * 60 === 0 ? '00' : (targetSlot.start % 1) * 60}`);
        } else {
            showNotification("Could not find a slot for Focus Block.");
        }
    };

    return (
        <div ref={calendarRef} className={`w-full h-full flex flex-col bg-[#1e1e1e] text-white font-sans relative ${focusMode ? 'bg-[#141420]' : ''}`}>
            {/* Toast */}
            {showToast && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg px-4 py-2 rounded-lg flex items-center gap-3 text-xs text-white/80">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        {toastMessage}
                        <button onClick={() => setShowToast(false)} className="ml-2 text-white/40 hover:text-white/60"><X size={10} /></button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={`h-12 border-b border-white/10 flex items-center justify-between px-4 shrink-0 ${focusMode ? 'bg-transparent border-transparent' : 'bg-black/20'}`}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white/80 font-medium text-sm">
                        <CalendarIcon size={16} className="text-blue-400" />
                        <span>SmartCal</span>
                    </div>

                    <div className="flex items-center bg-white/5 rounded-lg p-0.5 gap-1 border border-white/10">
                        <div className="flex">
                            {(['day', 'week', 'month'] as const).map(view => (
                                <button
                                    key={view}
                                    onClick={() => setCurrentView(view)}
                                    className={`px-2 py-1 text-[10px] rounded transition-all capitalize ${currentView === view ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <div className="flex items-center gap-0.5">
                            <button onClick={() => navigate('prev')} className="p-1 text-white/50 hover:bg-white/10 hover:text-white/70 rounded transition-colors"><ChevronLeft size={12} /></button>
                            <button onClick={goToToday} className="px-1.5 py-0.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/70 rounded transition-colors">Today</button>
                            <button onClick={() => navigate('next')} className="p-1 text-white/50 hover:bg-white/10 hover:text-white/70 rounded transition-colors"><ChevronRight size={12} /></button>
                        </div>
                    </div>

                    <div className="text-white/30 text-[10px] flex items-center gap-1">
                        Syncing with iPhone{syncDots}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFocusMode(!focusMode)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border ${focusMode ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                    >
                        <Zap size={10} className={focusMode ? 'fill-current' : ''} />
                        {focusMode ? 'Focus Active' : 'Focus Mode'}
                    </button>
                    <button
                        onClick={() => showNotification("Gentle Nudge: You've been working for 45m. Break?")}
                        className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors"
                    >
                        <Bell size={12} />
                    </button>
                    <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">AL</div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className={`bg-black/20 border-r border-white/10 flex flex-col transition-all duration-500 overflow-hidden ${focusMode ? 'w-0 opacity-0 border-none' : 'w-56 opacity-100'}`}>
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-medium text-white/70 text-xs">Task Queue</h3>
                        <button
                            onClick={() => { setIsCreatingTask(!isCreatingTask); setNewTaskName(""); }}
                            className={`text-white/40 hover:text-blue-400 transition-transform ${isCreatingTask ? 'rotate-45 text-blue-400' : ''}`}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isCreatingTask && (
                            <div className="bg-white/5 p-2 rounded-lg border border-blue-500/30 mb-3 animate-in slide-in-from-top-2">
                                <input
                                    autoFocus
                                    placeholder="Task name..."
                                    className="w-full text-xs font-medium mb-2 outline-none bg-transparent border-b border-white/10 pb-1 text-white placeholder:text-white/30"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        {COLORS.map(c => (
                                            <button
                                                key={c.name}
                                                onClick={() => setNewTaskColor(c.value)}
                                                className={`w-3 h-3 rounded-full border border-white/20 ${c.value.split(' ')[0]} ${newTaskColor === c.value ? 'ring-1 ring-white/50' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={handleCreateTask} className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded">Add</button>
                                </div>
                            </div>
                        )}

                        <div className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-1">Unscheduled</div>
                        {tasks.filter(t => !t.isRecurring).map(task => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, task.id, 'task', task)}
                                className={`bg-white/5 p-2 rounded-lg border-l-2 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing group ${task.color.split(' ')[1]}`}
                                onClick={() => handleTaskDrop(task)}
                            >
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="font-medium text-xs text-white/80">{task.title}</span>
                                    <MoreHorizontal size={10} className="text-white/20 opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-white/40">
                                    <Clock size={8} />
                                    <span>{task.duration}m</span>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">Smart Suggestions</span>
                                <Zap size={10} className="text-amber-400 fill-amber-400" />
                            </div>

                            {tasks.filter(t => t.isRecurring).map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, task.id, 'task', task)}
                                    className={`bg-white/5 p-2 rounded-lg border-l-2 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing group mb-2 ${task.color.split(' ')[1]}`}
                                    onClick={() => handleTaskDrop(task)}
                                >
                                    <div className="flex justify-between items-start mb-0.5">
                                        <span className="font-medium text-xs text-white/80 flex items-center gap-1">
                                            {task.title}
                                            <Repeat size={8} className="text-blue-400" />
                                        </span>
                                        <div className="text-[8px] font-medium text-blue-400 bg-blue-500/20 px-1 rounded">RECURRING</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-white/40">
                                        <Clock size={8} />
                                        <span>{task.duration}m - Every Monday</span>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleSmartSuggest}
                                className="w-full p-2 border border-dashed border-blue-500/30 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 text-[10px] text-blue-400 text-left transition-colors group"
                            >
                                <div className="font-medium mb-0.5">+ Add Focus Block</div>
                                <div className="text-blue-400/60">Based on your peak energy time (10am)</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden">
                    {currentView === 'month' && (
                        <div className="flex-1 flex items-center justify-center flex-col text-white/40">
                            <CalendarIcon size={40} className="mb-3 opacity-20" />
                            <p className="text-sm">Month view coming soon</p>
                            <button onClick={() => setCurrentView('week')} className="mt-3 text-blue-400 hover:underline text-xs">Switch to Week View</button>
                        </div>
                    )}

                    {currentView !== 'month' && (
                        <>
                            {/* Days Header */}
                            <div className="flex border-b border-white/10 shrink-0 bg-black/20 z-10">
                                <div className="w-12 shrink-0 border-r border-white/5 bg-black/20" />
                                {displayedDates.map((date) => {
                                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                    const dayNumber = date.getDate();
                                    const isSelected = currentView === 'day' || (date.toDateString() === currentDate.toDateString());

                                    return (
                                        <div key={date.toISOString()} className="flex-1 py-2 text-center border-r border-white/5">
                                            <div className="text-[10px] text-white/40 font-medium uppercase">{dayName}</div>
                                            <div className={`text-sm font-medium ${isSelected ? 'text-blue-400 bg-blue-500/20 w-6 h-6 rounded-full flex items-center justify-center mx-auto' : 'text-white/80'}`}>
                                                {dayNumber}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grid */}
                            <div className="flex-1 overflow-y-auto relative">
                                <div className="absolute inset-0 flex min-h-[600px]">
                                    {/* Time Labels */}
                                    <div className="w-12 shrink-0 bg-black/20 border-r border-white/5 flex flex-col">
                                        {timeSlots.map(hour => (
                                            <div key={hour} className="h-20 text-[10px] text-white/30 text-right pr-2 pt-1 border-b border-transparent">
                                                {hour}:00
                                            </div>
                                        ))}
                                    </div>

                                    {/* Columns */}
                                    {displayedDates.map((date) => {
                                        const dateStr = formatDate(date);
                                        return (
                                            <div
                                                key={dateStr}
                                                className="flex-1 border-r border-white/5 relative"
                                                onContextMenu={(e) => e.preventDefault()}
                                            >
                                                {timeSlots.map(hour => (
                                                    <div
                                                        key={hour}
                                                        className="h-20 border-b border-white/5 hover:bg-white/5 transition-colors"
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={(e) => onDropGrid(e, dateStr, hour)}
                                                        onClick={() => handleGridClick(dateStr, hour)}
                                                    />
                                                ))}

                                                {events.filter(ev => ev.date === dateStr).map(ev => {
                                                    const eventHeight = Math.max(20, ev.duration * 80);
                                                    const isSmallEvent = eventHeight < 30;
                                                    const style = getEventStyle(ev, events.filter(e => e.date === dateStr));

                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            draggable={!resizingEvent}
                                                            onDragStart={(e) => onDragStart(e, ev.id, 'event')}
                                                            onClick={(e) => { e.stopPropagation(); setEditingEvent(ev.id); setNewEventName(ev.title); }}
                                                            onContextMenu={(e) => handleEventContextMenu(e, ev.id)}
                                                            style={style}
                                                            className={`absolute rounded border-l-2 cursor-pointer hover:brightness-110 transition-colors group flex ${isSmallEvent ? '' : 'flex-col'} overflow-hidden
                                                                ${ev.color}
                                                                ${editingEvent === ev.id ? 'ring-1 ring-blue-500 z-20' : ''}
                                                                ${isSmallEvent ? 'py-0 pl-1 justify-start items-center' : 'p-1.5 justify-between items-start'}`}
                                                        >
                                                            {editingEvent === ev.id ? (
                                                                <div className="flex flex-col h-full relative z-30">
                                                                    <input
                                                                        autoFocus
                                                                        value={newEventName}
                                                                        onChange={(e) => setNewEventName(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && updateEventName()}
                                                                        onBlur={updateEventName}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="w-full bg-transparent font-medium outline-none text-[10px]"
                                                                    />
                                                                    <div className="mt-auto flex justify-end">
                                                                        <button onClick={(e) => { e.stopPropagation(); updateEventName(); }} className="bg-blue-500 text-white p-0.5 rounded hover:bg-blue-600">
                                                                            <Check size={10} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {eventHeight >= 20 && (
                                                                        <div className={`font-medium truncate leading-tight ${isSmallEvent ? 'text-[8px]' : 'text-[10px]'}`}>{ev.title}</div>
                                                                    )}
                                                                    {eventHeight >= 30 && (
                                                                        <div className={`opacity-70 truncate ${isSmallEvent ? 'text-[8px]' : 'text-[9px]'}`}>{`${ev.duration * 60}m`}</div>
                                                                    )}
                                                                    <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-50">
                                                                        <Move size={10} />
                                                                    </div>
                                                                    <div
                                                                        className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize flex justify-center items-end opacity-0 group-hover:opacity-100 z-10"
                                                                        onMouseDown={(e) => startResize(e, ev.id, ev.duration)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <GripHorizontal size={10} className="text-current opacity-50" />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Current Time Line */}
                                <div className="absolute left-12 right-0 top-[340px] flex items-center pointer-events-none z-0">
                                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                                    <div className="h-px bg-red-500 flex-1" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Focus Mode Overlay */}
                    {focusMode && (
                        <div className="absolute bottom-6 right-6 bg-purple-500/20 backdrop-blur-xl text-white px-4 py-3 rounded-xl border border-purple-500/30 flex items-center gap-3 animate-in slide-in-from-bottom-10 z-50">
                            <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center animate-pulse">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="font-medium text-sm">Focus Session Active</div>
                                <div className="text-[10px] text-purple-300/70">Notifications silenced. Calendar blocked.</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Context Menu */}
            {eventContextMenu && (
                <div
                    ref={contextMenuRef}
                    className="absolute z-[1000] bg-[#1e1e1e]/90 backdrop-blur-xl rounded-lg border border-white/10 py-1 min-w-[100px] shadow-xl"
                    style={{ left: eventContextMenu.x, top: eventContextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        onClick={() => startRenameEvent(eventContextMenu.eventId)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                    >
                        <Edit size={12} /> Rename
                    </div>
                    <div
                        onClick={() => deleteEvent(eventContextMenu.eventId)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 cursor-pointer"
                    >
                        <Trash2 size={12} /> Delete
                    </div>
                </div>
            )}
        </div>
    );
};
