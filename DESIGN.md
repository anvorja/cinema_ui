---
name: CinemaPlus - Tablero de Salidas
system: tablero-v1
description: Tablero de salidas de terminal en hollín y ámbar (oscuro por defecto, claro opcional), con el tiquete de abordaje como resumen de la compra. Un solo sistema para el comprador, el panel admin y el escáner.
colors:
  ground: "#0c0c0d"
  panel: "#151517"
  panel-raised: "#1d1d20"
  hairline: "#2c2c30"
  hairline-strong: "#46464c"
  ink: "#f4f1e8"
  ink-soft: "#c3bfb2"
  ink-mute: "#8f8b80"
  amber: "#f2b705"
  amber-press: "#d9a304"
  alarm: "#d9412b"
  alarm-text: "#f0644d"
  ok: "#7bd88f"
  light:
    ground: "#f2f1ec"
    panel: "#ffffff"
    panel-raised: "#e9e7e0"
    hairline: "#d6d3ca"
    hairline-strong: "#8c8879"
    ink: "#141416"
    ink-soft: "#3d3c40"
    ink-mute: "#66645c"
    amber-text: "#8a6400"
    alarm-text: "#b3321d"
    ok-text: "#1d7a38"
typography:
  board:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.375rem to 1.75rem (rows), 1.875rem to 2.25rem (stub title)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
  flap:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.06
  data:
    fontFamily: "B612, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0"
    fontFeature: "tnum"
  data-time:
    fontFamily: "B612, system-ui, sans-serif"
    fontSize: "26px to 30px"
    fontWeight: 700
    lineHeight: 1
  text:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "B612, system-ui, sans-serif"
    fontSize: "10px to 11px"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  tag: "2px"
  control: "3px"
  panel: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ground}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.amber-press}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "48px"
    padding: "0 20px"
  button-ghost:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "40px"
  tag:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
  tag-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ground}"
---

# Design System: CinemaPlus - Tablero de Salidas (`tablero-v1`)

**Código del sistema: `tablero-v1`.** Es el identificador común de todo lo que comparte este estilo. Se usa en los nombres de rama (`feature/rediseno-tablero-*`), en la etiqueta git `diseno-tablero-v1` de ambos repositorios y en este archivo. Si un módulo cambia tokens o componentes de forma que ya no coincida con el resto, el código sube a `tablero-v2` en todos.

## Alcance

| Módulo | Repositorio | Rama | Qué cubre |
|---|---|---|---|
| Comprador | `cinema_ui` | `feature/rediseno-tablero-comprador` | `/`, `/movie/:id`, `/booking/*`, `/payment*`, `/pago/resultado`, `/comidas`, `/profile*`, `/recharge*` |
| Administración | `cinema_ui` | `feature/rediseno-tablero-comprador` | `/admin/*` (mismo repositorio, mismo sistema, más densidad) |
| Escáner de entrada | `cinema-scanner-ui` | `feature/rediseno-tablero-escaner` | login y validación de boletas del staff |

Fuente de verdad en `cinema_ui`: el bloque "TABLERO DE SALIDAS" de `src/index.css`, `tailwind.config.js` (colores `board-*`) y `src/components/board/*`. `cinema-scanner-ui` replica los mismos tokens (`src/index.css`, `tailwind.config.js`) y `FlapText`; cualquier cambio de tokens se hace en ambos. El mundo se activa con la clase `board` en `<body>` (comprador y admin); el escáner aplica los tokens de forma global.

## Temas

Oscuro es el tema por defecto y el de referencia; el claro es opcional y lo elige cada persona con el botón sol/luna (cabecera del comprador, sidebar del admin, cabecera del escáner). La preferencia se guarda en `localStorage` con la clave `cinema-board-theme` y se activa con la clase `board-light` en `<body>`. Si la app y el escáner se sirven bajo el mismo origen, comparten la preferencia.

Los colores viven como canales RGB (`--b-ground: 12 12 13`) y se consumen con Tailwind como `bg-board-panel`, `text-board-ink`, `border-board-line`, etc., que admiten opacidad (`bg-board-amber/10`).

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `ground` | #0c0c0d | #f2f1ec | fondo de página |
| `panel` / `panel2` | #151517 / #1d1d20 | #ffffff / #e9e7e0 | superficies, hover |
| `line` / `line2` | #2c2c30 / #46464c | #d6d3ca / #8c8879 | filetes, bordes de control |
| `ink` / `ink2` / `mute` | #f4f1e8 / #c3bfb2 / #8f8b80 | #141416 / #3d3c40 / #66645c | texto |
| `amber` | #f2b705 | #f2b705 | relleno de acción (igual en ambos) |
| `amberink` | #f2b705 | #8a6400 | texto y trazos ámbar |
| `onamber` | #0c0c0d | #0c0c0d | texto sobre relleno ámbar u ok (siempre oscuro) |
| `alarm` / `alarmink` | #d9412b / #f0644d | #d9412b / #b3321d | relleno / texto de error |
| `ok` / `okink` | #7bd88f / #7bd88f | #7bd88f / #1d7a38 | relleno / texto de éxito |
| `sold`, `alarmbg`, `okbg`, `map` | tonos oscuros | tonos claros | fondos de estado y del mapa de sillas |

