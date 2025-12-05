import { PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import { isAGODigitalData } from '../types';
import type { SectionProps } from './types';

export const DesignSection = ({ data, isTimeMgmt }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <SectionHeader number="04" title={isTimeMgmt ? 'Design' : 'Recommendations'} color={colors.pink} icon={PenTool} />

    <div className="space-y-8">
      <div>
        <motion.h3
          className="text-xl font-semibold mb-3 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Design Recommendations
        </motion.h3>
        <motion.p
          className="text-white/60 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Translating insights into actionable features.
        </motion.p>
      </div>

      <div className="space-y-6">
        {data.recommendations.map((rec, i) => (
          <motion.div
            key={i}
            className="flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${rec.color}33`, color: rec.color }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <rec.icon size={20} />
            </motion.div>
            <div>
              <h4 className="font-medium text-white/90 mb-1">{rec.title}</h4>
              {rec.desc ? (
                <p className="text-sm text-white/60">{rec.desc}</p>
              ) : rec.items ? (
                <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
                  {rec.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Wins (AGO only) */}
      {!isTimeMgmt && isAGODigitalData(data) && (
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/80 mb-4">Quick Wins (High Impact, Low Effort)</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {data.quickWins.map((win, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${colors.green}1A`, border: `1px solid ${colors.green}33` }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <div className="font-medium mb-1 text-sm" style={{ color: colors.green }}>{win.title}</div>
                <p className="text-xs text-white/50">{win.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  </motion.section>
);
