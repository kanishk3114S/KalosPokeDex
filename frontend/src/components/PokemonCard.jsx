import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const typeConfig = {
  normal: { color: 'bg-stone-500', icon: '⏺️' },
  fire: { color: 'bg-orange-500', icon: '🔥' },
  water: { color: 'bg-blue-500', icon: '💧' },
  grass: { color: 'bg-green-500', icon: '🌿' },
  electric: { color: 'bg-yellow-400 text-black', icon: '⚡' },
  ice: { color: 'bg-cyan-300 text-black', icon: '❄️' },
  fighting: { color: 'bg-red-600', icon: '🥊' },
  poison: { color: 'bg-purple-500', icon: '☠️' },
  ground: { color: 'bg-yellow-600', icon: '🏜️' },
  flying: { color: 'bg-indigo-300 text-black', icon: '🪽' },
  psychic: { color: 'bg-pink-500', icon: '🔮' },
  bug: { color: 'bg-lime-500 text-black', icon: '🐛' },
  rock: { color: 'bg-yellow-800', icon: '🪨' },
  ghost: { color: 'bg-indigo-600', icon: '👻' },
  dragon: { color: 'bg-indigo-800', icon: '🐉' },
  dark: { color: 'bg-gray-800', icon: '🌙' },
  steel: { color: 'bg-slate-500', icon: '⚙️' },
  fairy: { color: 'bg-pink-300 text-black', icon: '✨' },
};

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();
  const { isShiny } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [types, setTypes] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (pokemon.url) {
      axios.get(pokemon.url).then(res => {
        if (isMounted) {
          setTypes(res.data.types.map(t => t.type.name));
        }
      }).catch(err => console.error(err));
    } else if (pokemon.types) {
      setTypes(pokemon.types);
    }
    return () => { isMounted = false; };
  }, [pokemon]);

  const id = pokemon.url.split('/').filter(Boolean).pop();
  
  let displayName = pokemon.name;
  let formattedId = `#${id.padStart(4, '0')}`;
  
  if (pokemon.name === 'greninja-ash') {
    displayName = 'ASH-GRENINJA';
    formattedId = '#0658-A';
  }

  // Audio URL using PokeAPI cries
  const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Lowered to 20% so it's a subtle background cry
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play blocked or failed:", e));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Ash's Kalos Team highlights (Final Forms Only)
  const ashKalosTeam = ['greninja', 'greninja-ash', 'talonflame', 'hawlucha', 'goodra', 'noivern'];
  const isAshPokemon = ashKalosTeam.includes(pokemon.name);

  // Premium Dark Theme glow
  const circleBg = isAshPokemon 
    ? "bg-gradient-to-tr from-red-500/20 via-gray-500/10 to-blue-500/20" 
    : "bg-gradient-to-tr from-[#00E5FF]/10 to-transparent";

  // Official Artwork
  const normalImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const shinyImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
  
  // Animated Showdown GIFs
  const gifNormal = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  const gifShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`;

  let staticImg = isShiny ? shinyImg : normalImg;
  let animatedImg = isShiny ? gifShiny : gifNormal;

  const currentImg = imgError ? staticImg : (isHovered ? animatedImg : staticImg);

  return (
    <div 
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Replaced 'glass hover-wave' with our new 'bg-[#131B2F] wavy-hover'
      className="scale-90 wavy-hover rounded-3xl p-6 cursor-pointer flex flex-col items-center group relative overflow-hidden border border-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 glass"
    >
      <audio ref={audioRef} src={audioUrl} preload="none"></audio>

      {isAshPokemon && (
        // Updated Ash badge to match the dark aesthetic
        <div className="absolute top-4 right-4 text-[8px] font-bold tracking-widest text-red-400 bg-red-950/40 px-3 py-1 rounded-full z-20 shadow-sm border border-red-500/30">
          ASH'S POKÉMON
        </div>
      )}
      
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full group-hover:scale-110 transition-transform duration-300 ease-out ${circleBg}`}></div>
        <img 
          src={currentImg} 
          alt={displayName} 
          onError={(e) => {
             if (!imgError) setImgError(true);
             e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          }}
          className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 ease-out drop-shadow-2xl"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col items-center justify-center w-full text-center relative z-10 flex-1">
        <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">{formattedId}</p>
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-200 w-full leading-tight mb-3">
          {displayName.replace('-', ' ')}
        </h3>

        {/* Types */}
        <div className="flex justify-center flex-wrap gap-2 mt-auto">
          {types.map(type => {
            const config = typeConfig[type] || { color: 'bg-gray-500 text-white', icon: '⏺️' };
            const textColor = config.color.includes('text-black') ? '' : 'text-white';
            return (
              <div key={type} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.color} ${textColor} shadow-sm border border-white/20`}>
                <span className="text-[10px]">{config.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest leading-none mt-[1px]">{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;