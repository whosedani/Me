// Vercel Serverless — /api/config
// GET  → returns public config (ca, twitter, community, buy)
// POST → updates config (requires SHA-256 hash matching ADMIN_HASH)

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_HASH = process.env.ADMIN_HASH;

const FIELDS = ['ca', 'twitter', 'community', 'buy'];
const KEY = 'me-site:config';

async function kvGet() {
    const r = await fetch(`${KV_URL}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const data = await r.json();
    if (data.result) {
        try { return JSON.parse(data.result); } catch (_) {}
    }
    return {};
}

async function kvSet(obj) {
    await fetch(`${KV_URL}/set/${KEY}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${KV_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(obj)),
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
        try {
            const config = await kvGet();
            return res.status(200).json(config);
        } catch (e) {
            return res.status(500).json({ error: 'KV read failed' });
        }
    }

    if (req.method === 'POST') {
        const { hash, ...fields } = req.body || {};

        if (!hash || hash !== ADMIN_HASH) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const current = await kvGet();
            const updated = { ...current };
            for (const f of FIELDS) {
                if (fields[f] !== undefined) updated[f] = fields[f];
            }
            await kvSet(updated);
            return res.status(200).json({ ok: true });
        } catch (e) {
            return res.status(500).json({ error: 'KV write failed' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
