import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isShiny, setIsShiny, isDarkMode, setIsDarkMode } = useTheme();

  return (
    <nav className="glass sticky top-0 z-50 mb-8 backdrop-blur-xl border-b border-white/5 bg-[#0A0F1D]/60">
      {/* Absolute top-most line */}
      <div className="w-full text-center py-1.5 bg-black/30 border-b border-white/5">
        <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
          Kalos Dex <span className="text-[#00E5FF]">"</span>One step ahead of mega evolution<span className="text-[#00E5FF]">"</span>
        </p>
      </div>

      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo & Branding */}
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 relative flex items-center justify-center">
            {/* Authentic Pokeball SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full group-hover:rotate-180 transition-transform duration-300 ease-in-out drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#1f2937" strokeWidth="8" />
              <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#ef4444" stroke="#1f2937" strokeWidth="8" strokeLinejoin="round" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="#1f2937" strokeWidth="8" />
              <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#1f2937" strokeWidth="8" />
              <circle cx="50" cy="50" r="6" fill="#1f2937" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] py-0.5 leading-none drop-shadow-md">
              THE MEGA WORLD
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 bg-black/20 px-6 py-2.5 rounded-full border border-white/5">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              location.pathname === '/dashboard' ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Roster
          </button>
          <button 
            onClick={() => navigate('/mega-dex')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              location.pathname === '/mega-dex' ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            MegaDex
          </button>
          <button 
            onClick={() => navigate('/team-builder')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
              location.pathname === '/team-builder' ? 'text-[#00E5FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Team Builder
          </button>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-4">
          {/* Dark / Pitch-Black Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-200 hover:border-[#00E5FF] transition-all cursor-pointer group"
          >
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isDarkMode ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'bg-gray-500'
            }`}></div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {isDarkMode ? 'Pitch Black' : 'Deep Blue'}
            </span>
          </button>

          {/* Shiny View Toggle */}
          <button 
            onClick={() => setIsShiny(!isShiny)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-200 hover:border-yellow-400 transition-all cursor-pointer group"
          >
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isShiny ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-gray-500'
            }`}></div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {isShiny ? '✨ Shiny On' : '⭐ Shiny Off'}
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;