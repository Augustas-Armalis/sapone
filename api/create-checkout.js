import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 100,
            product_data: { name: 'Sapone VIP Early Access' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.URL || 'http://localhost:3000'}/vip-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.URL || 'http://localhost:3000'}/`,
      metadata: { email },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err.message)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
