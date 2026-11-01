import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { KalosTerrain } from './KalosTerrain';
import { CityMarker } from './CityMarker';
import { RouteLines } from './RouteLines';
import { KALOS_CITIES } from '../../constants/kalosMapData';

export const KalosScene = ({
  selectedCity,
  hoveredCity,
  onSelectCity,
  onHoverCity,
  onHoverEnd,
  isLight = false
}) => {
  const controlsRef = useRef();

  // Smoothly pan camera target towards selected city
  useEffect(() => {
    if (selectedCity && controlsRef.current) {
      const [x, y, z] = selectedCity.position;
      controlsRef.current.target.set(x, y + 0.2, z);
    }
  }, [selectedCity]);

  const bgColor = isLight ? '#CBD5E1' : '#0A0F1D';

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]} // Performance optimization: Cap pixel ratio to 1.5 to prevent GPU bottleneck
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 12, 28]} />

      <PerspectiveCamera makeDefault position={[0, 9.5, 12]} fov={45} />

      {/* Orbit Controls with Strict Zoom & Pan Limits */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={5.5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.25} // Restrict looking below land horizon
        minPolarAngle={Math.PI / 6}    // Restrict extreme top-down
        maxAzimuthAngle={Math.PI / 1.5}
        minAzimuthAngle={-Math.PI / 1.5}
      />

      {/* Lighting Rig */}
      <ambientLight intensity={isLight ? 0.9 : 0.45} />
      <directionalLight
        position={[8, 14, 8]}
        intensity={isLight ? 1.4 : 1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Prism Tower Central Beacon Point Light */}
      <pointLight position={[0, 2.5, 0]} intensity={1.5} color="#00E5FF" distance={10} />

      {/* Low-Poly Procedural Kalos Terrain */}
      <KalosTerrain isLight={isLight} />

      {/* Holographic Glowing Route Lines */}
      <RouteLines isLight={isLight} />

      {/* Interactive City Landmark Beacons */}
      {KALOS_CITIES.map((city) => (
        <CityMarker
          key={city.id}
          city={city}
          isSelected={selectedCity?.id === city.id}
          isHovered={hoveredCity?.id === city.id}
          onSelect={onSelectCity}
          onHover={onHoverCity}
          onHoverEnd={onHoverEnd}
        />
      ))}
    </Canvas>
  );
};

export default KalosScene;
