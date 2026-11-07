import { defineConfig } from 'prisma/config';

// Con un archivo de config, Prisma ya NO carga `.env` automáticamente.
// Lo cargamos manualmente (Node 22.11+) para que `DATABASE_URL` y las
// variables `SEED_ADMIN_*` estén disponibles tanto para los comandos de
// Prisma como para el subproceso de seed (`tsx`), que hereda el entorno.
try {
  process.loadEnvFile();
} catch {
  // No hay `.env`; se asume que las variables vienen del entorno del sistema.
}

export default defineConfig({
  // Las rutas son strings JS literales: los paréntesis de `(backend)` no
  // sufren el problema de comillas que tenía el comando seed en package.json.
  schema: 'app/(backend)/prisma/schema.prisma',
  migrations: {
    path: 'app/(backend)/prisma/sqlite-migrations',
    seed: 'tsx app/(backend)/prisma/seed.ts',
  },
});
