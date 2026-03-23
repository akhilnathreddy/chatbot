import { CohereClient } from "cohere-ai";

let cohere: CohereClient;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!cohere) {
    if (!process.env.COHERE_API_KEY) throw new Error("COHERE_API_KEY missing");
    cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
  }

  const response = await cohere.embed({
    texts: [text],
    model: "embed-english-v3.0",
    inputType: "search_document",
  });

  const embedding = response.embeddings;
  if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
    return embedding[0] as number[];
  }
  
  // The V2 API endpoint might return a single floating point array inside 'embeddings'
  if (Array.isArray(embedding) && typeof embedding[0] === 'number') {
    return embedding as any as number[];
  }
  
  throw new Error("Unexpected embedding response format");
}
