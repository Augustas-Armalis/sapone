const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email: rawEmail, group = 'waitlist' } = req.body || {}
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  const groupId = group === 'vip'
    ? process.env.MAILERLITE_VIP_GROUP_ID
    : process.env.MAILERLITE_GROUP_ID

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
      return res.status(mlRes.status).json({ error: data.message || 'Subscription failed' })
    }

    // Unique id shared between the browser pixel and the (upcoming) Conversions
    // API call so Meta can deduplicate the Lead. Stored server-side here.
    const eventId = crypto.randomUUID()
    const contentName = group === 'vip' ? 'vip' : 'waitlist'
    console.log('[fb-lead] stored', JSON.stringify({ event_id: eventId, content_name: contentName, email }))

    return res.status(200).json({ success: true, event_id: eventId })
  } catch (err) {
    console.error('MailerLite error:', err.message)
    return res.status(500).json({ error: 'Subscription failed. Please try again.' })
  }
}
