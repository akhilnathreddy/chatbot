import { MongoClient, Collection } from "mongodb";
import { getEmbedding } from "./embeddingService";

let client: MongoClient;
let collection: Collection;

export async function initMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is undefined. Check your .env file");
  }
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "chatbot");
  collection = db.collection(process.env.MONGODB_COLLECTION || "memories");
  console.log("✅ MongoDB Atlas connected");
}

export async function upsertMemory(
  userId: string,
  text: string,
  metadata: Record<string, string>
) {
  const embedding = await getEmbedding(text);
  await collection.insertOne({
    userId,
    text,
    embedding,
    ...metadata,
    createdAt: new Date(),
  });
}

export async function queryMemory(
  userId: string,
  query: string,
  topK = 5
): Promise<string[]> {
  const embedding = await getEmbedding(query);

  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: { userId },
        },
      },
      {
        $project: {
          text: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  return results
    .filter((r) => r.score > 0.75) // cosine similarity threshold
    .map((r) => r.text as string);
}
