/**
 * Centralized Framer Motion Animation Variants & Spring Configurations
 * Designed for the futuristic 9th-Gen Kalos Pokédex aesthetic.
 */

export const springPhysics = {
  soft: { type: 'spring', stiffness: 200, damping: 25 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  bouncy: { type: 'spring', stiffness: 350, damping: 15 },
  float: {
    repeat: Infinity,
    repeatType: 'reverse',
    duration: 3,
    ease: 'easeInOut'
  }
};

// Page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren'
    }
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Stagger container for Pokédex grid items
export const staggerGridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  }
};

// Staggered grid card item
export const gridCardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
};

// Modal backdrop & content variants
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.25 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalDialogVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 24
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 26
    }
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: {
      duration: 0.18,
      ease: 'easeIn'
    }
  }
};

// Subtle holographic radar pulse
export const holoGlowVariants = {
  initial: { opacity: 0.4, scale: 0.98 },
  animate: {
    opacity: [0.4, 0.75, 0.4],
    scale: [0.98, 1.02, 0.98],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Floating element (Anti-gravity levitation)
export const antiGravityFloat = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Stat progress bar animation
export const statBarVariants = {
  initial: { width: 0 },
  animate: (customWidth) => ({
    width: `${customWidth}%`,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1
    }
  })
};

// Micro-interaction button bounce
export const buttonTapSpring = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 20 }
};
