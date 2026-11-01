import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const prisma = new PrismaClient();

async function exportData() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Safe SQLite Data Exporter');
  console.log('========================================================');

  try {
    // 1. Export Website Settings
    console.log('Reading WebsiteSettings...');
    const settings = await prisma.websiteSettings.findFirst();

    // 2. Export Rooms with RoomImages
    console.log('Reading Rooms and RoomImages...');
    const rooms = await prisma.room.findMany({
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    // 3. Export Facilities
    console.log('Reading Facilities...');
    const facilities = await prisma.facility.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    // Prepare safe payload (strictly NO admin credentials, NO users, NO passwords)
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      resort: 'Hill Queen Eco Resort',
      domain: 'https://hillqueenecoresorts.com',
      version: '1.0.0',
      settings: settings
        ? {
            resortName: settings.resortName,
            tagline: settings.tagline,
            address: settings.address,
            phonePrimary: settings.phonePrimary,
            phoneSecondary: settings.phoneSecondary,
            phoneTertiary: settings.phoneTertiary,
            whatsappNumber: settings.whatsappNumber,
            email: settings.email,
            websiteUrl: settings.websiteUrl,
            googleMapsUrl: settings.googleMapsUrl,
            checkInTime: settings.checkInTime,
            checkOutTime: settings.checkOutTime,
            heroHeading: settings.heroHeading,
            heroSubheading: settings.heroSubheading,
            aboutText: settings.aboutText,
            seoTitle: settings.seoTitle,
            seoDescription: settings.seoDescription,
          }
        : null,
      rooms: rooms.map((room) => ({
        name: room.name,
        slug: room.slug,
        roomType: room.roomType,
        description: room.description,
        price: room.price,
        maximumOccupancy: room.maximumOccupancy,
        bedConfiguration: room.bedConfiguration,
        isAc: room.isAc,
        hasAttachedBath: room.hasAttachedBath,
        extraBedAvailable: room.extraBedAvailable,
        foodInclusion: room.foodInclusion,
        amenities: room.amenities,
        mainImage: room.mainImage,
        isActive: room.isActive,
        displayOrder: room.displayOrder,
        images: room.images.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption,
          displayOrder: img.displayOrder,
        })),
      })),
      facilities: facilities.map((f) => ({
        title: f.title,
        description: f.description,
        icon: f.icon,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
      })),
    };

    const dataDir = path.join(rootDir, 'scripts', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'resort-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportPayload, null, 2), 'utf-8');

    console.log('--------------------------------------------------------');
    console.log(`✓ Data successfully exported to: scripts/data/resort-data.json`);
    console.log(`✓ Rooms exported: ${rooms.length}`);
    console.log(`✓ Facilities exported: ${facilities.length}`);
    console.log(`✓ Settings exported: ${settings ? 'Yes' : 'No'}`);
    console.log('✓ Security check: Zero admin passwords or credentials exported.');
    console.log('========================================================');
  } catch (err) {
    console.error('Export failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();

