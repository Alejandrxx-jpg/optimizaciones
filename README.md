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
Puedes habilitar o deshabilitar scripts desde la sección **Configuración** mediante sencillas casillas de verificación.

## Licencias

Las claves válidas se definen en el archivo `license.txt`. Cada licencia cuenta con **3 usos**. La aplicación guarda los usos restantes de forma cifrada en la carpeta de datos de usuario de Electron. Cuando se agotan los usos, los botones de optimización se deshabilitan.
Para restablecer la licencia accede a la sección **Licencia** y utiliza la opción *Reiniciar licencia*.

## Estructura del proyecto

- `electron/` – código principal de Electron.
- `src/` – aplicación React.
- `scripts/` – scripts de Windows que se ejecutan desde la interfaz.

## Notas

Este proyecto está preparado para futuras actualizaciones automáticas mediante `electron-updater` y para integrar pagos o suscripciones (por ejemplo con Stripe). En `electron/main.js` encontrarás comentarios que indican dónde incorporar dicha funcionalidad.

## Preguntas frecuentes

### ¿Cómo modifico la lista de scripts?
Agrega o elimina archivos en la carpeta `scripts` y activa los que desees en la sección **Configuración**.

### ¿Dónde se almacena la licencia?
En la carpeta de usuario de Electron (`app.getPath('userData')`), dentro del archivo `.usage.enc` cifrado.

### ¿Qué hacer si aparece un error al ejecutar un script?
Consulta el archivo `log.txt` en la misma carpeta de usuario para obtener detalles y verificar que el script exista y tenga permisos de ejecución.
