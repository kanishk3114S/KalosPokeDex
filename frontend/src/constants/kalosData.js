/**
 * Type configurations and Kalos regional metadata
 */

export const TYPE_CONFIG = {
  normal: { 
    name: 'Normal', 
    color: 'from-stone-500 to-stone-600', 
    bg: 'bg-stone-500/20 text-stone-200 border-stone-500/40', 
    glow: 'rgba(168, 162, 158, 0.4)',
    icon: '⏺️' 
  },
  fire: { 
    name: 'Fire', 
    color: 'from-orange-500 to-red-600', 
    bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', 
    glow: 'rgba(249, 115, 22, 0.45)',
    icon: '🔥' 
  },
  water: { 
    name: 'Water', 
    color: 'from-blue-500 to-cyan-600', 
    bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', 
    glow: 'rgba(59, 130, 246, 0.45)',
    icon: '💧' 
  },
  grass: { 
    name: 'Grass', 
    color: 'from-emerald-500 to-green-600', 
    bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', 
    glow: 'rgba(16, 185, 129, 0.45)',
    icon: '🌿' 
  },
  electric: { 
    name: 'Electric', 
    color: 'from-yellow-400 to-amber-500', 
    bg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40', 
    glow: 'rgba(250, 204, 21, 0.5)',
    icon: '⚡' 
  },
  ice: { 
    name: 'Ice', 
    color: 'from-cyan-300 to-blue-400', 
    bg: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40', 
    glow: 'rgba(34, 211, 238, 0.45)',
    icon: '❄️' 
  },
  fighting: { 
    name: 'Fighting', 
    color: 'from-red-600 to-rose-700', 
    bg: 'bg-red-600/20 text-red-300 border-red-600/40', 
    glow: 'rgba(225, 29, 72, 0.45)',
    icon: '🥊' 
  },
  poison: { 
    name: 'Poison', 
    color: 'from-purple-500 to-violet-700', 
    bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', 
    glow: 'rgba(168, 85, 247, 0.45)',
    icon: '☠️' 
  },
  ground: { 
    name: 'Ground', 
    color: 'from-amber-600 to-yellow-800', 
    bg: 'bg-amber-600/20 text-amber-300 border-amber-600/40', 
    glow: 'rgba(217, 119, 6, 0.45)',
    icon: '🏜️' 
  },
  flying: { 
    name: 'Flying', 
    color: 'from-indigo-400 to-sky-500', 
    bg: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40', 
    glow: 'rgba(129, 140, 248, 0.45)',
    icon: '🪽' 
  },
  psychic: { 
    name: 'Psychic', 
    color: 'from-pink-500 to-fuchsia-600', 
    bg: 'bg-pink-500/20 text-pink-300 border-pink-500/40', 
    glow: 'rgba(236, 72, 153, 0.45)',
    icon: '🔮' 
  },
  bug: { 
    name: 'Bug', 
    color: 'from-lime-500 to-emerald-600', 
    bg: 'bg-lime-500/20 text-lime-300 border-lime-500/40', 
    glow: 'rgba(132, 204, 22, 0.45)',
    icon: '🐛' 
  },
  rock: { 
    name: 'Rock', 
    color: 'from-stone-600 to-amber-900', 
    bg: 'bg-stone-600/20 text-stone-300 border-stone-600/40', 
    glow: 'rgba(120, 113, 108, 0.45)',
    icon: '🪨' 
  },
  ghost: { 
    name: 'Ghost', 
    color: 'from-indigo-600 to-purple-800', 
    bg: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/40', 
    glow: 'rgba(99, 102, 241, 0.45)',
    icon: '👻' 
  },
  dragon: { 
    name: 'Dragon', 
    color: 'from-violet-700 to-indigo-900', 
    bg: 'bg-violet-700/20 text-violet-300 border-violet-700/40', 
    glow: 'rgba(109, 40, 217, 0.5)',
    icon: '🐉' 
  },
  dark: { 
    name: 'Dark', 
    color: 'from-neutral-800 to-slate-900', 
    bg: 'bg-neutral-800/40 text-neutral-300 border-neutral-700/60', 
    glow: 'rgba(30, 41, 59, 0.6)',
    icon: '🌙' 
  },
  steel: { 
    name: 'Steel', 
    color: 'from-slate-400 to-zinc-600', 
    bg: 'bg-slate-400/20 text-slate-300 border-slate-400/40', 
    glow: 'rgba(148, 163, 184, 0.45)',
    icon: '⚙️' 
  },
  fairy: { 
    name: 'Fairy', 
    color: 'from-pink-400 to-rose-400', 
    bg: 'bg-pink-400/20 text-pink-200 border-pink-400/40', 
    glow: 'rgba(244, 114, 182, 0.5)',
    icon: '✨' 
  }
};

export const ASH_KALOS_POKEMON = [
  'greninja', 
  'greninja-ash', 
  'talonflame', 
  'hawlucha', 
  'goodra', 
  'noivern'
];

export const KALOS_SORT_OPTIONS = [
  { value: 'id', label: 'ID Number' },
  { value: 'name', label: 'Species Name' },
  { value: 'hp', label: 'Hit Points (HP)' },
  { value: 'attack', label: 'Attack Power' },
  { value: 'defense', label: 'Defense' },
  { value: 'speed', label: 'Speed' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
  { value: 'base_experience', label: 'Base Experience' }
];
