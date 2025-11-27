import UserProgress from '../models/UserProgress.js';
import ExamAttempt from '../models/ExamAttempt.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

/**
 * @route   GET /api/stats/summary
 * @desc    Get user's statistics summary
 */
export const getStatsSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let progress = await UserProgress.findOne({ userId });

  if (!progress) {
    progress = await UserProgress.create({ userId });
  }

  res.json({
    success: true,
    data: {
      totalQuestionsAnswered: progress.totalQuestionsAnswered,
      totalCorrect: progress.totalCorrect,
      totalIncorrect: progress.totalIncorrect,
      accuracyRate: progress.accuracyRate,
      totalStudyTime: progress.totalStudyTime,
      studyTimeHours: Math.round(progress.totalStudyTime / 3600 * 10) / 10
    }
  });
});

/**
 * @route   GET /api/stats/performance
 * @desc    Get performance over time
 */
export const getPerformance = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { weeks = 4 } = req.query;

  const progress = await UserProgress.findOne({ userId });

  if (!progress || !progress.weeklyPerformance.length) {
    return res.json({
      success: true,
      data: { performance: [] }
    });
  }

  // Get last N weeks
  const performance = progress.weeklyPerformance
    .slice(-parseInt(weeks))
    .map(week => ({
      name: `Week ${week.week.split('-')[1]}`,
      correct: week.correct,
      incorrect: week.incorrect
    }));

  res.json({
    success: true,
    data: { performance }
  });
});

/**
 * @route   GET /api/stats/category
 * @desc    Get category breakdown statistics
 */
export const getCategoryStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const progress = await UserProgress.findOne({ userId });

  if (!progress) {
    return res.json({
      success: true,
      data: { categories: [] }
    });
  }

  const categories = Object.entries(progress.categoryStats)
    .filter(([_, stats]) => stats.answered > 0)
    .map(([category, stats]) => {
      const percentage = stats.answered > 0
        ? Math.round((stats.correct / stats.answered) * 100)
        : 0;
      
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
        value: stats.answered,
        correct: stats.correct,
        percentage
      };
    })
    .sort((a, b) => b.value - a.value);

  res.json({
    success: true,
    data: { categories }
  });
});




