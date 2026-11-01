import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  ArrowUpDown, 
  Grid3X3, 
  Layers,
  Filter,
  Zap,
  Sliders
} from 'lucide-react';
import PokemonCard from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';
import { TYPE_CONFIG, ASH_KALOS_POKEMON, KALOS_SORT_OPTIONS } from '../constants/kalosData';
import { fuzzyMatchPokemon } from '../utils/fuzzySearch';
import { 
  pageVariants, 
  staggerGridContainer, 
  buttonTapSpring 
} from '../constants/animations';
import greninja4kEpic from '../assets/greninja_4k_epic.jpg';
import ashGreninjaRender from '../assets/ash_greninja_hero_render.png';

const Dashboard = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'ash', 'favorites'
  const [sortAttribute, setSortAttribute] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDeepFilterOpen, setIsDeepFilterOpen] = useState(false);
  const [minBST, setMinBST] = useState(0);

  const { isFavorite, favorites } = useFavorites();

  // Load Kalos Pokémon (Gen 6: Chespin #650 to Volcanion #721 + Ash-Greninja #10116)
  useEffect(() => {
    let isMounted = true;

    const fetchKalosPokemon = async () => {
      try {
        setLoading(true);
        const offset = 649;
        const limit = 72;
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);

        let kalosList = [...res.data.results];
        kalosList.push({ 
          name: 'greninja-ash', 
          url: 'https://pokeapi.co/api/v2/pokemon/10116/' 
        });

        // Parallel batch fetch for detailed attributes
        const detailedPokemon = await Promise.all(
          kalosList.map(async (p) => {
            const detailRes = await axios.get(p.url);
            const d = detailRes.data;
            const idStr = p.url.split('/').filter(Boolean).pop();

            return {
              name: p.name,
              url: p.url,
              id: parseInt(idStr, 10),
              types: d.types?.map((t) => t.type.name) || [],
              height: d.height,
              weight: d.weight,
              base_experience: d.base_experience || 0,
              hp: d.stats?.[0]?.base_stat || 0,
              attack: d.stats?.[1]?.base_stat || 0,
              defense: d.stats?.[2]?.base_stat || 0,
              speed: d.stats?.[5]?.base_stat || 0,
            };
          })
        );

        if (isMounted) {
          setPokemon(detailedPokemon);
        }
      } catch (err) {
        console.error('Failed to retrieve Kalos database:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchKalosPokemon();

    return () => { isMounted = false; };
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedPokemon = useMemo(() => {
    let list = [...pokemon];

    // Fuzzy intelligent search (handles typos like 'charzard' -> 'charizard')
    if (searchTerm.trim()) {
      list = fuzzyMatchPokemon(list, searchTerm);
    }

    // Min Base Stat Total filter
    if (minBST > 0) {
      list = list.filter((p) => {
        const bst = (p.hp || 0) + (p.attack || 0) + (p.defense || 0) + (p.speed || 0);
        return bst >= minBST;
      });
    }

    // Quick filter presets
    if (activeFilter === 'ash') {
      list = list.filter((p) => ASH_KALOS_POKEMON.includes(p.name));
    } else if (activeFilter === 'favorites') {
      list = list.filter((p) => isFavorite(p.name));
    }

    // Type filter
    if (selectedType !== 'all') {
      list = list.filter((p) => p.types && p.types.includes(selectedType));
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[sortAttribute];
      let valB = b[sortAttribute];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortOrder === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return list;
  }, [pokemon, searchTerm, minBST, activeFilter, selectedType, sortAttribute, sortOrder, isFavorite]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('all');
    setActiveFilter('all');
    setMinBST(0);
    setSortAttribute('id');
    setSortOrder('asc');
  }, []);

  const contextList = filteredAndSortedPokemon.map((p) => p.name);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-20 relative"
    >
      {/* 9th-Gen Kalos Holographic Control Deck with 4K Kalos & Ash Theme */}
      <div className="glass rounded-3xl p-6 sm:p-10 mb-8 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* 4K Kalos Background Image with Subtle Atmospheric Scrim */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-xs pointer-events-none"
          style={{ backgroundImage: `url(${greninja4kEpic})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none" />

        {/* 4K Ash-Greninja Floating Specimen Standee (Desktop) */}
        <div className="hidden lg:block absolute -right-6 -bottom-6 w-80 h-80 pointer-events-none z-10">
          <motion.img
            src={ashGreninjaRender}
            alt="Ash-Greninja 4K"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,229,255,0.35)]"
          />
        </div>

        {/* Header Telemetry and Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-20">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                Kalos Pokédex Subsystem • Gen 09 Spatial UI
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#FF3366]/20 border border-[#FF3366]/40 text-[#FF3366] font-bold">
                ASH-GRENINJA SYNERGY ACTIVE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Kalos Region Roster
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Authentic Gen-VI database calibrated with Ash Ketchum's Kalos Championship squadron, high-fidelity official stats, and spatial 3D telemetry.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-xl glass border border-white/10 text-xs">
              <span className="text-gray-400 text-[10px] block font-mono">POKÉDEX ENTRIES</span>
              <span className="font-mono font-black text-white">{pokemon.length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl glass border border-[#FF3366]/30 text-xs">
              <span className="text-[#FF3366] text-[10px] block font-mono">ASH'S KALOS SQUAD</span>
              <span className="font-mono font-black text-white">{ASH_KALOS_POKEMON.length}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl glass border border-pink-500/30 text-xs">
              <span className="text-pink-400 text-[10px] block font-mono">SAVED SQUAD</span>
              <span className="font-mono font-black text-white">{favorites?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 relative z-10">
          {/* Real-time Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by species name or ID (e.g. Greninja, 658)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeFilter === 'all'
                  ? 'bg-white/15 text-white border-white/30 shadow-sm'
                  : 'text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'ash' ? 'all' : 'ash')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeFilter === 'ash'
                  ? 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/50 shadow-[0_0_12px_rgba(255,51,102,0.3)]'
                  : 'text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={13} />
              Ash's Squad
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'favorites' ? 'all' : 'favorites')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeFilter === 'favorites'
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                  : 'text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart size={13} />
              Favorites
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-black/40 border border-white/15 text-gray-200 hover:border-[#00E5FF]/50 transition-all cursor-pointer"
              >
                <SlidersHorizontal size={13} className="text-[#00E5FF]" />
                <span className="hidden sm:inline">Sort:</span>
                <span className="text-white capitalize">
                  {KALOS_SORT_OPTIONS.find((o) => o.value === sortAttribute)?.label || 'ID'}
                </span>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl glass p-2 border border-white/20 shadow-2xl z-50 bg-[#0F172A]/95 backdrop-blur-xl"
                  >
                    <div className="p-1.5 text-[10px] font-mono uppercase text-gray-400 font-bold border-b border-white/10 mb-1">
                      Sort Metrics
                    </div>
                    {KALOS_SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortAttribute(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          sortAttribute === opt.value
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortAttribute === opt.value && <span className="text-[#00E5FF]">•</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ascending / Descending Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Switch to ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              className="p-2 rounded-xl bg-black/40 border border-white/15 text-gray-200 hover:border-[#00E5FF]/50 transition-all cursor-pointer"
            >
              <ArrowUpDown size={15} className={sortOrder === 'desc' ? 'rotate-180 transition-transform' : ''} />
            </button>

            {/* Deep BST Filter Button */}
            <button
              onClick={() => setIsDeepFilterOpen(!isDeepFilterOpen)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                isDeepFilterOpen || minBST > 0
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]'
                  : 'bg-black/40 border-white/15 text-gray-200 hover:border-white/30'
              }`}
            >
              <Filter size={13} />
              <span>BST Filter</span>
            </button>
          </div>
        </div>

        {/* Deep BST Filter Drawer */}
        <AnimatePresence>
          {isDeepFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/30 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gray-300 uppercase">
                    Minimum Stat Total (BST):
                  </span>
                  <span className="text-sm font-mono font-black text-[#00E5FF]">{minBST > 0 ? `≥ ${minBST}` : 'All (No Limit)'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="25"
                  value={minBST}
                  onChange={(e) => setMinBST(parseInt(e.target.value, 10))}
                  className="w-full sm:w-64 accent-[#00E5FF] h-2 rounded-lg bg-white/10 cursor-pointer"
                />
                {minBST > 0 && (
                  <button
                    onClick={() => setMinBST(0)}
                    className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Reset BST
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 18 Elemental Type Pills Carousel */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
              selectedType === 'all'
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            All Types
          </button>

          {Object.entries(TYPE_CONFIG).map(([typeKey, conf]) => {
            const isSelected = selectedType === typeKey;
            return (
              <button
                key={typeKey}
                onClick={() => setSelectedType(isSelected ? 'all' : typeKey)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? `${conf.bg} ring-2 ring-[#00E5FF] shadow-md`
                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                }`}
              >
                <span>{conf.icon}</span>
                <span>{conf.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster Header Status */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
          <span>Active Results:</span>
          <span className="font-bold text-[#00E5FF]">{filteredAndSortedPokemon.length} Pokémon</span>
        </div>

        {(searchTerm || selectedType !== 'all' || activeFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent border-b-transparent rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-[#FF3366] rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase animate-pulse">
            Transmitting Kalos Data Stream...
          </p>
        </div>
      ) : filteredAndSortedPokemon.length === 0 ? (
        <div className="min-h-[40vh] glass rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-400">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-black uppercase tracking-wider text-white mb-2">
            No Pokémon Match Criteria
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
            The Holo-Caster could not locate any specimens with the selected type, search term, or filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-full bg-[#00E5FF] text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={staggerGridContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {filteredAndSortedPokemon.map((p) => (
            <PokemonCard 
              key={p.name} 
              pokemon={p} 
              contextList={contextList} 
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
