// Archivo de traducciones para YT Data Extractor
const translations = {
  es: {
    // Título y encabezados
    extensionTitle: "Extractor de Datos de YouTube",
    selectOption: "Selecciona una opción:",
    transcriptionHeader: "Transcripción",
    descriptionHeader: "Descripción",
    
    // Botones principales
    withTimestamps: "Con marcas de tiempo",
    withoutTimestamps: "Sin marcas de tiempo",
    extractDescription: "Extraer descripción",
    
    // Botones de acciones
    copyButton: "Copiar",
    downloadButton: "Descargar",
    
    // Mensajes de estado
    onlyYouTube: "Esta extensión solo funciona en páginas de videos de YouTube",
    reloadRequired: "Por favor, recarga la página o abre una nueva pestaña de YouTube para activar la extensión",
    extractingWithTimestamps: "Extrayendo transcripción con marcas de tiempo...",
    extractingWithoutTimestamps: "Extrayendo transcripción sin marcas de tiempo...",
    extractingDescription: "Extrayendo descripción del video...",
    copiedToClipboard: "Contenido copiado al portapapeles",
    copiedError: "Error al copiar: ",
    fileSavedAs: "Archivo guardado como ",
    extractionSuccess: " extraída con éxito",
    extractionError: "Error: ",
    communicationError: "Error de comunicación. Intenta recargar la página",
    
    // Títulos de contenido
    transcriptionWithTimestamps: "Transcripción con marcas de tiempo",
    transcriptionWithoutTimestamps: "Transcripción",
    videoDescription: "Descripción del video",
    extractedContent: "Contenido extraído",
    
    // Textos de archivo
    transcript: "transcripcion",
    withTimestampsSuffix: " con timestamps",
    description: "descripcion",
    
    // Selector de idioma
    language: "Idioma:",
    spanish: "Español",
    english: "Inglés"
  },
  en: {
    // Title and headers
    extensionTitle: "YouTube Data Extractor",
    selectOption: "Select an option:",
    transcriptionHeader: "Transcription",
    descriptionHeader: "Description",
    
    // Main buttons
    withTimestamps: "With timestamps",
    withoutTimestamps: "Without timestamps",
    extractDescription: "Extract description",
    
    // Action buttons
    copyButton: "Copy",
    downloadButton: "Download",
    
    // Status messages
    onlyYouTube: "This extension only works on YouTube video pages",
    reloadRequired: "Please reload the page or open a new YouTube tab to activate the extension",
    extractingWithTimestamps: "Extracting transcription with timestamps...",
    extractingWithoutTimestamps: "Extracting transcription without timestamps...",
    extractingDescription: "Extracting video description...",
    copiedToClipboard: "Content copied to clipboard",
    copiedError: "Error copying: ",
    fileSavedAs: "File saved as ",
    extractionSuccess: " successfully extracted",
    extractionError: "Error: ",
    communicationError: "Communication error. Try reloading the page",
    
    // Content titles
    transcriptionWithTimestamps: "Transcription with timestamps",
    transcriptionWithoutTimestamps: "Transcription",
    videoDescription: "Video description",
    extractedContent: "Extracted content",
    
    // File texts
    transcript: "transcript",
    withTimestampsSuffix: " with timestamps",
    description: "description",
    
    // Language selector
    language: "Language:",
    spanish: "Spanish",
    english: "English"
  }
};

// Exportar las traducciones
if (typeof module !== 'undefined') {
  module.exports = translations;
}