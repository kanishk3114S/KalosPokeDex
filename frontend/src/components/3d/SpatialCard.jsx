import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * SpatialCard: Award-Winning Spatial UI Glassmorphic 3D Card
 * Features cursor parallax tracking, 3D tilt with spring physics,
 * dynamic edge specular reflection highlights, and optional Pokéball aperture trigger.
 */
export const SpatialCard = ({
  children,
  onClick,
  maxTilt = 16,
  className = '',
  enablePokeballBurst = false,
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  // Normalized mouse coordinates: -0.5 to 0.5 from center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappy spring physics for smooth, non-jittery 3D tilt
  const springConfig = { stiffness: 360, damping: 26 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse positions to 3D tilt angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic specular light reflection coordinates (0% to 100%)
  const lightX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const lightY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const lightOpacity = useTransform(smoothX, [-0.5, 0, 0.5], [0.45, 0.2, 0.45]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = (e) => {
    if (enablePokeballBurst) {
      setIsReleasing(true);
      setTimeout(() => {
        if (onClick) onClick(e);
      }, 350);
    } else {
      if (onClick) onClick(e);
    }
  };

  return (
    <div
      ref={cardRef}
      style={{ perspective: '1100px' }}
      className={`relative select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="relative rounded-3xl p-5 glass cursor-pointer border border-white/10 hover:border-[#00E5FF]/60 transition-colors duration-300 overflow-hidden shadow-xl"
      >
        {/* Dynamic Specular Edge Highlight (Light follows cursor) */}
        <motion.div
          style={{
            opacity: isHovered ? lightOpacity : 0,
            background: `radial-gradient(circle at ${lightX} ${lightY}, rgba(255, 255, 255, 0.5) 0%, rgba(0, 229, 255, 0.2) 30%, transparent 65%)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-200"
        />

        {/* Cinematic Pokéball Aperture Burst Animation */}
        {isReleasing && (
          <motion.div
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 m-auto w-32 h-32 rounded-full border-4 border-[#00E5FF] bg-gradient-to-tr from-[#00E5FF]/40 to-[#FF3366]/40 pointer-events-none z-40 shadow-[0_0_50px_#00E5FF]"
          />
        )}

        {/* 3D Content Container with Parallax Z-Depth */}
        <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default SpatialCard;
