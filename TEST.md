# IGNORAR ESTE ARCHIVO - Tests

## Tests unitarios (Jest)

Los tests viven en `__tests__/` y cubren la capa `core/` (lógica de negocio) y `core/auth/session.ts`. Los repositorios (`db/repositories/*`) se mockean con `jest.mock(...)`, por lo que **no requieren conexión a PostgreSQL**.

### Cómo ejecutarlos

```bash
pnpm test
```

Para modo watch:

```bash
pnpm test -- --watch
```

### Qué cubre cada archivo

#### `__tests__/session.test.ts`

- Firmar y verificar un token de sesión válido (HMAC-SHA256).
- Un token expirado devuelve `null`.
- Un token firmado con otro `SESSION_SECRET` devuelve `null` (firma inválida).
- Un token malformado o `undefined` devuelve `null`.

#### `__tests__/post-type.service.test.ts`

- `createPostType`:
  - rechaza `post_type` que no es slug (`/^[a-z0-9]+(-[a-z0-9]+)*$/`).
  - rechaza `post_type_label` vacío.
  - rechaza si el `post_type` ya existe.
  - normaliza (`trim`, minúsculas) antes de guardar.
- `updatePostType`:
  - rechaza `post_type_label` vacío.
  - actualiza etiqueta/descripción (no permite cambiar `post_type`).
- `deletePostType`:
  - lanza error si no existe.
  - lanza error si `post_type_system = true`.
  - elimina si no es de sistema.
- `countPostTypes`: delega en el repositorio.

#### `__tests__/post.service.test.ts`

- `createPost`:
  - valida `post_title` y `post_name` no vacíos.
  - valida `post_status` (`draft | published | archived`).
  - valida que el `post_type` exista en `PostType`.
  - valida que `post_name` sea único dentro del `post_type`.
  - fija `post_date = now()` si se crea como `published`; lo deja en `null` si es `draft`.
- `updatePost`:
  - lanza error si el post no existe.
  - valida título/nombre/estado igual que `createPost`.
  - mantiene `post_date` si ya estaba publicado.
  - fija `post_date = now()` al pasar de `draft`/sin fecha a `published`.
- `changePostStatus`:
  - lanza error si el post no existe.
  - fija `post_date = now()` solo si pasa a `published` y no tenía fecha.
  - mantiene `post_date` en cualquier otro cambio de estado.
- `countPosts` / `countPostsByStatus`: delegan en el repositorio.
- `getPublishedPostByName`: delega en `findPublishedByName` con el slug y devuelve `null` si no hay post publicado.

#### `__tests__/editor.helpers.test.ts`

- `createBlock`: crea bloque con `id`/`type`/`text` vacío, inicializa `url` en bloques de imagen, genera ids distintos.
- `serializeDocument`: serializa a JSON `{ version: 1, blocks }`.
- `parseDocument`: documento vacío para `null`/`undefined`/`""`; parsea JSON válido; descarta bloques inválidos; envuelve texto plano legacy en un único bloque de párrafo; conserva los estilos válidos y descarta valores no string.

#### `__tests__/block-registry.test.ts`

- `registerBlockType`: registra un bloque custom, expone su etiqueta con `getBlockLabel`, lo muestra como insertable con `getAddableBlockTypes` y permite crearlo con `createBlock`.
- `parseDocument`: conserva un bloque custom cuando su `type` fue registrado previamente en el registry.

#### `__tests__/editor.tree.test.ts`

- `createBlock` para contenedores: grupo vertical vacío con layout por defecto; «columns» con dos «column».
- `parseDocument` anidado: sanea `layout` y descarta hijos inválidos de forma recursiva; round-trip `serializeDocument`/`parseDocument` de un árbol.
- Operaciones del árbol: `findBlockById`, `insertBlock` (en contenedor / en raíz, sin mutar el original), `removeBlockById`, `mapBlockById`, `moveBlockById` (reordenar / extremos), `findSiblings`, `collectMediaIds` y `collectPatternIds`.
- Patrones sincronizados: `createBlock('pattern')` y round-trip de `patternId`.
- Plantillas: `createBlock('content')` y round-trip del bloque dinámico `content`.

