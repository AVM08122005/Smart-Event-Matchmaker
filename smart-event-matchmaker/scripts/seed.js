import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultEmbeddingModel, getOpenAIClient, isOpenAIConfigured } from '../lib/openaiClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const vendorsPath = path.join(rootDir, 'data', 'vendors.json');
const embeddingsPath = path.join(rootDir, 'data', 'vendor_embeddings.json');

async function main() {
  if (!isOpenAIConfigured()) {
    console.error('OPENAI_API_KEY is required to run the seed script. Please set it in your environment.');
    process.exit(1);
  }

  const client = getOpenAIClient();
  const vendors = JSON.parse(fs.readFileSync(vendorsPath, 'utf-8'));
  const embeddings = {};

  console.log(`Seeding embeddings for ${vendors.length} vendors using model ${defaultEmbeddingModel}...`);

  for (const vendor of vendors) {
    const context = `${vendor.name}. Category: ${vendor.category}. Description: ${vendor.description}`;
    const response = await client.embeddings.create({
      model: defaultEmbeddingModel,
      input: context
    });
    embeddings[vendor.id] = response.data[0].embedding;
    console.log(`Embedded ${vendor.name}`);
  }

  const payload = {
    model: defaultEmbeddingModel,
    generatedAt: new Date().toISOString(),
    vendors: embeddings
  };

  fs.writeFileSync(embeddingsPath, JSON.stringify(payload, null, 2));
  console.log(`Embeddings written to ${embeddingsPath}`);
}

main().catch((err) => {
  console.error('Failed to seed vendor embeddings:', err);
  process.exit(1);
});

