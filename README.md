# Dalia CMS PoC

Dalia CMS PoC es una prueba mínima de un CMS propio construido con Next.js, TypeScript y Prisma.

El objetivo inicial es validar un modelo de contenido inspirado en WordPress: todo el contenido se guarda como `Post`, y su naturaleza se define mediante `post_type`.

No habrá tablas separadas para páginas, entradas, servicios o proyectos. Una página es un `Post` con `post_type = page`. Un servicio es un `Post` con `post_type = service`. Un proyecto es un `Post` con `post_type = project`.

La PoC no incluye frontend público, media library, post meta, taxonomías, plugins, hooks, editor visual ni sistema de temas. Primero se valida el núcleo de datos y administración.

---

## 1. Objetivo

Construir un núcleo simple de CMS que permita:

* Iniciar sesión en un panel básico.
* Crear y gestionar `post_types`.
* Crear y gestionar `posts`.
* Usar una estructura de base de datos parecida al modelo `wp_posts`.
* Mantener Prisma desacoplado del resto del proyecto.
* Validar que distintos tipos de contenido puedan existir sin modificar código.

Ejemplos de `post_type`:

```txt
page
post
service
project
testimonial
faq
```

---

## 2. Principios

La PoC debe ser deliberadamente pequeña.

No usar:

```txt
Payload
Puck
Strapi
Directus
Editor visual
Media library
Plugins
Hooks complejos
Frontend público
Sistema de temas
Marketplace
ORM adicional
```

Prisma será la única capa externa de base de datos.

Regla principal:

```txt
Todo contenido editable es un Post.
Lo que cambia es su post_type.
```

---

## 3. Arquitectura

Estructura real del proyecto. Next.js (App Router) usa *route groups* para separar zonas de la app sin afectar las URLs: `(backend)` agrupa todo el panel de administración junto con sus capas internas (`core/`, `db/`, `prisma/`, `components/`), y `(frontend)` queda reservado para el futuro sitio público (vacío en esta PoC).

```txt
dalia-cms/
  data/              # archivo SQLite persistente
  app/
    (backend)/
      layout.tsx
      page.tsx          # redirige a /admin
      globals.css
      admin/
        login/
          page.tsx
          actions.ts
        (protected)/
          layout.tsx     # valida sesión + sidebar + AdminShell (breadcrumb)
          page.tsx       # dashboard
          post-types/
          posts/
            [id]/         # edición unificada: configuración + bloques
              editor/    # redirección legacy a /admin/posts/[id]
          components/    # /admin/components (listado de Components sincronizados)
          media/         # /admin/media (biblioteca de medios)
          library/       # /admin/library (inventario visual de UI e iconos)

      core/
        auth/
          auth.service.ts
          session.ts
          password.ts

        posts/
          post.service.ts
          post.types.ts

        post-types/
          post-type.service.ts
          post-type.types.ts

        editor-variables/
          editor-variables.service.ts # diccionario global de variables del editor en Setting
          editor-variables.types.ts
          editor-variables.styles.ts # tokens CSS y anchos de bloque

        post-revisions/
          post-revision.service.ts # snapshots guardados del editor por Post
          post-revision.types.ts


        patterns/
          pattern.service.ts    # Components sincronizados (crear/listar/actualizar/resolver)
          pattern.types.ts      # Pattern + DTOs

      media/
        media.types.ts      # Media, MediaRef, MediaMap
        media.service.ts    # listMedia / getMediaMap / saveUpload (a public/uploads)

      db/
        prisma.ts
        repositories/
          user.repository.ts
          post.repository.ts
          post-revision.repository.ts
          post-type.repository.ts
          pattern.repository.ts
          setting.repository.ts
          media.repository.ts

      prisma/
        schema.prisma
        sqlite-migrations/ # migraciones SQLite
        migrations/        # historial PostgreSQL; no se ejecuta
        seed.ts

      editor/
        block-registry.ts # registro extensible de tipos de bloque
        editor.types.ts     # modelo de bloques (Block, BlockDocument, pattern refs)
        editor.helpers.ts   # createBlock / serializeDocument / parseDocument
        style-variants.ts   # estilos por dispositivo y estado visual del bloque
        block-view.tsx      # render puro de un bloque (estilos + resuelve media)
        block-editor.tsx    # editor (cliente): preview + paneles laterales
        block-inspector.tsx # inspector del bloque: contenido + editor de estilos
        block-renderer.tsx  # render SSR del documento de bloques
        media-library.tsx   # selector/modal de medios (cliente)

      components/
        ui/
        admin/
        editor/        # design system compartido del editor (paneles, lienzo, inserter, navegador, iconos…)
          history/       # panel Historia y acciones cliente para undo/redo/restaurar snapshots
          tools/         # herramientas modulares del inspector de bloques (submenus de estilo reutilizables)

    (frontend)/
      layout.tsx          # root layout del sitio público
      helpers/            # helpers del render publico (CSS generado, etc.)
      [slug]/
        page.tsx          # SSR del post publicado cuyo post_name = slug

  middleware.ts
  scripts/
    prepare-sqlite.mjs # prepara el archivo local antes de migrar
  prisma.config.ts   # config de Prisma (schema + seed); carga .env manualmente
  README.md
```

