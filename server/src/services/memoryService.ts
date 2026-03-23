// Stored per session in memory
const sessionMemory = new Map<string, Array<{ role: string; content: string }>>();

const MAX_MESSAGES = 10;

export const memoryService = {
  get(sessionId: string) {
    return sessionMemory.get(sessionId) || [];
  },

  add(sessionId: string, role: "user" | "assistant", content: string) {
    const history = this.get(sessionId);
    history.push({ role, content });

    // Keep only the last MAX_MESSAGES
    if (history.length > MAX_MESSAGES) {
      history.splice(0, history.length - MAX_MESSAGES);
    }

    sessionMemory.set(sessionId, history);
  },

  clear(sessionId: string) {
    sessionMemory.delete(sessionId);
  },

  format(sessionId: string): Array<{ role: string; content: string }> {
    return this.get(sessionId);
  },
};
