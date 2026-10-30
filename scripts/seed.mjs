import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Hill Queen Eco Resort Database ---');

  // 1. Seed or update WebsiteSettings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        resortName: "Hill Queen Eco Resort",
        tagline: "Escape Into Nature. Stay Close to Serenity.",
        address: "Mamudi, Murguma, Purulia, West Bengal, India",
        phonePrimary: "9735888106",
        phoneSecondary: "9733713255",
        phoneTertiary: "8670214030",
        whatsappNumber: "9735888106",
        email: "hillqueenecoresort@gmail.com",
        websiteUrl: "https://hillqueenecoresort.com",
        googleMapsUrl: "https://maps.google.com/?q=Murguma+Dam+Purulia+West+Bengal",
        checkInTime: "11:00 AM",
        checkOutTime: "10:00 AM",
        heroHeading: "Discover Your Peaceful Escape.",
        heroSubheading: "Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.",
        aboutText: "Nestled in the tranquil valley of Mamudi near the scenic Murguma Dam in Purulia, West Bengal, Hill Queen Eco Resort is a peaceful nature retreat designed for travellers seeking rest, clean mountain air, and authentic hospitality. Surrounded by the rolling ridges of the Ajodhya Hills and lush rural landscape, our eco-friendly resort offers comfortable cottage accommodations, home-cooked regional meals, and personalized care. Whether you are seeking a peaceful weekend get-away with family, exploring the hills, or unwinding by the lake, Hill Queen Eco Resort welcomes you to a serene home away from home.",
        seoTitle: "Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia",
        seoDescription: "Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Serene accommodation near Murguma Dam & Ajodhya Hills with authentic hospitality.",
      },
    });
    console.log('✓ Created initial Website Settings with verified contact information');
  }

  // 2. Seed Default Admin User
  const adminEmail = 'admin@hillqueenecoresort.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('AdminPassword@2026', salt);

    await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: adminEmail,
        passwordHash,
        name: 'Resort Administrator',
        role: 'ADMIN',
      },
    });
    console.log('✓ Created default admin user:');
    console.log('   Email: admin@hillqueenecoresort.com');
    console.log('   Username: admin');
    console.log('   Password: AdminPassword@2026');
  }

  // 3. Seed Initial Room Categories (with placeholder photography clearly marked)
  const roomCount = await prisma.room.count();
  if (roomCount === 0) {
    const r1 = await prisma.room.create({
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
        mainImage: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        displayOrder: 1,
      },
    });

    await prisma.roomImage.createMany({
      data: [
        {
          roomId: r1.id,
          imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop",
          caption: "Cottage Front View [Sample Placeholder]",
          displayOrder: 1,
        },
        {
          roomId: r1.id,
          imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
          caption: "Interior Bedding [Sample Placeholder]",
          displayOrder: 2,
        },
        {
          roomId: r1.id,
          imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
          caption: "Porch & Green Surrounds [Sample Placeholder]",
          displayOrder: 3,
        },
      ],
    });

    const r2 = await prisma.room.create({
      data: {
        name: "Deluxe Hillside Family Cottage",
        slug: "deluxe-hillside-family-cottage",
        roomType: "Deluxe Cottage",
        description: "Designed specifically for family vacations and group retreats exploring the Purulia hills. Features spacious double bedding, ample luggage area, natural ventilation, and an attached modern washroom.",
        price: 3200,
        maximumOccupancy: 4,
        bedConfiguration: "2 Double Beds",
        isAc: false,
        hasAttachedBath: true,
        extraBedAvailable: true,
        foodInclusion: "Complimentary morning tea; hearty thali lunches & dinners prepared fresh",
        amenities: "Attached Western Bathroom, Hot Water Facility, Garden View, Outdoor Seating, Campfire Area Access, Room Service",
        mainImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        displayOrder: 2,
      },
    });

    await prisma.roomImage.createMany({
      data: [
        {
          roomId: r2.id,
          imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
          caption: "Family Cottage Exterior [Sample Placeholder]",
          displayOrder: 1,
        },
        {
          roomId: r2.id,
          imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
          caption: "Spacious Room Layout [Sample Placeholder]",
          displayOrder: 2,
        },
      ],
    });

    const r3 = await prisma.room.create({
      data: {
        name: "Standard Serenity Room",
        slug: "standard-serenity-room",
        roomType: "Standard Room",
        description: "Comfortable, quiet and budget-conscious nature lodging for solo travellers, couples, or nature photographers. Enjoy cool hill breezes, pure village silence, and immediate access to scenic walking paths.",
        price: 1800,
        maximumOccupancy: 2,
        bedConfiguration: "1 Double Bed",
        isAc: false,
        hasAttachedBath: true,
        extraBedAvailable: false,
        foodInclusion: "Complimentary morning tea; on-site dining available",
        amenities: "Attached Western Bathroom, Clean Linens, Ceiling Fan, Serene Green View, Secure Vehicle Parking",
        mainImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        displayOrder: 3,
      },
    });

    await prisma.roomImage.createMany({
      data: [
        {
          roomId: r3.id,
          imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
          caption: "Cozy Double Bedroom [Sample Placeholder]",
          displayOrder: 1,
        },
      ],
    });

    console.log('✓ Created 3 initial room categories (ready for owner customization)');
  }

  // 4. Seed Gallery Images with categories
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        {
          imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
          caption: "Murguma Dam and surrounding hills during golden sunset [Sample Placeholder]",
          category: "Nearby Attractions",
          displayOrder: 1,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop",
          caption: "Eco Cottage Surrounded by Greeneries [Sample Placeholder]",
          category: "Resort Exterior",
          displayOrder: 2,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
          caption: "Warm and inviting cottage interior [Sample Placeholder]",
          category: "Rooms",
          displayOrder: 3,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
          caption: "Pristine nature trails and rural tranquility in Mamudi [Sample Placeholder]",
          category: "Property Surroundings",
          displayOrder: 4,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=1200&auto=format&fit=crop",
          caption: "Freshly prepared wholesome regional Bengali cuisine [Sample Placeholder]",
          category: "Food",
          displayOrder: 5,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
          caption: "Evening campfire under the starry night sky [Sample Placeholder]",
          category: "Facilities",
          displayOrder: 6,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop",
          caption: "Cottage veranda overlooking lush greenery [Sample Placeholder]",
          category: "Resort Exterior",
          displayOrder: 7,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
          caption: "Serene lakeside reflection near Murguma Dam [Sample Placeholder]",
          category: "Nearby Attractions",
          displayOrder: 8,
        },
      ],
    });
    console.log('✓ Created initial gallery photographs with category tagging');
  }

  // 5. Seed Core Authentic Facilities
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
    console.log('✓ Created verified core resort facilities');
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
