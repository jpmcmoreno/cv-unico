// Modo simulado: respuestas pregrabadas elegidas por palabras clave.
// Se usa mientras el proxy de DeepSeek no esté conectado, y la página lo dice claramente.

const TEMAS = [
  {
    claves: ["hola", "buenas", "buenos dias", "hey", "saludos"],
    texto: "¡Hola! Soy el asistente del CV de Juan Pablo. Puedes preguntarme por su experiencia, sus estudios, lo que sabe hacer o cómo contactarlo.",
  },
  {
    claves: ["contact", "correo", "email", "escribir", "contratar", "entrevista", "linkedin", "telefono"],
    texto: "Lo puedes contactar por correo en jpmcmoreno@gmail.com. Está en Bogotá, Colombia. En su CV en PDF están los demás datos.",
  },
  {
    claves: ["risk", "actual", "noticia", "scrap", "automatiz", "trabaja ahora", "trabajo actual"],
    texto: "Desde agosto de 2025 Juan Pablo es Asistente de Datos Junior en Risk Consulting Global Group. Allí construyó una automatización en Python que recolecta noticias con web scraping y consumo de una API externa, desplegada en la plataforma interna de la empresa.",
  },
  {
    claves: ["claro", "fuga", "permanencia", "people", "practica", "liderazgo"],
    texto: "En Claro Colombia fue practicante de People Analytics (febrero a julio de 2024). Hizo un modelo de fuga de empleados con 70 % de precisión, uno de permanencia en meses, un clustering de perfiles de liderazgo, y redujo la ejecución de los scripts de un mes a una semana.",
  },
  {
    claves: ["llm", "inteligencia artificial", " ia ", "ia?", "chatgpt", "deepseek", "generativa", "api"],
    texto: "Ha usado LLMs en trabajo real: en Claro los aplicó para clasificar respuestas abiertas de encuestas de satisfacción, y en Risk Consulting integró el consumo de una API en su automatización de noticias. Este mismo chat es una muestra de cómo arma un servicio sobre la API de un LLM.",
  },
  {
    claves: ["machine learning", "modelo", "regresion", "clasific", "cluster", " ml ", "datos"],
    texto: "Tiene experiencia práctica con regresión, clasificación y clustering usando Pandas, NumPy y Scikit-learn. En la página principal hay una demo interactiva de cada uno, con los modelos escritos desde cero.",
  },
  {
    claves: ["estudi", "universidad", "carrera", "matematic", "ingenier", "educacion", "titulo", "grado"],
    texto: "Es matemático de la Fundación Universitaria Konrad Lorenz (2024), graduado con Mención de Honor, y actualmente estudia Ingeniería Industrial en UNIMINUTO. Participó tres años en la Maratón Nacional de Programación.",
  },
  {
    claves: ["habilidad", "sabe", "python", "sql", "java", "tecnolog", "herramienta", "stack", "lenguaje"],
    texto: "Lenguajes: Python, SQL y Java. Datos y ML: Pandas, NumPy, Scikit-learn. IA y automatización: LLMs, APIs REST y web scraping. Herramientas: Streamlit, Power BI, Git y LaTeX.",
  },
  {
    claves: ["docente", "profesor", "ensen", "monitor", "euclides", "streamlit", "voluntari"],
    texto: "Fue docente voluntario de Matemáticas en la Konrad Lorenz en 2025, donde creó herramientas interactivas en Streamlit sobre geometría euclidiana, y antes monitor de Lógica Matemática y de Fundamentos de Programación.",
  },
  {
    claves: ["experiencia", "trayectoria", "ha hecho", "quien es", "perfil", "resumen", "cuentame"],
    texto: "Juan Pablo es matemático y desarrollador Python enfocado en datos e IA. Hoy automatiza la recolección de noticias en Risk Consulting Global Group; antes hizo modelos de fuga, permanencia y clustering en Claro Colombia, y ha sido docente y monitor en la Konrad Lorenz.",
  },
  {
    claves: ["como funciona", "como estas hecho", "este chat", "esta demo", "simulad", "eres real", "token", "limite"],
    texto: "Ahora mismo estoy en modo simulado: elijo una respuesta pregrabada según las palabras de tu pregunta. Con el backend conectado, la misma interfaz envía la conversación a un proxy que llama a la API de DeepSeek, con tope de 200 tokens por respuesta y 5 preguntas por sesión.",
  },
];

const POR_DEFECTO = "En modo simulado solo tengo respuestas sobre el perfil de Juan Pablo. Prueba con su experiencia, sus estudios, sus habilidades, sus proyectos de machine learning o cómo contactarlo.";

function normalizar(s) {
  return " " + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + " ";
}

// Devuelve la respuesta del tema con más palabras clave presentes en la pregunta.
function respuestaSimulada(pregunta) {
  const p = normalizar(pregunta);
  let mejor = null, puntaje = 0;
  for (const tema of TEMAS) {
    const n = tema.claves.filter((c) => p.includes(c)).length;
    if (n > puntaje) { puntaje = n; mejor = tema; }
  }
  return mejor ? mejor.texto : POR_DEFECTO;
}

if (typeof module !== "undefined") module.exports = { respuestaSimulada };
