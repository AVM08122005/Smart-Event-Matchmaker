import { matchVendors } from '../../lib/matcher.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { type, budgetMin, budgetMax, location, date, mustHaves } = req.body || {};

  try {
    const result = await matchVendors({
      type: type || '',
      budgetMin: budgetMin !== undefined ? Number(budgetMin) : undefined,
      budgetMax: budgetMax !== undefined ? Number(budgetMax) : undefined,
      location: location || '',
      date: date || '',
      mustHaves: mustHaves || ''
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[api/match] Failed to match vendors', error);
    return res.status(500).json({ ok: false, error: 'Failed to match vendors' });
  }
}

