import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, RotateCcw, Maximize2, User, Scale } from 'lucide-react';

/**
 * 3D Holographic Human Trainer (1.70m / 5'7" reference model)
 */
function TrainerHologram() {
  return (
    <group position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#00E5FF" wireframe emissive="#00E5FF" emissiveIntensity={0.6} />
      </mesh>
      {/* Trainer Cap Visor */}
      <mesh position={[0, 1.63, 0.06]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.16, 0.03, 0.12]} />
        <meshStandardMaterial color="#FF3366" emissive="#FF3366" emissiveIntensity={0.4} />
      </mesh>
      {/* Torso & Jacket */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.16, 0.14, 0.55, 12]} />
        <meshStandardMaterial color="#38BDF8" wireframe emissive="#38BDF8" emissiveIntensity={0.4} />
      </mesh>
      {/* Backpack */}
      <mesh position={[0, 1.22, -0.14]}>
        <boxGeometry args={[0.22, 0.32, 0.12]} />
        <meshStandardMaterial color="#F59E0B" wireframe emissive="#F59E0B" emissiveIntensity={0.3} />
      </mesh>
      {/* Left & Right Legs */}
      <mesh position={[-0.08, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.82, 8]} />
        <meshStandardMaterial color="#0284C7" wireframe emissive="#0284C7" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.08, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.82, 8]} />
        <meshStandardMaterial color="#0284C7" wireframe emissive="#0284C7" emissiveIntensity={0.3} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.08, 0.04, 0.04]}>
        <boxGeometry args={[0.08, 0.08, 0.16]} />
        <meshStandardMaterial color="#FF3366" />
      </mesh>
      <mesh position={[0.08, 0.04, 0.04]}>
        <boxGeometry args={[0.08, 0.08, 0.16]} />
        <meshStandardMaterial color="#FF3366" />
      </mesh>

      {/* Holographic Base Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 1.7m Reference Label */}
      <Billboard position={[0, 1.88, 0]}>
        <Text fontSize={0.14} color="#00E5FF" font={undefined}>
          Trainer (1.70m)
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * True-Scale Pokémon 3D Volumetric Avatar
 * Scaled mathematically using PokeAPI height (decimetres -> metres)
 */
