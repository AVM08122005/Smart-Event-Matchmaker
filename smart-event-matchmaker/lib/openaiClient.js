import fs from 'fs';
import path from 'path';
import { config as loadEnv } from 'dotenv';
import OpenAI from 'openai';

const envPath = path.join(process.cwd(), '.env.local');
if (process.env.NODE_ENV !== 'production' && fs.existsSync(envPath)) {
  loadEnv({ path: envPath, override: false });
}

const apiKey = process.env.OPENAI_API_KEY;

let client = null;

if (apiKey) {
  client = new OpenAI({ apiKey });
} else {
  console.warn('[openaiClient] OPENAI_API_KEY not found. Falling back to deterministic matching.');
}

export const defaultEmbeddingModel = 'text-embedding-3-small';

export function getOpenAIClient() {
  return client;
}

export function isOpenAIConfigured() {
  return Boolean(client);
}

export function requireOpenAIClient() {
  if (!client) {
    throw new Error('OPENAI_API_KEY is required to use OpenAI features. Please set it in your environment.');
  }
  return client;
}

