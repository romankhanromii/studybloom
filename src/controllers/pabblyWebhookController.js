import { asyncHandler } from '../middlewares/asyncHandler.js';

/**
 * @route   POST /api/webhooks/pabbly
 * @desc    Receive webhooks from Pabbly Connect
 * @access  Public (webhook endpoint)
 * 
 * This endpoint receives webhooks from Pabbly Connect.
 * You can configure Pabbly to send webhooks to this endpoint.
 */
export const receivePabblyWebhook = asyncHandler(async (req, res) => {
  // Log the incoming webhook data for debugging
  console.log('📥 Pabbly Webhook Received:', {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  // Extract webhook data
  const webhookData = req.body;

  // TODO: Process the webhook data based on your requirements
  // Example: Update subscription, create user, process payment, etc.
  
  // Example processing (customize based on your needs):
  // if (webhookData.event === 'payment.success') {
  //   // Handle successful payment
  // } else if (webhookData.event === 'subscription.created') {
  //   // Handle new subscription
  // }

  // Always respond with 200 to acknowledge receipt
  res.status(200).json({
    success: true,
    message: 'Webhook received successfully',
    timestamp: new Date().toISOString()
  });
});

