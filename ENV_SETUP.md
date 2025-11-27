# Environment Setup Instructions

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection (REQUIRED)
MONGO_URI=mongodb://localhost:27017/studybloom

# JWT Secret (REQUIRED for authentication)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:8080

# Stripe Payment Configuration (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_live_or_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Note: STRIPE_PUBLISHABLE_KEY is NOT needed
# This app uses Stripe Checkout (hosted page), not Stripe Elements
# The frontend redirects to Stripe's hosted checkout, so no publishable key is required
```

## Important Notes

1. **JWT_SECRET is REQUIRED** - Without it, you'll get the error: `secretOrPrivateKey must have a value`
2. **Change JWT_SECRET in production** - Use a strong, random secret key
3. **Database name** - The default database name is `studybloom`. Change it in MONGO_URI if needed.
4. **Stripe Configuration**:
   - `STRIPE_SECRET_KEY` (REQUIRED) - Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
   - `STRIPE_WEBHOOK_SECRET` (REQUIRED) - Get this from Stripe Dashboard → Developers → Webhooks → Your endpoint → Signing secret
   - `STRIPE_PUBLISHABLE_KEY` (NOT NEEDED) - This app uses Stripe Checkout hosted pages, not embedded forms
5. **FRONTEND_URL** - Must match your frontend URL for Stripe redirect URLs to work correctly
6. **Webhook Setup**:
   - In Stripe Dashboard, create a webhook endpoint pointing to: `https://your-domain.com/api/stripe/webhook`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Quick Fix

If you're getting the JWT_SECRET error, run:

```bash
echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production >> backend/.env
```

Or manually add it to your `.env` file.
