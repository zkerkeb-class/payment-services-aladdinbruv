import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3005, // Use a new port
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePriceId: process.env.STRIPE_PRICE_ID,
};

export default config;