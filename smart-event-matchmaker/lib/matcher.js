import fs from 'fs';
import path from 'path';
import { defaultEmbeddingModel, getOpenAIClient, isOpenAIConfigured } from './openaiClient.js';

const vendorsPath = path.join(process.cwd(), 'data', 'vendors.json');
const embeddingsPath = path.join(process.cwd(), 'data', 'vendor_embeddings.json');

let vendorCache = null;
let embeddingCache = null;

function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function getVendors() {
  if (!vendorCache) {
    vendorCache = readJSON(vendorsPath);
  }
  return vendorCache;
}

function cachedEmbeddingDataExists(data) {
  return Boolean(data && data.vendors && Object.keys(data.vendors).length > 0);
}

function writeEmbeddingCache(data) {
  try {
    fs.writeFileSync(embeddingsPath, JSON.stringify(data, null, 2));
    console.log('[matcher] Cached vendor embeddings to data/vendor_embeddings.json');
  } catch (err) {
    console.warn('[matcher] Failed to write vendor embeddings cache:', err.message);
  }
}

export async function computeEmbedding(text) {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OpenAI client not configured. Cannot compute embeddings.');
  }
  const trimmed = text.slice(0, 6000); // prevent overly long inputs
  const response = await client.embeddings.create({
    model: defaultEmbeddingModel,
    input: trimmed
  });
  return response.data[0].embedding;
}

export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < vecA.length; i += 1) {
    const a = vecA[i];
    const b = vecB[i];
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  if (magA === 0 || magB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function overlapsBudget(range = [], min, max) {
  if (!Array.isArray(range) || range.length !== 2) return false;
  const [vendorMin, vendorMax] = range;
  const eventMin = Number.isFinite(min) ? min : vendorMin;
  const eventMax = Number.isFinite(max) ? max : vendorMax;
  return vendorMin <= eventMax && vendorMax >= eventMin;
}

function extractKeywords(eventText, mustHaves = '') {
  const combined = `${eventText} ${mustHaves || ''}`.toLowerCase();
  return combined
    .split(/[^a-z0-9+]+/)
    .map((token) => token.trim())
    .filter((token) => token && token.length > 2);
}

function buildMatchReason({ vendor, keywordsMatched, hasBudgetBonus, hasLocationBonus }) {
  const reasons = [];
  if (hasLocationBonus) {
    reasons.push('local expertise in your event city');
  }
  if (hasBudgetBonus) {
    reasons.push('fits the budget range');
  }
  if (keywordsMatched.length > 0) {
    const preview = keywordsMatched.slice(0, 3).join(', ');
    reasons.push(`covers: ${preview}`);
  }
  if (reasons.length === 0) {
    reasons.push('strong service alignment for your event brief');
  }
  return `Matched because ${reasons.join(' and ')}.`;
}

function normalizeScore(score) {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Number(score.toFixed(1))));
}

function buildEventPrompt(event) {
  const segments = [];
  if (event.type) segments.push(`Event type: ${event.type}`);
  if (event.location) segments.push(`Location: ${event.location}`);
  if (event.budgetMin || event.budgetMax) {
    const minText = Number.isFinite(event.budgetMin) ? event.budgetMin.toLocaleString('en-IN') : 'flexible';
    const maxText = Number.isFinite(event.budgetMax) ? event.budgetMax.toLocaleString('en-IN') : 'flexible';
    segments.push(`Budget range: ${minText} to ${maxText}`);
  }
  if (event.date) segments.push(`Event date: ${event.date}`);
  if (event.mustHaves) segments.push(`Must-haves: ${event.mustHaves}`);
  return segments.join('. ');
}

function fallbackScore(eventText, vendor, eventObj) {
  const keywords = extractKeywords(eventText, eventObj.mustHaves);
  const vendorText = [
    vendor.name,
    vendor.category,
    vendor.description,
    Array.isArray(vendor.tags) ? vendor.tags.join(' ') : ''
  ]
    .join(' ')
    .toLowerCase();

  const keywordMatches = keywords.filter((kw) => vendorText.includes(kw));
  let score = keywordMatches.length * 12;
  let hasBudgetBonus = false;
  let hasLocationBonus = false;

  if (vendor.city && vendor.city.toLowerCase() === (eventObj.location || '').toLowerCase()) {
    score += 12;
    hasLocationBonus = true;
  }

  if (overlapsBudget(vendor.priceRange, eventObj.budgetMin, eventObj.budgetMax)) {
    score += 15;
    hasBudgetBonus = true;
  }

  if (Number.isFinite(vendor.rating)) {
    score += Math.round(vendor.rating * 4);
  }

  const normalized = normalizeScore(score);
  const reason = buildMatchReason({
    vendor,
    keywordsMatched: keywordMatches,
    hasBudgetBonus,
    hasLocationBonus
  });

  return { score: normalized, reason };
}

