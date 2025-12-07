import { PenTool, Monitor, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import type { SectionProps } from './types';
import { useViewMode } from '../../../store/useViewMode';

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
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  );
};
