// Lógica de la demo de scraping: dos páginas de ejemplo y un extractor
// que entiende la sintaxis de selectores de Scrapy (::text y ::attr(nombre)).

const ESTILO_PAGINA = `
  body { font-family: Georgia, serif; margin: 0; color: #222; }
  header { padding: 14px 18px; color: #fff; }
  header h1 { margin: 0; font-size: 22px; }
  header small { opacity: .8; font-family: sans-serif; }
  main { padding: 6px 18px 18px; }
  h2, h3 { margin: 0 0 4px; font-size: 17px; line-height: 1.25; }
  a { color: inherit; }
  p { margin: 4px 0 0; font-size: 14px; color: #444; }
  .publi { background: #fff7d6; border: 1px dashed #caa; padding: 10px; margin: 12px 0; font-family: sans-serif; font-size: 13px; }
`;

const MEDIOS = [
  {
    nombre: "El Faro Andino",
    dominio: "elfaroandino.example",
    total: 4,
    solucion: {
      item: "article.nota",
      titular: "h2 a::text",
      enlace: "h2 a::attr(href)",
      fecha: "time::attr(datetime)",
      seccion: "span.seccion::text",
    },
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>${ESTILO_PAGINA}
  header { background: #1d3557; }
  article.nota { border-bottom: 1px solid #ddd; padding: 12px 0; }
  .seccion { font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #c1121f; }
  time { font-family: sans-serif; font-size: 12px; color: #777; }
</style>
</head>
<body>
<header>
  <h1>El Faro Andino</h1>
  <small>Medio ficticio para una demo</small>
</header>
<main>
  <article class="nota">
    <span class="seccion">Economía</span>
    <h2><a href="/economia/cosecha-de-cafe-supera-lo-esperado">La cosecha de café supera lo esperado en el Eje Cafetero</a></h2>
    <time datetime="2026-11-12">12 de noviembre de 2026</time>
    <p>Los caficultores reportan una temporada mejor que la anterior.</p>
  </article>
  <article class="nota">
    <span class="seccion">Movilidad</span>
    <h2><a href="/movilidad/nueva-cicloruta-conecta-tres-barrios">Una nueva cicloruta conecta tres barrios del occidente</a></h2>
    <time datetime="2026-11-12">12 de noviembre de 2026</time>
    <p>El tramo tiene cuatro kilómetros y abre este fin de semana.</p>
  </article>
  <aside class="publi">Publicidad · <a href="/promo">Suscríbete por un año</a></aside>
  <article class="nota">
    <span class="seccion">Tecnología</span>
    <h2><a href="/tecnologia/colegios-rurales-estrenan-salas-de-computo">Colegios rurales estrenan salas de cómputo</a></h2>
    <time datetime="2026-11-11">11 de noviembre de 2026</time>
    <p>Doce instituciones recibieron equipos y conexión.</p>
  </article>
  <article class="nota">
    <span class="seccion">Cultura</span>
    <h2><a href="/cultura/feria-del-libro-cierra-con-record-de-visitantes">La feria del libro cierra con récord de visitantes</a></h2>
    <time datetime="2026-11-10">10 de noviembre de 2026</time>
    <p>Los organizadores ya anunciaron las fechas del próximo año.</p>
  </article>
</main>
</body>
</html>`,
  },
  {
    nombre: "Radio Sabana",
    dominio: "radiosabana.example",
    total: 5,
    solucion: {
      item: "ul#ultimas li.item",
      titular: "a.titular::text",
      enlace: "a.titular::attr(href)",
      fecha: "::attr(data-fecha)",
      seccion: "div.meta b::text",
    },
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>${ESTILO_PAGINA}
  body { font-family: Verdana, sans-serif; }
  header { background: #2d6a4f; }
  ul { list-style: none; margin: 0; padding: 0; }
  li.item { padding: 11px 0; border-bottom: 1px dotted #bbb; }
  a.titular { font-size: 15.5px; font-weight: bold; text-decoration: none; }
  .meta { font-size: 12px; color: #666; margin-top: 3px; }
  .meta b { color: #2d6a4f; }
  h3 { margin: 14px 0 2px; font-size: 13px; text-transform: uppercase; color: #666; }
</style>
</head>
<body>
<header>
  <h1>Radio Sabana</h1>
  <small>Medio ficticio para una demo</small>
</header>
<main>
  <h3>Últimas noticias</h3>
  <ul id="ultimas">
    <li class="item" data-fecha="2026-11-13">
      <a class="titular" href="/n/48211">Embalses de la región llegan al 80 % de su capacidad</a>
      <div class="meta"><b>Ambiente</b> · hace 2 horas</div>
    </li>
    <li class="item" data-fecha="2026-11-13">
      <a class="titular" href="/n/48207">Emprendedores locales abren mercado de fin de semana</a>
      <div class="meta"><b>Economía</b> · hace 5 horas</div>
    </li>
    <li class="item" data-fecha="2026-11-12">
      <a class="titular" href="/n/48190">Hospital municipal amplía su servicio de urgencias</a>
      <div class="meta"><b>Salud</b> · ayer</div>
    </li>
    <li class="item" data-fecha="2026-11-12">
      <a class="titular" href="/n/48184">La liga de ciclismo juvenil anuncia su calendario</a>
      <div class="meta"><b>Deportes</b> · ayer</div>
    </li>
    <li class="item" data-fecha="2026-11-11">
      <a class="titular" href="/n/48163">Universidad pública abre cursos gratuitos de programación</a>
      <div class="meta"><b>Educación</b> · hace 2 días</div>
    </li>
  </ul>
  <h3>Lo más escuchado</h3>
  <ul id="populares">
    <li><a class="titular" href="/podcast/12">Pódcast: historias de la sabana</a></li>
  </ul>
</main>
</body>
</html>`,
  },
];

// Separa "h2 a::attr(href)" en { css: "h2 a", modo: "attr", attr: "href" }.
function partirSelector(sel) {
  const s = (sel || "").trim();
  const m = s.match(/^(.*?)::(text|attr\(\s*([^)\s]+)\s*\))$/);
  if (!m) return { css: s, modo: "text", attr: null };
  return { css: m[1].trim(), modo: m[3] ? "attr" : "text", attr: m[3] || null };
}

// Aplica un selector dentro de un nodo y devuelve el primer valor, o null.
// Un selector vacío antes de "::" se refiere al propio nodo, como en Scrapy.
function extraerValor(nodo, sel) {
  if (!(sel || "").trim()) return null;
  const { css, modo, attr } = partirSelector(sel);
  const el = css ? nodo.querySelector(css) : nodo;
  if (!el) return null;
  if (modo === "attr") return el.getAttribute(attr);
  return el.textContent.replace(/\s+/g, " ").trim();
}

// Devuelve { filas, invalidos } donde invalidos lista los campos con sintaxis mala.
function extraerNoticias(doc, sel) {
  const invalidos = [];
  let items = [];
  const selItem = partirSelector(sel.item).css;
  if (selItem) {
    try { items = Array.from(doc.querySelectorAll(selItem)); }
    catch (e) { invalidos.push("item"); }
  }
  const campos = ["titular", "enlace", "fecha", "seccion"];
  // Se valida cada selector una vez, aunque no haya notas donde aplicarlo.
  const validos = {};
  for (const campo of campos) {
    validos[campo] = true;
    const css = partirSelector(sel[campo]).css;
    if (css) {
      try { doc.querySelector(css); }
      catch (e) { validos[campo] = false; invalidos.push(campo); }
    }
  }
  const filas = items.map((nodo) => {
    const fila = {};
    for (const campo of campos) fila[campo] = validos[campo] ? extraerValor(nodo, sel[campo]) : null;
    return fila;
  });
  return { filas, invalidos };
}

// Genera el spider de Scrapy equivalente a los selectores actuales.
function codigoScrapy(medio, sel) {
  const q = (s) => JSON.stringify((s || "").trim());
  const nombre = medio.nombre.toLowerCase().normalize("NFD").replace(/[^a-z ]/g, "").trim().replace(/ +/g, "_");
  return [
    "import scrapy",
    "",
    "",
    `class ${medio.nombre.replace(/[^A-Za-z]/g, "")}Spider(scrapy.Spider):`,
    `    name = "${nombre}"`,
    `    start_urls = ["https://${medio.dominio}/"]`,
    "",
    "    def parse(self, response):",
    `        for nota in response.css(${q(sel.item)}):`,
    "            yield {",
    `                "titular": nota.css(${q(sel.titular)}).get(),`,
    `                "enlace": response.urljoin(nota.css(${q(sel.enlace)}).get()),`,
    `                "fecha": nota.css(${q(sel.fecha)}).get(),`,
    `                "seccion": nota.css(${q(sel.seccion)}).get(),`,
    "            }",
  ].join("\n");
}

if (typeof module !== "undefined") {
  module.exports = { MEDIOS, partirSelector, extraerValor, extraerNoticias, codigoScrapy };
}
