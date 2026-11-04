import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  const fallbackUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL;
  if (fallbackUrl) {
    process.env.DATABASE_URL = fallbackUrl;
  }
}

const prisma = new PrismaClient();

const FUSIONSTAYS_ROOMS = [
  {
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
    mainImage: '/images/rooms/double-bedded-room.jpg',
    isActive: true,
    displayOrder: 1,
    images: [
      {
        imageUrl: '/images/rooms/double-bedded-room.jpg',
        caption: 'Double Bedded Room Interior',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/rooms/double-bedding.jpg',
        caption: 'Double Bedding Arrangement',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 3,
      },
    ],
  },
  {
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
    mainImage: '/images/rooms/triple-bedded-room.png',
    isActive: true,
    displayOrder: 2,
    images: [
      {
        imageUrl: '/images/rooms/triple-bedded-room.png',
        caption: 'Triple Bedded Room Setup',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/rooms/triple-bedding.jpg',
        caption: 'Triple Bedding Arrangement',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 3,
      },
    ],
  },
  {
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
    mainImage: '/images/rooms/four-bedded-room.jpg',
    isActive: true,
    displayOrder: 3,
    images: [
      {
        imageUrl: '/images/rooms/four-bedded-room.jpg',
        caption: 'Four Bedded Room Layout',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/rooms/four-bedding.jpg',
        caption: 'Dual Double Bedding Arrangement',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/rooms/four-perspective.jpg',
        caption: 'Room Perspective',
        displayOrder: 3,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 4,
      },
    ],
  },
  {
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
    mainImage: '/images/rooms/five-bedded-room.png',
    isActive: true,
    displayOrder: 4,
    images: [
      {
        imageUrl: '/images/rooms/five-bedded-room.png',
        caption: 'Five Bedded Room Setup',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/facilities/lawns.jpg',
        caption: 'Lawn Access',
        displayOrder: 3,
      },
    ],
  },
  {
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
    mainImage: '/images/rooms/tent-accommodation.jpg',
    isActive: true,
    displayOrder: 5,
    images: [
      {
        imageUrl: '/images/rooms/tent-accommodation.jpg',
        caption: 'Resort Camp Tent',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/rooms/lawn-tent.png',
        caption: 'Lawn Tent Accommodation',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/rooms/tents-cottages.jpg',
        caption: 'Tents Alongside Resort Rooms',
        displayOrder: 3,
      },
      {
        imageUrl: '/images/rooms/tent-interior.jpg',
        caption: 'Comfortable Four Sharing Tent Interior',
        displayOrder: 4,
      },
      {
        imageUrl: '/images/facilities/bonfire.png',
        caption: 'Campfire Ground',
        displayOrder: 5,
      },
    ],
  },
  {
    name: 'Six Bedded Room',
    slug: 'six-bedded-room',
    roomType: 'Six Bedded Room',
    description:
      'Spacious six bedded family and group accommodation ideal for touring parties, extended families, and trekking teams visiting Murguma Dam and Ajodhya Hills. Features comfortable multi-bed layout, attached western washroom, continuous running water, and garden veranda access.',
    price: 2750,
    maximumOccupancy: 6,
    bedConfiguration: '3 Double Beds',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; home-cooked Bengali thalis and fresh meals available on order',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Barbeque, Open Lawn Access, 24/7 Running Water',
    mainImage: '/images/placeholders/six-bedded-room.svg',
    isActive: true,
    displayOrder: 6,
    images: [
      {
        imageUrl: '/images/placeholders/six-bedded-room.svg',
        caption: 'Six Bedded Room Layout - Awaiting Owner Upload',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/facilities/lawns.jpg',
        caption: 'Veranda & Open Lawn Access',
        displayOrder: 3,
      },
    ],
  },
  {
    name: 'Eight Bedded Room',
    slug: 'eight-bedded-room',
    roomType: 'Eight Bedded Room',
    description:
      'Grand eight bedded dormitory-style family suite tailored for large family gatherings, trekking clubs, and student groups exploring Purulia. Provides expansive space for 8 guests, attached modern washroom, running water, and serene hillside surroundings.',
    price: 3500,
    maximumOccupancy: 8,
    bedConfiguration: '4 Double Beds',
    isAc: true,
    hasAttachedBath: true,
    extraBedAvailable: true,
    foodInclusion:
      'Complimentary morning tea; authentic Bengali feasts and group dining available on advance notice',
    amenities:
      'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Barbeque, Open Lawn Access, 24/7 Running Water',
    mainImage: '/images/placeholders/eight-bedded-room.svg',
    isActive: true,
    displayOrder: 7,
    images: [
      {
        imageUrl: '/images/placeholders/eight-bedded-room.svg',
        caption: 'Eight Bedded Room Layout - Awaiting Owner Upload',
        displayOrder: 1,
      },
      {
        imageUrl: '/images/facilities/bathroom.jpg',
        caption: 'Attached Clean Washroom',
        displayOrder: 2,
      },
      {
        imageUrl: '/images/facilities/lawns.jpg',
        caption: 'Open Garden & Mountain Breeze',
        displayOrder: 3,
      },
    ],
  },
];

