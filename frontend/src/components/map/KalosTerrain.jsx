import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Procedural low-poly terrain representation of the star-shaped Kalos region.
 * Optimized with vertex displacement and low polygon counts to prevent frame drops.
 */
export const KalosTerrain = ({ isLight = false }) => {
  // Generate low-poly displaced star geometry
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 16, 32, 32);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from center
      const dist = Math.sqrt(x * x + z * z);
      
      // Calculate 5-lobed star mask for Kalos geographical outline
      const angle = Math.atan2(z, x);
      const starRadius = 5.8 + 1.6 * Math.cos(5 * angle);

      if (dist > starRadius) {
        // Deep ocean depression
        pos.setY(i, -0.6);
      } else {
        // Continental elevation: mountainous in east (Anistar/Snowbelle), coastal shelf in west
        let height = 0.15;
        // Mountain peaks in East and South-East
        if (x > 1.5 && z > -2.0) {
          height += 0.45 * Math.sin((x - 1) * 0.8) * Math.cos(z * 0.6);
        }
        // Coastal gradient in West
        if (x < -2.0) {
          height += 0.1 * Math.sin(z * 0.5);
        }
        // Central plateau for Lumiose
        if (dist < 2.0) {
          height = 0.2 + 0.05 * Math.cos(dist * 1.5);
        }
        pos.setY(i, Math.max(0, height));
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const oceanGeometry = useMemo(() => new THREE.PlaneGeometry(30, 30), []);

  const landColor = isLight ? '#E2E8F0' : '#0F172A';
  const wireColor = isLight ? '#94A3B8' : '#00E5FF';
  const oceanColor = isLight ? '#CBD5E1' : '#060B14';

  return (
    <group>
      {/* Surrounding Ocean / Coastal Shelf */}
      <mesh geometry={oceanGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <meshStandardMaterial
          color={oceanColor}
          roughness={0.7}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Kalos Continental Low-Poly Landmass */}
      <mesh geometry={terrainGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color={landColor}
          roughness={0.85}
          metalness={0.15}
          flatShading
        />
      </mesh>

      {/* Holographic Geospatial Wireframe Accent */}
      <mesh geometry={terrainGeometry} position={[0, 0.02, 0]}>
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={isLight ? 0.08 : 0.15}
        />
      </mesh>

      {/* Lumiose City Prism Tower Landmark */}
      <group position={[0, 0.25, 0]}>
        {/* Tower Spire */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <coneGeometry args={[0.35, 2.4, 4]} />
          <meshStandardMaterial
            color={isLight ? '#0284C7' : '#00E5FF'}
            roughness={0.2}
            metalness={0.8}
            emissive={isLight ? '#0284C7' : '#00E5FF'}
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Base Foundation */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.6, 0.8, 0.2, 8]} />
          <meshStandardMaterial color={isLight ? '#94A3B8' : '#1E293B'} />
        </mesh>
        {/* Beacon Light Column */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3, 8]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Anistar Cosmic Sundial Pink Crystal Spire */}
      <group position={[4.4, 0.45, -1.2]}>
        <mesh rotation={[0.2, 0.4, 0.3]} castShadow>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color="#EC4899"
            emissive="#EC4899"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Shalour City Tower of Mastery Landmark */}
      <group position={[-4.6, 0.4, -2.2]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 1.2, 6]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={0.3}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
};
