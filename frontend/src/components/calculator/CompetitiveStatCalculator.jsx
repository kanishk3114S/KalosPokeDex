import React, { useState, useMemo } from 'react';
import { NATURES, calculateAllStats } from '../../utils/statCalculator';
import { Sliders, Sparkles, Zap, RotateCcw } from 'lucide-react';

export const CompetitiveStatCalculator = ({
  baseStats = { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
  pokemonName = '',
  isLight = false
}) => {
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState('adamant');

  const [ivs, setIvs] = useState({
    hp: 31,
    attack: 31,
    defense: 31,
    spAtk: 31,
    spDef: 31,
    speed: 31
  });

  const [evs, setEvs] = useState({
    hp: 4,
    attack: 252,
    defense: 0,
    spAtk: 0,
    spDef: 0,
    speed: 252
  });

  const totalEvs = Object.values(evs).reduce((acc, val) => acc + val, 0);

  const calculated = useMemo(() => {
    return calculateAllStats(baseStats, ivs, evs, level, nature, pokemonName);
  }, [baseStats, ivs, evs, level, nature, pokemonName]);

  const setMaxEvsAttacker = () => {
    setEvs({ hp: 4, attack: 252, defense: 0, spAtk: 0, spDef: 0, speed: 252 });
    setNature('adamant');
  };

  const setMaxEvsSpecial = () => {
    setEvs({ hp: 4, attack: 0, defense: 0, spAtk: 252, spDef: 0, speed: 252 });
    setNature('modest');
  };

  const setMaxEvsBulky = () => {
    setEvs({ hp: 252, attack: 0, defense: 252, spAtk: 0, spDef: 4, speed: 0 });
    setNature('bold');
  };

  const statLabels = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'spAtk', label: 'Sp. Atk' },
    { key: 'spDef', label: 'Sp. Def' },
    { key: 'speed', label: 'Speed' }
  ];

  return (
    <div className="w-full select-none">
      {/* Top Controls: Level & Nature */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase text-gray-400">Battle Level:</span>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              onClick={() => setLevel(50)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                level === 50 ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Lv. 50
            </button>
            <button
              onClick={() => setLevel(100)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                level === 100 ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Lv. 100
            </button>
          </div>
        </div>

        {/* Nature Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase text-gray-400">Nature:</span>
          <select
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF] cursor-pointer"
          >
            {Object.entries(NATURES).map(([key, n]) => (
              <option key={key} value={key} className="bg-[#0F172A] text-white">
                {n.name} {n.up ? `(+${n.up}, -${n.down})` : '(Neutral)'}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={setMaxEvsAttacker}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono font-bold text-[#00E5FF] cursor-pointer"
          >
            Physical Sweeper
          </button>
          <button
            onClick={setMaxEvsSpecial}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono font-bold text-pink-400 cursor-pointer"
          >
            Special Sweeper
          </button>
        </div>
      </div>

      {/* EV Budget Meter */}
      <div className="mb-6 flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400 font-bold uppercase">
          EV Budget: {totalEvs} / 510
        </span>
        <span className={totalEvs > 510 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
          {510 - totalEvs} EVs Remaining
        </span>
      </div>

      {/* 6 Stats Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statLabels.map(({ key, label }) => {
          const calculatedVal = calculated[key];
          const ivVal = ivs[key];
          const evVal = evs[key];
          const baseVal = baseStats[key] || 0;

          return (
            <div key={key} className="p-3.5 rounded-2xl glass border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white tracking-wider">{label}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-mono text-gray-400">Base: {baseVal}</span>
                  <span className="text-base font-mono font-black text-[#00E5FF]">{calculatedVal}</span>
                </div>
              </div>

              {/* IV Slider */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[10px] font-mono text-gray-400">IV: {ivVal}</span>
                <input
                  type="range"
                  min="0"
                  max="31"
                  value={ivVal}
                  onChange={(e) => setIvs({ ...ivs, [key]: parseInt(e.target.value, 10) })}
                  className="flex-1 accent-[#00E5FF] h-1.5 rounded-lg bg-white/10 cursor-pointer"
                />
              </div>

              {/* EV Slider */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[10px] font-mono text-gray-400">EV: {evVal}</span>
                <input
                  type="range"
                  min="0"
                  max="252"
                  step="4"
                  value={evVal}
                  onChange={(e) => {
                    const nextVal = parseInt(e.target.value, 10);
                    const diff = nextVal - evVal;
                    if (totalEvs + diff <= 510) {
                      setEvs({ ...evs, [key]: nextVal });
                    }
                  }}
                  className="flex-1 accent-[#FF3366] h-1.5 rounded-lg bg-white/10 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <span className="text-xs font-mono uppercase text-gray-400 font-bold">
          Calculated Battle Stat Total: <strong className="text-[#00E5FF] text-base">{calculated.total}</strong>
        </span>
      </div>
    </div>
  );
};

export default CompetitiveStatCalculator;
