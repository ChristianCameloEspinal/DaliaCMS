import { prisma } from '../db/prisma';
import { hashPassword } from '../core/auth/password';
import { EXAMPLE_PAGES, EXAMPLE_VARIABLES } from './company-example';
import { serializeEditorVariables } from '../core/editor-variables/editor-variables.types';

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME;

  if (!adminEmail || !adminPassword) {
    throw new Error('SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD son obligatorios para el seed');
  }

  await prisma.user.upsert({
    where: { user_email: adminEmail },
    update: {},
    create: {
      user_email: adminEmail,
      user_pass: await hashPassword(adminPassword),
      user_name: adminName,
      user_role: 'admin',
    },
  });

  await prisma.postType.upsert({
    where: { post_type: 'page' },
    update: {},
    create: {
      post_type: 'page',
      post_type_label: 'Páginas',
      post_type_system: true,
    },
  });

  await prisma.postType.upsert({
    where: { post_type: 'post' },
    update: {},
    create: {
      post_type: 'post',
      post_type_label: 'Entradas',
      post_type_system: true,
    },
  });

  // Variables de estilo globales de ejemplo.
  await prisma.setting.upsert({
    where: { key: 'editor_variables' },
    update: {},
    create: { key: 'editor_variables', value: serializeEditorVariables([...EXAMPLE_VARIABLES]) },
  });

  // Paginas de ejemplo publicadas.
  for (const page of EXAMPLE_PAGES) {
    await prisma.post.upsert({
      where: {
        post_type_post_name: {
          post_type: page.post_type,
          post_name: page.post_name,
        },
      },
      update: {
        post_title: page.post_title,
        post_excerpt: page.post_excerpt,
        post_status: page.post_status,
        post_content: page.post_content,
        post_meta_title: page.post_meta_title,
        post_meta_description: page.post_meta_description,
        post_date: new Date(),
      },
      create: {
        post_type: page.post_type,
        post_name: page.post_name,
        post_title: page.post_title,
        post_excerpt: page.post_excerpt,
        post_status: page.post_status,
        post_content: page.post_content,
        post_meta_title: page.post_meta_title,
        post_meta_description: page.post_meta_description,
        post_date: new Date(),
      },
    });
  }

  console.log(`Seed completado. Paginas de ejemplo en ${EXAMPLE_PAGES.map((page) => `/${page.post_name}`).join(', ')}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