### Named Rules
**The Dual-Ink Rule.** El ámbar tiene dos tintas: `amber` para rellenos (idéntico en ambos temas, con texto `onamber`) y `amberink` para texto y trazos (más oscuro en claro para cumplir contraste). Nunca uses `amber` como color de texto.
**The Fixed-Dark Scope Rule.** Lo que se apoya sobre una imagen (póster, cartel, capa de tarjeta) debe leerse igual en ambos temas: envuélvelo en `.b-dark`, que fija los tokens oscuros. Las aletas del título (`FlapText`) son piezas físicas y siguen oscuras en los dos temas. El QR va siempre sobre fondo hueso claro con trazo oscuro.

## Overview

**Creative North Star: "El Tablero de Salidas"**

La cartelera se trata como el tablero de una terminal: hora, sala y silla se leen de un vistazo, en filas. Sobre un hollín casi negro, la tinta hueso lleva la información y un único ámbar de aleta señala la acción y el paso actual. La compra se acompaña con un tiquete de abordaje perforado que se repite en cada paso y termina como la boleta.

El sistema es plano y de alto contraste. Los paneles son superficies opacas con filete de 1px; no hay blur, degradados ni brillo. Las esquinas son casi rectas (2 a 4px). La personalidad viene de la tipografía condensada en mayúsculas para filas y títulos, y de una cifra proporcional tabular para todo lo que es dato (horas, salas, sillas, COP).

Rechaza dos looks concretos: la cuadrícula de pósters oscura con acento rojo, y el vidrio azul-púrpura anterior de la app.

**Key Characteristics:**
- Filas de tablero antes que tarjetas de póster; el póster es una miniatura dentro de la fila.
- Un solo acento de acción (ámbar); rojo solo para agotado/error, verde solo para disponible.
- Dos voces tipográficas con roles fijos: Barlow Condensed en mayúsculas (nombres) y B612 (datos).
- Superficies planas con filete; profundidad por capas tonales, no por sombra.
- Movimiento corto y funcional: aletas que giran, transiciones de 140ms, respeto de `prefers-reduced-motion`.

## Colors

Paleta de hollín, hueso y un solo ámbar; los estados usan rojo alarma y verde disponible con moderación.

