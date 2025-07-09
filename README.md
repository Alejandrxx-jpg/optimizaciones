# Optimizaciones

Aplicación de escritorio para Windows desarrollada con **Electron** y **React** (Vite).

## Requisitos
- Node.js 18 o superior

## Desarrollo

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   Esto abrirá una ventana de Electron y recargará los cambios automáticamente.

## Empaquetar

Para generar el instalador ejecuta:
```bash
npm run build
```
El resultado se encontrará en la carpeta `dist`.

## Scripts de optimización

Coloca tus scripts `.bat` o `.reg` en la carpeta `scripts`. Cada botón de la interfaz ejecuta uno de estos scripts.

## Licencias

Las claves válidas se definen en el archivo `license.txt`. Cada licencia cuenta con **3 usos**. La aplicación guarda los usos restantes en la carpeta de datos de usuario de Electron. Cuando se agotan los usos, los botones de optimización se deshabilitan.

## Estructura del proyecto

- `electron/` – código principal de Electron.
- `src/` – aplicación React.
- `scripts/` – scripts de Windows que se ejecutan desde la interfaz.

## Notas

Este proyecto está preparado para futuras actualizaciones o suscripciones integrando nuevos módulos en `src` y la lógica correspondiente en `electron/main.js`.
