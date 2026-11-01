import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  LogOut, 
  User, 
  Sun, 
  Moon, 
  Sparkles, 
  Menu, 
  X, 
  Layers, 
  Shield, 
  GitCompare 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isShiny, setIsShiny, themeMode, cycleTheme } = useTheme();
  const { user, isGuest, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Kalos Roster', icon: Layers },
    { path: '/mega-dex', label: 'Mega Dex', icon: Sparkles },
    { path: '/team-builder', label: 'Team Builder', icon: Shield },
    { path: '/compare', label: 'Compare', icon: GitCompare }
  ];

  const getThemeIcon = () => {
    if (themeMode === 'light') return <Sun size={14} className="text-amber-400" />;
    if (themeMode === 'pitch-black') return <Moon size={14} className="text-purple-400" />;
    return <Moon size={14} className="text-[#00E5FF]" />;
  };

  const getThemeLabel = () => {
    if (themeMode === 'light') return 'Lumiose Light';
    if (themeMode === 'pitch-black') return 'Pitch Black';
    return 'Deep Blue';
  };

  const trainerName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Trainer';

  return (
    <nav className="glass sticky top-0 z-50 mb-6 backdrop-blur-xl border-b border-white/10 transition-colors">
      {/* Top Telemetry / Status Ticker */}
      <div className="w-full text-center py-1 bg-black/40 border-b border-white/5 flex items-center justify-between px-6 text-[10px] font-mono tracking-widest text-gray-400 uppercase overflow-hidden">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">ONLINE</span>
          <span className="text-gray-500">• KALOS NET SYS-09</span>
        </div>
        <div className="mx-auto flex items-center gap-1.5 font-bold">
          <span className="text-gray-400">KALOS DEX</span>
          <span className="text-[#00E5FF]">•</span>
          <span className="text-gray-300">9TH-GEN HOLO-CASTER TERMINAL</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <span>{isGuest ? 'MODE: GUEST BROWSE' : `ID: ${trainerName.toUpperCase()}`}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center gap-4">
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 relative flex items-center justify-center">
            {/* Holographic glowing ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00E5FF]/30 to-[#FF3366]/30 blur-md group-hover:scale-125 transition-transform duration-500" />
            
            {/* Pokeball SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full relative z-10 group-hover:rotate-180 transition-transform duration-500 ease-in-out drop-shadow-[0_0_12px_rgba(0,229,255,0.5)]"
            >
              <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#0F172A" strokeWidth="7" />
              <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#ef4444" stroke="#0F172A" strokeWidth="7" strokeLinejoin="round" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="#0F172A" strokeWidth="7" />
              <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#0F172A" strokeWidth="7" />
              <circle cx="50" cy="50" r="7" fill="#00E5FF" className="animate-pulse" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF]">GEN.09</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FF3366]/20 text-[#FF3366] font-bold border border-[#FF3366]/30">KALOS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#00E5FF] leading-none">
              THE MEGA WORLD
            </h1>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-black/30 p-1.5 rounded-full border border-white/10 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-blue-600/30 border border-[#00E5FF]/50 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={14} className={isActive ? 'text-[#00E5FF]' : 'text-gray-400'} />
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Authentication */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Mode Cycler */}
          <button
            onClick={cycleTheme}
            title={`Current: ${getThemeLabel()} (Click to toggle)`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-[#00E5FF]/50 text-gray-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            {getThemeIcon()}
            <span className="hidden xl:inline text-[11px]">{getThemeLabel()}</span>
          </button>

          {/* Shiny View Toggle */}
          <button
            onClick={() => setIsShiny(!isShiny)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              isShiny
                ? 'border-yellow-400/60 bg-yellow-400/15 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/30'
            }`}
          >
            <Sparkles size={14} className={isShiny ? 'text-yellow-400 animate-spin' : 'text-gray-400'} />
            <span className="text-[11px]">{isShiny ? 'Shiny On' : 'Shiny'}</span>
          </button>

          {/* Authentication Section (Guest-First) */}
          {isGuest ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAuthModal('Log in to save custom teams and sync favorites')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all cursor-pointer"
            >
              <LogIn size={14} />
              <span>Login</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200 font-bold">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#FF3366] flex items-center justify-center text-[10px] text-black font-black">
                  {trainerName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate">{trainerName}</span>
              </div>
              <button
                onClick={logout}
                title="Logout Trainer"
                className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-red-400 hover:border-red-400/40 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex sm:hidden items-center gap-2">
          {isGuest ? (
            <button
              onClick={() => openAuthModal()}
              className="px-3 py-1 rounded-full bg-[#00E5FF] text-black text-xs font-black uppercase tracking-wider"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="p-1.5 rounded-full border border-white/15 text-gray-300"
            >
              <LogOut size={14} />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass border border-white/15 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-white/10 bg-black/80 backdrop-blur-2xl px-6 py-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                      isActive
                        ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
                        : 'border-white/10 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={cycleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-300"
              >
                {getThemeIcon()}
                <span>{getThemeLabel()}</span>
              </button>

              <button
                onClick={() => setIsShiny(!isShiny)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${
                  isShiny ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300' : 'border-white/10 text-gray-300'
                }`}
              >
                <Sparkles size={14} />
                <span>{isShiny ? 'Shiny On' : 'Shiny Off'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
