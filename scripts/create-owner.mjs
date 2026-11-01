import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('========================================================');
  console.log(' Hill Queen Eco Resort - Secure Owner Account Setup');
  console.log(' Role: OWNER_ADMIN (Full administrative access)');
  console.log('========================================================');

  // Support environment variables or interactive prompt
  let username = process.env.OWNER_USERNAME || (await question('Enter Owner username (default: owner): ')).trim();
  if (!username) username = 'owner';

  let email = process.env.OWNER_EMAIL || (await question('Enter Owner email: ')).trim();
  let password = process.env.OWNER_PASSWORD || (await question('Enter strong Owner password (min 8 chars): ')).trim();
  let name = process.env.OWNER_NAME || (await question('Enter Owner display name (default: Resort Owner): ')).trim();
  if (!name) name = 'Resort Owner';

  if (!email || !password) {
    console.error('\nError: Owner email and password are required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\nError: Password must be at least 8 characters long for production security.');
    process.exit(1);
  }

  const existing = await prisma.adminUser.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  if (existing) {
    console.log(`\nAccount for ${username} or ${email} already exists. Upgrading to OWNER_ADMIN and resetting password...`);
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        name,
        role: 'OWNER_ADMIN',
        isActive: true,
      },
    });
    console.log('✓ Owner account updated and credentials set successfully.');
  } else {
    await prisma.adminUser.create({
      data: {
        username,
        email,
        passwordHash,
        name,
        role: 'OWNER_ADMIN',
        isActive: true,
      },
    });
    console.log(`\n✓ Owner account "${username}" (${email}) created successfully with role OWNER_ADMIN.`);
  }

  console.log('--------------------------------------------------------');
  console.log('Security Notice: Credentials were hashed using bcrypt (cost 12).');
  console.log('Do not share these credentials with unauthorized staff.');
  console.log('========================================================');

  rl.close();
}

main()
  .catch((e) => {
    console.error('Failed to create owner account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

