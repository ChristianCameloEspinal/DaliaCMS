# Changelog

Todas las modificaciones relevantes de este proyecto se documentan en este archivo.

El formato sigue agrupaciones `Added` / `Changed` / `Fixed` / `Removed`, con fechas `[YYYY-MM-DD]`.

## [Unreleased]

### [2026-11-07]

#### Added

- app/(backend)/core/editor-variables/editor-variables.types.ts: se definen 17 variables base para color, tipografía, página y radios, con recuperación de ajustes existentes.

- app/(backend)/core/editor-variables/editor-variables.styles.ts: aplica los tokens CSS globales y conserva la alineacion de bloques sin depender de Theme.
- app/(backend)/prisma/sqlite-migrations/, data/.gitkeep, scripts/prepare-sqlite.mjs y package.json: se crea la migracion inicial SQLite, el directorio persistente, la preparacion del archivo y el comando db:deploy para hosting.

#### Changed

- app/(backend)/core/editor-variables/editor-variables.service.ts y components/editor/variables/: las claves base no se pueden renombrar ni borrar; el guardado conserva sus valores aunque una petición las omita.
- app/(backend)/core/editor-variables/editor-variables.styles.ts, components/editor/blocks/block-registry.ts y block-previewer.tsx: el render y el preview aplican variables a los valores por defecto sin serializarlos en bloques nuevos.
- README.md: se documentan el catálogo base, la precedencia de estilos y la compatibilidad con bloques antiguos.

- app/(backend)/admin/(protected)/components/, components/admin/, components/editor/ y core/patterns/pattern.service.ts: las etiquetas visibles y los mensajes usan Components/Component; las referencias y los datos Pattern permanecen compatibles.
- README.md: el SDD adopta Components como nombre de la función y conserva documentados los identificadores internos.

- app/(backend)/admin/(protected)/components/, admin/(protected)/patterns/, components/admin/ y components/editor/: la interfaz y las rutas presentan los patrones sincronizados como Componentes; las rutas anteriores redirigen a las nuevas. La ruta de detalle, que no tenía editor activo, redirige al listado; los bloques compartidos se editan desde páginas.
- README.md: el SDD usa Componentes como nombre de producto y documenta los identificadores internos Pattern/patternId que preservan los datos existentes.

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- app/(backend)/core/editor-variables/editor-variables.types.ts, app/(backend)/core/templates/template.types.ts, app/(frontend)/[slug]/page.tsx, app/(backend)/admin/(protected)/posts/[id]/page.tsx y app/(backend)/components/editor/editor-workspace.tsx: las variables gobiernan el contenedor del editor y del sitio publico en lugar del tema.
- app/(backend)/components/ui/variable-options-list.tsx, color-control.tsx, input.tsx, shadow-control.tsx, size-control.tsx, app/(backend)/components/editor/variables/variables-panel.tsx, blocks/block-inspector.tsx, blocks/block-renderer.tsx, blocks/block-previewer.tsx, tools/universal-block-tools.tsx y app/(backend)/admin/(protected)/library/page.tsx: los controles enlazan estilos a variables CSS y se elimina la paleta heredada de Theme.
- app/(backend)/prisma/seed.ts, company-example.ts, example.ts y README.md: el contenido de ejemplo usa variables globales y se documenta la nueva arquitectura de estilos.
- app/(backend)/admin/(protected)/templates/[id]/page.tsx y patterns/[id]/page.tsx: se eliminan referencias inactivas al servicio Theme.
- app/(backend)/components/editor/editor-workspace.tsx y app/(backend)/admin/(protected)/posts/[id]/editor/actions.ts: el guardado de posts deja de reenviar variables globales; el panel Variables las persiste por separado para evitar sobrescrituras.
- app/(backend)/prisma/schema.prisma, prisma.config.ts, .env.example, .gitignore y README.md: se configura Prisma con SQLite local y se documenta la persistencia y la separacion de las migraciones PostgreSQL historicas.
- .env: se cambia la URL local a SQLite; la configuracion PostgreSQL anterior queda en .env.postgresql.backup, ignorada por Git.
- app/(frontend)/[slug]/page.tsx y app/(backend)/components/editor/blocks/block-renderer.tsx: se comparte la consulta del post entre metadatos y pagina durante la peticion, y se renderizan los bloques ya interpretados sin volver a leer el JSON.
- app/(backend)/components/editor/editor-workspace.tsx y app/(backend)/admin/(protected)/posts/[id]/page.tsx: se reutiliza la serializacion de bloques, variables y patrones entre renders y se interpreta cada patron una sola vez al abrir el editor.

#### Removed

- app/(backend)/admin/(protected)/templates/, core/templates/, db/repositories/template.repository.ts, components/admin/ y components/editor/blocks/: se retiran el CRUD de plantillas, la navegación y el bloque dinámico Contenido.
- app/(backend)/prisma/schema.prisma y sqlite-migrations/20261107150000_remove_templates/migration.sql: se eliminan el modelo Template y Post.post_template mediante migración incremental.

- app/(backend)/admin/(protected)/theme/page.tsx, actions.ts y app/(backend)/core/theme/theme.service.ts, theme.types.ts: se retiran la pagina y el servicio Theme. app/(backend)/components/admin/admin-sidebar.tsx y admin-shell.tsx dejan de enlazar la ruta.
- app/(backend)/components/editor/editor.helpers.ts: se elimina el volcado completo del documento a la consola al serializar, que repetia el trabajo y exponia contenido editorial en los logs.

### [2026-07-04]

#### Added

- `app/(backend)/prisma/schema.prisma`, `app/(backend)/prisma/migrations/20260704090000_add_post_revisions/migration.sql`, `app/(backend)/db/repositories/post-revision.repository.ts`, `app/(backend)/core/post-revisions/post-revision.service.ts`, `app/(backend)/core/post-revisions/post-revision.types.ts`, `app/(backend)/admin/(protected)/posts/[id]/editor/actions.ts` y `app/(backend)/admin/(protected)/posts/[id]/page.tsx`: se a�ade historial persistente de snapshots por post, guardado solo al guardar y limitado a las 10 revisiones mas recientes.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/admin/(protected)/posts/[id]/page.tsx`, `app/(backend)/admin/(protected)/posts/[id]/editor/actions.ts` y `README.md`: el panel Historia permite restaurar snapshots como cambios locales pendientes de guardar y los snapshots nuevos incluyen el estado completo de patrones conocido por el editor.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/editor-workspace.tsx` y `app/(backend)/components/editor/editor-header.tsx`: el editor activa deshacer/rehacer local en memoria para bloques y patrones, y muestra cambios locales junto a snapshots guardados en el panel Historia.

### [2026-07-03]

#### Added

- `app/(backend)/admin/(protected)/library/page.tsx`, `app/(backend)/components/admin/admin-sidebar.tsx`, `app/(backend)/components/admin/admin-shell.tsx` y `README.md`: se a�ade `/admin/library` como inventario visual de primitivas UI, controles del editor e iconos, enlazado desde el panel protegido.
- `app/(backend)/components/ui/switch.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx`, `app/(backend)/components/editor/editor.types.ts`, `app/(backend)/components/editor/editor.helpers.ts` y `app/(backend)/components/editor/blocks/block-registry.ts`: se a�ade un `Switch` reutilizable y se usa en Adaptabilidad para editar la visibilidad por dispositivo del bloque.
- `app/(backend)/components/editor/blocks/block-previewer.tsx` y `app/(backend)/components/editor/editor-workspace.tsx`: se a�ade edicion inline de bloques de texto desde el preview del editor, sincronizando el texto con el estado del bloque y patrones.
- `app/(backend)/components/editor/variables/actions.ts`: se a�ade `saveEditorVariablesAction` para persistir el diccionario global de variables desde el panel de variables.
- `app/(backend)/components/ui/variable-options-list.tsx`: se extrae la lista de variables guardadas como primitiva reutilizable para controles del editor.

#### Fixed

