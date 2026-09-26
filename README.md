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

## Flujo de trabajo: Gitflow

| Rama        | Sale de   | Entra a (vía PR)         | Método en GitHub | Para |
| ----------- | --------- | ------------------------ | ---------------- | ---- |
| `main`      | —         | —                        | —                | Lo que está en producción. Cada merge es una versión. |
| `develop`   | `main`    | —                        | —                | Integración de lo próximo a publicar. Rama por defecto. |
| `feature/*` | `develop` | `develop`                | **Squash**       | Una funcionalidad o cambio: `feature/mi-cambio`. |
| `release/*` | `develop` | `main` y luego `develop` | **Merge** a `main`; **Squash** a `develop` | Preparar una versión: `release/1.0.0`. Solo ajustes finales. |
| `hotfix/*`  | `main`    | `main` y luego `develop` | **Merge** a `main`; **Squash** a `develop` | Corrección urgente en producción. |

- **Nadie hace push directo** a `main` ni a `develop`: todo entra por pull request, con los checks de CI en verde.
- **En `develop` se usa squash:** cada feature queda como un solo commit con el título del PR.
- **En `main` se usa merge commit:** cada release o hotfix queda visible como una unidad.
- **Todavía no hay releases:** la app no está completa, así que `main` se queda como está hasta el
  primer `release/*`. Desde entonces, cada versión se etiqueta en `main` (`git tag -a v1.0.0`) con
  [versionado semántico](https://semver.org/lang/es/).

```bash
git switch develop && git pull
git switch -c feature/mi-cambio
# ...commits...
git push -u origin feature/mi-cambio   # abrir PR hacia develop → Squash and merge
```

## CI/CD

GitHub Actions (`.github/workflows/`) corre en cada PR hacia `main` o `develop`. Los rulesets exigen
estos checks; si se renombra un job, hay que actualizar `.github/rulesets/*.json`.

| Check | Qué revisa |
| ----- | ---------- |
| `Lint` | ESLint. |
| `Calidad y build` | Tipos con `tsc` y build de producción con Vite. |
| `Imagen Docker` | Construye la imagen y comprueba que nginx sirve la app, también en rutas internas. |

Con cada push a `develop` o `main` (es decir, al fusionar un PR), y solo si pasaron los checks, se
publica en Docker Hub **la misma imagen que se probó** (no se reconstruye):

- `develop` → `<usuario>/cinema-ui:develop` y `:<sha>`
- `main` → `<usuario>/cinema-ui:latest` y `:<sha>`

El sitio lo despliega **Netlify** desde `develop` (*Site configuration → Build & deploy → Branches*).
Como `develop` solo acepta PRs con los checks en verde, a Netlify solo llega código aprobado.
El flujo no despliega nada en Render.

### Configuración en GitHub (una vez)

- **Rulesets:** `main` y `develop` se protegen importando `.github/rulesets/main.json` y
  `.github/rulesets/develop.json` en *Settings → Rules → Rulesets → Import a ruleset*. Exigen PR, los
  checks de la tabla de arriba, y no permiten borrar la rama ni forzar pushes. `main` solo acepta
  merge commit y `develop` solo squash.
- **Settings → General:** rama por defecto `develop`; permitir merge commits y squash (no rebase);
  activar *Automatically delete head branches*.
- **Secrets** (*Settings → Secrets and variables → Actions*): `DOCKER_USERNAME` y `DOCKER_TOKEN`
  (token de acceso de Docker Hub con permiso de escritura).
