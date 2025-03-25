// Script principal que se inyecta en las páginas de YouTube
console.log('YT Data Extractor: Content script cargado');

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Mensaje recibido en content script:', request);
  
  // Responder al ping para verificar que el content script está cargado
  if (request.action === 'ping') {
    sendResponse({ status: 'ready' });
    return true;
  }
  
  if (request.action === 'extractTranscript') {
    try {
      sendResponse({ status: 'iniciando' });
      const result = await extractTranscript(request.withTimestamps);
      chrome.runtime.sendMessage({ 
        action: 'extractionComplete', 
        success: true, 
        data: result,
        type: 'transcript'
      });
    } catch (error) {
      console.error('Error en la extracción de transcripción:', error);
      chrome.runtime.sendMessage({ 
        action: 'extractionComplete', 
        success: false, 
        error: error.message || 'Error desconocido',
        type: 'transcript'
      });
    }
  } 
  else if (request.action === 'extractDescription') {
    try {
      sendResponse({ status: 'iniciando' });
      const result = await extractDescription();
      chrome.runtime.sendMessage({ 
        action: 'extractionComplete', 
        success: true, 
        data: result,
        type: 'description'
      });
    } catch (error) {
      console.error('Error en la extracción de descripción:', error);
      chrome.runtime.sendMessage({ 
        action: 'extractionComplete', 
        success: false, 
        error: error.message || 'Error desconocido',
        type: 'description'
      });
    }
  }
  
  // Esto es importante para que la conexión se mantenga abierta para la respuesta asíncrona
  return true;
});

// Función para obtener el título del vídeo
function getVideoTitle() {
  // Intentamos varias posibles ubicaciones del título
  const titleElements = [
    document.querySelector('yt-formatted-string.ytd-watch-metadata[force-default-style]'),
    document.querySelector('h1.title yt-formatted-string'),
    document.querySelector('h1 .ytd-video-primary-info-renderer'),
    document.querySelector('h1.ytd-video-primary-info-renderer')
  ];
  
  for (const element of titleElements) {
    if (element && element.textContent.trim()) {
      return element.textContent.trim();
    }
  }
  
  // Si no encontramos el título, devolvemos un valor por defecto
  return 'Video de YouTube';
}

// Función para extraer la descripción del vídeo
async function extractDescription() {
  console.log('Iniciando extracción de descripción...');
  
  // 1. Verificar si estamos en una página de video de YouTube
  if (!window.location.href.includes('youtube.com/watch')) {
    throw new Error('Esta función solo está disponible en páginas de videos de YouTube');
  }
  
  // 2. Obtener el título del vídeo
  const videoTitle = getVideoTitle();
  console.log('Título del vídeo:', videoTitle);
  
  // 3. Obtener la descripción
  // Hay varias posibles ubicaciones para la descripción
  let descriptionText = '';
  
  // Intentamos varias posibles ubicaciones de la descripción
  const descriptionElements = [
    document.querySelector('ytd-text-inline-expander yt-attributed-string'),
    document.querySelector('#description-inline-expander'),
    document.querySelector('#description ytd-expandable-video-description-body-renderer'),
    document.querySelector('#bottom-row .content')
  ];
  
  for (const element of descriptionElements) {
    if (element) {
      // Si es un elemento ytd-text-inline-expander
      if (element.tagName === 'YTD-TEXT-INLINE-EXPANDER') {
        // Intentar hacer clic en el botón "más" si está cerrado
        const expandButton = element.querySelector('tp-yt-paper-button#expand');
        if (expandButton && window.getComputedStyle(expandButton).display !== 'none') {
          try {
            expandButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.warn('No se pudo expandir la descripción:', error);
          }
        }
      }
      
      // Obtener el texto
      descriptionText = element.innerText || element.textContent;
      if (descriptionText && descriptionText.trim()) {
        break;
      }
    }
  }
  
  // Si aún no tenemos la descripción, intentamos métodos más agresivos
  if (!descriptionText || !descriptionText.trim()) {
    // Intentar obtener todo el contenido del área de descripción
    const descArea = document.querySelector('#description, #description-inline-expander, ytd-expandable-video-description-body-renderer');
    if (descArea) {
      descriptionText = descArea.innerText || descArea.textContent;
    }
  }
  
  // Limpiar la descripción
  if (descriptionText) {
    // Eliminar posibles duplicados de "Mostrar más" o "Mostrar menos"
    descriptionText = descriptionText
      .replace(/(\r\n|\n|\r)/gm, "\n") // Normalizar saltos de línea
      .replace(/Mostrar más/g, '')
      .replace(/Mostrar menos/g, '')
      .replace(/...más/g, '')
      .replace(/\s{3,}/g, '\n\n') // Reducir múltiples espacios
      .trim();
  } else {
    descriptionText = 'No se pudo extraer la descripción del vídeo.';
  }
  
  console.log('Descripción extraída con éxito');
  
  return {
    text: descriptionText,
    title: videoTitle,
    type: 'description'
  };
}

