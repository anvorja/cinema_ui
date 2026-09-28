# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Espectador (móvil y escritorio):** compra boletas y comida, elige asientos, paga y presenta el QR de la boleta. Uso principal desde el celular; también desde computador.
- Este repo (`cinema_ui`) también contiene el panel admin (`/admin`), fuera del alcance del rediseño del comprador.

## Product Purpose

CinemaPlus es la plataforma de una cadena de cine real en Colombia: cartelera, selección de asientos y comida, pago en línea (Wompi, COP), boletas con QR, historial y recargas de tarjeta Cinema+. Éxito: el espectador completa la compra sin fricción.

## Operating Context

- Backend detrás de un gateway; servicios en free tier con cold starts.
- Los datos de tarjeta nunca pasan por la UI: el pago ocurre en el Web Checkout de Wompi (tarjeta, PSE, Nequi, Bancolombia).
- Idioma de la interfaz: español (Colombia); moneda COP.

## Capabilities and Constraints

- Flujo: cartelera/inicio → detalle de película → asientos → resumen de boletas → comida → pago → resultado → boleta con QR; perfil, compras, tarjetas, recargas.
- React 19 + TypeScript, Vite 7, Tailwind, Radix/Headless UI, TanStack Query, react-router. No cambiar rutas, servicios ni lógica de negocio.
- Sin generación de imágenes disponible en esta sesión; no inventar pósters ni datos comerciales.

## Brand Commitments

Nombre existente: **CinemaPlus** (tarjeta "Cinema+"). Interfaz en español. Sin otras restricciones de marca vinculantes.

## Evidence on Hand

Pósters vienen del backend/Cloudinary. No hay testimonios ni métricas registradas; no inventarlos.

## Product Principles

1. La compra es el camino crítico: cada pantalla reduce pasos y ambigüedad ante dinero y tiempo real.
2. Mobile-first para el espectador.
3. Estados honestos: pago pendiente, rechazado, expirado, cold start del servidor, se comunican con claridad.
4. Confianza en el pago: montos en COP sin ambigüedad y dejar claro que el pago ocurre en Wompi.

## Accessibility & Inclusion

Buenas prácticas: contraste, objetivos táctiles, foco visible, `prefers-reduced-motion`.
