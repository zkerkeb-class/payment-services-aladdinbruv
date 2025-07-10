import Stripe from 'stripe';
import config from '../config';

if (!config.stripeSecretKey) {
  throw new Error("Stripe secret key is not configured!");
}

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a fixed API version
});

/**
 * Creates a new Stripe Payment Intent.
 * @param amount The amount to charge, in the smallest currency unit (e.g., cents for USD).
 * @param currency The currency to charge in (e.g., 'usd').
 */
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // In the latest version of the API, `automatic_payment_methods` is preferred.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return only the client_secret to the frontend.
    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Error creating Payment Intent:", error);
    throw new Error("Failed to create payment intent.");
  }
};

/**
 * Creates a new Stripe Subscription for a user.
 * @param email The user's email, used to create a Stripe Customer.
 */
export const createSubscription = async (email: string) => {
  if (!config.stripePriceId) {
    throw new Error("Stripe Price ID is not configured.");
  }

  try {
    // Step 1: Create or retrieve a Stripe Customer for this user.
    // This is idempotent; if a customer with this email exists, Stripe returns them.
    const customer = await stripe.customers.create({ email });

    // Step 2: Create the Subscription.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: config.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Step 3: Return the client_secret from the subscription's initial payment intent.
    // This is the secret the frontend needs to confirm the first payment.
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription.");
  }
};