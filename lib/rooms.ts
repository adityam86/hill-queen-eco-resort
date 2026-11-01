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
    id: 'eco-lake-view-cottage',
    name: 'Eco Lake View Cottage',
    slug: 'eco-lake-view-cottage',
    roomType: 'Cottage',
    description:
      'Spacious independent cottage featuring panoramic views of the scenic countryside and gentle breezes from nearby Murguma Dam. Crafted with warm rustic touches, a private veranda, and comfortable double bedding for restful sleep.',
    price: 2500,
    maximumOccupancy: 3,
    bedConfiguration: '1 King Bed + Extra Bed Space',
    isAc: false,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion: 'Complimentary morning tea; fresh home-cooked meals available on order',
    amenities:
      'Attached Western Bathroom, 24/7 Running Water, Private Veranda, Mountain View, Power Backup, Tea Maker',
    mainImage: '/images/room-placeholder.svg',
    isActive: true,
    displayOrder: 1,
    images: [
      {
        id: 'img-1',
        imageUrl: '/images/room-placeholder.svg',
        caption: 'Cottage Exterior Veranda',
        displayOrder: 1,
      },
    ],
  },
  {
    id: 'deluxe-family-cottage',
    name: 'Deluxe Family Cottage',
    slug: 'deluxe-family-cottage',
    roomType: 'Family Cottage',
    description:
      'Large family-oriented eco cottage nestled among native trees. Designed for comfort, relaxation, and memorable family time with two separate bed setups and an expansive front seating portico.',
    price: 3500,
    maximumOccupancy: 4,
    bedConfiguration: '2 Double Beds',
    isAc: false,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion: 'Complimentary morning tea; traditional Bengali thali on order',
    amenities:
      'Attached Western Bathroom, Dual Bedding, Power Backup, Private Garden Seating, Geyser on Demand',
    mainImage: '/images/room-placeholder.svg',
    isActive: true,
    displayOrder: 2,
    images: [
      {
        id: 'img-2',
        imageUrl: '/images/room-placeholder.svg',
        caption: 'Family Cottage Layout',
        displayOrder: 1,
      },
    ],
  },
  {
    id: 'ajodhya-view-double-room',
    name: 'Ajodhya View Double Room',
    slug: 'ajodhya-view-double-room',
    roomType: 'Standard Room',
    description:
      'Cozy and comfortable double room offering a restful atmosphere after a day of sightseeing across Ajodhya Hills, Bamni Falls, and Murguma Lake. Features serene natural ventilation and quiet surroundings.',
    price: 2000,
    maximumOccupancy: 2,
    bedConfiguration: '1 Queen Bed',
    isAc: false,
    hasAttachedBath: true,
    extraBedAvailable: false,
    foodInclusion: 'Complimentary morning tea; authentic meals available on order',
    amenities:
      'Attached Western Bathroom, Running Water, Hillside Window, Room Service, Quiet Ambiance',
    mainImage: '/images/room-placeholder.svg',
    isActive: true,
    displayOrder: 3,
    images: [
      {
        id: 'img-3',
        imageUrl: '/images/room-placeholder.svg',
        caption: 'Standard Double Room View',
        displayOrder: 1,
      },
    ],
  },
];

