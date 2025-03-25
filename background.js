// Script de fondo que gestiona la comunicación entre componentes
console.log('Background script cargado');

// Escuchar mensajes del popup y content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensaje recibido en background:', message);
  
  // Simplemente reenviar los mensajes al popup (comunicación entre content.js y popup.js)
  if (message.action === 'extractionComplete') {
    chrome.runtime.sendMessage(message);
  }
  
  // Mantener la conexión abierta para respuestas asíncronas
  return true;
});