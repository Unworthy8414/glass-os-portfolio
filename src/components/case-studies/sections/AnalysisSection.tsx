import { Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader, JourneyMap, PersonaCard } from '../components';
import { isTimeManagementData, isAGODigitalData } from '../types';
import type { SectionProps } from './types';

export const AnalysisSection = ({ data, isTimeMgmt }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <SectionHeader number="03" title={isTimeMgmt ? 'Analysis' : 'Findings'} color={colors.yellow} icon={Lightbulb} />

    <div className="space-y-8">
      {/* Key Findings */}
      <div>
        <motion.h3
          className="text-xl font-semibold mb-4 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Key Findings
        </motion.h3>
        <div className="grid md:grid-cols-2 gap-4">
          {isTimeMgmt && isTimeManagementData(data) ? (
            data.keyFindings.map((finding, i) => (
              <motion.div
                key={i}
                className="bg-white/5 p-5 rounded-xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: `${colors.blue}66`, y: -2 }}
              >
                <h4 className="font-medium text-blue-400 mb-2">{i + 1}. {finding.title}</h4>
                <p className="text-sm text-white/60">{finding.desc}</p>
              </motion.div>
            ))
          ) : isAGODigitalData(data) ? (
            data.keyFindings.map((finding, i) => (
              <motion.div
                key={i}
                className="bg-white/5 p-5 rounded-xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: `${finding.color}66`, y: -2 }}
              >
                <h4 className="font-medium mb-2" style={{ color: finding.color }}>{i + 1}. {finding.title}</h4>
                <ul className="text-sm text-white/60 space-y-1 list-disc list-inside mb-2">
                  {finding.items?.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                {finding.quote && (
                  <p className="text-xs italic text-white/40 border-l-2 pl-2" style={{ borderColor: finding.color }}>
                    {finding.quote}
                  </p>
                )}
              </motion.div>
            ))
          ) : null}
        </div>
      </div>

      {/* Persona */}
      <div>
        <motion.h3
          className="text-xl font-semibold mb-4 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          User Persona
        </motion.h3>
        <PersonaCard persona={data.persona} />
      </div>

      {/* Journey Map */}
      <div>
        <motion.h3
          className="text-xl font-semibold mb-4 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {isTimeMgmt ? 'Daily Journey Map' : 'User Journey Map: AGO Purchase Path'}
        </motion.h3>
        <JourneyMap
          steps={data.journeyMap}
          color={isTimeMgmt ? colors.blue : colors.pink}
        />
      </div>

      {/* Cognitive Dissonance (AGO only) */}
      {!isTimeMgmt && isAGODigitalData(data) && (
        <motion.div
          className="p-5 rounded-xl border relative overflow-hidden"
          style={{ backgroundColor: `${colors.teal}1A`, borderColor: `${colors.teal}33` }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ borderColor: `${colors.teal}66` }}
        >
          <motion.div
            className="absolute top-2 right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={16} style={{ color: `${colors.teal}80` }} />
          </motion.div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: colors.teal }}>
            <Lightbulb size={14} /> Cognitive Dissonance Discovery
          </h4>
          <p className="text-sm text-white/60">{data.cognitiveDissonance}</p>
        </motion.div>
      )}
    </div>
  </motion.section>
);
