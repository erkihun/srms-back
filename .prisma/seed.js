import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSql(relativePath) {
  const filePath = path.resolve(__dirname, '..', relativePath);
  const sql = await readFile(filePath, 'utf8');

  if (!sql.trim()) {
    console.warn(`Skipping empty SQL file: ${relativePath}`);
    return;
  }

  console.log(`→ Running ${relativePath}`);
  await prisma.$executeRawUnsafe(sql);
}

async function main() {
  try {
    await runSql('database/schema.sql');
    await runSql('database/seed.sql');
    console.log('✅ Prisma seed completed.');
  } catch (error) {
    console.error('❌ Prisma seed failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
