// Configuración del chatbot.
//
// CHAT_API_URL vacío  -> modo simulado: respuestas pregrabadas, sin costo y sin servidor.
// CHAT_API_URL con URL -> modo real: el navegador le habla a tu proxy (worker/deepseek-proxy.js)
//                         y el proxy le habla a DeepSeek con tu llave, que nunca llega al navegador.
//
// Ejemplo: window.CHAT_API_URL = "https://cv-chat.tu-usuario.workers.dev";
window.CHAT_API_URL = "";

// Límites de la demo. El proxy aplica los mismos por su cuenta: estos solo ordenan la interfaz.
window.CHAT_LIMITES = {
  preguntas: 5,        // 5 preguntas + 5 respuestas = 10 líneas de conversación
  caracteres: 400,     // largo máximo de cada pregunta
  lineas: 5,           // líneas máximas por pregunta
};
