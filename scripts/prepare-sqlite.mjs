import { mkdir, open } from 'node:fs/promises';
import path from 'node:path';

try {
  process.loadEnvFile();
} catch {
  // En hosting, DATABASE_URL puede venir del entorno.
}

const url = process.env.DATABASE_URL;
if (!url?.startsWith('file:')) {
  throw new Error('DATABASE_URL debe apuntar a un archivo SQLite (file:...).');
}

const filename = url.slice(5).split('?')[0];
if (filename === ':memory:') process.exit(0);
if (!filename) throw new Error('DATABASE_URL no contiene una ruta de archivo.');

const schemaDir = path.resolve('app/(backend)/prisma');
const databasePath = path.resolve(schemaDir, filename);
await mkdir(path.dirname(databasePath), { recursive: true });
const database = await open(databasePath, 'a');
await database.close();
