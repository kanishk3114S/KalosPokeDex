/**
 * Kalos Regional Geospatial Data & Landmarks
 * Coordinates map onto a 3D X/Z plane (Y is elevation)
 */

export const KALOS_CITIES = [
  {
    id: 'lumiose',
    name: 'Lumiose City',
    japaneseName: 'ミアレシティ (Miare City)',
    region: 'Central Kalos',
    position: [0, 0.4, 0], // Center hub
    beaconColor: '#00E5FF',
    landmark: 'Prism Tower & Kalos Power Plant',
    gymLeader: 'Clemont',
    gymType: 'electric',
    badge: 'Voltage Badge',
    signaturePokemon: 'Heliolisk',
    description: 'The glowing metropolis at the heart of Kalos, powered by the monumental Prism Tower with radial boulevards connecting all regions.',
    routes: ['Route 4', 'Route 5', 'Route 13', 'Route 14', 'Route 16']
  },
  {
    id: 'santalune',
    name: 'Santalune City',
    japaneseName: 'ハクダンシティ (Hakudan City)',
    region: 'Central Kalos',
    position: [1.2, 0.25, 3.2], // South
    beaconColor: '#84CC16',
    landmark: 'Santalune Forest & Rose Fountain',
    gymLeader: 'Viola',
    gymType: 'bug',
    badge: 'Bug Badge',
    signaturePokemon: 'Vivillon',
    description: 'A traditional European town known for its quaint brick paths, picturesque fountain, and photography studio.',
    routes: ['Route 3', 'Route 4', 'Route 22']
  },
  {
    id: 'cyllage',
    name: 'Cyllage City',
    japaneseName: 'ショウヨウシティ (Shōyō City)',
    region: 'Coastal Kalos',
    position: [-4.2, 0.3, 1.8], // Southwest Coast
    beaconColor: '#D97706',
    landmark: 'Bicycle Racing Track & Cliffside Gym',
    gymLeader: 'Grant',
    gymType: 'rock',
    badge: 'Cliff Badge',
    signaturePokemon: 'Tyrantrum',
    description: 'A rugged town set against towering seaside bluffs, famous for cliff climbing, cycling trails, and prehistoric fossils.',
    routes: ['Route 8', 'Route 9', 'Route 10']
  },
  {
    id: 'shalour',
    name: 'Shalour City',
    japaneseName: 'シャラシティ (Shara City)',
    region: 'Coastal Kalos',
    position: [-4.6, 0.35, -2.2], // Northwest Coast
    beaconColor: '#EF4444',
    landmark: 'Tower of Mastery & Mega Evolution Shrine',
    gymLeader: 'Korrina',
    gymType: 'fighting',
    badge: 'Rumble Badge',
    signaturePokemon: 'Lucario',
    description: 'A coastal sanctuary celebrated as the cradle of Mega Evolution, guarded by the sacred Tower of Mastery rising above the tides.',
    routes: ['Route 11', 'Route 12']
  },
  {
    id: 'coumarine',
    name: 'Coumarine City',
    japaneseName: 'ヒヨクシティ (Hiyoku City)',
    region: 'Coastal Kalos',
    position: [-1.8, 0.3, -4.5], // North Coast
    beaconColor: '#10B981',
    landmark: 'Coumarine Monorail & Seaside Port',
    gymLeader: 'Ramos',
    gymType: 'grass',
    badge: 'Plant Badge',
    signaturePokemon: 'Gogoat',
    description: 'A bi-level harbor city linked by a futuristic suspended monorail, splitting seaside resorts and cliffside botanical gardens.',
    routes: ['Route 12', 'Route 13']
  },
  {
    id: 'laverre',
    name: 'Laverre City',
    japaneseName: 'クノエシティ (Kunoe City)',
    region: 'Mountain Kalos',
    position: [1.8, 0.45, -3.8], // North Forest
    beaconColor: '#F472B6',
    landmark: 'Ancient Tree of Life & Poké Ball Factory',
    gymLeader: 'Valerie',
    gymType: 'fairy',
    badge: 'Fairy Badge',
    signaturePokemon: 'Sylveon',
    description: 'An ethereal woodland town built around an ancient 1,500-year-old tree, suffused with mystical Fairy energy and clock towers.',
    routes: ['Route 14', 'Route 15']
  },
  {
    id: 'anistar',
    name: 'Anistar City',
    japaneseName: 'ヒャッコクシティ (Hyakkoku City)',
    region: 'Mountain Kalos',
    position: [4.4, 0.4, -1.2], // East
    beaconColor: '#EC4899',
    landmark: 'Cosmic Crystal Sundial',
    gymLeader: 'Olympia',
    gymType: 'psychic',
    badge: 'Psychic Badge',
    signaturePokemon: 'Meowstic',
    description: 'A high-elevation plateau overlooking the horizon, dominated by a mysterious gigantic pink crystal sundial connected to Mega Rings.',
    routes: ['Route 17', 'Route 18']
  },
  {
    id: 'snowbelle',
    name: 'Snowbelle City',
    japaneseName: 'エイセツシティ (Eisetsu City)',
    region: 'Mountain Kalos',
    position: [3.2, 0.6, 3.4], // Southeast Alps
    beaconColor: '#38BDF8',
    landmark: 'Winding Woods & Glacial Caverns',
    gymLeader: 'Wulfric',
    gymType: 'ice',
    badge: 'Iceberg Badge',
    signaturePokemon: 'Avalugg',
    description: 'A perennially snow-draped alpine settlement nestled in the Kalos peaks, wrapped in frost and ancient evergreen forests.',
    routes: ['Route 19', 'Route 20', 'Route 21']
  },
  {
    id: 'geosenge',
    name: 'Geosenge Town',
    japaneseName: 'セキタイタウン (Sekitai Town)',
    region: 'Coastal Kalos',
    position: [-2.6, 0.35, -0.4], // West Central
    beaconColor: '#F59E0B',
    landmark: 'Ancient Megalith Rings & Ultimate Weapon Crater',
    gymLeader: null,
    gymType: null,
    badge: null,
    signaturePokemon: 'Xerneas / Yveltal',
    description: 'An enigmatic settlement shrouded in history, ringed by gigantic megalith stones that conceal the cataclysmic ancient weapon.',
    routes: ['Route 10', 'Route 11']
  },
  {
    id: 'kiloude',
    name: 'Kiloude City',
    japaneseName: 'キナンシティ (Kinan City)',
    region: 'Southern Kalos',
    position: [0.5, 0.3, 5.5], // Far South
    beaconColor: '#A855F7',
    landmark: 'Battle Maison & Friend Safari',
    gymLeader: null,
    gymType: null,
    badge: null,
    signaturePokemon: 'Mega Absol',
    description: 'A secluded, tropical southern resort accessible only by TMV high-speed rail, where elite trainers gather for high-stakes battles.',
    routes: ['TMV High-Speed Rail']
  }
];

export const KALOS_ROUTES = [
  { from: 'lumiose', to: 'santalune', id: 'Route 4 (Parterre Way)' },
  { from: 'lumiose', to: 'cyllage', id: 'Route 5 (Versant Way)' },
  { from: 'cyllage', to: 'geosenge', id: 'Route 10 (Menhir Trail)' },
  { from: 'geosenge', to: 'shalour', id: 'Route 11 (Miroir Way)' },
  { from: 'shalour', to: 'coumarine', id: 'Route 12 (Fourrage Road)' },
  { from: 'coumarine', to: 'lumiose', id: 'Route 13 (Lumiose Badlands)' },
  { from: 'lumiose', to: 'laverre', id: 'Route 14 (Laverre Nature Trail)' },
  { from: 'laverre', to: 'anistar', id: 'Route 15 (Brun Way)' },
  { from: 'anistar', to: 'snowbelle', id: 'Route 17 (Mamoswine Road)' },
  { from: 'snowbelle', to: 'santalune', id: 'Route 21 (Dernier Way)' },
  { from: 'lumiose', to: 'kiloude', id: 'TMV High-Speed Maglev Rail' }
];
