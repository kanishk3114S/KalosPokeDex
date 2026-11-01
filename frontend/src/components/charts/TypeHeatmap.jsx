import React from 'react';
import { ALL_TYPES, getDefenseMultiplier } from '../../constants/typeMatchups';
import { TYPE_CONFIG } from '../../constants/kalosData';

export const TypeHeatmap = ({ types = [], isLight = false }) => {
  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {ALL_TYPES.map((attackType) => {
          const mult = getDefenseMultiplier(types, attackType);
          const conf = TYPE_CONFIG[attackType] || TYPE_CONFIG.normal;

          let badgeStyle = 'bg-white/5 text-gray-300 border-white/10';
          let label = `${mult}x`;

          if (mult === 0) {
            badgeStyle = 'bg-black/60 text-purple-300 border-purple-500/50 shadow-sm';
            label = '0x IMMUNE';
          } else if (mult === 4) {
            badgeStyle = 'bg-red-600/30 text-red-200 border-red-500 shadow-md shadow-red-500/20';
            label = '4x CRITICAL';
          } else if (mult === 2) {
            badgeStyle = 'bg-orange-500/25 text-orange-200 border-orange-500/50';
            label = '2x WEAK';
          } else if (mult === 0.5) {
            badgeStyle = 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40';
            label = '½x RESIST';
          } else if (mult === 0.25) {
            badgeStyle = 'bg-emerald-600/35 text-emerald-100 border-emerald-400 shadow-sm';
            label = '¼x RESIST';
          }

          return (
            <div
              key={attackType}
              className={`p-2.5 rounded-2xl glass border flex flex-col items-center justify-between transition-all duration-200 ${badgeStyle}`}
            >
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-90">
                <span>{conf.icon}</span>
                <span className="truncate">{conf.name}</span>
              </div>

              <div className="text-[11px] font-mono font-black tracking-wider">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TypeHeatmap;
