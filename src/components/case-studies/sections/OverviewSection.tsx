import { Clock3, Grid, Search, Lightbulb, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import type { SectionProps } from './types';

export const OverviewSection = ({ data, isTimeMgmt }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <SectionHeader number="01" title="Overview" color={colors.blue} icon={LayoutDashboard} />

    {/* Hero */}
    <motion.div
      className={`h-48 bg-gradient-to-br ${data.gradient} rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/20"
        animate={{
          background: ['linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 100%)', 'linear-gradient(225deg, rgba(0,0,0,0.2) 0%, transparent 100%)', 'linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 100%)'],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.4 }}
      >
        {isTimeMgmt ? (
          <Clock3 className="text-white w-20 h-20 relative z-10 drop-shadow-lg" />
        ) : (
          <Grid className="text-white w-20 h-20 relative z-10 drop-shadow-lg" />
        )}
      </motion.div>
    </motion.div>

    <motion.p
      className="text-blue-400 font-medium mb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {data.subtitle}
    </motion.p>
    <motion.h1
      className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {data.title}
    </motion.h1>
    <motion.p
      className="text-lg text-white/60 leading-relaxed mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {data.overview}
    </motion.p>

    {/* Meta info */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Role', value: data.role },
        { label: 'Timeline', value: data.timeline },
        { label: 'Team', value: data.team },
        { label: 'Methods', value: data.methods },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="bg-white/5 p-4 rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)', y: -2 }}
        >
          <div className="text-xs text-white/40 uppercase mb-1">{item.label}</div>
          <div className="text-sm font-medium">{item.value}</div>
        </motion.div>
      ))}
    </div>

    {/* Challenge & Research Question */}
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg font-semibold text-white/90 mb-3">The Challenge</h3>
        <p className="text-sm text-white/60 leading-relaxed">{data.challenge}</p>
      </motion.div>
      <motion.div
        className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}
      >
        <motion.div
          className="absolute top-2 right-2"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles size={16} className="text-blue-400/50" />
        </motion.div>
        <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
          <Search size={14} /> Research Question
        </h4>
        <p className="text-white/80 italic">"{data.researchQuestion}"</p>
      </motion.div>
    </div>

    <motion.div
      className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <h4 className="font-medium text-white/80 mb-2 flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lightbulb size={16} className="text-yellow-400" />
        </motion.div>
        Hypothesis
      </h4>
      <p className="text-white/60">{data.hypothesis}</p>
    </motion.div>

    {/* Approach */}
    <div>
      <motion.h3
        className="text-lg font-semibold text-white/90 mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        My Approach
      </motion.h3>
      <div className="grid md:grid-cols-3 gap-4">
        {data.approach.map((step, i) => (
          <motion.div
            key={step.num}
            className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ borderColor: `${step.color}66`, y: -3 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: `${step.color}33`, color: step.color }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {step.num}
            </motion.div>
            <div>
              <div className="font-medium text-white/80">{step.title}</div>
              <div className="text-sm text-white/50">{step.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);