Separación de responsabilidades:

```txt
app/(backend)/admin/        → rutas y pantallas del panel.
app/(backend)/core/         → lógica de negocio.
app/(backend)/db/           → acceso a datos mediante Prisma.
app/(backend)/editor/       → constructor de bloques (modelo, helpers, editor y renderer).
app/(backend)/editor/block-registry.ts → registro extensible de bloques (metadatos, factories y tipos insertables).
app/(backend)/core/editor-variables/ -> tokens CSS globales, persistidos como JSON en Setting y aplicados al editor y al sitio publico.
app/(backend)/media/        → biblioteca de medios (tipos + servicio de subida).
app/(backend)/prisma/       → schema, migraciones y seed.
app/(backend)/components/   → UI compartida del panel (ui/, admin/ y editor/).
app/(backend)/components/editor/ → design system del editor reutilizado por el editor de páginas y el panel de Components (EditorHeader, EditorSidePanel, EditorCanvas, BlockInserter, Navigator, PatternLibrary, PreviewBlock, iconos, controles y hooks de orquestación del workspace).
app/(backend)/components/ui/ → primitivas visuales reutilizables del admin (`Button`, `Input`, `Select`, `Textarea`, `Field`, alertas), con variantes y tamaños para formularios completos, paneles densos del editor y acciones con icono.
app/(frontend)/helpers/    -> utilidades puras del render publico; por ejemplo, generacion de CSS para variantes responsive/hover de bloques.
app/(frontend)/             → sitio público (SSR); `/[slug]` renderiza posts publicados.
```

Alias de imports (`tsconfig.json`):

```txt
@/core/*       → app/(backend)/core/*
@/db/*         → app/(backend)/db/*
@/editor/*     → app/(backend)/editor/*
@/media/*      → app/(backend)/media/*
@/components/* → app/(backend)/components/*
@/*            → ./* (resto del proyecto, p. ej. middleware.ts)
```

Regla técnica obligatoria:

```txt
El código de app/(backend)/admin y app/(backend)/core no debe importar Prisma directamente.
Solo app/(backend)/db puede importar Prisma.
```

Flujo correcto:

```txt
app → core service → repository → Prisma
```

Flujo incorrecto:

```txt
app → Prisma
core → Prisma
```

---

## 4. Modelo conceptual

El sistema se basa en tres entidades iniciales:

```txt
User
PostType
Post
```

La estructura sigue la lógica de WordPress:

```txt
WordPress:
wp_posts
post_type
post_title
post_name
post_content
post_status
post_date

Dalia CMS:
posts
post_type
post_title
post_name
post_content
post_status
post_date
```

`PostType` no convierte a los contenidos en entidades diferentes. Solo registra qué tipos de contenido existen y cómo se muestran en el panel.

---

## 5. Modelo de base de datos

### User

Usuario administrador.

```txt
id
user_email
user_pass
user_name
user_role
created_at
updated_at
```

### PostType

Define un tipo de contenido disponible en el sistema.

```txt
id
post_type
post_type_label
post_type_description
post_type_system
created_at
updated_at
```

Ejemplo:

```txt
post_type: page
post_type_label: Páginas
post_type_system: true
```

Ejemplo:

```txt
post_type: service
post_type_label: Servicios
post_type_system: false
```

### Post

Entidad universal de contenido.

```txt
id
post_author_id
post_date
post_content
post_title
post_excerpt
post_status
post_name
post_type
created_at
updated_at
```

Estados iniciales:

```txt
draft
published
archived
```

Tipos iniciales:

```txt
page
post
```

---

## 6. Prisma schema inicial

