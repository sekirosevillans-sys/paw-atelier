# Aclaraciones Técnicas y Decisiones de Negocio — PawAtelier

**Versión**: 1.0.0  
**Autor**: Agente 1 (Product Architect) & Agente 4 (Tech Architect)  
**Estado**: Consensuado y Vigente  

---

## 1. Carritos de Invitados vs. Usuarios Autenticados

- **Problema**: ¿Cómo persistir el carrito cuando un cliente no ha iniciado sesión y luego decide identificarse o registrarse?
- **Resolución**:
  1. Si el usuario no está autenticado, el carrito se gestiona con una cookie segura `paw_cart_id` ligada a un registro de carrito anónimo en la base de datos (o LocalStorage sincronizado).
  2. Al iniciar sesión exitosamente (`signIn`), un hook en el backend ejecuta `CartService.mergeAnonymousCart(userId, anonymousCartId)`.
  3. Si un mismo producto/variante ya existía en el carrito del usuario, se suman las cantidades respetando el límite de stock máximo.

---

## 2. Prevención de Condiciones de Carrera en Inventario (Race Conditions)

- **Problema**: Dos usuarios intentan comprar la última unidad disponible de un producto de forma simultánea.
- **Resolución**:
  - En `/api/checkout`, la creación del pedido y la deducción de inventario se ejecutan dentro de una transacción serializable o atómica con Prisma (`prisma.$transaction`).
  - La consulta de actualización valida: `WHERE id = variantId AND stock >= requestedQuantity`.
  - Si el número de filas afectadas es 0, la transacción se aborta (`rollback`), no se cobra al cliente y la API responde HTTP 409 Conflict con payload estructurado indicando qué ítem se quedó sin existencias.

---

## 3. Idempotencia y Prevención de Cobros Duplicados

- **Problema**: Un usuario hace doble clic en el botón "Pagar Pedido" o sufre una reconexión de red que reenvía el POST de checkout.
- **Resolución**:
  - El frontend genera un UUID v4 (`idempotencyKey`) al montar el paso final de pago.
  - La API verifica si ya existe una orden o un `PaymentIntent` asociado a esa clave en los últimos 15 minutos.
  - Si existe y está en proceso o aprobada, devuelve el resultado existente sin reintentar el cobro ni crear una orden duplicada.
  - El botón de pago en la UI entra en estado `disabled` con spinner inmediatamente al ser presionado.

---

## 4. Política y Lógica de Cupones de Descuento

- **Problema**: ¿Pueden combinarse múltiples cupones? ¿Qué ocurre si un cupón reduce el total por debajo de $0?
- **Resolución**:
  - Solo se permite **un (1) cupón por pedido**.
  - Los cupones se calculan sobre el `subtotal` (antes de impuestos y flete).
  - Si el descuento supera el subtotal, el monto neto de productos queda en `$0.00`, pero los costes de envío aplicables siguen vigentes.
  - Los cupones tienen validación estricta de: fecha de expiración, compra mínima requerida, límite de usos totales y productos excluidos.

---

## 5. Estrategia de Pagos Stripe Test

- **Problema**: La aplicación debe poder probarse tanto en entornos con claves activas de Stripe como en entornos locales o de evaluación sin credenciales externas.
- **Resolución**:
  - Se implementa el flujo oficial con Stripe Checkout / Elements.
  - Si la variable `STRIPE_SECRET_KEY` no está configurada o contiene el placeholder de prueba, el servicio de pago conmuta de manera elegante a un **Simulador de Pagos Test Nativo** que reproduce exactamente los estados (`PAID`, `FAILED`, `PENDING`), permitiendo seleccionar resultados de prueba (Éxito, Fondos Insuficientes, Error 3DS) y generando el recibo oficial con la misma estructura.
  - Esto garantiza cero bloqueos tanto para evaluación local como para despliegue productivo en Vercel/Docker.

---

## 6. Persistencia de Imágenes de Catálogo

- **Problema**: Evitar marcadores de posición rotos (`placeholder.com`) o imágenes genéricas borrosas.
- **Resolución**:
  - Se utiliza una colección curada de URLs fotorrealistas de alta fidelidad desde Unsplash orientada a fotografía de producto y lifestyle de mascotas premium (estudio con fondo neutro, modelos caninos/felinos de raza y mestizos bien cuidados, iluminación cálida).
  - Se configuran los dominios permitidos en `next.config.ts` para permitir la optimización automática con `next/image` (WebP/AVIF, responsive `sizes`, lazy loading).