async function main() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Production Database Seed');
  console.log('========================================================');

  // 1. Seed or update WebsiteSettings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        resortName: "Hill Queen Eco Resort",
        tagline: "Escape Into Nature. Stay Close to Serenity.",
        address: "Mamudi, Murguma, Purulia, West Bengal 723152, India",
        phonePrimary: "9735888106",
        phoneSecondary: "9733713255",
        phoneTertiary: "8670214030",
        whatsappNumber: "9735888106",
        email: "hillqueenecoresort@gmail.com",
        websiteUrl: "https://hillqueenecoresorts.com",
        googleMapsUrl: "https://share.google/yDmE0tmJM7PhlxVlN",
        checkInTime: "11:00 AM",
        checkOutTime: "10:00 AM",
        heroHeading: "Discover Your Peaceful Escape.",
        heroSubheading: "Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.",
        aboutText: "Nestled in the tranquil valley of Mamudi near the scenic Murguma Dam in Purulia, West Bengal, Hill Queen Eco Resort is a peaceful nature retreat designed for travellers seeking rest, clean mountain air, and authentic hospitality. Surrounded by the rolling ridges of the Ajodhya Hills and lush rural landscape, our eco-friendly resort offers comfortable cottage accommodations, home-cooked regional meals, and personalized care. Whether you are seeking a peaceful weekend get-away with family, exploring the hills, or unwinding by the lake, Hill Queen Eco Resort welcomes you to a serene home away from home.",
        seoTitle: "Hill Queen Eco Resort | Luxury Nature Retreat in Murguma, Purulia",
        seoDescription: "Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia, West Bengal 723152. Serene accommodation near Murguma Dam & Ajodhya Hills with authentic hospitality.",
      },
    });
    console.log('✓ Created Website Settings');
  } else {
    console.log('✓ Preserved existing Website Settings');
  }

  // 2. Upsert the 5 Room Categories
  for (const roomData of FUSIONSTAYS_ROOMS) {
    const { images, ...roomFields } = roomData;
    const existing = await prisma.room.findUnique({
      where: { slug: roomFields.slug },
    });

    let roomId = '';
    if (!existing) {
      const created = await prisma.room.create({ data: roomFields });
      roomId = created.id;
      console.log(`✓ Created room category: ${roomFields.name}`);
    } else {
      roomId = existing.id;
      await prisma.room.update({
        where: { id: existing.id },
        data: {
          name: roomFields.name,
          roomType: roomFields.roomType,
          description: roomFields.description,
          maximumOccupancy: roomFields.maximumOccupancy,
          bedConfiguration: roomFields.bedConfiguration,
          isAc: roomFields.isAc,
          hasAttachedBath: roomFields.hasAttachedBath,
          extraBedAvailable: roomFields.extraBedAvailable,
          foodInclusion: roomFields.foodInclusion,
          amenities: roomFields.amenities,
          mainImage: roomFields.mainImage,
          isActive: true,
          displayOrder: roomFields.displayOrder,
        },
      });
      console.log(`✓ Synchronized room category: ${roomFields.name}`);
    }

    if (images && images.length > 0) {
      await prisma.roomImage.deleteMany({ where: { roomId } });
      await prisma.roomImage.createMany({
        data: images.map((img) => ({
          roomId,
          imageUrl: img.imageUrl,
          caption: img.caption,
          displayOrder: img.displayOrder,
        })),
      });
    }
  }

  // Remove old dummy rooms
  await prisma.room.deleteMany({
    where: {
      slug: {
        in: [
          'eco-lake-view-cottage',
          'deluxe-family-cottage',
          'deluxe-hillside-family-cottage',
          'ajodhya-view-double-room',
          'standard-serenity-room',
        ],
      },
    },
  });

  // 3. Core facilities
  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    await prisma.facility.createMany({
      data: [
        {
          title: "Serene Lakeside Location",
          description: "Situated in Mamudi, just minutes away from scenic Murguma Dam and the serene Purulia hills.",
          icon: "Mountain",
          displayOrder: 1,
          isActive: true,
        },
        {
          title: "Fresh Home-Cooked Food",
          description: "Wholesome, delicious local Bengali and Indian meals prepared freshly upon request.",
          icon: "Utensils",
          displayOrder: 2,
          isActive: true,
        },
        {
          title: "Campfire & Stargazing",
          description: "Open lush grounds perfect for evening campfires, folk music, and unobstructed stargazing.",
          icon: "Flame",
          displayOrder: 3,
          isActive: true,
        },
        {
          title: "Sightseeing Assistance",
          description: "Local guidance and transport arrangement to Ajodhya Hills, Bamni Falls, Marble Lake, and dams.",
          icon: "Compass",
          displayOrder: 4,
          isActive: true,
        },
        {
          title: "Clean Attached Bathrooms",
          description: "Well-maintained modern western sanitation facilities with 24/7 running water.",
          icon: "Bath",
          displayOrder: 5,
          isActive: true,
        },
        {
          title: "Secure On-Site Parking",
          description: "Spacious private parking area inside the property premises for your cars and bikes.",
          icon: "ShieldCheck",
          displayOrder: 6,
          isActive: true,
        },
      ],
    });
    console.log('✓ Created verified resort facilities');
  }

  console.log('✓ Production database sync completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during production seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
