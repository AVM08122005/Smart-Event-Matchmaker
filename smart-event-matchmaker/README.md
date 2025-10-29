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

## How to deploy to Vercel

1. Push this repo to GitHub with the provided commit structure.
2. In Vercel, create a new project from the GitHub repo and select the default Next.js preset.
3. (Optional) Add `OPENAI_API_KEY` under Project Settings → Environment Variables for richer matches.
4. Deploy — Vercel will build and host the site automatically.

## Demo video link

Loom (60–90 seconds): _link pending_

## Demo video script

- 0–10s: “Hi Roma — I’m Achintya. I built a quick prototype called Smart Event Matchmaker to show how EventBazaar could use AI to connect planners with vendors.”
- 10–40s: “Enter basic event details: type, budget, city and must-haves. Click ‘Find Vendors’. The app uses text embeddings to compare your event against vendor profiles and returns the top three matches with a confidence score and reason.”
- 40–60s: “This is a demo. Next steps: integrate with EventBazaar’s vendor database, add user accounts, and build an admin panel to surface top vendors and performance metrics. If this looks interesting, I can adapt this prototype directly into EventBazaar’s platform.”
- 60–90s: “Links: Live demo + GitHub in the message. Thanks for your time!”

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

## Sample message to send

“Hi Roma — thank you again for your time. I built a quick prototype inspired by EventBazaar: Smart Event Matchmaker. It recommends the best vendors for a given event using AI-based matching. Here’s the live demo: <LIVE_URL> and GitHub: <GITHUB_URL>. Would love your feedback and I can adapt this to EventBazaar’s real vendor dataset quickly.”