- `app/(frontend)/helpers/block-style-css.ts`, `app/(backend)/components/editor/blocks/block-renderer.tsx`, `app/(backend)/components/editor/blocks/block-view.tsx`, `app/(backend)/components/editor/blocks/block-previewer.tsx` y `app/(backend)/components/editor/blocks/block-registry.ts`: la visibilidad de bloques se resuelve con CSS responsive en el render publico y el preview conserva los bloques ocultos con overlay.
- `app/(backend)/components/editor/blocks/block-previewer.tsx`: la edicion inline hereda el render registrado del bloque para no introducir clases, fondo o color distintos a los configurados en el editor.
- `app/(backend)/components/editor/blocks/block-previewer.tsx`: la edicion inline deja de recontrolar el DOM editable en cada tecla para evitar que el cursor vuelva al inicio al escribir o pulsar espacio.
- `app/(backend)/components/editor/variables/variables-panel.tsx`: el boton de guardar variable ahora persiste inmediatamente en `editor_variables`, y el borrado tambien sincroniza el almacenamiento.
- `app/(backend)/components/ui/color-control.tsx`: se estabiliza la maquetacion del control de color en una sola fila para evitar que el input nativo, las variables y las acciones rompan el layout del inspector.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/editor-header.tsx` y `app/(backend)/components/editor/blocks/block-inspector.tsx`: el panel derecho se reorganiza en ramas Contenido e Historia; Contenido contiene las pesta�as Contenido/Estilo y Historia muestra su panel propio.
- `app/(backend)/components/admin/admin-sidebar.tsx`, `app/(backend)/components/admin/admin-shell.tsx` y `README.md`: el enlace de la libreria visual apunta a la ruta protegida real `/admin/icons`.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/ui/input.tsx`, `app/(backend)/components/ui/color-control.tsx`, `app/(backend)/components/ui/shadow-control.tsx` y `app/(backend)/components/editor/blocks/block-inspector.tsx`: los controles de valor y color reutilizan la misma lista/editor de variables desde el modal del boton de variable.

### [2026-06-29]

#### Fixed

- `app/(backend)/components/editor/variables/variables-panel.tsx`: se corrige la logica de guardado del panel de variables para usar los tipos internos reales, abrir el formulario al editar, cancelar el borrador y bloquear claves duplicadas antes de serializar `editor_variables`.

### [2026-06-28]

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: el inspector pasa a orquestar las herramientas externas de estilo (`UniversalBlockTools` y `StyleStateTool`) en vez de definir los submenus inline.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: la posicion de imagen se divide en selects de posicion vertical y horizontal, que se serializan como un `object-position` CSS completo.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: el campo Proporcion del menu de imagen pasa a ser un selector de proporciones predefinidas (`1:1`, `4:3`, `16:9`, `9:16`, etc.).
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: los campos de proporcion y posicion del menu de imagen del inspector pasan a usar `IconValueInput` con acceso al modal de variables.
- `app/(backend)/components/ui/modal.tsx`, `app/(backend)/components/ui/input.tsx`, `app/(backend)/components/ui/box-control.tsx`, `app/(backend)/components/ui/shadow-control.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: se añade un `Modal` reutilizable y los botones con `TagIcon` de `IconValueInput` abren el editor CRUD de variables guardadas sin aplicar seleccion al campo todavia.
- `app/(backend)/core/editor-variables/editor-variables.types.ts`, `app/(backend)/core/editor-variables/editor-variables.service.ts`, `app/(backend)/admin/(protected)/posts/[id]/page.tsx`, `app/(backend)/admin/(protected)/posts/[id]/editor/actions.ts`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: el panel `Variables` carga y guarda su CRUD como JSON versionado en `Setting` bajo la clave `editor_variables`.
- `app/(backend)/components/ui/input.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx`, `app/(backend)/components/ui/box-control.tsx` y `app/(backend)/components/ui/shadow-control.tsx`: `IconValueInput` acepta `unitType="magnitude"` para mostrar una unidad seleccionable (`px`, `rem`, `em`, `%`, `vw`, `vh`, `vmin`, `vmax`); si no recibe tipo de unidad no muestra selector ni unidad.

### [2026-06-27]

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: el panel `Variables` deja de listar informacion del tema activo y pasa a ser un diccionario local editable de keys/valores agrupados por tipo, con acciones de crear, editar y eliminar usando primitivas reutilizables de UI.

### [2026-06-24]

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/ui/box-control.tsx` y `app/(backend)/components/editor/blocks/block-inspector.tsx`: los botones de vincular valores de controles box/dobles se mueven junto al label del grupo padre para liberar espacio dentro del grid de inputs.
- `app/(backend)/components/ui/box-control.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `app/(backend)/components/ui/shadow-control.tsx`: los controles enlazados aplican los cambios en lote para evitar multiples renders por tecla y mantener usable la edicion vinculada.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: el inspector de estilos a�ade la seccion `Posicion` con selector de tipo CSS y campos basicos para `top`, `right`, `bottom` y `left`.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: los valores de la seccion `Posicion` pasan a usar `BoxSideControl` sin enlace para mantener la UI compacta sin vincular offsets.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: la seccion `Layout` incorpora un desplegable `Overflow` para editar la propiedad CSS `overflow` del bloque.
- `app/(backend)/components/ui/color-control.tsx` y `app/(backend)/components/editor/blocks/block-inspector.tsx`: `ColorControl` acepta `allowImage` y muestra un boton mock de imagen en los controles de fondo.
- `app/(backend)/components/editor/editor.types.ts`, `app/(backend)/components/editor/style-variants.ts`, `app/(backend)/components/editor/editor.helpers.ts`, `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx`, `app/(backend)/components/editor/blocks/block-previewer.tsx`, `app/(backend)/components/editor/blocks/block-view.tsx`, `app/(backend)/components/editor/blocks/block-registry.ts` y `README.md`: los estilos de bloque incorporan variantes por dispositivo (desktop/tablet/mobile) y estado visual (defecto/hover/activo), con herencia desde desktop y edicion segun la visualizacion activa del canvas.
- `app/(frontend)/helpers/block-style-css.ts`, `app/(backend)/components/editor/blocks/block-renderer.tsx`, `app/(backend)/components/editor/blocks/block-registry.ts` y `README.md`: el render publico genera e inyecta CSS selectivo para variantes responsive, hover y active usando clases estables por bloque.
- `app/(frontend)/helpers/block-style-css.ts`: los bloques con variantes `hover` o `active` reciben una transicion base suave para color, fondo, borde, sombra, opacidad y transform.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/editor-header.tsx` y `README.md`: el panel izquierdo del editor sustituye el reducer por un arbol explicito de ramas y a�ade la rama `Variables` con colores, layout y tipografias del tema.

### [2026-06-22]

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/prisma/company-example.ts`: la pagina `/zooparque-atlantico` se redise�a como una experiencia editorial completa para Bioparque Aurora, con narrativa de marca, rutas de visita, habitats inmersivos, agenda, conservacion visible y cierre comercial.
- `app/(backend)/prisma/seed.ts` y `README.md`: el seed itera varias paginas de ejemplo y documenta `/zooparque-atlantico` junto a `/nexo-habitat`.
- `app/(backend)/components/ui/shadow-control.tsx`: el control de sombra a�ade transparencia en porcentaje y serializa el color como hexadecimal con alpha para mantener un `box-shadow` CSS valido.
- `app/(backend)/components/ui/shadow-control.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: se reemplaza la seccion `Visual` por una seccion `Sombra` con color, lados mediante `BoxSideControl` y blur con `PxInput`, usando un control reutilizable.
- `app/(backend)/components/ui/color-control.tsx`: el selector de color oculta el control nativo visual y usa un swatch propio clicable para evitar el recuadro interno del navegador.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: las secciones del inspector pasan a ser colapsables usando `NavChevron`, manteniendose abiertas por defecto.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: las opciones de alineacion y justificacion del layout usan los nuevos iconos horizontales/verticales segun la direccion del contenedor, incluyendo `space-around`.
- `app/(backend)/components/ui/box-control.tsx` y `app/(backend)/components/editor/blocks/block-inspector.tsx`: nuevo `BoxTextSpacingControl` reutilizable con dos `IconValueInput` para alto de linea y separacion de letras bajo el grupo `Espaciado`.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: los controles de transformacion de texto y estilo de borde pasan a toggles con iconos; los campos de altura de linea y espaciado de letras muestran labels con iconos dedicados.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: el inspector universal de estilos a�ade controles de `borderStyle`, decoracion sin valor, cursiva, transformacion de texto, altura de linea, espaciado de letras, min/max de dimensiones, overflow, opacidad, sombra y ajustes especificos de imagen (`objectFit`, `objectPosition`, `aspectRatio`).

