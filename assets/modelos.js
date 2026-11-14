// Los tres modelos de las demos, escritos desde cero en JavaScript.
// No dependen del navegador: son funciones puras y se pueden probar con Node.

// ---------- Regresión lineal por mínimos cuadrados ----------
// Devuelve { a, b, r2 } para la recta y = a + b·x, o null si no se puede ajustar.
function regresionLineal(puntos) {
  const n = puntos.length;
  if (n < 2) return null;
  let sx = 0, sy = 0;
  for (const p of puntos) { sx += p.x; sy += p.y; }
  const mx = sx / n, my = sy / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (const p of puntos) {
    sxx += (p.x - mx) ** 2;
    sxy += (p.x - mx) * (p.y - my);
    syy += (p.y - my) ** 2;
  }
  if (sxx < 1e-12) return null; // todos los puntos en la misma vertical
  const b = sxy / sxx;
  const a = my - b * mx;
  let sse = 0;
  for (const p of puntos) sse += (p.y - (a + b * p.x)) ** 2;
  const r2 = syy < 1e-12 ? 1 : 1 - sse / syy;
  return { a, b, r2 };
}

// ---------- Regresión logística con variables polinómicas ----------
// Expande (x, y) en todos los monomios hasta el grado dado. Entradas en [0, 1].
function expandir(x, y, grado) {
  const u = 2 * x - 1, v = 2 * y - 1; // centrar en [-1, 1] ayuda al descenso
  const f = [1];
  for (let g = 1; g <= grado; g++) {
    for (let j = 0; j <= g; j++) f.push(u ** (g - j) * v ** j);
  }
  return f;
}

const sigmoide = (z) => 1 / (1 + Math.exp(-z));

// puntos: [{x, y, c}] con c = 0 o 1. Devuelve los pesos del modelo.
function entrenarLogistica(puntos, grado = 1, { iteraciones = 600, tasa = 0.8, l2 = 0.002 } = {}) {
  const X = puntos.map((p) => expandir(p.x, p.y, grado));
  const d = expandir(0, 0, grado).length;
  const w = new Array(d).fill(0);
  const n = puntos.length;
  if (n === 0) return w;
  for (let it = 0; it < iteraciones; it++) {
    const grad = new Array(d).fill(0);
    for (let i = 0; i < n; i++) {
      let z = 0;
      for (let j = 0; j < d; j++) z += w[j] * X[i][j];
      const err = sigmoide(z) - puntos[i].c;
      for (let j = 0; j < d; j++) grad[j] += err * X[i][j];
    }
    for (let j = 0; j < d; j++) {
      const reg = j === 0 ? 0 : l2 * w[j]; // el sesgo no se regulariza
      w[j] -= tasa * (grad[j] / n + reg);
    }
  }
  return w;
}

function probabilidad(w, x, y, grado) {
  const f = expandir(x, y, grado);
  let z = 0;
  for (let j = 0; j < f.length; j++) z += w[j] * f[j];
  return sigmoide(z);
}

function exactitud(w, puntos, grado) {
  if (!puntos.length) return null;
  let ok = 0;
  for (const p of puntos) {
    if ((probabilidad(w, p.x, p.y, grado) >= 0.5 ? 1 : 0) === p.c) ok++;
  }
  return ok / puntos.length;
}

// ---------- K-means ----------
const dist2 = (p, q) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2;

// Inicialización k-means++: centroides alejados entre sí.
function iniciarCentroides(puntos, k, azar = Math.random) {
  if (!puntos.length) return [];
  const c = [{ ...puntos[Math.floor(azar() * puntos.length)] }];
  while (c.length < Math.min(k, puntos.length)) {
    const d = puntos.map((p) => Math.min(...c.map((q) => dist2(p, q))));
    const total = d.reduce((s, v) => s + v, 0);
    if (total === 0) break;
    let r = azar() * total, i = 0;
    while (i < d.length - 1 && (r -= d[i]) > 0) i++;
    c.push({ x: puntos[i].x, y: puntos[i].y });
  }
  return c.map((q) => ({ x: q.x, y: q.y }));
}

function asignar(puntos, centroides) {
  return puntos.map((p) => {
    let mejor = 0, dm = Infinity;
    centroides.forEach((q, j) => {
      const d = dist2(p, q);
      if (d < dm) { dm = d; mejor = j; }
    });
    return mejor;
  });
}

// Un paso de k-means. Devuelve los nuevos centroides, la asignación y si hubo cambio.
function pasoKMeans(puntos, centroides) {
  const grupo = asignar(puntos, centroides);
  let movido = false;
  const nuevos = centroides.map((q, j) => {
    let sx = 0, sy = 0, n = 0;
    puntos.forEach((p, i) => { if (grupo[i] === j) { sx += p.x; sy += p.y; n++; } });
    if (n === 0) return q; // grupo vacío: el centroide se queda donde está
    const nx = sx / n, ny = sy / n;
    if (Math.abs(nx - q.x) > 1e-6 || Math.abs(ny - q.y) > 1e-6) movido = true;
    return { x: nx, y: ny };
  });
  return { centroides: nuevos, grupo: asignar(puntos, nuevos), movido };
}

function inercia(puntos, centroides, grupo) {
  let s = 0;
  puntos.forEach((p, i) => { s += dist2(p, centroides[grupo[i]]); });
  return s;
}

if (typeof module !== "undefined") {
  module.exports = {
    regresionLineal, expandir, entrenarLogistica, probabilidad, exactitud,
    iniciarCentroides, asignar, pasoKMeans, inercia,
  };
}
