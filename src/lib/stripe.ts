import Stripe from "stripe";

const isStripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
  !process.env.STRIPE_SECRET_KEY.includes("mock");

export const stripe = isStripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })
  : null;

export interface CreatePaymentIntentParams {
  amount: number; // en centavos
  currency?: string;
  orderNumber: string;
  customerEmail: string;
  idempotencyKey?: string;
}

export async function createPaymentSession(params: CreatePaymentIntentParams) {
  const { amount, currency = "usd", orderNumber, customerEmail, idempotencyKey } = params;

  // Si Stripe no tiene claves reales configuradas, utilizar el simulador de pagos test
  if (!stripe) {
    return {
      isSimulator: true,
      clientSecret: `mock_sec_${orderNumber}_${Date.now()}`,
      paymentIntentId: `pi_mock_${orderNumber}`,
      status: "requires_payment_method",
      amount,
      currency,
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        receipt_email: customerEmail,
        metadata: {
          orderNumber,
        },
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    return {
      isSimulator: false,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount,
      currency,
    };
  } catch (error) {
    console.error("Error creando PaymentIntent en Stripe:", error);
    throw error;
  }
}
