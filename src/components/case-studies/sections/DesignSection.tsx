import { PenTool, Monitor, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import type { SectionProps } from './types';
import { useViewMode } from '../../../store/useViewMode';

// Animated illustrations for each recommendation
const SmartCalendarAnimation = () => (
  <div className="relative w-full h-32 mt-3 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
    {/* Task list container - square */}
    <div className="relative w-24 h-24 bg-white/5 rounded-lg border border-white/10 p-2">
      {/* Static task 1 */}
      <div className="h-5 bg-white/15 rounded text-[8px] text-white/70 flex items-center px-2 mb-1.5">
        Task 1
      </div>
      {/* Task 2 - dragged from position 2 to position 3 */}
      <motion.div
        className="absolute left-2 right-2 h-5 bg-[#2a9d8f] rounded text-[8px] text-white flex items-center px-2 shadow-lg z-10"
        animate={{
          top: [34, 34, 60, 60, 34],
          scale: [1, 1.05, 1.05, 1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.7, 1] }}
      >
        Task 2
      </motion.div>
      {/* Task 3 - moves up to position 2 when task 2 moves down */}
      <motion.div
        className="absolute left-2 right-2 h-5 bg-white/15 rounded text-[8px] text-white/70 flex items-center px-2"
        animate={{
          top: [60, 60, 34, 34, 60],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.7, 1] }}
      >
        Task 3
      </motion.div>
    </div>
    {/* Cursor */}
    <motion.div
      className="absolute w-4 h-4 z-20"
      animate={{
        left: ['calc(50% + 30px)', 'calc(50% + 30px)', 'calc(50% + 30px)', 'calc(50% + 30px)', 'calc(50% + 30px)'],
        top: ['calc(50% - 12px)', 'calc(50% - 12px)', 'calc(50% + 14px)', 'calc(50% + 14px)', 'calc(50% - 12px)'],
        opacity: [1, 1, 1, 0, 1],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.2, 0.5, 0.7, 1] }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 drop-shadow-md">
        <path d="M4 0l16 12-7 2-4 8-5-22z" />
      </svg>
    </motion.div>
  </div>
);

