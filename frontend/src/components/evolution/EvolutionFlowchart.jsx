import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, GitFork } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const EvolutionFlowchart = ({
  chain = [],
  currentName = '',
  isLight = false
}) => {
  const navigate = useNavigate();
  const { isShiny } = useTheme();

  if (!chain || chain.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap w-full py-4">
        {chain.map((node, idx) => {
          const isCurrent = node.name.toLowerCase() === currentName.toLowerCase();
          const imgUrl = isShiny ? (node.shinyArtwork || node.artwork) : node.artwork;

          return (
            <React.Fragment key={`${node.name}-${idx}`}>
              {/* Trigger Connection Badge */}
              {node.condition && (
                <div className="flex flex-col items-center px-1 my-2">
                  <span className="text-[#00E5FF] font-black text-lg mb-1 leading-none">&rarr;</span>
                  <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[9px] font-mono text-[#00E5FF] font-bold uppercase tracking-wider text-center max-w-[120px] shadow-sm">
                    {node.condition}
                  </div>
                </div>
              )}

              {/* Evolution Node Card */}
              <motion.div
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/pokemon/${node.name}`)}
                className={`flex flex-col items-center p-3 sm:p-4 rounded-2xl glass border cursor-pointer transition-all duration-300 relative ${
                  isCurrent
                    ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 bg-[#00E5FF]/10 shadow-[0_0_20px_rgba(0,229,255,0.35)]'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 px-2 py-0.2 rounded-full bg-[#00E5FF] text-black text-[8px] font-mono font-black uppercase tracking-wider">
                    CURRENT
                  </span>
                )}

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
                  <img
                    src={imgUrl}
                    alt={node.name}
                    className="w-full h-full object-contain filter drop-shadow-md relative z-10"
                    loading="lazy"
                  />
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-white text-center">
                  {node.name.replace('-', ' ')}
                </span>
                <span className="text-[9px] font-mono text-gray-400 mt-0.5">
                  #{String(node.id).padStart(4, '0')}
                </span>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default EvolutionFlowchart;