### [2026-06-21]

#### Added

- `app/(backend)/components/editor/tools/style-state-tool.tsx` y `app/(backend)/components/editor/tools/universal-block-tools.tsx`: se crea la carpeta de herramientas del editor para modularizar los submenus del inspector de bloque.
- `app/(backend)/prisma/company-example.ts`: nueva pagina de seed `/zooparque-atlantico` para un zoologico completo, con hero, informacion de visita, seccion por habitat, conservacion, experiencias, servicios y contacto.
- `app/(backend)/prisma/company-example.ts`: nueva landing corporativa de ejemplo para Nexo Habitat con hero, intro, servicios, metricas, galeria, testimonio y cierre comercial, pensada para probar el editor con contenido mas realista.
- `app/(backend)/components/ui/color-control.tsx`: nuevo `ColorControl` reutilizable para editar colores con input nativo, valor hexadecimal y swatches del tema.
- `app/(backend)/components/ui/size-control.tsx`: nuevos `PxInput`, `FontSizeControl` y `SpacingControl` reutilizables para dimensiones, tipografía y espaciado.
- `app/(backend)/components/ui/icons.tsx`: nuevos iconos puros de alineación, justificación y orden de bloques para el inspector visual.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/prisma/seed.ts` y `README.md`: el seed usa la landing corporativa `/nexo-habitat` y documenta la nueva pagina de demostracion en lugar del ejemplo anterior de agencia.
- `app/(backend)/components/ui/box-control.tsx`: `BoxSideControl` añade preview central y opción de vincular lados para reutilizar el patrón de edición de padding/margen.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: el inspector de estilo de bloque consume controles reutilizables de `/ui`, añade dimensiones ancho/alto y usa botones con iconos para layout.
- `README.md`: documenta las nuevas primitivas reutilizables de color, tamaño y espaciado dentro del design system del admin.
- `app/(backend)/components/ui/box-control.tsx`: `BoxSideControl` y `BoxCornerControl` pasan a una cuadrícula compacta de campos con iconos SVG por lado/esquina, manteniendo el vínculo de valores en los controles por lado.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: los campos de estilo se agrupan por naturaleza (`Layout`, `Tipografía`, `Espaciado`, `Dimensiones`, `Color`, `Borde`) y el borde incorpora tamaño por lado, esquinas y color.
- `app/(backend)/components/ui/input.tsx`: los inputs numéricos ocultan los controles nativos de incremento/decremento del navegador para mantener una UI compacta en el inspector.
- `app/(backend)/components/ui/box-control.tsx`: `BoxSideControl` reorganiza su grid en una columna grande para los campos y una columna pequeña para el vínculo de valores.
- `app/(backend)/components/ui/box-control.tsx`: `BoxCornerControl` adopta el mismo patrón de cuadrícula y vínculo que `BoxSideControl`, y el estado activo/focus se muestra en el wrapper de `BoxValueInput`.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: las secciones del inspector de estilo añaden un divisor sutil entre bloques de controles.
- `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: los bloques contenedor también muestran sus controles de disposición en la pestaña `Estilo`, además de mantenerlos en `Contenido`.
- `app/(backend)/components/editor/blocks/block-tools.tsx`, `app/(backend)/components/editor/blocks/block-previewer.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: `BlockTools` añade un acceso rápido con icono de bloque, popover 3x3 de bloques frecuentes y botón para abrir el panel completo de bloques.
- `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: la pestaña `Estilo` renderiza todas las herramientas del inspector para cualquier tipo de bloque.
- `app/(backend)/components/ui/box-control.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: nuevo `BoxAxisControl` reutilizable para editar valores horizontal/vertical con vínculo, usado por la separación entre elementos del inspector universal.

### [2026-06-20]

#### Added

- `app/(backend)/components/ui/icon-toggle-group.tsx`: nueva primitiva reutilizable para toggles compactos con texto o iconos, usada por controles densos del editor.
- `app/(backend)/components/ui/box-control.tsx`: nuevas primitivas `BoxSideControl` y `BoxCornerControl` para editar valores direccionales de caja sin duplicar UI en el inspector.
- `app/(backend)/components/ui/icons.tsx`: nuevos iconos puros `AlignLeftIcon`, `AlignCenterIcon`, `AlignRightIcon` y `BoldIcon` para herramientas de estilo del editor.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: nuevo outline de estructura HTML/SEO para mostrar la jerarquia semantica del documento dentro del navegador del panel izquierdo.
- `app/(backend)/components/ui/icons.tsx`: nuevos iconos puros `MobileIcon`, `TabletIcon` y `DesktopIcon` para la barra de resolucion del canvas.
- `app/(backend)/components/ui/icons.tsx`: nuevos iconos puros `EditIcon` y `LaptopIcon` para acciones de edicion y resoluciones alternativas.
- `app/(backend)/components/ui/icons.tsx`: nuevo icono puro `MoveIcon` para representar el mover con una cruz de flechas.
- `app/(backend)/components/editor/editor.helpers.ts`: nuevas utilidades puras `insertBlockAtIndex` y `moveBlockToIndex` para reordenar bloques en el canvas sin acoplar la logica al DOM.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: las herramientas de estilo consumen primitivas de `components/ui`; alineacion/peso pasan a botones con iconos y padding, margen y radios se editan con controles visuales de caja.
- `app/(backend)/components/editor/editor-workspace.tsx`: el panel izquierdo pasa a comportarse como menu/submenu; los iconos de cabecera abren Ajustes, Elementos o Estructura, y las pestañas de texto alternan Bloques/Patterns/Media o Navegador/Estructura SEO.
- `app/(backend)/components/ui/select.tsx` y `app/(backend)/components/editor/editor-header.tsx`: el `Select` del admin adopta el mismo lenguaje visual base del `Button` y el selector de resolucion del header gana un ancho fijo para no colapsarse.
- `app/(backend)/components/editor/blocks/block-tools.tsx` y `app/(backend)/components/editor/blocks/block-previewer.tsx`: la caja de acciones del bloque seleccionado se extrae a `BlockTools` para reutilizarla y dejar el preview mas limpio.
- `app/(backend)/components/editor/blocks/block-tools.tsx` y `app/(backend)/components/editor/blocks/block-previewer.tsx`: el bloque seleccionado gana un boton de mover con `MoveIcon`; el handle de mover pasa a ser el origen nativo del drag para reordenar bloques de forma mas robusta.
- `app/(backend)/components/editor/blocks/block-tools.tsx`: el boton de mover se marca como `draggable` y dispara el drag directamente, sin bandera intermedia.
- `app/(backend)/components/editor/editor-side-panel.tsx`, `app/(backend)/components/editor/blocks/block-inserter.tsx`, `app/(backend)/components/editor/editor-navigator.tsx`, `app/(backend)/components/editor/patterns/pattern-library.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `app/(backend)/components/editor/editor-workspace.tsx`: los paneles laterales recuperan cabecera con pestañas y buscador, el navegador e inserter filtran contenido y el inspector muestra un resumen del bloque; el workspace añade avisos al añadir, mover, eliminar, insertar patrones y usar media.
- `app/(backend)/components/editor/editor-side-panel.tsx`: las opciones de ajustes/bloques/navegador/patrones pasan a comportarse como un submenú de inspector, con pestañas planas y subrayado activo.
- `app/(backend)/components/editor/editor-workspace.tsx` y `app/(backend)/components/editor/hooks/*`: el workspace se divide en hooks pequeños para patrones, drag & drop y media, y agrupa el estado de paneles en un reducer; la logica repetida de arbol activo se centraliza en un unico punto.

