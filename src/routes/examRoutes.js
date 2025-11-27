import express from 'express';
import { body } from 'express-validator';
import {
  submitAnswer,
  getAttempts
} from '../controllers/examController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireSubscription } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const submitAnswerValidation = [
  body('questionId').isMongoId().withMessage('Valid question ID is required'),
  body('selectedAnswer').trim().notEmpty().withMessage('Selected answer is required'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number')
];

// All routes require authentication and subscription
router.use(authenticate);
router.use(requireSubscription);

router.post('/answer', submitAnswerValidation, submitAnswer);
router.get('/attempts', getAttempts);

export default router;




