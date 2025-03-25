# Configuración de GitHub Actions para YT Data Extractor

Este documento explica cómo configurar un flujo de trabajo básico de GitHub Actions para validar la estructura de la extensión.

## ¿Por qué no se incluyó el archivo de workflow?

Al subir los archivos al repositorio, no se pudo incluir automáticamente el archivo de workflow de GitHub Actions debido a restricciones de seguridad. GitHub requiere permisos especiales (scope `workflow`) en el token de acceso personal para poder subir archivos de workflow.

## Cómo crear el workflow manualmente

1. Ve al repositorio en GitHub: https://github.com/carlosrodera/yt-data-extractor

2. Navega a la pestaña "Actions"

3. Haz clic en "New workflow"

4. Haz clic en "set up a workflow yourself"

5. Reemplaza el contenido del editor con el siguiente código:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Extension Structure
        run: |
          echo "Validating extension structure..."
          test -f manifest.json && echo "✓ manifest.json exists" || exit 1
          test -f popup.html && echo "✓ popup.html exists" || exit 1
          test -f popup.js && echo "✓ popup.js exists" || exit 1
          test -f content.js && echo "✓ content.js exists" || exit 1
          test -f background.js && echo "✓ background.js exists" || exit 1
          test -d icons && echo "✓ icons directory exists" || exit 1
          echo "All validation checks passed!"
```

6. Haz clic en "Start commit"

7. Añade un mensaje de commit: "Añadir workflow de validación básico"

8. Haz clic en "Commit new file"

## Beneficios de este workflow

Este workflow básico:

1. Se ejecuta cada vez que hay un push a la rama `main` o un pull request a `main`
2. Verifica que todos los archivos esenciales de la extensión estén presentes
3. Proporciona un indicador visual de si la estructura de la extensión es válida

## Workflows adicionales que podrías querer añadir

1. **Empaquetado automático**: Para crear automáticamente un archivo .zip de la extensión

2. **Pruebas**: Si en el futuro añades pruebas automatizadas

3. **Publicación**: Para publicar automáticamente en la Chrome Web Store (requiere configuración adicional)
