import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './src/models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSqlFile(relativePath) {
  const filePath = path.resolve(__dirname, relativePath);
  const sql = await readFile(filePath, 'utf8');

  if (!sql.trim()) {
    console.warn(`Skipping empty SQL file: ${relativePath}`);
    return;
  }

  console.log(`→ Executing ${relativePath}`);
  await pool.query(sql);
}

async function main() {
  try {
    await runSqlFile('database/schema.sql');
    await runSqlFile('database/seed.sql');
    console.log('✅ Database schema and seed data applied successfully.');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
