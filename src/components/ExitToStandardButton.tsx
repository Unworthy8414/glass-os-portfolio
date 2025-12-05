import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useViewMode } from '../store/useViewMode';

export const ExitToStandardButton = () => {
  const { switchToStandard } = useViewMode();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      onClick={switchToStandard}
      className="fixed bottom-4 right-4 z-[1999] group flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
      title="Switch to standard website"
    >
      <LogOut size={14} className="text-white/50 group-hover:text-white/80 transition-colors" />
      <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
        Standard Site
      </span>
    </motion.button>
  );
};