- Bloque de lista: `createBlock('list')` y round-trip del bloque `list`.

#### `__tests__/template.service.test.ts`

- `createTemplate`: rechaza slug inválido y etiqueta vacía; rechaza slug duplicado; normaliza (trim + minúsculas) antes de crear.
- `updateTemplate`: rechaza etiqueta vacía; lanza error si la plantilla no existe; actualiza los campos del contenedor.
- `deleteTemplate`: lanza error si no existe; elimina si existe.

---

## Verificación manual end-to-end

Estos pasos cubren lo que los tests unitarios no prueban: migraciones, seed, UI y flujo completo con base de datos real.

### 1. Configurar entorno

Copia `.env.example` a `.env` (si no existe) y completa:

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/dalia_cms
SESSION_SECRET=<una cadena aleatoria larga>
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=<una contraseña>
SEED_ADMIN_NAME=Admin
```

### 2. Migrar y poblar la base de datos

```bash
pnpm db:migrate
pnpm db:seed
```

El seed crea el usuario admin, los `PostType` de sistema `page` y `post`, **plantillas de ejemplo** (`landing`, `articulo`), un **tema de ejemplo** y una **página de ejemplo** (landing de agencia de marketing) publicada en `/agencia` con la plantilla `landing` y un bloque de **columnas**.

> Nota: `pnpm db:migrate` crea las columnas SEO de `Post` (`post_meta_title`/`post_meta_description`), la columna `Post.post_template`, `Template.content` y los modelos `Setting` (theme), `Media` (biblioteca), `Template` (plantillas) y `Pattern` (patrones sincronizados). Al cambiar el schema, Prisma Client debe regenerarse durante la migración.

### 3. Levantar la app

```bash
pnpm dev
```

### 4. Flujo a probar

1. Visita `/admin` sin sesión → debe redirigir a `/admin/login`.
2. Inicia sesión con `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
   - Con credenciales incorrectas debe mostrarse "Credenciales inválidas".
3. En el **Dashboard** (`/admin`) deberías ver: 0 posts, 2 post types, 0 publicados, 0 borradores.
   - El sidebar muestra iconos en cada ítem y resalta la sección activa. El botón superior lo colapsa/expande (de ancho completo a solo iconos).
   - **No** debe existir la barra superior «Panel de administración». En su lugar, arriba aparece un **breadcrumb** (p. ej. «Inicio»; en otras secciones «Inicio › Posts», etc.). El **email y «Cerrar sesión»** están al **pie del sidebar** (al colapsarlo, se ven como avatar + icono de salir).
4. En **Post Types** (`/admin/post-types`):
   - Crea un post type nuevo, p. ej. `service` / "Servicios".
   - Intenta crear uno con un `post_type` repetido o con mayúsculas/espacios → debe mostrar error.
   - Edita la etiqueta/descripción de `service`.
   - Intenta eliminar `page` o `post` → no debe ser posible (son de sistema).
   - Elimina `service` (no es de sistema) → debe desaparecer de la lista.
5. En **Posts** (`/admin/posts`):
   - Crea un post con `post_type = page`, `post_status = draft`.
   - Crea otro post con el mismo `post_type` y el mismo `post_name` → debe mostrar error de unicidad.
   - Filtra el listado por `post_type` usando los enlaces superiores.
   - Edita un post y cámbialo a `published` → debe aparecer `post_date` con la fecha actual.
   - Pásalo de nuevo a `draft` y luego otra vez a `published` → `post_date` debe mantenerse (no cambiar).
   - Archívalo y elimínalo.
