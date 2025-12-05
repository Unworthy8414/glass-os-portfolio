import { ChevronLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import type { CTASectionProps } from './types';

export const CTASection = ({ data, isTimeMgmt, onBack }: CTASectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center py-12 border-t border-white/10 relative"
  >
    {/* Animated background gradient */}
    <motion.div
      className="absolute inset-0 opacity-20"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${isTimeMgmt ? colors.blue : colors.pink}40 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{ duration: 4, repeat: Infinity }}
    />

    <motion.h2
      className="text-2xl font-semibold mb-4 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      Want the full details?
    </motion.h2>
    <motion.p
      className="text-white/60 mb-6 relative z-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      Download the complete case study PDF with all research data and appendices.
    </motion.p>
    <div className="flex flex-wrap justify-center gap-4 relative z-10">
      <motion.a
        href={data.pdfPath}
        target="_blank"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ExternalLink size={18} />
        View Full Report
      </motion.a>
      <motion.button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={18} />
        Back to Portfolio
      </motion.button>
    </div>
  </motion.section>
);
