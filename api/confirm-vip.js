import Stripe from 'stripe'

export default async function handler(req, res) {
  const { session_id } = req.query
  if (!session_id) return res.status(400).json({ error: 'session_id is required' })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' })
    }

    const email = session.customer_email || session.metadata?.email
    if (!email) return res.status(400).json({ error: 'No email found' })

    // Add to MailerLite VIP group
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        groups: [process.env.MAILERLITE_VIP_GROUP_ID],
      }),
    })

    if (!mlRes.ok) {
      const mlData = await mlRes.json().catch(() => ({}))
      console.error('MailerLite failed:', mlRes.status, JSON.stringify(mlData))
    }

    return res.status(200).json({ success: true, email })
  } catch (err) {
    console.error('confirm-vip error:', err.message)
    return res.status(500).json({ error: 'Failed to confirm payment' })
  }
}
