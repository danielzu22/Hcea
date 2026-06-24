module.exports = function (grunt) {
  // Configuración del proyecto
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // 1. Limpiar la carpeta dist antes de cada compilación
    clean: {
      dist: ['dist/*']
    },

    // 2. Compilar SASS a CSS
    sass: {
      dist: {
        options: {
          style: 'expanded' // Puede ser 'compressed' para producción
        },
        files: {
          'dist/css/main.css': 'src/scss/main.scss'
        }
      }
    },

    // 3. Unir parciales HTML con Bake
    bake: {
      dist: {
        files: {
          'dist/index.html': 'src/index.html'
        }
      }
    },

    // 4. Copiar recursos estáticos (imágenes, fuentes, iconos, js) a dist
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: [
          'images/**', 
          'fonts/**', 
          'icons/**', 
          'js/**'
        ],
        dest: 'dist/'
      }
    },

    // 5. Observar cambios en tiempo real
    watch: {
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['bake']
      },
      assets: {
        files: ['src/images/**', 'src/fonts/**', 'src/icons/**', 'src/js/**'],
        tasks: ['copy']
      }
    }
  });

  // Cargar los plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-bake');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Se pueden cargar minify y uglify en el futuro si los necesitas

  // Definir las tareas
  // Tarea por defecto (ejecutar 'npx grunt')
  grunt.registerTask('default', ['clean', 'sass', 'bake', 'copy', 'watch']);
  
  // Tarea de build (sin watch, solo compilar)
  grunt.registerTask('build', ['clean', 'sass', 'bake', 'copy']);
};
