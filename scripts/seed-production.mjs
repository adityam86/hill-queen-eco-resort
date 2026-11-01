import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Production Database Seed');
  console.log(' Policy: No fake/sample photos seeded in production');
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
    console.log('✓ Created Website Settings with verified contact details and location');
  } else {
    console.log('✓ Website Settings already exist; preserved');
  }

  // 2. Seed Initial Room Categories with clean branded placeholder
  const roomCount = await prisma.room.count();
  if (roomCount === 0) {
    await prisma.room.create({
      data: {
        name: "Eco Lake View Cottage",
        slug: "eco-lake-view-cottage",
        roomType: "Cottage",
        description: "Spacious independent cottage featuring panoramic views of the scenic countryside and gentle breezes from nearby Murguma Dam. Crafted with warm rustic touches, a private veranda, and comfortable double bedding for restful sleep.",
        price: 2500,
        maximumOccupancy: 3,
        bedConfiguration: "1 King Bed + Extra Bed Space",
        isAc: false,
        hasAttachedBath: true,
        extraBedAvailable: true,
        foodInclusion: "Complimentary morning tea; fresh home-cooked meals available on order",
        amenities: "Attached Western Bathroom, 24/7 Running Water, Private Veranda, Mountain View, Power Backup, Tea Maker",
        mainImage: "/images/room-placeholder.svg",
        isActive: true,
        displayOrder: 1,
      },
    });

    await prisma.room.create({
      data: {
        name: "Deluxe Family Cottage",
        slug: "deluxe-family-cottage",
        roomType: "Family Cottage",
        description: "Large family-oriented eco cottage nestled among native trees. Designed for comfort, relaxation, and memorable family time with two separate bed setups and an expansive front seating portico.",
        price: 3500,
        maximumOccupancy: 4,
        bedConfiguration: "2 Double Beds",
        isAc: false,
        hasAttachedBath: true,
        extraBedAvailable: true,
        foodInclusion: "Complimentary morning tea; traditional Bengali thali on order",
        amenities: "Attached Western Bathroom, Dual Bedding, Power Backup, Private Garden Seating, Geyser on Demand",
        mainImage: "/images/room-placeholder.svg",
        isActive: true,
        displayOrder: 2,
      },
    });

    await prisma.room.create({
      data: {
        name: "Ajodhya View Double Room",
        slug: "ajodhya-view-double-room",
        roomType: "Standard Room",
        description: "Cozy and comfortable double room offering a restful atmosphere after a day of sightseeing across Ajodhya Hills, Bamni Falls, and Murguma Lake. Features serene natural ventilation and quiet surroundings.",
        price: 2000,
        maximumOccupancy: 2,
        bedConfiguration: "1 Queen Bed",
        isAc: false,
        hasAttachedBath: true,
        extraBedAvailable: false,
        foodInclusion: "Complimentary morning tea; authentic meals available on order",
        amenities: "Attached Western Bathroom, Running Water, Hillside Window, Room Service, Quiet Ambiance",
        mainImage: "/images/room-placeholder.svg",
        isActive: true,
        displayOrder: 3,
      },
    });

    console.log('✓ Created 3 room categories with approved tariffs and branded placeholders');
  } else {
    console.log(`✓ Rooms already present (${roomCount} rooms); preserved existing rates and descriptions`);
  }

  // 3. Seed Core Authentic Facilities
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
  } else {
    console.log('✓ Facilities already exist; preserved');
  }

  // Note: Gallery photos are intentionally NOT seeded with sample photos.
  console.log('✓ Gallery photo policy: Zero fake/sample photos seeded.');
  console.log('  Owners and staff can upload authentic photographs via Admin Dashboard.');

  // 4. Owner Account Notice
  const adminCount = await prisma.adminUser.count({ where: { role: 'OWNER_ADMIN' } });
  if (adminCount === 0) {
    console.log('\n[NOTICE] No OWNER_ADMIN account found.');
    console.log('Run `npm run create:owner` or set OWNER_EMAIL and OWNER_PASSWORD to create the initial owner account.');
  } else {
    console.log(`✓ Owner account exists (${adminCount} owner admin found).`);
  }

  console.log('--------------------------------------------------------');
  console.log('✓ Production database seeding finished successfully');
  console.log('========================================================');
}

main()
  .catch((e) => {
    console.error('Error during production seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

