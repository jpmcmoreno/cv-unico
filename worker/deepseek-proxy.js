// Proxy del chatbot para Cloudflare Workers.
//
// El navegador le habla a este Worker y el Worker le habla a DeepSeek.
// La llave de la API vive aquí como secreto y nunca llega al navegador.
//
// Variables del Worker (Settings -> Variables and Secrets):
//   DEEPSEEK_API_KEY  (secreto, obligatorio)  tu llave de DeepSeek
//   ALLOWED_ORIGIN    (texto, recomendado)    p. ej. https://tu-usuario.github.io
//   DEEPSEEK_MODEL    (texto, opcional)       por defecto "deepseek-flash"

const MAX_PREGUNTAS = 5;      // 5 preguntas + 5 respuestas = 10 líneas
const MAX_CARACTERES = 400;   // por mensaje del visitante
const MAX_TOKENS = 200;       // por respuesta del modelo

const SISTEMA = `Eres el asistente del CV de Juan Pablo Moreno Cadena. Respondes preguntas de
reclutadores sobre su perfil, en español, con tono cercano y profesional, en máximo 90 palabras.
Usa solo los datos de abajo. Si te preguntan algo que no está aquí, di que no tienes ese dato y
sugiere escribirle a su correo. No inventes cifras, fechas ni empresas. Si te piden otra cosa
(tareas, código, temas ajenos), explica con amabilidad que solo respondes sobre el perfil de Juan Pablo.

PERFIL
- Matemático y desarrollador Python enfocado en datos e IA. Vive en Bogotá, Colombia.
- Contacto: jpmcmoreno@gmail.com

EXPERIENCIA
- Risk Consulting Global Group, Asistente de Datos Junior (agosto 2025 - actualidad): construyó una
  automatización en Python, desplegada en la plataforma interna, que recolecta noticias con web
  scraping y consumo de una API externa.
- Fundación Universitaria Konrad Lorenz, Docente Voluntario de Matemáticas (febrero - mayo 2025):
  herramientas didácticas interactivas en Python con Streamlit; material sobre geometría euclidiana,
  LaTeX y teoría de números.
- Claro Colombia, Practicante de Analítica de Datos en People Analytics (febrero - julio 2024):
  modelo de fuga de empleados con 70 % de precisión; modelo de permanencia en meses; clustering de
  perfiles de liderazgo; LLMs para clasificar respuestas abiertas de encuestas; optimizó los scripts
  de los modelos de un mes a una semana de ejecución.
- Konrad Lorenz, Monitor de Lógica Matemática y de Fundamentos de Programación en Java (2022).

EDUCACIÓN
- Matemáticas, Fundación Universitaria Konrad Lorenz (2024), Mención de Honor.
- Ingeniería Industrial, Corporación Universitaria Minuto de Dios (en curso).
- Maratón Nacional de Programación 2021, 2022 y 2023.

HABILIDADES
- Python, SQL, Java. Pandas, NumPy, Scikit-learn. LLMs, APIs REST, web scraping.
- Streamlit, Power BI, Git, LaTeX.

PROYECTOS
- Trabajo de grado: página web para entrenar competencias de programación.
- Apps interactivas sobre proposiciones de Euclides.
- Este CV con demos en vivo: chatbot, regresión, clasificación, clustering, scraping y Euclides.`;

function cabecerasCors(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(env, cuerpo, status = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cabecerasCors(env) },
  });
}

// Valida y recorta la conversación. Devuelve { mensajes } o { error }.
export function limpiar(cuerpo) {
  const crudos = cuerpo && Array.isArray(cuerpo.messages) ? cuerpo.messages : null;
  if (!crudos || crudos.length === 0) return { error: "Falta la conversación." };

  const mensajes = [];
  for (const m of crudos) {
    if (!m || typeof m.content !== "string") return { error: "Mensaje inválido." };
    if (m.role !== "user" && m.role !== "assistant") return { error: "Rol inválido." };
    const tope = m.role === "user" ? MAX_CARACTERES : MAX_CARACTERES * 4;
    const content = m.content.slice(0, tope).trim();
    if (!content) return { error: "Mensaje vacío." };
    mensajes.push({ role: m.role, content });
  }
  if (mensajes[mensajes.length - 1].role !== "user") return { error: "Falta la pregunta." };
  const preguntas = mensajes.filter((m) => m.role === "user").length;
  if (preguntas > MAX_PREGUNTAS || mensajes.length > MAX_PREGUNTAS * 2) {
    return { error: "La demo llega hasta 5 preguntas. Reinicia la conversación." };
  }
  return { mensajes };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cabecerasCors(env) });
    }
    if (request.method !== "POST") return json(env, { error: "Usa POST." }, 405);
    if (!env.DEEPSEEK_API_KEY) return json(env, { error: "Falta configurar la llave." }, 500);

    // Si se configuró un origen, solo se atiende a esa página.
    const origen = request.headers.get("Origin");
    if (env.ALLOWED_ORIGIN && origen !== env.ALLOWED_ORIGIN) {
      return json(env, { error: "Origen no permitido." }, 403);
    }

    let cuerpo;
    try { cuerpo = await request.json(); }
    catch { return json(env, { error: "JSON inválido." }, 400); }

    const { mensajes, error } = limpiar(cuerpo);
    if (error) return json(env, { error }, 400);

    let respuesta;
    try {
      respuesta = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.DEEPSEEK_MODEL || "deepseek-flash",
          max_tokens: MAX_TOKENS,
          temperature: 0.5,
          messages: [{ role: "system", content: SISTEMA }, ...mensajes],
        }),
      });
    } catch {
      return json(env, { error: "No se pudo contactar al modelo." }, 502);
    }
    if (!respuesta.ok) return json(env, { error: "El modelo devolvió un error." }, 502);

    const datos = await respuesta.json().catch(() => null);
    const reply = datos?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return json(env, { error: "Respuesta vacía del modelo." }, 502);
    }
    return json(env, { reply: reply.trim() });
  },
};
