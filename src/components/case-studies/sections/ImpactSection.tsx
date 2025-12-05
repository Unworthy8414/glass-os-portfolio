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
    <SectionHeader number="05" title="Impact" color={colors.green} icon={TrendingUp} />

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
          <CheckCircle2 size={24} style={{ color: colors.green }} />
        </motion.div>

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white/90">
          <CheckCircle2 size={18} style={{ color: colors.green }} />
          {isTimeMgmt ? 'Research Impact' : 'Validated Hypotheses'}
        </h3>
        {isTimeMgmt && isTimeManagementData(data) ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white/60 text-sm uppercase mb-1">Validated Hypothesis?</h4>
              <p className="text-white/80">
                <span className="font-medium" style={{ color: colors.green }}>Yes, with a caveat.</span> Users want customization, but they need <span style={{ color: colors.blue }}>smart defaults first</span>.
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
                  <CheckCircle2 size={14} style={{ color: colors.green }} />
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
                style={{ backgroundColor: `${colors.green}1A`, border: `1px solid ${colors.green}33` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="font-medium mb-1" style={{ color: colors.green }}>{item.title}</div>
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

      {/* Methodology & Next Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <motion.h4
            className="font-medium mb-3 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Methodology
          </motion.h4>
          <div className="space-y-3">
            <motion.div
              className="bg-white/5 p-4 rounded-xl border border-white/10"
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-xs font-medium uppercase mb-2" style={{ color: colors.green }}>What Worked Well</div>
              <ul className="text-sm text-white/60 list-disc list-inside space-y-1">
                {data.methodology.worked.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="bg-white/5 p-4 rounded-xl border border-white/10"
              whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <div className="text-xs font-medium uppercase mb-2" style={{ color: colors.orange }}>Challenges</div>
              {typeof data.methodology.challenges === 'string' ? (
                <>
                  <p className="text-sm text-white/60"><strong className="text-white/70">Challenge:</strong> {data.methodology.challenges}</p>
                  {isTimeManagementData(data) && data.methodology.solution && (
                    <p className="text-sm text-white/60"><strong className="text-white/70">Solution:</strong> {data.methodology.solution}</p>
                  )}
                </>
              ) : (
                <ul className="text-sm text-white/60 list-disc list-inside space-y-1">
                  {data.methodology.challenges.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
        <div>
          <motion.h4
            className="font-medium mb-3 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Next Steps
          </motion.h4>
          <motion.div
            className="bg-white/5 p-4 rounded-xl border border-white/10"
            whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div className="text-xs font-medium text-white/40 uppercase mb-2">Recommended Actions</div>
            <ol className="text-sm text-white/60 list-decimal list-inside space-y-1">
              {data.methodology.nextSteps.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>

      {/* Quote */}
      <motion.div
        className="text-center pt-4 text-white/30 text-sm italic"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        "This case study demonstrates my ability to design and execute rigorous UX research, synthesize complex data, and deliver recommendations that balance user needs with business objectives."
      </motion.div>
    </div>
  </motion.section>
);
