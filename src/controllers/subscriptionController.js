import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validationResult } from 'express-validator';

// Pricing matrix
const PRICING = {
  'anatomic-clinical': {
    '1m': 159,
    '3m': 399,
    '6m': 699,
    '12m': 1199
  },
  'anatomic': {
    '1m': 99,
    '3m': 249,
    '6m': 449,
    '12m': 799
  },
  'clinical': {
    '1m': 89,
    '3m': 229,
    '6m': 399,
    '12m': 699
  },
  'forensic': {
    '1m': 69,
    '3m': 179,
    '6m': 299,
    '12m': 499
  },
  'cytopathology': {
    '1m': 59,
    '3m': 149,
    '6m': 259,
    '12m': 449
  }
};

/**
 * Calculate end date based on plan
 */
const calculateEndDate = (startDate, plan) => {
  const months = {
    '1m': 1,
    '3m': 3,
    '6m': 6,
    '12m': 12
  };
  
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months[plan]);
  return endDate;
};

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get all available subscription plans
 */
export const getPlans = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { plans: PRICING }
  });
});

/**
 * @route   GET /api/subscriptions/current
 * @desc    Get user's current subscription
 */
export const getCurrentSubscription = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get active subscription
  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
    endDate: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!subscription) {
    return res.json({
      success: true,
      data: { subscription: null, message: 'No active subscription' }
    });
  }

  res.json({
    success: true,
    data: { subscription }
  });
});

/**
 * @route   POST /api/subscriptions/create
 * @desc    Create new subscription
 */
export const createSubscription = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { category, plan, paymentMethod, paymentDetails } = req.body;
  const userId = req.user._id;

  // Validate category and plan
  if (!PRICING[category] || !PRICING[category][plan]) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category or plan'
    });
  }

  const price = PRICING[category][plan];
  const startDate = new Date();
  const endDate = calculateEndDate(startDate, plan);

  // Cancel any existing active subscriptions
  await Subscription.updateMany(
    { userId, status: 'active' },
    { status: 'cancelled' }
  );

  // Create new subscription
  const subscription = await Subscription.create({
    userId,
    category,
    plan,
    price,
    startDate,
    endDate,
    paymentMethod,
    paymentDetails: paymentDetails || {}
  });

  // Update user subscription status
  await User.findByIdAndUpdate(userId, {
    'subscriptionStatus.isActive': true,
    'subscriptionStatus.category': category,
    'subscriptionStatus.plan': plan,
    'subscriptionStatus.startDate': startDate,
    'subscriptionStatus.endDate': endDate,
    'subscriptionStatus.autoRenew': false
  });

  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    data: { subscription }
  });
});

/**
 * @route   PUT /api/subscriptions/:id/cancel
 * @desc    Cancel subscription
 */
export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }

  if (subscription.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  subscription.status = 'cancelled';
  await subscription.save();

  // Update user subscription status
  await User.findByIdAndUpdate(req.user._id, {
    'subscriptionStatus.isActive': false,
    'subscriptionStatus.autoRenew': false
  });

  res.json({
    success: true,
    message: 'Subscription cancelled successfully'
  });
});

/**
 * @route   PUT /api/subscriptions/:id/renew
 * @desc    Renew subscription
 */
export const renewSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }

  if (subscription.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }

  const newStartDate = new Date();
  const newEndDate = calculateEndDate(newStartDate, subscription.plan);

  subscription.startDate = newStartDate;
  subscription.endDate = newEndDate;
  subscription.status = 'active';
  await subscription.save();

  // Update user subscription status
  await User.findByIdAndUpdate(req.user._id, {
    'subscriptionStatus.isActive': true,
    'subscriptionStatus.startDate': newStartDate,
    'subscriptionStatus.endDate': newEndDate
  });

  res.json({
    success: true,
    message: 'Subscription renewed successfully',
    data: { subscription }
  });
});




