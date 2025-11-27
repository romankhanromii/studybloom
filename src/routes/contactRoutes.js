import express from 'express';
import { body } from 'express-validator';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

router.post('/', contactValidation, submitContact);

export default router;