- `app/(backend)/components/editor/editor-header.tsx`: la resolucion del canvas deja de mostrarse como un `Select` y pasa a una barra de botones con iconos para movil, tablet y desktop.
- `app/(backend)/components/editor/blocks/block-previewer.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `app/(backend)/components/editor/editor-workspace.tsx`: el canvas soporta reordenacion por drag and drop con indicadores de insercion; el boton de borrar elimina el bloque activo y el boton de editar abre el panel derecho directamente en la pestaña de estilo.

- `app/(backend)/components/admin/admin-shell.tsx` y `README.md`: la parte superior del admin deja el breadcrumb a la izquierda y muestra los avisos como una cola horizontal en el extremo derecho, con el aviso activo en primer plano, el resto al 50% de opacidad y una barra interna de progreso en los avisos temporales.

#### Fixed

- `app/(backend)/components/editor/editor-workspace.tsx`: restaurado el panel derecho al inspector simple de bloque y eliminado el duplicado de canvas/panel generado por el cambio fallido del outline.
- `app/(backend)/components/editor/editor-header.tsx`, `app/(backend)/components/editor/editor-canvas.tsx` y `app/(backend)/components/editor/editor-workspace.tsx`: el selector de resolucion del header queda limitado a Movil, Tablet y Desktop, parte de Desktop por defecto y vuelve a aplicar el ancho elegido al canvas.

### [2026-06-19]

#### Added

- `app/(backend)/components/ui/icons.tsx`: nuevo icono puro `GearIcon` para acciones de configuracion.
- `app/(backend)/components/ui/icons.tsx`: nuevos iconos direccionales puros `ArrowUpIcon`, `ArrowDownIcon`, `ArrowLeftIcon` y `ArrowRightIcon` para acciones cardinales.
- `app/(backend)/components/ui/icons.tsx`: nuevo icono puro `CubeIcon` para representar objetos/bloques en volumen.

- `app/(backend)/editor/block-registry.ts`: nuevo registry extensible de bloques con `registerBlockType`, `unregisterBlockType`, consultas de metadatos, etiquetas, tipos insertables y factories de creación, para que futuros módulos/plugins puedan añadir bloques sin tocar el core del editor.
- `__tests__/block-registry.test.ts`: pruebas Jest definidas para registrar bloques custom, crearlos con `createBlock` y conservarlos en `parseDocument` cuando su tipo está registrado.

#### Fixed

- `app/(backend)/components/ui/icons.tsx`: `GearIcon` se redibuja con contorno de engranaje para que no parezca un sol.
- `app/(backend)/components/editor/editor-icons.tsx` y `app/(backend)/components/editor/editor-navigator.tsx`: el boton de eliminar del navegador usa un icono de basura inline en vez de una `x` textual.
- `app/(backend)/components/editor/editor-navigator.tsx`, `app/(backend)/editor/blocks/block-editor.tsx`, `app/(backend)/editor/_reusable-block-editor.tsx` y `app/(backend)/editor/blocks/block-inspector.tsx`: el navegador de bloques queda solo con la accion de eliminar por bloque y se desconecta la logica de mover arriba/abajo con botones.

#### Removed

- app/(backend)/admin/(protected)/templates/, core/templates/, db/repositories/template.repository.ts, components/admin/ y components/editor/blocks/: se retiran el CRUD de plantillas, la navegación y el bloque dinámico Contenido.
- app/(backend)/prisma/schema.prisma y sqlite-migrations/20261107150000_remove_templates/migration.sql: se eliminan el modelo Template y Post.post_template mediante migración incremental.

- `app/(backend)/components/editor/editor-controls.tsx`: eliminado el wrapper de controles del editor; sus usos pasan a `Button` de `components/ui` directamente.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`, `app/(backend)/editor/blocks/block-editor.tsx` y `app/(backend)/editor/_reusable-block-editor.tsx`: los botones activos de la cabecera izquierda (`Ajustes`, `Bloques`, `Navegador`) ahora alternan su panel; al pulsarlos de nuevo se colapsa el panel izquierdo.
- `app/(backend)/components/editor/editor-header.tsx` y `app/(backend)/editor/blocks/block-editor.tsx`: la cabecera del editor de paginas incorpora una tuerca que abre los ajustes de pagina en el panel izquierdo; la configuracion del post deja de vivir en el panel derecho.
- `app/(backend)/components/editor/editor-header.tsx`, `app/(backend)/editor/blocks/block-editor.tsx` y `app/(backend)/editor/_reusable-block-editor.tsx`: la cabecera del editor separa las acciones hermanas **Bloques** y **Navegador** con `blocksViewActive`/`navigatorViewActive`; el boton `+` abre la vista de bloques y el boton de navegador abre la vista de navegador sin actuar como toggle generico del panel izquierdo.
- `app/(backend)/components/ui/icons.tsx`, `app/(backend)/components/editor/editor-icons.tsx`, `app/(backend)/components/editor/editor-navigator.tsx`, `app/(backend)/editor/patterns/pattern-library.tsx` y `README.md`: los iconos concretos de tipos de bloque (`HeadingIcon`, `ParagraphIcon`, `QuoteIcon`, `ImageIcon`, `PatternIcon`, `GroupIcon`, `ColumnsIcon`, `TextIcon`) pasan a vivir como iconos puros en `components/ui/icons`; `editor-icons.tsx` queda solo como adaptador `BlockTypeIcon`.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos, y el contrato del panel izquierdo queda alineado con la prop `leftOpen` usada por los editores.
- `app/(backend)/components/editor/editor-side-panel.tsx`: se restaura el contrato `{ key, label }` de las pestañas y su renderizado en los paneles laterales del editor.
- `app/(backend)/components/ui/button.tsx`, `app/(backend)/components/editor/editor-header.tsx`, `app/(backend)/components/editor/editor-side-panel.tsx`, `app/(backend)/editor/blocks/block-editor.tsx`, `app/(backend)/editor/_reusable-block-editor.tsx` y `README.md`: los controles del editor usan directamente `Button` de `components/ui` para estados `selected` y variante `collapsed`; se elimina el wrapper `editor-controls.tsx`.

- `app/(backend)/components/ui/{button,input,select,textarea,field}.tsx`: las primitivas UI del admin incorporan variantes, tamaños y estados para reutilizarlas tambien en paneles densos del editor.
- `app/(backend)/components/editor/editor-side-panel.tsx`, `app/(backend)/components/editor/editor-canvas.tsx`, `app/(backend)/editor/blocks/block-editor.tsx`, `app/(backend)/editor/_reusable-block-editor.tsx` y `app/(backend)/editor/blocks/block-inspector.tsx`: los controles visibles del editor pasan a consumir `components/ui` en vez de clases locales duplicadas.
- `README.md`: documenta la responsabilidad de `components/ui` como primitivas reutilizables del admin y su relacion con el design system especifico del editor.

- `app/(backend)/editor/editor.types.ts`, `app/(backend)/editor/editor.helpers.ts`, `app/(backend)/components/editor/block-inserter.tsx`, `app/(backend)/components/editor/editor-navigator.tsx`, `app/(backend)/components/editor/preview-block.tsx` y `app/(backend)/editor/block-inspector.tsx`: los tipos, etiquetas, creación, validación, inserter, navegador e inspector de bloques pasan a leer del registry en vez de listas hardcodeadas, manteniendo exports de compatibilidad para el código existente.
- `README.md` y `TEST.md`: documentan el registry de bloques como punto de extensibilidad del CMS y cómo verificarlo.

#### Added

- `app/(backend)/editor/block-registry.ts` y `app/(backend)/editor/editor.types.ts`: nuevo bloque nativo `list` en la categoria de texto; cada linea del contenido se renderiza como un item de lista.
- `__tests__/editor.tree.test.ts`: pruebas definidas para `createBlock('list')` y el round-trip del bloque `list`.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos.

