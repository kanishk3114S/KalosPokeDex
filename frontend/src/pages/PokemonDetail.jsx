import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Shield, 
  Compass, 
  BookOpen, 
  Sliders, 
  Activity, 
  Layers, 
  ChevronRight, 
  Flame, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TYPE_CONFIG, ASH_KALOS_POKEMON } from '../constants/kalosData';
import { POKEMON_FORM_MAPPINGS, KALOS_HABITAT_ROUTES } from '../constants/pokemonForms';
import { HexRadarChart } from '../components/charts/HexRadarChart';
import { TypeHeatmap } from '../components/charts/TypeHeatmap';
import { EvolutionFlowchart } from '../components/evolution/EvolutionFlowchart';
import { CompetitiveStatCalculator } from '../components/calculator/CompetitiveStatCalculator';
import { pageVariants } from '../constants/animations';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isShiny } = useTheme();

  // Active form (e.g. standard or mega)
  const [activePokemonId, setActivePokemonId] = useState(id);

  const [data, setData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [allFlavorTexts, setAllFlavorTexts] = useState([]);
  const [selectedGameVersion, setSelectedGameVersion] = useState('x');
  const [genera, setGenera] = useState('');
  const [evolutionTree, setEvolutionTree] = useState([]);
  const [abilityDetails, setAbilityDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // View modes
  const [artMode, setArtMode] = useState('artwork'); // 'artwork' or 'animated'
  const [activeStatTab, setActiveStatTab] = useState('radar'); // 'radar', 'bars', 'calculator'
  const [activeMoveTab, setActiveMoveTab] = useState('level-up');
  const [moveSearch, setMoveSearch] = useState('');

  // Audio Cry playing state
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  useEffect(() => {
    setActivePokemonId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Available forms for this Pokémon (Mega, Primal, Ash-Greninja, etc.)
  const availableForms = useMemo(() => {
    const baseKey = id.split('-')[0].toLowerCase();
    return POKEMON_FORM_MAPPINGS[baseKey] || POKEMON_FORM_MAPPINGS[id.toLowerCase()] || null;
  }, [id]);

  // Evolution trigger condition parser
  const parseEvoTrigger = (details) => {
    if (!details || details.length === 0) return 'Base Form';
    const d = details[0];
    const parts = [];
    if (d.min_level) parts.push(`Lv. ${d.min_level}`);
    if (d.item) parts.push(`Use ${d.item.name.replace('-', ' ')}`);
    if (d.held_item) parts.push(`Hold ${d.held_item.name.replace('-', ' ')}`);
    if (d.trigger?.name === 'trade') parts.push('Trade');
    if (d.min_happiness) parts.push('Friendship (220+)');
    if (d.known_move) parts.push(`Knows ${d.known_move.name.replace('-', ' ')}`);
    if (d.time_of_day) parts.push(`${d.time_of_day} time`);
    if (d.needs_overworld_rain) parts.push('In Rain');
    return parts.join(' + ') || 'Special';
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCompleteData = async () => {
      try {
        setLoading(true);

        const pkmnRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${activePokemonId}`);
        const pData = pkmnRes.data;

        if (!isMounted) return;
        setData(pData);

        // Fetch abilities
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

        // Fetch species data
        const speciesName = pData.species.name;
        const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`);
        const sData = speciesRes.data;

        if (!isMounted) return;
        setSpeciesData(sData);

        // Filter English multi-game flavor texts
        const engFlavors = sData.flavor_text_entries.filter((f) => f.language.name === 'en');
        const uniqueFlavors = [];
        const seenVersions = new Set();

        engFlavors.forEach((f) => {
          if (!seenVersions.has(f.version.name)) {
            seenVersions.add(f.version.name);
            uniqueFlavors.push({
              version: f.version.name,
              text: f.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
            });
          }
        });

        setAllFlavorTexts(uniqueFlavors);
        if (uniqueFlavors.length > 0) {
          const hasX = uniqueFlavors.find((f) => f.version === 'x');
          setSelectedGameVersion(hasX ? 'x' : uniqueFlavors[0].version);
        }

        const engGenus = sData.genera.find((g) => g.language.name === 'en');
        if (engGenus) setGenera(engGenus.genus);

        // Evolution chain
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

            if (node.species.name === 'greninja') {
              chainList.push({
                name: 'greninja-ash',
                id: '10116',
                artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10116.png`,
                shinyArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/10116.png`,
                condition: 'Battle Bond'
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
        console.error('Failed fetching data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompleteData();
    return () => { isMounted = false; };
  }, [activePokemonId]);

  // Audio cry player with animation state
  const playCry = () => {
    if (!data) return;
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`);
    audio.volume = 0.25;
    setIsPlayingCry(true);
    audio.onended = () => setIsPlayingCry(false);
    audio.onerror = () => setIsPlayingCry(false);
    audio.play().catch(() => setIsPlayingCry(false));
  };

  // Categorize move pool
  const categorizedMoves = useMemo(() => {
    if (!data || !data.moves) return { 'level-up': [], 'machine': [], 'egg': [], 'tutor': [] };

    const groups = { 'level-up': [], 'machine': [], 'egg': [], 'tutor': [] };

    data.moves.forEach((m) => {
      const detail = m.version_group_details[m.version_group_details.length - 1];
      const method = detail?.move_learn_method?.name || 'level-up';
      const level = detail?.level_learned_at || 0;

      const item = {
        name: m.move.name.replace('-', ' '),
        level,
        method
      };

      if (groups[method]) groups[method].push(item);
      else groups['tutor'].push(item);
    });

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

  const primaryType = data.types[0]?.type.name || 'normal';
  const typeConfig = TYPE_CONFIG[primaryType] || TYPE_CONFIG.normal;
  const isAsh = ASH_KALOS_POKEMON.includes(data.name);

  const formattedId = data.name === 'greninja-ash' ? '#0658-A' : `#${String(data.id).padStart(4, '0')}`;
  const displayName = data.name === 'greninja-ash' ? 'ASH-GRENINJA' : data.name.replace('-', ' ');

  // Artwork & Showdown GIF
  const staticArtwork = isShiny
    ? data.sprites.other?.['official-artwork']?.front_shiny || data.sprites.front_shiny
    : data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;

  const showdownGif = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${data.id}.gif`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${data.id}.gif`;

  const currentDisplayImg = artMode === 'animated' ? showdownGif : staticArtwork;

  // Base Stats Map
  const baseStatsMap = {
    hp: data.stats[0]?.base_stat || 0,
    attack: data.stats[1]?.base_stat || 0,
    defense: data.stats[2]?.base_stat || 0,
    spAtk: data.stats[3]?.base_stat || 0,
    spDef: data.stats[4]?.base_stat || 0,
    speed: data.stats[5]?.base_stat || 0,
  };
  const totalBST = Object.values(baseStatsMap).reduce((a, b) => a + b, 0);

  // Active Flavor Text
  const currentFlavor = allFlavorTexts.find((f) => f.version === selectedGameVersion) || allFlavorTexts[0];

  // Kalos Habitat Route
  const baseName = data.name.split('-')[0].toLowerCase();
  const habitatRoute = KALOS_HABITAT_ROUTES[data.name.toLowerCase()] || KALOS_HABITAT_ROUTES[baseName] || 'Wild Kalos Wilderness';

  const typeNames = data.types.map((t) => t.type.name);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-20 relative"
    >
      {/* Dynamic Type-Based Ambient Background Glow */}
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: typeConfig.glow || '#00E5FF' }}
      />

      {/* Navigation & Audio Cry Controls */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-[#00E5FF] text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Roster</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Habitat Route Button ("Find in Kalos") */}
          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/40 border border-white/15 hover:border-[#00E5FF] text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Compass size={14} className="text-[#00E5FF]" />
            <span className="hidden sm:inline">Find in Kalos:</span>
            <span className="text-[#00E5FF] truncate max-w-[140px]">{habitatRoute}</span>
          </button>

          {/* Cry Audio Button */}
          <button
            onClick={playCry}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
              isPlayingCry
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] scale-105 shadow-cyan-500/40'
                : 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/25'
            }`}
          >
            <Volume2 size={14} className={isPlayingCry ? 'animate-bounce' : ''} />
            <span>{isPlayingCry ? 'Playing Cry...' : 'Play Cry'}</span>
          </button>
        </div>
      </div>

      {/* Form & Mega Evolution Switcher Tabs */}
      {availableForms && availableForms.length > 1 && (
        <div className="mb-6 p-1.5 rounded-2xl glass border border-white/10 flex items-center gap-2 overflow-x-auto select-none relative z-10">
          <span className="text-[10px] font-mono uppercase font-bold text-gray-400 px-3 shrink-0 flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" /> FORMS & MEGAS:
          </span>
          {availableForms.map((f) => {
            const isSelected = activePokemonId.toLowerCase() === f.idOrName.toLowerCase();
            return (
              <button
                key={f.idOrName}
                onClick={() => setActivePokemonId(f.idOrName)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black border-[#00E5FF] shadow-lg shadow-cyan-500/25'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
                }`}
              >
                {f.formName}
              </button>
            );
          })}
        </div>
      )}

      {/* Hero Specimen Dossier */}
      <div className="glass rounded-3xl p-6 sm:p-10 mb-8 border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: 3D Artwork / Showdown Animated Sprite Viewer */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-35" style={{ backgroundColor: typeConfig.glow }} />
              <motion.img
                key={`${currentDisplayImg}-${artMode}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={currentDisplayImg}
                alt={displayName}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] relative z-10"
              />
            </div>

            {/* Artwork / Animated Sprite Toggle Controls */}
            <div className="mt-4 flex items-center gap-2 bg-black/40 p-1 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setArtMode('artwork')}
                className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-all ${
                  artMode === 'artwork' ? 'bg-[#00E5FF] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Official Artwork
              </button>
              <button
                onClick={() => setArtMode('animated')}
                className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-all ${
                  artMode === 'animated' ? 'bg-[#FF3366] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Showdown GIF
              </button>
            </div>
          </div>

          {/* Right: Specimen Identity & Telemetry */}
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

            {/* Multi-Game Flavor Text Selector */}
            <div className="mb-6 p-4 rounded-2xl bg-black/25 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} className="text-[#00E5FF]" /> POKÉDEX ARCHIVE ENTRY:
                </span>
                {allFlavorTexts.length > 0 && (
                  <select
                    value={selectedGameVersion}
                    onChange={(e) => setSelectedGameVersion(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-white text-[10px] font-mono font-bold uppercase focus:outline-none focus:border-[#00E5FF] cursor-pointer"
                  >
                    {allFlavorTexts.map((f) => (
                      <option key={f.version} value={f.version} className="bg-[#0F172A] text-white">
                        Pokémon {f.version.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                "{currentFlavor?.text || 'No archive entry recorded.'}"
              </p>
            </div>

            {/* Metrics Grid */}
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
                <span className="text-[10px] font-mono text-gray-400 block uppercase">BST TOTAL</span>
                <span className="font-mono font-black text-[#00E5FF] text-sm">{totalBST}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weakness & Resistance Heatmap Grid */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <div className="pb-4 mb-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Elemental Weakness & Resistance Heatmap
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Exact damage multipliers taken from all 18 attack types.
            </p>
          </div>
        </div>
        <TypeHeatmap types={typeNames} />
      </div>

      {/* Combat Stats: Hexagonal Radar Chart & Competitive Tuner */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-3">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Combat Statistics & Performance
            </h3>
            <span className="text-xs font-mono text-[#00E5FF] font-bold">
              Base Stat Total: {totalBST}
            </span>
          </div>

          {/* Visual Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveStatTab('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeStatTab === 'radar' ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Radar Chart
            </button>
            <button
              onClick={() => setActiveStatTab('bars')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeStatTab === 'bars' ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Stat Bars
            </button>
            <button
              onClick={() => setActiveStatTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                activeStatTab === 'calculator' ? 'bg-[#FF3366] text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders size={12} />
              <span>EV/IV Calculator</span>
            </button>
          </div>
        </div>

        {activeStatTab === 'radar' ? (
          <div className="py-4 flex justify-center">
            <HexRadarChart stats={baseStatsMap} size={340} />
          </div>
        ) : activeStatTab === 'bars' ? (
          <div className="space-y-4 max-w-3xl mx-auto py-2">
            {[
              { label: 'HP', key: 'hp' },
              { label: 'Attack', key: 'attack' },
              { label: 'Defense', key: 'defense' },
              { label: 'Sp. Atk', key: 'spAtk' },
              { label: 'Sp. Def', key: 'spDef' },
              { label: 'Speed', key: 'speed' }
            ].map(({ label, key }) => {
              const val = baseStatsMap[key] || 0;
              const pct = Math.min((val / 255) * 100, 100);

              return (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-200 mb-1">
                    <span>{label}</span>
                    <span className="text-[#00E5FF] font-mono">{val}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.75, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-blue-500 via-[#00E5FF] to-cyan-300 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <CompetitiveStatCalculator baseStats={baseStatsMap} pokemonName={data.name} />
        )}
      </div>

      {/* Evolutionary Lineage Flowchart */}
      {evolutionTree.length > 0 && (
        <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
          <h3 className="text-base font-black uppercase tracking-wider text-white mb-6 text-center">
            Evolutionary Lineage & Branching Flowchart
          </h3>
          <EvolutionFlowchart chain={evolutionTree} currentName={data.name} />
        </div>
      )}

      {/* Ability Intelligence */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10">
        <h3 className="text-base font-black uppercase tracking-wider text-white mb-6">
          Classified Combat Abilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.abilities.map((a) => (
            <div
              key={a.ability.name}
              className={`p-4 rounded-2xl glass border ${
                a.is_hidden ? 'border-[#00E5FF]/40 bg-[#00E5FF]/5' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black uppercase text-white">
                  {a.ability.name.replace('-', ' ')}
                </h4>
                {a.is_hidden && (
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
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

      {/* Tactical Movepool Matrix */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Tactical Movepool Matrix
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Full move library categorized by acquisition vector.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search moves..."
            value={moveSearch}
            onChange={(e) => setMoveSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        {/* Learn Method Tabs */}
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
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 transition-all cursor-pointer border ${
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

        {/* Move Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-2">
          {(categorizedMoves[activeMoveTab] || [])
            .filter((m) => m.name.toLowerCase().includes(moveSearch.toLowerCase().trim()))
            .map((m, idx) => (
              <div key={`${m.name}-${idx}`} className="p-3 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">{m.name}</h4>
                  <span className="text-[10px] font-mono text-gray-400">
                    {activeMoveTab === 'level-up' ? `Lv. ${m.level}` : activeMoveTab}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonDetail;
