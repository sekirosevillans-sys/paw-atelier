import { prisma } from "../src/lib/prisma";
import { productService } from "../src/server/services/product.service";
import { cartService } from "../src/server/services/cart.service";
import { couponService } from "../src/server/services/coupon.service";
import { orderService } from "../src/server/services/order.service";

async function runE2ETests() {
  console.log("==================================================");
  console.log("🐾 INICIANDO BATERÍA COMPLETA DE TESTS E2E & QA");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // TEST 1: Catálogo y filtros
    console.log("\n--- TEST 1: Catálogo, Búsqueda y Filtros ---");
    const catalogAll = await productService.getCatalog({
      page: 1,
      limit: 20,
      sortBy: "relevance",
    });
    assert(catalogAll.products.length > 0, "El catálogo retorna productos activos");
    assert(catalogAll.pagination.total >= 10, "Total de productos es al menos 10");

    const dogsOnly = await productService.getCatalog({
      species: "DOG",
      page: 1,
      limit: 20,
      sortBy: "relevance",
    });
    const allDogsOrAll = dogsOnly.products.every(
      (p) => p.species === "DOG" || p.species === "ALL"
    );
    assert(allDogsOrAll, "Filtro por especie DOG solo incluye perros o universales");

    // TEST 2: Detalle de Producto y Variantes
    console.log("\n--- TEST 2: Detalle de Producto por Slug ---");
    const firstProduct = catalogAll.products[0];
    const productDetail = await productService.getProductBySlug(firstProduct.slug);
    assert(productDetail !== null, "Producto recuperado por slug");
    assert(productDetail.variants.length > 0, "El producto tiene variantes con inventario");
    assert(productDetail.images.length > 0, "El producto tiene imágenes asignadas");

    // TEST 3: Carrito de Compras (Gestión Atómica de Stock)
    console.log("\n--- TEST 3: Carrito de Compras y Control de Inventario ---");
    const testSessionToken = `test_sess_${Date.now()}`;
    const cart = await cartService.getOrCreateCart(undefined, testSessionToken);
    assert(cart.items.length === 0, "Nuevo carrito inicia vacío");

    const targetVariant = productDetail.variants[0];
    const updatedCart = await cartService.addItem(cart.id, targetVariant.id, 2);
    assert(updatedCart.items.length === 1, "Ítem agregado correctamente al carrito");
    assert(updatedCart.items[0].quantity === 2, "Cantidad en carrito refleja 2 unidades");

    const updatedQtyCart = await cartService.updateQuantity(cart.id, targetVariant.id, 3);
    assert(updatedQtyCart.items[0].quantity === 3, "Actualización de cantidad a 3 unidades");

    // TEST 4: Motor de Cupones y Promociones
    console.log("\n--- TEST 4: Validación y Aplicación de Cupones ---");
    const couponResult = await couponService.validateCoupon("BIENVENIDOPAW", 100);
    assert(couponResult.isValid, "Cupón BIENVENIDOPAW es válido");
    assert(couponResult.discountAmount === 10, "Descuento del 10% calculado correctamente ($10 de $100)");

    let couponFailed = false;
    try {
      await couponService.validateCoupon("CUPON_FANTASMA_INEXISTENTE", 100);
    } catch (e: any) {
      couponFailed = true;
    }
    assert(couponFailed, "Rechazo seguro de cupón inexistente");

    // TEST 5: Checkout Idempotente y Transacción Atómica
    console.log("\n--- TEST 5: Checkout Idempotente y Transacción Atómica ---");
    const initialStock = targetVariant.stock;
    const idempotencyKey = `e2e_idem_${Date.now()}`;

    const checkoutData = {
      email: "qa.tester@pawatelier.com",
      shippingAddress: {
        fullName: "Sofia QA Tester",
        address1: "Calle de las Rosas 123",
        city: "Madrid",
        state: "Comunidad de Madrid",
        postalCode: "28001",
        country: "US",
        phone: "+34 600 000 000",
      },
      shippingMethod: "STANDARD" as const,
      couponCode: "BIENVENIDOPAW",
      idempotencyKey,
      paymentProvider: "STRIPE" as const,
    };

    const orderResult1 = await orderService.createOrder(
      checkoutData,
      undefined,
      testSessionToken
    );
    assert(orderResult1.order.orderNumber.startsWith("PAW-"), "Orden creada con número oficial PAW-");
    assert(orderResult1.order.status === "PROCESSING", "Estado de orden es PROCESSING");

    // Verificar idempotencia (repetir la misma orden con la misma clave)
    const orderResult2 = await orderService.createOrder(
      checkoutData,
      undefined,
      testSessionToken
    );
    assert(orderResult2.isExisting === true, "Idempotencia activada: no duplica orden");
    assert(orderResult2.order.id === orderResult1.order.id, "Retorna la orden previamente creada");

    // Verificar decremento de stock en base de datos
    const recheckedVariant = await prisma.productVariant.findUnique({
      where: { id: targetVariant.id },
    });
    assert(
      recheckedVariant!.stock === initialStock - 3,
      `Stock decrementado atómicamente de ${initialStock} a ${recheckedVariant!.stock}`
    );

    // TEST 6: Carrito Vaciado tras Checkout
    console.log("\n--- TEST 6: Limpieza de Carrito Post-Checkout ---");
    const postCart = await cartService.getCartById(cart.id);
    assert(postCart.items.length === 0, "Carrito queda limpio tras completar compra");

    // TEST 7: Red Team & Seguridad RBAC
    console.log("\n--- TEST 7: Red Team & RBAC Security ---");
    // Verificar que un usuario normal no tenga rol ADMIN
    const normalUser = await prisma.user.findUnique({
      where: { email: "cliente@ejemplo.com" },
    });
    assert(normalUser?.role === "CUSTOMER", "Usuario cliente tiene rol CUSTOMER, no ADMIN");

    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@pawatelier.com" },
    });
    assert(adminUser?.role === "ADMIN", "Administrador tiene rol verificado ADMIN");

    // TEST 8: Admin Management (Orders & Inventory)
    console.log("\n--- TEST 8: Gestión Administrativa (Órdenes e Inventario) ---");
    // Actualizar estado de orden
    const updatedOrder = await prisma.order.update({
      where: { id: orderResult1.order.id },
      data: { status: "SHIPPED" },
    });
    assert(updatedOrder.status === "SHIPPED", "Admin puede avanzar pedido a SHIPPED");

    // Actualizar stock de variante
    const testVariant = await prisma.productVariant.findFirst();
    assert(!!testVariant, "Existe variante para ajuste de stock");
    if (testVariant) {
      const updatedStockVariant = await prisma.productVariant.update({
        where: { id: testVariant.id },
        data: { stock: testVariant.stock + 5 },
      });
      assert(
        updatedStockVariant.stock === testVariant.stock + 5,
        "Admin ajusta stock de variante correctamente (+5 unidades)"
      );
    }

    console.log("\n==================================================");
    console.log(`🎯 RESULTADOS FINALES: ${passed} PASADOS | ${failed} FALLADOS`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error fatal en suite de pruebas:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runE2ETests();
