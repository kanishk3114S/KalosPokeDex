import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Shield, 
  Swords, 
  Heart, 
  Zap, 
  GitCommit, 
  Dna, 
  Info, 
  ChevronRight, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TYPE_CONFIG, ASH_KALOS_POKEMON } from '../constants/kalosData';
import { ALL_TYPES, getDefenseMultiplier } from '../constants/typeMatchups';
import { pageVariants, statBarVariants } from '../constants/animations';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isShiny } = useTheme();

  const [data, setData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [trivia, setTrivia] = useState('');
  const [genera, setGenera] = useState('');
  const [evolutionTree, setEvolutionTree] = useState([]);
  const [abilityDetails, setAbilityDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMoveTab, setActiveMoveTab] = useState('level-up'); // 'level-up', 'machine', 'egg', 'tutor'
  const [moveSearch, setMoveSearch] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Evolution chain conditions parser
  const parseEvoTrigger = (details) => {
    if (!details || details.length === 0) return 'Base';
    const d = details[0];
    const parts = [];
    if (d.min_level) parts.push(`Level ${d.min_level}`);
    if (d.item) parts.push(`Use ${d.item.name.replace('-', ' ')}`);
    if (d.held_item) parts.push(`Hold ${d.held_item.name.replace('-', ' ')}`);
    if (d.trigger?.name === 'trade') parts.push('Trade');
    if (d.min_happiness) parts.push(`Friendship (220+)`);
    if (d.min_affection) parts.push(`Affection (2+ hearts)`);
    if (d.known_move) parts.push(`Knows ${d.known_move.name.replace('-', ' ')}`);
    if (d.time_of_day) parts.push(`${d.time_of_day} time`);
    if (d.needs_overworld_rain) parts.push('During Rain');
    if (d.gender === 1) parts.push('Female Only');
    if (d.gender === 2) parts.push('Male Only');
    return parts.join(' + ') || 'Special Condition';
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCompleteData = async () => {
      try {
        setLoading(true);

        // 1. Fetch core Pokemon endpoint
        const pkmnRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pData = pkmnRes.data;

        if (!isMounted) return;
        setData(pData);

        // Fetch ability descriptions in parallel
        const abilitiesMap = {};
        await Promise.all(
          pData.abilities.map(async (a) => {
            try {
              const aRes = await axios.get(a.ability.url);
              const engEntry = aRes.data.effect_entries.find((e) => e.language.name === 'en');
              const shortEffect = engEntry ? engEntry.short_effect : (aRes.data.flavor_text_entries.find((f) => f.language.name === 'en')?.flavor_text || 'No classification available.');
              abilitiesMap[a.ability.name] = shortEffect.replace(/\f/g, ' ').replace(/\n/g, ' ');
            } catch (e) {
              abilitiesMap[a.ability.name] = 'Classified Holo-Caster ability data.';
            }
          })
        );
        if (isMounted) setAbilityDetails(abilitiesMap);

        // 2. Fetch Species endpoint
        const speciesName = pData.species.name;
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`);
        const sData = speciesRes.data;

        if (!isMounted) return;
        setSpeciesData(sData);

        // Genera classification (e.g. "Bubble Frog Pokémon")
        const engGenus = sData.genera.find((g) => g.language.name === 'en');
        if (engGenus) setGenera(engGenus.genus);

        // English trivia
        const engFlavor = sData.flavor_text_entries.find((f) => f.language.name === 'en');
        if (engFlavor) {
          setTrivia(engFlavor.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '));
        }

        // 3. Fetch Evolution Chain
        if (sData.evolution_chain?.url) {
          const evoRes = await axios.get(sData.evolution_chain.url);
          const chainList = [];

          const traverse = (node, triggerDesc = null) => {
            const evoId = node.species.url.split('/').filter(Boolean).pop();
            chainList.push({
              name: node.species.name,
              id: evoId,
              artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`,
              shinyArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${evoId}.png`,
              condition: triggerDesc
            });

            // Special Ash-Greninja branch
            if (node.species.name === 'greninja') {
              chainList.push({
                name: 'greninja-ash',
                id: '10116',
                artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10116.png`,
                shinyArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/10116.png`,
                condition: 'Battle Bond (Ash-Greninja)'
              });
            }

            if (node.evolves_to && node.evolves_to.length > 0) {
              node.evolves_to.forEach((subNode) => {
                const req = parseEvoTrigger(subNode.evolution_details);
                traverse(subNode, req);
              });
            }
          };

          traverse(evoRes.data.chain);
          if (isMounted) setEvolutionTree(chainList);
        }
      } catch (err) {
        console.error('Failed fetching complete data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompleteData();

    return () => { isMounted = false; };
  }, [id]);

  // Audio cry player
  const playCry = () => {
    if (!data) return;
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`);
    audio.volume = 0.25;
    audio.play().catch(() => {});
  };

  // Group moves by learn method
  const categorizedMoves = useMemo(() => {
    if (!data || !data.moves) return { 'level-up': [], 'machine': [], 'egg': [], 'tutor': [] };

    const groups = {
      'level-up': [],
      'machine': [],
      'egg': [],
      'tutor': []
    };

    data.moves.forEach((m) => {
      // Find latest version group details
      const detail = m.version_group_details[m.version_group_details.length - 1];
      const method = detail?.move_learn_method?.name || 'level-up';
      const level = detail?.level_learned_at || 0;

      const item = {
        name: m.move.name.replace('-', ' '),
        level,
        method
      };

      if (groups[method]) {
        groups[method].push(item);
      } else {
        groups['tutor'].push(item);
      }
    });

    // Sort level-up moves by level ascending
    groups['level-up'].sort((a, b) => a.level - b.level);
    return groups;
  }, [data]);

  if (loading || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent border-b-transparent rounded-full shadow-[0_0_25px_rgba(0,229,255,0.4)]"
        />
        <p className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase animate-pulse">
          Accessing Kalos Mainframe Database...
        </p>
      </div>
    );
  }

  const isAsh = ASH_KALOS_POKEMON.includes(data.name);
  const formattedId = data.name === 'greninja-ash' ? '#0658-A' : `#${String(data.id).padStart(4, '0')}`;
  const displayName = data.name === 'greninja-ash' ? 'ASH-GRENINJA' : data.name.replace('-', ' ');

  const artworkNormal = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;
  const artworkShiny = data.sprites.other?.['official-artwork']?.front_shiny || artworkNormal;
  const currentImg = isShiny ? artworkShiny : artworkNormal;

  // Gender Ratio calculation
  const genderRate = speciesData?.gender_rate ?? -1;
  const isGenderless = genderRate === -1;
  const femalePercentage = isGenderless ? 0 : (genderRate / 8) * 100;
  const malePercentage = isGenderless ? 0 : 100 - femalePercentage;

  // EV Yields calculation
  const evYields = data.stats.filter((s) => s.effort > 0).map((s) => `${s.effort} ${s.stat.name.replace('-', ' ').toUpperCase()}`);

  // Base Stats
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
  };

  const totalBST = data.stats.reduce((acc, s) => acc + s.base_stat, 0);

  // Moves filtered by search
  const displayedMoves = (categorizedMoves[activeMoveTab] || []).filter((m) =>
    m.name.toLowerCase().includes(moveSearch.toLowerCase().trim())
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-20"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-[#00E5FF] text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Roster</span>
        </button>

        <button
          onClick={playCry}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/25 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <Volume2 size={14} />
          <span>Play Cry</span>
        </button>
      </div>

      {/* Hero Specimen Deck */}
      <div className="glass rounded-3xl p-6 sm:p-10 mb-8 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00E5FF]/15 to-[#FF3366]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: 3D Holographic Artwork Spotlight */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#FF3366]/20 blur-3xl pointer-events-none" />
              <motion.img
                key={currentImg}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={currentImg}
                alt={displayName}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] relative z-10"
              />
            </div>

            {/* Variant tag */}
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono tracking-widest text-gray-300 uppercase">
              <Sparkles size={12} className={isShiny ? 'text-yellow-400' : 'text-[#00E5FF]'} />
              <span>{isShiny ? 'Shiny Variant Active' : 'Standard Specimen Form'}</span>
            </div>
          </div>

          {/* Right: Telemetry & Specimen Identity */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono font-black text-[#00E5FF] tracking-wider">
                {formattedId}
              </span>
              {genera && (
                <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">
                  • {genera}
                </span>
              )}
              {isAsh && (
                <span className="ml-auto text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/40">
                  Ash's Kalos Champion
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-4">
              {displayName}
            </h1>

            {/* Type Badges */}
            <div className="flex gap-2 mb-6">
              {data.types.map((t) => {
                const conf = TYPE_CONFIG[t.type.name] || TYPE_CONFIG.normal;
                return (
                  <span
                    key={t.type.name}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${conf.bg}`}
                  >
                    <span>{conf.icon}</span>
                    <span>{conf.name}</span>
                  </span>
                );
              })}
            </div>

            {/* Trivia Quote */}
            {trivia && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 text-sm leading-relaxed italic mb-6">
                "{trivia}"
              </div>
            )}

            {/* Specimen Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-black/25 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">HEIGHT</span>
                <span className="font-mono font-bold text-white text-sm">{data.height / 10} m</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/25 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">WEIGHT</span>
                <span className="font-mono font-bold text-white text-sm">{data.weight / 10} kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/25 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">BASE EXP</span>
                <span className="font-mono font-bold text-white text-sm">{data.base_experience || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/25 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">CATCH RATE</span>
                <span className="font-mono font-bold text-white text-sm">{speciesData?.capture_rate || 45}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breeding & Biology Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Gender Distribution */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#00E5FF] mb-3">
            Gender Distribution
          </h3>
          {isGenderless ? (
            <p className="text-sm font-bold text-gray-300">Genderless / Unknown</p>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-2">
                <span className="text-blue-400">♂ {malePercentage.toFixed(1)}%</span>
                <span className="text-pink-400">♀ {femalePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 flex overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${malePercentage}%` }} />
                <div className="bg-pink-500 h-full" style={{ width: `${femalePercentage}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Egg Groups & Hatch Cycles */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#00E5FF] mb-3">
            Egg Groups & Cycles
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {speciesData?.egg_groups?.map((g) => (
              <span
                key={g.name}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase text-gray-300"
              >
                {g.name.replace('-', ' ')}
              </span>
            ))}
          </div>
          <p className="text-xs font-mono text-gray-400 mt-2">
            Hatch Counter: {speciesData?.hatch_counter ? `${speciesData.hatch_counter * 255} steps` : 'N/A'}
          </p>
        </div>

        {/* EV Yields */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#00E5FF] mb-3">
            Effort Values (EV Yield)
          </h3>
          <div className="flex flex-wrap gap-2">
            {evYields.length > 0 ? (
              evYields.map((yieldText, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold"
                >
                  +{yieldText}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 font-mono">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Ability Classification Matrix */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6">
          Classified Combat Abilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.abilities.map((a) => (
            <div
              key={a.ability.name}
              className={`p-4 rounded-2xl glass border transition-colors ${
                a.is_hidden ? 'border-[#00E5FF]/40 bg-[#00E5FF]/5' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-white">
                  {a.ability.name.replace('-', ' ')}
                </h4>
                {a.is_hidden && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/20 border border-[#00E5FF]/40">
                    Hidden Ability
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {abilityDetails[a.ability.name] || 'Retrieving ability tactical notes...'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evolutionary Flowchart Lineage */}
      {evolutionTree.length > 0 && (
        <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 text-center">
          <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6">
            Evolutionary Lineage Flowchart
          </h3>

          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {evolutionTree.map((evo, idx) => (
              <React.Fragment key={evo.name}>
                {evo.condition && (
                  <div className="flex flex-col items-center">
                    <span className="text-[#00E5FF] font-black text-xl mb-1">&rarr;</span>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-md border border-[#00E5FF]/30 max-w-[140px]">
                      {evo.condition}
                    </span>
                  </div>
                )}

                <div
                  onClick={() => navigate(`/pokemon/${evo.name}`)}
                  className={`flex flex-col items-center p-4 rounded-2xl glass border cursor-pointer hover:scale-105 transition-all ${
                    evo.name === data.name
                      ? 'border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-[#00E5FF]/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={isShiny ? evo.shinyArtwork : evo.artwork}
                    alt={evo.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 drop-shadow-md"
                  />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {evo.name.replace('-', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    #{String(evo.id).padStart(4, '0')}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Base Combat Statistics Chart */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <h3 className="text-lg font-black uppercase tracking-wider text-white">
            Combat Statistics Performance
          </h3>
          <div className="text-xs font-mono text-[#00E5FF] font-bold">
            BST: {totalBST}
          </div>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {data.stats.map((s) => {
            const label = statNames[s.stat.name] || s.stat.name.toUpperCase();
            const val = s.base_stat;
            const pct = Math.min((val / 255) * 100, 100);

            return (
              <div key={s.stat.name}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-200 mb-1">
                  <span>{label}</span>
                  <span className="text-[#00E5FF] font-mono">{val}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-500 via-[#00E5FF] to-cyan-300 h-full rounded-full shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Move Pool with Learn Methods */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Tactical Movepool Matrix
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Full move library segmented by acquisition vector.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search moves..."
              value={moveSearch}
              onChange={(e) => setMoveSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        {/* Move Acquisition Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'level-up', label: 'Level Up', count: categorizedMoves['level-up'].length },
            { id: 'machine', label: 'TM / HM', count: categorizedMoves['machine'].length },
            { id: 'egg', label: 'Egg Moves', count: categorizedMoves['egg'].length },
            { id: 'tutor', label: 'Tutor Moves', count: categorizedMoves['tutor'].length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMoveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                activeMoveTab === tab.id
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-2 font-mono opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Moves Table / Grid */}
        {displayedMoves.length === 0 ? (
          <div className="text-center py-12 text-xs font-mono text-gray-400 uppercase tracking-widest">
            No moves found for current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-2">
            {displayedMoves.map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                className="p-3 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {m.name}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400 capitalize">
                    {activeMoveTab === 'level-up' ? `Lv. ${m.level}` : activeMoveTab}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PokemonDetail;
