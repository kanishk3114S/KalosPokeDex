/**
 * Official Pokémon Competitive Stat Calculator (Generations 6 - 9)
 * Calculates precise battle statistics based on Base Stats, IVs, EVs, Nature, and Level.
 */

export const NATURES = {
  hardy: { name: 'Hardy', up: null, down: null },
  lonely: { name: 'Lonely', up: 'attack', down: 'defense' },
  brave: { name: 'Brave', up: 'attack', down: 'speed' },
  adamant: { name: 'Adamant', up: 'attack', down: 'spAtk' },
  naughty: { name: 'Naughty', up: 'attack', down: 'spDef' },
  bold: { name: 'Bold', up: 'defense', down: 'attack' },
  docile: { name: 'Docile', up: null, down: null },
  relaxed: { name: 'Relaxed', up: 'defense', down: 'speed' },
  impish: { name: 'Impish', up: 'defense', down: 'spAtk' },
  lax: { name: 'Lax', up: 'defense', down: 'spDef' },
  timid: { name: 'Timid', up: 'speed', down: 'attack' },
  hasty: { name: 'Hasty', up: 'speed', down: 'defense' },
  serious: { name: 'Serious', up: null, down: null },
  jolly: { name: 'Jolly', up: 'speed', down: 'spAtk' },
  naive: { name: 'Naive', up: 'speed', down: 'spDef' },
  modest: { name: 'Modest', up: 'spAtk', down: 'attack' },
  mild: { name: 'Mild', up: 'spAtk', down: 'defense' },
  quiet: { name: 'Quiet', up: 'spAtk', down: 'speed' },
  bashful: { name: 'Bashful', up: null, down: null },
  rash: { name: 'Rash', up: 'spAtk', down: 'spDef' },
  calm: { name: 'Calm', up: 'spDef', down: 'attack' },
  gentle: { name: 'Gentle', up: 'spDef', down: 'defense' },
  sassy: { name: 'Sassy', up: 'spDef', down: 'speed' },
  careful: { name: 'Careful', up: 'spDef', down: 'spAtk' },
  quirky: { name: 'Quirky', up: null, down: null },
};

export function calculateHP(base, iv = 31, ev = 0, level = 50, pokemonName = '') {
  if (pokemonName.toLowerCase() === 'shedinja') return 1;
  const evBonus = Math.floor(ev / 4);
  return Math.floor(((2 * base + iv + evBonus) * level) / 100) + level + 10;
}

export function calculateOtherStat(statKey, base, iv = 31, ev = 0, level = 50, natureKey = 'hardy') {
  const evBonus = Math.floor(ev / 4);
  const baseCalculated = Math.floor(((2 * base + iv + evBonus) * level) / 100) + 5;
  const nature = NATURES[natureKey] || NATURES.hardy;

  let multiplier = 1.0;
  if (nature.up === statKey) multiplier = 1.1;
  else if (nature.down === statKey) multiplier = 0.9;

  return Math.floor(baseCalculated * multiplier);
}

export function calculateAllStats(baseStats, ivs = {}, evs = {}, level = 50, nature = 'adamant', pokemonName = '') {
  const hp = calculateHP(baseStats.hp, ivs.hp ?? 31, evs.hp ?? 0, level, pokemonName);
  const attack = calculateOtherStat('attack', baseStats.attack, ivs.attack ?? 31, evs.attack ?? 0, level, nature);
  const defense = calculateOtherStat('defense', baseStats.defense, ivs.defense ?? 31, evs.defense ?? 0, level, nature);
  const spAtk = calculateOtherStat('spAtk', baseStats.spAtk || baseStats['special-attack'], ivs.spAtk ?? 31, evs.spAtk ?? 0, level, nature);
  const spDef = calculateOtherStat('spDef', baseStats.spDef || baseStats['special-defense'], ivs.spDef ?? 31, evs.spDef ?? 0, level, nature);
  const speed = calculateOtherStat('speed', baseStats.speed, ivs.speed ?? 31, evs.speed ?? 0, level, nature);

  return { hp, attack, defense, spAtk, spDef, speed, total: hp + attack + defense + spAtk + spDef + speed };
}
