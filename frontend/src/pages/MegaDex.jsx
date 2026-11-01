import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';

const MegaDex = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite } = useFavorites();
  
  const [sortAttribute, setSortAttribute] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  
  const navigate = useNavigate();

  const sortOptions = [
    { value: 'id', label: 'Sort by ID' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'height', label: 'Sort by Height' },
    { value: 'weight', label: 'Sort by Weight' },
    { value: 'hp', label: 'Sort by HP' },
    { value: 'attack', label: 'Sort by Attack' },
    { value: 'defense', label: 'Sort by Defense' },
    { value: 'speed', label: 'Sort by Speed' },
    { value: 'base_experience', label: 'Sort by Base Exp.' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMegaPokemon = async () => {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1500`);
        
        let megaList = res.data.results.filter(p => p.name.includes('-mega'));

        const detailedPokemonRaw = await Promise.all(
          megaList.map(async (p) => {
            try {
              const detailRes = await axios.get(p.url);
              const d = detailRes.data;
              const idStr = p.url.split('/').filter(Boolean).pop();

              return {
                name: p.name,
                url: p.url,
                id: parseInt(idStr),
                height: d.height || 0,
                weight: d.weight || 0,
                base_experience: d.base_experience || 0,
                hp: d.stats?.[0]?.base_stat || 0,
                attack: d.stats?.[1]?.base_stat || 0,
                defense: d.stats?.[2]?.base_stat || 0,
                speed: d.stats?.[5]?.base_stat || 0,
              };
            } catch (e) {
              console.warn(`Failed fetching or parsing ${p.name}`, e);
              return null;
            }
          })
        );

        setPokemon(detailedPokemonRaw.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch pokemon", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMegaPokemon();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col gap-4">
        <div className="w-52 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_12px_rgba(168,85,247,0.8)]"
          />
        </div>
        <p className="text-purple-400 font-mono font-bold tracking-[0.25em] uppercase text-[11px]">
          Synchronizing Mega Evolution Telemetry...
        </p>
      </div>
    );
  }

  let displayedPokemon = pokemon.filter(p => {
    const matchesSearch = p.name.includes(searchTerm.toLowerCase());
    const matchesFav = showFavoritesOnly ? isFavorite(p.name) : true;
    return matchesSearch && matchesFav;
  });

  displayedPokemon.sort((a, b) => {
    let valA = a[sortAttribute];
    let valB = b[sortAttribute];
    if (sortAttribute === 'name') {
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="container mx-auto px-6 pb-12"
    >
      {/* Futuristic Kalos Mega Evolution Deck */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        {/* Subtle holographic ambient glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#00E5FF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="self-start mb-4 px-4 py-2 border border-white/20 glass rounded-full text-[10px] font-bold text-gray-300 hover:text-white hover:border-[#00E5FF] transition-all uppercase tracking-widest cursor-pointer"
          >
            &larr; Back to Kalos
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase font-bold">
              Kalos Mega Stone Telemetry
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-[#00E5FF] leading-tight drop-shadow-md">
            PURE MEGADEX
          </h2>
          <p className="text-gray-300 font-medium tracking-[0.1em] text-xs max-w-xl leading-relaxed uppercase mt-2">
            The complete compendium of pure Mega Evolutions, Primal Reversions, and Ash-Greninja Battle Bond transformations.
          </p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 glass p-3 rounded-3xl relative z-50">
        <div className="relative w-full flex-1 flex gap-2">
          <div className="relative w-full">
            <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search Megas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-400/30 bg-[rgba(0,0,0,0.4)] text-[var(--color-text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all font-medium"
            />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-full border flex items-center justify-center transition-all ${showFavoritesOnly ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.4)] text-gray-400 hover:border-pink-500 hover:text-pink-400'}`}
            title="Toggle Favorites"
          >
            <Heart size={16} className={showFavoritesOnly ? 'fill-pink-400' : ''} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative" ref={sortDropdownRef}>
          {/* Custom Animated Sort Dropdown */}
          <div className="relative w-full md:w-auto">
            <div 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)] text-[var(--color-silver)] hover:border-purple-500 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wider text-[10px] flex justify-between items-center gap-3 min-w-[140px]"
            >
              <span>{sortOptions.find(o => o.value === sortAttribute)?.label}</span>
              <motion.svg animate={{ rotate: isSortOpen ? 180 : 0 }} className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></motion.svg>
            </div>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 5, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.3 }}
                  className="absolute top-full right-0 bg-[var(--card-bg)] border border-[rgba(148,163,184,0.2)] rounded-2xl overflow-hidden shadow-lg z-[100] py-1 min-w-[160px]"
                >
                  {sortOptions.map(option => (
                    <div 
                      key={option.value}
                      onClick={() => { setSortAttribute(option.value); setIsSortOpen(false); }}
                      className={`px-4 py-3 text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sortAttribute === option.value ? 'text-purple-600 bg-[rgba(147,51,234,0.05)]' : 'text-[var(--color-silver)] hover:text-[var(--color-text-main)] hover:bg-[rgba(148,163,184,0.05)]'}`}
                    >
                      {option.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)] text-[var(--color-silver)] hover:text-black hover:bg-purple-500 transition-all font-black cursor-pointer tracking-widest text-[10px] uppercase"
          >
            {sortOrder === 'asc' ? 'ASC ↑' : 'DESC ↓'}
          </button>
        </div>
      </div>

      {displayedPokemon.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center text-gray-500 font-black tracking-[0.3em] uppercase mt-24 text-sm">
          No Mega Pokémon found.
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-0"
        >
          {displayedPokemon.map((p) => (
            <PokemonCard key={p.name} pokemon={p} contextList={displayedPokemon.map(dp => dp.name)} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MegaDex;
