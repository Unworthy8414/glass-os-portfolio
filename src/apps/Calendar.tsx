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
    duration: number; // minutes
    type: 'deep-work' | 'meeting' | 'admin';
    color: string;
    isRecurring?: boolean;
}

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    startHour: number; // 9.5 = 9:30
    duration: number; // hours
    type: 'deep-work' | 'meeting' | 'admin' | 'break';
    color: string;
}

const COLORS = [
    { name: 'Blue', value: 'bg-blue-100 border-blue-500 text-blue-900' },
    { name: 'Green', value: 'bg-green-100 border-green-500 text-green-900' },
    { name: 'Purple', value: 'bg-purple-100 border-purple-500 text-purple-900' },
    { name: 'Orange', value: 'bg-orange-100 border-orange-500 text-orange-900' },
    { name: 'Red', value: 'bg-red-100 border-red-500 text-red-900' },
    { name: 'Gray', value: 'bg-slate-100 border-slate-400 text-slate-800' }
];

const formatDate = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export const Calendar: React.FC = () => {
    const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 24)); // Start at Feb 24, 2025
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

    // State
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: "Review Q1 Research", type: "deep-work", duration: 120, priority: "high", color: COLORS[0].value },
        { id: '2', title: "Team Sync", type: "meeting", duration: 30, priority: "medium", color: COLORS[3].value },
        { id: '3', title: "Email Catch-up", type: "admin", duration: 15, priority: "low", color: COLORS[5].value },
        { id: '4', title: "Weekly Report", type: "admin", duration: 15, priority: "low", color: COLORS[5].value, isRecurring: true },
    ]);

    // Helper to generate initial events based on the fixed start date for demo purposes
    const getInitialEvents = (): CalendarEvent[] => {
        const baseDate = new Date(2025, 1, 24); // Feb 24 2025 is a Monday
        const wednesday = new Date(baseDate); wednesday.setDate(baseDate.getDate() + 2);
        
        return [
            { id: 'e1', title: 'Deep Work', date: formatDate(wednesday), startHour: 10, duration: 2, type: 'deep-work', color: COLORS[0].value },
            { id: 'e2', title: 'Client Call', date: formatDate(baseDate), startHour: 14, duration: 1, type: 'meeting', color: COLORS[3].value }
        ];
    };

    const [events, setEvents] = useState<CalendarEvent[]>(getInitialEvents());

    // Task Creation State
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskColor, setNewTaskColor] = useState(COLORS[5].value);

    // Event Interactions
    const [editingEvent, setEditingEvent] = useState<string | null>(null);
    const [newEventName, setNewEventName] = useState("");
    const [resizingEvent, setResizingEvent] = useState<string | null>(null);
    const resizeStartY = useRef<number>(0);
    const resizeStartDuration = useRef<number>(0);

    // Context Menu for Events
    const [eventContextMenu, setEventContextMenu] = useState<{eventId: string, x: number, y: number} | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9); // 9am to 5pm

    const showNotification = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    // Navigation Logic
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

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Calculate displayed dates
    const getDisplayedDates = () => {
        if (currentView === 'day') return [currentDate];
        
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
        // Calculate Monday of this week
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

    // Collision detection logic - NOW OPTIONAL for blocking
    // We still keep it if we want to check overlaps for styling, but we won't use it to block creation
    const getOverlappingEvents = (date: string, start: number, duration: number, excludeEventId: string | null = null) => {
        const end = start + duration;
        return events.filter(ev => {
            if (ev.id === excludeEventId) return false;
            if (ev.date !== date) return false;
            
            const evEnd = ev.startHour + ev.duration;
            return (
                (start >= ev.startHour && start < evEnd) || 
                (end > ev.startHour && end <= evEnd) ||     
                (start <= ev.startHour && end >= evEnd)     
            );
        });
    };

    // Finds the first available slot in 15min increments starting from the current view's week
    // Updated to just find the first time slot, even if overlapping (simulating finding a free spot or just placing it)
    // But to be helpful, we still prefer empty slots.
    const findFirstAvailableSlot = (duration: number): { date: string, start: number } | null => {
        const searchDates = getDisplayedDates();
        
        for (const dateObj of searchDates) {
            const dateStr = formatDate(dateObj);
            for (let hour = 9; hour <= 17 - duration; hour += 0.25) {
                // We strictly prefer non-overlapping for automatic scheduling
                if (getOverlappingEvents(dateStr, hour, duration).length === 0) {
                    return { date: dateStr, start: hour };
                }
            }
        }
        // If no empty slot, just return the first valid slot of the first day
         const firstDate = formatDate(searchDates[0]);
         return { date: firstDate, start: 9 };
    };

    // --- Task Interactions ---

    const handleCreateTask = () => {
        if (!newTaskName.trim()) return;
        const newTask: Task = {
            id: `t-${Date.now()}`,
            title: newTaskName,
            priority: 'medium',
            duration: 30, // Default duration
            type: 'admin', // Default type
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
            // Calculate Monday of current week
            const startOfWeek = new Date(currentDate);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            const mondayStr = formatDate(startOfWeek);

            // Check if Mon 9am is free (Usual Slot)
            const usualSlotFree = getOverlappingEvents(mondayStr, 9, durationHours).length === 0;
            
            let targetSlot;
            let message;

            if (usualSlotFree) {
                targetSlot = { date: mondayStr, start: 9 };
                message = `Scheduled "${task.title}" at usual time (Mon 9:00).`;
            } else {
                // Find next available slot in current view
                targetSlot = findFirstAvailableSlot(durationHours);
                if (!targetSlot) {
                     showNotification("No available slots found!");
                     return;
                }
                // Fix date parsing for notification
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
            // Keep recurring task in list
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
            // Fix date parsing for notification
            const [y, m, d] = slot.date.split('-').map(Number);
            const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
            showNotification(`Scheduled "${task.title}" on ${dayName} at ${Math.floor(slot.start)}:${(slot.start % 1) * 60 === 0 ? '00' : (slot.start % 1) * 60}`);
        } else {
            showNotification("No available slots found in this week!");
        }
    };

    // --- Calendar Grid Interactions ---

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

                // Allowed to move anywhere, even if overlapping
                setEvents(events.map(ev => 
                    ev.id === eventId ? { ...ev, date: dateStr, startHour: hour } : ev
                ));
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
            duration: 1, // Default 1 hour
            type: 'admin',
            color: COLORS[5].value
        };
        setEvents([...events, newEvent]);
        setEditingEvent(newEvent.id);
        setNewEventName("New Event");
    };

    // --- Resizing Logic ---

    const startResize = (e: React.MouseEvent, eventId: string, currentDuration: number) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingEvent(eventId);
        resizeStartY.current = e.clientY;
        resizeStartDuration.current = currentDuration;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - resizeStartY.current;
            const deltaHours = deltaY / 80; // 80px per hour
            let newDuration = Math.max(0.25, resizeStartDuration.current + deltaHours); // Min 15 min
            
            // Round to nearest 15 min (0.25)
            const roundedDuration = Math.round(newDuration * 4) / 4;
            
            setEvents(prev => prev.map(ev => {
                if (ev.id === eventId) {
                    // Allow overlap
                    return { ...ev, duration: roundedDuration };
                }
                return ev;
            }));
        };

        const handleMouseUp = () => {
            setResizingEvent(null);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    // --- Layout Logic for Overlaps ---
    const getEventStyle = (event: CalendarEvent, allEvents: CalendarEvent[]) => {
        // Filter events that overlap with the current event on the same day
        const overlapping = allEvents.filter(ev => 
            ev.date === event.date && 
            ev.id !== event.id &&
            Math.max(ev.startHour, event.startHour) < Math.min(ev.startHour + ev.duration, event.startHour + event.duration)
        );

        // If no overlap, full width
        if (overlapping.length === 0) {
            return {
                top: `${(event.startHour - 9) * 80}px`,
                height: `${Math.max(20, event.duration * 80)}px`,
                left: '4px',
                right: '4px',
                width: 'calc(100% - 8px)'
            };
        }

        // Simple grouping for visualization:
        // Create a group including self
        const group = [...overlapping, event].sort((a, b) => a.id.localeCompare(b.id)); // Consistent order
        const index = group.findIndex(e => e.id === event.id);
        const count = group.length;
        
        // Calculate width and position
        const widthPercent = 100 / count;
        const leftPercent = index * widthPercent;

        return {
            top: `${(event.startHour - 9) * 80}px`,
            height: `${Math.max(20, event.duration * 80)}px`,
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            // Add some padding/margin to separate them slightly
            borderLeft: index > 0 ? '1px solid white' : 'none'
        };
    };

    // ... (Same event editing/context menu logic as before) ...
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
            setEventContextMenu({
                eventId, 
                x: e.clientX - rect.left, 
                y: e.clientY - rect.top
            });
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
        const duration = 90; // 1.5 hours
        const durationHours = duration / 60;
        const searchDates = getDisplayedDates();
        let targetSlot = null;
        
        for (const dateObj of searchDates) {
            const dateStr = formatDate(dateObj);
            // Check for 10 AM with NO overlap preference
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
                color: COLORS[2].value, // Purple
                date: targetSlot.date,
                startHour: targetSlot.start,
                duration: durationHours
            };
            setEvents([...events, newEvent]);
            // Fix date parsing for notification
            const [y, m, d] = targetSlot.date.split('-').map(Number);
            const dayName = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' });
            showNotification(`Smart Suggestion: Scheduled Focus Block on ${dayName} at ${Math.floor(targetSlot.start)}:${(targetSlot.start % 1) * 60 === 0 ? '00' : (targetSlot.start % 1) * 60}`);
        } else {
            showNotification("Could not find a slot for Focus Block.");
        }
    };


    return (
        <div ref={calendarRef} className={`w-full h-full flex flex-col bg-white text-slate-800 font-sans transition-all duration-500 relative ${focusMode ? 'bg-[#f5f5f7]' : ''}`}>
            
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg px-6 py-3 rounded-full flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        {toastMessage}
                        <button onClick={() => setShowToast(false)} className="ml-4 text-slate-400 hover:text-slate-600"><X size={12}/></button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={`h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 transition-all duration-500 ${focusMode ? 'bg-transparent border-transparent' : 'bg-white'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
                        <CalendarIcon className="text-blue-600" />
                        <span>SmartCal</span>
                    </div>
                    
                    {/* View Controls & Navigation */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-2">
                        <div className="flex">
                            <button onClick={() => setCurrentView('day')} className={`px-3 py-1 text-xs rounded-md transition-all ${currentView === 'day' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Day</button>
                            <button onClick={() => setCurrentView('week')} className={`px-3 py-1 text-xs rounded-md transition-all ${currentView === 'week' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Week</button>
                            <button onClick={() => setCurrentView('month')} className={`px-3 py-1 text-xs rounded-md transition-all ${currentView === 'month' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Month</button>
                        </div>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => navigate('prev')} className="p-1 text-slate-500 hover:bg-white hover:text-blue-600 rounded transition-colors"><ChevronLeft size={14} /></button>
                            <button onClick={goToToday} className="px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-white rounded transition-colors">Today</button>
                            <button onClick={() => navigate('next')} className="p-1 text-slate-500 hover:bg-white hover:text-blue-600 rounded transition-colors"><ChevronRight size={14} /></button>
                        </div>
                    </div>

                    <div className="text-slate-400 text-xs font-medium flex flex-col items-start">
                         {/* Sync Status */}
                         <div className="text-slate-300 flex items-center gap-1">
                            Syncing with iPhone{syncDots}
                         </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setFocusMode(!focusMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${focusMode ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Zap size={14} className={focusMode ? 'fill-current' : ''} />
                        {focusMode ? 'Focus Active' : 'Focus Mode'}
                    </button>
                    <button 
                        onClick={() => showNotification("Gentle Nudge: You've been working for 45m. Break?")}
                        className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-blue-600 transition-colors"
                        title="Demo Notification"
                    >
                        <Bell size={16} />
                    </button>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        AL
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Tasks) */}
                <div className={`bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-500 overflow-hidden ${focusMode ? 'w-0 opacity-0 border-none' : 'w-72 opacity-100'}`}>
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700 text-sm">Task Queue</h3>
                        <button 
                            onClick={() => {
                                setIsCreatingTask(!isCreatingTask);
                                setNewTaskName("");
                            }}
                            className={`text-slate-400 hover:text-blue-600 transition-transform ${isCreatingTask ? 'rotate-45 text-blue-600' : ''}`}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {isCreatingTask && (
                            <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm mb-4 animate-in slide-in-from-top-2">
                                <input
                                    autoFocus
                                    placeholder="Task name..."
                                    className="w-full text-sm font-medium mb-3 outline-none border-b border-slate-100 pb-1"
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
                                                className={`w-4 h-4 rounded-full border border-slate-200 ${c.value.split(' ')[0]} ${newTaskColor === c.value ? 'ring-2 ring-slate-400' : ''}`}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={handleCreateTask} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                                </div>
                            </div>
                        )}

                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Unscheduled</div>
                        {tasks.filter(t => !t.isRecurring).map(task => (
                            <div 
                                key={task.id} 
                                draggable // Enable Drag
                                onDragStart={(e) => onDragStart(e, task.id, 'task', task)}
                                className={`bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative ${task.color.split(' ')[1]}`} // Using border color from string
                                style={{ borderLeftWidth: '4px' }}
                                onClick={() => handleTaskDrop(task)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm text-slate-800 flex items-center gap-2">
                                        {task.title}
                                    </span>
                                    <MoreHorizontal size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock size={10} />
                                    <span>{task.duration}m</span>
                                </div>
                            </div>
                        ))}
                        
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Smart Suggestions</span>
                                <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                            </div>
                            
                            {/* Recurring Tasks Suggestions */}
                            {tasks.filter(t => t.isRecurring).map(task => (
                                <div 
                                    key={task.id} 
                                    draggable // Enable Drag
                                    onDragStart={(e) => onDragStart(e, task.id, 'task', task)}
                                    className={`bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group relative mb-3 ${task.color.split(' ')[1]}`} 
                                    style={{ borderLeftWidth: '4px' }}
                                    onClick={() => handleTaskDrop(task)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm text-slate-800 flex items-center gap-2">
                                            {task.title}
                                            <Repeat size={12} className="text-blue-500"/>
                                        </span>
                                        <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">RECURRING</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock size={10} />
                                        <span>{task.duration}m • Every Monday</span>
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={handleSmartSuggest}
                                className="w-full p-3 border border-dashed border-blue-300 rounded-lg bg-blue-50/50 hover:bg-blue-50 text-xs text-blue-600 text-left transition-colors group"
                            >
                                <div className="font-bold mb-1 group-hover:text-blue-700">+ Add Focus Block</div>
                                <div className="text-blue-400">Based on your peak energy time (10am)</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Calendar Grid */}
                <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
                    
                    {/* View: Month Placeholder */}
                    {currentView === 'month' && (
                        <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                            <CalendarIcon size={48} className="mb-4 opacity-20" />
                            <p>Month view implementation pending...</p>
                            <button onClick={() => setCurrentView('week')} className="mt-4 text-blue-500 hover:underline text-sm">Switch to Week View</button>
                        </div>
                    )}

                    {/* View: Week/Day */}
                    {currentView !== 'month' && (
                        <>
                            {/* Days Header */}
                            <div className="flex border-b border-slate-200 shrink-0 bg-white z-10">
                                <div className="w-14 shrink-0 border-r border-slate-100 bg-slate-50"></div>
                                {displayedDates.map((date) => {
                                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                    const dayNumber = date.getDate();
                                    const isSelected = currentView === 'day' || (date.toDateString() === currentDate.toDateString()); 

                                    return (
                                    <div key={date.toISOString()} className="flex-1 py-3 text-center border-r border-slate-100">
                                        <div className="text-xs text-slate-500 font-medium uppercase">{dayName}</div>
                                        <div className={`text-lg font-bold ${isSelected ? 'text-blue-600 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-slate-800'}`}>
                                            {dayNumber}
                                        </div>
                                    </div>
                                )})}
                            </div>

                            {/* Scrollable Grid */}
                            <div className="flex-1 overflow-y-auto relative">
                                <div className="absolute inset-0 flex min-h-[600px]">
                                    {/* Time Labels */}
                                    <div className="w-14 shrink-0 bg-slate-50 border-r border-slate-100 flex flex-col">
                                        {timeSlots.map(hour => (
                                            <div key={hour} className="h-20 text-xs text-slate-400 text-right pr-2 pt-2 border-b border-transparent">
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
                                            className="flex-1 border-r border-slate-50 relative"
                                            onContextMenu={(e) => e.preventDefault()} // Prevent desktop context menu for grid area
                                        >
                                            {/* Hour Rows */}
                                            {timeSlots.map(hour => (
                                                <div 
                                                    key={hour} 
                                                    className="h-20 border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => onDropGrid(e, dateStr, hour)}
                                                    onClick={() => handleGridClick(dateStr, hour)}
                                                />
                                            ))}

                                            {/* Events */}
                                            {events.filter(ev => ev.date === dateStr).map(ev => {
                                                const eventHeight = Math.max(20, ev.duration * 80);
                                                const isSmallEvent = eventHeight < 30;
                                                const style = getEventStyle(ev, events.filter(e => e.date === dateStr)); // Calculate overlap style

                                                return (
                                                <div
                                                    key={ev.id}
                                                    draggable={!resizingEvent} // Disable drag if resizing
                                                    onDragStart={(e) => onDragStart(e, ev.id, 'event')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingEvent(ev.id);
                                                        setNewEventName(ev.title);
                                                    }}
                                                    onContextMenu={(e) => handleEventContextMenu(e, ev.id)}
                                                    style={style}
                                                    className={`absolute rounded-md shadow-sm cursor-pointer hover:brightness-95 transition-colors group flex ${isSmallEvent ? '' : 'flex-col'} overflow-hidden
                                                        ${ev.color}
                                                        ${editingEvent === ev.id ? 'ring-2 ring-blue-500 z-20 shadow-lg' : ''}
                                                        ${isSmallEvent ? 'py-0 pl-1 justify-start items-center' : 'p-2 justify-between items-start'}
                                                    `}
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
                                                                className="w-full bg-transparent font-bold outline-none text-xs"
                                                            />
                                                            <div className="mt-auto flex justify-end">
                                                                <button onClick={(e) => { e.stopPropagation(); updateEventName(); }} className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600">
                                                                    <Check size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {eventHeight >= 20 && ( // Only show title if height >= 20px (15min event)
                                                                <div className={`font-bold truncate leading-tight ${isSmallEvent ? 'text-[8px]' : 'text-[10px]'}`}>{ev.title}</div> 
                                                            )}
                                                            {eventHeight >= 30 && ( // Only show duration if height >= 30px (25min event)
                                                                <div className={`opacity-80 truncate ${isSmallEvent ? 'text-[8px]' : 'text-[9px]'}`}>{`${ev.duration * 60}m`}</div>
                                                            )}
                                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-50">
                                                                <Move size={12} />
                                                            </div>
                                                            
                                                            {/* Resize Handle */}
                                                            <div 
                                                                className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize flex justify-center items-end opacity-0 group-hover:opacity-100 hover:!opacity-100 z-10"
                                                                onMouseDown={(e) => startResize(e, ev.id, ev.duration)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <GripHorizontal size={12} className="text-current opacity-50" />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );})}
                                        </div>
                                    )})}
                                </div>
                                
                                {/* Current Time Line */}
                                <div className="absolute left-14 right-0 top-[340px] flex items-center pointer-events-none z-0">
                                    <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
                                    <div className="h-px bg-red-500 flex-1"></div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Focus Mode Overlay Content */}
                    {focusMode && (
                        <div className="absolute bottom-8 right-8 bg-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 z-50">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                                <Clock size={20} />
                            </div>
                            <div>
                                <div className="font-bold">Focus Session Active</div>
                                <div className="text-xs text-purple-200">Notifications silenced. Calendar blocked.</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Event Context Menu */}
            {eventContextMenu && (
                <div 
                    ref={contextMenuRef}
                    className="absolute z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px]"
                    style={{ left: eventContextMenu.x, top: eventContextMenu.y }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing immediately on click
                >
                    <div 
                        onClick={() => startRenameEvent(eventContextMenu.eventId)} 
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                        <Edit size={16} /> Rename
                    </div>
                    <div 
                        onClick={() => deleteEvent(eventContextMenu.eventId)} 
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                        <Trash2 size={16} /> Delete
                    </div>
                </div>
            )}
        </div>
    );
};