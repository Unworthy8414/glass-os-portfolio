import { Users, AlertTriangle, Target, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../../colors';
import { AnimatedTag, JourneyMap } from '../../components';
import type { AGODigitalData } from '../../types';

export const AGODigitalResearch = ({ data }: { data: AGODigitalData }) => (
  <div className="space-y-12">
    {/* Phase 1: Competitive Analysis */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.verdigris}33`, color: colors.verdigris }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 1
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">Competitive Analysis & Heuristic Evaluation</h3>
      </div>
      <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Evaluate AGO's position in the market and conduct a heuristic evaluation across the entire site.</p>

      <motion.div
        className="bg-white/5 p-5 rounded-xl border border-white/10 mb-4"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><Users size={14} style={{ color: colors.verdigris }} /> Competitors Analyzed</h4>
        <div className="flex flex-wrap gap-2">
          {data.competitors.map((competitor, i) => (
            competitor.url ? (
              <motion.a
                key={competitor.name}
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08, y: -3 }}
                className="px-3 py-1.5 rounded text-sm cursor-pointer transition-all"
                style={{ backgroundColor: `${colors.verdigris}26`, color: colors.verdigris }}
              >
                {competitor.name} ↗
              </motion.a>
            ) : (
              <AnimatedTag key={competitor.name} label={competitor.name} color={colors.verdigris} delay={i * 0.1} />
            )
          ))}
        </div>
      </motion.div>

      <motion.div
        className="bg-white/5 p-5 rounded-xl border border-white/10"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h4 className="font-medium text-white/70 mb-4 flex items-center gap-2 text-sm"><AlertTriangle size={14} style={{ color: colors.orange }} /> Initial Discovery: Site-Wide Issues</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {data.siteIssues.map((issue, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${issue.color}1A`, border: `1px solid ${issue.color}33` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="font-medium mb-1 text-sm" style={{ color: issue.color }}>{issue.title}</div>
              <p className="text-xs text-white/50">{issue.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>

    <div className="border-t border-white/10" />

    {/* Phase 2: User Interviews */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.charcoal}33`, color: colors.charcoal }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 2
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">User Interviews</h3>
      </div>
      <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Identify and understand users' mental models and expectations within the purchase journey.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Participants', value: '6', sub: '1-hour in-depth interviews' },
          { label: 'Focus', value: 'Purchase Journey', sub: 'Cart, checkout, booking' },
          { label: 'Synthesis', value: 'Affinity Mapping', sub: 'Thematic analysis' },
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

      <motion.div
        className="bg-white/5 p-5 rounded-xl border border-white/10"
        whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
      >
        <h4 className="font-medium text-white/70 mb-3 text-sm">Hypotheses Tested</h4>
        <div className="grid md:grid-cols-2 gap-2">
          {data.hypothesesTested.map((hyp, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2 text-sm text-white/60"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.span
                className="text-xs font-medium px-1.5 py-0.5 rounded shrink-0"
                style={{ backgroundColor: `${colors.charcoal}33`, color: colors.charcoal }}
                whileHover={{ scale: 1.1 }}
              >
                {i + 1}
              </motion.span>
              {hyp}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>

    <div className="border-t border-white/10" />

    {/* Phase 3: Ethnographic Research */}
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="px-2 py-0.5 rounded text-xs font-medium uppercase"
          style={{ backgroundColor: `${colors.sandy}33`, color: colors.sandy }}
          whileHover={{ scale: 1.05 }}
        >
          Phase 3
        </motion.span>
        <h3 className="text-xl font-semibold text-white/90">Ethnographic Research</h3>
      </div>
      <p className="text-white/60"><strong className="text-white/80">Goal:</strong> Understand the disconnect between physical and digital purchasing experiences.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="bg-white/5 p-5 rounded-xl border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><MapPin size={14} style={{ color: colors.sandy }} /> Observation Focus Areas</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.observationAreas.map((tag, i) => (
              <motion.div
                key={tag}
                className="p-2 rounded text-sm text-center font-medium"
                style={{ backgroundColor: `${colors.sandy}26`, color: colors.sandy }}
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
          <h4 className="font-medium text-white/70 mb-3 flex items-center gap-2 text-sm"><Target size={14} style={{ color: colors.verdigris }} /> Key Finding</h4>
          <p className="text-sm text-white/60 italic">
            "Significant differences between the smooth physical ticket purchasing experience and the frustrating digital experience, creating misaligned mental models."
          </p>
        </motion.div>
      </div>

      {/* User Journey Map - moved here from Analysis */}
      <div className="mt-6">
        <motion.h4
          className="font-medium text-white/70 mb-4 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          User Journey Map: AGO Purchase Path
        </motion.h4>
        <JourneyMap steps={data.journeyMap} color={colors.burnt} />
      </div>
    </motion.div>
  </div>
);
