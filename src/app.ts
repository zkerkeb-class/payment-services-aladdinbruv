import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payment.routes';

const app = express();

// Middleware
app.use(cors()); // Allow requests from other origins
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/payments', paymentRoutes);

export default app;