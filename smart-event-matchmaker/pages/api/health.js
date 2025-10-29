import { getHealthStatus } from '../../lib/matcher.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const status = await getHealthStatus();
    return res.status(200).json({ ok: true, ...status });
  } catch (error) {
    console.error('[api/health] Health check failed', error);
    return res.status(500).json({ ok: false, error: 'Health check failed' });
  }
}

