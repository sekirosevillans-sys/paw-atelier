# Desglose de Tareas de Implementación — PawAtelier

**Estrategia**: Ejecución secuencial controlada por especificación (SDD). Cada tarea debe ser verificada antes de avanzar.

---

### T001 — Project Foundation & Dependencies
- **Objetivo**: Inicializar el proyecto Next.js con TypeScript estricto, Tailwind CSS, Lucide Icons y utilidades base.
- **Archivos**: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/globals.css`, `src/lib/utils.ts`.
- **Dependencias**: Ninguna.
- **Criterios de Aceptación**: `npm run typecheck` y `npm run build` pasan sin errores.
- **Tests**: Build verification test.

---

### T002 — Database Modeling, Prisma Schema & Realistic Seed
- **Objetivo**: Diseñar el esquema relacional en Prisma (Products, Variants, Categories, Inventory, Cart, Orders, Coupons, Reviews), generar el cliente y sembrar 20+ productos boutique con datos creíbles.
- **Archivos**: `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/prisma.ts`.
- **Dependencias**: T001.
- **Criterios de Aceptación**: Migraciones aplicadas correctamente, `npm run db:seed` puebla la base con datos coherentes e integridad referencial garantizada.
- **Tests**: Database connection and query verification.

---

### T003 — Authentication & RBAC Core
- **Objetivo**: Configurar NextAuth con credenciales seguras (bcrypt), sesiones con roles (`CUSTOMER`, `STAFF`, `ADMIN`) y helpers de protección.
- **Archivos**: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/server/schemas/auth.schema.ts`, `src/middleware.ts`.
- **Dependencias**: T002.
- **Criterios de Aceptación**: Login con credenciales, registro de nuevo usuario, emisión de tokens con rol verificado.
- **Tests**: `tests/unit/auth.test.ts`.

---

### T004 — Design System & Atomic UI Primitives
- **Objetivo**: Implementar componentes base de diseño editorial (Buttons, Inputs, Badges, Modals/Dialogs, Drawers, Toast, Skeletons, RatingStars).
- **Archivos**: `src/components/ui/*.tsx`.
- **Dependencias**: T001.
- **Criterios de Aceptación**: Componentes accesibles, respetan la paleta editorial (`Alabaster`, `Olive`, `Terracotta`), con variantes y soporte para focus/disabled.
- **Tests**: Smoke render de componentes UI.

---

### T005 — Product Catalog, Faceted Filters & Search API
- **Objetivo**: Implementar la API y la interfaz de `/shop` con filtros reactivos (especie, categoría, precio, talla, disponibilidad, rating) y ordenamiento.
- **Archivos**: `src/server/services/product.service.ts`, `src/app/api/products/route.ts`, `src/app/(store)/shop/page.tsx`, `src/components/product/ProductCard.tsx`, `src/components/product/ShopFilters.tsx`.
- **Dependencias**: T002, T004.
- **Criterios de Aceptación**: Filtrado instantáneo, paginación/conteo de resultados correcto, responsive con drawer en mobile.
- **Tests**: `tests/api/products.test.ts`.

---

### T006 — Product Detail Page (PDP) & Variant Matrix
- **Objetivo**: Crear la página interactiva de producto (`/products/[slug]`) con galería de zoom, selector de variantes con stock en tiempo real, pestañas de especificaciones y sticky bar de compra.
- **Archivos**: `src/app/(store)/products/[slug]/page.tsx`, `src/components/product/ProductGallery.tsx`, `src/components/product/VariantSelector.tsx`, `src/components/product/StickyPurchaseBar.tsx`.
- **Dependencias**: T004, T005.
- **Criterios de Aceptación**: La selección de variantes actualiza precio y stock al instante, previene añadir cantidades superiores al inventario.
- **Tests**: Pruebas de selección de variantes y límites de cantidad.

---

