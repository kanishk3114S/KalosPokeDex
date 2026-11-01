/**
 * Accurate Lumiose City Geospatial & Landmark Data
 * Faithfully reconstructed from the official Lumiose City map.
 * Polar coordinates translated onto X/Z 3D coordinates (Y is elevation).
 */

export const LUMIOSE_CENTER = {
  id: 'prism-tower',
  name: 'Prism Tower (Centrico Plaza)',
  frenchName: 'Tour Prismatique',
  category: 'Gym & Power Hub',
  position: [0, 0.4, 0],
  beaconColor: '#00E5FF',
  description: 'The crowning centerpiece of Lumiose City and the Kalos region. Houses the official Lumiose Gym led by Clemont and powers the entire metropolis.',
  features: ['Official Kalos Gym (Electric)', 'Gym Leader Clemont', 'Photo Spot', 'Central Taxi Hub']
};

export const LUMIOSE_PLAZAS = [
  {
    id: 'rouge-plaza',
    name: 'Rouge Plaza',
    color: '#EF4444',
    position: [0, 0.25, -2.2], // North inner ring
    description: 'A bustling northern plaza celebrated for high-end dining and gourmet specialties.',
    spots: ['Juice Shoppe (Berry Blending)', 'Sushi High Roller', 'Restaurant Le Yeah (2-Star)']
  },
  {
    id: 'magenta-plaza',
    name: 'Magenta Plaza',
    color: '#D946EF',
    position: [-2.1, 0.25, -0.6], // West-Northwest inner ring
    description: 'A vibrant plaza housing the Magenta Pokémon Center and Lysandre Café—the covert gateway to Team Flare Secret Labs.',
    spots: ['Magenta Pokémon Center', 'Lysandre Café (Team Flare HQ)', 'Café Gallant']
  },
  {
    id: 'bleu-plaza',
    name: 'Bleu Plaza',
    color: '#3B82F6',
    position: [-1.2, 0.25, 1.8], // South-Southwest inner ring
    description: 'A serene plaza celebrated for Furfrou grooming and companionship cafés.',
    spots: ['Friseur Furfrou (Grooming Salon)', 'Café Woof']
  },
  {
    id: 'vert-plaza',
    name: 'Vert Plaza',
    color: '#10B981',
    position: [1.2, 0.25, 1.8], // South-Southeast inner ring
    description: 'A lush, verdant hub with outdoor terrace cafés and breezy meeting spots.',
    spots: ['Café Classe', 'Café Cyclone']
  },
  {
    id: 'jaune-plaza',
    name: 'Jaune Plaza',
    color: '#FACC15',
    position: [2.1, 0.25, -0.6], // East inner ring
    description: 'A cheerful eastern plaza home to friendly trainers and rival meeting houses.',
    spots: ["Trevor's House", 'Café Kizuna', 'Friendship Checker']
  }
];

export const LUMIOSE_AVENUES = [
  {
    id: 'autumnal-avenue',
    name: 'Autumnal Avenue',
    direction: 'North-West (Connecting Centrico to North Boulevard)',
    spots: ['Poké Ball Boutique (Specialty Poké Balls)', 'Restaurant Le Wow (3-Star Battles)']
  },
  {
    id: 'hibernal-avenue',
    name: 'Hibernal Avenue',
    direction: 'North-East (Connecting Centrico to North Boulevard)',
    spots: ['Café Ultimo', 'Restaurant Le Nah (1-Star)']
  },
  {
    id: 'vernal-avenue',
    name: 'Vernal Avenue',
    direction: 'South (Connecting Centrico to South Boulevard)',
    spots: ['Boutique Couture (High Fashion)', 'Stone Emporium (Mega & Evolution Stones)', 'Herboriste (Traditional Herbs)']
  },
  {
    id: 'estival-avenue',
    name: 'Estival Avenue',
    direction: 'South-West (Connecting Centrico to South Boulevard)',
    spots: ['Lumiose Press (Alexa Office)', 'Loto-ID Center', 'Shutterbug Café', 'Café Rouleau (Roller Skate Tricks)']
  }
];

