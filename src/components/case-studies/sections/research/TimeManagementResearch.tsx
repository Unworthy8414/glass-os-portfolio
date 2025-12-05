import { StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../../colors';
import { AnimatedTag, BarChart } from '../../components';
import type { TimeManagementData } from '../../types';

export const TimeManagementResearch = ({ data }: { data: TimeManagementData }) => (
  <div className="space-y-12">
    {/* Phase 1: Focus Group */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.purple}33`, color: colors.purple }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 1
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">Focus Group</h3>
      </div>
      <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Identify user needs, preferences, and feature priorities.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} /> Challenges Identified</h4>
          <div className="flex flex-wrap gap-2">
            {data.focusGroupChallenges.map((tag, i) => (
              <AnimatedTag key={tag} label={tag} color={colors.red} delay={i * 0.05} />
            ))}
          </div>
        </motion.div>
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><StickyNote size={14} /> Solutions Mentioned</h4>
          <div className="flex flex-wrap gap-2">
            {data.focusGroupSolutions.map((tag, i) => (
              <AnimatedTag key={tag} label={tag} color={colors.yellow} delay={i * 0.05} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>

    <div className="border-t border-white/10" />

    {/* Phase 2: Survey */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.blue}33`, color: colors.blue }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 2
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">Online Survey</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Participants', value: '17', sub: '"Good at time management"' },
          { label: 'Platform', value: 'JotForm', sub: '12 Questions' },
          { label: 'Focus', value: 'Usage & Features', sub: 'Anti-procrastination' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white/5 p-4 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div className="text-xs text-white/40 uppercase">{item.label}</div>
            <div className="text-lg font-medium text-white/80">{item.value}</div>
            <div className="text-xs text-white/40">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-white/70 mb-3 text-sm">Q1: Task types managed</h4>
          <BarChart data={data.surveyData.q1} maxValue={15} />
        </div>
        <div>
          <h4 className="font-medium text-white/70 mb-3 text-sm">Q7: Anti-procrastination strategy</h4>
          <BarChart data={data.surveyData.q7} maxValue={9} />
        </div>
      </div>

      {/* Key Stats */}
      <motion.div
        className="bg-white/5 p-5 rounded-xl border border-white/10"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h4 className="font-medium text-white/70 mb-3 text-sm">Key Stats</h4>
        <div className="space-y-2">
          {data.keyStats.map((stat, i) => (
            <motion.div
              key={i}
              className="flex justify-between text-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-white/60">{stat.label}</span>
              <motion.span
                className="font-medium text-white/80"
                whileHover={{ scale: 1.1, color: colors.blue }}
              >
                {stat.value}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>

    <div className="border-t border-white/10" />

    {/* Phase 3: Diary Study */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.green}33`, color: colors.green }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 3
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">Diary Study</h3>
      </div>
      <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Observe real-world behavior over 10 days with 4 participants.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/70 mb-3 text-sm">Common Distractions</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.diaryDistractions.map((tag, i) => (
              <motion.div
                key={tag}
                className="p-2 rounded text-sm text-center font-medium"
                style={{ backgroundColor: `${colors.pink}26`, color: colors.pink }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/70 mb-3 text-sm">Strategies to Refocus</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.diaryStrategies.map((tag, i) => (
              <motion.div
                key={tag}
                className="p-2 rounded text-sm text-center font-medium"
                style={{ backgroundColor: `${colors.teal}26`, color: colors.teal }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
);