6. **Editor de bloques**:
   - Crea un post (el formulario ya no pide contenido) y entra a editarlo desde el listado → debe abrir directamente `/admin/posts/<id>`, conservando el sidebar del dashboard y la barra de breadcrumb.
   - Bajo el breadcrumb debe aparecer la barra superior del editor al estilo Gutenberg: botón de volver/cerrar, botón para abrir/cerrar el inserter, vista de lista, estado guardado, **Vista previa**, **Publicar** y toggle de ajustes.
   - Los botones, pestañas y menús del editor deben usar el estilo del CMS: controles `rounded-md`, acción primaria en slate, secundarios blancos con borde e iconos SVG inline como en el sidebar.
   - El layout debe tener tres zonas: **panel izquierdo** con pestañas **Bloques**/**Navegador**/**Patrones**, preview central y **panel derecho** con pestañas **Post**/**Bloque**.
   - Colapsa/expande los paneles izquierdo y derecho → el preview central debe ensancharse al ocultarlos.
   - **Post** (derecha): edita plantilla, meta SEO (meta título / meta descripción) y configuración (título, slug, extracto, estado).
   - **Bloques** (izquierda): añade bloques desde la cuadrícula del inserter. **Navegador** (izquierda): selecciona bloques desde el árbol. **Patrones** (izquierda): crea un patrón desde el bloque seleccionado e inserta patrones existentes.
   - **Bloque** (derecha, al seleccionar un bloque): en **Contenido** edita el texto o, en imágenes, pulsa **Seleccionar imagen** (abre la biblioteca, ver paso de Media). En **Estilo** prueba: ancho del bloque (Normal/Ancho/Completo), alineación de texto, peso, tamaño de fuente (presets + personalizado), colores con swatches del tema, padding/márgenes (escala + personalizado) y radio de borde → el preview debe reflejar los cambios al instante (Ancho/Completo ensanchan el bloque respecto al ancho de contenido).
   - El preview debe verse igual que la página pública (mismo ancho de columna y el título del post como encabezado).
   - **Breadcrumb del editor:** arriba debe mostrar «{Post type} › {título del post} › Editar página»; el primer eslabón enlaza al listado de ese tipo.
   - **Navegador en árbol:** los contenedores muestran un chevron para plegar/expandir y un icono por tipo; comprueba el plegado y la guía de indentación.
   - **Simulador (barra arriba a la derecha del lienzo):** cambia la **resolución** (p. ej. Móvil 375) → el lienzo debe estrecharse a ese ancho; cambia después a una resolución grande (p. ej. Escritorio 1280) → si no cabe, debe aparecer scroll horizontal dentro del canvas central. No debe haber controles de zoom ni botón **Ajustar**. El lienzo **no** debe tener esquinas redondeadas.
   - Haz click en un bloque del preview → debe seleccionarse y abrir la pestaña **Bloque**; reordénalo con ↑/↓ y elimínalo desde el inspector.
   - **Contenedores (grupo/columnas):** añade un **Grupo** y, con él seleccionado, usa **Contenido → Añadir dentro** para meter un título y un párrafo; cambia su **Orientación** a Horizontal y ajusta la separación → el preview debe reflejarlo. Añade un bloque **Columnas** (nace con 2 columnas), pulsa **+ Columna** / **− Columna** y añade bloques dentro de cada columna. Comprueba que al pinchar un hijo se selecciona el hijo (no el contenedor) y que el **Navegador** muestra el árbol indentado. Prueba a anidar un grupo dentro de una columna.
   - **Patrones sincronizados:** selecciona un bloque, ve a **Patrones** y pulsa **Crear patrón desde selección** → el bloque debe convertirse en una referencia. Inserta el mismo patrón otra vez desde la lista, edita un bloque interno del patrón desde el preview y pulsa **Publicar** → al recargar, ambas referencias deben mostrar el mismo cambio.
   - Pulsa **Publicar**; vuelve a abrir la edición y verifica que bloques, contenedores anidados, estilos y meta SEO se recuperan tal cual.
   - **Plantilla:** en la pestaña **Página**, elige una plantilla (p. ej. `landing`) → el preview debe cambiar de ancho/padding/colores. Guarda y abre la página pública: debe verse con la misma plantilla.
7. **Plantillas** (`/admin/templates`):
   - Crea una plantilla nueva (slug + etiqueta + ancho/padding/colores); intenta repetir el slug o usar mayúsculas/espacios → debe mostrar error.
   - Abre `/admin/templates/<id>` → debe mostrarse el editor de bloques, conservando sidebar y breadcrumb, con los ajustes de la plantilla en el panel derecho.
   - Añade bloques normales, inserta el bloque **Contenido** y guarda. Asigna esa plantilla a un post desde la pestaña **Página** del editor → en la página pública, el contenido del post debe aparecer exactamente donde está el bloque **Contenido**.
   - Inserta un patrón desde el tab **Patrones** dentro de la plantilla → la página pública debe resolverlo igual que en posts.
   - Edita sus valores y elimínala.
8. **Patrones** (`/admin/patterns`):
   - Entra desde el sidebar en **Patrones**; crea un patrón con nombre.
   - Abre `/admin/patterns/<id>` → debe mostrarse el editor de bloques reutilizable. Añade bloques, imágenes y contenedores; guarda y vuelve al listado.
   - Inserta ese patrón en un post y en una plantilla → ambos deben renderizar el mismo contenido sincronizado.
   - Edita el patrón desde `/admin/patterns/<id>` y vuelve a las páginas que lo usan → deben mostrar el cambio sin editar cada post/plantilla.
9. **Media** (`/admin/media`):
   - Sube una imagen → debe aparecer en la galería y guardarse en `public/uploads/<año>/<mes>/`.
   - En el editor de un post, añade un bloque de imagen y pulsa **Seleccionar imagen** → la biblioteca debe listar lo subido; al elegir, el bloque guarda el puntero (no la URL) y el preview muestra la imagen.
   - Publica el post y abre `/{slug}` → la imagen debe renderizarse en SSR resolviendo el puntero.
10. **Theme** (`/admin/theme`):
   - Cambia la paleta semántica (Base = fondo, Contraste = texto, acentos), las tipografías (títulos/cuerpo) y el layout (ancho de contenido, ancho «wide», padding); pulsa **Guardar tema** → "Tema guardado.".
   - Vuelve a abrir el editor de un post: el preview debe reflejar fuentes, colores y anchos del tema; los acentos aparecen como swatches en los selectores de color. Un bloque con ancho «Ancho»/«Completo» debe usar el `wideSize`/ancho completo.
   - Define un estilo propio en un bloque (p. ej. color de texto) → debe sobrescribir el valor por defecto del tema.
   - Abre la página pública → debe verse con el tema aplicado (y los overrides por bloque respetados).
11. **Página pública (SSR)**:
   - Pon el post en `published`; anota su `post_name` (slug).
   - En el listado o en la edición, pulsa **Ver**/**Ver página** → debe abrir `/{slug}` en una pestaña nueva y renderizar en servidor el título y los bloques **con sus estilos**.
   - Revisa el `<title>` y la `<meta name="description">` de la página → deben usar la meta SEO (o, si está vacía, el título y el extracto del post).
   - Visita el slug de un post en `draft`/`archived` o un slug inexistente → debe devolver 404 (`notFound`).
12. Cierra sesión desde el topbar → debe redirigir a `/admin/login` y bloquear de nuevo el acceso a `/admin/*`.

### VerificaciÃ³n manual del registry de bloques

Para comprobar extensibilidad, registra temporalmente un bloque custom con `registerBlockType({ type, label, category, isAddable: true })` antes de montar el editor. El bloque debe aparecer en el inserter, navegador e inspector sin editar `BlockInserter`, `block-editor.tsx` ni `reusable-block-editor.tsx`.

### Verificacion manual de iconos de bloques

En el inserter del editor, los bloques de texto deben mostrar iconos diferenciados para **Encabezado**, **Parrafo**, **Cita** y **Lista**. Al insertar **Lista**, cada linea del textarea se renderiza como un item de lista en el preview y en el SSR.

### Verificacion manual del canvas sin zoom

En el editor, selecciona una resolucion grande como **Escritorio 1280**. El scroll horizontal debe aparecer dentro del lienzo central cuando no quepa, sin estirar el ancho general de la app, sin desplazar los paneles laterales y sin provocar scroll horizontal en el shell del admin. La barra del simulador debe mostrar solo el selector de resolucion, sin selector de zoom ni boton **Ajustar**.
