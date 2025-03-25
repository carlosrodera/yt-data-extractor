# Instrucciones para hacer público el repositorio YT Data Extractor

Este documento proporciona instrucciones paso a paso para hacer público tu repositorio de YT Data Extractor en GitHub.

## Opciones disponibles

Tienes dos opciones:

1. **Usar el script automatizado** `publish_repo.sh` (recomendado)
2. **Seguir instrucciones manuales** (documentadas a continuación)

## Opción 1: Usar el script automatizado

1. Abre Terminal
2. Navega al directorio del proyecto:
   ```
   cd /Users/carlosrodera/AppCoding/YT\ Data\ Extractor/
   ```
3. Ejecuta el script:
   ```
   ./publish_repo.sh
   ```
4. Sigue las instrucciones en pantalla

## Opción 2: Instrucciones manuales

### Preparación

1. Asegúrate de que todos los cambios estén guardados:
   ```
   git status
   git add .
   git commit -m "Preparación para repositorio público"
   ```

### Crear un nuevo repositorio en GitHub

1. Ve a [GitHub](https://github.com/) e inicia sesión
2. Haz clic en el botón "+" en la esquina superior derecha y selecciona "New repository"
3. Introduce "yt-data-extractor" como nombre del repositorio
4. Añade una descripción: "Extensión de Chrome para extraer transcripciones y descripciones de videos de YouTube"
5. Selecciona "Public" como visibilidad
6. NO inicialices el repositorio con README, .gitignore o licencia
7. Haz clic en "Create repository"

### Conectar y subir el repositorio local

GitHub te mostrará instrucciones después de crear el repositorio. Sigue las instrucciones para "push an existing repository from the command line":

```bash
# Actualiza la URL remota (reemplaza 'TU_USUARIO' con tu nombre de usuario de GitHub)
git remote set-url origin https://github.com/TU_USUARIO/yt-data-extractor.git

# Sube los cambios al repositorio remoto
git push -u origin main
```

Si prefieres usar SSH en lugar de HTTPS:

```bash
# Actualiza la URL remota (reemplaza 'TU_USUARIO' con tu nombre de usuario de GitHub)
git remote set-url origin git@github.com:TU_USUARIO/yt-data-extractor.git

# Sube los cambios al repositorio remoto
git push -u origin main
```

### Configuración adicional en GitHub

1. **Configurar el repositorio**:
   - Ve a `Settings` > `Options`
   - Habilita Issues, Projects y Wiki según tus preferencias

2. **Añadir temas**:
   - Ve a la página principal del repositorio
   - Junto a "About" en el panel derecho, haz clic en el icono de engranaje
   - Añade temas como: youtube, chrome-extension, data-extraction, transcript

3. **Crear un release**:
   - Ve a `Code` > `Releases` > `Create a new release`
   - Selecciona la etiqueta `v1.2`
   - Añade título y descripción
   - Adjunta un archivo ZIP con el código fuente
   - Publica el release

## Verificación

Después de subir el repositorio, verifica:

1. Que el README.md se muestre correctamente
2. Que todos los archivos estén presentes
3. Que el repositorio sea público (visible para todos)

## Solución de problemas comunes

- **Error de autenticación**: Asegúrate de tener credenciales correctas configuradas
  - Para HTTPS: Usa un token de acceso personal en lugar de contraseña
  - Para SSH: Verifica que tu clave SSH esté configurada correctamente

- **Error de permisos**: Asegúrate de ser el propietario del repositorio o tener permisos de escritura

- **Conflictos de fusión**: Si hay conflictos, resuélvelos localmente y luego sube los cambios

## Notas adicionales

- El repositorio público permite a cualquier persona ver, clonar y bifurcar tu código
- Mantén actualizada la documentación para facilitar la contribución de otros desarrolladores
- Responde a issues y pull requests de manera oportuna para mantener una comunidad activa