```prisma
model User {
  id           String   @id @default(cuid())
  user_email   String   @unique
  user_pass    String
  user_name    String?
  user_role    String   @default("admin")
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt

  posts        Post[]
}

model PostType {
  id                     String   @id @default(cuid())
  post_type              String   @unique
  post_type_label         String
  post_type_description   String?
  post_type_system        Boolean  @default(false)
  created_at              DateTime @default(now())
  updated_at              DateTime @updatedAt
}

model Setting {
  key        String   @id
  value      String
  updated_at DateTime @updatedAt
}

model Media {
  id            String   @id @default(cuid())
  url           String
  filename      String
  original_name String
  mime_type     String
  size          Int
  alt           String?
  created_at    DateTime @default(now())
}

model Pattern {
  id            String   @id @default(cuid())
  pattern_slug  String   @unique
  pattern_label String
  content       String
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
}

model Post {
  id              String    @id @default(cuid())

  post_author_id  String?
  post_date       DateTime?
  post_content    String?
  post_title      String
  post_excerpt    String?
  post_status     String    @default("draft")
  post_name       String
  post_type       String

  post_meta_title       String?
  post_meta_description String?

  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  post_author     User?     @relation(fields: [post_author_id], references: [id])

  @@unique([post_type, post_name])
  @@index([post_type])
  @@index([post_status])
  @@index([post_date])
}
```

Nota: `Post.post_type` se guarda como string, no como relación obligatoria con `PostType`. Esto mantiene el modelo simple y más cercano a WordPress. `PostType` funciona como registro administrativo de los tipos existentes.

---

## 7. Panel de administración

Ruta base:

```txt
/admin
```

Pantallas mínimas:

```txt
/admin/login
/admin
/admin/post-types
/admin/posts
```

### Login

Debe permitir iniciar sesión como administrador.

Para la PoC solo existe un rol:

```txt
admin
```

No se implementan permisos avanzados.

### Dashboard

Debe mostrar:

```txt
Número total de posts
Número de post types
Número de posts publicados
Número de borradores
```

### Post Types

Debe permitir:

```txt
Crear post type
Listar post types
Editar post type
Eliminar post type si no es system
```

Campos:

```txt
post_type
post_type_label
post_type_description
post_type_system
```

Reglas:

```txt
post_type debe ser único.
post_type debe estar en formato slug.
Los post types del sistema no se pueden eliminar.
```

Tipos del sistema creados por seed:

```txt
page
post
```

### Posts

Debe permitir:

```txt
Crear post
Listar posts
Filtrar posts por post_type
Editar post
Eliminar post
Publicar post
Pasar post a borrador
Archivar post
```

Campos:

```txt
post_type
post_title
post_name
post_content
post_excerpt
post_status
post_date
```

Reglas:

```txt
post_name debe ser único dentro de su post_type.
post_type debe existir en PostType.
post_status solo puede ser draft, published o archived.
post_date se define al publicar si está vacío.
```

---

## 8. Instalación inicial

La PoC usará migraciones y seed de Prisma.

Comandos esperados:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

El seed debe crear:

```txt
Usuario admin inicial
PostType page
PostType post
```

No se construirá todavía un instalador visual tipo WordPress. Eso queda fuera de esta PoC.

---

## 9. Servicios internos

### authService

Responsabilidades:

```txt
Validar credenciales
Crear sesión básica
Proteger rutas admin
Cerrar sesión
```

### postTypeService

Responsabilidades:

```txt
Crear post type
Listar post types
Buscar post type por post_type
Actualizar post type
Eliminar post type si no es system
Validar formato de post_type
```

### postService

Responsabilidades:

```txt
Crear post
Listar posts
Filtrar posts por post_type
Buscar post por id
Buscar post por post_type + post_name
Actualizar post
Cambiar estado
Eliminar post
Validar que post_type exista
```

---

## 10. Repositories

Los repositories son la única capa que usa Prisma.

Repositorios mínimos:

```txt
user.repository.ts
post.repository.ts
post-type.repository.ts
```

Ejemplo de flujo:

```txt
Crear post:

app/admin/posts
→ postService.create()
→ postRepository.create()
→ Prisma
```

El service valida reglas de negocio. El repository solo consulta o escribe datos.

---

## 11. Limitaciones de esta PoC

No incluye:

```txt
Frontend público
SSR de contenidos
Post meta
Taxonomías
Categorías
Etiquetas
Media library
Editor visual
Bloques
Hooks
Plugins
Temas
Roles avanzados
Instalador visual
Actualizador
API pública
Campos personalizados
```

Estas partes se podrán añadir después si el núcleo funciona bien.

---

## 12. Criterios de éxito

La PoC se considera válida si permite:

```txt
1. Ejecutar migraciones Prisma.
2. Ejecutar seed inicial.
3. Crear usuario admin.
4. Entrar al panel.
5. Ver dashboard básico.
6. Crear un post_type nuevo, por ejemplo service.
7. Crear un Post con post_type = page.
8. Crear un Post con post_type = post.
9. Crear un Post con post_type = service.
10. Listar posts filtrados por post_type.
11. Editar post_title, post_name, post_content, post_excerpt y post_status.
12. Publicar y despublicar contenido.
13. Eliminar posts.
14. Eliminar post types no system.
15. Mantener Prisma aislado en db/.
```

