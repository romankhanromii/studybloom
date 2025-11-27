import express from 'express';
import { body } from 'express-validator';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getCategoryStats
} from '../controllers/questionController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const questionValidation = [
  body('text').trim().notEmpty().withMessage('Question text is required'),
  body('category').isIn(['anatomic', 'clinical', 'forensic', 'cytopathology', 'anatomic-clinical'])
    .withMessage('Valid category is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
  body('options.*.text').trim().notEmpty().withMessage('Option text is required'),
  body('options.*.explanation').trim().notEmpty().withMessage('Option explanation is required'),
  body('options.*.isCorrect').isBoolean().withMessage('isCorrect must be boolean')
];

// Public routes
router.get('/', getQuestions);
router.get('/stats/categories', getCategoryStats);
router.get('/:id', getQuestionById);

// Protected admin routes
router.post('/', authenticate, requireAdmin, questionValidation, createQuestion);
router.put('/:id', authenticate, requireAdmin, questionValidation, updateQuestion);
router.delete('/:id', authenticate, requireAdmin, deleteQuestion);

export default router;




