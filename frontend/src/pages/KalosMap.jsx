import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Building2, 
  Sparkles, 
  ExternalLink, 
  Info, 
  Layers, 
  Navigation,
  Car
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { KALOS_CITIES } from '../constants/kalosMapData';
import { 
  LUMIOSE_CENTER, 
  LUMIOSE_PLAZAS, 
  LUMIOSE_AVENUES, 
  LUMIOSE_BOULEVARD_LANDMARKS, 
  LUMIOSE_ROUTE_GATES 
} from '../constants/lumioseMapData';
import { TYPE_CONFIG } from '../constants/kalosData';
import { pageVariants } from '../constants/animations';

// Lazy load both heavy 3D WebGL Canvases
const KalosScene = lazy(() => import('../components/map/KalosScene'));
const Lumiose3DScene = lazy(() => import('../components/map/Lumiose3DScene'));

const KalosMap = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';

  // Map Mode: 'lumiose' (diagram-accurate city map) vs 'kalos' (regional 3D map)
  const [mapMode, setMapMode] = useState('lumiose');

  // Kalos Region state
  const [selectedCity, setSelectedCity] = useState(KALOS_CITIES[0]);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [regionFilter, setRegionFilter] = useState('All');

  // Lumiose City state
  const [selectedSpot, setSelectedSpot] = useState(LUMIOSE_CENTER);

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
            {mapMode === 'lumiose' ? 'Lumiose City Urban Terminal' : 'Kalos Regional Topology'}
          </h2>
        </div>

        {/* View Mode Switcher: Lumiose City vs Kalos Region */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setMapMode('lumiose')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              mapMode === 'lumiose'
                ? 'bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black shadow-lg shadow-cyan-500/25'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Building2 size={14} />
            <span>Lumiose City Metro</span>
          </button>

          <button
            onClick={() => setMapMode('kalos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              mapMode === 'kalos'
                ? 'bg-gradient-to-r from-[#FF3366] to-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Navigation size={14} />
            <span>Kalos Region 3D</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport Stage & Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* 3D Map Viewport */}
        <div className="lg:col-span-8 h-[550px] sm:h-[650px] rounded-3xl overflow-hidden glass border border-white/15 relative shadow-2xl">
          {/* Top HUD Telemetry */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{mapMode === 'lumiose' ? 'LUMIOSE METRO GRID ACTIVE' : 'KALOS TERRAIN ENGINE'}</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#00E5FF]">ORBIT ENABLED</span>
          </div>

          {/* Quick HUD Tip */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-400">
            <span>🖱️ Rotate: Drag</span>
            <span>•</span>
            <span>🔍 Zoom: Scroll</span>
            <span>•</span>
            <span>📍 Click Node: Telemetry</span>
          </div>

          {/* Render Suspenseful 3D Scene */}
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black/40">
                <div className="w-14 h-14 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
                <p className="text-xs font-mono font-bold tracking-[0.25em] text-[#00E5FF] uppercase animate-pulse">
                  Synthesizing 3D Coordinates...
                </p>
              </div>
            }
          >
            {mapMode === 'lumiose' ? (
              <Lumiose3DScene
                selectedSpot={selectedSpot}
                onSelectSpot={(spot) => setSelectedSpot(spot)}
                isLight={isLight}
              />
            ) : (
              <KalosScene
                selectedCity={selectedCity}
                hoveredCity={hoveredCity}
                onSelectCity={(city) => setSelectedCity(city)}
                onHoverCity={(city) => setHoveredCity(city)}
                onHoverEnd={() => setHoveredCity(null)}
                isLight={isLight}
              />
            )}
          </Suspense>
        </div>

        {/* Telemetry Inspector Panel */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {mapMode === 'lumiose' ? (
            /* Lumiose City Spot Inspector */
            <div className="glass rounded-3xl p-6 border border-white/15 shadow-xl flex-1 flex flex-col">
              <div className="pb-4 border-b border-white/10">
                <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider block mb-1">
                  LUMIOSE METROPOLITAN SECTOR • {selectedSpot?.category || 'Landmark'}
                </span>
                <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                  {selectedSpot?.name}
                </h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed my-4">
                {selectedSpot?.description}
              </p>

              {/* Plaza Spots or Facilities */}
              {selectedSpot?.spots && (
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    ESTABLISHMENTS & ATTRACTIONS
                  </span>
                  <div className="space-y-1.5">
                    {selectedSpot.spots.map((spotName, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-xl bg-black/25 border border-white/10 text-xs font-bold text-white flex items-center gap-2"
                      >
                        <Sparkles size={12} className="text-[#00E5FF]" />
                        <span>{spotName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features / Highlights */}
              {selectedSpot?.features && (
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    SECTOR INTELLIGENCE
                  </span>
                  <div className="space-y-1.5">
                    {selectedSpot.features.map((feat, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-xl bg-black/25 border border-white/10 text-xs font-bold text-[#00E5FF] flex items-center gap-2"
                      >
                        <Info size={12} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gate destination link */}
              {selectedSpot?.destination && (
                <div className="p-3.5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold mb-4">
                  Exits directly to: {selectedSpot.destination}
                </div>
              )}

              {/* Lumiose Taxi Fast Travel */}
              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Car size={16} className="text-yellow-400" />
                  <span>Gogoat Shuttle / Lumi Cab</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">Available</span>
              </div>
            </div>
          ) : (
            /* Regional Kalos City Inspector */
            <div className="glass rounded-3xl p-6 border border-white/15 shadow-xl flex-1 flex flex-col">
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

              {selectedCity.gymLeader && (
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
              )}

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {selectedCity.description}
              </p>

              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  HIGHWAY NETWORK
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

              {selectedCity.signaturePokemon && (
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
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
                    <span>Inspect</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="mt-6 glass rounded-2xl p-3 border border-white/10 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-mono uppercase font-bold text-gray-400 px-3 shrink-0">
          {mapMode === 'lumiose' ? 'SECTORS:' : 'REGIONAL NODES:'}
        </span>

        {mapMode === 'lumiose' ? (
          <>
            <button
              onClick={() => setSelectedSpot(LUMIOSE_CENTER)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase shrink-0 transition-all cursor-pointer border ${
                selectedSpot?.id === LUMIOSE_CENTER.id ? 'bg-[#00E5FF] text-black border-[#00E5FF]' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              Prism Tower
            </button>
            {LUMIOSE_PLAZAS.map((plz) => (
              <button
                key={plz.id}
                onClick={() => setSelectedSpot(plz)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedSpot?.id === plz.id ? 'bg-white/20 text-white border-white' : 'bg-white/5 text-gray-300 border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: plz.color }} />
                <span>{plz.name}</span>
              </button>
            ))}
            {LUMIOSE_ROUTE_GATES.map((gate) => (
              <button
                key={gate.id}
                onClick={() => setSelectedSpot(gate)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase shrink-0 transition-all cursor-pointer border ${
                  selectedSpot?.id === gate.id ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]' : 'bg-white/5 text-gray-400 border-white/5'
                }`}
              >
                {gate.name}
              </button>
            ))}
          </>
        ) : (
          filteredCities.map((city) => (
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
          ))
        )}
      </div>
    </motion.div>
  );
};

export default KalosMap;
