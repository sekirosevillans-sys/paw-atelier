import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de PawAtelier...");

  // Limpiar base de datos si ya contiene registros
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Usuarios Demo
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const staffPassword = await bcrypt.hash("Staff123!", 10);
  const customerPassword = await bcrypt.hash("Cliente123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Valeria Sterling (Atelier Director)",
      email: "admin@pawatelier.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: "Mateo Rossi (Operations & Dispatch)",
      email: "staff@pawatelier.com",
      passwordHash: staffPassword,
      role: "STAFF",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Camila De La Torre",
      email: "cliente@ejemplo.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      addresses: {
        create: {
          fullName: "Camila De La Torre",
          address1: "742 Evergreen Terrace, Apt 4B",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "US",
          phone: "+1 (503) 555-0199",
          isDefault: true,
        },
      },
    },
  });

  console.log("✅ Usuarios demo creados.");

  // 2. Categorías
  const catDescanso = await prisma.category.create({
    data: {
      name: "Descanso & Camas",
      slug: "descanso-y-camas",
      description: "Camas ortopédicas y mantas de lino natural diseñadas para integrarse armónicamente con la decoración de tu hogar.",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catPaseo = await prisma.category.create({
    data: {
      name: "Paseo & Aventura",
      slug: "paseo-y-aventura",
      description: "Arneses ergonómicos antitirones, correas ajustables y collares de cuero vegano con herrajes de latón macizo.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catAlimentacion = await prisma.category.create({
    data: {
      name: "Alimentación Gourmet",
      slug: "alimentacion-gourmet",
      description: "Snacks liofilizados, galletas artesanales horneadas a baja temperatura e ingredientes 100% orgánicos de grado humano.",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catJuguetes = await prisma.category.create({
    data: {
      name: "Juguetes & Enriquecimiento",
      slug: "juguetes-y-enriquecimiento",
      description: "Rompecabezas olfativos, mordedores de caucho natural y juguetes de catnip diseñados por etólogos veterinarios.",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catHigiene = await prisma.category.create({
    data: {
      name: "Higiene & Cuidado Botánico",
      slug: "higiene-y-cuidado-botanico",
      description: "Cosmética limpia para mascotas: fórmulas sin sulfatos, extractos de avena, manzanilla y bálsamos reparadores.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
    },
  });

  const catViaje = await prisma.category.create({
    data: {
      name: "Transporte & Viaje",
      slug: "transporte-y-viaje",
      description: "Bolsos de transporte transpirables aprobados por aerolíneas y accesorios de viaje seguros.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    },
  });

  console.log("✅ Categorías creadas.");

  // 3. Marcas de Autor
  const brandNordic = await prisma.brand.create({
    data: {
      name: "Nordic Paws Studio",
      slug: "nordic-paws-studio",
      description: "Diseño escandinavo minimalista con tejidos reciclados y acabados artesanales.",
    },
  });

  const brandBotanical = await prisma.brand.create({
    data: {
      name: "Atelier Botanique",
      slug: "atelier-botanique",
      description: "Cosmética e higiene natural elaborada en pequeños lotes con ingredientes botánicos certificados.",
    },
  });

  const brandHound = await prisma.brand.create({
    data: {
      name: "Hound & Hearth",
      slug: "hound-and-hearth",
      description: "Accesorios de paseo resistentes, cuero vegano de alta resistencia y herrajes pulidos.",
    },
  });

  const brandWildFeast = await prisma.brand.create({
    data: {
      name: "Wild Feast Organics",
      slug: "wild-feast-organics",
      description: "Nutrición liofilizada de salmón salvaje y superalimentos funcionales.",
    },
  });

  console.log("✅ Marcas de autor creadas.");

  // 4. Productos de Catálogo Detallados
  const productsData = [
    {
      title: "Cama Ortopédica CloudLinen de Espuma Viscoelástica",
      slug: "cama-ortopedica-cloudlinen-espuma-viscoelastica",
      description: "Diseñada para brindar el descanso más reparador a articulaciones cansadas. Funda desenfundable de lino belga prelavado, resistente al agua y lavable a máquina.",
      details: "Núcleo de 10 cm de espuma con memoria ortopédica de alta densidad. Base antideslizante impermeable. Certificado OEKO-TEX libre de sustancias nocivas.",
      species: "DOG",
      categoryId: catDescanso.id,
      brandId: brandNordic.id,
      isFeatured: true,
      variants: [
        { sku: "BED-LINEN-S", title: "Talla S (60x45 cm) / Arena Natural", size: "S", color: "Arena Natural", price: 89.0, compareAtPrice: 110.0, stock: 12 },
        { sku: "BED-LINEN-M", title: "Talla M (85x65 cm) / Arena Natural", size: "M", color: "Arena Natural", price: 125.0, compareAtPrice: 145.0, stock: 18 },
        { sku: "BED-LINEN-L", title: "Talla L (110x85 cm) / Verde Oliva", size: "L", color: "Verde Oliva", price: 165.0, compareAtPrice: 190.0, stock: 8 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1000&q=80", alt: "Cama ortopédica CloudLinen en salón moderno", order: 1, isMain: true },
        { url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80", alt: "Detalle de textura del lino belga", order: 2, isMain: false },
      ],
      attributes: [
        { name: "Material", value: "100% Lino belga y espuma viscoelástica médica" },
        { name: "Cuidado", value: "Funda lavable a máquina a 30°C" },
        { name: "Ideal Para", value: "Perros medianos y séniors con displasia o artritis" },
      ],
    },
    {
      title: "Arnés Antitirones de Cuero Vegano 'AeroWalk'",
      slug: "arnes-antitirones-cuero-vegano-aerowalk",
      description: "Distribución ergonómica de la presión sobre el esternón para paseos sin ahogos ni rozaduras. Forro acolchado transpirable y herrajes inoxidables en oro viejo.",
      details: "4 puntos de ajuste milimétrico para adaptarse al contorno exacto de tu perro. Costuras reforzadas con hilo de grado militar.",
      species: "DOG",
      categoryId: catPaseo.id,
      brandId: brandHound.id,
      isFeatured: true,
      variants: [
        { sku: "HARN-AERO-S-TERRA", title: "Talla S / Terracota", size: "S", color: "Terracota", price: 48.0, compareAtPrice: 58.0, stock: 24 },
        { sku: "HARN-AERO-M-TERRA", title: "Talla M / Terracota", size: "M", color: "Terracota", price: 54.0, compareAtPrice: 65.0, stock: 15 },
        { sku: "HARN-AERO-L-OLIVE", title: "Talla L / Verde Bosque", size: "L", color: "Verde Bosque", price: 59.0, compareAtPrice: 70.0, stock: 10 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80", alt: "Perro luciendo arnés AeroWalk en bosque", order: 1, isMain: true },
        { url: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1000&q=80", alt: "Detalle de herrajes dorados y costuras", order: 2, isMain: false },
      ],
      attributes: [
        { name: "Material", value: "Biothane y Cuero vegano microfibra hidrófugo" },
        { name: "Cierre", value: "Hebilla de aleación ultraligera con seguro" },
        { name: "Garantía", value: "2 años de garantía contra defectos de fabricación" },
      ],
    },
    {
      title: "Snacks Liofilizados de Salmón Salvaje de Alaska",
      slug: "snacks-liofilizados-salmon-salvaje-alaska",
      description: "Monoproteico puro, sin conservantes químicos ni harinas añadidas. La liofilización en frío preserva el 98% de los nutrientes y ácidos grasos Omega-3.",
      details: "Ingrediente único: 100% lomo de salmón salvaje capturado de forma sostenible en aguas de Alaska. Excelente para el brillo del pelaje y salud cardiovascular.",
      species: "ALL",
      categoryId: catAlimentacion.id,
      brandId: brandWildFeast.id,
      isFeatured: true,
      variants: [
        { sku: "SNACK-SALM-100G", title: "Bolsa 100g", size: "100g", color: "Natural", price: 16.5, compareAtPrice: 19.5, stock: 45 },
        { sku: "SNACK-SALM-250G", title: "Bolsa 250g (Ahorro)", size: "250g", color: "Natural", price: 34.0, compareAtPrice: 42.0, stock: 30 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1000&q=80", alt: "Golosinas de salmón en cuenco artesanal", order: 1, isMain: true },
        { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80", alt: "Perro esperando ansiosamente su premio", order: 2, isMain: false },
      ],
      attributes: [
        { name: "Proteína bruta", value: "68% min" },
        { name: "Grasa bruta", value: "14% min" },
        { name: "Apto para", value: "Perros y gatos de todas las edades y razas" },
      ],
    },
    {
      title: "Rascador Escultórico de Roble y Cuerda de Yute 'Svelta'",
      slug: "rascador-escultorico-roble-cuerda-yute-svelta",
      description: "Una pieza de mobiliario contemporáneo pensada para los instintos naturales de tu felino sin desentonar en una sala de estar de diseño.",
      details: "Base sólida de roble europeo certificado FSC con peso lastrado para evitar balanceos. Cuerda de yute natural sin blanquear ni aceites sintéticos.",
      species: "CAT",
      categoryId: catDescanso.id,
      brandId: brandNordic.id,
      isFeatured: true,
      variants: [
        { sku: "SCRATCH-SVELTA-STD", title: "Altura 80 cm / Roble Natural", size: "80 cm", color: "Roble Claro", price: 115.0, compareAtPrice: 135.0, stock: 9 },
        { sku: "SCRATCH-SVELTA-TALL", title: "Altura 110 cm / Roble Oscuro", size: "110 cm", color: "Roble Ahumado", price: 149.0, compareAtPrice: 175.0, stock: 5 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80", alt: "Gato descansando junto al rascador de madera", order: 1, isMain: true },
        { url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80", alt: "Detalle del enrollado de yute natural", order: 2, isMain: false },
      ],
      attributes: [
        { name: "Peso total", value: "8.5 kg (máxima estabilidad)" },
        { name: "Sostenibilidad", value: "Madera FSC y adhesivos no tóxicos a base de agua" },
      ],
    },
    {
      title: "Champú Botánico Calmante de Avena Coloidal y Caléndula",
      slug: "champu-botanico-calmante-avena-calendula",
      description: "Fórmula de pH neutro ultra-delicada desarrollada para pieles sensibles, secas o con tendencia a alergias estacionales. Aroma suave a manzanilla silvestre.",
      details: "Libre de sulfatos, parabenos, siliconas y colorantes artificiales. No irrita los ojos. Enriquecido con provitamina B5 para facilitar el cepillado.",
      species: "ALL",
      categoryId: catHigiene.id,
      brandId: brandBotanical.id,
      isFeatured: false,
      variants: [
        { sku: "SHAMP-BOTANIC-300ML", title: "Frasco Dispensador 300 ml", size: "300 ml", color: "Ámbar", price: 22.0, compareAtPrice: 26.0, stock: 35 },
        { sku: "SHAMP-BOTANIC-500ML", title: "Frasco Recambio 500 ml", size: "500 ml", color: "Ámbar", price: 32.0, compareAtPrice: 38.0, stock: 20 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=80", alt: "Frasco ámbar de champú botánico con flor de caléndula", order: 1, isMain: true },
      ],
      attributes: [
        { name: "pH", value: "6.8 (específico para la epidermis de mascotas)" },
        { name: "Envase", value: "Aluminio 100% reciclable con bomba dosificadora" },
      ],
    },
    {
      title: "Rompecabezas Olfativo Interactivo de Madera 'CogniPaws'",
      slug: "rompecabezas-olfativo-interactivo-madera-cognipaws",
      description: "Estimula la mente de tu perro o gato mediante juegos de búsqueda de premios. Nivel de dificultad progresivo con bloques deslizantes y compuertas giratorias.",
      details: "Diseñado para reducir el aburrimiento, la ansiedad por separación y el ritmo acelerado al comer.",
      species: "ALL",
      categoryId: catJuguetes.id,
      brandId: brandNordic.id,
      isFeatured: false,
      variants: [
        { sku: "TOY-COGNI-L2", title: "Nivel Intermedio (8 Casillas)", size: "Medio", color: "Madera Haya", price: 38.0, compareAtPrice: 45.0, stock: 16 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1000&q=80", alt: "Perro resolviendo el puzzle interactivo de madera", order: 1, isMain: true },
      ],
      attributes: [
        { name: "Seguridad", value: "Bordes pulidos sin astillas y piezas no deglutibles" },
      ],
    },
    {
      title: "Bálsamo Reparador de Almohadillas y Trufa 'NourishPaw'",
      slug: "balsamo-reparador-almohadillas-trufa-nourishpaw",
      description: "Cera 100% comestible y orgánica con manteca de karité, cera de abejas y aceite de coco virgen. Protege contra el asfalto caliente, la sal y la nieve.",
      details: "Absorción rápida sin dejar manchas en alfombras o suelos de madera. Seguro si el animal se lame.",
      species: "ALL",
      categoryId: catHigiene.id,
      brandId: brandBotanical.id,
      isFeatured: false,
      variants: [
        { sku: "BALM-NOURISH-60G", title: "Lata metálica 60g", size: "60g", color: "Natural", price: 14.0, compareAtPrice: 17.0, stock: 50 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80", alt: "Primer plano de pata de perro cuidada y sana", order: 1, isMain: true },
      ],
      attributes: [
        { name: "Ingredientes", value: "Manteca de karité cruda, cera de abejas, caléndula, vitamina E" },
      ],
    },
    {
      title: "Bolso de Transporte Urbano Transpirable 'Voyager'",
      slug: "bolso-transporte-urbano-transpirable-voyager",
      description: "Elegante bolso de viaje para perros pequeños y gatos de hasta 8 kg. Malla de ventilación oculta, correa interior de seguridad y base acolchada extraíble.",
      details: "Aprobado por IATA para transporte en cabina de la mayoría de aerolíneas. Bolsillo exterior para pasaporte y golosinas.",
      species: "DOG",
      categoryId: catViaje.id,
      brandId: brandHound.id,
      isFeatured: true,
      variants: [
        { sku: "BAG-VOY-CANVAS-BEIGE", title: "Lona Encerada / Beige Arena", size: "Hasta 8 kg", color: "Beige Arena", price: 98.0, compareAtPrice: 120.0, stock: 11 },
        { sku: "BAG-VOY-CANVAS-OLIVE", title: "Lona Encerada / Verde Oliva", size: "Hasta 8 kg", color: "Verde Oliva", price: 98.0, compareAtPrice: 120.0, stock: 14 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80", alt: "Cachorro asomando la cabeza de un bolso elegante", order: 1, isMain: true },
      ],
      attributes: [
        { name: "Dimensiones", value: "42 x 25 x 30 cm" },
        { name: "Capacidad", value: "Mascotas de hasta 8 kg" },
      ],
    },
    {
      title: "Manta Térmica de Lana Merino Orgánica 'NordicHygge'",
      slug: "manta-termica-lana-merino-organica-nordichygge",
      description: "Tejida a mano con pura lana merino transpirable que autorregula la temperatura corporal de perros y gatos en cualquier estación del año.",
      details: "Textura ultrasuave hipoalergénica. Perfecta para colocar sobre el sofá, en el coche o como complemento dentro de su cama favorita.",
      species: "ALL",
      categoryId: catDescanso.id,
      brandId: brandNordic.id,
      isFeatured: false,
      variants: [
        { sku: "BLANKET-MERINO-M", title: "Tamaño 90x70 cm / Gris Perla", size: "90x70 cm", color: "Gris Perla", price: 62.0, compareAtPrice: 75.0, stock: 17 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80", alt: "Perro envuelto plácidamente en manta de lana", order: 1, isMain: true },
      ],
      attributes: [
        { name: "Origen", value: "Lana merino de pastoreo ético en Nueva Zelanda" },
      ],
    },
    {
      title: "Túnel de Juego y Descanso de Fieltro Natural para Pequeños Animales",
      slug: "tunel-juego-descanso-fieltro-natural-pequenos-animales",
      description: "Refugio y circuito de exploración seguro para conejos enanos, cobayas y hurones. Material flexible, cálido y libre de colorantes nocivos.",
      details: "Estructura auto-portante con mirador central. Aísla de corrientes de aire y amortigua ruidos externos para reducir el estrés.",
      species: "SMALL_PET",
      categoryId: catJuguetes.id,
      brandId: brandNordic.id,
      isFeatured: false,
      variants: [
        { sku: "TUNNEL-FELT-GREY", title: "Longitud 90 cm / Diámetro 22 cm", size: "90 cm", color: "Gris Ceniza", price: 34.0, compareAtPrice: 40.0, stock: 22 },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80", alt: "Conejo enano explorando túnel de fieltro", order: 1, isMain: true },
      ],
      attributes: [
        { name: "Composición", value: "100% Fieltro de lana compactada" },
        { name: "Apto para", value: "Conejos, hurones y conejillos de indias" },
      ],
    },
  ];

  for (const item of productsData) {
    const { variants, images, attributes, ...prod } = item;
    const createdProduct = await prisma.product.create({
      data: {
        ...prod,
        variants: {
          create: variants,
        },
        images: {
          create: images,
        },
        attributes: {
          create: attributes,
        },
      },
    });

    // Añadir reseña de ejemplo verificada
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        authorName: "Sofía M. & 'Bruno'",
        rating: 5,
        title: "Calidad excepcional, se nota el esmero artesanal",
        comment: "Compré este producto hace tres semanas y la diferencia en confort y acabados respecto a las tiendas convencionales es abismal. Llegó impecablemente empaquetado.",
        isVerified: true,
      },
    });
  }

  console.log("✅ Productos, variantes, atributos y reseñas sembrados.");

  // 5. Cupones Promocionales
  await prisma.coupon.create({
    data: {
      code: "BIENVENIDOPAW",
      discountType: "PERCENTAGE",
      value: 10.0, // 10% de descuento
      minSubtotal: 30.0,
      maxUses: 1000,
      usedCount: 14,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "LUXURY15",
      discountType: "PERCENTAGE",
      value: 15.0, // 15% de descuento
      minSubtotal: 80.0,
      maxUses: 500,
      usedCount: 8,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "VIP20",
      discountType: "FIXED",
      value: 20.0, // $20 de descuento fijo
      minSubtotal: 100.0,
      maxUses: 200,
      usedCount: 5,
      isActive: true,
    },
  });

  console.log("✅ Cupones promocionales sembrados.");

  // 6. Pedido Demo para historial de Camila De La Torre
  const firstVariant = await prisma.productVariant.findFirst({
    where: { sku: "BED-LINEN-M" },
  });

  if (firstVariant) {
    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: "PAW-2026-84920",
        userId: customer.id,
        guestEmail: customer.email,
        status: "PROCESSING",
        subtotal: 125.0,
        discountTotal: 12.5,
        shippingFee: 0.0, // Supera los $60
        taxTotal: 9.0,
        grandTotal: 121.5,
        idempotencyKey: "demo-idempotency-key-001",
        shippingAddress: JSON.stringify({
          fullName: "Camila De La Torre",
          address1: "742 Evergreen Terrace, Apt 4B",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "US",
          phone: "+1 (503) 555-0199",
        }),
        couponCode: "BIENVENIDOPAW",
        notes: "Por favor dejar junto a la puerta principal si no hay nadie.",
        items: {
          create: {
            variantId: firstVariant.id,
            title: firstVariant.title,
            sku: firstVariant.sku,
            price: firstVariant.price,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
          },
        },
        payment: {
          create: {
            provider: "STRIPE",
            paymentIntentId: "pi_test_demo_84920",
            status: "PAID",
            amount: 121.5,
            currency: "USD",
          },
        },
      },
    });

    console.log("✅ Pedido demo histórico creado: " + demoOrder.orderNumber);
  }

  console.log("🎉 Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
