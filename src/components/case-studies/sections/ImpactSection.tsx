import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import { isTimeManagementData, isAGODigitalData } from '../types';
import type { SectionProps } from './types';

export const ImpactSection = ({ data, isTimeMgmt }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <SectionHeader number="05" title="Impact" color={colors.burnt} icon={TrendingUp} />

    <div className="space-y-8">
      {/* Research Impact */}
      <motion.div
        className="bg-white/5 rounded-xl p-6 border border-white/10 relative overflow-hidden"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        {/* Animated success indicator */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 size={24} style={{ color: colors.verdigris }} />
        </motion.div>

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white/90">
          <CheckCircle2 size={18} style={{ color: colors.verdigris }} />
          {isTimeMgmt ? 'Research Impact' : 'Validated Hypotheses'}
        </h3>
        {isTimeMgmt && isTimeManagementData(data) ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white/60 text-sm uppercase mb-1">Validated Hypothesis?</h4>
              <p className="text-white/80">
                <span className="font-medium" style={{ color: colors.verdigris }}>Yes, with a caveat.</span> Users want customization, but they need <span style={{ color: colors.charcoal }}>smart defaults first</span>.
              </p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <h4 className="font-medium text-white/60 text-sm uppercase mb-2">Design Principles Uncovered</h4>
              <ul className="space-y-1 text-sm text-white/60">
                {data.designPrinciples.map((principle, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {i + 1}. {principle}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        ) : isAGODigitalData(data) ? (
          <div className="space-y-2">
            {data.validatedHypotheses.map((hyp, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-sm text-white/70"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                >
                  <CheckCircle2 size={14} style={{ color: colors.verdigris }} />
                </motion.div>
                {hyp}
              </motion.div>
            ))}
          </div>
        ) : null}
      </motion.div>

      {/* Business Value */}
      <div>
        <motion.h3
          className="text-lg font-semibold mb-4 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Business Value
        </motion.h3>
        <div className={`grid gap-4 ${isTimeMgmt ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {isTimeMgmt && isTimeManagementData(data) ? (
            data.impact.map((item, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-xl"
                style={{ backgroundColor: `${colors.verdigris}1A`, border: `1px solid ${colors.verdigris}33` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="font-medium mb-1" style={{ color: colors.verdigris }}>{item.title}</div>
                <p className="text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))
          ) : isAGODigitalData(data) ? (
            data.businessValue.map((item, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-xl"
                style={{ backgroundColor: `${item.color}1A`, border: `1px solid ${item.color}33` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="font-medium mb-2" style={{ color: item.color }}>{item.title}</div>
                <ul className="text-sm text-white/60 space-y-1 list-disc list-inside">
                  {item.items?.map((li, j) => <li key={j}>{li}</li>)}
                </ul>
              </motion.div>
            ))
          ) : null}
        </div>
      </div>

      {/* Methodology Section */}
      <div>
        <motion.h3
          className="text-xl font-semibold mb-4 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Methodology
        </motion.h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* What Worked Well Card */}
          <motion.div
            className="bg-white/5 p-5 rounded-xl border border-white/10"
            whileHover={{ borderColor: `${colors.verdigris}66` }}
          >
            <div className="text-sm font-semibold uppercase mb-3" style={{ color: colors.verdigris }}>What Worked Well</div>
            <ul className="text-sm text-white/60 space-y-2">
              {data.methodology.worked.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: colors.verdigris }} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Challenges + Solutions Table Card */}
          <motion.div
            className="bg-white/5 p-5 rounded-xl border border-white/10"
            whileHover={{ borderColor: `${colors.sandy}66` }}
          >
            <div className="text-sm font-semibold uppercase mb-3" style={{ color: colors.sandy }}>Challenges + Solutions</div>
            {typeof data.methodology.challenges === 'string' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase text-white/40 border-b border-white/10 pb-2">
                  <span>Challenge</span>
                  <span>Solution</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-white/60">
                  <span>{data.methodology.challenges}</span>
                  <span>{isTimeManagementData(data) && data.methodology.solution ? data.methodology.solution : '-'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase text-white/40 border-b border-white/10 pb-2">
                  <span>Challenge</span>
                  <span>Solution</span>
                </div>
                {data.methodology.challenges.map((item, i) => {
                  const parts = item.split(':');
                  const challenge = parts[0];
                  const solution = parts.length > 1 ? parts.slice(1).join(':').trim() : '-';
                  return (
                    <motion.div
                      key={i}
                      className="grid grid-cols-2 gap-2 text-sm text-white/60 border-b border-white/5 pb-2 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span>{challenge}</span>
                      <span>{solution}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* What I'd Do Different Card */}
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10 mb-4"
          whileHover={{ borderColor: `${colors.jasmine}66` }}
        >
          <div className="text-sm font-semibold uppercase mb-3" style={{ color: colors.jasmine }}>What I'd Do Different</div>
          <ul className="text-sm text-white/60 space-y-2">
            {data.methodology.nextSteps.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: `${colors.jasmine}33`, color: colors.jasmine }}>
                  {i + 1}
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Next Steps Card */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ backgroundColor: `${colors.charcoal}1A`, border: `1px solid ${colors.charcoal}33` }}
          whileHover={{ borderColor: `${colors.charcoal}66` }}
        >
          <div className="text-sm font-semibold uppercase mb-3" style={{ color: colors.charcoal }}>Next Steps</div>
          <ul className="text-sm text-white/60 space-y-2">
            {data.methodology.nextSteps.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-white/40">•</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

    </div>
  </motion.section>
);
