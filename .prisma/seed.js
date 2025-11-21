import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  console.log(`-> Running ${relativePath}`);
  await prisma.$executeRawUnsafe(sql);
}

async function ensureDefaultAdmin() {
  console.log('-> Ensuring default department and admin user');

  const department = await prisma.department.upsert({
    where: { name: 'ICT Department' },
    update: {},
    create: {
      name: 'ICT Department',
      description: 'Default ICT department'
    }
  });

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      departmentId: department.id,
      username: 'admin',
      isActive: true,
      phone: '0700000000'
    },
    create: {
      fullName: 'System Administrator',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
      departmentId: department.id,
      isActive: true,
      username: 'admin',
      phone: '0700000000'
    }
  });

  console.log('-> Default admin user ready (password: Admin@123)');
}

async function main() {
  try {
    await runSql('database/schema.sql');
    await runSql('database/seed.sql');
    await ensureDefaultAdmin();
    console.log('Prisma seed completed.');
  } catch (error) {
    console.error('Prisma seed failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
