document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup cargado');
  
  const statusElement = document.getElementById('status');
  const statusTextElement = document.querySelector('.status-text');
  const resultContainer = document.getElementById('result-container');
  const resultTitle = document.getElementById('result-title');
  const extractedText = document.getElementById('extracted-text');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  
  let extractedData = null; // Para almacenar los datos extraídos
  
  // Función para mostrar mensajes de estado
  function showStatus(message, type = 'info') {
    statusElement.className = `status ${type}`;
    statusTextElement.textContent = message;
    
    // Si es éxito o error, ocultarlo después de un tiempo
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        statusElement.className = 'status';
      }, 5000);
    }
  }
  
  // Verificar si estamos en una página de YouTube y si el content script está disponible
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    if (!currentTab.url.includes('youtube.com/watch')) {
      showStatus('Esta extensión solo funciona en páginas de videos de YouTube', 'error');
      document.querySelectorAll('.actions button').forEach(btn => btn.disabled = true);
      return;
    }
    
    // Verificar que podemos establecer comunicación con el content script
    chrome.tabs.sendMessage(currentTab.id, {action: 'ping'}, function(response) {
      // Manejar el caso donde el content script no responda (probablemente no se ha cargado)
      if (chrome.runtime.lastError) {
        console.log("Error de comunicación:", chrome.runtime.lastError.message);
        showStatus('Por favor, recarga la página o abre una nueva pestaña de YouTube para activar la extensión', 'error');
        document.querySelectorAll('.actions button').forEach(btn => btn.disabled = true);
      }
    });
  });
  
  // Manejar clics en los botones
  document.getElementById('extract-with-timestamps').addEventListener('click', function() {
    extractTranscription(true);
  });
  
  document.getElementById('extract-without-timestamps').addEventListener('click', function() {
    extractTranscription(false);
  });
  
  document.getElementById('extract-description').addEventListener('click', function() {
    extractDescription();
  });
  
  // Botón de copiar al portapapeles
  copyBtn.addEventListener('click', function() {
    if (extractedText.value) {
      navigator.clipboard.writeText(extractedText.value)
        .then(() => {
          showStatus('Contenido copiado al portapapeles', 'success');
        })
        .catch(err => {
          showStatus('Error al copiar: ' + err.message, 'error');
        });
    }
  });
  
  // Botón de descargar
  downloadBtn.addEventListener('click', function() {
    if (extractedData) {
      // Crear un objeto blob para el archivo
      const blob = new Blob([extractedData.text], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      
      // Generar nombre de archivo según el tipo de contenido
      let fileName = '';
      if (extractedData.type === 'transcript') {
        fileName = `${sanitizeFileName(extractedData.title)} - transcripcion${extractedData.withTimestamps ? ' con timestamps' : ''}.txt`;
      } else if (extractedData.type === 'description') {
        fileName = `${sanitizeFileName(extractedData.title)} - descripcion.txt`;
      } else {
        fileName = `contenido-youtube.txt`;
      }
      
      // Crear un enlace temporal y hacer clic en él para descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      showStatus(`Archivo guardado como "${fileName}"`, 'success');
    }
  });
  
  // Función para extraer la transcripción
  function extractTranscription(withTimestamps) {
    // Ocultar el contenedor de resultados si estaba visible
    resultContainer.style.display = 'none';
    
    // Mostrar estado de carga
    showStatus(`Extrayendo transcripción ${withTimestamps ? 'con' : 'sin'} marcas de tiempo...`, 'info');
    
    // Deshabilitar botones mientras se procesa
    document.querySelectorAll('.actions button').forEach(btn => btn.disabled = true);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      try {
        chrome.tabs.sendMessage(
          tabs[0].id, 
          {action: 'extractTranscript', withTimestamps: withTimestamps},
          function(response) {
            // Manejar posibles errores de comunicación
            if (chrome.runtime.lastError) {
              console.log("Error al enviar mensaje:", chrome.runtime.lastError.message);
              showStatus('Error de comunicación. Intenta recargar la página', 'error');
              document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
              return;
            }
            console.log('Respuesta inicial:', response);
          }
        );
      } catch (error) {
        console.error("Error al ejecutar la extracción:", error);
        showStatus(`Error: ${error.message}`, 'error');
        document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
      }
    });
  }
  
  // Función para extraer la descripción
  function extractDescription() {
    // Ocultar el contenedor de resultados si estaba visible
    resultContainer.style.display = 'none';
    
    // Mostrar estado de carga
    showStatus('Extrayendo descripción del video...', 'info');
    
    // Deshabilitar botones mientras se procesa
    document.querySelectorAll('.actions button').forEach(btn => btn.disabled = true);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      try {
        chrome.tabs.sendMessage(
          tabs[0].id, 
          {action: 'extractDescription'},
          function(response) {
            // Manejar posibles errores de comunicación
            if (chrome.runtime.lastError) {
              console.log("Error al enviar mensaje:", chrome.runtime.lastError.message);
              showStatus('Error de comunicación. Intenta recargar la página', 'error');
              document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
              return;
            }
            console.log('Respuesta inicial:', response);
          }
        );
      } catch (error) {
        console.error("Error al ejecutar la extracción:", error);
        showStatus(`Error: ${error.message}`, 'error');
        document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
      }
    });
  }
  
  // Función para sanitizar nombres de archivo
  function sanitizeFileName(name) {
    return name
      .replace(/[\/\\:*?"<>|]/g, '_') // Reemplazar caracteres no válidos para nombres de archivo
      .substring(0, 100); // Limitar longitud
  }
  
  // Escuchar mensajes del content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensaje recibido en popup:', message);
    
    // Habilitar botones nuevamente
    document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
    
    if (message.action === 'extractionComplete') {
      if (message.success) {
        // Guardar los datos extraídos
        extractedData = message.data;
        
        // Configurar el título según el tipo de contenido
        if (message.type === 'transcript' || extractedData.type === 'transcript') {
          resultTitle.textContent = `Transcripción${extractedData.withTimestamps ? ' con marcas de tiempo' : ''}`;
        } else if (message.type === 'description' || extractedData.type === 'description') {
          resultTitle.textContent = 'Descripción del video';
        } else {
          resultTitle.textContent = 'Contenido extraído';
        }
        
        // Mostrar la transcripción/descripción en el textarea
        extractedText.value = extractedData.text;
        
        // Mostrar el contenedor de resultados
        resultContainer.style.display = 'flex';
        
        // Mostrar mensaje de éxito
        showStatus(`${resultTitle.textContent} extraída con éxito`, 'success');
      } else {
        showStatus(`Error: ${message.error || 'No se pudo extraer el contenido'}`, 'error');
      }
    }
  });
});