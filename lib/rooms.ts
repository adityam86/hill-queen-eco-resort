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
    mainImage:
      'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140239/room/1291/kk12uawsodcjszmathmj.jpg',
    isActive: true,
    displayOrder: 1,
    images: [
      {
        id: 'dbr-1',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140239/room/1291/kk12uawsodcjszmathmj.jpg',
        caption: 'Double Bedded Room Interior',
        displayOrder: 1,
      },
      {
        id: 'dbr-2',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148931/property/1681/fmows9mf6wys8dnwucvo.jpg',
        caption: 'Double Bedding Arrangement',
        displayOrder: 2,
      },
      {
        id: 'dbr-3',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
        caption: 'Attached Clean Washroom',
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
    mainImage:
      'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766142007/room/1295/btix3ldfqw5fjxj6vcw3.png',
    isActive: true,
    displayOrder: 2,
    images: [
      {
        id: 'tbr-1',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766142007/room/1295/btix3ldfqw5fjxj6vcw3.png',
        caption: 'Triple Bedded Room Setup',
        displayOrder: 1,
      },
      {
        id: 'tbr-2',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149431/property/1681/ebbpu0tgllitabz8aq6a.jpg',
        caption: 'Triple Bedding Arrangement',
        displayOrder: 2,
      },
      {
        id: 'tbr-3',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
        caption: 'Attached Clean Washroom',
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
    mainImage:
      'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140553/room/1292/sapaiwla6ucutnmlub9j.jpg',
    isActive: true,
    displayOrder: 3,
    images: [
      {
        id: 'fbr-1',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766140553/room/1292/sapaiwla6ucutnmlub9j.jpg',
        caption: 'Four Bedded Room Layout',
        displayOrder: 1,
      },
      {
        id: 'fbr-2',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149492/property/1681/nlhtuuj3bteh3hcql3er.jpg',
        caption: 'Dual Double Bedding Arrangement',
        displayOrder: 2,
      },
      {
        id: 'fbr-3',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757150251/property/1681/x3xwgt8jzhmsff3onkzi.jpg',
        caption: 'Room Perspective',
        displayOrder: 3,
      },
      {
        id: 'fbr-4',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 4,
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
    mainImage:
      'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766141209/room/1293/dfxgqeuckjecp0hfjmae.png',
    isActive: true,
    displayOrder: 4,
    images: [
      {
        id: 'vbr-1',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766141209/room/1293/dfxgqeuckjecp0hfjmae.png',
        caption: 'Five Bedded Room Setup',
        displayOrder: 1,
      },
      {
        id: 'vbr-2',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 2,
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
    mainImage:
      'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766139915/room/1290/wz2jfnidnp9ajvozaoin.jpg',
    isActive: true,
    displayOrder: 5,
    images: [
      {
        id: 'tent-1',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive,w_750,h_500/v1766139915/room/1290/wz2jfnidnp9ajvozaoin.jpg',
        caption: 'Resort Camp Tent',
        displayOrder: 1,
      },
      {
        id: 'tent-2',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160095/property/1681/ponaqgpem2bp44ppihaj.png',
        caption: 'Lawn Tent Accommodation',
        displayOrder: 2,
      },
      {
        id: 'tent-3',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160554/property/1681/g5hqfygdt6mcvqcrq4ve.jpg',
        caption: 'Tents Alongside Resort Rooms',
        displayOrder: 3,
      },
      {
        id: 'tent-4',
        imageUrl:
          'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159836/property/1681/oxyynrssknojbs0o55ln.jpg',
        caption: 'Comfortable Four Sharing Tent Interior',
        displayOrder: 4,
      },
    ],
  },
];
