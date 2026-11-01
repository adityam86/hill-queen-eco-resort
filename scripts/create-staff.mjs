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
  console.log(' Hill Queen Eco Resort - Secure Staff Account Setup');
  console.log(' Role: STAFF (Restricted: can edit room rates & gallery)');
  console.log(' Cannot edit website settings or manage accounts.');
  console.log('========================================================');

  let username = process.env.STAFF_USERNAME || (await question('Enter Staff username: ')).trim();
  let email = process.env.STAFF_EMAIL || (await question('Enter Staff email: ')).trim();
  let password = process.env.STAFF_PASSWORD || (await question('Enter Staff password (min 8 chars): ')).trim();
  let name = process.env.STAFF_NAME || (await question('Enter Staff full name (default: Resort Staff): ')).trim();
  if (!name) name = 'Resort Staff';

  if (!username || !email || !password) {
    console.error('\nError: Username, email, and password are required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\nError: Password must be at least 8 characters long.');
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
    console.log(`\nAccount for ${username} or ${email} already exists. Updating password and role to STAFF...`);
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        name,
        role: 'STAFF',
        isActive: true,
      },
    });
    console.log('✓ Staff account updated successfully.');
  } else {
    await prisma.adminUser.create({
      data: {
        username,
        email,
        passwordHash,
        name,
        role: 'STAFF',
        isActive: true,
      },
    });
    console.log(`\n✓ Staff account "${username}" (${email}) created successfully with role STAFF.`);
  }

  console.log('========================================================');
  rl.close();
}

main()
  .catch((e) => {
    console.error('Failed to create staff account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

