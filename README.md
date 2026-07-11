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
