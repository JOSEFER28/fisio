# FisioPlay

FisioPlay es una aplicación web interactiva diseñada para ayudar a futuros fisioterapeutas a aprender y mejorar sus habilidades clínicas a través de juegos educativos y seguimiento de progreso.

## Características

- **Quiz Interactivo**: Pon a prueba tus conocimientos de anatomía y fisiología.
- **Seguimiento de Progreso**: Visualiza tus resultados y módulos completados.
- **Interfaz Amigable**: Diseño intuitivo para una experiencia de aprendizaje agradable.

## Estructura del Proyecto

- `index.html`: Página principal de la aplicación.
- `juegos.html`: Contiene los juegos educativos, como el Quiz de Anatomía.
- `estudiante.html`: Panel donde los estudiantes pueden ver su progreso y resultados.
- `main.js`: Lógica principal de la aplicación, incluyendo la inicialización de Firebase, la lógica del quiz y la gestión de resultados.
- `style.css`: Estilos CSS para la interfaz de usuario.

## Configuración y Ejecución

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd FisioPlay
    ```

2.  **Configura Firebase**: Necesitarás una cuenta de Firebase y un proyecto configurado. Obtén tus credenciales de configuración de Firebase y actualiza el archivo `main.js` con tu `firebaseConfig`.

    ```javascript
    const firebaseConfig = {
      apiKey: "TU_API_KEY",
      authDomain: "TU_PROYECTO.firebaseapp.com",
      projectId: "TU_PROYECTO",
      storageBucket: "TU_PROYECTO.appspot.com",
      messagingSenderId: "XXXXXXXXXXX",
      appId: "TU_APP_ID"
    };
    ```

3.  **Abre los archivos HTML**: Simplemente abre `index.html` en tu navegador web. Asegúrate de que `main.js` y `style.css` estén en el mismo directorio o en las rutas correctas.

## Tecnologías Utilizadas

-   HTML5
-   CSS3
-   JavaScript
-   Firebase (Firestore para la base de datos)

## Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor, haz un fork del repositorio y envía un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles. (Si no tienes un archivo LICENSE, puedes crearlo o eliminar esta sección).