// Lógica de la demo de scraping: tres páginas de noticias inventadas, cada una
// armada de forma distinta, y un extractor que las convierte en los mismos datos.

const ESTILO_BASE = `
  :host { display: block; }
  .pagina { font-family: Georgia, serif; color: #222; background: #fff; min-height: 100%; }
  .cab { padding: 14px 18px; color: #fff; }
  .cab h1 { margin: 0; font-size: 22px; }
  .cab small { opacity: .8; font-family: sans-serif; font-size: 12px; }
  .cont { padding: 6px 18px 18px; }
  a { color: inherit; }
  p { margin: 4px 0 0; font-size: 14px; color: #444; }
  .publi { background: #fff7d6; border: 1px dashed #caa; padding: 10px; margin: 12px 0; font-family: sans-serif; font-size: 13px; }

  /* Marcas que pone el extractor */
  .x-item { transition: background .25s, opacity .25s; border-radius: 6px; }
  .x-item.x-visto { outline: 2px dashed rgba(228, 87, 46, .55); outline-offset: 3px; }
  .x-item.x-foco { outline: 3px solid #e4572e; outline-offset: 3px; background: rgba(228, 87, 46, .07); }
  .x-titular { background: rgba(42, 157, 143, .28); border-radius: 3px; }
  .x-fecha { background: rgba(233, 162, 59, .4); border-radius: 3px; }
  .x-seccion { background-color: rgba(123, 94, 167, .28); outline: 2px solid #7b5ea7; outline-offset: 1px; border-radius: 3px; }
  .x-enlace { box-shadow: inset 0 -3px 0 #3a6ea5; }
  .x-ruido { opacity: .3; filter: grayscale(1); transition: opacity .4s; }
`;

