import express from 'express';
import { body } from 'express-validator';
import {
  getPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  renewSubscription
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const createSubscriptionValidation = [
  body('category').isIn(['anatomic-clinical', 'anatomic', 'clinical', 'forensic', 'cytopathology'])
    .withMessage('Valid category is required'),
  body('plan').isIn(['1m', '3m', '6m', '12m']).withMessage('Valid plan is required'),
  body('paymentMethod').isIn(['card', 'cashapp', 'bank']).withMessage('Valid payment method is required')
];

// Public route
router.get('/plans', getPlans);

// Protected routes
router.get('/current', authenticate, getCurrentSubscription);
router.post('/create', authenticate, createSubscriptionValidation, createSubscription);
router.put('/:id/cancel', authenticate, cancelSubscription);
router.put('/:id/renew', authenticate, renewSubscription);

export default router;