export const LUMIOSE_BOULEVARD_LANDMARKS = [
  // North Boulevard
  {
    id: 'north-pkmn-center',
    name: 'North Pokémon Center',
    boulevard: 'North Boulevard',
    position: [0.6, 0.2, -4.2],
    category: 'Facility',
    description: 'A full-service medical center with an extensive specialty Poké Mart.',
    color: '#EC4899'
  },
  {
    id: 'lumiose-museum',
    name: 'Lumiose Museum',
    boulevard: 'North Boulevard',
    position: [1.8, 0.2, -4.0],
    category: 'Culture',
    description: 'Showcases classical Kalosian masterworks, sculptures, and audio-guided historical exhibits.',
    color: '#8B5CF6'
  },
  {
    id: 'hotel-richissime',
    name: 'Hotel Richissime',
    boulevard: 'North Boulevard',
    position: [3.2, 0.2, -3.3],
    category: 'Hotel & Luxury',
    description: 'A five-star luxury hotel where trainers can undertake prestigious room-service and housekeeping jobs.',
    color: '#F59E0B'
  },
  {
    id: 'battle-institute',
    name: 'Battle Institute',
    boulevard: 'North Boulevard',
    position: [4.4, 0.2, -1.2],
    category: 'Competitive',
    description: 'Hosts the official Battle Test challenge to evaluate a trainer combat tier and tactical ranking.',
    color: '#EF4444'
  },
  {
    id: 'lumiose-station',
    name: 'Lumiose Station',
    boulevard: 'North Boulevard',
    position: [4.5, 0.2, 0.4],
    category: 'Transit',
    description: 'Board the TMV high-speed train to reach Kiloude City in Southern Kalos.',
    color: '#00E5FF'
  },
  {
    id: 'galette-stand',
    name: 'Galette Stand',
    boulevard: 'North Boulevard',
    position: [-3.2, 0.2, -3.2],
    category: 'Culinary',
    description: 'Freshly baked Lumiose Galettes that heal status conditions for your entire party.',
    color: '#F97316'
  },

  // South Boulevard
  {
    id: 'south-pkmn-center',
    name: 'South Pokémon Center',
    boulevard: 'South Boulevard',
    position: [-0.6, 0.2, 4.3],
    category: 'Facility',
    description: 'The first welcoming center for trainers arriving from Santalune City and Camphrier Town.',
    color: '#EC4899'
  },
  {
    id: 'sycamore-lab',
    name: "Professor Sycamore's Lab",
    boulevard: 'South Boulevard',
    position: [0.6, 0.2, 4.5],
    category: 'Research',
    description: 'Where trainers receive their Kalos starter (Chespin, Fennekin, or Froakie) and Kanto starter with Mega Stones.',
    color: '#00E5FF'
  },
  {
    id: 'pr-video-studio',
    name: 'PR Video Studio',
    boulevard: 'South Boulevard',
    position: [-0.8, 0.2, 4.8],
    category: 'Media',
    description: 'Produce and broadcast customized Trainer PR promotional clips shared across the Holo-Caster network.',
    color: '#8B5CF6'
  },
  {
    id: 'coiffure-clips',
    name: 'Coiffure Clips',
    boulevard: 'South Boulevard',
    position: [-2.4, 0.2, 3.8],
    category: 'Styling',
    description: 'The premier hairstyling and hair-dye salon in Kalos, essential for boosting Trainer Style score.',
    color: '#F472B6'
  },
  {
    id: 'cafe-soleil',
    name: 'Café Soleil',
    boulevard: 'South Boulevard',
    position: [-3.6, 0.2, 2.8],
    category: 'Café',
    description: 'Where Champion Diantha and Lysandre meet for quiet philosophical debates over café.',
    color: '#FBBF24'
  }
];

export const LUMIOSE_ROUTE_GATES = [
  {
    id: 'gate-route-14',
    name: 'Route 14 Gate',
    destination: 'Laverre City (North)',
    position: [0, 0.25, -5.2],
    color: '#F472B6',
    route: 'Route 14'
  },
  {
    id: 'gate-route-16',
    name: 'Route 16 Gate',
    destination: 'Dendemille Town (North-East)',
    position: [4.6, 0.25, -2.4],
    color: '#A855F7',
    route: 'Route 16'
  },
  {
    id: 'gate-route-4',
    name: 'Route 4 Gate',
    destination: 'Santalune City (South-East)',
    position: [3.8, 0.25, 3.8],
    color: '#84CC16',
    route: 'Route 4'
  },
  {
    id: 'gate-route-5',
    name: 'Route 5 Gate',
    destination: 'Camphrier Town (South)',
    position: [-3.8, 0.25, 3.8],
    color: '#EAB308',
    route: 'Route 5'
  },
  {
    id: 'gate-route-13',
    name: 'Route 13 Gate',
    destination: 'Coumarine City & Badlands (West)',
    position: [-5.2, 0.25, -0.6],
    color: '#F97316',
    route: 'Route 13'
  }
];
