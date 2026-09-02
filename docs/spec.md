# Especificación de Producto y Negocio — PawAtelier

**Versión**: 1.0.0  
**Autor**: Agente 1 — Product Architect  
**Estado**: Aprobado para Construcción  

---

## 1. Visión General del Producto

**PawAtelier** es una boutique online de artículos de autor y bienestar para mascotas (perros, gatos y pequeños animales). Combina la experiencia estética de una revista editorial de diseño con la solidez técnica de un e-commerce DTC de alta gama.

El objetivo central es proporcionar un viaje de compra placentero, transparente y sin fricciones, donde cada interacción (búsqueda, selección de variantes, simulación de flete, cupón, pago seguro y seguimiento) responda con precisión inmediata.

---

## 2. Arquetipos de Usuario

1. **"The Devoted Pet Parent" (Comprador Frecuente)**: Busca nutrición orgánica, camas ortopédicas de lino, arneses ergonómicos y productos de higiene botánicos. Valora el detalle de los ingredientes y la durabilidad de los materiales.
2. **"The Thoughtful Gifter" (Comprador Ocasional / Regalo)**: Busca accesorios exclusivos, kits de cumpleaños para mascotas o suéteres de lana merino. Requiere una experiencia de compra ágil, empaque de regalo y checkout sin fricción como invitado.
3. **"Store Manager / Operations Lead" (Administrador)**: Requiere visibilidad de ventas en tiempo real, control riguroso de inventario por variante, actualización fluida de estados de pedidos y creación de campañas promocionales con cupones.

---

## 3. Catálogo y Taxonomía de Productos

### 3.1 Especies
- **Perros** (Canine Collection)
- **Gatos** (Feline Collection)
- **Pequeños Animales** (Small Companions: conejos, hurones, cobayas)

### 3.2 Categorías de Producto
- **Alimentación & Snacks**: Comida liofilizada, snacks funcionales, premios de salmón salvaje.
- **Paseo & Aventura**: Arneses antitirones de cuero vegano, correas multitensión, collares grabados, portabolsas discretos.
- **Descanso & Hogar**: Camas ortopédicas de espuma viscoelástica, mantas térmicas lavables, rascadores escultóricos para gatos.
- **Juguetes & Enriquecimiento**: Rompecabezas olfativos de madera natural, mordedores de caucho natural, juguetes de hierba gatera orgánica.
- **Higiene & Cuidado**: Champús botánicos con avena coloidal, bálsamos para almohadillas, cepillos de cerdas de bambú.
- **Viaje & Transporte**: Mochilas ergonómicas ventiladas, asientos de seguridad para auto, cuencos plegables de silicona médica.

---

## 4. Requerimientos Funcionales y Reglas de Negocio

### 4.1 Navegación y Home
- **Hero Editorial**: Enfoque tipográfico premium, fotografía de alta definición, claim de marca ("Artículos pensados para el bienestar animal y el hogar moderno"), acceso directo a las novedades y colecciones principales.
- **Explorador Visual de Categorías**: Tarjetas asimétricas con fotografía de producto real y navegación segmentada por especie.
- **Productos Destacados & Trending**: Listado dinámico basado en popularidad y novedades.
- **Social Proof**: Carrusel de testimonios de clientes verificados con imágenes de sus mascotas y puntuación real.
- **Newsletter**: Registro con validación de email y generación instantánea de un cupón de 10% de bienvenida (`BIENVENIDOPAW`).

### 4.2 Catálogo y Búsqueda Facetada (`/shop`)
- **Búsqueda Instantánea**: Búsqueda debounced por nombre, descripción, marca o categoría con autocompletado y vista previa de productos.
- **Filtros Multifactoriales**:
  - Especie (Perros, Gatos, Pequeños animales).
  - Categoría / Tipo de artículo.
  - Rango de precio (slider reactivo o inputs numéricos con validación).
  - Tallas disponibles (XS, S, M, L, XL) o capacidad en kg/litros.
  - Disponibilidad (En stock vs Todos).
  - Marca / Colección artesanal.
- **Ordenamiento**:
  - Relevancia (por defecto).
  - Precio: Menor a Mayor.
  - Precio: Mayor a Menor.
  - Más recientes / Novedades.
  - Mejor calificados (Rating).
- **Quick View**: Modal emergente sin recargar la página para inspeccionar rápidamente la galería, seleccionar variantes y agregar al carrito.

### 4.3 Ficha de Producto (PDP)
- **Galería de Imágenes**: Visualizador con miniaturas verticales, soporte para múltiples ángulos y zoom interactivo.
- **Selector de Variantes**:
  - Matriz de atributos (ej. Color × Talla).
  - Actualización atómica de SKU, precio, precio anterior tachado, porcentaje de descuento y stock disponible en tiempo real.
  - Deshabilitación visual e interactiva de variantes agotadas.
- **Sticky Bar / Acciones de Compra**:
  - Botón "Agregar al carrito" con feedback háptico/visual (microinteracción).
  - Botón "Comprar ahora" que redirige de inmediato al checkout.
  - Botón de Wishlist con toggle de estado guardado.
  - Selector de cantidad con límites de inventario reales (prohibido solicitar más del stock disponible o valores menores a 1).
- **Pestañas de Información Técnica**:
  - Descripción y filosofía del diseño.
  - Materiales y guía de cuidado.
  - Guía de tallas con tabla interactiva de medidas.
  - Envíos y política de devoluciones sin coste (30 días).