---

## 13. Filosofía

La PoC debe copiar lo que WordPress hace bien en su núcleo de datos:

```txt
Un modelo universal de contenido.
Tipos diferenciados por post_type.
Campos base consistentes.
Panel administrativo simple.
Separación clara entre datos y lógica.
```

No debe intentar copiar todavía todo WordPress.

Primero:

```txt
User
PostType
Post
Admin básico
Prisma desacoplado
```

Después:

```txt
post_meta
taxonomías
media
hooks
SSR
plugins
bloques
instalador
```

---

## 14. Stack técnico

```txt
Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + ESLint
React 19
Prisma 6 + SQLite (archivo local persistente)
bcryptjs (hash de contraseñas)
Sesión propia: cookie firmada con HMAC-SHA256 (Web Crypto API)
Jest (next/jest) para tests unitarios de core/
pnpm como gestor de paquetes
```

No se usan librerías de UI (shadcn/Radix) ni de validación (zod): los componentes de `components/ui/` son wrappers mínimos sobre HTML + Tailwind, y las validaciones viven como funciones simples en `core/`.

---

## 15. Dependencias

### Dependencias de producción

```txt
next            — framework (App Router)
react / react-dom — UI
@prisma/client  — cliente de Prisma (solo en db/)
bcryptjs        — hash y verificación de contraseñas
```

### Dependencias de desarrollo

```txt
typescript, @types/node, @types/react, @types/react-dom
tailwindcss, @tailwindcss/postcss
eslint, eslint-config-next
prisma          — CLI (migraciones, seed, studio)
tsx             — ejecuta prisma/seed.ts (TypeScript) sin paso de build
jest, jest-environment-node, @types/jest — tests unitarios
```

---

## 16. Variables de entorno

Definidas en `.env` (ver `.env.example`):

```txt
DATABASE_URL       - URL del archivo SQLite para Prisma (file:../../../data/dalia.db en desarrollo)
SESSION_SECRET     — secreto para firmar la cookie de sesión (HMAC-SHA256)
SEED_ADMIN_EMAIL   — email del usuario admin creado por el seed
SEED_ADMIN_PASSWORD — contraseña del usuario admin creado por el seed
SEED_ADMIN_NAME    — nombre del usuario admin creado por el seed
```

---

## 17. Puesta en marcha

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

La configuración de Prisma vive en `prisma.config.ts`: define el schema `app/(backend)/prisma/schema.prisma`, las migraciones SQLite en `app/(backend)/prisma/sqlite-migrations` y el seed. Los comandos `pnpm db:migrate` y `pnpm db:deploy` ejecutan primero `scripts/prepare-sqlite.mjs` para crear el directorio y el archivo SQLite si faltan. El primero se usa en desarrollo; el segundo, en hosting antes de iniciar la aplicación. La ruta relativa de `DATABASE_URL` se resuelve desde el directorio del schema y crea `data/dalia.db` en la raíz del proyecto.

El directorio `data/` debe conservarse entre despliegues y permitir escritura al proceso Node. También deben persistir los archivos de `public/uploads/`. Esta instalación SQLite está pensada para una sola instancia de la aplicación con el archivo de datos en un disco local persistente.

Las migraciones PostgreSQL anteriores permanecen en `app/(backend)/prisma/migrations/` como historial; Prisma ejecuta las de `sqlite-migrations/`. Cambiar `DATABASE_URL` no transfiere datos existentes de PostgreSQL a SQLite. Una instalación con contenido previo requiere una exportación e importación aparte.

**Importante:** con un `prisma.config.ts`, Prisma deja de cargar `.env` automáticamente; el propio config lo carga con `process.loadEnvFile()` (Node 22.11+), de modo que `DATABASE_URL` y las variables `SEED_ADMIN_*` están disponibles tanto para los comandos de Prisma como para el subproceso de seed.

El seed crea variables globales de ejemplo y páginas de demostración publicadas en `/nexo-habitat` y `/zooparque-atlantico`, útiles para ver el editor de bloques y el render SSR con datos realistas.

---

## 18. Rutas implementadas

