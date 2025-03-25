# YT Data Extractor

![Icono](icons/icon128.png)

**YT Data Extractor** es una extensión de Chrome que te permite extraer fácilmente transcripciones y descripciones de videos de YouTube.

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Versión](https://img.shields.io/badge/versión-1.2-green.svg)](https://github.com/carlosrodera/yt-data-extractor)

## 🚀 Características

- ✅ **Extracción de transcripciones** con o sin marcas de tiempo
- ✅ **Extracción de descripciones** completas de videos
- ✅ **Interfaz bilingüe** (Español e Inglés)
- ✅ **Modo oscuro** y modo claro
- ✅ **Copiar al portapapeles** con un clic
- ✅ **Descargar como archivo** de texto con nombre del video incluido
- ✅ **Funciona en cualquier video de YouTube** con transcripciones disponibles

## 📋 Requisitos

- Google Chrome, Microsoft Edge, Brave o cualquier navegador basado en Chromium
- YouTube con transcripciones habilitadas para la función de extracción de transcripciones

## 🔧 Instalación

### Método 1: Desde la Chrome Web Store
*(Próximamente)*

### Método 2: Instalación manual (Modo desarrollador)

1. **Descarga** el código fuente:
   ```
   git clone https://github.com/carlosrodera/yt-data-extractor.git
   ```
   
   O descarga el [archivo ZIP](https://github.com/carlosrodera/yt-data-extractor/archive/main.zip) y descomprímelo.

2. **Abre** tu navegador Chrome/Edge/Brave y ve a:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. **Activa** el "Modo desarrollador" en la esquina superior derecha.

4. Haz clic en "**Cargar descomprimida**" y selecciona la carpeta donde descargaste/descomprimiste la extensión.

5. ¡Listo! La extensión debería aparecer en tu barra de herramientas.

## 🎮 Cómo usar

1. **Navega** a cualquier video de YouTube que desees analizar.

2. **Haz clic** en el icono de la extensión en tu barra de herramientas.

3. **Selecciona** una de las opciones:
   - *Transcripción con marcas de tiempo* - Extrae la transcripción incluyendo los timestamps
   - *Transcripción sin marcas de tiempo* - Extrae solo el texto de la transcripción
   - *Extraer descripción* - Obtiene la descripción completa del video

4. Una vez extraídos los datos, puedes:
   - **Copiar** el contenido al portapapeles
   - **Descargar** el contenido como un archivo de texto

## 🧩 Funcionalidades detalladas

### Extracción de transcripciones
- Automáticamente busca y accede a la transcripción del video
- Opción para incluir o excluir las marcas de tiempo
- Formatea el texto para una mejor legibilidad

### Extracción de descripciones
- Obtiene la descripción completa del video, incluso cuando está colapsada
- Limpia automáticamente los textos "Mostrar más" o "Mostrar menos"

### Personalización
- **Cambio de idioma**: Español e Inglés disponibles
- **Cambio de tema**: Modo claro u oscuro

## 🔍 Solución de problemas

- **La extensión no funciona**: Asegúrate de que estás en una página de video de YouTube (`youtube.com/watch`)
- **No se puede extraer la transcripción**: Verifica que el video tenga transcripciones disponibles
- **Transcripción incompleta**: En algunos videos muy largos, YouTube puede limitar la transcripción visible

## 🛠️ Desarrollo y contribución

¿Quieres contribuir al proyecto? ¡Genial!

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Añade nueva característica'`)
5. Push a la rama (`git push origin feature/nueva-caracteristica`)
6. Abre un Pull Request

### Estructura del proyecto
- `manifest.json` - Configuración de la extensión
- `popup.html/js/css` - Interfaz de usuario principal
- `content.js` - Script inyectado en páginas de YouTube
- `background.js` - Servicio en segundo plano
- `translations.js` - Traducciones para Inglés y Español

## 🔒 Privacidad

Esta extensión:
- NO recopila ningún dato personal
- NO envía ninguna información a servidores externos
- NO requiere crear cuentas ni registrarse
- Todo el procesamiento se realiza localmente en tu navegador

## 📜 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE) - ver el archivo para más detalles.

## 👨‍💻 Autor

**Carlos Rodera** - [carlosrodera.com](https://carlosrodera.com)

¿Te gusta esta extensión? Revisa más herramientas en [mi GitHub](https://github.com/carlosrodera).
