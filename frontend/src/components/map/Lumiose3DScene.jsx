import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  LUMIOSE_CENTER, 
  LUMIOSE_PLAZAS, 
  LUMIOSE_BOULEVARD_LANDMARKS, 
  LUMIOSE_ROUTE_GATES 
} from '../../constants/lumioseMapData';

export const Lumiose3DScene = ({
  selectedSpot,
  onSelectSpot,
  isLight = false
}) => {
  const controlsRef = useRef();

  // Color schemes
  const roadColor = isLight ? '#94A3B8' : '#1E293B';
  const blockColor = isLight ? '#CBD5E1' : '#0F172A';
  const ringColor = isLight ? '#0284C7' : '#00E5FF';
  const bgColor = isLight ? '#E2E8F0' : '#0A0F1D';

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 10, 24]} />

      <PerspectiveCamera makeDefault position={[0, 9.5, 9.5]} fov={45} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={4.5}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 6}
      />

      {/* Lighting */}
      <ambientLight intensity={isLight ? 0.9 : 0.5} />
      <directionalLight position={[6, 12, 6]} intensity={1.2} castShadow />
      <pointLight position={[0, 2.5, 0]} intensity={2.0} color="#00E5FF" distance={8} />

      {/* Base City Ground Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[5.8, 64]} />
        <meshStandardMaterial color={blockColor} roughness={0.8} />
      </mesh>

      {/* Outer Concentric Boulevard (North & South Boulevard) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[4.2, 4.9, 64]} />
        <meshStandardMaterial color={roadColor} roughness={0.6} />
      </mesh>

      {/* Inner Concentric Boulevard (Connecting Plazas) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.0, 2.6, 64]} />
        <meshStandardMaterial color={roadColor} roughness={0.6} />
      </mesh>

      {/* Centrico Plaza Inner Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.0, 32]} />
        <meshStandardMaterial color={roadColor} roughness={0.5} />
      </mesh>

      {/* 4 Radial Avenues (Estival, Autumnal, Hibernal, Vernal) */}
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((angle, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, angle]} position={[0, 0.025, 0]}>
          <planeGeometry args={[0.55, 9.6]} />
          <meshStandardMaterial color={roadColor} />
        </mesh>
      ))}

      {/* Radial River dividing North and South Lumiose */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
        <planeGeometry args={[10.6, 0.4]} />
        <meshStandardMaterial
          color={isLight ? '#0284C7' : '#00E5FF'}
          roughness={0.2}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Outer Neon Glowing City Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[5.2, 5.3, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.4} />
      </mesh>

      {/* Prism Tower (Centrico Plaza Centerpiece) */}
      <group position={[0, 0, 0]}>
        {/* Tower 4 Parisian Support Legs */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
          <mesh
            key={i}
            position={[0.35 * Math.cos(ang), 0.4, 0.35 * Math.sin(ang)]}
            rotation={[0, -ang, 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.1, 0.9, 6]} />
            <meshStandardMaterial color={isLight ? '#64748B' : '#1E293B'} metalness={0.7} />
          </mesh>
        ))}

        {/* Gym Balcony Hub */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.5, 0.2, 8]} />
          <meshStandardMaterial
            color="#FACC15"
            emissive="#EAB308"
            emissiveIntensity={0.5}
            metalness={0.4}
          />
        </mesh>

        {/* Tower Electric Spire */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <coneGeometry args={[0.3, 2.5, 6]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Sky Beam Column */}
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Centrico Plaza Label */}
        <Html position={[0, 1.3, 0]} center distanceFactor={14} className="pointer-events-none select-none">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectSpot(LUMIOSE_CENTER);
            }}
            className="cursor-pointer pointer-events-auto px-3 py-1 rounded-full bg-black/80 text-white border border-[#00E5FF] text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-cyan-500/20 hover:scale-110 transition-transform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
            <span>Prism Tower (Gym)</span>
          </div>
        </Html>
      </group>

      {/* 5 Plazas (Rouge, Magenta, Bleu, Vert, Jaune) */}
      {LUMIOSE_PLAZAS.map((plaza) => {
        const [x, y, z] = plaza.position;
        const isSelected = selectedSpot?.id === plaza.id;

        return (
          <group key={plaza.id} position={[x, y, z]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectSpot(plaza);
              }}
              position={[0, 0.1, 0]}
            >
              <cylinderGeometry args={[0.35, 0.38, 0.15, 16]} />
              <meshStandardMaterial
                color={plaza.color}
                emissive={plaza.color}
                emissiveIntensity={isSelected ? 1.0 : 0.4}
                roughness={0.3}
              />
            </mesh>

            {/* Glowing Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.42, 0.55, 24]} />
              <meshBasicMaterial color={plaza.color} transparent opacity={isSelected ? 0.9 : 0.4} />
            </mesh>

            {/* Label */}
            <Html position={[0, 0.5, 0]} center distanceFactor={15} className="pointer-events-none select-none">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSpot(plaza);
                }}
                className={`cursor-pointer pointer-events-auto px-2 py-0.5 rounded-md text-[8px] font-mono font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-md ${
                  isSelected
                    ? 'bg-white text-black ring-2 ring-[#00E5FF] scale-110'
                    : 'bg-black/75 text-gray-200 border border-white/10 hover:scale-105'
                }`}
              >
                {plaza.name}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Boulevard Landmarks (Sycamore Lab, Richissime, Museum, Battle Institute, etc.) */}
      {LUMIOSE_BOULEVARD_LANDMARKS.map((spot) => {
        const [x, y, z] = spot.position;
        const isSelected = selectedSpot?.id === spot.id;

        return (
          <group key={spot.id} position={[x, y, z]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectSpot(spot);
              }}
              position={[0, 0.15, 0]}
            >
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color={spot.color}
                emissive={spot.color}
                emissiveIntensity={isSelected ? 0.9 : 0.3}
              />
            </mesh>

            <Html position={[0, 0.45, 0]} center distanceFactor={16} className="pointer-events-none select-none">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSpot(spot);
                }}
                className={`cursor-pointer pointer-events-auto px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                  isSelected
                    ? 'bg-white text-black font-black ring-2 ring-[#00E5FF]'
                    : 'bg-black/70 text-gray-300 border border-white/10 hover:text-white'
                }`}
              >
                {spot.name}
              </div>
            </Html>
          </group>
        );
      })}

      {/* 5 Outer Route Gates (Routes 4, 5, 13, 14, 16) */}
      {LUMIOSE_ROUTE_GATES.map((gate) => {
        const [x, y, z] = gate.position;
        const isSelected = selectedSpot?.id === gate.id;

        return (
          <group key={gate.id} position={[x, y, z]}>
            {/* Gate Archway */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.5, 6]} />
              <meshStandardMaterial
                color={gate.color}
                emissive={gate.color}
                emissiveIntensity={isSelected ? 0.8 : 0.3}
              />
            </mesh>

            <Html position={[0, 0.7, 0]} center distanceFactor={16} className="pointer-events-none select-none">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSpot(gate);
                }}
                className="cursor-pointer pointer-events-auto px-2.5 py-1 rounded-xl bg-black/85 text-white border border-white/20 text-[8px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-md hover:border-[#00E5FF]"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gate.color }} />
                <span>{gate.name}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </Canvas>
  );
};

export default Lumiose3DScene;
