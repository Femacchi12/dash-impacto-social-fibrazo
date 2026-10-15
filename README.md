# Dashboard de Impacto Social FIBRAZO

Dashboard web para visualizar las instituciones educativas, fundaciones, alumnos y beneficiarios conectados gratuitamente por FIBRAZO.

## Fuente de datos

Google Sheets: `Base_Esc-Fund.` del archivo `Escuelas_Fundaciones_JAC - FIBRAZO`.

## Estructura

- `index.html`: estructura del dashboard.
- `styles.css`: identidad visual FIBRAZO y diseño adaptable.
- `app.js`: datos, filtros, métricas y gráficos.

## Criterios

- Las instituciones educativas y las fundaciones se visualizan por separado.
- Para instituciones educativas se utiliza la métrica `Alumnos conectados`.
- Para fundaciones se utiliza `Beneficiarios registrados`.
- Una fila instalada representa una sede o centro conectado; no necesariamente una institución única.

## Publicación

El sitio está preparado para GitHub Pages desde la rama `main` y la carpeta raíz.


### FO-CHG-037 — Alineación visual corporativa y contraste (15/10/2026)
La guía de estilo FIBRAZO establece verde #43FFA5, negro #000000, gris #58595B, Montserrat para comunicaciones y Poppins en tablas. Se adapta el tratamiento de superficies del Dashboard de Impacto Social a un sistema oscuro de alto contraste: superficies opacas y diferenciadas (#0B110F, #101B15, #14231B, #172820), texto principal blanco, bordes discretos, campos claramente distinguibles y color de marca como acento. La guía de marca documental no define tokens exactos de interfaz; estos fondos son adaptaciones de UI y no nuevos colores oficiales.
Impacto Social: rama independiente feat/brand-solid-contrast-20261015, sin modificar GitHub Pages productivo. Forms: rama feat/forms-map-qa-20261013, estilos de todas las superficies comunes, formularios, filtros, tablas y ventanas emergentes del mapa; se mantienen estados de alerta, leyendas geográficas y colores semánticos cuando su función lo exige. No se modifican datos ni reglas de negocio. Pendiente de aprobación: inspección real en escritorio/móvil, estados de inputs y modales, leyendas/contrastes de gráficos, contraste AA, PWA y login antes de producción.
