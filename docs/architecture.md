# Arquitectura del Sistema — PawAtelier

**Versión**: 1.0.0  
**Autor**: Agente 4 — Tech Architect  
**Estado**: Especificación de Arquitectura de Producción  

---

## 1. Visión General de la Arquitectura

PawAtelier sigue una arquitectura monolítica modular construida sobre **Next.js 15 (App Router)** y **TypeScript**, aplicando principios de **Clean Architecture** y **Domain-Driven Design (DDD)** simplificado.

El sistema se divide en capas con responsabilidades unidireccionales:

```
[ Cliente / Browser ]
         │
         ▼
[ Next.js App Router (UI Components & Pages) ]
         │
         ▼
[ API Route Handlers / Controllers ]  <─── Validación Zod (Boundaries)
         │
         ▼
[ Domain Services (Business Logic & Transactions) ]
         │
         ▼
[ Repositories (Data Access Layer) ]
         │
         ▼
[ Prisma ORM ] ──► [ PostgreSQL / SQLite Engine ]
```

---

## 2. Estructura de Directorios

```text
paw-atelier/
├── docs/                      # Documentación contractual y reportes QA
│   ├── spec.md
│   ├── clarifications.md
│   ├── architecture.md
│   ├── design.md
│   ├── tasks.md
│   ├── security-audit.md
│   └── qa-report.md
├── prisma/                    # Modelado de base de datos
│   ├── schema.prisma          # Definición de entidades, relaciones e índices
│   └── seed.ts                # Semilla de datos realista para desarrollo
├── public/                    # Activos estáticos, logos, favicon
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (store)/           # Rutas públicas del storefront
│   │   │   ├── page.tsx       # Home editorial
│   │   │   ├── shop/          # Catálogo facetado y búsqueda
│   │   │   ├── products/[slug]/ # Ficha de producto (PDP)
│   │   │   ├── cart/          # Página completa de carrito
│   │   │   ├── wishlist/      # Lista de deseos
│   │   │   ├── checkout/      # Proceso de pago en etapas
│   │   │   └── account/       # Portal del cliente (pedidos, direcciones)
│   │   ├── admin/             # Panel de administración (RBAC: ADMIN/STAFF)
│   │   │   ├── page.tsx       # Dashboard de métricas
│   │   │   ├── products/      # ABM de productos y variantes
│   │   │   ├── inventory/     # Control de stock y kardex
│   │   │   ├── orders/        # Gestión de estados de pedidos
│   │   │   └── coupons/       # Gestor de promociones y cupones
│   │   ├── api/               # API REST / Route Handlers
│   │   │   ├── auth/          # NextAuth handlers
│   │   │   ├── products/      # Catálogo, filtrado y búsqueda
│   │   │   ├── cart/          # Mutaciones y lectura del carrito
│   │   │   ├── checkout/      # Creación de orden e idempotencia
│   │   │   ├── coupons/       # Validación y canje de cupones
│   │   │   ├── webhooks/      # Webhooks de Stripe con firma HMAC
│   │   │   └── admin/         # Endpoints protegidos de administración
│   │   ├── layout.tsx         # Layout raíz con Providers
│   │   └── globals.css        # Variables HSL y estilos globales
│   ├── components/            # Componentes de interfaz de usuario
│   │   ├── ui/                # Primitives shadcn/Radix (Buttons, Inputs, etc.)
│   │   ├── common/            # Header, Footer, AnnouncementBar, QuickView
│   │   ├── product/           # ProductCard, Gallery, VariantSelector, Reviews
│   │   ├── cart/              # MiniCartDrawer, CartItemRow, CouponInput
│   │   ├── checkout/          # AccordionSteps, AddressForm, PaymentBox
│   │   └── admin/             # StatsCards, DataTable, StatusBadge
│   ├── context/               # React Context / Zustand stores (Cart, Wishlist)
│   ├── lib/                   # Clientes externos y utilidades
│   │   ├── prisma.ts          # Singleton cliente de Prisma
│   │   ├── stripe.ts          # Cliente SDK de Stripe y simulador test
│   │   ├── auth.ts            # Configuración de NextAuth
│   │   └── utils.ts           # Funciones de formato de moneda, cn, debounce
│   ├── server/                # Capa de Backend & Dominio
│   │   ├── schemas/           # Esquemas Zod para validación
│   │   ├── services/          # Lógica de negocio (Cart, Order, Payment, etc.)
│   │   └── repositories/      # Acceso a base de datos mediante Prisma
│   └── types/                 # Definiciones de tipos TypeScript globales
├── tests/                     # Suite de pruebas automatizadas
│   ├── unit/                  # Tests unitarios de cálculo y validaciones
│   ├── integration/           # Tests de servicios y persistencia
│   ├── api/                   # Tests de Route Handlers con mocks
│   └── red-team/              # Pruebas de estrés y seguridad
├── e2e/                       # Pruebas End-to-End con Playwright (10 flujos)
├── AGENTS.md                  # Protocolo de agentes
├── package.json
└── tsconfig.json
```

