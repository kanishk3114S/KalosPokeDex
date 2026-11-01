import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GitCompare, Sparkles, Plus, X, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TYPE_CONFIG } from '../constants/kalosData';
import { ALL_TYPES, getDefenseMultiplier } from '../constants/typeMatchups';
import { pageVariants, statBarVariants } from '../constants/animations';

const PokemonCompare = () => {
  const { isShiny } = useTheme();
  const [pool, setPool] = useState([]);
  const [loadingPool, setLoadingPool] = useState(true);
  
  // Selected Pokémon (Slots 1 and 2)
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [activeSlotModal, setActiveSlotModal] = useState(null);
  const [modalSearch, setModalSearch] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch Pokemon list for selection
  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const [kalosRes, megaRes] = await Promise.all([
          axios.get('https://pokeapi.co/api/v2/pokemon?limit=72&offset=649'),
          axios.get('https://pokeapi.co/api/v2/pokemon?limit=1500')
        ]);

        const kalosList = kalosRes.data.results;
        const megaList = megaRes.data.results.filter((p) => p.name.includes('-mega'));
        const combined = [
          ...kalosList,
          { name: 'greninja-ash', url: 'https://pokeapi.co/api/v2/pokemon/10116/' },
          ...megaList
        ];

        const mapped = combined.map((p) => {
          const idStr = p.url.split('/').filter(Boolean).pop();
          return {
            name: p.name,
            url: p.url,
            id: idStr,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idStr}.png`
          };
        });

        setPool(mapped);

        // Pre-select Greninja and Talonflame as default comparison
        loadPokemonDetails('greninja', 1);
        loadPokemonDetails('talonflame', 2);
      } catch (err) {
        console.error('Failed to load Pokémon pool:', err);
      } finally {
        setLoadingPool(false);
      }
    };

    fetchAvailable();
  }, []);

  const loadPokemonDetails = async (nameOrId, targetSlot) => {
    try {
      setLoadingDetails(true);
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
      const d = res.data;

      const pData = {
        name: d.name,
        id: d.id,
        types: d.types.map((t) => t.type.name),
        height: d.height / 10, // meters
        weight: d.weight / 10, // kg
        base_experience: d.base_experience,
        abilities: d.abilities.map((a) => ({
          name: a.ability.name,
          is_hidden: a.is_hidden
        })),
        stats: {
          hp: d.stats[0].base_stat,
          attack: d.stats[1].base_stat,
          defense: d.stats[2].base_stat,
          spAtk: d.stats[3].base_stat,
          spDef: d.stats[4].base_stat,
          speed: d.stats[5].base_stat,
          total: d.stats.reduce((acc, s) => acc + s.base_stat, 0)
        },
        artwork: d.sprites.other?.['official-artwork']?.front_default || d.sprites.front_default,
        artworkShiny: d.sprites.other?.['official-artwork']?.front_shiny || d.sprites.other?.['official-artwork']?.front_default
      };

      if (targetSlot === 1) setSlot1(pData);
      else setSlot2(pData);
    } catch (err) {
      console.error('Failed to load Pokémon details:', err);
    } finally {
      setLoadingDetails(false);
      setActiveSlotModal(null);
    }
  };

  const statKeys = [
    { key: 'hp', label: 'HP', max: 255 },
    { key: 'attack', label: 'Attack', max: 255 },
    { key: 'defense', label: 'Defense', max: 255 },
    { key: 'spAtk', label: 'Sp. Atk', max: 255 },
    { key: 'spDef', label: 'Sp. Def', max: 255 },
    { key: 'speed', label: 'Speed', max: 255 },
    { key: 'total', label: 'Total BST', max: 780 }
  ];

  const filteredPool = pool.filter((p) => p.name.toLowerCase().includes(modalSearch.toLowerCase().trim()));

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-20"
    >
      {/* Holo-Caster Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-2 mb-2 text-[#00E5FF] font-mono text-xs font-bold uppercase tracking-widest">
          <GitCompare size={16} />
          <span>Combat Intelligence System</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
          Specimen Telemetry Comparison
        </h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto tracking-wide">
          Analyze base battle metrics, ability classifications, and offensive/defensive type dynamics side-by-side in real-time.
        </p>
      </div>

      {/* Main Comparison Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
        {/* Slot 1 */}
        <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col items-center relative overflow-hidden shadow-xl">
          <button
            onClick={() => { setModalSearch(''); setActiveSlotModal(1); }}
            className="w-full py-2 mb-4 rounded-xl border border-dashed border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <GitCompare size={14} />
            <span>Select Specimen A</span>
          </button>

          {slot1 ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#00E5FF]/10 blur-2xl pointer-events-none" />
                <img
                  src={isShiny ? slot1.artworkShiny : slot1.artwork}
                  alt={slot1.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl relative z-10 hover:scale-105 transition-transform"
                />
              </div>

              <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider">
                #{String(slot1.id).padStart(4, '0')}
              </span>
              <h3 className="text-2xl font-black uppercase text-white tracking-wide mb-3">
                {slot1.name.replace('-', ' ')}
              </h3>

              {/* Type Badges */}
              <div className="flex gap-2 mb-4">
                {slot1.types.map((t) => {
                  const conf = TYPE_CONFIG[t] || TYPE_CONFIG.normal;
                  return (
                    <span
                      key={t}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase ${conf.bg}`}
                    >
                      <span>{conf.icon}</span>
                      <span>{conf.name}</span>
                    </span>
                  );
                })}
              </div>

              {/* Physical Metrics */}
              <div className="grid grid-cols-3 gap-2 w-full text-center text-xs py-3 border-y border-white/10 mb-4 bg-black/20 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">HEIGHT</span>
                  <span className="font-bold text-white">{slot1.height} m</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">WEIGHT</span>
                  <span className="font-bold text-white">{slot1.weight} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">BASE EXP</span>
                  <span className="font-bold text-white">{slot1.base_experience}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 font-mono text-xs">
              No Pokémon Selected
            </div>
          )}
        </div>

        {/* Slot 2 */}
        <div className="glass rounded-3xl p-6 border border-white/10 flex flex-col items-center relative overflow-hidden shadow-xl">
          <button
            onClick={() => { setModalSearch(''); setActiveSlotModal(2); }}
            className="w-full py-2 mb-4 rounded-xl border border-dashed border-[#FF3366]/40 text-[#FF3366] hover:bg-[#FF3366]/10 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <GitCompare size={14} />
            <span>Select Specimen B</span>
          </button>

          {slot2 ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#FF3366]/10 blur-2xl pointer-events-none" />
                <img
                  src={isShiny ? slot2.artworkShiny : slot2.artwork}
                  alt={slot2.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl relative z-10 hover:scale-105 transition-transform"
                />
              </div>

              <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider">
                #{String(slot2.id).padStart(4, '0')}
              </span>
              <h3 className="text-2xl font-black uppercase text-white tracking-wide mb-3">
                {slot2.name.replace('-', ' ')}
              </h3>

              {/* Type Badges */}
              <div className="flex gap-2 mb-4">
                {slot2.types.map((t) => {
                  const conf = TYPE_CONFIG[t] || TYPE_CONFIG.normal;
                  return (
                    <span
                      key={t}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold uppercase ${conf.bg}`}
                    >
                      <span>{conf.icon}</span>
                      <span>{conf.name}</span>
                    </span>
                  );
                })}
              </div>

              {/* Physical Metrics */}
              <div className="grid grid-cols-3 gap-2 w-full text-center text-xs py-3 border-y border-white/10 mb-4 bg-black/20 rounded-xl">
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">HEIGHT</span>
                  <span className="font-bold text-white">{slot2.height} m</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">WEIGHT</span>
                  <span className="font-bold text-white">{slot2.weight} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">BASE EXP</span>
                  <span className="font-bold text-white">{slot2.base_experience}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 font-mono text-xs">
              No Pokémon Selected
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Combat Stats Analytics */}
      {slot1 && slot2 && (
        <div className="glass rounded-3xl p-6 sm:p-8 mb-10 border border-white/10">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Direct Stat Matrix & Delta
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Highlighted bars indicate superior metric
            </span>
          </div>

          <div className="space-y-5 max-w-4xl mx-auto">
            {statKeys.map(({ key, label, max }) => {
              const val1 = slot1.stats[key];
              const val2 = slot2.stats[key];
              const isSlot1Higher = val1 > val2;
              const isSlot2Higher = val2 > val1;
              const isTie = val1 === val2;

              return (
                <div key={key} className="p-3 rounded-2xl bg-black/20 border border-white/5">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2">
                    <span className={`font-mono text-sm ${isSlot1Higher ? 'text-[#00E5FF]' : 'text-gray-400'}`}>
                      {val1}
                    </span>
                    <span className="text-gray-300 font-bold tracking-widest">{label}</span>
                    <span className={`font-mono text-sm ${isSlot2Higher ? 'text-[#FF3366]' : 'text-gray-400'}`}>
                      {val2}
                    </span>
                  </div>

                  {/* Dual comparative progress bar */}
                  <div className="grid grid-cols-2 gap-2 h-2.5">
                    {/* Left Slot 1 bar (mirrored towards center) */}
                    <div className="w-full bg-white/10 rounded-full h-2.5 flex justify-end overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((val1 / max) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          isSlot1Higher ? 'bg-gradient-to-l from-[#00E5FF] to-blue-600 shadow-[0_0_10px_#00E5FF]' : 'bg-gray-500'
                        }`}
                      />
                    </div>

                    {/* Right Slot 2 bar */}
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((val2 / max) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          isSlot2Higher ? 'bg-gradient-to-r from-[#FF3366] to-pink-600 shadow-[0_0_10px_#FF3366]' : 'bg-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Defensive Type Matchup Vulnerability Table */}
      {slot1 && slot2 && (
        <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
          <div className="pb-4 mb-6 border-b border-white/10">
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Elemental Defense Telemetry (Incoming Attack Matchups)
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Shows damage taken from incoming attacks. Green (&lt;1x) is resistant, Red (&gt;1x) is weak.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ALL_TYPES.map((atkType) => {
              const mult1 = getDefenseMultiplier(slot1.types, atkType);
              const mult2 = getDefenseMultiplier(slot2.types, atkType);
              const conf = TYPE_CONFIG[atkType] || TYPE_CONFIG.normal;

              const getBadgeColor = (mult) => {
                if (mult === 0) return 'bg-gray-800 text-gray-400 border-gray-600';
                if (mult >= 2) return 'bg-red-500/20 text-red-300 border-red-500/40';
                if (mult < 1) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                return 'bg-white/5 text-gray-300 border-white/10';
              };

              return (
                <div key={atkType} className="p-3 rounded-2xl bg-black/25 border border-white/5 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-2">
                    <span>{conf.icon}</span>
                    <span>{conf.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-xs font-mono font-bold">
                    <div className={`py-1 rounded border ${getBadgeColor(mult1)}`}>
                      {mult1}x
                    </div>
                    <div className={`py-1 rounded border ${getBadgeColor(mult2)}`}>
                      {mult2}x
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selection Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 border border-white/20 flex flex-col shadow-2xl bg-[#0F172A]/90">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Select Specimen for Slot {activeSlotModal}
              </h3>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-3">
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1">
              {filteredPool.map((p) => (
                <div
                  key={p.name}
                  onClick={() => loadPokemonDetails(p.name, activeSlotModal)}
                  className="flex flex-col items-center p-3 rounded-2xl glass hover:border-[#00E5FF] cursor-pointer transition-all hover:scale-105"
                >
                  <img src={p.sprite} alt={p.name} className="w-16 h-16 object-contain mb-1 drop-shadow-md" />
                  <span className="text-[10px] font-black uppercase text-center text-gray-200 truncate w-full">
                    {p.name.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PokemonCompare;
