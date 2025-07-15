# PCService Frontend

Este proyecto es el frontend de PCService, desarrollado en Angular. A continuación se detallan los pasos para instalar y levantar el proyecto en modo desarrollo.

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión recomendada: 18.x o superior)
- [npm](https://www.npmjs.com/) (se instala junto con Node.js)
- [Angular CLI](https://angular.io/cli) (versión recomendada: 19.x)

Para instalar Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

## Instalación del proyecto

1. Clona el repositorio y navega a la carpeta del frontend:

```bash
git clone <URL_DEL_REPOSITORIO>
cd pcService-frontend
```

2. Instala las dependencias:

```bash
npm install
```

## Levantar el servidor de desarrollo

Para iniciar el servidor de desarrollo y trabajar en local:

```bash
ng serve
```

Por defecto, la aplicación estará disponible en [http://localhost:4200](http://localhost:4200).

## Configuración de proxy (opcional)

Si necesitas consumir APIs del backend en desarrollo, asegúrate de que el archivo `proxy.conf.json` esté correctamente configurado. Puedes iniciar el servidor con proxy así:

```bash
ng serve --proxy-config proxy.conf.json
```

## Comandos útiles

- **Construir el proyecto para producción:**
  ```bash
  ng build --configuration production
  ```
- **Ejecutar pruebas unitarias:**
  ```bash
  ng test
  ```
- **Ejecutar pruebas end-to-end:**
  ```bash
  ng e2e
  ```

## Notas adicionales

- Si tienes problemas con dependencias, prueba a borrar la carpeta `node_modules` y el archivo `package-lock.json`, luego ejecuta `npm install` de nuevo.
- Para personalizar variables de entorno, revisa el archivo `src/environments/environment.ts`.
- El proyecto utiliza [ng2-charts](https://valor-software.com/ng2-charts/) y [Chart.js](https://www.chartjs.org/) para gráficos.

## Estructura recomendada

- `src/app/` - Código fuente principal de la aplicación
- `src/assets/` - Recursos estáticos (imágenes, estilos, etc.)
- `src/environments/` - Configuración de entornos

## Soporte

Para dudas o problemas, contacta con el equipo de desarrollo o abre un issue en el repositorio.
