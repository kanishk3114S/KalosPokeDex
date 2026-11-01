import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Shield, 
  Award, 
  ExternalLink, 
  Info, 
  Layers, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { KALOS_CITIES } from '../constants/kalosMapData';
import { TYPE_CONFIG } from '../constants/kalosData';
import { pageVariants } from '../constants/animations';

// Performance Optimization: Lazy load the heavy 3D WebGL Canvas
const KalosScene = lazy(() => import('../components/map/KalosScene'));

const KalosMap = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';

  const [selectedCity, setSelectedCity] = useState(KALOS_CITIES[0]); // Default to Lumiose City
  const [hoveredCity, setHoveredCity] = useState(null);
  const [regionFilter, setRegionFilter] = useState('All'); // 'All', 'Central Kalos', 'Coastal Kalos', 'Mountain Kalos'

  const filteredCities = regionFilter === 'All' 
    ? KALOS_CITIES 
    : KALOS_CITIES.filter((c) => c.region === regionFilter);

  const activeGymConfig = selectedCity?.gymType ? TYPE_CONFIG[selectedCity.gymType] : null;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 pb-16 relative"
    >
      {/* 9th-Gen Kalos Telemetry Header */}
      <div className="glass rounded-3xl p-5 sm:p-7 mb-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass size={16} className="text-[#00E5FF] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
              3D Geospatial Cartography • Gen.09
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Kalos Region Interactive Topology
          </h2>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Central Kalos', 'Coastal Kalos', 'Mountain Kalos'].map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                regionFilter === r
                  ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Stage & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* 3D Map Viewport */}
        <div className="lg:col-span-8 h-[550px] sm:h-[650px] rounded-3xl overflow-hidden glass border border-white/15 relative shadow-2xl">
          {/* Top telemetry HUD inside viewport */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WebGL 3D ENGINE ACTIVE</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5FF]">ORBIT ENABLED</span>
          </div>

          {/* Controls instructions */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-400">
            <span>🖱️ Rotate: Drag</span>
            <span>•</span>
            <span>🔍 Zoom: Scroll</span>
            <span>•</span>
            <span>📍 Click: Inspect Node</span>
          </div>

          {/* Suspense fallback loader */}
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black/40">
                <div className="w-14 h-14 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
                <p className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase animate-pulse">
                  Synthesizing 3D Kalos Topology...
                </p>
              </div>
            }
          >
            <KalosScene
              selectedCity={selectedCity}
              hoveredCity={hoveredCity}
              onSelectCity={(city) => setSelectedCity(city)}
              onHoverCity={(city) => setHoveredCity(city)}
              onHoverEnd={() => setHoveredCity(null)}
              isLight={isLight}
            />
          </Suspense>
        </div>

        {/* Landmark Inspector Panel */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {selectedCity ? (
            <div className="glass rounded-3xl p-6 border border-white/15 relative overflow-hidden shadow-xl flex-1 flex flex-col">
              {/* Landmark Header */}
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider">
                    {selectedCity.region}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {selectedCity.japaneseName}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  {selectedCity.name}
                </h3>
              </div>

              {/* Gym & Badge Intelligence */}
              {selectedCity.gymLeader ? (
                <div className="my-4 p-4 rounded-2xl bg-black/25 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                      OFFICIAL KALOS GYM
                    </span>
                    {activeGymConfig && (
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase ${activeGymConfig.bg}`}>
                        <span>{activeGymConfig.icon}</span>
                        <span>{activeGymConfig.name} Type</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-mono">LEADER</span>
                      <span className="text-sm font-bold text-white">{selectedCity.gymLeader}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-mono">BADGE</span>
                      <span className="text-sm font-bold text-[#00E5FF]">{selectedCity.badge}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
                  <Info size={16} className="text-[#00E5FF] shrink-0" />
                  <span>Non-gym landmark settlement with high-tier regional significance.</span>
                </div>
              )}

              {/* Landmark Bio */}
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    PRIMARY LANDMARK
                  </span>
                  <p className="text-xs font-bold text-white">
                    {selectedCity.landmark}
                  </p>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedCity.description}
                </p>
              </div>

              {/* Connecting Routes */}
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  CONNECTING HIGHWAY NETWORK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCity.routes.map((rt) => (
                    <span
                      key={rt}
                      className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-[10px] font-mono text-gray-300 font-bold"
                    >
                      {rt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Signature Specimen Link */}
              {selectedCity.signaturePokemon && (
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 block">SIGNATURE SPECIMEN</span>
                      <span className="text-xs font-black uppercase text-white tracking-wider">
                        {selectedCity.signaturePokemon}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/pokemon/${selectedCity.signaturePokemon.toLowerCase()}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#00E5FF] hover:text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/15"
                    >
                      <span>Inspect Dex</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass rounded-3xl p-8 border border-white/15 flex flex-col items-center justify-center text-center h-full text-gray-400">
              <MapPin size={32} className="text-gray-500 mb-2" />
              <p className="text-xs font-mono uppercase">Click any beacon to access regional telemetry</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick City Carousel Selector */}
      <div className="mt-6 glass rounded-2xl p-3 border border-white/10 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-mono uppercase font-bold text-gray-400 px-3 shrink-0">
          QUICK JUMP:
        </span>
        {filteredCities.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
              selectedCity?.id === city.id
                ? 'bg-white/20 text-white border-[#00E5FF] shadow-sm'
                : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: city.beaconColor }} />
            <span>{city.name.replace(' City', '').replace(' Town', '')}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default KalosMap;
