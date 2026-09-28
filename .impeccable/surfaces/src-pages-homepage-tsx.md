---
version: 1
slug: "src-pages-homepage-tsx"
primary_target: "src/pages/HomePage.tsx"
related_targets: ["src/components/layout/Header.tsx","src/pages/MovieDetailPage.tsx","src/components/seats/CinemaSeatMap.tsx"]
---

# Surface brief: flujo del comprador (redesign)

Scope: Operate. Espectador, mobile-first, compra de boletas/comida en COP con pago Wompi. Rutas: /, /movie/:id, /booking/*, /payment*, /pago/resultado, /comidas, /profile*, /recharge*.
Preservar: rutas, servicios, lógica, copy factual. Sin pósters inventados.
Unresolved: sin generación de imágenes; sin comps (code-led).

## Direction contract

THESIS: Tu función es una salida. La cartelera es un tablero de terminal donde hora, sala y silla se leen de un vistazo; refusa la cuadrícula de pósters oscura con acento rojo y el glass azul-púrpura.
OWN-WORLD: hollín casi negro (#0c0c0d), paneles #151517 con filete #2a2a2d, tinta hueso #f4f1e8, ámbar de aleta #f2b705 como único acento de acción, rojo alarma #d9412b para agotado/error, verde #7bd88f para disponible. Barlow Condensed en mayúsculas para filas y títulos, B612 (corte proporcional con cifras tabulares, elegido porque el punto de la mono separaba los montos COP) para horas, salas, sillas y COP. Aletas split-flap, tiquete térmico perforado, sin blur ni gradientes.
STORY: El espectador entiende en segundos qué sale y cuándo, escoge función, silla y combo mientras un tiquete visible se va completando, paga sabiendo que es en Wompi y termina con la boleta como pase de abordaje.
FIRST VIEWPORT: Barra plana con CINEMAPLUS y reloj vivo. Debajo, "PRÓXIMA SALIDA": película destacada con título en aletas que giran, hora/sala/precio en mono a la derecha, botón ámbar "Comprar boletas" abajo a la izquierda; luego pestañas EN CARTELERA / PRONTO / PREVENTA y filas de tablero con miniatura de póster.
FORM: Tablero Solari de terminal + tiquete de abordaje; 7 de 7 en lista ordenada por resonancia; seed 07b8791e.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
