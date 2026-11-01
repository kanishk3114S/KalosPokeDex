import React from 'react';
import { motion } from 'framer-motion';

/**
 * 3D-styled Mega Evolution DNA Double-Helix Loader
 * Designed for futuristic Suspense boundaries
 */
export const MegaEvolutionLoader = ({ message = 'Synthesizing Holo-Caster Telemetry...' }) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-5 select-none">
      {/* Sleek Cybernetic Scanning Bar */}
      <div className="w-56 h-1.5 bg-black/40 border border-white/10 rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_16px_#00E5FF]"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase text-center"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default MegaEvolutionLoader;
