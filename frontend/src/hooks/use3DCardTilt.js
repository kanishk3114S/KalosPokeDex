import { useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Custom hook providing smooth 3D tactile tilt physics and dynamic light reflection
 * for the 9th-Gen Kalos Pokédex cards.
 */
export function use3DCardTilt({ maxTilt = 14, springConfig = { stiffness: 300, damping: 24 } } = {}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for rotation
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Rotate axes: mouse moving up/down tilts on X axis, left/right tilts on Y axis
  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  // Dynamic holographic glare coordinates
  const glareX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothY, [0, 1], ['0%', '100%']);
  const glareOpacity = useTransform(smoothX, [0, 0.5, 1], [0.35, 0.15, 0.35]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;

    x.set(clientX / rect.width);
    y.set(clientY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return {
    rotateX,
    rotateY,
    glareX,
    glareY,
    glareOpacity,
    handleMouseMove,
    handleMouseLeave
  };
}
