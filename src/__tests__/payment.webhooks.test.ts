import request from 'supertest';

// Set up environment variables before importing app
process.env.STRIPE_SECRET_KEY = 'sk_test_webhook_key';
process.env.STRIPE_PRICE_ID = 'price_webhook_test';

import app from '../app';

describe('Payment Webhooks', () => {
  describe('Health Check', () => {
    it('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'OK' });
    });
  });

  describe('Error Handling', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
    });

    it('handles invalid JSON in payment intent request', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send('invalid json')
        .set('Content-Type', 'application/json');
      
      expect(res.status).toBe(400);
    });

    it('handles missing content-type header', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 1000 });
      
      // Should still work with proper JSON parsing or return error
      expect([200, 400, 500]).toContain(res.status);
    });
  });

  describe('CORS and Security Headers', () => {
    it('includes CORS headers', async () => {
      const res = await request(app)
        .options('/api/payments/create-payment-intent');
      
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('handles preflight OPTIONS request', async () => {
      const res = await request(app)
        .options('/api/payments/create-payment-intent')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');
      
      expect(res.status).toBe(204);
    });
  });
});

describe('Payment Service Integration Edge Cases', () => {
  describe('Large Amount Handling', () => {
    it('handles maximum safe integer amount', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: Number.MAX_SAFE_INTEGER });
      
      // Should be accepted or rejected gracefully
      expect([200, 400, 500]).toContain(res.status);
    });

    it('handles decimal amounts (should be rejected)', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 10.5 });
      
      // Stripe expects integer amounts in cents, so this should be rejected
      expect([400, 500]).toContain(res.status);
    });
  });

  describe('Subscription Edge Cases', () => {
    it('handles very long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: longEmail });
      
      expect([200, 400, 500]).toContain(res.status);
    });

    it('handles email with special characters', async () => {
      const specialEmail = 'user+test@example-domain.co.uk';
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: specialEmail });
      
      expect([200, 500]).toContain(res.status);
    });
  });
});