- `app/(backend)/components/editor/editor-icons.tsx`: `BlockTypeIcon` ahora muestra iconos diferenciados para encabezado, parrafo, cita y lista en vez de reutilizar la misma T generica para todos los bloques de texto.
- `app/(backend)/editor/block-inspector.tsx`: el bloque `list` muestra un campo propio **Elementos de la lista** en el inspector.
- `README.md` y `TEST.md`: documentan el bloque `list` y la verificacion visual de iconos diferenciados en el inserter.
- `app/(backend)/components/admin/admin-shell.tsx`: el shell del admin incorpora un centro global de avisos entre el breadcrumb y el `main`, con `useAdminNotice` para componentes cliente/plugins y `AdminStatusMessage` para paginas server; soporta avisos temporales y persistentes.
- `app/(backend)/editor/blocks/block-editor.tsx`, `app/(backend)/admin/(protected)/posts/[id]/page.tsx`, `app/(backend)/admin/(protected)/media/page.tsx`, `app/(backend)/admin/(protected)/theme/page.tsx`, `app/(backend)/components/editor/editor-header.tsx` y `app/(backend)/editor/reusable-block-editor.tsx`: los mensajes de guardado/error pasan al canal global del `AdminShell`; el editor de posts consume `useAdminNotice` directamente y se elimina el estado **Guardado** de la cabecera del editor.
- `README.md`: documenta el centro global de avisos del admin y la nueva responsabilidad de la cabecera del editor.

#### Removed

- app/(backend)/admin/(protected)/templates/, core/templates/, db/repositories/template.repository.ts, components/admin/ y components/editor/blocks/: se retiran el CRUD de plantillas, la navegación y el bloque dinámico Contenido.
- app/(backend)/prisma/schema.prisma y sqlite-migrations/20261107150000_remove_templates/migration.sql: se eliminan el modelo Template y Post.post_template mediante migración incremental.

- `app/(backend)/components/editor/editor-canvas.tsx`, `app/(backend)/editor/block-editor.tsx` y `app/(backend)/editor/reusable-block-editor.tsx`: eliminado todo el sistema de zoom del simulador (estado de zoom/auto-fit, observers, selector de zoom, boton **Ajustar**, `zoom` CSS, transforms y props de recalculo); el canvas queda con selector de resolucion y scroll interno.
- `README.md` y `TEST.md`: eliminadas las referencias al zoom del canvas y actualizada la verificacion manual para resoluciones grandes con scroll interno.

### [2026-06-15]

#### Fixed

- `app/(backend)/editor/block-editor.tsx`: el botón **Ajustar** y el modo **Auto** del simulador ahora ajustan el zoom solo por ancho (`ancho disponible / ancho natural`) y dejan de reducir el preview por la altura del contenido. `README.md` y `TEST.md` se actualizaron para documentar y verificar este comportamiento.
- `app/(backend)/editor/block-editor.tsx`: la sincronización interna de `zoomRef` y `autoFitRef` se movió a efectos para cumplir la regla `react-hooks/refs` de ESLint.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos.

- **Design system del editor extraído a `components/editor/`** y reutilizado por los tres editores (páginas, plantillas y patrones), para que compartan los mismos paneles y elementos:
  - `editor-icons.tsx` (iconos + `BlockTypeIcon`/`NavChevron`), `editor-controls.tsx` (`EditorIconButton`, `TabButton`, `CollapsedBar`), `block-meta.ts` (`blockSummary`, `isEmptyLeaf`).
  - `editor-header.tsx` (barra superior estilo Gutenberg), `editor-side-panel.tsx` (chrome de panel lateral izquierdo/derecho con pestañas + buscador opcional), `editor-canvas.tsx` (lienzo + barra dispositivo/zoom + auto-fit por ancho), `block-inserter.tsx`, `editor-navigator.tsx`, `pattern-library.tsx` (`PatternLibrary` + `PatternReferencePanel`), `preview-block.tsx`.
  - `editor/block-editor.tsx` (editor de páginas) deja de declarar estos componentes en línea y los importa de `components/editor/`, sin cambios funcionales.
  - `editor/reusable-block-editor.tsx` (editor de **plantillas** y **patrones**) se reescribe sobre estos componentes: ahora usa el mismo design system que el editor de páginas (barra superior, panel izquierdo Bloques/Navegador/Patrones con buscador, lienzo con zoom/dispositivo, panel derecho Ajustes/Bloque). Los campos de ajustes se envían siempre por el form (inputs ocultos controlados) aunque la pestaña no esté visible. Corrige además el inspector, que recibía `theme.palette` (inexistente) en vez de `theme.colors`.
- `app/(backend)/editor/block-editor.tsx`: la interfaz interna del editor adopta la disposición del constructor actual de WordPress/Gutenberg sin cambiar el sidebar ni el breadcrumb del panel: barra superior del editor con acciones, panel izquierdo de **Bloques/Navegador/Patrones**, lienzo central y panel derecho con tabs **Post/Bloque**.
- `app/(backend)/editor/block-editor.tsx`: los botones, pestañas, menús y acciones de la nueva maqueta del editor vuelven al estilo visual propio del CMS (`rounded-md`, slate como color principal, secundarios con borde) y sustituyen símbolos sueltos por iconos SVG inline propios.
- `README.md` y `TEST.md`: documentación y verificación manual actualizadas para reflejar la nueva maqueta del editor.

#### Added

- **Editor de bloques para plantillas y patrones**:
  - `schema.prisma` + migración `20260615170000_add_template_content`: `Template.content` guarda el JSON de bloques de la plantilla; las plantillas nuevas nacen con un bloque dinámico `content`.
  - `db/repositories/{template,pattern}.repository.ts`: se elimina el rodeo temporal con SQL crudo y se vuelve al uso normal de Prisma Client (`prisma.template` / `prisma.pattern`), asumiendo la migración y regeneración del cliente.
  - `editor/reusable-block-editor.tsx`: editor reutilizable para objetos con documentos de bloques; lo usan plantillas y patrones con inserter, navegador, patrones, canvas, inspector y biblioteca de medios.
  - `admin/(protected)/templates/[id]/page.tsx` y `templates/actions.ts`: `/admin/templates/[id]` edita la plantilla con bloques y guarda `Template.content` junto a sus ajustes de contenedor.
  - `admin/(protected)/patterns/{page,[id]/page,actions}.tsx` y `components/admin/admin-sidebar.tsx`: nuevo menú **Patrones**, listado, creación, eliminación y editor de bloques para `Pattern.content`.
  - `editor/block-view.tsx`, `block-inspector.tsx` y `/[slug]/page.tsx`: el bloque `content` se muestra como marcador en el editor y, en público, se reemplaza por el contenido real del post cuando la plantilla tiene bloques.
  - `README.md`, `TEST.md`, `__tests__/editor.tree.test.ts` y `__tests__/template.service.test.ts`: documentación y pruebas definidas para el bloque dinámico, rutas nuevas y migración requerida.

> **Migración requerida:** se añade `Template.content` y se usa Prisma Client para `Pattern`/`Template`. Ejecuta `pnpm db:migrate` antes de compilar/usar estas pantallas para que Prisma regenere el cliente.

- **Patrones sincronizados**: nuevo objeto `Pattern` para bloques reutilizables compartidos entre páginas. Los bloques de tipo `pattern` guardan solo `patternId`; el contenido real vive en `Pattern.content`, de modo que al editar el patrón desde una referencia se actualizan todas.
  - `schema.prisma` + migración `20260615160000_add_patterns`: tabla `Pattern` (`pattern_slug`, `pattern_label`, `content`).
  - `core/patterns/{pattern.types,pattern.service}.ts` y `db/repositories/pattern.repository.ts`: listado, creación, actualización y resolución de patrones a bloques.
  - `editor/editor.types.ts`, `editor.helpers.ts`, `block-view.tsx` y `block-renderer.tsx`: nuevo tipo de bloque `pattern`, saneado/serialización, recolección de `patternId` y render SSR/preview resolviendo el contenido sincronizado.
  - `editor/block-editor.tsx`: el panel izquierdo reemplaza **Media** por **Patrones**; permite crear un patrón desde el bloque seleccionado, insertar referencias y editar bloques internos del patrón desde el preview. El guardado envía solo patrones nuevos/modificados.
  - `admin/(protected)/posts/[id]/{page.tsx,editor/actions.ts}` y `/[slug]/page.tsx`: cargan, guardan y renderizan patrones sincronizados con sus medios resueltos.
  - `__tests__/editor.tree.test.ts`: cobertura de creación, round-trip y recolección de referencias a patrones.