```txt
/admin/login                    — inicio de sesión
/admin                           — dashboard (contadores)
/admin/post-types                — listado de post types
/admin/post-types/new            — crear post type
/admin/post-types/[id]            — editar / eliminar post type
/admin/posts                     — listado de posts (filtro ?type=)
/admin/posts/new                 — crear post
/admin/posts/[id]                  — edición unificada del post: configuración y bloques
/admin/posts/[id]/editor           — redirección legacy a /admin/posts/[id]
/admin/components                  — listado y creación de Components sincronizados
/admin/components/[id]              — redirección al listado de Components
/admin/media                     — biblioteca de medios (subir y listar)
/admin/library                   - inventario visual de primitivas UI e iconos
/[slug]                          — sitio público: SSR del post publicado (post_name = slug)
```

Todas las rutas bajo `/admin` (excepto `/admin/login`) están protegidas por `middleware.ts`, que verifica la cookie de sesión firmada. La ruta pública `/[slug]` es abierta (no protegida) y solo muestra posts en estado `published`.

---

## 19. Tests

Ver `TEST.md` para el detalle de los tests unitarios (`__tests__/`, ejecutables con `pnpm test`) y los pasos de verificación manual end-to-end (migraciones, seed, login y CRUD completo).

---

## 20. Editor de bloques

El contenido de cada post se edita con un **constructor de bloques propio, sin dependencias externas**, ubicado en `app/(backend)/editor/`.

- **Modelo** (`editor.types.ts`): un documento es `{ version: 1, blocks: Block[] }`. Cada `Block` tiene `id`, `type`, `text`, atributos accesibles opcionales (`ariaLabel`, `title`), en imágenes `url`/`mediaId`, en Components `patternId`, un `style` opcional (`BlockStyle`: pares clave/valor CSS en camelCase) y un `align` opcional (Normal/Ancho/Completo). Además puede guardar `styleVariants`, con overrides por dispositivo (`desktop`, `tablet`, `mobile`) y estado visual (`default`, `hover`, `active`); `style` se conserva como compatibilidad y equivale al estilo base de `desktop/default`. El core trae tipos nativos (`heading`, `paragraph`, `quote`, `list`, `image`, `pattern`, `group`, `columns`, `column`), pero `BlockType` queda abierto a strings registrados por el registry. Los **contenedores** anidan otros bloques en `children` y disponen su layout con `layout` (`BlockLayout`: dirección vertical/horizontal del grupo, separación, justificación, alineación y wrap). La **anidación es libre y recursiva** (un grupo puede contener columnas y una columna otro grupo).
- **Registry de bloques** (`block-registry.ts`): fuente de verdad para metadatos de bloque (`type`, `label`, `category`, `isContainer`, `isAddable`) y para la factory inicial (`create`). Expone `registerBlockType`, `unregisterBlockType`, `getBlockDefinitions`, `getAddableBlockTypes`, `getBlockLabel` y `createRegisteredBlock`. El inserter, navegador, inspector, validación y `createBlock` leen de este registry; así un módulo futuro puede añadir tipos de bloque sin modificar el core del editor, siempre que registre el tipo antes de crear/parsear documentos.
- **Helpers puros** (`editor.helpers.ts` y `style-variants.ts`): `createBlock` delega en el registry (los contenedores del core nacen con su layout; las «columns» con dos «column»), `serializeDocument` (bloques → JSON) y `parseDocument` (contenido almacenado → bloques, aceptando solo tipos registrados y saneando `style`, `styleVariants`, `layout` y los `children` de forma **recursiva**). `style-variants.ts` resuelve el estilo efectivo por dispositivo/estado y aplica patches al bucket correcto sin romper el fallback legacy. `parseDocument` nunca lanza: si el contenido no es JSON válido lo trata como texto plano legacy y lo envuelve en un párrafo. Además, operaciones puras del árbol reutilizadas por el editor: `findBlockById`, `mapBlockById`, `removeBlockById`, `insertBlock`, `moveBlockById`, `findSiblings` y `collectMediaIds`.
- **Vista de bloque** (`block-view.tsx`): componente puro que renderiza un único bloque y aplica su estilo efectivo inline; por defecto usa `desktop/default`, y el preview puede pedir `desktop/tablet/mobile` con `default/hover/active`. Los contenedores recurren en sus `children` y disponen su layout flex con `containerLayoutStyle(block)`. Lo comparten el renderer SSR y el preview del editor.
- **Editor** (`block-editor.tsx`, cliente): pantalla unificada dentro del panel admin, manteniendo el sidebar y el breadcrumb del dashboard. La maqueta interna sigue la disposición del constructor actual de WordPress/Gutenberg: barra superior del editor, inserter lateral, canvas central e inspector derecho.
  - **Barra superior del editor** — acciones de edición (`Volver`, abrir/cerrar inserter, vista de lista, `Vista previa`, `Publicar` y toggle de ajustes). No sustituye al breadcrumb del panel ni muestra avisos de estado: esos mensajes viven en el centro global de avisos del `AdminShell`.
  - **Panel izquierdo** (colapsable) organizado como arbol de ramas: **Ajustes**, **Elementos**, **Estructura** y **Variables**. Cada rama define sus pesta�as hijas: Ajustes muestra la configuracion del post; Elementos alterna Blocks, Patterns y Media; Estructura alterna Navegador y Estructura SEO; Variables muestra un diccionario editable de keys y valores agrupados por tipo (colores, tipografia, numeros, espaciado y texto), aplicado al lienzo y al sitio publico; los controles del inspector con icono de variable abren ese mismo editor dentro de un modal reutilizable.
  - **Centro** — preview en vivo **recursivo** con edicion inline de bloques de texto, envuelto en el mismo contenedor que `/[slug]` (variables globales); seleccionar un hijo no selecciona a su contenedor. Se adapta al ancho disponible cuando se colapsan los paneles laterales.
  - **Panel derecho** (colapsable): `EditorWorkspace` compone las ramas y pesta�as del panel. La rama **Contenido** alterna entre **Contenido** y **Estilo**, y `block-inspector.tsx` renderiza solo el cuerpo de la pesta�a activa del bloque seleccionado. Las referencias a Components muestran su panel espec�fico.
    - **Contenido** agrupa sus controles en submenús colapsables: **Contenido** (texto, imagen, hijos o layout del contenedor), **Accesibilidad** (`alt` de imagen, `aria-label` y `title`) y **Adaptabilidad** (visibilidad por dispositivo mediante `visibility`).
    - En **contenedores** (grupo/columnas/columna), el submenú **Contenido** ofrece la disposición: orientación del grupo (vertical/horizontal), separación entre elementos, justificación y alineación, y botones para **añadir bloques dentro** (en «columnas», + / − Columna).
    - **Estilo** (común): muestra todas las herramientas de estilo independientemente del tipo de bloque: ancho Normal/Ancho/Completo, disposición (orientación, separación, alineación y justificación), alineación de texto, peso, tamaño de fuente por preset + custom, colores enlazables a variables, dimensiones, padding/márgenes mediante control visual de caja por lados y borde (tamaño, esquinas y color). Dentro de Estilo hay botones de estado **Defecto**, **Hover** y **Activo**; el selector de dispositivo del canvas decide si los cambios se guardan para `desktop`, `tablet` o `mobile`. Tablet/móvil heredan de desktop hasta que se sobrescribe un valor.

  Seleccionar un bloque (en el preview o en el navegador) reexpande el panel derecho. El estado vive en cliente y se vuelca serializado en inputs ocultos que envia el form: el JSON de bloques y la configuracion del post (incluida la meta SEO). El undo/redo es local y en memoria, limitado al workspace abierto; los snapshots persistentes se crean solo al guardar y pueden restaurarse desde Historia como cambios locales pendientes de guardar.