- **Sección de Reseñas**:
  - Desglose de puntuación media (1 a 5 estrellas).
  - Listado de opiniones con fecha, autor y badge de "Comprador Verificado".
  - Formulario modal para publicar nueva reseña.
- **Cross-Selling & Recomendaciones**: Productos relacionados y combinaciones sugeridas ("Completa el set").

### 4.4 Carrito de Compras (Mini-Cart & Página Dedicada)
- **Slide-Over Mini-Cart**:
  - Se despliega desde el lateral derecho sin interrumpir la navegación.
  - Barra de progreso para "Envío Gratis" (umbral de $60 USD).
  - Controles de incremento/decremento y eliminación con estado de carga optimista y revalidación en servidor.
- **Página de Carrito (`/cart`)**:
  - Vista expandida de ítems con miniaturas y detalles de variantes.
  - Aplicador de cupones de descuento con validación server-side instantánea.
  - Desglose financiero: Subtotal, Descuento aplicado, Flete estimado, Impuestos estimados y Total final.

### 4.5 Wishlist
- Persistencia dual: LocalStorage para usuarios no registrados, sincronización a base de datos al autenticarse.
- Acción de "Mover todo al carrito" o mover individualmente respetando el stock disponible.

### 4.6 Proceso de Checkout Progresivo (`/checkout`)
- Flujo en acordeón continuo para evitar recargas completas:
  1. **Datos de Contacto**: Email y teléfono (reconocimiento automático si el usuario ya inició sesión).
  2. **Dirección de Envío**: Nombre, dirección, ciudad, código postal, país y notas especiales para el repartidor.
  3. **Método de Envío**:
     - Estándar (3-5 días hábiles): $4.99 (Gratis a partir de $60).
     - Express Courier (24-48 horas): $9.99.
     - Eco-Boutique Delivery (Entrega en franja horaria específica): $12.99.
  4. **Método de Pago**:
     - Stripe Elements en modo test con tarjetas precargadas de prueba (Success, Fondos insuficientes, Fallo 3DS).
     - Validación estricta sin recolección de números de tarjeta en nuestros servidores.
  5. **Resumen y Confirmación**:
     - Verificación final de stock antes de disparar el cargo.
     - Prevención de doble clic mediante bloqueo de botón y clave de idempotencia (`idempotencyKey`).
  6. **Página de Éxito (`/checkout/success/[orderId]`)**:
     - Número de pedido único y legible (ej. `PAW-84920`).
     - Resumen de ítems, dirección de entrega, desglose de costes y timeline inicial de envío.
     - Botón para imprimir / descargar recibo.

### 4.7 Cuenta de Usuario (`/account`)
- **Perfil**: Datos personales y avatar.
- **Historial de Pedidos**: Listado con filtrado por estado, detalles de factura y tracking en vivo.
- **Libreta de Direcciones**: Guardar, editar y marcar dirección de despacho predeterminada.
- **Seguridad**: Cambio de contraseña y cierre de sesión seguro.

### 4.8 Panel de Administración (`/admin`)
- **Control de Acceso**: Exclusivo para roles `ADMIN` y `STAFF`.
- **Dashboard de Métricas**:
  - Ingresos totales brutos y netos.
  - Total de pedidos y volumen de ventas del mes.
  - Ticket promedio de compra.
  - Alertas de productos con stock bajo (< 5 unidades).
- **Módulo de Productos**:
  - Tabla paginada con buscador y filtros por categoría/estado.
  - Formulario de creación/edición: Título, slug, descripción, precio, precio tachado, categoría, marca, especificaciones y matriz de variantes.
  - Subida y ordenación de imágenes.
  - Activar / Desactivar producto del catálogo público.
- **Módulo de Inventario**:
  - Ajuste manual de stock por variante.
  - Registro de auditoría de movimientos (entradas por compra, salidas por pedido, ajustes por rotura).
- **Módulo de Pedidos**:
  - Visualización completa de pedidos con estados: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
  - Acción para cambiar el estado del pedido y actualizar el timeline del cliente.
- **Módulo de Cupones**:
  - Crear cupones con código único (ej. `VERANO20`), tipo de descuento (porcentaje o monto fijo), valor, compra mínima requerida, fecha límite y límite de usos.

---

## 5. Reglas de Negocio Críticas

1. **Precios y Moneda**:
   - Moneda base: USD (`$`).
   - Los precios se almacenan en centavos o con precisión decimal (`Decimal(10, 2)`) para evitar errores de coma flotante.
2. **Cálculo de Envío Gratuito**:
   - Si `Subtotal - Descuentos >= $60.00`, el envío Estándar es de `$0.00`.
3. **Reserva de Stock**:
   - Al confirmar el pago en `/api/checkout`, se decrementa atómicamente el stock dentro de una transacción `prisma.$transaction`.
   - Si algún ítem se queda sin stock durante el checkout, se notifica de inmediato al usuario antes del cobro y se impide la transacción.
4. **Idempotencia de Órdenes**:
   - Cada intento de checkout genera un identificador de idempotencia único en el cliente. Múltiples clicks o reintentos de red no generarán múltiples órdenes ni dobles cobros.

---

## 6. Fuera de Alcance (Out of Scope para v1)

- Marketplace de múltiples vendedores externos (vendedores independientes no gestionan sus tiendas).
- Citas veterinarias presenciales o videoconsultas en vivo.
- Suscripción recurrente con débito automático mensual (planeado para v2).
