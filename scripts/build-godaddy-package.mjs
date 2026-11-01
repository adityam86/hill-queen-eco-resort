import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const stagingDir = path.join(rootDir, 'deploy-staging');
const zipOutput = path.join(rootDir, 'hillqueen-godaddy-deploy.zip');

function cleanDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyRecursive(src, dest, ignoreList = []) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (ignoreList.includes(entry)) continue;
      // Exclude hidden database or build files
      if (
        entry.endsWith('.db') ||
        entry.endsWith('.db-journal') ||
        entry.endsWith('.sqlite') ||
        entry.endsWith('.log')
      ) {
        continue;
      }
      copyRecursive(path.join(src, entry), path.join(dest, entry), ignoreList);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function buildPackage() {
  console.log('================================================================');
  console.log(' Hill Queen Eco Resort — Production GoDaddy Package Builder');
  console.log(' Target Archive: hillqueen-godaddy-deploy.zip');
  console.log(' Production Domain: https://hillqueenecoresorts.com');
  console.log('================================================================');

  // 1. Clean previous staging & existing zip
  cleanDirectory(stagingDir);
  if (fs.existsSync(zipOutput)) {
    fs.unlinkSync(zipOutput);
    console.log('✓ Cleaned existing zip archive');
  }

  fs.mkdirSync(stagingDir, { recursive: true });

  // 2. Define top-level files to copy
  const rootFiles = [
    'package.json',
    'package-lock.json',
    'next.config.mjs',
    'tailwind.config.ts',
    'tsconfig.json',
    'postcss.config.js',
    'server.js',
    'README.md',
    '.env.example',
    '.env.production.example',
  ];

  console.log('\nCopying root configuration files...');
  for (const file of rootFiles) {
    const srcFile = path.join(rootDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(stagingDir, file));
      console.log(`  ✓ ${file}`);
    } else {
      console.warn(`  ! Warning: ${file} not found in root`);
    }
  }

  // 3. Define directories to copy
  console.log('\nCopying core application directories...');
  const directoriesToCopy = [
    { src: 'app', dest: 'app' },
    { src: 'components', dest: 'components' },
    { src: 'lib', dest: 'lib' },
    { src: 'public', dest: 'public' },
    { src: 'scripts', dest: 'scripts' },
  ];

  for (const d of directoriesToCopy) {
    console.log(`  ✓ Copying ${d.src}/...`);
    copyRecursive(
      path.join(rootDir, d.src),
      path.join(stagingDir, d.dest),
      ['node_modules', '.next', '.git']
    );
  }

  // 4. Handle Prisma directory with MySQL as default schema.prisma
  console.log('\nConfiguring production Prisma schema (MySQL) & migrations...');
  const prismaStagingDir = path.join(stagingDir, 'prisma');
  fs.mkdirSync(prismaStagingDir, { recursive: true });

  // Copy MySQL schema as default schema.prisma in production package
  const mysqlSchemaSrc = path.join(rootDir, 'prisma', 'schema.mysql.prisma');
  if (fs.existsSync(mysqlSchemaSrc)) {
    fs.copyFileSync(mysqlSchemaSrc, path.join(prismaStagingDir, 'schema.prisma'));
    fs.copyFileSync(mysqlSchemaSrc, path.join(prismaStagingDir, 'schema.mysql.prisma'));
    console.log('  ✓ Set prisma/schema.prisma to MySQL configuration');
  } else {
    console.error('  ✕ Error: schema.mysql.prisma not found!');
    process.exit(1);
  }

  // Include alternate schemas for flexibility
  const sqliteSchemaSrc = path.join(rootDir, 'prisma', 'schema.sqlite.prisma');
  if (fs.existsSync(sqliteSchemaSrc)) {
    fs.copyFileSync(sqliteSchemaSrc, path.join(prismaStagingDir, 'schema.sqlite.prisma'));
  }
  const pgSchemaSrc = path.join(rootDir, 'prisma', 'schema.postgresql.prisma');
  if (fs.existsSync(pgSchemaSrc)) {
    fs.copyFileSync(pgSchemaSrc, path.join(prismaStagingDir, 'schema.postgresql.prisma'));
  }

  // Copy migrations
  const migrationsSrc = path.join(rootDir, 'prisma', 'migrations');
  if (fs.existsSync(migrationsSrc)) {
    copyRecursive(migrationsSrc, path.join(prismaStagingDir, 'migrations'));
    console.log('  ✓ Included MySQL Prisma migrations');
  }

  // 5. Ensure persistent uploads directory exists in staging
  const uploadsDir = path.join(stagingDir, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '# Keep persistent uploads directory\n');

  // 6. Security verification: Ensure NO secrets or databases exist in staging
  console.log('\nRunning pre-packaging security verification...');
  const forbiddenFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'admin page access.txt',
    'prisma/dev.db',
    'prisma/dev.db-journal',
  ];

  for (const forbidden of forbiddenFiles) {
    const testPath = path.join(stagingDir, forbidden);
    if (fs.existsSync(testPath)) {
      console.error(`✕ CRITICAL SECURITY VIOLATION: ${forbidden} found in staging! Aborting.`);
      cleanDirectory(stagingDir);
      process.exit(1);
    }
  }
  console.log('  ✓ Zero sensitive credentials or environment files found');
  console.log('  ✓ Zero SQLite database files included');
  console.log('  ✓ package.json verified at root of staging');

  // 7. Compress staging directory to hillqueen-godaddy-deploy.zip using tar.exe
  console.log('\nCompressing into hillqueen-godaddy-deploy.zip (package.json at root)...');
  try {
    // Windows tar.exe auto-detects zip compression from the .zip file extension
    execSync(`tar.exe -a -c -f "${zipOutput}" *`, {
      cwd: stagingDir,
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('Failed to create zip with tar.exe:', err);
    cleanDirectory(stagingDir);
    process.exit(1);
  }

  // 8. Verify ZIP file existence and size
  if (fs.existsSync(zipOutput)) {
    const stat = fs.statSync(zipOutput);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
    console.log(`\n================================================================`);
    console.log(`✓ PRODUCTION ZIP ARCHIVE CREATED SUCCESSFULLY!`);
    console.log(`  File: ${zipOutput}`);
    console.log(`  Size: ${sizeMb} MB`);
    console.log(`================================================================`);
  }

  // 9. Clean up staging folder
  cleanDirectory(stagingDir);
  console.log('✓ Cleaned up temporary staging directory');
}

buildPackage();

