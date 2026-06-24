# Hcea - Prototipo de Interfaz

Este proyecto es una maquetación en HTML y CSS (SASS) creada como muestra de funcionamiento para una interfaz de usuario. Utiliza una arquitectura basada en componentes (parciales HTML), metodología BEM y compilación automática mediante Grunt.

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica con sistema de plantillas (Grunt Bake).
- **SASS (SCSS)**: Preprocesador CSS organizado mediante el Patrón 7-1 y metodología BEM.
- **JavaScript**: Lógica de interacción para la interfaz.
- **Grunt**: Automatización de tareas (compilación de SASS, minificación, unión de HTML y recarga automática).

## 📁 Estructura del Proyecto

- `src/` - Código fuente en desarrollo.
  - `scss/` - Archivos de estilos organizados por módulos.
  - `js/` - Scripts para la interactividad de la interfaz.
  - `images/`, `icons/`, `fonts/` - Recursos estáticos, gráficos y tipográficos.
  - `index.html`, `_header.html`, `_footer.html` - Vistas principales y componentes parciales.
- `dist/` *(generado automáticamente)* - Archivos listos y optimizados para producción.

## ⚙️ Instalación y Entorno de Desarrollo

1. **Instalar dependencias**:
   Asegúrate de tener Node.js instalado. Abre la terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

2. **Iniciar el entorno de desarrollo**:
   Para compilar los archivos SCSS, unir los parciales HTML y mantener el proyecto en modo observación (watch) para detectar los cambios en tiempo real:
   ```bash
   npx grunt
   ```

## 🔄 Comandos Rápidos de Git

Cuando termines tu sesión de trabajo o tengas un avance estable:

1. **Prepara tus archivos modificados**:
   ```bash
   git add .
   ```
2. **Guarda el progreso con un mensaje descriptivo**:
   ```bash
   git commit -m "Descripción de la interfaz o componente que trabajé"
   ```
3. **Sube los cambios al repositorio**:
   ```bash
   git push
   ```
