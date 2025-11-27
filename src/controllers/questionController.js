import Question from '../models/Question.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validationResult } from 'express-validator';

/**
 * @route   GET /api/questions
 * @desc    Get all questions with filters
 */
export const getQuestions = asyncHandler(async (req, res) => {
  const { category, difficulty, page = 1, limit = 50 } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const questions = await Question.find(query)
    .select('-options.isCorrect') // Don't send correct answer in list
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments(query);

  res.json({
    success: true,
    data: {
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * @route   GET /api/questions/:id
 * @desc    Get single question by ID
 */
export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  res.json({
    success: true,
    data: { question }
  });
});

/**
 * @route   POST /api/questions
 * @desc    Create new question (admin only)
 */
export const createQuestion = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const question = await Question.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: { question }
  });
});

/**
 * @route   PUT /api/questions/:id
 * @desc    Update question (admin only)
 */
export const updateQuestion = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const question = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: { question }
  });
});

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete question (admin only)
 */
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  res.json({
    success: true,
    message: 'Question deleted successfully'
  });
});

/**
 * @route   GET /api/questions/stats/categories
 * @desc    Get question count by category
 */
export const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await Question.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.json({
    success: true,
    data: { stats }
  });
});