// Función principal para extraer la transcripción
async function extractTranscript(withTimestamps) {
  // Función de utilidad para esperar
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Función de utilidad para hacer clic en un elemento de manera segura
  const safeClick = async (element, description) => {
    if (!element) {
      throw new Error(`No se encontró el elemento: ${description}`);
    }
    
    try {
      element.click();
      console.log(`Clic exitoso en: ${description}`);
      // Esperar para que la UI responda
      await sleep(1000);
      return true;
    } catch (error) {
      console.error(`Error al hacer clic en ${description}:`, error);
      throw new Error(`Error al hacer clic en ${description}: ${error.message}`);
    }
  };
  
  console.log('Iniciando extracción de transcripción...');
  console.log('Con marcas de tiempo:', withTimestamps);
  
  // 1. Verificar si estamos en una página de video de YouTube
  if (!window.location.href.includes('youtube.com/watch')) {
    throw new Error('Esta función solo está disponible en páginas de videos de YouTube');
  }
  
  // 2. Obtener el título del vídeo
  const videoTitle = getVideoTitle();
  console.log('Título del vídeo:', videoTitle);
  
  // 3. Buscar el menú de tres puntos o la sección de transcripción
  let transcriptionPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]');
  let transcriptionOpen = false;
  
  // Si el panel de transcripción no está abierto, tenemos que abrirlo
  if (!transcriptionPanel) {
    console.log('El panel de transcripción no está abierto, intentando abrirlo...');
    
    // 3.1 Buscar primero el botón "...más" si está presente
    const expandButton = document.querySelector('tp-yt-paper-button#expand');
    if (expandButton) {
      console.log('Botón "...más" encontrado, haciendo clic...');
      await safeClick(expandButton, 'botón "...más"');
      await sleep(1000);
    }
    
    // 3.2 Buscar botones de transcripción o la sección de transcripción
    
    // Primero intentamos con botones de transcripción en la descripción
    let transcriptSection = document.querySelector('ytd-video-description-transcript-section-renderer');
    if (transcriptSection) {
      const transcriptButton = transcriptSection.querySelector('button');
      if (transcriptButton) {
        console.log('Botón de transcripción encontrado en la sección de descripción, haciendo clic...');
        await safeClick(transcriptButton, 'botón de transcripción en descripción');
        await sleep(1500);
        transcriptionOpen = true;
      }
    }
    
    // Si no encontramos en la descripción, buscamos otros lugares
    if (!transcriptionOpen) {
      // Intentar con los botones debajo del video
      const transcriptButton = Array.from(document.querySelectorAll('button'))
        .find(button => {
          const text = button.textContent.toLowerCase();
          return text.includes('transcripción') || text.includes('transcript');
        });
      
      if (transcriptButton) {
        console.log('Botón de transcripción encontrado, haciendo clic...');
        await safeClick(transcriptButton, 'botón de transcripción');
        await sleep(1500);
        transcriptionOpen = true;
      } else {
        // Buscar en el menú de tres puntos
        const menuButtons = Array.from(document.querySelectorAll('button'))
          .filter(button => {
            const svg = button.querySelector('svg');
            if (svg) {
              const path = svg.querySelector('path');
              return path && path.getAttribute('d') && (
                path.getAttribute('d').includes('M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5') ||
                path.getAttribute('d').includes('M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2')
              );
            }
            return false;
          });
        
        if (menuButtons.length > 0) {
          console.log('Botón de menú encontrado, haciendo clic...');
          await safeClick(menuButtons[0], 'botón de menú');
          await sleep(1000);
          
          const menuItems = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item'));
          const transcriptMenuItem = menuItems.find(item => {
            const text = item.textContent.toLowerCase();
            return text.includes('transcripción') || text.includes('transcript');
          });
          
          if (transcriptMenuItem) {
            console.log('Opción de transcripción encontrada en el menú, haciendo clic...');
            await safeClick(transcriptMenuItem, 'opción de transcripción en menú');
            await sleep(1500);
            transcriptionOpen = true;
          }
        }
      }
    }
    
    // Si todavía no hemos abierto la transcripción, probamos con el botón en la sección de información
    if (!transcriptionOpen) {
      const infoButtons = Array.from(document.querySelectorAll('#below ytd-button-renderer, #bottom-row ytd-button-renderer, #meta ytd-button-renderer'));
      const transcriptInfoButton = infoButtons.find(button => {
        const text = button.textContent.toLowerCase();
        return text.includes('transcripción') || text.includes('transcript');
      });
      
      if (transcriptInfoButton) {
        console.log('Botón de transcripción encontrado en la sección inferior, haciendo clic...');
        await safeClick(transcriptInfoButton, 'botón de transcripción en la sección inferior');
        await sleep(1500);
        transcriptionOpen = true;
      } else {
        throw new Error('No se pudo encontrar la opción de transcripción. Es posible que el video no tenga transcripción disponible.');
      }
    }
  } else {
    console.log('El panel de transcripción ya está abierto');
    transcriptionOpen = true;
  }
  
  // 4. Verificar que el panel de transcripción esté abierto
  transcriptionPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]');
  if (!transcriptionPanel) {
    throw new Error('No se pudo abrir el panel de transcripción');
  }
  
  // 5. Si no queremos timestamps, hacer clic en el menú para desactivarlos
  if (!withTimestamps) {
    console.log('Intentando desactivar las marcas de tiempo...');
    
    // Buscar botón de menú en el panel de transcripción
    const transcriptMenuButton = transcriptionPanel.querySelector('ytd-menu-renderer yt-icon-button#button, ytd-menu-renderer button');
    
    if (transcriptMenuButton) {
      console.log('Botón de menú de transcripción encontrado, haciendo clic...');
      await safeClick(transcriptMenuButton, 'botón de menú de transcripción');
      await sleep(800);
      
      // Buscar la opción para activar/desactivar timestamps
      const timestampToggleItems = Array.from(document.querySelectorAll('tp-yt-paper-item, ytd-menu-service-item-renderer'));
      const timestampToggle = timestampToggleItems.find(item => {
        const text = item.textContent.toLowerCase();
        return text.includes('activar/desactivar marcas de tiempo') || 
               text.includes('toggle timestamps');
      });
      
      if (timestampToggle) {
        console.log('Opción de activar/desactivar marcas de tiempo encontrada, haciendo clic...');
        await safeClick(timestampToggle, 'opción de activar/desactivar marcas de tiempo');
        await sleep(800);
      } else {
        console.warn('No se encontró la opción para desactivar marcas de tiempo');
      }
    } else {
      console.warn('No se encontró el botón de menú en el panel de transcripción');
    }
  }
  
  // 6. Extraer la transcripción
  console.log('Extrayendo texto de la transcripción...');
  await sleep(500); // Asegurar que todo está cargado
  
  // Buscar los segmentos de transcripción
  const transcriptSegments = transcriptionPanel.querySelectorAll('ytd-transcript-segment-renderer');
  
  if (transcriptSegments.length === 0) {
    throw new Error('No se encontraron segmentos de transcripción');
  }
  
  console.log(`Se encontraron ${transcriptSegments.length} segmentos de transcripción`);
  
  let transcriptionText = '';
  
  // Extraer el texto según el formato deseado
  transcriptSegments.forEach(segment => {
    if (withTimestamps) {
      const timestamp = segment.querySelector('.segment-timestamp')?.textContent?.trim();
      const text = segment.querySelector('.segment-text')?.textContent?.trim();
      
      if (timestamp && text) {
        transcriptionText += `[${timestamp}] ${text}\n`;
      }
    } else {
      const text = segment.querySelector('.segment-text')?.textContent?.trim();
      
      if (text) {
        transcriptionText += `${text} `;
      }
    }
  });
  
  // 7. Formatear texto para la versión sin timestamps
  if (!withTimestamps) {
    // Dividir en párrafos cada cierto número de palabras para mejor legibilidad
    const words = transcriptionText.split(' ');
    let formattedText = '';
    const wordsPerParagraph = 30;
    
    for (let i = 0; i < words.length; i += wordsPerParagraph) {
      formattedText += words.slice(i, i + wordsPerParagraph).join(' ') + '\n\n';
    }
    
    transcriptionText = formattedText;
  }
  
  console.log('Extracción completada con éxito');
  
  // 8. Devolver el resultado
  return {
    text: transcriptionText,
    title: videoTitle,
    withTimestamps: withTimestamps,
    type: 'transcript'
  };
}