- **Renderer** (`block-renderer.tsx`, servidor): convierte el documento de bloques en HTML; lo usa la pagina publica `/[slug]`. Para `styleVariants` y `visibility`, inyecta CSS generado por `app/(frontend)/helpers/block-style-css.ts`, con reglas responsive por bloque y clases estables; la visibilidad publica no se decide en SSR por viewport, sino con media queries.
- **Design system compartido** (components/editor/): EditorHeader, EditorSidePanel, EditorCanvas, BlockInserter, BlockTools, Navigator, BlockHtmlOutline, PatternLibrary, PatternReferencePanel, PreviewBlock y BlockInspector componen el editor de páginas y el panel de Components. EditorWorkspace coordina paneles, Components, arrastre de bloques y medios mediante hooks pequeños. Los controles visibles reutilizan las primitivas de components/ui; BlockTypeIcon distingue los tipos de bloque.
- **Primitivas UI del admin** (`components/ui/`): botones, campos, selects, textareas, fields, modal reutilizable (`Modal`), lista reutilizable de variables guardadas (`VariableOptionsList`), grupos de toggles con iconos (`IconToggleGroup`), controles visuales de caja (`BoxSideControl`, `BoxCornerControl`, `BoxAxisControl`, `BoxTextSpacingControl`), selector de color con variables (`ColorControl`), control de sombra estructurada (`ShadowControl`), controles de tama�o/espaciado (`PxInput`, `FontSizeControl`, `SpacingControl`) e iconos puros centralizan sus variantes/tama�os (`primary`, `secondary`, `danger`, `ghost`, `collapsed`, tama�os `md`, `sm`, `icon`, estados `selected`, densos/muted). El editor debe consumir estas primitivas para controles visibles e iconos concretos, y reservar `components/editor/` para layouts y adaptadores de dominio como `BlockTypeIcon`.

