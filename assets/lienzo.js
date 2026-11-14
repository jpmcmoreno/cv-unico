// Utilidades mínimas para dibujar en <canvas> con coordenadas normalizadas.
// El plano de datos va de 0 a 1 en ambos ejes, con el eje Y hacia arriba.

const COLORES = {
  ink: "#14213d",
  soft: "#5c677d",
  accent: "#e4572e",
  teal: "#2a9d8f",
  amber: "#e9a23b",
  purple: "#7b5ea7",
  rose: "#c8553d",
  blue: "#3a6ea5",
  green: "#6a994e",
  grid: "#e6e2d8",
};

function crearLienzo(canvas, dibujar) {
  const ctx = canvas.getContext("2d");
  const estado = { w: 0, h: 0 };

  function redibujar() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    estado.w = w;
    estado.h = h;
    dibujar(ctx, w, h);
  }

  // Convierte un evento de puntero a coordenadas de datos (0..1, Y hacia arriba).
  function aDatos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height)),
    };
  }

  window.addEventListener("resize", redibujar);
  return { ctx, redibujar, aDatos, estado };
}

function cuadricula(ctx, w, h, divisiones = 10) {
  ctx.save();
  ctx.strokeStyle = COLORES.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < divisiones; i++) {
    const x = Math.round((i / divisiones) * w) + 0.5;
    const y = Math.round((i / divisiones) * h) + 0.5;
    ctx.moveTo(x, 0); ctx.lineTo(x, h);
    ctx.moveTo(0, y); ctx.lineTo(w, y);
  }
  ctx.stroke();
  ctx.restore();
}

function punto(ctx, px, py, color, radio = 6) {
  ctx.beginPath();
  ctx.arc(px, py, radio, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

// Índice del punto más cercano a (x, y) dentro de un radio en píxeles, o -1.
function masCercano(puntos, x, y, w, h, radioPx = 14) {
  let mejor = -1;
  let dMejor = radioPx * radioPx;
  for (let i = 0; i < puntos.length; i++) {
    const dx = (puntos[i].x - x) * w;
    const dy = (puntos[i].y - y) * h;
    const d = dx * dx + dy * dy;
    if (d <= dMejor) { dMejor = d; mejor = i; }
  }
  return mejor;
}

// Normal estándar (Box-Muller), para generar datos de ejemplo.
function normal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const acotar = (v) => Math.min(0.98, Math.max(0.02, v));