### T007 — Cart Engine & Slide-Over Mini-Cart
- **Objetivo**: Implementar el servicio de carrito con validación en servidor, cálculo de subtotales, barra de envío gratuito dinámico y cajón lateral animado.
- **Archivos**: `src/server/services/cart.service.ts`, `src/app/api/cart/route.ts`, `src/context/CartContext.tsx`, `src/components/cart/MiniCartDrawer.tsx`, `src/app/(store)/cart/page.tsx`.
- **Dependencias**: T004, T006.
- **Criterios de Aceptación**: Agregar, modificar cantidad y eliminar productos sincroniza con servidor y persiste en cliente de forma fluida.
- **Tests**: `tests/unit/cart-math.test.ts`.

---

### T008 — Wishlist System
- **Objetivo**: Crear sistema de lista de deseos con toggle en tarjetas de producto, persistencia local y sincronización al iniciar sesión.
- **Archivos**: `src/context/WishlistContext.tsx`, `src/app/(store)/wishlist/page.tsx`, `src/components/product/WishlistButton.tsx`.
- **Dependencias**: T004, T007.
- **Criterios de Aceptación**: Permite guardar favoritos, mover ítems directo al carrito y compartir lista.
- **Tests**: Verificación de guardado y transferencia a carrito.

---

### T009 — Coupon & Promotions Engine
- **Objetivo**: Servicio y endpoint para validar y aplicar cupones de descuento (porcentaje, monto fijo, compra mínima, expiración).
- **Archivos**: `src/server/services/coupon.service.ts`, `src/app/api/coupons/route.ts`, `src/components/cart/CouponInput.tsx`.
- **Dependencias**: T007.
- **Criterios de Aceptación**: Descuentos aplicados con precisión decimal, rechazo claro de cupones inválidos o con compra insuficiente.
- **Tests**: `tests/unit/coupon-rules.test.ts`.

---

### T010 — Progressive Checkout Flow
- **Objetivo**: Crear el flujo de checkout en acordeón continuo (Contacto, Dirección, Envío, Resumen financiero).
- **Archivos**: `src/app/(store)/checkout/page.tsx`, `src/components/checkout/*.tsx`, `src/server/schemas/checkout.schema.ts`.
- **Dependencias**: T007, T009.
- **Criterios de Aceptación**: Formulario validado con Zod, cálculo reactivo de flete según método seleccionado, estados de error claros.
- **Tests**: Validación de schemas y cálculo de fletes.

---

### T011 — Stripe Payments & Order Creation (Idempotent)
- **Objetivo**: Integrar Stripe Checkout / Elements en modo test y simulador de pagos, creación transaccional de órdenes con deducción de stock e idempotencia.
- **Archivos**: `src/lib/stripe.ts`, `src/server/services/order.service.ts`, `src/app/api/checkout/route.ts`, `src/app/(store)/checkout/success/[orderId]/page.tsx`.
- **Dependencias**: T010.
- **Criterios de Aceptación**: Pedido generado con ID único, stock descontado en base de datos, simulación de estados de pago (PAID, FAILED).
- **Tests**: `tests/integration/order-checkout.test.ts`.

---

### T012 — User Account Portal & Order Tracking
- **Objetivo**: Crear `/account` con visualización de pedidos anteriores, timeline de envío, libreta de direcciones y datos de perfil.
- **Archivos**: `src/app/(store)/account/page.tsx`, `src/components/account/*.tsx`, `src/app/api/user/orders/route.ts`.
- **Dependencias**: T003, T011.
- **Criterios de Aceptación**: Historial de órdenes con desglose de ítems, estado del pedido en tiempo real y protección de rutas.
- **Tests**: Acceso autenticado y renderizado de pedidos.

---

### T013 — Admin Dashboard (Metrics, Products, Orders, Inventory)
- **Objetivo**: Construir el panel administrativo protegido para ver métricas de ventas, gestionar catálogo, ajustar stock y cambiar estados de pedidos.
- **Archivos**: `src/app/admin/page.tsx`, `src/app/admin/products/page.tsx`, `src/app/admin/inventory/page.tsx`, `src/app/admin/orders/page.tsx`, `src/app/api/admin/*.ts`.
- **Dependencias**: T003, T011.
- **Criterios de Aceptación**: Solo accesible para roles `ADMIN`/`STAFF`, permite actualizar stock y cambiar estado de pedidos.
- **Tests**: Pruebas de autorización RBAC y endpoints de gestión.

