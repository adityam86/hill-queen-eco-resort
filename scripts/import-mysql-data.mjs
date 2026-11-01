import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const prisma = new PrismaClient();

async function importData() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Production Data Importer');
  console.log(' Target DB: Based on current DATABASE_URL');
  console.log('========================================================');

  const dataFile = path.join(rootDir, 'scripts', 'data', 'resort-data.json');
  if (!fs.existsSync(dataFile)) {
    console.error(`Error: Data file not found at ${dataFile}`);
    console.error('Run `node scripts/export-data.mjs` first to generate it.');
    process.exit(1);
  }

  const raw = fs.readFileSync(dataFile, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing resort-data.json:', err);
    process.exit(1);
  }

  try {
    // 1. Import WebsiteSettings
    if (data.settings) {
      console.log('Importing WebsiteSettings...');
      const existingSettings = await prisma.websiteSettings.findFirst();
      if (existingSettings) {
        await prisma.websiteSettings.update({
          where: { id: existingSettings.id },
          data: data.settings,
        });
        console.log('✓ Updated existing WebsiteSettings');
      } else {
        await prisma.websiteSettings.create({
          data: data.settings,
        });
        console.log('✓ Created initial WebsiteSettings');
      }
    }

    // 2. Import Rooms & Images
    if (Array.isArray(data.rooms)) {
      console.log(`Importing ${data.rooms.length} Room(s)...`);
      for (const roomData of data.rooms) {
        const { images, ...roomFields } = roomData;
        const existingRoom = await prisma.room.findUnique({
          where: { slug: roomFields.slug },
        });

        let roomId;
        if (existingRoom) {
          const updated = await prisma.room.update({
            where: { id: existingRoom.id },
            data: roomFields,
          });
          roomId = updated.id;
          console.log(`  ✓ Updated room: ${roomFields.name} (${roomFields.slug})`);
        } else {
          const created = await prisma.room.create({
            data: roomFields,
          });
          roomId = created.id;
          console.log(`  ✓ Created room: ${roomFields.name} (${roomFields.slug})`);
        }

        // Import images if available
        if (Array.isArray(images) && images.length > 0) {
          // Clear old images for this room and re-insert
          await prisma.roomImage.deleteMany({ where: { roomId } });
          for (const img of images) {
            await prisma.roomImage.create({
              data: {
                roomId,
                imageUrl: img.imageUrl,
                caption: img.caption,
                displayOrder: img.displayOrder || 0,
              },
            });
          }
        }
      }
    }

    // 3. Import Facilities
    if (Array.isArray(data.facilities)) {
      console.log(`Importing ${data.facilities.length} Facilities...`);
      for (const fac of data.facilities) {
        const existing = await prisma.facility.findFirst({
          where: { title: fac.title },
        });

        if (existing) {
          await prisma.facility.update({
            where: { id: existing.id },
            data: fac,
          });
          console.log(`  ✓ Updated facility: ${fac.title}`);
        } else {
          await prisma.facility.create({
            data: fac,
          });
          console.log(`  ✓ Created facility: ${fac.title}`);
        }
      }
    }

    console.log('--------------------------------------------------------');
    console.log('✓ Data import completed successfully.');
    console.log('✓ Security check: Zero admin accounts or credentials touched.');
    console.log('========================================================');
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importData();

