import request from 'supertest';

const mockCreatePaymentIntent = jest.fn();
const mockCreateSubscription = jest.fn();

jest.mock('../services/payment.service', () => ({
  createPaymentIntent: mockCreatePaymentIntent,
  createSubscription: mockCreateSubscription
}));

import app from '../app';
import * as paymentService from '../services/payment.service';

describe('PaymentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments/create-payment-intent', () => {
    it('validates amount is required', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A valid amount is required.');
    });

    it('validates amount is positive', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: -1 });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A valid amount is required.');
    });

    it('validates amount is a number', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 'invalid' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A valid amount is required.');
    });

    it('validates amount is not zero', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 0 });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A valid amount is required.');
    });

    it('creates payment intent successfully', async () => {
      mockCreatePaymentIntent.mockResolvedValue({ 
        clientSecret: 'pi_test_123456789_secret_abcdef' 
      });

      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 1000 });
      
      expect(res.status).toBe(200);
      expect(res.body.clientSecret).toBe('pi_test_123456789_secret_abcdef');
      expect(mockCreatePaymentIntent).toHaveBeenCalledWith(1000);
    });

    it('handles service error', async () => {
      mockCreatePaymentIntent.mockRejectedValue(new Error('Payment service error'));

      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({ amount: 1000 });
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to create payment intent.');
    });
  });

  describe('POST /api/payments/create-subscription', () => {
    it('validates email is required', async () => {
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email is required.');
    });

    it('validates email is not empty string', async () => {
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: '' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email is required.');
    });

    it('creates subscription successfully', async () => {
      mockCreateSubscription.mockResolvedValue({
        subscriptionId: 'sub_test123',
        clientSecret: 'pi_subscription_secret'
      });

      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ 
          email: 'test@example.com',
          planType: 'premium' // This parameter is present in the controller but not used
        });
      
      expect(res.status).toBe(200);
      expect(res.body.subscriptionId).toBe('sub_test123');
      expect(res.body.clientSecret).toBe('pi_subscription_secret');
      expect(mockCreateSubscription).toHaveBeenCalledWith('test@example.com');
    });

    it('handles service error', async () => {
      mockCreateSubscription.mockRejectedValue(new Error('Subscription service error'));

      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to create subscription.');
    });

    it('handles valid email with different formats', async () => {
      mockCreateSubscription.mockResolvedValue({
        subscriptionId: 'sub_test456',
        clientSecret: 'pi_subscription_secret_2'
      });

      const testEmails = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org'
      ];

      for (const email of testEmails) {
        const res = await request(app)
          .post('/api/payments/create-subscription')
          .send({ email });
        
        expect(res.status).toBe(200);
        expect(mockCreateSubscription).toHaveBeenCalledWith(email);
      }
    });

    it('handles truthy email that is empty string', async () => {
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: '   ' }); // whitespace string
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email is required.');
    });

    it('handles whitespace-only email', async () => {
      const res = await request(app)
        .post('/api/payments/create-subscription')
        .send({ email: '   ' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email is required.');
    });
  });
});