> **Migración requerida:** se añade la tabla `Pattern`. Ejecuta `pnpm db:migrate` antes de usar patrones sincronizados.

- **Bloques contenedor estilo Gutenberg** (anidación libre recursiva): nuevos tipos de bloque `group`, `columns` y `column` en `editor/editor.types.ts`. `Block` gana `children?: Block[]` y `layout?: BlockLayout` (dirección vertical/horizontal del grupo, separación, justificación, alineación y wrap). Un grupo puede contener columnas y una columna otro grupo, sin límite.
  - `editor/editor.helpers.ts`: `createBlock` inicializa contenedores (las «columns» nacen con dos «column»); `parseDocument`/`normalizeBlock` validan y sanean el árbol de forma **recursiva** (saneo de `layout` y de los `children`). Nuevas funciones puras del árbol: `findBlockById`, `mapBlockById`, `removeBlockById`, `insertBlock`, `moveBlockById`, `findSiblings` y `collectMediaIds`.
  - `editor/block-view.tsx`: render **recursivo** de contenedores con `containerLayoutStyle(block)` (flexbox a partir del `layout`). Lo comparten el SSR y el preview, así que se ven igual.
  - `editor/block-editor.tsx`: preview **recursivo** con selección anidada (click en un hijo no selecciona al padre), navegador en **árbol**, mover entre hermanos en cualquier nivel y añadir bloques dentro de un contenedor.
  - `editor/block-inspector.tsx`: pestaña **Contenido** específica de contenedores (orientación del grupo, separación, justificación/alineación, y añadir hijos; en «columns», botones + / − Columna), reutilizando los controles de estilo existentes.
- **Plantillas de página estilo Gutenberg** (CRUD en `/admin`): definen el comportamiento por defecto del contenedor de la página (ancho de contenido, ancho «wide», padding vertical, color de fondo y color de texto). Cada post elige su plantilla en la pestaña «Página» del editor.
  - Modelo `Template` (slug único) y columna `Post.post_template` (string, estilo `post_type`) en `schema.prisma`; `db/repositories/template.repository.ts`.
  - `core/templates/{template.types,template.service}.ts`: `Template`, validación de slug/etiqueta y unicidad, `resolveContainerStyle(theme, template)` que sobreescribe ancho/padding/colores del tema (las fuentes siguen viniendo del tema).
  - CRUD `app/(backend)/admin/(protected)/templates/{page,new/page,[id]/page,actions}.tsx` y enlace «Plantillas» en el sidebar.
  - `editor/block-editor.tsx` recibe `templates` y `pageSettings.post_template`; el preview usa `resolveContainerStyle`. La página pública `/[slug]` carga la plantilla del post (`getTemplateBySlug`) y la aplica en SSR.
  - `core/posts`: `UpdatePostInput`/`updatePost`, `post.repository.update` y la acción de guardado del editor aceptan y persisten `post_template`.
- Plantillas y bloque de columnas de ejemplo en el seed (`prisma/example.ts`): plantillas `landing` y `articulo`; la landing `/agencia` usa la plantilla `landing` y muestra los tres servicios en un bloque `columns`.
- `__tests__/editor.tree.test.ts` (creación de contenedores, parseo anidado, round-trip y operaciones del árbol) y `__tests__/template.service.test.ts` (validación de slug/etiqueta, unicidad, update/delete).

> **Migración requerida:** se añade el modelo `Template` y la columna `Post.post_template`. Ejecuta `pnpm db:migrate` (y, si hace falta, `pnpm db:seed`) para aplicarlos.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos. (UI del panel y editor)

- **Eliminada la topbar** «Panel de administración» (`components/admin/admin-topbar.tsx` borrado). La información y las acciones de usuario (email + **Cerrar sesión**) se movieron al **pie del sidebar** (`components/admin/admin-sidebar.tsx`, ahora `flex` en columna a altura completa; se adapta al estado colapsado mostrando avatar + icono de salir).
- **Navegación por breadcrumb:** nuevo `components/admin/admin-shell.tsx` (cliente) que sustituye a la topbar por una tira superior con **breadcrumb**. Por defecto se deriva de la URL; los componentes cliente pueden fijarlo con `useBreadcrumb(...)`. El editor muestra `«{Post type} › {título} › Editar página»`. `layout.tsx` (protegido) usa `AdminShell` y pasa el email al sidebar.
- **Editor — área de trabajo:** el lienzo del preview ya **no tiene vértices redondeados** (para asemejarse a una web en vivo) y añade una **barra arriba a la derecha** con selector de **resolución** (Responsivo / Escritorio 1280 / Portátil 1024 / Tablet 768 / Móvil 375), selector de **zoom** y un botón **Ajustar**. El lienzo aplica `width` del dispositivo + `zoom` CSS.
- **Editor — auto-zoom «contain»:** por defecto el zoom es **automático** (opción «Auto» del desplegable): el render se reduce con `zoom` CSS para **entrar completo en el área** (`min(anchoDisp/anchoNat, altoDisp/altoNat, 1)`), sin overflow. El ajuste se recalcula al cambiar contenido/dispositivo y al redimensionarse el área (`ResizeObserver`); el tamaño natural se deriva de `getBoundingClientRect() / zoomAplicado`. Elegir un % fija el zoom manual (y habilita scroll); «Auto» o «Ajustar» reactivan el ajuste. En modo auto el lienzo es `overflow-hidden`.
- **Editor — navegador en árbol** (`block-editor.tsx`): el navegador de elementos se rehízo como un **explorador colapsable** (chevron por contenedor, icono por tipo de bloque, guía de indentación y plegado/expansión), al estilo de un árbol de esquema.
- **Panel como app-shell de altura fija:** `layout.tsx` (protegido) pasa a `flex h-screen overflow-hidden` y la zona de contenido del `AdminShell` es `flex-1 min-h-0 overflow-auto` (la página no crece: el breadcrumb queda fijo y el contenido scrollea dentro). El sidebar añade `overflow-y-auto` en el menú.
- **Editor — área de trabajo tipo Figma/Illustrator** (`block-editor.tsx`, `block-inspector.tsx`): el editor llena la altura disponible en columna (cabecera fija + fila de 3 columnas `flex-1 min-h-0`). Los **paneles laterales** son planos (sin vértices redondeados ni sombra) y tienen **scroll propio** (`overflow-y-auto`); la **columna central (canvas)** ocupa el resto del ancho/alto entre los paneles y **contiene siempre** al renderizador: el render (frame del dispositivo + `zoom`) vive dentro del canvas y, si su tamaño excede, scrollea **dentro** del canvas (con un sizer `fit-content`/`min-w-full` que lo centra cuando cabe). Ya no se usa `sticky`/`max-h`.
- `admin/(protected)/posts/[id]/page.tsx` resuelve la etiqueta del post type (`getPostTypeByType`) y la pasa a `BlockEditor` (`postTypeLabel`) para el breadcrumb.

#### Added

