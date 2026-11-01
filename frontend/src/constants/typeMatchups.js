/**
 * Complete Pokemon Type Matchup Matrix (Generations 6 - 9)
 * Used for dynamic type coverage calculation and side-by-side battle matchup analysis.
 */

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Attacking type multipliers against defending types:
// 2: Super Effective, 0.5: Not Very Effective, 0: Immune, 1: Normal
export const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

/**
 * Calculates the defensive effectiveness of an attack type against a Pokemon with 1 or 2 types
 * Returns multiplier (e.g. 4, 2, 1, 0.5, 0.25, 0)
 */
export function getDefenseMultiplier(defendingTypes, attackType) {
  if (!defendingTypes || defendingTypes.length === 0) return 1;

  let multiplier = 1;
  for (const defType of defendingTypes) {
    const table = TYPE_CHART[attackType] || {};
    if (table[defType] !== undefined) {
      multiplier *= table[defType];
    }
  }
  return multiplier;
}

/**
 * Analyzes team defensive coverage: for each of the 18 attack types,
 * calculates how many team members are weak (>1x), resist (<1x), or immune (0x).
 */
export function calculateTeamCoverage(teamMembers) {
  const activeMembers = teamMembers.filter(Boolean);
  const coverage = {};

  for (const atkType of ALL_TYPES) {
    let weaknesses = 0;
    let resistances = 0;
    let immunities = 0;

    for (const member of activeMembers) {
      const mult = getDefenseMultiplier(member.types, atkType);
      if (mult === 0) immunities++;
      else if (mult > 1) weaknesses++;
      else if (mult < 1) resistances++;
    }

    coverage[atkType] = {
      weaknesses,
      resistances,
      immunities,
      netScore: resistances + (immunities * 1.5) - weaknesses
    };
  }

  return coverage;
}
