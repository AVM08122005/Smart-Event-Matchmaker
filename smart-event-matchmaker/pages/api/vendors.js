import { getVendors } from '../../lib/matcher.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const vendors = getVendors();
    return res.status(200).json({ ok: true, vendors });
  } catch (error) {
    console.error('[api/vendors] Failed to load vendors', error);
    return res.status(500).json({ ok: false, error: 'Failed to load vendors' });
  }
}