function PokemonScaleAvatar({ pokemon, position = [-1.8, 0, 0], color = '#FF3366' }) {
  const meshRef = useRef();
  
  // Height in meters from PokeAPI (height in decimetres: 10 dm = 1.0 m)
  const heightMeters = useMemo(() => {
    if (!pokemon) return 1.0;
    if (typeof pokemon.heightMeters === 'number') return pokemon.heightMeters;
    if (typeof pokemon.height === 'number') {
      return pokemon.height <= 25 ? pokemon.height : pokemon.height / 10;
    }
    return 1.0;
  }, [pokemon]);

  const weightKg = useMemo(() => {
    if (!pokemon) return 10.0;
    if (typeof pokemon.weightKg === 'number') return pokemon.weightKg;
    if (typeof pokemon.weight === 'number') {
      return pokemon.weight <= 2000 ? pokemon.weight : pokemon.weight / 10;
    }
    return 10.0;
  }, [pokemon]);

  // Load sprite texture
  const texture = useMemo(() => {
    if (!pokemon) return null;
    const loader = new THREE.TextureLoader();
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
    return loader.load(spriteUrl);
  }, [pokemon]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = (heightMeters / 2) + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.03;
    }
  });

  if (!pokemon) return null;

  return (
    <group position={position}>
      {/* 3D Vertical Laser Measurement Ruler */}
      <group position={[heightMeters * 0.45 + 0.35, 0, 0]}>
        <mesh position={[0, heightMeters / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, heightMeters, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        <mesh position={[-0.1, heightMeters, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Volumetric Billboard Specimen Standee */}
      <Billboard ref={meshRef} position={[0, heightMeters / 2, 0]}>
        <planeGeometry args={[heightMeters * 0.9, heightMeters]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.15}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.4}
        />
      </Billboard>

      {/* Base Holographic Metric Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[heightMeters * 0.35, heightMeters * 0.45, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Specimen Telemetry Label */}
      <Billboard position={[0, heightMeters + 0.32, 0]}>
        <Text fontSize={0.16} color="#FFFFFF" font={undefined}>
          {pokemon.name.toUpperCase()}
        </Text>
        <Text position={[0, -0.16, 0]} fontSize={0.12} color={color} font={undefined}>
          {heightMeters.toFixed(2)}m • {weightKg.toFixed(1)}kg
        </Text>
      </Billboard>
    </group>
  );
}

/**
 * Stage Floor with Laser Grid & Concentric Metre Range Markers
 */
function LaserArenaFloor() {
  const circles = [1, 2, 3, 5, 8];

  return (
    <group position={[0, 0, 0]}>
      {/* Main Metallic Stage Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          color="#0B1120"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Cybernetic Wireframe Grid */}
      <gridHelper args={[16, 32, '#00E5FF', '#1E293B']} position={[0, 0.005, 0]} />

      {/* Concentric Range Rings */}
      {circles.map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[r - 0.02, r + 0.02, 64]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Dedicated TrueScaleArena 3D Component
 */
export const TrueScaleArena = ({ pokemon1, pokemon2, className = '' }) => {
  const controlsRef = useRef();
  const [cameraMode, setCameraMode] = useState('frontal');

  // Camera presets
  const setEyeLevelView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.object.position.set(0, 1.7, 4.2);
    controlsRef.current.target.set(0, 1.5, 0);
    setCameraMode('eye');
  };

  const setFrontalView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.object.position.set(0, 2.5, 6.8);
    controlsRef.current.target.set(0, 1.2, 0);
    setCameraMode('frontal');
  };

  const setAerialView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    controlsRef.current.object.position.set(0, 8.5, 5.0);
    controlsRef.current.target.set(0, 0, 0);
    setCameraMode('aerial');
  };

  const getSafeHeight = (p) => {
    if (!p) return 1.0;
    if (typeof p.heightMeters === 'number') return p.heightMeters;
    if (typeof p.height === 'number') return p.height <= 25 ? p.height : p.height / 10;
    return 1.0;
  };
  const h1 = pokemon1 ? Number(getSafeHeight(pokemon1).toFixed(2)) : null;
  const h2 = pokemon2 ? Number(getSafeHeight(pokemon2).toFixed(2)) : null;

  return (
    <div className={`relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden glass border border-white/15 shadow-2xl ${className}`}>
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-300 shadow-md">
          <Scale size={14} className="text-[#00E5FF]" />
          <span className="font-bold uppercase tracking-wider">True-Scale Spatial Room</span>
        </div>
      </div>

      {/* Camera Preset Switches */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-2xl border border-white/10">
        <button
          onClick={setFrontalView}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase cursor-pointer transition-all ${
            cameraMode === 'frontal' ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={setEyeLevelView}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase cursor-pointer transition-all flex items-center gap-1 ${
            cameraMode === 'eye' ? 'bg-[#FF3366] text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye size={12} />
          <span>Trainer POV (1.7m)</span>
        </button>
        <button
          onClick={setAerialView}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase cursor-pointer transition-all ${
            cameraMode === 'aerial' ? 'bg-[#00E5FF] text-black shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Aerial
        </button>
      </div>

      {/* Bottom Live Metric Comparison HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/80 backdrop-blur-md p-3.5 sm:px-6 rounded-2xl border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {pokemon1 && (
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">{pokemon1.name}</span>
              <span className="text-sm font-black text-[#00E5FF]">{h1}m ({Math.round((h1 / 1.7) * 100)}% Trainer Height)</span>
            </div>
          )}
          <span className="text-gray-600 hidden sm:inline">•</span>
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block uppercase">Reference Trainer</span>
            <span className="text-sm font-black text-gray-200">1.70m (5'7")</span>
          </div>
          {pokemon2 && (
            <>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">{pokemon2.name}</span>
                <span className="text-sm font-black text-[#FF3366]">{h2}m ({Math.round((h2 / 1.7) * 100)}% Trainer Height)</span>
              </div>
            </>
          )}
        </div>

        <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
          <span>🖱️ Click & Drag to inspect 360°</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.5, 6.8], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070B14']} />
        <fog attach="fog" args={['#070B14', 10, 24]} />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={2.5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 8}
        />

        {/* Studio Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} castShadow />
        <pointLight position={[0, 4, 0]} intensity={1.8} color="#00E5FF" distance={10} />

        {/* Laser Grid Floor */}
        <LaserArenaFloor />

        {/* Center Human Reference Hologram */}
        <TrainerHologram />

        {/* Left Specimen */}
        {pokemon1 && (
          <PokemonScaleAvatar
            pokemon={pokemon1}
            position={[-2.0, 0, 0]}
            color="#00E5FF"
          />
        )}

        {/* Right Specimen */}
        {pokemon2 && (
          <PokemonScaleAvatar
            pokemon={pokemon2}
            position={[2.0, 0, 0]}
            color="#FF3366"
          />
        )}
      </Canvas>
    </div>
  );
};

export default TrueScaleArena;
