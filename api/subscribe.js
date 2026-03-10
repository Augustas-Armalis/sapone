export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, group = 'waitlist' } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Email is required' })

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

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('MailerLite error:', err.message)
    return res.status(500).json({ error: 'Subscription failed. Please try again.' })
  }
}
