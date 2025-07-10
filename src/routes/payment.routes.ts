import { Router } from 'express';
import { handleCreatePaymentIntent, handleCreateSubscription } from '../controllers/payment.controller';

const router = Router();

router.post('/create-payment-intent', handleCreatePaymentIntent);
router.post('/create-subscription', handleCreateSubscription);

export default router;