- **Contenido de ejemplo** en el seed (`app/(backend)/prisma/example.ts`): landing de una agencia de marketing ficticia («Pulse Studio») publicada en `/agencia`, con bloques variados (títulos, párrafos, cita, imágenes wide/full) y estilos, más un tema acorde guardado en `Setting`. El seed (`prisma/seed.ts`) hace `upsert` idempotente del tema y de la página.
- **Biblioteca de medios** desacoplada en `app/(backend)/media/` (`media.types.ts`, `media.service.ts`) + `db/repositories/media.repository.ts` y modelo `Media` en `schema.prisma`. Los ficheros se suben a `public/uploads/<año>/<mes>/` y se sirven como `/uploads/...`. Página `/admin/media` (`admin/(protected)/media/{page,actions}.tsx`) con subida y galería; enlace «Media» en el sidebar.
- Bloques de imagen estilo Gutenberg: el bloque guarda un **puntero** (`mediaId`) a la biblioteca, no la URL incrustada. Selector modal (`editor/media-library.tsx`, cliente) que sube/elige imágenes; el inspector muestra miniatura + «Seleccionar/Reemplazar». El **SSR resuelve el puntero**: `media.service.getMediaMap(ids)` alimenta `BlockRenderer`/`BlockView` en `/[slug]` y el preview del editor. Alias `@/media/*` en `tsconfig.json` y `jest.config.js`.
- Theme estilo WordPress (`theme.json`): paleta **semántica** de 5 colores (Base = fondo, Contraste = texto, Primario/Secundario/Terciario), **ancho de contenido + ancho «wide»** (`contentSize`/`wideSize`) con **alineación por bloque** (Normal/Ancho/Completo, layout "constrained"), **presets de tamaño de fuente** (`FONT_SIZE_PRESETS`) y **escala de espaciado** (`SPACING_PRESETS`) expuestos en el inspector. `block-view`/renderer/preview/página pública envuelven cada bloque según su alineación.
- Sección **Theme** en el dashboard (`/admin/theme`): variables globales del sitio al estilo "personalización" de WordPress. Incluye paleta semántica de colores, dos familias tipográficas (títulos y cuerpo, de un set web-safe sin fuentes externas) y el layout del contenido (ancho de contenido, ancho «wide» y padding). Nuevo enlace «Theme» en el sidebar.
  - Modelo `Setting` (clave/valor, estilo `wp_options`) en `schema.prisma`; `db/repositories/setting.repository.ts` (get/upsert).
  - `core/theme/{theme.types,theme.service}.ts`: `Theme`, `DEFAULT_THEME`, `FONT_OPTIONS`, `parseTheme`/`serializeTheme` (parseo robusto con defaults) y `themeContainerStyle` (genera el estilo del contenedor + variables CSS `--dalia-font-heading/body`). `getTheme`/`updateTheme`.
  - `app/(backend)/admin/(protected)/theme/{page,actions}.tsx`: formulario (server component + server action) para editar el tema.
- El tema se aplica por defecto al contenido y sigue siendo editable por bloque:
  - El contenedor del contenido (preview del editor y página pública `/[slug]`) usa `themeContainerStyle` (ancho, padding, color, fondo y fuentes del tema).
  - `block-view.tsx`: los títulos usan la fuente de títulos del tema; el resto hereda color y fuente del contenedor. Los estilos propios del bloque siguen ganando.
  - La paleta del tema aparece como swatches en los selectores de color del inspector de bloque (`block-inspector.tsx`).

- Editor de estilos por bloque al estilo Elementor (`app/(backend)/editor/block-inspector.tsx`): el panel del elemento tiene sub-pestañas **Contenido** y **Estilo**. La de estilo ofrece controles clicables (alineación, peso, tamaño en px, colores de texto/fondo, padding, radio de borde, márgenes) que se traducen en propiedades CSS inline del bloque.
- Modelo de estilos en los bloques: `BlockStyle` (`editor.types.ts`) como `Record<string,string>` con claves CSS camelCase y `style?: BlockStyle` en `Block`. `editor.helpers.ts` sanea los estilos al parsear (`sanitizeStyle`/`normalizeBlock`) y `block-view.tsx` los aplica inline, de modo que se ven igual en el preview y en la página pública.
- Meta SEO por post: campos `post_meta_title` y `post_meta_description` (`schema.prisma`, modelo `Post`). Se editan en la pestaña **Página** del editor y alimentan `generateMetadata` de `/[slug]` (con fallback al título y al extracto del post).
- `__tests__/editor.helpers.test.ts`: test de conservación/saneado de estilos en `parseDocument`.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos. (UI)

- Sidebar del dashboard (`components/admin/admin-sidebar.tsx`): ahora es cliente, con **iconos** (SVG inline, sin dependencias), **colapsable** (de ancho `w-56` a `w-16`, despliegue de izquierda a derecha) y resaltado de la ruta activa (`usePathname`).
- Editor de página: **Página** y **Navegador** se movieron a un **panel izquierdo** (con sus propias pestañas), y el inspector de **Elemento** queda en el **panel derecho**. Ambos paneles son **colapsables** (botón ‹/›, barra estrecha para reexpandir), de modo que el preview central se adapta al ancho disponible. Seleccionar un bloque reexpande el panel derecho automáticamente.

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos. (editor)

- Panel derecho del editor reorganizado en tabs **Página** (meta SEO + configuración del post) / **Navegador** (jerarquía de elementos + añadir) / **Elemento** (inspector del bloque seleccionado). Se eliminaron las pestañas de cabecera Configuración/Bloques; el preview central está siempre visible. `BlockEditor` recibe `pageSettings` (incluida la meta SEO), `backHref` y `publicHref`.
- `core/posts`: `UpdatePostInput`/`updatePost` y `post.repository.update` aceptan `post_meta_title`/`post_meta_description`; la acción de guardado del editor los persiste junto a los metadatos y el contenido.

> **Migración requerida:** los campos SEO añaden columnas a `Post`, el tema añade el modelo `Setting` y la biblioteca añade el modelo `Media`. Ejecuta `pnpm db:migrate` para aplicarlos en tu base de datos.

### [2026-06-14]

#### Added