### Primary
- **Ámbar de aleta** (#f2b705, presionado #d9a304): fondo del botón de acción principal, paso actual de la compra, reloj vivo, hora seleccionada, silla elegida, anillo de foco y selección de texto. Con él, el texto va en hollín.

### Neutral
- **Hollín** (#0c0c0d): fondo de página y barra de pasos; texto sobre ámbar.
- **Panel** (#151517): superficie de filas, paneles, tiquete e inputs.
- **Panel elevado** (#1d1d20): hover de fila, etiquetas, placeholder de póster.
- **Filete** (#2c2c30): borde de paneles y separadores de fila.
- **Filete fuerte** (#46464c): regla superior de la lista, bordes de botón secundario e inputs, perforación del tiquete.
- **Tinta hueso** (#f4f1e8): texto principal.
- **Tinta suave** (#c3bfb2): texto secundario, pasos completados.
- **Tinta apagada** (#8f8b80): rótulos, metadatos, placeholders.

### Status
- **Rojo alarma** (#d9412b): agotado/error como relleno o borde; el texto usa **alarma legible** (#f0644d). Silla vendida: texto #f0644d sobre #3a1a15.
- **Verde disponible** (#7bd88f): disponibilidad y éxito.

### Named Rules
**The One Amber Rule.** El ámbar es el único color de acción. Si dos cosas de una pantalla compiten en ámbar, una de ellas está mal.
**The Status Is Not Decoration Rule.** Rojo y verde solo comunican estado (agotado, error, disponible). Nunca adornan.

## Typography

**Board Font:** Barlow Condensed (Arial Narrow, sans-serif), 700, mayúsculas
**Data Font:** B612 (system-ui), 400/700, cifras tabulares
**Body Font:** Barlow (system-ui), 400 a 600

**Character:** Cartel de terminal. La condensada en mayúsculas nombra cosas (películas, pasos, botones); B612 cuenta cosas (hora, sala, silla, COP). B612 se eligió por su corte proporcional con cifras tabulares: el punto de una mono separaba visualmente los montos COP.

### Hierarchy
- **Flap display** (700, clamp(2rem, 6vw, 4.5rem), 1.06): título de la película destacada, letra a letra en aletas.
- **Board title** (700, 28px en escritorio y 22px en móvil, 1.1, +0.02em, mayúsculas): nombre de película en cada fila; en el tiquete 30 a 36px.
- **Board label** (600 a 700, 15 a 20px, +0.06em a +0.08em, mayúsculas): botones, pestañas, pasos, formato de función.
- **Data** (700, 14 a 16px, tabular): precios COP, salas, disponibilidad, valores del tiquete.
- **Data time** (700, 26 a 30px, 1): hora de cada función.
- **Body** (400, 16px, 1.5): texto corrido en Barlow.
- **Tag/caption** (B612, 10 a 11px, +0.04em, mayúsculas): etiquetas de estado y rótulos de columna. Son rótulos de dato funcionales dentro de tablas y celdas, no sobretítulos de sección.

### Named Rules
**The Two Voices Rule.** Nombres en Barlow Condensed mayúsculas; cantidades y horarios en B612 tabular. Un monto COP nunca va en la condensada.

## Layout

Lista ordenada de filas a todo el ancho, contenedor de hasta 1400px con relleno de 16px (móvil) a 24px (escritorio). Móvil primero: la fila de película es `56px | título | precio`, y en escritorio pasa a `40px índice | 64px póster | título | etiqueta | precio`. La fila de función va de `76px hora | formato+sala | precio` a seis columnas con la disponibilidad visible. Las columnas de datos usan un encabezado de tabla en B612 de 11px.

Objetivos táctiles de 44 a 48px (pasos 44px, pestañas 48px, botones 40 a 64px). El ritmo vertical se apoya en filas de 60 a 96px con relleno de 8 a 12px y separadores de filete, no en tarjetas con margen. La barra de pasos (Función, Sillas, Boletas, Comida, Pago) es plana, con subrayado ámbar de 2px en el paso actual; en móvil solo el paso actual muestra su nombre.

## Elevation & Depth

Sin sombras ni blur en superficies. La profundidad es tonal: hollín (#0c0c0d) como suelo, panel (#151517) encima, panel elevado (#1d1d20) para hover y etiquetas, y filetes de 1px que delimitan. Los estados se muestran con cambio de borde o de fondo, no con elevación. El `backdrop-filter` está anulado dentro del tablero.

### Named Rules
**The Flat Panel Rule.** Un panel es un relleno opaco y un filete de 1px. Nada de vidrio, degradado ni resplandor.

## Shapes

Casi rectas: etiquetas 2px, controles y botones 3px, paneles 4px (los `rounded-lg` y `rounded-xl` heredados se reducen a 3 y 4px). El tiquete es un rectángulo con dos muescas semicirculares (14px) a los lados en la línea de corte y una perforación de guion de 2px (#46464c). Los pósters son miniaturas 2:3 con filete, sin redondeo. Las sillas del mapa son bloques cuadrados con símbolo (check para la tuya, X para vendida), no solo color.

## Components

### Buttons
- **Shape:** casi recto (3px), Barlow Condensed 700 en mayúsculas, +0.06em.
- **Primary:** relleno ámbar #f2b705, texto hollín, borde ámbar; 48px de alto y 20px de relleno por defecto (40, 56, 64 en otros tamaños).
- **Hover / Active / Focus:** hover a #d9a304, active a #c29403 y baja 1px; foco con contorno ámbar de 2px y 2px de separación. Transición de 140ms.
- **Secondary:** transparente, texto hueso, filete fuerte; el hover pasa el borde a hueso. **Ghost:** texto suave sin borde, hover con fondo panel elevado. Deshabilitado a 40% de opacidad.
- **Outline ámbar (cabecera "Ingresar"):** borde y texto ámbar, hover relleno ámbar con texto hollín.

### Chips / Tags
- Etiqueta de aleta: B612 11px 700 en mayúsculas, radio 2px, fondo panel elevado, borde filete fuerte. Variantes: ámbar (relleno), ok (texto y borde verde al 50%), alarma (texto #f0644d, borde alarma al 60%).

### Cards / Containers
- **Panel:** #151517, filete #2c2c30, radio 4px, sin sombra. **Panel elevado:** #1d1d20 igual.
- **Filas** (película, función): separadas por filete inferior, hover en #151517 y título en ámbar.

### Inputs / Fields
- Fondo panel, borde filete fuerte, radio 3px, texto hueso, caret ámbar, placeholder apagado. Foco: borde ámbar y sin sombra. Buscador de cabecera de 40px.

### Navigation
- Cabecera plana con CINEMAPLUS y reloj vivo en ámbar (B612 700). Enlaces y pestañas en Barlow Condensed mayúsculas con subrayado de 2px; la pestaña activa lleva ámbar. Botones de icono de 44px en móvil.

### Signature: Título en aletas (FlapText)
Cada letra es una aleta oscura (#19191b) con costura central que gira unos glifos y se asienta (90ms por giro, escalonado). El texto real va en `aria-label`. Con `prefers-reduced-motion` aparece ya asentado.

### Signature: Tiquete de función (FunctionStub)
Póster 72 a 88px a la izquierda; a la derecha título en condensada y una lista Cine / Sala / Fecha / Hora / Sillas en B612, con la hora en ámbar y una perforación de guion sobre los datos. Se repite en todos los pasos de la compra para que el espectador vea el tiquete completándose.

### Signature: Mapa de sillas
Sillas cuadradas de tono #2c2c30 (general), con marca ámbar interior superior para preferencial, ámbar sólido con check para la tuya y #3a1a15 con X en #f0644d para vendida. Leyenda visible; controles de zoom de 44px.

### Signature: Diálogos y tooltips
Los diálogos (`AlertDialog`) son un panel plano con filete fuerte, título en condensada, foco inicial en Cancelar y Escape que cancela; el `window.confirm` nativo no se usa. Los tooltips (`BoardTip`) son un panel #0c0c0d con filete fuerte, flecha del mismo tono y texto B612 700 de 12px; reemplazan al `title` nativo.

### Admin
Misma piel con más densidad: cabecera de 56px con el nombre de la sección en condensada, sidebar con `CINEMAPLUS` y navegación en condensada mayúsculas (indicador cuadrado ámbar a la derecha en la sección activa), tarjetas de cifras con el número en B612, tablas con filete y encabezados de columna en B612 de 11px, gráfica de ingresos con trazo ámbar sobre relleno ámbar al 12% (sin degradado). Los botones sólidos de acción (ámbar, ok, alarma) toman siempre la voz de tablero.

### Escáner
Pensado para staff de pie, con prisa y luz variable: objetivos de 48 a 56px, un solo botón primario ámbar por pantalla y el veredicto como panel de color con ícono, título en condensada de 48px y datos clave (película, función, sala, asiento, código) en B612 de 20px. Cada veredicto lleva color **y** texto **y** ícono: Boleta válida (verde), Ya utilizada (ámbar), No encontrada / Error (alarma), Sin permiso (neutro). Contadores ✓ / ✗ de la sesión en el encabezado.

### Pie de página
Marca CINEMAPLUS, descripción, cuatro botones de red social de 44px (Facebook, Instagram, YouTube, TikTok; hasta tener las URL oficiales apuntan a la página principal) y columnas de enlaces con objetivos de 36px o más.

## Do's and Don'ts

### Do:
- **Do** usar ámbar #f2b705 solo para la acción principal, el paso actual, la hora o silla seleccionada y el foco.
- **Do** poner montos COP, horas, salas y sillas en B612 con cifras tabulares, y decir siempre en la pantalla de pago que se paga en Wompi.
- **Do** dar a cada estado de silla y función un símbolo o texto además del color (tachado en agotado, X en vendida).
- **Do** mantener superficies planas: relleno opaco y filete de 1px, radio 2 a 4px.
- **Do** respetar `prefers-reduced-motion` en cualquier animación nueva y limitar las transiciones a 140ms con `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Do** usar el color ámbar con texto hollín (`onamber`), nunca texto blanco sobre ámbar.

### Don't:
- **Don't** volver al vidrio azul-púrpura: nada de `backdrop-blur`, degradados morados ni resplandores.
- **Don't** armar la cartelera como cuadrícula de pósters oscura con acento rojo; el rojo es solo estado.
- **Don't** usar la condensada en mayúsculas para cifras ni B612 para títulos de película.
- **Don't** escribir colores como hex fijo en componentes: usa los tokens `board-*` para que el tema claro y el módulo hermano no se rompan.
- **Don't** crear un módulo nuevo con otros tokens: toma `tablero-v1` (o súbelo a `tablero-v2` en todos los repositorios a la vez).
- **Don't** inventar pósters ni datos comerciales; los pósters vienen del backend.
- **Don't** depender solo del color para distinguir disponible, agotado y seleccionado.
