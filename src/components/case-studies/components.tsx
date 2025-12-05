import { motion } from 'framer-motion';
import { colors } from './colors';
import type { Persona, JourneyStep, ChartDataItem } from './types';

// Floating Orb Component
export const FloatingOrb = ({ delay, duration, size, color, left, top }: {
  delay: number;
  duration: number;
  size: number;
  color: string;
  left: string;
  top: string;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      filter: 'blur(40px)',
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Animated Section Header
export const SectionHeader = ({ number, title, color, icon: Icon }: {
  number: string;
  title: string;
  color: string;
  icon: React.ElementType;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 mb-6"
  >
    <motion.div
      className="flex items-center justify-center w-8 h-8 rounded-lg"
      style={{ backgroundColor: `${color}33` }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <Icon size={16} style={{ color }} />
    </motion.div>
    <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
      {number} / {title}
    </h2>
  </motion.div>
);

// Animated Tag Component
export const AnimatedTag = ({ label, color, delay = 0 }: { label: string; color: string; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: 'spring', stiffness: 200 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="px-3 py-1.5 rounded text-sm cursor-default"
    style={{ backgroundColor: `${color}26`, color }}
  >
    {label}
  </motion.span>
);

// Animated Bar chart component
export const BarChart = ({ data, maxValue }: { data: ChartDataItem[], maxValue: number }) => {
  const maxHeight = 120;
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3 bg-white/5 p-4 pt-8 rounded-lg border border-white/10" style={{ minHeight: '180px' }}>
        {data.map((item, i) => {
          const barHeight = Math.max(8, (item.value / maxValue) * maxHeight);
          return (
            <motion.div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.span
                className="text-xs font-medium text-white/70 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {item.value}
              </motion.span>
              <motion.div
                className="w-full rounded-t"
                style={{ backgroundColor: item.color }}
                initial={{ height: 0 }}
                whileInView={{ height: barHeight }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              />
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {data.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.05 }}
          >
            <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
            <span className="text-white/60">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Animated Journey Map component
export const JourneyMap = ({ steps, color }: { steps: JourneyStep[], color: string }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    {/* Animated background gradient */}
    <motion.div
      className="absolute inset-0 opacity-30"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, transparent 50%, ${color}05 100%)`,
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    />

    <div className="relative border-l-2 pl-6 space-y-6" style={{ borderColor: `${color}66` }}>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          {/* Animated dot */}
          <motion.div
            className="absolute -left-[29px] w-3.5 h-3.5 rounded-full border-2 border-slate-900"
            style={{ backgroundColor: color }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
          />
          {/* Pulsing ring on first item */}
          {i === 0 && (
            <motion.div
              className="absolute -left-[33px] w-5 h-5 rounded-full"
              style={{ backgroundColor: `${color}40` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase" style={{ color }}>{step.time}</span>
            <motion.span
              className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              {step.mood}
            </motion.span>
          </div>
          <h4 className="font-medium text-sm text-white/80 mb-1">{step.title}</h4>
          <p className="text-white/50 text-sm">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Animated Persona component
export const PersonaCard = ({ persona }: { persona: Persona }) => (
  <motion.div
    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-white/10 relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
  >
    {/* Animated background accent */}
    <motion.div
      className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
      style={{ background: `radial-gradient(circle, ${persona.color} 0%, transparent 70%)` }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />

    <div className="flex items-start gap-4 relative z-10">
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/20 shrink-0"
        style={{ backgroundColor: persona.color }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {persona.initials}
      </motion.div>
      <div className="flex-1">
        <motion.h3
          className="text-lg font-semibold text-white"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {persona.name}
        </motion.h3>
        <motion.p
          className="text-sm"
          style={{ color: colors.teal }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {persona.subtitle}
        </motion.p>
        {persona.details && (
          <motion.p
            className="text-xs text-white/40 mt-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {persona.details}
          </motion.p>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: colors.blue }}>Goals</h4>
            <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
              {persona.goals.map((goal, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  {goal}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: colors.red }}>Pain Points</h4>
            <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
              {persona.painPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                >
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {(persona.extra1 || persona.extra2) && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {persona.extra1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: persona.extra1.color }}>{persona.extra1.title}</h4>
                <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
                  {persona.extra1.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </motion.div>
            )}
            {persona.extra2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: persona.extra2.color }}>{persona.extra2.title}</h4>
                <ul className="space-y-1 text-sm text-white/60 list-disc list-inside">
                  {persona.extra2.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
