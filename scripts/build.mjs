import { execSync } from 'child_process';

console.log('--- Hill Queen Eco Resort Build Pipeline ---');

// 1. Resolve database URL from any Vercel environment variable variant
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;
if (dbUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

// 2. Generate Prisma client
console.log('[1/3] Generating Prisma client...');
execSync('npx prisma generate', { stdio: 'inherit' });

// 3. If a remote production database is configured, push schema & seed
if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://') || dbUrl.startsWith('mysql://'))) {
  console.log('[2/3] Remote database connection detected. Synchronizing schema and seeding...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log('✓ Database tables created/verified successfully.');

    execSync('node scripts/seed.mjs', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log('✓ Database seeded successfully.');
  } catch (err) {
    console.error('Database migration/seed warning:', err.message);
  }
} else {
  console.log('[2/3] Skipping remote database push (no remote PostgreSQL/MySQL connection string during build).');
}

// 4. Build Next.js application
console.log('[3/3] Compiling Next.js application...');
execSync('npx next build', { stdio: 'inherit' });

