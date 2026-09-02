# 🐾 PawAtelier — E-Commerce Boutique & Mobiliario de Autor para Mascotas

Plataforma de comercio electrónico de alta gama para mascotas, diseñada con una estética editorial cálida, orgánica y moderna (Warm Sand, Deep Olive, Terracotta, Rich Black). Desarrollada con estándares de ingeniería de software senior: Next.js 15, TypeScript estricto, Prisma ORM, NextAuth RBAC, pasarela transaccional de pagos y panel administrativo integral.

> 🌐 **Demo en Vivo Funcional**: [https://struck-testimonials-institutes-capitol.trycloudflare.com](https://struck-testimonials-institutes-capitol.trycloudflare.com)  
> 📦 **Repositorio GitHub**: [https://github.com/sekirosevillans-sys/paw-atelier](https://github.com/sekirosevillans-sys/paw-atelier)

---

## ✨ Características Principales

- **🎨 Identidad Visual & UX Editorial**:
  - Paleta artesanal libre de clichés genéricos de IA.
  - Tipografía editorial serif combinada con sans geométrica moderna.
  - Micro-interacciones sutiles, estados vacíos elegantes y diseño 100% responsivo.

- **📦 Catálogo & Detalle de Producto**:
  - Filtrado facetado reactivo en tiempo real por especie (*Perros*, *Gatos*, *Ambos*), categoría, precio y stock.
  - Galería de imágenes multi-ángulo de alta resolución.
  - Selector dinámico de variantes (tallas, acabados) con actualización instantánea de precios y existencias.
  - Pestañas de materiales nobles, origen artesanal y módulo de opiniones verificadas.

- **🛒 Bolsa de Compras & Cupones**:
  - Carrito persistente con drawer deslizante y vista completa en `/cart`.
  - Barra de progreso interactiva con cálculo hacia **Envío Gratuito**.
  - Validación y aplicación matemática de cupones de descuento (porcentaje o monto fijo).

- **💳 Checkout Idempotente & Transaccional**:
  - Validación con esquemas Zod en cliente y servidor.
  - Clave de idempotencia única para prevenir cobros o pedidos duplicados.
  - Descuento atómico de existencias dentro de transacciones de base de datos (`prisma.$transaction`).
  - Simulación y soporte listo para Stripe Checkout.

- **🛡️ Autenticación & Seguridad RBAC**:
  - Control de acceso por roles (`CUSTOMER`, `STAFF`, `ADMIN`).
  - Protección de rutas en Middleware de Next.js.
  - Hash de contraseñas con bcrypt y botones demo de 1-click para pruebas rápidas.

- **📊 Panel Administrativo Atelier (`/admin`)**:
  - **KPIs en tiempo real**: Facturación acumulada, pedidos totales y alertas de bajo stock.
  - **Gestión de Pedidos**: Control de ciclo de vida (`PENDING` → `PROCESSING` → `SHIPPED` → `DELIVERED`).
  - **Control de Inventario**: Ajuste de stock por variante con persistencia inmediata.
  - **Catálogo de Piezas**: Interruptor de piezas destacadas y modal de creación de nuevos productos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack, SSR/SSG) |
| **Lenguaje** | TypeScript 5 (Strict mode, no `any`) |
| **Estilos** | Tailwind CSS con paleta personalizada |
| **Base de Datos** | SQLite / PostgreSQL Ready vía Prisma ORM |
| **Autenticación** | NextAuth.js con Credentials Provider & RBAC |
| **Validación** | Zod (Schemas cliente y servidor) |
| **Iconografía** | Lucide React |
| **Notificaciones** | Sonner |
| **Testing** | Suite automatizada E2E con TypeScript (`tsx`) |

---

## 🚀 Puesta en Marcha Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/sekirosevillans-sys/paw-atelier.git
cd paw-atelier
npm install
```

### 2. Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

### 3. Base de Datos y Semillero (Seed)
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
# o usando el runner de Windows:
node runner.js
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Pruebas Automatizadas & Verificación E2E

Ejecuta la batería integral de 24 pruebas de extremo a extremo:
```bash
npx tsx tests/e2e-flows.ts
```

Verificación del build de producción:
```bash
npm run build
```

---

## 👤 Cuentas Demo Disponibles

- **Cliente**: `cliente@ejemplo.com` | `Cliente123!`
- **Administrador**: `admin@pawatelier.com` | `Admin123!`

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
