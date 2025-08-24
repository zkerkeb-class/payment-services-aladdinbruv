// Rely on global Jest types via @types/jest
import * as service from '../services/payment.service';

jest.mock('stripe', () => {
  return class StripeMock {
    paymentIntents = { create: jest.fn().mockResolvedValue({ client_secret: 'pi_secret' }) };
    customers = { create: jest.fn().mockResolvedValue({ id: 'cus_123' }) };
    subscriptions = { create: jest.fn().mockResolvedValue({ id: 'sub_123', latest_invoice: { payment_intent: { client_secret: 'si_secret' } } }) };
    constructor() {}
  };
});

describe('PaymentService', () => {
  beforeAll(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.STRIPE_PRICE_ID = 'price_123';
  });

  it('creates payment intent', async () => {
    const res = await service.createPaymentIntent(1000);
    expect(res.clientSecret).toBeDefined();
  });

  it('creates subscription', async () => {
    const res = await service.createSubscription('a@b.com');
    expect(res.subscriptionId).toBeDefined();
    expect(res.clientSecret).toBeDefined();
  });
});


