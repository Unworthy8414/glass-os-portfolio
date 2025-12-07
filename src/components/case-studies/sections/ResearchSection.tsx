import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { SectionHeader } from '../components';
import { isTimeManagementData, isAGODigitalData } from '../types';
import { TimeManagementResearch, AGODigitalResearch } from './research';
import type { SectionProps } from './types';

export const ResearchSection = ({ data, isTimeMgmt }: SectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <SectionHeader number="02" title="Research" color={colors.verdigris} icon={Search} />

    {isTimeMgmt && isTimeManagementData(data) ? (
      <TimeManagementResearch data={data} />
    ) : isAGODigitalData(data) ? (
      <AGODigitalResearch data={data} />
    ) : null}
  </motion.section>
);
