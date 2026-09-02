# Guía de Diseño y Dirección de Arte — PawAtelier

**Versión**: 1.0.0  
**Autor**: Agente 3 — UI Art Director  
**Concepto**: "Luxe Canine & Feline Atelier — Editorial Living for Modern Pets"  

---

## 1. Filosofía Visual y Personalidad de Marca

PawAtelier rompe deliberadamente con el diseño genérico de plantillas de IA. No utilizamos fondos degradados violetas ni tarjetas de bordes inflados con sombras pesadas.

La identidad visual está inspirada en:
- Publicaciones editoriales de arquitectura y diseño contemporáneo (*Kinfolk*, *Cereal*).
- Boutiques de lujo artesanal para mascotas europeas y escandinavas.
- Materiales nobles: Lino crudo, cerámica mate, cuero curtido vegetal y madera de roble claro.

El resultado es una atmósfera **cálida, sofisticada, limpia y alegre**, que inspira confianza absoluta para el cuidado y confort de las mascotas.

---

## 2. Paleta Cromática (Tokens Semánticos HSL)

La paleta se apoya en tonos orgánicos de la tierra y la naturaleza:

| Nombre del Token | Valor Hex | Valor HSL | Uso Principal |
|---|---|---|---|
| **Background (Alabaster Cream)** | `#FAF8F5` | `38, 28%, 97%` | Fondo base de la aplicación. Cálido y relajante para la vista. |
| **Foreground (Charcoal Noir)** | `#1C1E21` | `214, 9%, 12%` | Tipografía principal, títulos y botones de alto impacto. |
| **Card & Surface** | `#FFFFFF` | `0, 0%, 100%` | Tarjetas de producto, modales y cajones laterales con bordes tenues. |
| **Primary Brand (Deep Forest Olive)** | `#2B382F` | `136, 14%, 19%` | Identidad de marca, cabeceras de sección, acentos y navegación activa. |
| **Accent (Warm Terracotta Clay)** | `#C55A38` | `15, 56%, 50%` | Badges de descuento, llamadas a la acción secundarias, alertas de oferta. |
| **Warm Amber (Honey)** | `#E5A83B` | `38, 77%, 56%` | Estrellas de puntuación (rating), badges de destacados y alertas suaves. |
| **Muted Slate** | `#66707A` | `210, 9%, 44%` | Textos secundarios, descripciones breves, migas de pan y metadatos. |
| **Border Stone** | `#E5E0D8` | `38, 18%, 87%` | Líneas divisorias sutiles de 1px que aportan estructura editorial sin pesadez. |

---

## 3. Sistema Tipográfico

Combinación equilibrada de tradición editorial y legibilidad digital:

1. **Display & Headings (Serif Editorial)**:
   - Fuente: *Fraunces* / *Playfair Display* / Serif del sistema fallback.
   - Uso: Título del Hero, nombres de colecciones, encabezados H1/H2 destacados y citas de clientes.
   - Efecto: Otorga sofisticación, calidez humana y distinción de marca.
2. **Body & UI Controls (Geometric Sans)**:
   - Fuente: *Plus Jakarta Sans* / *Inter* / Sans-serif geométrica.
   - Uso: Textos de párrafo, botones, inputs de formulario, precios, badges y menús de navegación.
   - Efecto: Máxima legibilidad a cualquier tamaño de pantalla.

---

## 4. Composición de Layout y Espaciado

- **Contenedores y Márgenes**:
  - Ancho máximo central: `max-w-7xl` (`1280px`) con padding responsivo (`px-4 sm:px-6 lg:px-8`).
- **Ritmo Vertical**:
  - Separación entre secciones mayores: `py-16 sm:py-24` para dar respiro al contenido.
  - Separación de tarjetas y módulos: `gap-6` a `gap-8`.
- **Bordes y Sombras**:
  - Bordes tenues: `border border-stone-200/80`.
  - Radios moderados: `rounded-xl` (12px) para tarjetas y `rounded-full` (pills) para badges y botones de acción rápida.
  - Sombras: Extremadamente sutiles (`shadow-sm`, `hover:shadow-md`), evitando halos oscuros o difusos artificiales.

---

## 5. Microinteracciones y Principios de Motion (Framer Motion)

- **Transición de Hover en Tarjetas de Producto**:
  - Al posar el cursor, la imagen principal hace un sutil fade cruzado con la segunda imagen del producto (fotografía de detalle o mascota usándolo).
  - El botón flotante de "Añadir Rápido" o "Quick View" se desliza suavemente desde la base de la tarjeta (`translate-y-0 opacity-100`).
- **Slide-Over del Mini-Cart**:
  - Entrada lateral con curva Bezier fluida (`easeOutQuint`, duración de 250ms).
  - Fondo backdrop con desenfoque ligero (`backdrop-blur-sm bg-black/40`).
- **Accesibilidad y Respeto a Preferencias**:
  - Todas las animaciones responden a la media query `@media (prefers-reduced-motion: reduce)`, desactivando desplazamientos automáticos y manteniendo transiciones instantáneas de opacidad.

---

## 6. Estados de Componentes de Interfaz

1. **Botones**:
   - `Default`: Fondo `#1C1E21`, texto `#FFFFFF`, hover `#2B382F`, active `scale-[0.98]`.
   - `Secondary / Outline`: Fondo transparente, borde `border-stone-300`, hover `bg-stone-100`.
   - `Accent`: Fondo Terracotta `#C55A38`, texto `#FFFFFF`, hover `bg-[#B34E2F]`.
   - `Disabled`: Opacidad 50%, cursor `not-allowed`.
   - `Loading`: Spinner animado manteniendo el ancho fijo del botón para evitar saltos de layout.
2. **Campos de Formulario (Inputs)**:
   - Estado normal: Borde fino piedra, placeholder en tono muted.
   - Estado foco: Anillo sutil (`ring-1 ring-stone-900 border-stone-900`), sin brillos de colores discordantes.
   - Estado error: Borde rojo terracota sutil (`border-red-500`) con mensaje de ayuda debajo.
3. **Empty States**:
   - Ilustración o icono minimalista en tono arena, texto descriptivo y botón de acción claro (ej. "Descubrir Colección Canina" cuando el carrito está vacío).
