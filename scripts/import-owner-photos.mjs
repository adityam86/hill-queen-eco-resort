import fs from 'fs';
import path from 'path';
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

const OWNER_PHOTO_DIR = path.join(process.cwd(), 'owner-photos');
const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function main() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Owner Photograph Importer');
  console.log('========================================================');

  if (!fs.existsSync(OWNER_PHOTO_DIR)) {
    fs.mkdirSync(OWNER_PHOTO_DIR, { recursive: true });
    console.log(`Created directory: ${OWNER_PHOTO_DIR}`);
    console.log('\nDrop your high-resolution resort photographs into this folder:');
    console.log('  1. double-bedded-room.jpg (or .png / .webp)');
    console.log('  2. triple-bedded-room.jpg');
    console.log('  3. four-bedded-room.jpg');
    console.log('  4. five-bedded-room.jpg');
    console.log('  5. tent-accommodation.jpg');
    console.log('  6. resort-exterior-1.jpg, dining-1.jpg, etc.');
    console.log('\nThen run: npm run import-photos');
    return;
  }

  const files = fs.readdirSync(OWNER_PHOTO_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.log(`No images found in ${OWNER_PHOTO_DIR}.`);
    console.log('Drop your genuine resort camera photos here and run again.');
    return;
  }

  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }

  console.log(`Found ${files.length} photo(s) to process...\n`);

  const roomSlugMap = {
    'double': 'double-bedded-room',
    'triple': 'triple-bedded-room',
    'four': 'four-bedded-room',
    'five': 'five-bedded-room',
    'tent': 'tent-accommodation',
  };

  for (const file of files) {
    const cleanName = file.toLowerCase();
    const destFile = `owner-${Date.now()}-${file.replace(/\s+/g, '-').toLowerCase()}`;
    const srcPath = path.join(OWNER_PHOTO_DIR, file);
    const destPath = path.join(PUBLIC_UPLOADS_DIR, destFile);

    fs.copyFileSync(srcPath, destPath);
    const webPath = `/uploads/${destFile}`;
    console.log(`Copied: ${file} -> ${webPath}`);

    // Check if filename matches room category
    let matchedSlug = null;
    for (const [key, slug] of Object.entries(roomSlugMap)) {
      if (cleanName.includes(key)) {
        matchedSlug = slug;
        break;
      }
    }

    if (matchedSlug) {
      const room = await prisma.room.findUnique({ where: { slug: matchedSlug } });
      if (room) {
        // If room currently has placeholder main image, set as main
        if (room.mainImage.includes('/placeholders/')) {
          await prisma.room.update({
            where: { id: room.id },
            data: { mainImage: webPath },
          });
          console.log(`  ✓ Set as MAIN COVER for room: ${room.name}`);
        } else {
          // Add as gallery image
          const count = await prisma.roomImage.count({ where: { roomId: room.id } });
          await prisma.roomImage.create({
            data: {
              roomId: room.id,
              imageUrl: webPath,
              caption: `${room.name} Authentic View`,
              displayOrder: count + 1,
            },
          });
          console.log(`  ✓ Added to GALLERY for room: ${room.name}`);
        }
      }
    } else {
      // Default to Gallery Image
      let category = 'Resort & Exterior';
      if (cleanName.includes('dining') || cleanName.includes('food') || cleanName.includes('kitchen')) {
        category = 'Dining';
      } else if (cleanName.includes('bath') || cleanName.includes('washroom') || cleanName.includes('parking') || cleanName.includes('garden')) {
        category = 'Facilities';
      } else if (cleanName.includes('lake') || cleanName.includes('dam') || cleanName.includes('hill') || cleanName.includes('nature')) {
        category = 'Nature & Surroundings';
      }

      const count = await prisma.galleryImage.count({ where: { category } });
      await prisma.galleryImage.create({
        data: {
          imageUrl: webPath,
          caption: `Hill Queen Eco Resort - ${file.replace(/\.[^/.]+$/, '')}`,
          category,
          displayOrder: count + 1,
        },
      });
      console.log(`  ✓ Added to PUBLIC GALLERY under [${category}]`);
    }
  }

  console.log('\nAll owner photographs processed and linked successfully!');
}

main()
  .catch((e) => {
    console.error('Error during photo import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