---

### T014 — Search & Live Autocomplete
- **Objetivo**: Búsqueda global modal accesible desde el header con debounce, sugerencias rápidas de categorías y productos, y página de resultados `/search`.
- **Archivos**: `src/components/common/SearchModal.tsx`, `src/app/(store)/search/page.tsx`.
- **Dependencias**: T005.
- **Criterios de Aceptación**: Búsqueda instantánea con teclado, resultados con resaltado de coincidencia y recomendaciones ante cero resultados.
- **Tests**: Búsqueda con cadenas vacías, coincidencias parciales e inexistentes.

---

### T015 — Customer Reviews & Social Proof
- **Objetivo**: Módulo interactivo de reseñas en PDP con puntuación de estrellas, comentarios de compradores verificados y formulario de envío.
- **Archivos**: `src/components/product/ProductReviews.tsx`, `src/app/api/reviews/route.ts`.
- **Dependencias**: T006.
- **Criterios de Aceptación**: Promedio de calificación recalculado dinámicamente, publicación de opiniones con validación.
- **Tests**: Cálculo de media de rating y validación de texto de reseña.

---

### T016 — SEO & Structured Data (Schema.org)
- **Objetivo**: Integrar metadatos OpenGraph, Twitter Cards, Sitemap dinámico, robots.txt y Schema.org JSON-LD para productos y organización.
- **Archivos**: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/common/ProductJsonLd.tsx`.
- **Dependencias**: T005, T006.
- **Criterios de Aceptación**: Validación en herramientas de Rich Results con tipos `Product`, `Offer` y `AggregateRating`.
- **Tests**: Generación válida de sitemap y JSON-LD.

---

### T017 — Accessibility Audit (WCAG 2.1 AA)
- **Objetivo**: Auditoría y corrección de contraste, navegación por teclado, focus visible, etiquetas semánticas y atributos ARIA en drawers y modales.
- **Archivos**: Todos los componentes en `src/components/`.
- **Dependencias**: T004 - T015.
- **Criterios de Aceptación**: 100% de elementos interactivos alcanzables vía Tab, focus trapping en modales y lectores de pantalla leen estados de carrito.
- **Tests**: Checklist a11y automatizado y manual.

---

### T018 — Security Audit & Hardening
- **Objetivo**: Mitigación de riesgos OWASP Top 10, prevención de CSRF, sanitización de entradas, prevención de IDOR y comprobación de cabeceras seguras.
- **Archivos**: `src/middleware.ts`, `docs/security-audit.md`.
- **Dependencias**: Todos los servicios y APIs.
- **Criterios de Aceptación**: Cero exposición de secretos, endpoints de admin blindados, payloads no permitidos bloqueados por Zod.
- **Tests**: `npm run test:redteam`.

---

### T019 — Performance Optimization & Core Web Vitals
- **Objetivo**: Optimización de imágenes con `next/image`, code splitting, lazy loading de componentes pesados y caché eficiente.
- **Archivos**: `next.config.ts`, optimización de bundles.
- **Dependencias**: T005, T006, T014.
- **Criterios de Aceptación**: LCP < 2.5s, CLS < 0.1, FID/INP óptimo en pruebas de rendimiento.
- **Tests**: Auditoría de bundle y tiempos de respuesta.

---

### T020 — Comprehensive E2E Testing & Release QA
- **Objetivo**: Ejecución de los 10 flujos E2E con Playwright, verificación de toda la suite de pruebas y emisión del reporte final de release.
- **Archivos**: `e2e/*.spec.ts`, `docs/qa-report.md`.
- **Dependencias**: Todas las tareas anteriores.
- **Criterios de Aceptación**: Los 10 flujos Playwright completados con éxito en verde. Aprobación final `READY FOR RELEASE`.
- **Tests**: `npm test` y `npx playwright test`.
