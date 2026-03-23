const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ChatResponse {
  reply: string;
  sessionId: string;
  usedWebSearch: boolean;
  memoryUsed: boolean;
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // important for sessions
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to send message");
  }

  return res.json();
}

export async function clearChat(): Promise<void> {
  await fetch(`${BASE_URL}/api/chat/clear`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getUserProfile() {
  const res = await fetch(`${BASE_URL}/api/user/profile`, {
    credentials: "include",
  });
  return res.json();
}
