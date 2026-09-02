# AGENTS.md — Protocolo de Desarrollo y Gobernanza de Agentes

Bienvenido a **PawAtelier**, una plataforma de e-commerce DTC de artículos y boutique para mascotas, construida con estándares de ingeniería de software de nivel de producción.

Este documento establece las directrices inquebrantables, arquitectura, comandos y responsabilidades de los 17 roles de agentes especializados que colaboran en el repositorio.

---

## 1. Reglas Inquebrantables del Proyecto

1. **TypeScript Estricto**:
   - `strict: true` en `tsconfig.json`.
   - Prohibido terminantemente el uso de `any` salvo excepciones técnicas documentadas con `unknown` + type narrowing.
2. **Validación Exhaustiva en Fronteras (Boundary Validation)**:
   - Todo input externo (HTTP requests, query params, cookies, payloads, webhooks) DEBE ser validado con esquemas Zod antes de ser procesado por el dominio.
   - Jamás confiar en validaciones hechas únicamente en el navegador.
3. **Arquitectura Limpia por Capas (Separation of Concerns)**:
   - **Route Handlers / Controllers**: Únicamente deserializan, validan schema HTTP, llaman al servicio de dominio y serializan la respuesta HTTP.
   - **Domain Services**: Contienen la lógica de negocio pura, reglas de inventario, cálculo de cupones, transacciones financieras e idempotencia.
   - **Repositories**: Encapsulan las operaciones de persistencia mediante Prisma ORM.
   - **Componentes React**: Exclusivamente presentación e interacción de UI. No ejecutar consultas complejas ni lógica de negocio dentro de componentes de UI.
4. **Seguridad Defensiva**:
   - Sanitización de entradas contra XSS e inyecciones.
   - Autenticación robusta y control de acceso basado en roles (RBAC: `CUSTOMER`, `STAFF`, `ADMIN`) verificado obligatoriamente a nivel de servidor.
   - Prevención de IDOR (Insecure Direct Object References): Comprobar que el usuario autenticado es dueño del recurso (carrito, orden, dirección) o tiene privilegios administrativos.
   - Ninguna clave secreta o token privado debe exponerse al frontend o incluir el prefijo `NEXT_PUBLIC_`.
5. **Idempotencia y Manejo Transaccional**:
   - Operaciones críticas como checkout, decremento de stock y cobros deben ser atómicas (`prisma.$transaction`) y soportar cabeceras o claves de idempotencia.
6. **No Regresión y Cobertura de Pruebas**:
   - Cada cambio en carrito, inventario, cupones o checkout debe ser acompañado o validado con tests automatizados.
7. **Diseño Visual de Nivel Editorial**:
   - Prohibido usar estilos genéricos de plantillas de IA (degradados violetas cliché, tarjetas blancas con sombras exageradas, padding desbalanceado).
   - Seguir estrictamente la dirección de arte en `docs/design.md`.

---

## 2. Stack Tecnológico

- **Framework**: Next.js (App Router) + React 19
- **Lenguaje**: TypeScript 5.x
- **Estilos**: Tailwind CSS 3.4 / 4.x + CSS Variables HSL
- **Componentes Base**: Radix UI Primitives + shadcn/ui pattern
- **Animaciones & Motion**: Framer Motion
- **Iconografía**: Lucide React
- **Base de Datos & ORM**: PostgreSQL / SQLite dev fallback + Prisma ORM
- **Validación de Schemas**: Zod
- **Autenticación**: NextAuth.js / Auth.js con sesiones seguras y RBAC
- **Pagos**: Stripe SDK & Stripe Elements (Modo test)
- **Testing**: Vitest, React Testing Library, Playwright (E2E)

---

## 3. Comandos de Desarrollo

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilación de producción
npm run build

# Verificación de tipos y linter
npm run typecheck
npm run lint

# Base de datos
npx prisma generate
npx prisma db push
npm run db:seed

# Batería de pruebas
npm test             # Tests unitarios e integración (Vitest)
npm run test:e2e     # Pruebas End-to-End (Playwright)
npm run test:redteam # Suite de pruebas de seguridad y caos
```

---

## 4. Roles y Responsabilidades de los 17 Agentes

| Agente | Rol | Responsabilidad Clave | Artefacto / Salida |
|---|---|---|---|
| **Agente 1** | Product Architect | Definir alcance, reglas de negocio y criterios de aceptación. | `docs/spec.md` |
| **Agente 2** | UX Researcher | Mapear journeys de usuario, puntos de fricción y experiencia mobile. | `docs/ux.md` |
| **Agente 3** | UI Art Director | Dirección de arte editorial, tipografía, paleta cromática y layout. | `docs/design.md` |
| **Agente 4** | Tech Architect | Arquitectura de software, modelo de datos, APIs y flujo transaccional. | `docs/architecture.md` |
| **Agente 5** | Database Engineer | Modelado relacional Prisma, índices, constraints y seed data creíble. | `prisma/schema.prisma`, `prisma/seed.ts` |
| **Agente 6** | Frontend Engineer | Implementación del storefront, catálogo, PDP, carrito y design system. | `src/app/`, `src/components/` |
| **Agente 7** | Backend Engineer | Route handlers, domain services, repositorios, NextAuth y Stripe. | `src/server/`, `src/app/api/` |
| **Agente 8** | Security Engineer | Auditoría OWASP Top 10, sanitización, prevención CSRF/XSS, RBAC. | `docs/security-audit.md` |
| **Agente 9** | Performance Engineer | Optimización de Core Web Vitals, dynamic imports, caché y Next/Image. | Análisis de bundle y optimización |
| **Agente 10** | Accessibility QA | Validación WCAG 2.1 AA, navegación por teclado, focus states y ARIA. | Checklist a11y en QA report |
| **Agente 11** | API QA | Pruebas de integración para endpoints, códigos HTTP y validaciones Zod. | `tests/api/` |
| **Agente 12** | Database QA | Verificación de integridad referencial, transacciones y constraints. | `tests/db/` |
| **Agente 13** | UI QA | Verificación visual de layouts, estados vacíos/error/loading y responsive. | `tests/ui/` |
| **Agente 14** | E2E QA | Automatización Playwright de los 10 flujos críticos de compra y admin. | `e2e/` |
| **Agente 15** | Red Team QA | Ataques intencionales (race conditions, stock bypass, precios negativos). | `tests/red-team/` |
| **Agente 16** | Code Reviewer | Auditoría de limpieza de código, DRY, SOLID, deuda técnica y types. | Revisión de PR / commit |
| **Agente 17** | Release Manager | Verificación global del checklist de calidad previa al despliegue. | `docs/qa-report.md`, `READY FOR RELEASE` |

---

## 5. Protocolo de Manejo de Errores y Criterio de Release

Ninguna tarea se considera terminada si:
1. `npm run typecheck` arroja errores de tipado.
2. `npm run lint` presenta advertencias o errores bloqueantes.
3. Existen regresiones en las pruebas unitarias, de integración o E2E.
4. Se detectan estados de UI en blanco o excepciones no capturadas.

Al encontrar cualquier falla:
1. Identificar la causa raíz con evidencia.
2. Aplicar corrección quirúrgica.
3. Escribir un test que reproduzca el caso para prevenir regresiones.
4. Re-ejecutar la suite de pruebas completa.
