/**
 * Kalos & Mega Evolution Form Mapping
 * Connects base Pokémon to their Mega forms and special Kalos variants
 */

export const POKEMON_FORM_MAPPINGS = {
  charizard: [
    { formName: 'Standard', idOrName: 'charizard' },
    { formName: 'Mega Charizard X', idOrName: 'charizard-mega-x' },
    { formName: 'Mega Charizard Y', idOrName: 'charizard-mega-y' }
  ],
  mewtwo: [
    { formName: 'Standard', idOrName: 'mewtwo' },
    { formName: 'Mega Mewtwo X', idOrName: 'mewtwo-mega-x' },
    { formName: 'Mega Mewtwo Y', idOrName: 'mewtwo-mega-y' }
  ],
  greninja: [
    { formName: 'Standard', idOrName: 'greninja' },
    { formName: 'Ash-Greninja', idOrName: 'greninja-ash' }
  ],
  lucario: [
    { formName: 'Standard', idOrName: 'lucario' },
    { formName: 'Mega Lucario', idOrName: 'lucario-mega' }
  ],
  gengar: [
    { formName: 'Standard', idOrName: 'gengar' },
    { formName: 'Mega Gengar', idOrName: 'gengar-mega' }
  ],
  gardevoir: [
    { formName: 'Standard', idOrName: 'gardevoir' },
    { formName: 'Mega Gardevoir', idOrName: 'gardevoir-mega' }
  ],
  blaziken: [
    { formName: 'Standard', idOrName: 'blaziken' },
    { formName: 'Mega Blaziken', idOrName: 'blaziken-mega' }
  ],
  garchomp: [
    { formName: 'Standard', idOrName: 'garchomp' },
    { formName: 'Mega Garchomp', idOrName: 'garchomp-mega' }
  ],
  venusaur: [
    { formName: 'Standard', idOrName: 'venusaur' },
    { formName: 'Mega Venusaur', idOrName: 'venusaur-mega' }
  ],
  blastoise: [
    { formName: 'Standard', idOrName: 'blastoise' },
    { formName: 'Mega Blastoise', idOrName: 'blastoise-mega' }
  ],
  gyarados: [
    { formName: 'Standard', idOrName: 'gyarados' },
    { formName: 'Mega Gyarados', idOrName: 'gyarados-mega' }
  ],
  tyranitar: [
    { formName: 'Standard', idOrName: 'tyranitar' },
    { formName: 'Mega Tyranitar', idOrName: 'tyranitar-mega' }
  ],
  salamence: [
    { formName: 'Standard', idOrName: 'salamence' },
    { formName: 'Mega Salamence', idOrName: 'salamence-mega' }
  ],
  metagross: [
    { formName: 'Standard', idOrName: 'metagross' },
    { formName: 'Mega Metagross', idOrName: 'metagross-mega' }
  ],
  rayquaza: [
    { formName: 'Standard', idOrName: 'rayquaza' },
    { formName: 'Mega Rayquaza', idOrName: 'rayquaza-mega' }
  ],
  diancie: [
    { formName: 'Standard', idOrName: 'diancie' },
    { formName: 'Mega Diancie', idOrName: 'diancie-mega' }
  ],
  absol: [
    { formName: 'Standard', idOrName: 'absol' },
    { formName: 'Mega Absol', idOrName: 'absol-mega' }
  ],
  scizor: [
    { formName: 'Standard', idOrName: 'scizor' },
    { formName: 'Mega Scizor', idOrName: 'scizor-mega' }
  ],
  kangaskhan: [
    { formName: 'Standard', idOrName: 'kangaskhan' },
    { formName: 'Mega Kangaskhan', idOrName: 'kangaskhan-mega' }
  ],
  mawile: [
    { formName: 'Standard', idOrName: 'mawile' },
    { formName: 'Mega Mawile', idOrName: 'mawile-mega' }
  ],
  aerodactyl: [
    { formName: 'Standard', idOrName: 'aerodactyl' },
    { formName: 'Mega Aerodactyl', idOrName: 'aerodactyl-mega' }
  ],
  ampharos: [
    { formName: 'Standard', idOrName: 'ampharos' },
    { formName: 'Mega Ampharos', idOrName: 'ampharos-mega' }
  ],
  alakazam: [
    { formName: 'Standard', idOrName: 'alakazam' },
    { formName: 'Mega Alakazam', idOrName: 'alakazam-mega' }
  ]
};