**Almacenamiento:** el JSON de bloques (con sus estilos) se guarda en `Post.post_content`; la meta SEO en las columnas `Post.post_meta_title`/`post_meta_description`. El diccionario global de variables del editor se guarda como JSON versionado en la tabla `Setting`, bajo la clave `editor_variables`. Los **Components sincronizados** viven en la tabla `Pattern` y el post guarda unicamente bloques `pattern` con `patternId`; al guardar el editor se crean/actualizan los Components modificados, se guarda el post y se crea un snapshot en `PostRevision` con contenido, ajustes y el estado completo de Components conocido por el editor. El repositorio de revisiones conserva como maximo las 10 revisiones mas recientes por post. La edicion ocurre en `/admin/posts/[id]`, dentro del grupo `(protected)`, conservando el sidebar y el breadcrumb del panel.

**Navegador (árbol).** La pestaña «Navegador» muestra los bloques como un **explorador colapsable**: cada contenedor tiene un chevron para plegar/expandir, un icono por tipo de bloque y una guía de indentación para la jerarquía.

**Layout tipo Gutenberg.** El editor funciona como un app-shell de **altura fija**: el panel protegido es `h-screen overflow-hidden` y la zona de contenido scrollea internamente (la página no crece, el breadcrumb queda fijo). Dentro del editor hay una barra superior fija y una fila de tres zonas: panel izquierdo de inserción/lista/Components, canvas central y panel derecho de ajustes Post/Bloque. Los laterales tienen scroll propio y la columna central ocupa el ancho/alto restante.

**Área de trabajo (simulador).** El lienzo **no tiene vértices redondeados** (para parecerse a una web en vivo) y dispone, arriba a la derecha, de una barra con selector de **resolución** (Responsivo / Escritorio 1280 / Portátil 1024 / Tablet 768 / Móvil 375). Internamente fija el `width` del dispositivo seleccionado sin aplicar zoom ni transformaciones; si el ancho elegido no cabe, el scroll horizontal queda dentro del canvas central y no ensancha el layout general del editor.

**Chrome del panel.** El panel ya no tiene barra superior («topbar»): la navegación es por **breadcrumb** (`components/admin/admin-shell.tsx`, tira superior; en el editor muestra `«{Post type} › {título} › Editar página»`) y la información/acciones de usuario (email + cerrar sesión) viven al **pie del sidebar** (`components/admin/admin-sidebar.tsx`). El mismo `AdminShell` muestra el breadcrumb alineado a la izquierda y una cola horizontal de avisos en el extremo derecho: el aviso más reciente ocupa la primera posición visual, los anteriores se desplazan hacia la izquierda y el resto queda al 50% de opacidad. Cada aviso temporal incluye una barra interna que se llena de izquierda a derecha hasta caducar. Los componentes cliente usan `useAdminNotice().notify({ message, tone, durationMs, persistent })` y las páginas server pueden renderizar `AdminStatusMessage` para elevar mensajes derivados de `searchParams`. Los avisos temporales se cierran tras `durationMs`; los persistentes quedan fijos hasta cerrarlos manualmente.

---

## 21. Variables globales de estilo

El panel **Variables** del editor administra tokens de color, tipografía, número, espaciado y texto. Cada token tiene una clave CSS (`--nombre`), un valor y un tipo. Se guarda como JSON versionado en `Setting`, bajo la clave `editor_variables`; `core/editor-variables/` contiene el servicio, la validación y la aplicación de estilos.

Los tokens base definen fondo y texto del sitio, fuentes de títulos y cuerpo, anchos de contenido y padding. `siteVariableStyle(variables)` los expone como propiedades CSS en el contenedor de la página. `siteContainerStyle(variables)` aplica los tokens al lienzo del editor y al SSR público. Cada bloque puede añadir estilos locales o referencias a variables.

Las 17 variables base tienen clave y tipo fijos, valor editable y no se pueden borrar. Se recuperan automáticamente al leer ajustes antiguos y el servicio conserva su último valor si una petición de guardado las omite. Las variables personalizadas siguen pudiendo crearse, renombrarse y eliminarse.

| Grupo | Variables base |
| --- | --- |
| Colores | `--dalia-color-base`, `--dalia-color-contrast`, `--color-primary`, `--dalia-color-on-primary`, `--dalia-color-surface`, `--dalia-color-muted`, `--dalia-color-border` |
| Tipografía | `--dalia-font-heading`, `--dalia-font-body`, `--dalia-font-size-heading`, `--dalia-font-size-body` |
| Página | `--dalia-content-size`, `--dalia-wide-size`, `--dalia-content-padding`, `--dalia-page-gutter` |
| Formas | `--dalia-radius-control`, `--dalia-radius-card` |

