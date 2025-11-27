import ExamAttempt from '../models/ExamAttempt.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validationResult } from 'express-validator';

/**
 * @route   POST /api/exam/answer
 * @desc    Submit answer for a question
 */
export const submitAnswer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { questionId, selectedAnswer, timeSpent = 0 } = req.body;
  const userId = req.user._id;

  // Get question to verify answer
  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found'
    });
  }

  // Find correct answer
  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = correctOption?.text === selectedAnswer;

  // Create exam attempt
  const attempt = await ExamAttempt.create({
    userId,
    questionId,
    selectedAnswer,
    isCorrect,
    timeSpent
  });

  // Update user progress
  await updateUserProgress(userId, question.category, isCorrect, timeSpent);

  res.status(201).json({
    success: true,
    message: 'Answer submitted successfully',
    data: {
      attempt: {
        _id: attempt._id,
        isCorrect,
        correctAnswer: correctOption?.text,
        explanation: correctOption?.explanation
      }
    }
  });
});

/**
 * @route   GET /api/exam/attempts
 * @desc    Get user's exam attempts
 */
export const getAttempts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, questionId } = req.query;
  const userId = req.user._id;

  const query = { userId };
  if (questionId) query.questionId = questionId;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const attempts = await ExamAttempt.find(query)
    .populate('questionId', 'text category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ExamAttempt.countDocuments(query);

  res.json({
    success: true,
    data: {
      attempts,
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
 * Helper function to update user progress
 */
const updateUserProgress = async (userId, category, isCorrect, timeSpent) => {
  let progress = await UserProgress.findOne({ userId });

  if (!progress) {
    progress = await UserProgress.create({ userId });
  }

  // Update totals
  progress.totalQuestionsAnswered += 1;
  if (isCorrect) {
    progress.totalCorrect += 1;
  } else {
    progress.totalIncorrect += 1;
  }
  progress.totalStudyTime += timeSpent;

  // Update category stats
  if (progress.categoryStats[category]) {
    progress.categoryStats[category].answered += 1;
    if (isCorrect) {
      progress.categoryStats[category].correct += 1;
    }
  }

  // Update weekly performance
  const currentWeek = UserProgress.getCurrentWeek();
  const weekIndex = progress.weeklyPerformance.findIndex(w => w.week === currentWeek);

  if (weekIndex >= 0) {
    if (isCorrect) {
      progress.weeklyPerformance[weekIndex].correct += 1;
    } else {
      progress.weeklyPerformance[weekIndex].incorrect += 1;
    }
  } else {
    progress.weeklyPerformance.push({
      week: currentWeek,
      correct: isCorrect ? 1 : 0,
      incorrect: isCorrect ? 0 : 1
    });
  }

  // Update accuracy rate
  progress.updateAccuracyRate();

  await progress.save();
};


