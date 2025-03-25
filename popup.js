document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup cargado');
  
  // Elementos de la interfaz
  const statusElement = document.getElementById('status');
  const statusTextElement = document.getElementById('status-text');
  const resultContainer = document.getElementById('result-container');
  const resultTitle = document.getElementById('result-title');
  const extractedText = document.getElementById('extracted-text');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const langSpanish = document.getElementById('lang-es');
  const langEnglish = document.getElementById('lang-en');
  const themeSwitch = document.getElementById('theme-switch');
  const themeIcon = document.getElementById('theme-icon');
  
  // Almacenamiento para los datos extraídos
  let extractedData = null;
  
  // Inicializar el idioma
  let currentLanguage = localStorage.getItem('yt-data-extractor-language') || 'en';
  
  // Inicializar el tema
  let isDarkMode = localStorage.getItem('yt-data-extractor-theme') === 'dark';
  
  // Aplicar el tema inicial
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
    themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    themeSwitch.checked = false;
    themeIcon.textContent = '🌙';
  }
  
  // Resaltar la bandera del idioma activo
  updateActiveFlagStyle();
  
  // Aplicar las traducciones iniciales
  applyTranslations();
  
  // Escuchar clics en las banderas de idioma
  langSpanish.addEventListener('click', function() {
    currentLanguage = 'es';
    localStorage.setItem('yt-data-extractor-language', currentLanguage);
    updateActiveFlagStyle();
    applyTranslations();
  });
  
  langEnglish.addEventListener('click', function() {
    currentLanguage = 'en';
    localStorage.setItem('yt-data-extractor-language', currentLanguage);
    updateActiveFlagStyle();
    applyTranslations();
  });
  
  // Escuchar cambios en el switch de tema
  themeSwitch.addEventListener('change', function() {
    isDarkMode = this.checked;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      themeIcon.textContent = '☀️';
      localStorage.setItem('yt-data-extractor-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.textContent = '🌙';
      localStorage.setItem('yt-data-extractor-theme', 'light');
    }
  });
  
  // Función para actualizar el estilo de las banderas según el idioma activo
  function updateActiveFlagStyle() {
    if (currentLanguage === 'es') {
      langSpanish.classList.add('active');
      langEnglish.classList.remove('active');
    } else {
      langEnglish.classList.add('active');
      langSpanish.classList.remove('active');
    }
  }
  
  // Función para aplicar las traducciones según el idioma seleccionado
  function applyTranslations() {
    const t = translations[currentLanguage];
    
    // Títulos y subtítulos
    document.getElementById('extension-title').textContent = t.extensionTitle;
    document.getElementById('subtitle').textContent = t.selectOption;
    document.getElementById('transcription-section').textContent = t.transcriptionHeader;
    document.getElementById('description-section').textContent = t.descriptionHeader;
    
    // Textos de botones
    document.getElementById('with-timestamps-text').textContent = t.withTimestamps;
    document.getElementById('without-timestamps-text').textContent = t.withoutTimestamps;
    document.getElementById('extract-description-text').textContent = t.extractDescription;
    document.getElementById('copy-text').textContent = t.copyButton;
    document.getElementById('download-text').textContent = t.downloadButton;
    
    // Footer
    document.getElementById('developed-by').textContent = t.developedBy;
    document.getElementById('more-tools').textContent = t.moreTools;
    
    // Si hay un título de resultado activo, actualizarlo también
    if (resultContainer.style.display !== 'none' && extractedData) {
      updateResultTitle();
    }
  }
  
  // Función para actualizar el título del resultado según el tipo de contenido
  function updateResultTitle() {
    const t = translations[currentLanguage];
    
    if (extractedData.type === 'transcript') {
      resultTitle.textContent = extractedData.withTimestamps ? 
        t.transcriptionWithTimestamps : 
        t.transcriptionWithoutTimestamps;
    } else if (extractedData.type === 'description') {
      resultTitle.textContent = t.videoDescription;
    } else {
      resultTitle.textContent = t.extractedContent;
    }
  }
  
  // Función para mostrar mensajes de estado
  function showStatus(messageKey, type = 'info', extraText = '') {
    const t = translations[currentLanguage];
    statusElement.className = `status ${type}`;
    statusTextElement.textContent = t[messageKey] + extraText;
    
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
      showStatus('onlyYouTube', 'error');
      document.querySelectorAll('.actions button').forEach(btn => btn.disabled = true);
      return;
    }
    
    // Verificar que podemos establecer comunicación con el content script
    chrome.tabs.sendMessage(currentTab.id, {action: 'ping'}, function(response) {
      // Manejar el caso donde el content script no responda (probablemente no se ha cargado)
      if (chrome.runtime.lastError) {
        console.log("Error de comunicación:", chrome.runtime.lastError.message);
        showStatus('reloadRequired', 'error');
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
          showStatus('copiedToClipboard', 'success');
        })
        .catch(err => {
          showStatus('copiedError', 'error', err.message);
        });
    }
  });
  
  // Botón de descargar
  downloadBtn.addEventListener('click', function() {
    if (extractedData) {
      // Crear un objeto blob para el archivo
      const blob = new Blob([extractedData.text], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      
      const t = translations[currentLanguage];
      
      // Generar nombre de archivo según el tipo de contenido
      let fileName = '';
      if (extractedData.type === 'transcript') {
        fileName = `${sanitizeFileName(extractedData.title)} - ${t.transcript}${extractedData.withTimestamps ? t.withTimestampsSuffix : ''}.txt`;
      } else if (extractedData.type === 'description') {
        fileName = `${sanitizeFileName(extractedData.title)} - ${t.description}.txt`;
      } else {
        fileName = `${sanitizeFileName(extractedData.title)}.txt`;
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
      
      showStatus('fileSavedAs', 'success', `"${fileName}"`);
    }
  });
  
  // Función para extraer la transcripción
  function extractTranscription(withTimestamps) {
    // Ocultar el contenedor de resultados si estaba visible
    resultContainer.style.display = 'none';
    
    // Mostrar estado de carga
    showStatus(withTimestamps ? 'extractingWithTimestamps' : 'extractingWithoutTimestamps', 'info');
    
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
              showStatus('communicationError', 'error');
              document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
              return;
            }
            console.log('Respuesta inicial:', response);
          }
        );
      } catch (error) {
        console.error("Error al ejecutar la extracción:", error);
        showStatus('extractionError', 'error', error.message);
        document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
      }
    });
  }
  
  // Función para extraer la descripción
  function extractDescription() {
    // Ocultar el contenedor de resultados si estaba visible
    resultContainer.style.display = 'none';
    
    // Mostrar estado de carga
    showStatus('extractingDescription', 'info');
    
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
              showStatus('communicationError', 'error');
              document.querySelectorAll('.actions button').forEach(btn => btn.disabled = false);
              return;
            }
            console.log('Respuesta inicial:', response);
          }
        );
      } catch (error) {
        console.error("Error al ejecutar la extracción:", error);
        showStatus('extractionError', 'error', error.message);
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
        updateResultTitle();
        
        // Mostrar la transcripción/descripción en el textarea
        extractedText.value = extractedData.text;
        
        // Mostrar el contenedor de resultados
        resultContainer.style.display = 'flex';
        
        // Mostrar mensaje de éxito
        const successText = resultTitle.textContent + translations[currentLanguage].extractionSuccess;
        statusElement.className = 'status success';
        statusTextElement.textContent = successText;
        
        setTimeout(() => {
          statusElement.className = 'status';
        }, 5000);
      } else {
        showStatus('extractionError', 'error', message.error || '');
      }
    }
  });
});