async function ensureEmbeddingCache(vendors) {
  if (embeddingCache && cachedEmbeddingDataExists(embeddingCache)) {
    return embeddingCache;
  }

  if (fs.existsSync(embeddingsPath)) {
    try {
      const data = readJSON(embeddingsPath);
      if (cachedEmbeddingDataExists(data)) {
        console.log('[matcher] Using cached embeddings from data/vendor_embeddings.json');
        embeddingCache = data;
        return embeddingCache;
      }
    } catch (err) {
      console.warn('[matcher] Failed to parse vendor embeddings cache:', err.message);
    }
  }

  if (!isOpenAIConfigured()) {
    console.warn('[matcher] OPENAI key missing — using fallback scorer');
    return null;
  }

  console.log('[matcher] Cached embeddings unavailable. Computing embeddings (OPENAI key detected).');
  const embeddings = {};
  const client = getOpenAIClient();
  const now = new Date().toISOString();

  for (const vendor of vendors) {
    const context = `${vendor.name}. Category: ${vendor.category}. Description: ${vendor.description}`;
    const response = await client.embeddings.create({
      model: defaultEmbeddingModel,
      input: context
    });
    embeddings[vendor.id] = response.data[0].embedding;
  }

  const cachePayload = {
    model: defaultEmbeddingModel,
    generatedAt: now,
    vendors: embeddings
  };

  writeEmbeddingCache(cachePayload);
  console.log('[matcher] Embeddings computed — consider running npm run seed to persist.');
  embeddingCache = cachePayload;
  return embeddingCache;
}

function scoreVendorWithEmbedding({ vendor, vendorEmbedding, eventEmbedding, eventObj, keywords }) {
  const similarity = cosineSimilarity(eventEmbedding, vendorEmbedding);
  const baseScore = similarity * 100;
  const hasBudgetBonus = overlapsBudget(vendor.priceRange, eventObj.budgetMin, eventObj.budgetMax);
  const hasLocationBonus = vendor.city && vendor.city.toLowerCase() === (eventObj.location || '').toLowerCase();

  let score = baseScore;
  if (hasLocationBonus) score += 10;
  if (hasBudgetBonus) score += 10;

  const vendorText = [
    vendor.name,
    vendor.category,
    vendor.description,
    Array.isArray(vendor.tags) ? vendor.tags.join(' ') : ''
  ]
    .join(' ')
    .toLowerCase();

  const keywordMatches = keywords.filter((kw) => vendorText.includes(kw)).slice(0, 5);
  if (keywordMatches.length > 0) {
    score += Math.min(15, keywordMatches.length * 5);
  }

  const normalizedScore = normalizeScore(score);
  const reason = buildMatchReason({
    vendor,
    keywordsMatched: keywordMatches,
    hasBudgetBonus,
    hasLocationBonus
  });

  return { score: normalizedScore, reason };
}

export async function matchVendors(eventInput) {
  const vendors = getVendors();
  const parseNumber = (value) => {
    if (value === null || value === undefined || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const sanitizedEvent = {
    type: eventInput.type || '',
    budgetMin: parseNumber(eventInput.budgetMin),
    budgetMax: parseNumber(eventInput.budgetMax),
    location: eventInput.location || '',
    date: eventInput.date || '',
    mustHaves: eventInput.mustHaves || ''
  };

  const eventPrompt = buildEventPrompt(sanitizedEvent);
  const keywords = extractKeywords(eventPrompt, sanitizedEvent.mustHaves);

  if (!isOpenAIConfigured()) {
    console.log('[matcher] OPENAI key missing — using fallback scorer');
    const scored = vendors.map((vendor) => {
      const { score, reason } = fallbackScore(eventPrompt, vendor, sanitizedEvent);
      return { vendor, score, reason };
    });
    scored.sort((a, b) => b.score - a.score);
    return {
      ok: true,
      matches: scored.slice(0, 3),
      analytics: buildAnalytics(scored)
    };
  }

  const cache = await ensureEmbeddingCache(vendors);

  if (!cache || !cachedEmbeddingDataExists(cache)) {
    console.log('[matcher] Embedding cache unavailable even after compute attempt. Falling back to deterministic scorer.');
    const scored = vendors.map((vendor) => {
      const { score, reason } = fallbackScore(eventPrompt, vendor, sanitizedEvent);
      return { vendor, score, reason };
    });
    scored.sort((a, b) => b.score - a.score);
    return {
      ok: true,
      matches: scored.slice(0, 3),
      analytics: buildAnalytics(scored)
    };
  }

  const eventEmbedding = await computeEmbedding(eventPrompt);

  const scored = vendors.map((vendor) => {
    const vendorEmbedding = cache.vendors[vendor.id];
    if (!vendorEmbedding) {
      const { score, reason } = fallbackScore(eventPrompt, vendor, sanitizedEvent);
      return { vendor, score, reason };
    }
    const { score, reason } = scoreVendorWithEmbedding({
      vendor,
      vendorEmbedding,
      eventEmbedding,
      eventObj: sanitizedEvent,
      keywords
    });
    return { vendor, score, reason };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    ok: true,
    matches: scored.slice(0, 3),
    analytics: buildAnalytics(scored)
  };
}

function buildAnalytics(scoredList) {
  const total = scoredList.length;
  const top = scoredList.slice(0, 3);
  const avgScore = top.reduce((acc, item) => acc + item.score, 0) / (top.length || 1);
  const distribution = {};

  scoredList.forEach(({ vendor }) => {
    distribution[vendor.category] = (distribution[vendor.category] || 0) + 1;
  });

  return {
    totalVendors: total,
    averageMatchScore: Number(avgScore.toFixed(1)),
    distribution
  };
}

export async function getHealthStatus() {
  const vendorsAvailable = Array.isArray(getVendors()) && getVendors().length > 0;
  return {
    ok: vendorsAvailable,
    vendors: vendorsAvailable ? getVendors().length : 0,
    cachePresent: embeddingCache ? cachedEmbeddingDataExists(embeddingCache) : fs.existsSync(embeddingsPath)
  };
}