---

## 3. Modelo de Datos y Relaciones (Prisma)

El modelo relacional garantiza integridad y escalabilidad:

- **Users & Auth**: `User`, `Account`, `Session`, `Profile`, `Address` (1:N, soporte para dirección predeterminada).
- **Catálogo & Taxonomía**:
  - `Category` (jerarquía con `parentId` opcional, `slug` indexado).
  - `Brand` (`name`, `slug`, `logoUrl`).
  - `Product` (`title`, `slug`, `description`, `details`, `species`, `featured`, `active`).
  - `ProductVariant` (`sku` UNIQUE, `size`, `color`, `price`, `compareAtPrice`, `stock`).
  - `ProductImage` (`url`, `alt`, `order`, `isMain`).
- **Inventario**: `InventoryMovement` (registro de auditoría: `reason`, `quantityChange`, `createdAt`).
- **Carrito & Wishlist**:
  - `Cart` (`userId?`, `sessionToken?`, `status`).
  - `CartItem` (`cartId`, `productVariantId`, `quantity`).
  - `Wishlist` y `WishlistItem`.
- **Órdenes & Transacciones**:
  - `Order` (`orderNumber` UNIQUE, `userId?`, `status`, `subtotal`, `discountTotal`, `shippingFee`, `taxTotal`, `grandTotal`, `idempotencyKey`).
  - `OrderItem` (`orderId`, `productVariantId`, `title`, `sku`, `price`, `quantity`).
  - `Payment` (`orderId`, `provider` [STRIPE], `paymentIntentId`, `status` [PENDING, PAID, FAILED, REFUNDED, CANCELLED], `rawPayload`).
- **Promociones**: `Coupon` (`code` UNIQUE, `discountType`, `value`, `minSubtotal`, `maxUses`, `usedCount`, `expiresAt`, `isActive`).
- **Social Proof**: `Review` (`productId`, `userId?`, `authorName`, `rating` [1-5], `title`, `comment`, `isVerifiedPurchase`).

---

## 4. Estrategia de Autenticación y Autorización (RBAC)

1. **Sesiones Seguras**: NextAuth con estrategia JWT firmada mediante `NEXTAUTH_SECRET`.
2. **Roles de Usuario**:
   - `CUSTOMER`: Puede comprar, ver su perfil, guardar direcciones y wishlist.
   - `STAFF`: Puede ver pedidos y gestionar inventario.
   - `ADMIN`: Acceso total al catálogo, finanzas, métricas y cupones.
3. **Middleware**:
   - `middleware.ts` intercepta `/admin/*` y valida que el token de sesión contenga el rol `ADMIN` o `STAFF`. En caso contrario, redirige a `/login?unauthorized=true`.
4. **Verificación Server-Side**:
   - Cada Route Handler de administración ejecuta `requireAdmin(req)` directamente sobre la sesión, evitando cualquier bypass de frontend.

---

## 5. Pipeline de Checkout y Pagos

1. **Cliente**: Envía formulario de checkout a `/api/checkout` con `idempotencyKey`.
2. **API Handler**: Valida con `checkoutSchema` de Zod.
3. **OrderService**:
   - Inicia transacción `prisma.$transaction`.
   - Verifica precios vigentes y disponibilidad de stock para cada variante.
   - Aplica cupón de descuento validado.
   - Decrementa el stock en `ProductVariant`.
   - Crea el registro `Order` con estado `PENDING`.
4. **PaymentService**:
   - Genera una sesión de pago o `PaymentIntent` con Stripe en modo test.
   - Devuelve la clave de cliente (`clientSecret`) o URL de confirmación.
5. **Webhook / Confirmación**:
   - Recibe evento `checkout.session.completed` verificado con `STRIPE_WEBHOOK_SECRET`.
   - Actualiza estado del pedido a `PROCESSING` y el pago a `PAID`.
   - Dispara notificación o registro de confirmación.

---

## 6. Observabilidad y Monitoreo de Errores

- Logging estructurado con formato JSON en servidor: timestamps, endpoint, statusCode, errorMessage (sin registrar contraseñas ni datos sensibles de tarjetas).
- Clases de error de dominio bien tipadas: `NotFoundError`, `InsufficientStockError`, `InvalidCouponError`, `UnauthorizedError`, `PaymentError`.
