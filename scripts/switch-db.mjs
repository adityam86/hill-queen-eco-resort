import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetDb = (process.argv[2] || '').toLowerCase();

if (!['sqlite', 'postgresql', 'mysql'].includes(targetDb)) {
  console.log('Usage: node scripts/switch-db.mjs <sqlite|postgresql|mysql>');
  console.log('Example: node scripts/switch-db.mjs mysql');
  process.exit(1);
}

let sourceSchema = '';
if (targetDb === 'sqlite') {
  sourceSchema = path.join(rootDir, 'prisma', 'schema.prisma'); // Or backup
} else if (targetDb === 'postgresql') {
  sourceSchema = path.join(rootDir, 'prisma', 'schema.postgresql.prisma');
} else if (targetDb === 'mysql') {
  sourceSchema = path.join(rootDir, 'prisma', 'schema.mysql.prisma');
}

const destSchema = path.join(rootDir, 'prisma', 'schema.prisma');

if (targetDb !== 'sqlite') {
  fs.copyFileSync(sourceSchema, destSchema);
  console.log(`Successfully switched prisma/schema.prisma to ${targetDb.toUpperCase()}`);
} else {
  // If reverting to sqlite, ensure sqlite schema is present
  const sqliteContent = fs.readFileSync(path.join(rootDir, 'prisma', 'schema.sqlite.prisma'), 'utf-8');
  fs.writeFileSync(destSchema, sqliteContent);
  console.log(`Successfully switched prisma/schema.prisma to SQLITE`);
}
console.log('Next step: run `npx prisma generate` and `npx prisma db push` or `npx prisma migrate deploy`');
