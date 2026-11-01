import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Trash2, 
  Plus, 
  Cloud, 
  Check, 
  Search, 
  AlertTriangle, 
  ShieldAlert,
  ShieldCheck, 
  X,
  Sparkles,
  Swords,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { TYPE_CONFIG } from '../constants/kalosData';
import { ALL_TYPES, calculateTeamCoverage, getDefenseMultiplier } from '../constants/typeMatchups';
import { pageVariants, modalDialogVariants } from '../constants/animations';

const TeamBuilder = () => {
  const { user, isGuest, openAuthModal } = useAuth();
  const { isShiny } = useTheme();

  const [teamName, setTeamName] = useState(() => {
    return localStorage.getItem('kalosTeamName') || 'Kalos Elite Squad';
  });

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('kalosTeam');
    return saved ? JSON.parse(saved) : Array(6).fill(null);
  });

  const [availablePokemon, setAvailablePokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Move Selector state
  const [activeMovePicker, setActiveMovePicker] = useState(null); // { slotIndex, moveIndex }
  const [moveSearch, setMoveSearch] = useState('');

  // Persist locally
  useEffect(() => {
    localStorage.setItem('kalosTeam', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('kalosTeamName', teamName);
  }, [teamName]);

  // Load pool
  useEffect(() => {
    const fetchPool = async () => {
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
            id: parseInt(idStr, 10),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idStr}.png`
          };
        });

        setAvailablePokemon(mapped);
      } catch (err) {
        console.error('Failed to fetch Pokémon pool:', err);
      }
    };

    fetchPool();
  }, []);

  const openModal = (index) => {
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const selectPokemon = async (p) => {
    setIsModalOpen(false);
    setSearchTerm('');

    const tempTeam = [...team];
    tempTeam[selectedSlotIndex] = {
      ...p,
      loading: true,
      hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0,
      types: [],
      moves: [null, null, null, null],
      availableMoves: []
    };
    setTeam([...tempTeam]);

    try {
      const detailRes = await axios.get(p.url);
      const d = detailRes.data;

      // Extract moves
      const availableMoves = d.moves ? d.moves.map((m) => m.move.name.replace('-', ' ')) : [];

      // Auto-assign top 4 moves if available
      const defaultMoves = availableMoves.slice(0, 4);
      while (defaultMoves.length < 4) defaultMoves.push(null);

      const detailedPokemon = {
        name: p.name,
        id: p.id,
        hp: d.stats?.[0]?.base_stat || 0,
        attack: d.stats?.[1]?.base_stat || 0,
        defense: d.stats?.[2]?.base_stat || 0,
        spAtk: d.stats?.[3]?.base_stat || 0,
        spDef: d.stats?.[4]?.base_stat || 0,
        speed: d.stats?.[5]?.base_stat || 0,
        sprite: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default || p.sprite,
        spriteShiny: d.sprites?.other?.['official-artwork']?.front_shiny || d.sprites?.front_default || p.sprite,
        types: d.types?.map((t) => t.type.name) || [],
        moves: defaultMoves,
        availableMoves
      };

      const finalTeam = [...team];
      finalTeam[selectedSlotIndex] = detailedPokemon;
      setTeam([...finalTeam]);
    } catch (err) {
      console.error('Failed to load Pokémon details for slot:', err);
      const revertTeam = [...team];
      revertTeam[selectedSlotIndex] = null;
      setTeam([...revertTeam]);
    }
  };

  const removePokemon = (index, e) => {
    e.stopPropagation();
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const clearTeam = () => {
    setTeam(Array(6).fill(null));
  };

  const handleCloudSave = () => {
    if (isGuest) {
      openAuthModal('Log in with your Trainer ID to sync teams to your cloud profile.');
      return;
    }
    setSaveStatus('Team synchronized with Kalos Cloud Database!');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  // Move assignment
  const equipMove = (moveName) => {
    if (!activeMovePicker) return;
    const { slotIndex, moveIndex } = activeMovePicker;
    const member = team[slotIndex];
    if (!member) return;

    const newMoves = [...(member.moves || [null, null, null, null])];
    newMoves[moveIndex] = moveName;

    const newTeam = [...team];
    newTeam[slotIndex] = { ...member, moves: newMoves };
    setTeam(newTeam);
    setActiveMovePicker(null);
    setMoveSearch('');
  };

  // Team Analytics
  const validMembers = team.filter(Boolean);
  const totalBaseStats = validMembers.reduce(
    (acc, p) => acc + p.hp + p.attack + p.defense + p.spAtk + p.spDef + p.speed,
    0
  );

  const calcAverage = (statKey) => {
    if (validMembers.length === 0) return 0;
    const sum = validMembers.reduce((acc, p) => acc + (p[statKey] || 0), 0);
    return Math.round(sum / validMembers.length);
  };

  // Full 18-type defensive coverage
  const teamCoverage = useMemo(() => {
    return calculateTeamCoverage(team);
  }, [team]);

  // Tactical Vulnerability Warning Analyzer (Throws alert if >= 3 members share weakness)
  const tacticalWarnings = useMemo(() => {
    if (validMembers.length < 2) return [];
    const alerts = [];

    for (const atkType of ALL_TYPES) {
      let count = 0;
      validMembers.forEach((m) => {
        const mult = getDefenseMultiplier(m.types, atkType);
        if (mult > 1) count++;
      });

      if (count >= 3) {
        alerts.push({
          type: atkType,
          count,
          severity: count >= 4 ? 'critical' : 'warning'
        });
      }
    }
    return alerts;
  }, [validMembers]);

  const displayedPool = availablePokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-20"
    >
      {/* Holo-Caster Header */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Shield size={16} className="text-[#00E5FF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                Tactical Battle Squad Builder
              </span>
            </div>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="text-2xl sm:text-3xl font-black bg-transparent border-b border-dashed border-white/20 text-white focus:outline-none focus:border-[#00E5FF] transition-colors pb-1 uppercase tracking-tight w-full max-w-md"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearTeam}
              disabled={validMembers.length === 0}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-red-500/40 text-gray-300 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer flex items-center gap-2"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>

            <button
              onClick={handleCloudSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Cloud size={14} />
              <span>{isGuest ? 'Cloud Sync (Login)' : 'Save to Cloud'}</span>
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={16} />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Tactical Team Synergy Warning Banner */}
      {tacticalWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 sm:p-5 rounded-3xl bg-red-950/40 border border-red-500/50 shadow-xl shadow-red-500/10"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldAlert size={18} className="text-red-400 shrink-0 animate-pulse" />
            <h4 className="text-sm font-black uppercase tracking-wider text-red-200">
              Tactical Synergy Alert: Shared Team Vulnerabilities Detected
            </h4>
          </div>

          <div className="space-y-2 mt-3">
            {tacticalWarnings.map((w) => {
              const typeConf = TYPE_CONFIG[w.type] || TYPE_CONFIG.normal;
              return (
                <div
                  key={w.type}
                  className="p-3 rounded-xl bg-black/40 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${typeConf.bg}`}>
                      {typeConf.icon} {typeConf.name}
                    </span>
                    <span className="text-red-300 font-bold">
                      {w.count} of {validMembers.length} Pokémon are vulnerable to {typeConf.name}-type moves.
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-gray-300">
                    Recommendation: Incorporate a resistant anchor (e.g. Steel, Fire, or Water).
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 6 Team Roster Slots with 4 Equipped Moves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 mb-10">
        {team.map((member, slotIdx) => (
          <div
            key={slotIdx}
            className="glass rounded-3xl p-4 flex flex-col items-center justify-between border border-white/10 hover:border-[#00E5FF] transition-all relative group select-none min-h-[340px]"
          >
            {member ? (
              <>
                <button
                  type="button"
                  onClick={(e) => removePokemon(slotIdx, e)}
                  title="Remove Specimen"
                  className="absolute top-3 right-3 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-30"
                >
                  <X size={12} />
                </button>

                {/* Specimen Header & Artwork */}
                <div
                  onClick={() => openModal(slotIdx)}
                  className="cursor-pointer flex flex-col items-center w-full"
                >
                  <div className="relative w-20 h-20 mb-2 flex items-center justify-center">
                    <img
                      src={isShiny ? (member.spriteShiny || member.sprite) : member.sprite}
                      alt={member.name}
                      className={`w-full h-full object-contain filter drop-shadow-lg transition-transform ${
                        member.loading ? 'animate-pulse opacity-40' : 'group-hover:scale-110'
                      }`}
                    />
                  </div>

                  <span className="text-xs font-black uppercase tracking-wider text-white truncate w-full text-center">
                    {member.name.replace('-', ' ')}
                  </span>

                  <div className="flex gap-1 mt-1 mb-3">
                    {member.types?.map((t) => (
                      <span
                        key={t}
                        className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-white/10 text-gray-200 border border-white/15"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4 Equipped Moves */}
                <div className="w-full space-y-1.5 mt-auto pt-2 border-t border-white/10">
                  <span className="text-[9px] font-mono uppercase font-bold text-gray-400 block mb-1">
                    Equipped Moves (4):
                  </span>
                  {[0, 1, 2, 3].map((moveIdx) => {
                    const currentMove = member.moves?.[moveIdx];
                    return (
                      <button
                        key={moveIdx}
                        onClick={() => {
                          setActiveMovePicker({ slotIndex: slotIdx, moveIndex: moveIdx });
                          setMoveSearch('');
                        }}
                        className={`w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-left truncate flex items-center justify-between border transition-all cursor-pointer ${
                          currentMove
                            ? 'bg-black/30 border-white/15 text-white hover:border-[#00E5FF]'
                            : 'bg-white/5 border-dashed border-white/10 text-gray-500 hover:text-[#00E5FF] hover:border-[#00E5FF]/40'
                        }`}
                      >
                        <span className="truncate">{currentMove || `+ Move ${moveIdx + 1}`}</span>
                        <Swords size={10} className="text-[#00E5FF] opacity-70 shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div
                onClick={() => openModal(slotIdx)}
                className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500 group-hover:text-[#00E5FF] cursor-pointer py-12"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-600 group-hover:border-[#00E5FF] flex items-center justify-center mb-3 transition-colors">
                  <Plus size={22} />
                </div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest">
                  Squad Slot #{slotIdx + 1}
                </span>
                <span className="text-[9px] text-gray-500 mt-1">Click to assign</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analytics & 18-Type Defense Matrix */}
      {validMembers.length > 0 && (
        <div className="space-y-8">
          {/* Average Stat Distribution */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-base font-black uppercase tracking-wider text-white mb-6 text-center">
              Squad Stat Metrics & Balance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                {[
                  { label: 'Average HP', key: 'hp' },
                  { label: 'Average Attack', key: 'attack' },
                  { label: 'Average Defense', key: 'defense' }
                ].map(({ label, key }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">
                      <span>{label}</span>
                      <span className="text-[#00E5FF] font-mono">{calcAverage(key)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-[#00E5FF] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((calcAverage(key) / 255) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Average Sp. Atk', key: 'spAtk' },
                  { label: 'Average Sp. Def', key: 'spDef' },
                  { label: 'Average Speed', key: 'speed' }
                ].map(({ label, key }) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">
                      <span>{label}</span>
                      <span className="text-[#00E5FF] font-mono">{calcAverage(key)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-[#FF3366] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((calcAverage(key) / 255) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">
                Aggregated Team Base Stat Total (BST)
              </span>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-pink-500 mt-1">
                {totalBaseStats}
              </div>
            </div>
          </div>

          {/* 18-Type Defensive Coverage Matrix */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Full 18-Type Defensive Coverage Analysis
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Green indicates team resistances/immunities; Red indicates shared team weaknesses.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck size={14} /> Resists (&lt;1x)
                </span>
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <AlertTriangle size={14} /> Weaknesses (&gt;1x)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ALL_TYPES.map((typeKey) => {
                const conf = TYPE_CONFIG[typeKey] || TYPE_CONFIG.normal;
                const cov = teamCoverage[typeKey] || { weaknesses: 0, resistances: 0, immunities: 0 };
                const isVulnerable = cov.weaknesses >= 3;

                return (
                  <div
                    key={typeKey}
                    className={`p-3 rounded-2xl glass border transition-all ${
                      isVulnerable
                        ? 'border-red-500/50 bg-red-950/25 ring-1 ring-red-500/30'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{conf.icon}</span>
                      <span className="text-xs font-black uppercase tracking-wider text-white truncate">
                        {conf.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold" title="Team members resisting">
                        +{cov.resistances + cov.immunities}
                      </span>
                      <span className="text-gray-500">/</span>
                      <span className="text-red-400 font-bold" title="Team members weak">
                        -{cov.weaknesses}
                      </span>
                    </div>

                    {cov.immunities > 0 && (
                      <div className="mt-1.5 text-[9px] font-mono text-[#00E5FF] uppercase font-bold text-center bg-[#00E5FF]/10 rounded py-0.5">
                        {cov.immunities} Immune
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Move Picker Modal */}
      {activeMovePicker && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass w-full max-w-xl max-h-[80vh] rounded-3xl p-6 border border-white/20 flex flex-col shadow-2xl bg-[#0F172A]/95">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Swords size={16} className="text-[#00E5FF]" />
                <span>Select Move for {team[activeMovePicker.slotIndex]?.name.toUpperCase()} (Slot #{activeMovePicker.moveIndex + 1})</span>
              </h3>
              <button
                onClick={() => setActiveMovePicker(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-3">
              <input
                type="text"
                placeholder="Filter learnable moves..."
                value={moveSearch}
                onChange={(e) => setMoveSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {(team[activeMovePicker.slotIndex]?.availableMoves || [])
                .filter((m) => m.toLowerCase().includes(moveSearch.toLowerCase().trim()))
                .map((m) => (
                  <button
                    key={m}
                    onClick={() => equipMove(m)}
                    className="w-full p-2.5 rounded-xl glass hover:bg-white/10 hover:border-[#00E5FF] text-left text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between transition-colors cursor-pointer border border-white/5"
                  >
                    <span>{m}</span>
                    <span className="text-[10px] text-[#00E5FF] font-mono">Equip &rarr;</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Specimen Picker Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              variants={modalDialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass w-full max-w-3xl max-h-[85vh] rounded-3xl p-6 border border-white/20 flex flex-col shadow-2xl bg-[#0F172A]/95"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Add Specimen to Slot #{selectedSlotIndex !== null ? selectedSlotIndex + 1 : ''}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Kalos & Mega Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1">
                {displayedPool.map((p) => (
                  <div
                    key={p.name}
                    onClick={() => selectPokemon(p)}
                    className="flex flex-col items-center p-3 rounded-2xl glass hover:border-[#00E5FF] hover:scale-105 cursor-pointer transition-all border border-white/5"
                  >
                    <img src={p.sprite} alt={p.name} className="w-16 h-16 object-contain mb-1 drop-shadow-md" />
                    <span className="text-[10px] font-black uppercase text-center text-gray-200 truncate w-full">
                      {p.name.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamBuilder;
