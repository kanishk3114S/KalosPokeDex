import React from 'react';
import { motion } from 'framer-motion';

/**
 * 3D-styled Mega Evolution DNA Double-Helix Loader
 * Designed for futuristic Suspense boundaries
 */
export const MegaEvolutionLoader = ({ message = 'Synthesizing Holo-Caster Telemetry...' }) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-6 select-none">
      {/* 3D Rotating Mega Evolution Core */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer Pulsing Aura */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#FF3366] blur-2xl"
        />

        {/* Counter-Rotating DNA Helix Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-2 border-dashed border-[#00E5FF] relative flex items-center justify-center"
        >
          <span className="w-3 h-3 rounded-full bg-[#00E5FF] absolute -top-1.5 shadow-[0_0_12px_#00E5FF]" />
          <span className="w-3 h-3 rounded-full bg-[#00E5FF] absolute -bottom-1.5 shadow-[0_0_12px_#00E5FF]" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-2 border-dashed border-[#FF3366] absolute flex items-center justify-center"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] absolute -left-1 shadow-[0_0_12px_#FF3366]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] absolute -right-1 shadow-[0_0_12px_#FF3366]" />
        </motion.div>

        {/* Center Mega Stone Core */}
        <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_20px_#FFFFFF] relative z-10 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#FF3366] animate-ping" />
        </div>
      </div>

      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase text-center"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default MegaEvolutionLoader;
