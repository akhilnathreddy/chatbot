import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { memoryService } from "../services/memoryService";
import { upsertMemory, queryMemory } from "../services/mongoVectorService";
import { needsRealTimeData, searchWeb, formatSerperResults } from "../services/serperService";
import { generateResponse } from "../services/llmService";
import { userStore } from "../db/userStore";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message, userId: bodyUserId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Resolve session ID
    const session = req.session as any;
    if (!session.userId) session.userId = bodyUserId || uuidv4();
    const sessionId = session.userId;

    // 1. Get or create user profile
    const userProfile = userStore.upsert(sessionId, {});

    // 2. Get short-term memory (conversation history)
    const conversationHistory = memoryService.format(sessionId) as any[];

    // 3. Query Mongo for long-term semantic memory
    const longTermMemory = await queryMemory(sessionId, message);

    // 4. Check if real-time search is needed
    let webResults = "";
    if (needsRealTimeData(message)) {
      const searchResults = await searchWeb(message);
      webResults = formatSerperResults(searchResults);
    }

    // 5. Generate LLM response
    const reply = await generateResponse({
      userMessage: message,
      conversationHistory,
      longTermMemory,
      userProfile,
      webResults,
    });

    // 6. Update short-term memory
    memoryService.add(sessionId, "user", message);
    memoryService.add(sessionId, "assistant", reply);

    // 7. Store in Mongo (async, don't await to keep response fast)
    upsertMemory(sessionId, `User: ${message}\nAssistant: ${reply}`, {
      timestamp: new Date().toISOString(),
      type: "conversation",
    }).catch(console.error);

    // 8. Extract and store topic
    userStore.addTopic(sessionId, message.slice(0, 60));

    return res.json({
      reply,
      sessionId,
      usedWebSearch: !!webResults,
      memoryUsed: longTermMemory.length > 0,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Clear session memory
router.post("/clear", (req: Request, res: Response) => {
  const session = req.session as any;
  if (session.userId) {
    memoryService.clear(session.userId);
  }
  res.json({ success: true });
});

export default router;
