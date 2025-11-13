# Smart Event Matchmaker

## What is this project

Smart Event Matchmaker is a polished Next.js demo that showcases AI-assisted vendor recommendations for event planners alongside a portfolio-ready landing site. It features a vendor dataset, cached OpenAI embeddings, and a transparent fallback scorer so the UX stays fast even without an API key.

## Local setup

```
# Install
npm install

# Run dev
npm run dev

# Build
npm run build
npm start
```

Create a `.env.local` file if you have an OpenAI API key (optional):

```
# .env.local (example)
OPENAI_API_KEY=sk-xxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## How the matching works (AI & fallback)

- At seed time (`node scripts/seed.js`), vendor descriptions are embedded with `text-embedding-3-small` and cached in `data/vendor_embeddings.json`.
- When `/api/match` receives an event brief it loads cached embeddings, embeds the event prompt, and scores vendors using cosine similarity plus bonuses for budget and city fit.
- If no cache exists but OpenAI is configured, embeddings are computed on the fly and persisted with a log reminder.
- When OpenAI is unavailable entirely, a deterministic keyword and signal-based scorer returns results so the demo always works.



## Scripts

- `node scripts/seed.js` — regenerate and cache vendor embeddings when `OPENAI_API_KEY` is available.

## MongoDB (optional scale-up)

```javascript
// lib/mongo.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function getVendorsCollection() {
  if (!client.topology) {
    await client.connect();
  }
  return client.db('event-matchmaker').collection('vendors');
}

// Example usage inside an API route
// const vendors = await (await getVendorsCollection()).find({}).limit(50).toArray();
```