`getBlockDefaultStyle(type)` aplica los valores semánticos al render público y al preview: encabezados, texto, botones, imágenes, tarjetas, secciones y otros bloques usan las variables correspondientes. Los bloques nuevos no guardan esos valores por defecto en su JSON; `block.style` y las variantes por dispositivo/estado tienen prioridad. Los bloques antiguos que ya contienen valores literales conservan esos ajustes locales. `--color-secondary` continúa como variable personalizada opcional.

Los controles de estilo del inspector permiten elegir una variable y guardan `var(--nombre)` en el bloque. Al cambiar el valor global, las propiedades enlazadas se actualizan sin editar cada bloque. Los valores literales siguen permitidos para ajustes locales. El panel **Variables** guarda cada cambio de forma independiente del guardado del post. La antigua clave `theme` de `Setting` ya no se consulta.

---

## 22. Biblioteca de medios

El menú **Media** (`/admin/media`) gestiona la subida de archivos. El módulo está desacoplado en `app/(backend)/media/` (`media.types.ts`, `media.service.ts`) y el acceso a datos en `db/repositories/media.repository.ts` (modelo `Media`).

- **Subida:** `saveUpload(file)` guarda el fichero en `public/uploads/<año>/<mes>/` (servido como `/uploads/<año>/<mes>/<fichero>`) y registra el metadato en `Media`. La acción `uploadMedia` (cliente) devuelve el `Media` creado; `uploadMediaFromPage` sirve al formulario de la página.
- **Bloques de imagen (estilo Gutenberg):** el bloque **no incrusta la URL**; guarda un **puntero** `mediaId` en su JSON. El selector `editor/media-library.tsx` (modal cliente) permite subir/elegir; el inspector muestra la miniatura y «Seleccionar/Reemplazar».
- **Resolución en SSR:** al renderizar, `media.service.getMediaMap(ids)` resuelve los punteros a `{ url, alt }` y se pasa a `BlockRenderer`/`BlockView` (en `/[slug]` y en el preview del editor). Si un bloque tiene `url` directa (legacy/externa) se usa como alternativa. Los `mediaId` se recolectan en todo el árbol con `collectMediaIds(blocks)`.

---

## 23. Components sincronizados

Los **Components** son objetos reutilizables de bloques, que se mantienen sincronizados entre páginas. Sirven para repetir una sección en varias páginas y mantenerla conectada: si se edita desde una referencia, el contenido compartido se guarda en `Pattern.content` y todas las páginas que apuntan a ese `patternId` muestran la misma versión.

- **Modelo:** `Pattern` en `schema.prisma`, con `pattern_slug`, `pattern_label` y `content` (JSON de bloques serializado). El acceso a datos vive en `db/repositories/pattern.repository.ts` y la lógica en `core/patterns/pattern.service.ts`.
- **Bloque de referencia:** el post no duplica el contenido del Component; guarda un bloque `{ type: "pattern", patternId }` dentro de `Post.post_content`.
- **Editor dentro de posts:** en el panel izquierdo, la pestaña **Components** convive con **Media**. Permite crear un Component desde el bloque seleccionado e insertar Components existentes. Al seleccionar bloques internos del Component en el preview, los cambios se guardan en el objeto `Pattern`, no en el post.
- **Gestión:** el listado de Components (`/admin/components`) permite crear y eliminar. Los bloques compartidos se editan seleccionando su referencia dentro del editor de una página. La ruta de detalle redirige al listado.
- **Render:** el preview y la página pública resuelven `patternId` a sus bloques reales y también resuelven los medios usados dentro del Component.

La tabla `Pattern` y las referencias `patternId` conservan sus nombres internos para que los Components existentes sigan funcionando. La tabla `Pattern` forma parte de la migración inicial SQLite. En instalaciones nuevas, ejecuta `pnpm db:migrate` antes del seed.

---

## 24. Composición de páginas con Components

Cada página guarda sus bloques en `Post.post_content` y se renderiza directamente en `/[slug]`. El contenedor del editor y del sitio público utiliza las variables globales de estilo. Para reutilizar secciones, el editor inserta referencias a Components sincronizados (`Pattern`); al editar un Component, se actualizan todas las páginas que lo referencian.

Las plantillas de página y el bloque dinámico `content` se retiraron. La migración SQLite `20261107150000_remove_templates` elimina la tabla `Template` y la columna `Post.post_template`. Las páginas y sus bloques permanecen. Antes de actualizar una instalación con plantillas propias, respalda la base de datos y revisa si hay contenido exclusivo de esas plantillas que debas recrear como Components.
