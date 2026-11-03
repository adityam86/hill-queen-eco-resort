export interface RoomData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  maximumOccupancy: number;
  bedConfiguration: string;
  roomType: string;
  isAc: boolean;
  hasAttachedBath: boolean;
  extraBedAvailable: boolean;
  foodInclusion: string;
  amenities: string;
  mainImage: string;
  isActive: boolean;
  displayOrder: number;
  images?: Array<{
    id?: string;
    imageUrl: string;
    caption?: string | null;
    displayOrder?: number;
  }>;
}

export const DEFAULT_ROOMS: RoomData[] = [
  {
    id: 'double-bedded-room',
    name: 'Double Bedded Room',
    slug: 'double-bedded-room',
    roomType: 'Double Bedded Room',
    description:
      'Comfortable double bedded room designed for couples and solo travelers looking for peaceful relaxation in Purulia. Features comfortable double bedding, an en-suite western bathroom, air conditioning, and peaceful outlook over the resort green grounds.',
    price: 1800,
    maximumOccupancy: 2,
    bedConfiguration: '1 Double Bed',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; authentic Bengali thalis and fresh home-cooked meals available on order',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Barbeque, Open Lawn Access, 24/7 Running Water',
    mainImage: '/images/placeholders/double-bedded-room.svg',
    isActive: true,
    displayOrder: 1,
    images: [
      {
        id: 'dbr-1',
        imageUrl: '/images/placeholders/double-bedded-room.svg',
        caption: 'Double Bedded Room (Awaiting Owner Photo)',
        displayOrder: 1,
      },
      {
        id: 'dbr-2',
        imageUrl: '/images/placeholders/facility-bathroom.svg',
        caption: 'Attached Modern Western Bathroom',
        displayOrder: 2,
      },
      {
        id: 'dbr-3',
        imageUrl: '/images/placeholders/facility-gardens.svg',
        caption: 'Open Courtyard & Garden View',
        displayOrder: 3,
      },
    ],
  },
  {
    id: 'triple-bedded-room',
    name: 'Triple Bedded Room',
    slug: 'triple-bedded-room',
    roomType: 'Triple Bedded Room',
    description:
      'Spacious triple bedded accommodation tailored for small families or friend groups traveling together. Equipped with one double bed and one single bed, attached modern bathroom with geyser, and prompt room service.',
    price: 2200,
    maximumOccupancy: 3,
    bedConfiguration: '1 Double Bed + 1 Single Bed',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; authentic local Bengali cuisine and meals available on order',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Lawn Access, Hill View',
    mainImage: '/images/placeholders/triple-bedded-room.svg',
    isActive: true,
    displayOrder: 2,
    images: [
      {
        id: 'tbr-1',
        imageUrl: '/images/placeholders/triple-bedded-room.svg',
        caption: 'Triple Bedded Room (Awaiting Owner Photo)',
        displayOrder: 1,
      },
      {
        id: 'tbr-2',
        imageUrl: '/images/placeholders/facility-bathroom.svg',
        caption: 'Attached Modern Western Bathroom',
        displayOrder: 2,
      },
      {
        id: 'tbr-3',
        imageUrl: '/images/placeholders/facility-gardens.svg',
        caption: 'Surrounding Green Grounds',
        displayOrder: 3,
      },
    ],
  },
  {
    id: 'four-bedded-room',
    name: 'Four Bedded Room',
    slug: 'four-bedded-room',
    roomType: 'Four Bedded Room',
    description:
      'Large four bedded family room equipped with two comfortable double beds. Perfectly configured for families with children or group getaways exploring Murguma Lake and the nearby waterfalls.',
    price: 2600,
    maximumOccupancy: 4,
    bedConfiguration: '2 Double Beds',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; delicious home-style thalis and breakfast freshly prepared on order',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Barbeque, Hill & Garden View',
    mainImage: '/images/placeholders/four-bedded-room.svg',
    isActive: true,
    displayOrder: 3,
    images: [
      {
        id: 'fbr-1',
        imageUrl: '/images/placeholders/four-bedded-room.svg',
        caption: 'Four Bedded Room (Awaiting Owner Photo)',
        displayOrder: 1,
      },
      {
        id: 'fbr-2',
        imageUrl: '/images/placeholders/facility-bathroom.svg',
        caption: 'Attached Modern Western Bathroom',
        displayOrder: 2,
      },
      {
        id: 'fbr-3',
        imageUrl: '/images/placeholders/facility-gardens.svg',
        caption: 'Resort Garden & Courtyard',
        displayOrder: 3,
      },
    ],
  },
  {
    id: 'five-bedded-room',
    name: 'Five Bedded Room',
    slug: 'five-bedded-room',
    roomType: 'Five Bedded Room',
    description:
      'Expansive five bedded accommodation designed for larger families and joint groups. Provides generous space, room heating for cold winter nights, air conditioning, and direct access to resort lawn amenities.',
    price: 3000,
    maximumOccupancy: 5,
    bedConfiguration: '2 Double Beds + 1 Single Bed',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; authentic farm-to-table dining prepared upon prior request',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Room Heater, Power Backup, Bonfire, Barbeque, Lawn Access',
    mainImage: '/images/placeholders/five-bedded-room.svg',
    isActive: true,
    displayOrder: 4,
    images: [
      {
        id: 'vbr-1',
        imageUrl: '/images/placeholders/five-bedded-room.svg',
        caption: 'Five Bedded Room (Awaiting Owner Photo)',
        displayOrder: 1,
      },
      {
        id: 'vbr-2',
        imageUrl: '/images/placeholders/facility-bathroom.svg',
        caption: 'Attached Modern Western Bathroom',
        displayOrder: 2,
      },
      {
        id: 'vbr-3',
        imageUrl: '/images/placeholders/facility-gardens.svg',
        caption: 'Resort Mountain View Grounds',
        displayOrder: 3,
      },
    ],
  },
  {
    id: 'tent-accommodation',
    name: 'Tent Accommodation',
    slug: 'tent-accommodation',
    roomType: 'Tent Accommodation',
    description:
      'Experience outdoor adventure close to nature with weatherproof canvas tents pitched on the resort grounds. Enjoy crisp mountain breezes, open skies, night campfires, and peaceful stargazing in comfort.',
    price: 1200,
    maximumOccupancy: 2,
    bedConfiguration: 'Twin Camp Bedding / Mattresses',
    isAc: false,
    hasAttachedBath: false,
    extraBedAvailable: false,
    foodInclusion:
      'Complimentary morning tea; evening campfire barbeque and food options on order',
    amenities:
      'Bonfire & Campfire Area, Barbeque, Open Lawn Access, Stargazing View, Power Backup, Clean Washroom Facility',
    mainImage: '/images/placeholders/tent-accommodation.svg',
    isActive: true,
    displayOrder: 5,
    images: [
      {
        id: 'tent-1',
        imageUrl: '/images/placeholders/tent-accommodation.svg',
        caption: 'Weatherproof Tent Accommodation (Awaiting Owner Photo)',
        displayOrder: 1,
      },
      {
        id: 'tent-2',
        imageUrl: '/images/placeholders/facility-bonfire.svg',
        caption: 'Campfire & Lawn Ground',
        displayOrder: 2,
      },
      {
        id: 'tent-3',
        imageUrl: '/images/placeholders/facility-gardens.svg',
        caption: 'Surrounding Nature & Campsite',
        displayOrder: 3,
      },
    ],
  },
];
