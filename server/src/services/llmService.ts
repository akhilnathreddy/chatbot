import axios from "axios";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateResponse(params: {
  userMessage: string;
  conversationHistory: ChatMessage[];
  longTermMemory: string[];
  userProfile: { name?: string; preferences: string[]; pastTopics: string[] };
  webResults: string;
}): Promise<string> {
  const { userMessage, conversationHistory, longTermMemory, userProfile, webResults } = params;

  const systemInstruction = `You are a helpful AI assistant with memory of past conversations.
Today's date is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
Always use current 2026 information. Never reference outdated information from 2024 or earlier.

## User Profile:
${userProfile.name ? `- Name: ${userProfile.name}` : "- Name: Unknown"}
- Preferences: ${userProfile.preferences.join(", ") || "None recorded"}
- Past Topics: ${userProfile.pastTopics.slice(-5).join(", ") || "None"}

## Long-Term Memory:
${longTermMemory.length > 0 ? longTermMemory.map((m, i) => `${i + 1}. ${m}`).join("\n") : "No relevant past context."}

${webResults ? `## Live Web Results:\n${webResults}\n\nUse these to give accurate up-to-date answers.` : ""}

## Instructions:
- Personalize responses using the user profile and memory
- If web results are provided, cite them
- Be concise but thorough`;

  // Map history to Gemini format (assistant → model)
  const history = conversationHistory.slice(-8).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Add current user message
  const contents = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  // Try models in order of preference
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.0-pro",
  ];

  let lastError: any;

  for (const model of models) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`✅ LLM: using ${model}`);
        return text;
      }
    } catch (err: any) {
      console.warn(`⚠️ Model ${model} failed:`, err?.response?.status);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed");
}
