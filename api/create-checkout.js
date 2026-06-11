import Stripe from 'stripe'

// Add an email to a MailerLite group. Never throws — VIP capture must not
// block checkout, so failures are logged and swallowed.
async function addToMailerLiteGroup(email, groupId) {
  if (!email || !groupId) return
  try {
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ email, groups: [groupId] }),
    })
    if (!mlRes.ok) {
      const data = await mlRes.json().catch(() => ({}))
      console.error('MailerLite VIP capture failed:', mlRes.status, JSON.stringify(data))
    }
  } catch (err) {
    console.error('MailerLite VIP capture error:', err.message)
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email: rawEmail } = req.body || {}
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Capture the VIP signup instantly — before payment — so we keep the lead
    // even if the user abandons Stripe checkout. Runs in parallel with the
    // session creation and never blocks it.
    const [session] = await Promise.all([
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 100,
              product_data: { name: 'Sapone VIP Early Access' },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.SITE_URL || 'https://www.sapone.store'}/vip-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_URL || 'https://www.sapone.store'}/`,
        metadata: { email },
      }),
      addToMailerLiteGroup(email, process.env.MAILERLITE_VIP_GROUP_ID),
    ])

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err.message)
    return res.status(500).json({ error: 'Failed to create checkout session', detail: err.message })
  }
}
