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

## SO-CHG-013 · Sección Socializadores (25/11/2026)

La navegación del Dashboard Impacto Social suma «Socializadores» junto a «Más info». La vista es responsive, con identidad visual FIBRAZO, mensaje de bienvenida y motivación basado en el documento corporativo [Presentación Socializadores de Fibrazo](https://docs.google.com/document/d/18gdoFjrbglN2UFnXB5azTGk6kSwjWX7jFl-R2P0SAIM/edit), enlace directo al formulario [Impacto Social](https://fibrazo-forms.vercel.app/form/impacto-social), y tutorial desplegable que explica el uso del chat y Portal Mi Fibrazo para consultas, novedades y cambio de contraseña. El chat puede derivar al portal; el cambio de contraseña se efectúa en el portal después de iniciar sesión. No se inventan enlaces de acceso, tiempos de soporte ni pasos de interfaz no documentados.

No se modifican los datos del dashboard, las métricas ni el acceso existente. Archivos: `index.html`, `app-v61.js`, `styles-v48.css`. Pruebas técnicas JS y presencia de vista/estilos realizadas; quedan pendientes verificación de publicación GitHub Pages y QA móvil autenticada.