// Kalos Habitat Route associations for "Find in Kalos"
export const KALOS_HABITAT_ROUTES = {
  chespin: 'Route 5 (Camphrier Trail)',
  quilladin: 'Route 5',
  chesnaught: 'Route 5',
  fennekin: 'Route 5',
  braixen: 'Route 5',
  delphox: 'Route 5',
  froakie: 'Route 5',
  frogadier: 'Route 5',
  greninja: 'Route 5 / Shalour Mastery Grounds',
  'greninja-ash': 'Lumiose Prism Tower (Battle Bond Arena)',
  fletchling: 'Route 2 / Route 3',
  fletchinder: 'Route 4 (Parterre Way)',
  talonflame: 'Route 4 (Parterre Way)',
  bunnelby: 'Route 2 / Route 3',
  diggersby: 'Route 22',
  scatterbug: 'Santalune Forest',
  spewpa: 'Santalune Forest',
  vivillon: 'Santalune Forest',
  litleo: 'Route 22',
  pyroar: 'Route 22',
  flabebe: 'Route 4 / Route 7',
  floette: 'Route 7',
  florges: 'Route 7',
  skiddo: 'Route 5',
  gogoat: 'Coumarine City High Hills',
  pancham: 'Route 5',
  pangoro: 'Route 5',
  furfrou: 'Route 5 / Lumiose City (Bleu Plaza)',
  espurr: 'Route 6 (Palais Lane)',
  meowstic: 'Anistar City Plateau',
  honedge: 'Route 6 (Palais Lane)',
  doublade: 'Lost Hotel',
  aegislash: 'Lost Hotel',
  spritzee: 'Route 7',
  aromatisse: 'Route 7',
  swirlix: 'Route 7',
  slurpuff: 'Route 7',
  inkay: 'Route 8 (Muraille Coast)',
  malamar: 'Route 8',
  binacle: 'Route 8',
  barbaracle: 'Route 8',
  skrelp: 'Route 8 (Cyllage Seaside)',
  dragalge: 'Route 8',
  clauncher: 'Route 8 (Cyllage Seaside)',
  clawitzer: 'Route 8',
  helioptile: 'Route 9 (Spikes Passage)',
  heliolisk: 'Lumiose Gym (Prism Tower)',
  tyrunt: 'Cyllage City (Fossil Lab)',
  tyrantrum: 'Cyllage City',
  amaura: 'Cyllage City (Fossil Lab)',
  aurorus: 'Cyllage City',
  sylveon: 'Laverre City Ancient Forest',
  hawlucha: 'Route 10 (Geosenge Trail)',
  dedenne: 'Route 11',
  carbink: 'Reflection Cave',
  goomy: 'Route 14 (Laverre Swamps)',
  sliggoo: 'Route 19 (Rainy Route)',
  goodra: 'Route 19 (Rainy Route)',
  klefki: 'Route 15 / Route 16',
  phantump: 'Route 16 (Dendemille Woods)',
  trevenant: 'Route 20 (Winding Woods)',
  pumpkaboo: 'Route 16',
  gourgeist: 'Route 16',
  bergmite: 'Frost Cavern',
  avalugg: 'Snowbelle City Glacial Cave',
  noibat: 'Terminus Cave',
  noivern: 'Terminus Cave',
  xerneas: 'Team Flare Secret HQ (Geosenge Town)',
  yveltal: 'Team Flare Secret HQ (Geosenge Town)',
  zygarde: 'Terminus Cave (Deepest Chamber)',
  diancie: 'Carbink Crystal Caverns',
  hoopa: 'Anistar Cosmic Portal',
  volcanion: 'Kalos Power Plant (Sector 4)'
};
