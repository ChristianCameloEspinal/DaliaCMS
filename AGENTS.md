# AGENTS.md

Instrucciones para agentes de IA (Claude Code, Copilot, Cursor, etc.) que trabajen en este repositorio.

---

## Reglas obligatorias

- Si te pregunto algo nunca ejecutes ni modifiques nada, solo analiza y responde. las preguntas suele estructurse así - Podría, como hago para, para que es, de que forma puedo, es posible que, como harías que, puedo hacer entre otras estructuras, notese el caracter de duda. Es imperativo seguir esta regla cada vez que el usuario pregunte algo, si debes ejecutar algo para arreglarlo debes preguntar.
- Antes de leer cualquier fichero verifica que no tengas la información en `CHANGELOG.md` o `README.md`
- Ignorar: <!-- - No hagas tu los test cada que haces algo, debes usar jest y dejar ficheros definidos para yo hacer los test, y adjuntar un archivo `TEST.md` que defina los test y me explique como usarlos. -->

### CHANGELOG.md
- **Siempre** que se realice cualquier cambio en el código — nueva funcionalidad, corrección de bug, refactor, ajuste de estilos, cambio de dependencias, modificación de configuración — debes actualizar `CHANGELOG.md` antes de terminar la tarea.
- Usa el formato `[YYYY-MM-DD]` para la fecha de cada entrada.
- Agrupa los cambios bajo las categorías: `Added`, `Changed`, `Fixed`, `Removed`.
- Coloca las entradas más recientes al inicio del archivo, debajo del encabezado `## [Unreleased]` si el cambio aún no tiene versión asignada.
- No omitas este paso aunque el cambio parezca menor.
- Has referencia a los ficheros que modificaste y porque de forma breve.

### README.md
- El `README.md` funciona como el **Software Design Document (SDD)** del proyecto.
- Actualízalo cuando:
  - Se añada una nueva página o ruta 
  - Se cree o elimine un componente relevante
  - Cambien las dependencias principales
  - Se modifique la arquitectura de carpetas.
- Mantén las secciones existentes del SDD; no las borres ni las reordenes sin justificación.
- Escribe en español, con claridad técnica suficiente para que un desarrollador nuevo entienda el sistema sin ver el código.

## Convenciones de código

- Componentes de servidor por defecto; usar `'use client'` solo cuando se necesite interactividad o hooks del browser.
- Nombrado de archivos: `kebab-case` para páginas, `PascalCase` para componentes exportados.
- Añadir breves comentarios que expliquen *qué* hace el código cuando sea complejo; solo comentar *por qué* cuando el motivo no sea evidente.
- Debes evitar la sobreingenieria, es decir, cuando vayas a escribir o modificar codigo debes basarte en el principio de simplicidad, lectura y escalabilidad, si es codigo complejo que se puede resolver en menos lineas, hazlo, si resolver ese codigo complejo en menos lineas modifica la arquitectura del sistema, pregunta antes de ejecutar los cambios.

---

## Checklist antes de terminar cualquier tarea

- [ ] El código compila sin errores de TypeScript (`pnpm build`).
- [ ] `CHANGELOG.md` actualizado con la entrada correspondiente.
- [ ] `README.md` actualizado si hubo cambios estructurales.
- [ ] No se introdujeron dependencias nuevas sin documentarlas en `README.md > Dependencias`.
