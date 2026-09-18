# cinema_ui

UI de cliente: cartelera, selección de asientos y comida, pago y confirmación
de tickets. El frontend principal del sistema.

## Stack

React 19 + TypeScript, bundler Vite 7, gestor de paquetes pnpm. UI con
Tailwind CSS, Radix UI/Headless UI como primitivos, `@tanstack/react-query`
para estado de servidor, `react-router-dom` para rutas, `axios` como
cliente HTTP.

> El `Dockerfile` usa `node:18-alpine` para el build, por debajo de lo que
> pide Vite 7 — genera un warning no bloqueante, sin corregir (ver
> `../IMPLEMENTATION-GUIDE.md`, fue evaluado y quedó fuera de alcance).

## Estructura

- `src/pages/` — una página por ruta (`HomePage`, `CarteleraPage`,
  `SeatSelectionPage`, `PaymentPage`, `TicketConfirmPage`, `ProfilePage`,
  etc.), enrutadas desde `src/App.tsx`.
- `src/components/` — organizados por dominio (`booking`, `payment`,
  `seats`, `cinema`, `admin`, `auth`) más `ui/` (primitivos) y `layout/`.
- `src/services/api.ts` — cliente Axios único; lee la URL base del backend
  desde `VITE_API_BASE_URL`.
- `src/hooks`, `src/lib`, `src/utils`, `src/mocks` — soporte transversal.

## Variables de entorno

- `VITE_API_BASE_URL` — URL del gateway (Traefik/Render). Se embebe en el
  bundle en **tiempo de build**, no de runtime — cambiarla implica
  reconstruir.
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` — Cloudinary
  para imágenes (pósters, etc.).

En Docker local se pasan como build arg (`ARG VITE_API_BASE_URL` en el
`Dockerfile`, default `http://localhost:8090/api/v1` vía
`../infra-cinema/docker-compose.yml`). En Netlify se inyectan por contexto
de rama en `netlify.toml` — ver `../WORKFLOW.md` para el detalle completo de
`main`/`staging`/`deploy-preview`.

## Correr en local

**Nativo** (más rápido para iterar):
```bash
pnpm install
pnpm dev   # → http://localhost:5173
```

**Vía Docker + Traefik** (junto al resto del stack): ver
`../infra-cinema` y `../WORKFLOW.md` → "Desarrollar en local".

## Build y despliegue

- Local/Docker: `Dockerfile` multi-stage — build con pnpm, se sirve el
  `dist/` resultante con nginx (`nginx.conf`).
- Producción/staging: Netlify construye con `pnpm run build` y sirve
  `dist/` como sitio estático (`netlify.toml`, incluye el redirect SPA para
  que las rutas de React Router sobrevivan un refresh). Despliegue
  automático al hacer push a `main`/`staging` — ver `../WORKFLOW.md`.