- Scaffolding inicial con `create-next-app` (Next.js 16, App Router, TypeScript, Tailwind v4, ESLint), gestor de paquetes pnpm. Nuevas dependencias: `@prisma/client`, `prisma`, `bcryptjs`; devDependencies `jest`, `jest-environment-node`, `@types/jest`, `tsx`.
- `app/(backend)/prisma/schema.prisma`: modelos `User`, `PostType`, `Post` (PostgreSQL vía `DATABASE_URL`), según README sección 6.
- `app/(backend)/db/prisma.ts` + `app/(backend)/db/repositories/{user,post-type,post}.repository.ts`: única capa que importa `@prisma/client`.
- `app/(backend)/core/auth/{session,password,auth.service}.ts`: sesión firmada con HMAC-SHA256 vía Web Crypto (sin Prisma, válido en `middleware.ts`), hash de contraseñas con bcryptjs, `login`/`logout`/`getSession`.
- `app/(backend)/core/post-types/{post-type.types,post-type.service}.ts`: `listPostTypes`, `getPostTypeById`, `getPostTypeByType`, `createPostType` (valida slug y unicidad), `updatePostType` (etiqueta/descripción), `deletePostType` (bloquea tipos de sistema), `countPostTypes`.
- `app/(backend)/core/posts/{post.types,post.service}.ts`: `listPosts`, `getPostById`, `getPostByTypeAndName`, `createPost`/`updatePost` (validan título, nombre único por tipo, `post_type` existente y `post_status`), `changePostStatus` (fija `post_date` al publicar), `deletePost`, `countPosts`, `countPostsByStatus`.
- `app/(backend)/prisma/seed.ts`: crea el usuario admin (`SEED_ADMIN_*`) y los `PostType` de sistema `page`/`post`.
- `middleware.ts`: protege `/admin/*` (excepto `/admin/login`) verificando la cookie de sesión firmada.
- Panel `/admin`: login (`admin/login/{page,actions}.tsx`), layout protegido con sidebar/topbar (`admin/(protected)/layout.tsx`, `components/admin/{admin-sidebar,admin-topbar}.tsx`) y dashboard con contadores (`admin/(protected)/page.tsx`).
- CRUD de Post Types (`admin/(protected)/post-types/{page,new/page,[id]/page,actions}.tsx`): listar, crear, editar, eliminar (bloqueado para tipos de sistema).
- CRUD de Posts (`admin/(protected)/posts/{page,new/page,[id]/page,actions}.tsx`): listar con filtro `?type=`, crear, editar, cambiar estado (publicar/borrador/archivar), eliminar.
- Componentes UI mínimos en `components/ui/`: `button`, `input`, `textarea`, `select`, `label`, `field`, `alert`.
- `jest.config.js` (vía `next/jest`) y tests en `__tests__/`: `session.test.ts`, `post-type.service.test.ts`, `post.service.test.ts` (mockean los repositorios, no requieren base de datos).
- `TEST.md`: cobertura de cada test, cómo ejecutarlos (`pnpm test`) y guía de verificación manual end-to-end (migraciones, seed, login, CRUD).
- `.env.example`: `DATABASE_URL`, `SESSION_SECRET`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`.
- README: nuevas secciones 14-19 (stack técnico, dependencias, variables de entorno, puesta en marcha, rutas implementadas, tests).
- `prisma.config.ts`: archivo de configuración de Prisma (`defineConfig`) con `schema` y `migrations.seed`, sustituyendo la clave `prisma` de `package.json` (deprecada en Prisma 7). Carga `.env` manualmente con `process.loadEnvFile()` porque, con un config file, Prisma deja de cargar variables de entorno automáticamente.
- Sitio público (SSR): `app/(frontend)/layout.tsx` (root layout propio, patrón de múltiples root layouts) y `app/(frontend)/[slug]/page.tsx`, que renderiza en servidor el post publicado cuyo `post_name` coincide con el slug (`notFound()` si no existe o no está publicado). Incluye `generateMetadata` para el `<title>`.
- `getPublishedPostByName` (`core/posts/post.service.ts`) + `findPublishedByName` (`db/repositories/post.repository.ts`): obtienen el primer post publicado por slug, sin importar el `post_type`.
- Botón "Ver página"/"Ver" en el admin (`admin/(protected)/posts/[id]/page.tsx` y `.../posts/page.tsx`): enlace que abre la página pública `/{post_name}` en una pestaña nueva; solo se muestra para posts en estado `published`.
- `__tests__/post.service.test.ts`: tests para `getPublishedPostByName` (delegación con slug y caso sin resultado).
- Constructor de bloques (sin dependencias externas) en `app/(backend)/editor/`: `editor.types.ts` (modelo `Block`/`BlockDocument`, tipos `heading`/`paragraph`/`quote`/`image`), `editor.helpers.ts` (funciones puras `createBlock`/`serializeDocument`/`parseDocument`, con fallback de texto plano legacy), `block-editor.tsx` (componente cliente para añadir/editar/reordenar/eliminar bloques) y `block-renderer.tsx` (render SSR del documento de bloques).
- Ruta `/admin/editor?post=<id>` (`app/(backend)/admin/editor/{page,actions}.tsx`): editor a pantalla completa (fuera del grupo `(protected)`, sin sidebar, pero protegido por middleware). El contenido se serializa a JSON y se guarda en `Post.post_content` vía `saveBlocksAction`.
- `updatePostContent` en `core/posts/post.service.ts`: actualiza únicamente `post_content`, separado de los metadatos del post.
- Botón "Abrir editor de contenido" en la edición de posts (`admin/(protected)/posts/[id]/page.tsx`): abre `/admin/editor?post=<id>` en una pestaña nueva.
- La página pública `/[slug]` ahora renderiza el contenido mediante `BlockRenderer` (soporta JSON de bloques y texto plano antiguo).
- `__tests__/editor.helpers.test.ts`: tests de `createBlock`, `serializeDocument` y `parseDocument` (JSON válido, bloques inválidos descartados, fallback de texto plano).

#### Changed

- app/(frontend)/[slug]/page.tsx y app/(backend)/core/editor-variables/editor-variables.styles.ts: las páginas renderizan sus bloques directamente con variables globales y conservan los patrones sincronizados.
- app/(backend)/components/editor/editor-workspace.tsx, posts/[id]/, core/posts/, db/repositories/post.repository.ts y prisma/seed.ts: se elimina la asignación de plantillas en edición, guardado y datos de ejemplo.
- README.md: el SDD documenta la composición de páginas mediante patrones y la nueva migración SQLite.

- `app/(backend)/components/editor/history/actions.ts`, `app/(backend)/components/editor/history/history-panel.tsx`, `app/(backend)/components/editor/editor-workspace.tsx` y `README.md`: la l�gica y presentaci�n de Historia se extraen a `components/editor/history`, dejando el workspace solo como orquestador.
- `app/(backend)/components/editor/editor-workspace.tsx`, `app/(backend)/components/editor/blocks/block-inspector.tsx` y `README.md`: el panel derecho conserva las pesta�as en `EditorWorkspace` y `BlockInspector` queda como cuerpo modular sin tabs internas ni chrome duplicado.
- `app/(backend)/components/editor/blocks/block-html-outline.tsx`: la estructura SEO del navegador de bloques permite colapsar y expandir nodos con hijos.
- `app/(backend)/components/editor/blocks/block-inspector.tsx`: Adaptabilidad muestra siempre los switches de visibilidad para escritorio, tablet y movil, en vez de depender solo del dispositivo activo.
- `app/(backend)/components/editor/editor-header.tsx`: los iconos de la cabecera del editor se consumen con namespace `Icon.*` desde `components/ui/icons` para evitar imports sueltos.

- `package.json`: renombrado a `dalia-cms`; eliminada la clave `prisma` (migrada a `prisma.config.ts`); scripts `db:migrate`/`db:studio` simplificados a `prisma migrate dev`/`prisma studio` (el schema se autodetecta desde el config file).
- `tsconfig.json`: alias `@/core/*`, `@/db/*`, `@/editor/*`, `@/components/*` apuntan a `app/(backend)/...`; `@/*` se mantiene para el resto del proyecto (p. ej. `middleware.ts`). `jest.config.js` replica el alias `@/editor/*`.
- El contenido de los posts ya no se edita con un `<textarea>` en los formularios de crear/editar; se gestiona exclusivamente desde el editor de bloques. `UpdatePostInput` y `updatePost` dejan de tocar `post_content`.
- `components/ui/alert.tsx`: añadido `SuccessAlert` (usado para confirmar el guardado en el editor).
- Editor de bloques rediseñado a 3 paneles (`editor/block-editor.tsx`): izquierda = jerarquía/navegación de elementos, centro = preview en vivo (click para seleccionar) con el mismo render que la página pública, derecha = inspector del bloque seleccionado (contenido + mover/eliminar). El render de un bloque se extrajo a `editor/block-view.tsx` (componente puro) para compartirlo entre el renderer SSR y el preview del editor.
- El preview del editor reproduce el contenedor de la página pública `/[slug]` (`<article className="mx-auto max-w-2xl px-4 py-12">` sobre fondo del sitio, con el título del post como `<h1>`), para que coincida pixel a pixel con la página renderizada. `BlockEditor` recibe el `title` del post.
- El editor se movió de `/admin/editor?post=<id>` (pestaña aparte) a `/admin/posts/[id]/editor`, dentro del grupo `(protected)`: conserva el sidebar/topbar del dashboard y se navega en la misma página. El botón pasó a ser un enlace normal (sin `target="_blank"`).
- `app/(backend)/editor/block-editor.tsx`, `app/(backend)/admin/(protected)/posts/[id]/{page.tsx,editor/page.tsx,editor/actions.ts}`: `/admin/posts/[id]` ahora es la pantalla unificada de edición, con encabezado bajo la barra del panel, pestañas **Configuración**/**Bloques** y guardado conjunto de bloques + metadatos básicos. `/admin/posts/[id]/editor` queda como redirección legacy. `README.md` y `TEST.md` documentan el nuevo flujo.
- `app/(backend)/layout.tsx` y `globals.css`: simplificados (sin fuentes Geist ni modo oscuro por defecto).
- README sección 3 (Arquitectura): actualizada para reflejar que `core/`, `db/`, `prisma/` y `components/` viven dentro de `app/(backend)/` (route group del panel admin), dejando `app/(frontend)/` reservado para el futuro sitio público.

#### Fixed

- `app/(backend)/core/auth/session.ts`: `base64UrlDecode` devolvía `Uint8Array<ArrayBufferLike>`, incompatible con `BufferSource` esperado por `crypto.subtle.verify` en TS 5.7+; ahora usa `Uint8Array.from(...)`.
- Comando de seed fallaba con `ERR_MODULE_NOT_FOUND`: el `prisma.seed` de `package.json` (`tsx "app/(backend)/prisma/seed.ts"`) pasaba las comillas de forma literal a `tsx`, que buscaba un archivo llamado `"app\(backend)\...seed.ts"` (con comillas). Resuelto al definir el comando en `prisma.config.ts` sin comillas.
