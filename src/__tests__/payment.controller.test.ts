import request from 'supertest';
import app from '../app';

jest.mock('../services/payment.service', () => ({
  createPaymentIntent: jest.fn().mockResolvedValue({ clientSecret: 'pi_secret' }),
  createSubscription: jest.fn().mockResolvedValue({ subscriptionId: 'sub_123', clientSecret: 'si_secret' })
}));

describe('PaymentController', () => {
  it('POST /api/payments/create-payment-intent validates amount', async () => {
    const res = await request(app).post('/api/payments/create-payment-intent').send({ amount: -1 });
    expect(res.status).toBe(400);
  });

  it('POST /api/payments/create-payment-intent OK', async () => {
    const res = await request(app).post('/api/payments/create-payment-intent').send({ amount: 1000 });
    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBeDefined();
  });

  it('POST /api/payments/create-subscription requires email', async () => {
    const res = await request(app).post('/api/payments/create-subscription').send({});
    expect(res.status).toBe(400);
  });
});


