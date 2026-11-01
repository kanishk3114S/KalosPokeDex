import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Configuration for type-reactive particles
 */
const TYPE_PARTICLE_PRESETS = {
  fire: {
    count: 320,
    colors: ['#FF3300', '#FF6600', '#FFAA00', '#FF0055'],
    speed: 1.8,
    size: 0.12,
    motion: 'rise_turbulence',
    glowIntensity: 2.2
  },
  water: {
    count: 260,
    colors: ['#00E5FF', '#0284C7', '#38BDF8', '#E0F2FE'],
    speed: 0.7,
    size: 0.16,
    motion: 'buoyant_bob',
    glowIntensity: 1.5
  },
  electric: {
    count: 280,
    colors: ['#FACC15', '#00E5FF', '#FEF08A', '#FFFFFF'],
    speed: 3.2,
    size: 0.1,
    motion: 'spark_jitter',
    glowIntensity: 3.0
  },
  grass: {
    count: 240,
    colors: ['#10B981', '#84CC16', '#34D399', '#A7F3D0'],
    speed: 0.6,
    size: 0.15,
    motion: 'leaf_sway',
    glowIntensity: 1.4
  },
  ice: {
    count: 260,
    colors: ['#67E8F9', '#A5F3FC', '#E0F2FE', '#FFFFFF'],
    speed: 0.8,
    size: 0.14,
    motion: 'snow_flutter',
    glowIntensity: 1.6
  },
  ghost: {
    count: 300,
    colors: ['#8B5CF6', '#C084FC', '#6366F1', '#312E81'],
    speed: 0.9,
    size: 0.18,
    motion: 'vortex_swirl',
    glowIntensity: 2.4
  },
  psychic: {
    count: 280,
    colors: ['#EC4899', '#F472B6', '#A855F7', '#DDD6FE'],
    speed: 1.1,
    size: 0.15,
    motion: 'vortex_swirl',
    glowIntensity: 2.2
  },
  dragon: {
    count: 280,
    colors: ['#6366F1', '#4F46E5', '#A855F7', '#00E5FF'],
    speed: 1.4,
    size: 0.16,
    motion: 'helix_orbit',
    glowIntensity: 2.5
  },
  fairy: {
    count: 260,
    colors: ['#F472B6', '#FBCFE8', '#FDE047', '#FFFFFF'],
    speed: 0.8,
    size: 0.14,
    motion: 'sparkle_drift',
    glowIntensity: 2.0
  },
  default: {
    count: 220,
    colors: ['#00E5FF', '#38BDF8', '#64748B', '#FFFFFF'],
    speed: 0.6,
    size: 0.12,
    motion: 'holo_drift',
    glowIntensity: 1.5
  }
};

/**
 * Instanced Particle Core (Single Draw Call for Maximum 60FPS Performance)
 */
function ParticleField({ type = 'default' }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const config = TYPE_PARTICLE_PRESETS[type?.toLowerCase()] || TYPE_PARTICLE_PRESETS.default;

  // Initialize particles physics arrays
  const particles = useMemo(() => {
    const temp = [];
    const colorChoices = config.colors.map((c) => new THREE.Color(c));

    for (let i = 0; i < config.count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 24,
        y: (Math.random() - 0.5) * 16,
        z: (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() * 0.04 + 0.01) * config.speed,
        vz: (Math.random() - 0.5) * 0.02,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        scale: Math.random() * 0.6 + 0.5,
        phase: Math.random() * Math.PI * 2,
        color: colorChoices[i % colorChoices.length]
      });
    }
    return temp;
  }, [type, config]);

  // Set initial colors on the InstancedMesh
  useEffect(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      meshRef.current.setColorAt(i, p.color);
    });
    meshRef.current.instanceColor.needsUpdate = true;
  }, [particles]);

  // Per-frame physics simulation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const motion = config.motion;

    for (let i = 0; i < config.count; i++) {
      const p = particles[i];

      // Motion physics simulation by type
      if (motion === 'rise_turbulence') {
        // Fire embers: rapid rise with horizontal heat curl turbulence
        p.y += p.vy * (1 + 0.3 * Math.sin(time * 3 + p.phase));
        p.x += Math.sin(time * 2 + p.phase) * 0.025;
        p.z += Math.cos(time * 2 + p.phase) * 0.015;
        p.rotX += delta * 2;
        p.rotY += delta * 1.5;

        // Reset if passed ceiling
        if (p.y > 9) {
          p.y = -8;
          p.x = (Math.random() - 0.5) * 20;
          p.z = (Math.random() - 0.5) * 10;
        }
      } else if (motion === 'buoyant_bob') {
        // Water bubbles: gentle sinusoidal buoyant bobbing
        p.y += p.vy * 0.7;
        p.x += Math.sin(time + p.phase) * 0.012;
        p.rotZ += delta * 0.5;

        if (p.y > 9) p.y = -8;
      } else if (motion === 'spark_jitter') {
        // Electric sparks: high frequency jittery jumps
        p.x += (Math.random() - 0.5) * 0.12;
        p.y += (Math.random() - 0.5) * 0.12;
        p.z += (Math.random() - 0.5) * 0.08;
        p.rotX += delta * 5;

        if (Math.abs(p.x) > 12) p.x *= -0.8;
        if (Math.abs(p.y) > 9) p.y *= -0.8;
      } else if (motion === 'vortex_swirl') {
        // Ghost/Psychic: rotational vortex around z-axis
        const r = Math.sqrt(p.x * p.x + p.y * p.y) + 0.001;
        const theta = Math.atan2(p.y, p.x) + 0.015 * config.speed;
        p.x = r * Math.cos(theta);
        p.y = r * Math.sin(theta);
        p.z += Math.sin(time + p.phase) * 0.01;
      } else if (motion === 'snow_flutter') {
        // Ice: gentle diagonal descent with tumbling
        p.y -= p.vy * 0.8;
        p.x += Math.sin(time * 1.5 + p.phase) * 0.02;
        p.rotX += delta * 0.8;
        p.rotY += delta * 1.2;

        if (p.y < -9) p.y = 9;
      } else {
        // Holo / Grass default: tranquil cosmic drift
        p.y += p.vy * 0.8;
        p.x += Math.cos(time * 0.8 + p.phase) * 0.01;
        p.rotY += delta * 0.8;

        if (p.y > 9) p.y = -8;
      }

      // Update instanced transformation matrix
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, 0);

      const dynamicScale = p.scale * config.size * (1 + 0.15 * Math.sin(time * 2 + p.phase));
      dummy.scale.set(dynamicScale, dynamicScale, dynamicScale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, config.count]}
      frustumCulled={false}
    >
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/**
 * Fullscreen / Viewport Adaptive WebGL Particle Background Environment
 */
export const ParticleEnvironment = ({ type = 'default', className = '' }) => {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false
        }}
      >
        <ParticleField type={type} />
      </Canvas>
    </div>
  );
};

export default ParticleEnvironment;
