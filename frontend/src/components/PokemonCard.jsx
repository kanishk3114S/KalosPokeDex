import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Heart, Sparkles, Volume2, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { TYPE_CONFIG, ASH_KALOS_POKEMON } from '../constants/kalosData';
import { use3DCardTilt } from '../hooks/use3DCardTilt';
import { gridCardVariants } from '../constants/animations';

const PokemonCard = ({ pokemon, contextList = [] }) => {
  const navigate = useNavigate();
  const { isShiny } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [types, setTypes] = useState(pokemon.types || []);
  const audioRef = useRef(null);

  // Hook for tactile 3D anti-gravity tilt physics
  const {
    rotateX,
    rotateY,
    glareX,
    glareY,
    glareOpacity,
    handleMouseMove,
    handleMouseLeave
  } = use3DCardTilt({ maxTilt: 16 });

  // Fetch types if not provided
  useEffect(() => {
    let isMounted = true;
    if ((!pokemon.types || pokemon.types.length === 0) && pokemon.url) {
      axios.get(pokemon.url).then((res) => {
        if (isMounted && res.data.types) {
          setTypes(res.data.types.map((t) => t.type.name));
        }
      }).catch((err) => console.error('Error fetching card types:', err));
    }
    return () => { isMounted = false; };
  }, [pokemon]);

  // Determine Pokemon ID
  const rawId = pokemon.id || (pokemon.url ? pokemon.url.split('/').filter(Boolean).pop() : '1');
  const id = String(rawId);

  let displayName = pokemon.name || '';
  let formattedId = `#${id.padStart(4, '0')}`;

  if (pokemon.name === 'greninja-ash') {
    displayName = 'ASH-GRENINJA';
    formattedId = '#0658-A';
  }

  const isAshPokemon = ASH_KALOS_POKEMON.includes(pokemon.name);

  // Artwork & Showdown GIF Sprites
  const normalImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const shinyImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
  const gifNormal = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  const gifShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`;

  const staticImg = isShiny ? shinyImg : normalImg;
  const animatedImg = isShiny ? gifShiny : gifNormal;
  const currentImg = imgError ? staticImg : (isHovered ? animatedImg : staticImg);

  const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

  const onCardMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.18;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const onCardMouseLeave = useCallback(() => {
    setIsHovered(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  const handleCardClick = useCallback(() => {
    navigate(`/pokemon/${pokemon.name}`, { state: { currentList: contextList } });
  }, [navigate, pokemon.name, contextList]);

  const primaryType = types[0] || 'normal';
  const typeStyle = TYPE_CONFIG[primaryType] || TYPE_CONFIG.normal;
  const favStatus = isFavorite(pokemon.name);

  return (
    <motion.div
      variants={gridCardVariants}
      className="perspective-1000 w-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        onClick={handleCardClick}
        className="relative group rounded-3xl p-5 cursor-pointer glass-interactive border border-white/10 hover:border-[#00E5FF]/60 transition-colors duration-300 flex flex-col items-center overflow-hidden shadow-lg select-none"
      >
        {/* Hidden Audio Cry Player */}
        <audio ref={audioRef} src={audioUrl} preload="none" />

        {/* Dynamic Holographic Glare Sheen */}
        <motion.div
          style={{
            opacity: isHovered ? glareOpacity : 0,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45) 0%, rgba(0,229,255,0.2) 40%, transparent 80%)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-200"
        />

        {/* Top Badges & Controls */}
        <div 
          style={{ transform: 'translateZ(25px)' }} 
          className="w-full flex items-center justify-between z-20"
        >
          {isAshPokemon ? (
            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-[#FF3366] bg-[#FF3366]/15 border border-[#FF3366]/40 px-2.5 py-0.5 rounded-full shadow-sm">
              <Sparkles size={10} />
              ASH KALOS
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wider">
              {formattedId}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(pokemon.name);
              }}
              title="Add to Favorites"
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
            >
              <Heart
                size={16}
                className={favStatus ? 'fill-pink-500 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : ''}
              />
            </button>
          </div>
        </div>

        {/* 3D Floating Pokemon Artwork Container */}
        <div 
          style={{ transform: 'translateZ(45px)' }}
          className="relative w-36 h-36 sm:w-40 sm:h-40 my-3 flex items-center justify-center"
        >
          {/* Subtle Ambient Radial Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-25 group-hover:opacity-45 transition-opacity duration-500"
            style={{ backgroundColor: typeStyle.glow || 'rgba(0,229,255,0.3)' }}
          />

          {/* 3D Levitating Image */}
          <motion.img
            src={currentImg}
            alt={displayName}
            onError={(e) => {
              if (!imgError) setImgError(true);
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            }}
            animate={isHovered ? { y: [-2, 2, -2] } : { y: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        </div>

        {/* Bottom Details & Type Badges */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="w-full flex flex-col items-center text-center mt-auto z-20"
        >
          {isAshPokemon && (
            <p className="text-[10px] font-mono font-bold text-gray-400 tracking-wider mb-0.5">
              {formattedId}
            </p>
          )}

          <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-[#00E5FF] transition-colors truncate max-w-full">
            {displayName.replace('-', ' ')}
          </h3>

          {/* Type Badges */}
          <div className="flex justify-center flex-wrap gap-1.5 mt-2.5">
            {types.map((typeName) => {
              const conf = TYPE_CONFIG[typeName] || TYPE_CONFIG.normal;
              return (
                <div
                  key={typeName}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider shadow-sm ${conf.bg}`}
                >
                  <span className="text-[10px] leading-none">{conf.icon}</span>
                  <span className="leading-none">{conf.name}</span>
                </div>
              );
            })}
          </div>

          {/* Subtle Hover Action Footer */}
          <div className="mt-3 w-full pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors">
            <span className="flex items-center gap-1 font-mono text-[9px]">
              <Volume2 size={11} className="text-[#00E5FF]" /> CRY
            </span>
            <span className="flex items-center gap-0.5 text-[#00E5FF] group-hover:translate-x-0.5 transition-transform">
              DETAILS <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(PokemonCard);
