const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51MockStripeSecretKeyForTestingPurposesOnly12345');

// @desc    Create a payment intent for Stripe
// @route   POST /api/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in Rupee / Dollar

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents/paise
            currency: 'inr', // default to INR since user is in Tamil Nadu
            payment_method_types: ['card'],
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
