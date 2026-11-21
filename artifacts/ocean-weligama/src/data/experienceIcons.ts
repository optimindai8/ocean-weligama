export interface ExperienceIconItem {
  id: string;
  category: 'surf' | 'yoga' | 'safari' | 'scooter' | 'whale' | 'cooking';
  categoryLabel: string;
  name: string;
  path: string;
  alt: string;
}

export const EXPERIENCE_ICONS: ExperienceIconItem[] = [
  // Surf
  {
    id: 'surf-rider',
    category: 'surf',
    categoryLabel: 'Surf & Waves',
    name: 'Surfer on Ocean Wave',
    path: '/icons/surf/surf-rider.png',
    alt: 'Surfer riding wave icon',
  },
  {
    id: 'surf-beach',
    category: 'surf',
    categoryLabel: 'Surf & Waves',
    name: 'Surfboard on Sunny Beach',
    path: '/icons/surf/surf-beach.png',
    alt: 'Surfboard and wave icon',
  },

  // Yoga
  {
    id: 'yoga-meditation',
    category: 'yoga',
    categoryLabel: 'Yoga & Mind',
    name: 'Mindful Lotus Meditation',
    path: '/icons/yoga/yoga-meditation.png',
    alt: 'Yoga meditation pose icon',
  },
  {
    id: 'yoga-pose',
    category: 'yoga',
    categoryLabel: 'Yoga & Mind',
    name: 'Advanced Forearm Yoga Pose',
    path: '/icons/yoga/yoga-pose.png',
    alt: 'Advanced yoga posture icon',
  },

  // Safari Trips
  {
    id: 'safari-pink-jeep',
    category: 'safari',
    categoryLabel: 'Safari & Wildlife',
    name: 'Coastal Dunes 4x4 Safari',
    path: '/icons/safari/safari-pink-jeep.png',
    alt: 'Pink 4x4 safari truck icon',
  },
  {
    id: 'safari-green-jeep',
    category: 'safari',
    categoryLabel: 'Safari & Wildlife',
    name: 'Wilderness Exploration Jeep',
    path: '/icons/safari/safari-green-jeep.png',
    alt: 'Green safari exploration vehicle icon',
  },

  // Scooter Rental
  {
    id: 'scooter-vintage',
    category: 'scooter',
    categoryLabel: 'Scooter Rental',
    name: 'Classic Coastal Vespa Scooter',
    path: '/icons/scooter/scooter-vintage.png',
    alt: 'Classic vintage red scooter icon',
  },
  {
    id: 'scooter-delivery',
    category: 'scooter',
    categoryLabel: 'Scooter Rental',
    name: 'Island Touring Scooter Rider',
    path: '/icons/scooter/scooter-delivery.png',
    alt: 'Scooter rider with helmet icon',
  },

  // Whale Watching
  {
    id: 'whale-spout',
    category: 'whale',
    categoryLabel: 'Whale Watching',
    name: 'Spouting Blue Whale',
    path: '/icons/whale/whale-spout.png',
    alt: 'Blue whale spouting water icon',
  },
  {
    id: 'whale-boat',
    category: 'whale',
    categoryLabel: 'Whale Watching',
    name: 'Ocean Whale Tail & Tour Boat',
    path: '/icons/whale/whale-boat.png',
    alt: 'Whale tail diving by tour boat icon',
  },

  // Cooking Classes
  {
    id: 'cooking-chef',
    category: 'cooking',
    categoryLabel: 'Culinary & Cooking',
    name: 'Master Chef with Cooking Pot',
    path: '/icons/cooking/cooking-chef.png',
    alt: 'Chef cooking with pot icon',
  },
  {
    id: 'cooking-wok',
    category: 'cooking',
    categoryLabel: 'Culinary & Cooking',
    name: 'Traditional Wok Stir-Fry on Fire',
    path: '/icons/cooking/cooking-wok.png',
    alt: 'Wok stir fry on fire icon',
  },
];

export const ICONS_BY_CATEGORY = {
  surf: EXPERIENCE_ICONS.filter((i) => i.category === 'surf'),
  yoga: EXPERIENCE_ICONS.filter((i) => i.category === 'yoga'),
  safari: EXPERIENCE_ICONS.filter((i) => i.category === 'safari'),
  scooter: EXPERIENCE_ICONS.filter((i) => i.category === 'scooter'),
  whale: EXPERIENCE_ICONS.filter((i) => i.category === 'whale'),
  cooking: EXPERIENCE_ICONS.filter((i) => i.category === 'cooking'),
};

