import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchKalosPokemon = async () => {
      try {
        const offset = 649; 
        const limit = 72;
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        
        let kalosList = res.data.results;
        kalosList.push({ name: 'greninja-ash', url: 'https://pokeapi.co/api/v2/pokemon/10116/' });

        const detailedPokemon = await Promise.all(
          kalosList.map(async (p) => {
            const detailRes = await axios.get(p.url);
            const d = detailRes.data;
            const idStr = p.url.split('/').filter(Boolean).pop();

            return {
              name: p.name,
              url: p.url,
              id: parseInt(idStr),
              height: d.height,
              weight: d.weight,
              base_experience: d.base_experience,
              hp: d.stats[0].base_stat,
              attack: d.stats[1].base_stat,
              defense: d.stats[2].base_stat,
              speed: d.stats[5].base_stat,
            };
          })
        );

        setPokemon(detailedPokemon);
      } catch (err) {
        console.error("Failed to fetch pokemon", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKalosPokemon();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-[var(--color-primary)] border-t-transparent border-b-transparent rounded-full"></motion.div>
        <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-[var(--color-primary)] font-black tracking-[0.3em] uppercase text-xs">
          Loading Detailed Roster
        </motion.p>
      </div>
    );
  }

  let displayedPokemon = pokemon.filter(p => p.name.includes(searchTerm.toLowerCase()));

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
      <div className="mb-8 border-b border-[rgba(148,163,184,0.1)] pb-6 text-center flex flex-col items-center">
        <h2 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] py-2 leading-tight flex items-center gap-4 drop-shadow-md">
          THE MEGADEX
          {/* Authentic Mega Stone Symbol */}
          <svg className="w-12 h-12 relative -top-1" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" fill="url(#megaBg)" stroke="#f8fafc" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <path d="M32 12 C 16 12 12 28 26 38 C 40 48 32 54 32 54 C 32 54 48 40 34 30 C 20 20 32 12 32 12 Z" fill="#ffffff" />
            <path d="M26 22 C 40 22 46 36 34 46 C 22 56 28 62 28 62 C 28 62 14 46 26 36 C 38 26 26 22 26 22 Z" fill="url(#megaHelix)" opacity="0.8" />
            <defs>
              <radialGradient id="megaBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e879f9" />
                <stop offset="80%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#312e81" />
              </radialGradient>
              <linearGradient id="megaHelix" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </h2>
        <p className="text-[var(--color-silver)] font-medium tracking-widest text-xs max-w-xl leading-relaxed uppercase mt-2">
          Kalos Region Roster: 72 Pokémon + Battle Bond.
        </p>
        <button 
          onClick={() => navigate('/mega-dex')}
          className="mt-6 px-6 py-2 border border-[var(--color-primary)] text-[var(--color-text-main)] font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all cursor-pointer"
        >
          View Pure Mega Evolutions Dex &rarr;
        </button>
      </div>
      
      {/* Controls - Smaller & Z-index fixed */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 glass p-3 rounded-3xl relative z-50">
        <div className="relative w-full flex-1">
          <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[rgba(0,229,255,0.2)] bg-[rgba(0,0,0,0.4)] text-[var(--color-text-main)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative" ref={sortDropdownRef}>
          {/* Custom Animated Sort Dropdown */}
          <div className="relative w-full md:w-auto">
            <div 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)] text-[var(--color-silver)] hover:border-[var(--color-primary)] transition-all duration-300 cursor-pointer font-bold uppercase tracking-wider text-[10px] flex justify-between items-center gap-3 min-w-[140px]"
            >
              <span>{sortOptions.find(o => o.value === sortAttribute)?.label}</span>
              <motion.svg animate={{ rotate: isSortOpen ? 180 : 0 }} className="w-3 h-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></motion.svg>
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
                      className={`px-4 py-3 text-[9px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sortAttribute === option.value ? 'text-[var(--color-primary)] bg-[rgba(59,130,246,0.05)]' : 'text-[var(--color-silver)] hover:text-[var(--color-text-main)] hover:bg-[rgba(148,163,184,0.05)]'}`}
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
            className="px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)] text-[var(--color-silver)] hover:text-black hover:bg-[var(--color-primary)] transition-all font-black cursor-pointer tracking-widest text-[10px] uppercase"
          >
            {sortOrder === 'asc' ? 'ASC ↑' : 'DESC ↓'}
          </button>
        </div>
      </div>

      {displayedPokemon.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center text-gray-500 font-black tracking-[0.3em] uppercase mt-24 text-sm">
          No Pokémon found.
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-0"
        >
          {displayedPokemon.map((p) => (
            <PokemonCard key={p.name} pokemon={p} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