const TaskManagementAnimation = () => (
  <div className="relative w-full h-24 mt-3 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
    <div className="relative flex items-center gap-3">
      {/* Big task - fades in first, stays visible until everything fades together */}
      <motion.div
        className="bg-[#264653] rounded px-2 py-1 text-[8px] text-white font-medium whitespace-nowrap"
        animate={{
          opacity: [0, 1, 1, 1, 1, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.15, 0.7, 0.85, 1] }}
      >
        Big Project
      </motion.div>
      {/* Arrow - appears after big project, slides in from left */}
      <motion.div
        className="text-white/40 text-sm -ml-1"
        animate={{
          opacity: [0, 0, 1, 1, 1, 0],
          x: [-15, -15, 0, 0, 0, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.15, 0.25, 0.7, 0.85, 1] }}
      >
        →
      </motion.div>
      {/* Smaller tasks appearing one by one after arrow */}
      <div className="relative flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-[#2a9d8f] rounded px-2 py-0.5 text-[7px] text-white flex items-center gap-1"
            animate={{
              opacity: [0, 0, 0, 1, 1, 0],
              x: [-15, -15, -15, 0, 0, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.25 + i * 0.1, 0.3 + i * 0.1, 0.4 + i * 0.1, 0.85, 1]
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-sm border border-white/50"
              animate={{
                backgroundColor: ['transparent', 'transparent', '#fff', '#fff', 'transparent']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                times: [0, 0.5 + i * 0.05, 0.55 + i * 0.05, 0.85, 1]
              }}
            />
            Step {i + 1}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const FocusProtectionAnimation = () => (
  <div className="relative w-full h-32 mt-3 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
    {/* App window - square and centered */}
    <div className="relative w-28 h-28 bg-white/10 rounded border border-white/20">
      <div className="h-3 bg-white/10 rounded-t flex items-center px-1 gap-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
      </div>
      {/* Content area with vertical spacing */}
      <div className="p-2 flex flex-col items-center gap-2">
        {/* Focus indicator */}
        <motion.div
          className="flex items-center gap-1 px-2 py-1 rounded bg-[#e76f51]/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-[#e76f51]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[8px] text-[#e76f51] font-medium">FOCUS MODE</span>
        </motion.div>
        {/* Blocked notifications */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="bg-white/20 rounded px-2 py-1 text-[7px] text-white/60"
            initial={{ x: 40, opacity: 0 }}
            animate={{
              x: [40, 0, 0, 40],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 + i * 0.8 }}
          >
            🔕 Blocked
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const TimeBlockingAnimation = () => {
  // Generate time strings from 0:10 down to 0:00
  const times = Array.from({ length: 11 }, (_, i) => `0:${String(10 - i).padStart(2, '0')}`);
  const timeKeyframes = times.map((_, i) => i / 10); // [0, 0.1, 0.2, ..., 1]

  return (
    <div className="relative w-full h-24 mt-3 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
      {/* Pomodoro timer circle */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <motion.circle
            cx="18" cy="18" r="15" fill="none" stroke="#f4a261" strokeWidth="3"
            strokeDasharray="94.2"
            animate={{ strokeDashoffset: [0, 94.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.span
            className="text-sm font-bold font-mono"
            animate={{ opacity: times.map(() => 1) }}
            transition={{ duration: 6, repeat: Infinity, times: timeKeyframes, repeatDelay: 1 }}
          >
            {times.map((time, i) => (
              <motion.span
                key={time}
                className="absolute left-1/2 -translate-x-1/2"
                animate={{
                  opacity: timeKeyframes.map((_, j) => j === i ? 1 : 0)
                }}
                transition={{ duration: 6, repeat: Infinity, times: timeKeyframes, repeatDelay: 1 }}
              >
                {time}
              </motion.span>
            ))}
          </motion.span>
          <span className="text-[6px] text-white/50 mt-5">FOCUS</span>
        </div>
      </div>
      {/* Break prompt */}
      <motion.div
        className="absolute bottom-2 bg-[#2a9d8f]/30 rounded px-2 py-1 text-[7px] text-[#2a9d8f]"
        animate={{
          opacity: [0, 0, 1, 1, 0],
          y: [10, 10, 0, 0, -5],
        }}
        transition={{ duration: 7, repeat: Infinity, times: [0, 0.8, 0.85, 0.95, 1] }}
      >
        Time for a break! ☕
      </motion.div>
    </div>
  );
};

const GentleNudgesAnimation = () => (
  <div className="relative w-full h-24 mt-3 bg-white/5 rounded-lg overflow-hidden">
    {/* Abstract window */}
    <div className="absolute left-4 top-4 w-24 h-14 bg-white/10 rounded border border-white/20">
      <div className="h-2.5 bg-white/10 rounded-t flex items-center px-1 gap-0.5">
        <div className="w-1 h-1 rounded-full bg-white/30" />
        <div className="w-1 h-1 rounded-full bg-white/30" />
        <div className="w-1 h-1 rounded-full bg-white/30" />
      </div>
      <div className="p-1.5 space-y-1">
        <div className="h-1 bg-white/20 rounded w-3/4" />
        <div className="h-1 bg-white/20 rounded w-1/2" />
      </div>
    </div>
    {/* Notification sliding down */}
    <motion.div
      className="absolute right-3 bg-gradient-to-r from-[#e9c46a]/30 to-[#e9c46a]/20 rounded-lg px-2 py-1.5 border border-[#e9c46a]/40 shadow-lg"
      initial={{ top: -30, opacity: 0 }}
      animate={{
        top: [-30, 8, 8, 8, -30],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.15, 0.5, 0.85, 1] }}
    >
      <div className="flex items-center gap-1.5">
        <motion.span
          className="text-sm"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          💪
        </motion.span>
        <div>
          <p className="text-[7px] text-[#e9c46a] font-medium">You've got this!</p>
          <p className="text-[6px] text-white/50">Just 2 tasks left today</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const CrossDeviceSyncAnimation = () => (
  <div className="relative w-full h-24 mt-3 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center gap-6">
    {/* Phone */}
    <div className="relative w-8 h-14 bg-white/10 rounded-lg border border-white/20 overflow-hidden">
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-white/20 rounded" />
      <div className="absolute left-1 right-1 top-3 bottom-1 bg-white/5 rounded">
        <motion.div
          className="mx-1 mt-1 h-1 bg-[#2a9d8f]/60 rounded"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
    {/* Sync arrows */}
    <div className="flex flex-col gap-1">
      <motion.div
        className="text-[#2a9d8f] text-xs"
        animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        →
      </motion.div>
      <motion.div
        className="text-[#2a9d8f] text-xs"
        animate={{ x: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        ←
      </motion.div>
    </div>
    {/* Laptop */}
    <div className="relative">
      <div className="w-16 h-10 bg-white/10 rounded-t-lg border border-white/20 border-b-0 overflow-hidden flex items-center justify-center">
        <motion.div
          className="w-10 h-1 bg-[#2a9d8f]/60 rounded"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="w-20 h-1.5 bg-white/20 rounded-b -ml-2" />
    </div>
    {/* Sync indicator */}
    <motion.div
      className="absolute bottom-2 text-[7px] text-[#2a9d8f] flex items-center gap-1"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        ↻
      </motion.span>
      Synced
    </motion.div>
  </div>
);

// Map recommendation titles to their animations
const recommendationAnimations: Record<string, React.FC> = {
  'Smart Calendar': SmartCalendarAnimation,
  'Intelligent Task Management': TaskManagementAnimation,
  'Focus Protection': FocusProtectionAnimation,
  'Time Blocking': TimeBlockingAnimation,
  'Gentle Nudges': GentleNudgesAnimation,
  'Cross-Device Syncing': CrossDeviceSyncAnimation,
};

export const DesignSection = ({ data, isTimeMgmt }: SectionProps) => {
  const { switchToOS } = useViewMode();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <SectionHeader number="04" title="Recommendations" color={colors.sandy} icon={PenTool} />

      <div className="space-y-8">
        {/* See it in action CTA - only for Time Management study */}
        {isTimeMgmt && (
          <motion.div
            className="bg-gradient-to-r from-[#2a9d8f]/20 via-[#e9c46a]/10 to-[#2a9d8f]/20 p-4 rounded-xl border border-[#2a9d8f]/30 flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2a9d8f]/20">
                <Monitor size={20} className="text-[#2a9d8f]" />
              </div>
              <div>
                <p className="text-white/90 font-display text-sm">See these recommendations in action</p>
                <p className="text-white/50 text-xs font-body">Try the interactive OS experience to explore the prototypes</p>
              </div>
            </div>
            <motion.button
              onClick={switchToOS}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a9d8f] hover:bg-[#238b7e] rounded-lg text-sm font-display transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Interactive OS
              <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        )}

        <div>
          <motion.h3
            className="text-xl font-heading mb-3 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Design Recommendations
          </motion.h3>
          <motion.p
            className="text-white/60 mb-6 font-body"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Translating insights into actionable features.
          </motion.p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {data.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              className="bg-white/5 p-5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: `${rec.color}66`, y: -2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${rec.color}33`, color: rec.color }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <rec.icon size={18} />
                </motion.div>
                <h4 className="font-heading text-white/90">{rec.title}</h4>
              </div>

              {rec.desc ? (
                <p className="text-sm text-white/60 font-body">{rec.desc}</p>
              ) : rec.items ? (
                <ul className="text-sm text-white/60 space-y-1 list-disc list-inside font-body">
                  {rec.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              ) : null}

              {/* Render animation for Time Management recommendations */}
              {isTimeMgmt && recommendationAnimations[rec.title] && (
                (() => {
                  const AnimationComponent = recommendationAnimations[rec.title];
                  return <AnimationComponent />;
                })()
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  );
};
