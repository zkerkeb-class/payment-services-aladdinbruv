import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

export const handleCreatePaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body; // amount in cents

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'A valid amount is required.' });
  }

  try {
    const result = await paymentService.createPaymentIntent(amount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent.' });
  }
};

export const handleCreateSubscription = async (req: Request, res: Response) => {
  const { email, planType } = req.body;

  if (!email || (typeof email === 'string' && email.trim() === '')) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const result = await paymentService.createSubscription(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription.' });
  }
};