const MEDIOS = [
  {
    nombre: "El Faro Andino",
    dominio: "elfaroandino.example",
    formato: "Lista de artículos · fecha escrita en palabras",
    reglas: {
      item: "article.nota",
      titular: "h2 a",
      seccion: "span.seccion",
      fecha: "span.fecha",
      ruido: ".publi",
    },
    css: `
      .cab { background: #1d3557; }
      article.nota { border-bottom: 1px solid #ddd; padding: 12px 6px; }
      h2 { margin: 0 0 4px; font-size: 17px; line-height: 1.25; }
      .seccion { font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #c1121f; }
      .fecha { font-family: sans-serif; font-size: 12px; color: #777; }
    `,
    cuerpo: `
<div class="pagina">
  <div class="cab"><h1>El Faro Andino</h1><small>Medio ficticio para una demo</small></div>
  <div class="cont">
    <article class="nota">
      <span class="seccion">Economía</span>
      <h2><a href="/economia/cosecha-de-cafe-supera-lo-esperado">La cosecha de café supera lo esperado en el Eje Cafetero</a></h2>
      <span class="fecha">12 de noviembre de 2026</span>
      <p>Los caficultores reportan una temporada mejor que la anterior.</p>
    </article>
    <article class="nota">
      <span class="seccion">Movilidad</span>
      <h2><a href="/movilidad/nueva-cicloruta-conecta-tres-barrios">Una nueva cicloruta conecta tres barrios del occidente</a></h2>
      <span class="fecha">12 de noviembre de 2026</span>
      <p>El tramo tiene cuatro kilómetros y abre este fin de semana.</p>
    </article>
    <aside class="publi">Publicidad · <a href="/promo">Suscríbete por un año</a></aside>
    <article class="nota">
      <span class="seccion">Tecnología</span>
      <h2><a href="/tecnologia/colegios-rurales-estrenan-salas-de-computo">Colegios rurales estrenan salas de cómputo</a></h2>
      <span class="fecha">11 de noviembre de 2026</span>
      <p>Doce instituciones recibieron equipos y conexión.</p>
    </article>
    <article class="nota">
      <span class="seccion">Cultura</span>
      <h2><a href="/cultura/feria-del-libro-cierra-con-record-de-visitantes">La feria del libro cierra con récord de visitantes</a></h2>
      <span class="fecha">10 de noviembre de 2026</span>
      <p>Los organizadores ya anunciaron las fechas del próximo año.</p>
    </article>
  </div>
</div>`,
  },
  {
    nombre: "Radio Sabana",
    dominio: "radiosabana.example",
    formato: "Lista compacta · fecha relativa («hace 2 horas»)",
    reglas: {
      item: "ul#ultimas li.item",
      titular: "a.titular",
      seccion: ".meta b",
      fecha: ".cuando",
      fechaAttr: "data-fecha",
      ruido: "#populares",
    },
    css: `
      .pagina { font-family: Verdana, sans-serif; }
      .cab { background: #2d6a4f; }
      ul { list-style: none; margin: 0; padding: 0; }
      li.item { padding: 11px 6px; border-bottom: 1px dotted #bbb; }
      a.titular { font-size: 15.5px; font-weight: bold; text-decoration: none; }
      .meta { font-size: 12px; color: #666; margin-top: 3px; }
      .meta b { color: #2d6a4f; }
      h3 { margin: 14px 0 2px; font-size: 13px; text-transform: uppercase; color: #666; }
      #populares li { padding: 8px 6px; }
    `,
    cuerpo: `
<div class="pagina">
  <div class="cab"><h1>Radio Sabana</h1><small>Medio ficticio para una demo</small></div>
  <div class="cont">
    <h3>Últimas noticias</h3>
    <ul id="ultimas">
      <li class="item">
        <a class="titular" href="/n/48211">Embalses de la región llegan al 80 % de su capacidad</a>
        <div class="meta"><b>Ambiente</b> · <span class="cuando" data-fecha="2026-11-13">hace 2 horas</span></div>
      </li>
      <li class="item">
        <a class="titular" href="/n/48207">Emprendedores locales abren mercado de fin de semana</a>
        <div class="meta"><b>Economía</b> · <span class="cuando" data-fecha="2026-11-13">hace 5 horas</span></div>
      </li>
      <li class="item">
        <a class="titular" href="/n/48190">Hospital municipal amplía su servicio de urgencias</a>
        <div class="meta"><b>Salud</b> · <span class="cuando" data-fecha="2026-11-12">ayer</span></div>
      </li>
      <li class="item">
        <a class="titular" href="/n/48184">La liga de ciclismo juvenil anuncia su calendario</a>
        <div class="meta"><b>Deportes</b> · <span class="cuando" data-fecha="2026-11-12">ayer</span></div>
      </li>
      <li class="item">
        <a class="titular" href="/n/48163">Universidad pública abre cursos gratuitos de programación</a>
        <div class="meta"><b>Educación</b> · <span class="cuando" data-fecha="2026-11-11">hace 2 días</span></div>
      </li>
    </ul>
    <div id="populares">
      <h3>Lo más escuchado</h3>
      <ul>
        <li><a class="titular" href="/podcast/12">Pódcast: historias de la sabana</a></li>
      </ul>
    </div>
  </div>
</div>`,
  },
  {
    nombre: "Portal Caribe",
    dominio: "portalcaribe.example",
    formato: "Cuadrícula de tarjetas · fecha en formato día/mes/año",
    reglas: {
      item: "div.tarjeta:not(.patrocinado)",
      titular: ".titulo",
      seccion: ".etiqueta",
      fecha: ".dia",
      enlace: "a.leer",
      ruido: ".patrocinado",
    },
    css: `
      .pagina { font-family: "Trebuchet MS", sans-serif; background: #f3f6f9; }
      .cab { background: #0077b6; }
      .rejilla { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 10px; }
      .tarjeta { background: #fff; border-radius: 8px; padding: 10px 12px; box-shadow: 0 1px 3px rgba(0,0,0,.12); }
      .tarjeta.patrocinado { background: #fff7d6; }
      .etiqueta { display: inline-block; background: #0077b6; color: #fff; font-size: 10.5px; padding: 2px 7px; border-radius: 99px; text-transform: uppercase; letter-spacing: .05em; }
      .tarjeta.patrocinado .etiqueta { background: #b08900; }
      .titulo { font-size: 14.5px; font-weight: bold; line-height: 1.25; margin: 6px 0 4px; }
      .pie { display: flex; justify-content: space-between; font-size: 12px; color: #667; }
      a.leer { color: #0077b6; }
    `,
    cuerpo: `
<div class="pagina">
  <div class="cab"><h1>Portal Caribe</h1><small>Medio ficticio para una demo</small></div>
  <div class="cont">
    <div class="rejilla">
      <div class="tarjeta">
        <span class="etiqueta">Turismo</span>
        <div class="titulo">Temporada alta arranca con ocupación hotelera del 85 %</div>
        <div class="pie"><span class="dia">13/11/2026</span><a class="leer" href="/turismo/temporada-alta-ocupacion">Leer</a></div>
      </div>
      <div class="tarjeta">
        <span class="etiqueta">Ambiente</span>
        <div class="titulo">Voluntarios siembran dos mil mangles en la ciénaga</div>
        <div class="pie"><span class="dia">13/11/2026</span><a class="leer" href="/ambiente/siembra-de-mangles">Leer</a></div>
      </div>
      <div class="tarjeta patrocinado">
        <span class="etiqueta">Patrocinado</span>
        <div class="titulo">Conoce los planes de internet para tu negocio</div>
        <div class="pie"><span class="dia">Anuncio</span><a class="leer" href="/promo/internet">Ver</a></div>
      </div>
      <div class="tarjeta">
        <span class="etiqueta">Cultura</span>
        <div class="titulo">El festival de gaitas confirma su cartel de artistas</div>
        <div class="pie"><span class="dia">12/11/2026</span><a class="leer" href="/cultura/festival-de-gaitas">Leer</a></div>
      </div>
      <div class="tarjeta">
        <span class="etiqueta">Economía</span>
        <div class="titulo">El puerto mueve más carga que el año pasado</div>
        <div class="pie"><span class="dia">11/11/2026</span><a class="leer" href="/economia/puerto-mueve-mas-carga">Leer</a></div>
      </div>
      <div class="tarjeta">
        <span class="etiqueta">Deportes</span>
        <div class="titulo">La selección de béisbol juvenil clasifica a la final</div>
        <div class="pie"><span class="dia">11/11/2026</span><a class="leer" href="/deportes/beisbol-juvenil-final">Leer</a></div>
      </div>
    </div>
  </div>
</div>`,
  },
];

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
  "septiembre", "octubre", "noviembre", "diciembre"];
