import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validationResult } from 'express-validator';

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 */
export const submitContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, subject, message } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully. We\'ll get back to you soon.',
    data: { contactMessage: { _id: contactMessage._id } }
  });
});




