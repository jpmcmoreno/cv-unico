# CV con demos en vivo — Juan Pablo Moreno Cadena

Un CV donde cada habilidad se puede probar. El PDF tiene botones «Dale un chance ;)» y cada uno
abre una demo de este sitio.

| Demo | Carpeta | Qué muestra |
|---|---|---|
| Chatbot con IA | `demos/chat/` | Servicio sobre la API de un LLM, con límites de uso |
| Regresión lineal | `demos/regresion/` | Mínimos cuadrados en tiempo real |
| Clasificación | `demos/clasificador/` | Regresión logística y frontera de decisión |
| Clustering | `demos/clusters/` | K-means paso a paso |
| Web scraping de noticias | `demos/scraping/` | De páginas distintas a datos ordenados |
| Euclides, Proposición I.1 | `demos/euclides/` | Herramienta didáctica interactiva |

Todo es HTML, CSS y JavaScript sin frameworks ni dependencias: no hay nada que instalar ni compilar.

## Estructura

```
index.html              Página principal
assets/                 Estilos y código compartido (modelos.js tiene los tres modelos de ML)
demos/                  Una carpeta por demo
cv/cv.tex               El CV en LaTeX
cv/CV_Juan_Pablo_Moreno.pdf
worker/deepseek-proxy.js  Proxy del chatbot (Cloudflare Worker)
```

## Verlo en tu computador

Abre `index.html` con doble clic. Todas las demos funcionan así, sin servidor.

## Publicarlo en GitHub Pages

1. Crea un repositorio público en GitHub, por ejemplo `cv-unico`.
2. Sube todo el contenido de esta carpeta (incluido el archivo `.nojekyll`).
3. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**,
   rama `main`, carpeta `/ (root)`. Guarda.
4. En uno o dos minutos el sitio queda en `https://jpmcmoreno.github.io/cv-unico/`.

## Apuntar el PDF a tu sitio

Los botones del PDF usan la dirección del sitio, definida en una sola línea de `cv/cv.tex`:

```latex
\newcommand{\sitio}{jpmcmoreno.github.io/cv-unico}
```

Si cambias el nombre del repositorio, edita esa línea y vuelve a compilar (`pdflatex cv.tex`, o en
Overleaf). Guarda el resultado como `cv/CV_Juan_Pablo_Moreno.pdf`, que es el nombre que enlaza la
página principal. La versión pública va sin teléfono; `cv.tex` explica cómo generar la que lo incluye.

## Conectar el chatbot a DeepSeek (opcional)

Sin configurar nada, el chatbot funciona en **modo simulado**: respuestas pregrabadas, y la página
lo dice. Para que responda un modelo de verdad:

1. Crea una llave en la plataforma de DeepSeek y carga un saldo pequeño: ese saldo es el techo de gasto.
2. En Cloudflare, crea un Worker y pega el contenido de `worker/deepseek-proxy.js`.
3. En el Worker, en **Settings → Variables and Secrets**, agrega:
   - `DEEPSEEK_API_KEY` (tipo *Secret*): tu llave.
   - `ALLOWED_ORIGIN` (texto): `https://jpmcmoreno.github.io`, para que solo tu sitio pueda usarlo.
4. Copia la URL del Worker en `demos/chat/config.js`:
   ```js
   window.CHAT_API_URL = "https://cv-chat.tu-usuario.workers.dev";
   ```

La llave nunca va en este repositorio ni llega al navegador. El proxy aplica los límites de la demo:
200 tokens por respuesta, 400 caracteres por pregunta y 5 preguntas por conversación.

El modelo por defecto es `deepseek-flash`; si DeepSeek cambia los nombres, ajusta la variable
`DEEPSEEK_MODEL` en el Worker.