const dos = (n) => String(n).padStart(2, "0");

// Lleva una fecha escrita de cualquiera de las tres formas a AAAA-MM-DD.
// Devuelve null si no la reconoce.
function normalizarFecha(texto) {
  const t = (texto || "").trim().toLowerCase();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return t;
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${dos(m[2])}-${dos(m[1])}`;
  m = t.match(/^(\d{1,2}) de ([a-zñ]+) de (\d{4})$/);
  if (m && MESES.includes(m[2])) return `${m[3]}-${dos(MESES.indexOf(m[2]) + 1)}-${dos(m[1])}`;
  return null;
}

const texto = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : null);

// Recorre la página y devuelve una fila por noticia. Cada fila guarda también los
// elementos de donde salió cada dato, para poder resaltarlos en pantalla.
function extraerNoticias(raiz, medio) {
  const r = medio.reglas;
  return Array.from(raiz.querySelectorAll(r.item)).map((item) => {
    const elTitular = item.querySelector(r.titular);
    const elSeccion = item.querySelector(r.seccion);
    const elFecha = item.querySelector(r.fecha);
    const elEnlace = r.enlace ? item.querySelector(r.enlace) : elTitular;
    const fechaCruda = elFecha ? (r.fechaAttr ? elFecha.getAttribute(r.fechaAttr) : texto(elFecha)) : null;
    const ruta = elEnlace ? elEnlace.getAttribute("href") : null;
    return {
      datos: {
        titular: texto(elTitular),
        fecha: normalizarFecha(fechaCruda),
        seccion: texto(elSeccion),
        enlace: ruta ? `https://${medio.dominio}${ruta}` : null,
      },
      fechaOriginal: texto(elFecha),
      origen: { item, titular: elTitular, fecha: elFecha, seccion: elSeccion, enlace: elEnlace },
    };
  });
}

if (typeof module !== "undefined") {
  module.exports = { MEDIOS, normalizarFecha, extraerNoticias, ESTILO_BASE };
}
