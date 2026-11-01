import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export const CityMarker = ({
  city,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onHoverEnd
}) => {
  const pulseRef = useRef();

  useFrame((state, delta) => {
    if (pulseRef.current) {
      pulseRef.current.rotation.y += delta * 1.5;
      const s = 1 + 0.15 * Math.sin(state.clock.elapsedTime * 4);
      pulseRef.current.scale.set(s, s, s);
    }
  });

  const [x, y, z] = city.position;
  const color = city.beaconColor || '#00E5FF';

  return (
    <group position={[x, y, z]}>
      {/* 3D Clickable Marker Node */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(city);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(city);
        }}
        onPointerOut={() => onHoverEnd()}
        position={[0, 0.25, 0]}
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#FFFFFF' : color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Holographic Radar Pulse Ring */}
      <mesh
        ref={pulseRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <ringGeometry args={[0.28, 0.42, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Holographic Light Pillar */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 1.2, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.6 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2D Projected Screen Label */}
      <Html
        position={[0, 0.65, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
        className="pointer-events-none select-none transition-transform duration-200"
      >
        <div
          className={`flex flex-col items-center px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md whitespace-nowrap transition-all shadow-md ${
            isSelected
              ? 'bg-white text-black ring-2 ring-[#00E5FF] scale-110'
              : isHovered
              ? 'bg-black/85 text-white ring-1 ring-white/40 scale-105'
              : 'bg-black/60 text-gray-200 border border-white/10'
          }`}
        >
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{city.name}</span>
          </div>
          {city.badge && (
            <span className="text-[8px] font-mono text-[#00E5FF] mt-0.5 opacity-90">
              {city.badge}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
};
