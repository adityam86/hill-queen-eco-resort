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
  console.log('==============================================');
  console.log(' Hill Queen Eco Resort - Secure Admin Setup');
  console.log('==============================================');

  const username = (await question('Enter admin username: ')).trim();
  const email = (await question('Enter admin email: ')).trim();
  const password = (await question('Enter strong admin password: ')).trim();
  const name = (await question('Enter administrator display name (optional): ')).trim();

  if (!username || !email || !password) {
    console.error('Error: Username, email, and password are all required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
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
    console.log(`User ${username} or email ${email} already exists. Updating password...`);
    await prisma.adminUser.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        name: name || existing.name,
      },
    });
    console.log('✓ Admin password updated successfully.');
  } else {
    await prisma.adminUser.create({
      data: {
        username,
        email,
        passwordHash,
        name: name || 'Resort Administrator',
        role: 'ADMIN',
      },
    });
    console.log(`✓ Admin user "${username}" created successfully.`);
  }

  rl.close();
}

main()
  .catch((e) => {
    console.error('Failed to create admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
