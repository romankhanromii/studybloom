import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import questionRoutes from './src/routes/questionRoutes.js';
import examRoutes from './src/routes/examRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import { stripeWebhook } from './src/controllers/paymentsController.js';
import { receivePabblyWebhook } from './src/controllers/pabblyWebhookController.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
// Stripe webhook must be registered BEFORE any body parsers on that route
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Pabbly webhook endpoint (before body parsers if needed, or after if JSON is fine)
// JSON/urlencoded body parsers (safe for all other routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pabbly webhook endpoint
app.post('/api/webhooks/pabbly', receivePabblyWebhook);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);
});

export default app;


